## Context

React Flow provides built-in support for selection boxes. We need to bridge this with Modscape's persistence layer without triggering excessive file writes.

## Goals / Non-Goals

**Goals:**
- Move multiple tables/domains as a group.
- Persist coordinates only once after the drag is complete.
- Keep the UI clean by hiding the Detail Panel during bulk operations.

**Non-Goals:**
- Multi-node metadata editing (e.g. changing types for multiple tables at once).
- Bulk deletion (keep it to single-node for safety).

## Decisions

### 1. React Flow Configuration
Update `ReactFlow` component props:
- `selectionMode={SelectionMode.Partial}`: Nodes are selected if the box touches them.
- `selectionOnDrag={true}`: Standard behavior.
- `selectionKeyCode="Shift"`: Ensure it matches the help guide.

### 2. Batch Store Action
Add `updateNodesPosition(nodes: { id: string, x: number, y: number, parentId?: string | null }[])` to `useStore.ts`.
- This action will loop through the provided nodes, update the `schema.layout`, then call `syncToYamlInput` and `saveSchema` exactly once.

### 3. Selection Event Handlers
In `App.tsx`, implement `onSelectionDragStop`:
```javascript
const onSelectionDragStop = (event, nodes) => {
  const updates = nodes.map(node => ({
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    parentId: node.parentNode
  }));
  updateNodesPosition(updates);
};
```

### 4. Selection Counting
Track the number of selected nodes. If `count > 1`, set `selectedTableId` to `null` in the store to hide the Detail Panel.

## Risks / Trade-offs

- **[Risk] Sync Performance**: Updating 50+ nodes at once might cause a slight lag in YAML generation.
  - *Mitigation*: `js-yaml` dump is very fast; we will monitor the 10MB limit.
