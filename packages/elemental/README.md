# Elemental

## Overview

Elemental is a UI library for Birdeye core components. It is published as **`@birdeye/elemental`** and documented in Storybook.

Integration branch for BK-BIRD-00000 work: **`BK-BIRD-00000-learning`** (current package version **1.2.4**).

## BK-BIRD-00000 pushed changes

Tracked list of work merged to `BK-BIRD-00000-learning`. Source links point at repo paths; Storybook names match the sidebar when you run `yarn story` (port **3000**).

| # | Change | Commit | Storybook (sidebar) |
|---|--------|--------|---------------------|
| 1 | [Inter typography audit](#1-inter-typography-audit) | `4f0eeaa7` | Design System → Typography |
| 2 | [DashboardCommonBlock pattern](#2-dashboardcommonblock-pattern) | `e42e6ab7` | Pattern → DashboardCommonBlock |
| 3 | [Brand color `#2652ED`](#3-brand-color-2652ed) | `dfcb5e09` | (see component table) |
| 4 | [Shell elevation & control sizing](#4-shell-elevation--control-sizing) | `9eee71da`, `7a92942f` | (see component table) |
| 5 | [RailNav title font-size scaling](#5-railnav-title-font-size-scaling) | `60b93985` | Components/RailNav |

Full audit checklist: [`src/Docs/inter-typography-audit.md`](src/Docs/inter-typography-audit.md).

---

### 1. Inter typography audit

**Summary:** Primary UI font **Inter** (replaces Roboto-forward stack). Approved weights **400** / **500** only; normalized 600/700/bold to medium; removed `ds-font-roboto`, `fwBold`, and related utilities.

**Foundations**

| Area | Source |
|------|--------|
| DS typography utilities | [`src/sass/uiFoundations/_ds-typography.scss`](src/sass/uiFoundations/_ds-typography.scss) |
| Font family / weight primitives | [`src/sass/primitive/fontStyle/`](src/sass/primitive/fontStyle/) |
| JS font tokens | [`src/sass/js/fonts.js`](src/sass/js/fonts.js) |
| Global variables | [`src/sass/_variables.scss`](src/sass/_variables.scss) |
| Layout helpers & reset | [`src/sass/layoutHelpers.scss`](src/sass/layoutHelpers.scss), [`src/sass/reset.scss`](src/sass/reset.scss) |
| Docs | [`src/Docs/Styles/typography/typography.js`](src/Docs/Styles/typography/typography.js), [`src/Docs/Styles/DSClassSystem/`](src/Docs/Styles/DSClassSystem/) |

**Atoms**

| Component | Source | Storybook |
|-----------|--------|-----------|
| Button | [`src/atoms/Button/`](src/atoms/Button/) | Atom/Button |
| Chip / ChipGroup | [`src/atoms/Chip/`](src/atoms/Chip/), [`src/atoms/ChipGroup/`](src/atoms/ChipGroup/) | Atom/Chip |
| FormInput | [`src/atoms/FormInput/`](src/atoms/FormInput/) | Atom/FormInput |
| ActionBox | [`src/atoms/ActionBox/`](src/atoms/ActionBox/) | Atom/ActionBox |
| RichTextEditor | [`src/atoms/RichTextEditor/`](src/atoms/RichTextEditor/) | Atom/RichTextEditor |
| SingleSelect / filter select | [`src/atoms/SingleSelect/`](src/atoms/SingleSelect/) | Atom/SingleSelect |
| Modal, Tag, Steppers, TimePeriod, Search, LoaderBox | respective [`src/atoms/`](src/atoms/) folders | matching Atom/* stories |

**Components**

| Component | Source | Storybook |
|-----------|--------|-----------|
| BigCalendar | [`src/components/BigCalendar/`](src/components/BigCalendar/) | Component/BigCalendar |
| TableGrid | [`src/components/TableGrid/`](src/components/TableGrid/) | Component/TableGrid |
| WorkflowCanvas | [`src/components/WorkflowCanvas/`](src/components/WorkflowCanvas/) | Component/WorkflowCanvas |
| Copilot | [`src/components/Copilot/`](src/components/Copilot/) | Component/Copilot |
| TemplateBuilder | [`src/components/TemplateBuilder/`](src/components/TemplateBuilder/) | Component/TemplateBuilder |
| GraphTable / charts | [`src/components/GraphTable/`](src/components/GraphTable/) | Component/GraphTable |
| SecondSideRailNav | [`src/components/RailNav/SecondSideRailNav/`](src/components/RailNav/SecondSideRailNav/) | Component/RailNav |
| EmailCreator, DatePicker, NoData, SentimentScore, Rules, etc. | [`src/components/`](src/components/) | matching Component/* stories |

---

### 2. DashboardCommonBlock pattern

**Summary:** New layout pattern for dashboard blocks; removed bottom border on custom-dash wrapper in SecondSideRailNav.

| Item | Source | Storybook |
|------|--------|-----------|
| DashboardCommonBlock | [`src/patterns/DashboardCommonBlock/`](src/patterns/DashboardCommonBlock/) | Pattern/DashboardCommonBlock |
| SecondSideRailNav (custom-dash border) | [`src/components/RailNav/SecondSideRailNav/SecondSideRailNav.module.scss`](src/components/RailNav/SecondSideRailNav/SecondSideRailNav.module.scss) | Component/RailNav |

---

### 3. Brand color `#2652ED`

**Summary:** Brand blue aligned to **`#2652ED`**; legacy `$blue100` aliases updated in variables; components use **`$brand-color`**; Phoenix icomoon accents updated; **`$rail-nav-bg`** added.

**Tokens & global**

| Item | Source |
|------|--------|
| Color variables | [`src/sass/_variables.scss`](src/sass/_variables.scss) |
| Buttons | [`src/sass/_buttons.scss`](src/sass/_buttons.scss) |
| Filter select | [`src/sass/filterSelect.scss`](src/sass/filterSelect.scss) |
| Phoenix icons | [`src/assets/icomoon/phoenix/_style.scss`](src/assets/icomoon/phoenix/_style.scss) |

**Components & atoms**

| Component | Source | Storybook |
|-----------|--------|-----------|
| TabHeader | [`src/atoms/TabHeader/`](src/atoms/TabHeader/) | Atom/TabHeader |
| TabsToggle | [`src/atoms/TabsToggle/`](src/atoms/TabsToggle/) | Atom/TabsToggle |
| TimePeriod | [`src/atoms/TimePeriod/`](src/atoms/TimePeriod/) | Atom/TimePeriod |
| TableGrid | [`src/components/TableGrid/table.module.scss`](src/components/TableGrid/table.module.scss), [ColumnCustomizer](src/components/TableGrid/ColumnCustomizer/) | Component/TableGrid |
| CustomizeColumns | [`src/components/CustomizeColumns/`](src/components/CustomizeColumns/) | Component/CustomizeColumns |
| RailNav | [`src/components/RailNav/RailNav.module.scss`](src/components/RailNav/RailNav.module.scss) | Component/RailNav |
| BigCalendar, Copilot, FreeMediaLibraryModal, WorkflowCanvas, TemplateBuilder, TextAreaCounter, RichTextEditor, Breadcrumbs1, GridContainer | paths under [`src/atoms/`](src/atoms/) / [`src/components/`](src/components/) | matching stories |

---

### 4. Shell elevation & control sizing

**Summary:** Side drawer width/shadow updates; ActionBox popover elevation; button, form, select, and filter control sizing pass. Follow-up (`7a92942f`): layered `$elevation-*` primitives in [`boxShadowStyle.scss`](src/sass/primitive/boxShadowStyle.scss), `$button-height` (36px), drawer 24px padding, darken hover tokens, filter/CountryPhoneInput elevation radius.

| Component / area | Source | Storybook |
|------------------|--------|-----------|
| Elevation primitives | [`src/sass/primitive/boxShadowStyle.scss`](src/sass/primitive/boxShadowStyle.scss) | — |
| Button height / hover | [`src/sass/primitive/sizeStyle.scss`](src/sass/primitive/sizeStyle.scss), [`src/sass/_variables.scss`](src/sass/_variables.scss), [`src/atoms/Button/Button.module.scss`](src/atoms/Button/Button.module.scss) | Atom/Button |
| CountryPhoneInput | [`src/components/CountryPhoneInput/CountryPhoneInput.module.scss`](src/components/CountryPhoneInput/CountryPhoneInput.module.scss) | Component/CountryPhoneInput |
| Side drawer (global) | [`src/sass/layoutHelpers/sideDrawerStyle.scss`](src/sass/layoutHelpers/sideDrawerStyle.scss), [`src/sass/layoutHelpers.scss`](src/sass/layoutHelpers.scss) (`.side-drawer`) | Component stories using SideDrawer |
| ActionBox popover | [`src/atoms/ActionBox/index.module.scss`](src/atoms/ActionBox/index.module.scss) | Atom/ActionBox |
| Button sizing | [`src/atoms/Button/Button.module.scss`](src/atoms/Button/Button.module.scss) | Atom/Button |
| FormInput | [`src/atoms/FormInput/FormInput.module.scss`](src/atoms/FormInput/FormInput.module.scss) | Atom/FormInput |
| Modal | [`src/atoms/Modal/index.jsx`](src/atoms/Modal/index.jsx) | Atom/Modal |
| SearchFilter | [`src/atoms/SearchFilter/SearchFilter.module.scss`](src/atoms/SearchFilter/SearchFilter.module.scss) | Atom/SearchFilter |
| SingleSelect / paginated / filterSelect | [`src/atoms/SingleSelect/`](src/atoms/SingleSelect/), [`src/sass/filterSelect.scss`](src/sass/filterSelect.scss) | Atom/SingleSelect |
| TimePeriod | [`src/atoms/TimePeriod/TimePeriod.module.scss`](src/atoms/TimePeriod/TimePeriod.module.scss) | Atom/TimePeriod |

---

### 5. RailNav title font-size scaling

**Summary:** Long rail module titles scale down by character count (15px / 13px) while keeping Inter at weights 400 / 500.

| Component | Source | Storybook |
|-----------|--------|-----------|
| RailNav | [`src/components/RailNav/`](src/components/RailNav/) | Components/RailNav |

---


## Icons (optional Lucide)

Elemental’s default icon system is **Phoenix** (Icomoon font): use `<i className="icon_phoenix-*" />` with classes from [`src/assets/icomoon/phoenix/_style.scss`](src/assets/icomoon/phoenix/_style.scss). Existing components are **not** migrated away from Phoenix.

**Lucide** is available as an opt-in layer when your app installs the peer dependency:

```bash
yarn add lucide-react
```

### Via Elemental `Icon` wrapper (recommended)

```tsx
import { Icon } from "@birdeye/elemental";

<Icon name="Calendar" size={16} />
```

Defaults: **16px** size, **1.6** stroke width (`absoluteStrokeWidth` when size is not 24). Storybook catalog: **Atom/Icon**.

Source: [`src/atoms/Icon/`](src/atoms/Icon/).

### Direct Lucide imports (tree-shaken)

```tsx
import { List, CalendarDays } from "lucide-react";

<List size={16} strokeWidth={1.6} absoluteStrokeWidth />
```

Use in any prop that accepts `ReactNode` (e.g. `TabsToggle` `tabsArray[].icon`, `Chip` `leftIcon`).

## Typography (reference)

The design system uses **Inter** as the primary UI font (replacing the previous Roboto-forward stack). Tokens live under `src/sass/` (including `uiFoundations/_ds-typography.scss`, primitives, and `js/fonts.js` for JS consumers).

**Approved weights** for new typography work are **400 (regular)** and **500 (medium)**. The audit removed or normalized heavier declarations (600, 700, CSS `bold`) and legacy utilities such as `ds-font-roboto` / `fwBold` in favor of **Inter** and **`ds-font-inter`**. Rich text and Template Builder font lists were updated to match.

For scope, verification commands (`rg` scans, `git diff --check`), and a file-level checklist, see **[`src/Docs/inter-typography-audit.md`](src/Docs/inter-typography-audit.md)**.

## Quick start

- **npm:** `npm i @birdeye/elemental`
- **Yarn:** `yarn add @birdeye/elemental`

## Storybook

Run the docs locally: `yarn story` (port **3000** by default). Use the sidebar names in the tables above (e.g. **Atom/Button**, **Pattern/DashboardCommonBlock**).

For build, lint, and bundle commands, see **`CLAUDE.md`** in this repository.
