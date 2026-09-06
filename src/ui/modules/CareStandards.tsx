import moduleProps from '@/lib/moduleProps'
import { Reveal, Stagger, RevealItem } from '@/ui/motion/Reveal'
import {
	BookOpenCheck,
	HeartHandshake,
	ShieldAlert,
	Sparkles,
	type LucideIcon,
} from 'lucide-react'

type CareStandard = {
	title?: string
	description?: string
}

const icons: LucideIcon[] = [
	BookOpenCheck,
	ShieldAlert,
	HeartHandshake,
	Sparkles,
]

export default function CareStandards({
	pretitle,
	title,
	description,
	standards,
	...props
}: {
	pretitle?: string
	title?: string
	description?: string
	standards?: CareStandard[]
} & Sanity.Module) {
	return (
		<section className="section" {...moduleProps(props)}>
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
				className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 xl:grid-cols-4"
				delay={0.08}
				stagger={0.07}
			>
				{standards?.map((standard, index) => {
					const Icon = icons[index % icons.length]
					return (
						<RevealItem key={`${standard.title}-${index}`}>
							<article className="clinic-core border-ink/8 flex h-full flex-col rounded-[1.75rem] border p-6 md:p-7">
								<span className="bg-clinic-sage/55 text-clinic-clay grid size-12 place-items-center rounded-2xl">
									<Icon
										aria-hidden="true"
										className="size-6"
										strokeWidth={1.5}
									/>
								</span>
								{standard.title && (
									<h3 className="mt-6 text-base font-semibold tracking-tight">
										{standard.title}
									</h3>
								)}
								{standard.description && (
									<p className="text-ink/68 mt-3 text-sm leading-relaxed">
										{standard.description}
									</p>
								)}
							</article>
						</RevealItem>
					)
				})}
			</Stagger>
		</section>
	)
}
