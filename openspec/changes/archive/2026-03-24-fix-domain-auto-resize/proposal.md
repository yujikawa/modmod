## Why

When tables inside a domain are rearranged (e.g., stacked vertically), the domain background shrinks vertically to fit but never shrinks horizontally. This is because the domain width is constrained by a stored `width` value that only grows, causing the domain to appear wider than its actual table contents.

## What Changes

- Remove the `Math.max(bb.w, lw)` / `Math.max(bb.h, lh)` logic in `renderDomainBackgrounds`
- Domain size will always be derived from the live bounding box of member tables plus padding
- Stored `width`/`height` in the layout will only be used as a fallback for empty domains (no member tables)

## Capabilities

### New Capabilities
- `domain-auto-resize`: Domain background always resizes to fit its member tables dynamically, both growing and shrinking

### Modified Capabilities
<!-- No spec-level requirement changes -->

## Impact

- `visualizer/src/components/CytoscapeCanvas.tsx`: Remove `Math.max` width/height guard in `renderDomainBackgrounds`
- No YAML schema changes required
- No store changes required
- Empty domain rendering is unaffected
