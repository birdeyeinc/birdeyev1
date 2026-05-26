# Elemental (npm, not vendored)

birdeye-v1 does **not** ship a full copy of the Elemental repo under `packages/`. Use the published package and an external Elemental clone for Storybook.

## Install

```bash
npm install --legacy-peer-deps
```

Dependency: `@birdeye/elemental` (same version family as UI-web-2.0, e.g. `1.2.5`). Use your org’s npm registry if install fails on a clean machine.

## Scripts

| Script | What it does |
|--------|----------------|
| `npm run build:elemental` | Builds Elemental from `ELEMENTAL_ROOT` (default `../Source/elemental`), or verifies `node_modules/@birdeye/elemental/core` |
| `npm run storybook:elemental` | Runs Elemental Storybook on port **3000** from the external repo; shell stories use this app via `BIRDEYE_PROTOTYPE_ROOT` |

## Paths

| Variable | Default | Purpose |
|----------|---------|---------|
| `ELEMENTAL_ROOT` | `../Source/elemental` | Elemental git repo (build + Storybook) |
| `BIRDEYE_PROTOTYPE_ROOT` | set by `storybook:elemental` | Points Elemental SB `@birdeye` alias at `birdeye-v1/src/app` |

## Pattern/Birdeye stories

Shell stories (`AppShell`, `Sidebar`, `TopBar`) live in the **elemental** repo at `src/patterns/Birdeye/`, not in birdeye-v1.

## App usage

Import from the package when migrating UI (same as UI-web-2.0):

```ts
import { Button } from "@birdeye/elemental/core/...";
```

Until migration, the prototype keeps birdeyev2 Tailwind shell in `src/app/`.

## Typography (BK-BIRD-00000-learning)

Typography is aligned with Elemental on branch **`BK-BIRD-00000-learning`**:

| Token | Value |
|-------|--------|
| Font | Inter (`--font-family-brand`) |
| Weights | 400 regular, 500 medium only |
| Base size | 14px (`--font-size-base`) |
| Scale | fs10–fs32, lh10–lh32 in `src/styles/typography.css` |

See **[typography-audit.md](./typography-audit.md)** for mapping rules and deferred debt (`src/imports/*` Figma paste).

**Note:** `npm run dev` uses tokens in `src/styles/`; Elemental package version in `node_modules` is independent unless you link a local `file:../Source/elemental` build.
