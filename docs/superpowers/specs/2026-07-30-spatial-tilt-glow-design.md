# Spec: 3D Spatial Tilt & Dynamic Glow

## Problem Statement
The current card layout (the masonry `.reel-feed`) functions well but lacks tactile interactivity. As UI trends move toward spatial computing and fluid interfaces (inspired by VisionOS), the dashboard needs an aesthetic upgrade that introduces depth and responsiveness without compromising performance or the established "Aarhus Light" ink-and-watercolor brand identity.

## Solution Architecture
We will implement a hardware-accelerated, JavaScript-driven 3D tilt effect paired with a dynamic radial gradient glow. This creates the illusion that the cards are physical objects responding to the cursor's spatial position.

### 1. JavaScript Event Delegation
To maintain high performance across a large masonry grid, we will not attach individual event listeners to every card.
- **Event binding:** A single `mousemove` and `mouseleave` listener will be attached to the parent `.reel-feed` container (Event Delegation).
- **Coordinate Mapping:** When the cursor intersects a `.reel-item`, the script calculates the cursor's X and Y positions relative to the center of that specific card.
- **CSS Variables:** The JS updates four CSS custom properties on the card: `--mouse-x`, `--mouse-y`, `--rotate-x`, and `--rotate-y`.
- **Throttling:** We will use `requestAnimationFrame` to batch DOM updates, preventing layout thrashing and ensuring a 60fps experience.

### 2. CSS 3D Transforms (The Tilt)
The visual depth is achieved entirely through CSS.
- The parent container (`.reel-feed`) will receive a `perspective` value (e.g., `1000px`) to establish the 3D space.
- The child wrapper (`.reel-card-wrapper`) will use `transform-style: preserve-3d`.
- **Hover State:** When a card is hovered, it uses the dynamically updated CSS variables to apply a transform: `transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) scale3d(1.02, 1.02, 1.02)`.
- **Rest State:** A `transition: transform 0.1s ease-out` ensures the card smoothly snaps back to a flat orientation when the cursor leaves.

### 3. Dynamic Gradients (The Watercolor Glow)
To honor the Aarhus Light brand, the "glow" will simulate a soft pool of watercolor ink rather than a harsh neon tech glow.
- **Implementation:** An `::after` pseudo-element on `.reel-card-wrapper`, absolutely positioned to cover the card.
- **Tracking:** It uses a `radial-gradient` where the center is mapped to `var(--mouse-x)` and `var(--mouse-y)`.
- **Theming:** The glow color adapts to the card's category (e.g., Soft Terracotta for Articles, Baltic Blue for Platform Updates).
- **Blending:** It utilizes a very low opacity or `mix-blend-mode: multiply` to gently wash over the background, ensuring high contrast and readability for the text content above it.

## Affected Files
- `/src/pages/index.astro`: Will receive the new Vanilla JS tracking logic inside the existing `<script>` tag.
- `/src/pages/index.astro` (Styles): Will receive the updated CSS for `.reel-item` and `.reel-card-wrapper` to support 3D transforms, perspective, and the pseudo-element glow.

## Scope & Constraints
- **Performance First:** The effect must gracefully degrade on mobile (touch devices) where hover events do not apply. The JS logic should explicitly ignore touch devices or small screens.
- **Accessibility:** Text must remain strictly legible at maximum glow intensity.
