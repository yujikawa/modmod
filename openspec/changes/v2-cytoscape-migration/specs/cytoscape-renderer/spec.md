## ADDED Requirements

### Requirement: Canvas-based rendering engine
The system SHALL use Cytoscape.js (Canvas-based) as the graph rendering engine. The `cytoscape-dom-node` plugin SHALL manage HTML node containers, and `cytoscape-dagre` SHALL provide automatic layout. React Flow and `@xyflow/react` SHALL NOT be used.

#### Scenario: Large schema renders within performance target
- **WHEN** a YAML model with 1,000 tables is loaded
- **THEN** the initial canvas render SHALL complete within 200ms and sustain ≥50fps during pan and zoom

#### Scenario: Schema with 5,000 nodes remains interactive
- **WHEN** a YAML model with 5,000 tables is loaded
- **THEN** the canvas SHALL remain interactive (pan/zoom responds within 100ms) even if initial render exceeds 500ms

### Requirement: YAML-to-elements conversion
The system SHALL provide a `yamlToElements()` function that converts a parsed schema object into a Cytoscape `ElementDefinition[]` array. Tables become nodes; `relationships[]` and `lineage.upstream[]` entries become edges. The function SHALL NOT mutate the schema.

#### Scenario: Tables become nodes
- **WHEN** `yamlToElements()` is called with a schema containing N tables
- **THEN** the result SHALL contain exactly N node elements, each with `data.id` matching the table's `id` field

#### Scenario: ER relationships become edges
- **WHEN** a schema has relationships defined
- **THEN** each relationship SHALL produce one edge element with `data.kind = 'er'`, `data.source`, `data.target`, `data.relType`, `data.fromColumn`, `data.toColumn`

#### Scenario: Lineage upstreams become edges
- **WHEN** a table has `lineage.upstream` entries
- **THEN** each upstream reference SHALL produce one edge element with `data.kind = 'lineage'`, `data.source = upstreamId`, `data.target = tableId`

#### Scenario: Layout coordinates applied
- **WHEN** `layout[tableId]` exists in the schema
- **THEN** the corresponding node element SHALL use those `x`/`y` values as its initial position

### Requirement: HTML node design via cytoscape-dom-node
Each table node SHALL render its visual design as an HTML element managed by the `cytoscape-dom-node` plugin. The HTML content SHALL display the table name, type badge (FACT / DIMENSION / HUB / LINK / SATELLITE / MART / TABLE), optional physical name, and a column list (up to 6 rows; remaining shown as "+N more"). The node SHALL use React portals to render a `TableCard` React component inside the plugin-managed DOM container.

#### Scenario: Full card rendered at normal zoom
- **WHEN** the canvas zoom level is ≥ 0.35
- **THEN** each visible table node SHALL show the full card: header with type badge and table name, physical name if present, and the column list

#### Scenario: Minimal card rendered at low zoom
- **WHEN** the canvas zoom level drops below 0.35
- **THEN** each table node SHALL switch to a minimal display showing only the table name and type badge, with the column list hidden

#### Scenario: Column count overflow
- **WHEN** a table has more than 6 columns
- **THEN** the node SHALL display the first 6 columns and a "+N more" label for the remaining count

### Requirement: Edge visual differentiation
Lineage edges and ER relationship edges SHALL be visually distinct.

#### Scenario: Lineage edge appearance
- **WHEN** a lineage edge is rendered
- **THEN** it SHALL appear as a dashed blue curve with an arrow pointing toward the downstream table

#### Scenario: ER edge appearance with cardinality
- **WHEN** an ER relationship edge is rendered
- **THEN** it SHALL appear as a solid line with cardinality badges (e.g. "1", "N") near each endpoint, colored to distinguish from lineage edges

### Requirement: Drag-to-update layout
When a user drags a table node, the new position SHALL be written back to the Zustand store's layout section and subsequently to the YAML output.

#### Scenario: Node drag persists to YAML
- **WHEN** the user drags a table node to a new position and releases
- **THEN** `store.updateLayout(tableId, { x, y })` SHALL be called with the node's final canvas coordinates, and the YAML `layout` section SHALL reflect the new position

### Requirement: Interaction states
Table nodes SHALL visually reflect selection, highlight, and dimmed states driven by the Zustand store.

#### Scenario: Selected node appearance
- **WHEN** `selectedTableId` in the store matches a table's id
- **THEN** that node's `TableCard` SHALL render with a highlighted border and elevated visual treatment

#### Scenario: Dimmed node appearance
- **WHEN** a set of nodes is highlighted (PathFinder result or hover) and a node is NOT in that set
- **THEN** that node SHALL render at reduced opacity to indicate it is not on the active path

#### Scenario: Highlighted node appearance
- **WHEN** a node's id is present in `highlightedNodeIds`
- **THEN** that node SHALL render with full opacity and a distinct accent color

### Requirement: Automatic layout with dagre
The system SHALL support triggering an automatic left-to-right layout using `cytoscape-dagre`, preserving the existing layout configuration (`rankDir: 'LR'`).

#### Scenario: Auto-layout arranges nodes left to right
- **WHEN** the user triggers automatic layout
- **THEN** Cytoscape SHALL run the dagre layout with `rankDir: 'LR'` and animate nodes to their new positions over 500ms

#### Scenario: Auto-layout result written back to YAML
- **WHEN** the dagre layout completes
- **THEN** all node positions SHALL be written back to the store's layout section so the YAML reflects the new arrangement
