## 1. Data Model & Parsing

- [x] 1.1 Update `Schema` and `Table` interfaces in `visualizer/src/types/schema.ts` to include `domains`
- [x] 1.2 Extend `visualizer/src/lib/parser.ts` to parse the `domains` section from YAML
- [x] 1.3 Update the Zustand store in `visualizer/src/store/useStore.ts` to hold domain data

## 2. Domain UI Component

- [x] 2.1 Create `visualizer/src/components/DomainNode.tsx` as a custom React Flow node for groups
- [x] 2.2 Implement styling for the domain card (semi-transparent background, title, resize handles)
- [x] 2.3 Register `domain` node type in `visualizer/src/App.tsx`

## 3. Hierarchical Rendering

- [x] 3.1 Update `App.tsx` logic to generate group nodes from the `domains` data
- [x] 3.2 Update table node generation to set `parentNode` and calculate relative coordinates
- [x] 3.3 Ensure edges are correctly mapped between child table nodes across different parents

## 4. Layout & Persistence

- [x] 4.1 Update `useStore.ts` to handle coordinate and dimension updates for domain nodes
- [x] 4.2 Implement layout persistence logic for domains in `modmod dev` mode (API calls)
- [x] 4.3 Update `modmod build` to correctly embed domain and layout data into the static site

## 5. Verification

- [x] 5.1 Test with a YAML containing one domain and multiple tables
- [x] 5.2 Verify that dragging a domain moves its member tables
- [x] 5.3 Test cross-domain relationships to ensure edges remain connected
- [x] 5.4 Confirm that `modmod build` generates a static site with correct grouping
