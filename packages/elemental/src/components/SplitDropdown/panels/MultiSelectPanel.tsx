import React from "react";
import ListWithCheckBox from "components/ListWithCheckBox";
import {
    SplitDropdownPanelItem,
    SplitDropdownOption,
} from "../interface";

interface MultiSelectPanelProps {
    item: SplitDropdownPanelItem;
    onValueChange: (value: SplitDropdownPanelItem["value"]) => void;
    draftValue: SplitDropdownPanelItem["value"];
    listState?: {
        options: SplitDropdownOption[];
        loadingMore: boolean;
        infiniteScrollProps?: Record<string, any>;
    };
}

const MultiSelectPanel: React.FC<MultiSelectPanelProps> = ({
    item,
    onValueChange,
    draftValue,
    listState,
}) => {
    if (!listState) return null;

    const multiItem = item as SplitDropdownPanelItem;
    const { options, infiniteScrollProps = {} } = listState;
    const itemListProps = multiItem.listProps || {};
    const searchPlaceholder = multiItem.searchPlaceholder || itemListProps.searchPlaceholder || "Search";
    const noDataScreen = multiItem.noDataScreen || (
        <div style={{ padding: "10px 0px" }}>No matches found</div>
    );

    const effectiveSelectedValues = (draftValue as Record<string, SplitDropdownOption>) || {};

    const checkedBoxData: Record<string, true> = {};
    Object.keys(effectiveSelectedValues).forEach((k) => { checkedBoxData[k] = true; });

    const handleChange = (
        option: any,
        event: any,
        type: string,
    ) => {
        const currentSelected = { ...effectiveSelectedValues };

        if (type === "SELECTED_ALL") {
            const allSelected: Record<string, SplitDropdownOption> = {};
            options.forEach((opt: SplitDropdownOption) => {
                allSelected[String(opt.value)] = { label: opt.label, value: opt.value };
            });
            onValueChange(allSelected);
            return;
        }

        if (type === "REMOVE_ALL") {
            onValueChange({});
            return;
        }

        if (event?.target?.checked) {
            currentSelected[String(option.value)] = { label: option.label, value: option.value };
        } else {
            delete currentSelected[String(option.value)];
        }

        onValueChange(currentSelected);
    };

    return (
        <ListWithCheckBox
            list={options}
            checkedBoxData={effectiveSelectedValues}
            checkBoxCallback={handleChange}
            searchPlaceholder={searchPlaceholder}
            infiniteScrollProps={infiniteScrollProps}
            showCheckboxBeforeText
            noDataScreen={noDataScreen}
            isLoadingAllPages={listState.loadingMore}
            {...itemListProps}
        />
    );
};

export default MultiSelectPanel;
