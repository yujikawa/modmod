## Context

The `ButtonEdge` component uses React Flow's `getSmoothStepPath` to calculate line segments. We need to find stable coordinates near the start and end of this path to place our new semantic badges.

## Goals / Non-Goals

**Goals:**
- Replace the central label with dual semantic badges.
- Badges must represent cardinality accurately (`1` vs `M`).
- Support theme-aware, semi-transparent default states.
- Ensure badges don't "jump" too much when nodes are moved.

**Non-Goals:**
- Implementing this for Lineage edges (Lineage edges don't have cardinality).

## Decisions

### 1. Badge Positioning
We will use fixed pixel offsets (around 40px) from the `source` and `target` handles instead of path percentage (e.g., 15%). 
- **Source Badge**: Positioned near `(sourceX, sourceY)`.
- **Target Badge**: Positioned near `(targetX, targetY)`, slightly before the arrow marker.

### 2. Semantic Mapping
The `label` (e.g., `one-to-many`) will be parsed:
- First part (`one`) -> Source Badge
- Second part (`many`) -> Target Badge
- Symbols: `one` -> `1`, `many` -> `M`.

### 3. Visual Styling (Glassmorphism)
- **Shape**:
  - `1`: `rounded-full` (Circle)
  - `M`: `rounded-md` (Square)
- **Resting state**: `opacity-30`.
- **High-visibility state**: `opacity-100`.
- **Backdrop**: `backdrop-blur-sm`.

### 4. Code Structure
- Add helper functions to `ButtonEdge.tsx` to parse the relation string and calculate label coordinates.

## Risks / Trade-offs

- **[Risk] Badge Overlap**: In very short edges, the two badges might overlap.
  - *Mitigation*: Fallback to a single badge or hide them if the distance is below a threshold (e.g., 80px).
