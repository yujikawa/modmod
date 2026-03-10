## Why

A few technical and usability bugs have been identified that hinder the user experience:
1.  **YAML Output**: The `y` coordinate key is quoted (`'y'`) due to YAML 1.1 compatibility, which is unnecessary and inconsistent.
2.  **Layout Stability**: Moving a node within a domain can trigger recalculations for other nodes in the same domain if they don't have explicit layout entries, causing them to "jump" unexpectedly.
3.  **Undo Consistency**: Switching between model files preserves the editor's undo history, allowing users to accidentally overwrite a new file with content from a previously selected one.
4.  **Auto-save behavior**: Auto-save is enabled by default, which can be risky for users who want to experiment without immediate persistence.
5.  **Data Refresh**: There is no easy way to refresh the current model from the API without a full browser reload.

## What Changes

- **YAML Formatting**: Update `js-yaml` dump settings to avoid quoting the `y` key.
- **Stable Layouts**: Ensure that when a node is moved, coordinates are stabilized or explicitly captured to prevent side effects on other nodes.
- **History Isolation**: Clear or bypass the editor undo history when switching between different model files.
- **Auto-save Default**: Change `isAutoSaveEnabled` default to `false`.
- **UI Refresh Button**: Add a "Refresh from API" button to the UI.
- **Path Search Refinement**: Improve BFS logic to better handle cases where multiple types of edges exist between nodes.

## Capabilities

### New Capabilities
- (None)

### Modified Capabilities
- `sandbox-editor`: Improve undo/redo reliability and formatting.
- `layout-persistence`: Improve stability of automatic vs. explicit layouts.
- `visualizer-core`: Add data refresh capability.

## Impact

- **UI Components**: `EditorTab.tsx`, `App.tsx`, `Sidebar.tsx`, `PathFinderTab.tsx`.
- **Store**: `useStore.ts` (default state and refresh actions).
- **Core Logic**: `parser.ts` or wherever `js-yaml` is configured.
