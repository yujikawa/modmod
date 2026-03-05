## Why

Modscape aims to be a bridge between high-level business concepts and physical data implementation. Currently, only `id` and `name` are supported, which forces users to choose between technical clarity and business readability. A tri-layer naming system—Conceptual, Logical, and Physical—allows for a complete data story within a single entity, from the initial idea to the actual SQL table.

## What Changes

- **Schema Evolution**:
  - Add `logical_name` and `physical_name` to the `Table` object in the YAML schema.
- **Smart Fallback Display**:
  - **Layer 1: Conceptual (`name`)**: Top position, largest font.
  - **Layer 2: Logical (`logical_name`)**: Middle position, medium font. Hidden if empty or identical to `name`.
  - **Layer 3: Physical (`physical_name`)**: Bottom position, smallest font (monospace). Defaults to `id` if empty.
- **Enhanced Table Node**:
  - Redesign the `TableNode` header to accommodate the three vertical layers.
- **Detailed Editing**:
  - Update the `DetailPanel` to allow editing of all three name layers in their respective tabs (Conceptual, Logical, Physical).

## Capabilities

### Modified Capabilities
- `visualizer-core`: Refine table node rendering and schema normalization.
- `detail-panel`: Add input fields for the new naming layers.
- `rules-templating`: Update guidelines to explain the new naming hierarchy.

## Impact

- `visualizer/src/types/schema.ts`: Added naming fields to `Table` interface.
- `visualizer/src/lib/parser.ts`: Updated normalization logic for fallbacks.
- `visualizer/src/components/TableNode.tsx`: Redesigned header layout.
- `visualizer/src/components/DetailPanel.tsx`: Added editing UI.
