## ADDED Requirements

### Requirement: Simple List-based Sample Data Representation
The system SHALL store and manage sample data rows as a direct 2D array (list of lists) under the `sampleData` key.

#### Scenario: Row Data Persistence
- **WHEN** the user edits a cell in the Sample Data tab
- **THEN** the value is stored in the 2D array at the corresponding row and column index.

### Requirement: Automatic Normalization of Legacy Sample Data
The system SHALL automatically convert old object-based sample data (using `columns` and `rows`) into the new simplified 2D array format when a model is loaded.

#### Scenario: Loading Old Model
- **WHEN** a YAML model with `sampleData: { columns: ["id", "name"], rows: [[1, "Tanaka"]] }` is loaded
- **THEN** it is normalized into `sampleData: [[1, "Tanaka"]]`.
