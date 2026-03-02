# <img src="./visualizer/public/favicon.svg" width="32" height="32" align="center" /> Modscape

[![npm version](https://img.shields.io/npm/v/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![npm downloads](https://img.shields.io/npm/dm/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![Deploy Demo](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml)
[![Publish to NPM](https://github.com/yujikawa/modscape/actions/workflows/publish.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Modscape is a YAML-driven data modeling visualizer. It helps data engineers and architects bridge the gap between conceptual, logical, and physical data models while maintaining sample data "stories".

[Live Demo](https://yujikawa.github.io/modscape/)

## Features

- **YAML-First**: Define your entire data model in a single, simple YAML file.
- **Unified Sidebar**: A feature-rich sidebar for navigation, search, and YAML editing.
- **Interactive Modeling**: 
  - **Drag-to-Connect**: Create relationships by dragging from a column handle to another table.
  - **Property Editor**: Edit table and relationship metadata directly in the UI.
  - **Interactive Deletion**: Remove tables or relationships with a single click.
- **Sample Data "Stories"**: Attach sample data to entities to explain the data's purpose.
- **Smart Layout**: 
  - **Auto-Positioning**: Arrange entities via drag-and-drop; positions are saved directly back to your YAML.
  - **Adaptive Sizing**: Tables with many columns are automatically capped at 10 rows with scrolling for better canvas visibility.
- **Multi-file Support**: Manage multiple models in a single directory and switch between them seamlessly.
- **Documentation Export**: Generate Mermaid-compatible Markdown documentation including ER diagrams and domain catalogs.
- **AI-Agent Ready**: Scaffolding for Gemini, Claude, and Codex to help you model via AI.

## Installation

Install Modscape globally via npm:

```bash
npm install -g modscape
```

---

## Getting Started

Choose the path that fits your workflow.

### Path A: AI-Driven Modeling (Recommended)
Best if you use AI coding assistants (Gemini CLI, Claude Code, Cursor/Codex).

1.  **Initialize**: Scaffold modeling rules and AI agent instructions.
    ```bash
    modscape init
    ```
2.  **Start Dev**: Launch the visualizer on your model.
    ```bash
    modscape dev model.yaml
    ```
3.  **Prompt Your AI**: Tell your agent to use the rules in `.modscape/rules.md` to add tables or columns to your `model.yaml`.

### Path B: Manual Modeling
Best for direct YAML editing and architectural control.

1.  **Create YAML**: Create a file named `model.yaml` (see [Defining Your Model](#defining-your-model-yaml)).
2.  **Start Dev**: Launch the visualizer.
    ```bash
    modscape dev model.yaml
    ```
3.  **Explore Samples**: Try it out with our built-in samples:
    ```bash
    # Clone the repo or download the samples directory
    modscape dev samples/
    ```

---

## Defining Your Model (YAML)

Modscape uses a comprehensive yet human-readable YAML schema. This single file acts as the **Single Source of Truth** for your conceptual, logical, and physical data models.

### Complete YAML Reference

```yaml
# 1. Domains: Visual containers to group related tables
domains:
  - id: sales_domain
    name: Sales & Orders
    description: Core commerce transactions
    color: "rgba(59, 130, 246, 0.05)" # Container background
    tables: [orders, order_items] # List of table IDs

# 2. Tables: Entity definitions
tables:
  - id: orders
    name: ORDERS
    appearance:
      type: fact    # fact | dimension | hub | link | satellite
      icon: 📦      # Any emoji or character
      color: "#f87171" # Custom theme color for this entity
    
    conceptual:
      description: "Records of customer purchases"
      tags: ["WHAT", "WHEN"] # BEAM* methodology tags
    
    physical:
      name: T_ORDERS     # Actual table name in database
      schema: RAW_SALES  # Database schema name
    
    columns:
      - id: order_id
        logical:
          name: ORDER_ID
          type: Integer
          description: "Unique identifier for an order"
          isPrimaryKey: true
        physical:
          name: O_ID
          type: NUMBER(38,0)
          constraints: ["NOT NULL"]
      
      - id: customer_id
        logical:
          name: CUSTOMER_ID
          type: Integer
          isForeignKey: true

    # 3. Sample Data: Realistic data for storytelling
    # (Direct 2D array, mapped to logical columns by index)
    sampleData:
      - [1001, 501]
      - [1002, 502]

# 4. Relationships: Connections between tables
relationships:
  - from: { table: orders, column: customer_id }
    to: { table: customers, column: id }
    type: many-to-one # one-to-one | one-to-many | many-to-many

# 5. Layout: Visual coordinates (Auto-managed)
# You don't need to write this manually; Modscape updates it on drag.
layout:
  orders: { x: 100, y: 100, width: 320, height: 400 }
```

### Schema Breakdown

| Section | Field | Description |
| :--- | :--- | :--- |
| **`domains`** | `color` | Defines the background of the grouping container in the visualizer. |
| **`appearance`**| `type` | Determines the header icon/color if not specified (Standard: Star Schema or Data Vault). |
| **`conceptual`**| `tags` | Business context tags. Great for identifying key modeling grains (WHO, WHAT, WHERE). |
| **`physical`** | `name`/`schema` | Maps the logical entity to your real database objects. |
| **`columns`** | `isPrimaryKey` | Adds a 🔑 icon and marks the grain of the table. |
| | `isForeignKey` | Adds a 🔩 icon to indicate a downstream connection. |
| **`sampleData`**| - | A direct 2D array of rows. Values are mapped to logical columns by index. |
| **`relationships`**| `type` | Controls the arrowheads and visual style of the connection lines. |

---

## Usage

### Development Mode (Interactive Editor)
Start a local session to edit your YAML and arrange entities.

```bash
# Point to a directory to manage all models within it
modscape dev models/

# Or point to a specific file
modscape dev my-model.yaml
```
- Opens `http://localhost:5173` automatically.
- **Persistence**: Drag entities to save positions directly to the source YAML file.
- **Secure Routing**: Models are accessed via safe slugs, keeping your local paths private.

### Build Mode (Static Site Generation)
Generate a standalone static website to share your documentation (perfect for GitHub Pages).

```bash
modscape build models/ -o dist-site
```

### Export Mode (Static Documentation)
Generate a comprehensive Markdown document with embedded Mermaid diagrams.

```bash
# Print to stdout
modscape export models/ecommerce.yaml

# Save to a file
modscape export models/ -o docs/
```

## AI Agent Integration

Modscape is designed to work alongside AI coding assistants. By running `modscape init`, you get:

- **`.modscape/rules.md`**: The Single Source of Truth for your modeling conventions.
- **Agent Instructions**: Pre-configured prompts for Gemini, Claude, and Cursor/Codex.

Tell your AI: *"Follow the rules in .modscape/rules.md to add a new billing domain to my model.yaml."*

## Credits

Modscape is built upon several incredible open-source projects:

- **[React Flow](https://reactflow.dev/)**: Powering the interactive graph engine.
- **[Radix UI](https://www.radix-ui.com/)**: Providing accessible UI primitives.
- **[Lucide](https://lucide.dev/)**: Beautiful, consistent iconography.
- **[shadcn/ui](https://ui.shadcn.com/)**: Component patterns and design inspiration.
- **[Express](https://expressjs.com/)**: Serving the local development environment.

## License
MIT
