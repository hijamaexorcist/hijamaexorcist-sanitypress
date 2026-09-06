/**
 * Overlay scrollbars (ported from openislam).
 * Native scrolling stays intact; classic gutters are replaced by fixed,
 * zero-layout-width thumbs so content width does not jump.
 */

const CANDIDATE_SELECTOR = [
	'[data-overlay-scrollbar]',
	'.overflow-auto',
	'.overflow-y-auto',
	'.overflow-x-auto',
	'.carousel',
	'pre',
].join(',')

const EXCLUDED_SELECTOR = ['.no-scrollbar', '.scrollbar-hide'].join(',')

const MIN_THUMB_LENGTH = 32
const TRACK_INSET = 2
const HIDE_DELAY = 850

type Axis = 'x' | 'y'
type ScrollTarget = HTMLElement

type ThumbState = {
	axis: Axis
	element: HTMLDivElement
	visibleUntil: number
}

type TargetState = {
	target: ScrollTarget
	thumbs: Record<Axis, ThumbState>
	assignedId: string | null
	cleanup: () => void
}

type RootState = {
	observer: MutationObserver
	onLoad: () => void
}

const roots = new Map<Document | ShadowRoot, RootState>()
const targets = new Map<ScrollTarget, TargetState>()
const layers = new Map<Document | ShadowRoot, HTMLDivElement>()
let resizeObserver: ResizeObserver | null = null
let frame = 0
let hideTimer = 0
let forcedColors: MediaQueryList | null = null
let generatedId = 0

function ensureLayer(root: Document | ShadowRoot): HTMLDivElement {
	const existing = layers.get(root)
	if (existing?.isConnected) return existing
	const layer = document.createElement('div')
	layer.className = 'oi-overlay-scrollbars'
	if (root === document) document.body.append(layer)
	else root.append(layer)
	layers.set(root, layer)
	return layer
}

function isDocumentScroller(target: ScrollTarget): boolean {
	return target === document.documentElement || target === document.body
}

function viewportRect(): DOMRect {
	return new DOMRect(0, 0, window.innerWidth, window.innerHeight)
}

function targetRect(target: ScrollTarget): DOMRect {
	return isDocumentScroller(target) ? viewportRect() : target.getBoundingClientRect()
}

function clippedTargetRect(target: ScrollTarget): DOMRect {
	const rect = targetRect(target)
	let top = Math.max(0, rect.top)
	let left = Math.max(0, rect.left)
	let right = Math.min(window.innerWidth, rect.right)
	let bottom = Math.min(window.innerHeight, rect.bottom)
	if (!isDocumentScroller(target)) {
		let ancestor = target.parentElement
		while (ancestor && ancestor !== document.body) {
			const style = getComputedStyle(ancestor)
			if (
				/(auto|scroll|hidden|clip)/.test(
					`${style.overflow} ${style.overflowX} ${style.overflowY}`,
				)
			) {
				const ancestorRect = ancestor.getBoundingClientRect()
				top = Math.max(top, ancestorRect.top)
				left = Math.max(left, ancestorRect.left)
				right = Math.min(right, ancestorRect.right)
				bottom = Math.min(bottom, ancestorRect.bottom)
			}
			ancestor = ancestor.parentElement
		}
	}
	return new DOMRect(left, top, Math.max(0, right - left), Math.max(0, bottom - top))
}

function scrollMetrics(target: ScrollTarget, axis: Axis) {
	if (isDocumentScroller(target)) {
		const scrollingElement = document.scrollingElement ?? document.documentElement
		return axis === 'y'
			? {
					client: window.innerHeight,
					scroll: scrollingElement.scrollHeight,
					position: window.scrollY,
				}
			: {
					client: window.innerWidth,
					scroll: scrollingElement.scrollWidth,
					position: window.scrollX,
				}
	}
	return axis === 'y'
		? {
				client: target.clientHeight,
				scroll: target.scrollHeight,
				position: target.scrollTop,
			}
		: {
				client: target.clientWidth,
				scroll: target.scrollWidth,
				position:
					getComputedStyle(target).direction === 'rtl'
						? Math.abs(target.scrollLeft)
						: target.scrollLeft,
			}
}

function hasScrollableOverflow(target: ScrollTarget, axis: Axis): boolean {
	const metrics = scrollMetrics(target, axis)
	return metrics.scroll - metrics.client > 1
}

function targetAllowsAxis(target: ScrollTarget, axis: Axis): boolean {
	if (isDocumentScroller(target)) return true
	const style = getComputedStyle(target)
	const overflow = axis === 'y' ? style.overflowY : style.overflowX
	return overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay'
}

