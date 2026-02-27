## ADDED Requirements

### Requirement: Dynamic Edge Highlighting
The system SHALL update the color and thickness of edges connected to a selected node.

#### Scenario: Selecting a node with connections
- **WHEN** a node is selected (clicked) by the user
- **THEN** all edges where the node is either the `source` or `target` are rendered with a thick green stroke (`#4ade80`, 3px)

### Requirement: Animation of Highlighted Edges
The system SHALL animate edges when they are in a highlighted state.

#### Scenario: Visualization of active paths
- **WHEN** an edge is highlighted due to node selection
- **THEN** the edge displays a flow animation (`animated: true`)
    
### Requirement: Resetting Edge Style
The system SHALL restore edges to their default style when no node is selected or when a different node is selected.

#### Scenario: Deselecting a node
- **WHEN** the user clicks the canvas (pane) to clear selection
- **THEN** all edges return to their default subtle style
