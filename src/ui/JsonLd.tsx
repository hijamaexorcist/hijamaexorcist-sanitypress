import { toJsonLdScript } from '@/lib/jsonLd'

export default function JsonLd({
	data,
}: {
	data?: Record<string, unknown> | null
}) {
	const html = toJsonLdScript(data)
	if (!html) return null

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}
