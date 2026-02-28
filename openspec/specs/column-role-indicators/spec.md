# column-role-indicators Specification

## Purpose
TBD - created by archiving change column-icons-fk-partition. Update Purpose after archive.
## Requirements
### Requirement: Partition Key Support in Schema
The system SHALL support an `isPartitionKey` boolean property within the `logical` section of a column definition.

#### Scenario: Defining a partition key
- **WHEN** a column is marked with `isPartitionKey: true`
- **THEN** the visualizer identifies it as a partition key

### Requirement: Column Role Icons
The visualizer SHALL display specific icons next to column names based on their logical roles.

#### Scenario: Displaying role icons
- **WHEN** a column has `isPrimaryKey: true`, it displays `🔑`
- **WHEN** a column has `isForeignKey: true`, it displays `🔩`
- **WHEN** a column has `isPartitionKey: true`, it displays `📂`

### Requirement: Multi-role Icons
The system SHALL support displaying multiple icons if a column serves multiple roles.

#### Scenario: Column is both PK and FK
- **WHEN** a column has both `isPrimaryKey: true` and `isForeignKey: true`
- **THEN** it displays both `🔑` and `🔩`

