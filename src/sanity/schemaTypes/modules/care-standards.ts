import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscVerified } from 'react-icons/vsc'

export default defineType({
	name: 'care-standards',
	title: 'Care standards',
	type: 'object',
	icon: VscVerified,
	fields: [
		defineField({ name: 'pretitle', type: 'string' }),
		defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
		defineField({ name: 'description', type: 'text', rows: 3 }),
		defineField({
			name: 'standards',
			type: 'array',
			validation: (Rule) => Rule.required().min(2).max(6),
			of: [
				defineArrayMember({
					name: 'standard',
					type: 'object',
					fields: [
						defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
						defineField({ name: 'description', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
					],
					preview: { select: { title: 'title', subtitle: 'description' } },
				}),
			],
		}),
	],
	preview: { select: { title: 'title', subtitle: 'description' } },
})
