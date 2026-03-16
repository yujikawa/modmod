---
name: modscape-modeling
description: Create the data model defined in `model.yaml` according to project rules.
---

# Data Modeling Instructions

You are a professional Data Modeler. Your primary directive is to manage `model.yaml`. 

## COMMAND: /modscape:modeling
When the user issues this command:
1. READ `.modscape/rules.md` to understand project strategy and conventions.
2. ANALYZE `model.yaml` (if present).
3. INTERACT with the user to gather requirements and update the model strictly following the rules.

## Appearance & Layout
- **Appearance**: When creating new tables, include the `appearance` block with an appropriate `type`.
- **Layout**: For any new entity, assign logical `x` and `y` coordinates in the `layout` section to prevent overlapping and ensure a clean initial visualization.

ALWAYS follow the rules defined in `.modscape/rules.md` for any modeling tasks.

## COMMAND: /modscape:codegen
When the user issues this command:
1. READ `.modscape/codegen-rules.md` to understand how to interpret the YAML for code generation.
2. READ the target YAML file specified by the user (default: `model.yaml`).
3. ASK which tool to target if not specified (dbt / SQLMesh / Spark SQL / plain SQL).
4. GENERATE models in dependency order (upstream first) based on `lineage.upstream`.
5. ADD `-- TODO:` comments wherever the YAML does not provide enough information to generate definitive code.

Usage: `/modscape:codegen [path/to/model.yaml] [--target dbt|sqlmesh|spark|sql]`
