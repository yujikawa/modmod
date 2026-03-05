## 1. Setup & Dependencies

- [x] 1.1 Install `dagre` and `@types/dagre` in the `visualizer` directory

## 2. Layout Engine Implementation

- [x] 2.1 Implement `calculateAutoLayout` action in `useStore.ts`
- [x] 2.2 Implement Pass 1: Inner domain table layout and domain resizing
- [x] 2.3 Implement Pass 2: Outer domain and top-level table layout
- [x] 2.4 Implement coordinate batch update logic to trigger YAML persistence

## 3. UI Integration

- [x] 3.1 Add "Magic Layout" button to `CanvasToolbar.tsx` with a satisfying animation trigger
- [x] 3.2 Ensure the button is disabled if `isEditingDisabled` (ER + Lineage active)

## 4. Verification

- [x] 4.1 Verify tables are correctly contained within their resized domains after layout
- [x] 4.2 Verify relationships lead to a hierarchical top-to-bottom flow
- [x] 4.3 Verify layout persists to YAML file
