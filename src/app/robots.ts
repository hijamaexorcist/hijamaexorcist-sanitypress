import { PRODUCTION_BASE_URL, absoluteUrl } from '@/lib/seo/siteUrl'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [
				'/admin/',
				'/api/draft-mode/',
				'/api/forms/',
				'/api/webhooks/',
			],
		},
		sitemap: absoluteUrl('/sitemap.xml'),
		host: PRODUCTION_BASE_URL,
	}
}
