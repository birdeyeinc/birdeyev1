import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import useClickOutside from "hooks/useClickOutside";
import { getOpenDirection } from "../utils/itemUtils";

const useDropdownOpen = ({
    closeOnOutsideClick = true,
    autoPosition = true,
    dropdownHeight,
    controlledIsOpen,
    onOpenChange,
    usePortal = false,
}: {
    closeOnOutsideClick?: boolean;
    autoPosition?: boolean;
    dropdownHeight: number;
    controlledIsOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    usePortal?: boolean;
}) => {
    const isControlled = controlledIsOpen !== undefined;
    const portalPanelRef = React.useRef<HTMLDivElement>(null);

    const handleOutsideClose = (event?: MouseEvent) => {
        if (event && portalPanelRef.current?.contains(event.target as Node)) {
            setIsOpen(true);
            return;
        }
        onOpenChange?.(false);
    };

    const {
        ref: containerRef,
        isComponentVisible: internalIsOpen,
        setIsComponentVisible: setIsOpen,
    } = useClickOutside(
        false,
        null,
        closeOnOutsideClick ? handleOutsideClose : undefined,
    );

    useEffect(() => {
        if (!usePortal) return;

        const el = containerRef.current as HTMLElement | null;
        if (!el) return;

        const nativeContains = HTMLElement.prototype.contains;
        el.contains = function (node: Node) {
            return nativeContains.call(this, node) ||
                !!(portalPanelRef.current?.contains(node));
        };

        return () => {
            delete (el as any).contains;
        };
    }, [usePortal]);

    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

    const [openDirection, setOpenDirection] = useState<"below" | "above">("below");
    useLayoutEffect(() => {
        if (isOpen && autoPosition && containerRef.current) {
            setOpenDirection(getOpenDirection(containerRef as React.RefObject<HTMLDivElement>, dropdownHeight));
        }
    }, [isOpen, autoPosition, dropdownHeight]);

    const toggleDropdown = () => {
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
    };

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        onOpenChange?.(false);
    }, [onOpenChange, setIsOpen]);

    return {
        containerRef,
        portalPanelRef,
        isOpen: Boolean(isOpen),
        openDirection,
        toggleDropdown,
        closeDropdown,
    };
};

export default useDropdownOpen;
