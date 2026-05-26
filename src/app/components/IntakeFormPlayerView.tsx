import { useState } from "react";
import { X, Star, Check, ChevronLeft } from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input.v1";
import { Textarea } from "@/app/components/ui/textarea.v1";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/components/ui/select.v1";
import { type IntakeForm, type IntakeFormField } from "./intakeFormsMockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldValue = string | string[] | boolean | null;
type FormValues = Record<string, FieldValue>;

// ─── Individual field renderers ───────────────────────────────────────────────

function FieldError({ msg }: { msg: string | undefined }) {
  if (!msg) return null;
  return <p className="text-[12px] text-destructive">{msg}</p>;
}

function ShortTextField({ field, value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Input
        type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={cn("text-[14px]", error && "border-destructive focus:border-destructive focus:ring-destructive")}
      />
      {field.helpText && <p className="text-[12px] text-muted-foreground">{field.helpText}</p>}
      <FieldError msg={error} />
    </div>
  );
}

function LongTextField({ field, value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  const max = 500;
  return (
    <div className="flex flex-col gap-1.5">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        placeholder={field.placeholder}
        rows={4}
        className={cn("text-[14px] resize-none", error && "border-destructive")}
      />
      <div className="flex items-center justify-between">
        {field.helpText && <p className="text-[12px] text-muted-foreground">{field.helpText}</p>}
        <span className="ml-auto text-[11px] text-muted-foreground">{(value ?? "").length} / {max}</span>
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function DateField({ field, value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-9 w-full rounded-[8px] border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors",
          error && "border-destructive",
        )}
      />
      <FieldError msg={error} />
    </div>
  );
}

function DropdownField({ field, value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn("text-[14px]", error && "border-destructive")}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {(field.options ?? []).map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError msg={error} />
    </div>
  );
}

function RadioField({ field, value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {(field.options ?? []).map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => onChange(opt)}
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors cursor-pointer",
              value === opt ? "border-primary" : "border-border",
            )}
          >
            {value === opt && <div className="size-2 rounded-full bg-primary" />}
          </div>
          <span className="text-[14px] text-foreground">{opt}</span>
        </label>
      ))}
      <FieldError msg={error} />
    </div>
  );
}

function CheckboxField({ field, value, onChange, error }: {
  field: IntakeFormField; value: string[]; onChange: (v: string[]) => void; error?: string;
}) {
  function toggle(opt: string) {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  }
  return (
    <div className="flex flex-col gap-2">
      {(field.options ?? []).map((opt) => {
        const checked = value.includes(opt);
        return (
          <label key={opt} className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => toggle(opt)}
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded border-2 transition-colors cursor-pointer",
                checked ? "border-primary bg-primary" : "border-border",
              )}
            >
              {checked && <Check className="size-2.5 text-white" strokeWidth={2.5} aria-hidden />}
            </div>
            <span className="text-[14px] text-foreground">{opt}</span>
          </label>
        );
      })}
      <FieldError msg={error} />
    </div>
  );
}

