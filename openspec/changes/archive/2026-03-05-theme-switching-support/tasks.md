## 1. Store & Base Infrastructure

- [x] 1.1 Add `theme` state and `toggleTheme` action to `visualizer/src/store/useStore.ts`
- [x] 1.2 Implement `localStorage` persistence for the theme
- [x] 1.3 Add dynamic `.dark` class application to the root element in `App.tsx`

## 2. Global Styling

- [x] 2.1 Refactor `visualizer/src/index.css` to use CSS variables for theme-aware colors
- [x] 2.2 Update React Flow background and grid colors based on the current theme

## 3. Component Updates

- [x] 3.1 Update `TableNode.tsx` to use theme-aware background and border colors
- [x] 3.2 Update `DetailPanel.tsx` to ensure readability in light mode (colors, text, inputs)
- [x] 3.3 Update `EditorTab.tsx` to switch CodeMirror themes based on the store's state

## 4. UI Controls

- [x] 4.1 Add a theme toggle (Sun/Moon) to the `Sidebar.tsx` footer
- [x] 4.2 Ensure all floating toolbars (CanvasToolbar) look good in light mode (white glass effect)

## 5. Verification

- [x] 5.1 Verify theme persists after page reload
- [x] 5.2 Verify all entity types remain distinguishable in light mode
- [x] 5.3 Verify CodeMirror highlights are readable in light mode
