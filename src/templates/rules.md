# Modscape Modeling Rules for AI Agents

> **Purpose**: This file teaches AI agents how to write valid `model.yaml` files for Modscape.
> Read this file completely before generating or editing any YAML.

---

## QUICK REFERENCE (read this first)

```
ROOT KEYS      domains | tables | relationships | annotations | layout
COORDINATES    ONLY in `layout`. NEVER inside tables or domains.
LINEAGE        Use lineage.upstream (not relationships) for mart/aggregated tables.
parentId       Declare a table's domain membership inside layout, not inside domains.
IDs            Every object (table, domain, annotation) needs a unique `id`.
sampleData     First row = column IDs. At least 3 realistic data rows.
Grid           All x/y values must be multiples of 40.
```

---

## 1. Root Structure

A valid `model.yaml` has exactly these top-level keys.

```yaml
domains:       # (array) visual containers — OPTIONAL but recommended
tables:        # (array) entity definitions — REQUIRED
relationships: # (array) ER cardinality edges — OPTIONAL
annotations:   # (array) sticky notes / callouts — OPTIONAL
layout:        # (object) ALL coordinates — REQUIRED if any objects exist
```

**MUST NOT** add any other top-level keys. They will be ignored or cause errors.

---

## 2. Tables

### 2-1. Required and Optional Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | **REQUIRED** | Unique identifier used as a key in `layout`, `domains.tables`, `lineage.upstream`, etc. Use snake_case. |
| `name` | **REQUIRED** | Conceptual (business) name shown large on the canvas. |
| `logical_name` | optional | Formal business name shown medium. Omit if same as `name`. |
| `physical_name` | optional | Actual database table name shown small. |
| `appearance` | optional | Visual type, icon, color. |
| `conceptual` | optional | AI-friendly business context metadata. |
| `lineage` | optional | Upstream table IDs. Only for `mart` / aggregated tables. |
| `columns` | optional | Column definitions. |
| `sampleData` | optional | 2D array of sample rows. Strongly recommended. |

### 2-2. `appearance` Fields

```yaml
appearance:
  type: fact          # REQUIRED if used. See table below.
  sub_type: transaction  # optional free text (transaction | periodic | accumulating | ...)
  scd: type2          # optional. dimension tables only. type0|type1|type2|type3|type4|type6
  icon: "💰"          # optional. any single emoji.
  color: "#e0f2fe"    # optional. hex or CSS color for the header.
```

**`appearance.type` values:**

| type | Use when... |
|------|-------------|
| `fact` | Events, transactions, measurements. Has measures (numbers) and FK columns. |
| `dimension` | Entities, master data, reference lists. Descriptive attributes. |
| `mart` | Aggregated or consumer-facing output. **Always add `lineage.upstream`.** |
| `hub` | Data Vault: stores a single unique business key. |
| `link` | Data Vault: joins two or more hubs (transaction or relationship). |
| `satellite` | Data Vault: descriptive attributes of a hub, tracked over time. |
| `table` | Generic. Use when none of the above apply. |

**MUST NOT** use `scd` on `fact`, `mart`, `hub`, `link`, or `satellite` tables.

### 2-3. `conceptual` Fields (AI-readable business context)

```yaml
conceptual:
  description: "One row per order line item."
  tags: [WHAT, HOW_MUCH]   # BEAM* tags: WHO | WHAT | WHEN | WHERE | HOW | COUNT | HOW_MUCH
  businessDefinitions:
    revenue: "Net revenue after discounts and returns."
```

### 2-4. `columns` Fields

Each column has an `id` plus optional `logical` and `physical` blocks.

