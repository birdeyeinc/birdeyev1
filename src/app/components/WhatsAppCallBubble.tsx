import { useState, useEffect, useRef } from "react";
import { Play, Pause, Maximize2 } from "lucide-react";
import type { CallRecord, CallOutcome } from "./callRecordingData";

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function seededWaveform(seed: number, bars = 30): number[] {
  return Array.from({ length: bars }, (_, i) => {
    const x = Math.abs(Math.sin(seed * 127.1 + i * 311.7) * 43758.5) % 1;
    const env = Math.sin(Math.PI * (i / bars));
    return 0.15 + x * 0.7 * (0.4 + env * 0.6);
  });
}

const OUTCOME_STYLES: Record<CallOutcome, { label: string; cls: string }> = {
  resolved:    { label: "Resolved",   cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  escalated:   { label: "Escalated",  cls: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
  "follow-up": { label: "Follow-up",  cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
};

export function WhatsAppCallBubble({
  record,
  onExpand,
}: {
  record: CallRecord;
  onExpand: () => void;
}) {
  const isAgent = record.direction === "outgoing";
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0–1
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bars = seededWaveform(record.durationSec, 30);
  const elapsed = Math.round(progress * record.durationSec);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            setPlaying(false);
            return 0;
          }
          return p + 1 / record.durationSec;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, record.durationSec]);

  const outcomeCfg = OUTCOME_STYLES[record.outcome];

  const avatarUrl = isAgent
    ? record.agentAvatar
    : `https://i.pravatar.cc/64?u=${record.id}`;

  return (
    <div className={`flex mb-4 ${isAgent ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[320px] rounded-2xl px-3 py-2.5 flex flex-col gap-2 shadow-sm ${
          isAgent
            ? "bg-[#e3f0ff] dark:bg-[#1e3a5f] rounded-br-md"
            : "bg-white dark:bg-muted rounded-bl-md border border-[#eaeaea] dark:border-border"
        }`}
      >
        {/* Top row: avatar · play · waveform · elapsed */}
        <div className="flex items-center gap-2">
          {/* Avatar — left for incoming, right for outgoing via order */}
          {!isAgent && (
            <img
              src={avatarUrl}
              alt={record.contactName}
              className="size-8 rounded-full shrink-0 object-cover ring-1 ring-white dark:ring-border"
            />
          )}

          {/* Play/Pause button */}
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
              isAgent
                ? "bg-primary/20 hover:bg-primary/30 text-primary"
                : "bg-primary/10 hover:bg-primary/20 text-primary"
            }`}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing
              ? <Pause className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
              : <Play className="size-4 translate-x-0.5" strokeWidth={1.6} absoluteStrokeWidth />
            }
          </button>

          {/* Waveform */}
          <div className="flex items-center gap-[2px] h-6 flex-1 cursor-pointer"
            onClick={() => setPlaying((p) => !p)}
          >
            {bars.map((h, i) => {
              const filled = i / bars.length < progress;
              return (
                <div
                  key={i}
                  className={`w-[3px] rounded-full transition-colors ${
                    filled ? "bg-primary" : "bg-black/15 dark:bg-white/25"
                  }`}
                  style={{ height: `${Math.round(h * 20) + 3}px` }}
                />
              );
            })}
          </div>

          {/* Duration / elapsed */}
          <span className="text-[11px] tabular-nums text-muted-foreground shrink-0 min-w-[30px] text-right">
            {playing ? fmt(elapsed) : fmt(record.durationSec)}
          </span>

          {isAgent && (
            <img
              src={avatarUrl}
              alt={record.agentName}
              className="size-8 rounded-full shrink-0 object-cover ring-1 ring-white dark:ring-border"
            />
          )}
        </div>

        {/* Bottom row: outcome · timestamp · expand */}
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${outcomeCfg.cls}`}>
            {outcomeCfg.label}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] text-muted-foreground">{record.dateLabel}</span>
            <button
              type="button"
              onClick={onExpand}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open full recording"
              title="Open full recording"
            >
              <Maximize2 className="size-3.5" strokeWidth={1.6} absoluteStrokeWidth />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
