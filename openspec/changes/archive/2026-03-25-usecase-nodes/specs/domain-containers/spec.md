## MODIFIED Requirements

### Requirement: Domain Visualization
The system SHALL render a domain container as a visual background region with a label and semi-transparent fill color. Domain backgrounds SHALL be implemented as absolutely positioned `<div>` elements in an overlay container synchronized to the Cytoscape viewport transform on each `render` event. Domain backgrounds SHALL NOT use Cytoscape compound nodes.

#### Scenario: Domain with members
- **WHEN** a domain is defined in YAML with a `members` list containing table IDs and/or usecase IDs
- **THEN** the canvas shows a labeled background region enclosing those nodes, with color derived from `domain.color`

#### Scenario: Domain background updates on pan/zoom
- **WHEN** the user pans or zooms the canvas
- **THEN** domain background divs SHALL reposition and rescale to remain aligned with their member nodes

### Requirement: Draggable Container Background
The system SHALL allow users to move all members within a domain together by dragging within the domain's background region. Dragging SHALL move all member nodes simultaneously and update each node's position in the store on drag completion.

#### Scenario: Dragging from background
- **WHEN** the user clicks and drags the empty background of a domain region
- **THEN** all nodes whose id appears in `domain.members` SHALL move together with the drag delta

#### Scenario: Drag completes with YAML update
- **WHEN** the user releases after dragging a domain background
- **THEN** `store.updateLayout()` SHALL be called for each member node in the domain with its new position
