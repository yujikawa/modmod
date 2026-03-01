## ADDED Requirements

### Requirement: Generate Mermaid ER Diagram
The system SHALL transform the tables and relationships defined in the YAML model into a valid Mermaid `erDiagram` block.

#### Scenario: Basic ER diagram generation
- **WHEN** the system processes a YAML model with two tables and one relationship
- **THEN** the output contains a `erDiagram` block showing the tables and their connection with correct cardinality markers

### Requirement: Document Domain Structure
The system SHALL generate a Markdown section for each domain defined in the YAML, listing the tables associated with that domain.

#### Scenario: Domain listing
- **WHEN** a YAML model has multiple domains
- **THEN** the Markdown output contains a "Domains" section with headers for each domain and their table lists

### Requirement: Generate Table Catalog
The system SHALL generate a detailed "Table Catalog" section in the Markdown, showing metadata for each table, including logical names, descriptions, icons, column details, and sample data.

#### Scenario: Table details display
- **WHEN** a table has columns with logical types and sample data rows
- **THEN** the Markdown output contains a table for that entity showing all column metadata and a separate table for sample data

### Requirement: CLI Command for Export
The system SHALL provide an `export` command in the CLI that accepts YAML file paths and an optional output file path.

#### Scenario: Exporting to a file
- **WHEN** the user runs `modscape export samples/ecommerce.yaml -o documentation.md`
- **THEN** the system writes the generated Markdown to `documentation.md` and displays a success message
