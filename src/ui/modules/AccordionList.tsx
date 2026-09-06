import moduleProps from '@/lib/moduleProps'
import Pretitle from '@/ui/Pretitle'
import CTAList from '@/ui/CTAList'
import { PortableText } from 'next-sanity'
import { Reveal } from '@/ui/motion/Reveal'
import Image from './RichtextModule/Image'
import Code from './RichtextModule/Code'
import CustomHTML from './CustomHTML'
import { cn } from '@/lib/utils'

export default function AccordionList({
	pretitle,
	intro,
	ctas,
	items,
	layout = 'vertical',
	connect,
	generateSchema,
	...props
}: Partial<{
	pretitle: string
	intro: any
	ctas: Sanity.CTA[]
	items: {
		_key?: string
		summary: string
		content: any
		open?: boolean
	}[]
	layout: 'vertical' | 'horizontal'
	connect: boolean
	generateSchema: boolean
}> &
	Sanity.Module) {
	return (
		<section
			className={cn(
				'section',
				layout === 'horizontal' ? 'grid gap-8 lg:grid-cols-2' : 'space-y-8',
			)}
			{...(generateSchema && {
				itemScope: true,
				itemType: 'https://schema.org/FAQPage',
			})}
			{...moduleProps(props)}
		>
			<Reveal>
				<header
					className={cn(
						'richtext',
						layout === 'horizontal'
							? 'md:sticky-below-header self-start [--offset:1rem]'
							: 'text-center',
					)}
				>
					<Pretitle className="clinic-kicker">{pretitle}</Pretitle>
					<PortableText value={intro} />
					<CTAList
						className={cn(
							'mt-6',
							layout === 'horizontal' ? '' : 'justify-center',
						)}
						ctas={ctas}
					/>
				</header>
			</Reveal>

			<div className="mx-auto w-full max-w-screen-md">
				{items?.map(({ _key, summary, content, open }, index) => (
					<details
						key={_key ?? `${props._key ?? 'accordion'}-${index}`}
						className="accordion border-ink/10 border-b"
						name={connect ? props._key : undefined}
						open={open}
						{...(generateSchema && {
							itemScope: true,
							itemProp: 'mainEntity',
							itemType: 'https://schema.org/Question',
						})}
					>
						<summary
							className="py-4 font-bold"
							{...(generateSchema && { itemProp: 'name' })}
						>
							{summary}
						</summary>

						<div
							className="anim-fade-to-b pb-4"
							{...(generateSchema && {
								itemScope: true,
								itemProp: 'acceptedAnswer',
								itemType: 'https://schema.org/Answer',
							})}
						>
							<div
								className="richtext"
								{...(generateSchema && {
									itemProp: 'text',
								})}
							>
								<PortableText
									value={content}
									components={{
										types: {
											image: Image,
											code: Code,
											'custom-html': ({ value }) => (
												<CustomHTML
													className="has-[table]:md:[grid-column:bleed] has-[table]:md:mx-auto"
													{...value}
												/>
											),
										},
									}}
								/>
							</div>
						</div>
					</details>
				))}
			</div>
		</section>
	)
}
