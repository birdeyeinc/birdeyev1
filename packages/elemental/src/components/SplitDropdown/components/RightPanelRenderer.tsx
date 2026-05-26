import React from "react";
import LoaderBox from "atoms/LoaderBox";
import type { ReactNode } from "react";
import {
    CustomPanelProps,
    SplitDropdownOption,
    SplitDropdownPanelItem,
} from "../interface";
import SingleSelectPanel from "../panels/SingleSelectPanel";
import MultiSelectPanel from "../panels/MultiSelectPanel";
import CustomPanel from "../panels/CustomPanel";
import style from "../SplitDropdown.module.scss";

// ─── Panel registry: maps item.type → panel component ───────────────────────
// To add a new item type, create a panel component under panels/ and register it here. No other file needs to change.

const PANEL_REGISTRY: Record<string, React.FC<any>> = {
    single: SingleSelectPanel,
    multi: MultiSelectPanel,
    custom: CustomPanel,
};

interface RightPanelRendererProps {
    item: SplitDropdownPanelItem;
    onValueChange: (value: SplitDropdownPanelItem["value"]) => void;
    draftValue: SplitDropdownPanelItem["value"];
    customPanelProps?: Pick<CustomPanelProps, "actions">;
    isReseller?: boolean;
    listState?: {
        options: SplitDropdownOption[];
        loading: boolean;
        loadingMore: boolean;
        infiniteScrollProps?: {
            isPaginated: boolean;
            hasMore: boolean;
            loadMore?: () => void;
            loader?: ReactNode;
            useWindow: boolean;
            initialLoad: boolean;
            threshold: number;
            containerHeight?: string;
            handleSearch?: (search: string) => void;
        };
    };
}

const RightPanelRenderer: React.FC<RightPanelRendererProps> = ({
    item,
    onValueChange,
    draftValue,
    customPanelProps,
    listState,
    isReseller = false
}) => {
    const panelWidthStyle = item.rightPanelWidth
        ? { width: item.rightPanelWidth }
        : { width: "auto" };

    if (listState?.loading) {
        const { loaderComponent } = item;
        const hasCustomLoader = loaderComponent != null;
        const resolvedLoader = typeof loaderComponent === "function"
            ? loaderComponent()
            : loaderComponent ?? <LoaderBox type="loader-birdeye" reseller={isReseller} className="xs-height" />;

        return (
            <div
                className={`${style["right-panel"]} ${style["right-panel-loading"]}`}
                style={panelWidthStyle}
            >
                <div className={`${style["loader-container"]} ${hasCustomLoader ? style["loader-container-custom"] : ""}`}>
                    {resolvedLoader}
                </div>
            </div>
        );
    }

    if (!item.type) return null;

    const PanelComponent = PANEL_REGISTRY[item.type];
    if (!PanelComponent) return null;

    return (
        <div
            className={style["right-panel"]}
            style={panelWidthStyle}
            data-test-id={`el-test-split-dropdown-right-panel-${item.key}`}
        >
            <PanelComponent
                item={item}
                onValueChange={onValueChange}
                draftValue={draftValue}
                customPanelProps={customPanelProps}
                listState={listState}
            />
        </div>
    );
};

export default RightPanelRenderer;