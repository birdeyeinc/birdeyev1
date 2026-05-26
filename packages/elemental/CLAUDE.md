# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Elemental (`@birdeye/elemental`) is Birdeye's shared React UI component library. It is consumed as an npm package by other Birdeye applications. The library is bundled with Rollup and documented via Storybook.

## Agent skills (Cursor, Claude Code, Codex)

Canonical skills live in [`skills/`](skills/). See [AGENTS.md](AGENTS.md) for tool paths and global install.

| Skill | Purpose |
|-------|---------|
| [elemental-icons](skills/elemental-icons/SKILL.md) | Phoenix `icon_phoenix-*` vs optional Lucide (`atoms/Icon`); TabsToggle icon rules; no bulk migration |
| [elemental-bk-bird-workflow](skills/elemental-bk-bird-workflow/SKILL.md) | `BK-BIRD-00000-learning` integration branch, feature branches, merge-back policy |

**Tool paths:** `.cursor/skills/` and `.claude/skills/` mirror `skills/`. For Codex/Claude global discovery: `./scripts/install-agent-skills.sh` (symlinks into `~/.codex/skills` and `~/.claude/skills`).

Cursor file rule: [`.cursor/rules/elemental-development.mdc`](.cursor/rules/elemental-development.mdc) (when editing `src/`).


## Commands

- **Storybook dev server:** `yarn story` (runs on port 3000)
- **Production build (Rollup):** `yarn rollup` (outputs to `core/`)
- **Lint:** `yarn lint` (ESLint flat config, `eslint.config.mjs`)
- **Build for distribution:** `yarn build:dev` (rollup + package into `build/`)

There is no test runner configured in this project.

## Architecture

### Source Layout (`src/`)

- **`atoms/`** — Primitive, low-level UI components (Button, Tooltip, Modal, Select, Avatar, etc.). Each atom is a self-contained folder with its component, styles, and optional story file.
- **`components/`** — Higher-level composed components built from atoms (Table, Form, RailNav, DatePicker, WorkflowCanvas, RichTextEditor, etc.).
- **`hooks/`** — Shared React hooks (`useClickOutside`, `useControlled`, `useHandleScroll`).
- **`utils/`** — Shared utilities (validation, phone utils, constants).
- **`sass/`** — Global SCSS variables, mixins, and shared color definitions (also exported as JS via `sass/js/colors`).
- **`assets/`** — Static assets (images, icons).
- **`index.js`** — Single barrel export file. Every public component must be imported and re-exported here to be included in the bundle.

### Key Conventions

- **Path aliases:** Imports use bare aliases (`atoms/Button`, `components/Table`, `sass/variables`, `utils/`, `hooks/`, `constants/`, `assets/`). These are configured in `tsconfig.json` (paths), `rollup.config.mjs` (alias plugin), and `.storybook/main.ts` (Vite resolve).
- **CSS Modules:** Styles use `*.module.scss` files with auto-generated scoped class names (pattern: `{BaseName}__{localName}__{hash}`).
- **Mixed JS/TS codebase:** Older components are JSX/JS, newer components use TSX/TS. TypeScript strict mode is enabled.
- **Stories:** Co-located with components as `ComponentName.stories.{jsx,tsx}`. Storybook 7 with React-Vite framework.

### Build Pipeline

Rollup bundles `src/index.js` into `core/` as ESM with `preserveModules` (tree-shakeable output). TypeScript declarations are emitted to `core/`. SCSS is inlined via PostCSS. Peer dependencies (React, react-dom, date-fns, etc.) and heavy externals (tiptap, grapesjs) are excluded from the bundle.

### Adding a New Component

1. Create the component folder under `src/atoms/` (primitive) or `src/components/` (composed).
2. Add a `*.stories.{jsx,tsx}` file alongside the component.
3. Import and re-export the component from `src/index.js`.

### Table Component Documentation

When editing or updating any file under `src/components/Table/`, check whether the change affects behavior, props, callbacks, or data structures documented in:
- `src/components/Table/skills/elemental-table-migration/SKILL.md` and its `references/` files — migration skill used by developers adopting the Table component
- `src/components/Table/Documentation.md` — standalone usage documentation

If the code change alters any documented behavior, update the relevant skill/doc files to stay in sync. This includes changes to: prop defaults, callback signatures, type interfaces, rendering logic, feature flags, and column management APIs.

### ESLint Rules

- TS files: `@typescript-eslint/no-explicit-any` is `warn` (not error).
- JS files: `prefer-const` is enforced.
- Story files: `no-unused-vars` and `react/no-unescaped-entities` are disabled.
