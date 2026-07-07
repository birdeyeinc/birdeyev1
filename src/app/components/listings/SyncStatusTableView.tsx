import TableGrid from "@birdeye/elemental/core/components/TableGrid";
import type { CellRendererProps, HeaderData, TableGridCellRendererProps } from "@birdeye/elemental/core/components/TableGrid/types";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/components/ui/utils";

type SyncRow = {
  rowId: string;
  channel: "Google" | "Facebook";
  syncedLocations: number;
  failedLocations: number;
  lastSyncedAt: string;
  status: "Synced" | "Partial";
};

const SYNC_STATUS_HEADERS: HeaderData[] = [
  { order: 0, value: "channel", label: "Channel", enabled: true, sortable: true, width: 220, minWidth: 180 },
  { order: 1, value: "syncedLocations", label: "Synced locations", enabled: true, sortable: true, width: 180, minWidth: 140 },
  { order: 2, value: "failedLocations", label: "Failed", enabled: true, sortable: true, width: 120, minWidth: 100 },
  { order: 3, value: "lastSyncedAt", label: "Last synced", enabled: true, sortable: true, width: 180, minWidth: 140 },
  { order: 4, value: "status", label: "Status", enabled: true, sortable: true, width: 140, minWidth: 120 },
];

const SYNC_STATUS_ROWS: SyncRow[] = [
  {
    rowId: "google",
    channel: "Google",
    syncedLocations: 1320,
    failedLocations: 12,
    lastSyncedAt: "2 mins ago",
    status: "Synced",
  },
  {
    rowId: "facebook",
    channel: "Facebook",
    syncedLocations: 748,
    failedLocations: 21,
    lastSyncedAt: "11 mins ago",
    status: "Partial",
  },
];

const SYNC_TABLE_DATA = {
  headerData: SYNC_STATUS_HEADERS,
  data: SYNC_STATUS_ROWS.map((row) => ({
    rowId: row.rowId,
    row,
    rowData: {
      channel: { value: row.channel },
      syncedLocations: { value: row.syncedLocations },
      failedLocations: { value: row.failedLocations },
      lastSyncedAt: { value: row.lastSyncedAt },
      status: { value: row.status },
    },
  })),
};

function getRow(props: TableGridCellRendererProps): SyncRow {
  return props.row as SyncRow;
}

function ChannelCell(props: CellRendererProps) {
  const row = getRow(props as TableGridCellRendererProps);
  const isGoogle = row.channel === "Google";
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "inline-flex size-5 items-center justify-center rounded-full text-[11px] font-medium",
          isGoogle ? "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200" : "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200",
        )}
      >
        {isGoogle ? "G" : "f"}
      </span>
      <span className="text-foreground">{row.channel}</span>
    </div>
  );
}

function NumberCell(props: CellRendererProps, key: "syncedLocations" | "failedLocations") {
  const row = getRow(props as TableGridCellRendererProps);
  return <span className="text-foreground tabular-nums">{row[key].toLocaleString()}</span>;
}

function LastSyncedCell(props: CellRendererProps) {
  const row = getRow(props as TableGridCellRendererProps);
  return <span className="text-foreground">{row.lastSyncedAt}</span>;
}

function StatusCell(props: CellRendererProps) {
  const row = getRow(props as TableGridCellRendererProps);
  const positive = row.status === "Synced";
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-normal",
        positive
          ? "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
          : "bg-amber-500/15 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
      )}
    >
      {row.status}
    </Badge>
  );
}

export function SyncStatusTableView() {
  return (
    <div className="rounded-lg border border-new-selected-color bg-white p-6 transition-colors duration-300 dark:border-gray-600 dark:bg-gray-700">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-medium text-foreground">Sync status</h3>
        <p className="text-xs text-muted-foreground">Google and Facebook only</p>
      </div>
      <TableGrid
        tableData={SYNC_TABLE_DATA}
        cellRenderer={{
          channel: ChannelCell,
          syncedLocations: (props: CellRendererProps) => NumberCell(props, "syncedLocations"),
          failedLocations: (props: CellRendererProps) => NumberCell(props, "failedLocations"),
          lastSyncedAt: LastSyncedCell,
          status: StatusCell,
        }}
        isFirstColumnFixed
        enableClientSideSort
        customHeadersFixWidth={{
          channel: 220,
          syncedLocations: 180,
          failedLocations: 120,
          lastSyncedAt: 180,
          status: 140,
        }}
        customHeadersMinWidth={{
          channel: 180,
          syncedLocations: 140,
          failedLocations: 100,
          lastSyncedAt: 140,
          status: 120,
        }}
        tableContainerClass="min-w-0"
      />
    </div>
  );
}
