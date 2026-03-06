## Why

In complex data modeling, the gap between business definitions (Logical) and technical implementations (Physical) can lead to confusion. By displaying both the Logical name and the Physical name (or ID) directly within the column list of a table node, Modscape provides instant clarity for both data architects and engineers. This ensures that everyone can see not just what a piece of data *means*, but also where it is *stored*.

## What Changes

- **Refined Column Rendering**:
  - Update `TableNode.tsx` to render columns with a two-line layout when necessary.
  - **Line 1 (Logical)**: Primary display using the business name (e.g., "Customer ID").
  - **Line 2 (Physical)**: Sub-display using the technical name or ID (e.g., `cust_id`), rendered in a smaller, monospace font.
- **Smart Redundancy Handling**:
  - Hide the physical sub-line if the physical name/ID is identical to the logical name to maintain a clean UI for simpler models.
- **Improved Information Density**:
  - Adjust vertical padding and font sizes to ensure the table doesn't become excessively tall while adding this new layer of information.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Update entity visualization to include multi-layered column metadata.

## Impact

- `visualizer/src/components/TableNode.tsx`: Overhaul of the column mapping logic and JSX structure.
