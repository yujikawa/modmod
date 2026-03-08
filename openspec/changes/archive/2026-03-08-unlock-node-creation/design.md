## Context

Currently, the `showER && showLineage` condition triggers a global "locked" state (`isEditingDisabled`). This state is used too broadly, preventing node creation in the Activity Bar, even though node creation doesn't involve the ambiguous handles that the lock is intended to protect.

## Goals / Non-Goals

**Goals:**
- Enable "Add Table" and "Add Domain" operations in the Activity Bar even when both ER and Lineage modes are active.
- Clarify through code and UI that only "Connections" are locked to prevent ambiguity.

**Non-Goals:**
- Removing the lock from edge (handle) creation.
- Changing the underlying showER/showLineage state management.

## Decisions

### 1. Rename variable to `isConnectionLocked`
The current variable `isEditingDisabled` is misleading. It should be renamed to `isConnectionLocked` across all components (`ActivityBar.tsx`, `TableNode.tsx`, `App.tsx`).

### 2. Remove locks from Node creation in ActivityBar
In `ActivityBar.tsx`, the `disabled` prop and `Lock` icons for `handleAddDomain` and `handleAddTable` should be removed. 
The lock condition itself (`isConnectionLocked`) will remain, but it will only apply to the visual state of the connection handles and the top warning badge.

```tsx
// ActivityBar.tsx change
const isConnectionLocked = showER && showLineage;

// Remove disabled={isConnectionLocked} from Add Table and Add Domain buttons.
// Also remove the <Lock /> icon overlay.
```

### 3. Maintain Handle Lock in TableNode
The logic in `TableNode.tsx` should remain: when `isConnectionLocked` is true, handles should still show the red "locked" style to prevent ambiguous connections.

## Risks / Trade-offs

- **[Risk]** Users might be confused if the top badge says "Connections Locked" but they can still add tables.
  - **Mitigation**: Ensure the badge text is specific: "Connections Locked (ER & Lineage active)".
