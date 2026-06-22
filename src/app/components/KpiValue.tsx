import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiValueProps {
  /** Metric value — e.g. "52%", "23.2K", "2,070". */
  value: string;
  /**
   * Optional change badge. Prefix with "-" for negative (red ↓).
   * Omit entirely for no badge.
   * Examples: "+1%", "-4%", "4.6%"
   */
  change?: string;
  /**
   * Metric label. **Always sentence case** — "Profile completeness" ✓ / "PROFILE COMPLETENESS" ✗.
   */
  label: string;
  /**
   * Large (30 px) for performance-summary hero numbers.
   * Default (20 px) for per-chart secondary KPIs.
   */
  large?: boolean;
}

/**
 * Canonical KPI value display for reporting dashboards.
 *
 * Usage (performance summary grid):
 * ```tsx
 * <div className="flex w-full flex-wrap items-start gap-[80px_80px]">
 *   <KpiValue value="52%" change="+1%" label="Profile completeness" large />
 *   <KpiValue value="53%" change="+9%" label="Field accuracy" large />
 *   <KpiValue value="2,070" label="Synced locations" large />
 * </div>
 * ```
 *
 * Usage (per-chart secondary KPI row):
 * ```tsx
 * <div className="flex items-end gap-6">
 *   <KpiValue value="23.2K" change="4.6%" label="Total audience" />
 *   <KpiValue value="11.2K" label="Previous period" />
 * </div>
 * ```
 *
 * Storybook: **UI/KpiValue**
 */
export function KpiValue({ value, change, label, large }: KpiValueProps) {
  const isNegative = change?.startsWith("-");

  return (
    <div className="flex flex-col gap-[2px] items-start shrink-0">
      <div className="flex gap-1 items-center">
        <p className={cn(
          "whitespace-nowrap font-normal text-gray-800 dark:text-gray-50",
          large ? "text-[30px] leading-[42px]" : "text-[20px] leading-[22px]",
        )}>
          {value}
        </p>

        {change && (
          <div className="flex items-center pt-1.5">
            {isNegative
              ? <TrendingDown size={12} strokeWidth={1.6} absoluteStrokeWidth className="text-red-500" />
              : <TrendingUp  size={12} strokeWidth={1.6} absoluteStrokeWidth className="text-green-90" />
            }
            <p className={cn(
              "text-[13px] font-normal whitespace-nowrap ml-0.5",
              isNegative ? "text-red-500" : "text-green-90",
            )}>
              {change}
            </p>
          </div>
        )}
      </div>

      <p className={cn(
        "whitespace-nowrap text-[12px] font-normal",
        large
          ? "text-gray-300 dark:text-gray-90 leading-[18px]"
          : "text-gray-90 dark:text-gray-90 leading-[16px]",
      )}>
        {label}
      </p>
    </div>
  );
}
