## 1. Core Logic

- [x] 1.1 Implement arrow-key listener in `App.tsx` within the existing `useEffect` for global keys
- [x] 1.2 Implement the `isTyping` guard to prevent canvas movement while editing
- [x] 1.3 Add selection guard: only pan canvas if `selectedTableId` and `selectedEdgeId` are null
- [x] 1.4 Implement viewport updates using `setViewport` and `getViewport` with smooth transitions

## 2. UI Documentation

- [x] 2.1 Add "Pan Canvas" row to the shortcuts help guide in `CanvasToolbar.tsx`

## 3. Verification

- [x] 3.1 Verify arrow keys move the screen when nothing is selected
- [x] 3.2 Verify arrow keys do NOT move the screen while typing in the Detail Panel
- [x] 3.3 Verify arrow keys do NOT move the screen while typing in the YAML Editor
- [x] 3.4 Verify arrow keys move selected nodes (React Flow default) if a table is selected
