import { useState, useEffect } from "react";
import { Play, Square, Info } from "lucide-react";
import { motion } from "motion/react";
import {
  Sheet,
  SheetContent,
} from "@/app/components/ui/sheet.v1";
import { FloatingSheetFrame, FLOATING_SHEET_FRAME_CONTENT_CLASS } from "@/app/components/layout/FloatingSheetFrame";
import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Badge } from "@/app/components/ui/badge.v1";
import { Slider } from "@/app/components/ui/slider.v1";
import { Switch } from "@/app/components/ui/switch.v1";
import { cn } from "@/app/components/ui/utils";
import {
  type VoiceRow,
  type VoiceSettings,
  DEFAULT_VOICE_SETTINGS,
  VOICE_TYPE_LABEL,
  USE_CASE_SAMPLE_TEXT,
  USE_CASE_SAMPLE_DURATION_S,
} from "./inboxVoiceMockData";
import { type VoiceSpeechHandle } from "@/app/hooks/useVoiceSpeech";

// ─── Voice avatar ─────────────────────────────────────────────────────────────

function VoiceAvatar({
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
        className="size-14 shrink-0 rounded-full object-cover"
        onError={(e) => {
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
      className="inline-flex size-14 shrink-0 items-center justify-center rounded-full text-[18px] font-semibold text-white select-none"
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

// ─── Animated waveform ────────────────────────────────────────────────────────

const WAVE_HEIGHTS = [4, 7, 12, 8, 16, 10, 18, 13, 9, 16, 8, 5, 11, 15, 9, 7, 13, 8, 5, 10];

function AudioWaveform({ playing, color }: { playing: boolean; color: string }) {
  return (
    <div className="flex flex-1 items-center gap-[2px] h-8 overflow-hidden">
      {WAVE_HEIGHTS.map((h, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full shrink-0"
          style={{ height: h, backgroundColor: color }}
          animate={
            playing
              ? { scaleY: [0.15, 1, 0.3, 0.8, 0.2, 1, 0.5] }
              : { scaleY: 0.12 }
          }
          transition={
            playing
              ? {
                  duration: 0.7 + (i % 5) * 0.08,
                  repeat: Infinity,
                  delay: i * 0.04,
                  ease: "easeInOut",
                }
              : { duration: 0.25, ease: "easeOut" }
          }
        />
      ))}
    </div>
  );
}

// ─── Slider row ───────────────────────────────────────────────────────────────

function SettingSlider({
  label,
  hint,
  value,
  min = 0,
  max = 100,
  step = 1,
  displayValue,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  displayValue?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium text-foreground">{label}</span>
          <span className="text-[11px] text-muted-foreground leading-[1.4]">{hint}</span>
        </div>
        <span className="text-[12px] tabular-nums text-muted-foreground min-w-[36px] text-right">
          {displayValue ?? value}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        aria-label={label}
      />
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="text-[13px] text-foreground">{value}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface InboxVoiceDetailSheetProps {
  voice: VoiceRow | null;
  open: boolean;
  activeVoiceId: string | null;
  speech: VoiceSpeechHandle;
  onOpenChange: (open: boolean) => void;
  onSetActive: (id: string) => void;
}

export function InboxVoiceDetailSheet({
  voice,
  open,
  activeVoiceId,
  speech,
  onOpenChange,
  onSetActive,
}: InboxVoiceDetailSheetProps) {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [elapsed, setElapsed] = useState(0);

  const patch = (p: Partial<VoiceSettings>) =>
    setSettings((prev) => ({ ...prev, ...p }));

  const isVoicePlaying = voice ? speech.playingId === voice.id : false;
  const sampleText     = voice ? USE_CASE_SAMPLE_TEXT[voice.useCase]     : "";
  const sampleDuration = voice ? USE_CASE_SAMPLE_DURATION_S[voice.useCase] : 10;

  // Track elapsed time while playing to drive the progress bar
  useEffect(() => {
    if (!isVoicePlaying) {
      setElapsed(0);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.min((Date.now() - start) / 1000, sampleDuration));
    }, 100);
    return () => clearInterval(timer);
  }, [isVoicePlaying, sampleDuration]);

  // Stop playback when sheet closes
  useEffect(() => {
    if (!open) speech.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!voice) return null;

  const isActive = activeVoiceId === voice.id;
  const progress = elapsed / sampleDuration;
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const handlePlayToggle = () => {
    if (isVoicePlaying) {
      speech.stop();
    } else {
      speech.play({
        id: voice.id,
        language: voice.language,
        accent: voice.accent,
        gender: voice.gender,
        speed: settings.speed,
        sampleText,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        inset="floating"
        floatingSize="md"
        className={FLOATING_SHEET_FRAME_CONTENT_CLASS}
      >
        <FloatingSheetFrame
          title={
            <div className="flex items-center gap-3">
              <VoiceAvatar name={voice.name} color={voice.avatarColor} image={voice.avatarImage} />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-foreground leading-tight">{voice.name}</span>
                <span className="text-[12px] text-muted-foreground font-normal leading-[1.35] line-clamp-2">
                  {voice.description}
                </span>
              </div>
            </div>
          }
          primaryAction={{
            label: isActive ? "Active voice" : "Set as receptionist voice",
            onClick: () => { onSetActive(voice.id); onOpenChange(false); },
          }}
          secondaryAction={{
            label: "Cancel",
            onClick: () => onOpenChange(false),
          }}
        >
        <div className="flex flex-col gap-6">

          {/* Live preview */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
              {/* Waveform + time */}
              <div className="flex items-center gap-3">
                <AudioWaveform playing={isVoicePlaying} color={voice.avatarColor} />
                <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground">
                  {isVoicePlaying
                    ? `${formatTime(elapsed)} / ${formatTime(sampleDuration)}`
                    : `0:00 / ${formatTime(sampleDuration)}`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1 w-full rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: voice.avatarColor }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>

              {/* Sample text */}
              <p className="text-[12px] text-muted-foreground leading-[1.5] italic border-l-2 border-border pl-3">
                "{sampleText}"
              </p>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-8 rounded-full shrink-0"
                  onClick={handlePlayToggle}
                  aria-label={isVoicePlaying ? "Stop preview" : "Play preview"}
                >
                  {isVoicePlaying
                    ? <Square className="size-[12px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                    : <Play   className="size-[12px]" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />}
                </Button>
                <span className="text-[11px] text-muted-foreground">
                  {voice.useCase} · {voice.language} / {voice.accent}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Voice info
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <MetaRow label="Language"  value={`${voice.flagEmoji} ${voice.language}`} />
              <MetaRow label="Accent"    value={voice.accent} />
              <MetaRow label="Gender"    value={voice.gender} />
              <MetaRow label="Age"       value={voice.ageCategory} />
              <MetaRow label="Use case"  value={<Badge variant="secondary">{voice.useCase}</Badge>} />
              <MetaRow label="Type"      value={<Badge variant="outline">{VOICE_TYPE_LABEL[voice.voiceType]}</Badge>} />
              <MetaRow label="Added"     value={voice.addedOn} />
              <MetaRow label="Users"     value={voice.userCount.toLocaleString()} />
            </div>
          </div>

          {/* Voice settings */}
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Voice settings
            </span>

            <SettingSlider
              label="Stability"
              hint="Higher = more consistent, less expressive"
              value={settings.stability}
              onChange={(v) => patch({ stability: v })}
            />
            <SettingSlider
              label="Similarity"
              hint="How closely to match the original voice"
              value={settings.similarity}
              onChange={(v) => patch({ similarity: v })}
            />
            <SettingSlider
              label="Style"
              hint="Amplifies speaking style — increases latency above 0"
              value={settings.style}
              onChange={(v) => patch({ style: v })}
            />
            <SettingSlider
              label="Speed"
              hint="Playback rate (1.0 = normal)"
              value={settings.speed}
              min={0.25}
              max={4.0}
              step={0.05}
              displayValue={settings.speed.toFixed(2)}
              onChange={(v) => patch({ speed: v })}
            />

            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium text-foreground">Speaker boost</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex cursor-default">
                        <Info className="size-[13px] text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[220px] text-center">
                      Uses a secondary model pass to more closely match the original speaker's voice. Adds ~100–200 ms of latency per request.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Boosts similarity — slightly increases latency
                </span>
              </div>
              <Switch
                checked={settings.speakerBoost}
                onCheckedChange={(v) => patch({ speakerBoost: v })}
                aria-label="Speaker boost"
              />
            </div>
          </div>
        </div>
        </FloatingSheetFrame>
      </SheetContent>
    </Sheet>
  );
}
