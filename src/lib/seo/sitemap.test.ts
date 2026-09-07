import { describe, expect, it } from 'vitest'
import { buildSitemapEntries } from './sitemap'

describe('buildSitemapEntries', () => {
	it('maps each public document to its canonical route', () => {
		const entries = buildSitemapEntries([
			{ _type: 'page', slug: 'index', updatedAt: '2026-09-06' },
			{ _type: 'page', slug: 'about', updatedAt: '2026-09-06' },
			{ _type: 'blog.post', slug: 'safe-cupping', updatedAt: '2026-09-06' },
			{ _type: 'product', slug: 'hijama-cups', updatedAt: '2026-09-06' },
		])

		expect(entries.map(({ url }) => url)).toEqual([
			'https://www.hijamaexorcist.com/',
			'https://www.hijamaexorcist.com/about',
			'https://www.hijamaexorcist.com/blog/safe-cupping',
			'https://www.hijamaexorcist.com/shop/hijama-cups',
		])
	})

	it('excludes noindex, 404, empty, and malformed records', () => {
		const entries = buildSitemapEntries([
			{ _type: 'page', slug: '404', updatedAt: '2026-09-06' },
			{ _type: 'page', slug: 'hidden', noIndex: true, updatedAt: '2026-09-06' },
			{ _type: 'page', slug: '../escape', updatedAt: '2026-09-06' },
			{ _type: 'page', slug: '', updatedAt: '2026-09-06' },
		])

		expect(entries).toEqual([])
	})
})
