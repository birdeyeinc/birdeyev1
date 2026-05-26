import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Search,
  X,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  CalendarClock,
  Link2,
} from "lucide-react";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { TextTabsRow } from "@/app/components/ui/text-tabs.v1";
import { AppDataTable } from "@/app/components/ui/AppDataTable";
import { AppDataTableColumnSettingsTrigger } from "@/app/components/ui/AppDataTableColumnSettingsTrigger";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge.v1";
import { cn } from "@/app/components/ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { usePersistedState } from "@/app/hooks/usePersistedState";
import {
  KB_FILE_ROWS,
  KB_LINK_ROWS,
  type KbFileRow,
  type KbLinkRow,
  type KbSyncStatus,
} from "./knowledgeBaseMockData";

// ─── KPI stat tile (image-37 pattern) ────────────────────────────────────────

type KpiTileProps = {
  value: number;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

function KpiTile({ value, label, icon, active, onClick }: KpiTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-1.5 rounded-xl px-5 py-4 text-left transition-colors min-w-[110px]",
        active
          ? "bg-blue-10 dark:bg-primary/10"
          : "hover:bg-muted/60",
      )}
    >
      <span className={cn("text-[30px] font-normal leading-[1.2] tabular-nums text-gray-800 dark:text-gray-50", active && "text-primary dark:text-primary")}>
        {value}
      </span>
      <span className="flex items-center gap-1.5 text-[12px] font-normal text-gray-90 dark:text-gray-90">
        {icon}
        {label}
      </span>
    </button>
  );
}

// ─── Rounded-rectangle tab count chip ────────────────────────────────────────

