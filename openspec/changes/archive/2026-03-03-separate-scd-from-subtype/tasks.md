## 1. Schema and Parser

- [x] 1.1 Update `visualizer/src/types/schema.ts` to add `scd` as a top-level property in `appearance`
- [x] 1.2 Update `visualizer/src/lib/parser.ts` to implement migration logic (mapping `sub_type: typeX` to `scd: typeX`)

## 2. UI Updates

- [x] 2.1 Update `visualizer/src/components/TableNode.tsx` to render both `sub_type` and `scd` labels in the header
- [x] 2.2 Update `visualizer/src/components/DetailPanel.tsx` to display two independent dropdowns for `sub_type` and `scd`

## 3. Documentation and Samples

- [x] 3.1 Update `src/templates/rules.md` to reflect the separation of `sub_type` and `scd`
- [x] 3.2 Update `README.md` and `README.ja.md` YAML references
- [x] 3.3 Update `samples/analytics-professional.yaml` and `samples/comprehensive-pipeline.yaml` to use the new schema

## 4. Verification

- [x] 4.1 Verify a Fact table can have both `transaction` sub_type and `type2` scd visually and in YAML
- [x] 4.2 Verify legacy `sub_type: type2` is correctly migrated to the new `scd` property
