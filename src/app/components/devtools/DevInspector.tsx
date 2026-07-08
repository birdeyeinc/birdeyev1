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

const MEASURE_COLOR = "#3b82f6";
const MEASURE_HATCH = `repeating-linear-gradient(-45deg, ${MEASURE_COLOR}40 0, ${MEASURE_COLOR}40 1.5px, transparent 1.5px, transparent 6px)`;

type MeasureBand = {
  left: number;
  top: number;
  width: number;
  height: number;
  distance: number;
};

/**
 * Figma-style spacing bands between the selected box (S) and a hovered box (T).
 * Each band is a hatched rectangle filling the gap, labelled with the distance.
 * - Containment → 4 inset bands (S inside T, or T inside S).
 * - Disjoint on an axis → the gap band on that axis.
 */
function computeMeasureBands(
  s: HighlightRect,
  t: HighlightRect,
): MeasureBand[] {
  const sL = s.left;
  const sR = s.left + s.width;
  const sT = s.top;
  const sB = s.top + s.height;
  const tL = t.left;
  const tR = t.left + t.width;
  const tT = t.top;
  const tB = t.top + t.height;

  const sInsideT = sL >= tL && sR <= tR && sT >= tT && sB <= tB;
  const tInsideS = tL >= sL && tR <= sR && tT >= sT && tB <= sB;

  if (sInsideT || tInsideS) {
    const inner = sInsideT ? s : t;
    const outer = sInsideT ? t : s;
    const iL = inner.left;
    const iR = inner.left + inner.width;
    const iT = inner.top;
    const iB = inner.top + inner.height;
    const oL = outer.left;
    const oR = outer.left + outer.width;
    const oT = outer.top;
    const oB = outer.top + outer.height;
    return [
      { left: oL, top: iT, width: iL - oL, height: inner.height, distance: iL - oL },
      { left: iR, top: iT, width: oR - iR, height: inner.height, distance: oR - iR },
      { left: iL, top: oT, width: inner.width, height: iT - oT, distance: iT - oT },
      { left: iL, top: iB, width: inner.width, height: oB - iB, distance: oB - iB },
    ].filter((b) => b.distance >= 0.5);
  }

  const bands: MeasureBand[] = [];

  const yA = Math.max(sT, tT);
  const yB = Math.min(sB, tB);
  const hasVOverlap = yB > yA;
  const bandTop = hasVOverlap ? yA : sT;
  const bandH = hasVOverlap ? yB - yA : s.height;
  if (sR <= tL) {
    bands.push({ left: sR, top: bandTop, width: tL - sR, height: bandH, distance: tL - sR });
  } else if (tR <= sL) {
    bands.push({ left: tR, top: bandTop, width: sL - tR, height: bandH, distance: sL - tR });
  }

  const xA = Math.max(sL, tL);
  const xB = Math.min(sR, tR);
  const hasHOverlap = xB > xA;
  const bandLeft = hasHOverlap ? xA : sL;
  const bandW = hasHOverlap ? xB - xA : s.width;
  if (sB <= tT) {
    bands.push({ left: bandLeft, top: sB, width: bandW, height: tT - sB, distance: tT - sB });
  } else if (tB <= sT) {
    bands.push({ left: bandLeft, top: tB, width: bandW, height: sT - tB, distance: sT - tB });
  }

  return bands.filter((b) => b.distance >= 0.5);
}

/**
 * Figma-style "space around": for a hovered element, the gap to the nearest
 * sibling on each side (top/right/bottom/left) that overlaps on the
 * perpendicular axis. Returns up to 4 hatched bands.
 */
function findNeighborBands(el: Element): MeasureBand[] {
  const parent = el.parentElement;
  if (!parent) return [];
  const R = el.getBoundingClientRect();
  if (R.width === 0 || R.height === 0) return [];
  const eps = 0.5;

  let right: MeasureBand | null = null;
  let left: MeasureBand | null = null;
  let top: MeasureBand | null = null;
  let bottom: MeasureBand | null = null;

  for (const sib of Array.from(parent.children)) {
    if (sib === el) continue;
    if (sib.closest(`[${INSPECTOR_ATTR}]`)) continue;
    const c = sib.getBoundingClientRect();
    if (c.width === 0 || c.height === 0) continue;

    const vTop = Math.max(R.top, c.top);
    const vBot = Math.min(R.bottom, c.bottom);
    const vOverlap = vBot - vTop;
    if (vOverlap > 0) {
      if (c.left >= R.right - eps) {
        const gap = c.left - R.right;
        if (gap >= eps && (!right || gap < right.distance)) {
          right = { left: R.right, top: vTop, width: gap, height: vOverlap, distance: gap };
        }
      } else if (c.right <= R.left + eps) {
        const gap = R.left - c.right;
        if (gap >= eps && (!left || gap < left.distance)) {
          left = { left: c.right, top: vTop, width: gap, height: vOverlap, distance: gap };
        }
      }
    }

    const hLeft = Math.max(R.left, c.left);
    const hRight = Math.min(R.right, c.right);
    const hOverlap = hRight - hLeft;
    if (hOverlap > 0) {
      if (c.top >= R.bottom - eps) {
        const gap = c.top - R.bottom;
        if (gap >= eps && (!bottom || gap < bottom.distance)) {
          bottom = { left: hLeft, top: R.bottom, width: hOverlap, height: gap, distance: gap };
        }
      } else if (c.bottom <= R.top + eps) {
        const gap = R.top - c.bottom;
        if (gap >= eps && (!top || gap < top.distance)) {
          top = { left: hLeft, top: c.bottom, width: hOverlap, height: gap, distance: gap };
        }
      }
    }
  }

  return [right, left, top, bottom].filter(Boolean) as MeasureBand[];
}

