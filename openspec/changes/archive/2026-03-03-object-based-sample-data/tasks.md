## 1. Schema and Type Updates

- [x] 1.1 Update `Table` interface in `visualizer/src/types/schema.ts` to allow `sampleData` to be a 2D array.
- [x] 1.2 Update `normalizeSchema` in `visualizer/src/lib/parser.ts` to migrate legacy object-based sample data (`columns` and `rows`) to the new 2D array format.

## 2. Store and UI Logic Updates

- [x] 2.1 Update `handleUpdateSampleData`, `handleAddSampleRow`, `handleRemoveSampleRow`, and `handleUpdateSampleCell` in `visualizer/src/components/DetailPanel.tsx` to handle 2D arrays directly.
- [x] 2.2 Remove `handleAddSampleColumn` and `handleRemoveSampleColumn` logic and UI from `DetailPanel.tsx`.
- [x] 2.3 Refactor the Sample Data editor UI in `DetailPanel.tsx` to drive headers from logical columns and cells from row indices.
- [x] 2.4 Update `visualizer/src/components/SampleDataGrid.tsx` to support the new 2D array format.

## 3. Data Migration and Documentation

- [x] 3.1 Manually migrate all existing samples in `samples/*.yaml` to the new direct 2D array `sampleData` format.
- [x] 3.2 Update `src/templates/rules.md` to reflect the new simplified YAML schema.
- [x] 3.3 Update `README.md` and `README.ja.md` to reflect the new simplified YAML schema.

## 4. Verification

- [x] 4.1 Verify that loading old models correctly migrates data to the new format.
- [x] 4.2 Verify that the UI correctly shows and edits sample data based on logical column order.
- [x] 4.3 Verify that adding a logical column automatically adds it to the sample data grid.
