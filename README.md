# <img src="./visualizer/public/favicon.svg" width="32" height="32" align="center" /> Modscape

[![npm version](https://img.shields.io/npm/v/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![npm downloads](https://img.shields.io/npm/dm/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![Deploy Demo](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml)
[![Publish to NPM](https://github.com/yujikawa/modscape/actions/workflows/publish.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Modscape** is a YAML-driven data modeling visualizer specialized for **Modern Data Stack** architectures. It bridges the gap between raw physical schemas and high-level business logic, empowering data teams to design, document, and share their data stories.

[Live Demo](https://yujikawa.github.io/modscape/)

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
  - **Semantic Edge Badges**: Visually identify cardinality with `( 1 )` and `[ M ]` badges at the connection points.
  - **Data Lineage Mode**: Visualize data flow with animated dashed arrows.
  - **Domain-Grouped Navigation**: Organize tables into visual business domains and navigate them via a structured sidebar.
- **Unified Undo/Redo & Auto-save**: 
  - Visual actions (dragging, formatting, editing) are synchronized with the built-in CodeMirror editor's history.
  - Optional **Auto-save** ensures your local YAML is always up-to-date.
- **Dark/Light Mode Support**: Switch between themes seamlessly for better eye comfort or documentation exports.
- **Specialized Modeling Types**: Native support for entity types like `fact`, `dimension`, `mart`, `hub`, `link`, `satellite`, and generic `table`.
- **AI-Agent Ready**: Built-in scaffolding for **Gemini, Claude, and Codex** to accelerate your modeling workflow using LLMs.

## Installation

Install Modscape globally via npm:

```bash
npm install -g modscape
```

---

## Getting Started

### Path A: AI-Driven Modeling (Recommended)
Leverage AI coding assistants (**Gemini CLI, Claude Code, or Codex**) to build your models.

1.  **Initialize**: Scaffold modeling rules and instructions for your preferred agent.
    ```bash
    # For Gemini CLI
    modscape init --gemini

    # For Claude Code
    modscape init --claude

    # For Codex
    modscape init --codex
    ```
2.  **Start Dev**: Launch the visualizer.
    ```bash
    modscape dev model.yaml
    ```
3.  **Prompt Your AI**: Tell your agent: *"Use the rules in .modscape/rules.md to add a new 'Marketing' domain with a 'campaign_performance' fact table to my model.yaml."*

### Path B: Manual Modeling
Best for direct architectural control.

1.  **Create YAML**: Create a file named `model.yaml` (see [YAML Reference](#defining-your-model-yaml)).
2.  **Start Dev**: Launch the visualizer.
    ```bash
    modscape dev model.yaml
    ```

---

## Defining Your Model (YAML)

Modscape uses a schema designed for data analysis contexts.

```yaml
# 1. Domains: Visual containers for grouping business logic
domains:
  - id: core_sales
    name: Core Sales
    color: "rgba(59, 130, 246, 0.1)"
    tables: [orders]

# 2. Tables: Entity definitions with tri-layer metadata
tables:
  - id: orders
    name: Orders           # Conceptual (Big)
    logical_name: "Customer Purchase Record" # Logical (Medium)
    physical_name: "fct_retail_sales"        # Physical (Small)
    appearance:
      type: fact    # fact | dimension | mart | hub | link | satellite | table
      sub_type: transaction 
      icon: 💰
    columns:
      - id: order_id
        logical:
          name: ORDER_ID
          type: Int
          isPrimaryKey: true
          additivity: fully
    sampleData:
      - [order_id, amount, status]
      - [1001, 50.0, "COMPLETED"]

# 3. Relationships: Define ER cardinality
relationships:
  - from: { table: customers, column: customer_id }
    to: { table: orders, column: customer_id }
    type: one-to-many
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

- [React Flow](https://reactflow.dev/) - Interactive node-based UI framework.
- [CodeMirror 6](https://codemirror.net/) - Next-generation code editor for the web.
- [Dagre](https://github.com/dagrejs/dagre) - Directed graph layout engine.
- [Lucide React](https://lucide.dev/) - Beautifully simple pixel-perfect icons.
- [Zustand](https://github.com/pmndrs/zustand) - Bear necessities for state management.
- [js-yaml](https://github.com/nodeca/js-yaml) - JavaScript YAML parser and dumper.

## License
MIT