function scheduleUpdate(): void {
	if (frame) return
	frame = requestAnimationFrame(() => {
		frame = 0
		updateAll()
	})
}

function scheduleHideCheck(): void {
	window.clearTimeout(hideTimer)
	hideTimer = window.setTimeout(() => {
		updateAll()
	}, HIDE_DELAY + 30)
}

function reveal(state: TargetState, duration = HIDE_DELAY): void {
	const until = performance.now() + duration
	state.thumbs.x.visibleUntil = until
	state.thumbs.y.visibleUntil = until
	scheduleUpdate()
	scheduleHideCheck()
}

function ensureTargetId(target: ScrollTarget): {
	id: string
	assigned: string | null
} {
	if (target.id) return { id: target.id, assigned: null }
	const id = `overlay-scroll-region-${++generatedId}`
	target.id = id
	return { id, assigned: id }
}

function setScrollPosition(target: ScrollTarget, axis: Axis, value: number): void {
	if (isDocumentScroller(target)) {
		window.scrollTo({
			left: axis === 'x' ? value : window.scrollX,
			top: axis === 'y' ? value : window.scrollY,
			behavior: 'auto',
		})
	} else if (axis === 'y') {
		target.scrollTop = value
	} else {
		target.scrollLeft =
			getComputedStyle(target).direction === 'rtl' ? -value : value
	}
}

function createThumb(
	target: ScrollTarget,
	axis: Axis,
	controlsId: string,
): ThumbState {
	const thumb = document.createElement('div')
	thumb.className = `oi-overlay-scrollbar oi-overlay-scrollbar--${axis}`
	thumb.tabIndex = -1
	thumb.setAttribute('role', 'scrollbar')
	thumb.setAttribute('aria-controls', controlsId)
	thumb.setAttribute('aria-hidden', 'true')
	thumb.setAttribute('aria-orientation', axis === 'y' ? 'vertical' : 'horizontal')
	thumb.setAttribute(
		'aria-label',
		axis === 'y' ? 'Vertical scrollbar' : 'Horizontal scrollbar',
	)
	const root = target.getRootNode()
	ensureLayer(root instanceof ShadowRoot ? root : document).append(thumb)

	const state: ThumbState = { axis, element: thumb, visibleUntil: 0 }
	let dragStartPointer = 0
	let dragStartScroll = 0

	thumb.addEventListener('pointerdown', (event) => {
		event.preventDefault()
		thumb.setPointerCapture(event.pointerId)
		thumb.classList.add('is-dragging')
		dragStartPointer = axis === 'y' ? event.clientY : event.clientX
		dragStartScroll = scrollMetrics(target, axis).position
		state.visibleUntil = Number.POSITIVE_INFINITY
	})

	thumb.addEventListener('pointermove', (event) => {
		if (!thumb.hasPointerCapture(event.pointerId)) return
		const rect = clippedTargetRect(target)
		const metrics = scrollMetrics(target, axis)
		const track = Math.max(
			0,
			(axis === 'y' ? rect.height : rect.width) - TRACK_INSET * 2,
		)
		const length = Math.max(MIN_THUMB_LENGTH, track * (metrics.client / metrics.scroll))
		const travel = Math.max(1, track - length)
		const pointer = axis === 'y' ? event.clientY : event.clientX
		setScrollPosition(
			target,
			axis,
			dragStartScroll +
				((pointer - dragStartPointer) / travel) * (metrics.scroll - metrics.client),
		)
		scheduleUpdate()
	})

	const finishDrag = (event: PointerEvent) => {
		if (thumb.hasPointerCapture(event.pointerId))
			thumb.releasePointerCapture(event.pointerId)
		thumb.classList.remove('is-dragging')
		state.visibleUntil = performance.now() + HIDE_DELAY
		scheduleHideCheck()
	}
	thumb.addEventListener('pointerup', finishDrag)
	thumb.addEventListener('pointercancel', finishDrag)
	thumb.addEventListener('focus', () => {
		state.visibleUntil = Number.POSITIVE_INFINITY
		scheduleUpdate()
	})
	thumb.addEventListener('blur', () => {
		state.visibleUntil = performance.now() + HIDE_DELAY
		scheduleHideCheck()
	})
	thumb.addEventListener('keydown', (event) => {
		const metrics = scrollMetrics(target, axis)
		const line = 40
		const page = Math.max(line, metrics.client * 0.9)
		const keyDelta: Record<string, number> = {
			ArrowDown: line,
			ArrowRight: line,
			ArrowUp: -line,
			ArrowLeft: -line,
			PageDown: page,
			PageUp: -page,
			Home: -metrics.scroll,
			End: metrics.scroll,
		}
		const delta = keyDelta[event.key]
		if (delta === undefined) return
		if (axis === 'y' && (event.key === 'ArrowLeft' || event.key === 'ArrowRight'))
			return
		if (axis === 'x' && (event.key === 'ArrowUp' || event.key === 'ArrowDown'))
			return
		event.preventDefault()
		setScrollPosition(target, axis, metrics.position + delta)
		scheduleUpdate()
	})

	return state
}

