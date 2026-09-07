import { getSite } from '@/sanity/lib/queries'
import { parseWhatsAppNumber, waLink } from '@/lib/utils'
import { siteGraphJsonLd, toJsonLdScript } from '@/lib/jsonLd'

export type ClinicContact = {
	title: string
	phone?: string
	whatsapp?: string
	whatsappMessage: string
	whatsappHref?: string
	email?: string
	city?: string
	serviceArea?: string
	countryCode?: string
	seoDescription?: string
	sameAs: string[]
	ogimage?: string
}

function socialLinks(site: Sanity.Site) {
	return (
		site.social?.items
			?.filter(
				(item): item is Sanity.Link =>
					item._type === 'link' && Boolean(item.external),
			)
			.map((item) => item.external!) || []
	)
}

function resolveWhatsApp(site: Sanity.Site) {
	if (site.contact?.whatsapp) {
		return site.contact.whatsapp.replace(/\D/g, '') || undefined
	}

	for (const url of socialLinks(site)) {
		const parsed = parseWhatsAppNumber(url)
		if (parsed) return parsed
	}

	return (
		process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || undefined
	)
}

/**
 * Deep clinic-contact module: one interface for WhatsApp, JSON-LD, and forms.
 * Callers should not re-resolve phone / social / env fallbacks themselves.
 */
export async function getClinicContact(): Promise<ClinicContact> {
	const site = await getSite()
	const whatsapp = resolveWhatsApp(site)
	const whatsappMessage =
		site.contact?.whatsappMessage ||
		`Assalamu alaikum — I'd like to book a Hijama appointment with ${site.title}.`

	return {
		title: site.title,
		phone: site.contact?.phone,
		whatsapp,
		whatsappMessage,
		whatsappHref: whatsapp ? waLink(whatsapp, whatsappMessage) : undefined,
		email: site.contact?.email,
		city: site.contact?.city,
		serviceArea: site.contact?.serviceArea,
		countryCode: site.contact?.countryCode,
		seoDescription: site.contact?.seoDescription,
		sameAs: socialLinks(site),
		ogimage: site.ogimage,
	}
}

export function clinicJsonLdFromContact(contact: ClinicContact) {
	return siteGraphJsonLd(contact)
}

export function clinicJsonLdScript(contact: ClinicContact) {
	return toJsonLdScript(clinicJsonLdFromContact(contact))
}
