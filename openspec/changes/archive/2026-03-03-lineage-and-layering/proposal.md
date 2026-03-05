## Why

Modern data stack architectures (like dbt projects) rely on clear layering (Source -> Staging -> Mart) and lineage. Modscape currently focuses on static ER structure. Adding Lineage and Layering allows data professionals to design and document the entire data journey, making it a comprehensive blueprint for both humans and AI agents.

## What Changes

- **Schema Extension**: 
  - Add `appearance.layer` to tables (e.g., `source`, `staging`, `intermediate`, `mart`).
  - Add `lineage.upstream` to tables to define data dependencies.
- **Lineage Visualization**:
  - Implement a dedicated "Lineage Edge" (curved blue arrows) distinct from "Relationship Edges".
  - Arrows use **dashed lines** and **animations** to represent active data flow.
- **Independent Toggles**:
  - Add independent switches for **ER** and **Lineage** visibility.
  - Support simultaneous display of both modes.
- **Layering UI**:
  - Implement a **floating tab** design for layer badges on the top-left of tables.
- **Interaction Freedom**:
  - Implement **bidirectional ER connections** with automatic source/target swapping.
  - Implement **read-only mode** when both visualization modes are active to prevent ambiguity.

## Capabilities

### New Capabilities
- `data-lineage`: Visualizing table dependencies as directional flow arrows.

### Modified Capabilities
- `visualizer-core`: Support for multiple edge types, layer-specific visual cues, and simultaneous mode rendering.
- `hierarchical-layout`: Support for left-to-right processing flow based on layer metadata.

## Impact

- `visualizer/src/types/schema.ts`: Schema updates.
- `visualizer/src/App.tsx`: Mode management, edge generation, and bidirectional connection logic.
- `visualizer/src/components/TableNode.tsx`: Floating layer tab and multi-mode handle visibility.
- `visualizer/src/components/LineageEdge.tsx`: New component for data flow visualization.
