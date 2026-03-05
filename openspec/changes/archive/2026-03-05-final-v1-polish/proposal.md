## Why

To reach a production-ready v1.0.0 state, Modscape needs to provide clear feedback on its operational modes and safeguard users against accidental data loss. Specifically:
1. Users need to know *why* they can't create edges when both ER and Lineage modes are active.
2. Power users need an accessible reference for the keyboard shortcuts that make the tool efficient.
3. Users need a safety net when deleting entities, especially with Auto-save enabled.

## What Changes

- **Read-Only Mode Indicator**: 
  - Add a floating badge that appears when `showER && showLineage` is true.
  - Clearly state that editing is disabled to prevent ambiguous edge creation.
- **Keyboard Shortcut Guide**:
  - Add a help icon/button to the vertical toolbar.
  - Implement a floating reference panel showing shortcuts for Undo, Redo, Delete, and Selection.
- **Deletion Safety**:
  - Add a simple confirmation dialog (or non-blocking toast with undo hint) when deleting tables or domains.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Add global UI indicators and safety checks.
- `sidebar-ui`: Integrate help/documentation directly into the workspace.

## Impact

- `visualizer/src/App.tsx`: Layout changes for the Read-Only badge and deletion logic.
- `visualizer/src/components/CanvasToolbar.tsx`: Add help button and shortcut overlay.
- `visualizer/src/index.css`: Styling for the new UI elements.
