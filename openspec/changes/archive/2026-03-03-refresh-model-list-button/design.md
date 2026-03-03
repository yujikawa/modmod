## Context

The `modscape dev` command initializes a static list of models at startup. The visualizer UI fetches this list once and displays it in a dropdown. There is currently no way to update this list without restarting the CLI or reloading the entire browser page (if the CLI was restarted).

## Goals / Non-Goals

**Goals:**
- Enable manual refreshing of the model list from the UI.
- Ensure the server always returns the current state of the filesystem when the list is requested.
- Maintain a stable UI state (no full page reload).

**Non-Goals:**
- Automatic real-time syncing via WebSockets or SSE (out of scope for this simple requirement).
- Dynamic watching of *new* directories (only paths passed to the command are scanned).

## Decisions

### 1. Dynamic API Response
Modify `src/dev.js` to re-execute `scanFiles` within the `/api/files` route handler.
**Rationale:** This ensures that the response always reflects the current filesystem state, including newly added or removed files.

### 2. Manual Refresh Button in Sidebar
Add a button with the `RefreshCcw` icon from `lucide-react` next to the "Current Model" label in `FileSelector.tsx`.
**Rationale:** A explicit button is clear and meets the user's requirement for a simple way to refresh.

### 3. Store Action Reuse
The button will trigger the existing `fetchAvailableFiles` action in `useStore.ts`.
**Rationale:** The existing action already handles fetching and updating the state correctly. No new store logic is required.

## Risks / Trade-offs

- **[Risk] Performance on large directories** → Re-scanning directories on every API call might be slow if thousands of files exist. However, for typical data modeling projects, the number of YAML files is small (<100), making this impact negligible.
- **[Risk] UI Flicker** → Updating the `availableFiles` state might cause a brief re-render of the dropdown. This is acceptable for a manual refresh action.
