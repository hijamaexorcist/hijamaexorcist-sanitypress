import Pretitle from '@/ui/Pretitle'
import { PortableText } from 'next-sanity'

export default function StepList({
	pretitle,
	intro,
	steps,
}: Partial<{
	pretitle: string
	intro: any
	steps: {
		content: any
	}[]
}>) {
	return (
		<section className="section space-y-14">
			{(pretitle || intro) && (
				<header className="richtext mx-auto max-w-2xl text-center text-balance">
					<Pretitle className="clinic-kicker">{pretitle}</Pretitle>
					<PortableText value={intro} />
				</header>
			)}

			<ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
				{steps?.map((step, index) => (
					<li className="clinic-shell grid grid-cols-[auto_1fr] gap-4 p-6" key={index}>
						<b className="bg-clinic-sage/70 text-accent grid size-11 place-items-center rounded-full text-sm tabular-nums">
							{index + 1}
						</b>

						<div className="richtext">
							<PortableText value={step.content} />
						</div>
					</li>
				))}
			</ol>
		</section>
	)
}
