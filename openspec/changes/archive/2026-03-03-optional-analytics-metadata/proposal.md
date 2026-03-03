## Why

The current UI for analytics metadata (Fact Strategy and SCD Type) forces a selection even when the user hasn't decided or doesn't need to specify these attributes. Providing a way to deselect or leave these fields empty makes the modeling process more flexible and less overwhelming for early-stage designs.

## What Changes

- **Optional Selection in Detail Panel**: Add a "None" or "-" option to the Strategy and SCD dropdowns in the Detail Panel.
- **Improved Display Logic**: Ensure that when no strategy or SCD type is selected, the visualizer displays only the base type (e.g., "FACT" or "DIM") without empty parentheses or default values.
- **Consistent Empty State**: Align the column Role settings (Additivity) to also support an explicit "None" state.

## Capabilities

### New Capabilities
<!-- No new capabilities -->

### Modified Capabilities
- `visualizer-core`: Update rendering and interaction logic to handle undefined/empty analytics metadata.

## Impact

- `visualizer/src/components/DetailPanel.tsx`: UI changes to dropdowns and state management.
- `visualizer/src/components/TableNode.tsx`: UI logic for header labels.
