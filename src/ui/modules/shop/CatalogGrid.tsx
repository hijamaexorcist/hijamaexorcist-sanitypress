'use client'

import { stegaClean } from 'next-sanity'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
	PiArrowsDownUp,
	PiCheck,
	PiSlidersHorizontal,
	PiX,
} from 'react-icons/pi'
import { cn } from '@/lib/utils'
import { resolveProductAvailability } from '@/lib/productAvailability'
import ProductCard from './ProductCard'

const availabilityLabels: Record<string, string> = {
	enquire: 'Enquire',
	'in-stock': 'In stock',
	unavailable: 'Unavailable',
}

type FilterOption = { value: string; label: string; count: number }

function Facet({
	title,
	options,
	selected,
	onChange,
	type = 'checkbox',
}: {
	title: string
	options: FilterOption[]
	selected: string[]
	onChange: (value: string) => void
	type?: 'checkbox' | 'radio'
}) {
	if (!options.length) return null

	return (
		<fieldset className="border-ink/8 border-b py-5 last:border-b-0 last:pb-0 first-of-type:pt-0">
			<legend className="text-ink mb-4 text-sm font-semibold tracking-[0.12em] uppercase">
				{title}
			</legend>
			<div className="space-y-3">
				{options.map((option) => {
					const checked = selected.includes(option.value)
					return (
						<label
							key={option.value}
							className="text-ink/65 group flex cursor-pointer items-center gap-3 text-sm"
						>
							<input
								className="peer sr-only"
								type={type}
								name={type === 'radio' ? title : undefined}
								checked={checked}
								onChange={() => onChange(option.value)}
							/>
							<span
								aria-hidden="true"
								className={cn(
									'border-ink/15 bg-canvas group-hover:border-accent peer-focus-visible:outline-clinic-clay grid size-5 shrink-0 place-items-center border transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
									type === 'radio' ? 'rounded-full' : 'rounded-md',
									checked && 'border-accent bg-accent text-canvas',
								)}
							>
								{checked &&
									(type === 'radio' ? (
										<span className="bg-canvas size-2 rounded-full" />
									) : (
										<PiCheck className="size-3.5" />
									))}
							</span>
							<span
								className={cn('flex-1', checked && 'text-ink font-semibold')}
							>
								{option.label}
							</span>
							<span className="bg-ink/5 text-ink/50 min-w-7 rounded-full px-2 py-0.5 text-center text-xs tabular-nums">
								{option.count}
							</span>
						</label>
					)
				})}
			</div>
		</fieldset>
	)
}

