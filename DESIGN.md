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
- **Bento Box Canvas:** The core UI is a bento grid using CSS container queries (`@container bento`).
- **Dynamic Sizing:** Card sizing is dynamic based on content length (e.g., long titles automatically get `span-2`).
- **Filtering:** Client-side filtering is powered by the native `document.startViewTransition()` API via `display: none` manipulation for buttery smooth animations.

## Components
**Standard Bento Card (`.bento-item`)**
- Must include a clean, accessible save/bookmark button.
- Styling relies on soft pastel backgrounds and subtle, colored borders rather than heavy drop shadows.
