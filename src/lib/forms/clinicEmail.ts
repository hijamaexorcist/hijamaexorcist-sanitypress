export const CLINIC_PUBLIC_EMAIL = 'hello@hijamaexorcist.com'
export const CLINIC_FROM_FALLBACK = `Hijama Exorcist <${CLINIC_PUBLIC_EMAIL}>`
export const CLINIC_INBOX_FALLBACK = 'thehijamaexorcist@gmail.com'

export function isClinicAddress(value: string) {
	const normalized = value.toLowerCase()
	const inbox = (
		process.env.FORM_NOTIFICATION_EMAIL || CLINIC_INBOX_FALLBACK
	).toLowerCase()

	return (
		normalized.includes(`@hijamaexorcist.com`) ||
		normalized.includes(inbox)
	)
}
