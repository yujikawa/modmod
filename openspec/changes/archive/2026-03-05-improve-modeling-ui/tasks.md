## 1. Technical Infrastructure

- [x] 1.1 Increase Express JSON limit to 10MB in `src/dev.js`
- [x] 1.2 Update `rules.md` template with latest modeling attributes

## 2. Table Object Enhancement

- [x] 2.1 Display column count in `TableNode.tsx` header (e.g., `(12)`)
- [x] 2.2 Add numbering (1., 2...) to column list in `TableNode.tsx`

## 3. Domain Interaction Refactor

- [x] 3.1 Implement `assignTableToDomain` action in `visualizer/src/store/useStore.ts`
- [x] 3.2 Add Domain selector to the "Conceptual" tab in `DetailPanel.tsx`
- [x] 3.3 Remove automatic domain detection from `onNodeDragStop` in `App.tsx`

## 4. Verification

- [x] 4.1 Verify that large models (many tables/columns) can be saved successfully
- [x] 4.2 Verify that changing a table's domain via the Detail Panel updates the YAML correctly
- [x] 4.3 Verify that columns show correct numbering and counts
