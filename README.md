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
- **Instant Local Visualization**: Visualize your YAML models instantly on your machine. No database connections or cloud infrastructure required—just point to your file and start exploring.
- **Integrated Professional Editor**: Powered by **CodeMirror 6**, providing syntax highlighting and a rich YAML editing experience directly in the sidebar.
- **Unified Undo/Redo & Auto-save**: 
  - Visual actions (dragging, resizing, metadata edits) are synchronized with the editor's history. Undo your last action with `Ctrl+Z`.
  - Optional **Auto-save** ensures your local YAML is always up-to-date with your visual changes.
- **Dark/Light Mode Support**: Switch between themes seamlessly for better eye comfort or documentation exports.
- **Specialized Modeling Types**: Native support for entity types like `fact`, `dimension`, `mart`, `hub`, `link`, and `satellite`.
- **Interactive Visual Canvas**: 
  - **Drag-to-Connect**: Create relationships between columns intuitively with "Magnetic Snapping".
  - **Data Lineage Mode**: Visualize data flow with animated dashed arrows.
  - **Domain-Grouped Navigation**: Organize tables into visual business domains and navigate them via a structured sidebar.
- **Analytics Metadata**: 
  - **Fact Table Types**: Define `transaction`, `periodic`, `accumulating`, or `factless` grains.
  - **SCD Management**: Visualize `SCD Type 2` and other history-tracking dimensions.
  - **Additivity Rules**: Mark columns as `fully`, `semi`, or `non-additive` (Σ icon).
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
    color: "#3b82f6"
    tables: [orders, products]

# 2. Tables: Entity definitions with multi-layer metadata
tables:
  - id: orders
    name: ORDERS
    appearance:
      type: fact    # fact | dimension | mart | hub | link | satellite
      sub_type: transaction 
      scd: type2
      icon: 📦
    columns:
      - id: order_id
        logical:
          name: ORDER_ID
          type: Int
          isPrimaryKey: true
          additivity: fully # fully | semi | non (Σ icon)
          isMetadata: false # audit column (🕒 icon)
```

---

## Usage

### Development Mode (Interactive)
```bash
modscape dev ./models
```
- **Persistence**: Layout and metadata changes are saved directly to your files (supports Auto-save).

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
- [Lucide React](https://lucide.dev/) - Beautifully simple pixel-perfect icons.
- [Zustand](https://github.com/pmndrs/zustand) - Bear necessities for state management.
- [Express](https://expressjs.com/) - Fast, unopinionated web framework for Node.js.
- [js-yaml](https://github.com/nodeca/js-yaml) - JavaScript YAML parser and dumper.
- [Commander.js](https://github.com/tj/commander.js) - CLI framework.

## License
MIT
