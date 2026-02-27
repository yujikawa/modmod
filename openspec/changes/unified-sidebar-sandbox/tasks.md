## 1. State Management & Store Updates

- [ ] 1.1 Add `isSidebarOpen` (boolean) to `useStore`.
- [ ] 1.2 Add `activeTab` ('editor' | 'entities') to `useStore`.
- [ ] 1.3 Add `focusNode` (nodeId: string) action to `useStore` to trigger diagram centering.
- [ ] 1.4 Add `isSandboxMode` (boolean) to `useStore` based on environment detection.

## 2. Component Extraction & Refactoring

- [ ] 2.1 Create `visualizer/src/components/Sidebar/Sidebar.tsx` as the main container.
- [ ] 2.2 Create `visualizer/src/components/Sidebar/EditorTab.tsx` by extracting YAML editor logic from `App.tsx`.
- [ ] 2.3 Create `visualizer/src/components/Sidebar/EntitiesTab.tsx` for the searchable entity list.
- [ ] 2.4 Create `visualizer/src/components/Sidebar/SidebarToggle.tsx` for collapse/expand functionality.

## 3. Sidebar UI Implementation

- [ ] 3.1 Implement the tabbed interface using `Tabs` from `@radix-ui/react-tabs` (using existing `components/ui/tabs.tsx`).
- [ ] 3.2 Add the collapse/expand animation and layout logic to the `Sidebar` container.
- [ ] 3.3 Ensure the sidebar is consistently styled for both dev and build modes.

## 4. Entity List & Navigation

- [ ] 4.1 Implement a search filter in the `EntitiesTab` to filter the table/domain lists.
- [ ] 4.2 Add click handlers to list items that trigger the `focusNode` action.
- [ ] 4.3 Implement the diagram centering/zooming logic in `App.tsx` using `reactflow`'s `fitView` or `setCenter` when `focusNode` is called.

## 5. Sandbox Editor Logic

- [ ] 5.1 Update `handleParse` to detect `isCliMode`.
- [ ] 5.2 If `!isCliMode`, update the schema state without making a POST request to `/api/save-yaml`.
- [ ] 5.3 Update the save button label and add a "Sandbox Mode" badge when in static mode.
- [ ] 5.4 Ensure error messages are still displayed correctly in the sandbox editor.

## 6. Layout Integration & Final Polish

- [ ] 6.1 Update `App.tsx` to use the new `Sidebar` component and handle the expanded/collapsed diagram area.
- [ ] 6.2 Verify that the "L-Shape" layout and `DetailPanel` still work correctly with the new sidebar.
- [ ] 6.3 Final CSS polish for smooth transitions and responsive layout.