```yaml
columns:
  - id: order_id           # REQUIRED. Unique within the table. Used in sampleData header.
    logical:
      name: "Order ID"     # Display name
      type: Int            # Int | String | Decimal | Date | Timestamp | Boolean | ...
      description: "Surrogate key."   # optional
      isPrimaryKey: true   # optional. default false.
      isForeignKey: false  # optional. default false.
      isPartitionKey: false # optional. default false.
      isMetadata: false    # optional. true for audit cols: load_date, record_source, hash_diff
      additivity: fully    # optional. fully=summable | semi=balance/stock | non=price/rate/ID
    physical:              # optional. override when warehouse names/types differ.
      name: order_id_pk
      type: "BIGINT"
      constraints: [NOT NULL, UNIQUE]
```

---

## 3. Relationships (ER Cardinality)

Use `relationships` **only** for structural ER connections between tables.

```yaml
relationships:
  - from:
      table: dim_customers   # table id
      column: customer_key   # column id — optional but recommended
    to:
      table: fct_orders
      column: customer_key
    type: one-to-many
```

**`type` values:**

| type | Typical usage |
|------|--------------|
| `one-to-one` | Lookup table / vertical split |
| `one-to-many` | Dimension → Fact *(most common)* |
| `many-to-one` | Fact → Dimension *(inverse notation of above)* |
| `many-to-many` | Via a bridge / link table |

**MUST NOT** use `relationships` to express data lineage (use `lineage.upstream` instead).

---

## 4. Data Lineage

`lineage.upstream` declares which source tables a derived table is built from.
This is rendered as animated arrows in **Lineage Mode**. It is separate from ER relationships.

```yaml
tables:
  - id: mart_revenue
    appearance: { type: mart }
    lineage:
      upstream:
        - fct_orders    # list of source table IDs
        - dim_dates
```

### When to use lineage vs relationships

| Situation | Use |
|-----------|-----|
| `dim_customers` → `fct_orders` (FK join) | `relationships` |
| `fct_orders` + `dim_dates` → `mart_revenue` (aggregation) | `lineage.upstream` |

**MUST** define `lineage.upstream` for every `mart` or aggregated table.
**MUST NOT** define `lineage.upstream` for raw tables (`fact`, `dimension`, `hub`, `link`, `satellite`).
**MUST NOT** add a `relationships` entry for a connection already expressed in `lineage.upstream`.

#### Example: correct separation

```yaml
# CORRECT
tables:
  - id: mart_revenue
    appearance: { type: mart }
    lineage:
      upstream: [fct_orders, dim_dates]   # lineage only

relationships:
  - from: { table: dim_customers, column: customer_key }
    to:   { table: fct_orders,    column: customer_key }
    type: one-to-many                     # ER only

# WRONG — do not add a relationships entry for the same connection as lineage
relationships:
  - from: { table: fct_orders }
    to:   { table: mart_revenue }
    type: lineage                         # ❌ never do this
```

---

## 5. Domains

```yaml
domains:
  - id: sales_ops           # REQUIRED. Used as key in layout.
    name: "Sales Operations"  # REQUIRED. Display name.
    description: "..."      # optional
    color: "rgba(59, 130, 246, 0.1)"  # optional. rgba recommended.
    tables:                 # REQUIRED. List of table IDs inside this domain.
      - fct_orders
      - dim_customers
    isLocked: false         # optional. true = prevent drag on canvas.
```

**MUST** list only table IDs that actually exist in `tables`.
**MUST** add a layout entry for the domain with `width` and `height`.

---

## 6. Layout

**All coordinates live here.** Never put `x`, `y`, `width`, or `height` inside `tables` or `domains`.

### 6-1. Field Reference

| Field | Required for | Description |
|-------|-------------|-------------|
| `x` | all entries | Canvas x coordinate (integer, multiple of 40) |
| `y` | all entries | Canvas y coordinate (integer, multiple of 40) |
| `width` | domains | Total pixel width of the domain container |
| `height` | domains | Total pixel height of the domain container |
| `parentId` | tables inside a domain | ID of the containing domain. Makes coordinates relative to domain origin. |
| `isLocked` | domains or tables | Prevents drag when true |

### 6-2. Domain Size Formula

Calculate domain dimensions so tables fit without overflow:

```
width  = (numCols * 320) + ((numCols - 1) * 80) + 160
height = (numRows * 240) + ((numRows - 1) * 80) + 160
```

