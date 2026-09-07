export const PRODUCTION_BASE_URL =
	'https://www.hijamaexorcist.com' as const

export function resolveBaseUrl(
	configured = process.env.NEXT_PUBLIC_BASE_URL,
	environment = process.env.NODE_ENV,
) {
	if (environment === 'development' && !configured) return PRODUCTION_BASE_URL
	if (!configured) throw new Error('NEXT_PUBLIC_BASE_URL is required')

	const url = new URL(configured)
	if (url.protocol !== 'https:') throw new Error('Production URL must use HTTPS')
	if (url.hostname === 'sanitypress.dev')
		throw new Error('NEXT_PUBLIC_BASE_URL uses the retired domain')
	if (url.origin !== PRODUCTION_BASE_URL)
		throw new Error(`Production URL must be ${PRODUCTION_BASE_URL}`)

	return url.origin
}

export function absoluteUrl(path = '/') {
	return new URL(path, `${PRODUCTION_BASE_URL}/`).toString()
}