function YesNoField({ value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "flex-1 rounded-lg border-2 py-2.5 text-[14px] font-medium transition-colors",
              value === opt
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-foreground hover:border-primary/40",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function RatingField({ field, value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  const max = field.maxStars ?? 5;
  const current = Number(value) || 0;
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < (hover || current);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(String(i + 1))}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
              aria-label={`Rate ${i + 1} of ${max}`}
            >
              <Star
                className={cn("size-7 transition-colors", filled ? "fill-amber-400 text-amber-400" : "fill-none text-border")}
                strokeWidth={1.6}
                absoluteStrokeWidth
                aria-hidden
              />
            </button>
          );
        })}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function NpsField({ value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  const current = value !== "" ? Number(value) : null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 11 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(String(i))}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg border text-[14px] font-medium transition-colors",
              current === i
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary/40 hover:bg-muted",
            )}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>Not at all likely</span>
        <span>Extremely likely</span>
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function PainScaleField({ value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  const current = value !== "" ? Number(value) : null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: 11 }).map((_, i) => {
          const color =
            i <= 3 ? "border-emerald-300 hover:bg-emerald-50"
            : i <= 6 ? "border-amber-300 hover:bg-amber-50"
            : "border-rose-300 hover:bg-rose-50";
          const activeColor =
            i <= 3 ? "bg-emerald-500 border-emerald-500 text-white"
            : i <= 6 ? "bg-amber-500 border-amber-500 text-white"
            : "bg-rose-500 border-rose-500 text-white";
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(String(i))}
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg border text-[13px] font-medium transition-colors",
                current === i ? activeColor : cn("border-border text-foreground", color),
              )}
            >
              {i}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>No pain</span>
        <span>Worst imaginable</span>
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function MatrixField({ field, value, onChange, error }: {
  field: IntakeFormField; value: Record<string, string>; onChange: (v: Record<string, string>) => void; error?: string;
}) {
  const rows = field.matrixRows ?? [];
  const cols = field.matrixCols ?? ["Yes", "No"];
  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 rounded-lg border border-border text-[13px]">
        <thead>
          <tr>
            <th className="border-b border-r border-border bg-muted/40 px-3 py-2 text-left font-normal text-muted-foreground" />
            {cols.map((col) => (
              <th key={col} className="border-b border-r border-border bg-muted/40 px-3 py-2 text-center font-medium text-foreground last:border-r-0">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row} className={ri % 2 === 0 ? "" : "bg-muted/10"}>
              <td className="border-b border-r border-border px-3 py-2 text-foreground last-of-type:border-b-0">
                {row}
              </td>
              {cols.map((col) => (
                <td key={col} className="border-b border-r border-border px-3 py-2 text-center last:border-r-0 last-of-type:border-b-0">
                  <div
                    onClick={() => onChange({ ...value, [row]: col })}
                    className={cn(
                      "mx-auto flex size-4 cursor-pointer items-center justify-center rounded-full border-2 transition-colors",
                      value[row] === col ? "border-primary" : "border-border",
                    )}
                  >
                    {value[row] === col && <div className="size-2 rounded-full bg-primary" />}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <FieldError msg={error} />
    </div>
  );
}

function ConsentField({ field, value, onChange, error }: {
  field: IntakeFormField; value: boolean; onChange: (v: boolean) => void; error?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {field.consentText && (
        <div className="max-h-36 overflow-y-auto rounded-lg border border-border bg-muted/20 px-4 py-3 text-[12px] text-muted-foreground leading-relaxed">
          {field.consentText}
        </div>
      )}
      <label className="flex items-start gap-3 cursor-pointer">
        <div
          onClick={() => onChange(!value)}
          className={cn(
            "mt-0.5 flex size-4 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors",
            value ? "border-primary bg-primary" : "border-border",
            error && !value && "border-destructive",
          )}
        >
          {value && <Check className="size-2.5 text-white" strokeWidth={2.5} aria-hidden />}
        </div>
        <span className="text-[13px] text-foreground">{field.label}</span>
      </label>
      <FieldError msg={error} />
    </div>
  );
}

function SignatureField({ value, onChange, error }: {
  field: IntakeFormField; value: string; onChange: (v: string) => void; error?: string;
}) {
  const [signed, setSigned] = useState(!!value);
  return (
    <div className="flex flex-col gap-2">
      <div className={cn(
        "flex h-24 items-center justify-center rounded-xl border-2 border-dashed bg-muted/10 transition-colors",
        signed ? "border-primary/40" : "border-border",
        error && !signed && "border-destructive",
      )}>
        {signed ? (
          <div className="flex flex-col items-center gap-1">
            <span className="font-['Georgia',serif] text-xl text-foreground italic">Signed</span>
            <button type="button" onClick={() => { setSigned(false); onChange(""); }}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Clear</button>
          </div>
        ) : (
          <button type="button" onClick={() => { setSigned(true); onChange("signed"); }}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-[13px]">Click to sign</span>
            <span className="text-[11px]">(tap or draw your signature)</span>
          </button>
        )}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function FileUploadField({ field, value, onChange, error }: {
  field: IntakeFormField; value: string[]; onChange: (v: string[]) => void; error?: string;
}) {
  const [files, setFiles] = useState<string[]>(value);
  function addFile() {
    const name = `document_${files.length + 1}.pdf`;
    const next = [...files, name];
    setFiles(next);
    onChange(next);
  }
  function removeFile(i: number) {
    const next = files.filter((_, j) => j !== i);
    setFiles(next);
    onChange(next);
  }
  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={addFile}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/10 py-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/20"
      >
        <span className="text-[13px] font-medium text-foreground">Drop files or click to upload</span>
        <span className="text-[11px] text-muted-foreground">
          {(field.allowedFileTypes ?? []).join(", ").toUpperCase()} · max {field.maxFiles ?? 3} files
        </span>
      </div>
      {files.length > 0 && (
        <ul className="flex flex-col gap-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2 text-[12px]">
              <span className="truncate text-foreground">{f}</span>
              <button type="button" onClick={() => removeFile(i)}
                className="ml-2 shrink-0 text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove file">✕</button>
            </li>
          ))}
        </ul>
      )}
      <FieldError msg={error} />
    </div>
  );
}

// ─── Field dispatcher ─────────────────────────────────────────────────────────

function FieldRenderer({ field, value, onChange, error }: {
  field: IntakeFormField;
  value: FieldValue;
  onChange: (v: FieldValue) => void;
  error?: string;
}) {
  const { type } = field;

  if (type === "section_header") {
    return (
      <div className="pt-2">
        <h3 className="text-[15px] font-semibold text-foreground">{field.label}</h3>
        {field.helpText && <p className="text-[13px] text-muted-foreground mt-0.5">{field.helpText}</p>}
      </div>
    );
  }
  if (type === "divider") return <hr className="border-border" />;

  const str = (value as string) ?? "";
  const arr = (value as string[]) ?? [];
  const bool = (value as boolean) ?? false;

  if (type === "short_text" || type === "email" || type === "phone")
    return <ShortTextField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "long_text")
    return <LongTextField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "date")
    return <DateField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "dropdown")
    return <DropdownField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "radio")
    return <RadioField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "checkbox")
    return <CheckboxField field={field} value={arr} onChange={(v) => onChange(v)} error={error} />;
  if (type === "yes_no")
    return <YesNoField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "rating")
    return <RatingField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "nps")
    return <NpsField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "pain_scale")
    return <PainScaleField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "matrix")
    return <MatrixField field={field} value={(value as Record<string, string>) ?? {}} onChange={(v) => onChange(v as unknown as FieldValue)} error={error} />;
  if (type === "consent")
    return <ConsentField field={field} value={bool} onChange={(v) => onChange(v)} error={error} />;
  if (type === "signature")
    return <SignatureField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
  if (type === "file_upload" || type === "photo_capture")
    return <FileUploadField field={field} value={arr} onChange={(v) => onChange(v)} error={error} />;

  return <ShortTextField field={field} value={str} onChange={(v) => onChange(v)} error={error} />;
}

