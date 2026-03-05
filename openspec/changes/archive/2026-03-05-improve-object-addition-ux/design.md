## Context

React Flow's `useReactFlow` hook provides `screenToFlowPosition`, which is perfect for converting the browser's center point into canvas coordinates.

## Goals / Non-Goals

**Goals:**
- New nodes always appear where the user is looking.
- New nodes are immediately interactive (selected).
- Provide a satisfying "ping" animation on creation.

**Non-Goals:**
- Automatically finding an empty spot (collision avoidance). We will stick to the visual center.

## Decisions

### 1. Viewport Calculation
In `CanvasToolbar.tsx`, we will use the `useReactFlow` hook to get the canvas center:
```javascript
const { screenToFlowPosition } = useReactFlow();
const center = screenToFlowPosition({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
});
```

### 2. Auto-Selection Logic
Update `addTable` and `addDomain` in `useStore.ts` to set the `selectedTableId` to the newly generated ID.

### 3. Creation Animation
Add an `.animate-new-node` class in `index.css`:
```css
@keyframes node-pop {
  0% { transform: scale(0.5); opacity: 0; box-shadow: 0 0 0 0px #3b82f6; }
  50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 40px 10px #3b82f6; }
  100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0px transparent; }
}
```
Apply this class to the node wrapper via a `isNew` data flag that persists for 1-2 seconds.

## Risks / Trade-offs

- **[Trade-off] Multi-node Spawn**: If a user clicks "Add" multiple times without moving, nodes will overlap perfectly at the center. 
  - *Mitigation*: This is acceptable as the user can immediately drag them apart.
