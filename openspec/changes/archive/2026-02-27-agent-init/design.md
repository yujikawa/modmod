## Context

The `modmod` tool currently focuses on visualization and basic CLI interaction. However, the creation of `model.yaml` is often where users need the most help. AI agents (Gemini, Codex, Claude) are capable of generating YAML but need project-specific guidance to adhere to company standards. This design outlines how the `modmod init` command will scaffold this environment.

## Goals / Non-Goals

**Goals:**
- Implement a `modmod init` command.
- Create a centralized `.modmod/rules.md` template.
- Scaffold agent-specific files (`.gemini/skills/modeler.md`, `.codex/instructions.md`, `.clauderules`) that reference the centralized rules.
- Support interactive selection of which agents to scaffold for.

**Non-Goals:**
- Building actual AI model logic into the CLI.
- Validating the content of `rules.md` (it's for human/AI consumption).
- Automatically installing AI agents or extensions.

## Decisions

- **Centralized Rules (SSoT)**: All project-specific modeling rules will reside in `.modmod/rules.md`.
  - *Rationale*: Prevents duplication and ensures all AI agents operate on the same logic.
- **Agent Templates**: The CLI will contain embedded Markdown templates for each agent type.
  - *Rationale*: Simplifies scaffolding and allows for future agent support (e.g., Windsurf, Cursor).
- **Interactive Scaffolding**: Use `Inquirer` or a similar pattern within the CLI to ask users which agents they use.
  - *Rationale*: Avoids cluttering the project with unnecessary configuration files for agents the user doesn't use.
- **Embedded Templates**: Store templates as separate files within the `src/templates` directory.
  - *Rationale*: Keeps the CLI logic and the content being scaffolded decoupled. Specifically, keeping them in `src/templates` ensures they do not conflict with the project's own `.gemini` or `.clauderules` files during development.

## Risks / Trade-offs

- **Template Drift**: [Risk] Agent-specific file formats might change. → [Mitigation] Keep agent instructions simple and focused on "Read .modmod/rules.md".
- **File Overwrites**: [Risk] `modmod init` might overwrite existing configurations. → [Mitigation] Implement checks to ensure files are only created if they don't exist, or prompt for confirmation.
