import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscHeart } from 'react-icons/vsc'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'care-benefits',
	title: 'Care benefits',
	type: 'object',
	icon: VscHeart,
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
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'description',
			type: 'text',
			rows: 3,
			group: 'content',
		}),
		defineField({
			name: 'items',
			type: 'array',
			validation: (Rule) => Rule.required().min(4).max(12),
			of: [
				defineArrayMember({
					name: 'benefit',
					type: 'object',
					fields: [
						defineField({
							name: 'title',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'description',
							type: 'text',
							rows: 3,
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: {
						select: { title: 'title', subtitle: 'description' },
					},
				}),
			],
			group: 'content',
		}),
		defineField({
			name: 'disclaimer',
			type: 'text',
			rows: 2,
			description: 'Short complementary-care note under the grid',
			group: 'content',
		}),
	],
	preview: {
		select: { title: 'title', subtitle: 'description' },
		prepare: ({ title, subtitle }) => ({
			title: title || getBlockText(subtitle) || 'Care benefits',
			subtitle: 'Care benefits',
		}),
	},
})
