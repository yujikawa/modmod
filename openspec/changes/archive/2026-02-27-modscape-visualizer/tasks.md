
## 1. Setup

- [x] 1.1 Scaffold Vite project with React and TypeScript
- [x] 1.2 Install dependencies (React Flow, js-yaml, zustand, Tailwind CSS, Shadcn UI)
- [x] 1.3 Set up basic layout with a sidebar for YAML input and main area for diagram

## 2. Data Parsing

- [x] 2.1 Define TypeScript interfaces for the YAML schema
- [x] 2.2 Implement YAML parser using `js-yaml`
- [x] 2.3 Create Zustand store to manage parsed model state and selection

## 3. Main Canvas (Diagram)

- [x] 3.1 Implement custom React Flow node for tables (displaying logical/physical names)
- [x] 3.2 Render nodes and edges based on parsed YAML data
- [x] 3.3 Add click handler to nodes to select a table and trigger detail panel

## 4. Detail Panel

- [x] 4.1 Create slide-up panel component with tabbed navigation
- [x] 4.2 Implement "Conceptual" tab view showing business definitions and tags
- [x] 4.3 Implement "Logical" and "Physical" tab views with mapping tables

## 5. Sample Data Grid

- [x] 5.1 Create sample data grid component for the "Sample Data" tab
- [x] 5.2 Implement hover highlighting between sample grid headers and diagram columns
- [x] 5.3 Add pagination/scrolling for large sample data sets
