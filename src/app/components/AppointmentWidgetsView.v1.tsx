import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Search, CircleAlert } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { AppDataTable } from "@/app/components/ui/AppDataTable";
import { AppDataTableColumnSettingsTrigger } from "@/app/components/ui/AppDataTableColumnSettingsTrigger";
import { Button } from "@/app/components/ui/button";
import { AppointmentWidgetDetailView } from "@/app/components/AppointmentWidgetDetailView.v1";
import { APP_DATA_TABLE_PRIMARY_ROW_LABEL_CLASS } from "@/app/components/ui/appDataTableCellClasses";

interface AppointmentWidget {
  id: string;
  name: string;
  location?: string;
  hasWarning: boolean;
  createdBy: string;
  createdOn: string; // ISO yyyy-mm-dd
}

const WIDGETS: AppointmentWidget[] = [
  { id: "w1",  name: "Primary Care Booking",          location: "All locations",                        hasWarning: false, createdBy: "Shivam Kumar",      createdOn: "2026-04-27" },
  { id: "w2",  name: "Cardiology New Patient",        location: "Heart & Vascular Center – Austin",     hasWarning: true,  createdBy: "Naveen Suravarpu",  createdOn: "2026-04-17" },
  { id: "w3",  name: "Pediatric Wellness Visit",      location: "3 locations",                          hasWarning: false, createdBy: "KOushal Goyal",     createdOn: "2026-04-16" },
  { id: "w4",  name: "Dermatology Consult",           location: "Skin Health Clinic – Round Rock",      hasWarning: true,  createdBy: "Ramnish Sharma",    createdOn: "2026-04-07" },
  { id: "w5",  name: "Orthopedic Follow-up",          location: "5 locations",                          hasWarning: false, createdBy: "Gauri Rani",        createdOn: "2026-04-07" },
  { id: "w6",  name: "Mental Health Intake",          location: "Behavioral Wellness – South Campus",   hasWarning: true,  createdBy: "Manav Subramanian", createdOn: "2026-03-12" },
  { id: "w7",  name: "OB/GYN Annual Exam",            location: "2 locations",                          hasWarning: false, createdBy: "Vaishali Grover",   createdOn: "2026-03-09" },
  { id: "w8",  name: "Urgent Care Walk-in",           location: "All locations",                        hasWarning: false, createdBy: "Abha singh",        createdOn: "2026-03-05" },
  { id: "w9",  name: "Physical Therapy Eval",         location: "RehabPlus – North Austin",             hasWarning: false, createdBy: "Balaji K",          createdOn: "2026-02-24" },
  { id: "w10", name: "Telehealth Visit",              location: "4 locations",                          hasWarning: true,  createdBy: "noor shan",         createdOn: "2026-02-08" },
  { id: "w11", name: "Annual Physical – North",       location: "Sunrise Family Medicine – North",      hasWarning: false, createdBy: "Priya Nair",        createdOn: "2026-01-30" },
  { id: "w12", name: "Annual Physical – South",       location: "Sunrise Family Medicine – South",      hasWarning: false, createdBy: "Priya Nair",        createdOn: "2026-01-30" },
  { id: "w13", name: "Annual Physical – East",        location: "Sunrise Family Medicine – East",       hasWarning: false, createdBy: "Priya Nair",        createdOn: "2026-01-30" },
  { id: "w14", name: "Neurology New Patient",         location: "All locations",                        hasWarning: true,  createdBy: "James Osei",        createdOn: "2026-01-15" },
  { id: "w15", name: "Sports Medicine Eval",          location: "3 locations",                          hasWarning: false, createdBy: "Ethan Park",        createdOn: "2026-01-08" },
  { id: "w16", name: "Diabetes Management",           location: "Endocrine & Diabetes Center",          hasWarning: true,  createdBy: "Ana Alvarado",      createdOn: "2025-12-20" },
  { id: "w17", name: "Post-Op Follow-up",             location: "5 locations",                          hasWarning: false, createdBy: "Marcus Webb",       createdOn: "2025-12-12" },
  { id: "w18", name: "Allergy & Immunology",          location: "AllergyFirst – Cedar Park",            hasWarning: false, createdBy: "Diana Cruz",        createdOn: "2025-11-28" },
  { id: "w19", name: "Chiropractic Adjustment",       location: "2 locations",                          hasWarning: true,  createdBy: "Ben Foster",        createdOn: "2025-11-14" },
  { id: "w20", name: "Ophthalmology Screening",       location: "ClearVision Eye Center – Downtown",    hasWarning: false, createdBy: "Emily Harrison",    createdOn: "2025-11-03" },
];

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

