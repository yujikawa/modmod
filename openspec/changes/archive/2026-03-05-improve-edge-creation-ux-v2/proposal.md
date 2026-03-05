## Why

ER edges currently feel "attracted" to the right/left sides of tables because the handle IDs are not explicitly specified during edge synchronization. React Flow defaults to the first available handle, which often results in awkward visual layouts (e.g., a line intended for the bottom handle connecting to the right-side lineage handle). Additionally, users want to connect tables horizontally (Right -> Left) for more natural layouts.

## What Changes

- **Explicit Handle Mapping**:
  - Update `App.tsx` edge sync logic to explicitly set `sourceHandle` and `targetHandle` for ER relationships.
  - Default table-level relationships to Bottom -> Top.
- **Smart Horizontal Support**:
  - Refactor `TableNode.tsx` handles to be more distinct.
  - Update `onConnect` to detect if a connection was made via the sides and preserve that intent if we decide to store handle roles in the YAML (or at least prioritize them in the UI).
- **Handle Polishing**:
  - Ensure ER handles and Lineage handles don't conflict visually or logically.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Refine handle mapping and edge creation logic.

## Impact

- `visualizer/src/App.tsx`: Explicit handle assignment in `useEffect` for edges.
- `visualizer/src/components/TableNode.tsx`: Ensure unique and consistent handle IDs.
