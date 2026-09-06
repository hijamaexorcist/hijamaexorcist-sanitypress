import { defineField, defineType } from 'sanity'
import { VscFolder } from 'react-icons/vsc'

export default defineType({
	name: 'product.category',
	title: 'Product category',
	icon: VscFolder,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'displayOrder',
			type: 'number',
			initialValue: 100,
		}),
	],
	orderings: [
		{
			name: 'displayOrder',
			title: 'Display order',
			by: [{ field: 'displayOrder', direction: 'asc' }],
		},
	],
	preview: {
		select: { title: 'title', subtitle: 'slug.current' },
	},
})
