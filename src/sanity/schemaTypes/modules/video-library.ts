import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscPlayCircle } from 'react-icons/vsc'
import { YOUTUBE_URL_PATTERN } from '@/lib/youtube'

export default defineType({
	name: 'video-library',
	title: 'Video library',
	type: 'object',
	icon: VscPlayCircle,
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
		defineField({
			name: 'videos',
			type: 'array',
			validation: (Rule) => Rule.required().min(1).max(8),
			group: 'content',
			of: [
				defineArrayMember({
					name: 'video',
					type: 'object',
					fields: [
						defineField({
							name: 'title',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'url',
							type: 'url',
							validation: (Rule) =>
								Rule.required().custom(
									(value) =>
										!value ||
										YOUTUBE_URL_PATTERN.test(value) ||
										'Enter a full YouTube URL.',
								),
						}),
						defineField({ name: 'description', type: 'text', rows: 2 }),
					],
					preview: { select: { title: 'title', subtitle: 'description' } },
				}),
			],
		}),
	],
	preview: { select: { title: 'title', subtitle: 'description' } },
})
