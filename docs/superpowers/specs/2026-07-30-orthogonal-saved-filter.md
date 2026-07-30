# Spec: Orthogonal Saved Filter State

## Problem Statement
Previously, "Saved" was implemented as a master category filter (alongside "All", "Articles", "Repositories"). This presented a UX flaw: when viewing "Saved" items, the user had no way to apply sub-filters. If a user had dozens of saved cards, they could not easily view "only my saved repositories" because the master filter was already occupied by the "Saved" category.

## Solution Architecture
We decoupled "Saved" from the mutually-exclusive master category row and implemented an **Orthogonal Filter State**. It now exists as an independent, global toggle button that intersects with the existing two-tier filter system.

### 1. UI Redesign
- **Positioning:** The "Saved" toggle is moved to the far right of the `.filter-header` using absolute positioning on desktop (via Flexbox order on mobile).
- **Aesthetics:** It features a distinct pill design with a bookmark icon. When activated, it fills in with the ARoS primary color, separating it visually from the master category pills.

### 2. Client-Side Rendering Logic
The filtering engine in `index.astro` was heavily updated to support intersection matching:
- **State Tracking:** A new global variable `isSavedViewActive` tracks the toggle status.
- **Intersection Matching:** During the `updateDOM()` cycle, the system checks three conditions for every card:
  1. `catMatch`: Does the card's category match the active master category?
  2. `subMatch`: Does the card's subcategory match the active sub-filter?
  3. `viewMatch`: Does the card's `data-is-saved-card` attribute match the `isSavedViewActive` state?
- Only cards passing **all three** conditions are displayed (`display: flex`).

### 3. DOM Injection and Cleanup
Since saved cards are securely fetched asynchronously via the `/api/saved` endpoint and must be injected into the DOM:
- **Hydration:** When toggled *on*, the data is fetched and dynamically constructed into `.reel-item` DOM nodes. Crucially, they are injected with their *true* categories (`data-category="repos"`) instead of a generic `saved` category.
- **Cleanup:** When toggled *off*, all dynamically injected nodes (tracked via `data-is-saved-card="true"`) are scrubbed from the DOM entirely to prevent duplicate cards when reverting to the static feed.

## Affected Files
- `/src/pages/index.astro`: Redesigned filter header HTML, rewritten CSS for the `.saved-toggle`, and overhauled Vanilla JS filtering logic (`updateDOM`, `window.saveCard`, `window.loadSavedCards`).
- `/AGENTS.md`: Updated structural patterns and rules for documentation sync.
- `/DESIGN.md`: Added architectural documentation for the orthogonal state.
