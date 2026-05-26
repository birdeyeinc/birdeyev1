import type { CSSProperties } from "react";
import { cn } from "@/app/components/ui/utils";
import {
  STATUS_DOT_CLASS,
  STATUS_LABEL_CLASS,
} from "./settingsStatusConfig";
import type { SettingsItem } from "./settingsLandingData";

interface SettingsItemRowProps extends Pick<SettingsItem, "label" | "description" | "icon" | "status" | "badge" | "agentStatus"> {
  onClick?: () => void;
  iconAccent?: string;
}

export function SettingsItemRow({ label, description: _description, icon, status, badge, agentStatus, iconAccent, onClick }: SettingsItemRowProps) {
  const hasMetaLine = Boolean(status);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full flex gap-3 p-2 rounded-md text-left",
        hasMetaLine ? "items-start" : "items-center",
        "transition-colors duration-200 ease-out",
        "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-sm transition-all duration-200 ease-out [&>svg]:scale-75",
          "ring-1 ring-[var(--icon-ring)]",
          "group-hover:scale-110 group-focus-visible:scale-110 group-active:scale-95",
          iconAccent
            ? "bg-[var(--icon-bg)] group-hover:bg-[var(--icon-bg-hover)] group-focus-visible:bg-[var(--icon-bg-hover)]"
            : "bg-primary/10 dark:bg-primary/14 group-hover:bg-primary/14 group-focus-visible:bg-primary/14",
          hasMetaLine && "mt-0.5",
        )}
        style={iconAccent ? ({
          "--icon-bg":       `${iconAccent}22`,
          "--icon-bg-hover": `${iconAccent}33`,
          "--icon-ring":     `${iconAccent}18`,
        } as CSSProperties) : {
          "--icon-ring": "color-mix(in srgb, var(--color-primary) 12%, transparent)",
        } as CSSProperties}
      >
        {icon()}
      </span>

      <span className="min-w-0 flex-1">
        {/* title row */}
        <span className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] font-medium text-foreground leading-tight transition-colors duration-200">
            {label}
          </span>

          {/* agent live indicator */}
          {agentStatus === "live" && (
            <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" aria-label="Live" />
          )}
          {agentStatus === "inactive" && (
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" aria-label="Inactive" />
          )}

          {/* NEW badge */}
          {badge === "new" && (
            <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-1.5 py-0 text-[10px] font-medium text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              New
            </span>
          )}
        </span>

        {/* connection status */}
        {status && (
          <span className="mt-0.5 flex items-center gap-1 opacity-90 transition-opacity duration-200 group-hover:opacity-100">
            <span className={cn("size-1.5 rounded-full shrink-0", STATUS_DOT_CLASS[status.type])} aria-hidden />
            <span className={cn("text-[11px] leading-tight", STATUS_LABEL_CLASS[status.type])}>{status.label}</span>
          </span>
        )}

        {/* descriptions intentionally hidden for compact settings rows */}
      </span>
    </button>
  );
}
