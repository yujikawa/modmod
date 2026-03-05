## Why

As data models grow, a flat list of tables in the sidebar becomes difficult to navigate. Since 'Domains' are the primary organizational unit in Modscape (especially after removing 'Layers'), grouping tables by their domain in the sidebar provides a clear, structured overview of the project. This allows users to quickly find entities within a specific business context.

## What Changes

- **Structured Entities List**: 
  - Group all tables under their assigned domains.
  - Create a dedicated "Unassigned" group for tables not belonging to any domain.
- **Collapsible Sections**:
  - Make each domain group collapsible to save vertical space.
- **Enhanced Domain Navigation**:
  - Clicking a domain header should focus the view on that domain in the canvas.
- **Visual Cues**:
  - Incorporate domain theme colors into the sidebar grouping headers for quick recognition.

## Capabilities

### Modified Capabilities
- `sidebar-ui`: Group and categorize entities based on their logical domain membership.

## Impact

- `visualizer/src/components/Sidebar/EntitiesTab.tsx`: Complete refactor of the rendering logic to support grouping.
