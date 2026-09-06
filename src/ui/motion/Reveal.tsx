'use client'

import { forwardRef, useEffect, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'

const ease = [0.32, 0.72, 0, 1] as const

/** Shared viewport: fire when ~15% visible; mild bottom inset so mid-fold still triggers. */
const inViewViewport = { once: true, amount: 0.15, margin: '0px 0px -8% 0px' } as const

/**
 * Never hide content with opacity:0 — if motion fails to hydrate or
 * IntersectionObserver never fires, the page would look "empty".
 * Motion is limited to a soft rise so copy stays readable without JS.
 */
const fadeUp: Variants = {
	hidden: { y: 24 },
	visible: {
		y: 0,
		transition: { duration: 0.8, ease },
	},
}

const fadeUpReduced: Variants = {
	hidden: {},
	visible: {
		transition: { duration: 0.01 },
	},
}

/**
 * Entrance rise. Use `immediate` for above-fold (animate on mount);
 * otherwise scrolls into view via whileInView.
 * Motion also respects prefers-reduced-motion; we zero travel when reduced.
 */
export function Reveal({
	children,
	className,
	delay = 0,
	immediate = false,
}: {
	children: React.ReactNode
	className?: string
	delay?: number
	/** Above-fold: animate on first paint instead of waiting for IntersectionObserver. */
	immediate?: boolean
}) {
	const reduced = useReducedMotion()
	const [ready, setReady] = useState(false)
	const variants = reduced ? fadeUpReduced : fadeUp

	useEffect(() => {
		setReady(true)
	}, [])

	return (
		<motion.div
			className={cn(className)}
			initial={ready ? 'hidden' : false}
			animate={immediate && ready ? 'visible' : undefined}
			whileInView={!immediate && ready ? 'visible' : undefined}
			viewport={immediate ? undefined : inViewViewport}
			variants={{
				hidden: variants.hidden,
				visible: {
					...(variants.visible as object),
					transition: {
						duration: reduced ? 0.01 : 0.8,
						delay: reduced ? 0 : delay,
						ease,
					},
				},
			}}
		>
			{children}
		</motion.div>
	)
}

type StaggerProps = {
	children: React.ReactNode
	className?: string
	delay?: number
	stagger?: number
	immediate?: boolean
}

/**
 * Stagger children that use `RevealItem` (or any child with matching variants).
 */
export const Stagger = forwardRef<HTMLDivElement, StaggerProps>(
	function Stagger(
		{ children, className, delay = 0, stagger = 0.1, immediate = false },
		ref,
	) {
		const reduced = useReducedMotion()
		const [ready, setReady] = useState(false)

		useEffect(() => {
			setReady(true)
		}, [])

		return (
			<motion.div
				ref={ref}
				className={cn(className)}
				initial={ready ? 'hidden' : false}
				animate={immediate && ready ? 'visible' : undefined}
				whileInView={!immediate && ready ? 'visible' : undefined}
				viewport={immediate ? undefined : inViewViewport}
				variants={{
					hidden: {},
					visible: {
						transition: {
							staggerChildren: reduced ? 0 : stagger,
							delayChildren: reduced ? 0 : delay,
						},
					},
				}}
			>
				{children}
			</motion.div>
		)
	},
)

/** Child of `Stagger` — inherits stagger timing via variants. */
export function RevealItem({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	const reduced = useReducedMotion()

	return (
		<motion.div
			className={cn(className)}
			variants={reduced ? fadeUpReduced : fadeUp}
		>
			{children}
		</motion.div>
	)
}

export const motionEase = ease
export const fadeUpVariants = fadeUp
