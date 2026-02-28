## 1. State Management & Store Updates

- [x] 1.1 Add `isSidebarOpen` (boolean) to `useStore`.
- [x] 1.2 Add `activeTab` ('editor' | 'entities') to `useStore`.
- [x] 1.3 Add `focusNode` (nodeId: string) action to `useStore` to trigger diagram centering.
- [x] 1.4 Add `isSandboxMode` (boolean) to `useStore` based on environment detection.

## 2. Component Extraction & Refactoring

- [x] 2.1 Create `visualizer/src/components/Sidebar/Sidebar.tsx` as the main container.
- [x] 2.2 Create `visualizer/src/components/Sidebar/EditorTab.tsx` by extracting YAML editor logic from `App.tsx`.
- [x] 2.3 Create `visualizer/src/components/Sidebar/EntitiesTab.tsx` for the searchable entity list.
- [x] 2.4 Create `visualizer/src/components/Sidebar/SidebarToggle.tsx` for collapse/expand functionality.

## 3. Sidebar UI Implementation

- [x] 3.1 Implement the tabbed interface using `Tabs` from `@radix-ui/react-tabs` (using existing `components/ui/tabs.tsx`).
- [x] 3.2 Add the collapse/expand animation and layout logic to the `Sidebar` container.
- [x] 3.3 Ensure the sidebar is consistently styled for both dev and build modes.

## 4. Entity List & Navigation

- [x] 4.1 Implement a search filter in the `EntitiesTab` to filter the table/domain lists.
- [x] 4.2 Add click handlers to list items that trigger the `focusNode` action.
- [x] 4.3 Implement the diagram centering/zooming logic in `App.tsx` using `reactflow`'s `fitView` or `setCenter` when `focusNode` is called.

## 5. Sandbox Editor Logic

- [x] 5.1 Update `handleParse` to detect `isCliMode`.
- [x] 5.2 If `!isCliMode`, update the schema state without making a POST request to `/api/save-yaml`.
- [x] 5.3 Update the save button label and add a \"Sandbox Mode\" badge when in static mode.
- [x] 5.4 Ensure error messages are still displayed correctly in the sandbox editor.

## 6. Layout Integration & Final Polish

- [x] 6.1 Update `App.tsx` to use the new `Sidebar` component and handle the expanded/collapsed diagram area.
- [x] 6.2 Verify that the \"L-Shape\" layout and `DetailPanel` still work correctly with the new sidebar.
- [x] 6.3 Final CSS polish for smooth transitions and responsive layout.
