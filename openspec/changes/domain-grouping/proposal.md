## Why

As data models grow in complexity, it becomes difficult to maintain a high-level overview of the system. Grouping entities by domain allows users to organize their diagrams logically, improving readability and management of large ER diagrams.

## What Changes

- **New `domains` YAML Section**: Introduce an optional `domains` section to define logical groups of tables.
- **Group Node Rendering**: Implement a visual container (group node) in the ER diagram to enclose tables belonging to the same domain.
- **Enhanced Layout Persistence**: Support saving and loading the position and size of domain groups.
- **Hierarchical Node Management**: Allow dragging a domain group to move all contained tables simultaneously.

## Capabilities

### New Capabilities
- `domain-containers`: The logic and UI component for rendering domain group boxes in the diagram.
- `hierarchical-layout`: Support for parent-child node relationships in the internal state and layout logic.

### Modified Capabilities
- `visualizer-core`: Update to render group nodes and handle nested node coordinate systems.
- `resilient-parser`: Extend the parser to support the optional `domains` section and normalize its data.

## Impact

- **YAML Schema**: Introduction of the top-level `domains` key.
- **UI/UX**: New visual representation for domains; improved diagram organization.
- **Performance**: Negligible impact on rendering, as it uses React Flow's native subflow support.
