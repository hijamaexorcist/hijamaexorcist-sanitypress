# Comprehensive SEO Design

## Context

Hijama Exorcist needs balanced organic growth across local appointment bookings, educational articles, and shop enquiries. Local targeting must accurately cover Piscataway and Central New Jersey. This phase may improve technical SEO and existing CMS content, but it will not create new landing pages or content clusters.

The production audit on September 6, 2026 confirmed two critical crawl defects:

- Every canonical URL and sitemap entry uses `https://sanitypress.dev` instead of the live `https://www.hijamaexorcist.com` origin.
- `https://www.hijamaexorcist.com/robots.txt` returns 404.

The inspected public pages return 200, use one visible `h1`, and provide unique titles and descriptions. The site already emits clinic structured data, but every page receives the same business entity and articles/products lack page-specific structured data.

## Goals

1. Give crawlers one correct, deterministic production origin.
2. Make every indexable page discoverable with accurate metadata.
3. Describe articles, products, breadcrumbs, FAQs, and the clinic with factual structured data.
4. Improve the existing content's search relevance and trust signals without keyword stuffing.
5. Reduce measured Core Web Vitals risks that affect crawling and search experience.
6. Prevent regressions with automated metadata and crawl-surface tests.

## Non-goals

- Creating new service, location, or topic landing pages.
- Inventing an address, credentials, prices, availability, ratings, reviews, or medical claims.
- Guaranteeing rankings, rich results, or a specific Lighthouse performance score.
- Changing Search Console or Google Business Profile without separate authorization and supported access.

## Canonical Origin and Crawl Surface

`https://www.hijamaexorcist.com` is the canonical production origin because the apex domain already redirects there. A single validated origin helper will supply page metadata, sitemap entries, RSS links, Open Graph URLs, and JSON-LD identifiers. Production code and tests must reject the legacy `sanitypress.dev` origin.

A Next.js metadata route will generate `robots.txt`. It will allow public content, identify the canonical sitemap, and exclude non-public Studio/API crawl paths. It is not a security control. Preview deployments will continue to emit `noindex`.

The sitemap will:

- Include each indexable page, blog post, and product once.
- Use the canonical origin helper rather than reading an unchecked environment value independently.
- Exclude the CMS 404 page, drafts, invalid slugs, and documents marked `noIndex`.
- Use Sanity `_updatedAt` for `lastModified`.
- Omit language alternates while the site is English-only.

## Metadata Architecture

The existing metadata processor will become the shared base for safe fallbacks and common tags. It will produce:

- A route-specific canonical URL.
- A non-empty title and description from SEO fields with an explicit document fallback.
- Open Graph title, description, canonical URL, image, and image metadata.
- A large-image Twitter card.
- Explicit index/follow behavior for public pages and noindex/nofollow behavior for previews or opted-out documents.
- RSS discovery where relevant.

Page handlers will add page-type metadata:

- General pages: `website`.
- Blog posts: `article`, including published and modified timestamps and author names.
- Products: product-oriented social metadata with factual image and description fields.
- 404: explicit noindex metadata independent of CMS data.

Empty alternate-language maps will not be emitted. Future multilingual support must add self-referencing and `x-default` alternates only when translated routes exist.

## Structured Data

Structured data will be serialized with the existing safe JSON helper and will describe visible, factual content only.

### Site and Clinic

The site-wide graph will give stable `@id` values to `WebSite`, `Organization`, and the clinic entity, then connect them instead of emitting unrelated objects. The clinic will identify Piscataway and Central New Jersey as its real service area. A private street address will not be exposed or invented. Public phone, email, image, and social profiles will be included only when present.

### Blog Posts

Each article will emit `BlogPosting` with canonical URL, headline, description, image, `datePublished`, Sanity `_updatedAt` as `dateModified`, authors, publisher, and main-entity relationship. Missing optional fields will be omitted.

### Products

