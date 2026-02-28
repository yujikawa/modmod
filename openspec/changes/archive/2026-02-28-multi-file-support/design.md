## Context

The current `modmod` CLI assumes a single source of truth for its data model, passed as a command-line argument to `modmod dev`. While effective for simple projects, it restricts scalability. This design introduces a mechanism to scan, map, and navigate multiple models securely.

## Goals / Non-Goals

**Goals:**
- Support directories and multiple file paths in the `modmod dev` command.
- Securely map file paths to URL-safe slugs to prevent path traversal.
- Enable seamless switching between models in the visualizer UI.
- Maintain selection state across page refreshes.
- Support file-watching for all identified models.

**Non-Goals:**
- Merging multiple YAML files into a single visualization.
- Supporting model relationships across different files.
- Real-time collaborative editing.

## Decisions

### 1. Secure Slug-based Mapping
- **Decision:** Use the filename without the extension as a slug (e.g., `user.yaml` → `user`).
- **Rationale:** It's intuitive and provides a clean URL structure.
- **Security:** The server will maintain an internal map of `slug -> absolutePath`. All API requests will use the slug as a key, and the server will validate it against the map. This prevents arbitrary file access via path traversal.
- **Alternatives:** Using the full path in the URL (rejected for security) or random UUIDs (rejected for poor UX).

### 2. URL State Management
- **Decision:** Use the `?model=slug` query parameter to control the active model.
- **Rationale:** Standard way to manage application state that should be bookmarkable and refreshable.
- **Implementation:** React state in `useStore` will be initialized from the URL and updated whenever the selection changes.

### 3. CLI Argument Handling
- **Decision:** Use `fs.statSync` to check if the argument is a file or a directory.
- **Rationale:** Simple and reliable. If it's a directory, recursively scan (limited depth) or just top-level (to be decided in implementation, starting with top-level).

## Risks / Trade-offs

- **[Risk] Slug collisions:** Two files with the same name in different directories (e.g., `api/user.yaml` and `db/user.yaml`) will collide if only the filename is used.
  - **Mitigation:** If a collision is detected during scanning, append a parent directory prefix or a numeric suffix to the slug.
- **[Risk] Large number of files:** Scanning a very large directory could slow down startup.
  - **Mitigation:** Limit scanning to `.yaml` and `.yml` files and consider a default max depth.
- **[Risk] Watcher performance:** Watching hundreds of files might be resource-intensive.
  - **Mitigation:** Use `chokidar` which handles large numbers of files efficiently, and provide a warning if the file count exceeds a threshold.
