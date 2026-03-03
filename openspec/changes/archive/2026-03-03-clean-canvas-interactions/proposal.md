## Why

The current UI interaction model uses prominent [X] delete buttons directly on nodes (Tables, Domains) and edges. This creates visual clutter and leads to accidental deletions, especially when attempting to resize elements. Transitioning to a combination of keyboard shortcuts and a centralized contextual toolbar provides a cleaner, professional-grade experience.

## What Changes

- **Remove On-Canvas Delete Buttons**: Eliminate the [X] buttons from `TableNode`, `DomainNode`, and `ButtonEdge`.
- **Keyboard-Based Deletion**: Enable native React Flow support for deleting selected elements using the `Delete` and `Backspace` keys.
- **Contextual Actions Toolbar**: Introduce a dynamic section in the top-right toolbar that displays the currently selected element's name and provides a centralized delete button.
- **Visual Cleanup**: Simplify custom nodes and edges to focus purely on data representation and layout handles.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `visualizer-core`: Update global event configuration to support keyboard deletion and handle selection context.
- `interactive-edge-deletion`: Update edge components to remove direct interaction buttons in favor of the global toolbar.

## Impact

- `visualizer/src/App.tsx`: Main React Flow configuration.
- `visualizer/src/components/TableNode.tsx`: Custom node cleanup.
- `visualizer/src/components/DomainNode.tsx`: Custom node cleanup.
- `visualizer/src/components/ButtonEdge.tsx`: Custom edge cleanup.
- `visualizer/src/components/CanvasToolbar.tsx`: Addition of contextual actions.
