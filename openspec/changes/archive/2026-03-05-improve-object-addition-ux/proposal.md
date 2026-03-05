## Why

Currently, adding a new table or domain creates it at fixed coordinates (e.g., 100, 100), which may be off-screen if the user has panned or zoomed elsewhere. This leads to confusion as users don't see immediate feedback for their action. Creating objects at the center of the current viewport and providing a visual "pop" effect ensures users always know exactly where the new element is.

## What Changes

- **Smart Positioning**: 
  - Calculate the current viewport's center coordinates using React Flow's API.
  - Spawn new tables and domains at these dynamic coordinates.
- **Immediate Selection**:
  - Automatically select the newly created object so the Detail Panel opens immediately for editing.
- **Visual Feedback (The "Pop")**:
  - Implement a CSS animation that makes the new node scale up and glow briefly upon creation.
- **Focus Management**:
  - Use `fitView` or `setCenter` optionally if the object would otherwise be clipped.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Update node spawning logic and add creation-time animations.

## Impact

- `visualizer/src/App.tsx`: Refactor `addTable` / `addDomain` calls to use viewport calculations.
- `visualizer/src/store/useStore.ts`: Ensure new nodes are automatically selected.
- `visualizer/src/index.css`: Add "just-created" animation classes.
