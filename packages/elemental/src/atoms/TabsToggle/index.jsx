import React, { useState } from "react";
import PropTypes from "prop-types";
import style from "./TabsToggle.module.scss";

const TabsToggle = ({ tabsArray, onTabSelect, selected }) => {
    const [selectedTab, setSelectedTab] = useState(selected || tabsArray[0]);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        if (tab !== selectedTab) {
            onTabSelect(tab);
        }
    };

    return (
        <div className={`el-tabs-toggle-container ${style["tab-container"]}`}>
            {tabsArray.map((tab, index) => (
                <div
                    key={index}
                    className={`${style['tab']} ${tab === selectedTab ? style['active'] : ''}`}
                    onClick={() => handleTabClick(tab)}
                    data-testid="el-test-tab"
                    data-test-tab-active = {tab === selectedTab}
                >
                    {tab}
                </div>
            ))}
        </div>
    );
};

TabsToggle.propTypes = {
    /**
     * List of string which will show as tab
     */
    tabsArray: PropTypes.array.isRequired,
    /**
     * onTabSelect(tab: string) : function which will have active tab as an argument
     */
    onTabSelect: PropTypes.func,
    /**
     * Already selected tab
     */
    selected: PropTypes.string
};

export default TabsToggle;
