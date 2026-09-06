'use client'

import { useEffect, useRef, useState } from 'react'
import {
	PiArrowsOutSimple,
	PiCaretLeft,
	PiCaretRight,
	PiMagnifyingGlassMinus,
	PiMagnifyingGlassPlus,
	PiX,
} from 'react-icons/pi'
import { cn } from '@/lib/utils'
import { Img } from '@/ui/Img'

export default function ProductGallery({
	images,
	title,
}: {
	images?: Sanity.Image[]
	title: string
}) {
	const gallery = (images || []).filter((image) => Boolean(image?.asset))
	const [activeIndex, setActiveIndex] = useState(0)
	const [zoomed, setZoomed] = useState(false)
	const dialogRef = useRef<HTMLDialogElement>(null)
	const pointerStart = useRef<number | null>(null)
	const safeIndex = gallery.length
		? Math.min(activeIndex, gallery.length - 1)
		: 0
	const activeImage = gallery[safeIndex]
	const activeKey =
		activeImage?._key ||
		(activeImage as { asset?: { _ref?: string } } | undefined)?.asset?._ref ||
		String(safeIndex)

	const selectIndex = (index: number) => {
		if (!gallery.length) return
		setZoomed(false)
		setActiveIndex(((index % gallery.length) + gallery.length) % gallery.length)
	}

	const selectPrevious = () => selectIndex(safeIndex - 1)
	const selectNext = () => selectIndex(safeIndex + 1)

	const openLightbox = () => dialogRef.current?.showModal()
	const closeLightbox = () => {
		setZoomed(false)
		dialogRef.current?.close()
	}

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (!dialogRef.current?.open) return
			if (event.key === 'ArrowLeft') {
				event.preventDefault()
				selectPrevious()
			}
			if (event.key === 'ArrowRight') {
				event.preventDefault()
				selectNext()
			}
			if (event.key === 'Escape') closeLightbox()
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	})

	if (!activeImage) {
		return (
			<div className="clinic-shell">
				<div className="clinic-core bg-ink/5 aspect-[4/5]" />
			</div>
		)
	}

	return (
		<>
			<div
				className={cn(
					'grid gap-3 sm:gap-4',
					gallery.length > 1 && 'sm:grid-cols-[5.25rem_minmax(0,1fr)]',
				)}
			>
				{gallery.length > 1 && (
					<div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:max-h-[min(72svh,49rem)] sm:flex-col sm:overflow-y-auto sm:pr-1">
						{gallery.map((image, index) => (
							<button
								type="button"
								key={image._key || index}
								aria-label={`View image ${index + 1} of ${gallery.length}`}
								aria-pressed={index === safeIndex}
								onClick={(event) => {
									event.preventDefault()
									event.stopPropagation()
									selectIndex(index)
								}}
								className={cn(
									'border-ink/12 clinic-core relative z-[1] aspect-square w-[4.75rem] shrink-0 overflow-hidden border p-0.5 transition sm:w-full',
									index === safeIndex
										? 'border-accent ring-accent/20 ring-2'
										: 'opacity-65 hover:opacity-100',
								)}
							>
								<Img
									image={image}
									alt=""
									width={180}
									className="pointer-events-none size-full rounded-[calc(1.75rem-0.5rem)] object-cover"
								/>
							</button>
						))}
					</div>
				)}

				<div className="clinic-shell relative order-1 overflow-hidden sm:order-2">
					<div className="relative">
						<button
							type="button"
							onClick={openLightbox}
							className="block w-full cursor-zoom-in"
							aria-label={`Open fullscreen gallery for ${title}`}
						>
							<Img
								key={activeKey}
								image={activeImage}
								alt={activeImage.alt || title}
								width={1500}
								loading="eager"
								className="clinic-core aspect-[4/5] w-full object-cover sm:aspect-[5/6] lg:max-h-[49rem]"
							/>
						</button>

						<span className="bg-canvas/92 text-ink pointer-events-none absolute top-4 right-4 grid size-11 place-items-center rounded-full shadow-lg backdrop-blur-sm">
							<PiArrowsOutSimple aria-hidden="true" className="size-4" />
						</span>

						{gallery.length > 1 && (
							<>
								<GalleryArrow
									label="Previous image"
									direction="left"
									onClick={selectPrevious}
								/>
								<GalleryArrow
									label="Next image"
									direction="right"
									onClick={selectNext}
								/>
								<span className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-[#101b17]/82 px-3 py-1.5 text-xs font-semibold text-white tabular-nums backdrop-blur-sm">
									{safeIndex + 1} / {gallery.length}
								</span>
							</>
						)}
					</div>
				</div>
			</div>

			<dialog
				ref={dialogRef}
				aria-label={`${title} image gallery`}
				onCancel={(event) => {
					event.preventDefault()
					closeLightbox()
				}}
				onClick={(event) =>
					event.target === event.currentTarget && closeLightbox()
				}
				className="m-auto h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-[#101b17]/35 backdrop:backdrop-blur-md open:flex open:flex-col"
			>
				<div className="flex min-h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#101b17]/70 px-4 shadow-lg backdrop-blur-2xl sm:px-6">
					<div>
						<p className="text-sm font-semibold">{title}</p>
						<p aria-live="polite" className="text-xs text-white/55">
							Image {safeIndex + 1} of {gallery.length}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setZoomed((value) => !value)}
							className="grid size-11 place-items-center rounded-full border border-white/15 bg-black/15 backdrop-blur-xl hover:bg-black/30"
							aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
						>
							{zoomed ? (
								<PiMagnifyingGlassMinus className="size-5" />
							) : (
								<PiMagnifyingGlassPlus className="size-5" />
							)}
						</button>
						<button
							type="button"
							onClick={closeLightbox}
							className="grid size-11 place-items-center rounded-full border border-white/15 bg-black/15 backdrop-blur-xl hover:bg-black/30"
							aria-label="Close image gallery"
						>
							<PiX className="size-5" />
						</button>
					</div>
				</div>

				<div
					className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center overflow-auto bg-gradient-to-b from-[#101b17]/12 via-transparent to-[#101b17]/12 p-3 sm:p-8"
					onPointerDown={(event) => {
						pointerStart.current = event.clientX
					}}
					onPointerUp={(event) => {
						if (pointerStart.current === null || zoomed) return
						const distance = event.clientX - pointerStart.current
						if (distance > 50) selectPrevious()
						if (distance < -50) selectNext()
						pointerStart.current = null
					}}
				>
					<Img
						key={`lightbox-${activeKey}`}
						image={activeImage}
						alt={activeImage.alt || title}
						width={2400}
						className={cn(
							'max-h-full w-auto max-w-full rounded-[1rem] object-contain shadow-2xl transition-transform duration-300 select-none',
							zoomed && 'scale-150 cursor-zoom-out',
						)}
						draggable={false}
					/>
					{gallery.length > 1 && (
						<>
							<GalleryArrow
								label="Previous image"
								direction="left"
								onClick={selectPrevious}
								lightbox
							/>
							<GalleryArrow
								label="Next image"
								direction="right"
								onClick={selectNext}
								lightbox
							/>
						</>
					)}
				</div>

				{gallery.length > 1 && (
					<div className="flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-white/10 bg-[#101b17]/70 px-4 py-3 shadow-[0_-12px_36px_rgba(0,0,0,.12)] backdrop-blur-2xl">
						{gallery.map((image, index) => (
							<button
								type="button"
								key={image._key || index}
								onClick={() => selectIndex(index)}
								aria-label={`Show image ${index + 1}`}
								aria-pressed={index === safeIndex}
								className={cn(
									'aspect-square w-14 shrink-0 overflow-hidden rounded-xl border p-0.5',
									index === safeIndex
										? 'border-clinic-clay'
										: 'border-white/15 opacity-50 hover:opacity-100',
								)}
							>
								<Img
									image={image}
									alt=""
									width={112}
									className="pointer-events-none size-full rounded-[0.65rem] object-cover"
								/>
							</button>
						))}
					</div>
				)}
			</dialog>
		</>
	)
}

function GalleryArrow({
	label,
	direction,
	onClick,
	lightbox = false,
}: {
	label: string
	direction: 'left' | 'right'
	onClick: () => void
	lightbox?: boolean
}) {
	const Icon = direction === 'left' ? PiCaretLeft : PiCaretRight
	return (
		<button
			type="button"
			aria-label={label}
			onClick={(event) => {
				event.preventDefault()
				event.stopPropagation()
				onClick()
			}}
			className={cn(
				'absolute top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full shadow-lg backdrop-blur-sm transition',
				direction === 'left' ? 'left-3 sm:left-5' : 'right-3 sm:right-5',
				lightbox
					? 'border border-white/15 bg-black/45 text-white hover:bg-black/70'
					: 'bg-canvas/95 text-ink hover:bg-canvas',
			)}
		>
			<Icon aria-hidden="true" className="size-5" />
		</button>
	)
}
