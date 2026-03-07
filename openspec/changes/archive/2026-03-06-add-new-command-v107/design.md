## Context

We need a way to scaffold a valid `model.yaml` quickly. The logic for safe file writing exists in `init.js`, so we will extract/reuse it.

## Goals / Non-Goals

**Goals:**
- Enable `modscape new folder/sub/my-model` to work out-of-the-box.
- Provide a template that demonstrates all Modscape features.
- Release version 1.0.7.

**Non-Goals:**
- Combining `init` and `new`.

## Decisions

### 1. `modscape new` Logic
- Path resolution: Use `path.resolve(process.cwd(), arg)`.
- Directory creation: `fs.mkdirSync(dir, { recursive: true })`.
- Extension check: If no `.yaml` or `.yml`, append `.yaml`.

### 2. Boilerplate YAML
The template will include:
- A sample domain.
- A table with `logical_name` and `physical_name`.
- A table with `sampleData`.
- An empty `relationships` and `lineage` array.

### 3. Version Update Map
- `package.json`: `version: 1.0.7`
- `visualizer/package.json`: `version: 1.0.7`
- `src/index.js`: `.version('1.0.7')`
- `visualizer/src/components/Sidebar/Sidebar.tsx`: `Modscape v1.0.7`

## Risks / Trade-offs

- **[Risk] Directory Over-creation**: If a user typos a path, it might create unwanted folders.
  - *Mitigation*: We will log exactly which file was created to inform the user.
