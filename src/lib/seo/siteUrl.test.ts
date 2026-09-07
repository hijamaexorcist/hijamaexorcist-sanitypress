import { describe, expect, it } from 'vitest'
import {
	PRODUCTION_BASE_URL,
	absoluteUrl,
	resolveBaseUrl,
} from './siteUrl'

describe('canonical site URL', () => {
	it('uses the www production origin', () => {
		expect(PRODUCTION_BASE_URL).toBe('https://www.hijamaexorcist.com')
		expect(resolveBaseUrl('https://www.hijamaexorcist.com/')).toBe(
			PRODUCTION_BASE_URL,
		)
	})

	it('rejects stale or insecure production origins', () => {
		expect(() => resolveBaseUrl('https://sanitypress.dev')).toThrow(
			/retired domain/i,
		)
		expect(() => resolveBaseUrl('http://www.hijamaexorcist.com')).toThrow(
			/https/i,
		)
	})

	it('keeps canonicals production-safe in development', () => {
		expect(resolveBaseUrl(undefined, 'development')).toBe(
			PRODUCTION_BASE_URL,
		)
	})

	it('joins absolute paths without duplicate slashes', () => {
		expect(absoluteUrl('/blog/example')).toBe(
			'https://www.hijamaexorcist.com/blog/example',
		)
	})
})
