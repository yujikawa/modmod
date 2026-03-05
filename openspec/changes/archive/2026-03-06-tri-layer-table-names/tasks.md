## 1. Schema & Infrastructure

- [x] 1.1 Add `logical_name` and `physical_name` to `Table` interface in `schema.ts`
- [x] 1.2 Update `normalizeSchema` in `parser.ts` to preserve and initialize new fields

## 2. UI: Table Node Rendering

- [x] 2.1 Refactor `TableNode.tsx` header to remove `id` display
- [x] 2.2 Implement 3-layer layout: Conceptual (Big), Logical (Mid), Physical (Small)
- [x] 2.3 Implement fallback logic: Hide Logical if same as Conceptual; Default Physical to `id`

## 3. UI: Detail Panel Editing

- [x] 3.1 Add `Logical Name` input to the Logical tab in `DetailPanel.tsx`
- [x] 3.2 Add `Physical Name` input to the Physical tab in `DetailPanel.tsx`
- [x] 3.3 Ensure all three names are editable and synchronized with the store

## 4. Documentation & Verification

- [x] 4.1 Update `rules.md` template to explain the tri-layer naming strategy
- [x] 4.2 Verify layout looks balanced with 1, 2, or 3 layers visible
- [x] 4.3 Verify changes persist correctly to YAML
