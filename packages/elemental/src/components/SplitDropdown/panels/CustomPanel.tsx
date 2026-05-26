import React from "react";
import {
    CustomPanelProps,
    SplitDropdownPanelItem,
} from "../interface";

interface CustomPanelComponentProps {
    item: SplitDropdownPanelItem;
    onValueChange: (value: SplitDropdownPanelItem["value"]) => void;
    draftValue: SplitDropdownPanelItem["value"];
    customPanelProps?: Pick<CustomPanelProps, "actions">;
}

const CustomPanel: React.FC<CustomPanelComponentProps> = ({
    item,
    onValueChange,
    draftValue,
    customPanelProps,
}) => {
    const customItem = item as SplitDropdownPanelItem;

    if (!customPanelProps || !customItem.renderCustomJSXInRightPanel) return null;

    return (
        <>
            {customItem.renderCustomJSXInRightPanel({
                value: draftValue,
                onChange: onValueChange,
                actions: customPanelProps.actions,
            })}
        </>
    );
};

export default CustomPanel;
