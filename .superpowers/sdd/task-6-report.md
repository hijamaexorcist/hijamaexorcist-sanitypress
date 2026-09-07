# Task 6 Report: Core Web Vitals Source Fixes

Date: 2026-09-06

## Status

Implemented the requested source changes without deploying:

- reCAPTCHA is now loaded on demand by `getRecaptchaToken()`.
- Instrument Sans and DM Serif Display are self-hosted by `next/font/google`.
- The six requested responsive image `sizes` values are present exactly.
- Overlay-scrollbar behavior was not changed.
- The pre-existing `.recall/.capture.json` modification and `bun.lock` were not touched or staged.

## Production mobile baseline

Google PageSpeed Insights was attempted first, but its public API returned HTTP 429 because the daily query quota was exhausted. The fallback baseline used Lighthouse 13.4.1 with a cached Chrome 152 headless shell, mobile form factor, 412×915 viewport, 2.625 DPR, and Lighthouse simulated throttling. Each page was measured once against the live deployment before source changes; no page interaction was performed.

The production sitemap still returned the article URL on `sanitypress.dev`, consistent with the known old canonical behavior. The same article path was verified as HTTP 200 and measured on `https://www.hijamaexorcist.com`.

| Page     | URL                                                                                   | Score |      LCP |      CLS |   TBT |      FCP |  Transfer |
| -------- | ------------------------------------------------------------------------------------- | ----: | -------: | -------: | ----: | -------: | --------: |
| Homepage | `https://www.hijamaexorcist.com/`                                                     |    87 | 3,723 ms | 0.004545 | 44 ms | 2,064 ms | 1,852 KiB |
| Booking  | `https://www.hijamaexorcist.com/booking`                                              |    60 | 7,179 ms | 0.000154 | 50 ms | 6,382 ms |   917 KiB |
| Article  | `https://www.hijamaexorcist.com/blog/what-to-expect-at-your-first-hijama-appointment` |    61 | 7,086 ms | 0.000154 | 39 ms | 6,304 ms |   923 KiB |
| Shop     | `https://www.hijamaexorcist.com/shop`                                                 |    94 | 2,908 ms | 0.004550 | 23 ms | 1,913 ms |   984 KiB |

INP is not available from a non-interactive Lighthouse lab run, so TBT is recorded as the lab responsiveness proxy. Lighthouse did not identify a render-blocking time saving in these runs, but its network log confirmed that the global Google Fonts stylesheet/font chain and reCAPTCHA were both requested before any interaction.

| Page     | Google Fonts before interaction | reCAPTCHA before interaction | Third-party transfer | Third-party main thread |
| -------- | ------------------------------: | ---------------------------: | -------------------: | ----------------------: |
| Homepage |             4 requests / 82 KiB |         8 requests / 419 KiB |            1,302 KiB |                   77 ms |
| Booking  |             4 requests / 82 KiB |         8 requests / 418 KiB |              501 KiB |                  127 ms |
| Article  |             4 requests / 82 KiB |         8 requests / 419 KiB |              501 KiB |                   80 ms |
| Shop     |             4 requests / 82 KiB |         8 requests / 419 KiB |              501 KiB |                   79 ms |

### Source-proven findings

1. **Issue:** reCAPTCHA loaded globally before interaction. **Impact:** 8 requests and 418–419 KiB on every measured page, plus main-thread and network contention that can affect LCP/FCP and responsiveness. **Recommendation implemented:** a deduplicated `loadRecaptcha(siteKey)` promise now appends the script only when a form asks for a token. **Expected improvement:** remove those 8 requests and approximately 418–419 KiB from initial page loads.
2. **Issue:** Google Fonts used a render-discovered external CSS import. **Impact:** 4 cross-origin requests and 82 KiB on every measured page, with an external font request chain affecting FCP/LCP and potential font-swap stability. **Recommendation implemented:** load the same families and styles through `next/font/google` and map Tailwind font tokens to the generated variables. **Expected improvement:** remove the external Google stylesheet/request chain while keeping the same visual families and using Next's adjusted fallback metrics.
3. **Issue:** responsive content images lacked exact `sizes` hints. **Impact:** browsers could select wider-than-rendered candidates, increasing route-dependent image transfer and LCP work. **Recommendation implemented:** add the six brief-specified `sizes` values. **Expected improvement:** smaller selected image candidates at responsive breakpoints; the exact byte reduction depends on content and viewport.

## RED/GREEN reCAPTCHA evidence

### RED

Command:

```text
npm test -- src/lib/recaptcha.test.ts
```

Result before implementation: exit 1, 1 failed file, 3 failed tests. Each failed with `TypeError: loadRecaptcha is not a function`, proving the requested interface was absent.

The tests cover:

- two concurrent calls append one `script[data-recaptcha]` and resolve together;
- a script load failure rejects;
- a failed script is removed and a later call can retry;
- an existing `window.grecaptcha` avoids script insertion.

### GREEN

The same command after the minimal loader implementation: exit 0, 1 passed file, 3 passed tests.

The initial Task 6 final focused run was exit 0 with 3 passed tests; the review remediation below expands this suite to 4 tests.

## Files changed

- `src/lib/recaptcha.ts`
- `src/lib/recaptcha.test.ts`
- `src/app/(frontend)/layout.tsx`
- `src/styles/app.css`
- `src/ui/modules/blog/PostPreviewLarge.tsx`
- `src/ui/modules/blog/PostPreview.tsx`
- `src/ui/modules/blog/PostContent.tsx`
- `src/ui/modules/shop/ProductCard.tsx`
- `src/ui/modules/shop/ProductGallery.tsx`
- `src/ui/modules/RichtextModule/Image.tsx`
- `.superpowers/sdd/task-6-report.md`

