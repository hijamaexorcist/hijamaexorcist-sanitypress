export const RESEND_TEMPLATES = {
	appointmentClinic: 'appointment-clinic',
	appointmentConfirmation: 'appointment-confirmation',
	enquiryClinic: 'enquiry-clinic',
	enquiryConfirmation: 'enquiry-confirmation',
} as const

export type ResendTemplateAlias =
	(typeof RESEND_TEMPLATES)[keyof typeof RESEND_TEMPLATES]
