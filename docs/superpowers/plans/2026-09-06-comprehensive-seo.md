# Comprehensive SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the site's crawl signals and comprehensively optimize its existing pages, articles, and products for local bookings, educational discovery, and shop enquiries.

**Architecture:** A validated canonical-origin module will feed all URL-producing surfaces. Pure, typed metadata, sitemap, and JSON-LD builders will sit between Sanity queries and small rendering components so they can be unit-tested without a browser or CMS. Editorial validation and measured frontend changes will keep SEO quality intact after launch.

**Tech Stack:** Next.js 16 App Router metadata routes, React 19 Server Components, TypeScript 5.9, Sanity 6/GROQ, Vitest, next/font, Vercel Analytics and Speed Insights.

## Global Constraints

- The sole production origin is `https://www.hijamaexorcist.com`; the apex domain redirects to it.
- Target Piscataway and Central New Jersey only where that geography is accurate.
- Optimize existing content only; do not create service, location, or topic landing pages.
- Do not invent an address, credential, price, availability, rating, review, or medical claim.
- Keep preview deployments non-indexable.
- Preserve evidence-aware wording, consent language, and medical boundaries.
- Use React Server Components unless browser state or event handling is required.
- Use the project's `Img` component for Sanity images.
- Read the current Next.js metadata guide and Sanity validation guidance before editing their respective code.
- Do not alter the user's existing `.recall/.capture.json` change.

## File Structure

### New files

- `vitest.config.ts` — aliases and test environment defaults.
- `src/lib/seo/siteUrl.ts` — pure canonical-origin validation and URL construction.
- `src/lib/seo/sitemap.ts` — pure conversion of Sanity records to sitemap entries.
- `src/lib/seo/siteUrl.test.ts` — canonical-origin regression tests.
- `src/lib/seo/sitemap.test.ts` — sitemap filtering and URL tests.
- `src/lib/processMetadata.test.ts` — common and page-type metadata tests.
- `src/lib/jsonLd.test.ts` — site, article, product, breadcrumb, and serialization tests.
- `src/lib/recaptcha.test.ts` — lazy script-loader tests in jsdom.
- `src/ui/JsonLd.tsx` — one safe server-rendered JSON-LD script component.
- `src/app/robots.ts` — Next.js robots metadata route.
- `scripts/check-seo.mjs` — rendered-page crawl and metadata smoke test.

### Modified files

- `package.json`, `package-lock.json` — Vitest/jsdom and SEO verification scripts.
- `src/lib/env.ts`, `src/lib/resolveUrl.ts` — use the validated origin exclusively.
- `src/app/sitemap.ts` — query records and delegate URL construction.
- `src/lib/processMetadata.ts` — shared metadata defaults and page-type fields.
- `src/app/(frontend)/not-found.tsx` — unconditional noindex metadata.
- `src/app/(frontend)/[[...slug]]/page.tsx` — page structured data.
- `src/app/(frontend)/blog/[...slug]/page.tsx` — article structured data and updated metadata inputs.
- `src/app/(frontend)/shop/[slug]/page.tsx` — product/breadcrumb structured data.
- `src/app/(frontend)/blog/rss.xml/route.ts` — canonical feed URLs and index filtering.
- `src/app/api/og/route.tsx`, `src/sanity/ui/PreviewOG.tsx`, `src/ui/modules/SearchModule/SearchGoogle.tsx` — canonical helper adoption.
- `src/lib/jsonLd.ts`, `src/lib/clinicContact.ts`, `src/ui/ClinicJsonLd.tsx` — connected structured-data graph and page entities.
- `src/sanity/schemaTypes/objects/metadata.tsx` — publishing errors plus editorial warnings.
- `src/sanity/schemaTypes/documents/site.ts` — public region/service-area fields.
- `src/sanity/schemaTypes/documents/product.ts`, `src/sanity/schemaTypes/fragments/image-block.ts` — meaningful image-alt validation.
- `src/types/Sanity.d.ts` — structured-data inputs and new public contact fields.
- `src/app/(frontend)/layout.tsx`, `src/styles/app.css` — self-host Google fonts and remove global reCAPTCHA.
- `src/lib/recaptcha.ts` — idempotent on-demand script loading.
- `src/ui/modules/blog/PostPreviewLarge.tsx`, `src/ui/modules/blog/PostPreview.tsx`, `src/ui/modules/blog/PostContent.tsx`, `src/ui/modules/shop/ProductCard.tsx`, `src/ui/modules/shop/ProductGallery.tsx`, `src/ui/modules/RichtextModule/Image.tsx` — responsive image sizes.
- `README.md` — canonical environment example and SEO verification commands.

