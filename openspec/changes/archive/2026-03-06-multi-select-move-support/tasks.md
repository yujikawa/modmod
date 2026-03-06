## 1. Store Enhancements

- [x] 1.1 Add `updateNodesPosition` batch action to `useStore.ts`
- [x] 1.2 Implement the batch coordinate update logic with single YAML sync/save trigger

## 2. React Flow Integration

- [x] 2.1 Update `Flow` component props in `App.tsx` to enable selection box and Shift key support
- [x] 2.2 Implement `onSelectionDragStop` to capture group movement
- [x] 2.3 Refine `onSelectionChange` to automatically clear single table focus when multiple nodes are selected

## 3. UI Refinement

- [x] 3.1 Update the help guide in `CanvasToolbar.tsx` to restore the "Multi-select" shortcut info (it's real now!)
- [x] 3.2 Add a "Multiple Objects Selected" indicator or state to the Detail Panel guard logic

## 4. Verification

- [x] 4.1 Verify Shift + Drag selects multiple nodes
- [x] 4.2 Verify dragging one of the selected nodes moves the whole group
- [x] 4.3 Verify coordinates for ALL moved nodes are saved to YAML after mouse up
- [x] 4.4 Verify Detail Panel closes when more than 1 node is selected
