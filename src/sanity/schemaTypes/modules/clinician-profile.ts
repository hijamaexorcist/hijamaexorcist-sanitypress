import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscAccount } from 'react-icons/vsc'

export default defineType({
	name: 'clinician-profile',
	title: 'Clinician profile',
	icon: VscAccount,
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),
		defineField({
			name: 'pretitle',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'name',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'role',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'title',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'bio',
			type: 'text',
			rows: 4,
			group: 'content',
		}),
		defineField({
			name: 'bioSecondary',
			title: 'Supporting bio',
			type: 'text',
			rows: 4,
			group: 'content',
		}),
		defineField({
			name: 'portrait',
			type: 'img',
			group: 'content',
		}),
		defineField({
			name: 'instagramUrl',
			title: 'Instagram URL',
			type: 'url',
			validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
			group: 'content',
		}),
		defineField({
			name: 'notes',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
	],
	preview: {
		select: { title: 'name', subtitle: 'role' },
		prepare: ({ title, subtitle }) => ({
			title: title || 'Clinician profile',
			subtitle,
		}),
	},
})