---

### Task 1: Canonical Origin and Test Harness

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/seo/siteUrl.ts`
- Create: `src/lib/seo/siteUrl.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/lib/env.ts`
- Modify: `src/lib/resolveUrl.ts`
- Modify: `src/app/api/og/route.tsx`
- Modify: `src/sanity/ui/PreviewOG.tsx`
- Modify: `src/ui/modules/SearchModule/SearchGoogle.tsx`
- Modify: `README.md`

**Interfaces:**
- Produces: `PRODUCTION_BASE_URL: "https://www.hijamaexorcist.com"`.
- Produces: `resolveBaseUrl(configured?: string, environment?: string): string`.
- Produces: `absoluteUrl(path?: string): string`.
- Existing callers continue consuming `BASE_URL` from `src/lib/env.ts`.

- [ ] **Step 1: Add the test runner**

Run:

```bash
npm install --save-dev vitest jsdom
```

Add scripts:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Configure the existing `@` alias:

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: { environment: 'node' },
	resolve: {
		alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
	},
})
```

- [ ] **Step 2: Write failing canonical-origin tests**

Cover the canonical value, removal of trailing slashes, the canonical development fallback, rejection of `sanitypress.dev`, rejection of non-HTTPS production URLs, and path joining:

```ts
import { describe, expect, it } from 'vitest'
import {
	PRODUCTION_BASE_URL,
	absoluteUrl,
	resolveBaseUrl,
} from './siteUrl'

describe('canonical site URL', () => {
	it('uses the www production origin', () => {
		expect(PRODUCTION_BASE_URL).toBe('https://www.hijamaexorcist.com')
		expect(resolveBaseUrl('https://www.hijamaexorcist.com/')).toBe(
			PRODUCTION_BASE_URL,
		)
	})

	it('rejects stale or insecure production origins', () => {
		expect(() => resolveBaseUrl('https://sanitypress.dev')).toThrow(
			/retired domain/i,
		)
		expect(() => resolveBaseUrl('http://www.hijamaexorcist.com')).toThrow(
			/https/i,
		)
	})

	it('keeps canonicals production-safe in development', () => {
		expect(resolveBaseUrl(undefined, 'development')).toBe(
			PRODUCTION_BASE_URL,
		)
	})

	it('joins absolute paths without duplicate slashes', () => {
		expect(absoluteUrl('/blog/example')).toBe(
			'https://www.hijamaexorcist.com/blog/example',
		)
	})
})
```

- [ ] **Step 3: Run the test and verify red**

Run:

```bash
npm test -- src/lib/seo/siteUrl.test.ts
```

Expected: FAIL because `src/lib/seo/siteUrl.ts` does not exist.

- [ ] **Step 4: Implement and adopt the canonical helper**

Implement a pure validator with this behavior:

```ts
export const PRODUCTION_BASE_URL =
	'https://www.hijamaexorcist.com' as const

export function resolveBaseUrl(
	configured = process.env.NEXT_PUBLIC_BASE_URL,
	environment = process.env.NODE_ENV,
) {
	if (environment === 'development' && !configured) return PRODUCTION_BASE_URL
	if (!configured) throw new Error('NEXT_PUBLIC_BASE_URL is required')

	const url = new URL(configured)
	if (url.protocol !== 'https:') throw new Error('Production URL must use HTTPS')
	if (url.hostname === 'sanitypress.dev')
		throw new Error('NEXT_PUBLIC_BASE_URL uses the retired domain')
	if (url.origin !== PRODUCTION_BASE_URL)
		throw new Error(`Production URL must be ${PRODUCTION_BASE_URL}`)

	return url.origin
}

export function absoluteUrl(path = '/') {
	return new URL(path, `${PRODUCTION_BASE_URL}/`).toString()
}
```

