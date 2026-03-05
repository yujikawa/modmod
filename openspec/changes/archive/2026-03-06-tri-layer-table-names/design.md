## Context

Data modeling involves multiple levels of abstraction. By formalizing Conceptual, Logical, and Physical names, we allow Modscape to be used across the entire lifecycle of a data project.

## Goals / Non-Goals

**Goals:**
- Provide a clear vertical hierarchy of names on table nodes.
- Hide redundant information when names overlap (fallback logic).
- Make IDs background technical details while keeping them editable.

**Non-Goals:**
- Automatic translation of names (manual entry only).

## Decisions

### 1. Schema Extensions (`Table` interface)
- `logical_name?: string`
- `physical_name?: string`

### 2. Normalization Logic (`parser.ts`)
We will ensure that `logical_name` and `physical_name` are preserved if present in the YAML. The UI will handle the "visual fallback" to avoid polluting the YAML with duplicate data.

### 3. Visual Hierarchy in `TableNode`
The header will be refactored into three vertical slots:
1.  **Top (Conceptual)**: Large bold text with icon.
2.  **Middle (Logical)**: Smaller, standard text. Only rendered if `logical_name` is provided and different from `name`.
3.  **Bottom (Physical)**: Monospace tech-style text. Shows `physical_name` if present, otherwise `id`.

### 4. Detail Panel Integration
- **Conceptual Tab**: Input for `name`.
- **Logical Tab**: Input for `logical_name` at the top of the columns list.
- **Physical Tab**: Input for `physical_name` at the top of the mapping list.

## Risks / Trade-offs

- **[Risk] Header Height**: Three lines of text might make table nodes very tall.
  - *Mitigation*: Use extremely compact font sizes for Logical/Physical layers and ensure the middle layer is omitted when redundant.
