## Context
The current layout logic in `App.tsx` simply assigns a fixed offset for each table based on its global index. This leads to tables being pushed out of their domain container if the domain contains many tables.

## Grid-based Layout Algorithm
For tables belonging to a domain, we will calculate their position using a **local index within the domain**:

- **Columns**: Default to 3 columns.
- **Cell Size**: `width: 320px`, `height: 250px`.
- **Local X**: `(index % 3) * 320 + padding_x`
- **Local Y**: `floor(index / 3) * 250 + padding_y`

## Dynamic Domain Sizing
The domain container size will be derived from the grid dimensions:

- **Rows**: `ceil(table_count / 3)`
- **Domain Width**: `max(2, min(table_count, 3)) * 320 + extra_padding`
- **Domain Height**: `max(1.5, rows) * 250 + extra_padding`

## Domain Offsetting
To prevent domains from overlapping, they will be arranged horizontally:
- **Domain X**: `domain_index * 1200`
- **Domain Y**: `0`

## Preservation Logic
- **Coordinates (x, y)**: Only apply auto-placement (grid/offset) if `x` or `y` is missing in the YAML's `layout` section.
- **Dimensions (width, height)**: 
  - If `width` or `height` is missing for a domain, calculate them dynamically based on the table count.
  - If `width` and `height` are provided, use them directly (Manual Override). This allows users to resize containers and persist their preferred size.
