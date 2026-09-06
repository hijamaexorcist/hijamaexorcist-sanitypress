import 'server-only'

import { Resend } from 'resend'
import {
	CLINIC_FROM_FALLBACK,
	CLINIC_INBOX_FALLBACK,
	isClinicAddress,
} from '@/lib/forms/clinicEmail'

const CLINIC_INBOX =
	process.env.FORM_NOTIFICATION_EMAIL || CLINIC_INBOX_FALLBACK
const FROM = process.env.RESEND_FROM_EMAIL || CLINIC_FROM_FALLBACK

function header(request: Request, name: string) {
	return request.headers.get(name) || ''
}

export async function POST(request: Request) {
	const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
	if (!webhookSecret) {
		return new Response('Webhook is not configured.', { status: 503 })
	}

	const payload = await request.text()
	const resend = new Resend(process.env.RESEND_API_KEY)

	let event
	try {
		event = resend.webhooks.verify({
			payload,
			headers: {
				id: header(request, 'svix-id'),
				timestamp: header(request, 'svix-timestamp'),
				signature: header(request, 'svix-signature'),
			},
			webhookSecret,
		})
	} catch (error) {
		console.error('Resend webhook verification failed.', error)
		return new Response('Invalid signature.', { status: 400 })
	}

	if (event.type !== 'email.received') {
		return new Response('OK', { status: 200 })
	}

	if (isClinicAddress(event.data.from)) {
		return new Response('OK', { status: 200 })
	}

	const { error } = await resend.emails.receiving.forward(
		{
			emailId: event.data.email_id,
			to: CLINIC_INBOX,
			from: FROM,
			passthrough: true,
		},
		{ idempotencyKey: `inbound-forward/${event.data.email_id}` },
	)

	if (error) {
		console.error('Inbound forward failed.', error)
		return new Response('Forward failed.', { status: 500 })
	}

	return new Response('OK', { status: 200 })
}
