## Why

The 'Layer' attribute (source, staging, mart, etc.) on individual tables has become redundant after the introduction of 'Mart' as a primary table type. Furthermore, architectural layering is conceptually better handled via 'Domains' (grouping) rather than individual table properties. Removing 'Layer' simplifies the schema and declutters the UI, focusing the tool on business domains and entity roles.

## What Changes

- **Schema Update**: Remove `layer` from the `Table` appearance definition in `types/schema.ts`.
- **UI De-cluttering**: 
  - Remove the floating "Layer Tab" from the top-left of `TableNode.tsx`.
  - Remove layer-related badge logic and UI selectors in `DetailPanel.tsx`.
- **Template Update**: Remove architectural layer guidelines from `rules.md`.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Simplify the visual representation of tables and their metadata editing.
- `rules-templating`: Remove outdated architectural guidance.

## Impact

- `visualizer/src/types/schema.ts`: Schema cleanup.
- `visualizer/src/components/TableNode.tsx`: Visual simplification.
- `visualizer/src/components/DetailPanel.tsx`: Form simplification.
- `src/templates/rules.md`: Documentation cleanup.
