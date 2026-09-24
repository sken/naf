# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Frontend developers with a strong interest in Design, AI, and development. They use the dashboard as a central hub to stay updated on industry news, trending repositories, and platform updates without having to manually check multiple individual websites.

## Product Purpose
A lightning-fast, zero-config discovery dashboard that aggregates updates from top frontend websites. It exists both as a daily utility to streamline information gathering and as a portfolio showcase demonstrating the creator's frontend engineering skills and their ability to build alongside AI. Success means it's fast, reliable, and visually impressive enough to serve as a strong portfolio piece.

## Positioning
An aggressively optimized, build-time statically generated aggregator with a "Fair Representation" algorithmic ingest engine. Unlike generic RSS readers or dynamic dashboards, it sidesteps rate limits entirely via build-time fetching and morphs its UI using native View Transitions, delivering instant client-side loads.

## Operating Context
Users typically check this daily as part of their routine to catch up on frontend news, GitHub trends, and browser updates. It's used in modern web browsers capable of advanced CSS features (like multi-column masonry and scroll snapping) and View Transitions.

## Capabilities and Constraints
- **Zero-Config Data:** Completely driven by a local `hub.config.json` file.
- **Architecture:** Astro 7 (SSG with Hybrid API endpoints). Data fetching is strictly locked to the Astro build step.
- **Interactivity:** No heavy client-side frameworks (React, Vue, Alpine). Rely on Vanilla JS and native APIs (View Transitions).
- **Styling:** Vanilla CSS only. TailwindCSS is strictly prohibited.
- **Database:** Persistent bookmarks stored in Vercel KV (Redis) via `ioredis`.
- **Package Manager:** `pnpm` exclusively.

## Brand Commitments
- **Name:** Hub (public brand, served at hub.skendlba.dev); Naf is the project/repository name.
- **Tone of Voice:** Clever, snappy, and relatable to developers (e.g., "minus the 45 open browser tabs"). Not overly corporate.
- **Visual Identity:** Aarhus Light Design System. It features a whimsical, hand-drawn ink-and-watercolor aesthetic (inspired by Jakob Martin Strid) with a specific curated palette (Birch Milk, Pale Cobblestone, Fog White, Soft Terracotta, Baltic Blue).

## Evidence on Hand
- Implemented Astro architecture with build-time aggregation (`hub.config.json`).
- Existing custom CSS framework (Aarhus Light Design System) and DOM filtering animations configured in the repository.

## Product Principles
1. **Aggressive Optimization:** Speed and performance are non-negotiable; rely on the native platform (SSG, View Transitions, Vanilla JS) over heavy frameworks.
2. **Utility as Art:** The dashboard must function flawlessly as a daily tool while simultaneously serving as an impeccable portfolio piece that wows visitors.
3. **Zero Configuration:** Maintenance and content additions should be as simple as editing a single JSON file.
4. **Fair Discovery:** Prevent high-volume publishers from dominating the feed, ensuring a diverse range of frontend voices and updates are represented.
