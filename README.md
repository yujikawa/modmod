# <img src="./visualizer/public/favicon.svg" width="32" height="32" align="center" /> Modscape

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
