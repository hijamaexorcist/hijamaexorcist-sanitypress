import { notFound } from 'next/navigation'
import processMetadata from '@/lib/processMetadata'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { getClinicContact } from '@/lib/clinicContact'
import { groq } from 'next-sanity'
import { CTA_QUERY, IMAGE_QUERY } from '@/sanity/lib/queries'
import ProductDetail from '@/ui/modules/shop/ProductDetail'
import JsonLd from '@/ui/JsonLd'
import { productPageJsonLd } from '@/lib/jsonLd'

const PRODUCT_CARD_FIELDS = groq`
	_id,
	_type,
	_updatedAt,
	title,
	excerpt,
	price,
	priceNote,
	available,
	availability,
	featured,
	displayOrder,
	tags,
	image { ${IMAGE_QUERY} },
	'imageUrl': image.asset->url,
	category->{
		_id,
		title,
		slug
	},
	metadata
`

export default async function Page({ params }: Props) {
	const [{ product, related }, contact] = await Promise.all([
		getProduct(await params),
		getClinicContact(),
	])
	if (!product) notFound()

	return (
		<>
			<JsonLd data={productPageJsonLd(product)} />
			<ProductDetail
				product={product}
				related={related}
				whatsappNumber={contact.whatsapp}
			/>
		</>
	)
}

export async function generateMetadata({ params }: Props) {
	const { product } = await getProduct(await params)
	if (!product) notFound()
	return processMetadata(product)
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[_type == 'product' && defined(metadata.slug.current)].metadata.slug.current`,
	)

	return slugs.map((slug) => ({ slug }))
}

async function getProduct(params: Params) {
	const product = await fetchSanityLive<Sanity.Product | null>({
		query: groq`*[
			_type == 'product'
			&& metadata.slug.current == $slug
		][0]{
			${PRODUCT_CARD_FIELDS},
			content,
			ctas[]{ ${CTA_QUERY} },
			gallery[]{ ${IMAGE_QUERY} },
			'galleryImageUrls': gallery[].asset->url,
			metadata {
				...,
				'ogimage': coalesce(image.asset->url, gallery[0].asset->url) + '?w=1200'
			}
		}`,
		params: { slug: params.slug },
	})

	if (!product) return { product: null, related: [] as Sanity.Product[] }

	const related = await fetchSanityLive<Sanity.Product[]>({
		query: groq`*[
			_type == 'product'
			&& metadata.noIndex != true
			&& _id != $id
			&& (
				category._ref == $categoryId
				|| count((tags[])[@ in $tags]) > 0
			)
		]|order(coalesce(displayOrder, 100) asc, title asc)[0...4]{
			${PRODUCT_CARD_FIELDS}
		}`,
		params: {
			id: product._id,
			categoryId: product.category?._id || '',
			tags: product.tags || [],
		},
	})

	return { product, related: related || [] }
}

type Params = { slug: string }

type Props = {
	params: Promise<Params>
}
