import { DEFAULT_LANG } from '@/lib/i18n'
import { PRODUCTION_BASE_URL } from '@/lib/seo/siteUrl'

type JsonLdValue = string | number | boolean | null | JsonLdNode | JsonLdValue[]

export type JsonLdNode = {
	[key: string]: JsonLdValue | undefined
}

type JsonLdGraph = JsonLdNode & {
	'@context': 'https://schema.org'
	'@graph': JsonLdNode[]
}

type PageJsonLdInput = {
	_type: Sanity.PageBase['_type']
	_updatedAt?: string
	title?: string
	language?: string
	metadata: Pick<Sanity.Metadata, 'slug' | 'title' | 'description' | 'ogimage'>
}

type BlogPostingJsonLdInput = PageJsonLdInput & {
	_type: 'blog.post'
	publishDate: string
	authors?: Array<{ name?: string }>
	categories?: Array<{ title?: string }>
}

type ProductPageJsonLdInput = PageJsonLdInput & {
	_type: 'product'
	title: string
	excerpt?: string
	price?: number
	availability?: Sanity.Product['availability']
	imageUrl?: string
	galleryImageUrls?: string[]
	category?: { title?: string }
}

type SiteGraphContact = {
	title: string
	phone?: string
	email?: string
	city?: string
	serviceArea?: string
	countryCode?: string
	seoDescription?: string
	sameAs?: string[]
	ogimage?: string
}

const ids = {
	website: `${PRODUCTION_BASE_URL}/#website`,
	organization: `${PRODUCTION_BASE_URL}/#organization`,
	clinic: `${PRODUCTION_BASE_URL}/#clinic`,
} as const

const availabilityUrls = {
	'in-stock': 'https://schema.org/InStock',
	unavailable: 'https://schema.org/OutOfStock',
} as const

function pageUrl(page: PageJsonLdInput) {
	const language =
		page.language && page.language !== DEFAULT_LANG ? `/${page.language}` : ''
	const segment =
		page._type === 'blog.post'
			? '/blog/'
			: page._type === 'product'
				? '/shop/'
				: '/'
	const slug =
		page.metadata.slug.current === 'index' ? '' : page.metadata.slug.current

	return `${PRODUCTION_BASE_URL}${language}${segment}${slug}`
}

function withoutContext(node: JsonLdNode) {
	const { '@context': _context, ...rest } = node
	return rest
}

export function siteGraphJsonLd(contact: SiteGraphContact): JsonLdGraph {
	const areaServed: JsonLdNode[] = [
		...(contact.city
			? [{ '@type': 'City', name: contact.city } satisfies JsonLdNode]
			: []),
		...(contact.serviceArea
			? [
					{
						'@type': 'AdministrativeArea',
						name: contact.serviceArea,
					} satisfies JsonLdNode,
				]
			: []),
	]

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': ids.website,
				url: `${PRODUCTION_BASE_URL}/`,
				name: contact.title,
				publisher: { '@id': ids.organization },
			},
			{
				'@type': 'Organization',
				'@id': ids.organization,
				url: `${PRODUCTION_BASE_URL}/`,
				name: contact.title,
				...(contact.ogimage && { image: contact.ogimage }),
				...(contact.sameAs?.length && { sameAs: contact.sameAs }),
			},
			{
				'@type': ['MedicalBusiness', 'HealthAndBeautyBusiness'],
				'@id': ids.clinic,
				url: `${PRODUCTION_BASE_URL}/`,
				name: contact.title,
				parentOrganization: { '@id': ids.organization },
				...(contact.seoDescription && {
					description: contact.seoDescription,
				}),
				...(contact.ogimage && { image: contact.ogimage }),
				...(contact.phone && { telephone: contact.phone }),
				...(contact.email && { email: contact.email }),
				...(areaServed.length && { areaServed }),
				...(contact.sameAs?.length && { sameAs: contact.sameAs }),
			},
		],
	}
}

export function webPageJsonLd(page: PageJsonLdInput): JsonLdNode {
	const url = pageUrl(page)
	const name = page.metadata.title || page.title

	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url,
		...(name && { name }),
		...(page.metadata.description && {
			description: page.metadata.description,
		}),
		...(page.metadata.ogimage && {
			primaryImageOfPage: {
				'@type': 'ImageObject',
				url: page.metadata.ogimage,
			},
		}),
		isPartOf: { '@id': ids.website },
	}
}

export function blogPostingJsonLd(
	post: BlogPostingJsonLdInput,
): JsonLdNode & { datePublished: string; dateModified: string } {
	const url = pageUrl(post)
	const headline = post.metadata.title || post.title
	const authors =
		post.authors?.flatMap(({ name }) =>
			name ? [{ '@type': 'Person', name } satisfies JsonLdNode] : [],
		) || []
	const articleSection =
		post.categories?.flatMap(({ title }) => (title ? [title] : [])) || []

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		...(headline && { headline }),
		...(post.metadata.description && {
			description: post.metadata.description,
		}),
		...(post.metadata.ogimage && { image: post.metadata.ogimage }),
		datePublished: post.publishDate,
		dateModified: post._updatedAt || post.publishDate,
		...(authors.length && { author: authors }),
		publisher: { '@id': ids.organization },
		...(articleSection.length && { articleSection }),
	}
}

export function breadcrumbJsonLd(
	items: Array<{ name: string; url: string }>,
): JsonLdNode & { itemListElement: JsonLdNode[] } {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map(({ name, url }, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name,
			item: url,
		})),
	}
}

export function productPageJsonLd(
	product: ProductPageJsonLdInput,
): JsonLdGraph {
	const url = pageUrl(product)
	const productId = `${url}#product`
	const webpageId = `${url}#webpage`
	const breadcrumbId = `${url}#breadcrumb`
	const images = [
		...(product.imageUrl ? [product.imageUrl] : []),
		...(product.galleryImageUrls || []),
	]
	const hasPrice =
		typeof product.price === 'number' && Number.isFinite(product.price)
	const webpage = withoutContext(webPageJsonLd(product))
	const breadcrumbs = withoutContext(
		breadcrumbJsonLd([
			{ name: 'Home', url: `${PRODUCTION_BASE_URL}/` },
			{ name: 'Shop', url: `${PRODUCTION_BASE_URL}/shop` },
			{ name: product.title, url },
		]),
	)

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Product',
				'@id': productId,
				url,
				name: product.title,
				mainEntityOfPage: { '@id': webpageId },
				...(product.excerpt || product.metadata.description
					? {
							description: product.excerpt || product.metadata.description,
						}
					: {}),
				...(images.length && { image: images }),
				...(product.category?.title && {
					category: product.category.title,
				}),
				...(hasPrice && {
					offers: {
						'@type': 'Offer',
						url,
						price: product.price,
						priceCurrency: 'USD',
						...(product.availability !== 'enquire' && {
							availability:
								availabilityUrls[product.availability || 'in-stock'],
						}),
						seller: { '@id': ids.organization },
					},
				}),
			},
			{
				...webpage,
				mainEntity: { '@id': productId },
				breadcrumb: { '@id': breadcrumbId },
			},
			{
				...breadcrumbs,
				'@id': breadcrumbId,
			},
		],
	}
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map(({ question, answer }) => ({
			'@type': 'Question',
			name: question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: answer,
			},
		})),
	}
}

export function toJsonLdScript(
	data: Record<string, unknown> | null | undefined,
) {
	if (!data) return null
	return JSON.stringify(data).replace(/</g, '\\u003c')
}
