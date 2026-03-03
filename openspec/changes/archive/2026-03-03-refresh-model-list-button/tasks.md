## 1. CLI Server Changes

- [x] 1.1 Update `src/dev.js` to re-scan model paths on every `/api/files` request
- [x] 1.2 Ensure `chokidar` watches the directories provided in the command line paths (not just individual files)

## 2. Visualizer UI Changes

- [x] 2.1 Import `RefreshCcw` icon from `lucide-react` in `visualizer/src/components/Sidebar/FileSelector.tsx`
- [x] 2.2 Add a refresh button to the `FileSelector` component
- [x] 2.3 Connect the refresh button to the `fetchAvailableFiles` store action

## 3. Verification

- [x] 3.1 Verify that adding a new YAML file to a watched directory and clicking refresh makes it appear in the dropdown
- [x] 3.2 Verify that removing a YAML file and clicking refresh makes it disappear from the dropdown
- [x] 3.3 Verify that the page does not reload and the current canvas state is preserved
