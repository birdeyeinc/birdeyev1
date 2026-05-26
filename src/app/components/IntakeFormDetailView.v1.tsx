import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge.v1";
import { TextTabsRow } from "@/app/components/ui/text-tabs.v1";
import { Switch } from "@/app/components/ui/switch.v1";
import { Textarea } from "@/app/components/ui/textarea.v1";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/components/ui/select.v1";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { AppDataTable } from "@/app/components/ui/AppDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Copy, Check, ChevronDown, Pencil, ShieldCheck, ClipboardList } from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { toast } from "sonner";
import {
  MOCK_SUBMISSIONS, formatDate, formatDateTime, formatDuration,
  type IntakeForm, type IntakeFormStatus, type IntakeFormSubmission,
} from "./intakeFormsMockData";
import { IntakeFormResponseSheet } from "./IntakeFormResponseSheet";
import {
  MAIN_VIEW_PRIMARY_HEADING_CLASS,
} from "@/app/components/layout/mainViewTitleClasses";

// ─── Types ────────────────────────────────────────────────────────────────────

type DetailTab = "responses" | "settings" | "share";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useCopy(text: string, msg: string) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).catch(() => {});
    toast.success(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return { copied, copy };
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      {children}
    </div>
  );
}

function SectionRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={cn("flex items-start justify-between gap-6 px-6 py-4", !last && "border-b border-border")}>
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-foreground">{label}</span>
      </div>
      <div className="flex-1 max-w-sm">{children}</div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IntakeFormStatus }) {
  if (status === "active")   return <Badge variant="success" className="text-[10px] py-0">Active</Badge>;
  if (status === "draft")    return <Badge variant="warning" className="text-[10px] py-0">Draft</Badge>;
  return <Badge variant="secondary" className="text-[10px] py-0">Inactive</Badge>;
}

// ─── Responses tab ────────────────────────────────────────────────────────────

const colHelper = createColumnHelper<IntakeFormSubmission>();

const submissionColumns = [
  colHelper.accessor("patientName", {
    id: "patientName", header: "Patient name", size: 200, enableSorting: true,
    meta: { settingsLabel: "Patient name" },
    cell: ({ getValue }) => <span className="font-medium text-primary">{getValue()}</span>,
  }),
  colHelper.accessor("submittedOn", {
    id: "submittedOn", header: "Submitted", size: 180, enableSorting: true,
    meta: { settingsLabel: "Submitted" },
    cell: ({ getValue }) => <span className="text-muted-foreground">{formatDateTime(getValue())}</span>,
  }),
  colHelper.accessor("completionTimeSec", {
    id: "completionTimeSec", header: "Completion time", size: 140, enableSorting: true,
    meta: { settingsLabel: "Completion time" },
    cell: ({ getValue }) => <span className="text-muted-foreground">{formatDuration(getValue())}</span>,
  }),
  colHelper.accessor("status", {
    id: "status", header: "Status", size: 100, enableSorting: false,
    meta: { settingsLabel: "Status" },
    cell: ({ getValue }) => {
      const v = getValue();
      return <Badge variant={v === "complete" ? "success" : "warning"} className="text-[10px] py-0 capitalize">{v}</Badge>;
    },
  }),
];

function ResponsesTab({ form }: { form: IntakeForm }) {
  const [sheetOpen, setSheetOpen]   = useState(false);
  const [sheetIdx, setSheetIdx]     = useState(0);

  const submissions = useMemo(
    () => MOCK_SUBMISSIONS.filter((s) => s.formId === form.id),
    [form.id],
  );

  const link = `https://forms.birdeye.com/f/${form.id.replace("if", "a3x")}k2m`;
  const { copy: copyLink } = useCopy(link, "Link copied");

  if (submissions.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
          <ClipboardList className="size-7 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-semibold text-foreground">No submissions yet</span>
          <span className="text-[13px] text-muted-foreground">Share your form link to start collecting patient information.</span>
        </div>
        <Button variant="outline" onClick={copyLink}>
          <Copy className="mr-1.5 size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          Copy link
        </Button>
      </div>
    );
  }

  const avg = Math.round(submissions.reduce((a, s) => a + s.completionTimeSec, 0) / submissions.length);
  const completeRate = Math.round((submissions.filter((s) => s.status === "complete").length / submissions.length) * 100);

  return (
    <>
      {/* Summary strip */}
      <div className="flex items-center gap-6 border-b border-border bg-card px-6 py-4 text-[13px] text-muted-foreground">
        <span><span className="font-semibold text-foreground">{submissions.length}</span> submitted</span>
        <span>·</span>
        <span><span className="font-semibold text-foreground">{completeRate}%</span> completion rate</span>
        <span>·</span>
        <span>avg <span className="font-semibold text-foreground">{formatDuration(avg)}</span></span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 pt-4">
        <AppDataTable
          tableId={`intake-forms.responses.${form.id}`}
          data={submissions}
          columns={submissionColumns}
          initialSorting={[{ id: "submittedOn", desc: true }]}
          getRowId={(row) => row.id}
          persist={false}
          scrollableBody
          onRowClick={(row) => {
            const idx = submissions.findIndex((s) => s.id === row.id);
            setSheetIdx(idx >= 0 ? idx : 0);
            setSheetOpen(true);
          }}
        />
      </div>

      <IntakeFormResponseSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        submission={submissions[sheetIdx] ?? null}
        hasPrev={sheetIdx > 0}
        hasNext={sheetIdx < submissions.length - 1}
        onPrev={() => setSheetIdx((i) => Math.max(0, i - 1))}
        onNext={() => setSheetIdx((i) => Math.min(submissions.length - 1, i + 1))}
      />
    </>
  );
}

