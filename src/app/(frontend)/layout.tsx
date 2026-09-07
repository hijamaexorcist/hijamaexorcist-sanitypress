import Root from '@/ui/Root'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'
import Header from '@/ui/header'
import Footer from '@/ui/footer'
import WhatsAppFloat from '@/ui/WhatsAppFloat'
import ClinicJsonLd from '@/ui/ClinicJsonLd'
import VisualEditingControls from '@/ui/VisualEditingControls'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/app.css'
import Script from 'next/script'
import { DM_Serif_Display, Instrument_Sans } from 'next/font/google'
import LanguageSync from '@/ui/LanguageSync'
import OverlayScrollbars from '@/ui/OverlayScrollbars'
import type { Viewport } from 'next'

const instrumentSans = Instrument_Sans({
	subsets: ['latin'],
	style: ['normal', 'italic'],
	display: 'swap',
	variable: '--font-instrument-sans',
})

const dmSerifDisplay = DM_Serif_Display({
	subsets: ['latin'],
	weight: '400',
	style: ['normal', 'italic'],
	display: 'swap',
	variable: '--font-dm-serif-display',
})

export const viewport: Viewport = {
	themeColor: '#101b17',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Root>
			{/* <GoogleTagManager gtmId="" /> */}
			<body
				className={`${instrumentSans.variable} ${dmSerifDisplay.variable} bg-canvas text-ink antialiased`}
				suppressHydrationWarning
			>
				<Script
					id="theme-preference"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: `(function(){var K='hijama-theme';function sync(v){document.documentElement.dataset.theme=v;document.documentElement.style.colorScheme=v;document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=v==='dark'?'#101b17':'#f5f4ed'})}function apply(v){sync(v);try{localStorage.setItem(K,v)}catch(e){}try{window.dispatchEvent(new CustomEvent('hijama-theme',{detail:v}))}catch(e){}}function preferred(){try{var t=localStorage.getItem(K);return t==='dark'||t==='light'?t:'dark'}catch(e){return 'dark'}}try{sync(preferred())}catch(e){document.documentElement.dataset.theme='dark'}document.addEventListener('click',function(e){var btn=e.target&&e.target.closest&&e.target.closest('[data-theme-toggle]');if(!btn)return;e.preventDefault();e.stopPropagation();var cur=document.documentElement.dataset.theme==='dark'?'dark':'light';apply(cur==='dark'?'light':'dark')},true)})();`,
					}}
				/>
				<LanguageSync />
				<OverlayScrollbars />
				<ClinicJsonLd />
				<NuqsAdapter>
					<SkipToContent />
					<Announcement />
					<Header />
					<main id="main-content" role="main" tabIndex={-1}>
						{children}
					</main>
					<Footer />
					<WhatsAppFloat />

					<VisualEditingControls />
				</NuqsAdapter>

				<Analytics />
				<SpeedInsights />
			</body>
		</Root>
	)
}
