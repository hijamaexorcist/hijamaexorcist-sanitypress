import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'site',
	title: 'Site settings',
	type: 'document',
	groups: [
		{ name: 'branding', default: true },
		{ name: 'info' },
		{ name: 'contact' },
		{ name: 'navigation' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'branding',
		}),
		defineField({
			name: 'blurb',
			description: 'Content displayed in the footer',
			type: 'array',
			of: [{ type: 'block', lists: [] }],
			group: 'branding',
		}),
		defineField({
			name: 'logo',
			type: 'logo',
			group: 'branding',
		}),
		defineField({
			name: 'announcements',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'announcement' }] }],
			group: 'info',
		}),
		defineField({
			name: 'copyright',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [{ title: 'Normal', value: 'normal' }],
					lists: [],
				},
			],
			group: 'info',
		}),
		defineField({
			name: 'contact',
			title: 'Clinic contact',
			type: 'object',
			group: 'contact',
			options: { columns: 2 },
			fields: [
				defineField({
					name: 'phone',
					description: 'E.164 preferred, e.g. +15551234567',
					type: 'string',
				}),
				defineField({
					name: 'whatsapp',
					title: 'WhatsApp number',
					description: 'Digits only, country code included (e.g. 15551234567)',
					type: 'string',
				}),
				defineField({
					name: 'whatsappMessage',
					title: 'WhatsApp prefilled message',
					type: 'text',
					rows: 2,
				}),
				defineField({
					name: 'email',
					type: 'email',
				}),
				defineField({
					name: 'city',
					type: 'string',
				}),
				defineField({
					name: 'region',
					description:
						'State, province, or region abbreviation for structured data (e.g. NJ)',
					type: 'string',
				}),
				defineField({
					name: 'serviceArea',
					description: 'e.g. Home visits across Brooklyn',
					type: 'string',
				}),
				defineField({
					name: 'countryCode',
					description: 'ISO country code for structured data (e.g. US, SA, GB)',
					type: 'string',
					initialValue: 'US',
				}),
				defineField({
					name: 'seoDescription',
					title: 'Business description (JSON-LD)',
					type: 'text',
					rows: 3,
				}),
			],
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-action (global)',
			description: 'Typically used in the header and/or footer.',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'navigation',
		}),
		defineField({
			name: 'headerMenu',
			type: 'reference',
			to: [{ type: 'navigation' }],
			group: 'navigation',
		}),
		defineField({
			name: 'footerMenu',
			type: 'reference',
			to: [{ type: 'navigation' }],
			group: 'navigation',
		}),
		defineField({
			name: 'social',
			type: 'reference',
			to: [{ type: 'navigation' }],
			group: 'navigation',
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Site settings',
		}),
	},
})