const colHelper = createColumnHelper<AppointmentWidget>();

const columns = [
  colHelper.accessor("name", {
    id: "name",
    header: "Widget name",
    size: 300,
    enableSorting: true,
    meta: { settingsLabel: "Widget name" },
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className={APP_DATA_TABLE_PRIMARY_ROW_LABEL_CLASS}>{row.original.name}</span>
        {row.original.hasWarning && (
          <CircleAlert
            className="size-3.5 shrink-0 text-orange-500"
            strokeWidth={1.6}
            absoluteStrokeWidth
            aria-label="Configuration warning"
          />
        )}
      </div>
    ),
  }),
  colHelper.accessor("location", {
    id: "location",
    header: "Location",
    size: 260,
    enableSorting: false,
    meta: { settingsLabel: "Location" },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() ?? "—"}</span>
    ),
  }),
  colHelper.accessor("createdBy", {
    id: "createdBy",
    header: "Created by",
    size: 200,
    enableSorting: false,
    meta: { settingsLabel: "Created by" },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
  }),
  colHelper.accessor("createdOn", {
    id: "createdOn",
    header: "Created on",
    size: 160,
    enableSorting: true,
    meta: { settingsLabel: "Created on" },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{formatDate(getValue())}</span>
    ),
  }),
];

const WIDGETS_PATH_PREFIX = "/appointments/settings/widgets/";

export function AppointmentWidgetsView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [columnSheetOpen, setColumnSheetOpen] = useState(false);

  // Sub-route: /appointments/settings/widgets/:id → detail view
  const widgetId = location.pathname.startsWith(WIDGETS_PATH_PREFIX)
    ? location.pathname.slice(WIDGETS_PATH_PREFIX.length)
    : null;

  const filtered = useMemo(() => {
    if (!search.trim()) return WIDGETS;
    const q = search.trim().toLowerCase();
    return WIDGETS.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.createdBy.toLowerCase().includes(q) ||
        (w.location ?? "").toLowerCase().includes(q),
    );
  }, [search]);

  if (widgetId) {
    const widget = WIDGETS.find((w) => w.id === widgetId) ?? WIDGETS[0];
    return (
      <AppointmentWidgetDetailView
        widget={widget}
        onBack={() => navigate("/appointments/settings/widgets")}
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MainCanvasViewHeader
        title={`${WIDGETS.length} Appointment widgets`}
        actions={
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="relative h-[var(--button-height)] w-[min(100%,240px)] min-w-[200px] shrink">
                <Search
                  className="pointer-events-none absolute top-1/2 left-2 size-[14px] -translate-y-1/2 text-[#303030] dark:text-muted-foreground"
                  strokeWidth={1.6}
                  absoluteStrokeWidth
                  aria-hidden
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => {
                    if (search === "") setSearchOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearch("");
                      setSearchOpen(false);
                    }
                  }}
                  autoFocus
                  placeholder="Search widgets"
                  className="h-full w-full rounded-[8px] border border-[#e5e9f0] bg-white py-0 pr-2 pl-8 text-[14px] text-[#212121] outline-none transition-colors placeholder:text-[#757575] focus:border-[#2552ED] focus:ring-1 focus:ring-[#2552ED] dark:border-border dark:bg-muted dark:text-foreground dark:placeholder:text-[#8b92a5]"
                  aria-label="Search widgets"
                />
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open search"
                title="Search widgets"
                onClick={() => setSearchOpen(true)}
              >
                <Search
                  className="size-[14px] text-[#303030] dark:text-muted-foreground"
                  strokeWidth={1.6}
                  absoluteStrokeWidth
                  aria-hidden
                />
              </Button>
            )}
            <AppDataTableColumnSettingsTrigger
              sheetTitle="Widget columns"
              onClick={() => setColumnSheetOpen(true)}
            />
            <Button type="button" variant="default">
              Create widget
            </Button>
          </div>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-border bg-background">
          <AppDataTable
            tableId="appointments.widgets"
            data={filtered}
            columns={columns}
            initialSorting={[{ id: "createdOn", desc: true }]}
            getRowId={(row) => row.id}
            persist={false}
            columnSheetTitle="Widget columns"
            className="min-h-0 min-w-0 flex-1 px-0"
            scrollableBody
            hideColumnsButton
            columnSheetOpen={columnSheetOpen}
            onColumnSheetOpenChange={setColumnSheetOpen}
            onRowClick={(row) => navigate(`${WIDGETS_PATH_PREFIX}${row.id}`)}
          />
        </div>
      </div>
    </div>
  );
}
