## Why

Each project using Modscape has its own naming conventions, domain topology, and modeling standards that go beyond the generic base rules. Currently there is no structured way for AI agents to discover and apply these project-specific rules — teams end up repeating them verbally in every session. A `rules.custom.md` extension mechanism allows projects to declare their standards once and have all AI agents pick them up automatically.

## What Changes

- Add a new **Extension Mechanism** section to `src/templates/rules.md` explaining that if `.modscape/rules.custom.md` exists, agents must read it in addition to the base rules, with custom rules taking priority on conflict.
- Update all three agent templates to instruct agents to also read `.modscape/rules.custom.md` when it exists:
  - `src/templates/claude/modeling.md`
  - `src/templates/gemini/modscape-modeling/SKILL.md`
  - `src/templates/codex/modscape-modeling/SKILL.md`
- `rules.custom.md` is **not** scaffolded by `modscape init` — users create it manually when needed.

## Capabilities

### New Capabilities

- `rules-custom-extension`: AI agents discover and apply `.modscape/rules.custom.md` as a project-specific rule layer on top of the base `rules.md`.

### Modified Capabilities

<!-- none -->

## Impact

- `src/templates/rules.md` — new section added (no schema change)
- `src/templates/claude/modeling.md` — instruction updated
- `src/templates/gemini/modscape-modeling/SKILL.md` — instruction updated
- `src/templates/codex/modscape-modeling/SKILL.md` — instruction updated
- No changes to visualizer, parser, or YAML schema
- No changes to `modscape init` behavior
