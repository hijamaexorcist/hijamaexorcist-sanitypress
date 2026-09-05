import 'server-only'

import { Resend } from 'resend'

const CLINIC_INBOX =
	process.env.FORM_NOTIFICATION_EMAIL || 'thehijamaexorcist@gmail.com'
const FROM =
	process.env.RESEND_FROM_EMAIL ||
	'Hijama Exorcist <bookings@hijamaexorcist.com>'

function header(request: Request, name: string) {
	return request.headers.get(name) || ''
}

function isClinicAddress(value: string) {
	const normalized = value.toLowerCase()
	return (
		normalized.includes('bookings@hijamaexorcist.com') ||
		normalized.includes(CLINIC_INBOX.toLowerCase())
	)
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
