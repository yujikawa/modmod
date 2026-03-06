## Why

In v1.0.3, a "Snapping Booster" was added to ensure edges attach correctly to nodes after the initial render. However, this booster was placed in a `useEffect` that depends on the entire `schema`. This causes the canvas to automatically zoom out and center (`fitView`) every time the schema is updated—including during node drags, metadata edits, or formatting. This frequent, unexpected jumping of the viewport severely degrades the user experience.

## What Changes

- **Conditional Snapping Booster**:
  - Refactor the "Booster" in `App.tsx` to only fire when a new model is loaded or the model file is switched.
  - Use a ref or a specific state to track if the initial `fitView` has already been performed for the current model.
- **Maintain Edge Snapping**:
  - Keep the logic that forces a secondary edge re-sync (`edgeSyncTrigger`), but isolate it from the disruptive `fitView` call.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Stabilize viewport management during schema updates.

## Impact

- `visualizer/src/App.tsx`: Refactor `Sync Nodes` effect to prevent redundant `fitView` calls.
