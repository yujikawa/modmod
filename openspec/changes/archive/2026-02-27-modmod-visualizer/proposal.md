## Why

Data engineering projects often struggle with bridging the gap between abstract models (Conceptual, Logical) and actual data implementation (Physical, Sample). This tool allows designers and stakeholders to visualize the entire data evolution on a single page using a simple YAML definition, improving alignment and reducing errors during implementation.

## What Changes

- **New YAML-driven data modeling visualizer**: A web-based tool that takes a YAML file defining tables, their mappings across conceptual/logical/physical layers, and sample data.
- **Interactive ER-style diagram**: A main canvas displaying tables and their relationships, allowing users to select tables for detailed inspection.
- **Tabbed detail panel**: A slide-up panel that shows specific metadata for the selected table, separated into Conceptual, Logical, Physical, and Sample Data tabs.
- **BEAM* style sample data**: Support for capturing and displaying sample data "stories" to ground the design in reality.

## Capabilities

### New Capabilities
- `visualizer-core`: The engine for parsing the YAML definition and rendering the interactive ER diagram on a canvas.
- `detail-panel`: The interactive UI component that displays the tabbed view for Conceptual, Logical, and Physical model metadata.
- `sample-data-grid`: A specialized view for rendering BEAM* style sample data stories within the detail panel.

### Modified Capabilities
- None

## Impact

- **New standalone web application**: Built with React, Vite, and TypeScript.
- **New YAML schema**: A defined structure for specifying multi-layered data models.
- **No impact on existing codebase**: This is a new project/feature being introduced.
