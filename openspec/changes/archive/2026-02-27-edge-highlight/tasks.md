## 1. Edge Logic Refactoring

- [x] 1.1 Update the edge generation logic in `visualizer/src/App.tsx` to include `selectedTableId` dependency
- [x] 1.2 Implement conditional styling for edges based on `selectedTableId`
- [x] 1.3 Add animation toggle for highlighted edges

## 2. Visual Refinement

- [x] 2.1 Define constants for "Normal" and "Highlighted" edge styles in a central location or within `App.tsx`
- [x] 2.2 Verify that the green color (`#4ade80`) provides sufficient contrast on the dark background

## 3. Verification

- [x] 3.1 Test clicking a node and verify all connected edges turn green and thick
- [x] 3.2 Test clicking the canvas background and verify all edges return to default style
- [x] 3.3 Verify that both incoming and outgoing edges are highlighted correctly
