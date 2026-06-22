import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { toast } from "sonner";
import {
  Pencil,
  Copy,
  Check,
  CircleAlert,
  HelpCircle,
  Monitor,
  Smartphone,
  Maximize2,
  GripVertical,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { TextTabsRow } from "@/app/components/ui/text-tabs";
import { SegmentedToggle } from "@/app/components/ui/segmented-toggle";
import {
  MAIN_VIEW_PRIMARY_HEADING_CLASS,
  MAIN_VIEW_SUBHEADING_CLASS,
} from "@/app/components/layout/mainViewTitleClasses";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppointmentWidgetForDetail {
  id: string;
  name: string;
  location?: string;
  hasWarning: boolean;
  createdBy: string;
  createdOn: string;
}

export type WidgetDetailTab = "install" | "appearance" | "configuration" | "preferences";

interface AppointmentWidgetDetailViewProps {
  widget: AppointmentWidgetForDetail;
  defaultTab?: WidgetDetailTab;
  onBack: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useCopy(text: string, successMsg: string) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).catch(() => {});
    toast.success(successMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return { copied, copy };
}

// ─── Mock preview widget ──────────────────────────────────────────────────────

type PreviewDevice = "desktop" | "mobile";

function WidgetPreviewPane({
  colors,
}: {
  colors: { bgColor: string; textColor: string; btnColor: string; btnTextColor: string };
}) {
  const [device, setDevice] = useState<PreviewDevice>("desktop");

  const calDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  // A simple 5-row × 7-col mock calendar, offset by 3 (May 2026 starts Thursday)
  const offset = 3;
  const totalCells = 35;

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-foreground">Preview</span>
        <div className="flex items-center gap-1">
          {(
            [
              { id: "desktop" as const, Icon: Monitor, label: "Desktop" },
              { id: "mobile" as const, Icon: Smartphone, label: "Mobile" },
            ] as const
          ).map(({ id, Icon, label }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              title={label}
              onClick={() => setDevice(id)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                device === id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={14} strokeWidth={1.6} absoluteStrokeWidth />
            </button>
          ))}
          <button
            type="button"
            aria-label="Expand"
            title="Expand"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <Maximize2 size={14} strokeWidth={1.6} absoluteStrokeWidth />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "rounded-lg border border-border overflow-hidden shadow-sm",
          device === "mobile" ? "max-w-[280px]" : "w-full",
        )}
        style={{ backgroundColor: colors.bgColor }}
      >
        {/* Logo row */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border/50">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
            <span className="text-[9px] font-semibold text-primary">B</span>
          </div>
          <span className="text-[11px] font-medium" style={{ color: colors.textColor }}>
            Birdeye
          </span>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <p className="text-[11px] font-semibold mb-0.5" style={{ color: colors.textColor }}>
            Schedule a visit
          </p>
          <p className="text-[9px] text-muted-foreground mb-3 leading-relaxed">
            Please schedule a visit below and one of our team members will reach out to you shortly.
          </p>

          {/* Calendar header */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-medium" style={{ color: colors.textColor }}>
              May 2026
            </span>
            <div className="flex gap-1">
              <button className="h-3 w-3 rounded text-muted-foreground hover:text-foreground text-[8px]">‹</button>
              <button className="h-3 w-3 rounded text-muted-foreground hover:text-foreground text-[8px]">›</button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-px mb-px">
            {calDays.map((d) => (
              <div key={d} className="text-center text-[7px] text-muted-foreground py-0.5">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: totalCells }).map((_, i) => {
              const day = i - offset + 1;
              const isValid = day >= 1 && day <= 31;
              const isHighlighted = isValid && [5, 6, 12, 13, 19, 20].includes(day);
              const isSelected = day === 14;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-center text-[7px] h-4 rounded-sm",
                    !isValid && "opacity-0",
                    isSelected && "text-white rounded-full",
                    !isSelected && isHighlighted && "text-muted-foreground",
                    !isSelected && !isHighlighted && isValid && "text-muted-foreground/50",
                  )}
                  style={isSelected ? { backgroundColor: colors.btnColor } : undefined}
                >
                  {isValid ? day : ""}
                </div>
              );
            })}
          </div>

          {/* Next button */}
          <button
            className="mt-3 w-full rounded-md py-1 text-[9px] font-medium"
            style={{ backgroundColor: colors.btnColor, color: colors.btnTextColor }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Install tab ──────────────────────────────────────────────────────────────

function InstallTab({ widget }: { widget: AppointmentWidgetForDetail }) {
  const bookingUrl = `https://birdeye.com/appointments/149546071353527/${widget.id}`;
  const embedCode = `<script defer type="text/javascript" src="https://birdeye.com/appointments/embedScript/149546071353527/${widget.id}/bf-revz-widget-149546071353527"></script><div id="bf-appmt-149546071353527"></div>`;

  const urlCopy = useCopy(bookingUrl, "URL copied to clipboard");
  const codeCopy = useCopy(embedCode, "Embed code copied to clipboard");

  const [gaEnabled, setGaEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-0 overflow-y-auto flex-1 px-6 py-6">
      {/* Section 1 — Booking link */}
      <div className="flex flex-col gap-4 py-6 border-b border-border first:pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-foreground">Appointment booking link</p>
            <p className={cn(MAIN_VIEW_SUBHEADING_CLASS, "mt-1")}>
              Embed the appointment URL on your website as well as on Google, Facebook, and other
              platforms.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label="Copy URL"
            onClick={urlCopy.copy}
          >
            {urlCopy.copied ? (
              <Check size={13} strokeWidth={1.6} absoluteStrokeWidth />
            ) : (
              <Copy size={13} strokeWidth={1.6} absoluteStrokeWidth />
            )}
          </Button>
        </div>
        <div className="rounded-md border border-border bg-muted px-4 py-2.5">
          <p className="text-[13px] font-mono text-muted-foreground break-all">{bookingUrl}</p>
        </div>
      </div>

      {/* Section 2 — Install widget */}
      <div className="flex flex-col gap-4 py-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-foreground">
              Install appointment widget to your website
              <span className="text-muted-foreground font-normal">
                {" "}(only needed if widget is embedded as an iframe)*
              </span>
            </p>
            <p className={cn(MAIN_VIEW_SUBHEADING_CLASS, "mt-1")}>
              Copy and paste the code to the HTML in your website
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label="Copy embed code"
            onClick={codeCopy.copy}
          >
            {codeCopy.copied ? (
              <Check size={13} strokeWidth={1.6} absoluteStrokeWidth />
            ) : (
              <Copy size={13} strokeWidth={1.6} absoluteStrokeWidth />
            )}
          </Button>
        </div>
        <div className="rounded-md border border-border bg-muted px-4 py-3">
          <pre className="text-[12px] font-mono text-muted-foreground whitespace-pre-wrap break-all">
            {embedCode}
          </pre>
        </div>
      </div>

      {/* Section 3 — Google Analytics */}
      <div className="flex items-center justify-between gap-4 py-6 border-b border-border">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-foreground">Google Analytics</p>
          <p className={cn(MAIN_VIEW_SUBHEADING_CLASS, "mt-1")}>
            Track page views and events on your booking page with Google Analytics.{" "}
            <a
              href="#"
              className="text-primary hover:underline focus-visible:underline outline-none"
              onClick={(e) => e.preventDefault()}
            >
              Find your tracking ID
            </a>
          </p>
        </div>
        <Switch
          checked={gaEnabled}
          onCheckedChange={setGaEnabled}
          aria-label="Enable Google Analytics"
        />
      </div>

      {/* Section 4 — Advanced Analytics */}
      <div className="flex flex-col gap-1 py-6">
        <p className="text-[13px] font-medium text-foreground">Advanced Analytics</p>
        <p className={cn(MAIN_VIEW_SUBHEADING_CLASS, "mt-1")}>
          Integrate with Google Tag Manager, Adobe Analytics, and more.{" "}
          <a
            href="#"
            className="text-primary hover:underline focus-visible:underline outline-none"
            onClick={(e) => e.preventDefault()}
          >
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Appearance tab ───────────────────────────────────────────────────────────

type ColorKey = "calBg" | "calText" | "btnColor" | "btnText" | "linkColor";

const COLOR_FIELDS: { key: ColorKey; label: string; defaultValue: string }[] = [
  { key: "calBg",     label: "Calendar background color", defaultValue: "#FFFFFF" },
  { key: "calText",   label: "Calendar text color",        defaultValue: "#000000" },
  { key: "btnColor",  label: "Button color",               defaultValue: "#1976D2" },
  { key: "btnText",   label: "Button text color",          defaultValue: "#FFFFFF" },
  { key: "linkColor", label: "Link color",                 defaultValue: "#1976D2" },
];

function AppearanceTab() {
  const [colors, setColors] = useState<Record<ColorKey, string>>({
    calBg:     "#FFFFFF",
    calText:   "#000000",
    btnColor:  "#1976D2",
    btnText:   "#FFFFFF",
    linkColor: "#1976D2",
  });
  const [diffHeaders, setDiffHeaders] = useState(false);

  function setColor(key: ColorKey, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  const previewColors = {
    bgColor:      colors.calBg,
    textColor:    colors.calText,
    btnColor:     colors.btnColor,
    btnTextColor: colors.btnText,
  };

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Left — settings */}
      <div className="flex flex-col gap-1 overflow-y-auto px-6 py-6 w-[460px] shrink-0 border-r border-border">
        <div className="rounded-lg border border-border bg-card px-6 py-5 flex flex-col gap-1">
          <p className={MAIN_VIEW_PRIMARY_HEADING_CLASS}>Widget styling</p>
          <p className={cn(MAIN_VIEW_SUBHEADING_CLASS, "mb-4")}>
            Customize the widget to match your brand colors.
          </p>

          {COLOR_FIELDS.map((field, idx) => (
            <div
              key={field.key}
              className={cn(
                "flex items-center justify-between py-3",
                idx < COLOR_FIELDS.length - 1 && "border-b border-border",
              )}
            >
              <span className="text-[13px] text-foreground">{field.label}</span>
              {/* Swatch + hex input combined pill — click swatch to open native picker */}
              <label className="flex h-9 cursor-pointer items-center overflow-hidden rounded-lg border border-border bg-background transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                <span className="relative flex h-full w-9 shrink-0 items-center justify-center">
                  <span
                    className="h-5 w-5 rounded-sm border border-border/60"
                    style={{ backgroundColor: colors[field.key] }}
                  />
                  <input
                    type="color"
                    value={colors[field.key]}
                    onChange={(e) => setColor(field.key, e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label={`${field.label} color picker`}
                  />
                </span>
                <span className="h-full w-px bg-border" />
                <input
                  type="text"
                  value={colors[field.key]}
                  onChange={(e) => setColor(field.key, e.target.value)}
                  maxLength={7}
                  className="h-full w-[88px] bg-transparent px-2.5 text-[13px] font-mono text-foreground outline-none"
                  aria-label={`${field.label} hex value`}
                />
              </label>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-4">
            <Checkbox
              id="diff-headers"
              checked={diffHeaders}
              onCheckedChange={(v) => setDiffHeaders(v === true)}
            />
            <label
              htmlFor="diff-headers"
              className="text-[13px] text-foreground cursor-pointer select-none"
            >
              Use different headers for each location
            </label>
          </div>
        </div>
      </div>

      {/* Right — preview */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
        <WidgetPreviewPane colors={previewColors} />
      </div>
    </div>
  );
}

// ─── Configuration tab ────────────────────────────────────────────────────────

const FORM_FIELDS_DATA = [
  { icon: "T|", label: "First name", required: true,  hasToggle: false },
  { icon: "T|", label: "Last name",  required: false, hasToggle: false },
  { icon: "12", label: "Phone number", required: true, hasToggle: false },
  { icon: "T|", label: "Email",      required: true,  hasToggle: false },
  { icon: "⊙",  label: "Payment method", required: true, hasToggle: true },
];

function ConfigurationTab() {
  const [bookingHeader,   setBookingHeader]   = useState("Schedule a visit");
  const [bookingDesc,     setBookingDesc]     = useState(
    "Please schedule a visit below and one of our team members will reach out to you shortly.",
  );
  const [confirmHeader,   setConfirmHeader]   = useState("Thank you for your booking");
  const [confirmDesc,     setConfirmDesc]     = useState(
    "We'll send you an appointment confirmation via text and email shortly.",
  );
  const [customerHeader,  setCustomerHeader]  = useState("Customer information");
  const [allowUnintegrated, setAllowUnintegrated] = useState(false);
  const [formTab,   setFormTab]   = useState<"myself" | "someone-else">("myself");
  const [paymentOn, setPaymentOn] = useState(false);
  const [slotCount, setSlotCount] = useState("12");
  const [slotUnit,  setSlotUnit]  = useState("months");
  const [advanceCount, setAdvanceCount] = useState("1");
  const [advanceUnit,  setAdvanceUnit]  = useState("day");

  const previewColors = {
    bgColor:      "#FFFFFF",
    textColor:    "#000000",
    btnColor:     "#1976D2",
    btnTextColor: "#FFFFFF",
  };

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Left — settings */}
      <div className="flex flex-col gap-6 overflow-y-auto px-6 py-6 w-[460px] shrink-0 border-r border-border">
        {/* Widget title and description */}
        <div className="rounded-lg border border-border bg-card px-6 py-5 flex flex-col gap-0">
          <p className={cn(MAIN_VIEW_PRIMARY_HEADING_CLASS, "mb-1")}>Widget title and description</p>

          {[
            { label: "Booking page header", required: true,  value: bookingHeader,   set: setBookingHeader,  multi: false },
            { label: "Booking page description", required: false, value: bookingDesc, set: setBookingDesc,   multi: true  },
            { label: "Confirmation page header", required: true,  value: confirmHeader,  set: setConfirmHeader,  multi: false },
            { label: "Confirmation page description", required: true, value: confirmDesc, set: setConfirmDesc, multi: true  },
            { label: "Customer information header", required: true, value: customerHeader, set: setCustomerHeader, multi: false },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-1.5 py-3 border-b border-border last:border-b-0">
              <label className="text-[13px] text-foreground">
                {f.label}
                {f.required && <span className="text-destructive ml-0.5">*</span>}
              </label>
              {f.multi ? (
                <Textarea
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  rows={2}
                  className="text-[13px]"
                />
              ) : (
                <Input
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="text-[13px]"
                />
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-3">
            <span className="text-[13px] text-foreground">
              Allow customers to choose service providers at unintegrated locations
            </span>
            <Switch
              checked={allowUnintegrated}
              onCheckedChange={setAllowUnintegrated}
              aria-label="Allow unintegrated locations"
            />
          </div>
        </div>

        {/* Form fields */}
        <div className="rounded-lg border border-border bg-card px-6 py-5 flex flex-col gap-3">
          <p className={MAIN_VIEW_PRIMARY_HEADING_CLASS}>Form fields</p>
          <SegmentedToggle
            items={[
              { value: "myself",      label: "Myself" },
              { value: "someone-else", label: "Someone else" },
            ]}
            value={formTab}
            onChange={setFormTab}
            className="self-start"
          />
          <div className="flex flex-col gap-0 rounded-md border border-border overflow-hidden">
            {FORM_FIELDS_DATA.map((field, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 bg-card",
                  idx < FORM_FIELDS_DATA.length - 1 && "border-b border-border",
                )}
              >
                <GripVertical
                  size={13}
                  strokeWidth={1.6}
                  absoluteStrokeWidth
                  className="text-muted-foreground/40 shrink-0"
                />
                <span className="text-[11px] font-mono text-muted-foreground w-4 shrink-0">
                  {field.icon}
                </span>
                <span className="text-[13px] text-foreground flex-1">
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </span>
                {field.hasToggle && (
                  <Switch
                    checked={paymentOn}
                    onCheckedChange={setPaymentOn}
                    aria-label={`Enable ${field.label}`}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-[13px] text-primary hover:underline focus-visible:underline outline-none self-start"
            onClick={() => toast.info("Form customisation coming soon")}
          >
            <Pencil size={12} strokeWidth={1.6} absoluteStrokeWidth />
            Customise form
          </button>
        </div>

        {/* Booking preferences */}
        <div className="rounded-lg border border-border bg-card px-6 py-5 flex flex-col gap-3">
          <p className={MAIN_VIEW_PRIMARY_HEADING_CLASS}>Booking preferences</p>
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-foreground">
            <span>Show appointment slots up to</span>
            <Select value={slotCount} onValueChange={setSlotCount}>
              <SelectTrigger className="h-7 w-[64px] text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["1","2","3","6","12","24"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={slotUnit} onValueChange={setSlotUnit}>
              <SelectTrigger className="h-7 w-[90px] text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">days</SelectItem>
                <SelectItem value="weeks">weeks</SelectItem>
                <SelectItem value="months">months</SelectItem>
              </SelectContent>
            </Select>
            <span>in the future</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-foreground">
            <span>Minimum time to book in advance is</span>
            <Select value={advanceCount} onValueChange={setAdvanceCount}>
              <SelectTrigger className="h-7 w-[64px] text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["1","2","3","6","12","24","48"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={advanceUnit} onValueChange={setAdvanceUnit}>
              <SelectTrigger className="h-7 w-[80px] text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">hour</SelectItem>
                <SelectItem value="day">day</SelectItem>
                <SelectItem value="week">week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Right — preview */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
        <WidgetPreviewPane colors={previewColors} />
      </div>
    </div>
  );
}

// ─── Preferences tab ──────────────────────────────────────────────────────────

function PreferencesTab() {
  const [requestOnly,   setRequestOnly]   = useState(false);
  const [openSlotsOnly, setOpenSlotsOnly] = useState(false);
  const [showAddress,   setShowAddress]   = useState(true);

  return (
    <div className="px-6 py-6 flex-1 overflow-y-auto">
      <div className="rounded-lg border border-border bg-card px-6 py-5 flex flex-col gap-4 max-w-[640px]">
        {/* Row 1 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[13px] text-foreground">
              Allow customers to only request appointments even at integrated locations
            </span>
            <HelpCircle
              size={13}
              strokeWidth={1.6}
              absoluteStrokeWidth
              className="shrink-0 text-muted-foreground"
              aria-label="More information"
            />
          </div>
          <Switch
            checked={requestOnly}
            onCheckedChange={setRequestOnly}
            aria-label="Allow customers to only request appointments"
          />
        </div>

        {/* Row 2 — disabled appearance when requestOnly is off */}
        <div className={cn("flex items-center justify-between gap-4", !requestOnly && "opacity-50")}>
          <span className="text-[13px] text-muted-foreground">
            Show only open slots for requesting
          </span>
          <Switch
            checked={openSlotsOnly}
            onCheckedChange={setOpenSlotsOnly}
            disabled={!requestOnly}
            aria-label="Show only open slots for requesting"
          />
        </div>

        {/* Row 3 */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[13px] text-foreground">Show location address on the widget</span>
          <Switch
            checked={showAddress}
            onCheckedChange={setShowAddress}
            aria-label="Show location address on the widget"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main detail view ─────────────────────────────────────────────────────────

const TAB_ITEMS: { id: WidgetDetailTab; label: string }[] = [
  { id: "install",       label: "Install" },
  { id: "appearance",    label: "Appearance" },
  { id: "configuration", label: "Configuration" },
  { id: "preferences",   label: "Preferences" },
];

export function AppointmentWidgetDetailView({
  widget,
  defaultTab = "install",
  onBack,
}: AppointmentWidgetDetailViewProps) {
  const [tab,          setTab]          = useState<WidgetDetailTab>(defaultTab);
  const [name,         setName]         = useState(widget.name);
  const [editingName,  setEditingName]  = useState(false);
  const [pendingName,  setPendingName]  = useState(widget.name);
  const nameInputRef = useRef<HTMLInputElement>(null);

  function startEditingName() {
    setPendingName(name);
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.select(), 0);
  }

  function commitName() {
    const trimmed = pendingName.trim();
    if (trimmed) setName(trimmed);
    setEditingName(false);
  }

  const navigate = useNavigate();

  const warningCount = widget.location?.match(/^(\d+)/)?.[1];
  const locationCount = widget.location?.includes("locations")
    ? widget.location
    : widget.location ?? "All locations";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Breadcrumb band — matches Settings business detail pattern ── */}
      <div className="shrink-0 bg-card px-6 pb-3 pt-5">
        <Breadcrumb>
          <BreadcrumbList className="gap-1.5">
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-primary hover:text-primary">
                <button type="button" onClick={() => navigate("/appointments")}>
                  Appointments
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-primary hover:text-primary">
                <button type="button" onClick={() => navigate("/appointments/settings")}>
                  Settings
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-primary hover:text-primary">
                <button type="button" onClick={onBack}>
                  Widgets
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">{name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Header ── */}
      <div className="shrink-0 px-6 pt-3 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            {/* Editable name */}
            <div className="flex items-center gap-1.5 min-w-0">
              {editingName ? (
                <input
                  ref={nameInputRef}
                  value={pendingName}
                  onChange={(e) => setPendingName(e.target.value)}
                  onBlur={commitName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitName();
                    if (e.key === "Escape") setEditingName(false);
                  }}
                  autoFocus
                  className={cn(
                    MAIN_VIEW_PRIMARY_HEADING_CLASS,
                    "bg-transparent border-b border-primary outline-none min-w-0 w-[260px] py-0.5",
                  )}
                />
              ) : (
                <>
                  <span className={MAIN_VIEW_PRIMARY_HEADING_CLASS}>{name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={startEditingName}
                    aria-label="Edit widget name"
                    title="Edit name"
                  >
                    <Pencil size={12} strokeWidth={1.6} absoluteStrokeWidth />
                  </Button>
                </>
              )}
            </div>

            {/* Location + warning */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => toast.info("Location management coming soon")}
              >
                {locationCount}
              </button>
              {widget.hasWarning && (
                <span className="flex items-center gap-1 text-xs text-orange-500">
                  <CircleAlert size={12} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                  ({warningCount ?? "3"} out of 5 locations not integrated)
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => toast.success("Widget settings saved")}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-border">
          <TextTabsRow
            items={TAB_ITEMS}
            value={tab}
            onChange={setTab}
            ariaLabel="Widget settings tabs"
          />
        </div>
      </div>

      {/* ── Tab content ── */}
      {tab === "install"       && <InstallTab widget={widget} />}
      {tab === "appearance"    && <AppearanceTab />}
      {tab === "configuration" && <ConfigurationTab />}
      {tab === "preferences"   && <PreferencesTab />}
    </div>
  );
}
