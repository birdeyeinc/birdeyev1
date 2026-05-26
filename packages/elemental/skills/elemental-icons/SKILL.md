---
name: elemental-icons
description: >-
  Birdeye Elemental icon systems (Phoenix Icomoon font vs optional Lucide).
  Use when adding or changing icons in @birdeye/elemental, TabsToggle/Chip
  icon props, Storybook icon stories, icon_phoenix-* classes, lucide-react,
  atoms/Icon, or when icons render as missing squares or wrong size/color.
---

# Elemental icons (Phoenix + optional Lucide)

## Two systems (do not conflate)

| System | When to use | How |
|--------|-------------|-----|
| **Phoenix** (default) | All existing UI, brand/social/Template Builder glyphs | `<i className="icon_phoenix-*" />` |
| **Lucide** (opt-in) | New work where you choose Lucide | `Icon` from Elemental or named `lucide-react` imports |

**Policy:** Do **not** bulk-migrate `icon_phoenix-*` to Lucide. Phoenix stays unless the user explicitly asks to replace a specific icon.

## Phoenix (Icomoon)

- Font + classes: [`src/assets/icomoon/phoenix/_style.scss`](src/assets/icomoon/phoenix/_style.scss)
- Loaded globally via [`src/sass/global.scss`](src/sass/global.scss) (`@import "../assets/icomoon/phoenix/style"`)
- **Verify the class exists** in `_style.scss` before use (e.g. `icon_phoenix-calendar-week` is **not** in the font)
- Some glyphs set `color: #555` on `:before`; override with `color: inherit` on active states if parent uses `$brand-color`

## Lucide (peer dependency)

- Peer: `lucide-react` in [`package.json`](package.json) (consumer must `yarn add lucide-react`)
- Wrapper: [`src/atoms/Icon/Icon.tsx`](src/atoms/Icon/Icon.tsx)
- Exported from [`src/index.js`](src/index.js) as `Icon`
- Storybook: **Atom/Icon** (catalog in [`Icon.stories.tsx`](src/atoms/Icon/Icon.stories.tsx))
- Docs: [README.md](README.md) section **Icons (optional Lucide)**

### Elemental `Icon` defaults

```tsx
import { Icon } from "@birdeye/elemental";

<Icon name="Calendar" size={16} />
// strokeWidth 1.6, absoluteStrokeWidth when size !== 24
```

### Direct Lucide (tree-shaken)

```tsx
import { List, CalendarDays } from "lucide-react";

<List size={16} strokeWidth={1.6} absoluteStrokeWidth />
```

### APIs that accept `ReactNode` icons

- [`TabsToggle`](src/atoms/TabsToggle/index.jsx) — `tabsArray[].icon`
- [`Chip`](src/atoms/Chip/index.jsx) — `leftIcon` / `rightIcon` as `elementType`

Pass Lucide JSX or `<Icon name="..." />`; no API change required.

## TabsToggle icon styling

[`TabsToggle.module.scss`](src/atoms/TabsToggle/TabsToggle.module.scss):

- Fixed icon box: **16×16px** on `.segmentIcon` (active and inactive same size)
- `font-weight: 500` only on `.segmentLabel`, not the whole segment (avoids icomoon size shift)
- Active segment: `background: $gray0`, `color: $brand-color`, `box-shadow: 0 1px 1px 0 rgba(33, 33, 33, 0.1)`

## Controlled `selected` prop

[`TabsToggle` `useEffect`](src/atoms/TabsToggle/index.jsx) must depend on **`[selected]` only**, not `selectedValue`, or Storybook/docs clicks snap back to the initial `selected` arg.

## Calendar view icon mapping (Lucide-friendly)

| View | Lucide `Icon` name | Phoenix (if staying on font) |
|------|-------------------|------------------------------|
| List | `List` | `icon_phoenix-list_bullet` |
| Week | `CalendarRange` or `CalendarDays` | `icon_phoenix-calendar-schedule` |
| Month | `Calendar` | `icon_phoenix-calendar` |

## Bundle notes

- Rollup treats `lucide-react` as **external** (peer) — do not add as a bundled dependency
- Avoid `import * from "lucide-react"`; use `Icon` with a name or named imports
- Dynamic `icons[name]` in `atoms/Icon` is for convenience; prefer named imports in hot paths if bundle size matters
