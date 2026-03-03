## MODIFIED Requirements

### Requirement: Advanced Table Metadata Rendering
The system SHALL display specialized badges for Fact strategies and Dimension SCD types in the table header if defined. If undefined, the system SHALL only display the base type label.

#### Scenario: Fact table with strategy
- **WHEN** a table has `appearance.type: fact` and `appearance.strategy: periodic`
- **THEN** the visualizer shows a badge labeled "FACT (Periodic)"

#### Scenario: Fact table without strategy
- **WHEN** a table has `appearance.type: fact` and `appearance.strategy` is undefined
- **THEN** the visualizer shows a badge labeled "FACT"

#### Scenario: Dimension table with SCD type
- **WHEN** a table has `appearance.type: dimension` and `appearance.scd: type2`
- **THEN** the visualizer shows a badge labeled "DIM (SCD T2)"

#### Scenario: Dimension table without SCD type
- **WHEN** a table has `appearance.type: dimension` and `appearance.scd` is undefined
- **THEN** the visualizer shows a badge labeled "DIM"

### Requirement: Optional Metadata Selection
The system SHALL allow users to explicitly deselect or leave analytics metadata (strategy, scd, additivity) as undefined via the UI.

#### Scenario: Deselecting Strategy
- **WHEN** the user selects the "-" option in the Fact Strategy dropdown
- **THEN** the `strategy` property is removed or set to undefined in the model
