'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { stegaClean } from 'next-sanity'

const TILE = 256

type MapCanvasProps = {
	locationName?: string
	address?: string
	latitude: number
	longitude: number
	zoom?: number
}

function latLngToWorld(lat: number, lng: number, zoom: number) {
	const n = 2 ** zoom
	const x = ((lng + 180) / 360) * n
	const latRad = (lat * Math.PI) / 180
	const y =
		((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
		n
	return { x, y }
}

function tileUrl(x: number, y: number, z: number) {
	const wrap = 2 ** z
	if (y < 0 || y >= wrap) return null
	const nx = ((x % wrap) + wrap) % wrap
	return `https://tile.openstreetmap.org/${z}/${nx}/${y}.png`
}

function toNumber(value: unknown, fallback: number) {
	const cleaned = typeof value === 'string' ? stegaClean(value) : value
	const n = Number(cleaned)
	return Number.isFinite(n) ? n : fallback
}

export default function MapCanvas({
	locationName,
	address,
	latitude,
	longitude,
	zoom = 15,
}: MapCanvasProps) {
	const frameRef = useRef<HTMLDivElement>(null)
	const [dpr, setDpr] = useState(1)
	const [frame, setFrame] = useState({ width: 640, height: 448 })
	const lat = toNumber(latitude, 40.5623884)
	const lng = toNumber(longitude, -74.4477892)
	const z = Math.min(18, Math.max(10, Math.round(toNumber(zoom, 15))))
	const label = [stegaClean(locationName), stegaClean(address)]
		.filter(Boolean)
		.join(', ')

	useEffect(() => {
		const node = frameRef.current
		if (!node) return

		const sync = () => {
			const nextDpr = window.devicePixelRatio >= 1.5 ? 2 : 1
			setDpr(nextDpr)
			const rect = node.getBoundingClientRect()
			if (rect.width === 0 || rect.height === 0) return
			setFrame({ width: rect.width, height: rect.height })
		}

		sync()
		const observer = new ResizeObserver(sync)
		observer.observe(node)
		window.addEventListener('resize', sync)
		return () => {
			observer.disconnect()
			window.removeEventListener('resize', sync)
		}
	}, [])

	const tiles = useMemo(() => {
		const fetchZ = Math.min(18, z + (dpr > 1 ? 1 : 0))
		const tileCss = TILE / (fetchZ > z ? 2 : 1)
		const world = latLngToWorld(lat, lng, fetchZ)
		const cols = Math.ceil(frame.width / tileCss) + 2
		const rows = Math.ceil(frame.height / tileCss) + 2
		const originX = Math.floor(world.x) - Math.floor(cols / 2)
		const originY = Math.floor(world.y) - Math.floor(rows / 2)
		const cells: { url: string; x: number; y: number }[] = []

		for (let dy = 0; dy < rows; dy++) {
			for (let dx = 0; dx < cols; dx++) {
				const url = tileUrl(originX + dx, originY + dy, fetchZ)
				if (!url) continue
				cells.push({ url, x: dx, y: dy })
			}
		}

		return {
			cells,
			tileCss,
			offsetX: (world.x - originX) * tileCss,
			offsetY: (world.y - originY) * tileCss,
			width: cols * tileCss,
			height: rows * tileCss,
		}
	}, [dpr, frame.height, frame.width, lat, lng, z])

	return (
		<div
			ref={frameRef}
			data-map-dpr={dpr}
			className="bg-clinic-mist relative isolate min-h-[22rem] overflow-hidden md:min-h-[28rem]"
			role="img"
			aria-label={label ? `Map showing ${label}` : 'Clinic location map'}
		>
			<div
				aria-hidden="true"
				className="absolute"
				style={{
					width: tiles.width,
					height: tiles.height,
					left: '50%',
					top: '50%',
					transform: `translate(${-tiles.offsetX}px, ${-tiles.offsetY}px)`,
				}}
			>
				{tiles.cells.map((tile) => (
					<img
						key={tile.url}
						src={tile.url}
						alt=""
						width={TILE}
						height={TILE}
						draggable={false}
						decoding="async"
						className="absolute max-w-none"
						style={{
							width: tiles.tileCss,
							height: tiles.tileCss,
							left: tile.x * tiles.tileCss,
							top: tile.y * tiles.tileCss,
						}}
					/>
				))}
			</div>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-canvas/35"
			/>

			<div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-[88%]">
				<span className="bg-clinic-clay/30 absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full" />
				<svg
					width="32"
					height="40"
					viewBox="0 0 24 32"
					className="relative text-accent"
					aria-hidden="true"
				>
					<path
						d="M12 1.5c-4.7 0-8.5 3.7-8.5 8.3 0 6.2 8.5 20.2 8.5 20.2s8.5-14 8.5-20.2c0-4.6-3.8-8.3-8.5-8.3z"
						fill="currentColor"
					/>
					<circle cx="12" cy="9.6" r="2.6" className="fill-canvas" />
				</svg>
			</div>
		</div>
	)
}
