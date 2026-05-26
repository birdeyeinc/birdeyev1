import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  FileText, Plus, MoreHorizontal, Eye, Pencil,
  ClipboardList, Users, ShieldCheck,
  Star, Baby, Brain, BarChart2, Stethoscope,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { TextTabsRow } from "@/app/components/ui/text-tabs.v1";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge.v1";
import { MODAL_OVERLAY_VISUAL_CLASS } from "@/app/components/ui/modalOverlayClasses";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  MOCK_FORMS,
  MOCK_TEMPLATES,
  INTAKE_FORMS_PATH_PREFIX,
  formatDate,
  type IntakeForm,
  type IntakeFormStatus,
  type IntakeFormTemplate,
} from "./intakeFormsMockData";
import { IntakeFormCreateDialog } from "./IntakeFormCreateDialog";
import { IntakeFormDetailView } from "./IntakeFormDetailView.v1";
import { IntakeFormBuilderView } from "./IntakeFormBuilderView";
import { IntakeFormPlayerView } from "./IntakeFormPlayerView";

// ─── Types ────────────────────────────────────────────────────────────────────

type ListTab = "saved" | "library";

// ─── Thumbnail ────────────────────────────────────────────────────────────────

const THUMB_ICON_MAP: Record<string, React.ElementType> = {
  demographic:  Users,
  medical:      Stethoscope,
  consent:      ShieldCheck,
  insurance:    FileText,
  feedback:     Star,
  pediatric:    Baby,
  mental_health: Brain,
  ros:          ClipboardList,
};

