import moduleProps from '@/lib/moduleProps'
import { ResponsiveImg } from '@/ui/Img'
import { Reveal, RevealItem, Stagger } from '@/ui/motion/Reveal'
import { cn } from '@/lib/utils'

type GalleryFigure = {
	_key?: string
	image?: Sanity.Img
	caption?: string
}

export default function ClinicGallery({
	pretitle,
	title,
	description,
	images,
	...props
}: {
	pretitle?: string
	title?: string
	description?: string
	images?: GalleryFigure[]
} & Sanity.Module) {
	const figures = images?.filter((figure) => figure.image) ?? []
	if (!figures.length) return null

	return (
		<section className="section" {...moduleProps(props)}>
			<Reveal>
				<header className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(16rem,0.45fr)] lg:items-end">
					<div>
						{pretitle && <p className="clinic-kicker">{pretitle}</p>}
						<h2 className="h2 mt-4 max-w-3xl text-balance">{title}</h2>
					</div>
					{description && (
						<p className="text-ink/68 max-w-lg leading-relaxed">
							{description}
						</p>
					)}
				</header>
			</Reveal>
			<Stagger
				className="mt-10 grid auto-rows-[minmax(12rem,auto)] gap-4 sm:mt-12 md:grid-cols-2 lg:grid-cols-3"
				delay={0.08}
				stagger={0.08}
			>
				{figures.map((figure, index) => (
					<RevealItem
						key={figure._key || index}
						className={cn(
							index === 0 && 'md:col-span-2 lg:row-span-2',
						)}
					>
						<figure className="clinic-shell h-full overflow-hidden p-1.5">
							<ResponsiveImg
								img={figure.image}
								className={cn(
									'clinic-core size-full object-cover',
									index === 0
										? 'min-h-[16rem] sm:min-h-[20rem] lg:min-h-[28rem]'
										: 'min-h-[12rem] sm:min-h-[16rem]',
								)}
								width={index === 0 ? 1600 : 900}
							/>
							{figure.caption && (
								<figcaption className="text-ink/60 px-4 py-3 text-sm">
									{figure.caption}
								</figcaption>
							)}
						</figure>
					</RevealItem>
				))}
			</Stagger>
		</section>
	)
}
