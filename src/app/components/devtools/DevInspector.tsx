"use client";

import * as React from "react";
import { Check, Copy, Crosshair, X } from "lucide-react";
import { L1_STRIP_ICON_STROKE_PX } from "@/app/components/l1StripIconTokens";
import { usePersistedState } from "@/app/hooks/usePersistedState";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";
import { FLOATING_PANEL_SURFACE_CLASSNAME } from "@/app/components/ui/floatingPanelSurface";
import {
  buildInspectorSpec,
  sectionToCss,
  specToCss,
  type InspectorSection,
  type InspectorSpec,
} from "./inspectorCss";

const INSPECTOR_ATTR = "data-dev-inspector";

const isMac =
  typeof navigator !== "undefined" &&
  /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);

function isInsideInspector(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest(`[${INSPECTOR_ATTR}]`))
  );
}

/** Alt/Option (or Meta/Cmd) held: capture for inspection instead of interacting. */
function isCaptureGesture(event: MouseEvent | PointerEvent): boolean {
  return event.altKey || event.metaKey;
}

function pickInspectableElement(x: number, y: number): Element | null {
  const stack = document.elementsFromPoint(x, y);
  for (const el of stack) {
    if (el.closest(`[${INSPECTOR_ATTR}]`)) continue;
    if (el === document.documentElement || el === document.body) continue;
    return el;
  }
  return null;
}

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  label: string;
};

function rectFromElement(el: Element): HighlightRect {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    label: `${el.tagName.toLowerCase()} · ${Math.round(rect.width)}×${Math.round(rect.height)}`,
  };
}

