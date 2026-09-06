import moduleProps from '@/lib/moduleProps'
import { stegaClean } from 'next-sanity'
import { Instagram } from 'lucide-react'
import { ResponsiveImg } from '@/ui/Img'
import CTAList from '@/ui/CTAList'
import { Reveal, RevealItem, Stagger } from '@/ui/motion/Reveal'

export default function ClinicianProfile({
	pretitle,
	name,
	role,
	title,
	bio,
	bioSecondary,
	portrait,
	instagramUrl,
	notes,
	ctas,
	...props
}: Sanity.ClinicianProfile & Sanity.Module) {
	const instagram = stegaClean(instagramUrl)
	const heading = title || name

	return (
		<section className="section" {...moduleProps(props)}>
			<Reveal>
				<div className="flex items-center justify-between gap-4">
					{pretitle && <p className="clinic-kicker">{pretitle}</p>}
					{instagram && (
						<a
							href={instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-clinic-sage text-ink hover:bg-clinic-mist focus-visible:outline-clinic-clay grid size-11 place-items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
							aria-label="Follow Hijama Exorcist on Instagram"
						>
							<Instagram
								className="size-4"
								strokeWidth={1.75}
								aria-hidden="true"
							/>
						</a>
					)}
				</div>

				{portrait?.image?.asset && (
					<figure className="clinic-shell mt-6 overflow-hidden">
						<ResponsiveImg
							img={portrait}
							className="clinic-core aspect-[4/5] size-full object-cover object-[center_18%] md:aspect-[16/9]"
							width={1600}
							alt={
								portrait.image.alt ||
								`${name || 'The practitioner'} portrait`
							}
						/>
					</figure>
				)}

				{!!notes?.length && (
					<ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
						{notes.map((note) => (
							<li
								className="text-ink/70 flex items-center gap-2 text-sm"
								key={note}
							>
								<span
									className="bg-clinic-clay size-1.5 shrink-0 rounded-full"
									aria-hidden="true"
								/>
								{note}
							</li>
						))}
					</ul>
				)}

				<div className="mt-10 grid gap-10 lg:grid-cols-3 lg:items-start">
					<div className="lg:col-span-2">
						{heading && (
							<h2 className="h2 max-w-3xl text-balance">{heading}</h2>
						)}
						<Stagger
							className="mt-8 grid gap-6 md:grid-cols-2"
							delay={0.08}
							stagger={0.08}
						>
							{bio && (
								<RevealItem>
									<p className="text-ink/72 max-w-prose text-base leading-relaxed">
										{bio}
									</p>
								</RevealItem>
							)}
							{bioSecondary && (
								<RevealItem>
									<p className="text-ink/72 max-w-prose text-base leading-relaxed">
										{bioSecondary}
									</p>
								</RevealItem>
							)}
						</Stagger>
					</div>

					<div className="lg:pt-2 lg:text-right">
						{name && title && (
							<p className="font-serif text-3xl">{name}</p>
						)}
						{role && (
							<p className="text-ink/62 mt-2 text-sm leading-relaxed">
								{role}
							</p>
						)}
						<CTAList
							ctas={ctas}
							className="mt-8 lg:justify-end"
						/>
					</div>
				</div>
			</Reveal>
		</section>
	)
}
