# Project: Naf

**Domain:** naf.skendlab.de
**Repository:** skendlba/naf

## Overview
Naf is a statically generated discovery dashboard that tracks multiple vectors of the frontend ecosystem (News, Repos, Chrome Status, NPM). It executes server-side data fetching entirely at build-time to avoid API rate limits and ensure instant client-side loads. 

## Tech Stack
- **Framework:** Astro 7 (Static Site Generation / SSG with Hybrid API endpoints)
- **Language:** TypeScript / HTML
- **Styling:** Vanilla CSS (NO TailwindCSS unless explicitly authorized by the user)
- **Database:** Vercel KV (Redis) via `ioredis` for saving user bookmarks
- **Package Manager:** `pnpm` MUST be used for all dependency management and scripts. Do NOT use `npm`.

## Commands
- **Dev Server:** `pnpm run dev`
- **Build:** `pnpm run build`
- **Sync Env Vars:** `npx vercel env pull .env.local`

## Code Conventions
- **Routing:** API routes in `src/pages/api/` (SSR). UI routes in `src/pages/` (SSG via `export const prerender = true;`).
- **Styling:** Use standard CSS variables (`var(--color-name)`) defined in `Layout.astro`.
- **Card Sizing:** Dynamic based on content length (e.g., long titles get `span-2`), orchestrated in `index.astro` using Container Queries (`@container bento`).
- **DOM Animations:** Client-side filtering is powered by the native `document.startViewTransition()` API via `display: none` manipulation.

## Boundaries & Constraints
- **Strict Architecture:** Keep data fetching strictly locked to the Astro build step for the main dashboard grid. Do not convert the main page to full SSR.
- **Client Frameworks:** Do not add heavy client-side frameworks (React, Vue, Alpine) unless explicitly requested. Rely on Vanilla JS for interactivity.
- **Authentication:** The `/api/saved` endpoint requires a Bearer token matching the `ADMIN_PIN` environment variable.
- **Git Operations:** Always provide a suggested Git commit message for the user when a task is completed. NEVER write or execute any `git commit` or `git add` commands automatically.

## Project Architecture
- **Zero-Config Data:** The dashboard is driven entirely by a local JSON file (`naf.config.json`). All API endpoints, RSS feeds, and GitHub handles must be read from this file at build time.
- **Fair Representation RSS:** The build step guarantees at least 2 articles from every successful RSS source before filling the quota with a global chronological sort.
- **Design System (Aarhus Light Mode):**
  - **Articles (ARoS Modernism):** Birch Milk backgrounds, Soft Terracotta accents.
  - **Repositories (Historic Heritage):** Pale Cobblestone backgrounds, Dusty Rose borders.
  - **Platform Updates (Coastal Minimalism):** Fog White backgrounds, Baltic Blue borders.

## Patterns
**Standard Bento Card Structure (Astro):**
```html
<li class="bento-item span-2 type-github" data-category="repos" data-payload={encodeURIComponent(JSON.stringify(item))}>
    <button class="save-btn" onclick="window.saveCard(this.parentElement)">
        <svg><!-- Bookmark Icon --></svg>
    </button>
    <article class="repo-card">
        <!-- Content -->
    </article>
</li>
```
