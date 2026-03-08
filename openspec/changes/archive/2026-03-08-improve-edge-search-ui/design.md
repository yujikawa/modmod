## Context

In the Path Finder tab of the right panel, users search for paths between tables. The resulting path shows steps consisting of tables and the relationships (edges) between them. Currently, these relationships are displayed as small badges with a generic gray background and text in light mode, which blends into the panel background and lacks semantic distinction.

## Goals / Non-Goals

**Goals:**
- Improve the visibility and readability of relationship badges in the Path Finder results for light mode.
- Introduce type-aware coloring to visually distinguish between Entity-Relationship (ER) and Lineage edges.
- Maintain existing dark mode styling while ensuring it remains clear.

**Non-Goals:**
- Changing the underlying path-finding logic or data structures.
- Modifying the main canvas edge styling (this change is specific to the Path Finder UI).

## Decisions

### 1. Type-Aware Styling Logic
Instead of a static `bg-slate-100` and `text-slate-500` for light mode, the styling will depend on `step.edge.type`.

- **ER Relationships**:
  - Light: `bg-emerald-50`, `border-emerald-100`, `text-emerald-700`
  - Dark: `bg-emerald-500/10`, `border-emerald-500/20`, `text-emerald-400`
- **Lineage Relationships**:
  - Light: `bg-blue-50`, `border-blue-100`, `text-blue-700`
  - Dark: `bg-blue-500/10`, `border-blue-500/20`, `text-blue-400`

**Rationale**: Colors help users instantly recognize the type of relationship. Emerald and Blue are already used in other parts of the application for similar concepts.

### 2. Badge Structure Enhancement
The badge container will be updated to include a subtle border in light mode to define its boundaries against the white background.

```tsx
<div className={`flex items-center gap-1.5 my-2 py-0.5 px-2 rounded border w-fit transition-colors ${
  theme === 'dark' 
    ? 'bg-slate-800/50 border-slate-700 text-slate-400' 
    : step.edge.type === 'er'
      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
      : 'bg-blue-50 border-blue-100 text-blue-700'
}`}>
  {/* Icon and Label */}
</div>
```

**Rationale**: A border is more effective than a slightly different background color for accessibility and clarity on high-brightness screens.

## Risks / Trade-offs

- **[Risk]** Visual noise if colors are too saturated.
  - **Mitigation**: Use very light background shades (50) and moderately saturated text (700) for light mode.
- **[Trade-off]** Increased complexity in JSX classes.
  - **Decision**: Keep the logic inline as it's localized to one component, rather than abstracting to a separate helper yet.
