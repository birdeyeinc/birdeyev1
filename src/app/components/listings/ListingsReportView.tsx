import { useState, useId } from "react";
import {
  Filter, Info, MoreHorizontal, SlidersHorizontal,
  MoreVertical, Share2, Clock,
  ChevronDown, ChevronUp, Search,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import {
  MAIN_VIEW_PRIMARY_HEADING_CLASS,
  MAIN_VIEW_SUBHEADING_CLASS,
} from "@/app/components/layout/mainViewTitleClasses";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/app/components/ui/sheet";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { ChartSummaryTable, type ChartSummaryRow } from "@/app/components/ChartSummaryTable";
import { KpiValue } from "@/app/components/KpiValue";
import { SyncStatusTableView } from "@/app/components/listings/SyncStatusTableView";

// ─── Chart data (last 12 months: Jun → May) ─────────────────────────────────

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

const profileCompletenessData = MONTHS.map((month, i) => ({
  month,
  allSites: [49, 49, 50, 52, 51, 50, 57, 59, 52, 50, 52, 52][i],
  google:   [55, 54, 57, 60, 58, 57, 63, 65, 61, 59, 62, 63][i],
}));

const fieldAccuracyData = MONTHS.map((month, i) => ({
  month,
  allSites: [28, 69, 56, 38, 56, 43, 42, 42, 95, 59, 57, 54][i],
  google:   [42, 78, 67, 53, 66, 55, 54, 55, 97, 70, 68, 66][i],
}));

const fieldHealthData = MONTHS.map((month, i) => ({
  month,
  allSites: [72, 75, 78, 82, 84, 71, 76, 65, 67, 55, 73, 71][i],
  google:   [80, 83, 85, 88, 89, 79, 83, 74, 76, 66, 81, 80][i],
}));

// ─── Filter groups ───────────────────────────────────────────────────────────

const FILTER_GROUPS = [
  {
    id: "region",
    label: "Region",
    options: ["Northeast", "Southeast", "Midwest", "West", "Southwest"],
  },
  {
    id: "division",
    label: "Division",
    options: ["East", "West", "Central", "North", "South"],
  },
  {
    id: "city",
    label: "City",
    options: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  },
  {
    id: "zip",
    label: "Zip",
    options: ["10001", "90210", "60601", "77001", "85001"],
  },
  {
    id: "content_manager",
    label: "Content manager",
    options: ["Alex Johnson", "Maria Garcia", "Sam Williams"],
  },
  {
    id: "social_manager",
    label: "Social manager",
    options: ["Taylor Brown", "Jordan Lee", "Casey Davis"],
  },
];

// ─── Local helpers ───────────────────────────────────────────────────────────

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <p className="text-[11px] text-gray-90 dark:text-muted-foreground whitespace-nowrap font-normal">{label}</p>
    </div>
  );
}


function WidgetHeader({ title }: { title: string }) {
  return (
    <div className="flex w-full items-start justify-between py-4">
      <div className="flex min-w-0 flex-col gap-1 items-start justify-center">
        <div className="flex min-w-0 items-center gap-1">
          <h3 className={cn(MAIN_VIEW_PRIMARY_HEADING_CLASS, "min-w-0 truncate font-normal")}>{title}</h3>
          <Info size={14} strokeWidth={1.6} absoluteStrokeWidth className="text-muted-foreground shrink-0" />
        </div>
        <p className={cn(MAIN_VIEW_SUBHEADING_CLASS, "mt-0 max-w-full")}>
          Last 12 months <span className="text-muted-foreground/80">vs</span> previous period
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" className="font-normal" title="Customize" aria-label="Customize">
          <SlidersHorizontal size={14} strokeWidth={1.6} absoluteStrokeWidth />
        </Button>
        <Button type="button" variant="outline" size="icon" className="font-normal" title="More options" aria-label="More options">
          <MoreHorizontal size={14} strokeWidth={1.6} absoluteStrokeWidth />
        </Button>
      </div>
    </div>
  );
}

// ─── Chart widget ────────────────────────────────────────────────────────────

interface ChartWidgetProps {
  title: string;
  kpis: { value: string; change?: string; label: string }[];
  data: Record<string, string | number>[];
  series: { key: string; color: string; label: string }[];
  tableHeaders?: string[];
  tableRows?: ChartSummaryRow[];
}

