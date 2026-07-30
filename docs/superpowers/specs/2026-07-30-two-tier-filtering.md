# Spec: Two-Tier Contextual Filtering

## Problem Statement
The dashboard previously utilized a flat, single-tier filtering system ("All Signals", "Articles", "Repositories"). As the data sources grew, these top-level buckets became too broad. Finding specific niches (like a user's GitHub Stars vs general Trending repos, or Dev.to articles vs Medium articles) was impossible without sifting through the entire feed.

## Solution Architecture
We implemented a **Two-Tier Contextual Filter System**. Selecting a top-level category dynamically injects a secondary row of filters tailored specifically to that domain. 

### 1. Data Mapping & Sourcing
To enable granular filtering without relying on complex string-matching algorithms, we enriched the static `allItems` array mapping at build time:
- **`data-category`**: Tracks the primary domain (`articles`, `repos`, `platform`).
- **`data-subcategory`**: Tracks the specific sub-domain.
  - *Articles*: Mapped to `medium` (from `newsItems`) or `devto` (from `devItems`).
  - *Repositories*: Mapped to `starred` (if `r.language === 'Starred'`) or `trending`.

### 2. UI Layout & Transitions
- **Dynamic Insertion**: The `.sub-filter-pills` HTML rows are pre-rendered into the `.filter-container` but hidden via `display: none`.
- **Slide Down Animation**: When activated, the secondary row uses a CSS `@keyframes slideDown` animation to gracefully drop in from behind the master filter row.
- **Aesthetic**: To preserve the Aarhus Light Mode hierarchy, master filters are bright white pills with box-shadows, while the new sub-filters are slightly smaller, transparent pills that invert to a dark solid color when active.

### 3. Client-Side Rendering Logic
The filtering engine operates entirely in Vanilla JS within the browser to maintain the Static Site Generation (SSG) strict constraint.
- State is tracked via `activeCategory` and `activeSubcategory` variables.
- Selecting a master filter inherently resets the `activeSubcategory` state back to `"all"`.
- Context logic checks if the active master filter requires a sub-filter row (e.g., `saved`, `platform`, and `all` do *not* require one, so any active secondary rows gracefully disappear).
- The DOM updates are wrapped in `document.startViewTransition()` to natively cross-fade the layout changes as the masonry/reel feed resizes.

## Affected Files
- `/src/pages/index.astro`: Updated the `allItems` JS map, added the new HTML pill containers, injected CSS for the `.sub-filter` class, and heavily expanded the Vanilla JS click handlers.
