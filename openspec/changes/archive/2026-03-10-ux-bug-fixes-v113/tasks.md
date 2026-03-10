## 1. Store Updates

- [x] 1.1 Set `isAutoSaveEnabled` default to `false` in `useStore.ts`.
- [x] 1.2 Implement `refreshCurrentModel` action in `useStore.ts`.
- [x] 1.3 Update `syncToYamlInput` and `saveSchema` (Update: Skipped quote fix as per user feedback).

## 2. Editor Improvements

- [x] 2.1 Add a `useEffect` in `EditorTab.tsx` to clear/reset CodeMirror history when `currentModelSlug` changes.
- [x] 2.2 Ensure file switching doesn't add to undo history.

## 3. Layout & UI

- [x] 3.1 Refine `Sync Nodes` logic in `App.tsx` or coordinate saving in `useStore.ts` to prevent domain node jumping.
- [x] 3.1.1 HOTFIX: Fix infinite loop in `App.tsx` by removing `nodes` from `useEffect` dependencies and using `getNodes()`.
- [x] 3.2 Add a "Refresh" icon button next to the model name/logo in the Sidebar header.
- [x] 3.2.1 Unify Refresh: Combine model list refresh and content refresh into a single global action in the Sidebar header.
- [x] 3.3 Improve `findShortestPath` BFS ordering in `graph.ts` if needed (verified: BFS is sufficient).

## 4. Verification

- [x] 4.1 Verify Ctrl+Z doesn't restore previous file content after switching.
- [x] 4.2 Verify YAML `y` key formatting (Verified: Quoting is acceptable).
- [x] 4.3 Verify domain nodes stay stable when moving a sibling.
- [x] 4.4 Verify "Refresh" button works correctly.
- [x] 4.5 Run `npm run build` in the `visualizer` directory.
