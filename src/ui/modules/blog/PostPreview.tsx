import { Img } from '@/ui/Img'
import Link from 'next/link'
import resolveUrl from '@/lib/resolveUrl'
import Authors from './Authors'
import Date from '@/ui/Date'
import Categories from './Categories'
import { cn } from '@/lib/utils'

export default function PostPreview({
	post,
	skeleton,
}: {
	post?: Sanity.BlogPost
	skeleton?: boolean
}) {
	if (!post && !skeleton) return null

	return (
		<article className="clinic-core group border-ink/8 relative isolate flex h-full flex-col overflow-hidden rounded-[1.75rem] border shadow-[0_18px_45px_rgb(35_51_43_/_0.06)]">
			<figure className="bg-ink/3 relative aspect-[4/3] overflow-hidden">
				<Img
					className="aspect-[4/3] size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.025]"
					image={post?.metadata.image}
					width={700}
					alt={post?.metadata.title}
				/>

				{post?.featured && (
					<span className="action absolute top-0 right-4 rounded-t-none py-1 text-xs shadow-md">
						Featured
					</span>
				)}
				{post?.featuredVideo?.url && (
					<span className="bg-canvas text-ink absolute bottom-3 left-3 inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold tracking-[0.12em] uppercase">
						Watch
					</span>
				)}
			</figure>

			<div className="flex grow flex-col p-6">
				<div className={cn('h4', skeleton && 'skeleton-2')}>
					<Link
						className="group-hover:underline"
						href={resolveUrl(post, { base: false })}
					>
						<span className="absolute inset-0" />
						{post?.metadata.title}
					</Link>
				</div>

				<div className="mt-3 grow">
					<p className="line-clamp-3 text-sm empty:h-[3lh]">
						{post?.metadata.description}
					</p>
				</div>

				{(post?.authors?.length || skeleton) && (
					<Authors
						className="flex flex-wrap items-center gap-4 text-sm"
						authors={post?.authors}
						skeleton={skeleton}
					/>
				)}

				<hr className="mt-5" />

				<div className="empty:skeleton text-ink/60 mt-4 flex flex-wrap gap-x-4 text-xs">
					<Date value={post?.publishDate} />
					<Categories
						className="flex flex-wrap gap-x-2"
						categories={post?.categories}
					/>
				</div>
			</div>
		</article>
	)
}
