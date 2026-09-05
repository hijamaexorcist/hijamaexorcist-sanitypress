import 'server-only'

import { Resend } from 'resend'
import { z } from 'zod'
import { RESEND_TEMPLATES } from './resendTemplates'

export type FormKind = 'appointment' | 'contact'

const baseSchema = z.object({
	name: z.string().trim().min(2).max(100),
	email: z.string().trim().email().max(254),
	gCaptchaResponse: z.string().max(4096).optional().default(''),
	website: z.string().max(200).optional().default(''),
})

const appointmentSchema = baseSchema.extend({
	phone: z.string().trim().min(7).max(30),
	service: z.string().trim().min(2).max(120),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.refine((value) => !Number.isNaN(Date.parse(`${value}T12:00:00Z`))),
	time: z.string().trim().min(2).max(40),
	additionalNotes: z.string().trim().max(1500).optional().default(''),
	preferredContact: z.enum(['email', 'phone']).default('email'),
	consent: z.literal(true),
})

const contactSchema = baseSchema.extend({
	reason: z.string().trim().min(2).max(100),
	message: z.string().trim().min(10).max(3000),
	consent: z.literal(true),
})

type AppointmentSubmission = z.infer<typeof appointmentSchema>
type ContactSubmission = z.infer<typeof contactSchema>
type Submission = AppointmentSubmission | ContactSubmission

const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5
const attempts = new Map<string, number[]>()

export async function handleFormSubmission(request: Request, kind: FormKind) {
	if (!isSameOrigin(request)) {
		return Response.json(
			{ ok: false, message: 'Request origin was not accepted.' },
			{ status: 403 },
		)
	}

	const contentLength = Number(request.headers.get('content-length') || 0)
	if (contentLength > 20_000) {
		return Response.json(
			{ ok: false, message: 'Request is too large.' },
			{ status: 413 },
		)
	}

	const rateLimitKey = `${kind}:${getClientIp(request)}`
	if (!consumeAttempt(rateLimitKey)) {
		return Response.json(
			{
				ok: false,
				message: 'Too many attempts. Please wait a few minutes and try again.',
			},
			{ status: 429 },
		)
	}

	let payload: unknown
	try {
		payload = await request.json()
	} catch {
		return Response.json(
			{ ok: false, message: 'Invalid request.' },
			{ status: 400 },
		)
	}

	const parsed = (
		kind === 'appointment' ? appointmentSchema : contactSchema
	).safeParse(payload)
	if (!parsed.success) {
		return Response.json(
			{
				ok: false,
				message: 'Please check the information and try again.',
			},
			{ status: 422 },
		)
	}

	if (parsed.data.website) {
		return Response.json({ ok: true, reference: createReference(kind) })
	}

	if (!(await verifyRecaptcha(parsed.data.gCaptchaResponse))) {
		return Response.json(
			{
				ok: false,
				message: 'Spam verification failed. Please refresh and try again.',
			},
			{ status: 400 },
		)
	}

	if (!process.env.RESEND_API_KEY) {
		console.error(
			'Form delivery is unavailable: RESEND_API_KEY is not configured.',
		)
		return Response.json(
			{
				ok: false,
				message:
					'Online delivery is temporarily unavailable. Please contact the clinic directly.',
			},
			{ status: 503 },
		)
	}

	const reference = createReference(kind)
	try {
		const confirmationSent = await sendSubmissionEmails(
			kind,
			parsed.data,
			reference,
		)
		return Response.json({ ok: true, reference, confirmationSent })
	} catch (error) {
		console.error('Form delivery failed.', error)
		return Response.json(
			{
				ok: false,
				message:
					'We could not deliver your request. Please contact the clinic directly.',
			},
			{ status: 502 },
		)
	}
}