// ─── Confirmation screen ──────────────────────────────────────────────────────

function ConfirmationScreen({ patientName, confirmationMessage, onClose }: {
  patientName: string;
  confirmationMessage: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-emerald-50">
        <Check className="size-10 text-emerald-500" strokeWidth={2} aria-hidden />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold text-foreground">
          Thank you{patientName ? `, ${patientName.split(" ")[0]}` : ""}!
        </h2>
        <p className="max-w-sm text-[14px] text-muted-foreground">
          {confirmationMessage || "Your intake form has been submitted. We'll see you at your appointment."}
        </p>
      </div>
      <Button onClick={onClose} variant="outline">Close</Button>
    </div>
  );
}

// ─── Main player ──────────────────────────────────────────────────────────────

export interface IntakeFormPlayerViewProps {
  form: IntakeForm;
  onClose: () => void;
  onSubmit: () => void;
}

export function IntakeFormPlayerView({ form, onClose, onSubmit }: IntakeFormPlayerViewProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [values, setValues]   = useState<FormValues>({});
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const steps = form.steps.length > 0 ? form.steps : [{ id: "s1", title: "Page 1", fields: [] }];
  const currentStep = steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast  = stepIdx === steps.length - 1;
  const progress = Math.round(((stepIdx + 1) / steps.length) * 100);

  function getValue(fieldId: string): FieldValue {
    return values[fieldId] ?? null;
  }

  function setValue(fieldId: string, value: FieldValue) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[fieldId]; return next; });
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of currentStep.fields) {
      if (!field.required) continue;
      const v = values[field.id];
      const empty =
        v === null || v === undefined || v === "" ||
        (Array.isArray(v) && v.length === 0) ||
        (typeof v === "boolean" && !v);
      if (empty) newErrors[field.id] = "This field is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    if (isLast) {
      setSubmitted(true);
      onSubmit();
    } else {
      setStepIdx((i) => i + 1);
    }
  }

  const patientName = (values["f-name"] as string) ?? "";

  if (submitted) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-background">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
          <span className="text-[14px] font-semibold text-foreground">{form.name}</span>
          <button type="button" onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors" aria-label="Close">
            <X className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          </button>
        </div>
        <ConfirmationScreen patientName={patientName} confirmationMessage="" onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Business / header bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
            B
          </div>
          <span className="text-[13px] font-medium text-foreground">{form.name}</span>
        </div>
        <button type="button" onClick={onClose}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors" aria-label="Close preview">
          <X className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
        </button>
      </div>

      {/* Progress + step label */}
      <div className="shrink-0 border-b border-border px-6 py-3">
        <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-2">
          <span>Step {stepIdx + 1} of {steps.length} · {currentStep.title}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-6 py-8">
          <div className="flex flex-col gap-6">
            {currentStep.fields.map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                {field.type !== "section_header" && field.type !== "divider" && (
                  <label className="text-[14px] font-medium text-foreground">
                    {field.label}
                    {field.required && <span className="ml-1 text-destructive">*</span>}
                  </label>
                )}
                <FieldRenderer
                  field={field}
                  value={getValue(field.id)}
                  onChange={(v) => setValue(field.id, v)}
                  error={errors[field.id]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between border-t border-border bg-background px-6 py-4">
        {!isFirst ? (
          <Button variant="outline" onClick={() => setStepIdx((i) => i - 1)}>
            <ChevronLeft className="mr-1 size-3.5" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            Back
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={handleNext}>
          {isLast ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