function IntakeFormThumbnail({ variant, fieldCount }: {
  variant: string;
  fieldCount: number;
}) {
  const Icon = THUMB_ICON_MAP[variant] ?? FileText;
  const rows = Math.min(fieldCount || 3, 6);

  return (
    <div className="flex h-full flex-col gap-2 bg-muted/30 p-3">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Icon className="size-3.5 text-primary" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
        </div>
        <div className="h-2 w-20 rounded-full bg-muted" />
      </div>
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30" />
            <div
              className="h-1.5 rounded-full bg-muted-foreground/20"
              style={{ width: `${55 + ((i * 37) % 35)}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IntakeFormStatus }) {
  if (status === "active")   return <Badge variant="success" className="text-[10px] py-0">Active</Badge>;
  if (status === "draft")    return <Badge variant="warning" className="text-[10px] py-0">Draft</Badge>;
  return <Badge variant="secondary" className="text-[10px] py-0">Inactive</Badge>;
}

// ─── My forms card ────────────────────────────────────────────────────────────

function MyFormCard({
  form,
  onPreview,
  onEdit,
  onStatusChange,
  onDuplicate,
  onDelete,
}: {
  form: IntakeForm;
  onPreview: () => void;
  onEdit: () => void;
  onStatusChange: (id: string, s: IntakeFormStatus) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const thumbVariant = form.id === "if1" ? "demographic"
    : form.id === "if2" ? "medical"
    : form.id === "if3" ? "mental_health"
    : form.id === "if4" ? "demographic"
    : form.id === "if5" ? "feedback"
    : "ros";

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <IntakeFormThumbnail variant={thumbVariant} fieldCount={form.fieldCount} />

        {/* Hover scrim */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 transition-opacity duration-150",
            hovered ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <span className="max-w-[80%] truncate text-center text-[13px] font-semibold text-white">
            {form.name}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60"
              onClick={(e) => { e.stopPropagation(); onPreview(); }}
            >
              <Eye className="mr-1.5 size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-white text-foreground hover:bg-white/90"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
            >
              <Pencil className="mr-1.5 size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8 border-white/40 bg-white/10 text-white hover:bg-white/20"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="More options"
                >
                  <MoreHorizontal className="size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {form.status === "draft" && (
                  <DropdownMenuItem onClick={() => onStatusChange(form.id, "active")}>Publish</DropdownMenuItem>
                )}
                {form.status === "active" && (
                  <DropdownMenuItem onClick={() => onStatusChange(form.id, "inactive")}>Deactivate</DropdownMenuItem>
                )}
                {form.status === "inactive" && (
                  <DropdownMenuItem onClick={() => onStatusChange(form.id, "active")}>Re-activate</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDuplicate(form.id)}>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(form.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-[13px] font-medium text-foreground">{form.name}</span>
          <StatusBadge status={form.status} />
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{form.location}</span>
          {form.submissionCount > 0 && (
            <>
              <span>·</span>
              <span>{form.submissionCount} submissions</span>
            </>
          )}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Created {formatDate(form.createdOn)} by {form.createdBy}
        </p>
      </div>
    </div>
  );
}

// ─── Template card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onUse,
}: {
  template: IntakeFormTemplate;
  onUse: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-150",
        hovered && "shadow-lg ring-2 ring-primary/20",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <IntakeFormThumbnail variant={template.thumbnailVariant} fieldCount={template.fieldCount} />

        {/* Use template button */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex justify-center pb-3 transition-opacity duration-150",
            hovered ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <Button size="sm" onClick={(e) => { e.stopPropagation(); onUse(); }}>
            Use template
          </Button>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-4 py-3">
        <span className="text-[13px] font-medium text-foreground">{template.name}</span>
        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{template.description}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {template.fieldCount === 0 ? "Blank canvas" : `${template.fieldCount} fields · ${template.stepCount} ${template.stepCount === 1 ? "step" : "steps"}`}
        </p>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onCreateAI, onBrowse }: { onCreateAI: () => void; onBrowse: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <ClipboardList className="size-8 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold text-foreground">No intake forms yet</span>
        <span className="max-w-xs text-[13px] text-muted-foreground">
          Collect patient info before appointments — digitally, no paper.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onCreateAI}>
          <BarChart2 className="mr-1.5 size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          Create with AI
        </Button>
        <Button variant="outline" onClick={onBrowse}>
          Browse templates
        </Button>
      </div>
    </div>
  );
}

// ─── Player popup dialog ──────────────────────────────────────────────────────

function PlayerDialog({ form, onClose, onSubmit }: {
  form: IntakeForm | null;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const open = form !== null;
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            MODAL_OVERLAY_VISUAL_CLASS,
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "flex flex-col overflow-hidden rounded-2xl bg-background shadow-2xl",
            "w-full max-w-lg",
            "max-h-[88vh]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200",
          )}
          aria-label={form?.name ?? "Form preview"}
        >
          <DialogPrimitive.Title className="sr-only">
            {form?.name ?? "Form preview"}
          </DialogPrimitive.Title>
          {form && (
            <IntakeFormPlayerView
              form={form}
              onClose={onClose}
              onSubmit={onSubmit}
            />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function IntakeFormsView() {
  const location = useLocation();
  const navigate = useNavigate();

  // Builder uses URL: /intake-forms/:id/edit
  // Player uses popup dialog
  const [playerFormId, setPlayerFormId] = useState<string | null>(null);

  // List UI state
  const [activeTab, setActiveTab] = useState<ListTab>("saved");
  const [createOpen, setCreateOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"ai" | "manual" | null>(null);
  const [createTemplateId, setCreateTemplateId] = useState<string | undefined>(undefined);

  // Local form state (mock CRUD)
  const [forms, setForms] = useState<IntakeForm[]>(MOCK_FORMS);

  // ── URL parsing ──
  // /appointments/resource/intake-forms/:id/edit → builder
  // /appointments/resource/intake-forms/:id      → detail
  const pathname = location.pathname;
  const builderMatch = pathname.match(/\/appointments\/resource\/intake-forms\/([^/]+)\/edit$/);
  const builderFormId = builderMatch ? builderMatch[1] : null;

  const detailId = !builderFormId && pathname.startsWith(INTAKE_FORMS_PATH_PREFIX)
    ? pathname.slice(INTAKE_FORMS_PATH_PREFIX.length).replace(/\/edit$/, "") || null
    : null;

  const detailForm = useMemo(
    () => (detailId ? forms.find((f) => f.id === detailId) ?? forms[0] : null),
    [detailId, forms],
  );

  const playerForm = useMemo(
    () => (playerFormId ? forms.find((f) => f.id === playerFormId) ?? null : null),
    [playerFormId, forms],
  );

  // ── Status changes ──
  function handleStatusChange(id: string, status: IntakeFormStatus) {
    setForms((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
  }

  function handleDuplicate(id: string) {
    const src = forms.find((f) => f.id === id);
    if (!src) return;
    const copy: IntakeForm = {
      ...src,
      id: `if-copy-${Date.now()}`,
      name: `${src.name} (copy)`,
      status: "draft",
      submissionCount: 0,
      completionRate: 0,
      createdOn: new Date().toISOString().slice(0, 10),
    };
    setForms((prev) => [copy, ...prev]);
  }

  function handleDelete(id: string) {
    setForms((prev) => prev.filter((f) => f.id !== id));
  }

  function openBuilder(id: string) {
    navigate(`${INTAKE_FORMS_PATH_PREFIX}${id}/edit`);
  }

  // ── Create dialog callbacks ──
  function handleCreateAI() {
    setCreateMode("ai");
    setCreateOpen(true);
  }

  function handleBrowseTemplates() {
    setActiveTab("library");
  }

  function handleUseTemplate(templateId: string) {
    setCreateTemplateId(templateId);
    setCreateMode("manual");
    setCreateOpen(true);
  }

  function handleCreateConfirm(name: string, templateId?: string) {
    const tpl = MOCK_TEMPLATES.find((t) => t.id === templateId);
    const newForm: IntakeForm = {
      id: `if-new-${Date.now()}`,
      name,
      location: "All locations",
      fieldCount: tpl ? tpl.fieldCount : 0,
      submissionCount: 0,
      completionRate: 0,
      status: "draft",
      createdBy: "Balaji K",
      createdOn: new Date().toISOString().slice(0, 10),
      steps: tpl ? [...tpl.steps] : [{ id: "s1", title: "Page 1", fields: [] }],
    };
    setForms((prev) => [newForm, ...prev]);
    setCreateOpen(false);
    openBuilder(newForm.id);
  }

  // ── Builder mode (URL-driven, takes L2 + main) ──
  if (builderFormId !== null) {
    const form = forms.find((f) => f.id === builderFormId) ?? forms[0];
    return (
      <>
        <IntakeFormBuilderView
          form={form}
          onCancel={() => navigate(
            detailId
              ? `${INTAKE_FORMS_PATH_PREFIX}${builderFormId}`
              : "/appointments/resource/intake-forms"
          )}
          onSave={(updated) => {
            setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
            navigate(`${INTAKE_FORMS_PATH_PREFIX}${updated.id}`);
          }}
          onPreview={() => setPlayerFormId(builderFormId)}
        />
        <PlayerDialog
          form={playerForm}
          onClose={() => setPlayerFormId(null)}
          onSubmit={() => {
            setForms((prev) =>
              prev.map((f) =>
                f.id === playerFormId
                  ? { ...f, submissionCount: f.submissionCount + 1 }
                  : f,
              ),
            );
            setPlayerFormId(null);
          }}
        />
      </>
    );
  }

  // ── Detail mode ──
  if (detailId && detailForm) {
    return (
      <>
        <IntakeFormDetailView
          form={detailForm}
          allForms={forms}
          onBack={() => navigate("/appointments/resource/intake-forms")}
          onEditInBuilder={() => openBuilder(detailForm.id)}
          onStatusChange={(s) => handleStatusChange(detailForm.id, s)}
          onPreview={() => setPlayerFormId(detailForm.id)}
        />
        <PlayerDialog
          form={playerForm}
          onClose={() => setPlayerFormId(null)}
          onSubmit={() => {
            setForms((prev) =>
              prev.map((f) =>
                f.id === playerFormId
                  ? { ...f, submissionCount: f.submissionCount + 1 }
                  : f,
              ),
            );
            setPlayerFormId(null);
          }}
        />
      </>
    );
  }

  // ── List mode ──
  const tabItems = [
    { id: "saved"   as ListTab, label: "Saved" },
    { id: "library" as ListTab, label: "Library" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MainCanvasViewHeader
        title="Intake forms"
        actions={
          <Button
            onClick={() => { setCreateMode(null); setCreateTemplateId(undefined); setCreateOpen(true); }}
          >
            New form
          </Button>
        }
      />

      {/* Tab bar */}
      <div className="shrink-0 border-b border-border px-6">
        <TextTabsRow<ListTab> items={tabItems} value={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {activeTab === "saved" ? (
          forms.length === 0 ? (
            <EmptyState onCreateAI={handleCreateAI} onBrowse={handleBrowseTemplates} />
          ) : (
            <div className="grid auto-rows-auto gap-4 p-6"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {forms.map((form) => (
                <MyFormCard
                  key={form.id}
                  form={form}
                  onPreview={() => setPlayerFormId(form.id)}
                  onEdit={() => openBuilder(form.id)}
                  onStatusChange={handleStatusChange}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        ) : (
          <div className="grid auto-rows-auto gap-4 p-6"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {MOCK_TEMPLATES.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                onUse={() => handleUseTemplate(tpl.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create dialog */}
      <IntakeFormCreateDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) { setCreateMode(null); setCreateTemplateId(undefined); }
        }}
        initialMode={createMode}
        initialTemplateId={createTemplateId}
        onConfirm={handleCreateConfirm}
      />

      {/* Player popup — overlays the list */}
      <PlayerDialog
        form={playerForm}
        onClose={() => setPlayerFormId(null)}
        onSubmit={() => {
          setForms((prev) =>
            prev.map((f) =>
              f.id === playerFormId
                ? { ...f, submissionCount: f.submissionCount + 1 }
                : f,
            ),
          );
          setPlayerFormId(null);
        }}
      />
    </div>
  );
}
