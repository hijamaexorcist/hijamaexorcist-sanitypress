'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { getYouTubeId, youtubeThumbnail } from '@/lib/youtube'
import { cn } from '@/lib/utils'

export default function YouTubeEmbed({
	url,
	title = 'YouTube video',
	caption,
	className,
	autoPlay = false,
}: {
	url?: string
	title?: string
	caption?: string
	className?: string
	autoPlay?: boolean
}) {
	const id = getYouTubeId(url)
	const [playing, setPlaying] = useState(autoPlay)
	if (!id) return null

	return (
		<figure className={cn('clinic-shell overflow-hidden p-1.5', className)}>
			<div className="clinic-core bg-ink relative aspect-video overflow-hidden">
				{playing ? (
					<iframe
						className="absolute inset-0 size-full"
						src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
						title={title}
						allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					/>
				) : (
					<button
						type="button"
						className="group focus-visible:outline-clinic-clay absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-4"
						onClick={() => setPlaying(true)}
						aria-label={`Play ${title}`}
					>
						<img
							src={youtubeThumbnail(id)}
							alt=""
							className="size-full object-cover"
						/>
						<span className="bg-ink/35 absolute inset-0 transition-opacity group-hover:bg-ink/20" />
						<span className="bg-canvas text-ink absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[0_12px_32px_rgb(24_53_43_/_0.28)] transition-transform duration-300 group-hover:scale-105">
							<Play className="ml-0.5 size-6" fill="currentColor" />
						</span>
					</button>
				)}
			</div>
			{caption && (
				<figcaption className="text-ink/60 p-4 text-sm leading-relaxed">
					{caption}
				</figcaption>
			)}
		</figure>
	)
}
