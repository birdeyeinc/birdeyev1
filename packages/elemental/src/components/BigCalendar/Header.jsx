import PropTypes from "prop-types";
import React from "react";

const Header = ({ label, isHover, isSocial, createPostCallBack, showPlusIcon }) => {
    const labelArr = label.split(" ");
    return (
        <div>
            <span role="columnheader" aria-sort="none">
                { labelArr[0] } { labelArr.length > 1  && <small className="date-text">{ labelArr[1] }</small> }
            </span>
            { (showPlusIcon && isSocial && isHover) && <i className="icon_phoenix-add-circle" onClick={createPostCallBack} /> }
        </div>
    );
};

Header.propTypes = {
    label: PropTypes.node,
    isHover: PropTypes.bool,
    isSocial: PropTypes.bool,
    createPostCallBack: PropTypes.func.isRequired,
    showPlusIcon: PropTypes.bool
};

export default Header;
