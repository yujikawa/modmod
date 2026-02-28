## Context

The visualizer currently handles "CLI Editor Mode" and "Static Viewer" modes through conditional rendering in `App.tsx`. The sidebar is tightly coupled with the main layout, making it difficult to maintain and expand. Static viewers have limited interaction, as the editor is hidden and the entity list is non-interactive.

## Goals / Non-Goals

**Goals:**
- Extract the sidebar into a standalone, reusable `Sidebar` component.
- Implement a tabbed interface (Editor / Entities) and a collapse mechanism.
- Enable in-memory YAML parsing in static mode ("Sandbox Mode").
- Implement diagram navigation (zoom/focus) from the entity list.
- Unify state management for sidebar behavior in `useStore`.

**Non-Goals:**
- Persistence for static mode edits (they will be lost on reload).
- Real-time collaborative editing.
- Complex undo/redo history for the editor (though standard textarea undo works).

## Decisions

### 1. Unified State Management (`useStore`)
- **Decision**: Add `isSidebarOpen`, `activeTab`, and `isSandboxMode` to `useStore`.
- **Rationale**: Centralizing UI state makes it easier to handle side effects (like resizing the diagram when the sidebar collapses) and shared logic.

### 2. Component Extraction
- **Decision**: Create `Sidebar.tsx`, `SidebarHeader.tsx`, `EditorTab.tsx`, and `EntitiesTab.tsx`.
- **Rationale**: Better separation of concerns and improved testability. `App.tsx` will focus on layout and ReactFlow orchestration.

### 3. Diagram Navigation (Focus Node)
- **Decision**: Use `reactflow`'s `fitView` or `setCenter` API via a ref or hook exposed through the store.
- **Rationale**: Allows the Entities tab to trigger diagram movements cleanly.

### 4. Sandbox Mode Logic
- **Decision**: In `handleParse`, check `isCliMode`. If false, only update the `schema` state without calling the `/api/save-yaml` endpoint.
- **Rationale**: Seamlessly enables "What-if" analysis for static viewers without requiring backend support.

### 5. Styling and Transitions
- **Decision**: Use Tailwind CSS for transitions and layout.
- **Rationale**: Consistent with the existing project's styling approach.

## Risks / Trade-offs

- **[Risk] Performance with large YAMLs** → **Mitigation**: Use `useMemo` for parsing/syncing and potentially debounce the editor input if performance issues arise.
- **[Risk] Layout shifts during collapse** → **Mitigation**: Use smooth CSS transitions and ensure `ReactFlow`'s `fitView` is called after the transition completes if necessary.
- **[Risk] Confusing "Save" button in static mode** → **Mitigation**: Change button label to "Apply Changes" and show a "Changes won't be saved permanently" tooltip/badge.
