# Proposal: Improved Domain Layout and Auto-Sizing

## Summary
Currently, the domain grouping feature has several layout issues: tables within domains are placed in a single long horizontal line, domain containers have a fixed default size (600x400) regardless of the number of tables, and multiple domains often overlap because they share the same default (0, 0) coordinates. This proposal aims to introduce a "Smart Grid" initial placement for tables within domains and automatic sizing for domain containers.

## Goals
- **Grid-based Placement**: Arrange tables within a domain in a grid (e.g., 3 columns) instead of a single line.
- **Dynamic Container Sizing**: Calculate the initial `width` and `height` of domain containers based on the number of tables they hold.
- **Domain Distribution**: Automatically offset multiple domains to prevent them from overlapping by default.

## Deliverables
- `visualizer/src/App.tsx`: Updated node generation logic to handle grid layout and dynamic sizing.
- `visualizer/src/store/useStore.ts`: (If needed) helpers for layout calculation.
- `openspec/specs/domain-layout-improvement/spec.md`: New requirement specification.

## Risks & Trade-offs
- **Complexity**: Calculating the "perfect" grid might be complex if table sizes vary wildly. → *Mitigation*: Use a standard grid cell size (e.g., 300x250) for initial placement.
- **User Layout Preservation**: Auto-layout should only apply to nodes *without* existing coordinates in the `layout` section.
