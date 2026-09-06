'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PiShareNetwork, PiWhatsappLogo } from 'react-icons/pi'

export default function ProductActionBar({
	title,
	enquireHref,
	whatsappHref,
}: {
	title: string
	enquireHref: string
	whatsappHref?: string
}) {
	const [shared, setShared] = useState(false)

	async function shareProduct() {
		const shareData = { title, url: window.location.href }
		if (navigator.share) {
			await navigator.share(shareData)
			return
		}
		await navigator.clipboard.writeText(window.location.href)
		setShared(true)
		window.setTimeout(() => setShared(false), 1600)
	}

	return (
		<div className="border-ink/10 bg-canvas/95 fixed inset-x-3 bottom-3 z-40 rounded-[1.5rem] border p-2 shadow-[0_20px_65px_rgb(16_27_23_/_0.28)] backdrop-blur-2xl lg:hidden">
			<div className="grid grid-cols-[1fr_auto_auto] items-center gap-1">
				<Link
					href={enquireHref}
					className="bg-accent text-canvas flex min-h-11 items-center justify-center rounded-full px-4 text-center text-xs font-bold"
				>
					Enquire about this item
				</Link>
				{whatsappHref ? (
					<a
						href={whatsappHref}
						aria-label={`Ask about ${title} on WhatsApp`}
						className="bg-[#25D366] grid size-11 place-items-center rounded-full text-white transition hover:brightness-95"
					>
						<PiWhatsappLogo aria-hidden="true" className="size-5" />
					</a>
				) : null}
				<button
					type="button"
					onClick={shareProduct}
					aria-label="Share this item"
					className="text-accent hover:bg-ink/5 relative grid size-11 place-items-center rounded-full transition"
				>
					<PiShareNetwork aria-hidden="true" className="size-5" />
					{shared && (
						<span className="bg-accent absolute -top-8 right-0 rounded-full px-2 py-1 text-[9px] font-bold text-white">
							Copied
						</span>
					)}
				</button>
			</div>
		</div>
	)
}
