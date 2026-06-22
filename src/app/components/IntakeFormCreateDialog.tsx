import { useState, useEffect } from "react";
import { Sparkles, LayoutGrid, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { cn } from "@/lib/utils";
import { MOCK_TEMPLATES, type IntakeFormTemplate } from "./intakeFormsMockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "mode" | "ai" | "template";
type Mode = "ai" | "manual";

// ─── Field label helper ───────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex items-center gap-1 text-[13px] font-medium text-foreground">
      {children}
      {required && <span className="text-[11px] text-destructive">*</span>}
    </label>
  );
}

// ─── Step 2A — AI prompt ──────────────────────────────────────────────────────

function AiStep({
  prompt, setPrompt,
  specialty, setSpecialty,
}: {
  prompt: string; setPrompt: (v: string) => void;
  specialty: string; setSpecialty: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Describe your form</FieldLabel>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={'e.g. "New patient intake for a cardiology practice — demographics, medical history, and HIPAA consent"'}
          rows={4}
          maxLength={300}
          className="w-full resize-none rounded-[8px] border border-border bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors leading-[1.6]"
          autoFocus
        />
        <span className="text-right text-[11px] text-muted-foreground">{prompt.length}/300</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Specialty (optional)</FieldLabel>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="text-[13px]">
            <SelectValue placeholder="General practice" />
          </SelectTrigger>
          <SelectContent>
            {[
              ["general",       "General practice"],
              ["dental",        "Dental"],
              ["cardiology",    "Cardiology"],
              ["pediatrics",    "Pediatrics"],
              ["mental_health", "Mental health"],
              ["orthopedics",   "Orthopedics"],
              ["ob_gyn",        "OB/GYN"],
              ["telehealth",    "Telehealth"],
            ].map(([v, l]) => (
              <SelectItem key={v} value={v}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ─── Step 2B — Template picker ────────────────────────────────────────────────

function TemplateTile({ template, selected, onSelect }: {
  template: IntakeFormTemplate;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col gap-1 rounded-xl border p-3 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border hover:border-primary/40 hover:bg-muted/30",
      )}
    >
      <span className="text-[13px] font-medium text-foreground leading-tight">{template.name}</span>
      <span className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{template.description}</span>
    </button>
  );
}

function TemplateStep({
  selectedId, onSelect,
}: {
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-muted-foreground">
        Pick a starting point — you can customise it in the builder.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {MOCK_TEMPLATES.map((tpl) => (
          <TemplateTile
            key={tpl.id}
            template={tpl}
            selected={selectedId === tpl.id}
            onSelect={() => onSelect(tpl.id)}
          />
        ))}
      </div>
      {selectedId && (() => {
        const tpl = MOCK_TEMPLATES.find((t) => t.id === selectedId);
        if (!tpl) return null;
        return (
          <p className="text-[12px] text-muted-foreground">
            <span className="font-medium text-foreground">{tpl.name}</span>
            {" — "}{tpl.fieldCount === 0 ? "Blank canvas" : `${tpl.fieldCount} fields, ${tpl.stepCount} ${tpl.stepCount === 1 ? "step" : "steps"}`}
          </p>
        );
      })()}
    </div>
  );
}

// ─── Main dialog ──────────────────────────────────────────────────────────────

export interface IntakeFormCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: Mode | null;
  initialTemplateId?: string;
  onConfirm: (name: string, templateId?: string) => void;
}

export function IntakeFormCreateDialog({
  open,
  onOpenChange,
  initialMode,
  initialTemplateId,
  onConfirm,
}: IntakeFormCreateDialogProps) {
  const [step, setStep]               = useState<Step>("mode");
  const [prompt, setPrompt]           = useState("");
  const [specialty, setSpecialty]     = useState("");
  const [selectedTplId, setSelectedTplId] = useState<string | undefined>(initialTemplateId);
  const [formName, setFormName]       = useState("");

  // Sync external triggers (e.g. "Use template" from library)
  useEffect(() => {
    if (!open) {
      setStep("mode");
      setPrompt("");
      setSpecialty("");
      setFormName("");
    } else {
      if (initialMode === "ai") setStep("ai");
      else if (initialMode === "manual") setStep("template");
      if (initialTemplateId) setSelectedTplId(initialTemplateId);
    }
  }, [open, initialMode, initialTemplateId]);

  function handleConfirm() {
    const name = formName.trim() || (
      step === "ai"
        ? (prompt.trim().slice(0, 50) || "New intake form")
        : (MOCK_TEMPLATES.find((t) => t.id === selectedTplId)?.name ?? "New intake form")
    );
    onConfirm(name, selectedTplId);
  }

  const canConfirm =
    step === "ai"       ? prompt.trim().length >= 10
    : step === "template" ? !!selectedTplId
    : false;

  const title =
    step === "mode"     ? "New intake form"
    : step === "ai"       ? "Describe your form"
    : "Choose a starting point";

  const subtitle =
    step === "mode"     ? "How would you like to build it?"
    : step === "ai"       ? "AI will draft the fields — you refine them in the builder."
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col gap-0 overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-border px-6 pb-4 pt-6">
          <div className="flex items-center gap-2">
            {step !== "mode" && (
              <button
                type="button"
                onClick={() => setStep("mode")}
                className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Back"
              >
                <ChevronLeft className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                Back
              </button>
            )}
            <DialogTitle className="text-[15px]">{title}</DialogTitle>
          </div>
          {subtitle && (
            <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>
          )}
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === "mode" && (
            <div className="flex flex-col gap-3">
              {/* AI option */}
              <button
                type="button"
                onClick={() => setStep("ai")}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="size-4 text-primary" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-semibold text-foreground">Create with AI</span>
                  <span className="text-[13px] text-muted-foreground">
                    Describe what you need. AI drafts the fields — you refine in the builder.
                  </span>
                </div>
              </button>

              {/* Manual option */}
              <button
                type="button"
                onClick={() => setStep("template")}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/30"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <LayoutGrid className="size-4 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-semibold text-foreground">Build manually</span>
                  <span className="text-[13px] text-muted-foreground">
                    Start from a blank canvas or pick one of 10 ready-made templates.
                  </span>
                </div>
              </button>
            </div>
          )}

          {step === "ai" && (
            <AiStep
              prompt={prompt} setPrompt={setPrompt}
              specialty={specialty} setSpecialty={setSpecialty}
            />
          )}

          {step === "template" && (
            <TemplateStep
              selectedId={selectedTplId}
              onSelect={setSelectedTplId}
            />
          )}
        </div>

        {/* Footer */}
        {step !== "mode" && (
          <DialogFooter className="shrink-0 border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!canConfirm}
              onClick={handleConfirm}
            >
              {step === "ai" ? (
                <>
                  <Sparkles className="mr-1.5 size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                  Generate
                </>
              ) : (
                "Open in builder"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