Export `BASE_URL = resolveBaseUrl()` from `src/lib/env.ts`. Replace every direct `NEXT_PUBLIC_BASE_URL` read used to produce a public URL with `BASE_URL` or `absoluteUrl()`, including `resolveUrl`, Open Graph generation, Studio previews, Google site search, and the README example.

- [ ] **Step 5: Run focused and static checks**

Run:

```bash
npm test -- src/lib/seo/siteUrl.test.ts
npm run typecheck
```

Expected: all tests pass and TypeScript reports no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts README.md src/lib/seo/siteUrl.ts src/lib/seo/siteUrl.test.ts src/lib/env.ts src/lib/resolveUrl.ts src/app/api/og/route.tsx src/sanity/ui/PreviewOG.tsx src/ui/modules/SearchModule/SearchGoogle.tsx
git commit -m "fix: enforce the canonical production origin"
```

### Task 2: Robots, Sitemap, and RSS

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/lib/seo/sitemap.ts`
- Create: `src/lib/seo/sitemap.test.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/(frontend)/blog/rss.xml/route.ts`

**Interfaces:**
- Consumes: `absoluteUrl()` and `PRODUCTION_BASE_URL` from Task 1.
- Produces: `SitemapDocument` and `buildSitemapEntries(documents): MetadataRoute.Sitemap`.
- Produces: a cached Next.js `MetadataRoute.Robots` response at `/robots.txt`.

- [ ] **Step 1: Write failing sitemap tests**

Use records for a homepage, nested page, article, product, noindex record, 404 page, and malformed slug:

```ts
import { describe, expect, it } from 'vitest'
import { buildSitemapEntries } from './sitemap'

describe('buildSitemapEntries', () => {
	it('maps each public document to its canonical route', () => {
		const entries = buildSitemapEntries([
			{ _type: 'page', slug: 'index', updatedAt: '2026-09-06' },
			{ _type: 'page', slug: 'about', updatedAt: '2026-09-06' },
			{ _type: 'blog.post', slug: 'safe-cupping', updatedAt: '2026-09-06' },
			{ _type: 'product', slug: 'hijama-cups', updatedAt: '2026-09-06' },
		])

		expect(entries.map(({ url }) => url)).toEqual([
			'https://www.hijamaexorcist.com/',
			'https://www.hijamaexorcist.com/about',
			'https://www.hijamaexorcist.com/blog/safe-cupping',
			'https://www.hijamaexorcist.com/shop/hijama-cups',
		])
	})

	it('excludes noindex, 404, empty, and malformed records', () => {
		const entries = buildSitemapEntries([
			{ _type: 'page', slug: '404', updatedAt: '2026-09-06' },
			{ _type: 'page', slug: 'hidden', noIndex: true, updatedAt: '2026-09-06' },
			{ _type: 'page', slug: '../escape', updatedAt: '2026-09-06' },
			{ _type: 'page', slug: '', updatedAt: '2026-09-06' },
		])
		expect(entries).toEqual([])
	})
})
```

- [ ] **Step 2: Run the sitemap test and verify red**

```bash
npm test -- src/lib/seo/sitemap.test.ts
```

Expected: FAIL because the pure sitemap builder does not exist.

- [ ] **Step 3: Implement the sitemap builder and route**

Define:

```ts
export type SitemapDocument = {
	_type: 'page' | 'blog.post' | 'product'
	slug?: string
	updatedAt: string
	noIndex?: boolean
}
```

Filter `noIndex`, `404`, empty slugs, and any slug containing `..`, `?`, `#`, a leading slash, a trailing slash, or a doubled slash. Map document types to `/`, `/blog/`, and `/shop/`. Preserve homepage priority `1`, page priority `0.5`, and article/product priority `0.4`.

Change the GROQ route query to return `_type`, `metadata.slug.current` as `slug`, `_updatedAt` as `updatedAt`, and `metadata.noIndex` as `noIndex`; pass the flattened records into `buildSitemapEntries`.

- [ ] **Step 4: Add the robots metadata route**

Create:

```ts
import {
	PRODUCTION_BASE_URL,
	absoluteUrl,
} from '@/lib/seo/siteUrl'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/admin/', '/api/draft-mode/', '/api/forms/', '/api/webhooks/'],
		},
		sitemap: absoluteUrl('/sitemap.xml'),
		host: PRODUCTION_BASE_URL,
	}
}
```

