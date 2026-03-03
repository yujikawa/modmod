## Why

Adding new YAML files to the model directories currently requires restarting the `modscape dev` command to reflect them in the UI. Users need a way to refresh the list of available models manually without a full restart or page reload.

## What Changes

- **Dynamic File Scanning**: The CLI server will re-scan the filesystem whenever the file list is requested, ensuring new files are detected.
- **Refresh UI Element**: A new "Refresh" button will be added to the model selector in the sidebar to manually trigger a sync with the filesystem.
- **Selective UI Update**: Only the list of available models will be updated, preserving the current canvas state and user interactions.

## Capabilities

### New Capabilities
<!-- No new capabilities -->

### Modified Capabilities
- `sidebar-ui`: Add a refresh interaction to the model selection section.

## Impact

- `src/dev.js`: Update the `/api/files` endpoint and internal scanning logic.
- `visualizer/src/components/Sidebar/FileSelector.tsx`: Add the refresh button and trigger the store's fetch action.
- `visualizer/src/store/useStore.ts`: Verify `fetchAvailableFiles` updates the list correctly.
