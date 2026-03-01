## Why

Modscape is currently focused on interactive visualization. However, users often need to include data models in static documentation, version-controlled READMEs, or design documents. Adding a way to export YAML models as Mermaid-compatible Markdown bridges the gap between interactive exploration and static documentation.

## What Changes

- Add a new `export` command to the Modscape CLI.
- Implement a Markdown generator that produces a comprehensive document containing:
  - A Mermaid `erDiagram` representing tables and their relationships.
  - A domain-organized section describing the logical structure.
  - Detailed table catalogs including column definitions and sample data (if present).
- Support exporting to a file or standard output.

## Capabilities

### New Capabilities
- `model-export`: Capability to transform YAML schema definitions into structured Markdown documents with embedded Mermaid diagrams.

### Modified Capabilities
<!-- None -->

## Impact

- **CLI**: `src/index.js` will be updated to include the `export` command.
- **Architecture**: A new export module will be added to handle the transformation logic.
- **Dependencies**: No new external dependencies are strictly required (js-yaml is already used), but we'll need to ensure the `erDiagram` syntax is correctly generated.
