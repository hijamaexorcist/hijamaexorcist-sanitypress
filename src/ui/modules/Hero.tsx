import moduleProps from '@/lib/moduleProps'
import { ResponsiveImg } from '@/ui/Img'
import { PortableText, stegaClean } from 'next-sanity'
import CTAList from '@/ui/CTAList'
import Pretitle from '@/ui/Pretitle'
import { Reveal } from '@/ui/motion/Reveal'
import CustomHTML from './CustomHTML'
import Reputation from '@/ui/Reputation'
import { cn } from '@/lib/utils'

export default function Hero({
	pretitle,
	content,
	ctas,
	assets,
	textAlign: ta = 'center',
	alignItems: ai,
	...props
}: Partial<{
	pretitle: string
	content: any
	ctas: Sanity.CTA[]
	assets: Sanity.Img[]
	textAlign: React.CSSProperties['textAlign']
	alignItems: React.CSSProperties['alignItems']
}> &
	Sanity.Module) {
	const hasImage = !!assets?.[0]
	const asset = assets?.[0]

	const textAlign = stegaClean(ta)
	const alignItems = stegaClean(ai)

	return (
		<section
			className={cn(
				'relative isolate',
				hasImage &&
					'min-h-[min(760px,calc(100dvh-var(--header-height)))]',
			)}
			{...moduleProps(props)}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 -top-[var(--header-height,5.5rem)] bottom-0 overflow-hidden"
			>
				<div className="clinic-hero-atmosphere" />
			</div>
			<div
				className={cn(
					'section relative grid items-center gap-10',
					hasImage
						? 'md:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.8fr)] md:gap-16'
						: 'py-12 md:py-16',
				)}
			>
				{hasImage && (
					<div className="clinic-shell order-first overflow-hidden md:order-last md:rotate-[1.5deg]">
						<ResponsiveImg
							img={asset}
							className="clinic-core aspect-[4/5] size-full object-cover"
							width={2400}
							draggable={false}
						/>
					</div>
				)}

				{content && (
					<div className="flex w-full flex-col text-balance">
						<Reveal immediate className="w-full">
						<div
							className={cn(
								'richtext headings:text-balance relative isolate max-w-2xl',
								{
									'mb-8': alignItems === 'start',
									'my-auto': alignItems === 'center',
									'mt-auto': alignItems === 'end',
									'me-auto': ['left', 'start'].includes(textAlign),
									'mx-auto': textAlign === 'center',
									'ms-auto': ['right', 'end'].includes(textAlign),
								},
							)}
							style={{ textAlign }}
						>
							<Pretitle className="clinic-kicker">{pretitle}</Pretitle>

							<PortableText
								value={content}
								components={{
									types: {
										'custom-html': ({ value }) => <CustomHTML {...value} />,
										'reputation-block': ({ value }) => (
											<Reputation
												className={cn(
													'!mt-4',
													hasImage && '[&_strong]:text-amber-400',
													{
														'justify-start': ['left', 'start'].includes(
															textAlign,
														),
														'justify-center': textAlign === 'center',
														'justify-end': ['right', 'end'].includes(textAlign),
													},
												)}
												reputation={value.reputation}
											/>
										),
									},
								}}
							/>

							<CTAList
								ctas={ctas}
								className={cn('!mt-4', {
									'justify-start': textAlign === 'left',
									'justify-center': textAlign === 'center',
									'justify-end': textAlign === 'right',
								})}
							/>
						</div>
						</Reveal>
					</div>
				)}
			</div>
		</section>
	)
}
