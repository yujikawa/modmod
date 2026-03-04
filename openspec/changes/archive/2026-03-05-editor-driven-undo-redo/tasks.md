## 1. Store Enhancements

- [x] 1.1 Add `lastUpdateSource: 'user' | 'visual'` to the store to manage the sync loop
- [x] 1.2 Refactor `syncToYamlInput` to set `lastUpdateSource: 'visual'`
- [x] 1.3 Add a generic `undo` / `redo` trigger if needed (though keyboard shortcuts might suffice)

## 2. Editor Transformation

- [x] 2.1 Replace `textarea` with `CodeMirror` in `EditorTab.tsx`
- [x] 2.2 Configure YAML language support and `oneDark` theme
- [x] 2.3 Implement the "Visual Edit -> History Entry" logic using `onChange` and `value` props
- [x] 2.4 Add auto-parsing logic with 300ms debounce in `EditorTab.tsx`

## 3. Interaction Polish

- [x] 3.1 Ensure `saveSchema` still works correctly with the new editor flow
- [x] 3.2 Add a small UI hint that Ctrl+Z works for visual changes

## 4. Verification

- [x] 4.1 Verify node dragging is recorded in the editor history
- [x] 4.2 Verify Ctrl+Z reverts a drag operation
- [x] 4.3 Verify typing in the editor updates the canvas in real-time
- [x] 4.4 Verify that "Auto-save" still respects the toggle setting
