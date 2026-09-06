import moduleProps from '@/lib/moduleProps'
import YouTubeEmbed from '@/ui/YouTubeEmbed'
import { Reveal, RevealItem, Stagger } from '@/ui/motion/Reveal'
import { getYouTubeId } from '@/lib/youtube'

export default function VideoLibrary({
	pretitle,
	title,
	description,
	videos,
	...props
}: Sanity.VideoLibrary & Sanity.Module) {
	const validVideos = videos?.flatMap((video) => {
		const id = getYouTubeId(video.url)
		return id ? [{ ...video, id }] : []
	})
	if (!validVideos?.length) return null
	return (
		<section className="full-bleed bg-clinic-sage/42" {...moduleProps(props)}>
			<div className="section">
				<Reveal>
					<header className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(16rem,0.45fr)] lg:items-end">
						<div>
							{pretitle && <p className="clinic-kicker">{pretitle}</p>}
							<h2 className="h2 mt-4 max-w-3xl text-balance">{title}</h2>
						</div>
						{description && (
							<p className="text-ink/68 max-w-lg leading-relaxed">
								{description}
							</p>
						)}
					</header>
				</Reveal>
				<Stagger
					className="mt-12 grid gap-6 md:grid-cols-2"
					delay={0.08}
					stagger={0.1}
				>
					{validVideos.map((video) => (
						<RevealItem key={video._key}>
							<article>
								<YouTubeEmbed url={video.url} title={video.title} />
								<div className="px-2 pt-5">
									<h3 className="h4">{video.title}</h3>
									{video.description && (
										<p className="text-ink/65 mt-3 text-sm leading-relaxed">
											{video.description}
										</p>
									)}
								</div>
							</article>
						</RevealItem>
					))}
				</Stagger>
			</div>
		</section>
	)
}
