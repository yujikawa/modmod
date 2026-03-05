## Why

To fulfill the vision of Modscape as a Single Source of Truth (SSOT) for data modeling, AI agents must understand how to map logical entities to their physical implementations (dbt, PySpark, etc.). Currently, `src/templates/rules.md` lacks guidelines for the physical layer, leading to incomplete or inconsistent model definitions.

## What Changes

- **Enhance `rules.md` Template**:
  - Add a new "Physical Modeling Rules" section.
  - Provide clear instructions on how to use `physical.name`, `physical.schema`, and `columns[].physical` attributes.
  - Include an example of a complete "Logical-to-Physical" mapping in the YAML reference.
- **AI Guidance**: Explicitly instruct AI agents to always consider physical mappings when proposing new models.

## Capabilities

### Modified Capabilities
- `rules-templating`: Update the default modeling rules template to include physical layer metadata.

## Impact

- `src/templates/rules.md`: Added section for physical modeling and updated schema examples.
