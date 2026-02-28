## 1. CLI and Server Backbone

- [x] 1.1 Update `src/index.js` to accept a directory or multiple file paths for `modmod dev`.
- [x] 1.2 Implement a file scanner in `src/dev.js` to find all `.yaml`/`.yml` files.
- [x] 1.3 Create an internal mapping of `slug -> absolutePath` in `src/dev.js`.
- [x] 1.4 Add a new GET endpoint `/api/files` that returns the list of slugs and names.
- [x] 1.5 Update the `/api/model`, `/api/layout`, and `/api/save-yaml` endpoints to require and use a `model` (slug) parameter.

## 2. Store and Routing

- [x] 2.1 Update `visualizer/src/store/useStore.ts` to include `availableFiles` and `currentModelSlug` state.
- [x] 2.2 Add an action `fetchAvailableFiles` to populate the `availableFiles` state from `/api/files`.
- [x] 2.3 Add an action `setCurrentModel` to fetch and update the schema for a given slug.
- [x] 2.4 Implement logic in `visualizer/src/App.tsx` to read the `model` parameter from the URL on load.
- [x] 2.5 Update the browser URL when `setCurrentModel` is called using `window.history.pushState`.

## 3. UI Components

- [x] 3.1 Create a new `FileSelector` component in `visualizer/src/components/Sidebar/`.
- [x] 3.2 Integrate the `FileSelector` at the top of the `Sidebar` component.
- [x] 3.3 Update `EditorTab` to include the current model slug in the `save-yaml` request.
- [x] 3.4 Update the `Flow` component in `App.tsx` to include the model slug in layout update requests.

## 4. Polishing and Testing

- [x] 4.1 Ensure the file watcher (`chokidar`) in `src/dev.js` is correctly watching all identified files.
- [x] 4.2 Test with a single file (existing behavior).
- [x] 4.3 Test with a directory of multiple YAML files.
- [x] 4.4 Verify that path traversal (e.g., `?model=../../etc/passwd`) is correctly blocked.
