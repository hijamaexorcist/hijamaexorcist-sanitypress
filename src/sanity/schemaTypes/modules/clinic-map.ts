import { defineField, defineType } from 'sanity'
import { VscLocation } from 'react-icons/vsc'

export default defineType({
	name: 'clinic-map',
	title: 'Clinic map',
	icon: VscLocation,
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
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'locationName',
			type: 'string',
			initialValue: 'Hijama Exorcist',
			group: 'content',
		}),
		defineField({
			name: 'address',
			type: 'text',
			rows: 3,
			initialValue: '1211 South Washington Ave\nPiscataway, NJ 08854',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'latitude',
			type: 'number',
			initialValue: 40.5623884,
			validation: (Rule) => Rule.required().min(-90).max(90),
			group: 'content',
		}),
		defineField({
			name: 'longitude',
			type: 'number',
			initialValue: -74.4477892,
			validation: (Rule) => Rule.required().min(-180).max(180),
			group: 'content',
		}),
		defineField({
			name: 'zoom',
			type: 'number',
			initialValue: 15,
			validation: (Rule) => Rule.min(10).max(18),
			group: 'options',
		}),
		defineField({
			name: 'directionsUrl',
			title: 'Directions URL',
			type: 'url',
			validation: (Rule) =>
				Rule.uri({ scheme: ['http', 'https'] }).required(),
			group: 'content',
		}),
		defineField({
			name: 'directionsLabel',
			type: 'string',
			initialValue: 'Get directions',
			group: 'content',
		}),
		defineField({
			name: 'note',
			type: 'text',
			rows: 2,
			description: 'Optional parking, entrance, or arrival guidance.',
			group: 'content',
		}),
	],
	preview: {
		select: { title: 'title', subtitle: 'address' },
		prepare: ({ title, subtitle }) => ({
			title: title || 'Clinic map',
			subtitle,
		}),
	},
})
