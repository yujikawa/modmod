## Why

Initial YAML loads often result in overlapping nodes and overflowing domain containers. Manually rearranging large models is tedious. A "Magic Layout" button that automatically organizes tables based on their relationships and resizes domains to fit their content will provide a high-value "Aha!" moment for users.

## What Changes

- **Auto-Layout Engine**: 
  - Integrate `dagre` to compute hierarchical layouts.
  - Implement a two-pass algorithm: 
    1. **Inner Pass**: Layout tables within each domain and resize the domain to fit.
    2. **Outer Pass**: Layout domains and unassigned tables relative to each other.
- **Trigger UI**:
  - Add a "Magic Layout" (Sparkles icon) button to the vertical toolbox.
- **Persistence**:
  - Automatically update the YAML model's `layout` section with the new coordinates.
- **Animation**:
  - Use React Flow transitions to make the rearrangement feel smooth and satisfying.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Add intelligent layout computation and persistence.
- `sidebar-ui`: Add layout trigger to the toolbar.

## Impact

- `visualizer/package.json`: Add `dagre` dependency.
- `visualizer/src/store/useStore.ts`: Implement layout logic and coordinate batch updates.
- `visualizer/src/components/CanvasToolbar.tsx`: Add trigger button.
