import React from "react";
import PropTypes from "prop-types";
import Styles from "./Tag.module.scss";
import Tooltip from "atoms/Tooltip";
import { getEncodedStyleClass } from "utils/index";

const getStyle = str => getEncodedStyleClass(str,Styles);

const Tag = ({title, onClick, onRemove, active, size, isPDFLitePage, isValidEmail, isDefaultTag = false, isApprovalTab = false, aiSuggestion = false, isTagDeletable = () => true }) => {
    let JSX = null;
    let classList = `${active ? "tag active" : "tag"} ${size == "small" ? "small" : ""} ${isPDFLitePage ? "pdf-small " : ""} ${!isValidEmail && isApprovalTab ? "warning-email-tag " : ""} `;
    
    if (isDefaultTag) {
        classList = classList.replace("email-tag", "");
    }

    if (onClick === undefined && onRemove === undefined) {
        JSX = (
            <span className={`el-tag ${getStyle(classList)} ${isDefaultTag ? "pointer-events-none" : ""}`}>
                {title}
            </span>
        );
    } else if (onClick === undefined) {
        classList += " has-remove";
        JSX = (
            <span className={`el-tag ${getStyle(classList)}`}>
                {isTagDeletable(title, aiSuggestion) && (
                    <a onClick={onRemove} data-testid="el-test-tag-on-remove" name={title} className="remove-tag icons icon_phoenix-reset" />
                )}
                {title}
            </span>
        );
    } else if (onRemove === undefined) {
        classList += " clickable";
        JSX = (
            <a className={`el-tag ${getStyle(classList)}`} onClick={onClick} data-testid="el-test-tag-on-click">
                {title}
            </a>
        );
    } else {
        classList += " clickable has-remove";
        JSX = (
            <React.Fragment>
                {!isTagDeletable(title, aiSuggestion) ? 
                    <Tooltip text="This tag is automatically added to AI posts to categorize them and can't be edited or removed." position="bottom-left-pre" tooltipClass="manage-tooltip" size="x-small">
                        <span className={`${!isTagDeletable(title, aiSuggestion) ? "pr-10" : "" } ${getStyle(classList)}`} onClick={onClick} data-testid="el-test-tag-on-click">
                            {!isValidEmail  && <i className="icon_phoenix-disable-business" />}
                            {title}
                        </span>
                    </Tooltip> : 
                    <span className={`el-tag ${getStyle(classList)}`} onClick={onClick} data-testid="el-test-tag-on-click">
                        {!isValidEmail  && <i className="icon_phoenix-disable-business" />}
                        <a onClick={onRemove} data-testid="el-test-tag-on-remove" name={title} className="remove-tag icons icon_phoenix-reset" />
                        {title}
                    </span>
                }
            </React.Fragment>
        );
    }
    return JSX;
};

Tag.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onRemove: PropTypes.func,
    active: PropTypes.bool,
    size: PropTypes.string,
    isValidEmail: PropTypes.bool,
    isDefaultTag: PropTypes.bool,
    isApprovalTab: PropTypes.bool,
    aiSuggestion: PropTypes.bool,
    isTagDeletable: PropTypes.func,
    isPDFLitePage: PropTypes.bool
};

export default Tag;
