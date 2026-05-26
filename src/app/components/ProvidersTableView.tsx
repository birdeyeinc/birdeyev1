import { useState, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Separator } from "@/app/components/ui/separator";
import { AppDataTable } from "@/app/components/ui/AppDataTable";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { Sheet, SheetContent } from "@/app/components/ui/sheet";
import {
  FLOATING_SHEET_FRAME_CONTENT_CLASS,
  FloatingSheetFrame,
} from "@/app/components/layout/FloatingSheetFrame";
import { Eye } from "lucide-react";
import {
  Tooltip, TooltipContent,
  TooltipProvider, TooltipTrigger,
} from "@/app/components/ui/tooltip";

/* ─── Types ─── */
type ProviderStatus = "active" | "inactive" | "temporarily_disabled";
type BookingRule    = "auto_book" | "offer_and_confirm" | "transfer_to_staff";

interface ApptType {
  name:            string;
  durationMinutes: number;
  newPatients:     boolean;
  bookingRule:     BookingRule;
}

interface Provider {
  id:          string;
  name:        string;
  specialty:   string;
  npi:         string;
  locations:   string[];
  apptTypes:   ApptType[];
  ehrSync:     boolean;
  status:      ProviderStatus;
  statusNote:  string | null;
}

/* ─── Data ─── */
const PROVIDERS: Provider[] = [
  {
    id: "p1", name: "Dr. Sarah Patel, MD", specialty: "Family Medicine", npi: "1234567890",
    locations: ["Main Clinic", "North Branch", "Telehealth Hub"],
    apptTypes: [
      { name: "New Patient Consult",       durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",           durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Annual Physical",           durationMinutes: 45, newPatients: true,  bookingRule: "auto_book" },
      { name: "Telehealth Visit",          durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Urgent Care Visit",         durationMinutes: 15, newPatients: true,  bookingRule: "transfer_to_staff" },
      { name: "Chronic Disease Management",durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
    ],
    ehrSync: true, status: "active", statusNote: null,
  },
  {
    id: "p2", name: "Dr. Marcus Johnson, DO", specialty: "Internal Medicine", npi: "2345678901",
    locations: ["Main Clinic", "Downtown Office"],
    apptTypes: [
      { name: "New Patient Consult",       durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",           durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Annual Physical",           durationMinutes: 45, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Telehealth Visit",          durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Chronic Disease Management",durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Procedure Consult",         durationMinutes: 45, newPatients: false, bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, status: "active", statusNote: null,
  },
  {
    id: "p3", name: "Dr. Yuki Tanaka, MD", specialty: "Cardiology", npi: "3456789012",
    locations: ["Main Clinic", "South Campus"],
    apptTypes: [
      { name: "New Patient Consult",  durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",      durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Telehealth Visit",     durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Echocardiogram Review",durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Procedure Consult",    durationMinutes: 45, newPatients: false, bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, status: "active", statusNote: null,
  },
  {
    id: "p4", name: "Dr. Emily Rodriguez, MD", specialty: "Pediatrics", npi: "4567890123",
    locations: ["North Branch", "Main Clinic", "Telehealth Hub"],
    apptTypes: [
      { name: "New Patient Consult",durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Well-Child Visit",   durationMinutes: 30, newPatients: true,  bookingRule: "auto_book" },
      { name: "Immunization Only",  durationMinutes: 15, newPatients: true,  bookingRule: "auto_book" },
      { name: "Sports Physical",    durationMinutes: 20, newPatients: true,  bookingRule: "auto_book" },
      { name: "Telehealth Visit",   durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Follow-up Visit",    durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
    ],
    ehrSync: true, status: "active", statusNote: null,
  },
  {
    id: "p5", name: "Dr. James Okafor, MD", specialty: "Orthopedic Surgery", npi: "5678901234",
    locations: ["South Campus", "Main Clinic"],
    apptTypes: [
      { name: "New Patient Consult",    durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",        durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Pre-operative Consult",  durationMinutes: 45, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Post-operative Follow-up",durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Joint Injection",        durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
    ],
    ehrSync: false, status: "temporarily_disabled", statusNote: "Credentialing pending — est. May 20, 2026",
  },
  {
    id: "p6", name: "Dr. Priya Nair, MD", specialty: "OB/GYN", npi: "6789012345",
    locations: ["Downtown Office", "Main Clinic", "Telehealth Hub"],
    apptTypes: [
      { name: "New Patient Consult",durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Prenatal Visit",     durationMinutes: 30, newPatients: true,  bookingRule: "auto_book" },
      { name: "Follow-up Visit",    durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Annual Physical",    durationMinutes: 45, newPatients: true,  bookingRule: "auto_book" },
      { name: "Telehealth Visit",   durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Procedure Consult",  durationMinutes: 45, newPatients: false, bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, status: "active", statusNote: null,
  },
  {
    id: "p7", name: "Dr. Fatima Al-Hassan, MD", specialty: "Psychiatry", npi: "0123456789",
    locations: ["Main Clinic", "Telehealth Hub"],
    apptTypes: [
      { name: "Initial Psychiatric Evaluation",durationMinutes: 60, newPatients: true,  bookingRule: "transfer_to_staff" },
      { name: "Medication Management",         durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Mental Health Check-in",        durationMinutes: 30, newPatients: false, bookingRule: "transfer_to_staff" },
      { name: "Telehealth Visit",              durationMinutes: 30, newPatients: false, bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, status: "active", statusNote: null,
  },
  {
    id: "p8", name: "Dr. Lisa Kowalski, MD", specialty: "Internal Medicine", npi: "2233445566",
    locations: ["Main Clinic"],
    apptTypes: [
      { name: "Follow-up Visit",           durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Telehealth Visit",          durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Chronic Disease Management",durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
    ],
    ehrSync: false, status: "inactive", statusNote: "No longer accepting new patients at this location",
  },
];

/* ─── Config maps ─── */
const STATUS_LABEL: Record<ProviderStatus, string> = {
  active: "Active", inactive: "Inactive", temporarily_disabled: "Disabled",
};
const STATUS_CLASS: Record<ProviderStatus, string> = {
  active:               "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  inactive:             "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400",
  temporarily_disabled: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};
const BOOKING_LABEL: Record<BookingRule, string> = {
  auto_book: "Auto-book", offer_and_confirm: "Confirm", transfer_to_staff: "Transfer",
};
const BOOKING_CLASS: Record<BookingRule, string> = {
  auto_book:         "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  offer_and_confirm: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  transfer_to_staff: "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400",
};

/* ─── Helpers ─── */
function getInitials(name: string) {
  const clean = name.replace(/^Dr\.\s*/, "").replace(/,.*/, "").trim().split(/\s+/);
  return clean.length === 1 ? clean[0].slice(0, 2).toUpperCase()
    : (clean[0][0] + clean[clean.length - 1][0]).toUpperCase();
}
function photoUrl(id: string, size = 40) {
  const n = ((parseInt(id.replace(/\D/g, "") || "1", 10) - 1) % 70) + 1;
  return `https://i.pravatar.cc/${size}?img=${n}`;
}

/* ─── Detail drawer ─── */
function ProviderDetail({ p, onClose }: { p: Provider; onClose: () => void }) {
  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right" inset="floating" floatingSize="md" className={FLOATING_SHEET_FRAME_CONTENT_CLASS}>
        <FloatingSheetFrame title="Quick view"
          footer={<Button type="button" className="w-full" onClick={onClose}>Close</Button>}
        >
          <div className="flex flex-col gap-6 py-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="size-20 border border-border">
                <AvatarImage src={photoUrl(p.id, 80)} alt={p.name} />
                <AvatarFallback className="bg-primary/15 text-lg font-medium text-primary">{getInitials(p.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-1">
                <p className="text-center text-lg font-medium text-foreground">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.specialty}</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <Badge variant="outline" className={STATUS_CLASS[p.status]}>{STATUS_LABEL[p.status]}</Badge>
                <Badge variant="outline" className={p.ehrSync
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-slate-50 text-slate-500 dark:bg-slate-800/40"}>
                  {p.ehrSync ? "EHR Synced" : "Sync Off"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Core fields */}
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">NPI <span className="text-muted-foreground/60">(read-only · EHR)</span></dt>
                <dd className="font-mono text-xs text-foreground">{p.npi}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground">Location(s)</dt>
                {p.locations.map(l => <dd key={l} className="text-foreground">{l}</dd>)}
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">EHR schedule sync</dt>
                <dd className="text-foreground">{p.ehrSync ? "Live-synced from EHR" : "Not synced"}</dd>
              </div>
              {p.statusNote && (
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-muted-foreground">Status note</dt>
                  <dd className="text-foreground">{p.statusNote}</dd>
                </div>
              )}
            </dl>

            <Separator />

            {/* Appointment types */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-foreground">Appointment types ({p.apptTypes.length})</p>
              {p.apptTypes.map(apt => (
                <div key={apt.name} className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-foreground">{apt.name}</p>
                    <Badge variant="outline" className={`${BOOKING_CLASS[apt.bookingRule]} text-[11px] shrink-0`}>
                      {BOOKING_LABEL[apt.bookingRule]}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    <span>{apt.durationMinutes} min</span>
                    <span>{apt.newPatients ? "New patients ✓" : "Existing only"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FloatingSheetFrame>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Column helper ─── */
const col = createColumnHelper<Provider>();

/* ─── Main view ─── */
export function ProvidersTableView() {
  const [selected, setSelected] = useState<Provider | null>(null);

  const columns = useMemo(() => [
    col.accessor("name", {
      id: "name", header: "Provider", meta: { settingsLabel: "Provider" }, size: 1, minSize: 100,
      cell: (info) => {
        const p = info.row.original;
        return (
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="size-7 shrink-0">
              <AvatarImage src={photoUrl(p.id)} alt={p.name} />
              <AvatarFallback className="bg-primary/15 text-[10px] font-medium text-primary">{getInitials(p.name)}</AvatarFallback>
            </Avatar>
            <span className="truncate text-foreground">{p.name}</span>
          </div>
        );
      },
    }),
    col.accessor("specialty", {
      id: "specialty", header: "Specialty", meta: { settingsLabel: "Specialty" }, size: 1, minSize: 80,
      cell: (info) => <span className="truncate text-foreground">{info.getValue()}</span>,
    }),
    col.accessor("npi", {
      id: "npi", header: "NPI", meta: { settingsLabel: "NPI" }, size: 1, minSize: 70,
      cell: (info) => <span className="font-mono text-[13px] text-foreground">{info.getValue()}</span>,
    }),
    col.accessor("locations", {
      id: "locations", header: "Location", meta: { settingsLabel: "Location" }, size: 1, minSize: 70,
      cell: (info) => {
        const locs = info.getValue();
        return <span className="truncate text-foreground">{locs.length === 1 ? locs[0] : `${locs.length} locations`}</span>;
      },
    }),
    col.accessor("apptTypes", {
      id: "apptTypes", header: "Appt types", meta: { settingsLabel: "Appt types" }, size: 1, minSize: 60,
      cell: (info) => <span className="text-foreground">{info.getValue().length} types</span>,
    }),
    col.accessor("ehrSync", {
      id: "ehrSync", header: "EHR sync", meta: { settingsLabel: "EHR sync" }, size: 1, minSize: 60,
      cell: (info) => <span className="text-foreground">{info.getValue() ? "Yes" : "No"}</span>,
    }),
    col.accessor("status", {
      id: "status", header: "Status", meta: { settingsLabel: "Status" }, size: 1, minSize: 70, enableResizing: false,
      cell: (info) => (
        <Badge variant="outline" className={STATUS_CLASS[info.getValue()]}>
          {STATUS_LABEL[info.getValue()]}
        </Badge>
      ),
    }),
    col.display({
      id: "actions", header: "", size: 60, minSize: 52, maxSize: 72,
      enableSorting: false, enableResizing: false, enableHiding: false,
      cell: (info) => (
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center justify-end pr-1 opacity-0 group-hover/table-row:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonVariants({ variant: "outline", size: "icon" })}
                  onClick={(e) => { e.stopPropagation(); setSelected(info.row.original); }}
                >
                  <Eye className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Quick View</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    }),
  ] as Parameters<typeof AppDataTable>[0]["columns"], []);

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <MainCanvasViewHeader
        title="Providers"
        description="Manage providers and their availability for upcoming appointments."
        actions={<Button type="button">Add provider</Button>}
      />
      <div className="min-h-0 flex-1 flex flex-col">
        <AppDataTable<Provider>
          scrollableBody
          tableId="providers.table.v1"
          persist={false}
          data={PROVIDERS}
          columns={columns}
          initialSorting={[{ id: "name", desc: false }]}
          getRowId={(r) => r.id}
          onRowClick={(r) => setSelected(r)}
          className="min-w-0"
          rowDensity="medium"
          hideColumnsButton
        />
      </div>
      {selected && (
        <ProviderDetail key={selected.id} p={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
