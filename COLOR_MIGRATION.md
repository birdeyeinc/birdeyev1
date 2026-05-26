# Elemental color migration

Product UI colors in birdeye-v1 are synced with **Elemental** [`BK-BIRD-00000-learning`](https://github.com/birdeyeinc/elemental/tree/BK-BIRD-00000-learning).

## Regenerate palette

```bash
ELEMENTAL_ROOT=/path/to/elemental npm run generate:colors
```

Writes:

- `src/styles/elemental-colors.css` — CSS variables (`--gray-900`, `--blue-100`, …)
- `src/styles/elemental-tailwind-theme.css` — Tailwind `@theme` color utilities
- `scripts/elemental-hex-map.json` — hex → token lookup for codemod

## Apply codemod

```bash
npm run migrate:colors
```

Replaces `text-[#hex]`, `bg-[#hex]`, variant stacks (`dark:placeholder:text-[#…]`), and common inline `style` / CSS `color:` values when a mapping exists in `elemental-hex-map.json` + `elemental-hex-aliases.json`.

## Conventions

| Role | Light | Dark |
|------|-------|------|
| Primary text | `text-gray-900` | `dark:text-foreground` |
| Secondary meta | `text-gray-300` | `dark:text-muted-foreground` |
| Brand / focus | `text-primary`, `border-brand-color`, `ring-brand-color` | same semantic tokens |

Primary black on light surfaces = Elemental **gray900** (`#212121`). Brand = **#2652ED** (`--brand-color`).

## Grep gate (product UI)

```bash
rg '\[#[0-9a-fA-F]{3,8}\]' src/app src/styles src/themes --glob '*.{tsx,jsx,css}'
```

Expect **no matches** in product code. Excluded: `src/imports/` (Figma paste), generated `elemental-colors.css`.

## Elemental build

```bash
ELEMENTAL_ROOT=/path/to/elemental npm run build:elemental
```
