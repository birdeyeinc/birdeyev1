import type { RefObject } from "react";
import {
    SplitDropdownPanelItem,
} from "../interface";

// ─── Item resolution ──────────────────────────────────────────────────────────

export const resolveInitialSelectedItemKey = (
    items: SplitDropdownPanelItem[],
    defaultSelectedKey?: string,
    currentKey?: string | null
) => {
    const preferredKey = currentKey || defaultSelectedKey;

    if (preferredKey && items.some((item) => item.key === preferredKey)) {
        return preferredKey;
    }

    return items[0]?.key ?? null;
};

export const resolveItemValue = (
    item: SplitDropdownPanelItem,
    value?: SplitDropdownPanelItem["value"]
) => {
    const rawValue = value !== undefined ? value : item.value;

    switch (item.type) {
        case "single": return rawValue ?? null;
        case "multi":  return rawValue ?? {};
        case "custom": return rawValue;
    }
};

export const getClearedValueForItem = (item: SplitDropdownPanelItem) => {
    switch (item.type) {
        case "single": return null;
        case "multi":  return {};
        case "custom": return undefined;
    }
};

export const getSelectionCount = (
    item: SplitDropdownPanelItem,
    value: SplitDropdownPanelItem["value"]
): number => {
    if (item.showRightPanel === false || !item.type) {
        return 0;
    }

    if (item.getSelectionCount) {
        return item.getSelectionCount(value);
    }

    switch (item.type) {
        case "multi":
            return Object.keys((value as Record<string, true>) ?? {}).length;
        case "single":
        case "custom":
            return value !== undefined && value !== null ? 1 : 0;
        default:
            return 0;
    }
};

// ─── Viewport positioning ─────────────────────────────────────────────────────

export const getOpenDirection = (
    triggerRef: RefObject<HTMLDivElement>,
    dropdownHeight: number
): "below" | "above" => {
    if (!triggerRef.current) return "below";

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window?.innerHeight;
    const gap = 7;

    const spaceBelow = viewportHeight - triggerRect.bottom - gap;
    const spaceAbove = triggerRect.top - gap;

    if (spaceBelow >= dropdownHeight) return "below";
    if (spaceAbove >= dropdownHeight) return "above";

    return spaceBelow >= spaceAbove ? "below" : "above";
};
