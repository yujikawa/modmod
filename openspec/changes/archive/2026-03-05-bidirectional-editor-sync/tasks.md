## 1. Store Refactor (Core Persistence)

- [x] 1.1 Add `isAutoSaveEnabled` and `savingStatus` to `visualizer/src/store/useStore.ts`
- [x] 1.2 Implement unified `saveSchema` action that replaces `saveLayout` and `saveYAML`
- [x] 1.3 Update all state-changing actions (e.g., `updateTable`, `addTable`, `removeEdge`) to call `saveSchema`
- [x] 1.4 Implement 500ms debounce for text-based state updates

## 2. UI Updates (Controls & Feedback)

- [x] 2.1 Add Auto-save toggle switch to `visualizer/src/components/Sidebar/EditorTab.tsx`
- [x] 2.2 Add a "Saving..." / "Saved" status indicator to the UI (e.g., in the toolbar or sidebar)
- [x] 2.3 Refine "Save YAML" button to reflect current auto-save state (disabled if ON)

## 3. Visualizer Sync

- [x] 3.1 Update `onNodeDragStop` in `App.tsx` to use the new unified `saveSchema` action
- [x] 3.2 Ensure the YAML editor content is updated immediately after any visual change

## 4. Verification

- [x] 4.1 Verify that with Auto-save ON, moving a node updates the file immediately
- [x] 4.2 Verify that with Auto-save ON, changing a table description updates the file (after debounce)
- [x] 4.3 Verify that with Auto-save OFF, changes stay in memory but do NOT touch the disk until manual save
