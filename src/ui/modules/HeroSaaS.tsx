import moduleProps from '@/lib/moduleProps'
import Pretitle from '@/ui/Pretitle'
import CTA from '@/ui/CTA'
import { PortableText } from 'next-sanity'
import { Reveal, Stagger, RevealItem } from '@/ui/motion/Reveal'
import Code from './RichtextModule/Code'
import CustomHTML from './CustomHTML'
import Reputation from '@/ui/Reputation'
import { ResponsiveImg } from '@/ui/Img'
import { cn } from '@/lib/utils'

export default function HeroSaaS({
	pretitle,
	content,
	ctas,
	assets,
	assetFaded,
	...props
}: Partial<{
	pretitle: string
	content: any
	ctas: Sanity.CTA[]
	assets: Sanity.Img[]
	assetFaded?: boolean
}> &
	Sanity.Module) {
	const asset = assets?.[0]
	const getLabel = (cta: Sanity.CTA) =>
		cta.link?.label || cta.link?.internal?.title || cta.link?.external || ''
	const primaryCta =
		ctas?.find((cta) => /book|appointment/i.test(getLabel(cta))) || ctas?.[0]
	const secondaryCta = ctas?.find((cta) => cta._key !== primaryCta?._key)
	const primaryCtaProps = primaryCta ? { ...primaryCta, style: 'action' } : undefined
	const secondaryCtaProps = secondaryCta
		? { ...secondaryCta, style: 'ghost' }
		: undefined

	return (
		<section
			className="relative isolate overflow-hidden bg-clinic-mist/65"
			{...moduleProps(props)}
		>
			<div aria-hidden="true" className="clinic-hero-atmosphere" />
			<div className="section relative grid items-center gap-10 py-12 sm:py-16 lg:min-h-[min(760px,calc(100dvh-var(--header-height)))] lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.75fr)] lg:gap-12 lg:py-24">
				<Reveal immediate className="richtext max-w-2xl text-balance">
					<Pretitle className="clinic-kicker">{pretitle}</Pretitle>
					<PortableText
						value={content}
						components={{
							types: {
								code: ({ value }) => (
									<Code
										value={value}
										className="mt-6! max-w-max"
										theme="snazzy-light"
									/>
								),
								'custom-html': ({ value }) => <CustomHTML {...value} />,
								'reputation-block': ({ value }) => (
									<Reputation className="!mt-5" reputation={value.reputation} />
								),
							},
						}}
					/>

					<div className="mt-8 flex flex-wrap items-center gap-4">
						{primaryCtaProps && (
							<CTA
								{...primaryCtaProps}
								className="action min-w-52"
							/>
						)}
						{secondaryCtaProps && (
							<CTA
								{...secondaryCtaProps}
								className="ghost px-1 font-semibold underline underline-offset-4"
							/>
						)}
					</div>
					<a
						className="mt-7 inline-flex text-sm font-semibold text-ink/70 underline underline-offset-4 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-ink"
						href="#your-visit"
					>
						First time? See what to expect
					</a>
				</Reveal>

				<div className="relative">
					{asset?._type === 'img' ? (
						<div className="clinic-shell overflow-hidden">
							<ResponsiveImg
								img={asset}
								pictureProps={{
									className: cn(
										'clinic-core block overflow-hidden [&_img]:aspect-[16/10] [&_img]:w-full [&_img]:object-cover sm:[&_img]:aspect-[5/4] lg:[&_img]:aspect-[4/5]',
										assetFaded && '[&_img]:opacity-85',
									),
								}}
								width={1600}
								draggable={false}
							/>
						</div>
					) : (
						<Reveal immediate delay={0.18} className="clinic-shell p-1.5">
							<div className="clinic-core p-7 md:p-10">
								<p className="clinic-kicker">Your first visit</p>
								<h2 className="h3 mt-5">
									A considered appointment, from the first question.
								</h2>
								<Stagger
									immediate
									delay={0.28}
									stagger={0.1}
									className="mt-8 space-y-5"
								>
									{[
										'Tell us what you need',
										'Choose a time that works',
										'Receive clear confirmation details',
									].map((step, index) => (
										<RevealItem
											className="grid grid-cols-[auto_1fr] items-center gap-4"
											key={step}
										>
											<span className="grid size-9 place-items-center rounded-full bg-clinic-sage text-sm font-semibold">
												{index + 1}
											</span>
											<span className="text-sm font-semibold text-ink/75">{step}</span>
										</RevealItem>
									))}
								</Stagger>
							</div>
						</Reveal>
					)}
				</div>
			</div>
		</section>
	)
}
