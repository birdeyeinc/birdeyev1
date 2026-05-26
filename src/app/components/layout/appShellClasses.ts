/**
 * App shell chrome — shared by `App.tsx` and shell layouts so corners stay consistent.
 * L2 column: top-left 8px — `PANEL` in `L2NavLayout.tsx` (`rounded-tl-lg`).
 * Top bar: top-right 8px — `TopBar.tsx` (`rounded-tr-lg`).
 * Main canvas: fill via `bg-app-shell-main`, right corners 8px (`rounded-tr-lg rounded-br-lg`).
 */
export const APP_SHELL_BELOW_TOPBAR_CARD_CLASS =
  "flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden rounded-lg border border-app-shell-border";

/** Gutter row below TopBar — pair with `pr-[10px] pb-[10px] pl-0` on the same element as in `App.tsx`. */
export const APP_SHELL_GUTTER_SURFACE_CLASS =
  "bg-app-shell-gutter transition-colors duration-300";

/** L1 icon strip + TopBar background. */
export const APP_SHELL_RAIL_SURFACE_CLASS =
  "bg-app-shell-rail transition-colors duration-300";

export const APP_MAIN_CONTENT_SHELL_CLASS =
  "flex-1 flex flex-col min-w-0 overflow-hidden rounded-tr-lg rounded-br-lg bg-app-shell-main";
