## Why

The original UI layout had several interaction friction points:
1. The horizontal toolbar in the top-right shifted when elements were selected, causing a jittery experience.
2. The fixed-height Detail Panel often occupied too much or too little space depending on the task.
3. As the UI expanded, different panels (Toolbar and Detail Panel) started colliding.

Moving to a vertical, top-left "Toolbox" and implementing a resizable "Workspace" area at the bottom provides a stable, professional, and flexible modeling environment.

## What Changes

- **Stable Vertical Toolbox**: 
  - Moved all core actions (View toggles and Create buttons) to a permanent vertical panel on the top-left.
  - Organized tools into logical sections (View, Add) with icons and headers.
- **Resizable Detail Panel**:
  - Implemented vertical drag-to-resize for the Detail Panel.
  - Users can now balance canvas visibility vs. data editing space.
- **Improved Contextual UI**:
  - Separated the "Selection Info" bar from the main toolbar, placing it in the top-right.
  - Added a "Clear Selection" (X) button for better mouse-driven navigation.
- **Visual Aesthetic**:
  - Applied glassmorphism and subtle animations across all floating UI components.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Update the positioning, layering, and interaction logic of canvas-level components.
- `sidebar-ui`: Integrate stable vertical tools with the YAML editor sidebar.

## Impact

- `visualizer/src/components/CanvasToolbar.tsx`: Refactored into a vertical, sectioned panel.
- `visualizer/src/components/DetailPanel.tsx`: Added height state and drag-to-resize logic.
- `visualizer/src/App.tsx`: Ensured overall layout stability.
