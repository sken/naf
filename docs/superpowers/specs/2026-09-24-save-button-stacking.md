# Spec: Save Button Stacking Fix

## Problem Statement
Clicking or tapping a card's bookmark button often opened the card's link instead of saving it. The save button was absolutely positioned inside `.reel-card-wrapper`, the element the spatial tilt effect rotates in 3D. 3D-transformed boxes hit-test unreliably:
- **Chromium** mis-hit-tests 3D-transformed boxes inside the CSS multi-column feed. While a card was tilted, `elementsFromPoint()` at the button's center skipped the button entirely and returned the card link, even though the button was drawn there.
- **WebKit** (Safari and every iOS browser) ignores `z-index` inside a `transform-style: preserve-3d` context, which the wrapper used. Children are ordered by depth, then DOM order, and the button came before the link.

## Solution Architecture
- **New `.reel-card` container:** `position: relative`, full width. It holds the tilting `.reel-card-wrapper` and, after it, the save button. The button is never transformed, so its hit-testing is plain 2D in every browser, and as a later positioned sibling with `z-index: 50` it stays on top of the card link.
- **Removed `transform-style: preserve-3d`** from `.reel-card-wrapper`. No child is transformed in 3D, so the tilt looks the same: `rotateX/rotateY` on the wrapper plus `perspective` on `.reel-feed` still produce it.
- **Hover scale selector** is now `.reel-card:hover .save-btn`.
- **Visible change:** the bookmark no longer tilts with the card; it stays level while the card moves under it.
- Saved-card `<template>`s clone the same markup, and the client script selects elements by class, so it needed no changes.

## Affected Files
- `src/components/ReelItem.astro`: new `.reel-card` container; button moved out of and after the wrapper.
- `src/pages/index.astro`: `.reel-card` styles, removed `preserve-3d`, updated hover selectors.
- `AGENTS.md`: updated the card pattern and added a "Save Button Stacking" gotcha.
