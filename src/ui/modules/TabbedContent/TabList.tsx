'use client'

import { tabbedContentStore } from './store'
import TabbedContent from '.'
import { cn } from '@/lib/utils'

export default function TabList({
	tabs,
}: {
	tabs?: React.ComponentProps<typeof TabbedContent>['tabs']
}) {
	const { active, setActive } = tabbedContentStore()

	return (
		<nav
			aria-label="Appointment guide"
			className="clinic-shell no-scrollbar mx-auto flex max-w-2xl overflow-x-auto p-1.5"
		>
			{tabs?.map((tab, key) => (
				<button
					type="button"
					className={cn(
						'min-h-11 shrink-0 grow basis-[min(9rem,46vw)] rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,color,box-shadow] duration-300',
						key === active
							? 'bg-accent text-canvas shadow-[0_8px_20px_rgb(24_53_43_/_0.16)]'
							: 'text-ink/55 hover:bg-clinic-sage/45 hover:text-ink',
					)}
					aria-pressed={key === active}
					onClick={() => setActive(key)}
					key={key}
				>
					{tab.label}
				</button>
			))}
		</nav>
	)
}
