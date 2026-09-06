import moduleProps from '@/lib/moduleProps'
import CTA from '@/ui/CTA'
import { Reveal, Stagger, RevealItem } from '@/ui/motion/Reveal'

type CareJourneyItem = {
	title?: string
	description?: string
}

export default function CareJourney({
	pretitle,
	title,
	description,
	items,
	cta,
	...props
}: {
	pretitle?: string
	title?: string
	description?: string
	items?: CareJourneyItem[]
	cta?: Sanity.CTA
} &
	Sanity.Module) {
	return (
		<section className="section" {...moduleProps(props)}>
			<Reveal>
				<div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(16rem,0.45fr)]">
					<header className="max-w-2xl">
						{pretitle && <p className="clinic-kicker">{pretitle}</p>}
						{title && <h2 className="h2 mt-4 text-balance">{title}</h2>}
						{description && (
							<p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
								{description}
							</p>
						)}
					</header>
					{cta && <CTA {...cta} className="action justify-between max-sm:w-full lg:justify-self-end" />}
				</div>
			</Reveal>

			<Stagger
				delay={0.08}
				stagger={0.1}
				className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 xl:grid-cols-3"
			>
				{items?.map((item, index) => (
					<RevealItem key={`${item.title}-${index}`} className="h-full">
						<div className="clinic-shell h-full p-1.5">
							<div className="clinic-core h-full p-6 md:p-7">
								<span className="grid size-10 place-items-center rounded-full bg-clinic-sage text-sm font-semibold">
									{String(index + 1).padStart(2, '0')}
								</span>
								{item.title && <h3 className="h4 mt-7">{item.title}</h3>}
								{item.description && (
									<p className="mt-3 text-sm leading-relaxed text-ink/70">
										{item.description}
									</p>
								)}
							</div>
						</div>
					</RevealItem>
				))}
			</Stagger>
		</section>
	)
}
