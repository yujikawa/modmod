## Why

In the "Path Finder" tab of the right panel, the badges representing edge relationships (ER or Lineage) have low visibility in light mode. Currently, they use a light gray background (`bg-slate-100`) and gray text (`text-slate-500`) which lacks sufficient contrast against the white panel background, making it difficult for users to quickly identify the type of relationship in the search results.

## What Changes

- **Enhanced Relationship Badges**: Update the styling of edge relationship badges in the Path Finder results.
- **Type-Aware Coloring**: Implement distinct color schemes based on the edge type (e.g., emerald for ER relationships, blue for Lineage).
- **Improved Contrast**: Add borders and use higher-contrast text colors for better readability in light mode.
- **Theme Consistency**: Ensure the new styles maintain a professional look in both light and dark modes.

## Capabilities

### New Capabilities
- (None)

### Modified Capabilities
- `interactive-navigation`: Update the visual presentation of relationship paths in the navigation/search interface to improve clarity and user experience.

## Impact

- **UI Components**: `PathFinderTab.tsx` will be modified to apply the new styling logic.
- **User Experience**: Improved scanability and clarity of path search results in the right panel.
- **Consistency**: Better alignment with the overall visual language of Modscape by using type-aware colors.
