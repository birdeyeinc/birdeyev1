import { useCallback, useEffect, useMemo, useState } from "react";
import { SplitDropdownPanelItem } from "../interface";
import { resolveInitialSelectedItemKey } from "../utils/itemUtils";

const useSelectedItem = ({
    items,
    defaultSelectedKey,
}: {
    items: SplitDropdownPanelItem[];
    defaultSelectedKey?: string;
}) => {
    const [committedItemKey, setCommittedItemKey] = useState<string | null>(() =>
        resolveInitialSelectedItemKey(items, defaultSelectedKey),
    );
    const [activeItemKey, setActiveItemKey] = useState<string | null>(() =>
        resolveInitialSelectedItemKey(items, defaultSelectedKey),
    );

    useEffect(() => {
        setCommittedItemKey((currentKey) =>
            resolveInitialSelectedItemKey(items, defaultSelectedKey, currentKey),
        );
    }, [items, defaultSelectedKey]);

    useEffect(() => {
        setActiveItemKey((currentKey) => {
            const resolvedCommittedKey = resolveInitialSelectedItemKey(
                items,
                defaultSelectedKey,
                committedItemKey,
            );

            return resolveInitialSelectedItemKey(
                items,
                defaultSelectedKey,
                currentKey ?? resolvedCommittedKey,
            );
        });
    }, [items, defaultSelectedKey, committedItemKey]);

    const committedItem = useMemo(
        () => (committedItemKey ? items.find((item) => item.key === committedItemKey) ?? null : null),
        [items, committedItemKey],
    );

    const activeItem = useMemo(
        () => (activeItemKey ? items.find((item) => item.key === activeItemKey) ?? null : null),
        [items, activeItemKey],
    );

    const resetActiveItemKey = useCallback(() => {
        setActiveItemKey(committedItemKey);
    }, [committedItemKey]);

    const commitActiveItemKey = useCallback((nextItemKey?: string | null) => {
        setCommittedItemKey(nextItemKey ?? activeItemKey ?? null);
    }, [activeItemKey]);

    return {
        committedItemKey,
        committedItem,
        activeItemKey,
        setActiveItemKey,
        activeItem,
        resetActiveItemKey,
        commitActiveItemKey,
    };
};

export default useSelectedItem;
