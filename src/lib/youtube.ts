export const YOUTUBE_URL_PATTERN =
	/^https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)[A-Za-z0-9_-]{6,}/

export function getYouTubeId(value?: string | null) {
	if (!value) return null
	try {
		const url = new URL(value.trim())
		if (url.hostname === 'youtu.be') {
			return url.pathname.split('/').filter(Boolean)[0] || null
		}
		if (!url.hostname.endsWith('youtube.com')) return null
		return (
			url.searchParams.get('v') ||
			url.pathname.match(/^\/(?:shorts|embed)\/([A-Za-z0-9_-]+)/)?.[1] ||
			null
		)
	} catch {
		return null
	}
}

export function youtubeThumbnail(id: string) {
	return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}