function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }, [text]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("h-8 gap-1 px-2 text-[11px]", className)}
      onClick={onCopy}
      aria-label={label}
    >
      {copied ? (
        <Check
          className="size-3.5"
          strokeWidth={L1_STRIP_ICON_STROKE_PX}
          absoluteStrokeWidth
        />
      ) : (
        <Copy
          className="size-3.5"
          strokeWidth={L1_STRIP_ICON_STROKE_PX}
          absoluteStrokeWidth
        />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function SectionBlock({ section }: { section: InspectorSection }) {
  const css = section.properties
    .map((p) => `${p.name}: ${p.value};`)
    .join("\n");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {section.title}
        </p>
        <CopyButton text={css} label={`Copy ${section.title} CSS`} />
      </div>
      <pre className="overflow-x-auto rounded-md bg-muted/40 px-2 py-2 font-mono text-[11px] leading-relaxed text-foreground">
        {section.properties.map((prop) => (
          <div key={prop.name}>
            <span className="text-muted-foreground">{prop.name}:</span>{" "}
            {prop.value};
          </div>
        ))}
      </pre>
    </div>
  );
}

export function DevInspector() {
  const [armed, setArmed] = usePersistedState("dev_inspector_armed", false);
  const [hoverRect, setHoverRect] = React.useState<HighlightRect | null>(null);
  const [selectedEl, setSelectedEl] = React.useState<Element | null>(null);
  const [selectedSpec, setSelectedSpec] = React.useState<InspectorSpec | null>(
    null,
  );
  const [selectedRect, setSelectedRect] = React.useState<HighlightRect | null>(
    null,
  );

  const clearSelection = React.useCallback(() => {
    setSelectedEl(null);
    setSelectedSpec(null);
    setSelectedRect(null);
  }, []);

  const disarm = React.useCallback(() => {
    setArmed(false);
    setHoverRect(null);
    clearSelection();
  }, [clearSelection, setArmed]);

  const refreshSelectedRect = React.useCallback(() => {
    if (!selectedEl) return;
    setSelectedRect(rectFromElement(selectedEl));
  }, [selectedEl]);

  React.useEffect(() => {
    if (!armed || selectedSpec) return;

    const onMove = (event: MouseEvent) => {
      if (isInsideInspector(event.target)) {
        setHoverRect(null);
        return;
      }
      const el = pickInspectableElement(event.clientX, event.clientY);
      setHoverRect(el ? rectFromElement(el) : null);
    };

    // Alt/Option (or Meta) + click captures. Plain clicks pass through so
    // popovers, dropdowns, dialogs, and menus can be opened normally, then
    // inspected. Intercepting pointerdown in capture phase stops Radix
    // dismissable layers from closing (and stealing focus) before the pick.
    const onPointerDown = (event: PointerEvent) => {
      if (!isCaptureGesture(event)) return;
      if (isInsideInspector(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const onClick = (event: MouseEvent) => {
      if (!isCaptureGesture(event)) return;
      if (isInsideInspector(event.target)) return;
      const el = pickInspectableElement(event.clientX, event.clientY);
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      setSelectedEl(el);
      setSelectedSpec(buildInspectorSpec(el));
      setSelectedRect(rectFromElement(el));
      setHoverRect(null);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [armed, selectedSpec]);

  React.useEffect(() => {
    if (!armed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (selectedSpec) {
        clearSelection();
      } else {
        disarm();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [armed, clearSelection, disarm, selectedSpec]);

  React.useEffect(() => {
    if (!selectedEl) return;
    const onLayout = () => refreshSelectedRect();
    window.addEventListener("scroll", onLayout, true);
    window.addEventListener("resize", onLayout);
    return () => {
      window.removeEventListener("scroll", onLayout, true);
      window.removeEventListener("resize", onLayout);
    };
  }, [refreshSelectedRect, selectedEl]);

  const activeRect = selectedRect ?? hoverRect;
  const allCss = selectedSpec ? specToCss(selectedSpec) : "";

  return (
    <div {...{ [INSPECTOR_ATTR]: "" }} className="pointer-events-none fixed inset-0 z-[9999]">
      {armed && activeRect ? (
        <div
          className="pointer-events-none fixed border-2 border-primary"
          style={{
            top: activeRect.top,
            left: activeRect.left,
            width: activeRect.width,
            height: activeRect.height,
          }}
        >
          <span className="absolute -top-6 left-0 rounded-sm bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
            {activeRect.label}
          </span>
        </div>
      ) : null}

      <div className="pointer-events-auto fixed bottom-4 right-4 flex flex-col items-end gap-2">
        {armed && !selectedSpec ? (
          <div className="rounded-md bg-foreground/90 px-2 py-1 text-[11px] font-medium text-background shadow-lg">
            {isMac ? "⌥ Option" : "Alt"} + click to inspect · click to interact
          </div>
        ) : null}

        {armed && selectedSpec ? (
          <div
            className={cn(
              FLOATING_PANEL_SURFACE_CLASSNAME,
              "flex max-h-[min(70vh,560px)] w-[min(420px,calc(100vw-2rem))] flex-col gap-4 overflow-hidden p-4",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {selectedSpec.label}
                </p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {selectedSpec.selectorHint}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <CopyButton text={allCss} label="Copy all CSS" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={clearSelection}
                  aria-label="Close inspector panel"
                >
                  <X
                    className="size-4"
                    strokeWidth={L1_STRIP_ICON_STROKE_PX}
                    absoluteStrokeWidth
                  />
                </Button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
              {selectedSpec.sections.map((section) => (
                <SectionBlock key={section.title} section={section} />
              ))}
            </div>
          </div>
        ) : null}

        <Button
          type="button"
          variant={armed ? "default" : "outline"}
          className={cn(
            "h-10 gap-2 shadow-lg",
            armed && "ring-2 ring-primary/30",
          )}
          onClick={() => {
            if (armed) {
              disarm();
            } else {
              setArmed(true);
            }
          }}
          aria-pressed={armed}
        >
          <Crosshair
            className="size-4"
            strokeWidth={L1_STRIP_ICON_STROKE_PX}
            absoluteStrokeWidth
          />
          {armed ? "Inspecting" : "Inspect"}
        </Button>
      </div>
    </div>
  );
}
