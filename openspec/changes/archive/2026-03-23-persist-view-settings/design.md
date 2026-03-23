## Context

The Zustand store (`useStore.ts`) holds all UI state in memory. View-related settings (`theme`, `showER`, `showLineage`, `showAnnotations`, `isCompactMode`) default to hardcoded values on every initialization. When `modscape dev` restarts, the browser re-fetches the app bundle and the store re-initializes from scratch, discarding any previous choices.

Zustand ships with a `persist` middleware that transparently reads and writes a subset of store state to a storage backend (typically `localStorage`). No external packages are needed.

## Goals / Non-Goals

**Goals:**
- Persist the 5 view-preference keys to `localStorage` so they survive server restarts and page reloads
- Keep the change localized to `useStore.ts` — no other files need to change

**Non-Goals:**
- Persisting session state (`selectedTableId`, `isPresentationMode`, panel open/close, etc.)
- Per-model settings (settings are global across all models)
- Server-side or cross-device persistence

## Decisions

### Use Zustand `persist` middleware with `partialize`

**Decision:** Wrap the store with `persist` and use the `partialize` option to select only the 5 keys.

```
persist(stateCreator, {
  name: 'modscape-ui-settings',
  partialize: (state) => ({
    theme: state.theme,
    showER: state.showER,
    showLineage: state.showLineage,
    showAnnotations: state.showAnnotations,
    isCompactMode: state.isCompactMode,
  })
})
```

**Rationale:** `partialize` is the idiomatic Zustand way to avoid storing large or ephemeral state. Without it, the entire store (including parsed schema) would be serialized to localStorage, which would be wasteful and could cause stale-data bugs.

Alternatives considered:
- Manual `localStorage` read/write in each setter: verbose, error-prone, hard to maintain.
- `sessionStorage`: survives page refresh but NOT a server restart (tab close resets it). Doesn't solve the stated problem.

### localStorage key: `modscape-ui-settings`

**Decision:** Use a descriptive, namespaced key.

**Rationale:** Avoids collision with other apps on the same localhost origin. Simple and stable.

## Risks / Trade-offs

- [Risk] Stale persisted values after a schema breaking change (e.g., a new theme value is added) → Zustand `persist` handles this via `version` + `migrate` options. For now, since the persisted keys are stable primitives, no migration is needed. Can add versioning later if needed.
- [Risk] localStorage unavailable (private browsing, storage quota exceeded) → Zustand `persist` falls back to in-memory silently. No user-visible breakage.
