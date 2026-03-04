## Why

Currently, the visualizer has inconsistent saving behavior: layout changes are saved automatically, while metadata changes require a manual "Save" button click. This inconsistency confuses users and risks data loss. Implementing a toggleable "Auto-save" feature provides a modern editing experience while giving users the flexibility to experiment without overwriting files.

## What Changes

- **Unified Schema Persistence**: 
  - Merge `saveLayout` and `saveYAML` into a single, reliable `saveFullSchema` action.
  - All changes (layout, tables, domains, relations) will use this unified persistence layer.
- **Auto-save Toggle**: 
  - Add an "Auto-save" switch to the sidebar.
  - When ON, any change in the visualizer immediately triggers a save to the local YAML file.
- **Sync Visualizer -> Editor**:
  - Ensure the internal YAML editor reflects all visual changes in real-time, regardless of the auto-save setting.
- **Technical Optimization**:
  - Implement a 500ms debounce for text-heavy updates (like descriptions) to prevent excessive disk I/O.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Update action triggers to support conditional auto-saving.
- `sandbox-editor`: Improve real-time synchronization between the visual state and the text editor.

## Impact

- `visualizer/src/store/useStore.ts`: Major refactor of saving actions and state.
- `visualizer/src/components/Sidebar/EditorTab.tsx`: UI update for the auto-save toggle.
- `visualizer/src/App.tsx`: Refinement of event handlers to trigger unified saving.
