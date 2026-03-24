# <img src="./visualizer/public/favicon.svg" width="32" height="32" align="center" /> Modscape

[![npm version](https://img.shields.io/npm/v/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![npm downloads](https://img.shields.io/npm/dm/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![Deploy Demo](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml)
[![Publish to NPM](https://github.com/yujikawa/modscape/actions/workflows/publish.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Modscape** is a YAML-driven data modeling visualizer specialized for **Modern Data Stack** architectures. It bridges the gap between raw physical schemas and high-level business logic, empowering data teams to design, document, and share their data stories.

🌐 **Live Demo:**
https://yujikawa.github.io/modscape/

![Modscape Screenshot](https://raw.githubusercontent.com/yujikawa/modscape/main/docs/assets/modscape.png)

## Why Modscape?

In modern data analysis platforms, data modeling is no longer just about drawing boxes. It's about maintaining a **Single Source of Truth (SSOT)** that is version-controllable, AI-friendly, and understandable by both engineers and stakeholders.

- **For Data Engineers**: Maintain clear mappings between physical tables and logical entities. Visualize complex **Data Vault** or **Star Schema** structures.
- **For Analytics Engineers**: Design modular dbt-ready models. Document table grains, primary keys, and relationships before writing a single line of SQL.
- **For Data Scientists**: Discover data through **Sample Stories**. Understand the purpose and content of a table through integrated sample data previews without running a single query.

## Key Features

- **YAML-as-Code**: Define your entire data architecture in a single, human-readable YAML file. Track changes via Git.
- **Tri-Layer Naming System**: Document entities across three levels of abstraction: **Conceptual** (Visual name), **Logical** (Formal business name), and **Physical** (Actual database table name).
- **Auto-Format Layout**: Automatically arrange tables and domains based on their relationships using an intelligent hierarchical layout engine (Note: manual adjustment may be required for complex models).
- **Redesigned Modeling Nodes**: Protruding "Index Tabs" for entity types (FACT, DIM, HUB, LINK, etc.) and auto-truncating physical names for a professional look.
- **Interactive Visual Canvas**: 
  - **Drag-to-Connect**: Create relationships between columns intuitively with "Magnetic Snapping".
  - **Semantic Edge Badges**: Visually identify cardinality with `( 1 )` and `[ N ]` badges at the connection points.
  - **Data Lineage Mode**: Visualize data flow with animated dashed arrows.
  - **Domain-Grouped Navigation**: Organize tables into visual business domains and navigate them via a structured sidebar.
- **Unified Undo/Redo & Auto-save**: 
  - Visual actions (dragging, formatting, editing) are synchronized with the built-in CodeMirror editor's history.
  - Optional **Auto-save** ensures your local YAML is always up-to-date.
- **Dark/Light Mode Support**: Switch between themes seamlessly for better eye comfort or documentation exports.
- **Specialized Modeling Types**: Native support for entity types like `fact`, `dimension`, `mart`, `hub`, `link`, `satellite`, and generic `table`.
- **AI-Agent Ready**: Built-in scaffolding for **Gemini CLI, Claude Code, and Codex** — both for modeling (`/modscape:modeling`) and implementation code generation (`/modscape:codegen`).

## Installation

Install Modscape globally via npm:

```bash
npm install -g modscape
```

---

## Getting Started

### Path A: AI-Driven Modeling (Recommended)
Leverage AI coding assistants (**Gemini CLI, Claude Code, or Codex**) to build your models.

1.  **Initialize**: Scaffold modeling rules and commands for your preferred agent.
    ```bash
    modscape init --gemini   # Gemini CLI
    modscape init --claude   # Claude Code
    modscape init --codex    # Codex
    modscape init --all      # all three
    ```
    This creates `.modscape/rules.md` (YAML schema rules) and `.modscape/codegen-rules.md` (code generation rules), plus agent-specific command files.

    > **Updating rules**: After upgrading Modscape, re-run `modscape init` to overwrite `.modscape/rules.md` and `.modscape/codegen-rules.md` with the latest bundled version.

2.  **Start Dev**: Launch the visualizer.
    ```bash
    modscape dev model.yaml
    ```

3.  **Model with AI** — use `/modscape:modeling` to design your data model:
    > *"Use the rules in .modscape/rules.md to add a new 'Marketing' domain with a 'campaign_performance' fact table."*

4.  **Generate implementation code** — use `/modscape:codegen` to turn your YAML into dbt / SQLMesh / Spark SQL:
    > *"Follow .modscape/codegen-rules.md and generate dbt models from model.yaml."*

    The agent generates models in the correct dependency order and adds `-- TODO:` comments wherever the YAML doesn't fully specify the logic.

### Path B: Manual Modeling
Best for direct architectural control.

1.  **Create YAML**: Create a file named `model.yaml` (see [YAML Reference](#defining-your-model-yaml)).
2.  **Start Dev**: Launch the visualizer.
    ```bash
    modscape dev model.yaml
    ```

---

## Defining Your Model (YAML)

Modscape uses a schema designed for data analysis contexts. The full YAML structure is:

```
domains      – visual containers grouping related tables
tables       – entity definitions with tri-layer metadata
relationships – ER cardinality between tables
lineage      – data flow / transformation paths
annotations  – sticky notes / callouts on the canvas
layout       – ALL coordinate data (never put x/y inside tables or domains)
```

### Domains

```yaml
domains:
  - id: core_sales
    name: "Core Sales"
    description: "Transactional data for the sales team."  # optional
    color: "rgba(59, 130, 246, 0.1)"  # background fill
    tables: [orders, dim_customers]   # logical membership
    isLocked: false  # prevent accidental drag when true
```

### Tables

```yaml
tables:
  - id: orders
    name: Orders                          # Conceptual name (large)
    logical_name: "Customer Purchase Record"  # Logical name (medium)
    physical_name: "fct_retail_sales"         # Physical table name (small)

    appearance:
      type: fact        # fact | dimension | mart | hub | link | satellite | table
      sub_type: transaction  # transaction | periodic | accumulating | etc.
      scd: type2        # SCD type for dimensions: type0–type6
      icon: "💰"
      color: "#e0f2fe"  # optional custom header color

    conceptual:  # optional – business context for AI agents
      description: "One row per order line item."
      tags: [WHO, WHAT, WHEN]  # BEAM* tags
      businessDefinitions:
        revenue: "Net revenue after discounts"

    implementation:  # optional – hints for AI code generation
      materialization: incremental  # table | view | incremental | ephemeral
      incremental_strategy: merge   # merge | append | delete+insert
      unique_key: order_id
      partition_by:
        field: order_date       # use a DATE/TIMESTAMP column, not a surrogate key
        granularity: day        # day | month | year | hour
      cluster_by: [customer_id]
      grain: [month_key]        # GROUP BY columns (mart only)
      measures:                 # aggregation definitions (mart only)
        - column: total_revenue
          agg: sum              # sum | count | count_distinct | avg | min | max
          source_column: fct_sales.amount

    columns:
      - id: order_id
        logical:
          name: "Order ID"
          type: Int         # Int | String | Decimal | Date | Timestamp | Boolean | ...
          description: "Surrogate key."
          isPrimaryKey: true
          isForeignKey: false
          isPartitionKey: false
          isMetadata: false  # true for audit cols (load_date, record_source)
          additivity: fully  # fully | semi | non
        physical:  # optional warehouse overrides
          name: order_id
          type: "BIGINT"
          constraints: [NOT NULL]

    sampleData:  # 2D array of realistic values
      - [1001, 50.0, "COMPLETED"]
      - [1002, 120.5, "PENDING"]
```

### Data Lineage

Top-level `lineage` section declares data flow between tables (which source tables feed which derived tables). This is rendered as dashed arrows in **Lineage Mode**.

```yaml
lineage:
  - from: fct_orders    # source table ID
    to: mart_revenue    # derived table ID
  - from: dim_dates
    to: mart_revenue
```

### Relationships

```yaml
relationships:
  - from:
      table: dim_customers   # table ID
      column: customer_id    # column ID (optional)
    to:
      table: fct_orders
      column: customer_id
    type: one-to-many  # one-to-one | one-to-many | many-to-one | many-to-many
```

> **ER Relationships** vs **Lineage**: Use `relationships` for structural joins (FKs) and `lineage` for data flow (transformations). Do not duplicate them.

### Annotations

```yaml
annotations:
  - id: note_001
    type: sticky   # sticky | callout
    text: "Grain: one row per invoice line item."
    color: "#fef9c3"          # optional background color
    targetId: fct_orders      # ID of the attached object (optional)
    targetType: table         # table | domain | relationship | column
    offset:
      x: 100    # offset from target's top-left (or absolute if no target)
      y: -80
```

### Layout

All coordinate data lives in `layout`, keyed by object ID. **Never** place `x`/`y` inside `tables` or `domains`.

```yaml
layout:
  # Domain – requires width and height
  core_sales:
    x: 0
    y: 0
    width: 880
    height: 480
    isLocked: false  # prevent drag in canvas

  # Table inside a domain – coordinates are relative to domain origin
  orders:
    x: 280
    y: 200
    parentId: core_sales  # declare domain membership

  # Standalone table – absolute canvas coordinates
  mart_summary:
    x: 1060
    y: 200
```

---

## Usage

### Development Mode (Interactive)
```bash
modscape dev ./models
```
- **Persistence**: Layout and metadata changes are saved directly to your files (supports Auto-save).

### Create New Model
```bash
modscape new models/sales/customer.yaml
```
- **Recursive Scaffolding**: Automatically creates parent directories if they don't exist.
- **Boilerplate**: Generates a valid YAML model with examples of domains, tri-layer naming, relationships, and lineage.

### Build Mode (Static Site)
```bash
modscape build ./models -o docs-site
```

### Export Mode (Markdown)
```bash
modscape export ./models -o docs/ARCHITECTURE.md
```

## Credits

Modscape is made possible by these incredible open-source projects:

- [CodeMirror 6](https://codemirror.net/) - Next-generation code editor for the web.
- [Dagre](https://github.com/dagrejs/dagre) - Directed graph layout engine.
- [Lucide React](https://lucide.dev/) - Beautifully simple pixel-perfect icons.
- [Zustand](https://github.com/pmndrs/zustand) - Bear necessities for state management.
- [js-yaml](https://github.com/nodeca/js-yaml) - JavaScript YAML parser and dumper.

## License
MIT
