# Data Modeling Rules for this Project

## 1. Modeling Strategy
<!-- Define your modeling methodology here. Example: Data Vault 2.0, Star Schema, 3NF -->
- [Enter methodology name here, e.g., Star Schema]
- Maintain structure according to table roles (e.g., Fact/Dim, Hub/Sat).

## 2. Naming Conventions
<!-- Define your naming rules here -->
- **Casing**: [Select one: snake_case / UPPER_SNAKE_CASE / camelCase]
- **Prefixes**: (e.g., `f_` for facts, `d_` for dimensions)
- **Suffixes**: (e.g., `_id` for primary keys, `_h` for history tables)

## 3. Standard Data Types
- String: 
- Numeric: 
- Date/Time: 

## 4. YAML Schema Reference
Use this structure for `model.yaml`:

```yaml
tables:
  - id: table_id # Unique identifier
    name: Table Display Name (Logical)
    appearance: # Optional: Visual style
      type: hub # Predefined: hub, link, satellite, fact, dimension
      icon: "🌐"  # Optional: Emoji override
      color: "#fbbf24" # Optional: Hex color override
    conceptual:
      description: "Business definition"
      tags: ["WHO", "WHAT", "WHEN", etc.]
    columns:
      - id: column_id
        logical:
          name: "Column Name"
          type: "Data Type"
          description: "Optional description"
          isPrimaryKey: true/false
          isForeignKey: true/false
        physical: # Optional
          name: "physical_name"
          type: "DB_TYPE"
          constraints: ["NOT NULL", "UNIQUE"]
    sampleData: # Optional
      columns: ["column_id_1", "column_id_2"]
      rows:
        - ["value1", "value2"]

domains: # Optional: Group tables into visual containers
  - id: domain_id
    name: Domain Name
    description: "Domain purpose"
    tables: ["table_id_1", "table_id_2"]
    color: "rgba(59, 130, 246, 0.05)" # Optional background color

relationships:
  - from: { table: table_id, column: column_id }
    to: { table: other_id, column: column_id }
    type: "one-to-many" # or "one-to-one", "many-to-many"

layout: # Automatically managed by the visualizer OR updated by AI Agent
  table_id: { x: 100, y: 100 }
  domain_id: { x: 50, y: 50, width: 600, height: 400 }
```

## 📁 File Management

For larger projects, it is recommended to **split the model into multiple YAML files by domain** rather than keeping everything in a single file.

-   **Directory Management**: By specifying a directory with `modscape dev models/`, the visualizer will automatically scan and manage all YAML files within that folder.
-   **Naming Conventions**: The filename (without extension) is used as the "model slug" in the visualizer (e.g., `customer.yaml`, `billing.yaml`).
-   **Common Structure**: Maintain a consistent `layout` format across all files. AI agents MUST respect the existing `layout` section when making updates.

## 5. Layout Management
- **Visualizer Priority**: The GUI handles layout through drag-and-drop, writing to the `layout` section.
- **AI Agent Responsibility**: When creating new entities or domains, you MUST assign initial coordinates (x, y) to place them logically near related tables. Do NOT leave new entities at (0, 0) or stacked on top of each other.
- **Preservation**: Do NOT modify existing coordinates unless a "Cleanup" or "Re-layout" is explicitly requested.

## 6. The Golden Rules
- When updating `model.yaml`, always self-audit against these rules.
- Set appropriate `appearance.type` (fact, dimension, hub, link, satellite) for new tables.
- When defining relationships, ensure consistency between `from` and `to` tables.
- If user instructions are ambiguous, propose the best design based on these rules.

## 7. Strictly Forbidden
- Do not create custom data types not defined in this document.
- Do not destroy or overwrite the `layout` section without assigning new, logical coordinates.
