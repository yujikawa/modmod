## MODIFIED Requirements

### Requirement: Advanced Table Metadata Rendering
The system SHALL display both the table's nature (sub_type) and its history tracking method (scd) in the table header if defined.

#### Scenario: Fact table with both sub_type and scd
- **WHEN** a table has `type: fact`, `sub_type: transaction`, and `scd: type2`
- **THEN** the visualizer shows a badge or label indicating both (e.g., "FACT (Trans.)" and a specialized SCD T2 indicator)

#### Scenario: Dimension table with scd only
- **WHEN** a table has `type: dimension` and `scd: type2` (with no sub_type)
- **THEN** the visualizer shows "DIM (SCD T2)"

### Requirement: Cross-Table SCD Assignment
The system SHALL allow users to assign an SCD Type to ANY table type (Fact, Dimension, Hub, Link, Satellite).

#### Scenario: Assigning SCD to a Fact table
- **WHEN** the user selects "SCD Type 2" for a Fact table in the Detail Panel
- **THEN** the `scd` property is set to `type2` while preserving the existing `sub_type` (e.g., `transaction`)
