declare global {
	interface Window {
		grecaptcha?: {
			ready: (callback: () => void) => void
			execute: (siteKey: string, options: { action: string }) => Promise<string>
		}
	}
}

let recaptchaPromise: Promise<void> | undefined

export const loadRecaptcha = (siteKey: string): Promise<void> => {
	if (window.grecaptcha) return Promise.resolve()
	if (recaptchaPromise) return recaptchaPromise

	recaptchaPromise = new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
		script.async = true
		script.dataset.recaptcha = 'true'
		script.onload = () => resolve()
		script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
		document.head.append(script)
	})

	return recaptchaPromise
}

export const getRecaptchaToken = async (
	siteKey: string,
	action: string,
): Promise<string> => {
	await loadRecaptcha(siteKey)

	return new Promise((resolve, reject) => {
		const grecaptcha = window.grecaptcha
		if (!grecaptcha) return reject(new Error('reCAPTCHA not loaded'))

		grecaptcha.ready(() => {
			grecaptcha.execute(siteKey, { action }).then(resolve).catch(reject)
		})
	})
}
