# Design System

**Archetype:** Product with Brand Hero
This is primarily a utility-focused product (a data dashboard), but the hero section serves as the main Brand surface to establish personality and warmth.

## Anti-Patterns (Strictly Avoid)
- **"AI Slop" Defaults:** No purple-to-blue gradients, no excessive glowing drop shadows, and no generic dashboard UI tropes.
- **Framework Overreach:** DO NOT use TailwindCSS unless explicitly authorized by the user. Rely entirely on Vanilla CSS with CSS variables defined in `Layout.astro`.
- **Heavy Client Logic:** Do not use React, Vue, or Alpine. Rely on Vanilla JS and native APIs (like View Transitions).

## Color Palette (Aarhus Light Mode)
The color system avoids stark white and pure black, opting for a softer, organic Nordic feel.

- **Backgrounds:**
  - **Birch Milk** (Soft, warm white/cream): Used for Articles (ARoS Modernism).
  - **Pale Cobblestone** (Cool, earthy light gray): Used for Repositories (Historic Heritage).
  - **Fog White**: Used for Platform Updates (Coastal Minimalism).
- **Accents & Borders:**
  - **Soft Terracotta** (`#DE826D`): Used for Article accents and Brand/Logo touches.
  - **Dusty Rose**: Used for Repository borders.
  - **Baltic Blue** (`#6B87A3`): Used for Platform Update borders and Brand/Logo touches.
  - **Ink Black** (`#1A1A24`): Used for text and hand-drawn SVG outlines (never `#000000`).

## Brand & Personality
- **Logo/Hero Vibe:** Whimsical, hand-drawn ink-and-watercolor aesthetic inspired by Jakob Martin Strid. Imperfect lines, slightly offset color fills, and subtle ink splatters.
- **Tone of Voice:** Clever, snappy, and relatable to developers (e.g., "minus the 45 open browser tabs"). Not overly corporate.
- **AI Image Prompt Reference:** *"The word 'HUB' in uppercase letters, styled in a messy, whimsical ink-and-watercolor typography inspired by the illustrations of Jakob Martin Strid. Hand-drawn, loose, slightly wobbly black ink outlines filled with soft, textured watercolor washes. The watercolor should use a minimal color palette consisting only of a soft terracotta orange and a muted baltic blue. Clean white background. Typography only, no characters, no animals, no machinery."*

## Layout & Structure
- **Hybrid Responsive Layout:** The core UI adapts to the device context seamlessly.
  - **Desktop:** CSS Multi-column layout (`column-count: 3`) creates an organic, staggered masonry effect where cards dynamically size vertically to fit their content.
  - **Mobile:** A TikTok/Instagram-style single-column Vertical Reel Feed (`100vw`).
- **Scroll Snapping (Mobile Only):** On mobile, scrolling uses native `scroll-snap-type: y mandatory` and `scroll-snap-align: center` for continuous, snappy content discovery. 
- **Hidden Scrollbars (Mobile Only):** Scrollbars are hidden via CSS on mobile viewports to emulate native application mechanics.
- **Filtering:** 
  - **Client-Side Filtering:** The dashboard uses the native `document.startViewTransition()` API to animate filtering operations entirely in the browser, eliminating the need for server-side re-renders.
  - **Two-Tier Architecture:** Selecting a master category (like Articles or Repositories) reveals a contextual secondary row of pill buttons, allowing deeper sub-filtering (e.g., Medium vs Dev.to) without leaving the static page.
  - **Orthogonal State (Saved):** The "Saved" filter acts as an independent, global toggle button rather than a mutually-exclusive master category. This allows users to cross-filter their saved items (e.g., viewing "Only saved Articles" by turning on the toggle and selecting the Articles master category).

## Components
**Standard Reel Card (`.reel-item`)**
- Must include a clean, accessible save/bookmark button absolutely positioned without obscuring metadata.
- **Visuals:** Cards simulate full-screen media using `radial-gradient` backgrounds mapped to thematic color glow variables, and feature an organic, hand-drawn wobbly dotted border powered by CSS `border: dotted` combined with a native SVG `feDisplacementMap` filter to match the ink-and-watercolor brand. 
- **Content:** Text and metadata are overlaid at the bottom using `justify-content: flex-end`.
- **Performance:** Implements `content-visibility: auto` to optimize rendering of off-screen items in the infinite feed.
