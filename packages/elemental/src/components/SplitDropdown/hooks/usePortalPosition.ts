import type { RefObject } from "react";
import { useCallback, useLayoutEffect, useState } from "react";

// Returns every scrollable ancestor of `element` up to (and including) window.
function getScrollableAncestors(element: HTMLElement): Array<HTMLElement | Window> {
    const scrollables: Array<HTMLElement | Window> = [];
    let node: HTMLElement | null = element.parentElement;
    while (node) {
        const { overflow, overflowY, overflowX } = getComputedStyle(node);
        if (/auto|scroll/.test(overflow + overflowY + overflowX)) {
            scrollables.push(node);
        }
        node = node.parentElement;
    }
    scrollables.push(window);
    return scrollables;
}

/**
 * Computes fixed-position coordinates for the portal panel on open.
 * Dismisses (rather than repositions) on scroll/resize — a scrolling ancestor
 * signals navigation intent, not continued panel interaction.
 */
const usePortalPosition = (
    triggerRef: RefObject<HTMLElement>,
    isOpen: boolean,
    dropdownHeight: number,
    autoPosition: boolean,
    enabled: boolean,
    onClose: () => void,
    panelRef: RefObject<HTMLElement>,
): {
    top: number;
    left: number;
    placement: "below" | "above";
} => {
    const [position, setPosition] = useState<{
        top: number;
        left: number;
        placement: "below" | "above";
    }>({
        top: 0,
        left: 0,
        placement: "below",
    });

    const computePosition = useCallback(() => {
        if (!enabled || !triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let placement: "below" | "above" = "below";
        if (autoPosition && spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            placement = "above";
        }

        setPosition({
            top: placement === "below" ? rect.bottom + 7 : rect.top - 7,
            left: rect.left,
            placement,
        });
    }, [triggerRef, dropdownHeight, autoPosition, enabled]);

    useLayoutEffect(() => {
        if (!enabled || !isOpen) return;

        computePosition();

        // panelRef guard: prevent internal panel scrolls from triggering a close.
        const handleScrollClose = (event: Event) => {
            if (panelRef.current?.contains(event.target as Node)) return;
            onClose();
        };

        const options: AddEventListenerOptions = { passive: true };

        const scrollTargets = triggerRef.current
            ? getScrollableAncestors(triggerRef.current)
            : [window as Window];

        scrollTargets.forEach((el) => el.addEventListener("scroll", handleScrollClose, options));
        window.addEventListener("resize", onClose, options);

        return () => {
            scrollTargets.forEach((el) => el.removeEventListener("scroll", handleScrollClose));
            window.removeEventListener("resize", onClose);
        };
    }, [enabled, isOpen, computePosition, triggerRef, onClose, panelRef]);

    return position;
};

export default usePortalPosition;
