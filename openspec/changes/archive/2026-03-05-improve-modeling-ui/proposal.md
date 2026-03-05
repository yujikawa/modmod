## Why

The current modeling UI has several friction points and technical limitations:
1. Large models fail to save due to `PayloadTooLargeError`.
2. Assigning tables to domains via drag-and-drop is unreliable and often leads to unexpected layout shifts.
3. Tables lack clear metadata visibility (column counts) and structured lists (numbering).

Moving to an explicit domain assignment via the Detail Panel and fixing the server-side limits will provide a more professional and reliable modeling experience.

## What Changes

- **Technical Fixes**:
  - Increase the payload limit for the CLI server to handle large YAML models (10MB).
- **Domain UX Overhaul**:
  - Add a "Domain" selector to the Table Detail Panel for explicit assignment.
  - Simplify or remove automatic parent-child detection during drag operations to prevent accidental containment.
- **Table Object Visibility**:
  - Display the total column count in the table header (e.g., "12 cols").
  - Add index numbers (1., 2...) to the column list in `TableNode`.
- **Ecosystem Updates**:
  - Update `rules.md` to include missing professional attributes (Lineage, Layer, SCD).

## Capabilities

### Modified Capabilities
- `visualizer-core`: Update TableNode rendering and DetailPanel interactions.
- `dev-server`: Expand payload limits.
- `rules-templating`: Include latest modeling attributes in the initial template.

## Impact

- `src/dev.js`: Server-side configuration update.
- `visualizer/src/components/DetailPanel.tsx`: New domain selection logic.
- `visualizer/src/components/TableNode.tsx`: Enhanced header and column list rendering.
- `visualizer/src/store/useStore.ts`: Update logic for domain membership.
