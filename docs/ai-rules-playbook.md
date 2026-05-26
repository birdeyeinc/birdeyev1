# AI Rules Playbook

How this project wires up rules, skills, and sync across Claude, Gemini, Codex, and Cursor — and how to replicate this setup in a new project.

---

## The problem this solves

When multiple AI assistants work on the same codebase, each one reads its own instruction file. Without a system, rules drift — one assistant follows the spacing grid, another doesn't. This playbook describes the setup that keeps all assistants in sync from a single source of truth.

---

## Architecture overview

```
birdeyev2/
│
├── CLAUDE.md                          ← SOURCE OF TRUTH — edit only this one
├── GEMINI.md                          ← auto-generated from CLAUDE.md
├── AGENTS.md                          ← auto-generated from CLAUDE.md
│
├── .github/
│   └── copilot-instructions.md        ← auto-generated from CLAUDE.md
│
├── .cursor/
│   └── rules/                         ← Cursor-specific (`*.mdc`; full list below)
│       (birdeyev2 ships several in-repo; you may mirror the same text at Cursor **account** level for other repos)
│
├── .claude/
│   └── skills/
│       └── aero-ds/
│           └── SKILL.md               ← deep reference (all files link here)
│
└── scripts/
    └── sync-ai-rules.mjs              ← sync script
```

---

## Which file each assistant reads

| Assistant | File |
|---|---|
| Claude Code (this tool) | `CLAUDE.md` |
| Gemini CLI | `GEMINI.md` |
| Codex CLI (OpenAI) | `AGENTS.md` |
| GitHub Copilot (VS Code / JetBrains) | `.github/copilot-instructions.md` |
| Cursor | `.cursor/rules/*.mdc` |

---

## The sync system

### How it works

`CLAUDE.md` is the single source of truth. The other three flat files (`GEMINI.md`, `AGENTS.md`, `copilot-instructions.md`) are generated from it — same content, only the header line changes.

### Sync script

**File:** `scripts/sync-ai-rules.mjs`

Run manually:
```bash
node scripts/sync-ai-rules.mjs
```

What it does:
1. Reads `CLAUDE.md`
2. Strips the first header line
3. Writes the body to each target file with the correct assistant-specific header
4. Prints a confirmation for each file written

### Pre-commit hook (automatic)

**File:** `.git/hooks/pre-commit`

```sh
#!/bin/sh
node scripts/sync-ai-rules.mjs
git add GEMINI.md AGENTS.md .github/copilot-instructions.md
```

This runs automatically on every `git commit`. You never need to think about syncing — just edit `CLAUDE.md` and commit.

> Note: `.git/hooks/` is not committed to git. If a teammate clones the repo, they need to set up the hook themselves:
> ```bash
> cp .git/hooks/pre-commit .git/hooks/pre-commit  # already there after clone? no — see below
> ```
> To share hooks with the team, consider committing the hook to a `scripts/hooks/` folder and adding a setup step to the README:
> ```bash
> cp scripts/hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
> ```

---

## What CLAUDE.md enforces (canonical sections)

`CLAUDE.md` is the numbered contract assistants read after sync. **When you add a new § in `CLAUDE.md`, append a row here** and run `node scripts/sync-ai-rules.mjs` so `AGENTS.md` / `GEMINI.md` / Copilot stay aligned.

