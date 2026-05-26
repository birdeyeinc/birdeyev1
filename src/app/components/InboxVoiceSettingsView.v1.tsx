import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Search,
  X,
  Play,
  Square,
  Plus,
  Check,
  MoreVertical,
  Copy,
  Pencil,
  Trash2,
  Share2,
} from "lucide-react";
import { useVoiceSpeech, type VoiceSpeechHandle } from "@/app/hooks/useVoiceSpeech";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { TextTabsRow } from "@/app/components/ui/text-tabs.v1";
import { AppDataTable } from "@/app/components/ui/AppDataTable";
import { AppDataTableColumnSettingsTrigger } from "@/app/components/ui/AppDataTableColumnSettingsTrigger";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge.v1";
import { cn } from "@/app/components/ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { InboxVoiceDetailSheet } from "./InboxVoiceDetailSheet";
import { InboxVoiceCreateDialog } from "./InboxVoiceCreateDialog";
import {
  VOICE_ROWS,
  formatUserCount,
  USE_CASE_SAMPLE_TEXT,
  type VoiceRow,
  type VoiceUseCase,
  type VoiceGender,
  type VoiceAge,
  type VoiceType,
} from "./inboxVoiceMockData";

// ─── Voice avatar ─────────────────────────────────────────────────────────────

export function VoiceAvatar({
  name,
  color,
  image,
}: {
  name: string;
  color: string;
  image?: string;
}) {
  const initials = name
    .split(/[\s–-]/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="size-9 shrink-0 rounded-full object-cover"
        onError={(e) => {
          // fallback to initials on load error
          const el = e.currentTarget;
          el.style.display = "none";
          const sibling = el.nextElementSibling as HTMLElement | null;
          if (sibling) sibling.style.display = "inline-flex";
        }}
      />
    );
  }
  return (
    <span
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white select-none"
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials}
    </span>
  );
}


// ─── Use case badge variant ───────────────────────────────────────────────────

const USE_CASE_VARIANT: Record<
  VoiceUseCase,
  "default" | "secondary" | "success" | "warning" | "purple" | "outline"
> = {
  Conversational: "default",
  Narration:      "secondary",
  Educational:    "success",
  "Social media": "warning",
  Advertisement:  "purple",
  Characters:     "outline",
};

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-medium transition-colors whitespace-nowrap",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground dark:bg-muted",
      )}
    >
      {label}
    </button>
  );
}

// ─── Tab count chip ───────────────────────────────────────────────────────────

function TabCount({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[22px] h-[18px] rounded-full px-1.5 text-[11px] font-medium bg-muted text-muted-foreground">
      {n}
    </span>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const colHelper = createColumnHelper<VoiceRow>();

function buildColumns(
  savedIds: Set<string>,
  activeVoiceId: string | null,
  onRowClick: (row: VoiceRow) => void,
  tab: VoiceTab,
) {
  return [
    colHelper.accessor("name", {
      id: "name",
      header: "Voice",
      size: 300,
      meta: { settingsLabel: "Voice" },
      cell: (info) => {
        const row = info.row.original;
        return (
          <button
            type="button"
            className="flex items-center gap-3 min-w-0 w-full text-left"
            onClick={() => onRowClick(row)}
          >
            <VoiceAvatar name={row.name} color={row.avatarColor} image={row.avatarImage} />
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-medium text-foreground group-hover/table-row:text-primary transition-colors text-[13px]">
                  {row.name}
                </span>
                {activeVoiceId === row.id && (
                  <Badge variant="success" className="text-[10px] px-1.5 py-0 shrink-0">Active</Badge>
                )}
              </div>
              <span className="truncate text-[12px] text-muted-foreground leading-[1.3]">
                {row.description}
              </span>
            </div>
          </button>
        );
      },
    }),
    colHelper.accessor("language", {
      id: "language",
      header: "Language",
      size: 144,
      meta: { settingsLabel: "Language" },
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] leading-none" aria-hidden>{row.flagEmoji}</span>
            <span className="text-[13px] text-muted-foreground">
              {info.getValue()}
              <span className="text-border dark:text-gray-300"> / </span>
              {row.accent}
            </span>
          </div>
        );
      },
    }),
    colHelper.accessor("useCase", {
      id: "useCase",
      header: "Use case",
      size: 136,
      meta: { settingsLabel: "Use case" },
      cell: (info) => (
        <Badge variant={USE_CASE_VARIANT[info.getValue()]}>{info.getValue()}</Badge>
      ),
    }),
    colHelper.accessor("addedOn", {
      id: "addedOn",
      header: "Added",
      size: 112,
      meta: { settingsLabel: "Added" },
      cell: (info) => (
        <span className="text-[13px] text-muted-foreground">{info.getValue()}</span>
      ),
    }),
    ...(tab === "my-voices" ? [
      colHelper.accessor("usedByAgents", {
        id: "usedByAgents",
        header: "Used by",
        size: 180,
        meta: { settingsLabel: "Used by" },
        cell: (info) => {
          const agents = info.getValue();
          if (!agents || agents.length === 0)
            return <span className="text-[13px] text-muted-foreground">—</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {agents.map((agent) => (
                <span
                  key={agent}
                  className="inline-flex items-center rounded-md bg-blue-10 dark:bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary leading-none"
                >
                  {agent}
                </span>
              ))}
            </div>
          );
        },
      }),
      colHelper.accessor("userCount", {
        id: "userCount",
        header: "Users",
        size: 72,
        meta: { settingsLabel: "Users" },
        cell: (info) => (
          <span className="text-[13px] tabular-nums text-muted-foreground">
            {formatUserCount(info.getValue())}
          </span>
        ),
      }),
    ] : []),
  ];
}

