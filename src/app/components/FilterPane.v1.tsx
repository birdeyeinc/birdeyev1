import { FunnelSimple } from "@phosphor-icons/react";
import { Button } from "@/app/components/ui/button";
import { FilterPanel, type FilterItem } from "@/app/components/FilterPanel.v1";
import { SlidingSidePanel } from "@/app/components/layout/SlidingSidePanel";
import { cn } from "@/app/components/ui/utils";

export type FilterPaneMotion = "static" | "slide";

export type FilterPaneProps = {
  initialFilters: FilterItem[];
  storageKey?: string;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange?: (filters: FilterItem[]) => void;
  motion?: FilterPaneMotion;
  /** `static`: sibling column edge. `slide`: slide direction (matches dock edge). */
  dock?: "left" | "right";
  panelWidthPx?: number;
};

/**
 * Filter column: static (Reviews-style) or sliding (Myna-style motion).
 * Pair with {@link FilterPaneTriggerButton} in the view toolbar.
 */
export function FilterPane({
  initialFilters,
  storageKey,
  title = "Filters",
  open,
  onOpenChange,
  onFiltersChange,
  motion = "static",
  dock = "right",
  panelWidthPx = 260,
}: FilterPaneProps) {
  const edge = dock === "left" ? "left" : "right";

  const panel = (
    <FilterPanel
      filters={initialFilters}
      title={title}
      storageKey={storageKey}
      edge={edge}
      collapsed={false}
      onToggleCollapse={() => onOpenChange(false)}
      onFiltersChange={onFiltersChange}
      className={motion === "slide" ? "w-full min-h-0 flex-1 border-0" : undefined}
    />
  );

  if (motion === "static") {
    if (!open) return null;
    return panel;
  }

  return (
    <SlidingSidePanel
      side={dock}
      open={open}
      widthPx={panelWidthPx}
      innerClassName={cn(
        "min-h-0 border-t border-new-selected-color dark:border-border",
        dock === "left"
          ? "rounded-tr-lg border-r"
          : "rounded-tl-lg border-l",
      )}
    >
      <div className="flex h-full min-h-0 flex-1 flex-col">{panel}</div>
    </SlidingSidePanel>
  );
}

/**
 * Funnel control; active styles match Reviews filter toggle.
 * In {@link MainCanvasViewHeader} toolbars, render this **after** other `actions` so it stays **rightmost**
 * (see `MAIN_VIEW_HEADER_ACTIONS_CLUSTER_CLASS` in `mainViewTitleClasses.ts`).
 */
export function FilterPaneTriggerButton({
  open,
  onOpenChange,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => onOpenChange(!open)}
      className={cn(
        open
          ? "bg-blue-10 dark:bg-blue-300 border-brand-color dark:border-brand-color"
          : "",
        className,
      )}
      aria-pressed={open}
      aria-label="Filters"
    >
      <FunnelSimple
        size={14}
        weight={open ? "fill" : "regular"}
        className={
          open ? "text-brand-color" : "text-gray-300 dark:text-muted-foreground"
        }
      />
    </Button>
  );
}
