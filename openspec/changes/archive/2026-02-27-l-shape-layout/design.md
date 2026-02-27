## Context

The current visualizer uses a sidebar for input and a main relative container for the diagram. The detail panel is an absolute-positioned child of the main container. This design results in the panel covering the diagram. To fix this, we will move to a flex-based L-shape layout.

## Goals / Non-Goals

**Goals:**
- Separate the Diagram Canvas and the Detail Panel into distinct non-overlapping regions.
- Maintain the Sidebar on the left.
- Ensure the Detail Panel has a fixed height and is scrollable.
- Automatically collapse the Detail Panel region when no entity is selected.

**Non-Goals:**
- Supporting a horizontal split (side-by-side diagram and details).
- User-resizable boundary between diagram and details (initial implementation will use a fixed ratio).

## Decisions

- **Nested Flex Containers**: Use a top-level `flex-row` for `[Sidebar | RightSection]`. The `RightSection` will be a `flex-col` containing `[Diagram | DetailPanel]`.
- **Dynamic Detail Panel Rendering**: The `DetailPanel` container in the `RightSection` will only render or will have `height: 0` when `selectedTableId` is null.
- **Fixed Detail Panel Height**: Set the Detail Panel height to `350px` or `35vh` to keep it compact while providing enough space for sample data grids.
- **Style Transition**: Remove `position: absolute`, `bottom: 0`, and `left: 33.33%` from `DetailPanel.tsx` and replace them with standard flex item properties.

## Risks / Trade-offs

- **Canvas Shrinkage**: [Risk] Shrinking the canvas vertically might hide some nodes if they were positioned low. → [Mitigation] React Flow handles viewport changes well; users can zoom/pan, and we can trigger a `fitView` if necessary, though manual navigation is usually sufficient.
- **Layout Jitter**: [Risk] The diagram might "jump" when the panel opens. → [Mitigation] Use CSS transitions on the height if possible, or accept the instant shift as a standard "split-view" behavior.
