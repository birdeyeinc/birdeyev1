# Claude Code — project rules for ShareConsolidated (Bird AI)

> Full design intelligence: `.claude/skills/aero-ds/SKILL.md`

---

## 1. No Storybook in this repo

Stories live in the `aero-ds` GitHub repo (`github.com/balajik-cmyk/aero-ds`).
Do **not** create `.stories.tsx` files in `bird-ai` under any circumstances.
When creating or modifying components, **skip the story step entirely**.

### Before adding a new UI primitive — check first

1. State the intent in one line (what job does this UI do?).
2. Search `src/app/components/ui/` for an existing match.
3. Report the closest existing component file.
4. Decide: **extend**, **compose**, **replace**, or **new primitive** — and why.

Do **not** introduce a second primitive for the same pattern without that decision. Floating side panels → use **`Sheet`** with `inset="floating"`, not a bespoke `fixed` div.

---

## 2. Spacing grid (8px / 4px dense)

- Default rhythm: multiples of **8px** — `gap-2` (8px) · `gap-4` (16px) · `gap-6` (24px) · `gap-8` (32px)
- Dense rhythm: **4px** — `gap-1` for label-to-control, icon gaps
- **Avoid:** `gap-3`, `gap-5`, `p-3`, `px-3`, `px-5` (off-grid)

---

## 3. Icon stroke (1.6px) and icon colour

- All Lucide icons: `strokeWidth={1.6}` (source: `l1StripIconTokens.ts`)
- When icon size is **not** 24px: also add `absoluteStrokeWidth` so stroke stays 1.6px on screen
- Do **not** rely on Lucide's default `strokeWidth={2}`
- **Icon colour:** use `text-icon-primary` (bluish primary black `#1b2436` light / `#c8d6e8` dark) for all product icons — settings tiles, sidebar rail. Do **not** use `text-foreground` for icons. Use `text-muted-foreground` only for secondary/disabled icons.

---

## 4. UI tags / badges — sentence case

Badges, pills, status tags, chips: **sentence case** only.
- `Customer interaction` ✓ — `Customer Interaction` ✗
- Single words stay capitalized: `Success`, `Failed`, `Processing`

---

## 5. Design system tokens

| What | Where |
|---|---|
| Colour tokens | `src/styles/theme.css` → Tailwind: `bg-primary`, `text-muted-foreground`, `border-border` |
| Main canvas title | `MAIN_VIEW_PRIMARY_HEADING_CLASS` from `layout/mainViewTitleClasses.ts` |
| Shell layout classes | `APP_SHELL_*` from `layout/appShellClasses.ts` |
| Floating panel | `FLOATING_PANEL_SURFACE_CLASSNAME` from `ui/floatingPanelSurface.ts` |
| Modal overlay | `MODAL_OVERLAY_VISUAL_CLASS` from `ui/modalOverlayClasses.ts` |
| No `border-b` on canvas header | Title band stays open into body — dividers go on inner cards |
| No border on modal/sheet content | Use shadow for depth, not perimeter border |
| All token constants | Will move to `@balajik-cmyk/aero-ds` — update local imports after Phase 2 of DS migration |

---

## 6. aero-ds npm package

`@balajik-cmyk/aero-ds` is the published package — import from it, don't duplicate constants.

| Import | Provides |
|---|---|
| `import { cn } from "@balajik-cmyk/aero-ds"` | Tailwind merge utility |
| `import { DESIGN_VERSION } from "@balajik-cmyk/aero-ds"` | Design version token |
| `import { APP_SHELL_BELOW_TOPBAR_CARD_CLASS, APP_SHELL_GUTTER_SURFACE_CLASS, APP_MAIN_CONTENT_SHELL_CLASS } from "@balajik-cmyk/aero-ds"` | Shell layout |
| `import { FLOATING_PANEL_SURFACE_CLASSNAME, FLOATING_PANEL_LIST_PADDING_CLASSNAME } from "@balajik-cmyk/aero-ds"` | Floating panel |
| `import { SLIDE_MS, SLIDE_EASING } from "@balajik-cmyk/aero-ds"` | Motion constants |
| `import "@balajik-cmyk/aero-ds/theme.css"` | Canonical token CSS |

Do **not** modify `aero-ds/` directly — it is a separate repo. Open a PR at `github.com/balajik-cmyk/aero-ds`, publish a new version, then update the version pin in `package.json`.

---

## 7. Stack

React · Vite · Tailwind v4 · shadcn-style primitives · Radix UI · TanStack Table · React Router v7 · Playwright · Vitest

---

## 8. Sticky table column headers — `scrollableBody` required

All `AppDataTable` instances must keep column headers visible while rows scroll. **Never** wrap `AppDataTable` in an `overflow-auto` / `overflow-y-auto` div — that causes column labels to scroll under the view header.

**Correct pattern:**
```tsx
{/* Parent: flex column, min-h-0 so the table can fill remaining height */}
<div className="flex-1 flex flex-col min-h-0 px-6 py-4">
  <AppDataTable
    scrollableBody   {/* ← required — scrolls body internally, thead stays pinned */}
    ...
  />
</div>
```

**Wrong pattern (do not use):**
```tsx
<div className="flex-1 overflow-y-auto px-6 py-4">  {/* ✗ outer scroll */}
  <AppDataTable ... />                               {/* ✗ no scrollableBody */}
</div>
```

