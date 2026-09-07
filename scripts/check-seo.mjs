import { URL } from 'node:url'

const CANONICAL_ORIGIN = 'https://www.hijamaexorcist.com'
const MAX_ROUTES = 100
const REQUEST_TIMEOUT_MS = 30_000

const failures = []

function addFailure(route, message) {
	failures.push(`${route}: ${message}`)
}

function decodeEntities(value) {
	return value
		.replace(/&amp;/gi, '&')
		.replace(/&quot;/gi, '"')
		.replace(/&#39;|&apos;/gi, "'")
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
		.replace(/&#x([\da-f]+);/gi, (_, code) =>
			String.fromCodePoint(Number.parseInt(code, 16)),
		)
}

function attributesFrom(tag) {
	const attributes = new Map()
	const source = tag.replace(/^<\s*\/?\s*[\w:-]+/, '').replace(/\/?>\s*$/, '')
	const pattern =
		/([^\s"'=<>`]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

	for (const match of source.matchAll(pattern)) {
		attributes.set(
			match[1].toLowerCase(),
			decodeEntities(match[2] ?? match[3] ?? match[4] ?? ''),
		)
	}

	return attributes
}

function tagText(tag, name) {
	return decodeEntities(
		tag
			.replace(new RegExp(`^<${name}\\b[^>]*>`, 'i'), '')
			.replace(new RegExp(`</${name}\\s*>$`, 'i'), '')
			.replace(/<[^>]+>/g, '')
			.trim(),
	)
}

function routeName(url) {
	return `${url.pathname}${url.search}` || '/'
}

function isIndexable(response, metaTags) {
	const directives = [
		response.headers.get('x-robots-tag') ?? '',
		...metaTags
			.map(attributesFrom)
			.filter((attributes) => {
				const name = attributes.get('name')?.toLowerCase()
				return name === 'robots' || name === 'googlebot'
			})
			.map((attributes) => attributes.get('content') ?? ''),
	]

	return !directives.some((value) =>
		value
			.toLowerCase()
			.split(/[\s,]+/)
			.includes('noindex'),
	)
}

function validateJsonLd(route, html) {
	const scripts = [
		...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi),
	]
	let jsonLdIndex = 0

	for (const script of scripts) {
		const attributes = attributesFrom(`<script${script[1]}>`)
		if (attributes.get('type')?.toLowerCase() !== 'application/ld+json') {
			continue
		}

		jsonLdIndex += 1
		try {
			JSON.parse(script[2])
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error)
			addFailure(route, `JSON-LD script ${jsonLdIndex} is invalid: ${reason}`)
		}
	}
}

function validateIndexablePage(route, response, html, metaTags) {
	const titleTags = html.match(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi) ?? []
	if (titleTags.length !== 1) {
		addFailure(route, `expected one title, found ${titleTags.length}`)
	} else if (!tagText(titleTags[0], 'title')) {
		addFailure(route, 'title is empty')
	}

	const descriptions = metaTags
		.map(attributesFrom)
		.filter(
			(attributes) => attributes.get('name')?.toLowerCase() === 'description',
		)
	if (descriptions.length !== 1) {
		addFailure(
			route,
			`expected one meta description, found ${descriptions.length}`,
		)
	} else if (!descriptions[0].get('content')?.trim()) {
		addFailure(route, 'meta description is empty')
	}

	const canonicalTags = (html.match(/<link\b[^>]*>/gi) ?? [])
		.map(attributesFrom)
		.filter((attributes) =>
			(attributes.get('rel') ?? '')
				.toLowerCase()
				.split(/\s+/)
				.includes('canonical'),
		)
	if (canonicalTags.length !== 1) {
		addFailure(
			route,
			`expected one canonical link, found ${canonicalTags.length}`,
		)
	} else {
		const href = canonicalTags[0].get('href')
		if (!href) {
			addFailure(route, 'canonical link has no href')
		} else {
			try {
				const canonical = new URL(href, response.url)
				if (canonical.origin !== CANONICAL_ORIGIN) {
					addFailure(
						route,
						`canonical uses ${canonical.origin}, expected ${CANONICAL_ORIGIN}`,
					)
				}
			} catch {
				addFailure(route, `canonical link is not a valid URL: ${href}`)
			}
		}
	}

	const headingCount = (html.match(/<h1\b[^>]*>/gi) ?? []).length
	if (headingCount !== 1) {
		addFailure(route, `expected one h1, found ${headingCount}`)
	}
}

function discoverLinks(html, responseUrl, baseOrigin) {
	const links = []

	for (const anchor of html.matchAll(/<a\b[^>]*>/gi)) {
		const href = attributesFrom(anchor[0]).get('href')
		if (!href || href.startsWith('#')) continue

		try {
			const url = new URL(href, responseUrl)
			if (!['http:', 'https:'].includes(url.protocol)) continue
			if (url.origin !== baseOrigin) continue
			url.hash = ''
			links.push(url)
		} catch {
			// Malformed links are outside this gate's page-crawl contract.
		}
	}

	return links
}

async function fetchPage(url) {
	return fetch(url, {
		headers: { 'user-agent': 'hijamaexorcist-seo-check/1.0' },
		redirect: 'follow',
		signal: globalThis.AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	})
}

async function crawl(baseUrl) {
	const queue = [new URL('/', baseUrl)]
	const scheduled = new Set(queue.map(({ href }) => href))
	let checkedRoutes = 0

	while (queue.length > 0 && checkedRoutes < MAX_ROUTES) {
		const url = queue.shift()
		const route = routeName(url)
		checkedRoutes += 1

		let response
		try {
			response = await fetchPage(url)
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error)
			addFailure(route, `request failed: ${reason}`)
			continue
		}

		if (!response.ok) {
			addFailure(
				route,
				`expected final 2xx response, received ${response.status}`,
			)
			continue
		}

		const contentType = response.headers.get('content-type') ?? ''
		if (!/\btext\/html\b/i.test(contentType)) continue

		const html = await response.text()
		if (/sanitypress\.dev/i.test(html)) {
			addFailure(route, 'rendered HTML contains sanitypress.dev')
		}

		const metaTags = html.match(/<meta\b[^>]*>/gi) ?? []
		validateJsonLd(route, html)
		if (isIndexable(response, metaTags)) {
			validateIndexablePage(route, response, html, metaTags)
		}

		for (const link of discoverLinks(html, response.url, baseUrl.origin)) {
			if (scheduled.has(link.href)) continue
			scheduled.add(link.href)
			queue.push(link)
		}
	}

	return { checkedRoutes, truncated: queue.length > 0 }
}

