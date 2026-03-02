## Context

The Modscape visualizer uses **React Flow** for its diagramming canvas. Tables are represented as custom `TableNode` components, and relationships are `ButtonEdge` components. Currently, the diagram is primarily read-only, except for node dragging and edge deletion. State is managed via a Zustand store (`useStore.ts`).

## Goals / Non-Goals

**Goals:**
- Enable interactive relationship creation via drag-and-drop.
- Support selecting and editing relationship properties in the Detail Panel.
- Maintain bidirectional sync between the visual state and the underlying YAML model.

**Non-Goals:**
- Advanced layout algorithms for new relationships (manual layout for now).
- Multi-select editing for relationships.
- Auto-completion for relationship types/metadata during drag-and-drop.

## Decisions

### 1. Per-Column Source Handles
- **Decision**: Add a `Handle` of `type="source"` to each column in the `TableNode`.
- **Rationale**: Allows precise relationship definition from specific columns.
- **Alternatives**: Table-level handles (less precise, harder to map to FKs later).

### 2. Edge Selection State
- **Decision**: Introduce `selectedEdgeId` in `useStore` and update `DetailPanel` to switch views based on whether a node or an edge is selected.
- **Rationale**: Reuses the existing Detail Panel infrastructure while providing a dedicated editing experience for relationships.

### 3. Relationship Persistence
- **Decision**: The `onConnect` callback will dispatch an `addRelationship` action to the store, which immediately updates the internal schema representation.
- **Rationale**: Ensures the UI stays in sync with the model at all times.

## Risks / Trade-offs

- **Visual Clutter**: Many handles might clutter the UI. → **Mitigation**: Only show handles on the active row or on hover.
- **Circular Dependencies**: Users might create invalid circular relationships. → **Mitigation**: Rely on the YAML generator/linter to highlight logical issues, but allow creation in the UI for flexibility.
