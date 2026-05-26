import {
    SplitDropdownPanelItem,
    SplitDropdownOutputItem,
} from "../interface";
import { resolveItemValue, getClearedValueForItem } from "./itemUtils";

// ─── Draft buffer operations ──────────────────────────────────────────────────

export const clearOtherDraftValues = (
    items: SplitDropdownPanelItem[],
    draftValues: Record<string, SplitDropdownPanelItem["value"]>,
    activeItemKey: string | null
): Record<string, SplitDropdownPanelItem["value"]> => {
    const filteredDrafts: Record<string, SplitDropdownPanelItem["value"]> = {};

    items.forEach((item) => {
        filteredDrafts[item.key] = item.key === activeItemKey
            ? draftValues[item.key]
            : item.showRightPanel !== false && item.type
                ? getClearedValueForItem(item)
                : undefined;
    });

    return filteredDrafts;
};

export const createDraftValuesFromItems = (
    items: SplitDropdownPanelItem[],
    isClearClick = false
): Record<string, SplitDropdownPanelItem["value"]> => {
    const draft: Record<string, SplitDropdownPanelItem["value"]> = {};

    items.forEach((item) => {
        draft[item.key] = item.showRightPanel === false || !item.type
            ? undefined
            : isClearClick
                ? getClearedValueForItem(item)
                : resolveItemValue(item);
    });

    return draft;
};

export const applyDraftValuesToItems = (
    items: SplitDropdownPanelItem[],
    draftValues: Record<string, SplitDropdownPanelItem["value"]>
): SplitDropdownPanelItem[] => items.map((item) => {
    if (item.showRightPanel === false || !item.type) {
        return item;
    }

    return {
        ...item,
        value: resolveItemValue(item, draftValues[item.key]),
    } as SplitDropdownPanelItem;
});

export const buildCallbackPayload = (
    items: SplitDropdownPanelItem[]
): SplitDropdownOutputItem[] => items.map((item) => {
    if (item.showRightPanel === false || !item.type) {
        return { key: item.key, label: item.label };
    }

    return { key: item.key, label: item.label, value: item.value };
});
