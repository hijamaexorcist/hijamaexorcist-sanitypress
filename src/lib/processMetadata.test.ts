import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
	fetchSanityLive: vi.fn(),
	getSite: vi.fn(),
	preview: false,
}))

vi.mock('./env', () => ({
	BASE_URL: 'https://www.hijamaexorcist.com',
	BLOG_DIR: 'blog',
	SHOP_DIR: 'shop',
	get vercelPreview() {
		return mocks.preview
	},
}))

vi.mock('@/sanity/lib/queries', () => ({
	getSite: mocks.getSite,
	MODULES_QUERY: '',
}))

vi.mock('@/sanity/lib/fetch', () => ({
	fetchSanityLive: mocks.fetchSanityLive,
}))

vi.mock('@/ui/modules', () => ({
	default: () => null,
}))

import { generateMetadata as generateNotFoundMetadata } from '@/app/(frontend)/not-found'
import processMetadata from './processMetadata'

type MetadataDocument = Sanity.PageBase & {
	authors?: { name?: string }[]
	publishDate?: string
	translations?: {
		slug: string
		language?: string
	}[]
}

const site = {
	_id: 'site',
	_type: 'site',
	_createdAt: '2026-01-01T00:00:00Z',
	_updatedAt: '2026-09-06T12:00:00Z',
	_rev: 'site-rev',
	title: 'Hijama Exorcist',
	contact: {
		seoDescription: 'Safe, professional hijama and spiritual care.',
	},
	ogimage: 'https://cdn.sanity.io/images/site-default.jpg',
} satisfies Sanity.Site

function createDocument(
	overrides: Partial<Omit<MetadataDocument, 'metadata'>> & {
		metadata?: Partial<Sanity.Metadata>
	} = {},
): MetadataDocument {
	const { metadata, ...document } = overrides

	return {
		_id: 'document',
		_type: 'page',
		_createdAt: '2026-08-01T00:00:00Z',
		_updatedAt: '2026-09-06T12:00:00Z',
		_rev: 'document-rev',
		title: 'Safe cupping',
		...document,
		metadata: {
			slug: { current: 'safe-cupping' },
			title: 'Safe cupping metadata',
			description: 'Page-specific description.',
			noIndex: false,
			...metadata,
		},
	}
}

