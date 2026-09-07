import { absoluteUrl } from './siteUrl'
import type { MetadataRoute } from 'next'

export type SitemapDocument = {
	_type: 'page' | 'blog.post' | 'product'
	slug?: string
	updatedAt: string
	noIndex?: boolean
}

const invalidSlug = /(^\/|\/$|\/\/|\.\.|[?#])/

export function buildSitemapEntries(
	documents: SitemapDocument[],
): MetadataRoute.Sitemap {
	return documents.flatMap((document) => {
		const { _type, slug } = document

		if (document.noIndex || !slug || slug === '404' || invalidSlug.test(slug)) {
			return []
		}

		const path =
			_type === 'page'
				? slug === 'index'
					? '/'
					: `/${slug}`
				: _type === 'blog.post'
					? `/blog/${slug}`
					: `/shop/${slug}`

		return [
			{
				url: absoluteUrl(path),
				lastModified: document.updatedAt,
				priority: _type === 'page' ? (slug === 'index' ? 1 : 0.5) : 0.4,
			},
		]
	})
}
