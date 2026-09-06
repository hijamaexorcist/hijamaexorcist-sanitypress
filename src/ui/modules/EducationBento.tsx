import moduleProps from '@/lib/moduleProps'
import { ResponsiveImg } from '@/ui/Img'
import {
	BookOpenText,
	ClipboardCheck,
	HeartPulse,
	ShieldAlert,
} from 'lucide-react'
import { Reveal, RevealItem, Stagger } from '@/ui/motion/Reveal'

const icons = [BookOpenText, ClipboardCheck, HeartPulse, ShieldAlert]

export default function EducationBento({
	pretitle,
	title,
	description,
	image,
	topics,
	...props
}: Sanity.EducationBento & Sanity.Module) {
	return (
		<section className="section" {...moduleProps(props)}>
			<Reveal>
				<header className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(16rem,0.45fr)] lg:items-end">
					<div>
						{pretitle && <p className="clinic-kicker">{pretitle}</p>}
						<h2 className="h2 mt-4 max-w-3xl text-balance">{title}</h2>
					</div>
					{description && (
						<p className="text-ink/68 max-w-lg text-base leading-relaxed">
							{description}
						</p>
					)}
				</header>
			</Reveal>
			<Stagger
				className="mt-10 grid auto-rows-[minmax(12rem,auto)] gap-4 sm:mt-12 lg:grid-cols-3"
				delay={0.08}
				stagger={0.08}
			>
				{image && (
					<RevealItem className="clinic-shell overflow-hidden p-1.5 lg:col-span-2 lg:row-span-2">
						<ResponsiveImg
							img={image}
							className="clinic-core size-full min-h-[16rem] object-cover sm:min-h-[20rem] lg:min-h-[28rem]"
							width={1500}
						/>
					</RevealItem>
				)}
				{topics?.map((topic, index) => {
					const Icon = icons[index % icons.length]
					return (
						<RevealItem
							className={index === topics.length - 1 ? 'lg:col-span-2' : ''}
							key={topic._key}
						>
							<article className="clinic-core border-ink/8 h-full rounded-[1.75rem] border p-6 shadow-[0_18px_45px_rgb(35_51_43_/_0.06),inset_0_1px_0_rgb(255_255_255_/_0.8)] md:p-7">
								<div className="flex items-start justify-between gap-4">
									<Icon
										aria-hidden="true"
										className="text-clinic-clay size-6"
										strokeWidth={1.5}
									/>
									{topic.label && (
										<span className="text-ink/48 text-[0.68rem] font-semibold tracking-[0.14em] uppercase">
											{topic.label}
										</span>
									)}
								</div>
								<h3 className="h4 mt-10">{topic.title}</h3>
								<p className="text-ink/68 mt-3 max-w-lg text-sm leading-relaxed">
									{topic.description}
								</p>
							</article>
						</RevealItem>
					)
				})}
			</Stagger>
		</section>
	)
}
