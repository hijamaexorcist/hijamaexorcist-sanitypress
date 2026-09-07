import { describe, expect, it } from 'vitest'

import {
	blogPostingJsonLd,
	breadcrumbJsonLd,
	productPageJsonLd,
	siteGraphJsonLd,
	toJsonLdScript,
	webPageJsonLd,
} from './jsonLd'

const baseDocument = {
	metadata: {
		slug: { current: 'safe-cupping' },
		title: 'Safe cupping',
		description: 'Evidence-informed cupping care.',
		ogimage: 'https://cdn.sanity.io/images/project/dataset/cupping.jpg',
		noIndex: false,
	},
}

describe('connected JSON-LD', () => {
	it('builds stable website, organization, and clinic identifiers', () => {
		const site = siteGraphJsonLd({
			title: 'Hijama Exorcist',
			phone: '+1 732 555 0100',
			email: 'hello@hijamaexorcist.com',
			city: 'Piscataway',
			serviceArea: 'Central New Jersey',
			countryCode: 'US',
			seoDescription: 'Professional hijama care.',
			sameAs: ['https://www.instagram.com/hijamaexorcist'],
			ogimage: 'https://cdn.sanity.io/images/project/dataset/clinic.jpg',
		})

		expect(site['@graph']).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					'@type': 'WebSite',
					'@id': 'https://www.hijamaexorcist.com/#website',
				}),
				expect.objectContaining({
					'@type': 'Organization',
					'@id': 'https://www.hijamaexorcist.com/#organization',
				}),
				expect.objectContaining({
					'@id': 'https://www.hijamaexorcist.com/#clinic',
					areaServed: expect.arrayContaining([
						expect.objectContaining({ name: 'Piscataway' }),
						expect.objectContaining({ name: 'Central New Jersey' }),
					]),
				}),
			]),
		)

		const clinic = site['@graph'].find(
			(node) => node['@id'] === 'https://www.hijamaexorcist.com/#clinic',
		)
		expect(clinic).not.toHaveProperty('address')
	})

	it('links a localized web page to the canonical website', () => {
		expect(
			webPageJsonLd({
				_type: 'page',
				language: 'fr',
				title: 'Ventouses sûres',
				...baseDocument,
			}),
		).toMatchObject({
			'@type': 'WebPage',
			'@id': 'https://www.hijamaexorcist.com/fr/safe-cupping#webpage',
			url: 'https://www.hijamaexorcist.com/fr/safe-cupping',
			isPartOf: { '@id': 'https://www.hijamaexorcist.com/#website' },
		})
	})

	it('builds a complete connected blog posting', () => {
		const posting = blogPostingJsonLd({
			_type: 'blog.post',
			language: 'fr',
			_updatedAt: '2026-09-06T12:00:00Z',
			publishDate: '2026-08-01',
			authors: [{ name: 'Aisha Rahman' }, { name: 'Omar Hassan' }],
			categories: [{ title: 'Hijama education' }],
			...baseDocument,
		})

		expect(posting).toMatchObject({
			'@type': 'BlogPosting',
			'@id': 'https://www.hijamaexorcist.com/fr/blog/safe-cupping#article',
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': 'https://www.hijamaexorcist.com/fr/blog/safe-cupping',
			},
			headline: 'Safe cupping',
			image: 'https://cdn.sanity.io/images/project/dataset/cupping.jpg',
			datePublished: '2026-08-01',
			dateModified: '2026-09-06T12:00:00Z',
			author: [
				{ '@type': 'Person', name: 'Aisha Rahman' },
				{ '@type': 'Person', name: 'Omar Hassan' },
			],
			publisher: {
				'@id': 'https://www.hijamaexorcist.com/#organization',
			},
			articleSection: ['Hijama education'],
		})
		expect(Number.isNaN(Date.parse(posting.datePublished))).toBe(false)
		expect(Number.isNaN(Date.parse(posting.dateModified))).toBe(false)
	})

	it.each([
		['in-stock', 'https://schema.org/InStock'],
		['unavailable', 'https://schema.org/OutOfStock'],
	] as const)(
		'maps %s priced products to a factual offer',
		(availability, expectedAvailability) => {
			const graph = productPageJsonLd({
				_type: 'product',
				title: 'Glass cupping set',
				price: 35,
				availability,
				category: { title: 'Cupping supplies' },
				imageUrl: 'https://cdn.sanity.io/images/project/dataset/glass-cups.jpg',
				...baseDocument,
			})
			const product = graph['@graph'].find(
				(node) => node['@type'] === 'Product',
			)

			expect(product).toMatchObject({
				offers: {
					'@type': 'Offer',
					url: 'https://www.hijamaexorcist.com/shop/safe-cupping',
					price: 35,
					priceCurrency: 'USD',
					availability: expectedAvailability,
					seller: {
						'@id': 'https://www.hijamaexorcist.com/#organization',
					},
				},
			})
		},
	)

	it('omits unknown availability from a priced enquire offer', () => {
		const graph = productPageJsonLd({
			_type: 'product',
			title: 'Custom cupping kit',
			price: 45,
			availability: 'enquire',
			...baseDocument,
		})
		const product = graph['@graph'].find((node) => node['@type'] === 'Product')

		expect(product?.offers).not.toHaveProperty('availability')
	})

	it('does not fabricate eligibility fields for an enquire-only product', () => {
		const graph = productPageJsonLd({
			_type: 'product',
			title: 'Custom cupping kit',
			availability: 'enquire',
			...baseDocument,
		})
		const product = graph['@graph'].find((node) => node['@type'] === 'Product')

		expect(product).not.toHaveProperty('offers')
		expect(product).not.toHaveProperty('aggregateRating')
		expect(product).not.toHaveProperty('review')
	})

	it('numbers breadcrumb items from one', () => {
		const breadcrumbs = breadcrumbJsonLd([
			{ name: 'Home', url: 'https://www.hijamaexorcist.com/' },
			{ name: 'Shop', url: 'https://www.hijamaexorcist.com/shop' },
		])

		expect(breadcrumbs.itemListElement).toEqual([
			expect.objectContaining({ position: 1 }),
			expect.objectContaining({ position: 2 }),
		])
	})

	it('escapes script starts during serialization', () => {
		expect(toJsonLdScript({ value: '<script>alert(1)</script>' })).toContain(
			'\\u003cscript>',
		)
	})
})
