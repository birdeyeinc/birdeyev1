import { useCallback, useEffect, useRef, useState } from "react";
import { Expand, MapPin } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { SETTINGS_FORM_FIELD_MAX_CLASS } from "./settingsFormLayout";

export interface SettingsMapMarkerFieldProps {
  /** Search query or address string for the embed. */
  query: string;
  /** Shown when `query` is empty after trim. */
  emptyMessage: string;
  className?: string;
}

/**
 * Map marker tile for business profile settings — Google Maps embed when `query` is set,
 * otherwise an empty state. Fullscreen toggles the map container.
 */
export function SettingsMapMarkerField({ query, emptyMessage, className }: SettingsMapMarkerFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);
  const q = query.trim();
  const embedUrl =
    q.length > 0
      ? `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`
      : null;

  const toggleFullscreen = useCallback(async () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
      setFs(true);
    } else {
      await document.exitFullscreen?.();
      setFs(false);
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative flex min-h-[220px] w-full flex-col overflow-hidden rounded-lg border border-border bg-card",
        SETTINGS_FORM_FIELD_MAX_CLASS,
        fs && "rounded-none",
        className,
      )}
    >
      {embedUrl ? (
        <>
          <iframe title="Business location map" src={embedUrl} className="h-[220px] w-full border-0" loading="lazy" />
          <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/30 px-2 py-1 text-[10px] text-muted-foreground">
            <span>Map data © Google</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Fullscreen map"
              onClick={() => void toggleFullscreen()}
            >
              <Expand className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 px-4 text-center">
          <MapPin className="size-8 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          <p className="text-xs text-muted-foreground">Add an address or enter a location below.</p>
        </div>
      )}
    </div>
  );
}