Each product page will emit `Product` with name, description, images, category, canonical URL, and availability when known. `Offer` will be emitted only when the data supports a real price and terms. Enquire-only products will not receive fabricated price or offer data. Ratings and reviews will never be synthesized.

### Breadcrumbs and FAQs

Visible breadcrumb trails will generate `BreadcrumbList` data with correct one-based positions. Visible FAQ content may emit `FAQPage` data, but implementation will not imply that Google will grant FAQ rich results.

## Sanity Content Model and Existing Content

The metadata object will gain stronger editorial guardrails:

- Require a useful title and description for publishable content.
- Preserve title and description length guidance as warnings rather than rigid ranking rules.
- Improve previews and descriptions so editors understand canonical, social-image, and noindex effects.
- Require meaningful alternative text where an image conveys content; decorative images remain empty-alt.
- Validate slugs and prevent malformed indexable URLs.

Existing public records will be reviewed for weak or generic search presentation. Confirmed examples include the title `Booking` and the heading `Contact Us`. Revisions will naturally incorporate Hijama, intent, and Piscataway/Central New Jersey where accurate. Existing evidence-aware wording, consent language, and medical boundaries will be preserved.

Articles will expose named authors, publish dates, updated dates, sources, and existing safety context. No unsupported practitioner credential or medical benefit claim will be added.

## Internal Discovery and Semantics

Every public page must have one descriptive `h1` and a logical heading hierarchy. Contextual links will connect existing pages across these paths:

- Educational article to relevant service/booking information.
- Service and booking content to supporting articles.
- Product detail to related products and relevant care information.
- Global navigation and footer to core indexable destinations.

Links must use descriptive visible anchor text. Existing image components will continue to reserve dimensions; implementation will add accurate responsive `sizes` and reserve eager loading for the measured LCP image.

## Performance Design

Performance work will begin with mobile baselines for the homepage, booking page, one article, and one product. Changes will focus on measured or source-proven issues:

- Scope reCAPTCHA loading to routes or interactions that use a protected form rather than loading it globally.
- Verify that only the actual LCP image is prioritized.
- Add responsive image sizing where absent.
- Preserve image dimensions and low-quality placeholders to prevent layout shift.
- Reduce global client-side work only where profiling shows a material effect.

The quality target is green Core Web Vitals and Lighthouse SEO/accessibility scores of at least 90 on representative mobile pages. These are verification targets, not ranking promises.

## Data Flow and Failure Handling

Sanity documents flow through route-specific queries into the shared metadata and structured-data builders. Builders return typed plain objects; React components only serialize and render them.

- Missing optional CMS values cause omission, not invalid placeholder markup.
- A missing required title or description uses a documented fallback and fails editorial validation.
- Invalid, empty, noindex, or draft records do not enter the sitemap.
- Preview environments remain non-indexable even when CMS content is indexable.
- JSON-LD generation escapes `<` and never interpolates raw HTML.
- Environment validation fails clearly if the production origin is missing, malformed, or uses the retired domain.

## Verification

Implementation is complete only after:

1. ESLint and TypeScript checks pass.
2. A production build succeeds.
3. Tests confirm canonical, robots, sitemap, noindex, page-type metadata, and JSON-LD behavior.
4. Rendered HTML for representative routes contains the expected title, description, canonical, social tags, one `h1`, and valid structured data.
5. The robots and sitemap endpoints return 200 with the canonical production host.
6. An internal-link crawl finds no broken public links or accidental indexable 404 routes.
7. Structured-data output parses and passes relevant schema checks without fabricated fields.
8. Before/after mobile Lighthouse results are recorded for the four representative pages.
9. A repository search and live smoke test find no `sanitypress.dev` canonical, sitemap, RSS, or JSON-LD URL.

## Rollout

The production environment must set the canonical base URL to `https://www.hijamaexorcist.com`. After deployment, smoke tests will verify the final redirected URL, rendered canonicals, robots, sitemap, RSS, and representative structured data. The handoff will then list the manual Search Console sitemap submission and Google Business Profile consistency checks.
