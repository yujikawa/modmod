## 1. Store Updates (Auto-Selection)

- [x] 1.1 Update `addTable` in `visualizer/src/store/useStore.ts` to auto-select the new table ID
- [x] 1.2 Update `addDomain` in `visualizer/src/store/useStore.ts` to auto-select the new domain ID

## 2. CSS Animation

- [x] 2.1 Add `@keyframes node-pop` and `.animate-creation` class to `visualizer/src/index.css`

## 3. Trigger Logic (CanvasToolbar)

- [x] 3.1 Refactor `CanvasToolbar.tsx` to use `useReactFlow` and `screenToFlowPosition`
- [x] 3.2 Calculate center coordinates and pass them to `addTable` and `addDomain`

## 4. Component Rendering (Visual Feedback)

- [x] 4.1 Update `TableNode.tsx` to apply the creation animation if it's "new" (using a short-lived state or selected status)
- [x] 4.2 Update `DomainNode.tsx` to apply the creation animation

## 5. Verification

- [x] 5.1 Verify that new tables appear at the visual center of the screen
- [x] 5.2 Verify that new domains appear at the visual center
- [x] 5.3 Verify that new objects are automatically selected (Detail Panel opens)
