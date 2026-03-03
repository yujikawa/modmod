## ADDED Requirements

### Requirement: Advanced Table Metadata Rendering
The system SHALL display specialized badges for Fact strategies and Dimension SCD types in the table header.

#### Scenario: Fact table with strategy
- **WHEN** a table has `appearance.type: fact` and `appearance.strategy: periodic`
- **THEN** the visualizer shows a badge labeled "FACT (Periodic)"

#### Scenario: Dimension table with SCD type
- **WHEN** a table has `appearance.type: dimension` and `appearance.scd: type2`
- **THEN** the visualizer shows a badge labeled "DIM (SCD T2)"

### Requirement: Column Additivity Indicators
The system SHALL display visual indicators for column additivity rules.

#### Scenario: Fully additive column
- **WHEN** a column has `logical.additivity: fully`
- **THEN** the visualizer displays the `Σ` (Sum) icon next to the column name

#### Scenario: Non-additive column
- **WHEN** a column has `logical.additivity: non`
- **THEN** the visualizer displays the `⊘` (Prohibited) icon next to the column name

### Requirement: Metadata Column Indicators
The system SHALL display a visual indicator for technical/audit metadata columns.

#### Scenario: Metadata column
- **WHEN** a column has `logical.isMetadata: true`
- **THEN** the visualizer displays a `🕒` (Clock) icon next to the column name
