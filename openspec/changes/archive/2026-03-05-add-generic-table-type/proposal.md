## Why

Modscape is currently focused on specialized modeling frameworks (Dimensional Modeling, Data Vault). However, many real-world data stacks include general-purpose tables that don't strictly fall into these categories (e.g., raw mirror tables, simple RDB exports, or utility tables). Adding a generic `table` type provides a neutral, flexible option for users to document any physical entity without forcing a specialized role.

## What Changes

- **Schema Enhancement**: 
  - Add `table` to the allowed values for `appearance.type`.
- **UI & Visualization**:
  - Define a new `table` configuration in `TableNode.tsx` using a neutral Slate color (`#64748b`) and a 📋 (Clipboard) icon.
  - Add "Table" to the type selection dropdown in the `DetailPanel`.
- **Documentation**:
  - Update `src/templates/rules.md` to include `table` as a standard option for general data entities.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Update node rendering and type definitions to support the generic table type.
- `detail-panel`: Update metadata selectors.
- `rules-templating`: Include the generic type in the default guidance.

## Impact

- `visualizer/src/types/schema.ts`: Updated `Table` interface.
- `visualizer/src/components/TableNode.tsx`: Added `table` to `TYPE_CONFIG`.
- `visualizer/src/components/DetailPanel.tsx`: Updated dropdown options.
- `src/templates/rules.md`: Updated guidance and examples.
