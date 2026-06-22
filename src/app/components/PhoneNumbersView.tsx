import { useState, useEffect, useMemo, useRef } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Search, X, ChevronLeft, Check, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { Button } from "@/app/components/ui/button";
import { AppDataTable } from "@/app/components/ui/AppDataTable";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/app/components/ui/sheet";
import { Badge } from "@/app/components/ui/badge";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Input } from "@/app/components/ui/input";
import { SegmentedToggle } from "@/app/components/ui/segmented-toggle";
import {
  PHONE_NUMBER_ROWS, PHONE_NUMBER_AGENTS,
  type PhoneNumberRow, type PhoneNumberType,
} from "./phoneNumbersMockData";

// ─── Provider config ──────────────────────────────────────────────────────────

type Provider = "Twilio" | "Vonage" | "Bandwidth";

const PROVIDER_CONFIG: Record<Provider, {
  color: string;
  abbr: string;
  description: string;
  fields: Array<{ id: string; label: string; placeholder: string; type?: string }>;
}> = {
  Twilio: {
    color: "#f22f46",
    abbr: "Tw",
    description: "Connect using your Twilio Account SID and Auth Token.",
    fields: [
      { id: "sid",   label: "Account SID",  placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
      { id: "token", label: "Auth token",    placeholder: "Auth token", type: "password" },
    ],
  },
  Vonage: {
    color: "#7048e8",
    abbr: "Vx",
    description: "Connect using your Vonage API key and secret.",
    fields: [
      { id: "key",    label: "API key",    placeholder: "12a34b56" },
      { id: "secret", label: "API secret", placeholder: "API secret", type: "password" },
    ],
  },
  Bandwidth: {
    color: "#0055d4",
    abbr: "Bw",
    description: "Connect using your Bandwidth account ID and password.",
    fields: [
      { id: "account",  label: "Account ID", placeholder: "9000000" },
      { id: "password", label: "Password",   placeholder: "Password", type: "password" },
    ],
  },
};

const SAMPLE_CREDS: Record<Provider, Record<string, string>> = {
  Twilio:    { sid: "AC4f8a2e1d9c3b7f0e5a6d2c8b4e9f1a3d", token: "sk_twilio_demo_8x2kp9qn" },
  Vonage:    { key: "12a34b56", secret: "sk_vonage_demo_7zt3mn4q" },
  Bandwidth: { account: "9002847", password: "sk_bw_demo_5rk8xw2v" },
};

const MOCK_IMPORT_NUMBERS: Record<Provider, Array<{ number: string; type: PhoneNumberType; region: string }>> = {
  Twilio: [
    { number: "+1 (213) 550-0142", type: "Local",     region: "Los Angeles, CA" },
    { number: "+1 (212) 550-0138", type: "Local",     region: "New York, NY"    },
    { number: "+1 (888) 550-0199", type: "Toll-free", region: "US"              },
  ],
  Vonage: [
    { number: "+1 (415) 550-0187", type: "Local",     region: "San Francisco, CA" },
    { number: "+1 (312) 550-0155", type: "Local",     region: "Chicago, IL"        },
    { number: "+1 (877) 550-0144", type: "Toll-free", region: "US"                 },
  ],
  Bandwidth: [
    { number: "+1 (512) 550-0121", type: "Local",     region: "Austin, TX"  },
    { number: "+1 (469) 550-0133", type: "Local",     region: "Dallas, TX"  },
    { number: "+1 (866) 550-0166", type: "Toll-free", region: "US"          },
  ],
};

function generateAvailableNumbers(areaCode: string, type: PhoneNumberType) {
  const ac   = (areaCode || "512").slice(0, 3).padEnd(3, "0");
  const rate = type === "Local" ? "$1.15" : "$2.25";
  return [
    { number: `+1 (${ac}) 412-3845`, rate },
    { number: `+1 (${ac}) 571-2290`, rate },
    { number: `+1 (${ac}) 683-4417`, rate },
    { number: `+1 (${ac}) 724-9938`, rate },
  ];
}

let _idCounter = 100;
function nextId()      { return String(++_idCounter); }
function nextPhonumId() { return `phnum_${30000 + _idCounter}`; }

// ─── Agent select (sheet) ─────────────────────────────────────────────────────

function AgentSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value || "none"} onValueChange={(v) => onChange(v === "none" ? "" : v)}>
      <SelectTrigger className="h-9 w-full border-input bg-background text-[13px]" aria-label="Assign agent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-muted-foreground">No agent</span>
        </SelectItem>
        {PHONE_NUMBER_AGENTS.map((a) => (
          <SelectItem key={a} value={a}>{a}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Compact inline agent select (table cell) ─────────────────────────────────

function AgentSelectCell({ row, onUpdate }: { row: PhoneNumberRow; onUpdate: (id: string, agent: string | null) => void }) {
  return (
    <Select
      value={row.assignedAgent ?? "none"}
      onValueChange={(v) => onUpdate(row.id, v === "none" ? null : v)}
    >
      <SelectTrigger
        className="h-8 w-full max-w-[200px] border-transparent bg-transparent px-2 text-[13px] shadow-none hover:border-border hover:bg-white focus:border-ring dark:hover:bg-muted"
        aria-label="Assign agent"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-muted-foreground">No agent</span>
        </SelectItem>
        {PHONE_NUMBER_AGENTS.map((a) => (
          <SelectItem key={a} value={a}>{a}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Detail row helper ────────────────────────────────────────────────────────

function Row({ label, children, divider }: { label: string; children: React.ReactNode; divider?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between py-3 gap-4", divider && "border-t border-border/60")}>
      <span className="text-[13px] text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center justify-end">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] font-medium text-muted-foreground">{children}</span>;
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { dot: string; label: string; text: string; description: string }> = {
  active:       { dot: "bg-green-300",       label: "Active",       text: "text-green-300",        description: "Number is live and ready to make or receive calls."                                             },
  provisioning: { dot: "bg-amber-500",        label: "Provisioning", text: "text-amber-600",        description: "Number was just purchased and is being activated by the carrier. Usually takes a few minutes." },
  failed:       { dot: "bg-destructive",      label: "Failed",       text: "text-destructive",      description: "Provisioning failed. The number could not be activated. Contact support."                      },
  inactive:     { dot: "bg-muted-foreground", label: "Inactive",     text: "text-muted-foreground", description: "Number exists but is not currently in use. No calls will be routed."                           },
  released:     { dot: "bg-muted-foreground", label: "Released",     text: "text-muted-foreground", description: "Number has been released back to the carrier pool and is no longer yours."                     },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;
  const variant =
    status === "active"       ? "success"     :
    status === "provisioning" ? "warning"     :
    status === "failed"       ? "destructive" : "outline";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default">
          <Badge variant={variant as "success" | "warning" | "destructive" | "outline"}>{cfg.label}</Badge>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-left">{cfg.description}</TooltipContent>
    </Tooltip>
  );
}

function StatusDot({ status }: { status: string }) {
  const cfg       = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;
  const isPulsing = status === "provisioning";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("flex cursor-default items-center gap-1.5 text-[13px] font-medium", cfg.text)}>
          <span className={cn("size-2 rounded-full shrink-0", cfg.dot, isPulsing && "animate-pulse")} />
          {status === "active" ? "Ready for outbound calling" : cfg.label}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-left">{cfg.description}</TooltipContent>
    </Tooltip>
  );
}

// ─── Number radio option ──────────────────────────────────────────────────────

function NumberOption({
  number, sub, selected, onSelect,
}: {
  number: string; sub: string; selected: boolean; onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40",
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-foreground">{number}</span>
        <span className="text-[12px] text-muted-foreground">{sub}</span>
      </div>
      <div className={cn(
        "size-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
        selected ? "border-primary bg-primary" : "border-muted-foreground/40",
      )}>
        {selected && <Check size={10} strokeWidth={2.5} className="text-white" />}
      </div>
    </button>
  );
}

// ─── Import Number Sheet ──────────────────────────────────────────────────────

type ImportStep = "provider" | "credentials" | "fetching" | "selecting" | "importing";

function ImportNumberSheet({
  open, onClose, onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (row: Omit<PhoneNumberRow, "id" | "phonumId">) => void;
}) {
  const [step, setStep]         = useState<ImportStep>("provider");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [creds, setCreds]       = useState<Record<string, string>>({});

  function selectProvider(p: Provider) {
    setProvider(p);
    setCreds(SAMPLE_CREDS[p]);
  }
  const [selected, setSelected] = useState<string | null>(null);

  function reset() { setStep("provider"); setProvider(null); setCreds({}); setSelected(null); }
  useEffect(() => { if (!open) reset(); }, [open]);

  function handleConnect() {
    setStep("fetching");
    setTimeout(() => setStep("selecting"), 1800);
  }

  function handleImport() {
    if (!provider || !selected) return;
    setStep("importing");
    const found = MOCK_IMPORT_NUMBERS[provider].find((n) => n.number === selected);
    setTimeout(() => {
      onImport({
        number:        selected,
        assignedAgent: null,
        provider,
        type:          found?.type ?? "Local",
        status:        "provisioning",
        purchasedOn:   new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      });
      onClose();
    }, 1000);
  }

  const providerCfg = provider ? PROVIDER_CONFIG[provider] : null;
  const numbers     = provider ? MOCK_IMPORT_NUMBERS[provider] : [];
  const credsValid  = providerCfg?.fields.every((f) => creds[f.id]?.trim()) ?? false;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" inset="floating" floatingSize="md" className="flex flex-col">

        <SheetHeader className="px-6 pt-6 pb-2 shrink-0">
          {(step === "credentials" || step === "selecting") && (
            <button
              type="button"
              onClick={() => setStep(step === "credentials" ? "provider" : "credentials")}
              className="mb-2 flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground w-fit"
            >
              <ChevronLeft size={14} strokeWidth={1.6} absoluteStrokeWidth />
              Back
            </button>
          )}
          <SheetTitle className="text-xl font-bold">
            {step === "provider"    && "Import number"}
            {step === "credentials" && provider}
            {step === "fetching"    && "Connecting…"}
            {step === "selecting"   && "Available numbers"}
            {step === "importing"   && "Importing…"}
          </SheetTitle>
          <SheetDescription className="text-[13px] text-muted-foreground">
            {step === "provider"    && "Choose the provider your phone number is registered with."}
            {step === "credentials" && (providerCfg?.description ?? "")}
            {step === "fetching"    && `Connecting to ${provider}…`}
            {step === "selecting"   && `Pick a number to import from ${provider}.`}
            {step === "importing"   && "Adding your number to Bird AI…"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2">

          {step === "provider" && (
            <div className="flex flex-col gap-3">
              {(["Twilio", "Vonage", "Bandwidth"] as Provider[]).map((p) => {
                const cfg    = PROVIDER_CONFIG[p];
                const active = provider === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => selectProvider(p)}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors",
                      active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40",
                    )}
                  >
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white"
                      style={{ backgroundColor: cfg.color }}
                    >
                      {cfg.abbr}
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="text-[13px] font-semibold text-foreground">{p}</span>
                      <span className="text-[12px] text-muted-foreground leading-snug">{cfg.description}</span>
                    </div>
                    <div className={cn(
                      "size-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
                      active ? "border-primary bg-primary" : "border-muted-foreground/40",
                    )}>
                      {active && <Check size={10} strokeWidth={2.5} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {step === "credentials" && providerCfg && (
            <div className="flex flex-col gap-4">
              {providerCfg.fields.map((f) => (
                <div key={f.id} className="flex flex-col gap-1.5">
                  <FieldLabel>{f.label}</FieldLabel>
                  <Input
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    value={creds[f.id] ?? ""}
                    onChange={(e) => setCreds((prev) => ({ ...prev, [f.id]: e.target.value }))}
                    className="h-9 text-[13px]"
                  />
                </div>
              ))}
            </div>
          )}

          {step === "fetching" && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 size={28} strokeWidth={1.6} absoluteStrokeWidth className="animate-spin text-primary" />
              <span className="text-[13px] text-muted-foreground">Connecting to {provider}…</span>
            </div>
          )}

          {step === "selecting" && (
            <div className="flex flex-col gap-2">
              {numbers.map((n) => (
                <NumberOption
                  key={n.number}
                  number={n.number}
                  sub={`${n.type} · ${n.region}`}
                  selected={selected === n.number}
                  onSelect={() => setSelected(n.number)}
                />
              ))}
            </div>
          )}

          {step === "importing" && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 size={28} strokeWidth={1.6} absoluteStrokeWidth className="animate-spin text-primary" />
              <span className="text-[13px] text-muted-foreground">Importing {selected}…</span>
            </div>
          )}

        </div>

        <SheetFooter className="px-6 pb-6 pt-2 shrink-0 flex gap-2 justify-end">
          {step !== "fetching" && step !== "importing" && (
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          )}
          {step === "provider" && (
            <Button size="sm" disabled={!provider} onClick={() => setStep("credentials")}>
              Continue
            </Button>
          )}
          {step === "credentials" && (
            <Button size="sm" disabled={!credsValid} onClick={handleConnect}>
              Connect
            </Button>
          )}
          {step === "selecting" && (
            <Button size="sm" disabled={!selected} onClick={handleImport}>
              Import number
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Add Number Sheet ─────────────────────────────────────────────────────────

type AddStep = "config" | "searching" | "selecting" | "purchasing";

function AddNumberSheet({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (row: Omit<PhoneNumberRow, "id" | "phonumId">) => void;
}) {
  const [step, setStep]         = useState<AddStep>("config");
  const [areaCode, setAreaCode] = useState("");
  const [type, setType]         = useState<PhoneNumberType>("Local");
  const [selected, setSelected] = useState<string | null>(null);

  function reset() { setStep("config"); setAreaCode(""); setType("Local"); setSelected(null); }
  useEffect(() => { if (!open) reset(); }, [open]);

  function handleSearch() {
    setStep("searching");
    setTimeout(() => setStep("selecting"), 1500);
  }

  function handlePurchase() {
    if (!selected) return;
    setStep("purchasing");
    setTimeout(() => {
      onAdd({
        number:        selected,
        assignedAgent: null,
        provider:      "Twilio",
        type,
        status:        "provisioning",
        purchasedOn:   new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      });
      onClose();
    }, 1000);
  }

  const numbers     = generateAvailableNumbers(areaCode, type);
  const monthlyRate = type === "Local" ? "$1.15" : "$2.25";

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" inset="floating" floatingSize="md" className="flex flex-col">

        <SheetHeader className="px-6 pt-6 pb-2 shrink-0">
          {step === "selecting" && (
            <button
              type="button"
              onClick={() => setStep("config")}
              className="mb-2 flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground w-fit"
            >
              <ChevronLeft size={14} strokeWidth={1.6} absoluteStrokeWidth />
              Back
            </button>
          )}
          <SheetTitle className="text-xl font-bold">
            {step === "config"     && "Add number"}
            {step === "searching"  && "Searching…"}
            {step === "selecting"  && "Available numbers"}
            {step === "purchasing" && "Purchasing…"}
          </SheetTitle>
          <SheetDescription className="text-[13px] text-muted-foreground">
            {step === "config"     && "Purchase a new phone number for your agents."}
            {step === "searching"  && "Finding available numbers in your area…"}
            {step === "selecting"  && `${numbers.length} numbers found · ${monthlyRate}/month each`}
            {step === "purchasing" && "Completing your purchase…"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2">

          {step === "config" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <FieldLabel>Number type</FieldLabel>
                <SegmentedToggle
                  items={[
                    { value: "Local",     label: "Local"     },
                    { value: "Toll-free", label: "Toll-free" },
                  ]}
                  value={type}
                  onChange={(v) => setType(v as PhoneNumberType)}
                  ariaLabel="Number type"
                />
              </div>

              <div className="flex flex-col gap-2">
                <FieldLabel>Area code <span className="text-muted-foreground/60 font-normal">(optional)</span></FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">+1</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    placeholder="512"
                    value={areaCode}
                    onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className="h-9 pl-8 text-[13px] font-mono tracking-wide"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 px-4 py-3.5 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-medium text-foreground">{type} number</span>
                  <span className="text-[12px] text-muted-foreground">Billed monthly · cancel anytime</span>
                </div>
                <span className="text-[15px] font-semibold text-foreground">
                  {monthlyRate}<span className="text-[12px] font-normal text-muted-foreground">/mo</span>
                </span>
              </div>
            </div>
          )}

          {step === "searching" && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 size={28} strokeWidth={1.6} absoluteStrokeWidth className="animate-spin text-primary" />
              <span className="text-[13px] text-muted-foreground">Searching available numbers…</span>
            </div>
          )}

          {step === "selecting" && (
            <div className="flex flex-col gap-2">
              {numbers.map((n) => (
                <NumberOption
                  key={n.number}
                  number={n.number}
                  sub={`${type} · ${n.rate}/month`}
                  selected={selected === n.number}
                  onSelect={() => setSelected(n.number)}
                />
              ))}
            </div>
          )}

          {step === "purchasing" && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 size={28} strokeWidth={1.6} absoluteStrokeWidth className="animate-spin text-primary" />
              <span className="text-[13px] text-muted-foreground">Purchasing {selected}…</span>
            </div>
          )}

        </div>

        <SheetFooter className="px-6 pb-6 pt-2 shrink-0 flex gap-2 justify-end">
          {step !== "searching" && step !== "purchasing" && (
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          )}
          {step === "config" && (
            <Button size="sm" onClick={handleSearch}>Find numbers</Button>
          )}
          {step === "selecting" && (
            <Button size="sm" disabled={!selected} onClick={handlePurchase}>
              Purchase number
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Detail sheet ─────────────────────────────────────────────────────────────

function PhoneDetailSheet({
  row, open, onClose, onSave, onRelease,
}: {
  row: PhoneNumberRow | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, agent: string) => void;
  onRelease: (id: string) => void;
}) {
  const [agent, setAgent]                   = useState(row?.assignedAgent ?? "");
  const [releaseConfirm, setReleaseConfirm] = useState(false);

  useEffect(() => {
    if (open && row) { setAgent(row.assignedAgent ?? ""); setReleaseConfirm(false); }
  }, [open, row?.id]);

  if (!row) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" inset="floating" floatingSize="md" className="flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-2 shrink-0">
          <SheetTitle className="text-xl font-bold">{row.number}</SheetTitle>
          <SheetDescription className="sr-only">Phone number details</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col">

          <Row label="Status">
            <StatusDot status={row.status} />
          </Row>
          <Row label="Purchased on" divider>
            <span className="font-medium text-foreground">{row.purchasedOn}</span>
          </Row>
          <Row label="Number ID" divider>
            <span className="font-mono text-[12px] text-muted-foreground">{row.phonumId}</span>
          </Row>

          {/* Assigned agent */}
          <div className="mt-5 rounded-xl border border-border bg-background p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-foreground">Assigned agent</span>
              <span className="text-[12px] text-muted-foreground">Agent that handles calls to this phone number.</span>
            </div>
            <AgentSelect value={agent} onChange={setAgent} />
            <div className="flex justify-end pt-1">
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => { onSave(row.id, agent); onClose(); }}>
                Save
              </Button>
            </div>
          </div>

          {/* Provider / type */}
          <div className="mt-3 rounded-xl border border-border bg-background p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-muted-foreground">Provider</span>
              <span className="text-[13px] font-medium text-foreground">{row.provider}</span>
            </div>
            <div className="border-t border-border/60 pt-3 flex flex-col gap-1">
              <span className="text-[12px] text-muted-foreground">Number type</span>
              <span className="text-[13px] font-medium text-foreground">{row.type}</span>
            </div>
          </div>

          {/* Danger zone — release */}
          {row.status !== "released" && (
            <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-semibold text-foreground">Danger zone</span>
                <span className="text-[12px] text-muted-foreground leading-snug">
                  Releasing a number returns it to the carrier pool. This cannot be undone.
                </span>
              </div>
              {!releaseConfirm ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-fit border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                  onClick={() => setReleaseConfirm(true)}
                >
                  Release number
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5">
                    <AlertTriangle size={14} strokeWidth={1.6} absoluteStrokeWidth className="mt-0.5 shrink-0 text-destructive" />
                    <span className="text-[12px] text-destructive leading-snug">
                      Release <span className="font-semibold">{row.number}</span>? It will no longer be yours.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setReleaseConfirm(false)}>Cancel</Button>
                    <Button
                      size="sm"
                      className="bg-destructive text-white hover:bg-destructive/90"
                      onClick={() => { onRelease(row.id); onClose(); }}
                    >
                      Confirm release
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        <SheetFooter className="px-6 pb-6 pt-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const colHelper = createColumnHelper<PhoneNumberRow>();

// ─── Main view ────────────────────────────────────────────────────────────────

export interface PhoneNumbersViewProps {
  initialRows?: PhoneNumberRow[];
}

export function PhoneNumbersView({ initialRows = PHONE_NUMBER_ROWS }: PhoneNumbersViewProps) {
  const [rows, setRows]             = useState<PhoneNumberRow[]>(initialRows);
  const [search, setSearch]         = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen]   = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [addOpen, setAddOpen]       = useState(false);

  const scheduledRef = useRef<Set<string>>(new Set());

  // Auto-transition provisioning → active after 5 s
  useEffect(() => {
    rows
      .filter((r) => r.status === "provisioning" && !scheduledRef.current.has(r.id))
      .forEach((r) => {
        scheduledRef.current.add(r.id);
        setTimeout(() => {
          setRows((prev) => prev.map((row) =>
            row.id === r.id && row.status === "provisioning" ? { ...row, status: "active" } : row,
          ));
        }, 5000);
      });
  }, [rows]);

  const selectedRow = rows.find((r) => r.id === selectedId) ?? null;

  function handleAgentSave(id: string, agent: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, assignedAgent: agent || null } : r)));
  }

  function handleRelease(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "released" } : r)));
  }

  function handleImport(partial: Omit<PhoneNumberRow, "id" | "phonumId">) {
    const id = nextId();
    setRows((prev) => [{ ...partial, id, phonumId: nextPhonumId() }, ...prev]);
  }

  function handleAdd(partial: Omit<PhoneNumberRow, "id" | "phonumId">) {
    const id = nextId();
    setRows((prev) => [{ ...partial, id, phonumId: nextPhonumId() }, ...prev]);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q === "" ? rows : rows.filter(
      (r) => r.number.toLowerCase().includes(q) || r.phonumId.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const columns = useMemo(() => [
    colHelper.accessor("number", {
      id: "number",
      header: "Phone number",
      size: 220,
      meta: { settingsLabel: "Phone number" },
      cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
    }),
    colHelper.accessor("assignedAgent", {
      id: "assignedAgent",
      header: "Assigned agent",
      size: 220,
      meta: { settingsLabel: "Assigned agent", stopRowClick: true },
      cell: (info) => <AgentSelectCell row={info.row.original} onUpdate={handleAgentSave} />,
      sortingFn: (a, b) => (a.original.assignedAgent ?? "").localeCompare(b.original.assignedAgent ?? ""),
    }),
    colHelper.accessor("provider", {
      id: "provider",
      header: "Provider",
      size: 140,
      meta: { settingsLabel: "Provider" },
      cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
    }),
    colHelper.accessor("type", {
      id: "type",
      header: "Type",
      size: 120,
      meta: { settingsLabel: "Type" },
      cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
    }),
    colHelper.accessor("status", {
      id: "status",
      header: "Status",
      size: 110,
      meta: { settingsLabel: "Status" },
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    colHelper.accessor("purchasedOn", {
      id: "purchasedOn",
      header: "Purchased on",
      size: 140,
      meta: { settingsLabel: "Purchased on" },
      cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
    }),
  ], [rows]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <MainCanvasViewHeader
        title="Phone numbers"
        description="Manage all business phone numbers used by agent workflows."
        actions={
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="relative h-[var(--button-height)] w-[240px]">
                <Search
                  className="pointer-events-none absolute left-2 top-1/2 size-[14px] -translate-y-1/2 text-gray-600 dark:text-muted-foreground"
                  strokeWidth={1.6} absoluteStrokeWidth aria-hidden
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => { if (search === "") setSearchOpen(false); }}
                  onKeyDown={(e) => { if (e.key === "Escape") { setSearch(""); setSearchOpen(false); } }}
                  autoFocus
                  placeholder="Search phone numbers"
                  className="h-full w-full rounded-[8px] border border-new-selected-color bg-white py-0 pr-8 pl-8 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-100 focus:border-brand-color focus:ring-1 focus:ring-brand-color dark:border-border dark:bg-muted dark:text-foreground dark:placeholder:text-gray-90"
                  aria-label="Search phone numbers"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => { setSearch(""); setSearchOpen(false); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={13} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                  </button>
                )}
              </div>
            ) : (
              <Button
                type="button" variant="outline" size="icon"
                aria-label="Search" title="Search phone numbers"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="size-[14px] text-gray-600 dark:text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
              </Button>
            )}

            <Button type="button" variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              Import number
            </Button>
            <Button type="button" size="sm" onClick={() => setAddOpen(true)}>
              Add number
            </Button>
          </div>
        }
      />

      <div className="flex-1 flex flex-col min-h-0 px-6 py-4">
        <AppDataTable<PhoneNumberRow>
          scrollableBody
          tableId="phone-numbers"
          data={filtered}
          columns={columns}
          getRowId={(r) => r.id}
          initialSorting={[{ id: "number", desc: false }]}
          hideColumnsButton
          onRowClick={(row) => { setSelectedId(row.id); setSheetOpen(true); }}
          className="min-w-0 px-0"
          emptyState={
            <div className="py-12 text-center text-sm text-muted-foreground">
              No phone numbers match your search.
            </div>
          }
        />
      </div>

      <PhoneDetailSheet
        row={selectedRow}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={handleAgentSave}
        onRelease={handleRelease}
      />

      <ImportNumberSheet
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />

      <AddNumberSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
