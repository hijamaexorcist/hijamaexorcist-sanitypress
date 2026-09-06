import moduleProps from '@/lib/moduleProps'
import { stegaClean } from 'next-sanity'
import { MapPin } from 'lucide-react'
import { Reveal } from '@/ui/motion/Reveal'
import CTAList from '@/ui/CTAList'
import { cn } from '@/lib/utils'
import MapCanvas from './MapCanvas'

export default function ClinicMap({
	pretitle,
	title,
	description,
	ctas,
	locationName,
	address,
	latitude,
	longitude,
	zoom,
	directionsUrl,
	directionsLabel,
	note,
	...props
}: Sanity.ClinicMap & Sanity.Module) {
	const name = stegaClean(locationName)
	const place = stegaClean(address)
	const mapUrl = stegaClean(directionsUrl)
	const actionLabel = stegaClean(directionsLabel) || 'Get directions'
	const hasBookingCta = Boolean(ctas?.length)

	return (
		<section className="section" {...moduleProps(props)}>
			<Reveal>
				<div className="clinic-shell overflow-hidden">
					<div className="clinic-core grid overflow-hidden md:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.72fr)]">
						<MapCanvas
							locationName={name}
							address={place}
							latitude={latitude}
							longitude={longitude}
							zoom={zoom}
						/>

						<div className="flex flex-col justify-between gap-8 p-6 md:p-8 lg:p-10">
							<div>
								{pretitle && <p className="clinic-kicker">{pretitle}</p>}
								{title && (
									<h2 className="h2 mt-4 max-w-sm text-balance">{title}</h2>
								)}
								{description && (
									<p className="text-ink/70 mt-4 max-w-md text-base leading-relaxed">
										{description}
									</p>
								)}
							</div>

							<div className="space-y-5">
								{place && (
									<p className="text-ink flex items-start gap-3 text-base leading-relaxed">
										<span
											className="bg-clinic-sage mt-0.5 grid size-10 shrink-0 place-items-center rounded-full"
											aria-hidden="true"
										>
											<MapPin className="size-4" strokeWidth={1.75} />
										</span>
										<span className="pt-2 whitespace-pre-line">
											{name && (
												<strong className="mb-1 block font-semibold">
													{name}
												</strong>
											)}
											{place}
										</span>
									</p>
								)}
								{note && (
									<p className="clinic-note text-ink/72 max-w-sm">
										{note}
									</p>
								)}
								<div className="flex flex-col items-start gap-3">
									<CTAList ctas={ctas} />
									{mapUrl && (
										<a
											href={mapUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={cn(
												'group w-fit gap-3',
												hasBookingCta ? 'action-outline' : 'action',
											)}
										>
											<span>{actionLabel}</span>
											<span
												aria-hidden="true"
												className={cn(
													'grid size-7 place-items-center rounded-full text-lg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-px',
													hasBookingCta
														? 'bg-ink/8'
														: 'bg-canvas/15',
												)}
											>
												↗
											</span>
										</a>
									)}
								</div>
								<p className="text-clinic-stone text-xs">
									Map tiles © OpenStreetMap contributors
								</p>
							</div>
						</div>
					</div>
				</div>
			</Reveal>
		</section>
	)
}
