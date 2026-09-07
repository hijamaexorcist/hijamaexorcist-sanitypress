import type { SanityAssetDocument, SanityDocument } from 'next-sanity'

declare global {
	namespace Sanity {
		// documents

		interface Site extends SanityDocument {
			// branding
			title: string
			blurb?: any
			logo?: Logo
			// info
			announcements?: Announcement[]
			copyright?: any
			ogimage?: string
			contact?: {
				phone?: string
				whatsapp?: string
				whatsappMessage?: string
				email?: string
				city?: string
				region?: string
				serviceArea?: string
				countryCode?: string
				seoDescription?: string
			}
			// navigation
			ctas?: CTA[]
			headerMenu?: Navigation
			footerMenu?: Navigation
			social?: Navigation
		}

		interface Navigation extends SanityDocument {
			title: string
			items?: (Link | LinkList)[]
		}

		// pages

		interface PageBase extends SanityDocument {
			title?: string
			metadata: Metadata
			readonly language?: string
		}

		interface Page extends PageBase {
			readonly _type: 'page'
			modules?: Module[]
		}

		interface Translation {
			slug: string
			translations?: {
				slug: string
				slugBlogAlt?: string
				language: string
			}[]
		}

		interface GlobalModule extends SanityDocument {
			path: string
			excludePaths?: string[]
			modules?: Module[]
		}

		interface BlogPost extends PageBase {
			readonly _type: 'blog.post'
			body: any
			readTime: number
			headings?: { style: string; text: string }[]
			categories: BlogCategory[]
			authors: Person[]
			featured: boolean
			hideTableOfContents: boolean
			publishDate: string
			featuredVideo?: {
				url?: string
				title?: string
				caption?: string
			}
		}

		interface BlogCategory extends SanityDocument {
			title: string
			slug: { current: string }
		}

		interface Product extends PageBase {
			readonly _type: 'product'
			title: string
			excerpt?: string
			image?: Image
			imageUrl?: string
			gallery?: Image[]
			galleryImageUrls?: string[]
			price?: number
			priceNote?: string
			content?: any
			ctas?: CTA[]
			available?: boolean
			availability?: 'enquire' | 'in-stock' | 'unavailable'
			featured?: boolean
			displayOrder?: number
			tags?: string[]
			category?: ProductCategory
		}

		interface ProductCategory extends SanityDocument {
			readonly _type: 'product.category'
			title: string
			slug?: { current: string }
			description?: string
			displayOrder?: number
		}

		// miscellaneous

		interface Announcement extends SanityDocument {
			content: any
			cta?: Link
			start?: string
			end?: string
		}

		interface Logo extends SanityDocument {
			name: string
			image?: Partial<{
				default: Image
				light: Image
				dark: Image
			}>
		}

		interface Person extends SanityDocument {
			name: string
			image?: Image
		}

		interface Pricing extends SanityDocument {
			title: string
			highlight?: string
			price: {
				base?: number
				strikethrough?: number
				suffix?: string
			}
			ctas?: CTA[]
			content?: any
		}

		interface Reputation extends SanityDocument {
			title?: string
			subtitle?: string
			repo?: string
			showForks?: boolean
			limit?: number
			avatars?: Image[]
		}

		interface Testimonial extends SanityDocument {
			content: any
			source?: string
			author?: {
				name: string
				title?: string
				image?: Image
			}
		}

		// objects

		interface Code {
			readonly _type: 'code'
			language: string
			code: string
			filename?: string
			highlightedLines?: number[]
		}

		interface CTA {
			readonly _type?: 'cta'
			_key?: string
			link?: Link
			style?: string
		}

		interface CustomHTML extends Module<'custom-html'> {
			className?: string
			html?: {
				code: string
			}
		}

		interface Icon {
			readonly _type: 'icon'
			image?: Image
			ic0n?: string
			size?: string
		}

		interface Img {
			readonly _type: 'img'
			image: Image
			responsive?: {
				image: Image
				media: string
			}[]
			alt?: string
			loading?: 'lazy' | 'eager'
		}

		interface Image extends SanityAssetDocument {
			_key?: string
			alt: string
			loading: 'lazy' | 'eager'
		}

		interface Link {
			readonly _type: 'link'
			label: string
			type: 'internal' | 'external'
			internal?: Page | BlogPost | Product
			external?: string
			params?: string
		}

		interface LinkList {
			readonly _type: 'link.list'
			link?: Link
			links?: Link[]
		}

		interface Metadata {
			slug: { current: string }
			title: string
			description: string
			image?: Image
			ogimage?: string
			noIndex: boolean
		}

		interface Module<T = string> {
			_type: T
			_key: string
			options?: {
				hidden?: boolean
				uid?: string
			}
		}

		interface ClinicianProfile {
			pretitle?: string
			name?: string
			role?: string
			title?: string
			bio?: string
			bioSecondary?: string
			portrait?: Img
			instagramUrl?: string
			notes?: string[]
			ctas?: CTA[]
		}

		interface ClinicMap {
			pretitle?: string
			title?: string
			description?: string
			ctas?: CTA[]
			locationName?: string
			address?: string
			latitude: number
			longitude: number
			zoom?: number
			directionsUrl?: string
			directionsLabel?: string
			note?: string
		}

		interface ShopList {
			pretitle?: string
			intro?: any
			emptyNote?: string
			showCategoryFilter?: boolean
			showTagFilter?: boolean
		}

		interface CareStandards {
			pretitle?: string
			title?: string
			description?: string
			standards?: Array<{
				title?: string
				description?: string
			}>
		}

		interface CareBenefits {
			pretitle?: string
			title?: string
			description?: string
			items?: Array<{
				_key?: string
				title?: string
				description?: string
			}>
			disclaimer?: string
		}

		interface ClinicGallery {
			pretitle?: string
			title?: string
			description?: string
			images?: Array<{
				_key: string
				image?: Img
				caption?: string
			}>
		}
		interface TraditionGuidance {
			pretitle?: string
			title?: string
			quote?: string
			reference?: string
			sourceUrl?: string
			context?: string
			quranNote?: string
			quranUrl?: string
		}
		interface EducationBento {
			pretitle?: string
			title?: string
			description?: string
			image?: Img
			topics?: Array<{
				_key: string
				label?: string
				title?: string
				description?: string
			}>
		}
		interface VideoLibrary {
			pretitle?: string
			title?: string
			description?: string
			videos?: Array<{
				_key: string
				title?: string
				url?: string
				description?: string
			}>
		}
	}
}

export {}
