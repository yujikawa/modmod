# Data Modeling Rules for this Project

## 1. Modeling Strategy
<!-- Define your modeling methodology here. Example: Data Vault 2.0, Star Schema, 3NF -->
- **Dimensional Modeling (Star Schema)**: Recommended for most analytical use cases. 
  - Use `appearance.type: fact` for central measurement tables.
  - Use `appearance.type: dimension` for descriptive attribute tables.
- **Data Vault 2.0**: For highly scalable enterprise data warehouses.
  - Use `appearance.type: hub`, `link`, or `satellite`.

## 2. Advanced Analytics Metadata
Modscape supports advanced attributes to communicate the "Story" and "Grain" of your data to humans and AI agents.

### Fact Table Strategies (`appearance.strategy`)
- `transaction`: Standard fact table where one row = one event (e.g., an order).
- `periodic`: Snapshot fact table capturing state at set intervals (e.g., monthly inventory).
- `accumulating`: Fact table updated as a process moves through milestones (e.g., order → shipping → delivery).
- `factless`: Tables that record the occurrence of an event without numeric measures (e.g., event attendance).

### Dimension SCD Types (`appearance.scd`)
- `type0`: Fixed dimensions (no changes allowed).
- `type1`: Overwrite changes (no history maintained).
- `type2`: Add new row for changes (full history with timestamps).
- `type3`: Add new column for changes (partial history).
- `type6`: Hybrid approach (1+2+3).

### Column Additivity (`logical.additivity`)
- `fully`: Can be summed across all dimensions (e.g., sales amount). Displays as `Σ`.
- `semi`: Summing is valid only across some dimensions (e.g., bank balance - can't sum across time). Displays as `Σ~`.
- `non`: Summing is never valid (e.g., unit price, ratios). Displays as `⊘`.

### Metadata Columns (`logical.isMetadata`)
Mark technical or audit columns (like `created_at`, `dbt_updated_at`) with `isMetadata: true` to display a `🕒` icon.

## 3. Naming Conventions
- **Casing**: [Select one: snake_case / UPPER_SNAKE_CASE / camelCase]
- **Prefixes**: (e.g., `f_` for facts, `d_` for dimensions)
- **Suffixes**: (e.g., `_id` for primary keys, `_h` for history tables)

## 4. Standard Data Types
- String: Varchar, Text
- Numeric: Integer, Decimal, Float
- Date/Time: Timestamp, Date

## 5. YAML Schema Reference
```yaml
tables:
  - id: fct_orders
    name: Orders Fact
    appearance:
      type: fact
      strategy: transaction
    conceptual:
      description: "Records of customer purchases"
      tags: ["WHO", "WHEN", "HOW MUCH"]
    columns:
      - id: order_id
        logical: { name: ID, type: Int, isPrimaryKey: true }
      - id: amount
        logical: { name: Amount, type: Decimal, additivity: fully }
      - id: updated_at
        logical: { name: Updated At, type: Timestamp, isMetadata: true }

  - id: dim_customers
    name: Customers Dim
    appearance:
      type: dimension
      scd: type2
    columns:
      - id: customer_id
        logical: { name: ID, type: Int, isPrimaryKey: true }
      - id: valid_from
        logical: { name: Valid From, type: Timestamp, isMetadata: true }
```

## 6. Layout Management
- **Visualizer Priority**: The GUI handles layout through drag-and-drop.
- **AI Agent Responsibility**: When creating new entities, assign initial (x, y) coordinates to place them near related tables.

## 7. The Golden Rules
- When updating `model.yaml`, always self-audit against these rules.
- Set appropriate `appearance.type` and `strategy`/`scd` for new tables.
- Use `additivity` for numeric measures to inform BI tools and analysts.
