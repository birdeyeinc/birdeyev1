import React from "react";
import ListWithCheckBox from "components/ListWithCheckBox";
import {
    SplitDropdownPanelItem,
} from "../interface";

interface SingleSelectPanelProps {
    item: SplitDropdownPanelItem;
    onValueChange: (value: SplitDropdownPanelItem["value"]) => void;
    draftValue: SplitDropdownPanelItem["value"];
    listState?: {
        options: NonNullable<SplitDropdownPanelItem["options"]>;
        loadingMore: boolean;
        infiniteScrollProps?: Record<string, any>;
    };
}

const SingleSelectPanel: React.FC<SingleSelectPanelProps> = ({
    item,
    onValueChange,
    draftValue,
    listState,
}) => {
    if (!listState) return null;

    const singleItem = item as SplitDropdownPanelItem;
    const { options, infiniteScrollProps = {} } = listState;
    const itemListProps = singleItem.listProps || {};
    const searchPlaceholder = singleItem.searchPlaceholder || itemListProps.searchPlaceholder || "Search";
    const noDataScreen = singleItem.noDataScreen || (
        <div style={{ padding: "10px 0px" }}>No matches found</div>
    );

    const selectedOption = draftValue as { value: string | number } | null;
    const checkedBoxData = selectedOption != null ? { [selectedOption.value]: true } : {};

    const handleChange = (listItem: any) => {
        onValueChange({ label: listItem.label, value: listItem.value });
    };

    return (
        <ListWithCheckBox
            list={options}
            checkedBoxData={checkedBoxData}
            checkBoxCallback={handleChange}
            singleSelectMode
            disableSelectAllBtn
            customClass="hideInput"
            searchPlaceholder={searchPlaceholder}
            infiniteScrollProps={infiniteScrollProps}
            noDataScreen={noDataScreen}
            isLoadingAllPages={listState.loadingMore}
            {...itemListProps}
        />
    );
};

export default SingleSelectPanel;
