import { useCallback, useRef, useState } from "react";
import {
    SplitDropdownPanelItem,
} from "../interface";
import {
    applyDraftValuesToItems,
    buildCallbackPayload,
    clearOtherDraftValues,
    createDraftValuesFromItems,
} from "../utils/draftUtils";

const useDraftValues = ({
    items,
    isSingleSelectLeft,
    onApply,
    closeDropdown,
}: {
    items: SplitDropdownPanelItem[];
    isSingleSelectLeft: boolean;
    onApply: (payload: ReturnType<typeof buildCallbackPayload>) => void;
    closeDropdown: () => void;
}) => {
    const [draftValues, setDraftValues] = useState<Record<string, SplitDropdownPanelItem["value"]>>(() =>
        createDraftValuesFromItems(items),
    );

    const draftValuesRef = useRef<Record<string, SplitDropdownPanelItem["value"]>>(draftValues);
    draftValuesRef.current = draftValues;

    const itemsRef = useRef<SplitDropdownPanelItem[]>(items);
    itemsRef.current = items;

    const isSingleSelectLeftRef = useRef(isSingleSelectLeft);
    isSingleSelectLeftRef.current = isSingleSelectLeft;

    const buildCommittedItems = useCallback(
        (drafts: Record<string, SplitDropdownPanelItem["value"]>, activeItemKey: string | null) => {
            const currentItems = itemsRef.current;

            if (!isSingleSelectLeftRef.current) {
                return applyDraftValuesToItems(currentItems, drafts);
            }

            // Single-select-left: zero out all drafts except the active item,
            // then filter output down to that one item only.
            const isolatedDrafts = clearOtherDraftValues(currentItems, drafts, activeItemKey);
            const allItems = applyDraftValuesToItems(currentItems, isolatedDrafts);
            return activeItemKey
                ? allItems.filter((item) => item.key === activeItemKey)
                : allItems;
        },
        [],
    );

    // Reset on every open so stale edits from the previous session are discarded.
    const resetDraftsFromItems = useCallback(() => {
        setDraftValues(createDraftValuesFromItems(itemsRef.current));
    }, []);

    const updateDraftValue = useCallback((itemKey: string, value: SplitDropdownPanelItem["value"]) => {
        setDraftValues((prev) => ({ ...prev, [itemKey]: value }));
    }, []);

    const applyAll = useCallback((activeItemKey: string | null) => {
        const committedItems = buildCommittedItems(draftValuesRef.current, activeItemKey);
        onApply(buildCallbackPayload(committedItems));
        closeDropdown();
    }, [buildCommittedItems, onApply, closeDropdown]);

    const applyWithValue = useCallback((
        activeItemKey: string | null,
        itemKey: string,
        value: SplitDropdownPanelItem["value"]
    ) => {
        const updatedDrafts = { ...draftValuesRef.current, [itemKey]: value };
        setDraftValues(updatedDrafts);
        const committedItems = buildCommittedItems(updatedDrafts, activeItemKey);
        onApply(buildCallbackPayload(committedItems));
        closeDropdown();
    }, [buildCommittedItems, onApply, closeDropdown]);

    // Clears drafts but leaves the dropdown open.
    const clearAll = useCallback(() => {
        const clearedDrafts = createDraftValuesFromItems(itemsRef.current, true);
        setDraftValues(clearedDrafts);
    }, []);

    // Left-only items (showRightPanel: false) have no right panel, so apply and close immediately.
    const applyLeftOnlyItem = useCallback(
        (itemKey: string) => {
            const committedItems = buildCommittedItems(draftValuesRef.current, itemKey);
            onApply(buildCallbackPayload(committedItems));
            closeDropdown();
        },
        [buildCommittedItems, closeDropdown, onApply],
    );

    return {
        draftValues,
        resetDraftsFromItems,
        updateDraftValue,
        applyAll,
        applyWithValue,
        clearAll,
        applyLeftOnlyItem,
    };
};

export default useDraftValues;
