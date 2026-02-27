## 1. Layout Structural Refinement

- [x] 1.1 Update `App.tsx` to wrap the right section in a vertical flex container
- [x] 1.2 Modify `DetailPanel.tsx` to remove absolute positioning and adapt to a relative layout
- [x] 1.3 Ensure the diagram canvas expands to fill the remaining space in the right section

## 2. Dynamic Visibility

- [x] 2.1 Implement conditional rendering logic in `App.tsx` to show/hide the Detail Panel based on `selectedTableId`
- [x] 2.2 Add height constraints to the Detail Panel container (max-height or fixed height)
- [x] 2.3 Ensure the Detail Panel has internal scrolling for its content

## 3. Visual Polish

- [x] 3.1 Update the transition animation for the Detail Panel to match the new layout structure
- [x] 3.2 Add a clear border or divider between the Diagram and the Detail Panel
- [x] 3.3 Verify that node selection highlights remain visible and correctly positioned when the panel opens

## 4. Verification

- [x] 4.1 Select a table and verify the diagram shrinks and the panel appears at the bottom right
- [x] 4.2 Deselect and verify the diagram expands to full height
- [x] 4.3 Verify that the Detail Panel content is scrollable when data exceeds the fixed height
