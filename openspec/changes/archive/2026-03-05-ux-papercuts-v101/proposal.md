## Why

The v1.0.0 release has been successful, but two specific interaction bugs are causing daily friction:
1. **Aggressive Defaulting**: Text inputs overwrite empty strings immediately, making it impossible to clear a field and type something new from scratch.
2. **Inaccurate Navigation**: Selecting an entity from the sidebar zooms into an incorrect location because the custom coordinate calculation fails to account for React Flow's internal transformations and nested positions.

Fixing these "Papercuts" is essential for a polished v1.0.1 experience.

## What Changes

- **Lazy Input Defaulting**: 
  - Allow empty strings during active editing (`onChange`).
  - Only apply fallback/default values when the input loses focus (`onBlur`).
- **Robust Viewport Navigation**:
  - Replace manual `setCenter` logic with React Flow's built-in `fitView({ nodes: [...] })`.
  - Ensure the zoom is centered and respects node dimensions perfectly.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Refine node navigation and improve metadata editing robustness.

## Impact

- `visualizer/src/App.tsx`: Refactor `focusNodeId` effect to use `fitView`.
- `visualizer/src/components/DetailPanel.tsx`: Update input handlers to allow temporary empty states.
- `visualizer/src/components/TableNode.tsx`: Ensure inline edits (if any) follow the same pattern.
