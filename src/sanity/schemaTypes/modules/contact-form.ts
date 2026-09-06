import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'contact-form-module',
	title: 'Contact Form',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Form Title',
			type: 'string',
			initialValue: 'Get in Touch',
		}),
		defineField({
			name: 'description',
			title: 'Form Description',
			type: 'text',
			initialValue:
				'Have a question or want to work together? Drop us a message!',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'endpoint',
			title: 'Submission endpoint',
			type: 'string',
			description: 'First-party endpoint used by the Resend contact workflow.',
			initialValue: '/api/forms/contact',
			validation: (Rule) =>
				Rule.required().custom(
					(value) => value === '/api/forms/contact' || 'Use /api/forms/contact',
				),
		}),
		defineField({
			name: 'showRecaptcha',
			title: 'Enable reCAPTCHA?',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'reasonOptions',
			title: 'Form Reasons (Dropdown Options)',
			type: 'array',
			of: [{ type: 'string' }],
			initialValue: ['General Inquiry', 'Partnership', 'Support', 'Feedback'],
			description: 'Defines the options in the "Reason for Contact" dropdown',
		}),

		// Contact Information Section
		defineField({
			name: 'contactInfo',
			title: 'Contact Information',
			type: 'object',
			fields: [
				defineField({
					name: 'heading',
					title: 'Contact Section Heading',
					type: 'string',
					initialValue: 'Contact Information',
				}),
				defineField({
					name: 'email',
					title: 'Email Address',
					type: 'string',
					validation: (Rule) => Rule.email(),
				}),
				defineField({
					name: 'phone',
					title: 'Phone Number',
					type: 'string',
				}),
				defineField({
					name: 'address',
					title: 'Address',
					type: 'text',
					rows: 2,
				}),
			],
		}),

		// Social Links Section
		defineField({
			name: 'socialLinks',
			title: 'Social Media Links',
			type: 'object',
			fields: [
				defineField({
					name: 'heading',
					title: 'Social Section Heading',
					type: 'string',
					initialValue: 'Follow Us',
				}),
				defineField({
					name: 'links',
					title: 'Social Links',
					type: 'array',
					of: [
						{
							type: 'object',
							fields: [
								defineField({
									name: 'platform',
									title: 'Platform',
									type: 'string',
									options: {
										list: [
											{ title: 'Instagram', value: 'instagram' },
											{ title: 'YouTube', value: 'youtube' },
											{ title: 'LinkedIn', value: 'linkedin' },
											{ title: 'Twitter/X', value: 'twitter' },
											{ title: 'Facebook', value: 'facebook' },
											{ title: 'TikTok', value: 'tiktok' },
										],
									},
								}),
								defineField({
									name: 'url',
									title: 'URL',
									type: 'url',
									validation: (Rule) => Rule.required(),
								}),
								defineField({
									name: 'label',
									title: 'Label (optional)',
									type: 'string',
									description: 'Custom label for the link',
								}),
							],
						},
					],
				}),
			],
		}),

		// Form Messages
		defineField({
			name: 'messages',
			title: 'Form Messages',
			type: 'object',
			fields: [
				defineField({
					name: 'success',
					title: 'Success Message',
					type: 'string',
					initialValue:
						"Thank you for your message! We'll get back to you soon.",
				}),
				defineField({
					name: 'error',
					title: 'Error Message',
					type: 'string',
					initialValue: 'Something went wrong. Please try again later.',
				}),
				defineField({
					name: 'submitButton',
					title: 'Submit Button Text',
					type: 'string',
					initialValue: 'Send Message',
				}),
				defineField({
					name: 'submittingButton',
					title: 'Submitting Button Text',
					type: 'string',
					initialValue: 'Sending...',
				}),
			],
		}),
	],
	preview: {
		select: { title: 'title' },
		prepare({ title }) {
			return {
				title: title || 'Contact Form',
				subtitle: 'Module: Contact Form (FormEasy)',
			}
		},
	},
})
