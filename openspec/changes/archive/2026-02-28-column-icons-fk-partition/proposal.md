## Why

To provide better visual cues for data modeling, columns should indicate their specific roles such as Primary Key (PK), Foreign Key (FK), and Partition Key. While PK is already supported, FK and Partition Key lack visual representation, making it harder to understand table relationships and storage strategies at a glance.

## What Changes

- **Schema**: Added `isPartitionKey` to the logical column definition.
- **UI (Visualizer)**: 
  - Updated `TableNode` to display icons for FK (`🔩`) and Partition Key (`📂`).
  - Updated `DetailPanel` (Logical tab) to display the same icons.
- **Samples**: Updated existing samples to demonstrate these new roles.

## Capabilities

### New Capabilities
- `column-role-indicators`: Visual icons in table nodes and detail panels to represent column roles (PK, FK, Partition).

### Modified Capabilities
- `visualizer-core`: Updated rendering logic for columns to support new role-based icons.
- `detail-panel`: Updated the logical column list to include the new indicators.

## Impact

- `visualizer/src/types/schema.ts`: Interface update.
- `visualizer/src/components/TableNode.tsx`: Rendering logic update.
- `visualizer/src/components/DetailPanel.tsx`: UI update.
- `samples/*.yaml`: Metadata updates to show off the features.
