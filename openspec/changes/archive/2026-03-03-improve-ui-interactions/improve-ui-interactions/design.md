## Context

Modern creative and engineering tools (Figma, VS Code) use stable, peripheral toolbars and flexible workspace panels. Modscape's v1.0 path requires this level of UX polish to handle complex data models without frustrating the user with layout shifts.

## Goals / Non-Goals

**Goals:**
- Provide a fixed "home" for core tools (left-side vertical).
- Allow user-defined workspace balance (resizable bottom panel).
- Prevent UI components from overlapping or fighting for space.

**Non-Goals:**
- Making the toolbar itself resizable or draggable (fixed position is better for muscle memory).

## Decisions

### 1. The Vertical Toolbox (Left side)
The toolbar is now a single, solid 14-unit wide panel.
- **Position**: Fixed at `top: 1rem`, `left: 1rem`. This avoids collision with the Detail Panel which rises from the bottom.
- **Structure**: Grouped into `View` (top) and `Add` (bottom) with a subtle divider.
- **Visuals**: `backdrop-blur-md` with `slate-900/85` background for a premium look.

### 2. Resizable Workspace (Detail Panel)
Managed via a local `panelHeight` state in `DetailPanel.tsx`.
- **Interaction**: A hidden 8px handle area sits at the top border. Mouse cursor changes to `ns-resize`.
- **Logic**: A global `mousemove` listener tracks the Y-offset from the window bottom to calculate height.
- **Constraints**: Minimum 150px, Maximum 90vh.

### 3. Decoupled Selection Bar
The selection bar (Delete, Selection info) is now a separate "floating island" in the top-right.
- **Rationale**: It only exists when a context exists, so it shouldn't push permanent tools around.

## Risks / Trade-offs

- **[Risk] Mouse Event Overlap** → Mitigation: Use `e.stopPropagation()` and custom cursors to ensure resizing feels smooth and doesn't trigger canvas drags.
