import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscLibrary } from 'react-icons/vsc'

export default defineType({
	name: 'education-bento',
	title: 'Education bento',
	type: 'object',
	icon: VscLibrary,
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
		defineField({ name: 'description', type: 'text', rows: 3, group: 'content' }),
		defineField({ name: 'image', type: 'img', group: 'content' }),
		defineField({
			name: 'topics',
			type: 'array',
			validation: (Rule) => Rule.required().min(3).max(6),
			group: 'content',
			of: [
				defineArrayMember({
					name: 'topic',
					type: 'object',
					fields: [
						defineField({ name: 'label', type: 'string' }),
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
					preview: { select: { title: 'title', subtitle: 'label' } },
				}),
			],
		}),
	],
	preview: {
		select: { title: 'title', subtitle: 'description', media: 'image.image' },
	},
})
