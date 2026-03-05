## 1. Schema & Documentation Cleanup

- [x] 1.1 Remove `layer` property from `Table` interface in `visualizer/src/types/schema.ts`
- [x] 1.2 Remove architectural layers section from `src/templates/rules.md`

## 2. TableNode Transformation

- [x] 2.1 Remove layer-related JSX and variables from `visualizer/src/components/TableNode.tsx`
- [x] 2.2 Revert `borderRadius` styling to a uniform `8px` rounded corner

## 3. Detail Panel Refinement

- [x] 3.1 Remove layer-related logic from type badge rendering in `visualizer/src/components/DetailPanel.tsx`
- [x] 3.2 Ensure no layer selectors or fields remain in the Detail Panel

## 4. Verification

- [x] 4.1 Verify that the visualizer builds successfully without errors
- [x] 4.2 Verify that table nodes no longer show floating tabs
- [x] 4.3 Verify that all 4 corners of the table node are rounded correctly