## Verification

- `npm test -- src/lib/recaptcha.test.ts`: exit 0; 4/4 tests passed.
- `npm run typecheck`: exit 0; no TypeScript diagnostics.
- `npm run lint`: exit 0; 0 errors and 2 pre-existing warnings in `src/lib/overlay-scrollbars.ts` at lines 308 and 465. The overlay-scrollbar implementation was intentionally unchanged.
- Focused Prettier checks corrected Task 6 additions; review-requested restoration of pre-existing formatting is documented below.
- `git diff --check`: exit 0.
- Source assertions: 14/14 passed, covering no global reCAPTCHA URL, no Google Fonts CSS import, exact Next font variable mappings, encoded/async/data-marked lazy script loading, `getRecaptchaToken()` awaiting the loader, and all six exact `sizes` strings.
- Eager-loading call-site scan: `PostPreviewLarge.tsx` explicitly requests eager loading; `ProductGallery.tsx` requests eager only for `safeIndex === 0` and lazy for subsequently selected main images. Thumbnails and lightbox images remain lazy/default.

### Build check

The first `npm run build` attempt stopped in repository URL validation because the current shell supplied a non-HTTPS `NEXT_PUBLIC_BASE_URL`. Re-running with `NEXT_PUBLIC_BASE_URL=https://www.hijamaexorcist.com` passed configuration loading but failed during webpack compilation on an unrelated, unchanged source file:

```text
src/ui/modules/shop/CatalogGrid.tsx
stream did not contain valid UTF-8
```

The invalid byte is Windows-1252 `0x96` at byte offset 8,086 in `Name: A–Z`. This file was not part of Task 6 and was not modified.

## After-source checks

A post-change local Lighthouse comparison could not be produced because the unrelated invalid UTF-8 source file prevents a production build/server from starting, and this task explicitly prohibited deploying the source.

The deterministic source checks confirm:

- no browser request to `fonts.googleapis.com` remains in `app.css`;
- the frontend root layout no longer contains the reCAPTCHA site-key environment read or global reCAPTCHA script;
- `getRecaptchaToken()` initiates and awaits on-demand loading;
- Next will self-host the two unchanged font families at build time once the repository build blocker is corrected;
- the six image components expose the exact responsive `sizes` hints.

Based on the measured production network log, these changes are expected to remove 12 initial third-party requests and about 500–501 KiB from each representative page before form interaction, before any route-specific image candidate savings.

## Self-review and concerns

- The implementation stays within the Task 6 source scope and leaves overlay scrollbars unchanged.
- Font family, weight/style coverage, and display strategy match the brief, so no intentional typography redesign was introduced.
- The on-demand script promise deduplicates concurrent form attempts, propagates load failures, removes failed scripts, and clears its cache so later attempts can retry.
- No runtime after measurement is claimed; only the before baseline and deterministic after-source evidence are available.
- Lighthouse values are single-run synthetic lab results and may vary; field INP was unavailable.
- `src/ui/Img.tsx` now honors an explicit `loading` prop before falling back to CMS `image.loading`, so the reviewed eager/lazy call-site decisions are effective.
- The invalid UTF-8 byte in `CatalogGrid.tsx` remains the production-build blocker.

## Important review remediation

The Task 6 review findings were addressed in a follow-up:

- `Instrument_Sans` now requests both `normal` and `italic` styles through `next/font/google`, preserving the original Google Fonts stylesheet coverage.
- Shared `Img` now resolves loading as `loadingProp ?? image.loading`; explicit component intent wins, while CMS loading remains the fallback.
- `PostPreviewLarge` remains explicitly eager. The product gallery's first main image is eager and every subsequently selected main image is explicitly lazy; thumbnail and lightbox loading behavior was not changed.
- Failed reCAPTCHA scripts are removed from the document, the module-level promise is cleared, and a later call creates a fresh script and can resolve.
- The overlay-scrollbar `color-mix()` formatting in `app.css` was restored exactly. Relative to the pre-Task-6 parent, that area has no diff.
- Unrelated `ProductCard` function and price markup formatting was restored. Relative to the pre-Task-6 parent, its only change is the required exact `sizes` value.
- A design-hook `broken-image` finding on the shared custom `Img` wrapper was reviewed as a false positive: the source URL is generated from the Sanity image value. The prescribed file-scoped ignore was recorded in `.impeccable/config.json`; no design behavior was suppressed or changed.

### Follow-up RED/GREEN evidence

Before the follow-up implementation, the combined focused run failed exactly two new regression tests:

- reCAPTCHA retry: the failed script was still connected;
- shared image loading: CMS eager loading incorrectly overrode an explicit lazy prop.

After implementation:

- `npm test -- src/lib/recaptcha.test.ts`: exit 0; 4/4 tests passed, including failed-load retry.
- `npm test -- src/ui/Img.test.ts`: exit 0; 2/2 tests passed, covering explicit loading precedence and CMS fallback.
- Combined focused run: exit 0; 6/6 tests passed.
- `npm run typecheck`: exit 0 after correcting the test fixture's deliberate `Sanity.Image` cast.
- `npm run lint`: exit 0 with the same two pre-existing overlay-scrollbar warnings and no errors.
- `git diff --check`: exit 0.

The production build is not claimed to pass. The separately tracked invalid UTF-8 byte in `CatalogGrid.tsx` remains unchanged and continues to block that check.