// ─── Settings tab ─────────────────────────────────────────────────────────────

const MOCK_LOCATIONS = [
  "All locations",
  "Heart & Vascular Center – Austin",
  "Behavioral Wellness – South Campus",
  "Sunrise Family Medicine – North",
  "Sunrise Family Medicine – South",
  "RehabPlus – North Austin",
];

function SettingsTab({ form }: { form: IntakeForm }) {
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    form.location === "All locations" ? MOCK_LOCATIONS : [form.location],
  );
  const [trigger, setTrigger]     = useState("after_booking");
  const [expiry, setExpiry]       = useState("24h");
  const [confirmation, setConfirmation] = useState("Thank you for completing your intake form. We look forward to seeing you at your appointment.");
  const [notify, setNotify]       = useState(false);

  function toggleLocation(loc: string) {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="flex max-w-2xl flex-col gap-5">

        <SectionCard>
          <SectionRow label="Locations">
            <div className="flex flex-wrap gap-2">
              {MOCK_LOCATIONS.map((loc) => {
                const active = selectedLocations.includes(loc);
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleLocation(loc)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[12px] transition-colors",
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </SectionRow>

          <SectionRow label="When to send">
            <div className="flex flex-col gap-2">
              {[
                ["after_booking",  "After booking confirmed"],
                ["24h_before",     "24 h before appointment"],
                ["on_arrival",     "On arrival (QR scan)"],
              ].map(([val, lbl]) => (
                <label key={val} className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setTrigger(val)}
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border-2 cursor-pointer transition-colors",
                      trigger === val ? "border-primary" : "border-border",
                    )}
                  >
                    {trigger === val && <div className="size-2 rounded-full bg-primary" />}
                  </div>
                  <span className="text-[13px] text-foreground">{lbl}</span>
                </label>
              ))}
            </div>
          </SectionRow>

          <SectionRow label="Link expiry">
            <Select value={expiry} onValueChange={setExpiry}>
              <SelectTrigger className="text-[13px] w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
                <SelectItem value="48h">48 hours</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </SectionRow>

          <SectionRow label="Confirmation message">
            <Textarea
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              rows={3}
              className="text-[13px] resize-none"
              placeholder="Message shown to patient after they submit…"
            />
          </SectionRow>

          <SectionRow label="Notify staff on submission" last>
            <Switch checked={notify} onCheckedChange={setNotify} />
          </SectionRow>
        </SectionCard>

        {/* Compliance info */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3 text-[12px] text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 text-emerald-500" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          <span>HIPAA-compliant delivery · No PHI in URLs · E-signature logged with timestamp</span>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => toast.success("Settings saved")}>Save settings</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Share tab ────────────────────────────────────────────────────────────────

function ShareTab({ form }: { form: IntakeForm }) {
  const link    = `https://forms.birdeye.com/f/${form.id.replace("if", "a3x")}k2m`;
  const snippet = `<script src="https://birdeye.com/embed/intake.js"\n  data-form-id="${form.id.replace("if", "a3x")}k2m"></script>`;
  const { copied: linkCopied, copy: copyLink }       = useCopy(link, "Link copied");
  const { copied: snippetCopied, copy: copySnippet } = useCopy(snippet, "Snippet copied");

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="flex max-w-2xl flex-col gap-6">

        {/* Shareable link */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-emerald-500" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            <span className="text-[12px] text-muted-foreground">HIPAA-safe link — no patient data in URL</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={link}
              className="h-9 flex-1 rounded-[8px] border border-border bg-muted/20 px-3 text-[13px] text-muted-foreground outline-none select-all"
              aria-label="Shareable form link"
            />
            <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0">
              {linkCopied
                ? <Check className="size-3.5 text-emerald-500" strokeWidth={2} aria-hidden />
                : <Copy className="size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />}
              <span className="ml-1.5">{linkCopied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>

        {/* Embed snippet */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-foreground">Embed on your website</span>
          <div className="relative rounded-xl border border-border bg-[#1e1e2e] p-4">
            <pre className="overflow-x-auto text-[12px] text-[#cdd6f4] leading-relaxed">
              {snippet}
            </pre>
            <button
              type="button"
              onClick={copySnippet}
              className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] text-white/70 transition-colors hover:bg-white/20"
            >
              {snippetCopied ? <Check className="size-3" strokeWidth={2} aria-hidden /> : <Copy className="size-3" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />}
              {snippetCopied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* QR code */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-foreground">QR code</span>
          <div className="flex items-center gap-4">
            <div className="flex size-28 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/20 text-[10px] text-muted-foreground">
              QR
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[12px] text-muted-foreground">
                Print or display in your office. Patients scan to open the form on their phone.
              </p>
              <Button variant="outline" size="sm" className="w-fit" onClick={() => toast.success("QR code downloaded")}>
                Download QR
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Main detail view ─────────────────────────────────────────────────────────

export interface IntakeFormDetailViewProps {
  form: IntakeForm;
  allForms: IntakeForm[];
  onBack: () => void;
  onEditInBuilder: () => void;
  onStatusChange: (status: IntakeFormStatus) => void;
  onPreview: () => void;
}

export function IntakeFormDetailView({
  form, onBack, onEditInBuilder, onStatusChange, onPreview,
}: IntakeFormDetailViewProps) {
  const navigate = useNavigate();
  const [tab, setTab]           = useState<DetailTab>("responses");
  const [editingName, setEditingName] = useState(false);
  const [name, setName]         = useState(form.name);

  const tabItems = [
    { id: "responses" as DetailTab, label: "Responses" },
    { id: "settings"  as DetailTab, label: "Settings" },
    { id: "share"     as DetailTab, label: "Share" },
  ];

  const statusMenuItems: { label: string; value: IntakeFormStatus }[] =
    form.status === "draft"    ? [{ label: "Publish",     value: "active" }]
    : form.status === "active" ? [{ label: "Deactivate",  value: "inactive" }]
    :                            [{ label: "Re-activate", value: "active" }];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Breadcrumb band ── */}
      <div className="shrink-0 bg-card px-6 pb-2 pt-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button onClick={() => navigate("/appointments")} className="text-muted-foreground hover:text-foreground transition-colors text-[13px]">
                  Appointments
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors text-[13px]">
                  Intake forms
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[13px]">{name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Header ── */}
      <div className="shrink-0 bg-card px-6 pb-0 pt-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {editingName ? (
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingName(false); }}
                className="h-9 min-w-0 flex-1 rounded-lg border border-primary bg-background px-2 text-[20px] font-semibold text-foreground outline-none"
              />
            ) : (
              <>
                <h1 className={cn(MAIN_VIEW_PRIMARY_HEADING_CLASS, "truncate")}>{name}</h1>
                <button
                  type="button"
                  onClick={() => setEditingName(true)}
                  className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Edit form name"
                >
                  <Pencil className="size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </button>
              </>
            )}

            {/* Status badge + dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-1 rounded-full transition-colors hover:opacity-80" aria-label="Change status">
                  <StatusBadge status={form.status} />
                  <ChevronDown className="size-3 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {statusMenuItems.map(({ label, value }) => (
                  <DropdownMenuItem key={value} onClick={() => onStatusChange(value)}>{label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" onClick={onPreview}>Preview</Button>
            <Button size="sm" onClick={onEditInBuilder}>
              <Pencil className="mr-1.5 size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
              Edit form
            </Button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="mt-4">
          <TextTabsRow<DetailTab> items={tabItems} value={tab} onChange={setTab} />
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {tab === "responses" && <ResponsesTab form={form} />}
        {tab === "settings"  && <SettingsTab  form={form} />}
        {tab === "share"     && <ShareTab     form={form} />}
      </div>
    </div>
  );
}
