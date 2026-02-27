## ADDED Requirements

### Requirement: Domain Visualization
The system SHALL render a domain container as a visual card with a title and a semi-transparent background.

#### Scenario: Domain with tables
- **WHEN** a domain is defined in YAML with a list of tables
- **THEN** the diagram shows a container box labeled with the domain name enclosing those tables

### Requirement: Resizable Containers
The system SHALL allow users to resize domain containers on the canvas.

#### Scenario: Adjusting domain size
- **WHEN** the user drags the edges of a domain container
- **THEN** the container's width and height are updated and persisted to the layout state
