## Context

Multiple UX regressions and minor bugs have been identified after recent features. This design addresses them collectively to ensure a polished v1.1.3 experience.

## Goals / Non-Goals

**Goals:**
- Fix quoted `y` keys in YAML.
- Prevent undo/redo from leaking between files.
- Stabilize domain-grouped layout interactions.
- Provide a clear way to refresh data from the API.

## Decisions

### 1. Undo History Management
In `EditorTab.tsx`, we will add a `useEffect` that monitors `currentModelSlug`. When the slug changes, we will dispatch a transaction to the CodeMirror view that clears the history or performs the initial content set without adding to history.

### 2. YAML Serializer Config
In `useStore.ts` (syncToYamlInput) and `saveSchema`, we will update `yaml.dump` calls. Using `schema: yaml.JSON_SCHEMA` or explicit `styles` should prevent `y` from being quoted as a boolean-like key.

### 3. Stable Layout Logic
In `App.tsx`, the `Sync Nodes` effect is the culprit. When a single node is moved, we should ensure its coordinates are rounded consistently with the initial auto-calc. However, the better fix is to make the "Automatic" layout deterministic and less sensitive to partial state updates. 
Alternatively, we will ensure that when a node within a domain is moved, its position is saved relative to the parent correctly without triggering a full re-layout of sisters.

### 4. Default State Changes
`isAutoSaveEnabled` will be set to `false` in `useStore.ts`.

### 5. Refresh Action
A new `refreshCurrentModel` action will be added to `useStore.ts` that re-fetches the schema for the current slug. A button will be added to the Sidebar header.

## Risks / Trade-offs

- **[Risk]** Disabling auto-save might lead to data loss if users forget to click save.
  - **Mitigation**: Ensure the "Save" button is prominent and shows unsaved state indicators.
