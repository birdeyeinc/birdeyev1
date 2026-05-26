# Elemental Storybook audit (birdeye-v1)

**Source:** birdeyev2 `main` (~137 `src/stories` files) vs Elemental `BK-BIRD-00000-learning` (~101 catalog stories + Styles/).

**Policy:** Elemental Storybook (external `elemental` repo, port 3000 via `npm run storybook:elemental`) is the only design catalog. Root app Storybook removed. App consumes `@birdeye/elemental` from npm — not a vendored `packages/elemental` copy.

## Legend

| Status | Meaning |
|--------|---------|
| **SoT** | Retired from app; Elemental Styles/ or Atom/ defines spec |
| **Pattern** | Migrated to `Pattern/Birdeye/` in Elemental SB |
| **Delete** | Removed with root `src/stories/` (duplicate of Elemental Atom/) |
| **Align** | App code kept; typography/color from Elemental tokens |

## Migrated to Pattern/Birdeye

| Former app story | Elemental path | Status |
|------------------|----------------|--------|
| AppShell.stories | Pattern/Birdeye/AppShell | **Pattern** |
| Sidebar.stories | Pattern/Birdeye/Sidebar | **Pattern** |
| TopBar.stories | Pattern/Birdeye/TopBar | **Pattern** |

## Superseded by Elemental (SoT)

| Former app story | Elemental SoT | Status |
|------------------|---------------|--------|
| Design System/Typography | Styles/Typography | **SoT** / **Delete** |
| Design System/Tokens | Styles/Colors, DS Class System | **SoT** / **Delete** |
| Design System/Icons | Atom/Icon | **SoT** / **Delete** |
| UI/* (~55) | Atom/* / Component/* | **Delete** (use Elemental + `@birdeye/elemental` in app) |

## App-only (implementation in `src/`, no app SB story)

| Area | Status |
|------|--------|
| Product views (`App/Views/*`) | **Align** — compose in app; optional future Pattern/Birdeye/Views |
| Myna / agent-builder | **Align** — typography only |
| Shell code (`Sidebar`, `L2NavLayout`, `TopBar`) | **Align** — structure unchanged |

## Next passes

1. Replace shadcn `ui/*` with `@birdeye/elemental` exports where mapped.
2. Optional: migrate high-value view stories to Pattern/Birdeye/Views.