function MeasureOverlay({ bands }: { bands: MeasureBand[] }) {
  return (
    <>
      {bands.map((b, i) => (
        <div
          key={i}
          className="pointer-events-none fixed flex items-center justify-center overflow-visible"
          style={{
            top: b.top,
            left: b.left,
            width: b.width,
            height: b.height,
            backgroundImage: MEASURE_HATCH,
            outline: `1px dashed ${MEASURE_COLOR}80`,
          }}
        >
          <span
            className="rounded-sm px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white shadow-sm"
            style={{ backgroundColor: MEASURE_COLOR }}
          >
            {Math.round(b.distance)}
          </span>
        </div>
      ))}
    </>
  );
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
  const [measureRect, setMeasureRect] = React.useState<HighlightRect | null>(
    null,
  );
  const [neighborBands, setNeighborBands] = React.useState<MeasureBand[]>([]);

  const clearSelection = React.useCallback(() => {
    setSelectedEl(null);
    setSelectedSpec(null);
    setSelectedRect(null);
    setMeasureRect(null);
  }, []);

  const disarm = React.useCallback(() => {
    setArmed(false);
    setHoverRect(null);
    setMeasureRect(null);
    setNeighborBands([]);
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
        setNeighborBands([]);
        return;
      }
      const el = pickInspectableElement(event.clientX, event.clientY);
      setHoverRect(el ? rectFromElement(el) : null);
      setNeighborBands(el ? findNeighborBands(el) : []);
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
      setNeighborBands([]);
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

  // With a selection active, hovering another element measures the spacing
  // between the two boxes (Figma-style distance guides).
  React.useEffect(() => {
    if (!armed || !selectedSpec || !selectedEl) return;

    const onMove = (event: MouseEvent) => {
      if (isInsideInspector(event.target)) {
        setMeasureRect(null);
        return;
      }
      const el = pickInspectableElement(event.clientX, event.clientY);
      if (!el || el === selectedEl) {
        setMeasureRect(null);
        return;
      }
      setMeasureRect(rectFromElement(el));
    };

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      setMeasureRect(null);
    };
  }, [armed, selectedEl, selectedSpec]);

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
  const measureBands =
    selectedRect && measureRect
      ? computeMeasureBands(selectedRect, measureRect)
      : [];

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

      {armed && measureRect ? (
        <div
          className="pointer-events-none fixed border border-dashed"
          style={{
            top: measureRect.top,
            left: measureRect.left,
            width: measureRect.width,
            height: measureRect.height,
            borderColor: MEASURE_COLOR,
          }}
        >
          <span
            className="absolute left-0 top-full mt-1 whitespace-nowrap rounded-sm px-2 py-0.5 text-[10px] font-medium text-white"
            style={{ backgroundColor: MEASURE_COLOR }}
          >
            {Math.round(measureRect.width)} × {Math.round(measureRect.height)}
          </span>
        </div>
      ) : null}

      {armed ? (
        <MeasureOverlay bands={selectedRect ? measureBands : neighborBands} />
      ) : null}

      <div className="pointer-events-auto fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        {armed ? (
          <div
            className={cn(
              FLOATING_PANEL_SURFACE_CLASSNAME,
              "flex w-[min(380px,calc(100vw-3rem))] max-h-[min(560px,calc(100vh-120px))] flex-col overflow-hidden",
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/80 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <Crosshair
                  className="size-[18px] shrink-0"
                  strokeWidth={L1_STRIP_ICON_STROKE_PX}
                  absoluteStrokeWidth
                />
                <span className="text-sm font-semibold text-foreground">
                  Inspector
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  Active
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={disarm}
                aria-label="Close inspector"
              >
                <X
                  className="size-4"
                  strokeWidth={L1_STRIP_ICON_STROKE_PX}
                  absoluteStrokeWidth
                />
              </Button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {selectedSpec
                  ? "Hover any element to measure spacing"
                  : `${isMac ? "⌥ Option" : "Alt"} + click to inspect · click to interact`}
              </p>

              {selectedSpec ? (
                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
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
            </div>
          </div>
        ) : null}

        <Button
          type="button"
          variant="default"
          size="icon"
          className={cn(
            "size-14 rounded-full shadow-[0_4px_16px_rgba(59,130,246,0.35),0_8px_24px_rgba(15,23,42,0.12)] transition-transform hover:scale-[1.04]",
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
          aria-label={armed ? "Close inspector" : "Open inspector"}
        >
          <Crosshair
            className="size-6"
            strokeWidth={L1_STRIP_ICON_STROKE_PX}
            absoluteStrokeWidth
          />
        </Button>
      </div>
    </div>
  );
}
