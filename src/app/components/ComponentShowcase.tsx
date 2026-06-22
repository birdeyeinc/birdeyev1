import { useState } from "react";
import {
  Eye, EyeOff, Check, X, Copy, Link2, ChevronDown, ChevronRight,
  Sun, Moon, Monitor, Sparkles, Settings, Share2, Download,
  Plus, Minus, Search, Bell, Trash2, Edit3, MoreHorizontal,
  ArrowLeft, ArrowRight, Loader2, Info, AlertTriangle, CheckCircle2,
  XCircle,
} from "lucide-react";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { useTheme } from "./useTheme";

/* ══════════════════════════════════════════════════
   Design token palette
   ══════════════════════════════════════════════════ */
const darkPalette = [
  { token: "--bg-body",       hex: "#13161b", label: "Body background" },
  { token: "--bg-sidebar",    hex: "#181b22", label: "Sidebar / TopBar" },
  { token: "--bg-surface-1",  hex: "#1e2229", label: "Surface 1 (cards)" },
  { token: "--bg-surface-2",  hex: "#22262f", label: "Surface 2 (popover)" },
  { token: "--bg-surface-3",  hex: "#262b35", label: "Surface 3 (inputs)" },
  { token: "--bg-hover",      hex: "#2e3340", label: "Hover state" },
  { token: "--border-subtle",  hex: "#333a47", label: "Border subtle" },
  { token: "--border-strong",  hex: "#3d4555", label: "Border strong" },
  { token: "--text-muted",    hex: "#8b92a5", label: "Muted text" },
];

const lightPalette = [
  { token: "--bg-body",       hex: "#e0e5eb", label: "Body background" },
  { token: "--bg-sidebar",    hex: "#ffffff", label: "Card / sidebar" },
  { token: "--bg-surface-1",  hex: "#f8f9fa", label: "Surface 1" },
  { token: "--bg-surface-2",  hex: "#f2f4f7", label: "Surface 2 (canvas)" },
  { token: "--bg-hover",      hex: "#f5f5f5", label: "Hover state" },
  { token: "--border-subtle",  hex: "#e5e9f0", label: "Border subtle" },
  { token: "--border-strong",  hex: "#d0d5dc", label: "Border strong" },
  { token: "--text-primary",  hex: "#212121", label: "Primary text" },
  { token: "--text-muted",    hex: "#999999", label: "Muted text" },
];

const accentColor = "#2552ED";

