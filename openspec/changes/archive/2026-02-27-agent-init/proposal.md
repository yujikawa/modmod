## Why

Data modeling rules are often specific to organizations and projects. To enable AI agents (Gemini, Codex, Claude) to effectively assist in building and maintaining `model.yaml`, they need a clear, centralized set of rules. This change introduces an `init` command to scaffold these rules and the necessary agent-specific configurations.

## What Changes

- **New `modmod init` Command**: A CLI command to initialize a project with AI modeling rules.
- **Centralized Rules File**: Creation of `.modmod/rules.md` as the Single Source of Truth for modeling conventions.
- **Agent-Specific Scaffolding**: Automatic generation of configuration files for Gemini (`.gemini/`), Codex (`.codex/`), and Claude (`.clauderules`) that point to the centralized rules.
- **Templates**: Integrated templates for common modeling methodologies and naming conventions.

## Capabilities

### New Capabilities
- `agent-scaffolding`: Logic to generate directory structures and files for different AI agents.
- `rules-templating`: A set of extensible Markdown templates for defining modeling methodologies, naming conventions, and data types.
- `init-command`: The CLI entry point for the initialization workflow.

### Modified Capabilities
- `cli-integration`: Extension of the core CLI to support the new `init` command.

## Impact

- **New Files**: `.modmod/rules.md`, `.gemini/skills/modeler.md`, `.codex/instructions.md`, `.clauderules`.
- **CLI Extension**: The `modmod` command will gain an `init` subcommand.
- **Improved DX**: Significant boost in AI agent reliability when editing `model.yaml`.
