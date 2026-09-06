import { getSite } from '@/sanity/lib/queries'
import CTA from '@/ui/CTA'
import LinkList from './LinkList'
import { cn } from '@/lib/utils'

export default async function Menu() {
	const { headerMenu } = await getSite()

	const parentClassName = cn(
		'flex min-h-11 shrink-0 items-center whitespace-nowrap text-sm text-ink/70 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-ink lg:px-3 lg:text-center lg:leading-tight',
	)

	return (
		<nav
			className="max-lg:anim-fade-to-r max-lg:header-closed:hidden flex gap-x-1 gap-y-2 [grid-area:nav] max-lg:my-5 max-lg:flex-col lg:justify-center xl:gap-x-2"
			role="navigation"
		>
			{headerMenu?.items?.map((item, key) => {
				switch (item._type) {
					case 'link':
						return (
							<CTA
								className={cn(
									parentClassName,
									'lg:grid lg:place-content-center',
								)}
								link={item}
								key={key}
							/>
						)

					case 'link.list':
						return (
							<LinkList
								summaryClassName={parentClassName}
								{...item}
								key={key}
							/>
						)

					default:
						return null
				}
			})}
		</nav>
	)
}
