import { PortableText } from 'next-sanity'
import Link from 'next/link'
import {
	PiChatCircleDots,
	PiPackage,
	PiShieldCheck,
} from 'react-icons/pi'
import { formatCurrency } from '@/lib/utils'
import { SHOP_DIR } from '@/lib/env'
import { waLink } from '@/lib/utils'
import CTAList from '@/ui/CTAList'
import ProductGallery from './ProductGallery'
import ProductCard from './ProductCard'
import ProductActionBar from './ProductActionBar'
import { resolveProductAvailability } from '@/lib/productAvailability'

const availabilityLabels: Record<string, string> = {
	enquire: 'Enquire for availability',
	'in-stock': 'In stock',
	unavailable: 'Currently unavailable',
}

export default function ProductDetail({
	product,
	related = [],
	whatsappNumber,
}: {
	product: Sanity.Product
	related?: Sanity.Product[]
	whatsappNumber?: string
}) {
	const price =
		typeof product.price === 'number' && !Number.isNaN(product.price)
			? formatCurrency(product.price).replace(/\.00$/, '')
			: null
	const availability = resolveProductAvailability(product)
	const gallery =
		product.gallery?.filter((image) => image?.asset)?.length
			? product.gallery
			: product.image?.asset
				? [product.image]
				: []
	const enquireHref = `/contact?product=${encodeURIComponent(product.title || '')}&reason=${encodeURIComponent('Shop enquiry')}`
	const whatsappHref = whatsappNumber
		? waLink(
				whatsappNumber,
				`Hello Hijama Exorcist — I am enquiring about ${product.title}.`,
			)
		: undefined

	return (
		<div className="pb-28 lg:pb-10">
			<nav
				aria-label="Breadcrumb"
				className="section text-ink/55 flex flex-wrap items-center gap-2 py-5 text-xs sm:text-sm"
			>
				<Link href={`/${SHOP_DIR}`} className="hover:text-ink transition">
					Shop
				</Link>
				{product.category?.title && (
					<>
						<span aria-hidden="true">/</span>
						<span>{product.category.title}</span>
					</>
				)}
				<span aria-hidden="true">/</span>
				<span className="text-ink/75">{product.title}</span>
			</nav>

			<section className="section grid items-start gap-10 pt-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.75fr)] lg:gap-14 xl:gap-20">
				<ProductGallery images={gallery} title={product.title || 'Product'} />

				<div className="self-start lg:sticky lg:top-24">
					<div className="flex flex-wrap items-center gap-3">
						{product.category?.title && (
							<p className="clinic-kicker">{product.category.title}</p>
						)}
						{availability && (
							<span className="bg-accent/10 text-accent rounded-full px-3 py-1 text-[11px] font-semibold">
								{availabilityLabels[availability] || availability}
							</span>
						)}
						{product.featured && (
							<span className="bg-clinic-sage/70 text-ink rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase">
								Featured
							</span>
						)}
					</div>

					<h1 className="h2 mt-4 text-balance">{product.title}</h1>

					<p className="mt-5 font-serif text-3xl tracking-[-0.04em]">
						{price || product.priceNote || 'Enquire for current price'}
					</p>
					{price && product.priceNote && (
						<p className="text-ink/60 mt-2 text-sm">{product.priceNote}</p>
					)}

					{product.excerpt && (
						<p className="text-ink/70 mt-6 text-base leading-relaxed sm:text-lg">
							{product.excerpt}
						</p>
					)}

					{(product.tags?.length || availability) && (
						<div className="clinic-core border-ink/8 mt-8 border p-5">
							<p className="text-ink text-xs font-semibold tracking-[0.14em] uppercase">
								Item details
							</p>
							{!!product.tags?.length && (
								<div className="mt-4">
									<p className="text-ink/55 mb-2 text-xs font-semibold">Type</p>
									<div className="flex flex-wrap gap-2">
										{product.tags.map((tag) => (
											<span
												key={tag}
												className="border-ink/10 bg-clinic-mist/60 text-ink rounded-full border px-3 py-2 text-xs font-semibold"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							)}
							<div className="mt-4">
								<p className="text-ink/55 mb-2 text-xs font-semibold">
									Availability
								</p>
								<p className="text-sm font-semibold">
									{availabilityLabels[availability] || availability}
								</p>
							</div>
						</div>
					)}

					<div className="mt-6 grid gap-3">
						{product.ctas?.length ? (
							<CTAList ctas={product.ctas} className="w-full *:w-full" />
						) : (
							<Link href={enquireHref} className="action min-h-13 w-full">
								Enquire about this item
							</Link>
						)}
						<Link
							href="/booking"
							className="action-outline min-h-13 w-full justify-center"
						>
							Request an appointment instead
						</Link>
					</div>

					<div className="border-ink/10 text-ink/55 mt-7 grid grid-cols-3 divide-x divide-ink/10 border-y py-5 text-center text-[11px] leading-4 font-semibold">
						<div className="px-2">
							<PiChatCircleDots
								aria-hidden="true"
								className="text-clinic-clay mx-auto mb-2 size-5"
							/>
							Enquire first
						</div>
						<div className="px-2">
							<PiPackage
								aria-hidden="true"
								className="text-clinic-clay mx-auto mb-2 size-5"
							/>
							Studio supplies
						</div>
						<div className="px-2">
							<PiShieldCheck
								aria-hidden="true"
								className="text-clinic-clay mx-auto mb-2 size-5"
							/>
							No live checkout
						</div>
					</div>
				</div>
			</section>

			<section className="border-ink/10 section mt-8 grid gap-10 border-t pt-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
				<div>
					{product.content ? (
						<>
							<p className="clinic-kicker">About this item</p>
							<div className="richtext text-ink/70 mt-4 max-w-3xl">
								<PortableText value={product.content} />
							</div>
						</>
					) : (
						<>
							<p className="clinic-kicker">About this item</p>
							<p className="text-ink/65 mt-4 max-w-2xl text-sm leading-relaxed">
								Studio items are confirmed when you enquire. Availability can
								change, and nothing on this page is a substitute for a clinic
								appointment.
							</p>
						</>
					)}
				</div>

				<div className="border-ink/10 divide-ink/10 divide-y border-y">
					<details open className="group">
						<summary className="text-ink flex list-none cursor-pointer items-center justify-between py-4 text-sm font-semibold">
							Specifications
							<span
								aria-hidden="true"
								className="text-xl font-light transition group-open:rotate-45"
							>
								+
							</span>
						</summary>
						<dl className="space-y-3 pb-5 text-sm">
							{product.category?.title && (
								<div className="flex justify-between gap-4">
									<dt className="text-ink/55">Category</dt>
									<dd>{product.category.title}</dd>
								</div>
							)}
							<div className="flex justify-between gap-4">
								<dt className="text-ink/55">Availability</dt>
								<dd>{availabilityLabels[availability] || availability}</dd>
							</div>
							{!!product.tags?.length && (
								<div className="flex justify-between gap-4">
									<dt className="text-ink/55">Type</dt>
									<dd className="text-right">{product.tags.join(', ')}</dd>
								</div>
							)}
							{(price || product.priceNote) && (
								<div className="flex justify-between gap-4">
									<dt className="text-ink/55">Price</dt>
									<dd className="text-right">
										{price || product.priceNote}
									</dd>
								</div>
							)}
						</dl>
					</details>
					<details className="group">
						<summary className="text-ink flex list-none cursor-pointer items-center justify-between py-4 text-sm font-semibold">
							How to buy
							<span
								aria-hidden="true"
								className="text-xl font-light transition group-open:rotate-45"
							>
								+
							</span>
						</summary>
						<p className="text-ink/65 pb-5 text-sm leading-6">
							Send an enquiry naming this item. We will confirm what is actually
							available and the current price before anything is reserved.
						</p>
					</details>
					<details className="group">
						<summary className="text-ink flex list-none cursor-pointer items-center justify-between py-4 text-sm font-semibold">
							Important note
							<span
								aria-hidden="true"
								className="text-xl font-light transition group-open:rotate-45"
							>
								+
							</span>
						</summary>
						<p className="text-ink/65 pb-5 text-sm leading-6">
							These supplies are not offered as treatment and they are not a
							substitute for a supervised Hijama appointment.
						</p>
					</details>
				</div>
			</section>

			{!!related.length && (
				<section className="section space-y-8 pt-14">
					<div className="flex flex-wrap items-end justify-between gap-4">
						<div>
							<p className="clinic-kicker">Continue browsing</p>
							<h2 className="h3 mt-2">Related items</h2>
						</div>
						<Link
							href={`/${SHOP_DIR}`}
							className="text-accent text-sm font-semibold underline underline-offset-4"
						>
							Back to shop
						</Link>
					</div>
					<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{related.map((item) => (
							<li className="group h-full" key={item._id}>
								<ProductCard product={item} />
							</li>
						))}
					</ul>
				</section>
			)}

			<ProductActionBar
				title={product.title || 'this item'}
				enquireHref={enquireHref}
				whatsappHref={whatsappHref}
			/>
		</div>
	)
}
