import resolveUrl from './resolveUrl'
import { BASE_URL, BLOG_DIR, vercelPreview } from './env'
import type { Metadata } from 'next'
import { DEFAULT_LANG } from './i18n'
import { getSite } from '@/sanity/lib/queries'

type MetadataPage = Sanity.PageBase & {
	authors?: { name?: string }[]
	publishDate?: string
	translations?: {
		slug: string
		language?: string
	}[]
}

export default async function processMetadata(
	page: MetadataPage,
): Promise<Metadata> {
	const site = await getSite()
	const url = resolveUrl(page)
	const {
		title: metadataTitle,
		description: metadataDescription,
		ogimage,
		noIndex,
	} = page.metadata
	const title = metadataTitle || page.title || site.title
	const description = metadataDescription || site.contact?.seoDescription
	const siteName = site.title
	const imageUrl =
		ogimage ||
		site.ogimage ||
		`${BASE_URL}/api/og?title=${encodeURIComponent(title)}`
	const images = [
		{
			url: imageUrl,
			width: 1200,
			height: 630,
			alt: title,
		},
	]
	const preventIndexing = noIndex || vercelPreview
	const languages = Object.fromEntries(
		page.translations
			?.filter((translation) => !!translation?.language && !!translation?.slug)
			.map(({ language, slug }) => [
				language,
				[BASE_URL, language !== DEFAULT_LANG && language, slug]
					.filter(Boolean)
					.join('/'),
			]) || [],
	)
	const hasLanguages = Object.keys(languages).length > 0
	const hasRss =
		page._type === 'blog.post' ||
		(page._type === 'page' && page.metadata.slug.current === BLOG_DIR)

	const commonOpenGraph = {
		url,
		title,
		description,
		siteName,
		images,
	}
	const openGraph: Metadata['openGraph'] =
		page._type === 'blog.post'
			? {
					type: 'article',
					...commonOpenGraph,
					publishedTime: page.publishDate,
					modifiedTime: page._updatedAt,
					authors: page.authors
						?.map(({ name }) => name)
						.filter((name): name is string => Boolean(name)),
				}
			: {
					type: 'website',
					...commonOpenGraph,
				}

	return {
		metadataBase: new URL(BASE_URL),
		title,
		description,
		openGraph,
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: images.map(({ url: image }) => image),
		},
		robots: {
			index: !preventIndexing,
			follow: !preventIndexing,
		},
		alternates: {
			canonical: url,
			...(hasLanguages && { languages }),
			...(hasRss && {
				types: {
					'application/rss+xml': `${BASE_URL}/${BLOG_DIR}/rss.xml`,
				},
			}),
		},
	}
}