// ─── Filter constants ─────────────────────────────────────────────────────────

const USE_CASE_FILTERS: Array<VoiceUseCase | "All"> = [
  "All", "Conversational", "Narration", "Educational", "Social media", "Advertisement", "Characters",
];
const GENDER_FILTERS: Array<VoiceGender | "All"> = ["All", "Male", "Female", "Neutral"];
const AGE_FILTERS: Array<VoiceAge | "All"> = ["All", "Young", "Middle aged", "Old"];

// ─── Main view ────────────────────────────────────────────────────────────────

type VoiceTab = "explore" | "my-voices";

export interface InboxVoiceSettingsViewProps {
  rows?: VoiceRow[];
}

export function InboxVoiceSettingsView({
  rows = VOICE_ROWS,
}: InboxVoiceSettingsViewProps) {
  const [tab, setTab] = useState<VoiceTab>("my-voices");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [useCaseFilter, setUseCaseFilter] = useState<VoiceUseCase | "All">("All");
  const [genderFilter, setGenderFilter] = useState<VoiceGender | "All">("All");
  const [ageFilter, setAgeFilter] = useState<VoiceAge | "All">("All");
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(rows.filter((r) => r.saved).map((r) => r.id)),
  );
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>("v4");
  const [detailVoice, setDetailVoice] = useState<VoiceRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const speech = useVoiceSpeech();
  const [columnSheetOpen, setColumnSheetOpen] = useState(false);

  const toggleSave = (id: string) =>
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const openDetail = (voice: VoiceRow) => {
    setDetailVoice(voice);
    setDetailOpen(true);
  };

  const myVoiceRows = rows.filter((r) => savedIds.has(r.id));

  const tabItems = [
    { id: "my-voices" as VoiceTab, label: "Saved",      suffix: <TabCount n={myVoiceRows.length} /> },
    { id: "explore"   as VoiceTab, label: "Library",   suffix: <TabCount n={rows.length} /> },
  ];

  const baseRows = tab === "my-voices" ? myVoiceRows : rows;

  const filtered = (() => {
    let result = baseRows;
    if (useCaseFilter !== "All") result = result.filter((r) => r.useCase === useCaseFilter);
    if (genderFilter  !== "All") result = result.filter((r) => r.gender === genderFilter);
    if (ageFilter     !== "All") result = result.filter((r) => r.ageCategory === ageFilter);
    const q = search.toLowerCase();
    if (q) result = result.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.accent.toLowerCase().includes(q),
    );
    return result;
  })();

  const columns = buildColumns(savedIds, activeVoiceId, openDetail, tab);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <MainCanvasViewHeader
        title="Voice"
        description="Browse and select a voice for your AI receptionist."
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
                  onBlur={() => { if (!search) setSearchOpen(false); }}
                  onKeyDown={(e) => { if (e.key === "Escape") { setSearch(""); setSearchOpen(false); } }}
                  autoFocus
                  placeholder="Search voices…"
                  className="h-full w-full rounded-[8px] border border-new-selected-color bg-white py-0 pr-8 pl-8 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-100 focus:border-brand-color focus:ring-1 focus:ring-brand-color dark:border-border dark:bg-muted dark:text-foreground dark:placeholder:text-gray-90"
                  aria-label="Search voices"
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
              <Button type="button" variant="outline" size="icon" aria-label="Search voices" onClick={() => setSearchOpen(true)}>
                <Search className="size-[14px] text-gray-600 dark:text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
              </Button>
            )}
            <AppDataTableColumnSettingsTrigger
              sheetTitle="Voice columns"
              onClick={() => setColumnSheetOpen(true)}
            />
            <Button type="button" variant="default" size="sm" onClick={() => setCreateOpen(true)}>
              Create voice
            </Button>
          </div>
        }
      />

      {/* Sub-header band: tabs */}
      <div className="border-b border-border px-6 pb-0 pt-2 shrink-0">
        <TextTabsRow<VoiceTab>
          items={tabItems}
          value={tab}
          onChange={(t) => { setTab(t); setSearch(""); setSearchOpen(false); setUseCaseFilter("All"); setGenderFilter("All"); setAgeFilter("All"); }}
        />
      </div>

      <div className="flex flex-1 flex-col min-h-0 px-6 py-4">
        <AppDataTable<VoiceRow>
          tableId="inbox.voice"
          data={filtered}
          columns={columns}
          getRowId={(r) => r.id}
          hideColumnsButton
          columnSheetTitle="Voice columns"
          columnSheetOpen={columnSheetOpen}
          onColumnSheetOpenChange={setColumnSheetOpen}
          scrollableBody
          className="min-w-0 px-0"
          /**
           * Row hover actions — Birdeye convention:
           *   • ONE primary icon button (most frequent action: Play)
           *   • Everything else in the ⋯ DropdownMenu
           * Matches SettingsBusinessTableView pattern.
           */
          rowHoverAction={(row) => {
            const isOwned = row.voiceType === "instant-clone" || row.voiceType === "voice-design" || row.voiceType === "professional-clone";
            const isSaved = savedIds.has(row.id);
            const isActive = activeVoiceId === row.id;
            const isRowPlaying = speech.playingId === row.id;
            return (
              <div className="flex items-center gap-1">
                {/* Primary CTA: Play */}
                <Button
                  variant={isRowPlaying ? "default" : "ghost"}
                  size="icon"
                  className="size-8 rounded-full"
                  aria-label={isRowPlaying ? "Stop preview" : "Preview voice"}
                  onClick={(e) => {
                    e.stopPropagation();
                    isRowPlaying
                      ? speech.stop()
                      : speech.play({ id: row.id, language: row.language, accent: row.accent, gender: row.gender, sampleText: USE_CASE_SAMPLE_TEXT[row.useCase] });
                  }}
                >
                  {isRowPlaying
                    ? <Square className="size-[11px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                    : <Play   className="size-[11px] text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />}
                </Button>

                {/* Overflow: everything else */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" aria-label="More actions"
                      onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[200px]">
                    {/* Save / unsave — first item */}
                    <DropdownMenuItem onClick={() => toggleSave(row.id)}>
                      {isSaved ? (
                        <><Check className="size-[13px] text-primary" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />Remove from saved</>
                      ) : (
                        <><Plus className="size-[13px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />Add to saved</>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => openDetail(row)}>
                      View details
                    </DropdownMenuItem>
                    {isActive ? (
                      <DropdownMenuItem onClick={() => setActiveVoiceId(null)}>
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => { setActiveVoiceId(row.id); setSavedIds((prev) => new Set([...prev, row.id])); }}>
                        Set as receptionist voice
                      </DropdownMenuItem>
                    )}

                    {isOwned && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Pencil className="size-[13px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                          Edit voice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="size-[13px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                          Clone voice
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <Share2 className="size-[13px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                      Share with team
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="size-[13px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                      Copy voice ID
                    </DropdownMenuItem>

                    {isOwned && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="size-[13px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                          Delete voice
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          }}
          emptyState={
            <div className="py-12 text-center text-sm text-muted-foreground">
              {tab === "my-voices"
                ? "No saved voices yet. Browse the library and add voices to get started."
                : "No voices match your filters."
              }
            </div>
          }
        />
      </div>

      <InboxVoiceDetailSheet
        voice={detailVoice}
        open={detailOpen}
        activeVoiceId={activeVoiceId}
        speech={speech}
        onOpenChange={setDetailOpen}
        onSetActive={(id) => { setActiveVoiceId(id); setSavedIds((prev) => new Set([...prev, id])); }}
      />

      <InboxVoiceCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
