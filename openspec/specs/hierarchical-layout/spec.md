## ADDED Requirements

### Requirement: Parent-Child Relationship
The system SHALL support nesting table nodes within domain nodes.

#### Scenario: Dragging a domain
- **WHEN** the user drags a domain container
- **THEN** all tables belonging to that domain move together with the container

### Requirement: Relative Coordinate Persistence
The system SHALL persist coordinates of tables within a domain relative to the domain's top-left corner.

#### Scenario: Saving layout with domains
- **WHEN** a table is part of a domain
- **THEN** the stored X and Y coordinates in the `layout` section represent its position relative to the domain's origin
