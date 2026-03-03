## 1. Schema and Types

- [x] 1.1 Update `visualizer/src/types/schema.ts` to include `strategy`, `scd`, `additivity`, and `isMetadata`
- [x] 1.2 Update `visualizer/src/lib/parser.ts` to ensure these new fields are preserved during normalization

## 2. UI Implementation

- [x] 2.1 Update `visualizer/src/components/TableNode.tsx` header to render dynamic labels (e.g., FACT (Trans.), DIM (SCD T2))
- [x] 2.2 Add icons for additivity (`Σ`, `Σ~`, `⊘`) and metadata (`🕒`) in `visualizer/src/components/TableNode.tsx` column list

## 3. Documentation and Templates

- [x] 3.1 Expand `src/templates/rules.md` with detailed guidelines for professional modeling (strategies, SCD, additivity)
- [x] 3.2 Update `README.md` to highlight "Modern Data Stack" and professional modeling features
- [x] 3.3 Update `README.ja.md` to highlight professional modeling features in Japanese

## 4. Verification

- [x] 4.1 Create a sample model YAML using all new attributes and verify visual rendering
- [x] 4.2 Run `modscape init` and verify the content of the new `rules.md`
