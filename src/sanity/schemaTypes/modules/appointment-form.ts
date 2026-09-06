import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'appointment-form-module',
	title: 'Appointment Form',
	type: 'object',
	icon: () => '📅',
	fields: [
		// Header Section
		defineField({
			name: 'title',
			title: 'Page Title',
			type: 'string',
			initialValue: 'Book Your Hijama Appointment',
		}),
		defineField({
			name: 'description',
			title: 'Page Description',
			type: 'text',
			initialValue:
				'Schedule your Hijama session with our experienced practitioner',
		}),

		// First-party form delivery
		defineField({
			name: 'endpoint',
			title: 'Submission endpoint',
			type: 'string',
			description: 'First-party endpoint used by the Resend booking workflow.',
			initialValue: '/api/forms/appointment',
			validation: (Rule) =>
				Rule.required().custom(
					(value) =>
						value === '/api/forms/appointment' || 'Use /api/forms/appointment',
				),
		}),
		defineField({
			name: 'showRecaptcha',
			title: 'Enable reCAPTCHA?',
			type: 'boolean',
			initialValue: true,
		}),

		// Service Types
		defineField({
			name: 'serviceTypes',
			title: 'Service Types',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'name',
							title: 'Service Name',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'duration',
							title: 'Duration (minutes)',
							type: 'number',
							validation: (Rule) => Rule.required().min(15),
						}),
						defineField({
							name: 'price',
							title: 'Price',
							type: 'string',
							description: 'e.g., $80, Starting from $60',
						}),
					],
				},
			],
			initialValue: [
				{ name: 'General Hijama Session', duration: 60, price: '$80' },
				{ name: 'Focused Hijama Session', duration: 45, price: '$60' },
				{ name: 'Extended Hijama Session', duration: 90, price: '$120' },
			],
		}),

		// Available Time Slots
		defineField({
			name: 'timeSlots',
			title: 'Available Time Slots',
			type: 'array',
			of: [{ type: 'string' }],
			initialValue: [
				'9:00 AM',
				'10:30 AM',
				'12:00 PM',
				'2:00 PM',
				'3:30 PM',
				'5:00 PM',
				'6:30 PM',
			],
		}),

		// Location Info
		defineField({
			name: 'locationInfo',
			title: 'Location Information',
			type: 'object',
			fields: [
				defineField({
					name: 'address',
					title: 'Address',
					type: 'text',
					initialValue: '1211 South Washington Ave\nPiscataway, NJ 08854',
				}),
				defineField({
					name: 'mapUrl',
					title: 'Google Maps URL (optional)',
					type: 'url',
				}),
			],
		}),

		// Payment Info
		defineField({
			name: 'paymentInfo',
			title: 'Payment Information',
			type: 'object',
			fields: [
				defineField({
					name: 'depositRequired',
					title: 'Deposit Required',
					type: 'boolean',
					initialValue: true,
				}),
				defineField({
					name: 'depositAmount',
					title: 'Deposit Amount',
					type: 'string',
					initialValue: '$25',
				}),
				defineField({
					name: 'paymentMethods',
					title: 'Payment Methods',
					type: 'array',
					of: [
						{
							type: 'object',
							fields: [
								defineField({
									name: 'method',
									title: 'Payment Method',
									type: 'string',
									options: {
										list: ['Zelle', 'Venmo', 'Cash App', 'PayPal'],
									},
								}),
								defineField({
									name: 'recipient',
									title: 'Recipient Name',
									type: 'string',
								}),
								defineField({
									name: 'details',
									title: 'Payment Details',
									type: 'string',
									description: 'Phone number or username',
								}),
							],
						},
					],
					initialValue: [
						{
							method: 'Zelle',
							recipient: 'Muhammad Barlas',
							details: '732-890-5042',
						},
					],
				}),
			],
		}),

		// Prep Instructions
		defineField({
			name: 'prepInstructions',
			title: 'Preparation Instructions',
			type: 'object',
			fields: [
				defineField({
					name: 'title',
					title: 'Section Title',
					type: 'string',
					initialValue: 'Hijama Prep Instructions',
				}),
				defineField({
					name: 'bringItems',
					title: 'What to Bring',
					type: 'array',
					of: [{ type: 'string' }],
					initialValue: [
						'A light snack if you need one afterward',
						'2 full body towels',
						'3 small hand towels',
					],
				}),
				defineField({
					name: 'wearItems',
					title: 'What to Wear',
					type: 'array',
					of: [{ type: 'string' }],
					initialValue: [
						'Loose, comfortable clothing',
						'Clothing that allows easy access to treatment areas',
					],
				}),
				defineField({
					name: 'beforeSession',
					title: 'Before Your Session',
					type: 'array',
					of: [{ type: 'string' }],
					initialValue: [
						'Follow the preparation guidance sent with your appointment confirmation',
						'Come hydrated and avoid a heavy meal just before your visit',
						'Tell us about relevant health conditions, medicines, skin concerns, or pregnancy',
					],
				}),
				defineField({
					name: 'specialNotes',
					title: 'Special Notes',
					type: 'array',
					of: [{ type: 'text' }],
					initialValue: [
						'For head cupping: Hair should be trimmed short or shaved for hygiene',
						'For body areas: Trim or shave hairy areas where cupping will be performed',
					],
				}),
			],
		}),

		// Messages
		defineField({
			name: 'messages',
			title: 'Form Messages',
			type: 'object',
			fields: [
				defineField({
					name: 'success',
					title: 'Success Message',
					type: 'text',
					initialValue:
						"Thank you for booking! We'll confirm your appointment once the deposit is received. Check your email for payment instructions.",
				}),
				defineField({
					name: 'error',
					title: 'Error Message',
					type: 'string',
					initialValue:
						'Something went wrong. Please try again or call us directly.',
				}),
			],
		}),
	],
	preview: {
		select: { title: 'title' },
		prepare({ title }) {
			return {
				title: title || 'Appointment Form',
				subtitle: 'Module: Hijama Appointment Booking',
			}
		},
	},
})
