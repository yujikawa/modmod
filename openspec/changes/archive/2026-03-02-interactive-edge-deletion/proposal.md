## Why

The current UI allows adding nodes and relationships but lacks an intuitive way to remove existing relationships (edges) directly from the canvas. Adding a dedicated delete button on edges will improve the modeling experience by allowing quick adjustments without manual YAML editing.

## What Changes

- **Interactive Edge Deletion**: Edges on the canvas will now feature a clickable delete button.
- **Persistent Removal**: Clicking the delete button will permanently remove the relationship from the underlying YAML schema.

## Capabilities

### New Capabilities
- `interactive-edge-deletion`: Direct visual removal of relationships via canvas-level controls on edges.

### Modified Capabilities
- `visualizer-core`: Update to support custom edge rendering with interactive controls.

## Impact

- **Frontend (Visualizer)**: New custom edge component `ButtonEdge.tsx` and updates to `App.tsx` to register it.
- **Store**: New `removeEdge` action in `useStore.ts` to sync deletions with the YAML state.
