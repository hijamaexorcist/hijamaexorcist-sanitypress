import moduleProps from '@/lib/moduleProps'
import Date from '@/ui/Date'
import Categories from './Categories'
import Authors from './Authors'
import ReadTime from './ReadTime'
import TableOfContents from '@/ui/modules/RichtextModule/TableOfContents'
import Content from '@/ui/modules/RichtextModule/Content'
import YouTubeEmbed from '@/ui/YouTubeEmbed'
import { Img } from '@/ui/Img'
import { cn } from '@/lib/utils'
import css from './PostContent.module.css'

export default function PostContent({
	post,
	...props
}: { post?: Sanity.BlogPost } & Sanity.Module) {
	if (!post) return null

	const showTOC = !post.hideTableOfContents || !!post.headings?.length
	const featuredVideo = post.featuredVideo?.url

	return (
		<article {...moduleProps(props)}>
			<header className="section space-y-6 text-center">
				<h1 className="h1 text-balance">{post.metadata.title}</h1>
				<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
					<Date value={post.publishDate} />
					<Categories
						className="flex flex-wrap gap-x-2"
						categories={post.categories}
						linked
					/>
					<ReadTime value={post.readTime} />
				</div>

				{post.authors?.length && (
					<Authors
						className="flex flex-wrap items-center gap-4"
						authors={post.authors}
						linked
					/>
				)}
			</header>

			{(featuredVideo || post.metadata.image) && (
				<div className="section max-w-4xl">
					{featuredVideo ? (
						<YouTubeEmbed
							url={featuredVideo}
							title={post.featuredVideo?.title || post.metadata.title}
							caption={post.featuredVideo?.caption}
						/>
					) : (
						<figure className="clinic-shell overflow-hidden p-1.5">
							<Img
								className="clinic-core aspect-video w-full object-cover"
								image={post.metadata.image}
								width={1400}
								sizes="(max-width: 896px) 100vw, 896px"
								alt={post.metadata.title}
							/>
						</figure>
					)}
				</div>
			)}

			<div
				className={cn(
					'section grid gap-8',
					showTOC && 'lg:grid-cols-[1fr_auto]',
				)}
			>
				{showTOC && (
					<aside className="lg:sticky-below-header mx-auto w-full max-w-lg self-start [--offset:1rem] lg:order-1 lg:w-3xs">
						<TableOfContents headings={post.headings} />
					</aside>
				)}

				<Content
					value={post.body}
					className={cn(css.body, 'grid max-w-screen-md')}
				>
					<hr />
				</Content>
			</div>
		</article>
	)
}