async function sendSubmissionEmails(
	kind: FormKind,
	submission: Submission,
	reference: string,
) {
	const resend = new Resend(process.env.RESEND_API_KEY)
	const from =
		process.env.RESEND_FROM_EMAIL ||
		'Hijama Exorcist <bookings@hijamaexorcist.com>'
	const clinicEmail =
		process.env.FORM_NOTIFICATION_EMAIL || 'thehijamaexorcist@gmail.com'
	const replyToClinic =
		process.env.RESEND_REPLY_TO_EMAIL || 'bookings@hijamaexorcist.com'
	const appointment =
		kind === 'appointment' ? (submission as AppointmentSubmission) : undefined
	const contact =
		kind === 'contact' ? (submission as ContactSubmission) : undefined

	const clinic =
		kind === 'appointment' && appointment
			? await resend.emails.send(
					{
						from,
						to: clinicEmail,
						replyTo: appointment.email,
						template: {
							id: RESEND_TEMPLATES.appointmentClinic,
							variables: {
								REFERENCE: reference,
								CUSTOMER_NAME: appointment.name,
								USER_EMAIL: appointment.email,
								CUSTOMER_PHONE: appointment.phone,
								PREFERRED_CONTACT: appointment.preferredContact,
								SESSION_NAME: appointment.service,
								PREFERRED_DATE: formatDate(appointment.date),
								PREFERRED_TIME: appointment.time,
								PRACTICAL_NOTES:
									appointment.additionalNotes || 'None provided',
							},
						},
						tags: [
							{ name: 'kind', value: 'appointment' },
							{ name: 'audience', value: 'clinic' },
						],
					},
					{ idempotencyKey: `appointment-clinic/${reference}` },
				)
			: await resend.emails.send(
					{
						from,
						to: clinicEmail,
						replyTo: contact!.email,
						template: {
							id: RESEND_TEMPLATES.enquiryClinic,
							variables: {
								REFERENCE: reference,
								CUSTOMER_NAME: contact!.name,
								USER_EMAIL: contact!.email,
								ENQUIRY_REASON: contact!.reason,
								MESSAGE_BODY: contact!.message,
							},
						},
						tags: [
							{ name: 'kind', value: 'enquiry' },
							{ name: 'audience', value: 'clinic' },
						],
					},
					{ idempotencyKey: `enquiry-clinic/${reference}` },
				)

	if (clinic.error) throw new Error(clinic.error.message)

	const confirmation =
		kind === 'appointment' && appointment
			? await resend.emails.send(
					{
						from,
						to: appointment.email,
						replyTo: replyToClinic,
						template: {
							id: RESEND_TEMPLATES.appointmentConfirmation,
							variables: {
								REFERENCE: reference,
								CUSTOMER_NAME: appointment.name,
								SESSION_NAME: appointment.service,
								PREFERRED_DATE: formatDate(appointment.date),
								PREFERRED_TIME: appointment.time,
							},
						},
						tags: [
							{ name: 'kind', value: 'appointment' },
							{ name: 'audience', value: 'client' },
						],
					},
					{ idempotencyKey: `appointment-confirmation/${reference}` },
				)
			: await resend.emails.send(
					{
						from,
						to: contact!.email,
						replyTo: replyToClinic,
						template: {
							id: RESEND_TEMPLATES.enquiryConfirmation,
							variables: {
								REFERENCE: reference,
								CUSTOMER_NAME: contact!.name,
								ENQUIRY_REASON: contact!.reason.toLowerCase(),
							},
						},
						tags: [
							{ name: 'kind', value: 'enquiry' },
							{ name: 'audience', value: 'client' },
						],
					},
					{ idempotencyKey: `enquiry-confirmation/${reference}` },
				)

	if (confirmation.error) {
		console.error('Customer confirmation email failed.', confirmation.error)
		return false
	}

	return true
}

function createReference(kind: FormKind) {
	const prefix = kind === 'appointment' ? 'HX-A' : 'HX-C'
	const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
	return `${prefix}-${date}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
}

function formatDate(value: string) {
	return new Date(`${value}T12:00:00Z`).toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	})
}

function isSameOrigin(request: Request) {
	const origin = request.headers.get('origin')
	if (!origin) return true
	try {
		const requestHost =
			request.headers.get('x-forwarded-host') ||
			request.headers.get('host') ||
			new URL(request.url).host
		return new URL(origin).host === requestHost
	} catch {
		return false
	}
}

function getClientIp(request: Request) {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
	)
}

function consumeAttempt(key: string) {
	const now = Date.now()
	const recent = (attempts.get(key) || []).filter(
		(timestamp) => now - timestamp < WINDOW_MS,
	)
	if (recent.length >= MAX_ATTEMPTS) return false
	recent.push(now)
	attempts.set(key, recent)
	return true
}

async function verifyRecaptcha(token: string) {
	const secret = process.env.RECAPTCHA_SECRET_KEY
	if (!secret) return true
	if (!token) return false

	try {
		const response = await fetch(
			'https://www.google.com/recaptcha/api/siteverify',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({ secret, response: token }),
				cache: 'no-store',
			},
		)
		const result = (await response.json()) as {
			success?: boolean
			score?: number
		}
		return (
			result.success === true &&
			(result.score === undefined || result.score >= 0.5)
		)
	} catch (error) {
		console.error('reCAPTCHA verification failed.', error)
		return false
	}
}
