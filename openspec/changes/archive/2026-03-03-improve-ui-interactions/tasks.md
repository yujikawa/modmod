## 1. Clean up Custom Node Interaction

- [x] 1.1 Remove manual `onClick` handler and `e.stopPropagation()` from the root div in `visualizer/src/components/TableNode.tsx`.
- [x] 1.2 Remove manual `handleNodeClick` and `e.stopPropagation()` from the root div in `visualizer/src/components/DomainNode.tsx`.
- [x] 1.3 Ensure internal action buttons (like delete 'X') still use `e.stopPropagation()` to prevent unwanted side effects.

## 2. Implement Smart Selection in App.tsx

- [x] 2.1 Refactor `onSelectionChange` in `visualizer/src/App.tsx` to handle only edges.
- [x] 2.2 Re-implement `onNodeClick` handler to use React Flow's intelligent click detection (separated from drag).
- [x] 2.3 Ensure `onNodeClick` sets `selectedTableId` to open the panel.
- [x] 2.4 Ensure `onPaneClick` clears `selectedTableId` to close the panel.
- [x] 2.5 Update `onNodeDragStop` to clear selection after a drag is completed.

## 3. Style and UI Polish

- [x] 3.1 Verify that the visual "elevation" effect was removed as requested.
- [x] 3.2 Ensure the `ReactFlow` component is correctly configured with new event handlers.

## 4. Verification

- [x] 4.1 Verify that clicking a node opens the detail panel.
- [x] 4.2 Verify that dragging a node does NOT open the detail panel.
- [x] 4.3 Verify that a node is deselected immediately after a drag finishes.
- [x] 4.4 Verify that clicking the background deselects any selected node and closes the panel.
- [x] 4.5 Verify the visual stability by removing experimental effects.
