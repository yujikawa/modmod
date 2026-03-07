## 1. Schema and Parser Updates

- [x] 1.1 Update `visualizer/src/types/schema.ts` to include `Annotation` interface and update `Schema`
- [x] 1.2 Update `visualizer/src/lib/parser.ts` to handle the `annotations` section in `normalizeSchema`
- [x] 1.3 Update `visualizer/src/store/useStore.ts` types and state for annotations

## 2. Store Actions Implementation

- [x] 2.1 Implement `addAnnotation` action in `useStore.ts`
- [x] 2.2 Implement `updateAnnotation` action (text, style, offset) in `useStore.ts`
- [x] 2.3 Implement `removeAnnotation` action in `useStore.ts`
- [x] 2.4 Implement `syncToYamlInput` update to include annotations in YAML dump

## 3. Custom Visual Components

- [x] 3.1 Create `visualizer/src/components/AnnotationNode.tsx` with sticky/callout styles
- [x] 3.2 Create `visualizer/src/components/AnnotationEdge.tsx` for connector lines
- [x] 3.3 Register new node and edge types in the main React Flow component

## 4. Canvas Integration and Sticky Logic

- [x] 4.1 Update node/edge mapping logic to include annotations from the schema
- [x] 4.2 Implement relative offset calculation logic in `onNodesChange` for annotation nodes
- [x] 4.3 Implement "Sticky" behavior: Ensure annotations re-render correctly when targets move

## 5. UI and Tools

- [x] 5.1 Add "Add Sticky Note" and "Show/Hide Annotations" buttons to `CanvasToolbar.tsx`
- [x] 5.2 Implement inline editing (double-click) for `AnnotationNode`
- [x] 5.3 Add annotation-specific controls to `DetailPanel.tsx` (color, style, target binding)
