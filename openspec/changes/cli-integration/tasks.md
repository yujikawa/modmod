## 1. CLI Infrastructure

- [x] 1.1 Set up new CLI package structure in the root directory
- [x] 1.2 Implement command routing for `dev` and `build` subcommands
- [x] 1.3 Add logic to resolve paths for the visualizer source code

## 2. Development Server (modmod dev)

- [x] 2.1 Implement Vite dev server wrapper within the CLI
- [x] 2.2 Add YAML file watching and reload triggers
- [x] 2.3 Implement the `POST /api/layout` endpoint for persisting node coordinates
- [x] 2.4 Update the CLI to open the browser automatically upon startup

## 3. Visualizer Integration

- [x] 3.1 Update `App.tsx` to conditionally load YAML from a dev server API or an embedded source
- [x] 3.2 Update `TableNode` and store to handle coordinates from the `layout` YAML section
- [x] 3.3 Implement the debounced auto-save listener for node position changes
- [x] 3.4 Add a "CLI Mode" indicator to the UI for clarity

## 4. Static Site Builder (modmod build)

- [x] 4.1 Implement the `build` command to trigger the production Vite build
- [x] 4.2 Create a Vite plugin/mechanism to inject the target YAML into the build artifacts
- [x] 4.3 Add post-build logic to ensure the `dist/` folder is correctly packaged
- [x] 4.4 Verify that the resulting static site works correctly without a backend
