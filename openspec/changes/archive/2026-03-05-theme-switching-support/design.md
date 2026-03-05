## Context

Modern apps use the `.dark` class on the `<html>` or a top-level `<div>` to trigger Tailwind's dark mode. We will follow this pattern.

## Goals / Non-Goals

**Goals:**
- Seamless transition between themes without page reload.
- Persist user choice across sessions.
- Maintain readable contrast for all entity types (Fact, Dim, etc.) in light mode.

**Non-Goals:**
- Creating a full "Theming Engine" for custom user colors.

## Decisions

### 1. Unified Theme Store
In `useStore.ts`, we'll add:
- `theme: 'light' | 'dark'` (Default: 'dark')
- `toggleTheme()`: Swaps the state and updates `localStorage`.

### 2. CSS Variable Bridge
Define core colors in `index.css` using variables:
- `--canvas-bg`: `#020617` (Dark) / `#f8fafc` (Light)
- `--node-bg`: `#1e293b` (Dark) / `#ffffff` (Light)
- `--text-primary`: `#f1f5f9` (Dark) / `#0f172a` (Light)

### 3. Light Mode Aesthetic
For Light Mode, we will use:
- **Background**: Slate-50.
- **Borders**: Slate-200.
- **Glassmorphism**: White-based blur (`bg-white/70 backdrop-blur-md`).
- **Nodes**: Solid white with a subtle Slate-200 border and larger shadow to pop against the light background.

### 4. CodeMirror Integration
Use `@codemirror/theme-one-dark` for dark and a standard light theme (like `oneLight` or default) for light mode.

## Risks / Trade-offs

- **[Risk] Visual Inconsistency**: Some hardcoded HEX values in components might look bad in light mode.
  - *Mitigation*: Audit `TableNode`, `DetailPanel`, and `Sidebar` to replace hardcoded dark colors with theme-aware classes or variables.
