## Why

Currently, changes made to YAML model files in external editors are not automatically reflected in the Modscape Visualizer. Users must manually click the refresh button or reload the browser, which disrupts the modeling feedback loop.
This change provides an instant update experience upon file save, addition, or deletion, enabling a seamless "YAML-as-Code" modeling workflow. Additionally, it simplifies the UI by removing redundant manual refresh buttons.

## What Changes

- **WebSocket Communication**: Adds a bidirectional communication path between the server (CLI) and client (browser) for real-time notifications.
- **Comprehensive File/Directory Watching**:
    - File mode: Detects changes to the specific file.
    - Directory mode: Detects changes, additions, and deletions of YAML files within the directory.
- **Removal of Refresh Buttons**: Removes manual refresh buttons from the Sidebar header and other panels.
- **Automatic Browser Re-fetching**:
    - On model change: Re-fetches current model data.
    - On file list change (add/unlink): Re-fetches the list of available files.
- **Server Dependency**: Adds the `ws` library to `dependencies`.

## Capabilities

### New Capabilities
- `live-sync`: Real-time synchronization that reflects filesystem changes (edit/add/delete) in the visualizer instantly.

### Modified Capabilities
- `dev-server`: Enhanced to support WebSocket event broadcasting and directory-level file watching.
- `sidebar-ui`: Simplified to remove manual refresh buttons, showing only the "Live" sync indicator.

## Impact

- **Server**: Adds WebSocket server logic to `src/dev.js` and extends `chokidar` events (add/change/unlink).
- **Client**: Implements WebSocket client in `visualizer/src/App.tsx` and removes refresh buttons from the UI.
- **Dependencies**: Adds `ws` to `package.json`.
