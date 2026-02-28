# /modscape:modeling

Start an interactive data modeling session.

## Instructions
1. FIRST, read `.modscape/rules.md` to understand the project strategy, naming conventions, and YAML schema.
2. SECOND, analyze the existing `model.yaml` if it exists.
3. Listen to the user's requirements and propose/apply changes to `model.yaml` strictly following the rules.

## Appearance & Layout
- **Appearance**: For new tables, include the `appearance: { type: "..." }` block.
- **Layout**: When creating new entities, always assign initial `x` and `y` coordinates in the `layout` section. Position them logically near their related entities to avoid stacking.

Always prioritize consistency and project-specific standards.