async function checkEndpoint(baseUrl, pathname) {
	const url = new URL(pathname, baseUrl)
	let response

	try {
		response = await fetchPage(url)
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error)
		addFailure(pathname, `request failed: ${reason}`)
		return null
	}

	if (response.status !== 200) {
		addFailure(pathname, `expected 200 response, received ${response.status}`)
	}

	const body = await response.text()
	if (!body.includes(CANONICAL_ORIGIN)) {
		addFailure(pathname, `does not contain ${CANONICAL_ORIGIN}`)
	}

	return body
}

function validateSitemap(sitemap) {
	if (sitemap === null) return

	const locations = [
		...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi),
	].map((match) => decodeEntities(match[1].trim()))
	const seen = new Set()

	for (const location of locations) {
		if (seen.has(location)) {
			addFailure('/sitemap.xml', `contains duplicate URL: ${location}`)
		}
		seen.add(location)

		try {
			const url = new URL(location)
			if (url.origin !== CANONICAL_ORIGIN) {
				addFailure(
					'/sitemap.xml',
					`URL uses ${url.origin}, expected ${CANONICAL_ORIGIN}: ${location}`,
				)
			}
		} catch {
			addFailure('/sitemap.xml', `contains invalid URL: ${location}`)
		}
	}
}

async function main() {
	let baseUrl
	try {
		baseUrl = new URL(process.env.SEO_BASE_URL ?? 'http://localhost:3000')
	} catch {
		console.error('FAIL SEO_BASE_URL must be a valid absolute URL')
		process.exitCode = 1
		return
	}

	if (!['http:', 'https:'].includes(baseUrl.protocol)) {
		console.error('FAIL SEO_BASE_URL must use http or https')
		process.exitCode = 1
		return
	}

	const crawlResult = await crawl(baseUrl)
	const [, sitemap] = await Promise.all([
		checkEndpoint(baseUrl, '/robots.txt'),
		checkEndpoint(baseUrl, '/sitemap.xml'),
		checkEndpoint(baseUrl, '/blog/rss.xml'),
	])
	validateSitemap(sitemap)

	if (failures.length > 0) {
		for (const failure of failures) console.error(`FAIL ${failure}`)
		console.error(
			`SEO crawl failed with ${failures.length} issue(s) across ${crawlResult.checkedRoutes} route(s).`,
		)
		process.exitCode = 1
		return
	}

	const truncation = crawlResult.truncated ? ` (limited to ${MAX_ROUTES})` : ''
	console.log(
		`SEO crawl passed for ${crawlResult.checkedRoutes} route(s)${truncation} plus robots, sitemap, and RSS.`,
	)
}

await main()
