## Context

The ModMod visualizer uses React Flow to render entity relationships. Currently, edges maintain a static style regardless of which entity is selected. To improve navigation, we want to dynamically update the style of edges connected to the selected node.

## Goals / Non-Goals

**Goals:**
- Highlight edges connected to the selected node with a thick, bright green color (`#4ade80`).
- Ensure the highlighting works for both incoming and outgoing connections.
- Maintain a clean and subtle style for non-highlighted edges to provide visual focus.

**Non-Goals:**
- Differentiating between incoming and outgoing edges with different colors (all connected edges use the same green).
- Highlighting nodes at the other end of the edges (the focus is strictly on the lines).

## Decisions

- **Reactive Styling in `App.tsx`**: We will compute the `edges` array within a `useMemo` that depends on `selectedTableId` from the store.
  - *Rationale*: This ensures that every time the selection changes, the edge styles are recalculated and React Flow re-renders them efficiently.
- **Edge Style Constants**:
  - **Highlighted**: `{ stroke: '#4ade80', strokeWidth: 3 }`
  - **Normal**: `{ stroke: '#334155', strokeWidth: 1 }`
- **Animation**: Highlighted edges will have `animated: true` to further distinguish them from static, non-selected paths.

## Risks / Trade-offs

- **Performance**: [Risk] Recalculating all edges on every click might be slow for very large diagrams (thousands of edges). → [Mitigation] Since our current use cases involve typical enterprise data models (dozens to hundreds of entities), the overhead of a `useMemo` loop is negligible.