function addTarget(target: ScrollTarget): void {
	if (
		targets.has(target) ||
		target.matches(EXCLUDED_SELECTOR) ||
		target.closest(EXCLUDED_SELECTOR)
	)
		return
	if (!isDocumentScroller(target) && !target.matches(CANDIDATE_SELECTOR)) return

	const targetId = ensureTargetId(target)
	target.classList.add('oi-overlay-scroll-target')
	const state = {
		target,
		thumbs: {
			x: createThumb(target, 'x', targetId.id),
			y: createThumb(target, 'y', targetId.id),
		},
		assignedId: targetId.assigned,
		cleanup: () => {},
	} satisfies TargetState

	const onScroll = () => reveal(state)
	const onPointerEnter = () => reveal(state, Number.POSITIVE_INFINITY)
	const onPointerLeave = () => reveal(state)
	const onFocusIn = () => reveal(state, Number.POSITIVE_INFINITY)
	const onFocusOut = () => reveal(state)
	target.addEventListener('scroll', onScroll, { passive: true })
	if (!isDocumentScroller(target)) {
		target.addEventListener('pointerenter', onPointerEnter, { passive: true })
		target.addEventListener('pointerleave', onPointerLeave, { passive: true })
		target.addEventListener('focusin', onFocusIn)
		target.addEventListener('focusout', onFocusOut)
	}
	state.cleanup = () => {
		target.removeEventListener('scroll', onScroll)
		if (!isDocumentScroller(target)) {
			target.removeEventListener('pointerenter', onPointerEnter)
			target.removeEventListener('pointerleave', onPointerLeave)
			target.removeEventListener('focusin', onFocusIn)
			target.removeEventListener('focusout', onFocusOut)
		}
		state.thumbs.x.element.remove()
		state.thumbs.y.element.remove()
		target.classList.remove('oi-overlay-scroll-target')
		if (state.assignedId && target.id === state.assignedId)
			target.removeAttribute('id')
		resizeObserver?.unobserve(target)
	}
	targets.set(target, state)
	resizeObserver?.observe(target)
	scheduleUpdate()
}

function removeTarget(target: ScrollTarget): void {
	const state = targets.get(target)
	if (!state) return
	state.cleanup()
	targets.delete(target)
}

function updateThumb(state: TargetState, thumb: ThumbState, now: number): void {
	const { target } = state
	const { axis, element } = thumb
	const rect = clippedTargetRect(target)
	const metrics = scrollMetrics(target, axis)
	const overflow =
		targetAllowsAxis(target, axis) && hasScrollableOverflow(target, axis)
	const visibleRect = {
		top: Math.max(0, rect.top),
		left: Math.max(0, rect.left),
		bottom: Math.min(window.innerHeight, rect.bottom),
		right: Math.min(window.innerWidth, rect.right),
	}
	const track = Math.max(
		0,
		(axis === 'y'
			? visibleRect.bottom - visibleRect.top
			: visibleRect.right - visibleRect.left) -
			TRACK_INSET * 2,
	)
	if (
		!overflow ||
		track <= 0 ||
		rect.bottom <= 0 ||
		rect.top >= window.innerHeight ||
		rect.right <= 0 ||
		rect.left >= window.innerWidth
	) {
		element.hidden = true
		element.tabIndex = -1
		element.setAttribute('aria-hidden', 'true')
		return
	}

	element.hidden = false
	const length = Math.min(
		track,
		Math.max(MIN_THUMB_LENGTH, track * (metrics.client / metrics.scroll)),
	)
	const progress = metrics.position / Math.max(1, metrics.scroll - metrics.client)
	const offset = Math.max(0, Math.min(track - length, progress * (track - length)))
	const direction = getComputedStyle(target).direction
	if (axis === 'y') {
		element.style.top = `${visibleRect.top + TRACK_INSET + offset}px`
		element.style.left =
			direction === 'rtl'
				? `${visibleRect.left + TRACK_INSET}px`
				: `${visibleRect.right - TRACK_INSET - 12}px`
		element.style.width = '12px'
		element.style.height = `${length}px`
	} else {
		element.style.top = `${visibleRect.bottom - TRACK_INSET - 12}px`
		element.style.left = `${visibleRect.left + TRACK_INSET + offset}px`
		element.style.width = `${length}px`
		element.style.height = '12px'
	}
	const isVisible =
		thumb.visibleUntil > now || element.matches(':hover, :focus-visible')
	element.classList.toggle('is-visible', isVisible)
	element.tabIndex = isVisible ? 0 : -1
	element.setAttribute('aria-hidden', String(!isVisible))
	element.setAttribute('aria-valuemin', '0')
	element.setAttribute(
		'aria-valuemax',
		String(Math.round(metrics.scroll - metrics.client)),
	)
	element.setAttribute('aria-valuenow', String(Math.round(metrics.position)))
}

