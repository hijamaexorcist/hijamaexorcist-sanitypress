import { describe, expect, it, vi } from 'vitest'
import { Img } from './Img'

vi.mock('@sanity/asset-utils', () => ({
	getImageDimensions: () => ({ width: 1200, height: 800 }),
}))

vi.mock('@/sanity/lib/image', () => ({
	urlFor: () => ({
		withOptions: () => ({
			url: () => 'https://cdn.sanity.io/test-image.jpg',
		}),
	}),
}))

const image = (loading?: 'eager' | 'lazy') =>
	({
		asset: { _ref: 'image-test-1200x800-jpg' },
		loading,
	}) as unknown as Sanity.Image

describe('Img loading', () => {
	it('prefers an explicit loading prop over CMS loading', () => {
		const result = Img({ image: image('eager'), loading: 'lazy' })

		expect(result?.props).toEqual(
			expect.objectContaining({
				loading: 'lazy',
				priority: false,
			}),
		)
	})

	it('uses CMS loading when an explicit prop is absent', () => {
		const result = Img({ image: image('eager') })

		expect(result?.props).toEqual(
			expect.objectContaining({
				loading: 'eager',
				priority: true,
			}),
		)
	})
})
