import React from "react";
import {
    SplitDropdownPanelItem,
} from "../interface";
import { getSelectionCount } from "../utils/itemUtils";
import style from "../SplitDropdown.module.scss";

interface LeftPanelProps {
    items: SplitDropdownPanelItem[];
    activeItemKey: string | null;
    onItemClick: (item: SplitDropdownPanelItem) => void;
    header?: string;
    leftPanelWidth?: number;
    draftValues: Record<string, SplitDropdownPanelItem["value"]>;
    focusedIndex: number;
    leftPanelRef: React.RefObject<HTMLDivElement>;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
    items,
    activeItemKey,
    onItemClick,
    header,
    leftPanelWidth,
    draftValues,
    focusedIndex,
    leftPanelRef,
}) => {
    const renderSelectionIndicator = (item: SplitDropdownPanelItem) => {
        if (item.showSelectionCount === false || item.showRightPanel === false) return null;

        const value = draftValues[item.key];

        if (item?.renderCustomSelectionIndicator) {
            return <span className={style["selection-summary"]}>{item.renderCustomSelectionIndicator?.(value)}</span>;
        }

        const count = getSelectionCount(item, value);
        if (count <= 0) return null;

        return <span className={style["selection-badge"]}>{count}</span>;
    };

    return (
        <div
            className={style["left-panel"]}
            style={leftPanelWidth ? { width: leftPanelWidth } : { width: "240px" }}
            ref={leftPanelRef}
            data-test-id="el-test-split-dropdown-left-panel"
        >
            {header && (
                <div className={style["left-panel-header"]} data-test-id="el-test-split-dropdown-left-panel-header">{header}</div>
            )}
            {items.map((item, index) => {
                const isActive = item.key === activeItemKey;
                const isFocused = index === focusedIndex;
                const itemShowsRightPanel = item.showRightPanel !== false;

                return (
                    <button
                        type="button"
                        key={item.key}
                        className={`${style["left-panel-item"]} ${isActive ? style["active"] : ""} ${isFocused ? style["keyboard-focused"] : ""}`}
                        onClick={() => onItemClick(item)}
                        tabIndex={-1}
                        data-left-panel-item
                        data-test-id={`el-test-split-dropdown-left-item-${item.key}`}
                    >
                        <span className={style["item-label"]} data-test-id={`el-test-split-dropdown-left-item-label-${item.key}`}>{item.label}</span>
                        <span className={style["item-right"]} data-test-id={`el-test-split-dropdown-left-item-meta-${item.key}`}>
                            {renderSelectionIndicator(item)}
                            {itemShowsRightPanel
                                ? <i className={`icon_phoenix-cheveron_open ${style["item-arrow"]}`} />
                                : isActive
                                    ? <i className={`icon_phoenix-checkmark ${style["item-checkmark"]}`} />
                                    : null}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default React.memo(LeftPanel);