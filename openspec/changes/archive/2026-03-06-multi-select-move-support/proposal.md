## Why

As users build larger models, manually arranging nodes one by one becomes tedious. Enabling multi-select allows users to organize their canvas in groups, drastically improving productivity during layout refinement phases.

## What Changes

- **Enable Standard Multi-select**:
  - Support `Shift + Drag` for marquee (box) selection.
  - Support `Shift + Click` to toggle individual node selection.
- **Bulk Movement Logic**:
  - Implement `onSelectionDragStop` to handle the final positions of all selected nodes at once.
  - Add a batch update action to the store to synchronize all new coordinates to the YAML in a single operation.
- **Focused Interaction Guards**:
  - Automatically close or suppress the `DetailPanel` when multiple nodes are selected to avoid UI ambiguity.
  - Restrict multi-select usage primarily to movement (avoiding bulk editing for now to prevent accidental changes).

## Capabilities

### Modified Capabilities
- `visualizer-core`: Update React Flow configuration and store actions for batch movement.
- `detail-panel`: Add visibility guards for multi-selection states.

## Impact

- `visualizer/src/App.tsx`: Configure `selectionMode` and implement selection event handlers.
- `visualizer/src/store/useStore.ts`: Add `updateNodesPosition` action for batch updates.
- `visualizer/src/components/DetailPanel.tsx`: Guard visibility based on selection count.
