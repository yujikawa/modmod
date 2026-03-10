# Modscape Data Modeling Rules (AI-Optimized)

## 0. Foundational Principle: Instruction Fidelity
AI agents MUST prioritize the user's specific instructions above all else.
- **Accuracy**: Precisely implement every table, column, and relationship requested.
- **Completeness**: Do not omit requested details for the sake of brevity.
- **Expert Guidance**: If a user's instruction contradicts modeling best practices (e.g., mixing grains), **warn the user and suggest an alternative**, but do not ignore the original intent.

## CRITICAL: YAML Architecture
AI agents MUST follow this root-level structure. Schema violations will cause parsing errors.

1.  **`domains`**: (Array) Visual groupings.
2.  **`tables`**: (Array) Entity definitions. **NEVER put `x` or `y` coordinates here.**
3.  **`relationships`**: (Array) ER connections.
4.  **`annotations`**: (Array) Sticky notes and callouts.
5.  **`layout`**: (Dictionary) **MANDATORY**. All coordinates MUST live here, keyed by object ID.

---

## 1. Beautiful Layout Heuristics
To ensure a professional and clean diagram, AI agents MUST use the following numeric standards:

### Standard Metrics
- **Grid Snapping**: All `x` and `y` values MUST be multiples of **40** (e.g., 0, 40, 80, 120).
- **Standard Table Width**: `320`
- **Standard Table Height**: `240` (base)
- **Node Spacing (Gap)**: Minimum `120` between nodes.

### Directional Flow
- **Data Lineage (Horizontal)**: 
  - Upstream (Source) tables on the **LEFT**.
  - Downstream (Target) tables on the **RIGHT**.
- **ER Relationships (Vertical)**:
  - Master/Dimension/Hub tables on the **TOP**.
  - Fact/Transaction/Link tables on the **BOTTOM**.

### Domain Containers
- Tables inside a domain are positioned **relative** to the domain's (0,0) origin.
- **Domain Packing (Arithmetic Rule)**: 
  To ensure tables fit perfectly inside a domain, calculate dimensions as follows:
  - **Width**: `(Cols * 320) + ((Cols - 1) * 80) + 160` (Padding). *Example: 2-col domain = 880px wide.*
  - **Height**: `(Rows * 240) + ((Rows - 1) * 80) + 160` (Padding). *Example: 2-row domain = 720px high.*
- **Boundary Constraint**: NEVER place a table such that its right/bottom edge exceeds the domain's `width`/`height`.

---

## 2. Table Naming Hierarchy (3-Layer)
Bridge the gap between business and tech by populating all three layers:

1.  **Conceptual Name (`name`)**: Business title (e.g., "Customers"). High-level clarity.
2.  **Logical Name (`logical_name`)**: Formal modeling name (e.g., "Customer Master"). Hidden if identical to `name`.
3.  **Physical Name (`physical_name`)**: Actual database table name (e.g., `dim_customers_v1`).

---

## 3. Modeling Strategy & Intelligence
AI agents MUST analyze the nature of data to choose the correct classification and methodology.

### Table Classification Heuristics
- **Fact (`fact`)**: Data represents **Events, Transactions, or Measurements** (e.g., "Sales", "Clicks"). Usually has numbers (measures) and foreign keys.
- **Dimension (`dimension`)**: Data represents **Entities, People, or Reference Lists** (e.g., "Customers", "Products"). Contains descriptive attributes.
- **Hub (`hub`)**: Data represents a **Unique Business Key** (e.g., "Customer ID"). Used in Data Vault for core entity identification.
- **Satellite (`satellite`)**: Data represents **Descriptive Attributes of a Hub over time**. Always linked to a Hub.

### Defining the Grain (The "1-Row Rule")
- Before adding columns, define the **Grain**: What does one row represent? (e.g., "One line item per invoice").
- **STRICT**: NEVER mix grains in a single table. Aggregated measures and atomic transactions MUST be in separate tables.

### Methodology Selection
- **Star Schema**: Use for most business reporting. Prioritize user-friendliness and query performance.
- **Data Vault 2.0**: Use for high-integration environments with many source systems. Prioritize scalability and auditability over direct queryability.

---

## 4. Logical Column Rules
- **Key Flags**: Mark `isPrimaryKey`, `isForeignKey`, or `isPartitionKey`.
- **Metadata**: Mark technical columns (e.g., `dw_load_date`) with `isMetadata: true`.
- **Additivity**: `fully` (Summable), `semi` (Balance), `non` (Price/ID).

---

## 5. Sample Data Stories
**Every table MUST include high-quality sample data.**
- **Format**: 2D array. First row is Header IDs.
- **Storytelling**: Provide at least 3 rows representing a real business scenario. Avoid "test1", "test2". Use realistic names, dates, and amounts.

---

## 6. Prohibitions & Anti-Patterns
- **NO NESTED LAYOUT**: Never put `x` or `y` inside `tables[...]` or `domains[...]`.
- **NO FLOATS**: Use only integers for coordinates.
- **NO FRAGMENTED LINEAGE**: Always define `lineage.upstream` for derived tables.

---

## 7. Golden Schema Example
```yaml
domains:
  - id: sales_domain
    name: "Sales Operations"
    tables: [fct_orders]

tables:
  - id: fct_orders
    name: "Orders"
    logical_name: "Order Transactions"
    physical_name: "fct_sales_orders"
    appearance: { type: fact, sub_type: transaction, icon: "🛒" }
    columns:
      - id: order_id
        logical: { name: "ID", type: Int, isPrimaryKey: true }
      - id: amount
        logical: { name: "Amount", type: Decimal, additivity: fully }
    sampleData:
      - [order_id, amount]
      - [1001, 50.0]
      - [1002, 120.5]

layout:
  sales_domain: { x: 0, y: 0, width: 480, height: 400 }
  fct_orders: { x: 80, y: 80 } # Relative to domain
```
