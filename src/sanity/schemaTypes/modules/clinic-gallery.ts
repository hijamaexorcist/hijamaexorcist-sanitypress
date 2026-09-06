import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscFileMedia } from 'react-icons/vsc'
import { count } from '@/lib/utils'

export default defineType({
	name: 'clinic-gallery',
	title: 'Clinic gallery',
	icon: VscFileMedia,
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
			name: 'images',
			type: 'array',
			validation: (Rule) => Rule.required().min(2).max(6),
			group: 'content',
			of: [
				defineArrayMember({
					name: 'figure',
					type: 'object',
					fields: [
						defineField({
							name: 'image',
							type: 'img',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'caption',
							type: 'string',
						}),
					],
					preview: {
						select: {
							title: 'caption',
							media: 'image.image',
						},
					},
				}),
			],
		}),
	],
	preview: {
		select: { title: 'title', images: 'images' },
		prepare: ({ title, images }) => ({
			title,
			subtitle: count(images, 'image'),
		}),
	},
})
