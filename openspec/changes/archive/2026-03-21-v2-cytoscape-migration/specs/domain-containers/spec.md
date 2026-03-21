## MODIFIED Requirements

### Requirement: Domain Visualization
The system SHALL render a domain container as a visual background region with a label and semi-transparent fill color. Domain backgrounds SHALL be implemented as absolutely positioned `<div>` elements in an overlay container synchronized to the Cytoscape viewport transform on each `render` event. Domain backgrounds SHALL NOT use Cytoscape compound nodes.

#### Scenario: Domain with tables
- **WHEN** a domain is defined in YAML with a list of tables
- **THEN** the canvas shows a labeled background region enclosing those tables, with color derived from `domain.color`

#### Scenario: Domain background updates on pan/zoom
- **WHEN** the user pans or zooms the canvas
- **THEN** domain background divs SHALL reposition and rescale to remain aligned with their member table nodes

### Requirement: Draggable Container Background
The system SHALL allow users to move all tables within a domain together by dragging within the domain's background region. Dragging SHALL move all member table nodes simultaneously and update each node's position in the store on drag completion.

#### Scenario: Dragging from background
- **WHEN** the user clicks and drags the empty background of a domain region
- **THEN** all table nodes whose id appears in `domain.tables` SHALL move together with the drag delta

#### Scenario: Drag completes with YAML update
- **WHEN** the user releases after dragging a domain background
- **THEN** `store.updateLayout()` SHALL be called for each table node in the domain with its new position

## REMOVED Requirements

### Requirement: Resizable Containers
**Reason**: React Flow's `NodeResizer` component provided resize handles on the `DomainNode`. Cytoscape does not have a direct equivalent, and domain bounds are now derived from member node bounding boxes rather than stored as explicit width/height. Manual resize of the domain boundary is no longer applicable.
**Migration**: Domain visual bounds are computed automatically from the bounding box of member table nodes plus padding. Users resize the domain implicitly by moving or adding/removing member tables.

### Requirement: Interactive Cursor Feedback
**Reason**: The CSS `cursor: grab` was applied via React Flow's node wrapper. Domain backgrounds are now plain `<div>` elements; cursor styling SHALL be applied directly via CSS on the background div.
**Migration**: Apply `cursor: grab` via inline style or CSS class on the domain background div element. This is an implementation detail, not a system-level requirement.
