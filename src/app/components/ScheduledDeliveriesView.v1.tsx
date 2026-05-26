import { useState, useRef, useEffect, type CSSProperties } from "react";
import {
  Search, ChevronDown, MoreHorizontal, Plus, Clock, Send, Users, AlertTriangle,
  Calendar, FileText, Play, Pause, Copy, Pencil, Trash2, History, RotateCcw,
  Filter, X, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { Button } from "@/app/components/ui/button";
import { TextTabsRow } from "@/app/components/ui/text-tabs";
import { cn } from "@/lib/utils";
import {
  FLOATING_PANEL_LIST_PADDING_CLASSNAME,
  FLOATING_PANEL_SURFACE_CLASSNAME,
} from "@/app/components/ui/floatingPanelSurface";

/* ─── Types ─── */
type ScheduleStatus = "active" | "paused" | "draft" | "failed" | "expired";
type ScheduleFrequency = "daily" | "weekly" | "bi-weekly" | "monthly" | "quarterly";
type FileFormat = "PDF" | "XLS" | "PPT" | "PNG";

interface ScheduleItem {
  id: string;
  name: string;
  description: string;
  reports: string[];
  owner: string;
  ownerEmail: string;
  recipients: string[];
  frequency: ScheduleFrequency;
  day: string;
  time: string;
  nextRun: string;
  lastSent: string | null;
  format: FileFormat;
  status: ScheduleStatus;
  totalSends: number;
  createdAt: string;
}

/* ─── Mock Data ─── */
const currentUser = "Balaji K";

const mockSchedules: ScheduleItem[] = [
  {
    id: "sch-001",
    name: "Weekly executive digest",
    description: "Profile performance, Reviews, Social, Listings",
    reports: ["Profile performance", "Reviews overview", "Social analytics", "Listing audit"],
    owner: "Balaji K",
    ownerEmail: "balaji@acmecorp.com",
    recipients: ["sarah.chen@acmecorp.com", "mike.jones@acmecorp.com", "ceo@acmecorp.com"],
    frequency: "weekly",
    day: "Monday",
    time: "9:00 AM",
    nextRun: "Mon, Mar 16",
    lastSent: "Mon, Mar 9",
    format: "PDF",
    status: "active",
    totalSends: 24,
    createdAt: "2025-09-15",
  },
  {
    id: "sch-002",
    name: "Daily reviews digest",
    description: "New reviews across all platforms",
    reports: ["Reviews overview", "Review sites"],
    owner: "Rupa M",
    ownerEmail: "rupa@acmecorp.com",
    recipients: ["ops-team@acmecorp.com", "sarah.chen@acmecorp.com", "quality@acmecorp.com", "support@acmecorp.com", "reviews@acmecorp.com"],
    frequency: "daily",
    day: "Every day",
    time: "8:00 AM",
    nextRun: "Tomorrow, 8 AM",
    lastSent: "Today, 8 AM",
    format: "PDF",
    status: "paused",
    totalSends: 45,
    createdAt: "2025-11-01",
  },
  {
    id: "sch-003",
    name: "Social media monthly summary",
    description: "Comprehensive social analytics",
    reports: ["Social analytics"],
    owner: "Sampada R",
    ownerEmail: "sampada@acmecorp.com",
    recipients: ["marketing@acmecorp.com", "sampada@acmecorp.com"],
    frequency: "monthly",
    day: "1st",
    time: "10:00 AM",
    nextRun: "Apr 1",
    lastSent: "Mar 1",
    format: "PPT",
    status: "failed",
    totalSends: 6,
    createdAt: "2025-10-01",
  },
  {
    id: "sch-004",
    name: "Quarterly investor report",
    description: "Executive metrics, competitor landscape",
    reports: ["Profile performance", "Competitor analysis", "Survey results"],
    owner: "Balaji K",
    ownerEmail: "balaji@acmecorp.com",
    recipients: ["investors@acmecorp.com", "board@acmecorp.com", "cfo@acmecorp.com", "ceo@acmecorp.com"],
    frequency: "quarterly",
    day: "1st of quarter",
    time: "7:00 AM",
    nextRun: "Apr 1",
    lastSent: "Jan 1",
    format: "PDF",
    status: "active",
    totalSends: 4,
    createdAt: "2025-04-01",
  },
  {
    id: "sch-005",
    name: "Bi-weekly campaign performance",
    description: "Email & SMS campaign metrics",
    reports: ["Campaign report"],
    owner: "Balaji K",
    ownerEmail: "balaji@acmecorp.com",
    recipients: ["marketing@acmecorp.com", "balaji@acmecorp.com"],
    frequency: "bi-weekly",
    day: "Monday",
    time: "9:00 AM",
    nextRun: "Mon, Mar 23",
    lastSent: "Mon, Mar 9",
    format: "XLS",
    status: "active",
    totalSends: 12,
    createdAt: "2025-12-01",
  },
  {
    id: "sch-006",
    name: "Weekly competitor watch",
    description: "Competitive intelligence summary",
    reports: ["Competitor analysis"],
    owner: "Rupa M",
    ownerEmail: "rupa@acmecorp.com",
    recipients: ["strategy@acmecorp.com", "rupa@acmecorp.com", "balaji@acmecorp.com"],
    frequency: "weekly",
    day: "Friday",
    time: "5:00 PM",
    nextRun: "Fri, Mar 13",
    lastSent: "Fri, Mar 6",
    format: "PDF",
    status: "active",
    totalSends: 18,
    createdAt: "2025-08-15",
  },
  {
    id: "sch-007",
    name: "Monthly listing audit",
    description: "Location accuracy and listing health",
    reports: ["Listing audit"],
    owner: "Sampada R",
    ownerEmail: "sampada@acmecorp.com",
    recipients: ["ops-team@acmecorp.com"],
    frequency: "monthly",
    day: "15th",
    time: "6:00 AM",
    nextRun: "Mar 15",
    lastSent: "Feb 15",
    format: "XLS",
    status: "active",
    totalSends: 8,
    createdAt: "2025-07-15",
  },
  {
    id: "sch-008",
    name: "Weekly survey results",
    description: "Customer satisfaction trends",
    reports: ["Survey results"],
    owner: "Balaji K",
    ownerEmail: "balaji@acmecorp.com",
    recipients: ["cx-team@acmecorp.com", "support@acmecorp.com"],
    frequency: "weekly",
    day: "Wednesday",
    time: "10:00 AM",
    nextRun: "Wed, Mar 18",
    lastSent: "Wed, Mar 11",
    format: "PDF",
    status: "active",
    totalSends: 14,
    createdAt: "2025-10-01",
  },
  {
    id: "sch-009",
    name: "Daily response tracker",
    description: "Review response compliance",
    reports: ["Response trends"],
    owner: "Rupa M",
    ownerEmail: "rupa@acmecorp.com",
    recipients: ["support@acmecorp.com", "rupa@acmecorp.com"],
    frequency: "daily",
    day: "Every day",
    time: "7:00 AM",
    nextRun: "Tomorrow, 7 AM",
    lastSent: "Today, 7 AM",
    format: "PDF",
    status: "active",
    totalSends: 32,
    createdAt: "2025-11-15",
  },
  {
    id: "sch-010",
    name: "Monthly executive summary",
    description: "Cross-platform performance overview",
    reports: ["Profile performance", "Social analytics"],
    owner: "Balaji K",
    ownerEmail: "balaji@acmecorp.com",
    recipients: ["leadership@acmecorp.com", "ceo@acmecorp.com", "coo@acmecorp.com"],
    frequency: "monthly",
    day: "1st",
    time: "8:00 AM",
    nextRun: "Apr 1",
    lastSent: "Mar 1",
    format: "PDF",
    status: "expired",
    totalSends: 3,
    createdAt: "2025-12-01",
  },
  {
    id: "sch-011",
    name: "Weekly Instagram report",
    description: "Instagram channel analytics",
    reports: ["Social analytics"],
    owner: "Sampada R",
    ownerEmail: "sampada@acmecorp.com",
    recipients: ["social-team@acmecorp.com"],
    frequency: "weekly",
    day: "Monday",
    time: "8:00 AM",
    nextRun: "Mon, Mar 16",
    lastSent: "Mon, Mar 9",
    format: "PNG",
    status: "active",
    totalSends: 10,
    createdAt: "2026-01-06",
  },
  {
    id: "sch-012",
    name: "Bi-weekly review summary",
    description: "Review volume and sentiment",
    reports: ["Reviews overview", "Review sites"],
    owner: "Balaji K",
    ownerEmail: "balaji@acmecorp.com",
    recipients: ["quality@acmecorp.com"],
    frequency: "bi-weekly",
    day: "Thursday",
    time: "11:00 AM",
    nextRun: "Thu, Mar 19",
    lastSent: "Thu, Mar 5",
    format: "PDF",
    status: "active",
    totalSends: 6,
    createdAt: "2026-01-01",
  },
];

const mockDrafts: { id: string; name: string; description: string; updatedAt: string }[] = [
  { id: "draft-001", name: "Executive weekly digest", description: "Profile performance, Reviews, Competitor analysis", updatedAt: "Mar 10, 2026" },
  { id: "draft-002", name: "Reviews + Social monthly summary", description: "Reviews overview, Social analytics", updatedAt: "Mar 8, 2026" },
];

/* ─── Status pill ─── */
const statusConfig: Record<ScheduleStatus, { label: string; bg: string; text: string; darkBg: string; darkText: string }> = {
  active: { label: "Active", bg: "#e8f5e9", text: "#2e7d32", darkBg: "#1a3328", darkText: "#6fcf73" },
  paused: { label: "Paused", bg: "#fff3e0", text: "#e65100", darkBg: "#362a1a", darkText: "#ffb74d" },
  draft: { label: "Draft", bg: "#f5f5f5", text: "#757575", darkBg: "#2a2d33", darkText: "#9ba2b0" },
  failed: { label: "Failed", bg: "#ffebee", text: "#c62828", darkBg: "#352020", darkText: "#ef9a9a" },
  expired: { label: "Expired", bg: "#f3e5f5", text: "#7b1fa2", darkBg: "#2a1f33", darkText: "#ce93d8" },
};

function StatusPill({ status }: { status: ScheduleStatus }) {
  const c = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] font-['Inter',sans-serif] text-[11px] whitespace-nowrap bg-[var(--sched-pill-bg)] text-[var(--sched-pill-fg)] dark:bg-[var(--sched-pill-dbg)] dark:text-[var(--sched-pill-dfg)]"
      style={
        {
          fontWeight: 400,
          "--sched-pill-bg": c.bg,
          "--sched-pill-fg": c.text,
          "--sched-pill-dbg": c.darkBg,
          "--sched-pill-dfg": c.darkText,
        } as CSSProperties
      }
    >
      <span
        className="h-[5px] w-[5px] shrink-0 rounded-full bg-[var(--sched-pill-fg)] dark:bg-[var(--sched-pill-dfg)]"
        aria-hidden
      />
      {c.label}
    </span>
  );
}

