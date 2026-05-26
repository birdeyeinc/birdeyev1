# GitHub Copilot / Codex — project rules for ShareConsolidated (Bird AI)
## 1. Storybook story required for every new component

When you create a **new** component under `src/app/components/` (including `ui/`), you **must** also create a story under `src/stories/` in the same response. When **modifying** an existing component, update its story to reflect the change.

**Do not** consider a component task complete without a story.

- File: `src/stories/<ComponentName>.stories.tsx`
- Title: `UI/<Name>` for primitives · `App/<Name>` for views/panels · `Design System/<name>` for token demos
- Always include a `Default` story + one story per key variant
- Use sentence case for story names
- Import the component directly — no mocks

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "@/app/components/MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "UI/MyComponent",
  component: MyComponent,
};
export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = { args: {} };
```

### Before adding a new UI primitive — check first

1. State the intent in one line (what job does this UI do?).
2. Search `src/app/components/ui/` and Storybook titles for an existing match.
3. Report the closest existing story and component file.
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

React · Vite · Tailwind v4 · shadcn-style primitives · Radix UI · TanStack Table · React Router v7 · Storybook 8 · Playwright · Vitest

---

## 8. No `!important` (CSS or Tailwind `!`)

- Do **not** add **`!important`** in CSS, or Tailwind’s **`!` prefix** (e.g. `!px-4`, `hover:!text-white`), in new or edited UI under `src/`.
- **Fix conflicts** with structure, tokens, component props, or **`cn()` / `tailwind-merge`** so the last, intentional utility wins.
- **Exceptions:** global **`@media print`** (or similar) resets in `theme.css`, and **legacy** bundles (e.g. agent-builder `.css`) until refactored — do **not** expand `!important` there; migrate when touching those files.

---

## 9. KPI value matrices — `KpiValue` component

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

**Storybook:** `UI/KpiValue` — [`KpiValue.stories.tsx`](src/stories/KpiValue.stories.tsx)
