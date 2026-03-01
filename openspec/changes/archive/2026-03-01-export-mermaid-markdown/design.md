## Context

Modscape is currently a visualizer that runs as a dev server or build process for a static site. The existing logic for parsing YAML models and normalizing them is located in `visualizer/src/lib/parser.ts` (for the frontend) and partially in `src/dev.js` and `src/build.js` (for the CLI). To support Markdown export, we need to bring similar normalization logic to a CLI-side utility.

## Goals / Non-Goals

**Goals:**
- Provide a `modscape export <paths...>` command.
- Generate a single Markdown file containing an ER diagram and detailed table documentation.
- Support both file output (`-o`) and stdout.

**Non-Goals:**
- Real-time Markdown preview.
- Customizing Mermaid styling via CLI flags.
- Exporting to other formats like PDF or PNG (can be done via other tools).

## Decisions

### 1. New Module: `src/export.js`
We will create a new module `src/export.js` that contains the transformation logic. This separates the concern of "generating documentation" from "running a dev server" or "building a static site".

### 2. Markdown Structure
The output will follow this structure:
1.  **Title**: Model Name (from filename or domain).
2.  **ER Diagram**: A `mermaid` code block using `erDiagram`.
    -   Tables are mapped to `entity` blocks.
    -   Columns are listed within the entity.
    -   Relationships are mapped using Mermaid cardinality notation.
3.  **Domains**: A list of domains and their tables.
4.  **Data Catalog**: A detailed breakdown of each table.

### 3. Relationship Mapping
| YAML Type | Mermaid Cardinality |
| :--- | :--- |
| `one-to-many` | `||--o{` |
| `one-to-one` | `||--||` |
| `many-to-many` | `}|--|{` |

### 4. CLI Integration
The `export` command will be added to `src/index.js` using `commander`. It will support:
-   Positional arguments for YAML files.
-   `-o, --output <file>` for specifying the output file.

## Risks / Trade-offs

-   **[Risk] Complexity of large models** → A large model might result in an unreadable Mermaid diagram.
    -   *Mitigation*: We will recommend using smaller, domain-focused YAML files or suggest using the interactive visualizer for large schemas.
-   **[Risk] Mermaid syntax changes** → `erDiagram` syntax is relatively stable but can be picky about special characters.
    -   *Mitigation*: Sanitize entity and column names (e.g., replacing spaces with underscores) before including them in the Mermaid block.
