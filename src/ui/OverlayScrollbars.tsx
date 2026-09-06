'use client'

import { useEffect } from 'react'
import { registerOverlayScrollbarRoot } from '@/lib/overlay-scrollbars'

/** Boots OpenIslam-style zero-layout-width overlay scrollbars. */
export default function OverlayScrollbars() {
	useEffect(() => registerOverlayScrollbarRoot(document), [])
	return null
}
