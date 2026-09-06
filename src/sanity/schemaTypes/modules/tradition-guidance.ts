import { defineField, defineType } from 'sanity'
import { VscBook } from 'react-icons/vsc'

export default defineType({
	name: 'tradition-guidance',
	title: 'Tradition guidance',
	type: 'object',
	icon: VscBook,
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
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'quote',
			group: 'content',
			type: 'text',
			rows: 4,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'reference',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'sourceUrl',
			type: 'url',
			validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
			group: 'content',
		}),
		defineField({ name: 'context', type: 'text', rows: 4, group: 'content' }),
		defineField({ name: 'quranNote', type: 'text', rows: 4, group: 'content' }),
		defineField({
			name: 'quranUrl',
			type: 'url',
			validation: (Rule) => Rule.uri({ scheme: ['https'] }),
			group: 'content',
		}),
	],
	preview: { select: { title: 'title', subtitle: 'reference' } },
})
