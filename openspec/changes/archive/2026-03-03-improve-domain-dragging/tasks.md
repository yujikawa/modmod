## 1. Domain Node React Component

- [x] 1.1 Remove `nodrag` class from the background `div` in `visualizer/src/components/DomainNode.tsx`
- [x] 1.2 Change `cursor: 'default'` to `cursor: 'grab'` in the background `div` of `visualizer/src/components/DomainNode.tsx`
- [x] 1.3 Update the root container of `DomainNode` to use `cursor: 'default'` to prevent the entire node area from showing a grab cursor (keeping it specific to the background area and label)

## 2. React Flow Configuration

- [x] 2.1 Remove `dragHandle: '.domain-drag-handle'` from the domain node creation logic in `visualizer/src/App.tsx`

## 3. Verification

- [x] 3.1 Verify that clicking and dragging the empty background of a domain moves the container
- [x] 3.2 Verify that clicking and dragging a table inside a domain still moves only that table
- [x] 3.3 Verify that the cursor changes to a hand (grab) when hovering over the domain background
