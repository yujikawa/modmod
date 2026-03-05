# Data Modeling Rules for this Project

## 1. Modeling Strategy
- **Dimensional Modeling (Star Schema)**: Recommended for most analytical use cases. 
  - Use `appearance.type: fact` for central measurement tables.
  - Use `appearance.type: dimension` for descriptive attribute tables.
  - Use `appearance.type: mart` for downstream reporting-ready tables (Data Marts).
- **Data Vault 2.0**: For highly scalable enterprise data warehouses.
  - Use `appearance.type: hub`, `link`, or `satellite`.

## 2. Analytics & Visual Metadata
Modscape supports attributes to communicate the "Story" and "Grain" of your data.

### Grain & History (`appearance.sub_type` and `appearance.scd`)
- **`sub_type` (The "What")**:
  - **For Fact Tables**: `transaction` (atomic event), `periodic` (state interval), `accumulating` (milestones), `factless` (occurrence only).
  - **For Dimension Tables**: `conformed` (shared), `junk` (flags), `degenerate` (in-fact).
- **`scd` (The "How it changes")**:
  `type0` (fixed), `type1` (overwrite), `type2` (history row), `type3` (history col), `type4` (history table), `type5` (1+4), `type6` (1+2+3), `type7` (1+2).

### Visual Semantics (`appearance.icon` and `appearance.color`)
Categorize entities visually to make the canvas intuitive:
- **`icon`**: Use a single Emoji (e.g., 🛒, 👥, 📅) to represent the business concept.
- **`color`**: Use Hex or RGBA codes for specific table highlighting (optional).

### Data Lineage (`lineage.upstream`)
Define dependencies to communicate data flow:
- Use `lineage.upstream: [table_id1, table_id2]` to list source tables.

## 3. Sample Data Stories
**Every table must include realistic sample data** to explain the context without requiring SQL queries.
- **Format**: A 2D array where the first row is headers.
- **Rule**: Provide at least 3 rows of high-quality, representative data.
```yaml
sampleData:
  - [header1, header2]
  - [value1, value2]
```

## 4. Physical Modeling Rules
Provide physical mapping metadata to ensure the model is implementation-ready.

- **Physical Naming**: All names (tables, schemas, columns) must use `snake_case`.
- **Schema Standards**: `raw`, `staging`, `analytics`, or `mart`.
- **Data Types**: Use standard SQL types (e.g., `VARCHAR`, `BIGINT`, `NUMBER(38,2)`, `DATE`, `TIMESTAMP_NTZ`).

## 5. Logical Column Rules
- **Key Flags**: Mark `isPrimaryKey: true`, `isForeignKey: true`, or `isPartitionKey: true` (for performance).
- **Metadata Columns**: Mark technical columns (e.g., `updated_at`) with `isMetadata: true` (🕒 icon).
- **Additivity**:
  - `fully`: Can be summed across all dimensions (Σ icon).
  - `semi`: Summing is restricted (e.g., bank balance) (Σ~ icon).
  - `non`: Summing is invalid (e.g., unit price) (⊘ icon).

## 6. Relationship Cardinality
Explicitly define the nature of ER connections using `type`:
- Options: `one-to-one`, `one-to-many`, `many-to-one`, `many-to-many`.

## 7. Domain Organization
Group tables into business domains to manage complexity.
- Assign a unique `color` to each domain container.
- Use `description` to explain the domain's business purpose.

## 8. YAML Schema Reference (Hero Example)
```yaml
domains:
  - id: sales
    name: Sales Intelligence
    color: "rgba(59, 130, 246, 0.1)"
    tables: [fct_orders]

tables:
  - id: fct_orders
    name: Orders Fact
    appearance:
      type: fact
      sub_type: transaction
      icon: "🛒"
    physical:
      name: fct_orders
      schema: analytics
    columns:
      - id: order_id
        logical: { name: ID, type: Int, isPrimaryKey: true }
        physical: { name: order_id, type: BIGINT }
      - id: amount
        logical: { name: Amount, type: Decimal, additivity: fully }
        physical: { name: total_amount, type: NUMBER(18,2) }
    sampleData:
      - [order_id, amount, status]
      - [1001, 50.0, "COMPLETED"]
      - [1002, 120.5, "PENDING"]

relationships:
  - from: { table: dim_customers, column: customer_id }
    to: { table: fct_orders, column: customer_id }
    type: one-to-many
```

## 9. The Golden Rules
- When updating `model.yaml`, always self-audit against these rules.
- **Generate realistic `sampleData` for every new entity.**
- **Provide `physical` mappings to make the model implementation-ready.**
- Use `isPartitionKey` for large tables to inform performance design.
