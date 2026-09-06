import Pretitle from '@/ui/Pretitle'
import { PortableText } from 'next-sanity'
import TabList from './TabList'
import Wrapper from './Wrapper'
import CTAList from '@/ui/CTAList'
import Asset from '@/ui/modules/Asset'
import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'

export default function TabbedContent({
	pretitle,
	intro,
	tabs,
	...props
}: Partial<{
	pretitle: string
	intro: any
	tabs: Partial<{
		label: string
		pretitle: string
		content: any
		ctas: Sanity.CTA[]
		assets: Array<Sanity.Img | Sanity.Code | Sanity.CustomHTML>
		assetOnRight: boolean
		assetBelowContent: boolean
	}>[]
}> &
	Sanity.Module) {
	return (
		<section
			className="full-bleed bg-clinic-sage/35"
			{...moduleProps(props)}
		>
			<div className="section space-y-10 md:space-y-12">
				{(pretitle || intro) && (
					<header className="richtext mx-auto max-w-3xl text-center text-balance">
						<Pretitle className="clinic-kicker">{pretitle}</Pretitle>
						<PortableText value={intro} />
					</header>
				)}

				<TabList tabs={tabs} />

				{tabs?.map(
					(tab, index) =>
						!!tab && (
							<Wrapper className="clinic-shell p-1.5" index={index} key={index}>
								<div
									className={cn(
										'clinic-core grid items-center gap-6 overflow-hidden p-5 sm:p-6 lg:min-h-[25rem] lg:gap-8 lg:p-10',
										tab.assets?.[0] && 'lg:grid-cols-2 lg:gap-x-12',
									)}
								>
									{tab.assets?.[0] && (
										<figure
											className={cn(
												'anim-fade-to-r overflow-hidden rounded-[1.5rem]',
												tab.assetOnRight &&
													'lg:anim-fade-to-l lg:order-last',
												tab.assetBelowContent && 'max-lg:order-last',
											)}
										>
											<Asset asset={tab.assets[0]} />
										</figure>
									)}

									<div
										className={cn(
											'richtext anim-fade-to-r w-full max-w-2xl',
											!tab.assetOnRight && 'lg:anim-fade-to-l',
											!tab.assets?.[0] && 'mx-auto',
											'[&_ul]:mt-6 [&_ul]:grid [&_ul]:grid-cols-1 [&_ul]:gap-3 md:[&_ul]:grid-cols-2',
											'[&_li]:rounded-2xl [&_li]:bg-clinic-sage/40 [&_li]:px-4 [&_li]:py-3 [&_li]:text-sm [&_li]:leading-relaxed [&_li]:marker:text-clinic-clay',
										)}
									>
										<div className="mb-5 flex items-center gap-4 border-b border-ink/8 pb-5">
											<span className="font-serif text-4xl leading-none text-clinic-clay/45 sm:text-5xl">
												{String(index + 1).padStart(2, '0')}
											</span>
											<Pretitle className="clinic-kicker">{tab.pretitle}</Pretitle>
										</div>
										<PortableText value={tab.content} />
										<CTAList className="mt-7" ctas={tab.ctas} />
									</div>
								</div>
							</Wrapper>
						),
				)}
			</div>
		</section>
	)
}
