import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Copy, MoreVertical } from "lucide-react";
import { AppDataTable } from "@/app/components/ui/AppDataTable";
import { APP_DATA_TABLE_PRIMARY_ROW_LABEL_CLASS } from "@/app/components/ui/appDataTableCellClasses";
import { AppDataTableColumnSettingsTrigger } from "@/app/components/ui/AppDataTableColumnSettingsTrigger";
import { Button } from "@/app/components/ui/button";
import { FilterPane, FilterPaneTriggerButton } from "@/app/components/FilterPane";
import type { FilterItem } from "@/app/components/FilterPanel.v1";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { TextTabsRow } from "@/app/components/ui/text-tabs";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/components/ui/utils";
import type { SettingsBusinessRow } from "./settingsBusinessTableData";
import { SETTINGS_BUSINESS_ROWS } from "./settingsBusinessTableData";

interface SettingsBusinessTableViewProps {
  onRowClick: (row: SettingsBusinessRow) => void;
  onNavigateHome?: () => void;
  activeTab?: "business-info" | "reviews";
  onTabChange?: (tab: "business-info" | "reviews") => void;
}

const helper = createColumnHelper<SettingsBusinessRow>();

function formatAccountId(sourceId: string): string {
  const digitsOnly = sourceId.replace(/\D/g, "");
  const padded = `${digitsOnly}0000000000000000`.slice(0, 16);
  return padded;
}

const STATUS_BADGE_CLASS: Record<SettingsBusinessRow["status"], string> = {
  Active: "border-transparent bg-green-20 text-green-200",
  Demo: "border-transparent bg-yellow-30 text-yellow-200",
  Inactive: "border-transparent bg-gray-50 text-gray-100",
  "Needs setup": "border-transparent bg-blue-10 text-blue-200",
};

const SETTINGS_BUSINESS_FILTER_ITEMS: FilterItem[] = [
  { id: "region", label: "Region", options: ["All regions", "East", "West", "North", "South"] },
  { id: "division", label: "Division", options: ["All divisions", "Enterprise", "SMB", "Mid-market"] },
  { id: "city", label: "City", options: ["All cities", "Atlanta", "Boston", "Chicago", "New York"] },
  { id: "zip", label: "Zip", options: ["Any zip", "10001", "30301", "60601", "94105"] },
  { id: "content-manager", label: "Content manager", options: ["All", "Garima Sharma", "Alex Smith", "Jordan Lee"] },
  { id: "social-manager", label: "Social manager", options: ["All", "Garima Sharma", "Taylor Kim", "Jamie Chen"] },
  { id: "area-code", label: "Area code", options: ["Any", "212", "404", "415", "617"] },
  { id: "region-manager", label: "Region manager", options: ["All", "Garima Sharma", "Alex Smith"] },
  { id: "room-custom", label: "Room custom", options: ["Any", "Option A", "Option B", "Option C"] },
  { id: "new-alpha-beta-test", label: "New alpha beta test", options: ["Any", "Enabled", "Disabled"] },
  { id: "custom-test", label: "Custom test", options: ["Any", "True", "False"] },
  { id: "location", label: "Location", options: ["All locations", "Atlanta, GA", "Boston, MA", "Chicago Loop"] },
  { id: "status", label: "Status", options: ["All", "Active", "Demo", "Needs setup", "Inactive"] },
];

