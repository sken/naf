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
- **Documentation Sync:** When making structural UI changes, adding new features, or changing architectural patterns, you MUST:
  1. Update the appropriate top-level spec files (`DESIGN.md` or `PRODUCT.md`) to keep them in sync with the codebase.
  2. Create a new chronological spec file in `docs/superpowers/specs/` (e.g., `YYYY-MM-DD-feature-name.md`) detailing the problem, solution architecture, and affected files.

## Project Architecture
- **Zero-Config Data:** The dashboard is driven entirely by a local JSON file (`naf.config.json`). All API endpoints, RSS feeds, and GitHub handles must be read from this file at build time.
- **Fair Representation RSS:** The build step guarantees at least 2 articles from every successful RSS source before filling the quota with a global chronological sort.
- **Design System (Aarhus Light Mode):**
  - **Articles (ARoS Modernism):** Birch Milk backgrounds, Soft Terracotta accents.
  - **Repositories (Historic Heritage):** Pale Cobblestone backgrounds, Dusty Rose borders.
  - **Platform Updates (Coastal Minimalism):** Fog White backgrounds, Baltic Blue borders.

## Patterns
**Standard Reel Card Structure (Astro):**
```html
<li class="reel-item type-github" data-category="repos" data-subcategory="trending" data-payload={encodeURIComponent(JSON.stringify(item))}>
    <div class="reel-card-wrapper">
        <button class="save-btn" onclick="window.saveCard(this.closest('.reel-item'))">
            <svg><!-- Bookmark Icon --></svg>
        </button>
        <RepoCard {...item.data} />
    </div>
</li>
```

## Known Gotchas
- **Dynamic HTML & CSS Scoping:** When injecting HTML dynamically via Vanilla JS (e.g., in `window.loadSavedCards`), the standard Astro hashed-class scoping will fail to match the new elements. You must use `<style is:global>` for any component styles that need to apply to dynamically injected DOM nodes.
- **Redis JSON Deletion:** When using `ioredis` with Vercel KV, `lrem` will often fail to delete serialized JSON strings due to JSON key-ordering drift. To reliably delete a saved card, you must parse the list, filter out the target object by ID, and rewrite the list.
- **Event Listeners in Injected HTML:** When creating inline event handlers in template literals (e.g., `onclick="window.saveCard(this.closest('.reel-item'))"`), ensure you are passing the correct DOM element that holds the `data-payload` attribute to prevent `undefined` JSON parsing errors.
