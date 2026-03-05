## Why

As the data model grows, it's crucial to identify entity types (Fact, Dim, Hub, etc.) instantly without them competing for space with long technical names. The current layout mixes implementation names with type badges, leading to visual clutter when physical table names are long. A "Folder Tab" or "Index Tab" design protruding from the top-left of the node provides a professional, physical-card-like aesthetic while freeing up the entire header width for the tri-layer naming system.

## What Changes

- **Protruding Type Tab**:
  - Implement a small, high-contrast tab at the top-left of each `TableNode`.
  - The tab will display the entity type (e.g., `FACT`, `HUB`) using its associated theme color.
- **Refined Header Hierarchy**:
  - **Conceptual Layer**: Primary focus, largest font.
  - **Logical Layer**: Medium font, displayed only if unique.
  - **Physical Layer**: Smallest font, monospace, with overflow handling (`...`) to prevent node bloating.
- **Improved Hover Interaction**:
  - Show the full physical name via a tooltip or expanded view on hover if it's truncated.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Overhaul the `TableNode` rendering and CSS layout.

## Impact

- `visualizer/src/components/TableNode.tsx`: Complete rewrite of the header and addition of the absolute-positioned tab element.
- `visualizer/src/index.css`: Add support for the tab shape and shadow.
