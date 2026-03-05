## Context

v1.0.0 polish focuses on "Communicative UI" — ensuring the tool speaks to the user about its state and safety.

## Goals / Non-Goals

**Goals:**
- Explain "Read Only" state clearly.
- Reveal hidden shortcuts.
- Prevent accidental deletions.

**Non-Goals:**
- Implementing a full-blown help documentation site (keep it in-app).

## Decisions

### 1. Read-Only Badge
- **Logic**: Visible IF `showER && showLineage`.
- **UI**: A thin, high-contrast bar at the top-center of the canvas. 
- **Text**: "Viewing Both Modes: Editing Disabled"
- **Visuals**: `bg-amber-500/90 text-slate-900 font-bold`.

### 2. Shortcut Cheat Sheet
- **Entry Point**: A `?` (CircleHelp) icon at the bottom of the vertical Toolbox.
- **UI**: A small overlay that appears on click/hover.
- **Content**:
  - `Ctrl + Z`: Undo
  - `Ctrl + Y`: Redo
  - `Del / Backspace`: Delete
  - `Esc`: Clear Selection
  - `Shift + Drag`: Multi-select

### 3. Deletion Confirmation
- **Logic**: Use a browser-native `window.confirm()` for now as it's the most robust way to block a potentially destructive CLI-sync action.
- **Refinement**: Include the name of the object in the prompt (e.g., "Delete table 'orders'?").

## Risks / Trade-offs

- **[Trade-off] confirm() UX**: Native alerts are slightly ugly but provide maximum security for a v1.0.0 release. We can upgrade to a custom Modal later.
- **[Risk] UI Overlay Overlap**: Ensure the shortcut guide doesn't cover the Detail Panel.
