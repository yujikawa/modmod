## 1. Node Handle Refactor

- [x] 1.1 Update `TableNode.tsx` to use more descriptive and unique handle IDs (e.g., `[id]-er-target-top`)
- [x] 1.2 Update column handles to also use unique IDs (e.g., `[id]-[col]-source`)

## 2. Edge Sync & Connect Refactor

- [x] 2.1 Update edge sync `useEffect` in `App.tsx` to explicitly set `sourceHandle` and `targetHandle` for ER edges
- [x] 2.2 Update `onConnect` logic in `App.tsx` to correctly handle the new handle IDs and maintain bidirectional swapping

## 3. Verification

- [x] 3.1 Verify ER edges always connect to Top/Bottom handles by default
- [x] 3.2 Verify Lineage edges always connect to Left/Right handles
- [x] 3.3 Verify existing YAML models load with correct connection points