function updateAll(): void {
	const now = performance.now()
	for (const [target, state] of targets) {
		if (!target.isConnected) {
			removeTarget(target)
			continue
		}
		updateThumb(state, state.thumbs.x, now)
		updateThumb(state, state.thumbs.y, now)
	}
}

function scanRoot(root: Document | ShadowRoot): void {
	if (
		root === document &&
		document.documentElement.classList.contains('show-scrollbars')
	) {
		addTarget(document.documentElement)
	}
	root.querySelectorAll<HTMLElement>(CANDIDATE_SELECTOR).forEach(addTarget)
	scheduleUpdate()
}

function scanAddedNode(node: Node): void {
	if (!(node instanceof Element) || node.closest('.oi-overlay-scrollbars')) return
	if (node.matches(CANDIDATE_SELECTOR)) addTarget(node as HTMLElement)
	node.querySelectorAll<HTMLElement>(CANDIDATE_SELECTOR).forEach(addTarget)
}

function disableAll(): void {
	for (const target of [...targets.keys()]) removeTarget(target)
	for (const layer of layers.values()) layer.remove()
	layers.clear()
}

function forcedColorsChanged(): void {
	if (forcedColors?.matches) {
		disableAll()
		return
	}
	for (const root of roots.keys()) scanRoot(root)
}

export function registerOverlayScrollbarRoot(
	root: Document | ShadowRoot = document,
): () => void {
	if (typeof window === 'undefined' || roots.has(root)) return () => {}
	forcedColors ??= window.matchMedia('(forced-colors: active)')
	forcedColors.addEventListener('change', forcedColorsChanged)
	resizeObserver ??= new ResizeObserver(scheduleUpdate)
	const observer = new MutationObserver((mutations) => {
		if (forcedColors?.matches) {
			disableAll()
			return
		}
		let changed = false
		for (const mutation of mutations) {
			const target = mutation.target
			if (target instanceof Element && target.closest('.oi-overlay-scrollbars'))
				continue
			changed = true
			if (mutation.type === 'attributes' && target instanceof HTMLElement) {
				if (isDocumentScroller(target)) {
					if (document.documentElement.classList.contains('show-scrollbars'))
						addTarget(document.documentElement)
					else removeTarget(document.documentElement)
				} else if (target.matches(CANDIDATE_SELECTOR)) addTarget(target)
				else removeTarget(target)
				continue
			}
			for (const node of mutation.addedNodes) scanAddedNode(node)
		}
		if (changed) scheduleUpdate()
	})
	observer.observe(root, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['class', 'style'],
	})
	const onLoad = () => scheduleUpdate()
	root.addEventListener('load', onLoad, true)
	const state: RootState = { observer, onLoad }
	roots.set(root, state)
	if (!forcedColors.matches) scanRoot(root)

	const onResize = () => scheduleUpdate()
	const onScroll = (event: Event) => {
		if (event.target === document) {
			const documentState = targets.get(document.documentElement)
			if (documentState) reveal(documentState)
		}
		scheduleUpdate()
	}
	if (root === document) {
		window.addEventListener('resize', onResize, { passive: true })
		window.addEventListener('scroll', onScroll, { passive: true, capture: true })
		document.fonts?.ready.then(scheduleUpdate)
	}

	return () => {
		observer.disconnect()
		root.removeEventListener('load', onLoad, true)
		if (root === document) {
			window.removeEventListener('resize', onResize)
			window.removeEventListener('scroll', onScroll, true)
		}
		roots.delete(root)
		for (const [target] of targets) {
			if (
				target.getRootNode() === root ||
				(root === document && isDocumentScroller(target))
			)
				removeTarget(target)
		}
		layers.get(root)?.remove()
		layers.delete(root)
		if (roots.size === 0) {
			forcedColors?.removeEventListener('change', forcedColorsChanged)
			disableAll()
			resizeObserver?.disconnect()
			resizeObserver = null
		}
	}
}