export function SettingsBusinessTableView({
  onRowClick,
  onNavigateHome,
  activeTab = "business-info",
  onTabChange,
}: SettingsBusinessTableViewProps) {
  const isBusinessTab = activeTab === "business-info";
  const [columnSheetOpen, setColumnSheetOpen] = useState(false);
  const [filterPaneOpen, setFilterPaneOpen] = useState(false);
  const initialFilterItems = useMemo(
    () => SETTINGS_BUSINESS_FILTER_ITEMS.map((item) => ({ ...item })),
    [],
  );
  const tabs = [
    { id: "business-info", label: "Business info" },
    { id: "reviews", label: "Reviews" },
  ] as const;

  const columns = useMemo(
    () => [
      helper.accessor("businessName", {
        id: "businessName",
        header: "Location",
        meta: { settingsLabel: "Location" },
        size: 260,
        cell: (info) => (
          <span className={cn("font-normal", APP_DATA_TABLE_PRIMARY_ROW_LABEL_CLASS)}>{info.getValue()}</span>
        ),
      }),
      helper.accessor((row) => formatAccountId(row.id), {
        id: "accountId",
        header: "Account ID",
        size: 210,
        cell: (info) => {
          const accountId = info.getValue();
          return (
            <div className="group/account-id flex items-center gap-2">
              <span className="truncate">{accountId}</span>
              <button
                type="button"
                aria-label={`Copy account id ${accountId}`}
                title="Copy account ID"
                className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover/account-id:opacity-100"
                onClick={(event) => {
                  event.stopPropagation();
                  void navigator.clipboard?.writeText(accountId);
                }}
              >
                <Copy size={13} strokeWidth={1.6} absoluteStrokeWidth />
              </button>
            </div>
          );
        },
        meta: { stopRowClick: true, settingsLabel: "Account ID" },
      }),
      helper.accessor("status", {
        id: "status",
        header: "Status",
        meta: { settingsLabel: "Status" },
        size: 140,
        cell: (info) => (
          <Badge className={cn("rounded-sm px-2 py-0 text-[11px]", STATUS_BADGE_CLASS[info.getValue()])}>
            {info.getValue()}
          </Badge>
        ),
      }),
      helper.accessor("type", { id: "type", header: "Type", meta: { settingsLabel: "Type" }, size: 180 }),
      helper.accessor("createdOn", { id: "createdOn", header: "Created on", meta: { settingsLabel: "Created on" }, size: 160 }),
      helper.accessor("createdBy", { id: "createdBy", header: "Created by", meta: { settingsLabel: "Created by" }, size: 180 }),
    ],
    [],
  );
  const totalCount = SETTINGS_BUSINESS_ROWS.length;
  const activeCount = SETTINGS_BUSINESS_ROWS.filter((row) => row.status === "Active").length;
  const demoCount = SETTINGS_BUSINESS_ROWS.filter((row) => row.status === "Demo").length;
  const inactiveCount = SETTINGS_BUSINESS_ROWS.filter((row) => row.status === "Inactive").length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 px-6 pt-5 pb-2 bg-card">
        <div className="min-w-0 flex-1">
          <Breadcrumb>
            <BreadcrumbList className="gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-primary hover:text-primary">
                  <button type="button" onClick={onNavigateHome}>
                    Settings
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{isBusinessTab ? "Business info" : "Reviews"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TextTabsRow
            items={[...tabs]}
            value={activeTab}
            onChange={onTabChange ?? (() => {})}
            className="mt-3 max-w-sm"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 flex overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto pb-8">
        <MainCanvasViewHeader
          className="pt-2"
          title={isBusinessTab ? "Manage your business profile" : "Manage review response templates"}
          titleAs="h2"
          description={
            isBusinessTab
              ? undefined
              : "Review templates are not wired to production settings yet."
          }
          actions={(
            <div className="flex items-center gap-2">
              <AppDataTableColumnSettingsTrigger
                sheetTitle="Columns"
                onClick={() => setColumnSheetOpen(true)}
              />
              <Button type="button" variant="outline" size="icon" aria-label="More actions">
                <MoreVertical size={16} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
              </Button>
              <FilterPaneTriggerButton open={filterPaneOpen} onOpenChange={setFilterPaneOpen} />
            </div>
          )}
        />
        {isBusinessTab ? (
          <div className="flex w-full flex-col gap-4 px-6 items-stretch">
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-[32px] leading-none text-foreground">0</p>
                <p className="mt-2 text-xs text-muted-foreground">Purchased</p>
              </div>
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-[32px] leading-none text-foreground">{activeCount}</p>
                <p className="mt-2 text-xs text-muted-foreground">Active</p>
              </div>
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-[32px] leading-none text-foreground">{demoCount}</p>
                <p className="mt-2 text-xs text-muted-foreground">Demo</p>
              </div>
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-[32px] leading-none text-foreground">{inactiveCount}</p>
                <p className="mt-2 text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
            <AppDataTable
              tableId="settings.business.directory"
              data={SETTINGS_BUSINESS_ROWS}
              columns={columns}
              className="px-0"
              rowHoverAction={() => (
                <button
                  type="button"
                  aria-label="Row actions"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreVertical size={14} strokeWidth={1.6} absoluteStrokeWidth />
                </button>
              )}
              onRowClick={onRowClick}
              hideColumnsButton
              columnSheetOpen={columnSheetOpen}
              onColumnSheetOpenChange={setColumnSheetOpen}
              rowDensity="default"
              initialSorting={[{ id: "businessName", desc: false }]}
            />
          </div>
        ) : (
          <div className="px-6">
            <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
              Reviews tab routing is now active. The full reviews settings surface will be wired next.
            </div>
          </div>
        )}
      </div>
      {isBusinessTab ? (
        <div className="self-start h-full">
          <FilterPane
            title="Filter by"
            open={filterPaneOpen}
            onOpenChange={setFilterPaneOpen}
            initialFilters={initialFilterItems}
            storageKey="settings:business-table:filters"
            motion="static"
            dock="right"
          />
        </div>
      ) : null}
      </div>
    </div>
  );
}