- [ ] **Step 5: Harden RSS output**

Filter the GROQ post query with `metadata.noIndex != true`, order by `publishDate desc`, use `absoluteUrl('/favicon.ico')`, keep canonical `resolveUrl()` links, and add:

```ts
'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
```

- [ ] **Step 6: Verify crawl outputs**

```bash
npm test -- src/lib/seo/sitemap.test.ts
npm run typecheck
```

Expected: tests and typecheck pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/robots.ts src/app/sitemap.ts src/lib/seo/sitemap.ts src/lib/seo/sitemap.test.ts 'src/app/(frontend)/blog/rss.xml/route.ts'
git commit -m "feat: add canonical crawl directives"
```

### Task 3: Shared Metadata and Page Types

**Files:**
- Create: `src/lib/processMetadata.test.ts`
- Modify: `src/lib/processMetadata.ts`
- Modify: `src/app/(frontend)/not-found.tsx`

**Interfaces:**
- Consumes: `Sanity.PageBase` plus optional blog/product fields already present on the document.
- Produces: `processMetadata(document): Promise<Metadata>`.
- Produces: explicit noindex metadata for all 404 responses.

- [ ] **Step 1: Write failing metadata tests**

Mock `getSite()` to return the clinic name, SEO description, and default image. Assert:

```ts
expect(metadata.alternates?.canonical).toBe(
	'https://www.hijamaexorcist.com/blog/safe-cupping',
)
expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' })
expect(metadata.openGraph).toMatchObject({
	type: 'article',
	publishedTime: '2026-08-01',
	modifiedTime: '2026-09-06T12:00:00Z',
	authors: ['Hijama Exorcist'],
})
expect(metadata.robots).toMatchObject({ index: true, follow: true })
```

Add cases for:

- Page fallback from `metadata.title` to `page.title` to site title.
- Description fallback to the site SEO description.
- Product canonical under `/shop/`.
- Preview and `noIndex` documents returning `index: false, follow: false`.
- No empty `alternates.languages` object for the English-only site.
- Open Graph images shaped as `{ url, width: 1200, height: 630, alt }`.

- [ ] **Step 2: Run the test and verify red**

```bash
npm test -- src/lib/processMetadata.test.ts
```

Expected: FAIL on missing Twitter, article fields, explicit robots values, and fallback behavior.

- [ ] **Step 3: Implement common and page-type metadata**

Fetch cached site settings inside `processMetadata()`. Build common fields once. For articles, return:

```ts
openGraph: {
	type: 'article',
	url,
	title,
	description,
	siteName,
	publishedTime: page.publishDate,
	modifiedTime: page._updatedAt,
	authors: page.authors?.map(({ name }) => name).filter(Boolean),
	images,
},
twitter: {
	card: 'summary_large_image',
	title,
	description,
	images: images.map(({ url }) => url),
},
```

Use `type: 'website'` for pages and products because Next.js Open Graph metadata does not define a product type. Emit RSS alternate discovery only for the blog index and blog posts. Emit language alternates only when non-empty translations exist.

- [ ] **Step 4: Make 404 metadata unconditional**

Replace the CMS metadata passthrough with:

```ts
export async function generateMetadata(): Promise<Metadata> {
	const page = await get404()
	return {
		title: page?.metadata?.title || 'Page not found',
		description: page?.metadata?.description,
		robots: { index: false, follow: false },
	}
}
```

- [ ] **Step 5: Verify metadata**

```bash
npm test -- src/lib/processMetadata.test.ts
npm run typecheck
```

Expected: metadata tests and typecheck pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/processMetadata.ts src/lib/processMetadata.test.ts 'src/app/(frontend)/not-found.tsx'
git commit -m "feat: add complete route metadata"
```

### Task 4: Connected Structured Data

**Files:**
- Create: `src/ui/JsonLd.tsx`
- Create: `src/lib/jsonLd.test.ts`
- Modify: `src/lib/jsonLd.ts`
- Modify: `src/lib/clinicContact.ts`
- Modify: `src/ui/ClinicJsonLd.tsx`
- Modify: `src/app/(frontend)/[[...slug]]/page.tsx`
- Modify: `src/app/(frontend)/blog/[...slug]/page.tsx`
- Modify: `src/app/(frontend)/shop/[slug]/page.tsx`
- Modify: `src/types/Sanity.d.ts`