/* ─── Frequency label ─── */
function freqLabel(f: ScheduleFrequency): string {
  return { daily: "Daily", weekly: "Weekly", "bi-weekly": "Bi-weekly", monthly: "Monthly", quarterly: "Quarterly" }[f];
}

/* ─── Dropdown helper ─── */
function FilterDropdown({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-[6px] rounded-[8px] border text-[12px] font-['Inter',sans-serif] transition-colors ${
          value !== "All"
            ? "border-brand-color dark:border-blue-80 bg-blue-10 dark:bg-blue-300 text-brand-color dark:text-blue-70"
            : "border-new-selected-color dark:border-border bg-white dark:bg-muted text-gray-300 dark:text-muted-foreground hover:bg-gray-20 dark:hover:bg-muted"
        }`}
        style={{ fontWeight: 400 }}
      >
        {value === "All" ? label : value}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white dark:bg-background border border-gray-20 dark:border-border rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.3)] z-30 py-1 min-w-[140px]">
          {["All", ...options].map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-[12px] font-['Inter',sans-serif] transition-colors ${
                value === opt
                  ? "bg-blue-10 dark:bg-blue-300 text-brand-color dark:text-blue-70"
                  : "text-gray-500 dark:text-foreground hover:bg-gray-10 dark:hover:bg-muted"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Row action menu ─── */
function RowActionMenu({ schedule, onAction }: {
  schedule: ScheduleItem;
  onAction: (action: string, id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const actions = [
    { label: "Edit", icon: Pencil, action: "edit" },
    { label: "Duplicate", icon: Copy, action: "duplicate" },
    { label: schedule.status === "paused" ? "Resume" : "Pause", icon: schedule.status === "paused" ? Play : Pause, action: schedule.status === "paused" ? "resume" : "pause" },
    { label: "Run now", icon: RotateCcw, action: "run-now" },
    { label: "View history", icon: History, action: "history" },
    { divider: true } as any,
    { label: "Delete", icon: Trash2, action: "delete", destructive: true },
  ];

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="rounded-lg text-gray-80 dark:text-muted-foreground hover:text-gray-300 dark:hover:text-gray-50 hover:bg-gray-20 dark:hover:bg-muted"
      >
        <MoreHorizontal className="w-[14px] h-[14px]" />
      </Button>
      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-40 mt-1 flex min-w-[160px] flex-col gap-1",
            FLOATING_PANEL_SURFACE_CLASSNAME,
            FLOATING_PANEL_LIST_PADDING_CLASSNAME,
          )}
        >
          {actions.map((a, i) =>
            a.divider ? (
              <div key={i} className="my-1 h-px bg-border" />
            ) : (
              <button
                key={a.label}
                onClick={(e) => { e.stopPropagation(); onAction(a.action, schedule.id); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] font-['Inter',sans-serif] transition-colors duration-150",
                  a.destructive
                    ? "text-destructive hover:bg-destructive/10"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <a.icon className="h-3.5 w-3.5 shrink-0" />
                {a.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export function ScheduledDeliveriesView({ onCreateSchedule }: { onCreateSchedule?: () => void }) {
  const isAdmin = true;
  const [activeTab, setActiveTab] = useState<"mine" | "team" | "drafts">("mine");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTime, setFilterTime] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterFrequency, setFilterFrequency] = useState("All");
  const [filterFormat, setFilterFormat] = useState("All");
  const [filterOwner, setFilterOwner] = useState("All");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleAction = (action: string, id: string) => {
    const schedule = mockSchedules.find(s => s.id === id);
    if (!schedule) return;
    switch (action) {
      case "edit": toast.success(`Editing "${schedule.name}"...`); break;
      case "duplicate": toast.success(`Duplicated "${schedule.name}"`); break;
      case "pause": toast.success(`Paused "${schedule.name}"`); break;
      case "resume": toast.success(`Resumed "${schedule.name}"`); break;
      case "run-now": toast.success(`Running "${schedule.name}" now...`); break;
      case "history": toast.success(`Showing history for "${schedule.name}"`); break;
      case "delete": toast.success(`Deleted "${schedule.name}"`); break;
    }
  };

  // Filter data
  let filteredSchedules = mockSchedules.filter(s => {
    if (activeTab === "mine") return s.owner === currentUser;
    if (activeTab === "team") return s.owner !== currentUser;
    return false;
  });

  if (filterStatus !== "All") filteredSchedules = filteredSchedules.filter(s => statusConfig[s.status].label === filterStatus);
  if (filterFrequency !== "All") filteredSchedules = filteredSchedules.filter(s => freqLabel(s.frequency) === filterFrequency);
  if (filterFormat !== "All") filteredSchedules = filteredSchedules.filter(s => s.format === filterFormat);
  if (filterOwner !== "All") filteredSchedules = filteredSchedules.filter(s => s.owner === filterOwner);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredSchedules = filteredSchedules.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.owner.toLowerCase().includes(q) ||
      s.recipients.some(r => r.toLowerCase().includes(q)) ||
      s.reports.some(r => r.toLowerCase().includes(q))
    );
  }

  // Sort
  if (sortField) {
    filteredSchedules = [...filteredSchedules].sort((a, b) => {
      let va = "", vb = "";
      switch (sortField) {
        case "name": va = a.name; vb = b.name; break;
        case "owner": va = a.owner; vb = b.owner; break;
        case "frequency": va = a.frequency; vb = b.frequency; break;
        case "status": va = a.status; vb = b.status; break;
        case "format": va = a.format; vb = b.format; break;
      }
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }

  // Summary stats
  const allSchedules = mockSchedules;
  const activeCount = allSchedules.filter(s => s.status === "active").length;
  const totalSends = allSchedules.reduce((sum, s) => sum + s.totalSends, 0);
  const uniqueRecipients = new Set(allSchedules.flatMap(s => s.recipients)).size;
  const failedCount = allSchedules.filter(s => s.status === "failed").length;

  const hasActiveFilters = filterStatus !== "All" || filterFrequency !== "All" || filterFormat !== "All" || filterOwner !== "All";

  const clearFilters = () => {
    setFilterTime("All");
    setFilterStatus("All");
    setFilterFrequency("All");
    setFilterFormat("All");
    setFilterOwner("All");
  };

  const owners = [...new Set(allSchedules.map(s => s.owner))];

  return (
    <div className="flex-1 bg-white dark:bg-app-shell-gutter overflow-auto flex flex-col transition-colors duration-300">
      <div className="sticky top-0 z-10 shrink-0 bg-white transition-colors duration-300 dark:bg-app-shell-gutter">
        <MainCanvasViewHeader
          title={
            <span className="inline-flex items-center gap-3">
              <Clock className="size-5 shrink-0 text-primary" aria-hidden />
              Scheduled deliveries
            </span>
          }
          actions={
            <button
              type="button"
              onClick={() => onCreateSchedule?.()}
              className="flex items-center gap-1.5 rounded-lg bg-brand-color px-4 py-1.5 text-sm text-white transition-all tracking-tight hover:brightness-[0.92]"
            >
              <Plus className="size-4" aria-hidden />
              Create schedule
            </button>
          }
        />
      </div>

      <div className="px-8 pb-8 flex flex-col gap-5 flex-1">
        {/* ─── Summary cards ─── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Active schedules", value: activeCount, icon: CheckCircle2, color: "var(--green-200)", bg: "#e8f5e9", darkBg: "#1a3328" },
            { label: "Total sends", value: totalSends, icon: Send, color: "var(--brand-color)", bg: "#e8effe", darkBg: "#1e2d5e" },
            { label: "Unique recipients", value: uniqueRecipients, icon: Users, color: "var(--purple-100)", bg: "#f3e5f5", darkBg: "#2a1f33" },
            { label: "Failed deliveries", value: failedCount, icon: AlertTriangle, color: "var(--red-200)", bg: "#ffebee", darkBg: "#352020" },
          ].map(card => (
            <div
              key={card.label}
              className="bg-white dark:bg-background rounded-[8px] border border-new-selected-color dark:border-border px-5 py-4 flex items-center gap-4 transition-colors duration-300"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `var(--card-icon-bg)` }}
              >
                <card.icon className="w-[18px] h-[18px]" style={{ color: card.color }} />
                <style>{`
                  :root { --card-icon-bg: ${card.bg}; }
                  .dark { --card-icon-bg: ${card.darkBg}; }
                `}</style>
              </div>
              <div>
                <p className="text-[22px] text-gray-900 dark:text-foreground tracking-[-0.3px]" style={{ fontWeight: 400 }}>
                  {card.value}
                </p>
                <p className="text-[12px] text-gray-80 dark:text-muted-foreground" style={{ fontWeight: 400 }}>
                  {card.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Filters ─── */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterDropdown label="Time range" options={["Last 7 days", "Last 30 days", "Last 90 days", "This year"]} value={filterTime} onChange={setFilterTime} />
          <FilterDropdown label="Status" options={["Active", "Paused", "Failed", "Expired"]} value={filterStatus} onChange={setFilterStatus} />
          <FilterDropdown label="Frequency" options={["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly"]} value={filterFrequency} onChange={setFilterFrequency} />
          <FilterDropdown label="Format" options={["PDF", "XLS", "PPT", "PNG"]} value={filterFormat} onChange={setFilterFormat} />
          {isAdmin && (
            <FilterDropdown label="Owner" options={owners} value={filterOwner} onChange={setFilterOwner} />
          )}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-[6px] text-[12px] text-red-200 dark:text-red-60 hover:bg-red-20 dark:hover:bg-red-400 rounded-lg transition-colors font-['Inter',sans-serif]"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        {/* ─── Tabs ─── */}
        <TextTabsRow
          ariaLabel="Schedule scope"
          value={activeTab}
          onChange={setActiveTab}
          items={[
            { id: "mine", label: "Scheduled by me" },
            ...(isAdmin ? [{ id: "team" as const, label: "Team schedules" }] : []),
            {
              id: "drafts",
              label: "Drafts",
              suffix: (
                <span className="font-normal tabular-nums text-muted-foreground">
                  ({mockDrafts.length})
                </span>
              ),
            },
          ]}
        />

        {/* ─── Drafts tab ─── */}
        {activeTab === "drafts" && (
          <div className="flex flex-col gap-3">
            {mockDrafts.length === 0 ? (
              <div className="bg-white dark:bg-background border border-new-selected-color dark:border-border rounded-[8px] px-6 py-12 flex flex-col items-center justify-center gap-3">
                <FileText className="w-10 h-10 text-gray-60 dark:text-gray-500" />
                <p className="text-[14px] text-gray-80 dark:text-muted-foreground" style={{ fontWeight: 400 }}>No draft schedules</p>
                <p className="text-[12px] text-gray-70 dark:text-muted-foreground">Draft schedules will appear here</p>
              </div>
            ) : (
              mockDrafts.map(draft => (
                <div
                  key={draft.id}
                  className="bg-white dark:bg-background border border-new-selected-color dark:border-border rounded-[8px] px-5 py-4 flex items-center justify-between hover:bg-gray-10 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-20 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-gray-80 dark:text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] text-gray-900 dark:text-foreground truncate" style={{ fontWeight: 400 }}>{draft.name}</p>
                      <p className="text-[11px] text-gray-90 dark:text-muted-foreground truncate">{draft.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-gray-70 dark:text-muted-foreground font-['Inter',sans-serif]">Updated {draft.updatedAt}</span>
                    <button
                      onClick={() => toast.success(`Editing draft "${draft.name}"...`)}
                      className="px-3 py-1 text-[12px] text-brand-color dark:text-blue-70 rounded-lg border border-brand-color dark:border-blue-80 opacity-0 group-hover:opacity-100 transition-opacity font-['Inter',sans-serif]"
                      style={{ fontWeight: 400 }}
                    >
                      Continue editing
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── Schedule table ─── */}
        {activeTab !== "drafts" && (
          <div className="bg-white dark:bg-background border border-new-selected-color dark:border-border rounded-[8px] overflow-hidden transition-colors duration-300">
            {/* Search bar */}
            <div className="px-5 py-3 border-b border-comparison-0-star dark:border-border">
              <div className="flex items-center gap-2 bg-gray-10 dark:bg-muted border border-gray-20 dark:border-border rounded-lg px-3 h-[36px] max-w-[400px]">
                <Search className="w-3.5 h-3.5 text-gray-70 dark:text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search schedules, owners, recipients..."
                  className="w-full text-[12px] text-gray-500 dark:text-foreground placeholder:text-gray-70 dark:placeholder:text-muted-foreground bg-transparent outline-none font-['Inter',sans-serif]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="shrink-0">
                    <X className="w-3 h-3 text-gray-90 dark:text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-comparison-0-star dark:border-border">
                    {[
                      { key: "name", label: "Name", width: "w-[24%]" },
                      { key: "reports", label: "Reports", width: "w-[14%]" },
                      ...(isAdmin || activeTab === "team" ? [{ key: "owner", label: "Owner", width: "w-[10%]" }] : []),
                      { key: "recipients", label: "Recipients", width: "w-[10%]" },
                      { key: "frequency", label: "Frequency", width: "w-[9%]" },
                      { key: "nextRun", label: "Next run", width: "w-[10%]" },
                      { key: "lastSent", label: "Last sent", width: "w-[10%]" },
                      { key: "format", label: "Format", width: "w-[6%]" },
                      { key: "status", label: "Status", width: "w-[8%]" },
                      { key: "actions", label: "", width: "w-[4%]" },
                    ].map(col => (
                      <th
                        key={col.key}
                        className={`${col.width} text-left px-4 py-3 text-[length:var(--table-label-size)] text-gray-80 dark:text-muted-foreground font-['Inter',sans-serif] uppercase tracking-[0.5px]`}
                        style={{ fontWeight: 400 }}
                      >
                        {col.key !== "actions" ? (
                          <button
                            onClick={() => handleSort(col.key)}
                            className="flex items-center gap-1 hover:text-gray-300 dark:hover:text-gray-70 transition-colors"
                          >
                            {col.label}
                            {sortField === col.key && (
                              <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === "asc" ? "" : "rotate-180"}`} />
                            )}
                          </button>
                        ) : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Clock className="w-10 h-10 text-gray-60 dark:text-gray-500" />
                          <p className="text-[14px] text-gray-80 dark:text-muted-foreground" style={{ fontWeight: 400 }}>
                            {searchQuery ? "No schedules match your search" : "No scheduled deliveries yet"}
                          </p>
                          {!searchQuery && (
                            <button
                              onClick={() => toast.success("Opening schedule creator...")}
                              className="px-4 py-1.5 text-[13px] text-white rounded-[8px] transition-all"
                              style={{ fontWeight: 400, backgroundColor: "var(--brand-color)" }}
                            >
                              Create your first scheduled delivery
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSchedules.map(schedule => (
                      <tr
                        key={schedule.id}
                        className="border-b border-gray-20 dark:border-gray-700 last:border-b-0 hover:bg-gray-10 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                      >
                        {/* Name */}
                        <td className="px-4 py-3">
                          <p className="text-[13px] text-gray-900 dark:text-foreground truncate" style={{ fontWeight: 400 }}>
                            {schedule.name}
                          </p>
                          <p className="text-[11px] text-gray-90 dark:text-muted-foreground truncate mt-0.5">
                            {schedule.description}
                          </p>
                        </td>

                        {/* Reports */}
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-gray-300 dark:text-muted-foreground" style={{ fontWeight: 400 }}>
                            {schedule.reports.length} {schedule.reports.length === 1 ? "report" : "reports"}
                          </p>
                        </td>

                        {/* Owner (admin/team only) */}
                        {(isAdmin || activeTab === "team") && (
                          <td className="px-4 py-3">
                            <p className="text-[12px] text-gray-300 dark:text-muted-foreground truncate" style={{ fontWeight: 400 }}>
                              {schedule.owner}
                            </p>
                          </td>
                        )}

                        {/* Recipients */}
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-gray-300 dark:text-muted-foreground" style={{ fontWeight: 400 }}>
                            {schedule.recipients.length} {schedule.recipients.length === 1 ? "person" : "people"}
                          </p>
                        </td>

                        {/* Frequency */}
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-gray-300 dark:text-muted-foreground" style={{ fontWeight: 400 }}>
                            {freqLabel(schedule.frequency)}
                          </p>
                        </td>

                        {/* Next run */}
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-gray-300 dark:text-muted-foreground whitespace-nowrap" style={{ fontWeight: 400 }}>
                            {schedule.nextRun}
                          </p>
                        </td>

                        {/* Last sent */}
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-gray-300 dark:text-muted-foreground whitespace-nowrap" style={{ fontWeight: 400 }}>
                            {schedule.lastSent || "—"}
                          </p>
                        </td>

                        {/* Format */}
                        <td className="px-4 py-3">
                          <span className="text-[11px] text-gray-300 dark:text-muted-foreground px-2 py-0.5 rounded bg-gray-20 dark:bg-gray-700 font-['Inter',sans-serif]">
                            {schedule.format}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusPill status={schedule.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <RowActionMenu schedule={schedule} onAction={handleAction} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}