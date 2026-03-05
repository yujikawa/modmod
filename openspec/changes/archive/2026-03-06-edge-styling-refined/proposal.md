## Why

Current ER relationship labels (`one-to-many`, etc.) are displayed as a single text box in the middle of the edge, which can be ambiguous and only appears on click. By splitting these into semantic badges—`( 1 )` for one and `[ M ]` for many—and placing them near the respective source and target tables, we provide immediate visual clarity on parent-child roles. Adding a semi-transparent default state ensures the structure is always discoverable without cluttering the view.

## What Changes

- **Split Edge Labels**: 
  - Remove the single central `one-to-many` label.
  - Introduce two distinct badges at the edge endpoints.
  - **( 1 ) Badge**: Circular, used for the "one" side.
  - **[ M ] Badge**: Square/Rounded-square, used for the "many" side.
- **Dynamic Visibility**:
  - **Resting State**: Badges are semi-transparent (e.g., 30% opacity) to provide structural context without visual noise.
  - **Active State (Selected/Hovered)**: Badges become 100% opaque and gain a subtle glow or border emphasis.
- **Backdrop Blur**: Apply `backdrop-blur` to badge backgrounds to ensure readability even when overlapping with edge lines.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Refine relationship rendering logic in `ButtonEdge.tsx`.

## Impact

- `visualizer/src/components/ButtonEdge.tsx`: Complete overhaul of the rendering logic to support dual badges and dynamic transparency.
