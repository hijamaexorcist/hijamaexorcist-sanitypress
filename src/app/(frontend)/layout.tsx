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
import LanguageSync from '@/ui/LanguageSync'
import OverlayScrollbars from '@/ui/OverlayScrollbars'
import type { Viewport } from 'next'

export const viewport: Viewport = {
	themeColor: '#101b17',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

	return (
		<Root>
			{/* <GoogleTagManager gtmId="" /> */}
			<body className="bg-canvas text-ink antialiased" suppressHydrationWarning>
				<Script
					id="theme-preference"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: `(function(){var K='hijama-theme';function sync(v){document.documentElement.dataset.theme=v;document.documentElement.style.colorScheme=v;document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=v==='dark'?'#101b17':'#f5f4ed'})}function apply(v){sync(v);try{localStorage.setItem(K,v)}catch(e){}try{window.dispatchEvent(new CustomEvent('hijama-theme',{detail:v}))}catch(e){}}function preferred(){try{var t=localStorage.getItem(K);return t==='dark'||t==='light'?t:'dark'}catch(e){return 'dark'}}try{sync(preferred())}catch(e){document.documentElement.dataset.theme='dark'}document.addEventListener('click',function(e){var btn=e.target&&e.target.closest&&e.target.closest('[data-theme-toggle]');if(!btn)return;e.preventDefault();e.stopPropagation();var cur=document.documentElement.dataset.theme==='dark'?'dark':'light';apply(cur==='dark'?'light':'dark')},true)})();`,
					}}
				/>
				<LanguageSync />
				<OverlayScrollbars />
				{recaptchaSiteKey && (
					<Script
						src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
						strategy="afterInteractive"
					/>
				)}
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
