## Context

The Modscape visualizer uses React Flow to render tables and relationships. While nodes (tables and domains) now have interactive management features (add, resize, delete), relationships (edges) are currently read-only once created visually or defined in YAML. Users need a way to remove edges directly on the canvas.

## Goals / Non-Goals

**Goals:**
- Provide a visual "Delete" button on every edge in the visualizer.
- Ensure clicking the button removes the relationship from the YAML schema and triggers a sync to the editor.
- Support both CLI (auto-save) and Sandbox modes.

**Non-Goals:**
- Support for complex edge labels or multiple buttons per edge in this phase.
- Handling of specialized edge routing logic (will use default step/smoothstep paths).

## Decisions

### 1. Custom Edge Implementation with BaseEdge and EdgeLabelRenderer
- **Decision:** Implement a custom edge component `ButtonEdge.tsx` using React Flow's `BaseEdge` for the path and `EdgeLabelRenderer` for the delete button.
- **Rationale:** This is the standard and most flexible way to add interactive elements to edges without breaking the path rendering logic.
- **Alternatives:** Overriding default styles (limited interactivity), or using `onEdgeClick` (less intuitive than a dedicated button).

### 2. Button Positioning at Path Midpoint
- **Decision:** Use `getBezierPath` or `getSmoothStepPath` utilities to find the midpoint $(x, y)$ of the edge and place the delete button there.
- **Rationale:** Ensures the button is consistently accessible regardless of edge length or orientation.

### 3. Store-level `removeEdge` Action
- **Decision:** Add a `removeEdge(sourceId, targetId)` action to `useStore.ts`.
- **Rationale:** Encapsulates the logic of filtering the `relationships` array and triggering `syncToYamlInput` in a single place.

## Risks / Trade-offs

- **[Risk] Button Overlap** → [Mitigation] If multiple edges are very close or overlapping, buttons might stack. We will use a small, distinct circular button to minimize this, and users can move nodes to clear the view.
- **[Risk] Performance with many edges** → [Mitigation] React Flow is optimized for this, and the button is a simple SVG/HTML overlay. No significant impact expected.
