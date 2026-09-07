import { resolveBaseUrl } from './seo/siteUrl'

export const dev = process.env.NODE_ENV === 'development'

export const vercelPreview = process.env.VERCEL_ENV === 'preview'

export const BASE_URL = resolveBaseUrl()

export const BLOG_DIR = 'blog'
export const SHOP_DIR = 'shop'
