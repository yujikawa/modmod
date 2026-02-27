## Why

Currently, the `model.yaml` schema is overly strict, requiring logical and physical definitions even in the early conceptual modeling phase. This causes the visualizer to crash (blank screen) if these sections are missing. This change aims to make the system resilient by allowing "conceptual-only" modeling where tables and relationships can exist without column-level details.

## What Changes

- **Schema Relaxation**: Make `columns`, `logical`, and `physical` sections optional in the YAML schema.
- **Resilient Rendering**: Update `TableNode` to render as a simple "box" if no columns are defined.
- **Flexible Relationships**: Support table-to-table relationships without specifying source or target columns.
- **Default Value Handling**: Automatically display "Unknown" for missing types instead of crashing.
- **Enhanced Error Guarding**: Add defensive coding across the visualizer components to prevent UI crashes during parsing and rendering.

## Capabilities

### New Capabilities
- `resilient-parser`: Logic to validate and normalize partial YAML data into a renderable state.
- `box-rendering`: Support for rendering entities as header-only cards when detailed data is absent.

### Modified Capabilities
- `visualizer-core`: Update the core rendering loop and React Flow integration to handle optional fields and loose relationships.
- `detail-panel`: Update tab views to gracefully handle missing logical/physical data.

## Impact

- **YAML Schema**: Minor schema changes making several fields optional.
- **UI/UX**: Improved stability and support for low-fidelity modeling.
- **Type Definitions**: Updates to `Schema` and `Table` interfaces in TypeScript.
