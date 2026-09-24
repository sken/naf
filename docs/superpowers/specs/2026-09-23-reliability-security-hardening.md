# Spec: Reliability & Security Hardening

## Problem Statement
A repository audit found a cluster of correctness, security and maintenance issues:

- **Duplicate starred repos:** The shuffle filtered on `language === 'Starred'` (never true), so every starred repo appeared twice in the feed.
- **Saved-view duplication:** Every filter click while "Saved" was active re-fetched saved cards, but the cleanup selector (`[data-category="saved"]`) never matched, so cards piled up.
- **Duplicate saves:** Saved state was inferred from the SVG fill, so after a reload every card looked unsaved, and the API accepted duplicate POSTs.
- **Non-atomic delete:** `DELETE` ran `del` + `rpush`, which could lose concurrent saves or wipe the list if interrupted.
- **Stored XSS:** Saved cards were built with `innerHTML` from unescaped third-party feed data (and `javascript:` links were not blocked), so a hostile feed could run script and read the admin PIN from `localStorage`.
- **Weak PIN protection:** Non-constant-time comparison, no rate limiting, and no body size or schema validation.
- **Slow, silent ingest:** 16+ sequential fetches with no timeouts (a hanging feed could stall the build), `catch {}` blocks that hid failures, invalid dates breaking the sort, and one high-volume source (TechCrunch) taking over half the news slots.
- **Drift and dead code:** Docs referenced `naf.config.json`, container-query card sizing and `content-visibility`, none of which exist. Unused `getSpanClass`, grid span classes, `Welcome.astro`, `src/assets`, one-off Python codemods and a stray screenshot remained in the repo. `astro check` reported 356 errors.
- **Accessibility:** The save button had no accessible name or state; motion and sounds ignored `prefers-reduced-motion`; the mobile stats footer was hard to reach under mandatory scroll snapping.

## Solution Architecture

### 1. Shared card model (`src/lib/cards.ts`)
A single module defines the `Card` union plus:
- `safeUrl()`: accepts only absolute `http(s)` URLs.
- `getCardKey()`: a card's identity is the URL it points to (tolerates legacy Redis shapes, e.g. full Chrome Status objects).
- `normalizeCard()`: whitelists fields per type, truncates strings, derives `category` from `type`, and rejects cards without a valid URL.

It is used by the build step (every rendered card is normalized), the client script, and the API.

### 2. Templated card rendering (`src/components/ReelItem.astro`)
The `<li>` shell, save button and type-specific card are one component. `index.astro` renders the feed with it, and also renders one empty instance per card type inside `<template data-card-template="…">`. The client clones these templates and fills them via `textContent` and validated `href`s, so saved cards always match the static markup and no feed data is ever parsed as HTML.

### 3. Client state (`index.astro` script)
- Saved state lives in a `Set` of card keys and is reflected with `aria-pressed` on every save button. It is fetched silently on load when a PIN is stored.
- Saved cards are fetched once when the Saved toggle turns on; filter clicks only re-apply filters.
- Save buttons use one delegated listener on `.reel-feed` (no inline `onclick` or `window.*` globals), with an in-flight guard against double clicks.
- View Transitions and the tilt effect are skipped under `prefers-reduced-motion`.

### 4. API (`src/pages/api/saved.ts`)
- PIN check compares SHA-256 digests with `timingSafeEqual`. After 10 failures per IP in 15 minutes, requests get `429`.
- Bodies over 16 KB get `413`; invalid JSON gets `400`; invalid cards are rejected.
- `POST` skips cards whose key is already stored.
- `DELETE` matches by key and runs `LREM` with each entry's exact stored string. This is atomic per entry, avoids JSON key-ordering drift, and also cleans up legacy duplicates.
- `GET` normalizes and de-duplicates legacy rows.

### 5. Build-time ingest
- All sources (and all RSS feeds / npm packages within them) are fetched in parallel with a 15s timeout; failures are logged as `[hub] <source> failed: …`. Page prerender dropped from ~10s to ~2–3s.
- Fair Representation now guarantees the 2 newest items per source, then fills chronologically with a per-source cap (`limits.rssMaxPerSource`, default 6). Links are de-duplicated and undated items sort last instead of corrupting the order.
- Chrome Status payloads are trimmed to the fields the card uses.
- An optional `GITHUB_TOKEN` env var authenticates the starred-repos request.
- Starred repos are no longer duplicated; the shuffle is now an unbiased Fisher–Yates.

### 6. Tooling and cleanup
- `pnpm run check` (`astro check`, TypeScript 6) now reports 0 errors. `tsconfig.json` only includes `src/` (not the vendored agent skill folders).
- The Layout's global style block moved into `<head>`, and the background SVG is encoded with `encodeURIComponent` (the `/</g` regex broke the checker's parser).
- The daily rebuild workflow uses `curl -fsS` so a failing deploy hook fails the job.
- Removed dead code and files listed above.

## Affected Files
- `src/lib/cards.ts` (new), `src/components/ReelItem.astro` (new)
- `src/pages/index.astro`, `src/pages/api/saved.ts`, `src/layouts/Layout.astro`, `src/components/FeatureCard.astro`
- `hub.config.json` (`limits.rssMaxPerSource`), `tsconfig.json`, `package.json`, `pnpm-lock.yaml`
- `.github/workflows/daily-rebuild.yml`
- `AGENTS.md`/`CLAUDE.md`, `README.md`, `DESIGN.md`, `PRODUCT.md`
- Deleted: `src/components/Welcome.astro`, `src/assets/*`, `apply_aarhus.py`, `inject_colors.py`, `update_*.py`, `image.png`
