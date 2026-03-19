## ADDED Requirements

### Requirement: Import dbt manifest
The system SHALL provide an `import-dbt` command to convert a dbt `manifest.json` file into a Modscape YAML model.

#### Scenario: Valid manifest file
- **WHEN** the user runs `modscape import-dbt path/to/manifest.json`
- **THEN** the system parses the file and generates a `dbt-model.yaml` (default) containing tables and lineage.

#### Scenario: Missing manifest file
- **WHEN** the user runs `modscape import-dbt non-existent.json`
- **THEN** the system displays an error message: "target/manifest.json not found. Run 'dbt parse' first."

### Requirement: Map dbt nodes to tables
The system SHALL map dbt models, seeds, snapshots, and sources to Modscape tables.

#### Scenario: Mapping a model
- **WHEN** a dbt model `stg_orders` is present in the manifest
- **THEN** a table entry is created in the YAML with `id: stg_orders` and `name: stg_orders`.

### Requirement: Map dbt lineage
The system SHALL extract `depends_on.nodes` from dbt nodes and map them to Modscape `lineage.upstream`.

#### Scenario: Mapping upstream dependencies
- **WHEN** `fct_orders` has `stg_orders` in its `depends_on.nodes`
- **THEN** the Modscape table `fct_orders` includes `stg_orders` in its `lineage.upstream` list.

### Requirement: Map domains from dbt folder structure
The system SHALL automatically create Modscape `domains` based on the dbt `original_file_path`.

#### Scenario: Grouping by folder
- **WHEN** models are located in `models/marts/finance/` and `models/staging/`
- **THEN** the YAML includes domains for `finance` and `staging`, grouping the corresponding tables.

### Requirement: Map column descriptions (Optional)
The system SHALL include column descriptions as `logical.name` in Modscape if they are defined in the dbt manifest.

#### Scenario: Column with description
- **WHEN** a dbt column `order_id` has description "Primary key of orders"
- **THEN** the Modscape table's column includes `logical: { name: "Primary key of orders" }`.