Examples:
- 1 col × 1 row → width: 480, height: 400
- 2 col × 1 row → width: 880, height: 400
- 2 col × 2 row → width: 880, height: 720
- 3 col × 2 row → width: 1280, height: 720

### 6-3. Table Positioning Inside a Domain

When `parentId` is set, `x`/`y` are **relative to the domain's top-left corner (0, 0)**.

```yaml
layout:
  sales_ops:
    x: 0        # absolute canvas position
    y: 0
    width: 880
    height: 400
  dim_customers:
    x: 80       # 80px from domain's left edge
    y: 80       # 80px from domain's top edge
    parentId: sales_ops
  fct_orders:
    x: 480      # 480px from domain's left edge
    y: 80
    parentId: sales_ops
```

**MUST NOT** let any table's right edge (`x + 320`) or bottom edge (`y + 240`) exceed the domain's `width` or `height`.

### 6-4. Layout Flow Conventions

- **ER diagrams**: Dimension/Hub tables TOP, Fact/Link tables BOTTOM
- **Lineage diagrams**: Upstream (source) LEFT, Downstream (mart) RIGHT
- **Grid**: All `x` and `y` values must be multiples of 40
- **Spacing**: Minimum gap of 120px between nodes

### 6-5. Layout Template

```yaml
layout:
  # --- Domain ---
  <domain_id>:
    x: <canvas_x>     # absolute
    y: <canvas_y>
    width: <W>        # use formula above
    height: <H>

  # --- Table inside domain ---
  <table_id>:
    x: <relative_x>   # relative to domain origin
    y: <relative_y>
    parentId: <domain_id>

  # --- Standalone table ---
  <table_id>:
    x: <canvas_x>     # absolute
    y: <canvas_y>
```

---

## 7. Annotations

```yaml
annotations:
  - id: note_001          # REQUIRED. Unique ID.
    type: sticky          # REQUIRED. sticky | callout
    text: "..."           # REQUIRED. Note content.
    color: "#fef9c3"      # optional. background color.
    targetId: fct_orders  # optional. ID of the object to attach to.
    targetType: table     # required if targetId is set. table | domain | relationship | column
    offset:
      x: 100    # offset from target's top-left. if no targetId, this is absolute canvas position.
      y: -80    # negative y = above the target.
```

---

## 8. Sample Data

Every table SHOULD include `sampleData`.

```yaml
sampleData:
  - [1001, 1, 150.00, "COMPLETED"]   # each row = one data record
  - [1002, 2,  89.50, "PENDING"]
  - [1003, 1, 210.00, "COMPLETED"]
```

**Rules:**
- Each row is a plain data record. No header row.
- The order of values MUST match the order of `columns` defined in the table.
- Use realistic values. Do NOT use "test1", "foo", "xxx".
- Numeric measures should be plausible business amounts.
- Dates should be in ISO 8601 format: `"2024-01-15"` or `"2024-01-15T00:00:00Z"`.

---

## 9. Implementation Hints

`implementation` is an **optional** block inside each table. AI agents read it to generate dbt / Spark / SQLMesh code. Omitting it is fine — the visualizer works without it.

```yaml
tables:
  - id: fct_orders
    appearance: { type: fact }
    implementation:
      materialization: incremental      # table | view | incremental | ephemeral
      incremental_strategy: merge       # merge | append | delete+insert
      unique_key: order_id              # column id used for upsert
      partition_by:
        field: event_date
        granularity: day                # day | month | year | hour
      cluster_by: [customer_id, region_id]
      grain: [month_key, region_id]     # GROUP BY columns (mart only)
      measures:
        - column: total_revenue         # output column id in this table
          agg: sum                      # sum | count | count_distinct | avg | min | max
          source_column: amount         # upstream column id (use <table_id>.<col_id> to disambiguate)
```

### AI Inference Defaults (when `implementation` is absent)

