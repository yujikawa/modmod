## Context

Modscape is currently a generic YAML visualizer. To differentiate it and serve its primary audience (data professionals), it must support specific modeling semantics from Kimball (Dimensional Modeling) and Linstedt (Data Vault 2.0).

## Goals / Non-Goals

**Goals:**
- Extend the YAML schema to capture professional modeling metadata.
- Provide immediate visual feedback for these specialized attributes.
- Set high-quality defaults/examples in documentation to educate users and AI agents.

**Non-Goals:**
- Schema validation (this remains flexible).
- Enforcing specific methodologies (only supporting documentation).

## Decisions

### 1. Schema Extensions
- **Table Appearance**: 
  - `strategy`: `transaction` | `periodic` | `accumulating` | `factless`
  - `scd`: `type0` | `type1` | `type2` | `type3` | `type6`
- **Column Logical**:
  - `additivity`: `fully` | `semi` | `non`
  - `isMetadata`: `boolean` (displays audit/clock icon)

### 2. UI - TableNode Badges
Labels will be dynamically generated:
- If `fact` + `periodic` → `FACT (Periodic)`
- If `dimension` + `type2` → `DIM (SCD T2)`
This keeps the header compact while being highly informative.

### 3. Documentation as Contract
The `rules.md` template will be drastically expanded. It will not just show the schema, but explain *when* to use each attribute. This is critical for AI agents to make smart modeling decisions.

## Risks / Trade-offs

- **[Risk] Schema Bloat** → Since all new fields are optional, basic users won't be affected.
- **[Trade-off] String vs Enum** → We use strings in implementation for flexibility, but document specific "standard" values in `rules.md`.
