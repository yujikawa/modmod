## Why

Currently, the `modmod-visualizer` is a standalone web application where users manually paste YAML. To provide a professional data engineering experience, we need to transition this into a CLI-driven tool that supports local development workflows (interactive editing with auto-save) and easy deployment of documentation (static site generation).

## What Changes

- **New CLI Interface**: Introduce `modmod dev` and `modmod build` commands.
- **Interactive Development Mode**: `modmod dev` will watch a local YAML file, serve the visualizer, and automatically save layout changes back to the YAML.
- **Static Site Generation**: `modmod build` will package the visualizer with a specific YAML model into a production-ready static site for hosting (e.g., GitHub Pages).
- **YAML Schema Extension**: Support for a `layout` section in the YAML to persist node coordinates.

## Capabilities

### New Capabilities
- `cli-integration`: The core CLI entry point and command routing (`dev`, `build`).
- `dev-server`: A local server that handles YAML serving, file watching, and a "save layout" API.
- `layout-persistence`: Logic within the visualizer to detect position changes and send them to the dev server.
- `static-bundler`: The mechanism to inject a specific YAML into the visualizer's build artifacts.

### Modified Capabilities
- `visualizer-core`: Update to support loading data from an internal/external source instead of just the sidebar, and handling the new `layout` schema.

## Impact

- **New CLI Tooling**: Implementation of the `modmod` command.
- **Visualizer Refactoring**: Minor changes to `App.tsx` and the Zustand store to support CLI-driven data loading.
- **Build Pipeline**: Integration of the Vite build process into the `modmod build` command.
