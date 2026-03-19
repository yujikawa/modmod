## Purpose
The system SHALL support an optional `implementation` block per table in the YAML, providing code-generation hints for AI agents targeting dbt, Spark, SQLMesh, and other data transformation tools.

## Requirements

### Requirement: Implementation Block Declaration
Each table in the YAML SHALL support an optional `implementation` block that declares code-generation hints for AI agents.

#### Scenario: Table with full implementation block
- **WHEN** a table has an `implementation` block with `materialization`, `partition_by`, and `measures`
- **THEN** the parser SHALL preserve all fields as-is and expose them on the `Table` object

#### Scenario: Table without implementation block
- **WHEN** a table has no `implementation` block
- **THEN** the system SHALL behave identically to before, with no errors or warnings

#### Scenario: Table with partial implementation block
- **WHEN** a table has an `implementation` block with only `materialization` defined
- **THEN** the parser SHALL preserve the partial block without requiring other fields

### Requirement: Materialization Declaration
The `implementation` block SHALL support a `materialization` field to declare how the table is physically materialized.

#### Scenario: Incremental table declaration
- **WHEN** a table has `implementation.materialization: incremental` and `implementation.unique_key: [order_id]`
- **THEN** an AI agent SHALL generate an incremental model configuration using `order_id` as the merge key

#### Scenario: View declaration
- **WHEN** a table has `implementation.materialization: view`
- **THEN** an AI agent SHALL generate a view definition rather than a physical table

### Requirement: Partition Declaration
The `implementation` block SHALL support a `partition_by` array for warehouse-level physical partitioning hints. Each entry has a `field` and an optional `granularity` (`day` / `month` / `year` / `hour`).

#### Scenario: Date-partitioned table
- **WHEN** a table has `implementation.partition_by: [{ field: event_date, granularity: day }]`
- **THEN** an AI agent SHALL apply a day-level partition on `event_date` in the generated DDL or model config

#### Scenario: Multiple partition fields
- **WHEN** a table has two entries in `partition_by`
- **THEN** an AI agent SHALL apply partitioning on all specified fields in order

### Requirement: Measures Declaration for Mart Tables
The `implementation` block SHALL support a `measures` array for mart tables to declare aggregation logic.

#### Scenario: Mart with sum measure
- **WHEN** a mart table has a measure `{ column: total_revenue, agg: sum, source_column: amount }`
- **THEN** an AI agent SHALL generate `SUM(<upstream>.amount) AS total_revenue` in the SELECT clause

#### Scenario: Mart with count_distinct measure
- **WHEN** a mart table has a measure `{ column: unique_customers, agg: count_distinct, source_column: customer_id }`
- **THEN** an AI agent SHALL generate `COUNT(DISTINCT <upstream>.customer_id) AS unique_customers`

#### Scenario: Grain declaration drives GROUP BY
- **WHEN** a mart table has `implementation.grain: [month_key, region_id]`
- **THEN** an AI agent SHALL generate `GROUP BY month_key, region_id` in the aggregation query

### Requirement: AI Inference Fallback
When `implementation` is absent, AI agents SHALL infer materialization strategy from `appearance.type` and `appearance.scd`.

#### Scenario: Fact table without implementation block
- **WHEN** a table has `appearance.type: fact` and no `implementation` block
- **THEN** an AI agent SHALL infer `materialization: incremental`

#### Scenario: Dimension with SCD Type 2 without implementation block
- **WHEN** a table has `appearance.type: dimension` and `appearance.scd: type2` and no `implementation` block
- **THEN** an AI agent SHALL infer snapshot-style materialization

#### Scenario: Mart table without implementation block
- **WHEN** a table has `appearance.type: mart` and no `implementation` block
- **THEN** an AI agent SHALL infer `materialization: table`
