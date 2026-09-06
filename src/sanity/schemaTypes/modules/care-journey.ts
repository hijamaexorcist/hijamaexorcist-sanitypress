import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscListOrdered } from 'react-icons/vsc'

export default defineType({
	name: 'care-journey',
	title: 'Care journey',
	type: 'object',
	icon: VscListOrdered,
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
		defineField({ name: 'pretitle', type: 'string', group: 'content' }),
		defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required(), group: 'content' }),
		defineField({ name: 'description', type: 'text', rows: 3, group: 'content' }),
		defineField({
			name: 'items',
			title: 'Appointment moments',
			type: 'array',
			validation: (Rule) => Rule.required().min(3).max(3),
			group: 'content',
			of: [
				defineArrayMember({
					name: 'moment',
					type: 'object',
					fields: [
						defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
						defineField({ name: 'description', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
					],
					preview: { select: { title: 'title', subtitle: 'description' } },
				}),
			],
		}),
		defineField({ name: 'cta', type: 'cta', group: 'content' }),
	],
	preview: { select: { title: 'title', subtitle: 'description' } },
})
