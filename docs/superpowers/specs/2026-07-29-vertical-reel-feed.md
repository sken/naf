# Spec: Vertical Reel Feed Layout

## Problem Statement
The dashboard previously utilized a Bento Grid layout. While visually appealing for dense data, it lacked the immersive, continuous consumption experience of modern mobile applications (e.g., TikTok, Instagram Reels) and suffered from awkward vertical stretching due to inflexible grid algorithms.

## Solution Architecture
We have completely transitioned the primary UI to a **Vertical Reel Feed** (Waterfall Layout) utilizing native CSS Scroll Snapping.

### 1. Layout Constraints & Geometry
- **Hybrid Container:** `.reel-feed` adapts based on viewport size.
  - **Desktop (Masonry):** Uses native CSS Multi-column layout (`column-count: 3`) to create a fluid, staggered masonry effect where cards dynamically size vertically to their content.
  - **Mobile (Reel):** A single-column, full bleed (`100vw`) stream.
- **Mobile Scroll Snapping:** On mobile, `.reel-item` takes up `100dvh` and uses `scroll-snap-align: center` to ensure every card cleanly locks into the viewport. The body scroll is disabled, and `.dashboard` acts as a `scroll-snap-type: y mandatory` container.

### 2. Native App Emulation
- **Smart Scrollbars:** Global CSS rules in `Layout.astro` conditionally hide scrollbars on mobile via `@media (max-width: 768px)` while retaining a styled scrollbar for desktop.
- **Intro Slide:** The Hero component (Logo + Copy) and master filter pills are encapsulated inside the first `.reel-item (.intro-slide)`. On desktop, it spans all columns (`grid-column: 1 / -1`). On mobile, it acts as the first snap point.

### 3. Media & Content Canvas
Given the RSS and API data sources are primarily text-heavy (News, Repos, Chrome Status):
- **Full Canvas Media:** Cards are wrapped in `.reel-card-wrapper` set to `80vh`. 
- **Radial Gradients:** Instead of solid backgrounds, individual card components use subtle CSS `radial-gradient` backgrounds mapped to their thematic `--card-glow` variable to simulate a full-screen media asset.
- **Bottom-Bar Metadata:** Text content (titles, author, reactions) is absolutely pushed to the bottom of the card using `justify-content: flex-end`.

### 4. Performance Optimizations
- **Content Visibility:** Added `content-visibility: auto;` to every `.reel-item`. This allows the browser to skip layout and rendering work for off-screen cards, critical for maintaining 60fps scrolling in a long vertical feed.

## Affected Files
- `/src/pages/index.astro`: Removed bento-grid and masonry JS, added `.reel-feed`.
- `/src/layouts/Layout.astro`: Hid global scrollbars.
- `/src/components/NewsCard.astro`: Restructured to bottom-docked text over radial gradient.
- `/src/components/RepoCard.astro`: Restructured to bottom-docked text over radial gradient.
- `/src/components/FeatureCard.astro`: Restructured to bottom-docked text over radial gradient.
- `/src/components/DevCard.astro`: Restructured to bottom-docked text over radial gradient.
