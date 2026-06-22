import { useState, useRef } from "react";
import {
  Zap,
  Sparkles,
  Upload,
  Mic,
  Play,
  Check,
  RefreshCw,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { TextTabsRow } from "@/app/components/ui/text-tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateTab = "instant-clone" | "voice-design";

// ─── Shared field primitives ──────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex items-center gap-1 text-[13px] font-medium text-foreground">
      {children}
      {required && <span className="text-destructive text-[11px]">*</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-[8px] border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
    />
  );
}

// ─── Instant Clone tab ────────────────────────────────────────────────────────

function InstantCloneTab() {
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      /\.(mp3|wav|m4a|ogg|flac|webm)$/i.test(f.name),
    );
    if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Voice name</FieldLabel>
        <TextInput
          value={name}
          onChange={setName}
          placeholder="e.g. My receptionist voice"
        />
      </div>

      {/* Upload drop zone */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Audio samples</FieldLabel>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 px-6 text-center transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-muted/30",
          )}
          role="button"
          aria-label="Upload audio files"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Upload className="size-[18px] text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-medium text-foreground">
              Drop files or click to upload
            </span>
            <span className="text-[12px] text-muted-foreground">
              MP3, WAV, M4A, OGG, FLAC · 1–2 min recommended
            </span>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".mp3,.wav,.m4a,.ogg,.flac,.webm"
            className="hidden"
            onChange={(e) => {
              const selected = Array.from(e.target.files ?? []);
              if (selected.length) setFiles((prev) => [...prev, ...selected]);
            }}
          />
        </div>

        {/* Uploaded file list */}
        {files.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-[12px]"
              >
                <span className="truncate text-foreground">{f.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles((prev) => prev.filter((_, j) => j !== i));
                  }}
                  className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-[12px] text-muted-foreground leading-[1.6]">
        <span className="font-medium text-foreground block mb-1">Tips for best results</span>
        Use 1–2 minutes of clean audio with no background noise or reverb.
        Avoid recording more than 3 minutes — it won't improve quality.
        Use a consistent speaking style throughout.
      </div>

      {/* Or divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[12px] text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Record button */}
      <Button variant="outline" type="button" className="w-full gap-2">
        <Mic className="size-[14px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
        Record in browser
      </Button>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer">
        <button
          type="button"
          role="checkbox"
          aria-checked={consent}
          onClick={() => setConsent((v) => !v)}
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
            consent ? "border-primary bg-primary" : "border-border bg-background",
          )}
        >
          {consent && <Check className="size-3 text-white" strokeWidth={2.5} aria-hidden />}
        </button>
        <span className="text-[12px] text-muted-foreground leading-[1.5]">
          I confirm I have obtained the right to clone this voice and that its use complies with
          applicable laws and Birdeye's terms of service.
        </span>
      </label>
    </div>
  );
}

// ─── Voice Design tab ─────────────────────────────────────────────────────────

const GENERATED_PREVIEWS = [
  { id: "g1", label: "Option A", color: "#2563eb" },
  { id: "g2", label: "Option B", color: "#16a34a" },
  { id: "g3", label: "Option C", color: "#9333ea" },
];

function VoiceDesignTab() {
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [accent, setAccent] = useState("");
  const [generated, setGenerated] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");

  const canGenerate = description.length >= 20 && !!gender && !!age && !!accent;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Description</FieldLabel>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the voice — e.g. 'A calm, warm middle-aged female with a slight Southern accent, well-suited for customer service.'"
          rows={3}
          maxLength={1000}
          className="w-full resize-none rounded-[8px] border border-border bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors leading-[1.5]"
        />
        <span className="text-right text-[11px] text-muted-foreground">{description.length}/1000</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Gender", value: gender, setter: setGender, options: [["male","Male"],["female","Female"],["neutral","Neutral"]] },
          { label: "Age",    value: age,    setter: setAge,    options: [["young","Young"],["middle-aged","Middle aged"],["old","Old"]] },
          { label: "Accent", value: accent, setter: setAccent, options: [["american","American"],["british","British"],["australian","Australian"],["indian","Indian"],["african","African"]] },
        ].map(({ label, value, setter, options }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <FieldLabel required>{label}</FieldLabel>
            <Select value={value} onValueChange={setter}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {options.map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {!generated && (
        <Button type="button" disabled={!canGenerate} className="w-full gap-2" onClick={() => setGenerated(true)}>
          <Sparkles className="size-[14px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          Generate voices
        </Button>
      )}

      {generated && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Choose a voice
            </span>
            <button
              type="button"
              onClick={() => { setGenerated(false); setSelectedPreview(null); }}
              className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="size-[12px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
              Regenerate
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {GENERATED_PREVIEWS.map((pv) => (
              <button
                key={pv.id}
                type="button"
                onClick={() => setSelectedPreview(pv.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  selectedPreview === pv.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <span
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                  style={{ backgroundColor: pv.color }}
                  aria-hidden
                >
                  {pv.label.at(-1)}
                </span>
                <span className="flex-1 text-[13px] text-foreground font-medium">{pv.label}</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-full"
                    aria-label={`Play ${pv.label}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Play className="size-[12px] text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                  </Button>
                  {selectedPreview === pv.id && (
                    <Check className="size-[14px] text-primary" strokeWidth={2} aria-hidden />
                  )}
                </div>
              </button>
            ))}
          </div>

          {selectedPreview && (
            <div className="flex flex-col gap-1.5 pt-1">
              <FieldLabel required>Voice name</FieldLabel>
              <TextInput
                value={saveName}
                onChange={setSaveName}
                placeholder="e.g. My generated voice"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main sheet ───────────────────────────────────────────────────────────────

export interface InboxVoiceCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InboxVoiceCreateDialog({ open, onOpenChange }: InboxVoiceCreateDialogProps) {
  const [tab, setTab] = useState<CreateTab>("instant-clone");

  const tabItems = [
    {
      id: "instant-clone" as CreateTab,
      label: (
        <span className="flex items-center gap-1.5">
          <Zap className="size-[13px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          Instant clone
        </span>
      ),
    },
    {
      id: "voice-design" as CreateTab,
      label: (
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-[13px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          Voice design
        </span>
      ),
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        inset="floating"
        floatingSize="lg"
        className="flex flex-col gap-0 p-0 overflow-hidden"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 shrink-0">
          <SheetTitle>Create voice</SheetTitle>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Clone a voice from audio samples or design one from scratch.
          </p>
        </SheetHeader>

        {/* Tabs */}
        <div className="px-6 pt-4 shrink-0">
          <TextTabsRow<CreateTab>
            items={tabItems}
            value={tab}
            onChange={setTab}
          />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "instant-clone" ? <InstantCloneTab /> : <VoiceDesignTab />}
        </div>

        {/* Footer */}
        <SheetFooter className="px-6 py-4 shrink-0 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" className="flex-1">
            {tab === "instant-clone" ? "Clone voice" : "Save voice"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
