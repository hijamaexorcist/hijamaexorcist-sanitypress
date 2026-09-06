import { languages } from '@/lib/i18n'
import type { ComponentProps } from 'react'

export default function Root(props: ComponentProps<'html'>) {
	return (
		<html
			{...props}
			lang={languages?.[0] || 'en'}
			className="show-scrollbars"
			data-scroll-behavior="smooth"
			suppressHydrationWarning
		/>
	)
}
