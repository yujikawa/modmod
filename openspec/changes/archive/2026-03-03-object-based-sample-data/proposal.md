## Why

Currently, sample data is managed as an object with a separate array of column IDs and a 2D array of rows. This requires manual synchronization whenever the logical model changes. By transitioning to a direct 2D array format (`sampleData: [[val1, val2], ...]`) that is automatically mapped to logical columns by index, we can achieve maximum simplicity ("handiness") and remove redundant column management from the UI.

## What Changes

- **BREAKING**: Change `sampleData` YAML schema to be a simple 2D array (list of lists) directly under the `sampleData` key, or a `rows` key if preferred. The user explicitly asked for "list remains as list", so `sampleData: [[...]]` is the target.
- **Modification**: Update the visualizer's internal types and store to handle the 2D array format.
- **Modification**: Simplify the Sample Data tab in the Detail Panel:
  - Headers are automatically driven by the table's logical columns.
  - Redundant column addition/removal buttons are removed.
  - Only the "Add Row" button remains.
- **Modification**: Update all sample model files (`samples/*.yaml`) to the new simplified format.
- **Modification**: Update `rules.md` and `README.md` documentation to reflect the new simplified schema.

## Capabilities

### New Capabilities
- `simple-list-sample-data`: Transition sample data to a direct 2D array format for maximum simplicity.

### Modified Capabilities
- `sample-data-grid`: Update the requirements for the sample data grid to be driven by logical columns by index.

## Impact

- `visualizer/src/types/schema.ts`: Type definition change (`SampleData` becomes `any[][]` or similar).
- `visualizer/src/store/useStore.ts`: Update modeling actions for sample data rows.
- `visualizer/src/components/DetailPanel.tsx`: UI logic for the sample data editor (index-based mapping).
- `visualizer/src/components/SampleDataGrid.tsx`: UI logic for the read-only grid (index-based mapping).
- `samples/*.yaml`: Data migration for all existing samples.
- `src/templates/rules.md`: Documentation update.
- `README.md` & `README.ja.md`: Documentation update.
