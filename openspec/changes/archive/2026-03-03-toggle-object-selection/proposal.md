## Why

Currently, clicking a node or edge that is already selected does nothing. Users expect to be able to click an object to select it and click it again to deselect it (toggle behavior), especially to close the detail panel or clear the focus.

## What Changes

- **Toggle Selection for Nodes**: Clicking an already selected table or domain will deselect it.
- **Toggle Selection for Edges**: Clicking an already selected relationship (edge) will deselect it.
- **Unified Selection Logic**: Use a consistent toggle pattern for all canvas objects.

## Capabilities

### New Capabilities
<!-- No new capabilities -->

### Modified Capabilities
- `visual-scaffolding`: Update selection behavior to include toggling.
- `interactive-navigation`: Ensure selection toggling works with navigation patterns.

## Impact

- `visualizer/src/App.tsx`: Modify `onNodeClick` and implement `onEdgeClick` to handle toggling.
