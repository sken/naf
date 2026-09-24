# Project: Hub

**Domain:** hub.skendlba.dev (public brand: "Hub by Stefan Kendlbacher")
**Repository:** sken/hub (formerly sken/naf)

## Overview
Hub is a statically generated discovery dashboard that tracks multiple vectors of the frontend ecosystem (News, Repos, Chrome Status, NPM). It executes server-side data fetching entirely at build-time to avoid API rate limits and ensure instant client-side loads. 

## Tech Stack
- **Framework:** Astro 7 (Static Site Generation / SSG with Hybrid API endpoints)
- **Language:** TypeScript / HTML
- **Styling:** Vanilla CSS (NO TailwindCSS unless explicitly authorized by the user)
- **Database:** Vercel KV (Redis) via `ioredis` for saving user bookmarks
- **Package Manager:** `pnpm` MUST be used for all dependency management and scripts. Do NOT use `npm`.

## Commands
- **Dev Server:** `pnpm run dev`
- **Build:** `pnpm run build`
- **Type Check:** `pnpm run check` (must report 0 errors)
- **Sync Env Vars:** `npx vercel env pull .env.local`

## Code Conventions
- **Routing:** API routes in `src/pages/api/` (SSR). UI routes in `src/pages/` (SSG via `export const prerender = true;`).
- **Styling:** Use standard CSS variables (`var(--color-name)`) defined in `Layout.astro`.
- **Card Model:** All card shapes, URL validation (`safeUrl`), identity (`getCardKey`) and sanitization (`normalizeCard`) live in `src/lib/cards.ts` and are shared by the build step, the client script and `/api/saved`. Every card rendered at build time passes through `normalizeCard`.
- **Layout:** CSS multi-column masonry (`column-count`) on desktop; cards size vertically to their content. There is no grid `span-*` sizing.
- **DOM Animations:** Client-side filtering is powered by the native `document.startViewTransition()` API via `display: none` manipulation.

## Boundaries & Constraints
- **Strict Architecture:** Keep data fetching strictly locked to the Astro build step for the main dashboard grid. Do not convert the main page to full SSR.
- **Client Frameworks:** Do not add heavy client-side frameworks (React, Vue, Alpine) unless explicitly requested. Rely on Vanilla JS for interactivity.
- **Authentication:** The `/api/saved` endpoint requires a Bearer token matching the `ADMIN_PIN` environment variable (constant-time comparison; 10 failed attempts per IP per 15 minutes returns `429`). Request bodies are capped at 16 KB and validated with `normalizeCard`.
- **Git Operations:** Always provide a suggested Git commit message for the user when a task is completed. NEVER write or execute any `git commit` or `git add` commands automatically.
- **Documentation Sync:** When making structural UI changes, adding new features, or changing architectural patterns, you MUST:
  1. Update the appropriate top-level spec files (`DESIGN.md` or `PRODUCT.md`) to keep them in sync with the codebase.
  2. Create a new chronological spec file in `docs/superpowers/specs/` (e.g., `YYYY-MM-DD-feature-name.md`) detailing the problem, solution architecture, and affected files.

## Project Architecture
- **Zero-Config Data:** The dashboard is driven entirely by a local JSON file (`hub.config.json`). All API endpoints, RSS feeds, and GitHub handles must be read from this file at build time. An optional `GITHUB_TOKEN` env var raises the GitHub API rate limit.
- **Parallel, Fault-Tolerant Ingest:** All sources are fetched in parallel with a 15s timeout each. A failing source is logged as `[hub] <source> failed: ...` and contributes no items; it never fails the build.
- **Fair Representation RSS:** The build step guarantees the 2 newest articles from every successful RSS source, then fills the `rssNews` quota chronologically while capping each source at `rssMaxPerSource` items.
- **Design System (Aarhus Light Mode):**
  - **Articles (ARoS Modernism):** Birch Milk backgrounds, Soft Terracotta accents.
  - **Repositories (Historic Heritage):** Pale Cobblestone backgrounds, Dusty Rose borders.
  - **Platform Updates (Coastal Minimalism):** Fog White backgrounds, Baltic Blue borders.

## Patterns
**Standard Reel Card (`src/components/ReelItem.astro`):** always render cards through this component; never hand-write the `<li>` shell.
```html
<li class="reel-item type-github" data-category="repos" data-subcategory="trending" data-key="https://github.com/..." data-payload={encodeURIComponent(JSON.stringify(card))}>
    <div class="reel-card">
        <div class="reel-card-wrapper"><RepoCard ... /></div>
        <button type="button" class="save-btn" aria-label="Save card" aria-pressed="false">
            <svg><!-- Bookmark Icon --></svg>
        </button>
    </div>
</li>
```
- Save buttons are handled by a single delegated click listener on `.reel-feed` (no inline `onclick`). Saved state is expressed via `aria-pressed` and styled with `.save-btn[aria-pressed="true"]`.
- Saved cards are displayed by cloning the server-rendered `<template data-card-template="<type>">` elements and filling them with `textContent` / validated `href`s.

## Known Gotchas
- **Never use `innerHTML` with feed data:** Titles, descriptions and links come from third-party feeds and are stored in Redis. Build DOM from `<template>` clones with `textContent`, and pass every URL through `safeUrl` (blocks `javascript:` links). Violating this is a stored-XSS hole that can leak the admin PIN from `localStorage`.
- **Dynamic HTML & CSS Scoping:** Card component styles must stay `<style is:global>` so they apply to cloned saved cards.
- **Redis JSON Deletion:** `lrem` with a re-serialized client payload misses due to JSON key-ordering drift. Instead, read the list, match entries by `getCardKey`, and `lrem` each match using its exact stored string. Never `del` + `rpush` the list (not atomic; loses concurrent saves).
- **Save Button Stacking:** The save button must live *outside* the tilting `.reel-card-wrapper` (as its later sibling inside `.reel-card`), and the wrapper must not use `transform-style: preserve-3d`. 3D-transformed boxes hit-test unreliably: Chromium mis-hit-tests them inside CSS multi-column layouts, and WebKit ignores `z-index` in 3D contexts, so clicks on the bookmark fell through to the full-card link. The tilt only needs `perspective` on `.reel-feed`.
- **Astro Frontmatter Regexes:** Regex literals containing `<` (e.g. `/</g`) break `astro check` parsing of the whole file; use `encodeURIComponent` or string methods instead.
- **Legacy `naf` storage keys:** The Redis list `naf:saved_cards` and the `localStorage` key `naf_admin_pin` predate the rename to Hub. Keep them as-is; renaming them would orphan existing bookmarks and stored PINs.
- **TypeScript Version:** `astro check` needs TypeScript 6.x; TypeScript 7 does not ship the programmatic API yet.