function TabCount({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[22px] h-[18px] rounded-full px-1.5 text-[11px] font-medium bg-muted text-muted-foreground">
      {n}
    </span>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const fileColHelper = createColumnHelper<KbFileRow>();
const linkColHelper = createColumnHelper<KbLinkRow>();

const fileColumns = [
  fileColHelper.accessor("name", {
    id: "name",
    header: "File",
    size: 380,
    meta: { settingsLabel: "File" },
    cell: (info) => <span className="font-medium text-foreground group-hover/table-row:text-primary transition-colors">{info.getValue()}</span>,
  }),
  fileColHelper.accessor("status", {
    id: "status",
    header: "Status",
    size: 120,
    meta: { settingsLabel: "Status" },
    cell: () => <Badge variant="success">Uploaded</Badge>,
  }),
  fileColHelper.accessor("location", {
    id: "location",
    header: "Location",
    size: 160,
    meta: { settingsLabel: "Location" },
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
  fileColHelper.accessor("uploadedOn", {
    id: "uploadedOn",
    header: "Uploaded on",
    size: 140,
    meta: { settingsLabel: "Uploaded on" },
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
];

function SyncStatusCell({ status }: { status: KbSyncStatus }) {
  const config = {
    synced:       { icon: <CheckCircle2  size={16} strokeWidth={1.6} absoluteStrokeWidth className="text-green-300"  aria-hidden />, label: "Synced" },
    "in-progress":{ icon: <Clock         size={16} strokeWidth={1.6} absoluteStrokeWidth className="text-amber-500"   aria-hidden />, label: "In progress" },
    failed:       { icon: <XCircle       size={16} strokeWidth={1.6} absoluteStrokeWidth className="text-destructive" aria-hidden />, label: "Failed" },
  } as const;
  const { icon, label } = config[status] ?? config.failed;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default inline-flex">{icon}</span>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

const linkColumns = [
  linkColHelper.accessor("url", {
    id: "url",
    header: "Link",
    size: 340,
    meta: { settingsLabel: "Link" },
    cell: (info) => <span className="font-medium text-foreground group-hover/table-row:text-primary transition-colors">{info.getValue()}</span>,
  }),
  linkColHelper.accessor("location", {
    id: "location",
    header: "Location",
    size: 160,
    meta: { settingsLabel: "Location" },
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
  linkColHelper.accessor("status", {
    id: "status",
    header: "Status",
    size: 120,
    meta: { settingsLabel: "Status" },
    cell: (info) => <SyncStatusCell status={info.getValue()} />,
  }),
  linkColHelper.accessor("lastSynced", {
    id: "lastSynced",
    header: "Last synced",
    size: 140,
    meta: { settingsLabel: "Last synced" },
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
  linkColHelper.accessor("addedOn", {
    id: "addedOn",
    header: "Added on",
    size: 140,
    meta: { settingsLabel: "Added on" },
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
];

// ─── Main view ────────────────────────────────────────────────────────────────

type KbTab = "files" | "links";

export interface KnowledgeBaseViewProps {
  fileRows?: KbFileRow[];
  linkRows?: KbLinkRow[];
}

export function KnowledgeBaseView({
  fileRows = KB_FILE_ROWS,
  linkRows = KB_LINK_ROWS,
}: KnowledgeBaseViewProps) {
  const [tab, setTab] = usePersistedState<KbTab>("kb:tab", "files");
  const [search, setSearch]               = useState("");
  const [searchOpen, setSearchOpen]       = useState(false);
  const [fileColumnSheetOpen, setFileColumnSheetOpen] = useState(false);
  const [linkColumnSheetOpen, setLinkColumnSheetOpen] = useState(false);
  const [activeKpi, setActiveKpi] = useState<"all" | "synced" | "in-progress" | "failed" | "scheduled">("all");

  const tabItems = [
    { id: "files" as KbTab, label: "Files", suffix: <TabCount n={fileRows.length} /> },
    { id: "links" as KbTab, label: "Links", suffix: <TabCount n={linkRows.length} /> },
  ];

  const filteredFiles = search
    ? fileRows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase()))
    : fileRows;

  const syncedCount     = linkRows.filter((r) => r.status === "synced").length;
  const inProgressCount = linkRows.filter((r) => r.status === "in-progress").length;
  const failedCount     = linkRows.filter((r) => r.status === "failed").length;
  const scheduledCount  = 0; // mock

  const filteredLinks = (() => {
    const byKpi =
      activeKpi === "synced"      ? linkRows.filter((r) => r.status === "synced")      :
      activeKpi === "in-progress" ? linkRows.filter((r) => r.status === "in-progress") :
      activeKpi === "failed"      ? linkRows.filter((r) => r.status === "failed")      :
      activeKpi === "scheduled"   ? []                                                  :
      linkRows;
    const q = search.toLowerCase();
    return q === "" ? byKpi : byKpi.filter((r) =>
      r.url.toLowerCase().includes(q) || r.location.toLowerCase().includes(q),
    );
  })();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <MainCanvasViewHeader
        title="Knowledge base"
        actions={
          <div className="flex items-center gap-2">
            {/* Expanding search — same pattern as PhoneNumbers / Reviews */}
            {searchOpen ? (
              <div className="relative h-[var(--button-height)] w-[240px]">
                <Search
                  className="pointer-events-none absolute left-2 top-1/2 size-[14px] -translate-y-1/2 text-gray-600 dark:text-muted-foreground"
                  strokeWidth={1.6} absoluteStrokeWidth aria-hidden
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => { if (search === "") setSearchOpen(false); }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") { setSearch(""); setSearchOpen(false); }
                  }}
                  autoFocus
                  placeholder={tab === "files" ? "Search files" : "Search links"}
                  className="h-full w-full rounded-[8px] border border-new-selected-color bg-white py-0 pr-8 pl-8 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-100 focus:border-brand-color focus:ring-1 focus:ring-brand-color dark:border-border dark:bg-muted dark:text-foreground dark:placeholder:text-gray-90"
                  aria-label="Search"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => { setSearch(""); setSearchOpen(false); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={13} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                  </button>
                )}
              </div>
            ) : (
              <Button
                type="button" variant="outline" size="icon"
                aria-label="Search" title="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="size-[14px] text-gray-600 dark:text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
              </Button>
            )}

            {/* Three-dot menu: bulk actions + column settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="icon" aria-label="More actions">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem>Select all</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete selected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Column settings — tab-aware: shows Files or Links columns */}
            <AppDataTableColumnSettingsTrigger
              sheetTitle={tab === "files" ? "File columns" : "Link columns"}
              onClick={() => tab === "files" ? setFileColumnSheetOpen(true) : setLinkColumnSheetOpen(true)}
            />
          </div>
        }
      />

      <div className="flex-1 min-h-0 px-6 pt-2 pb-5 flex flex-col gap-4">
        <TextTabsRow<KbTab>
          items={tabItems}
          value={tab}
          onChange={(t) => { setTab(t); setSearch(""); setSearchOpen(false); }}
        />

        {tab === "files" && (
          <AppDataTable<KbFileRow>
            scrollableBody
            tableId="kb.files"
            data={filteredFiles}
            columns={fileColumns}
            getRowId={(r) => r.id}
            initialSorting={[{ id: "uploadedOn", desc: true }]}
            columnSheetTitle="File columns"
            columnSheetOpen={fileColumnSheetOpen}
            onColumnSheetOpenChange={setFileColumnSheetOpen}
            hideColumnsButton
            className="min-w-0 px-0"
            emptyState={
              <div className="py-12 text-center text-sm text-muted-foreground">No files uploaded yet.</div>
            }
          />
        )}

        {tab === "links" && (
          <>
            {/* KPI tiles — selectable, filters table */}
            <div className="flex flex-wrap gap-1 -mx-1">
              <KpiTile value={linkRows.length}  label="All links"              icon={<Link2         size={12} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />}                                          active={activeKpi === "all"}         onClick={() => setActiveKpi("all")}         />
              <KpiTile value={syncedCount}      label="Synced"                 icon={<CheckCircle2  size={12} strokeWidth={1.6} absoluteStrokeWidth className="text-green-300"   aria-hidden />}             active={activeKpi === "synced"}      onClick={() => setActiveKpi("synced")}      />
              <KpiTile value={inProgressCount}  label="In progress"            icon={<Clock         size={12} strokeWidth={1.6} absoluteStrokeWidth className="text-amber-500"    aria-hidden />}             active={activeKpi === "in-progress"} onClick={() => setActiveKpi("in-progress")} />
              <KpiTile value={failedCount}      label="Failed"                 icon={<XCircle       size={12} strokeWidth={1.6} absoluteStrokeWidth className="text-destructive"  aria-hidden />}             active={activeKpi === "failed"}      onClick={() => setActiveKpi("failed")}      />
              <KpiTile value={scheduledCount}   label="Links scheduled to sync" icon={<CalendarClock size={12} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />}                                          active={activeKpi === "scheduled"}   onClick={() => setActiveKpi("scheduled")}   />
            </div>

            <AppDataTable<KbLinkRow>
              scrollableBody
              tableId="kb.links"
              data={filteredLinks}
              columns={linkColumns}
              getRowId={(r) => r.id}
              initialSorting={[{ id: "addedOn", desc: true }]}
              columnSheetTitle="Link columns"
              columnSheetOpen={linkColumnSheetOpen}
              onColumnSheetOpenChange={setLinkColumnSheetOpen}
              hideColumnsButton
              className="min-w-0 px-0"
              rowHoverAction={() => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" aria-label="Row actions">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
                    <DropdownMenuItem>Copy link</DropdownMenuItem>
                    <DropdownMenuItem>Sync</DropdownMenuItem>
                    <DropdownMenuItem>Edit locations</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              emptyState={
                <div className="py-12 text-center text-sm text-muted-foreground">No links added yet.</div>
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
