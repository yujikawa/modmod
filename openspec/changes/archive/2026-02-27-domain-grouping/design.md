## Context

The current visualizer renders all tables as top-level nodes. While functional, it lacks the ability to group related entities into logical domains (e.g., "Sales", "Customer Master"). React Flow supports hierarchical nodes, which provides a natural technical path for implementing this feature.

## Goals / Non-Goals

**Goals:**
- Allow users to define domains in YAML and assign tables to them.
- Render domains as visual containers (boxes) that can be moved as a unit.
- Persist the position and dimensions of domain containers in the `layout` section.
- Ensure relationships between tables work correctly across domain boundaries.

**Non-Goals:**
- Supporting nested domains (multiple levels of grouping).
- Automatic layout of tables within a domain box.
- Domain-to-domain edges.

## Decisions

- **React Flow Group Nodes**: Use the `type: 'group'` or a custom `DomainNode` with `parentNode` property for tables. This enables dragging the container to move all children.
- **YAML Structure**: Add a top-level `domains` array. Each domain will list its member table IDs.
- **Coordinate System**: Tables within a domain will use coordinates relative to the top-left of the domain container. This is the standard React Flow behavior for nested nodes.
- **Layout Storage**: The `layout` section will be expanded to include entries for domain IDs, storing `x`, `y`, `width`, and `height`.
- **Default Sizing**: If no size is specified in `layout`, the domain node will initialize with a default large size (e.g., 600x400) to ensure visibility.

## Risks / Trade-offs

- **Coordinate Complexity**: [Risk] Switching from absolute to relative coordinates for grouped tables might break existing layouts. → [Mitigation] Implement a migration/normalization step in the parser to convert coordinates if a table is moved into a domain.
- **Overlap Issues**: [Risk] Domain boxes might overlap other nodes. → [Mitigation] Allow users to manually resize and reposition domain boxes, persisting these changes to YAML.
- **Z-Index**: [Risk] Tables might appear behind the domain box. → [Mitigation] Explicitly set z-indices or order the node array so that domain containers are rendered first (at the back).
