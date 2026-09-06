'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function Wrapper({
	className,
	children,
}: React.ComponentProps<'header'>) {
	const ref = useRef<HTMLDivElement>(null)
	const pathname = usePathname()

	// set --header-height
	useEffect(() => {
		const el = ref.current
		if (!el) return

		function setHeight() {
			const node = ref.current
			if (!node) return
			document.documentElement.style.setProperty(
				'--header-height',
				`${node.offsetHeight ?? 0}px`,
			)
		}
		setHeight()
		const observer = new ResizeObserver(setHeight)
		observer.observe(el)
		window.addEventListener('resize', setHeight)

		return () => {
			observer.disconnect()
			window.removeEventListener('resize', setHeight)
		}
	}, [])

	// close menus after navigation
	useEffect(() => {
		if (typeof document === 'undefined') return
		const toggle = document.querySelector('#header-toggle') as HTMLInputElement
		if (toggle) toggle.checked = false

		if (!ref.current) return
		ref.current.querySelectorAll('details').forEach((element) => {
			if (element.open) element.open = false
		})
	}, [pathname])

	return (
		<header ref={ref} className={className} role="banner">
			{children}
		</header>
	)
}
