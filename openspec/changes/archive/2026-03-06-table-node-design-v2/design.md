## Context

We are evolving the `TableNode` from a simple rectangle into a specialized modeling object.

## Goals / Non-Goals

**Goals:**
- Protrude the Type indicator outside the main node body.
- Optimize the header for long physical table names.
- Maintain consistency with Dark and Light themes.

**Non-Goals:**
- Changing the column rendering logic (focus is on the header).

## Decisions

### 1. The "Index Tab" CSS
- **Position**: `absolute`, `top: -12px`, `left: 12px`.
- **Dimensions**: ~18px height, auto width based on text.
- **Styling**: Rounded top corners (`rounded-t-md`), no bottom rounded corners.
- **Shadow**: Light shadow to lift it from the background.

### 2. Header Content Layout
The header will use a vertical flexbox:
1.  **Conceptual (`name`)**: `text-base font-bold`.
2.  **Logical (`logical_name`)**: `text-xs text-slate-500`.
3.  **Physical (`physical_name` or `id`)**: `text-[9px] font-mono truncate max-w-full`.

### 3. Truncation & Hover
To handle long physical names:
- Use `overflow-hidden text-ellipsis`.
- Add a `title` attribute to the physical name div so the browser shows a native tooltip on hover.

### 4. Theme Adjustments
- **Dark Mode**: Tab uses vibrant color with subtle inner glow.
- **Light Mode**: Tab uses solid bold color, header uses slightly darker slate for logical/physical layers to ensure contrast against white background.

## Risks / Trade-offs

- **[Risk] Collision with Handles**: The top-middle ER handle might overlap with the tab if the tab is too wide.
  - *Mitigation*: The tab is left-aligned, and the ER handle is centered. We will keep the tab width constrained.