| `appearance.type` | `appearance.scd` | Inferred `materialization` |
|------------------|-----------------|--------------------------|
| `fact` | — | `incremental` |
| `dimension` | `type2` | `table` (snapshot pattern) |
| `dimension` | other | `table` |
| `mart` | — | `table` |
| `hub` / `link` / `satellite` | — | `incremental` |
| `table` | — | `view` |

**Rules:**
- `measures` and `grain` are for `mart` tables only.
- `incremental_strategy` and `unique_key` are only relevant when `materialization: incremental`.
- When `source_column` is ambiguous across multiple upstream tables, qualify it as `<table_id>.<column_id>` (e.g., `fct_orders.amount`).
- **MUST NOT** define `implementation` inside `domains`, `relationships`, or `annotations`.

---

## 10. Common Mistakes (Before → After)

### ❌ Coordinates inside a table definition

```yaml
# WRONG
tables:
  - id: fct_orders
    x: 200        # ❌ coordinates do not belong here
    y: 400
```

```yaml
# CORRECT
tables:
  - id: fct_orders
    name: Orders

layout:
  fct_orders:
    x: 200        # ✅ coordinates belong in layout
    y: 400
```

---

### ❌ Using relationships for lineage

```yaml
# WRONG
relationships:
  - from: { table: fct_orders }
    to: { table: mart_revenue }
    type: lineage   # ❌ 'lineage' is not a valid relationship type
```

```yaml
# CORRECT
tables:
  - id: mart_revenue
    appearance: { type: mart }
    lineage:
      upstream: [fct_orders]    # ✅ express lineage here
```

---

### ❌ Table listed in domain but missing from layout

```yaml
# WRONG
domains:
  - id: sales_ops
    tables: [fct_orders, dim_customers]   # dim_customers listed here...

layout:
  sales_ops: { x: 0, y: 0, width: 880, height: 400 }
  fct_orders: { x: 480, y: 80, parentId: sales_ops }
  # ❌ dim_customers has no layout entry → will render at origin (0,0)
```

```yaml
# CORRECT — every table in a domain MUST have a layout entry
layout:
  sales_ops:    { x: 0, y: 0, width: 880, height: 400 }
  dim_customers: { x: 80,  y: 80, parentId: sales_ops }  # ✅
  fct_orders:   { x: 480, y: 80, parentId: sales_ops }  # ✅
```

---

### ❌ Table overflows domain boundary

```yaml
# WRONG — domain width is 480 but table at x:280 + width:320 = 600 > 480
layout:
  small_domain: { x: 0, y: 0, width: 480, height: 400 }
  fct_orders:   { x: 280, y: 80, parentId: small_domain }  # ❌ right edge = 600
```

```yaml
# CORRECT — use the formula: 1 col = width 480
layout:
  small_domain: { x: 0, y: 0, width: 480, height: 400 }
  fct_orders:   { x: 80, y: 80, parentId: small_domain }   # ✅ right edge = 400
```

---

## 11. dbt Project Integration

If the user has a dbt project, AI agents SHOULD recommend using the built-in import commands instead of writing YAML from scratch.

### 11-1. Commands

```bash
# Prerequisite: generate manifest.json first
dbt parse

# Import a dbt project into Modscape YAML (one-time)
modscape dbt import [project-dir] [options]

# Sync dbt changes into existing Modscape YAML (incremental)
modscape dbt sync [project-dir] [options]
```

**`dbt import` options:**

| Option | Description |
|--------|-------------|
| `-o, --output <dir>` | Output directory (default: `modscape-<project-name>`) |
| `--split-by folder` | One YAML file per dbt folder |
| `--split-by schema` | One YAML file per database schema |
| `--split-by tag` | One YAML file per dbt tag |

### 11-2. What `dbt import` generates

The command reads `target/manifest.json` and produces YAML with:

