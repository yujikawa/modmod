## Context

When `modscape init` runs, it copies `src/templates/rules.md` into `.modscape/rules.md`. AI agents are then instructed (via their respective template files) to read `.modscape/rules.md` before any modeling task. This file contains the full Modscape YAML schema and universal modeling conventions.

There is currently no mechanism for projects to extend or override these rules without editing `rules.md` directly — which would be overwritten on the next `modscape init`.

## Goals / Non-Goals

**Goals:**
- Allow any project to place a `.modscape/rules.custom.md` file to define project-specific rules
- Ensure all three agent flavors (Claude, Gemini, Codex) automatically read and apply it
- Document the mechanism inside `rules.md` itself so any agent reading it is aware
- Keep the implementation to template-only changes (no CLI, no parser, no visualizer)

**Non-Goals:**
- Scaffolding `rules.custom.md` via `modscape init`
- Merging or validating the content of `rules.custom.md`
- Supporting multiple custom rule files or a layered priority system
- Changing the `codegen-rules.md` extension mechanism (out of scope for now)

## Decisions

### 1. Announce the mechanism inside `rules.md` itself

**Decision:** Add an "Extension Mechanism" section to `src/templates/rules.md` (and therefore `.modscape/rules.md`) explaining the `rules.custom.md` convention.

**Rationale:** An agent that reads `rules.md` will self-discover the extension point without requiring changes to the agent template. This is a safety net — even if an agent template is outdated or not updated, the agent can still learn about `rules.custom.md` from the base file.

Alternatives considered:
- Only update agent templates, not `rules.md`: Fragile. New agents or forgotten template variants would miss it.
- Add a CLI flag or config field: Overkill for a simple file-based convention.

### 2. Update all three agent templates explicitly

**Decision:** Also update `claude/modeling.md`, `gemini/modscape-modeling/SKILL.md`, and `codex/modscape-modeling/SKILL.md` to explicitly instruct agents to read `rules.custom.md` when present.

**Rationale:** Explicit instruction in the agent template is more reliable than relying on the agent to infer it from `rules.md` text. Belt-and-suspenders approach.

### 3. Custom rules take priority over base rules on conflict

**Decision:** When `rules.custom.md` and `rules.md` contradict, custom rules win.

**Rationale:** The whole point of the custom file is to override or refine the base. If base rules always won, the custom file would be useless for corrections.

### 4. No scaffolding by `modscape init`

**Decision:** `modscape init` does not create `rules.custom.md`.

**Rationale:** Most projects won't need it initially. Creating an empty file creates noise. Teams can create it when they have something to write, and the README / `rules.md` explains how.

## Risks / Trade-offs

- [Risk] Agent ignores the custom file if instructions are ambiguous → Mitigation: Both `rules.md` and the agent template instruct the agent; dual announcement reduces miss rate.
- [Risk] Users edit `rules.md` directly instead of using `rules.custom.md` → Mitigation: Document in README that `rules.md` is auto-generated and `rules.custom.md` is the right place for customizations.
- [Risk] Future `modscape init` runs overwrite user edits to `rules.md` → Already mitigated by existing `safeWriteFile` overwrite confirmation. Not changed by this feature.
