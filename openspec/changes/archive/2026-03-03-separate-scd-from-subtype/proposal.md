## Why

History tracking (SCD) is an orthogonal concept to a table's core nature (Grain/Sub-type). In reality, Fact tables often use SCD Type 2 logic to track status transitions or corrections. By separating `scd` from `sub_type`, Modscape can express complex designs like "Transaction Fact with SCD Type 2 history" while keeping `sub_type` open for other table-specific classifications.

## What Changes

- **Schema Refactoring**:
  - Add a dedicated `scd` property to the `appearance` object.
  - Keep `sub_type` for grain/nature (e.g., transaction, periodic).
- **UI Enhancement (Detail Panel)**:
  - Add a dedicated SCD Type dropdown that is visible for ALL table types.
  - Update the Sub-type dropdown to only show grain-related options for Facts (and eventually others).
- **Visual Badge Update**:
  - Update `TableNode` to display both Sub-type and SCD Type if both are defined.
- **Migration**:
  - Automatically map existing `sub_type: typeX` values to the new `scd: typeX` property during loading.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Update rendering to support simultaneous display of sub-type and SCD.
- `rules-templating`: Refine modeling rules to reflect the separation of nature and history.

## Impact

- `visualizer/src/types/schema.ts`: Schema updates.
- `visualizer/src/lib/parser.ts`: Migration/Mapping logic.
- `visualizer/src/components/TableNode.tsx`: Rendering logic.
- `visualizer/src/components/DetailPanel.tsx`: UI layout.