describe('processMetadata', () => {
	beforeEach(() => {
		mocks.preview = false
		mocks.getSite.mockReset().mockResolvedValue(site)
	})

	it('builds complete article metadata', async () => {
		const metadata = await processMetadata(
			createDocument({
				_type: 'blog.post',
				publishDate: '2026-08-01',
				authors: [{ name: 'Hijama Exorcist' }, { name: undefined }],
			}),
		)

		expect(metadata.alternates?.canonical).toBe(
			'https://www.hijamaexorcist.com/blog/safe-cupping',
		)
		expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' })
		expect(metadata.openGraph).toMatchObject({
			type: 'article',
			publishedTime: '2026-08-01',
			modifiedTime: '2026-09-06T12:00:00Z',
			authors: ['Hijama Exorcist'],
		})
		expect(metadata.robots).toMatchObject({ index: true, follow: true })
	})

	it('uses the document language in a translated blog canonical', async () => {
		const metadata = await processMetadata(
			createDocument({
				_type: 'blog.post',
				language: 'fr',
			}),
		)

		expect(metadata.alternates?.canonical).toBe(
			'https://www.hijamaexorcist.com/fr/blog/safe-cupping',
		)
		expect(metadata.openGraph).toMatchObject({
			url: 'https://www.hijamaexorcist.com/fr/blog/safe-cupping',
		})
	})

	it.each([
		['metadata title', createDocument(), 'Safe cupping metadata'],
		[
			'page title',
			createDocument({ metadata: { title: undefined } }),
			'Safe cupping',
		],
		[
			'site title',
			createDocument({
				title: undefined,
				metadata: { title: undefined },
			}),
			'Hijama Exorcist',
		],
	])('falls back to the %s', async (_case, document, expected) => {
		const metadata = await processMetadata(document)

		expect(metadata.title).toBe(expected)
		expect(metadata.openGraph).toMatchObject({ title: expected })
		expect(metadata.twitter).toMatchObject({ title: expected })
	})

	it('falls back to the site SEO description', async () => {
		const metadata = await processMetadata(
			createDocument({ metadata: { description: undefined } }),
		)

		expect(metadata.description).toBe(site.contact.seoDescription)
		expect(metadata.openGraph).toMatchObject({
			description: site.contact.seoDescription,
		})
	})

	it('uses the route-specific product canonical and website Open Graph type', async () => {
		const metadata = await processMetadata(createDocument({ _type: 'product' }))

		expect(metadata.alternates?.canonical).toBe(
			'https://www.hijamaexorcist.com/shop/safe-cupping',
		)
		expect(metadata.openGraph).toMatchObject({
			type: 'website',
			url: 'https://www.hijamaexorcist.com/shop/safe-cupping',
		})
	})

	it.each([
		['preview', false, true],
		['noIndex document', true, false],
	])('prevents indexing for a %s', async (_case, noIndex, preview) => {
		mocks.preview = preview

		const metadata = await processMetadata(
			createDocument({ metadata: { noIndex } }),
		)

		expect(metadata.robots).toMatchObject({ index: false, follow: false })
	})

	it('omits empty language alternates for the English-only site', async () => {
		const metadata = await processMetadata(createDocument())

		expect(metadata.alternates).not.toHaveProperty('languages')
	})

	it('emits language alternates only for valid translations', async () => {
		const metadata = await processMetadata(
			createDocument({
				translations: [
					{ language: 'fr', slug: 'soins-securises' },
					{ language: undefined, slug: 'ignored' },
				],
			}),
		)

		expect(metadata.alternates?.languages).toEqual({
			fr: 'https://www.hijamaexorcist.com/fr/soins-securises',
		})
	})

	it('preserves the blog route in translated alternates', async () => {
		const metadata = await processMetadata(
			createDocument({
				_type: 'blog.post',
				translations: [{ language: 'fr', slug: 'ventouses-securisees' }],
			}),
		)

		expect(metadata.alternates?.languages).toEqual({
			fr: 'https://www.hijamaexorcist.com/fr/blog/ventouses-securisees',
		})
	})

	it('shapes the default Open Graph image for Next.js metadata', async () => {
		const metadata = await processMetadata(createDocument())

		expect(metadata.openGraph?.images).toEqual([
			{
				url: 'https://cdn.sanity.io/images/site-default.jpg',
				width: 1200,
				height: 630,
				alt: 'Safe cupping metadata',
			},
		])
		expect(metadata.twitter).toMatchObject({
			images: ['https://cdn.sanity.io/images/site-default.jpg'],
		})
	})

	it.each([
		['blog post', createDocument({ _type: 'blog.post' }), true],
		[
			'blog index',
			createDocument({ metadata: { slug: { current: 'blog' } } }),
			true,
		],
		['regular page', createDocument(), false],
		['product', createDocument({ _type: 'product' }), false],
	])(
		'emits RSS discovery for a %s only when appropriate',
		async (_case, document, hasRss) => {
			const metadata = await processMetadata(document)

			if (hasRss) {
				expect(metadata.alternates?.types).toEqual({
					'application/rss+xml': 'https://www.hijamaexorcist.com/blog/rss.xml',
				})
			} else {
				expect(metadata.alternates).not.toHaveProperty('types')
			}
		},
	)
})

describe('404 metadata', () => {
	beforeEach(() => {
		mocks.fetchSanityLive.mockReset()
	})

	it('unconditionally prevents indexing while preserving CMS copy', async () => {
		mocks.fetchSanityLive.mockResolvedValue(
			createDocument({
				metadata: {
					title: 'Custom not found',
					description: 'The requested page does not exist.',
				},
			}),
		)

		await expect(generateNotFoundMetadata()).resolves.toEqual({
			title: 'Custom not found',
			description: 'The requested page does not exist.',
			robots: { index: false, follow: false },
		})
	})

	it('uses a safe title when the CMS 404 page is unavailable', async () => {
		mocks.fetchSanityLive.mockResolvedValue(null)

		await expect(generateNotFoundMetadata()).resolves.toEqual({
			title: 'Page not found',
			description: undefined,
			robots: { index: false, follow: false },
		})
	})
})
