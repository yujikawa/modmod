## 1. Vertical Toolbar Implementation

- [x] 1.1 Refactor `visualizer/src/components/CanvasToolbar.tsx` to use a vertical layout
- [x] 1.2 Position the toolbar on the top-left of the canvas to avoid collisions
- [x] 1.3 Split View toggles and Create buttons into separate vertical groups with headers and a separator

## 2. Selection UI Separation

- [x] 2.1 Decouple the selection info bar from the main toolbar component logic
- [x] 2.2 Ensure selection info appears in the top-right independently
- [x] 2.3 Add explicit clear selection (X) button

## 3. Detail Panel Resizing

- [x] 3.1 Implement vertical resize logic using global mouse listeners
- [x] 3.2 Add a visible/active resize handle area at the top of the panel
- [x] 3.3 Ensure the new height state is shared across all panel views (Table, Domain, Edge)

## 4. Visual Polish

- [x] 4.1 Apply glassmorphism (backdrop blur) and subtle shadows to all floating UI elements
- [x] 4.2 Add section headers (Icons + Text) to the vertical toolbar

## 5. Verification

- [x] 5.1 Verify that the vertical toolbar remains stable and collision-free
- [x] 5.2 Verify that the Detail Panel can be resized smoothly