**Interfaces:**
- Produces: `siteGraphJsonLd(contact)`.
- Produces: `webPageJsonLd(page)`.
- Produces: `blogPostingJsonLd(post)`.
- Produces: `productPageJsonLd(product)`.
- Produces: `breadcrumbJsonLd(items)`.
- Produces: `<JsonLd data={...} />`, which uses `toJsonLdScript()`.

- [ ] **Step 1: Write failing JSON-LD tests**

Assert stable connected identifiers:

```ts
expect(site['@graph']).toEqual(
	expect.arrayContaining([
		expect.objectContaining({
			'@type': 'WebSite',
			'@id': 'https://www.hijamaexorcist.com/#website',
		}),
		expect.objectContaining({
			'@id': 'https://www.hijamaexorcist.com/#clinic',
			areaServed: expect.arrayContaining([
				expect.objectContaining({ name: 'Piscataway' }),
				expect.objectContaining({ name: 'Central New Jersey' }),
			]),
		}),
	]),
)
```

Assert that `BlogPosting` includes canonical `mainEntityOfPage`, headline, image, ISO dates, authors, and publisher. Assert that a priced product has an `Offer` with `USD`; map known in-stock/unavailable values to schema.org availability and omit unknown enquire availability. An enquire-only product without a numeric price has no `offers`, `aggregateRating`, or `review`. Assert breadcrumb positions start at one. Assert serialization changes `<script>` to `\u003cscript>`.

- [ ] **Step 2: Run the test and verify red**

```bash
npm test -- src/lib/jsonLd.test.ts
```

Expected: FAIL because the page-specific builders do not exist.

- [ ] **Step 3: Implement the generic renderer and builders**

The renderer stays a Server Component:

```tsx
import { toJsonLdScript } from '@/lib/jsonLd'

export default function JsonLd({
	data,
}: {
	data?: Record<string, unknown> | null
}) {
	const html = toJsonLdScript(data)
	if (!html) return null
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}
```

Build one site graph with `#website`, `#organization`, and `#clinic`. Use `Organization` as the publisher and identify the clinic's true service area. Keep the medical-business entity but do not claim Google LocalBusiness rich-result eligibility without a complete public physical address.

For priced products only, emit:

```ts
offers: {
	'@type': 'Offer',
	url,
	price: product.price,
	priceCurrency: 'USD',
	...(product.availability !== 'enquire' && {
		availability: availabilityUrls[product.availability || 'in-stock'],
	}),
	seller: { '@id': `${PRODUCTION_BASE_URL}/#organization` },
}
```

Do not emit an `Offer` for `enquire` products without a numeric price.

- [ ] **Step 4: Render route-specific data**

- General page route: render `WebPage` linked to `#website`.
- Blog route: render `BlogPosting` before the article modules.
- Product route: render a graph containing `Product`, `WebPage`, and `BreadcrumbList`.
- Site layout: keep `ClinicJsonLd`, but have it render the connected site graph through `JsonLd`.

Ensure route queries expose `_updatedAt`, complete image URLs, author names, category names, and all fields consumed by the builders.
Preserve the existing visible `FAQPage` microdata and verify that it only describes rendered accordion content; do not promise FAQ rich-result eligibility.

- [ ] **Step 5: Verify structured data**

```bash
npm test -- src/lib/jsonLd.test.ts
npm run typecheck
```

Expected: structured-data tests and typecheck pass.

- [ ] **Step 6: Commit**

```bash
git add src/ui/JsonLd.tsx src/lib/jsonLd.ts src/lib/jsonLd.test.ts src/lib/clinicContact.ts src/ui/ClinicJsonLd.tsx 'src/app/(frontend)/[[...slug]]/page.tsx' 'src/app/(frontend)/blog/[...slug]/page.tsx' 'src/app/(frontend)/shop/[slug]/page.tsx' src/types/Sanity.d.ts
git commit -m "feat: add page-specific structured data"
```

