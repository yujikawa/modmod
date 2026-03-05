## Context

Modern UI patterns should not fight the user during data entry. Similarly, canvas navigation should rely on the library's built-in viewport management rather than manual coordinate math.

## Goals / Non-Goals

**Goals:**
- Enable clearing an input and typing from scratch.
- Ensure sidebar selection always centers the node perfectly.
- Maintain compatibility with Auto-save.

**Non-Goals:**
- Complete overhaul of the Detail Panel (minor logic fix only).

## Decisions

### 1. Lazy Input Defaulting
We will modify the state update pattern in `DetailPanel.tsx` and `TableNode.tsx`:
- **Problem**: `onChange={(e) => update(e.target.value || DEFAULT)}` was causing the jump.
- **Solution**: 
  - Use `onChange={(e) => update(e.target.value)}` (allow `""`).
  - Add `onBlur={(e) => { if (!e.target.value) update(DEFAULT); }}`.
  - This ensures that while typing, the user has full control, but the YAML never ends up with a broken empty name on disk after focus is lost.

### 2. Built-in fitView Navigation
In `App.tsx`, the `focusNodeId` effect currently uses `setCenter`. We will switch to:
```javascript
fitView({ 
  nodes: [{ id: focusNodeId }], 
  duration: 800, 
  padding: 0.5 // Ensures some context around the node
});
```
**Why?** `fitView` automatically calculates the absolute position, even if the node is nested inside a Domain (parent node), and handles the zoom level based on the node's dimensions.

## Risks / Trade-offs

- **[Risk] Auto-save with empty strings**: If Auto-save is ON, an empty string might be written to the YAML briefly while the user is typing.
  - *Mitigation*: Our existing 500ms debounce in `saveSchema` plus the `onBlur` guard will ensure the final state is always valid.