| Field | Source | Notes |
|-------|--------|-------|
| `id` | `node.unique_id` | Format: `model.project.name` or `source.project.src.table` |
| `name` | `node.name` | Model / source name |
| `physical_name` | `node.alias` | Falls back to `node.name` |
| `conceptual.description` | `node.description` | From dbt docs |
| `columns[].logical.name/type/description` | `node.columns` | From dbt schema.yml |
| `lineage.upstream` | `node.depends_on.nodes` | Auto-populated |
| `appearance.type` | — | **Always `table`. Must be reclassified.** |
| `sampleData` | — | **Not generated. Must be added.** |
| `layout` | — | **Not generated. Must be added.** |
| `domains` | dbt folder structure | Auto-grouped by `fqn[1]` |

### 11-3. What AI agents MUST do after `dbt import`

After running `modscape dbt import`, the generated YAML needs enrichment. AI agents MUST:

1. **Reclassify `appearance.type`** — All tables default to `type: table`. Inspect the table name and columns to assign the correct type (`fact`, `dimension`, `mart`, etc.).
   - Tables named `fct_*` → `fact`
   - Tables named `dim_*` → `dimension`
   - Tables named `mart_*` or `rpt_*` → `mart`
   - Tables named `hub_*` → `hub`, `lnk_*` → `link`, `sat_*` → `satellite`

2. **Add `layout`** — The import does not generate coordinates. Calculate domain sizes and add `layout` entries for all tables and domains using the formula in Section 6.

3. **Add `sampleData`** — The import does not generate sample data. Add at least 3 realistic rows per table.

4. **Do NOT re-generate `lineage.upstream`** — It is already correctly populated from `depends_on.nodes`.

### 11-4. `dbt sync` — Incremental updates

Use `modscape dbt sync` when the dbt project has changed (new models, updated columns, etc.) and you want to update the existing Modscape YAML without losing manual edits.

**What `sync` overwrites:**
- `name`, `logical_name`, `physical_name`
- `conceptual.description`
- `columns` (all)
- `lineage.upstream`

**What `sync` preserves (safe to edit manually):**
- `appearance` (type, icon, color, scd)
- `sampleData`
- `layout`
- `domains`
- `annotations`
- Any fields not listed above

> **Workflow**: `dbt import` once → enrich with AI → `dbt sync` when dbt changes → re-enrich as needed.

### 11-5. Table ID format in dbt-imported models

In dbt-imported YAML, table IDs are dbt `unique_id` strings, not short names:

```yaml
# dbt-imported table ID examples
id: "model.my_project.fct_orders"
id: "source.my_project.raw.orders"
id: "seed.my_project.product_categories"

# lineage.upstream also uses unique_id format
lineage:
  upstream:
    - "model.my_project.stg_orders"
    - "source.my_project.raw.customers"
```

**MUST NOT** shorten these IDs. They are the join keys between `tables`, `domains.tables`, `lineage.upstream`, and `layout`.

---

## 12. Merging YAML Files

When a user asks to **combine, merge, or consolidate** multiple YAML model files, use the built-in `merge` command instead of editing YAML manually.

```bash
# Merge specific files
modscape merge sales.yaml marketing.yaml -o combined.yaml

# Merge all YAML files in a directory
modscape merge ./models -o combined.yaml

# Merge multiple directories
modscape merge ./sales ./marketing -o combined.yaml
```

**Merge behavior:**

| Section | Behavior |
|---------|----------|
| `tables` | Deduplicated by `id`. First occurrence wins on conflict. |
| `relationships` | All entries included (no deduplication). |
| `domains` | Deduplicated by `id`. First occurrence wins on conflict. |
| `layout` | **Not included in output.** Must be added after merging. |
| `annotations` | **Not included in output.** Must be added after merging. |

**What AI agents MUST do after merge:**

1. **Add `layout`** — Run `modscape dev <output>` and use auto-layout, or calculate coordinates manually using the formula in Section 6.
2. **Check for relationship duplication** — If the same relationship exists in multiple source files, it will appear twice. Deduplicate manually if needed.

---

## 13. Complete Example