| # | Rule | What it enforces |
|---|---|---|
| 1 | **Storybook story required** | Every new component needs a story in `src/stories/`. Modified components need updated stories. |
| 2 | **Spacing grid** | 8px default rhythm, 4px dense. Avoid `gap-3`, `gap-5`, `p-3`, `px-5`. |
| 3 | **Icon stroke** | Lucide icons use `strokeWidth={1.6}`. Add `absoluteStrokeWidth` when not 24px. |
| 4 | **UI tags sentence case** | Badges, chips, status tags: sentence case only. |
| 5 | **Design system tokens** | Colour from `theme.css`, shell layout from `appShellClasses.ts`, no `border-b` on canvas header. |
| 6 | **aero-ds npm package** | Import from `@balajik-cmyk/aero-ds`. Don't duplicate constants. Don't modify `aero-ds/` directly. |
| 7 | **Stack reference** | React · Vite · Tailwind v4 · shadcn-style · Radix UI · TanStack Table · React Router v7 · Storybook 8 |
| 8 | **No `!important` / Tailwind `!`** | Do not add CSS `!important` or Tailwind’s `!` prefix in `src/` UI; fix conflicts with structure, props, and `cn()` / `tailwind-merge`. Exceptions: print/global resets in `theme.css`, legacy CSS until refactored. |
| 9 | **KPI value matrices** | All metric hero numbers use `<KpiValue>` from `@/app/components/KpiValue`. Never redefine locally. Label always sentence case. Negative change: prefix `"-"`. `large` for 30 px heroes. Verify at **UI/KpiValue** in Storybook. |

---

## Cursor: project-level vs account-level rules

### Account-level (applies to ALL your projects in Cursor)

Go to: **Cursor → Settings → Cursor Settings → Rules for AI**

Paste the rule content (without the `---` frontmatter block) for cross-project habits — for example:

| Rule | Why account-level |
|---|---|
| `spacing-grid` | 8px grid is universal for any web UI |
| `ui-tags-sentence-case` | Sentence case on chips is universal UX |
| `no-important` | Avoids `!important` / Tailwind `!` in any TS/CSS UI you touch |

Birdeyev2 still ships **`spacing-grid.mdc`**, **`ui-tags-sentence-case.mdc`**, and **`no-important.mdc`** in `.cursor/rules/` so the repo stays self-contained for teammates who only clone and open in Cursor.

### Project-level (this repo only, in `.cursor/rules/`)

**Scaling:** add a new `.mdc` when a rule is long, glob-specific, or Cursor-only; keep a one-line summary in the table below. **Always-on** rules (`alwaysApply: true`) are listed first.

| Rule file | `alwaysApply` | Glob scope (summary) | What it does |
|---|---|---|---|
| `spacing-grid.mdc` | yes | (default / wide) | 8px + 4px dense Tailwind rhythm for UI and Storybook |
| `no-important.mdc` | yes | `src/**/*.{tsx,ts,css}` | Ban CSS `!important` and Tailwind `!`; use merge and structure instead |
| `aero-ds-saas-storybook.mdc` | no | App, stories, Storybook, theme CSS | SaaS shell + Storybook + token alignment (mirrors aero-ds skill) |
| `storybook-story-required.mdc` | no | `src/app/components/**` | New components must ship with a story |
| `storybook-new-component.mdc` | no | `src/stories/**`, `src/app/components/ui/**` | Reuse vs extend vs new primitive (e.g. Sheet for floating panels) |
| `icon-stroke-lucide.mdc` | no | `src/app/components/**`, `src/stories/**` | 1.6px Lucide stroke + `absoluteStrokeWidth` when not 24px |
| `ui-tags-sentence-case.mdc` | no | (requestable / optional globs) | Sentence case for badges, pills, status tags, compact filters |
| `kpi-value.mdc` | no | `src/app/components/**`, `src/stories/**` | KPI matrix — always use `KpiValue` component, sentence-case labels, negative prefix `"-"` |

You can **duplicate** `spacing-grid` / `ui-tags-sentence-case` at Cursor **account** level for other repos; birdeyev2 keeps them in-repo so clones behave the same without per-developer setup.

---

## The skill file

**File:** `.claude/skills/aero-ds/SKILL.md`

This is the deep reference — invoked with `/aero-ds` in Claude Code or referenced in Cursor via the `aero-ds-saas-storybook.mdc` rule. It contains:

- Full shell architecture diagram (L1, TopBar, L2, Main canvas)
- All design token quick-refs (colour, spacing, radius, shadow, typography)
- Component-specific patterns (AppDataTable, Sheet/FloatingSheetFrame, BootInsightsLoader, SegmentedToggle, etc.)
- Copy-paste prompts for full-page builds from Figma or screenshots
- Pre-delivery checklist

