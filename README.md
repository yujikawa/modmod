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
- **Sample Data "Stories"**: Attach sample data to entities to explain the data's purpose.
- **Interactive Layout**: Arrange entities via drag-and-drop; positions are saved directly back to your YAML.
- **Multi-file Support**: Manage multiple models in a single directory and switch between them seamlessly.
- **AI-Agent Ready**: Scaffolding for Gemini, Claude, and Codex to help you model via AI.

## Installation

Install Modscape globally via npm:

```bash
npm install -g modscape
```

## Quick Start in 3 Steps

### 1. Initialize your project
Create the necessary configuration and modeling rules for your project (and AI agents).

```bash
modscape init
```

### 2. Explore Samples
Try Modscape immediately using the built-in sample models.

```bash
# Clone the repo or download the samples directory to try this:
modscape dev samples/
```

### 3. Start Modeling
Create a `model.yaml` and launch the interactive visualizer.

```bash
modscape dev model.yaml
```

## Defining Your Model (YAML)

Modscape uses a human-readable YAML schema. While you can write it manually, we **highly recommend using an AI coding assistant** (like Gemini, Claude, or Cursor) to handle the boilerplate.

### Option A: AI-Assisted Modeling (Recommended)
After running `modscape init`, you can use the generated rules to "talk" to your model.

1.  **Open your AI agent.**
2.  **Point it to `.modscape/rules.md`.**
3.  **Give a prompt:**
    > "Based on the rules in `.modscape/rules.md`, add a `payments` table to `model.yaml` with columns for `amount` and `status`. Connect it to the `orders` table."

### Option B: Manual Definition
If you prefer to write YAML by hand, here is the basic structure:

```yaml
tables:
  - id: users
    name: USERS
    appearance:
      type: dimension # dimension | fact | hub | link | satellite
      icon: 👤
    columns:
      - id: user_id
        logical: { name: USER_ID, type: UUID, isPrimaryKey: true }
      - id: email
        logical: { name: EMAIL, type: String }

  # Data Vault Example
  - id: hub_customer
    name: HUB_CUSTOMER
    appearance: { type: hub, icon: 🔑 }
    columns:
      - id: hk_customer
        logical: { name: HK_CUSTOMER, type: Binary, isPrimaryKey: true }
      - id: customer_id
        logical: { name: CUSTOMER_ID, type: String }
```

- **Appearance Types**: 
  - `dimension` / `fact`: For Star Schema / Dimensional modeling.
  - `hub` / `link` / `satellite`: For Data Vault 2.0 modeling.
- **IDs**: Use lowercase, snake_case for `id` fields (used for internal linking).
- **Layout**: Don't worry about the `layout:` section. Modscape will automatically add and update coordinates when you drag entities in the browser.

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