```yaml
domains:
  - id: sales_domain
    name: "Sales Operations"
    description: "Core transactional data."
    color: "rgba(239, 68, 68, 0.1)"
    tables: [dim_customers, fct_orders]

  - id: analytics_domain
    name: "Analytics & Insights"
    color: "rgba(245, 158, 11, 0.1)"
    tables: [mart_monthly_revenue]

tables:
  - id: dim_customers
    name: "Customers"
    logical_name: "Customer Master"
    physical_name: "dim_customers_v2"
    appearance:
      type: dimension
      scd: type2
      icon: "👤"
    conceptual:
      description: "One row per unique customer version (SCD Type 2)."
      tags: [WHO]
    columns:
      - id: customer_key
        logical: { name: "Customer Key", type: Int, isPrimaryKey: true }
      - id: customer_name
        logical: { name: "Name", type: String }
      - id: dw_valid_from
        logical: { name: "Valid From", type: Timestamp, isMetadata: true }
    sampleData:
      - [1, "Acme Corp", "2024-01-01T00:00:00Z"]
      - [2, "Beta Ltd",  "2024-03-15T00:00:00Z"]
      - [3, "Gamma Inc", "2024-06-01T00:00:00Z"]

  - id: fct_orders
    name: "Orders"
    logical_name: "Order Transactions"
    physical_name: "fct_sales_orders"
    appearance: { type: fact, sub_type: transaction, icon: "🛒" }
    conceptual:
      description: "One row per order line item."
      tags: [WHAT, HOW_MUCH]
    implementation:
      materialization: incremental
      incremental_strategy: merge
      unique_key: order_id
      partition_by: { field: order_date, granularity: day }
      cluster_by: [customer_key]
    columns:
      - id: order_id
        logical: { name: "Order ID", type: Int, isPrimaryKey: true }
        physical: { name: "order_id", type: "BIGINT", constraints: [NOT NULL] }
      - id: customer_key
        logical: { name: "Customer Key", type: Int, isForeignKey: true }
      - id: amount
        logical: { name: "Amount", type: Decimal, additivity: fully }
    sampleData:
      - [1001, 1, 150.00]
      - [1002, 2,  89.50]
      - [1003, 1, 210.00]

  - id: mart_monthly_revenue
    name: "Monthly Revenue"
    logical_name: "Executive Revenue Summary"
    physical_name: "mart_finance_monthly_revenue_agg"
    appearance: { type: mart, icon: "📈" }
    lineage:                        # mart → use lineage, not relationships
      upstream:
        - fct_orders
        - dim_customers
    implementation:
      materialization: table
      grain: [month_key]
      measures:
        - column: total_revenue
          agg: sum
          source_column: fct_orders.amount
    columns:
      - id: month_key
        logical: { name: "Month", type: String, isPrimaryKey: true }
      - id: total_revenue
        logical: { name: "Revenue", type: Decimal, additivity: fully }
    sampleData:
      - ["2024-01", 12450.50]
      - ["2024-02", 15200.00]
      - ["2024-03", 18900.75]

relationships:                      # ER only — not for lineage
  - from: { table: dim_customers, column: customer_key }
    to:   { table: fct_orders,    column: customer_key }
    type: one-to-many

annotations:
  - id: note_001
    type: sticky
    text: "Grain: one row per order line item."
    targetId: fct_orders
    targetType: table
    offset: { x: 100, y: -80 }

layout:
  # Domains — width/height calculated by formula
  # sales_domain: 2 tables side by side → 2-col × 1-row → w:880, h:400
  sales_domain:
    x: 0
    y: 0
    width: 880
    height: 400

  # Tables inside sales_domain — coordinates relative to domain origin
  dim_customers:
    x: 80
    y: 80
    parentId: sales_domain

  fct_orders:
    x: 480
    y: 80
    parentId: sales_domain

  # analytics_domain: 1 table → 1-col × 1-row → w:480, h:400
  analytics_domain:
    x: 1000
    y: 0
    width: 480
    height: 400

  mart_monthly_revenue:
    x: 80
    y: 80
    parentId: analytics_domain
```
