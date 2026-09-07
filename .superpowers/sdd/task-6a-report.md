# Task 6a Report: Product Sort Label Encoding

Date: 2026-09-06

## Status

Repaired the confirmed pre-existing encoding blocker in
`src/ui/modules/shop/CatalogGrid.tsx`. The two Windows-1252 `0x96` bytes in the
visible sort labels were replaced with UTF-8 en dashes:

- `Name: A–Z`
- `Name: Z–A`

No application code outside those two labels was changed.

## Files changed

- `src/ui/modules/shop/CatalogGrid.tsx`
- `.superpowers/sdd/task-6a-report.md`

The pre-existing `.recall/.capture.json` modification was not touched or
staged. `bun.lock` was not modified.

## Verification evidence

### UTF-8 decoding and focused assertions

A Python byte-level verification read the complete file and decoded it using
strict UTF-8. Result: exit 0.

Assertions passed:

- the file decodes as UTF-8;
- `Name: A–Z` occurs exactly once;
- `Name: Z–A` occurs exactly once;
- no `0x96` byte remains.

### Typecheck

Command:

```text
npm run typecheck
```

Result: exit 0. `tsc --noEmit` completed without diagnostics.

### Production build

Command:

```text
npm run build
```

Result: exit 1. Next.js passed the repaired source-file decoding point but
stopped while loading `next.config.ts` on a different pre-existing
configuration failure:

```text
Error: Production URL must use HTTPS
    at resolveBaseUrl (src/lib/seo/siteUrl.ts:27:42)
    at Object.<anonymous> (src/lib/env.ts:31:46)
```

Per task scope, this separate failure was reported and not modified.

### Diff checks

- `git diff --check`: exit 0.
- The application diff contains exactly two changed lines, replacing the two
  invalid label separators with UTF-8 en dashes.
- `bun.lock` has no diff.
- `.recall/.capture.json` remains a pre-existing unstaged modification.

## Self-review

- Confirmed both requested labels render with en dashes, not hyphens or
  replacement characters.
- Confirmed strict UTF-8 decoding succeeds and the invalid byte is absent.
- Confirmed no behavior, markup structure, option values, or unrelated source
  text changed.
- Confirmed the separate build failure was not addressed, avoiding scope
  expansion.

## Concerns

The requested encoding blocker is repaired, but a production build cannot
currently complete in this environment because the configured production URL
is not HTTPS. No build success is claimed.
