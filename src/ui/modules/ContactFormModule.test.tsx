/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

const navigation = vi.hoisted(
	(): {
		rejectSearchParams: boolean
		searchParams: URLSearchParams | null
	} => ({
		rejectSearchParams: false,
		searchParams: null,
	}),
)

vi.mock('next/navigation', () => ({
	useSearchParams: () => {
		if (navigation.rejectSearchParams) {
			throw new Error('useSearchParams is unavailable during static rendering')
		}

		return navigation.searchParams ?? new URLSearchParams()
	},
}))

vi.mock('@/lib/moduleProps', () => ({ default: () => ({}) }))
vi.mock('@/lib/recaptcha', () => ({ getRecaptchaToken: vi.fn() }))
vi.mock('@/ui/CTAList', () => ({ default: () => null }))

import ContactFormModule from './ContactFormModule'

let root: Root | undefined
const reactTestEnvironment = globalThis as typeof globalThis & {
	IS_REACT_ACT_ENVIRONMENT: boolean
}
reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = true

afterEach(() => {
	navigation.rejectSearchParams = false
	navigation.searchParams = null
	window.history.replaceState(null, '', '/')

	if (root) {
		act(() => root?.unmount())
		root = undefined
	}
})

describe('ContactFormModule', () => {
	it('renders the full form and one h1 in static HTML', () => {
		navigation.rejectSearchParams = true
		let html = ''

		expect(() => {
			html = renderToString(<ContactFormModule />)
		}).not.toThrow()

		expect(html.match(/<h1\b/g)).toHaveLength(1)
		expect(html).toContain('Contact the clinic')
		expect(html).toContain('<form')
		expect(html).toContain('<textarea')
	})

	it('applies product and reason query prefills after mounting', async () => {
		window.history.replaceState(
			null,
			'',
			'/?product=Glass%20Cups&reason=Product%20question',
		)
		navigation.searchParams = new URLSearchParams(window.location.search)
		const container = document.createElement('div')
		document.body.append(container)
		root = createRoot(container)

		act(() => root?.render(<ContactFormModule />))

		const message = container.querySelector('textarea')
		const reason = container.querySelector('select')
		expect(message?.value).toBe('I am enquiring about: Glass Cups')
		expect(reason?.value).toBe('Product question')
		expect([...reason!.options].map((option) => option.value)).toContain(
			'Product question',
		)

		container.remove()
	})
})
