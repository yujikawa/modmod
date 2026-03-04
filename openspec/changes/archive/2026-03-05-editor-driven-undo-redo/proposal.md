## Why

Modscape uses a YAML-first modeling approach. Currently, there is no way to undo visual actions (like dragging nodes or editing metadata in the Detail Panel) without manual correction. Since all visual state is reflected in the YAML editor, integrating a professional code editor (CodeMirror) with a unified undo stack allows visual changes to be reversible via standard keyboard shortcuts (Ctrl+Z / Ctrl+Y).

## What Changes

- **Professional Editor Integration**: 
  - Replace the basic `textarea` in the sidebar with **CodeMirror 6**.
  - Add YAML syntax highlighting and dark theme support.
- **Unified Undo Stack**:
  - Configure CodeMirror to accept programmatic updates (from visual edits) as "undoable" history events.
  - Implement a real-time "Loop" sync: Visual Action -> Store -> YAML Editor (as history event) -> Parse back to Store (if changed via Undo/Redo).
- **Auto-Sync Logic**:
  - When CodeMirror content changes (whether by typing or Undo/Redo), automatically re-parse the schema to update the visual canvas.

## Capabilities

### Modified Capabilities
- `sandbox-editor`: Transform the YAML editor into a high-performance, undo-capable IDE component.
- `visualizer-core`: Refine the synchronization loop between state and text representation.

## Impact

- `visualizer/src/components/Sidebar/EditorTab.tsx`: Switch to CodeMirror component.
- `visualizer/src/store/useStore.ts`: Add logic to distinguish between user-driven text changes and programmatic sync updates.
