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
- **Specialized Modeling Types**: Native support for entity types like `fact`, `dimension`, `hub`, `link`, and `satellite`.
- **Sample Data Stories**: Attach real-world data samples to your entities to explain the "Story" behind the data.
- **Interactive Visual Canvas**: 
  - **Drag-to-Connect**: Create relationships between columns intuitively.
  - **Auto-Layout Persistence**: Arrange nodes on the canvas; coordinates are saved directly back to your YAML.
  - **Domain Grouping**: Organize tables into visual business domains.
- **AI-Agent Ready**: Built-in scaffolding for **Gemini, Claude, and Codex** to accelerate your modeling workflow using LLMs.
- **Documentation Export**: Generate Mermaid-compatible Markdown for your internal wikis or GitHub/GitLab pages.

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
3.  **Explore Samples**: Try the built-in patterns:
    ```bash
    modscape dev samples/
    ```

---

## Defining Your Model (YAML)

Modscape uses a schema designed for data analysis contexts.

```yaml
# 1. Domains: Visual containers for business logic
domains:
  - id: core_sales
    name: Core Sales
    color: "rgba(59, 130, 246, 0.05)"
    tables: [orders, products]

# 2. Tables: Entity definitions with multi-layer metadata
tables:
  - id: orders
    name: ORDERS
    appearance:
      type: fact    # fact | dimension | hub | link | satellite
      icon: 📦      # Visual cue for the entity
    conceptual:
      description: "Sales transaction records"
      tags: ["WHO", "WHEN", "HOW MUCH"] # Grain identifiers
    physical:
      name: STG_ORDERS
      schema: ANALYTICS_DB
    columns:
      - id: order_id
        logical: { name: ORDER_ID, type: Int, isPrimaryKey: true }
      - id: customer_id
        logical: { name: CUSTOMER_ID, type: Int, isForeignKey: true }
    
    # 3. Sample Data: Telling the story through data
    sampleData:
      - [1001, 501]
      - [1002, 502]

# 4. Relationships: Column-level connectivity
relationships:
  - from: { table: orders, column: customer_id }
    to: { table: customers, column: id }
    type: many-to-one
```

---

## Usage

### Development Mode (Interactive)
Edit your YAML and arrange entities visually.

```bash
modscape dev ./models
```
- Opens `http://localhost:5173`.
- **Persistence**: Layout and metadata changes are saved directly to your files.

### Build Mode (Static Site)
Generate a standalone documentation site for your team.

```bash
modscape build ./models -o docs-site
```

### Export Mode (Markdown)
Generate documentation with Mermaid diagrams.

```bash
modscape export ./models -o docs/ARCHITECTURE.md
```

## AI Agent Integration

Modscape is designed to be **AI-First**. By running `modscape init`, you establish a contract with your AI agent via `.modscape/rules.md`, ensuring consistent modeling patterns (naming conventions, data types, etc.) across your entire project.

## Credits

Modscape is built upon:
- **React Flow**: Interactive graph engine.
- **Lucide**: Consistent iconography.
- **Express**: Local dev server.
- **Commander**: CLI framework.

## License
MIT
