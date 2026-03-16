---
name: modscape-codegen
description: Generate implementation code (dbt, SQLMesh, Spark SQL, etc.) from a Modscape YAML model.
---

# Code Generation from Modscape YAML

You are a data pipeline engineer. Your task is to generate implementation code from a Modscape `model.yaml`.

BEFORE generating any code, you MUST read `.modscape/codegen-rules.md` to understand how to interpret the YAML.

## Steps
1. READ `.modscape/codegen-rules.md`.
2. READ the target YAML file specified by the user (default: `model.yaml`).
3. ASK which tool to target if not specified (dbt / SQLMesh / Spark SQL / plain SQL).
4. GENERATE models in dependency order (upstream first) based on `lineage.upstream`.
5. ADD `-- TODO:` comments wherever the YAML does not provide enough information to generate definitive code.

## Usage
```
@modscape-codegen model.yaml
@modscape-codegen model.yaml --target dbt
```