The flat files (`CLAUDE.md` etc.) are short summaries. The skill file is the full detail. All flat files link to it.

---

## The aero-ds npm package workflow

### What it is

`@balajik-cmyk/aero-ds` is the published design system package. It lives at [github.com/balajik-cmyk/aero-ds](https://github.com/balajik-cmyk/aero-ds) and is published to npm.

### What it exports

| Import | Provides |
|---|---|
| `import { cn }` | Tailwind merge utility |
| `import { DESIGN_VERSION }` | Current design version |
| `import { APP_SHELL_* }` | Shell layout class constants |
| `import { FLOATING_PANEL_* }` | Floating panel surface classes |
| `import { SLIDE_MS, SLIDE_EASING }` | Motion constants |
| `import "@balajik-cmyk/aero-ds/theme.css"` | Canonical design token CSS |

### Publishing a new version

1. Make changes in the `aero-ds` repo
2. Bump version in `aero-ds/package.json`
3. `git tag v1.x.y && git push origin v1.x.y`
4. GitHub Actions publishes to npm
5. In `birdeyev2`: `npm install @balajik-cmyk/aero-ds@1.x.y`
6. Commit the updated `package.json` + `package-lock.json`

### Installing (first time / new machine)

```bash
npm install
```

---

## How to apply this to a new project

### Step 1 — Create the four assistant files

```
CLAUDE.md                         ← write your rules here
GEMINI.md                         ← will be auto-generated
AGENTS.md                         ← will be auto-generated
.github/copilot-instructions.md   ← will be auto-generated
```

Start with `CLAUDE.md`. Mirror the **canonical section list** in [What CLAUDE.md enforces](#what-claudemd-enforces-canonical-sections); when you add §9+, extend that table and your flat files together.

### Step 2 — Add the sync script

Copy `scripts/sync-ai-rules.mjs` from this repo. Run it once to generate the other files:
```bash
node scripts/sync-ai-rules.mjs
```

### Step 3 — Wire the pre-commit hook

```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
node scripts/sync-ai-rules.mjs
git add GEMINI.md AGENTS.md .github/copilot-instructions.md
EOF
chmod +x .git/hooks/pre-commit
```

### Step 4 — Add Cursor rules

Create `.cursor/rules/` and add `.mdc` files for project-specific rules. Frontmatter format:

```
---
description: One-line description of when this rule applies
globs: src/app/**/*.tsx, src/stories/**/*.tsx
alwaysApply: false
---

# Rule title
...rule content...
```

Set `alwaysApply: true` only for rules that should fire on every file (e.g. spacing grid).

### Step 5 — Add universal rules to Cursor account level

In Cursor → Settings → Rules for AI, paste any rules that apply across all your projects (spacing, casing conventions, etc.).

### Step 6 — Add a skill (Claude only)

Create `.claude/skills/<skill-name>/SKILL.md` with deep reference content. Reference it from `CLAUDE.md` with:
```
> Full reference: `.claude/skills/<skill-name>/SKILL.md`
```

---

## Day-to-day workflow

| Task | What to do |
|---|---|
| Add or change a rule | Edit `CLAUDE.md` → commit (hook auto-syncs) |
| Add a Cursor-specific rule | Add `.mdc` file to `.cursor/rules/` |
| Update the deep reference | Edit `.claude/skills/aero-ds/SKILL.md` directly |
| New teammate setup | Clone repo → `npm install` |
| Update aero-ds package | PR in aero-ds repo → tag → publish → bump version pin in birdeyev2 |

---

## Maintaining this playbook at scale

| Change | Update |
|---|---|
| New numbered rule in `CLAUDE.md` | Add a row under **What CLAUDE.md enforces**; run `node scripts/sync-ai-rules.mjs`; commit generated files. |
| New Cursor-only detail or glob | Add `.cursor/rules/<name>.mdc` and a row under **Project-level**; set `alwaysApply` only when it must run on every prompt. |
| Rule that applies to all your repos | Prefer Cursor **account** rules; optionally keep a copy in birdeyev2 for clone parity. |