### Task 5: Sanity Editorial Guardrails and Existing Metadata

**Files:**
- Modify: `src/sanity/schemaTypes/objects/metadata.tsx`
- Modify: `src/sanity/schemaTypes/documents/site.ts`
- Modify: `src/sanity/schemaTypes/documents/product.ts`
- Modify: `src/sanity/schemaTypes/fragments/image-block.ts`
- Modify: `src/types/Sanity.d.ts`
- External content mutation: published Sanity `page`, `blog.post`, `product`, and `site` documents in project `rgteya6w`, dataset `production`

**Interfaces:**
- Adds: `site.contact.region?: string`.
- Keeps: `metadata.title`, `metadata.description`, and `metadata.slug` as the editor-facing SEO contract.

- [ ] **Step 1: Confirm current Sanity guidance and deployed schema**

Use Sanity's documentation tools to review current validation syntax, then load the deployed schema before querying or patching documents. Query:

```groq
{
  "site": *[_type == "site"][0]{_id, title, contact},
  "pages": *[_type == "page"]|order(metadata.slug.current){
    _id, title, metadata, modules[]{_key, _type, title}
  },
  "posts": *[_type == "blog.post"]|order(publishDate desc){
    _id, metadata, publishDate, authors[]->{_id, name}
  },
  "products": *[_type == "product"]|order(title){
    _id, title, excerpt, price, availability, image, gallery, metadata
  }
}
```

Record the returned IDs and patch those exact records; do not guess IDs.

- [ ] **Step 2: Add metadata validation**

Use separate errors and warnings:

```ts
validation: (Rule) => [
	Rule.required().min(10).error('Add a descriptive SEO title.'),
	Rule.max(60).warning('Search results may truncate titles over 60 characters.'),
]
```

For descriptions:

```ts
validation: (Rule) => [
	Rule.required().min(50).error('Add a useful search description.'),
	Rule.max(160).warning(
		'Search results may truncate descriptions over 160 characters.',
	),
]
```

Keep slug required and reject slugs containing `..`, `?`, `#`, leading/trailing slashes, or doubled slashes. Update field descriptions to explain canonical URLs, social images, and noindex.

- [ ] **Step 3: Add accurate public location and image validation**

Add optional `region` to site contact with value `NJ` in the production document. Require alt text on product primary/gallery images and article body images because those usages convey content. Do not require alt text on explicitly decorative logo or interface images.

- [ ] **Step 4: Patch only confirmed weak existing metadata**

Use the exact document IDs from Step 1 and preserve all unrelated fields. Apply:

```text
page[index].metadata.title = "Hijama in Piscataway, NJ | Hijama Exorcist"
page[about].metadata.title = "About Hijama Exorcist | Piscataway, NJ"
page[blog].metadata.title = "Hijama Journal | Evidence-Aware Cupping Guides"
page[shop].metadata.title = "Hijama Supplies in Piscataway, NJ | Enquire"
page[booking].metadata.title = "Hijama Appointments in Piscataway, NJ"
page[contact].metadata.title = "Contact Hijama Exorcist | Piscataway, NJ"
site.contact.region = "NJ"
```

Change the contact module's visible `title` from `Contact Us` to `Contact Hijama Exorcist`. Leave descriptions that already match search intent and length guidance unchanged. Do not add geographic phrases to Ruqyah or article titles when the content is not location-specific.

- [ ] **Step 5: Audit factual completeness before publishing**

For every public article, confirm at least one named author and a publish date. For every public product, confirm a title, excerpt/description, canonical slug, primary image alt, and accurate availability. Patch omissions only from existing factual content or media context. Mark a document `noIndex` only when a required title, description, canonical slug, or factual page identity cannot be established; a missing optional image field is omitted from metadata/JSON-LD and reported for editorial follow-up.

- [ ] **Step 6: Verify schema and content**

```bash
npm run typecheck
npm run lint
```

Use Sanity queries to re-read all patched records and confirm the exact values. Publish changed records only after validation succeeds.

- [ ] **Step 7: Commit code changes**

```bash
git add src/sanity/schemaTypes/objects/metadata.tsx src/sanity/schemaTypes/documents/site.ts src/sanity/schemaTypes/documents/product.ts src/sanity/schemaTypes/fragments/image-block.ts src/types/Sanity.d.ts
git commit -m "feat: add SEO editorial guardrails"
```

