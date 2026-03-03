## Context

React Flow nodes and edges currently use a simple "set on click" pattern. This is implemented in `App.tsx` using `onNodeClick` and `onSelectionChange`. The current logic always sets the selected ID, even if it matches the current selection.

## Goals / Non-Goals

**Goals:**
- Implement toggle selection for nodes (tables/domains).
- Implement toggle selection for edges (relationships).

**Non-Goals:**
- Multi-selection support (this change focuses on single-item toggling).

## Decisions

### 1. Toggle Logic in `onNodeClick`
Modify `onNodeClick` to check if the clicked node's ID is the same as `selectedTableId`. If it is, set `selectedTableId` to `null`.
**Rationale:** This provides the expected "click to deselect" behavior.

### 2. Implement `onEdgeClick`
Explicitly add `onEdgeClick` to the `ReactFlow` component in `App.tsx`. Use the same toggle logic as nodes (comparing with `selectedEdgeId`).
**Rationale:** While `onSelectionChange` handles initial selection, `onEdgeClick` is better for handling the user's intent to toggle a specific edge.

## Risks / Trade-offs

- **[Risk] Interaction with `onPaneClick`** → `onPaneClick` already deselects everything. Toggling via direct click is an additional convenience that shouldn't conflict.
- **[Risk] React Flow's internal selection state** → React Flow also tracks selection internally. We should ensure our store state stays in sync.
