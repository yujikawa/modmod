## 1. Input Handling Refactor

- [x] 1.1 Update `Table Name` input in `DetailPanel.tsx` to allow empty values on change and default on blur
- [x] 1.2 Update `Domain Name` input in `DetailPanel.tsx` to follow the same pattern
- [x] 1.3 Audit other key fields (ID, physical names) for similar aggressive defaulting

## 2. Navigation Refactor

- [x] 2.1 Refactor `focusNodeId` useEffect in `App.tsx` to use `fitView` with the specific node ID
- [x] 2.2 Adjust `padding` and `duration` for a smooth, centered zoom experience

## 3. Verification

- [x] 3.1 Verify that a table name can be fully cleared and a new one typed without jumps
- [x] 3.2 Verify that a blank name reverts to a default value only after clicking away
- [x] 3.3 Verify that selecting an entity in the sidebar centers it perfectly, regardless of its parent domain
