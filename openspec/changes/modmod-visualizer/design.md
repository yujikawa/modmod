## Context

Currently, data designers use separate tools for conceptual diagrams, logical schemas, and physical DDLs. There is no unified view that connects these layers with actual sample data (BEAM* style). This tool aims to provide that missing link by rendering a multi-layered view from a single YAML definition.

## Goals / Non-Goals

**Goals:**
- Provide a simple YAML schema to define data models.
- Render an interactive ER-style diagram.
- Implement a slide-up detail panel with tabs for Conceptual, Logical, Physical, and Sample Data.
- Support BEAM* style sample data stories.

**Non-Goals:**
- User authentication or multi-user support in the MVP.
- Persistent database for storing models (it will work with uploaded/pasted YAML).
- Generating DDL or code from the models (initially).

## Decisions

- **Framework**: React + Vite + TypeScript.
  - *Rationale*: Modern, fast development cycle, and strong type safety.
- **Diagramming**: React Flow.
  - *Rationale*: Specifically designed for building node-based editors/visualizers in React. Highly extensible for custom card nodes.
- **Styling**: Tailwind CSS + Shadcn UI.
  - *Rationale*: Rapid UI development with a consistent look and feel.
- **YAML Parsing**: `js-yaml`.
  - *Rationale*: Reliable and standard library for handling YAML in JavaScript.
- **State Management**: Zustand.
  - *Rationale*: Simple, boilerplate-free state management for handling the current model and selection state.

## Risks / Trade-offs

- **Cluttered Diagrams**: [Risk] Large models might become difficult to read on a single canvas. → [Mitigation] Implement basic zoom/pan and consider future filtering or "focus mode" capabilities.
- **YAML Complexity**: [Risk] The schema might become verbose as models grow. → [Mitigation] Keep the schema as flat and intuitive as possible, using sensible defaults (e.g., auto-generating physical names if omitted).
- **Performance**: [Risk] Large sample data sets could slow down the UI. → [Mitigation] Use virtualized lists or pagination for the sample data grid.
