import { useCallback, useEffect, useMemo, useRef } from "react";
import {
    CustomPanelProps,
    SplitDropdownPanelItem,
    SplitDropdownProps,
} from "../interface";
import useDropdownOpen from "./useDropdownOpen";
import useDraftValues from "./useDraftValues";
import useSelectedItem from "./useSelectedItem";
import useKeyboardNavigation from "./useKeyboardNavigation";

const useSplitDropdownState = ({
    items,
    defaultSelectedKey,
    onApply,
    onLeftItemChange,
    isSingleSelectLeft = false,
    closeOnOutsideClick = true,
    autoPosition = true,
    dropdownHeight = 280,
    isOpen: controlledIsOpen,
    onOpenChange,
    enableKeyboardNavigation = false,
    usePortal = false,
}: Pick<
    SplitDropdownProps,
    | "items"
    | "defaultSelectedKey"
    | "onApply"
    | "onLeftItemChange"
    | "isSingleSelectLeft"
    | "closeOnOutsideClick"
    | "autoPosition"
    | "dropdownHeight"
    | "isOpen"
    | "onOpenChange"
    | "enableKeyboardNavigation"
    | "usePortal"
>) => {

    const {
        containerRef,
        portalPanelRef,
        isOpen,
        openDirection,
        toggleDropdown: rawToggle,
        closeDropdown: closeDropdownInternal,
    } = useDropdownOpen({
        closeOnOutsideClick,
        autoPosition,
        dropdownHeight,
        controlledIsOpen,
        onOpenChange,
        usePortal,
    });

    const {
        draftValues,
        resetDraftsFromItems,
        updateDraftValue,
        applyAll,
        applyWithValue,
        clearAll,
        applyLeftOnlyItem,
    } = useDraftValues({
        items,
        isSingleSelectLeft,
        onApply,
        closeDropdown: closeDropdownInternal,
    });

    const {
        committedItemKey,
        committedItem,
        activeItemKey,
        setActiveItemKey,
        activeItem: selectedItem,
        resetActiveItemKey,
        commitActiveItemKey,
    } = useSelectedItem({
        items,
        defaultSelectedKey,
    });

    const previousIsOpenRef = useRef(isOpen);
    const closeActionRef = useRef<"commit" | "cancel" | null>(null);

    const activeItem = useMemo<{
        kind: "list" | "custom";
        item: SplitDropdownPanelItem;
    } | null>(() => {
        if (!selectedItem || selectedItem.showRightPanel === false || !selectedItem.type) {
            return null;
        }

        if (selectedItem.type === "single" || selectedItem.type === "multi") {
            return { kind: "list", item: selectedItem };
        }

        if (selectedItem.type === "custom") {
            return { kind: "custom", item: selectedItem };
        }

        return null;
    }, [selectedItem]);

    const activeItemShowsRightPanel = selectedItem?.showRightPanel !== false;
    const selectedDropdownHeight = selectedItem?.dropdownHeight ?? dropdownHeight;
    const selectedDraftValue = activeItem ? draftValues[activeItem.item.key] : undefined;

    const selectedListState = useMemo(() => {
        if (!activeItem || activeItem.kind !== "list") return undefined;

        const item = activeItem.item;

        if (!item.pagination) {
            return {
                options: item.options || [],
                loading: Boolean(item.loading),
                loadingMore: false,
            };
        }

        return {
            options: item.options || [],
            loading: Boolean(item.pagination.isLoading),
            loadingMore: Boolean(item.pagination.isLoadingMore),
            infiniteScrollProps: {
                isPaginated: true,
                hasMore: item.pagination.hasMore ?? false,
                loadMore: item.pagination.onLoadMore,
                loader: item.pagination.loader,
                useWindow: item.pagination.useWindow ?? false,
                initialLoad: item.pagination.initialLoad ?? false,
                threshold: item.pagination.threshold ?? 50,
                containerHeight: item.pagination.containerHeight,
                handleSearch: item.pagination.onSearch,
            },
        };
    }, [activeItem]);

    const triggerFetch = useCallback((item: SplitDropdownPanelItem) => {
        if (item.showRightPanel === false || !item.type) return;
        if (item.pagination) {
            item.pagination.onOpen?.();
        } else {
            item.fetchData?.(item.key);
        }
    }, []);

    useEffect(() => {
        if (!previousIsOpenRef.current && isOpen) {
            resetActiveItemKey();
            resetDraftsFromItems();

            if (committedItem) {
                triggerFetch(committedItem);
            }
        }

        if (previousIsOpenRef.current && !isOpen) {
            if (closeActionRef.current !== "commit") {
                resetActiveItemKey();
                resetDraftsFromItems();
            }

            closeActionRef.current = null;
        }

        previousIsOpenRef.current = isOpen;
    }, [
        isOpen,
        committedItem,
        resetActiveItemKey,
        resetDraftsFromItems,
        triggerFetch,
    ]);

    const toggleDropdown = () => {
        closeActionRef.current = null;
        rawToggle();
    };

    const closeDropdown = useCallback(() => {
        closeActionRef.current = "cancel";
        closeDropdownInternal();
    }, [closeDropdownInternal]);

    const handleItemClick = useCallback(
        (item: SplitDropdownPanelItem) => {
            setActiveItemKey(item.key);
            onLeftItemChange?.(item);

            if (item.showRightPanel === false) {
                commitActiveItemKey(item.key);
                closeActionRef.current = "commit";
                applyLeftOnlyItem(item.key);
            } else {
                triggerFetch(item);
            }
        },
        [applyLeftOnlyItem, commitActiveItemKey, onLeftItemChange, setActiveItemKey, triggerFetch],
    );

    const handleRightPanelValueChange = (value: SplitDropdownPanelItem["value"]) => {
        if (!selectedItem) return;
        updateDraftValue(selectedItem.key, value);
    };

    const handleApply = () => {
        commitActiveItemKey();
        closeActionRef.current = "commit";
        applyAll(activeItemKey);
    };
    const handleClear = () => clearAll();

    const customPanelProps = useMemo((): Pick<CustomPanelProps, "actions"> | undefined => {
        if (!activeItem || activeItem.kind !== "custom") return undefined;

        return {
            actions: {
                applyValue: (value: SplitDropdownPanelItem["value"]) => {
                    if (!selectedItem) return;
                    commitActiveItemKey();
                    closeActionRef.current = "commit";
                    applyWithValue(activeItemKey, selectedItem.key, value);
                },
                clearAll,
            },
        };
    }, [
        activeItem,
        activeItemKey,
        selectedItem,
        commitActiveItemKey,
        applyWithValue,
        clearAll,
    ]);

    const keyboard = useKeyboardNavigation({
        items,
        isOpen,
        selectedItemKey: activeItemKey,
        onSelectItem: handleItemClick,
        onClose: closeDropdown,
        disabled: !enableKeyboardNavigation,
    });

    const shouldShowFooter = selectedItem ? activeItemShowsRightPanel && activeItem?.kind !== "custom" : false;

    return {
        containerRef,
        portalPanelRef,
        isOpen,
        openDirection,
        selectedDropdownHeight,
        draftValues,
        selectedDraftValue,
        shouldShowRightPanel: activeItemShowsRightPanel,
        activeItemKey,
        activeItemSelection: selectedItem,
        committedItemKey,
        committedItem,
        activeItem,
        selectedListState,
        toggleDropdown,
        closeDropdown,
        handleItemClick,
        handleRightPanelValueChange,
        handleApply,
        handleClear,
        customPanelProps,
        focusedIndex: keyboard.focusedIndex,
        leftPanelRef: keyboard.leftPanelRef,
        handleKeyDown: keyboard.handleKeyDown,
        shouldShowFooter
    };
};

export default useSplitDropdownState;
