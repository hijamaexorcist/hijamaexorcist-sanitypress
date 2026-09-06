import moduleProps from '@/lib/moduleProps'
import Pretitle from '@/ui/Pretitle'
import { PortableText } from 'next-sanity'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { IMAGE_QUERY } from '@/sanity/lib/queries'
import CatalogGrid from './shop/CatalogGrid'

export default async function ShopList({
	pretitle,
	intro,
	emptyNote,
	showCategoryFilter = true,
	showTagFilter = true,
	...props
}: Partial<{
	pretitle: string
	intro: any
	emptyNote: string
	showCategoryFilter: boolean
	showTagFilter: boolean
}> &
	Sanity.Module) {
	const [products, categories] = await Promise.all([
		fetchSanityLive<Sanity.Product[]>({
			query: groq`
				*[_type == 'product' && metadata.noIndex != true]|order(coalesce(displayOrder, 100) asc, title asc){
					_id,
					_type,
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
					category->{
						_id,
						title,
						slug
					},
					metadata
				}
			`,
		}),
		fetchSanityLive<Sanity.ProductCategory[]>({
			query: groq`
				*[_type == 'product.category']|order(coalesce(displayOrder, 100) asc, title asc){
					_id,
					title,
					slug,
					description,
					displayOrder
				}
			`,
		}),
	])

	return (
		<section className="section space-y-10" {...moduleProps(props)}>
			{(pretitle || intro) && (
				<header className="richtext mx-auto max-w-3xl text-center text-balance">
					<Pretitle className="clinic-kicker">{pretitle}</Pretitle>
					<PortableText value={intro} />
				</header>
			)}

			{products?.length ? (
				<CatalogGrid
					products={products}
					categories={categories || []}
					emptyNote={emptyNote}
					showCategoryFilter={showCategoryFilter}
					showTagFilter={showTagFilter}
				/>
			) : (
				<p className="text-ink/65 mx-auto max-w-xl text-center leading-relaxed">
					{emptyNote ||
						'No items are listed yet. Enquire if you are looking for supplies used in the studio.'}
				</p>
			)}
		</section>
	)
}
