import { defineField, defineType } from 'sanity'
import { CharacterCount } from '@/sanity/ui/CharacterCount'
import PreviewOG from '@/sanity/ui/PreviewOG'

export default defineType({
	name: 'metadata',
	title: 'Metadata',
	description: 'For search engines',
	type: 'object',
	fields: [
		defineField({
			name: 'slug',
			type: 'slug',
			description:
				'Canonical URL path used by search engines. Do not include query strings, fragments, or leading/trailing slashes.',
			options: {
				source: (doc: any) => doc.title || doc.metadata.title,
			},
			validation: (Rule) => [
				Rule.required(),
				Rule.custom((value) => {
					const slug = value?.current

					if (!slug) return true

					return /(^\/|\/$|\/\/|\.\.|[?#])/.test(slug)
						? 'Use a clean canonical path without leading/trailing slashes, doubled slashes, "..", "?", or "#".'
						: true
				}),
			],
		}),
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => [
				Rule.required().min(10).error('Add a descriptive SEO title.'),
				Rule.max(60).warning(
					'Search results may truncate titles over 60 characters.',
				),
			],
			components: {
				input: (props) => (
					<CharacterCount max={60} {...(props as any)}>
						<PreviewOG title={props.elementProps.value} />
					</CharacterCount>
				),
			},
		}),
		defineField({
			name: 'description',
			type: 'text',
			validation: (Rule) => [
				Rule.required().min(50).error('Add a useful search description.'),
				Rule.max(160).warning(
					'Search results may truncate descriptions over 160 characters.',
				),
			],
			components: {
				input: (props) => (
					<CharacterCount as="textarea" max={160} {...(props as any)} />
				),
			},
		}),
		defineField({
			name: 'image',
			description:
				'Optional social sharing image. When omitted, the site fallback image is used.',
			type: 'image',
			options: {
				hotspot: true,
				metadata: ['lqip'],
			},
		}),
		defineField({
			name: 'noIndex',
			description:
				'Exclude this page from search indexing. Use only for intentionally private, duplicate, or incomplete content.',
			type: 'boolean',
			initialValue: false,
		}),
	],
})
