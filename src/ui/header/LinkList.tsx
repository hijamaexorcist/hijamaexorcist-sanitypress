import InteractiveDetails from './InteractiveDetails'
import { CgChevronRight } from 'react-icons/cg'
import CTA from '@/ui/CTA'
import { cn } from '@/lib/utils'

export default function LinkList({
	link,
	links,
	summaryClassName,
}: Sanity.LinkList & { summaryClassName?: string }) {
	return (
		<InteractiveDetails
			className="group relative"
			name="header"
			delay={10}
			closeAfterNavigate
		>
			<summary
				className={cn(summaryClassName, 'flex h-full items-center gap-1')}
				key="summary"
			>
				{link?.label}
				<CgChevronRight className="shrink-0 transition-transform group-open:rotate-90 lg:rotate-90" />
			</summary>

			<ul
				className="anim-fade-to-b lg:frosted-glass lg:bg-canvas border-ink/10 top-full left-0 px-3 py-2 max-lg:border-s lg:absolute lg:min-w-max lg:rounded lg:border lg:shadow-md"
				key="links"
			>
				{links?.map((link, key) => (
					<li key={key}>
						<CTA className="hover:link inline-block py-px" link={link} />
					</li>
				))}
			</ul>
		</InteractiveDetails>
	)
}
