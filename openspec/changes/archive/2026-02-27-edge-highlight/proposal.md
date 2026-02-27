## Why

When working with large data models, it becomes difficult to trace the relationships of a specific entity. By highlighting all connected edges when an entity is selected, users can instantly visualize the immediate dependencies and connections of that entity, improving the overall navigability and understanding of the model.

## What Changes

- **Dynamic Edge Styling**: Edges connected to a selected entity will change their style (thick, bright green).
- **Selection-Aware Highlighting**: The highlighting will trigger upon clicking an entity node and clear when the selection is removed.
- **Improved Contrast**: Non-connected edges will be dimmed or maintained in a subtle state to make the highlighted paths stand out.

## Capabilities

### New Capabilities
- `edge-styling`: Logic to calculate and apply dynamic styles to React Flow edges based on the current selection state.

### Modified Capabilities
- `visualizer-core`: Update the edge rendering logic to respond to node selection events from the state.

## Impact

- **UI/UX**: Enhanced visual feedback during diagram exploration.
- **Visualizer Component**: Modifications to the edge generation logic in `App.tsx`.
