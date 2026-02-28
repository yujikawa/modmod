## Context

Currently, the visualizer only shows a key icon for Primary Keys. To support full architectural mapping (Data Vault, Star Schema, etc.), it's essential to see Foreign Keys and Partition Keys directly on the diagram and in the details.

## Goals / Non-Goals

**Goals:**
- Provide distinct icons for PK (`🔑`), FK (`🔩`), and Partition (`📂`).
- Ensure these icons are consistent between the diagram nodes and the detail panel.
- Update the schema to formally support partition keys.

**Non-Goals:**
- Automatic detection of FKs based on relationship names (this remains manual via `isForeignKey`).
- Visualizing complex partition strategies (only the key column is indicated).

## Decisions

### 1. Choice of Icons
- **Primary Key**: `🔑` (Gold Key) - Established convention.
- **Foreign Key**: `🔩` (Bolt) - Represents physical and logical connection between tables.
- **Partition Key**: `📂` (Folder) - Represents data organization and splitting.

### 2. Multi-role Rendering
- **Decision**: If a column has multiple roles (e.g., both PK and FK), show both icons.
- **Rationale**: It's common in Data Vault (Link tables) or bridge tables for a column to serve multiple purposes.

## Risks / Trade-offs

- **[Risk] Visual clutter**: Too many icons might make the node width grow too much.
  - **Mitigation**: Use small margins and ensure the table layout in `TableNode` handles icon spacing gracefully.