When a view contains multiple tables (e.g. tabs), remove `overflow-y-auto` from the outer container and add `scrollableBody` to each `AppDataTable` individually.

---

## 9. Sticky first column — always on for directory/list tables

All directory-style `AppDataTable` instances (Waitlist, Contacts, Campaigns, Providers, Referrals, and any multi-column list view) **must** pin the first column so it stays visible during horizontal scroll.

- **`stickyFirstColumn` defaults to `true`** — never explicitly pass `false` on a table with more than 4 columns or any horizontal scroll.
- The sticky column is the primary label (patient name, contact name, provider name, etc.).
- `stickyLeadingColumnCount` defaults to `1`; only set to `2` if a checkbox-select column also needs to be pinned alongside the label.

```tsx
{/* ✅ Correct — first column pinned (default) */}
<AppDataTable scrollableBody ... />

{/* ✗ Wrong — never disable on list/directory tables */}
<AppDataTable stickyFirstColumn={false} ... />
```

**Sticky cell background must always be opaque.** The sticky leader cell uses `bg-background` as its base and layers hover/selected tint via `::after` pseudo-element — never apply `bg-muted/30` directly on the cell itself, as partial-opacity backgrounds let horizontally-scrolled columns bleed through. This is enforced inside `AppDataTable.tsx` (`STICKY_LEADER_CELL_BASE`).

---

## 10. Always use the canonical Storybook variant — never patch inline

When changing a component (adding, removing, or swapping a prop like an icon, size, or colour), **always match an existing variant from the design system Storybook** (`github.com/balajik-cmyk/aero-ds`) rather than patching it inline with extra classes or JSX.

**Decision order:**
1. Check the relevant story (e.g. `UI/Button`, `UI/Badge`, `UI/Avatar`) for an existing variant that fits.
2. If a variant exists → use it as-is. Do **not** add wrapper `className` overrides that duplicate what the variant already does.
3. If no variant fits → extend the component in `aero-ds`, publish a new version, then consume it here.

**Button size rule — always default unless there is a dedicated reason:**
- Use `<Button>` (no `size` prop) for all standard actions — this is the primary size.
- Only use `size="sm"` for dense toolbars, table row actions, or inline controls where space is genuinely constrained.
- Only use `size="lg"` for hero CTAs (onboarding, empty states, marketing surfaces).
- Never use `size="sm"` just because the surrounding UI feels small — resize the layout, not the button.

```tsx
// ✗ Wrong — sm used without a real reason
<Button size="sm" className="h-9 px-3 text-[13px]">Send reminder</Button>

// ✓ Correct — default size, no overrides
<Button>Send reminder</Button>
<Button variant="outline">Reschedule</Button>
<Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">Cancel</Button>
```

This keeps one source of truth: the design system. If the variant doesn't exist in Storybook, it shouldn't exist in the app either.

---

## 11. No `!important` (CSS or Tailwind `!`)

- Do **not** add **`!important`** in CSS, or Tailwind’s **`!` prefix** (e.g. `!px-4`, `hover:!text-white`), in new or edited UI under `src/`.
- **Fix conflicts** with structure, tokens, component props, or **`cn()` / `tailwind-merge`** so the last, intentional utility wins.
- **Exceptions:** global **`@media print`** (or similar) resets in `theme.css`, and **legacy** bundles (e.g. agent-builder `.css`) until refactored — do **not** expand `!important` there; migrate when touching those files.

---

## 12. KPI value matrices — `KpiValue` component

All metric hero numbers in reporting views (Profile performance, Listings report, and any future reporting surface) must use **`<KpiValue>`** from `@/app/components/KpiValue`.

**Never** redefine a local `KpiValue` function in a view file — import the shared component.

| Prop | Rule |
|---|---|
| `label` | **Sentence case only** — `Profile completeness` ✓ / `PROFILE COMPLETENESS` ✗ |
| `change` | Prefix with `"-"` for negative (red ↓ `TrendingDown`). Omit entirely for no badge. |
| `large` | `true` for performance-summary hero numbers (30 px). Default (20 px) for per-chart KPI rows. |

**Performance summary grid** (large heroes):
```tsx
<div className="flex w-full flex-wrap items-start gap-[80px_80px]">
  <KpiValue value="52%" change="+1%" label="Profile completeness" large />
  <KpiValue value="2,070"            label="Synced locations"     large />
</div>
```

**Per-chart KPI row** (default size):
```tsx
<div className="flex items-end gap-6">
  <KpiValue value="52%" change="+1%" label="All sites" />
  <KpiValue value="51%"              label="Previous period" />
</div>
```

---

## 11. AppDataTable column customizer — `meta.settingsLabel` required

The column customizer sheet falls back to the raw column `id` when no label is set, producing camelCase strings like `apptTypes` or `ehrSync`. Every hideable column **must** declare `meta: { settingsLabel: "..." }` with a **sentence-case** human label.

```tsx
col.accessor("apptTypes", {
  id: "apptTypes",
  header: "Appt types",
  meta: { settingsLabel: "Appt types" },   // ← required; matches header text
  ...
})
```

- `settingsLabel` must match the column `header` string (use the same sentence-case text).
- Acronyms stay uppercase: `"NPI"`, `"EHR sync"`.
- Columns with `enableHiding: false` (e.g. the actions column) are exempt — they never appear in the sheet.

