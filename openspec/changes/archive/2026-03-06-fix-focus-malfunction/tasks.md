## 1. Logic Implementation

- [x] 1.1 Add `useRef` to track the last loaded model in `App.tsx`
- [x] 1.2 Refactor the "Booster" in the `Sync Nodes` effect to use the model slug guard
- [x] 1.3 Ensure `setEdgeSyncTrigger` still fires for incremental updates to maintain edge snapping

## 2. Verification

- [x] 2.1 Verify that the canvas zooms to fit when first opening a file
- [x] 2.2 Verify that dragging a node does NOT cause the canvas to zoom out or center after 400ms
- [x] 2.3 Verify that switching between multiple files still triggers the initial `fitView` for each
