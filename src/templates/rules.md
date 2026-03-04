# Data Modeling Rules for this Project

## 1. Modeling Strategy
<!-- Define your modeling methodology here. Example: Data Vault 2.0, Star Schema, 3NF -->
- **Dimensional Modeling (Star Schema)**: Recommended for most analytical use cases. 
  - Use `appearance.type: fact` for central measurement tables.
  - Use `appearance.type: dimension` for descriptive attribute tables.
- **Data Vault 2.0**: For highly scalable enterprise data warehouses.
  - Use `appearance.type: hub`, `link`, or `satellite`.

## 2. Analytics Metadata
Modscape supports attributes to communicate the "Story" and "Grain" of your data to humans and AI agents.

### Fact Table Types / Dimension History (`appearance.sub_type` and `appearance.scd`)
Modscape separates a table's core nature from its history tracking method.

- **`sub_type` (The "What")**:
  - **For Fact Tables**: `transaction` (atomic event), `periodic` (state interval), `accumulating` (milestones), `factless` (occurrence only).
  - **For Dimension Tables**: `conformed` (shared), `junk` (flags), `degenerate` (in-fact).
- **`scd` (The \"How it changes\")**:
  `type0` (fixed), `type1` (overwrite), `type2` (history row), `type3` (history col), `type4` (history table), `type5` (1+4), `type6` (1+2+3), `type7` (1+2).

### Data Lineage (`lineage.upstream`)
Explicitly define dependencies to communicate the data flow:
- Use `lineage.upstream: [table_id1, table_id2]` to list source tables.

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
      sub_type: transaction
      scd: type2 # Fact table with status transition history
    conceptual:
      description: "Records of customer purchases"
      tags: ["WHO", "WHEN", "HOW MUCH"]
    columns:
      - id: order_id
        logical: { name: ID, type: Int, isPrimaryKey: true }
      - id: amount
        logical: { name: Amount, type: Decimal, additivity: fully } # fully | semi | non
      - id: updated_at
        logical: { name: Updated At, type: Timestamp, isMetadata: true }

  - id: dim_customers
    name: Customers Dim
    appearance:
      type: dimension
      sub_type: conformed
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
- Set appropriate `appearance.type`, `sub_type`, and `scd` for new tables.
- Use `additivity` for numeric measures to inform BI tools and analysts.