### Task 6: Core Web Vitals Source Fixes

**Files:**
- Create: `src/lib/recaptcha.test.ts`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/styles/app.css`
- Modify: `src/lib/recaptcha.ts`
- Modify: `src/ui/modules/blog/PostPreviewLarge.tsx`
- Modify: `src/ui/modules/blog/PostPreview.tsx`
- Modify: `src/ui/modules/blog/PostContent.tsx`
- Modify: `src/ui/modules/shop/ProductCard.tsx`
- Modify: `src/ui/modules/shop/ProductGallery.tsx`
- Modify: `src/ui/modules/RichtextModule/Image.tsx`

**Interfaces:**
- Produces: `loadRecaptcha(siteKey): Promise<void>`.
- Keeps: `getRecaptchaToken(siteKey, action): Promise<string>`, now loading the script itself.

- [ ] **Step 1: Record the mobile baseline**

Measure the deployed homepage, booking page, one article, and `/shop`. Record LCP, CLS, INP/TBT, FCP, transfer size, render-blocking resources, and third-party script cost. Confirm whether the global Google Fonts stylesheet and reCAPTCHA are present before interaction.

- [ ] **Step 2: Write failing lazy-reCAPTCHA tests**

Use `// @vitest-environment jsdom`. Assert that two concurrent calls append one script, successful load resolves both calls, script failure rejects, and an existing `window.grecaptcha` avoids a script insertion:

```ts
it('deduplicates concurrent script loads', async () => {
	const first = loadRecaptcha('site-key')
	const second = loadRecaptcha('site-key')
	expect(document.querySelectorAll('script[data-recaptcha]').length).toBe(1)
	document.querySelector<HTMLScriptElement>('script[data-recaptcha]')!.onload!(
		new Event('load'),
	)
	await expect(Promise.all([first, second])).resolves.toEqual([
		undefined,
		undefined,
	])
})
```

- [ ] **Step 3: Run the test and verify red**

```bash
npm test -- src/lib/recaptcha.test.ts
```

Expected: FAIL because `loadRecaptcha` is missing and the layout owns the script.

- [ ] **Step 4: Load reCAPTCHA on demand**

Move script ownership into `src/lib/recaptcha.ts`. Cache one module-level promise, add a script with:

```ts
script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
script.async = true
script.dataset.recaptcha = 'true'
```

Have `getRecaptchaToken()` await `loadRecaptcha()` before calling `grecaptcha.ready()`. Remove the reCAPTCHA `<Script>` and environment read from the root frontend layout.

- [ ] **Step 5: Self-host fonts through Next.js**

Replace the CSS `@import` with `Instrument_Sans` and `DM_Serif_Display` from `next/font/google`:

```ts
const instrumentSans = Instrument_Sans({
	subsets: ['latin'],
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
```

Apply both variables to the body and point Tailwind's `--font-sans` and `--font-serif` tokens at them. Preserve the existing visual type families.

- [ ] **Step 6: Add responsive image sizing**

Use these concrete `sizes` values:

```text
PostPreviewLarge: (max-width: 1023px) 100vw, 50vw
PostPreview: (max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw
PostContent hero: (max-width: 896px) 100vw, 896px
ProductCard: (max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw
ProductGallery main: (max-width: 1023px) 100vw, 58vw
Richtext image: (max-width: 768px) 100vw, 768px
```

Keep eager loading only on the single leading blog image and the product's initial main image. Thumbnail and lightbox images remain lazy.

- [ ] **Step 7: Verify performance changes**

```bash
npm test -- src/lib/recaptcha.test.ts
npm run typecheck
npm run lint
```

Expected: checks pass. Repeat the same mobile measurements and confirm Google Fonts no longer block through CSS import and reCAPTCHA does not load before form submission.

- [ ] **Step 8: Commit**

```bash
git add src/lib/recaptcha.ts src/lib/recaptcha.test.ts 'src/app/(frontend)/layout.tsx' src/styles/app.css src/ui/modules/blog/PostPreviewLarge.tsx src/ui/modules/blog/PostPreview.tsx src/ui/modules/blog/PostContent.tsx src/ui/modules/shop/ProductCard.tsx src/ui/modules/shop/ProductGallery.tsx src/ui/modules/RichtextModule/Image.tsx
git commit -m "perf: reduce SEO-critical page weight"
```

