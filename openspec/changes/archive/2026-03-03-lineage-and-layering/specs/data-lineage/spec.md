## ADDED Requirements

### Requirement: Lineage Definition
The system SHALL support defining upstream table dependencies in the YAML model using the `lineage.upstream` key.

#### Scenario: Defining upstream tables
- **WHEN** a table has a `lineage.upstream` list of table IDs
- **THEN** the system recognizes these as data flow dependencies

### Requirement: Directional Data Flow Visualization
The system SHALL visualize table dependencies as directional animated dashed arrows (edges) pointing from upstream to downstream tables.

#### Scenario: Lineage Arrow Display
- **WHEN** "Lineage" toggle is active
- **THEN** the canvas shows dashed blue arrows connecting the center-right (source) of upstream tables to the center-left (target) of downstream tables.

### Requirement: Layer Identification
The system SHALL allow tables to be assigned to a specific data architectural layer (e.g., source, staging, mart) and visualize it as a floating tab on the top-left of the table node.

#### Scenario: Layer Badge Display
- **WHEN** a table has an assigned `appearance.layer`
- **THEN** the visualizer displays a floating tab indicating the layer name above the table node.

### Requirement: Independent Mode Toggling
The system SHALL provide independent toggles for ER (Entity Relationship) and Lineage (Data Flow) views, allowing them to be displayed simultaneously.

#### Scenario: Simultaneous Mode Interaction
- **WHEN** both "ER" and "Lineage" toggles are active
- **THEN** both relationship lines and flow arrows are displayed, but editing (creating new connections) is disabled to prevent ambiguity.

### Requirement: Smart ER Connections
The system SHALL allow users to create ER connections from any vertical handle (top/bottom) or column handle, automatically orienting the edge correctly regardless of the drag direction.

#### Scenario: Bidirectional Connection
- **WHEN** a user drags from a "Target" handle to a "Source" handle in ER mode
- **THEN** the system automatically swaps them to establish a valid directional relationship in the model.
