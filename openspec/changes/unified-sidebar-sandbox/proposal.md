## Why

The current visualizer's sidebar has inconsistent behavior between CLI (dev) and static (build) modes. In static mode, the sidebar is not very useful as it only lists entity names without providing navigation or editing capabilities. This change aims to unify the sidebar experience, improve navigation, and provide a "sandbox" editing mode for static viewers to explore model changes in-memory.

## What Changes

- **Unified Sidebar Component**: A single, feature-rich sidebar component used in both CLI and static modes.
- **Tabbed Interface**: Switch between "Editor" (YAML) and "Entities" (Navigation) views.
- **Collapsible Sidebar**: Ability to collapse/expand the sidebar to maximize the diagram viewing area.
- **Sandbox Editing**: Enable YAML editing in static mode with in-memory updates (no file persistence, resets on reload).
- **Interactive Entity List**: Searchable list of entities with "click-to-focus" functionality that centers the diagram on the selected node.
- **Visual Improvements**: A more polished, modern sidebar design.

## Capabilities

### New Capabilities
- `sidebar-ui`: Unified, collapsible sidebar with tabbed navigation.
- `interactive-navigation`: Entity search and "click-to-focus" in the diagram.
- `sandbox-editor`: In-memory YAML editing for static builds.

### Modified Capabilities
- `cli-integration`: Update to handle unified sidebar and conditional save logic.
- `visualizer-core`: Support for node focusing/zooming from external UI.

## Impact

- `visualizer/src/App.tsx`: Main layout and mode detection logic.
- `visualizer/src/store/useStore.ts`: New state for sidebar (collapsed, active tab) and navigation actions.
- `visualizer/src/components/Sidebar.tsx`: New component (to be created) replacing current inline sidebar code.
- `visualizer/src/lib/parser.ts`: Potential refinement for faster in-memory re-parsing.
