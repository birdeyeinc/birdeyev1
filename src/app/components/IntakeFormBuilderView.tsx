import { useState, useCallback } from "react";
import {
  ChevronLeft, ChevronDown, ChevronUp, ChevronRight, ChevronLeft as ChevLeft,
  Sparkles, Search, X, Plus, PlusCircle, MoreVertical, Copy,
  Type, AlignLeft, Mail, Phone, Calendar,
  List, Circle, CheckSquare, ToggleLeft,
  Star, BarChart2, Minus as PainIcon,
  Table2, Paperclip, Camera, PenLine, ShieldCheck,
  SeparatorHorizontal, LayoutTemplate,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { Button } from "@/app/components/ui/button";
import { SegmentedToggle } from "@/app/components/ui/segmented-toggle";
import { Input } from "@/app/components/ui/input.v1";
import { Textarea } from "@/app/components/ui/textarea.v1";
import { Switch } from "@/app/components/ui/switch.v1";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/components/ui/select.v1";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Skeleton } from "@/app/components/ui/skeleton.v1";
import {
  type IntakeForm, type IntakeFormField, type IntakeFormStep,
  type IntakeFieldType, type IntakeFormStatus,
} from "./intakeFormsMockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type BuilderMode = "ai" | "manual";

interface PaletteItem {
  type: IntakeFieldType;
  label: string;
  Icon: React.ElementType;
}

interface PaletteGroup {
  id: string;
  label: string;
  items: PaletteItem[];
}

// ─── Palette config ───────────────────────────────────────────────────────────

const PALETTE_GROUPS: PaletteGroup[] = [
  {
    id: "basic", label: "Basic",
    items: [
      { type: "short_text",    label: "Short text",    Icon: Type },
      { type: "long_text",     label: "Long text",     Icon: AlignLeft },
      { type: "email",         label: "Email",         Icon: Mail },
      { type: "phone",         label: "Phone",         Icon: Phone },
      { type: "date",          label: "Date",          Icon: Calendar },
    ],
  },
  {
    id: "choice", label: "Choice",
    items: [
      { type: "dropdown",      label: "Dropdown",      Icon: List },
      { type: "radio",         label: "Single choice", Icon: Circle },
      { type: "checkbox",      label: "Multi-select",  Icon: CheckSquare },
      { type: "yes_no",        label: "Yes / No",      Icon: ToggleLeft },
    ],
  },
  {
    id: "scales", label: "Scales",
    items: [
      { type: "rating",        label: "Rating",        Icon: Star },
      { type: "nps",           label: "NPS (0–10)",    Icon: BarChart2 },
      { type: "pain_scale",    label: "Pain scale",    Icon: PainIcon },
    ],
  },
  {
    id: "healthcare", label: "Healthcare",
    items: [
      { type: "matrix",        label: "Matrix / table",  Icon: Table2 },
      { type: "file_upload",   label: "File upload",     Icon: Paperclip },
      { type: "photo_capture", label: "Photo capture",   Icon: Camera },
      { type: "signature",     label: "Signature",       Icon: PenLine },
      { type: "consent",       label: "Consent + sign",  Icon: ShieldCheck },
    ],
  },
  {
    id: "layout", label: "Layout",
    items: [
      { type: "section_header", label: "Section header", Icon: LayoutTemplate },
      { type: "divider",        label: "Divider",         Icon: SeparatorHorizontal },
    ],
  },
];

// ─── Field helpers ────────────────────────────────────────────────────────────

function defaultField(type: IntakeFieldType): IntakeFormField {
  const base: IntakeFormField = {
    id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type, label: labelFor(type), required: false,
  };
  if (["dropdown","radio","checkbox"].includes(type))
    return { ...base, options: ["Option 1", "Option 2", "Option 3"] };
  if (type === "consent")
    return { ...base, label: "I agree to the terms", consentText: "Please read carefully before agreeing." };
  if (type === "matrix")
    return { ...base, matrixRows: ["Row 1", "Row 2", "Row 3"], matrixCols: ["Yes", "No"] };
  if (type === "rating") return { ...base, maxStars: 5 };
  if (type === "file_upload") return { ...base, allowedFileTypes: ["pdf","jpg","png"], maxFiles: 3 };
  return base;
}

function labelFor(type: IntakeFieldType): string {
  const map: Record<IntakeFieldType, string> = {
    short_text: "Short answer", long_text: "Paragraph", email: "Email address",
    phone: "Phone number", date: "Date", dropdown: "Dropdown", radio: "Single choice",
    checkbox: "Multiple choice", yes_no: "Yes / No", rating: "Rating",
    nps: "How likely are you to recommend us?", pain_scale: "Pain level (0–10)",
    file_upload: "File upload", photo_capture: "Photo", signature: "Signature",
    consent: "I agree to the following terms", matrix: "Matrix question",
    section_header: "Section title", divider: "",
  };
  return map[type] ?? type;
}

function paletteItem(type: IntakeFieldType): PaletteItem | undefined {
  return PALETTE_GROUPS.flatMap((g) => g.items).find((i) => i.type === type);
}

// ═══════════════════════════════════════════
//  Left Panel – Toolbox
// ═══════════════════════════════════════════

function ToolboxPanel({
  mode, onModeChange, onAdd,
}: {
  mode: BuilderMode;
  onModeChange: (m: BuilderMode) => void;
  onAdd: (type: IntakeFieldType) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ basic: true });

  const filteredGroups = PALETTE_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((i) =>
      i.label.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="w-[280px] shrink-0 border-r border-[#e5e9f0] bg-white dark:border-border dark:bg-background flex flex-col overflow-hidden">
      {/* Mode toggle */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <SegmentedToggle<BuilderMode>
          ariaLabel="Builder mode"
          value={mode}
          onChange={onModeChange}
          items={[
            { value: "ai",     label: "AI",     icon: <Sparkles className="w-3 h-3 text-[#6834B7]" aria-hidden /> },
            { value: "manual", label: "Manual" },
          ]}
        />
      </div>

      {/* Search */}
      <div className="px-4 pb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-[#888] dark:text-muted-foreground" aria-hidden />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fields"
            className="w-full h-[32px] pl-8 pr-3 bg-white dark:bg-muted border border-[#e5e9f0] dark:border-border rounded-[8px] text-[12px] text-[#212121] dark:text-foreground placeholder-[#999] outline-none focus:border-[#2552ED] transition-colors"
          />
        </div>
      </div>

      {/* Accordion groups */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredGroups.map((group, gi) => (
          <div key={group.id} className={gi > 0 ? "border-t border-[#f0f1f5] dark:border-border pt-1 mb-1" : "mb-1"}>
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
              className="flex items-center justify-between w-full py-2.5 text-[13px] text-[#212121] dark:text-foreground"
            >
              {group.label}
              {expanded[group.id]
                ? <ChevronUp className="w-3.5 h-3.5 text-[#888]" aria-hidden />
                : <ChevronDown className="w-3.5 h-3.5 text-[#888]" aria-hidden />}
            </button>
            {expanded[group.id] && (
              <div className="flex flex-col gap-0.5">
                {group.items.map(({ type, label, Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onAdd(type)}
                    className="flex items-center justify-between w-full px-2 py-2 text-[12px] text-[#555] dark:text-muted-foreground hover:bg-[#f5f5f5] dark:hover:bg-muted rounded-[6px] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-[15px] h-[15px] text-[#888] dark:text-muted-foreground" aria-hidden />
                      <span>{label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#ccc] dark:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  Center Panel – Canvas
// ═══════════════════════════════════════════

function CanvasPanel({
  form, step, stepIdx, totalSteps, fields, selectedFieldId, generating,
  onSelectField, onMoveUp, onMoveDown, onDuplicateField, onDeleteField,
  onPrevStep, onNextStep, onAddStep,
}: {
  form: IntakeForm;
  step: IntakeFormStep;
  stepIdx: number;
  totalSteps: number;
  fields: IntakeFormField[];
  selectedFieldId: string | null;
  generating: boolean;
  onSelectField: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDuplicateField: (id: string) => void;
  onDeleteField: (id: string) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onAddStep: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8f9fb] dark:bg-app-shell-gutter">

      {/* Form title pill */}
      <div className="flex justify-center pt-6 pb-2 shrink-0">
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-[#3b4455] dark:bg-muted rounded-[10px]">
          <div className="w-2 h-2 rounded-full bg-[#2552ED]" />
          <div>
            <p className="text-[12px] text-white">{form.name}</p>
            <p className="text-[10px] text-[#9ba2b0]">{form.location}</p>
          </div>
        </div>
      </div>

      {/* Step navigation toolbar */}
      <div className="flex justify-center py-2 shrink-0">
        <div className="flex items-center gap-1 bg-white dark:bg-background border border-[#e5e9f0] dark:border-border rounded-[8px] px-1.5 py-1">
          <Button type="button" variant="ghost" size="icon" className="rounded-[6px] text-[#555] dark:text-muted-foreground"
            onClick={onPrevStep} disabled={stepIdx === 0}>
            <ChevLeft className="w-4 h-4" aria-hidden />
          </Button>
          <span className="text-[12px] text-[#555] dark:text-muted-foreground px-2">
            Step {stepIdx + 1} of {totalSteps}
          </span>
          <Button type="button" variant="ghost" size="icon" className="rounded-[6px] text-[#555] dark:text-muted-foreground"
            onClick={onNextStep} disabled={stepIdx === totalSteps - 1}>
            <ChevronRight className="w-4 h-4" aria-hidden />
          </Button>
          <div className="w-px h-5 bg-[#e5e9f0] dark:bg-border mx-1" />
          <Button type="button" variant="ghost" size="icon" className="rounded-[6px] text-[#555] dark:text-muted-foreground"
            onClick={onAddStep} title="Add step">
            <Plus className="w-4 h-4" aria-hidden />
          </Button>
        </div>
      </div>

      {/* Scrollable canvas */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center py-4 gap-0">

          {/* AI shimmer */}
          {generating && (
            <div className="flex flex-col items-center gap-3 w-[340px]">
              <div className="flex items-center gap-2 text-[12px] text-[#555] dark:text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-[#6834B7] animate-pulse" aria-hidden />
                Generating your form…
              </div>
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[88px] w-full rounded-[10px]" />)}
            </div>
          )}

          {/* Empty state */}
          {!generating && fields.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <LayoutTemplate className="w-8 h-8 text-[#ccc] dark:text-muted-foreground" aria-hidden />
              <p className="text-[13px] text-[#888] dark:text-muted-foreground">
                Click a field on the left to add it here
              </p>
            </div>
          )}

          {/* Field cards — same flow-node style as AgentsBuilderView */}
          {!generating && fields.map((field, idx) => {
            const item = paletteItem(field.type);
            const Icon = item?.Icon ?? Type;
            const selected = selectedFieldId === field.id;

            return (
              <div key={field.id} className="flex flex-col items-center">
                {/* Connector line before (except first) */}
                {idx > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-[1px] h-[28px] bg-[#ccc] dark:bg-app-shell-l2-row-active" />
                    <div className="w-[9px] h-[9px] border border-[#ccc] dark:border-[#4d5568] rounded-full bg-[#f8f9fb] dark:bg-app-shell-gutter -my-[4px] z-10" />
                    <div className="w-[1px] h-[28px] bg-[#ccc] dark:bg-app-shell-l2-row-active" />
                  </div>
                )}

                {/* Field card */}
                <button
                  type="button"
                  onClick={() => onSelectField(field.id)}
                  className={`relative w-[340px] rounded-[10px] border-2 transition-all text-left ${
                    selected
                      ? "border-[#2552ED] bg-white dark:bg-background shadow-[0_0_0_3px_rgba(37,82,237,0.12)]"
                      : "border-[#e5e9f0] dark:border-border bg-white dark:bg-background hover:border-[#c0c6d4] dark:hover:border-[#4d5568]"
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#f0f1f5] dark:border-border">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-[#888] dark:text-muted-foreground" aria-hidden />
                      <span className="text-[12px] text-[#888] dark:text-muted-foreground">
                        {item?.label ?? field.type}
                      </span>
                      {field.required && (
                        <span className="text-[10px] text-[#de1b0c] font-medium">Required</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={(e) => { e.stopPropagation(); onMoveUp(field.id); }}
                        disabled={idx === 0}
                        className="p-0.5 text-[#ccc] dark:text-muted-foreground hover:text-[#555] disabled:opacity-30 transition-colors"
                        aria-label="Move up">
                        <ChevronUp className="w-3.5 h-3.5" aria-hidden />
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); onMoveDown(field.id); }}
                        disabled={idx === fields.length - 1}
                        className="p-0.5 text-[#ccc] dark:text-muted-foreground hover:text-[#555] disabled:opacity-30 transition-colors"
                        aria-label="Move down">
                        <ChevronDown className="w-3.5 h-3.5" aria-hidden />
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); onDuplicateField(field.id); }}
                        className="p-0.5 text-[#ccc] dark:text-muted-foreground hover:text-[#555] transition-colors"
                        aria-label="Duplicate field">
                        <Copy className="w-3.5 h-3.5" aria-hidden />
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); onDeleteField(field.id); }}
                        className="p-0.5 text-[#ccc] dark:text-muted-foreground hover:text-[#de1b0c] transition-colors"
                        aria-label="Delete field">
                        <X className="w-3.5 h-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-4 py-3">
                    <p className="text-[13px] text-[#212121] dark:text-foreground">
                      {field.label || <span className="italic text-[#aaa]">Untitled field</span>}
                    </p>
                    {field.helpText && (
                      <p className="text-[11px] text-[#888] dark:text-muted-foreground mt-0.5 leading-[1.5]">
                        {field.helpText}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            );
          })}

          {/* Bottom connector + add button */}
          {!generating && (
            <>
              <div className="flex flex-col items-center mt-0">
                <div className="w-[1px] h-[28px] bg-[#ccc] dark:bg-app-shell-l2-row-active" />
                <div className="w-[9px] h-[9px] border border-[#ccc] dark:border-[#4d5568] rounded-full bg-[#f8f9fb] dark:bg-app-shell-gutter" />
              </div>
              <button
                type="button"
                className="mt-3 flex items-center gap-1.5 text-[12px] text-[#2552ED] hover:text-[#1E44CC] transition-colors"
              >
                <PlusCircle className="w-4 h-4" aria-hidden />
                Add field from palette
              </button>
            </>
          )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  Right Panel – Properties
// ═══════════════════════════════════════════

function PropertiesPanel({
  field, onChange, onClose,
}: {
  field: IntakeFormField | null;
  onChange: (patch: Partial<IntakeFormField>) => void;
  onClose: () => void;
}) {
  if (!field) return (
    <div className="w-[340px] shrink-0 border-l border-[#e5e9f0] dark:border-border bg-white dark:bg-background flex items-center justify-center text-center p-6">
      <div>
        <MoreVertical className="w-6 h-6 text-[#ccc] dark:text-muted-foreground mx-auto mb-2" aria-hidden />
        <p className="text-[12px] text-[#888] dark:text-muted-foreground">Select a field to edit its properties</p>
      </div>
    </div>
  );

  const item = paletteItem(field.type);

  return (
    <div className="w-[340px] shrink-0 border-l border-[#e5e9f0] dark:border-border bg-white dark:bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e9f0] dark:border-border shrink-0">
        <span className="text-[13px] text-[#555] dark:text-muted-foreground">{item?.label ?? field.type}</span>
        <Button type="button" variant="ghost" size="icon" onClick={onClose}
          className="rounded-[6px] text-[#555] dark:text-muted-foreground">
          <X className="w-4 h-4" aria-hidden />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Label */}
        {field.type !== "divider" && (
          <div>
            <label className="flex items-center gap-0.5 text-[12px] text-[#212121] dark:text-foreground mb-1.5">
              Label {field.type !== "section_header" && <span className="text-[#de1b0c]">*</span>}
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onChange({ label: e.target.value })}
              className="w-full h-[36px] px-3 bg-[#f5f5f5] dark:bg-muted border border-[#ccc] dark:border-border rounded-[8px] text-[12px] text-[#555] dark:text-muted-foreground outline-none focus:border-[#2552ED] transition-colors"
            />
          </div>
        )}

        {/* Placeholder */}
        {["short_text","long_text","email","phone"].includes(field.type) && (
          <div>
            <label className="text-[12px] text-[#212121] dark:text-foreground mb-1.5 block">Placeholder</label>
            <input
              type="text"
              value={field.placeholder ?? ""}
              onChange={(e) => onChange({ placeholder: e.target.value })}
              placeholder="Hint text shown in field"
              className="w-full h-[36px] px-3 bg-[#f5f5f5] dark:bg-muted border border-[#ccc] dark:border-border rounded-[8px] text-[12px] text-[#555] dark:text-muted-foreground outline-none focus:border-[#2552ED] transition-colors"
            />
          </div>
        )}

        {/* Required */}
        {!["section_header","divider"].includes(field.type) && (
          <div className="flex items-center justify-between">
            <label className="text-[12px] text-[#212121] dark:text-foreground">Required</label>
            <Switch checked={field.required} onCheckedChange={(v) => onChange({ required: v })} />
          </div>
        )}

        {/* Help text */}
        {!["section_header","divider","signature"].includes(field.type) && (
          <div>
            <label className="text-[12px] text-[#212121] dark:text-foreground mb-1.5 block">Help text (optional)</label>
            <input
              type="text"
              value={field.helpText ?? ""}
              onChange={(e) => onChange({ helpText: e.target.value })}
              placeholder="Additional guidance"
              className="w-full h-[36px] px-3 bg-[#f5f5f5] dark:bg-muted border border-[#ccc] dark:border-border rounded-[8px] text-[12px] text-[#555] dark:text-muted-foreground outline-none focus:border-[#2552ED] transition-colors"
            />
          </div>
        )}

        {/* Options */}
        {["dropdown","radio","checkbox"].includes(field.type) && (
          <div>
            <label className="text-[12px] text-[#212121] dark:text-foreground mb-1.5 block">Options</label>
            <div className="bg-[#f2f4f7] dark:bg-[#1a1e25] rounded-[8px] p-3 space-y-2">
              {(field.options ?? []).map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const next = [...(field.options ?? [])];
                      next[idx] = e.target.value;
                      onChange({ options: next });
                    }}
                    className="flex-1 h-[32px] px-2.5 bg-white dark:bg-muted border border-[#ccc] dark:border-border rounded-[6px] text-[12px] text-[#555] dark:text-muted-foreground outline-none focus:border-[#2552ED] transition-colors"
                  />
                  <button type="button"
                    onClick={() => onChange({ options: (field.options ?? []).filter((_, i) => i !== idx) })}
                    className="text-[#ccc] hover:text-[#de1b0c] transition-colors" aria-label="Remove">
                    <X className="w-3.5 h-3.5" aria-hidden />
                  </button>
                </div>
              ))}
              <button type="button"
                onClick={() => onChange({ options: [...(field.options ?? []), `Option ${(field.options?.length ?? 0) + 1}`] })}
                className="flex items-center gap-1.5 text-[12px] text-[#2552ED] hover:text-[#1E44CC] transition-colors py-1">
                <PlusCircle className="w-4 h-4" aria-hidden />Add option
              </button>
            </div>
          </div>
        )}

        {/* Rating max */}
        {field.type === "rating" && (
          <div>
            <label className="text-[12px] text-[#212121] dark:text-foreground mb-1.5 block">Max stars</label>
            <SegmentedToggle
              value={String(field.maxStars ?? 5)}
              onChange={(v) => onChange({ maxStars: Number(v) as 3 | 5 | 10 })}
              items={[{ value: "3", label: "3" }, { value: "5", label: "5" }, { value: "10", label: "10" }]}
              ariaLabel="Max rating"
            />
          </div>
        )}

        {/* Consent text */}
        {field.type === "consent" && (
          <div>
            <label className="text-[12px] text-[#212121] dark:text-foreground mb-1.5 block">Consent text</label>
            <textarea
              value={field.consentText ?? ""}
              onChange={(e) => onChange({ consentText: e.target.value })}
              maxLength={500}
              rows={4}
              placeholder="Legal text the patient must read and agree to…"
              className="w-full px-3 py-2 bg-white dark:bg-muted border border-[#ccc] dark:border-border rounded-[8px] text-[12px] text-[#212121] dark:text-foreground outline-none focus:border-[#2552ED] transition-colors resize-none leading-[1.5]"
            />
            <p className="text-right text-[11px] text-[#999] dark:text-muted-foreground mt-0.5">
              {(field.consentText ?? "").length}/500
            </p>
          </div>
        )}

        {/* Matrix */}
        {field.type === "matrix" && (
          <>
            <div>
              <label className="text-[12px] text-[#212121] dark:text-foreground mb-1.5 block">Row labels</label>
              <div className="bg-[#f2f4f7] dark:bg-[#1a1e25] rounded-[8px] p-3 space-y-2">
                {(field.matrixRows ?? []).map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={row}
                      onChange={(e) => { const n = [...(field.matrixRows ?? [])]; n[i] = e.target.value; onChange({ matrixRows: n }); }}
                      className="flex-1 h-[32px] px-2.5 bg-white dark:bg-muted border border-[#ccc] dark:border-border rounded-[6px] text-[12px] text-[#555] outline-none focus:border-[#2552ED] transition-colors" />
                    <button type="button" onClick={() => onChange({ matrixRows: (field.matrixRows ?? []).filter((_, j) => j !== i) })}
                      className="text-[#ccc] hover:text-[#de1b0c] transition-colors"><X className="w-3.5 h-3.5" aria-hidden /></button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => onChange({ matrixRows: [...(field.matrixRows ?? []), `Row ${(field.matrixRows?.length ?? 0) + 1}`] })}
                  className="flex items-center gap-1.5 text-[12px] text-[#2552ED] hover:text-[#1E44CC] transition-colors py-1">
                  <PlusCircle className="w-4 h-4" aria-hidden />Add row
                </button>
              </div>
            </div>
            <div>
              <label className="text-[12px] text-[#212121] dark:text-foreground mb-1.5 block">Column labels</label>
              <div className="bg-[#f2f4f7] dark:bg-[#1a1e25] rounded-[8px] p-3 space-y-2">
                {(field.matrixCols ?? []).map((col, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={col}
                      onChange={(e) => { const n = [...(field.matrixCols ?? [])]; n[i] = e.target.value; onChange({ matrixCols: n }); }}
                      className="flex-1 h-[32px] px-2.5 bg-white dark:bg-muted border border-[#ccc] dark:border-border rounded-[6px] text-[12px] text-[#555] outline-none focus:border-[#2552ED] transition-colors" />
                    <button type="button" onClick={() => onChange({ matrixCols: (field.matrixCols ?? []).filter((_, j) => j !== i) })}
                      className="text-[#ccc] hover:text-[#de1b0c] transition-colors"><X className="w-3.5 h-3.5" aria-hidden /></button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => onChange({ matrixCols: [...(field.matrixCols ?? []), `Col ${(field.matrixCols?.length ?? 0) + 1}`] })}
                  className="flex items-center gap-1.5 text-[12px] text-[#2552ED] hover:text-[#1E44CC] transition-colors py-1">
                  <PlusCircle className="w-4 h-4" aria-hidden />Add column
                </button>
              </div>
            </div>
          </>
        )}

        {/* File upload */}
        {field.type === "file_upload" && (
          <div>
            <label className="text-[12px] text-[#212121] dark:text-foreground mb-1.5 block">Max files</label>
            <Select value={String(field.maxFiles ?? 3)} onValueChange={(v) => onChange({ maxFiles: Number(v) })}>
              <SelectTrigger className="text-[12px] h-[36px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,5,10].map((n) => <SelectItem key={n} value={String(n)}>{n} file{n > 1 ? "s" : ""}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Section header subtitle */}
        {field.type === "section_header" && (
          <div>
            <label className="text-[12px] text-[#212121] dark:text-foreground mb-1.5 block">Subtitle (optional)</label>
            <input type="text" value={field.helpText ?? ""}
              onChange={(e) => onChange({ helpText: e.target.value })}
              placeholder="Additional context"
              className="w-full h-[36px] px-3 bg-[#f5f5f5] dark:bg-muted border border-[#ccc] dark:border-border rounded-[8px] text-[12px] text-[#555] outline-none focus:border-[#2552ED] transition-colors" />
          </div>
        )}
      </div>

      {/* Save field button */}
      <div className="px-4 py-4 border-t border-[#e5e9f0] dark:border-border shrink-0">
        <Button type="button" onClick={() => toast.success("Field updated")}
          className="w-full rounded-[8px] bg-[#2552ED] hover:bg-[#1E44CC] text-[13px] text-white">
          Apply
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  Main builder view
// ═══════════════════════════════════════════

export interface IntakeFormBuilderViewProps {
  form: IntakeForm;
  onCancel: () => void;
  onSave: (updated: IntakeForm) => void;
  onPreview: () => void;
}

export function IntakeFormBuilderView({ form, onCancel, onSave, onPreview }: IntakeFormBuilderViewProps) {
  const [mode, setMode] = useState<BuilderMode>("manual");
  const [formName, setFormName] = useState(form.name);
  const [editingName, setEditingName] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const [steps, setSteps] = useState<IntakeFormStep[]>(
    form.steps.length > 0
      ? form.steps.map((s) => ({ ...s, fields: [...s.fields] }))
      : [{ id: "s1", title: "Page 1", fields: [] }],
  );
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [generating] = useState(false);

  const currentStep = steps[stepIdx] ?? steps[0];
  const currentFields = currentStep.fields;
  const selectedField = currentFields.find((f) => f.id === selectedFieldId) ?? null;

  function updateStep(fn: (fields: IntakeFormField[]) => IntakeFormField[]) {
    setSteps((prev) => prev.map((s, i) => i === stepIdx ? { ...s, fields: fn(s.fields) } : s));
  }

  function addField(type: IntakeFieldType) {
    const field = defaultField(type);
    updateStep((fields) => [...fields, field]);
    setSelectedFieldId(field.id);
  }

  function updateField(id: string, patch: Partial<IntakeFormField>) {
    updateStep((fields) => fields.map((f) => f.id === id ? { ...f, ...patch } : f));
  }

  function moveField(id: string, dir: "up" | "down") {
    updateStep((fields) => {
      const idx = fields.findIndex((f) => f.id === id);
      if (idx < 0) return fields;
      const next = [...fields];
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= next.length) return fields;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function duplicateField(id: string) {
    updateStep((fields) => {
      const idx = fields.findIndex((f) => f.id === id);
      if (idx < 0) return fields;
      const clone: IntakeFormField = {
        ...fields[idx],
        id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      };
      if (clone.options)    clone.options    = [...clone.options];
      if (clone.matrixRows) clone.matrixRows = [...clone.matrixRows];
      if (clone.matrixCols) clone.matrixCols = [...clone.matrixCols];
      const next = [...fields];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  }

  function deleteField(id: string) {
    updateStep((fields) => fields.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  }

  function handleSave(status: IntakeFormStatus) {
    const updated: IntakeForm = {
      ...form,
      name: formName,
      status,
      steps,
      fieldCount: steps.flatMap((s) => s.fields).length,
    };
    toast.success("Form saved");
    onSave(updated);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-app-shell-gutter transition-colors duration-300">
      {/* Header */}
      <div className="shrink-0 border-b border-[#e5e9f0] bg-white dark:border-border dark:bg-background">
        <MainCanvasViewHeader
          title={
            <span className="flex min-w-0 items-center gap-3">
              <Button type="button" variant="ghost" size="icon"
                onClick={() => setShowCancel(true)}
                className="shrink-0 rounded-md text-muted-foreground">
                <ChevronLeft className="size-4" aria-hidden />
              </Button>
              {editingName ? (
                <input
                  autoFocus
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingName(false); }}
                  className="h-8 min-w-0 flex-1 rounded-lg border border-[#2552ED] bg-background px-2 text-[15px] font-semibold text-foreground outline-none"
                />
              ) : (
                <button type="button" onClick={() => setEditingName(true)}
                  className="min-w-0 flex-1 truncate text-left hover:text-primary transition-colors">
                  {formName}
                </button>
              )}
            </span>
          }
          actions={
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onPreview}>
                Preview
              </Button>
              <div className="flex items-center">
                <Button type="button" size="sm"
                  className="rounded-r-none pr-3 bg-[#2552ED] hover:bg-[#1E44CC] text-white"
                  onClick={() => handleSave("active")}>
                  Save
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm"
                      className="rounded-l-none border-l border-[#1E44CC] px-2 bg-[#2552ED] hover:bg-[#1E44CC] text-white">
                      <ChevronDown className="size-3" aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => handleSave("active")}>Save and publish</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSave("draft")}>Save as draft</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          }
        />
      </div>

      {/* 3-panel body */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <ToolboxPanel mode={mode} onModeChange={setMode} onAdd={addField} />

        <CanvasPanel
          form={{ ...form, name: formName }}
          step={currentStep}
          stepIdx={stepIdx}
          totalSteps={steps.length}
          fields={currentFields}
          selectedFieldId={selectedFieldId}
          generating={generating}
          onSelectField={setSelectedFieldId}
          onMoveUp={(id) => moveField(id, "up")}
          onMoveDown={(id) => moveField(id, "down")}
          onDuplicateField={duplicateField}
          onDeleteField={deleteField}
          onPrevStep={() => setStepIdx((i) => Math.max(0, i - 1))}
          onNextStep={() => setStepIdx((i) => Math.min(steps.length - 1, i + 1))}
          onAddStep={() => {
            const newStep = { id: `s-${Date.now()}`, title: `Page ${steps.length + 1}`, fields: [] };
            setSteps((prev) => [...prev, newStep]);
            setStepIdx(steps.length);
          }}
        />

        <PropertiesPanel
          field={selectedField}
          onChange={(patch) => { if (selectedField) updateField(selectedField.id, patch); }}
          onClose={() => setSelectedFieldId(null)}
        />
      </div>

      {/* Unsaved-changes guard */}
      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>Your unsaved changes will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
