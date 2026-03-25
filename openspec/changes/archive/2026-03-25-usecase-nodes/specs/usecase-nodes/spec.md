## ADDED Requirements

### Requirement: Usecase YAML Definition
The system SHALL support a top-level `usecases` section in model YAML where users can define downstream consumers of their data models.

#### Scenario: Minimal usecase definition
- **WHEN** a YAML file contains a `usecases` entry with only `id` and `name`
- **THEN** the system parses it successfully and renders the node on the canvas

#### Scenario: Full usecase definition
- **WHEN** a usecase entry includes `description`, `appearance.icon`, `appearance.color`, and `url`
- **THEN** all fields are parsed and reflected on the canvas node

#### Scenario: Missing optional fields
- **WHEN** a usecase entry omits `appearance`, `description`, and `url`
- **THEN** the system renders the node with a default icon and no error

### Requirement: Usecase Default Icon
The system SHALL display a default icon for usecase nodes when `appearance.icon` is not specified.

#### Scenario: No icon specified
- **WHEN** a usecase entry has no `appearance.icon`
- **THEN** the canvas renders the node with the default icon (`🔗`)

### Requirement: Usecase Node Canvas Rendering
The system SHALL render usecase nodes on the Cytoscape canvas with a visually distinct style from table nodes.

#### Scenario: Usecase node appearance
- **WHEN** a usecase node is present in the parsed schema
- **THEN** it is displayed with a style that differs from table nodes (e.g., rounded shape, no column list)

#### Scenario: Custom color applied
- **WHEN** a usecase entry specifies `appearance.color`
- **THEN** the node header or background reflects that color

### Requirement: Usecase Node Layout Persistence
The system SHALL support storing and restoring usecase node positions via the `layout` section.

#### Scenario: Layout coordinate applied
- **WHEN** the `layout` section contains an entry with a usecase node's ID
- **THEN** the node is rendered at the specified coordinates on the canvas

#### Scenario: No layout entry
- **WHEN** a usecase node has no corresponding `layout` entry
- **THEN** the system places it at a fallback position without error

### Requirement: Usecase Node Domain Membership
The system SHALL allow usecase nodes to be grouped inside a domain by listing their ID in `domains[].tables`, following the same convention as table nodes.

#### Scenario: Usecase inside a domain
- **WHEN** a domain's `tables` list contains a usecase ID
- **THEN** the usecase node is rendered inside that domain container on the canvas

#### Scenario: Mixed domain members
- **WHEN** a domain's `tables` list contains both table IDs and usecase IDs
- **THEN** both node types are rendered inside the domain container without error

### Requirement: Usecase Node Drag
The system SHALL allow usecase nodes to be dragged on the canvas, with the updated position written back to the `layout` section of the YAML.

#### Scenario: Drag and persist
- **WHEN** the user drags a usecase node to a new position
- **THEN** the `layout` entry for that node is updated with the new coordinates
