## Why

Modscape aims to be the go-to tool for data engineers, analytics engineers, and data scientists. To achieve this, it needs to represent advanced data modeling concepts like Fact Grain strategies (Transaction vs. Snapshot) and Slowly Changing Dimensions (SCD), as well as column-level additivity rules. These features empower professionals to document the "why" and "how" of their data architecture for humans and AI agents alike.

## What Changes

- **Schema Extension**: Add optional metadata fields for advanced modeling:
  - Table level: `strategy` (for Facts) and `scd` (for Dimensions).
  - Column level: `additivity` (fully, semi, non) and `isMetadata` (for audit/SCD columns).
- **Visual Indicators**: Update `TableNode` to display professional badges and icons when this metadata is present.
- **Documentation Overhaul**: 
  - Update `src/templates/rules.md` to guide users and AI agents on using these advanced attributes.
  - Update `README.md` and `README.ja.md` to highlight these features as key differentiators for data professionals.

## Capabilities

### New Capabilities
<!-- No new capabilities -->

### Modified Capabilities
- `visualizer-core`: Update the visualization engine to handle new metadata attributes.
- `rules-templating`: Update the template for project initialization.

## Impact

- `visualizer/src/types/schema.ts`: Type definitions for new attributes.
- `visualizer/src/components/TableNode.tsx`: UI rendering logic for badges/icons.
- `src/templates/rules.md`: Updated initial rules template.
- `README.md` / `README.ja.md`: Updated marketing copy.
