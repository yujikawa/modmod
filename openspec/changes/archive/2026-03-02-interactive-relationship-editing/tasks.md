## 1. Store Updates

- [x] 1.1 Add `selectedEdgeId` to `StoreState` in `useStore.ts`
- [x] 1.2 Implement `setSelectedEdge` action to track selection
- [x] 1.3 Implement `addRelationship` action to update the schema model
- [x] 1.4 Implement `updateRelationship` action for modifying metadata (type, cardinality)

## 2. TableNode Component Enhancements

- [x] 2.1 Add React Flow `Handle` components (type="source" and type="target") to `TableNode`
- [x] 2.2 Style handles to be visually unobtrusive (visible on hover)
- [x] 2.3 Map column IDs to handle IDs for precise relationship tracking

## 3. Canvas Interaction

- [x] 3.1 Implement `onConnect` callback in the main `ReactFlow` component
- [x] 3.2 Implement `onEdgeClick` to set the selected edge in the store
- [x] 3.3 Ensure `onSelectionChange` clears `selectedEdgeId` when appropriate

## 4. Detail Panel Updates

- [x] 4.1 Update `DetailPanel` component to detect when an edge is selected
- [x] 4.2 Create a `RelationshipEditor` sub-component within `DetailPanel`
- [x] 4.3 Implement fields for editing relationship type, cardinality, and description
- [x] 4.4 Ensure property changes trigger the `updateRelationship` store action

## 5. Persistence and Validation

- [x] 5.1 Update the YAML generator logic to include new/modified relationships
- [x] 5.2 Add basic validation to prevent duplicate relationships in the store
- [x] 5.3 Verify that changes made via the UI correctly reflect in the "Model Editor" (if applicable)
