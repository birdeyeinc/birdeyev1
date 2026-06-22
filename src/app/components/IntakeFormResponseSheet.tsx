import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type IntakeFormSubmission, formatDateTime, formatDuration } from "./intakeFormsMockData";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function ResponseRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="text-[12px] text-foreground break-words">{value ?? "—"}</span>
    </div>
  );
}

function formatValue(value: string | string[] | boolean | null): React.ReactNode {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") {
    return value ? (
      <span className="flex items-center gap-1 text-emerald-600">
        <Check className="size-3" strokeWidth={2} aria-hidden /> Acknowledged
      </span>
    ) : "Not acknowledged";
  }
  if (Array.isArray(value)) return value.join(", ") || "—";
  return value || "—";
}

export interface IntakeFormResponseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: IntakeFormSubmission | null;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function IntakeFormResponseSheet({
  open, onOpenChange, submission,
  onPrev, onNext, hasPrev, hasNext,
}: IntakeFormResponseSheetProps) {
  if (!submission) return null;

  const initials = submission.patientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Group responses by rough category
  const CATEGORY_KEYS = [
    { label: "Demographics",   keywords: ["name", "birth", "gender", "phone", "email", "address", "language", "contact", "relation"] },
    { label: "Insurance",      keywords: ["insur", "member", "group", "subscriber", "policy"] },
    { label: "Medical history",keywords: ["allerg", "medic", "condit", "surg", "hospital", "family", "social", "smok", "alcohol"] },
    { label: "Chief complaint",keywords: ["reason", "chief", "pain", "duration", "symptom", "hpi"] },
    { label: "Consent",        keywords: ["hipaa", "consent", "treatment", "financial", "responsib", "authoriz", "agreement"] },
    { label: "Other",          keywords: [] },
  ];

  type GroupMap = Record<string, typeof submission.responses>;
  const groups: GroupMap = {};
  for (const cat of CATEGORY_KEYS) groups[cat.label] = [];

  for (const resp of submission.responses) {
    const lower = resp.fieldLabel.toLowerCase();
    let matched = false;
    for (const cat of CATEGORY_KEYS.slice(0, -1)) {
      if (cat.keywords.some((k) => lower.includes(k))) {
        groups[cat.label].push(resp);
        matched = true;
        break;
      }
    }
    if (!matched) groups["Other"].push(resp);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        inset="floating"
        floatingSize="md"
        className="flex flex-col gap-0 p-0 overflow-hidden"
      >
        {/* Header */}
        <SheetHeader className="shrink-0 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[12px] font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-[14px]">{submission.patientName}</SheetTitle>
              <p className="text-[11px] text-muted-foreground">
                {formatDateTime(submission.submittedOn)} · {formatDuration(submission.completionTimeSec)}
              </p>
            </div>
            <Badge variant={submission.status === "complete" ? "success" : "warning"} className="text-[10px] shrink-0">
              {submission.status === "complete" ? "Complete" : "Partial"}
            </Badge>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-6">
            {CATEGORY_KEYS.map(({ label }) => {
              const rows = groups[label];
              if (!rows || rows.length === 0) return null;
              return (
                <div key={label} className="flex flex-col gap-2.5">
                  <SectionLabel>{label}</SectionLabel>
                  <div className="flex flex-col gap-1.5">
                    {rows.map((resp) => (
                      <ResponseRow
                        key={resp.fieldId}
                        label={resp.fieldLabel}
                        value={formatValue(resp.value)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="shrink-0 border-t border-border px-5 py-3">
          <Button variant="outline" size="sm" className={cn(!hasPrev && "invisible")} onClick={onPrev}>
            <ChevronLeft className="mr-1 size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            Previous
          </Button>
          <Button variant="outline" size="sm" className={cn(!hasNext && "invisible")} onClick={onNext}>
            Next
            <ChevronRight className="ml-1 size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
