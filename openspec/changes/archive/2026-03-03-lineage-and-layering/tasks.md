## 1. Schema and Foundation

- [x] 1.1 Update `visualizer/src/types/schema.ts` to include `layer` and `lineage` fields
- [x] 1.2 Update `visualizer/src/lib/parser.ts` to support the new schema fields
- [x] 1.3 Add `showER` and `showLineage` booleans to `visualizer/src/store/useStore.ts`

## 2. Table Node Enhancement

- [x] 2.1 Update `TableNode.tsx` to display a floating layer tab on the top-left
- [x] 2.2 Implement seamless top-left corner (radius 0) when layer is present
- [x] 2.3 Add lineage handles to the left (target) and right (source) sides

## 3. Lineage Edge Implementation

- [x] 3.1 Create `visualizer/src/components/LineageEdge.tsx` with animated dashed blue arrow style
- [x] 3.2 Update `App.tsx` to register the new `lineage` edge type
- [x] 3.3 Ensure lineage edges support global selection and deletion

## 4. UI Controls and Interaction

- [x] 4.1 Refactor `CanvasToolbar.tsx` to use independent toggles for ER and Lineage
- [x] 4.2 Implement bidirectional ER connection logic (automatic source/target swap) in `App.tsx`
- [x] 4.3 Implement read-only handle logic when both modes are active

## 5. Verification

- [x] 5.1 Create a comprehensive test YAML (`samples/comprehensive-pipeline.yaml`)
- [x] 5.2 Verify simultaneous display and interaction logic
