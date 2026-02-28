## 1. Schema and UI Implementation

- [x] 1.1 Add `isPartitionKey?: boolean` to the `Column.logical` interface in `visualizer/src/types/schema.ts`.
- [x] 1.2 Update `visualizer/src/components/TableNode.tsx` to render `🔩` for FKs and `📂` for Partition Keys.
- [x] 1.3 Update `visualizer/src/components/DetailPanel.tsx` (Logical tab) to render the same icons.

## 2. Sample Data Update

- [x] 2.1 Update `samples/data-vault.yaml` to use `isForeignKey` and `isPartitionKey` (e.g., on `LOAD_DATE`).
- [x] 2.2 Update `samples/star-schema.yaml` to include FK indicators.
- [x] 2.3 Update `samples/normalized-ecommerce.yaml` to include FK indicators.

## 3. Verification

- [x] 3.1 Start the dev server with `samples/` and verify icons appear correctly in the diagram nodes.
- [x] 3.2 Verify icons appear correctly in the Detail Panel when a table is selected.
- [x] 3.3 Ensure columns with multiple roles show multiple icons.