### Task 7: Rendered SEO and Link-Crawl Gate

**Files:**
- Create: `scripts/check-seo.mjs`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Produces: `npm run check:seo`, reading `SEO_BASE_URL` with default `http://localhost:3000`.

- [ ] **Step 1: Implement the crawler**

The script must:

1. Start at `/` and crawl same-origin HTML links up to 100 routes.
2. Require a final 2xx response for every internal page.
3. Require one non-empty title, one description, one canonical on `https://www.hijamaexorcist.com`, and exactly one `h1` for every indexable HTML page.
4. Parse every JSON-LD script as JSON.
5. Reject any rendered `sanitypress.dev` string.
6. Fetch `/robots.txt`, `/sitemap.xml`, and `/blog/rss.xml`; require 200 responses and the canonical host.
7. Confirm sitemap URLs are unique and every listed URL uses the canonical host.
8. Exit non-zero with route-specific messages for every failure.

Use built-in `fetch` and regular expressions; do not add an HTML parser dependency. Add:

```json
{
  "scripts": {
    "check:seo": "node scripts/check-seo.mjs"
  }
}
```

- [ ] **Step 2: Verify the gate fails against the current live deployment**

```bash
SEO_BASE_URL=https://www.hijamaexorcist.com npm run check:seo
```

Expected before deployment: FAIL because canonicals/sitemap contain `sanitypress.dev` and robots returns 404.

- [ ] **Step 3: Verify a production build locally**

Set local `NEXT_PUBLIC_BASE_URL=https://www.hijamaexorcist.com`, then run:

```bash
npm run build
npm start
```

In a second process:

```bash
npm run check:seo
```

Expected: PASS for all discovered routes and crawl endpoints.

- [ ] **Step 4: Document the verification workflow**

Add README commands for tests, typecheck, lint, build, local SEO crawl, and post-deployment SEO crawl. Document that Search Console sitemap submission and Google Business Profile checks remain manual.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-seo.mjs package.json README.md
git commit -m "test: add rendered SEO crawl gate"
```

### Task 8: Final Verification and Deployment Handoff

**Files:**
- No new source files unless a failing check requires a scoped correction.

**Interfaces:**
- Consumes all prior tasks.
- Produces a merge-ready branch plus measured verification evidence.

- [ ] **Step 1: Run the complete local gate**

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: every command exits zero.

- [ ] **Step 2: Inspect the complete diff**

Verify that only SEO, content-model, content, performance, tests, documentation, and lockfile changes are present. Confirm `.recall/.capture.json` remains unmodified by this work.

- [ ] **Step 3: Run focused regressions**

Search source and rendered output for `sanitypress.dev`; the only allowed reference is the explicit rejection test and historical audit documentation. Verify previews return `noindex, nofollow`, while public routes return index/follow.

- [ ] **Step 4: Record before/after quality evidence**

For homepage, booking, one article, and `/shop`, record mobile Core Web Vitals/Lighthouse results. Require:

- Lighthouse SEO score at least 90.
- Lighthouse accessibility score at least 90.
- No new CLS regression.
- No globally loaded reCAPTCHA before form interaction.
- No render-blocking Google Fonts CSS import.

If a performance score misses 90, report the measured bottleneck and fix only source-owned causes in scope; do not hide or fabricate the result.

- [ ] **Step 5: Prepare production configuration**

Confirm the production Vercel environment has:

```ini
NEXT_PUBLIC_BASE_URL=https://www.hijamaexorcist.com
```

Changing the Vercel setting or deploying requires explicit deployment authorization. Without it, provide the exact setting and stop with a merge-ready branch.

- [ ] **Step 6: Post-deployment smoke test**

After an authorized deployment:

```bash
SEO_BASE_URL=https://www.hijamaexorcist.com npm run check:seo
```

Expected: PASS. Then manually submit `https://www.hijamaexorcist.com/sitemap.xml` in Google Search Console and verify the Google Business Profile name, site URL, phone, category, service area, and public address policy match the website.
