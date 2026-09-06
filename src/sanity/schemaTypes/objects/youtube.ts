import { defineField, defineType } from 'sanity'
import { VscPlayCircle } from 'react-icons/vsc'
import { YOUTUBE_URL_PATTERN } from '@/lib/youtube'

export default defineType({
	name: 'youtube',
	title: 'YouTube video',
	type: 'object',
	icon: VscPlayCircle,
	fields: [
		defineField({
			name: 'url',
			title: 'YouTube URL',
			type: 'url',
			validation: (Rule) =>
				Rule.required().custom(
					(value) =>
						!value ||
						YOUTUBE_URL_PATTERN.test(value) ||
						'Enter a full YouTube URL.',
				),
		}),
		defineField({
			name: 'title',
			type: 'string',
			description: 'Used for the player label and accessibility.',
		}),
		defineField({
			name: 'caption',
			type: 'text',
			rows: 2,
		}),
	],
	preview: {
		select: { title: 'title', subtitle: 'url' },
		prepare: ({ title, subtitle }) => ({
			title: title || 'YouTube video',
			subtitle,
		}),
	},
})
