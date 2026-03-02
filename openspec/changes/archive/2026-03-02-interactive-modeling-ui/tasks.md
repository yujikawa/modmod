## 1. Store Updates and Sync Logic

- [x] 1.1 Update `useStore.ts` to include a `syncToYamlInput` action that updates the Sidebar Editor's text state.
- [x] 1.2 Add actions for adding new Table and Domain elements to the schema.
- [x] 1.3 Ensure `updateNodePosition` and `updateNodeDimensions` call `syncToYamlInput`.

## 2. Interactive Node Implementation

- [x] 2.1 Enhance `DomainNode.tsx` with `NodeResizer` and fix pointer-events for better interactivity.
- [x] 2.2 Add `NodeResizer` to `TableNode.tsx` and ensure it supports manual width and height.
- [x] 2.3 Refactor Table and Domain generation in `App.tsx` to respect `width` and `height` from the layout.

## 3. Canvas Toolbar and Visual Scaffolding

- [x] 3.1 Create a `CanvasToolbar` component with "Add Domain" and "Add Table" buttons.
- [x] 3.2 Integrate the `CanvasToolbar` into the `Flow` component in `App.tsx`.
- [x] 3.3 Implement default templates for new Table and Domain additions.

## 4. UI Refinement and Terminology

- [x] 4.1 Rename all "Group" labels and internal state to "Domain" in the Sidebar and UI.
- [x] 4.2 Ensure the "Save & Update" button correctly persists the newly added visual and structural data.

## 5. Verification and Finalization

- [x] 5.1 Verify resizing for both Table and Domain nodes on the canvas.
- [x] 5.2 Verify that adding a new element via the toolbar updates the Sidebar Editor YAML.
- [x] 5.3 Confirm that "Save & Update" persists changes to the local YAML file correctly.
- [x] 5.4 Ensure no regressions in multi-file mode.
