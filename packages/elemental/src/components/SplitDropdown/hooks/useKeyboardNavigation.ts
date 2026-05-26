import { useEffect, useRef, useState } from "react";
import { SplitDropdownPanelItem } from "../interface";

/**
 * Adds full keyboard navigation to the SplitDropdown left panel.
 *
 * Key bindings:
 *   ArrowDown        — move focus to the next item (wraps to top)
 *   ArrowUp          — move focus to the previous item (wraps to bottom)
 *   ArrowRight/Enter — activate the focused item (same as clicking it)
 *   Escape           — close the dropdown
 *
 * focusedIndex tracks which left-panel item has keyboard focus (-1 = none).
 * leftPanelRef is attached to the left-panel container so focused items can
 * be scrolled into view automatically.
 */
const useKeyboardNavigation = ({
    items,
    isOpen,
    selectedItemKey,
    onSelectItem,
    onClose,
    disabled = false,
}: {
    items: SplitDropdownPanelItem[];
    isOpen: boolean;
    selectedItemKey: string | null;
    onSelectItem: (item: SplitDropdownPanelItem) => void;
    onClose: () => void;
    disabled?: boolean;
}) => {
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const leftPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setFocusedIndex(-1);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || focusedIndex < 0 || !leftPanelRef.current) return;

        const buttons = leftPanelRef.current.querySelectorAll<HTMLButtonElement>(
            "[data-left-panel-item]",
        );
        buttons[focusedIndex]?.scrollIntoView({ block: "nearest" });
    }, [focusedIndex, isOpen]);

    /*
    Keyboard handler 
    On the first arrow press, focus starts from the currently selected item
    rather than index 0 so the user's context is preserved.
    */
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (disabled || !isOpen || items.length === 0) return;

        // On the first arrow press, start from the currently selected item.
        const resolveStartIndex = () => {
            const activeIndex = items.findIndex((item) => item.key === selectedItemKey);
            return activeIndex >= 0 ? activeIndex : 0;
        };

        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                setFocusedIndex((prev) => {
                    if (prev < 0) return resolveStartIndex();
                    return prev < items.length - 1 ? prev + 1 : 0;
                });
                break;
            }

            case "ArrowUp": {
                event.preventDefault();
                setFocusedIndex((prev) => {
                    if (prev < 0) return resolveStartIndex();
                    return prev > 0 ? prev - 1 : items.length - 1;
                });
                break;
            }

            case "ArrowRight":
            case "Enter": {
                event.preventDefault();
                const targetItem = items[focusedIndex];
                if (targetItem) {
                    onSelectItem(targetItem);
                }
                break;
            }

            case "Escape": {
                event.preventDefault();
                onClose();
                break;
            }

            default:
                break;
        }
    };

    return {
        focusedIndex,
        leftPanelRef,
        handleKeyDown,
    };
};

export default useKeyboardNavigation;
