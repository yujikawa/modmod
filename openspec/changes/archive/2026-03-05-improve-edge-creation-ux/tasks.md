## 1. Global State & CSS

- [x] 1.1 Add `connectionStartHandle` to `visualizer/src/store/useStore.ts`
- [x] 1.2 Define `.handle-pulse` and `.handle-dim` classes in `visualizer/src/index.css`
- [x] 1.3 Add `connectionRadius={30}` to `ReactFlow` component in `App.tsx`

## 2. Event Handling

- [x] 2.1 Implement `onConnectStart` in `App.tsx` to set the starting handle in the store
- [x] 2.2 Implement `onConnectEnd` in `App.tsx` to clear the starting handle
- [x] 2.3 Ensure `onConnect` logic remains compatible with the new visual cues

## 3. Component Rendering

- [x] 3.1 Update `TableNode.tsx` to apply dynamic classes to `Handle` components
- [x] 3.2 Distinguish between ER handles and Lineage handles for type-specific highlighting
- [x] 3.3 Apply scale transitions to handles for a smoother feel

## 4. Verification

- [x] 4.1 Verify that handles pulse when starting a connection
- [x] 4.2 Verify that handles on the source node do NOT pulse
- [x] 4.3 Verify that connection snapping feels more "magnetic"
