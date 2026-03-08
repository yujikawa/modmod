## Why

When both ER (Entity-Relationship) and Lineage view modes are active, the system currently locks "Add Table" and "Add Domain" operations in the Activity Bar UI. This is an over-restriction because the lock's primary purpose is to prevent ambiguity in edge (connection) creation, not node creation. Furthermore, shortcut keys (T, D) already allow node creation in this state, creating an inconsistent user experience.

## What Changes

- **Unlock Node Creation**: Remove the `disabled` state from "Add Table" and "Add Domain" buttons in the Activity Bar when both ER and Lineage modes are active.
- **Refined Naming**: Rename the internal variable `isEditingDisabled` to `isConnectionLocked` to accurately reflect that only edge/connection creation is restricted.
- **Improved UI Feedback**: Update tooltips and icons to clarify that node creation is permitted while edge creation remains restricted for safety.

## Capabilities

### New Capabilities
- (None)

### Modified Capabilities
- `interactive-navigation`: Update the rules for UI restrictions to allow node creation while maintaining safe edge connection logic.

## Impact

- **UI Components**: `ActivityBar.tsx`, `TableNode.tsx`, and `App.tsx` will be updated to use the refined locking logic.
- **Consistency**: The UI will align with existing keyboard shortcut behavior.
