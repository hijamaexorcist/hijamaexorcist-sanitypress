import { PortableText } from 'next-sanity'
import { Img } from '@/ui/Img'
import { Reveal } from '@/ui/motion/Reveal'

export default function TestimonialFeatured({
	testimonial,
}: Partial<{
	testimonial: Sanity.Testimonial
}>) {
	if (!testimonial) return null

	const { author } = testimonial
	const authorAlt =
		[author?.name, author?.title].filter(Boolean).join(', ') || 'Client'

	return (
		<section className="section">
			<Reveal>
				<figure className="clinic-shell mx-auto max-w-3xl p-1.5">
					<div className="clinic-core grid items-center gap-8 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 lg:p-10">
						<blockquote className="min-w-0">
							<span
								aria-hidden="true"
								className="font-serif text-3xl leading-none text-clinic-clay/55 select-none"
							>
								“
							</span>
							<div className="richtext mt-3 text-pretty text-lg leading-[1.7] text-ink/85 md:text-xl md:leading-[1.65]">
								<PortableText value={testimonial.content} />
							</div>

							<figcaption className="mt-7 flex items-center gap-3.5 border-t border-ink/8 pt-5">
								{!author?.image?.asset && author?.name && (
									<span
										aria-hidden="true"
										className="grid size-12 shrink-0 place-items-center rounded-full bg-clinic-sage/80 font-serif text-lg text-ink/70 ring-1 ring-ink/10"
									>
										{author.name
											.trim()
											.split(/\s+/)
											.slice(0, 2)
											.map((p) => p[0]?.toUpperCase() ?? '')
											.join('')}
									</span>
								)}

								<div className="min-w-0 flex-1">
									{author?.name && (
										<p className="font-serif text-lg leading-tight text-ink">
											{author.name}
											{testimonial.source && (
												<a
													className="ml-2 inline-block align-middle text-sm text-ink/45 transition-colors hover:text-clinic-clay"
													href={testimonial.source}
													target="_blank"
													rel="noreferrer"
													title="Read the original review"
												>
													<span aria-hidden="true">↗</span>
													<span className="sr-only">
														Read the original review
													</span>
												</a>
											)}
										</p>
									)}
									{author?.title && (
										<p className="mt-1 text-sm text-clinic-stone">
											{author.title}
										</p>
									)}
								</div>
							</figcaption>
						</blockquote>

						{author?.image?.asset && (
							<Img
								className="mx-auto size-36 shrink-0 rounded-full object-cover ring-1 ring-ink/10 md:mx-0 md:size-44"
								image={author.image}
								width={352}
								alt={authorAlt}
							/>
						)}
					</div>
				</figure>
			</Reveal>
		</section>
	)
}
