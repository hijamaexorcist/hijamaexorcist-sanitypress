import { defineField, defineType } from 'sanity'
import { VscTag } from 'react-icons/vsc'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'shop-list',
	title: 'Shop list',
	icon: VscTag,
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
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'emptyNote',
			type: 'string',
			description: 'Shown when no products are available',
			group: 'options',
		}),
		defineField({
			name: 'showCategoryFilter',
			title: 'Show category filter',
			type: 'boolean',
			initialValue: true,
			group: 'options',
		}),
		defineField({
			name: 'showTagFilter',
			title: 'Show type / tag filter',
			type: 'boolean',
			initialValue: true,
			group: 'options',
		}),
	],
	preview: {
		select: {
			intro: 'intro',
			pretitle: 'pretitle',
		},
		prepare: ({ intro, pretitle }) => ({
			title: getBlockText(intro) || pretitle || 'Shop',
			subtitle: 'Shop list',
		}),
	},
})