export default function CatalogGrid({
	products,
	categories,
	emptyNote,
	showCategoryFilter = true,
	showTagFilter = true,
}: {
	products: Sanity.Product[]
	categories: Sanity.ProductCategory[]
	emptyNote?: string
	showCategoryFilter?: boolean
	showTagFilter?: boolean
}) {
	const [category, setCategory] = useState('all')
	const [tags, setTags] = useState<string[]>([])
	const [availability, setAvailability] = useState<string[]>([])
	const [sort, setSort] = useState('featured')
	const [drawerOpen, setDrawerOpen] = useState(false)
	const drawerRef = useRef<HTMLDivElement>(null)
	const drawerCloseRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!drawerOpen) return
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setDrawerOpen(false)
		}
		document.addEventListener('keydown', onKey)
		drawerCloseRef.current?.focus()
		return () => document.removeEventListener('keydown', onKey)
	}, [drawerOpen])

	const categoryOptions = useMemo<FilterOption[]>(
		() => [
			{ value: 'all', label: 'All categories', count: products.length },
			...categories
				.map((item) => {
					const slug = stegaClean(item.slug?.current) || item._id
					return {
						value: slug,
						label: item.title || 'Untitled',
						count: products.filter(
							(product) =>
								stegaClean(product.category?.slug?.current) === slug,
						).length,
					}
				})
				.filter((item) => item.count > 0),
		],
		[categories, products],
	)

	const tagOptions = useMemo<FilterOption[]>(
		() =>
			[
				...new Set(
					products.flatMap(
						(item) => item.tags?.map((value) => stegaClean(value)) || [],
					),
				),
			]
				.sort()
				.map((value) => ({
					value,
					label: value,
					count: products.filter((product) =>
						product.tags?.some((item) => stegaClean(item) === value),
					).length,
				})),
		[products],
	)

	const availabilityOptions = useMemo<FilterOption[]>(
		() =>
			Object.entries(availabilityLabels)
				.map(([value, label]) => ({
					value,
					label,
					count: products.filter(
						(product) => resolveProductAvailability(product) === value,
					).length,
				}))
				.filter((item) => item.count > 0),
		[products],
	)

	const visible = useMemo(
		() =>
			products
				.filter((item) => {
					const cleanTags = item.tags?.map((value) => stegaClean(value)) || []
					const status = resolveProductAvailability(item)
					return (
						(category === 'all' ||
							stegaClean(item.category?.slug?.current) === category) &&
						(!tags.length || tags.some((value) => cleanTags.includes(value))) &&
						(!availability.length || availability.includes(status))
					)
				})
				.sort((a, b) => {
					if (sort === 'name-asc')
						return stegaClean(a.title || '').localeCompare(
							stegaClean(b.title || ''),
						)
					if (sort === 'name-desc')
						return stegaClean(b.title || '').localeCompare(
							stegaClean(a.title || ''),
						)
					const featured =
						Number(Boolean(b.featured)) - Number(Boolean(a.featured))
					if (featured) return featured
					return (a.displayOrder ?? 100) - (b.displayOrder ?? 100)
				}),
		[availability, category, products, sort, tags],
	)

	const toggle = (
		setter: React.Dispatch<React.SetStateAction<string[]>>,
		value: string,
	) =>
		setter((current) =>
			current.includes(value)
				? current.filter((item) => item !== value)
				: [...current, value],
		)

	const activeCount =
		(category === 'all' ? 0 : 1) + tags.length + availability.length
	const clearAll = () => {
		setCategory('all')
		setTags([])
		setAvailability([])
	}
	const hasFilters = showCategoryFilter || showTagFilter

	const filters = (
		<>
			{showCategoryFilter && (
				<Facet
					title="Category"
					options={categoryOptions}
					selected={[category]}
					type="radio"
					onChange={setCategory}
				/>
			)}
			{showTagFilter && (
				<Facet
					title="Type"
					options={tagOptions}
					selected={tags}
					onChange={(value) => toggle(setTags, value)}
				/>
			)}
			<Facet
				title="Availability"
				options={availabilityOptions}
				selected={availability}
				onChange={(value) => toggle(setAvailability, value)}
			/>
		</>
	)

	return (
		<div>
			<div className="border-ink/10 mb-6 flex flex-wrap items-center justify-between gap-4 border-y py-4">
				<div className="flex items-center gap-3">
					{hasFilters && (
						<button
							type="button"
							aria-expanded={drawerOpen}
							onClick={() => setDrawerOpen(true)}
							className="border-ink/12 bg-canvas text-ink inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold shadow-sm lg:hidden"
						>
							<PiSlidersHorizontal className="size-5" />
							Filters
							{activeCount > 0 && (
								<span className="bg-accent text-canvas grid size-5 place-items-center rounded-full text-[11px]">
									{activeCount}
								</span>
							)}
						</button>
					)}
					<p aria-live="polite" className="text-ink/55 text-sm">
						<strong className="text-ink font-semibold">{visible.length}</strong>{' '}
						{visible.length === 1 ? 'item' : 'items'}
					</p>
				</div>
				<label className="text-ink/55 flex items-center gap-2 text-sm">
					<PiArrowsDownUp className="size-4" />
					<span className="sr-only sm:not-sr-only">Sort by</span>
					<select
						value={sort}
						onChange={(event) => setSort(event.target.value)}
						className="border-ink/12 bg-canvas text-ink focus:border-accent focus:ring-accent/20 rounded-full border py-2.5 pr-9 pl-4 font-semibold shadow-sm outline-none focus:ring-2"
					>
						<option value="featured">Featured</option>
						<option value="name-asc">Name: A–Z</option>
						<option value="name-desc">Name: Z–A</option>
					</select>
				</label>
			</div>

			{activeCount > 0 && (
				<div
					className="mb-7 flex flex-wrap items-center gap-2"
					aria-label="Active filters"
				>
					{category !== 'all' && (
						<FilterChip
							label={
								categoryOptions.find((item) => item.value === category)
									?.label || category
							}
							onRemove={() => setCategory('all')}
						/>
					)}
					{tags.map((value) => (
						<FilterChip
							key={value}
							label={value}
							onRemove={() => toggle(setTags, value)}
						/>
					))}
					{availability.map((value) => (
						<FilterChip
							key={value}
							label={availabilityLabels[value] || value}
							onRemove={() => toggle(setAvailability, value)}
						/>
					))}
					<button
						type="button"
						onClick={clearAll}
						className="text-accent ml-1 text-sm font-semibold underline underline-offset-4"
					>
						Clear all
					</button>
				</div>
			)}

			<div
				className={cn(
					hasFilters &&
						'lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-10',
				)}
			>
				{hasFilters && (
					<aside
						aria-label="Shop filters"
						className="clinic-core border-ink/8 sticky-below-header hidden border p-5 lg:block"
						style={{ '--offset': '1.5rem' } as React.CSSProperties}
					>
						<div className="mb-5 flex items-center justify-between">
							<h3 className="text-ink flex items-center gap-2 text-base font-semibold">
								<PiSlidersHorizontal />
								Filter
							</h3>
							{activeCount > 0 && (
								<button
									type="button"
									onClick={clearAll}
									className="text-accent text-xs font-semibold underline underline-offset-4"
								>
									Clear
								</button>
							)}
						</div>
						{filters}
					</aside>
				)}

				<div>
					{visible.length ? (
						<ul
							className={cn(
								'grid gap-5 sm:grid-cols-2',
								hasFilters ? 'xl:grid-cols-3' : 'lg:grid-cols-3',
							)}
						>
							{visible.map((product) => (
								<li className="group h-full" key={product._id}>
									<ProductCard product={product} />
								</li>
							))}
						</ul>
					) : (
						<div className="border-ink/15 bg-canvas/60 rounded-[1.5rem] border border-dashed p-10 text-center">
							<p className="text-ink font-semibold">
								No items match your filters.
							</p>
							<p className="text-ink/55 mt-2 text-sm">
								{emptyNote || 'Try clearing a filter or enquire for supplies.'}
							</p>
							<button
								type="button"
								onClick={clearAll}
								className="text-accent mt-4 text-sm font-semibold underline underline-offset-4"
							>
								Reset filters
							</button>
						</div>
					)}
				</div>
			</div>

			{drawerOpen && (
				<div
					className="fixed inset-0 z-[100] lg:hidden"
					role="dialog"
					aria-modal="true"
					aria-labelledby="shop-filter-drawer-title"
				>
					<button
						type="button"
						aria-label="Close filters"
						className="absolute inset-0 bg-[#101b17]/55 backdrop-blur-sm"
						onClick={() => setDrawerOpen(false)}
					/>
					<div
						ref={drawerRef}
						className="bg-canvas absolute inset-y-0 right-0 flex w-[min(90vw,24rem)] flex-col shadow-2xl"
					>
						<div className="border-ink/10 flex items-center justify-between border-b px-5 py-4">
							<div>
								<h2
									id="shop-filter-drawer-title"
									className="text-ink text-xl font-semibold"
								>
									Filter
								</h2>
								<p className="text-ink/55 text-xs">{visible.length} results</p>
							</div>
							<button
								ref={drawerCloseRef}
								type="button"
								aria-label="Close filters"
								onClick={() => setDrawerOpen(false)}
								className="border-ink/12 bg-canvas grid size-11 place-items-center rounded-full border"
							>
								<PiX className="size-5" />
							</button>
						</div>
						<div className="flex-1 overflow-y-auto px-5 py-6">{filters}</div>
						<div className="border-ink/10 bg-clinic-mist/40 grid grid-cols-2 gap-3 border-t p-4">
							<button
								type="button"
								onClick={clearAll}
								disabled={!activeCount}
								className="border-ink/12 min-h-12 rounded-full border px-4 text-sm font-semibold disabled:opacity-40"
							>
								Clear all
							</button>
							<button
								type="button"
								onClick={() => setDrawerOpen(false)}
								className="bg-accent text-canvas min-h-12 rounded-full px-4 text-sm font-semibold"
							>
								Show {visible.length} results
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

function FilterChip({
	label,
	onRemove,
}: {
	label: string
	onRemove: () => void
}) {
	return (
		<button
			type="button"
			onClick={onRemove}
			aria-label={`Remove ${label} filter`}
			className="border-accent/35 bg-accent/10 text-accent hover:border-accent inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
		>
			<span>{label}</span>
			<PiX className="size-3.5" />
		</button>
	)
}
