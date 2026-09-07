import { fetchSanityLive } from '@/sanity/lib/fetch'
import { buildSitemapEntries, type SitemapDocument } from '@/lib/seo/sitemap'
import { groq } from 'next-sanity'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const documents = await fetchSanityLive<SitemapDocument[]>({
		query: groq`*[_type in ['page', 'blog.post', 'product']]|order(metadata.slug.current){
			_type,
			'slug': metadata.slug.current,
			'updatedAt': _updatedAt,
			'noIndex': metadata.noIndex,
		}`,
	})

	return buildSitemapEntries(documents)
}
