// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

const loadModule = async () => {
	vi.resetModules()
	return import('./recaptcha')
}

describe('loadRecaptcha', () => {
	beforeEach(() => {
		document.head.innerHTML = ''
		delete window.grecaptcha
	})

	it('deduplicates concurrent script loads', async () => {
		const { loadRecaptcha } = await loadModule()

		const first = loadRecaptcha('site-key')
		const second = loadRecaptcha('site-key')

		expect(document.querySelectorAll('script[data-recaptcha]')).toHaveLength(1)

		document.querySelector<HTMLScriptElement>('script[data-recaptcha]')!
			.onload!(new Event('load'))

		await expect(Promise.all([first, second])).resolves.toEqual([
			undefined,
			undefined,
		])
	})

	it('rejects when the script fails to load', async () => {
		const { loadRecaptcha } = await loadModule()
		const result = loadRecaptcha('site-key')

		const script = document.querySelector<HTMLScriptElement>(
			'script[data-recaptcha]',
		)!
		script.onerror!(new Event('error'))

		await expect(result).rejects.toThrow('Failed to load reCAPTCHA')
	})

	it('removes a failed script and allows a later retry', async () => {
		const { loadRecaptcha } = await loadModule()
		const first = loadRecaptcha('site-key')
		const failedScript = document.querySelector<HTMLScriptElement>(
			'script[data-recaptcha]',
		)!

		failedScript.onerror!(new Event('error'))
		await expect(first).rejects.toThrow('Failed to load reCAPTCHA')

		expect(failedScript.isConnected).toBe(false)

		const retry = loadRecaptcha('site-key')
		const retryScript = document.querySelector<HTMLScriptElement>(
			'script[data-recaptcha]',
		)!

		expect(retryScript).not.toBe(failedScript)
		expect(document.querySelectorAll('script[data-recaptcha]')).toHaveLength(1)

		retryScript.onload!(new Event('load'))
		await expect(retry).resolves.toBeUndefined()
	})

	it('does not insert a script when reCAPTCHA already exists', async () => {
		window.grecaptcha = {
			ready: vi.fn(),
			execute: vi.fn(async () => 'token'),
		}
		const { loadRecaptcha } = await loadModule()

		await expect(loadRecaptcha('site-key')).resolves.toBeUndefined()
		expect(document.querySelector('script[data-recaptcha]')).toBeNull()
	})
})
