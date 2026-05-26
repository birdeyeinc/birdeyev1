import React, { ReactNode } from "react";
import Styles from "./trait-tabs.module.scss";

interface TabsToggleProps {
    tabsArray: {
        label: ReactNode;
        value: string;
    }[];
    onTabSelect: (tab: string) => void;
    selected: string;
}

const TabsToggle = ({ tabsArray, onTabSelect, selected }: TabsToggleProps) => {
    const selectedTab = selected || tabsArray?.[0]?.value;

    const handleTabClick = (tab: string) => {
        if (tab !== selectedTab) {
            onTabSelect(tab);
        }
    };

    const tabsCount = tabsArray?.length || 0;

    return (
        <div className={`el-tabs-toggle-container ${Styles["tab-container"]} ${Styles["el-tabs-toggle-container"]} ${tabsCount > 4 ? Styles["more-tabs"] : ""}`}>
            {tabsArray.map((tab) => (
                <div
                    key={tab?.value}
                    className={`tab ${Styles["tab"]} ${tab?.value === selectedTab ? `active ${Styles["active"]}` : ""}`}
                    onClick={() => handleTabClick(tab?.value)}
                    data-testid="el-test-tab"
                    data-test-tab-active={tab?.value === selectedTab}
                >
                    {tab?.label}
                </div>
            ))}
        </div>
    );
};

export default TabsToggle;