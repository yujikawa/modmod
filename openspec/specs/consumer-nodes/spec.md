## ADDED Requirements

### Requirement: Consumer YAML Definition
The system SHALL support a top-level `consumers` section in model YAML where users can define downstream consumers of their data models.

#### Scenario: Minimal consumer definition
- **WHEN** a YAML file contains a `consumers` entry with only `id` and `name`
- **THEN** the system parses it successfully and renders the node on the canvas

#### Scenario: Full consumer definition
- **WHEN** a consumer entry includes `description`, `appearance.icon`, `appearance.color`, and `url`
- **THEN** all fields are parsed and reflected on the canvas node

#### Scenario: Missing optional fields
- **WHEN** a consumer entry omits `appearance`, `description`, and `url`
- **THEN** the system renders the node with a default icon and no error

### Requirement: Consumer Default Icon
The system SHALL display a default icon for consumer nodes when `appearance.icon` is not specified.

#### Scenario: No icon specified
- **WHEN** a consumer entry has no `appearance.icon`
- **THEN** the canvas renders the node with the default icon (`🔗`)

### Requirement: Consumer Node Canvas Rendering
The system SHALL render consumer nodes on the Cytoscape canvas with a visually distinct style from table nodes.

#### Scenario: Consumer node appearance
- **WHEN** a consumer node is present in the parsed schema
- **THEN** it is displayed with a style that differs from table nodes (e.g., rounded shape, no column list)

#### Scenario: Custom color applied
- **WHEN** a consumer entry specifies `appearance.color`
- **THEN** the node header or background reflects that color

### Requirement: Consumer Node Layout Persistence
The system SHALL support storing and restoring consumer node positions via the `layout` section.

#### Scenario: Layout coordinate applied
- **WHEN** the `layout` section contains an entry with a consumer node's ID
- **THEN** the node is rendered at the specified coordinates on the canvas

#### Scenario: No layout entry
- **WHEN** a consumer node has no corresponding `layout` entry
- **THEN** the system places it at a fallback position without error

### Requirement: Consumer Node Domain Membership
The system SHALL allow consumer nodes to be grouped inside a domain by listing their ID in `domains[].members`, following the same convention as table nodes.

#### Scenario: Consumer inside a domain
- **WHEN** a domain's `members` list contains a consumer ID
- **THEN** the consumer node is rendered inside that domain container on the canvas

#### Scenario: Mixed domain members
- **WHEN** a domain's `members` list contains both table IDs and consumer IDs
- **THEN** both node types are rendered inside the domain container without error

### Requirement: Consumer Node Drag
The system SHALL allow consumer nodes to be dragged on the canvas, with the updated position written back to the `layout` section of the YAML.

#### Scenario: Drag and persist
- **WHEN** the user drags a consumer node to a new position
- **THEN** the `layout` entry for that node is updated with the new coordinates
