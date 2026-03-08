## 1. Implement Changes

- [x] 1.1 Update `ActivityBar.tsx` to remove `disabled` and `<Lock />` icon from node addition buttons.
- [x] 1.2 Rename `isEditingDisabled` to `isConnectionLocked` in `ActivityBar.tsx`, `TableNode.tsx`, and `App.tsx`.
- [x] 1.3 Ensure the top warning badge in `App.tsx` still clearly indicates "Connections Locked".

## 2. Validation & Verification

- [x] 2.1 Verify "Add Table" button is enabled in Activity Bar when both ER & Lineage are active.
- [x] 2.2 Verify "Add Domain" button is enabled in Activity Bar when both ER & Lineage are active.
- [x] 2.3 Verify handles (nodes) still show red "locked" style in this state.
- [x] 2.4 Verify that shortcuts (T, D) still work as expected.
- [x] 2.5 Run `npm run build` in the `visualizer` directory to ensure no regressions.
