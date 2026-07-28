# Project: Naf

**Domain:** naf.skendlab.de
**Repository:** skendlba/naf (or equivalent)

## Overview
Naf is a statically generated dashboard that aggregates the cutting-edge of web development by tracking multiple vectors of the frontend ecosystem. It executes server-side data fetching at build-time to avoid API rate limits and ensure instant client-side loads, making it perfectly optimized for a zero-config Vercel deployment. 

## Tech Stack
- Framework: Astro (Static Site Generation / SSG)
- Language: TypeScript / HTML
- Styling: Vanilla CSS (NO TailwindCSS unless explicitly authorized by the user)

## Design System (COSS UI Aesthetic)
The project strictly follows a brutalist, minimalist, premium developer aesthetic inspired by coss.com/ui:
- **Colors:** Zinc palette. Background is `#09090b`, Card surfaces are `#121214` to `#18181b`.
- **Text:** Primary text is `#fafafa`, secondary is `#a1a1aa`. No bright colors.
- **Card Borders (CRITICAL):** Cards must have the COSS UI stamped metal 3D edge effect using this exact box-shadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.5)`.
- **Gradients:** DO NOT use colorful gradients. Any gradients must be strictly monochrome (e.g., `#ffffff` to `#a1a1aa`).
- **Hover States:** Keep hover effects structural (e.g., subtle `translateY(-4px)` with white/neutral shadow glows). No mouse-tracking or colorful background glows.
- **Badges:** Use flat, outlined badges with neutral text (`color: var(--text-primary); border: 1px solid rgba(255, 255, 255, 0.05)`).

## Data Fetching Architecture
All data fetching happens **at build time** in `index.astro` to ensure fast loads and avoid rate limits. Do not convert the project to SSR.
- **Industry Insights:** `rss-parser` aggregates feeds (LogRocket, Smashing Mag, JS Weekly, etc.).
- **GitHub Trends:** `cheerio` scrapes `github.com/trending` to bypass auth requirements.
- **Chrome Status & NPM:** Fetches from `chromestatus.com/api` and `api.npmjs.org`.
- **Filtering:** Filtering is handled entirely via client-side Vanilla JS in `index.astro` (DOM manipulation of `.feature-item` / `.news-item` display properties).

## Commands
- Build: `npm run build`
- Dev Server: `astro dev --background`
  - Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Boundaries & Constraints
- Always preserve existing Vanilla CSS logic.
- Do not add heavy client-side frameworks (React, Vue) unless requested.
- If scraping or RSS logic breaks, fix the parsing logic instead of moving to an authenticated API if possible.

## Documentation
- Astro Guides: https://docs.astro.build
