## 1. Safety & Indicators

- [x] 1.1 Implement the floating "Read Only" badge in `App.tsx` (visible when both modes active)
- [x] 1.2 Update deletion logic in `CanvasToolbar.tsx` to use `window.confirm()`

## 2. Help & Documentation

- [x] 2.1 Add `CircleHelp` icon to the vertical toolbar in `CanvasToolbar.tsx`
- [x] 2.2 Implement a popover/overlay showing keyboard shortcuts
- [x] 2.3 Style the shortcut guide for high readability in dark mode

## 3. Interaction Refinement

- [x] 3.1 Ensure the "Read Only" state disables all creation actions in the toolbar (visual feedback)
- [x] 3.2 Add tooltips to View toggles to explain the read-only side effect

## 4. Verification

- [x] 4.1 Verify that the badge appears only when ER and Lineage are both active
- [x] 4.2 Verify that a confirmation dialog appears before deleting a table
- [x] 4.3 Verify that shortcuts are correctly listed in the help overlay
