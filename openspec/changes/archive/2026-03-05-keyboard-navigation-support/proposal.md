## Why

Large data models can be tedious to navigate using only mouse dragging. Adding support for arrow-key navigation (panning the canvas) allows for quicker exploration and provides a more accessible interface for keyboard-heavy workflows.

## What Changes

- **Canvas Panning**: 
  - Implement a global key listener for `ArrowUp`, `ArrowDown`, `ArrowLeft`, and `ArrowRight`.
  - Pan the viewport by a fixed step (e.g., 100px) when these keys are pressed.
- **Context Awareness**:
  - Ensure panning is disabled when the user is typing in any text input, textarea, or the CodeMirror editor.
  - Prioritize node movement if a node is currently selected (preserving React Flow's default behavior).
- **UI Documentation**:
  - Add "Pan Canvas" to the keyboard shortcuts help guide in the toolbar.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Support keyboard-driven viewport manipulation.
- `sidebar-ui`: Update help guide documentation.

## Impact

- `visualizer/src/App.tsx`: Central logic for viewport manipulation.
- `visualizer/src/components/CanvasToolbar.tsx`: Documentation update.
