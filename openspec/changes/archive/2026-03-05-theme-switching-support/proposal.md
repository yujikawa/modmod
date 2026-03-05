## Why

Modscape is currently locked to a dark theme. Providing a light mode increases accessibility for users in bright environments and makes exported screenshots better suited for standard white-background documents. A professional design tool in 2026 should adapt to the user's system preferences and offer manual overrides.

## What Changes

- **Theme State Management**:
  - Add `theme: 'dark' | 'light'` to the store with persistence in `localStorage`.
  - Automatically detect system preferences on first load.
- **Dynamic CSS Integration**:
  - Use Tailwind's `dark:` mode and CSS variables to swap global colors (backgrounds, text, borders).
- **Component Theming**:
  - **React Flow**: Update grid colors and background dynamically.
  - **CodeMirror**: Switch between `oneDark` and `oneLight` themes.
  - **Nodes**: Refine node styling to ensure high contrast in both modes (white cards for light mode, slate cards for dark).
- **Theme Toggle UI**:
  - Add a stylized Sun/Moon toggle in the Sidebar footer.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Support dynamic theme switching for the canvas and nodes.
- `sidebar-ui`: Integrate theme controls and styled sidebar components.

## Impact

- `visualizer/src/store/useStore.ts`: Theme state and persistence.
- `visualizer/src/App.tsx`: Apply theme class to the root and update React Flow props.
- `visualizer/src/components/Sidebar/Sidebar.tsx`: Theme toggle button.
- `visualizer/src/components/TableNode.tsx`: Contrast adjustments.
