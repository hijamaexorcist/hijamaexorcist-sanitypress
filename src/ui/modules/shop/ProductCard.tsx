import { Img } from '@/ui/Img'
import Link from 'next/link'
import resolveUrl from '@/lib/resolveUrl'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { resolveProductAvailability } from '@/lib/productAvailability'

const availabilityLabels: Record<string, string> = {
	enquire: 'Enquire',
	'in-stock': 'In stock',
	unavailable: 'Unavailable',
}

export default function ProductCard({
	product,
}: {
	product: Sanity.Product
}) {
	const href = resolveUrl(product, { base: false })
	const price =
		typeof product.price === 'number' && !Number.isNaN(product.price)
			? formatCurrency(product.price).replace(/\.00$/, '')
			: null
	const availability = resolveProductAvailability(product)
	const unavailable = availability === 'unavailable'

	return (
		<article className="clinic-core border-ink/8 relative isolate flex h-full flex-col overflow-hidden rounded-[1.75rem] border">
			<figure className="bg-ink/3 relative aspect-[4/3] overflow-hidden">
				<Img
					className="aspect-[4/3] size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.025]"
					image={product.image}
					width={800}
					alt={product.image?.alt || product.title}
				/>
				<div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
					{product.featured ? (
						<span className="bg-accent text-canvas rounded-full px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase">
							Featured
						</span>
					) : (
						<span />
					)}
					{unavailable && (
						<span className="bg-canvas text-ink rounded-full px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase">
							Unavailable
						</span>
					)}
				</div>
			</figure>

			<div className="flex grow flex-col p-6">
				{product.category?.title && (
					<p className="text-clinic-clay text-[0.68rem] font-semibold tracking-[0.14em] uppercase">
						{product.category.title}
					</p>
				)}
				<h3 className="h4 mt-2">
					<Link className="group-hover:underline" href={href}>
						<span className="absolute inset-0" />
						{product.title}
					</Link>
				</h3>
				{product.excerpt && (
					<p className="text-ink/68 mt-3 line-clamp-3 text-sm leading-relaxed">
						{product.excerpt}
					</p>
				)}
				<div className="mt-auto flex items-end justify-between gap-3 pt-5">
					<p
						className={cn(
							'text-sm font-semibold',
							!price && 'text-ink/55',
						)}
					>
						{price || product.priceNote || 'Enquire for availability'}
					</p>
					{!price && (
						<span className="text-ink/45 text-xs">
							{availabilityLabels[availability] || 'Enquire'}
						</span>
					)}
				</div>
			</div>
		</article>
	)
}
