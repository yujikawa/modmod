## Why

Currently, the `modmod dev` command only supports a single YAML file. As projects grow, data models are often split across multiple files. Users need a way to browse and switch between multiple models within a single session without restarting the CLI. This change introduces multi-file support with a secure URL mapping to prevent path traversal and information leakage.

## What Changes

- **CLI**: `modmod dev` now accepts a directory path or multiple file paths as arguments.
- **Server**: 
  - Automatically scans for `.yaml` and `.yml` files in the specified directory.
  - Generates a secure "safe name" (slug) for each file to be used in URLs.
  - New `/api/files` endpoint to list available models.
  - Updated `/api/model`, `/api/layout`, and `/api/save-yaml` to accept a `model` parameter (safe name).
- **UI**: 
  - Added a `FileSelector` dropdown in the sidebar.
  - Supports switching between models via URL parameters (e.g., `?model=user`).
  - Persists the selected model in the URL for shareability and refresh resilience.

## Capabilities

### New Capabilities
- `multi-file-management`: Handles scanning, mapping, and serving multiple YAML files securely.
- `model-routing`: Manages URL-based model selection and state persistence in the visualizer.

### Modified Capabilities
- `dev-server`: Updated to handle dynamic file paths and secure API routing based on model identifiers.
- `sidebar-ui`: Updated to include file selection and model-specific navigation.

## Impact

- `src/dev.js`: Major update to the Express server logic for file scanning and API parameter handling.
- `src/index.js`: Update to CLI argument parsing to support directories.
- `visualizer/src/store/useStore.ts`: New state for available files and current model selection.
- `visualizer/src/App.tsx`: Logic to sync URL parameters with the store.
- `visualizer/src/components/Sidebar/Sidebar.tsx`: Integration of the new `FileSelector` component.
