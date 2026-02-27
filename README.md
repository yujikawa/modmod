# ModMod (Modeling-Modeler)

ModMod is a YAML-driven data modeling visualizer. It helps data engineers and architects bridge the gap between conceptual, logical, and physical data models while maintaining sample data "stories" (BEAM* style).

![ModMod Visualizer Screenshot](https://raw.githubusercontent.com/yujikawa/modmod/main/docs/screenshot.png) *(Placeholder for screenshot)*

## Features

- **YAML-First**: Define your entire data model in a single, simple YAML file.
- **Multi-Layered**: Toggle between Conceptual, Logical, and Physical views.
- **Interactive ER Diagram**: Drag-and-drop entities to create the perfect layout.
- **Layout Persistence**: Your diagram layout is automatically saved back to the YAML file.
- **CLI-Driven Workflow**:
  - `modmod dev`: Interactive editor with hot-reloading.
  - `modmod build`: Package your model into a standalone static site.

## Installation

### Prerequisites
- Node.js (v18 or higher)

### Global Installation (via GitHub)
You can install ModMod directly from GitHub to use the `modmod` command anywhere:

```bash
npm install -g https://github.com/yujikawa/modmod
```

### Local Setup (for Development)
```bash
# Clone the repository
git clone https://github.com/yujikawa/modmod.git
cd modmod

# Install dependencies for both CLI and Visualizer
npm install
cd visualizer && npm install
cd ..

# Link the command to your system
npm link
```

## Usage

### 1. Development Mode (Interactive Editor)
Start a local session to edit your YAML and arrange entities.

```bash
modmod dev my-model.yaml
```
- Opens `http://localhost:5173` automatically.
- Edit YAML in the sidebar to see live updates.
- Drag entities to save their positions directly to `my-model.yaml`.

### 2. Static Site Build
Generate a standalone documentation site from your YAML model.

```bash
modmod build my-model.yaml -o ./docs-site
```
- Generates a `docs-site/` folder with `index.html`.
- Perfect for hosting on **GitHub Pages**, S3, or Netlify.

## YAML Schema Example

```yaml
tables:
  - id: customers
    name: Customers
    conceptual:
      description: "People who purchased products."
      tags: ["WHO", "PARTY"]
    columns:
      - id: cust_id
        logical: { name: "Customer ID", type: "Integer", isPrimaryKey: true }
        physical: { name: "id", type: "SERIAL" }
    sampleData:
      columns: ["cust_id"]
      rows:
        - [1]
        - [2]

relationships:
  - from: { table: customers, column: cust_id }
    to: { table: orders, column: cust_id }
    type: "one-to-many"
```

## License
MIT
