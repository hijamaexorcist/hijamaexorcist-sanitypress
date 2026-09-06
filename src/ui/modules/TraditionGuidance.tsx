import moduleProps from '@/lib/moduleProps'
import { stegaClean } from 'next-sanity'
import { BookOpen, ExternalLink } from 'lucide-react'
import { Reveal } from '@/ui/motion/Reveal'

export default function TraditionGuidance({
	pretitle,
	title,
	quote,
	reference,
	sourceUrl,
	context,
	quranNote,
	quranUrl,
	...props
}: Sanity.TraditionGuidance & Sanity.Module) {
	return (
		<section className="full-bleed bg-ink text-canvas" {...moduleProps(props)}>
			<div className="section grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(20rem,0.58fr)] lg:items-center lg:gap-12">
				<Reveal>
					<div>
						{pretitle && (
							<p className="clinic-kicker !text-[#dda187]">{pretitle}</p>
						)}
						<h2 className="h2 mt-4 max-w-2xl text-balance">{title}</h2>
						{context && (
							<p className="text-canvas/72 mt-6 max-w-xl text-lg leading-relaxed">
								{context}
							</p>
						)}
					</div>
				</Reveal>
				<Reveal delay={0.12}>
					<figure className="border-canvas/12 bg-canvas/[0.06] rounded-[2rem] border p-7 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08)] md:p-10">
						<BookOpen
							aria-hidden="true"
							className="size-7 text-[#dda187]"
							strokeWidth={1.5}
						/>
						<blockquote className="mt-8 font-serif text-[1.65rem] leading-[1.12] text-balance sm:text-3xl md:text-4xl">
							“{quote}”
						</blockquote>
						<figcaption className="border-canvas/12 text-canvas/65 mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-5 text-sm">
							<span>{reference}</span>
							<a
								className="hover:text-canvas focus-visible:outline-clinic-clay inline-flex min-h-11 items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4"
								href={stegaClean(sourceUrl)}
								target="_blank"
								rel="noreferrer"
							>
								Read the source{' '}
								<ExternalLink aria-hidden="true" className="size-4" />
							</a>
						</figcaption>
					</figure>
				</Reveal>
				{quranNote && (
					<div className="border-canvas/12 text-canvas/65 border-t pt-8 text-sm leading-relaxed lg:col-span-2">
						<p className="max-w-4xl">
							{quranNote}{' '}
							{quranUrl && (
								<a
									className="hover:text-canvas underline underline-offset-4"
									href={stegaClean(quranUrl)}
									target="_blank"
									rel="noreferrer"
								>
									Qur’an 17:82
								</a>
							)}
						</p>
					</div>
				)}
			</div>
		</section>
	)
}
