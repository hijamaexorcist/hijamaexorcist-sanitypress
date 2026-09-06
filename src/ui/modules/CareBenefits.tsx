import moduleProps from '@/lib/moduleProps'
import { Reveal, RevealItem, Stagger } from '@/ui/motion/Reveal'
import {
	Activity,
	CalendarHeart,
	HandHeart,
	Leaf,
	MessageCircleHeart,
	MoonStar,
	ShieldCheck,
	Stethoscope,
	type LucideIcon,
} from 'lucide-react'

const icons: LucideIcon[] = [
	Activity,
	MessageCircleHeart,
	CalendarHeart,
	ShieldCheck,
	HandHeart,
	Leaf,
	Stethoscope,
	MoonStar,
]

export default function CareBenefits({
	pretitle,
	title,
	description,
	items,
	disclaimer,
	...props
}: Sanity.CareBenefits & Sanity.Module) {
	return (
		<section className="section" {...moduleProps(props)}>
			<div className="clinic-shell bg-clinic-sage/30 p-1.5">
				<div className="clinic-core px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
					<Reveal>
						<header className="mx-auto max-w-3xl text-center text-balance">
							{pretitle && <p className="clinic-kicker">{pretitle}</p>}
							{title && <h2 className="h2 mt-4">{title}</h2>}
							{description && (
								<p className="text-ink/68 mx-auto mt-5 max-w-2xl text-lg leading-relaxed">
									{description}
								</p>
							)}
						</header>
					</Reveal>

					<Stagger
						className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:grid-cols-4"
						delay={0.1}
						stagger={0.06}
					>
						{items?.map((item, index) => {
							const Icon = icons[index % icons.length]
							return (
								<RevealItem key={item._key || `${item.title}-${index}`}>
									<article className="mx-auto flex max-w-xs flex-col items-center text-center">
										<span className="bg-clinic-mist text-clinic-clay ring-ink/8 grid size-14 place-items-center rounded-full ring-1">
											<Icon
												aria-hidden="true"
												className="size-6"
												strokeWidth={1.5}
											/>
										</span>
										{item.title && (
											<h3 className="mt-5 text-base font-semibold tracking-tight">
												{item.title}
											</h3>
										)}
										{item.description && (
											<p className="text-ink/65 mt-2 text-sm leading-relaxed">
												{item.description}
											</p>
										)}
									</article>
								</RevealItem>
							)
						})}
					</Stagger>

					{disclaimer && (
						<Reveal delay={0.2}>
							<p className="text-ink/55 mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-balance">
								{disclaimer}
							</p>
						</Reveal>
					)}
				</div>
			</div>
		</section>
	)
}
