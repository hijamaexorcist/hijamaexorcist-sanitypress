import { getSite } from '@/sanity/lib/queries'
import Wrapper from './Wrapper'
import Link from 'next/link'
import { Img } from '@/ui/Img'
import Navigation from './Navigation'
import CTAList from '@/ui/CTAList'
import Toggle from './Toggle'
import { cn } from '@/lib/utils'
import css from './Header.module.css'
import ThemeToggle from '@/ui/ThemeToggle'

export default async function Header() {
	const { title, logo, ctas } = await getSite()

	const logoImage = logo?.image?.dark || logo?.image?.default

	return (
		<Wrapper className="sticky top-0 z-50 px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8 md:pt-6">
			<div
				className={cn(
					css.header,
					'bg-canvas/92 ring-ink/8 max-lg:header-open:rounded-[2rem] max-lg:header-open:shadow-[0_24px_60px_rgb(24_53_43_/_0.16)] mx-auto grid max-w-screen-xl items-center gap-x-4 rounded-full px-4 py-3 shadow-[0_16px_38px_rgb(35_51_43_/_0.08)] ring-1 backdrop-blur-lg transition-shadow duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:px-5 lg:gap-x-6 lg:px-7',
				)}
			>
				<div className="[grid-area:logo]">
					<Link
						className={cn(
							'inline-flex min-h-11 min-w-0 items-center gap-3 font-serif tracking-[-0.04em]',
							logo?.image && 'max-w-3xs',
						)}
						href="/"
					>
						{logoImage ? (
							<>
								<Img
									className="inline-block max-h-8 w-auto shrink-0"
									image={logoImage}
									alt=""
								/>
								<span className="text-ink truncate text-lg leading-none font-semibold md:text-xl">
									{title || logo?.name}
								</span>
							</>
						) : (
							<span className="text-xl leading-none font-semibold md:text-2xl">
								{title}
							</span>
						)}
					</Link>
				</div>

				<Navigation />

				<CTAList
					ctas={ctas}
					className="max-lg:header-closed:hidden [grid-area:ctas] max-lg:*:w-full lg:ms-auto lg:shrink-0 lg:[&_a]:whitespace-nowrap"
				/>

				<div className="flex items-center gap-1 [grid-area:controls] md:gap-2">
					<ThemeToggle />
					<Toggle />
				</div>
			</div>
		</Wrapper>
	)
}
