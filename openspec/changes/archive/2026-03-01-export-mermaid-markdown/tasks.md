## 1. Preparation

- [x] 1.1 Create `src/export.js` and add basic module structure.
- [x] 1.2 Export a placeholder `exportModel` function to be used by the CLI.

## 2. Mermaid & Markdown Generation

- [x] 2.1 Implement `generateMermaidER` function to transform YAML schema to Mermaid syntax.
- [x] 2.2 Implement `generateMarkdown` function to assemble the full document (ER diagram, Domains, and Table Catalog).
- [x] 2.3 Implement domain grouping logic to organize the Markdown sections.
- [x] 2.4 Implement table catalog generation, including logical metadata and sample data.

## 3. CLI Integration

- [x] 3.1 Register the `export` command in `src/index.js` using `commander`.
- [x] 3.2 Implement file handling in the `export` command (reading input, writing to output or stdout).
- [x] 3.3 Connect the `export` command to the generation logic in `src/export.js`.

## 4. Validation & Testing

- [x] 4.1 Test the `export` command with `samples/normalized-ecommerce.yaml`.
- [x] 4.2 Test the `export` command with `samples/star-schema.yaml`.
- [x] 4.3 Verify the generated Markdown rendered correctly in a Mermaid-supported viewer (e.g., GitHub or a local editor).
- [x] 4.4 Ensure error handling for missing files or invalid YAML schemas.

## 5. Documentation & Release

- [x] 5.1 Update `README.md` to include the `export` command documentation.
- [x] 5.2 Bump package version to `0.2.0` in `package.json` and `src/index.js`.

