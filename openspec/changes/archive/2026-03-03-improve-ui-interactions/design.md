## Context

The current UI interaction in the Modscape visualizer is cluttered. Selection happens immediately on click or drag start, causing the detail panel to overlap nodes during layout adjustments. 

## Goals / Non-Goals

**Goals:**
- Decouple node selection (for layout) from node activation (for editing).
- Ensure clicking the background (pane) deselects all nodes and closes the panel.
- Only open the detail panel on an explicit **double-click** on a node.
- Automatically deselect nodes after dragging to maintain a clean canvas.

**Non-Goals:**
- Changing the content of the detail panel.
- Visual elevation effects (tried and removed due to instability).

## Decisions

### 1. Remove manual `onClick` handlers from Custom Nodes
(Completed) Allowed React Flow to handle native selection.

### 2. Move Activation Logic to `onNodeDoubleClick` in `App.tsx`
We will move the `setSelectedTableId` call from generic selection events to the double-click event.
- **Rationale**: Single click/mousedown is too ambiguous and often used for dragging. Double-click is a deliberate action to "edit" or "view details".

### 3. Clean up `onSelectionChange` in `App.tsx`
Remove side effects from `onSelectionChange` that trigger the detail panel. Selection will be used for React Flow's native highlighting, while our Store's `selectedTableId` will be driven by explicit user actions (double-click, pane-click).

### 4. Auto-deselection on Drag End
Use `onNodeDragStop` to clear the selected state.
- **Rationale**: Once a node is placed, keeping it selected is usually unnecessary for the next layout action.

## Risks / Trade-offs

- **[Risk]**: Users might not discover double-click easily.
- **[Mitigation]**: The UI already feels "pro" and YAML-driven; double-click for "Edit" is a standard pattern in professional modeling tools.
