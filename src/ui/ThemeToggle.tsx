'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'hijama-theme'

export type Theme = 'light' | 'dark'

export function getPreferredTheme(): Theme {
	if (typeof window === 'undefined') return 'dark'
	const stored = localStorage.getItem(STORAGE_KEY)
	// Dark by default until the visitor explicitly toggles.
	return stored === 'dark' || stored === 'light' ? stored : 'dark'
}

export function syncTheme(theme: Theme) {
	document.documentElement.dataset.theme = theme
	document.documentElement.style.colorScheme = theme

	document
		.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
		.forEach((themeColor) => {
			themeColor.content = theme === 'dark' ? '#101b17' : '#f5f4ed'
		})
}

export function applyTheme(theme: Theme) {
	syncTheme(theme)
	localStorage.setItem(STORAGE_KEY, theme)
	window.dispatchEvent(new CustomEvent('hijama-theme', { detail: theme }))
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>('dark')

	useEffect(() => {
		const initial = getPreferredTheme()
		setTheme(initial)
		syncTheme(initial)

		const onThemeEvent = (event: Event) => {
			const next = (event as CustomEvent<Theme>).detail
			if (next === 'dark' || next === 'light') setTheme(next)
		}

		window.addEventListener('hijama-theme', onThemeEvent)
		return () => window.removeEventListener('hijama-theme', onThemeEvent)
	}, [])

	return (
		<button
			type="button"
			data-theme-toggle
			className="theme-toggle ring-ink/10 focus-visible:outline-clinic-clay relative grid size-11 shrink-0 place-items-center rounded-full ring-1 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
			aria-label="Switch between light and dark theme"
			aria-pressed={theme === 'dark'}
			title="Switch color theme"
			onClick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
		>
			<Sun
				className="theme-icon theme-icon-sun size-[1.15rem]"
				aria-hidden="true"
			/>
			<Moon
				className="theme-icon theme-icon-moon size-[1.05rem]"
				aria-hidden="true"
			/>
		</button>
	)
}
