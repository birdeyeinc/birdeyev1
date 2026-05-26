import React from "react";
import PropTypes from "prop-types";
import ToggleableContent from "./ToggleableContent";
import { map } from "lodash";

function ToggleableMenu(props) {
    const { menuArray, menuClickedCallback, customMenuStyles, customTitleStyles, customTitleContainerStyles, customMenuClass, addBorderBottom, overrideSingle, customAccordian } = props;
    return (
        <div className="el-toggleable-menu" data-test-id="el-test-toggleable-menu">
            {menuArray && map(menuArray, (menu, index) =>
                (
                    <ToggleableContent
                        key={index}
                        menu={menu}
                        menuIndex={index}
                        menuClickedCallback={menuClickedCallback}
                        customMenuStyles={customMenuStyles}
                        customTitleStyles={customTitleStyles}
                        customTitleContainerStyles={customTitleContainerStyles}
                        singleSection={menuArray.length === 1 && !overrideSingle}
                        customMenuClass={customMenuClass}
                        addBorderBottom={addBorderBottom}
                        customAccordian={customAccordian}
                    />
                )
            )}
        </div>
    );
}

ToggleableMenu.propTypes = {
    menuArray: PropTypes.array,
    menuClickedCallback: PropTypes.func,
    customMenuStyles: PropTypes.object,
    customTitleStyles: PropTypes.object,
    customTitleContainerStyles: PropTypes.object,
    customMenuClass: PropTypes.string,
    addBorderBottom: PropTypes.bool,
    customAccordian: PropTypes.bool,
    overrideSingle: PropTypes.bool
};

export default ToggleableMenu;