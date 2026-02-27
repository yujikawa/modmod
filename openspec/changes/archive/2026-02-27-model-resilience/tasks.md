## 1. Type Relaxation

- [x] 1.1 Update `visualizer/src/types/schema.ts` to make `columns`, `logical`, and `physical` optional
- [x] 1.2 Update `Relationship` interface to make `column` IDs optional in `from` and `to`

## 2. Robust Parsing

- [x] 2.1 Update `visualizer/src/lib/parser.ts` to provide default empty structures for missing fields
- [x] 2.2 Add basic normalization logic to ensure `tables` and `relationships` are always arrays

## 3. Resilient Rendering

- [x] 3.1 Update `visualizer/src/components/TableNode.tsx` to hide column list if `columns` is empty/undefined
- [x] 3.2 Add null-checks for `col.logical` properties in `TableNode` and use defaults (ID as name, "Unknown" as type)
- [x] 3.3 Update `visualizer/src/App.tsx` edge rendering to support table-level relationships (omit `sourceHandle`/`targetHandle` if column is missing)

## 4. Detail Panel Refinement

- [x] 4.1 Update `visualizer/src/components/DetailPanel.tsx` to show "No columns defined" message in Logical/Physical tabs when data is absent
- [x] 4.2 Add conditional rendering for `tags` and `description` in the Conceptual tab
- [x] 4.3 Verify that selecting an empty table node opens the panel correctly without crashing

## 5. Verification

- [x] 5.1 Test with a "Minimal YAML" (only ID and Name) to ensure it renders as a box
- [x] 5.2 Test with a "Table-only Relationship" YAML to ensure lines are drawn between boxes
- [x] 5.3 Verify that malformed column entries (missing `logical` block) don't crash the UI
