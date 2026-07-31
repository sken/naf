# Spec: Wobbly Dotted Borders (Aarhus Light Aesthetic)

## Problem Statement
The cards currently use straight, rigid borders, which conflicts with the hand-drawn ink-and-watercolor aesthetic of the primary brand logo. A static scalable SVG border was previously proposed, but doing a dotted border via scalable SVGs causes stretching artifacts on tall masonry cards.

## Solution Architecture
To achieve a "hand-drawn dotted ink" look that flawlessly adapts to any card dimension without stretching, we combine CSS and SVG filters.

1. **CSS Native Dots:** We apply a native `border: 2px dotted rgba(26, 26, 36, 0.25)` to an absolutely positioned `::before` pseudo-element on the `.reel-card-wrapper`. Using a low opacity mimics a faint pencil sketch or diluted ink.
2. **SVG Displacement Filter:** We inject an invisible `<svg>` into the DOM containing a `<filter>` with `feTurbulence` and `feDisplacementMap`. 
3. **Application:** By applying `filter: url(#wobbly-border)` to the pseudo-element, the rigidly straight CSS dots are organically distorted, causing them to wobble and drift exactly like an imperfect hand-drawn line.

## Affected Files
- `/src/pages/index.astro`: Added the SVG filter injection and the CSS styles for the dotted borders on `.reel-card-wrapper::before`.
- `/DESIGN.md`: Updated visual documentation for standard reel cards.