/* ══════════════════════════════════════════════════
   Section wrapper
   ══════════════════════════════════════════════════ */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-new-selected-color dark:border-border rounded-xl bg-white dark:bg-background transition-colors duration-300 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-10 dark:hover:bg-muted transition-colors"
      >
        <span className="text-[13px] text-gray-900 dark:text-foreground" style={{ fontWeight: 400 }}>{title}</span>
        <ChevronRight
          className={`w-4 h-4 text-gray-90 dark:text-muted-foreground transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-20 dark:border-border">
          {children}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Row helper
   ══════════════════════════════════════════════════ */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-2.5">
      <span className="w-[120px] shrink-0 text-[11px] text-gray-90 dark:text-muted-foreground pt-1.5">{label}</span>
      <div className="flex-1 flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Component Showcase
   ══════════════════════════════════════════════════ */
export function ComponentShowcase() {
  const { isDark } = useTheme();
  const [toggleA, setToggleA] = useState(true);
  const [toggleB, setToggleB] = useState(false);
  const [activeTab, setActiveTab] = useState("share");
  const [radio, setRadio] = useState("light");
  const [checked, setChecked] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [sliderVal, setSliderVal] = useState(75);
  const palette = isDark ? darkPalette : lightPalette;

  return (
    <div className="flex-1 overflow-y-auto bg-new-hover-color dark:bg-app-shell-gutter transition-colors duration-300">
      <div className="max-w-[860px] mx-auto px-6 py-8 space-y-4">

        <MainCanvasViewHeader
          className="px-0 pt-0"
          title="Component showcase"
          description="Design system primitives with full light / dark mode parity. All interaction states shown."
        />

        {/* ── Color Tokens ── */}
        <Section title="Color tokens">
          <p className="text-[11px] text-gray-90 dark:text-muted-foreground mb-3">{isDark ? "Dark" : "Light"} mode palette (bluish-grey, not pure black)</p>
          <div className="grid grid-cols-3 gap-2">
            {palette.map(c => (
              <div key={c.token} className="flex items-center gap-2.5 bg-gray-10 dark:bg-muted rounded-lg px-3 py-2 border border-gray-20 dark:border-border">
                <div className="w-7 h-7 rounded-md border border-new-selected-color dark:border-border shrink-0" style={{ backgroundColor: c.hex }} />
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-900 dark:text-foreground truncate" style={{ fontWeight: 400 }}>{c.hex}</p>
                  <p className="text-[9px] text-gray-90 dark:text-muted-foreground truncate">{c.label}</p>
                </div>
              </div>
            ))}
            {/* Accent */}
            <div className="flex items-center gap-2.5 bg-gray-10 dark:bg-muted rounded-lg px-3 py-2 border border-gray-20 dark:border-border">
              <div className="w-7 h-7 rounded-md border border-new-selected-color dark:border-border shrink-0" style={{ backgroundColor: accentColor }} />
              <div className="min-w-0">
                <p className="text-[11px] text-gray-900 dark:text-foreground truncate" style={{ fontWeight: 400 }}>{accentColor}</p>
                <p className="text-[9px] text-gray-90 dark:text-muted-foreground truncate">Accent / primary</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography">
          <p className="text-[11px] text-gray-90 dark:text-muted-foreground mb-3">Inter only &middot; weight 400 (medium) + 300 (light) &middot; sentence case everywhere</p>
          <div className="space-y-3">
            <div>
              <span className="text-[18px] text-gray-900 dark:text-foreground" style={{ fontWeight: 400 }}>Heading large &mdash; 18px / 400</span>
            </div>
            <div>
              <span className="text-[15px] text-gray-900 dark:text-foreground" style={{ fontWeight: 400 }}>Heading medium &mdash; 15px / 400</span>
            </div>
            <div>
              <span className="text-[13px] text-gray-900 dark:text-foreground" style={{ fontWeight: 400 }}>Body text &mdash; 13px / 400</span>
            </div>
            <div>
              <span className="text-[12px] text-gray-300 dark:text-muted-foreground font-regular">Secondary text &mdash; 12px / 400</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-90 dark:text-muted-foreground font-regular">Caption / label &mdash; 11px / 400</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-70 dark:text-muted-foreground font-regular">Micro &mdash; 10px / 400</span>
            </div>
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Buttons">
          <Row label="Primary">
            <button className="px-4 py-[6px] text-[12px] text-white rounded-[8px] transition-all shadow-sm hover:shadow" style={{ fontWeight: 400, backgroundColor: accentColor }}>
              Default
            </button>
            <button className="px-4 py-[6px] text-[12px] text-white rounded-[8px] transition-all shadow-sm" style={{ fontWeight: 400, backgroundColor: accentColor, filter: "brightness(0.92)" }}>
              Hover
            </button>
            <button className="px-4 py-[6px] text-[12px] text-white rounded-[8px] transition-all shadow-sm" style={{ fontWeight: 400, backgroundColor: accentColor, filter: "brightness(0.85)" }}>
              Active
            </button>
            <button className="px-4 py-[6px] text-[12px] text-white rounded-[8px] opacity-50 cursor-not-allowed" style={{ fontWeight: 400, backgroundColor: accentColor }}>
              Disabled
            </button>
            <button className="px-4 py-[6px] text-[12px] text-white rounded-[8px] flex items-center gap-1.5" style={{ fontWeight: 400, backgroundColor: accentColor }}>
              <Loader2 className="w-3 h-3 animate-spin" /> Loading
            </button>
          </Row>
          <Row label="Secondary">
            <button className="px-3 py-[6px] text-[12px] text-gray-200 dark:text-muted-foreground rounded-[8px] hover:bg-gray-20 dark:hover:bg-muted border border-new-selected-color dark:border-border transition-colors" style={{ fontWeight: 400 }}>
              Cancel
            </button>
            <button className="px-3 py-[6px] text-[12px] text-gray-200 dark:text-muted-foreground rounded-[8px] bg-gray-20 dark:bg-muted border border-new-selected-color dark:border-border" style={{ fontWeight: 400 }}>
              Hover
            </button>
            <button className="px-3 py-[6px] text-[12px] text-gray-200 dark:text-muted-foreground rounded-[8px] opacity-50 cursor-not-allowed border border-new-selected-color dark:border-border" style={{ fontWeight: 400 }}>
              Disabled
            </button>
          </Row>
          <Row label="Ghost / icon">
            <button className="p-1.5 rounded-full hover:bg-gray-20 dark:hover:bg-muted text-gray-300 dark:text-muted-foreground transition-colors">
              <Settings className="w-[14px] h-[14px]" />
            </button>
            <button className="p-1.5 rounded-full bg-gray-20 dark:bg-muted text-gray-300 dark:text-muted-foreground transition-colors">
              <Edit3 className="w-[14px] h-[14px]" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-red-20 dark:hover:bg-red-400 text-red-90 transition-colors">
              <Trash2 className="w-[14px] h-[14px]" />
            </button>
            <button className="p-1.5 rounded-full text-gray-60 dark:text-muted-foreground cursor-not-allowed">
              <MoreHorizontal className="w-[14px] h-[14px]" />
            </button>
          </Row>
          <Row label="AI / gradient">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] hover:bg-purple-20 dark:hover:bg-blue-300 transition-colors group border border-purple-40 dark:border-purple-500">
              <Sparkles className="w-3.5 h-3.5 text-purple-80" />
              <span className="text-[11px] bg-gradient-to-r from-purple-80 to-brand-color bg-clip-text text-transparent" style={{ fontWeight: 400 }}>
                Customise with BirdAI
              </span>
            </button>
          </Row>
        </Section>

        {/* ── Inputs ── */}
        <Section title="Inputs">
          <Row label="Text input">
            <div className="flex-1 max-w-[280px]">
              <input
                type="text"
                placeholder="Placeholder text..."
                className="w-full h-[36px] px-3 text-[12px] text-gray-500 dark:text-foreground placeholder:text-gray-70 dark:placeholder:text-muted-foreground border border-gray-20 dark:border-border rounded-lg bg-white dark:bg-muted outline-none focus:border-blue-70 dark:focus:border-blue-80 focus:shadow-[0_0_0_3px_rgba(37,82,237,0.08)] dark:focus:shadow-[0_0_0_3px_rgba(37,82,237,0.2)] transition-all"
              />
            </div>
          </Row>
          <Row label="Search">
            <div className="flex items-center gap-2 px-3 py-[7px] bg-gray-10 dark:bg-muted border border-new-selected-color dark:border-border rounded-lg w-[280px]">
              <Search className="w-3.5 h-3.5 text-gray-70 dark:text-muted-foreground" />
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search..."
                className="flex-1 text-[12px] text-gray-500 dark:text-foreground placeholder:text-gray-70 dark:placeholder:text-gray-100 bg-transparent outline-none"
              />
            </div>
          </Row>
          <Row label="Link field">
            <div className="flex items-center gap-2 bg-gray-10 dark:bg-muted border border-gray-20 dark:border-border rounded-lg px-3 h-[36px] w-[320px]">
              <Link2 className="w-3.5 h-3.5 text-gray-70 dark:text-muted-foreground shrink-0" />
              <span className="flex-1 text-[12px] text-brand-color dark:text-blue-70 truncate select-all">
                share.birdeye.com/view/cc6fe16f
              </span>
              <button className="shrink-0 h-[26px] px-2.5 rounded-md text-[11px] flex items-center gap-1 bg-white dark:bg-muted border border-gray-50 dark:border-border text-gray-300 dark:text-muted-foreground hover:bg-light-gray-color dark:hover:bg-muted shadow-sm transition-colors" style={{ fontWeight: 400 }}>
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          </Row>
          <Row label="Slider">
            <div className="flex items-center gap-3 w-[280px]">
              <span className="text-[10px] text-gray-90 dark:text-muted-foreground">0</span>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderVal}
                onChange={e => setSliderVal(+e.target.value)}
                className="flex-1 accent-brand-color h-1"
              />
              <span className="text-[11px] text-gray-300 dark:text-muted-foreground tabular-nums w-[30px] text-right">{sliderVal}%</span>
            </div>
          </Row>
        </Section>

        {/* ── Toggles & Selection ── */}
        <Section title="Toggles and selection">
          <Row label="Toggle switch">
            <ToggleSwitch checked={toggleA} onChange={setToggleA} label="Enabled" />
            <ToggleSwitch checked={toggleB} onChange={setToggleB} label="Disabled look" />
          </Row>
          <Row label="Radio buttons">
            {(["light", "dark", "auto"] as const).map(v => (
              <button
                key={v}
                onClick={() => setRadio(v)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] transition-colors ${
                  radio === v
                    ? "text-brand-color bg-blue-10 dark:bg-blue-300"
                    : "text-gray-300 dark:text-muted-foreground hover:bg-gray-20 dark:hover:bg-muted"
                }`}
                style={{ fontWeight: 400 }}
              >
                <span className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center ${
                  radio === v ? "border-brand-color" : "border-gray-60 dark:border-gray-400"
                }`}>
                  {radio === v && <span className="w-[8px] h-[8px] rounded-full bg-brand-color" />}
                </span>
                <span className="capitalize">{v}</span>
              </button>
            ))}
          </Row>
          <Row label="Checkbox">
            <button
              onClick={() => setChecked(!checked)}
              className="flex items-center gap-2 text-[12px] text-gray-300 dark:text-muted-foreground"
              style={{ fontWeight: 400 }}
            >
              <span className={`w-[16px] h-[16px] rounded border-2 flex items-center justify-center transition-colors ${
                checked ? "border-brand-color bg-brand-color" : "border-gray-60 dark:border-gray-400"
              }`}>
                {checked && <Check className="w-3 h-3 text-white" />}
              </span>
              Remember me
            </button>
          </Row>
          <Row label="Segmented control">
            <div className="flex bg-light-grayish-blue dark:bg-muted rounded-md p-0.5">
              {["compact", "normal", "spacious"].map(s => (
                <button
                  key={s}
                  className={`px-3 py-1.5 rounded text-[12px] capitalize transition-colors ${
                    s === "normal"
                      ? "bg-white dark:bg-muted shadow-sm text-gray-900 dark:text-foreground"
                      : "text-gray-90 dark:text-muted-foreground"
                  }`}
                  style={{ fontWeight: 400 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* ── Pills & Tabs ── */}
        <Section title="Pills and tabs">
          <Row label="Pill tabs">
            <div className="flex items-center gap-0.5">
              {["share", "export", "email"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-[5px] rounded-lg text-[12px] capitalize transition-all ${
                    activeTab === tab
                      ? "bg-blue-10 dark:bg-blue-300 text-brand-color dark:text-blue-70"
                      : "text-gray-80 dark:text-muted-foreground hover:text-gray-300 dark:hover:text-gray-70 hover:bg-gray-10 dark:hover:bg-muted"
                  }`}
                  style={{ fontWeight: 400 }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Row>
          <Row label="Badge / chip">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-10 dark:bg-blue-300 text-brand-color dark:text-blue-70" style={{ fontWeight: 400 }}>
              Active
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-green-30 dark:bg-green-500 text-green-100 dark:text-green-80" style={{ fontWeight: 400 }}>
              Success
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-yellow-20 dark:bg-yellow-500 text-yellow-500 dark:text-yellow-80" style={{ fontWeight: 400 }}>
              Warning
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-red-20 dark:bg-red-400 text-red-200 dark:text-red-60" style={{ fontWeight: 400 }}>
              Error
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-light-grayish-blue dark:bg-muted text-gray-200 dark:text-muted-foreground" style={{ fontWeight: 400 }}>
              Neutral
            </span>
          </Row>
        </Section>

        {/* ── Alerts ── */}
        <Section title="Alerts and feedback">
          <div className="space-y-2">
            <AlertBox icon={<Info className="w-3.5 h-3.5" />} variant="info" message="This is an informational message about the current action." />
            <AlertBox icon={<CheckCircle2 className="w-3.5 h-3.5" />} variant="success" message="Report has been shared successfully with 3 team members." />
            <AlertBox icon={<AlertTriangle className="w-3.5 h-3.5" />} variant="warning" message="Your session will expire in 5 minutes. Save your work." />
            <AlertBox icon={<XCircle className="w-3.5 h-3.5" />} variant="error" message="Failed to export report. Please check your connection and try again." />
          </div>
        </Section>

        {/* ── Cards & Surfaces ── */}
        <Section title="Cards and surfaces">
          <div className="grid grid-cols-3 gap-3">
            {/* Default card */}
            <div className="bg-white dark:bg-background border border-new-selected-color dark:border-border rounded-xl p-4 transition-colors">
              <p className="text-[12px] text-gray-900 dark:text-foreground mb-1" style={{ fontWeight: 400 }}>Default card</p>
              <p className="text-[11px] text-gray-90 dark:text-muted-foreground font-regular">Standard surface with subtle border</p>
            </div>
            {/* Elevated card */}
            <div className="bg-white dark:bg-background rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-colors">
              <p className="text-[12px] text-gray-900 dark:text-foreground mb-1" style={{ fontWeight: 400 }}>Elevated card</p>
              <p className="text-[11px] text-gray-90 dark:text-muted-foreground font-regular">Shadow elevation, no border</p>
            </div>
            {/* Interactive card */}
            <div className="bg-white dark:bg-background border border-new-selected-color dark:border-border rounded-xl p-4 hover:border-brand-color/40 dark:hover:border-brand-color/40 hover:shadow-[0_2px_8px_rgba(37,82,237,0.08)] transition-all cursor-pointer">
              <p className="text-[12px] text-gray-900 dark:text-foreground mb-1" style={{ fontWeight: 400 }}>Interactive card</p>
              <p className="text-[11px] text-gray-90 dark:text-muted-foreground font-regular">Hover to see accent border</p>
            </div>
          </div>
        </Section>

        {/* ── Dropdowns & Menus ── */}
        <Section title="Dropdown menu (static preview)">
          <div className="flex gap-4">
            <div className="bg-white dark:bg-background rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.14)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)] border border-gray-40 dark:border-border py-1 w-[200px]">
              <button className="w-full text-left px-3 py-2 text-[12px] text-gray-500 dark:text-foreground hover:bg-gray-20 dark:hover:bg-muted transition-colors flex items-center gap-2.5">
                <Eye className="w-3.5 h-3.5 text-gray-300 dark:text-muted-foreground" /> View report
              </button>
              <button className="w-full text-left px-3 py-2 text-[12px] bg-blue-10 dark:bg-blue-300 text-brand-color flex items-center gap-2.5">
                <Share2 className="w-3.5 h-3.5" /> Share (selected)
              </button>
              <button className="w-full text-left px-3 py-2 text-[12px] text-gray-500 dark:text-foreground hover:bg-gray-20 dark:hover:bg-muted transition-colors flex items-center gap-2.5">
                <Download className="w-3.5 h-3.5 text-gray-300 dark:text-muted-foreground" /> Export
              </button>
              <div className="h-px bg-gray-40 dark:bg-muted my-1" />
              <button className="w-full text-left px-3 py-2 text-[12px] text-red-90 hover:bg-red-20 dark:hover:bg-red-400 transition-colors flex items-center gap-2.5">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </Section>

        {/* ── Toolbar (floating) ── */}
        <Section title="Floating toolbar">
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-0.5 bg-white dark:bg-background rounded-full shadow-[0px_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0px_2px_12px_rgba(0,0,0,0.35)] px-2 py-1.5">
              <button className="p-1.5 rounded-full bg-blue-10 dark:bg-blue-300 text-brand-color">
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-gray-20 dark:hover:bg-muted text-gray-300 dark:text-muted-foreground transition-colors">
                <EyeOff className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-gray-50 dark:bg-muted mx-0.5" />
              <button className="p-1.5 rounded-full hover:bg-gray-20 dark:hover:bg-muted text-gray-300 dark:text-muted-foreground transition-colors">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[12px] text-gray-300 dark:text-muted-foreground px-1.5 tabular-nums min-w-[40px] text-center">100%</span>
              <button className="p-1.5 rounded-full hover:bg-gray-20 dark:hover:bg-muted text-gray-300 dark:text-muted-foreground transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-gray-50 dark:bg-muted mx-0.5" />
              <button className="p-1.5 rounded-full hover:bg-gray-20 dark:hover:bg-muted text-gray-300 dark:text-muted-foreground transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-full text-gray-60 dark:text-muted-foreground cursor-not-allowed">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Section>

        {/* ── Icon gallery ── */}
        <Section title="Icon gallery">
          <p className="text-[11px] text-gray-90 dark:text-muted-foreground mb-3">lucide-react &middot; 16px default &middot; text color inheritance</p>
          <div className="flex flex-wrap gap-3">
            {[
              { Icon: Eye, label: "Eye" }, { Icon: EyeOff, label: "EyeOff" }, { Icon: Check, label: "Check" },
              { Icon: X, label: "X" }, { Icon: Copy, label: "Copy" }, { Icon: Link2, label: "Link2" },
              { Icon: ChevronDown, label: "ChevronDown" }, { Icon: Sun, label: "Sun" }, { Icon: Moon, label: "Moon" },
              { Icon: Monitor, label: "Monitor" }, { Icon: Sparkles, label: "Sparkles" }, { Icon: Settings, label: "Settings" },
              { Icon: Share2, label: "Share2" }, { Icon: Download, label: "Download" }, { Icon: Plus, label: "Plus" },
              { Icon: Minus, label: "Minus" }, { Icon: Search, label: "Search" }, { Icon: Bell, label: "Bell" },
              { Icon: Trash2, label: "Trash2" }, { Icon: Edit3, label: "Edit3" }, { Icon: MoreHorizontal, label: "More" },
              { Icon: Loader2, label: "Loader2" }, { Icon: Info, label: "Info" }, { Icon: AlertTriangle, label: "Warning" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 w-[56px]">
                <div className="w-9 h-9 rounded-lg bg-gray-10 dark:bg-muted border border-gray-20 dark:border-border flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-300 dark:text-muted-foreground" />
                </div>
                <span className="text-[9px] text-gray-90 dark:text-muted-foreground truncate w-full text-center">{label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Spacing / Padding visual ── */}
        <Section title="Spacing scale">
          <div className="space-y-2">
            {[
              { px: 4, label: "4px — micro" },
              { px: 8, label: "8px — tight" },
              { px: 12, label: "12px — compact" },
              { px: 16, label: "16px — normal" },
              { px: 24, label: "24px — relaxed" },
              { px: 32, label: "32px — spacious" },
            ].map(s => (
              <div key={s.px} className="flex items-center gap-3">
                <div className="rounded" style={{ width: s.px, height: 12, backgroundColor: accentColor, opacity: 0.6 }} />
                <span className="text-[11px] text-gray-300 dark:text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
}

/* ── Sub-components ── */

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2"
    >
      <div className={`w-[36px] h-[20px] rounded-full relative transition-colors duration-200 ${
        checked ? "bg-brand-color" : "bg-gray-60 dark:bg-app-shell-l2-row-active"
      }`}>
        <div className={`absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "left-[18px]" : "left-[2px]"
        }`} />
      </div>
      <span className="text-[12px] text-gray-300 dark:text-muted-foreground" style={{ fontWeight: 400 }}>{label}</span>
    </button>
  );
}

function AlertBox({ icon, variant, message }: { icon: React.ReactNode; variant: "info" | "success" | "warning" | "error"; message: string }) {
  const styles = {
    info: "bg-blue-10 dark:bg-blue-300/50 border-blue-40 dark:border-brand-color/30 text-brand-color dark:text-blue-70",
    success: "bg-green-30 dark:bg-green-500/50 border-green-50 dark:border-green-100/30 text-green-100 dark:text-green-80",
    warning: "bg-yellow-20 dark:bg-yellow-500/50 border-yellow-60 dark:border-yellow-500/30 text-yellow-500 dark:text-yellow-80",
    error: "bg-red-20 dark:bg-red-400/50 border-red-30 dark:border-red-200/30 text-red-200 dark:text-red-60",
  };
  return (
    <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${styles[variant]} transition-colors`}>
      <span className="shrink-0 mt-0.5">{icon}</span>
      <span className="text-[12px] font-regular">{message}</span>
    </div>
  );
}