## Context

Currently, the `visualizer` is a standalone React project. To make it a true tool, we need a CLI to drive it. The CLI will be responsible for serving the visualizer during development and bundling it for production.

## Goals / Non-Goals

**Goals:**
- Provide a `modmod` CLI with `dev` and `build` commands.
- Support interactive layout editing that saves coordinates back to the local YAML file.
- Generate a standalone static site from a YAML file.
- Keep the visualizer code flexible enough to work both in CLI and standalone modes.

**Non-Goals:**
- Supporting multiple YAML files in a single `modmod dev` session (MVP focus is one file).
- Advanced auto-layout algorithms (user-driven layout is preferred).
- Full database integration (staying YAML-centric).

## Decisions

- **CLI Framework**: Node.js with `commander` or a similar lightweight library.
  - *Rationale*: Since the visualizer is already in the Node/Vite ecosystem, using Node for the CLI minimizes context switching and simplifies dependency management for the build process.
- **Dev Server**: Use `vite` as a library within the CLI.
  - *Rationale*: Vite provides excellent HMR and dev server capabilities. We can wrap it to serve our visualizer and inject the user's YAML.
- **Layout Persistence**: A small Express/Connect middleware within the dev server to handle `POST /api/layout` requests.
  - *Rationale*: Simple, low-overhead way to bridge the browser-to-filesystem gap.
- **YAML Format for Layout**: Add a top-level `metadata.layout` or `layout` key.
  - *Rationale*: Keeps everything in one file for portability.
- **Static Bundling**: Use `vite build` with a custom plugin to inject the YAML as a global constant or a virtual module.
  - *Rationale*: Standard Vite pattern for static assets, ensuring the production build is a single `dist/` folder.

## Risks / Trade-offs

- **YAML Formatting**: [Risk] Automatically writing to the YAML might mess up user comments or formatting. → [Mitigation] Use `js-yaml` with safe settings or consider a sidecar `.layout.json` if formatting becomes an issue. (Starting with inline YAML for simplicity).
- **Concurrent Edits**: [Risk] User editing the YAML manually while the visualizer saves a layout change. → [Mitigation] Use a simple "last write wins" or basic file watching to notify the user of external changes.
- **Path Resolution**: [Risk] CLI might be run from various directories. → [Mitigation] Use absolute path resolution for the visualizer source relative to the CLI's installation directory.
