## Context

CodeMirror 6 is a modular editor. To enable "Unified Undo", we must treat visual edits as text transactions.

## Goals / Non-Goals

**Goals:**
- Make "Undo" work for dragging, renaming, and metadata changes.
- Provide a rich YAML editing experience (highlighting, line numbers).
- Maintain performance during large model updates.

**Non-Goals:**
- Supporting partial YAML updates (we currently sync the whole document for simplicity).

## Decisions

### 1. The CodeMirror Transaction Loop
We will use `@uiw/react-codemirror`. To prevent infinite loops (Visual -> YAML -> Visual):
- **User Typing**: Updates the store's `yamlInput` and immediately triggers `parseAndSetSchema`.
- **Visual Edit**: Store updates `yamlInput`. The `EditorTab` component detects this change. 
- **Important**: Visual edits must be dispatched to CodeMirror with `{ addToHistory: true }` but flagged so the editor doesn't try to parse it *back* into the store immediately if it came *from* the store.

### 2. Auto-Parsing
Instead of a "Save & Update" button being mandatory for the canvas to change, we will implement a "Live Preview" mode:
- Any change in CodeMirror (typing, undo, redo) automatically re-parses the schema after a short debounce (300ms).
- This makes the Undo/Redo feel instantaneous across the whole UI.

### 3. Visual Polish
- Theme: `oneDark` (to match Modscape's dark aesthetic).
- Extension: `langs.yaml()`.

## Risks / Trade-offs

- **[Risk] Performance on Large YAML**: Re-parsing the whole schema on every keystroke might be heavy. 
  - *Mitigation*: Debounce the parsing logic.
- **[Trade-off] Cursor Jump**: When syncing a visual edit back to the editor, the cursor might jump to the start.
  - *Mitigation*: React-CodeMirror usually handles value updates gracefully, but we might need to preserve the view state if jumps occur.
