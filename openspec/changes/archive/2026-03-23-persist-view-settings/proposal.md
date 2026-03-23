## Why

Every time `modscape dev` is restarted, view settings (theme, edge visibility, compact mode) reset to defaults — forcing users to re-configure them on each session. Persisting these preferences to `localStorage` eliminates this friction with minimal code change.

## What Changes

- Wrap the Zustand store's UI settings with the `persist` middleware, targeting `localStorage`
- Only the 5 view-preference keys are persisted; all other state remains ephemeral

## Capabilities

### New Capabilities

- `persist-view-settings`: View settings survive browser refreshes and `modscape dev` restarts by reading/writing to `localStorage`

### Modified Capabilities

<!-- none -->

## Impact

- `visualizer/src/store/useStore.ts` — store creation wrapped with `persist` middleware
- No changes to YAML schema, CLI, or visualizer rendering logic
- No new dependencies (Zustand `persist` is already bundled with Zustand)
