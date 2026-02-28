## Why

Currently, all tables in the visualizer look the same, making it difficult to distinguish their roles (e.g., Fact vs. Dimension) at a glance. Adding visual cues based on entity types will improve the readability and interpretability of the data model, especially for complex architectures like Data Vault or Star Schema.

## What Changes

- **Schema Extension**: Add an `appearance` block to the `Table` definition in the schema.
- **Role-based Styling**: Support predefined entity types (`fact`, `dimension`, `hub`, `link`, `satellite`) with default emoji icons and theme colors.
- **Customization**: Allow manual overrides for `icon` (emoji) and `color` (hex/css) within the `appearance` block.
- **Visual Enhancement**: Update the `TableNode` component to display a subtle top-border color line, a role-specific icon, and a type badge in the header.
- **Theming**: Ensure colors are optimized for the existing dark theme (Slate-900 background).

## Capabilities

### New Capabilities
- `entity-appearance`: Defines the schema and rendering rules for entity types, icons, and colors.

### Modified Capabilities
- `visualizer-core`: Update the core rendering logic to incorporate table-level appearance metadata.

## Impact

- `visualizer/src/types/schema.ts`: Update `Table` interface.
- `visualizer/src/lib/parser.ts`: Update YAML parsing logic.
- `visualizer/src/components/TableNode.tsx`: Update component to render new visual elements.
- `visualizer/sample-model.yaml`: Update sample data to demonstrate the new feature.
