## Why

Currently, the `DetailPanel` uses `absolute` positioning, which causes it to overlap and obscure the ER diagram when an entity is selected. This makes it difficult for users to see the highlighted relationships and the broader context of the diagram while reviewing details. An "L-shape" layout will ensure that the diagram and details are visible simultaneously.

## What Changes

- **Layout Structural Change**: Transition from an overlapping absolute layout to a non-overlapping flexbox-based layout.
- **Right Section Partitioning**: Divide the right side of the application into a top section for the Diagram and a bottom section for the Detail Panel.
- **Dynamic Resizing**: When a table is selected, the Diagram area will adjust its height to accommodate the Detail Panel. When no table is selected, the Diagram will occupy the full height.
- **Fixed-Height Detail Panel**: Set a fixed height (e.g., 300px or 30%) for the Detail Panel with internal scrolling for large content sets.

## Capabilities

### New Capabilities
- `l-shape-layout`: A new layout configuration where the right side is split vertically between the canvas and the detail view.

### Modified Capabilities
- `visualizer-core`: Update the main container structure in `App.tsx` to handle the vertical split.
- `detail-panel`: Remove absolute positioning and adapt to a fixed-height, relative layout within the right section.

## Impact

- **UI/UX**: Significant improvement in visibility and multi-tasking during modeling.
- **Visualizer Layout**: Refactoring of the flex/grid structure in `App.tsx`.
- **CSS/Styles**: Removal of `absolute` positioning in favor of `relative`/`flex` flow.
