# Typography audit (Elemental BK-BIRD-00000-learning)

**Source of truth:** [birdeyeinc/elemental @ `BK-BIRD-00000-learning`](https://github.com/birdeyeinc/elemental/tree/BK-BIRD-00000-learning) — see `src/Docs/inter-typography-audit.md` in that branch.

## Rules

| Rule | Elemental | birdeye-v1 |
|------|-----------|------------|
| Font family | Inter, arial, sans-serif | `--font-family-brand` in `src/styles/typography.css`; Inter 400+500 via `<link>` in `index.html` (not CSS `@import` — Vite bundles `elemental-colors.css` first) |
| Weights | **400** regular, **500** medium only | `--font-weight-regular`, `--font-weight-medium`; Tailwind `font-semibold`/`font-bold` clamp to 500 |
| Base size | 14px (`$fs14`) | `--font-size-base: 14px`; `:root --font-size` uses it |
| No light (300) | Not on DS surface | Inline `fontWeight: 300` removed from shell + BirdAI/agent views |
| No heavy (600/700) | Map to 500 | Clamped in theme + agent-builder CSS |

## Token files

- `src/styles/typography.css` — fs10–fs32, lh10–lh32, `.font-regular` / `.font-medium`
- `src/styles/theme.css` — base 14px, Tailwind weight overrides, `@layer base` headings
- `src/themes/v1/tokens.css` — `--token-font-size-sm/md`, weight tokens

## Mapping (reviewers)

| Old habit | Elemental mapping |
|-----------|-------------------|
| `fontWeight: 300`, muted text | **400** (`font-regular`) |
| Body / inactive nav | **400** |
| Labels, active nav, emphasis | **500** (`font-medium`) |
| `font-semibold`, 600, 700, bold | **500** |
| Roboto | **Inter** (inherit or `var(--font-family-brand)`) |

## Scope completed

- Shell: TopBar, L2NavLayout, Sidebar, `mainViewTitleClasses`
- BirdAI / agents: AgentDetail, AgentsMonitor, AgentLibrary, AgentOnboarding, AgentsBuilder, BirdAIReports, MonitorNotifications, ScheduleBuilder, BusinessOverview, report modals, ComponentShowcase
- Approvals / awaiting approval / post drawer (Roboto removed)
- Agent-builder subtree CSS/JSX (76+ files)

## Deferred

- `src/imports/*` — Figma paste with hundreds of Roboto / `font-semibold` classes; fix when those screens are productized
- `CreatePostView`, `AICustomizePanel` — social/report builder still reference Roboto in font pickers and inline styles

## Verify

```bash
npm run build
```

DevTools on shell routes: `font-family` → Inter; `font-weight` ∈ {400, 500}.