function ChartWidget({ title, kpis, data, series, tableHeaders, tableRows }: ChartWidgetProps) {
  const chartId = useId();

  return (
    <div className="flex w-full flex-col items-stretch gap-6 rounded-lg border border-new-selected-color bg-white px-6 pb-6 transition-colors duration-300 dark:border-gray-600 dark:bg-gray-700">
      <WidgetHeader title={title} />

      {/* KPIs */}
      <div className="flex w-full items-end gap-6">
        {kpis.map(kpi => (
          <KpiValue key={kpi.label} value={kpi.value} change={kpi.change} label={kpi.label} />
        ))}
      </div>

      {/* Chart */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <defs>
              {series.map(s => (
                <linearGradient key={s.key} id={`grad-${chartId}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid horizontal vertical={false} stroke="var(--comparison-0-star)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#555" }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#555" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
              domain={[0, 100]}
              width={40}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, fontWeight: 400, borderRadius: 8, border: "1px solid #eaeaea" }}
              labelStyle={{ fontWeight: 400 }}
              itemStyle={{ fontWeight: 400 }}
              formatter={(v: number) => [`${v}%`, undefined]}
            />
            {series.map(s => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${chartId}-${s.key})`}
                name={s.label}
                dot={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex gap-6 items-center mt-2 ml-10">
          {series.map(s => (
            <LegendDot key={s.key} color={s.color} label={s.label} />
          ))}
        </div>
      </div>

      {tableHeaders && tableRows ? (
        <ChartSummaryTable metricHeaders={tableHeaders} rows={tableRows} />
      ) : null}
    </div>
  );
}

// ─── Widget data configs ──────────────────────────────────────────────────────

const listingsChartWidgets: ChartWidgetProps[] = [
  {
    title: "Profile completeness",
    kpis: [
      { value: "52%", change: "+1%", label: "All sites" },
      { value: "51%", label: "Previous period" },
    ],
    data: profileCompletenessData,
    series: [
      { key: "allSites", color: "var(--brand-color)", label: "All sites" },
      { key: "google",   color: "var(--google-bg)", label: "Google" },
    ],
    tableHeaders: ["Profile completeness"],
    tableRows: [
      { channel: "Google", values: [{ value: "63%", change: "+1%" }] },
      { channel: "Apple",  values: [{ value: "55%", change: "+2%" }] },
      { channel: "Bing",   values: [{ value: "48%", change: "" }] },
      { channel: "Yelp",   values: [{ value: "50%", change: "" }] },
    ],
  },
  {
    title: "Field accuracy",
    kpis: [
      { value: "53%", change: "+9%", label: "All sites" },
      { value: "44%", label: "Previous period" },
    ],
    data: fieldAccuracyData,
    series: [
      { key: "allSites", color: "var(--brand-color)", label: "All sites" },
      { key: "google",   color: "var(--google-bg)", label: "Google" },
    ],
    tableHeaders: ["Field accuracy"],
    tableRows: [
      { channel: "Google",   values: [{ value: "66%", change: "+23%" }] },
      { channel: "Facebook", values: [{ value: "41%", change: "+1%" }] },
      { channel: "Yelp",     values: [{ value: "58%", change: "+12%" }] },
    ],
  },
  {
    title: "Field health",
    kpis: [
      { value: "71%", change: "+3%", label: "All sites" },
      { value: "68%", label: "Previous period" },
    ],
    data: fieldHealthData,
    series: [
      { key: "allSites", color: "var(--brand-color)", label: "All sites" },
      { key: "google",   color: "var(--google-bg)", label: "Google" },
    ],
    tableHeaders: ["Field health"],
    tableRows: [
      { channel: "Google",   values: [{ value: "80%", change: "+12%" }] },
      { channel: "Apple",    values: [{ value: "67%", change: "" }] },
      { channel: "Bing",     values: [{ value: "69%", change: "" }] },
      { channel: "Facebook", values: [{ value: "73%", change: "" }] },
    ],
  },
];

// ─── Filter group ─────────────────────────────────────────────────────────────

function FilterGroup({
  id,
  label,
  options,
  selected,
  onToggle,
}: {
  id: string;
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (option: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-border last:border-0">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between py-3 text-[13px] font-medium text-foreground"
        >
          {label}
          {open
            ? <ChevronUp size={14} strokeWidth={1.6} absoluteStrokeWidth className="text-muted-foreground shrink-0" />
            : <ChevronDown size={14} strokeWidth={1.6} absoluteStrokeWidth className="text-muted-foreground shrink-0" />
          }
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-2 pb-4">
          {options.map(opt => {
            const optId = `filter-${id}-${opt.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <div key={opt} className="flex items-center gap-2">
                <Checkbox
                  id={optId}
                  checked={selected.has(opt)}
                  onCheckedChange={() => onToggle(opt)}
                />
                <Label htmlFor={optId} className="text-[13px] font-normal cursor-pointer leading-none">
                  {opt}
                </Label>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function ListingsReportView() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSelections, setFilterSelections] = useState<Record<string, Set<string>>>({});
  const [locationSearch, setLocationSearch] = useState("");

  function toggleFilter(groupId: string, option: string) {
    setFilterSelections(prev => {
      const next = new Set(prev[groupId] ?? []);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return { ...prev, [groupId]: next };
    });
  }

  function clearAll() {
    setFilterSelections({});
    setLocationSearch("");
  }

  const activeFilterCount = Object.values(filterSelections).reduce((sum, s) => sum + s.size, 0);

  return (
    <div className="flex-1 bg-white dark:bg-app-shell-gutter overflow-auto flex flex-col transition-colors duration-300">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 shrink-0 bg-white transition-colors duration-300 dark:bg-app-shell-gutter">
        <MainCanvasViewHeader
          className="px-8"
          title="Listings"
          titleClassName="font-normal"
          actions={
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" size="icon" className="font-normal" title="Actions" aria-label="Actions">
                    <MoreVertical size={16} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  <DropdownMenuItem className="text-[13px] font-normal">
                    <Share2 size={14} strokeWidth={1.6} absoluteStrokeWidth className="text-muted-foreground" />
                    Share report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[13px] font-normal">
                    <Clock size={14} strokeWidth={1.6} absoluteStrokeWidth className="text-muted-foreground" />
                    Schedule
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                type="button"
                variant={activeFilterCount > 0 ? "default" : "outline"}
                size="icon"
                className="font-normal"
                title={activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active` : "Filter"}
                aria-label="Filter"
                onClick={() => setFilterOpen(true)}
              >
                <Filter size={16} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
              </Button>
            </div>
          }
        />
      </div>

      {/* Scrollable content */}
      <div className="flex flex-1 flex-col gap-6 px-8 pb-8 pt-0">
        {/* Performance summary */}
        <div className="flex w-full flex-col items-stretch gap-6 rounded-lg border border-new-selected-color bg-white px-6 pb-6 transition-colors duration-300 dark:border-gray-600 dark:bg-gray-700">
          <div className="flex w-full items-start justify-between py-4">
            <div className="flex min-w-0 flex-col gap-1">
              <h3 className={cn(MAIN_VIEW_PRIMARY_HEADING_CLASS, "font-normal")}>Performance summary</h3>
              <p className={cn(MAIN_VIEW_SUBHEADING_CLASS, "mt-0")}>Last 12 months</p>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-start gap-[80px_80px]">
            {[
              { value: "52%",   change: "+1%", label: "Profile completeness" },
              { value: "53%",   change: "+9%", label: "Field accuracy" },
              { value: "71%",   change: "+3%", label: "Field health" },
              { value: "2,070",              label: "Synced locations" },
            ].map(kpi => (
              <KpiValue key={kpi.label} value={kpi.value} change={kpi.change} label={kpi.label} large />
            ))}
          </div>
        </div>

        <SyncStatusTableView />

        {/* Chart widgets */}
        {listingsChartWidgets.map(widget => (
          <ChartWidget key={widget.title} {...widget} />
        ))}
      </div>

      {/* Filter panel */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="right" inset="floating">
          <SheetHeader className="px-6 pt-5 pb-0 pr-12">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-[15px] font-medium">Filters</SheetTitle>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[12px] font-normal text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <SheetDescription className="sr-only">
              Filter listings report data by region, division, city, and other criteria.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-0 px-6 pb-8">
            {/* Location search */}
            <div className="py-4 border-b border-border">
              <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Location</p>
              <div className="relative">
                <Search size={14} strokeWidth={1.6} absoluteStrokeWidth className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search locations…"
                  value={locationSearch}
                  onChange={e => setLocationSearch(e.target.value)}
                  className="pl-8 h-8 text-[13px]"
                />
              </div>
            </div>

            {/* Filter groups */}
            {FILTER_GROUPS.map(group => (
              <FilterGroup
                key={group.id}
                id={group.id}
                label={group.label}
                options={group.options}
                selected={filterSelections[group.id] ?? new Set()}
                onToggle={option => toggleFilter(group.id, option)}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
