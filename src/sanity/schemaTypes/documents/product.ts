import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscTag } from 'react-icons/vsc'

export default defineType({
	name: 'product',
	title: 'Product',
	icon: VscTag,
	type: 'document',
	groups: [
		{ name: 'content', default: true },
		{ name: 'options' },
		{ name: 'metadata' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'excerpt',
			type: 'text',
			rows: 3,
			group: 'content',
		}),
		defineField({
			name: 'category',
			type: 'reference',
			to: [{ type: 'product.category' }],
			group: 'content',
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					validation: (Rule) => Rule.required(),
				}),
			],
			description: 'Primary image used on cards. Prefer also filling the gallery.',
			group: 'content',
		}),
		defineField({
			name: 'gallery',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'image',
					options: { hotspot: true },
					fields: [
						defineField({
							name: 'alt',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
					],
				}),
			],
			group: 'content',
		}),
		defineField({
			name: 'price',
			type: 'number',
			description: 'Leave empty to show an enquire note instead of a price',
			group: 'content',
		}),
		defineField({
			name: 'priceNote',
			type: 'string',
			description: 'Shown when no price is set, or under the price',
			group: 'content',
		}),
		defineField({
			name: 'content',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'tags',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			options: { layout: 'tags' },
			description: 'Used for shop filters (e.g. Disposable, Glass, Pump)',
			group: 'options',
		}),
		defineField({
			name: 'availability',
			type: 'string',
			options: {
				list: [
					{ title: 'Enquire', value: 'enquire' },
					{ title: 'In stock', value: 'in-stock' },
					{ title: 'Unavailable', value: 'unavailable' },
				],
				layout: 'radio',
			},
			initialValue: 'enquire',
			group: 'options',
		}),
		defineField({
			name: 'available',
			type: 'boolean',
			initialValue: true,
			hidden: true,
			group: 'options',
		}),
		defineField({
			name: 'featured',
			type: 'boolean',
			initialValue: false,
			group: 'options',
		}),
		defineField({
			name: 'displayOrder',
			type: 'number',
			initialValue: 100,
			group: 'options',
		}),
		defineField({
			name: 'metadata',
			type: 'metadata',
			group: 'metadata',
		}),
	],
	orderings: [
		{
			name: 'displayOrder',
			title: 'Display order',
			by: [{ field: 'displayOrder', direction: 'asc' }],
		},
		{
			name: 'title',
			title: 'Title',
			by: [{ field: 'title', direction: 'asc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			media: 'image',
			category: 'category.title',
			availability: 'availability',
			price: 'price',
		},
		prepare: ({ title, media, category, availability, price }) => ({
			title,
			subtitle: [
				category,
				availability,
				typeof price === 'number' && `$${price}`,
			]
				.filter(Boolean)
				.join(' · '),
			media,
		}),
	},
})
