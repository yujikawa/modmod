## 1. Store Updates

- [x] 1.1 Add `removeEdge(sourceId: string, targetId: string)` action to `useStore.ts`
- [x] 1.2 Implement logic in `removeEdge` to filter out the relationship from the `relationships` array and call `syncToYamlInput`

## 2. Custom Edge Component

- [x] 2.1 Create `ButtonEdge.tsx` in `visualizer/src/components/`
- [x] 2.2 Implement `ButtonEdge` using React Flow's `BaseEdge` and `EdgeLabelRenderer`
- [x] 2.3 Add a circular "Delete" button centered on the edge path using `getBezierPath` or `getSmoothStepPath` midpoint coordinates
- [x] 2.4 Connect the button click handler to the `removeEdge` store action

## 3. App Integration

- [x] 3.1 Define `edgeTypes` object in `App.tsx` including `button: ButtonEdge`
- [x] 3.2 Update `edges` generation logic in `App.tsx` to use `type: 'button'` for all relationship edges
- [x] 3.3 Pass `edgeTypes` to the `ReactFlow` component

## 4. Verification

- [x] 4.1 Launch the visualizer and verify that all edges display a delete button
- [x] 4.2 Confirm that clicking the delete button removes the edge from the canvas
- [x] 4.3 Verify that the underlying YAML model is updated and synchronized with the editor
