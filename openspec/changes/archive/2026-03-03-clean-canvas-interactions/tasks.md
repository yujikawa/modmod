## 1. Interaction Logic Refinement

- [x] 1.1 Remove on-canvas [X] buttons from Tables, Domains, and Edges (Completed).
- [x] 1.2 Update `ReactFlow` in `App.tsx` with `selectNodesOnDrag={false}`.
- [x] 1.3 Ensure `onNodeClick` remains the primary trigger for `setSelectedTableId`.
- [x] 1.4 Ensure `onNodeDragStop` clears the selection state to keep the drag-to-place workflow clean.

## 2. Toolbar & Keyboard

- [x] 2.1 Contextual Selection Bar in `CanvasToolbar.tsx` showing From -> To for relationships (Completed).
- [x] 2.2 Delete button in Selection Bar triggered by current selection (Completed).
- [x] 2.3 Keyboard deletion enabled for Backspace/Delete (Completed).

## 3. Verification

- [x] 3.1 Verify that dragging a node does NOT select it (no blue border, no panel).
- [x] 3.2 Verify that clicking a node selects it AND opens the panel.
- [x] 3.3 Verify that clicking the Selection Bar's delete button works for the active element.
- [x] 3.4 Verify that pressing Backspace/Delete works ONLY for the clicked (selected) element.
