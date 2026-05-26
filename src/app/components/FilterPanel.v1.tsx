import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

/* ─── Types ─── */
export interface FilterItem {
  id: string;
  label: string;
  value?: string;
  options?: string[];
}

interface FilterPanelProps {
  filters: FilterItem[];
  onFiltersChange?: (filters: FilterItem[]) => void;
  onApply?: () => void;
  onReset?: () => void;
  title?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  storageKey?: string;
  /** Docked column edge: `right` matches Reviews; `left` matches Agents Monitor. */
  edge?: "left" | "right";
  className?: string;
}

/* ─── Filter row — uses Radix Select (portal-based, never clipped by overflow) ─── */
function FilterRow({
  filter,
  onValueChange,
}: {
  filter: FilterItem;
  onValueChange: (id: string, value: string) => void;
}) {
  if (!filter.options?.length) return null;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-muted-foreground px-0.5">
        {filter.label}
      </span>
      <Select
        value={filter.value ?? ""}
        onValueChange={(val) => onValueChange(filter.id, val)}
      >
        <SelectTrigger className="h-8 text-[13px]">
          <SelectValue placeholder={`All ${filter.label.toLowerCase()}s`} />
        </SelectTrigger>
        <SelectContent>
          {filter.options.map((option) => (
            <SelectItem key={option} value={option} className="text-[13px]">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* ─── Filter Panel ─── */
export function FilterPanel({
  filters: initialFilters,
  onFiltersChange,
  onApply,
  onReset,
  title = "Filters",
  collapsed = false,
  onToggleCollapse,
  storageKey,
  edge = "right",
  className,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterItem[]>(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as FilterItem[];
          const savedIds = new Set(parsed.map((f) => f.id));
          const newFilters = initialFilters.filter((f) => !savedIds.has(f.id));
          return [...parsed, ...newFilters];
        } catch {
          /* fall through */
        }
      }
    }
    return initialFilters;
  });

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(filters));
    }
  }, [filters, storageKey]);

  const didNotifyMount = useRef(false);
  useLayoutEffect(() => {
    if (didNotifyMount.current) return;
    didNotifyMount.current = true;
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const handleValueChange = useCallback(
    (id: string, value: string) => {
      const updated = filters.map((f) =>
        f.id === id ? { ...f, value } : f,
      );
      setFilters(updated);
      onFiltersChange?.(updated);
    },
    [filters, onFiltersChange],
  );

  const handleReset = useCallback(() => {
    const reset = filters.map((f) => ({ ...f, value: undefined }));
    setFilters(reset);
    onFiltersChange?.(reset);
    onReset?.();
  }, [filters, onFiltersChange, onReset]);

  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className={cn(
          "h-full w-10 bg-white dark:bg-background flex flex-col items-center justify-start pt-4 shrink-0 transition-colors hover:bg-gray-20 dark:hover:bg-gray-700",
          edge === "left"
            ? "border-r border-new-selected-color dark:border-border"
            : "border-l border-new-selected-color dark:border-border",
        )}
        title="Expand filters"
      >
        <span
          className="text-[11px] text-gray-300 dark:text-muted-foreground mt-0"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed", fontWeight: 400 }}
        >
          {title}
        </span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-background flex flex-col h-full min-h-0 shrink-0 transition-colors w-[260px]",
        edge === "left"
          ? "border-r border-new-selected-color dark:border-border"
          : "border-l border-new-selected-color dark:border-border",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-new-selected-color dark:border-border shrink-0">
        <span className="text-sm text-gray-900 dark:text-foreground" style={{ fontWeight: 400 }}>
          {title}
        </span>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-gray-20 dark:hover:bg-muted transition-colors"
          title="Close filters"
        >
          <X className="w-3.5 h-3.5 text-gray-300 dark:text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="flex flex-col gap-4">
          {filters.map((filter) => (
            <FilterRow
              key={filter.id}
              filter={filter}
              onValueChange={handleValueChange}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-3 border-t border-new-selected-color dark:border-border shrink-0">
        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[13px] text-gray-300 dark:text-muted-foreground border border-new-selected-color dark:border-border rounded-lg hover:bg-gray-20 dark:hover:bg-muted transition-colors"
          style={{ fontWeight: 400 }}
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
        <button
          onClick={onApply}
          className="flex-1 px-3 py-2 text-[13px] text-white bg-brand-color rounded-lg hover:bg-brand-color transition-colors"
          style={{ fontWeight: 400 }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
