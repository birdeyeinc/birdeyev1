import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./SingleSelectView.module.scss";
import Tooltip from "atoms/Tooltip";
import warningIcon from "assets/images/warning.svg";
import { getEncodedStyleClass } from "utils/index";


const getStyle = (str)=>{
    return getEncodedStyleClass(str, styles);
}

class SingleSelectRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            highlight: false,
            showTooltip: false,
            optionBottom: 0
        };
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.enableApply) {
            this.setState({
                highlight: false
            });
        }
    };

    listItemClick = (changeEvent) => {
        const {
            option,
            onClickOption,
            groupName,
            currentUl
        } = this.props;

        let ul = document.getElementById(currentUl);
        let lis = ul.getElementsByTagName("li");
        for (let i = 0; i < lis.length; i++) {
            lis[i].classList.remove("highlight");
        }
        this.setState({
            highlight: true
        }, () => {
            this.liNode.classList.add("highlight");
            return onClickOption({ ...option, optGroup: groupName, changeEvent });
        });
    };

    callMouseOver = (evt, index, liNode) => {
        const { scrollWidth, clientWidth } = evt.currentTarget;
        const optionNodeRect = liNode.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const optionBottom = (windowHeight - optionNodeRect.top) + "px";

        this.setState({
            [`tt-${index}`]: scrollWidth > clientWidth,
            optionBottom
        });
    };
    toggleTooltip = (value) => {
        this.setState({
            showTooltip: value
        });
    }

    getIconAvatarClass = (firstName, lastName, showListItemAvailability = false, status = 0) => {
        let className = "";
        let initials = (firstName && firstName[0]) + (lastName && lastName[0]);

        let initialModulus = (initials.charCodeAt(0) + (initials[1] ? initials.charCodeAt(1) : 0)) % 7;
        if(showListItemAvailability){
            className = status == 1 ? "light-green" : "light-grey";
        } else {
            switch (initialModulus) {
                case 0:
                    className = "light-pink";
                    break;
                case 1:
                    className = "dark-blue";
                    break;
                case 2:
                    className = "light-orange";
                    break;
                case 3:
                    className = "light-green";
                    break;
                case 4:
                    className = "light-blue";
                    break;
                case 5:
                    className = "light-red";
                    break;
                case 6:
                    className = "dark-green";
                    break;
    
                default: className = "light-orange";
            }
        }
        return className;
    };

    getInitialPlaceholder = (label, showListItemAvailability = false, status = 0) => {
        const splittedName = label.split(" ");
        const firstName = splittedName[0].toUpperCase();
        const lastName = splittedName[1] ? splittedName[1].toUpperCase() : "";

        return (
            <div className={`set-intitals ${this.getIconAvatarClass(firstName, lastName, showListItemAvailability, status)}`}><span>{firstName[0]}{lastName[0]}</span></div>
        );
    };

    render() {
        const {
            name,
            option,
            selectedValue,
            toggleCustomHtml,
            key,
            supportMultipleList = false,
            selectedType = null,
            hoverTipDisabled,
            overrideDefault,
            overRideDefaulSelectedStyle,
            canOptionsInvalid,
            isInfoInPlace,
            showTitleOnHover,
            customTooltipIcon
        } = this.props;
        const { emailId, label, value, hover, disabled, optionJSX, customLabel, type = null,showTooltipOnIcon, customIcon, customClassName, customImage, showListItemAvailability = false, status = 0, ...otherOptionProps } = option;
        const isSelected = !supportMultipleList ? (selectedValue.fromDate ? value == "range" : (value == selectedValue || (selectedValue == window?.BE?.user?.id && value == selectedValue))) : type == selectedType && value == selectedValue || (selectedValue == window.BE.user.id && value == selectedValue);
        const eventObj = hover ? {
            onMouseEnter: hover.customHoverHtml ? this.toggleTooltip.bind(this, true) : toggleCustomHtml.bind(this, true, hover.getHoverHtml, this.liNode),
            onMouseLeave: hover.customHoverHtml ? this.toggleTooltip.bind(this, false) : toggleCustomHtml.bind(this, false, hover.getHoverHtml, this.liNode)
        } : null;

        const { highlight, showTooltip, optionBottom } = this.state;

        let styleNamesTooltipParent = "";
        const isInvalidOption = canOptionsInvalid && option.valid && option.valid === "invalid";
        if (isInvalidOption) {
            styleNamesTooltipParent += " " +  "option-fade";
        }

        return (<li ref={(node) => {
            return this.liNode = node;
        }} className={`${disabled ? "disabled" : (highlight ? " highlight" : "")} ${customClassName ? customClassName : ""} ${getStyle(isSelected ? "selected" : "" || disabled ? "disabled-list" : "")}`} {...eventObj} onClick={isSelected ? (this.props.isSocial ? this.listItemClick : this.props.hide) : null}>
            <label className={`label-cont ${getStyle(overrideDefault ? "ss-label-full" : "")}`} {...otherOptionProps} >
                {
                    customIcon ? <i className={`icon mr-5 ${customIcon}`}/> : null
                }
                {showTooltip && (
                    hover.customHoverHtml && (
                        <Tooltip
                            customContainerClassName="ml-0 no-iconhover"
                            text={hover.customHoverHtml}
                            position= {hover.position || "left"}
                        />
                    )
                )}
                <input
                    onChange={(disabled || hover || isInvalidOption) ? null : this.listItemClick}
                    value={value}
                    type="radio"
                    name={name}
                    checked={isSelected}
                    disabled={disabled}
                />
                <div className={`el-ss-tooltip-wrapper ${styles["tooltip-wrapper"]} ${showTooltipOnIcon && showTooltipOnIcon.html ? styles["wrapper-with-icon"] : ""} ${getStyle(overrideDefault ? "ss-tooltip-full" : "")}`}
                    style={{ display: (isInvalidOption || isInfoInPlace) ? "flex" : "block", width: isInfoInPlace ? "auto" : "" }}
                >
                    <div className={`icon tootip-parent ${getStyle(styleNamesTooltipParent)}`}>
                        {option.img ? <span>
                            <img src={option.img} />
                        </span> : option.initialsPlaceholder ? this.getInitialPlaceholder(customLabel || label, showListItemAvailability, status) : option.inlineIcon ? <span className={option.inlineIcon} /> : "" }

                        <span
                            className={`${getStyle(isSelected ? "text selected" : "text")} ${overRideDefaulSelectedStyle && isSelected ? "user-status-active" : "user-status-inactive"}`}
                            onMouseOver={
                                (event) => {
                                    return this.callMouseOver(event, key, this.liNode);
                                }
                            }
                        >
                            <span className={`use-nameId ${styles["label-custom-image"]}`} title={showTitleOnHover ? label : ""}>
                                {optionJSX ? optionJSX : (customLabel || label)} 
                                {
                                    customImage ? <i className={customImage} /> : null
                                }
                            </span>
                            {emailId && <span title={emailId.length >= 30 ? `${emailId}` : ""} className="user-emailId">{emailId}</span>}
                        </span>
                        {this.state[`tt-${key}`] && !hoverTipDisabled ? <div className="tooltip-dark">
                            <div className="inner" style={{bottom: optionBottom, position: "fixed"}}>
                                {customLabel || label}
                            </div>
                            {emailId && <div className="inner" style={{bottom: optionBottom, position: "fixed"}}>
                                {emailId}
                            </div> }
                        </div> : null}
                    </div>
                    { //This is when only some part of li needs to show tooltip on hover	
                        !hoverTipDisabled && showTooltipOnIcon && showTooltipOnIcon.html && (
                            <Tooltip
                                text={showTooltipOnIcon.html}
                                position="bottom"
                                customContainerClassName="question-wrap"
                            >
                                {customTooltipIcon ? <i className={customTooltipIcon} /> : <i className="icon_phoenix-question-circle" />}
                            </Tooltip>
                        )
                    }
                    {
                        canOptionsInvalid && option.valid && option.valid === "invalid" && (option.linkText || option.tooltipText) && (
                            <Tooltip
                                tooltipText={option.linkText ? null : option.tooltipText}
                                linkText={option.linkText}
                                position="bottom"
                            >
                                <img src={warningIcon} />
                            </Tooltip>
                        )
                    }
                </div>
                
                {isSelected && <span className={`icon icon_phoenix-checkmark icon-post_reply ml-10 ${selectedValue === "#white" ? "black-tick-mark" : ""}`} />}
            </label>
        </li>);
    }

}

SingleSelectRow.propTypes = {
    groupName: PropTypes.string,
    currentUl: PropTypes.string,
    name: PropTypes.string,
    onClickOption: PropTypes.func,
    hide: PropTypes.func,
    option: PropTypes.object,
    selectedValue: PropTypes.node,
    toggleCustomHtml: PropTypes.func,
    enableApply: PropTypes.bool,
    isCustomDateRange: PropTypes.bool,
    key: PropTypes.number,
    supportMultipleList: PropTypes.bool,
    selectedType: PropTypes.string,
    hoverTipDisabled: PropTypes.bool,
    overrideDefault: PropTypes.bool,
    overRideDefaulSelectedStyle: PropTypes.bool,
    canOptionsInvalid: PropTypes.bool,
    isInfoInPlace: PropTypes.bool,
    showTitleOnHover: PropTypes.bool,
    customTooltipIcon: PropTypes.string,
    isSocial: PropTypes.bool
};

export default SingleSelectRow;