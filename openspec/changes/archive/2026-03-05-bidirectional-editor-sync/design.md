## Context

Modern YAML-based visual tools must act as thin layers over the filesystem. Users expect visual tweaks and text edits to be treated with the same persistence logic.

## Goals / Non-Goals

**Goals:**
- Eliminate the distinction between "layout saving" and "data saving".
- Introduce a user-controlled auto-save state.
- Ensure the YAML editor is always up-to-date with the visual canvas.

**Non-Goals:**
- Implementing multi-user conflict resolution (Modscape is local-first/single-user).

## Decisions

### 1. Unified Save Action (`saveSchema`)
We will replace `saveLayout()` and `saveYAML()` with a single `saveSchema()` action in `useStore.ts`.
- This action converts the entire `schema` object to YAML and sends it to the `/api/save` endpoint.
- All visual interactions (drags, edits, deletions) will call this function.

### 2. Auto-save State Management
- `isAutoSaveEnabled`: A boolean in the store (defaults to `true` for a modern feel).
- `saveSchema` will check this flag before performing the HTTP POST.
- If `false`, changes stay in memory and in the text editor, but don't touch the disk.

### 3. Visual Feedback
Add a `savingStatus: 'idle' | 'saving' | 'saved' | 'error'` state.
- Show a small "Saved" indicator in the UI to give confidence when auto-save is working.

### 4. Debouncing
For rapid changes (typing table names, dragging nodes), wrap the API call in a debounce function.
- Dragging: Save only on `onDragStop`.
- Text: Save 500ms after the last keystroke.

## Risks / Trade-offs

- **[Risk] Large Model Latency** → Mitigation: Use the 10MB limit (already implemented) and ensure the UI doesn't block while saving.
- **[Trade-off] Persistence Inconsistency** → By moving to a single flag, we lose the ability to auto-save *only* layout. This is actually a gain in predictability.
