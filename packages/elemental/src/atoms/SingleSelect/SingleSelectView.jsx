import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "atoms/Button";
import onClickOutside from "react-onclickoutside";
import SingleSelectRow from "./SingleSelectOption";
import styles from "./SingleSelectView.module.scss";
import SearchFilter from "atoms/SearchFilter";
import { FILTER_TYPE } from "../../constants";
import ReactList from "react-list";
import ScrollIntoView from "atoms/ScrollIntoView";
import Tooltip from "atoms/Tooltip";
import AlertImg from "assets/images/error.svg";
import LoadingShimmer from "atoms/LoadingShimmer";
import { isEmpty } from "lodash";
import { getEncodedStyleClass, lowercaseFirstLetter } from "utils/index";
import LoaderBox from "atoms/LoaderBox";

const localClassSet = new Set([
    "default-filter",
    "filter-dropdown",
    "scroll-to-element",
    "tooltip-wrapper",
    "label-top",
    "dropdown-open",
    "selected-values",
    "selected-values-label",
    "dropdown-box",
    "with-icons",
    "reset-btn",
    "disabled-wrap",
    "disabled-select-box",
    "token-option",
    "default-value-label"
  ]);

export const getEncodedStyleClassWithoutEl = (classStr = "", styleObj) => {
    return classStr
        .split(/[\s\n]+/)
        .map((singleClass) => {
            if (!singleClass) return "";
            if (localClassSet.has(singleClass)) return `el-ss-${singleClass} ${styleObj[singleClass] || ''}`;
            if (!styleObj[singleClass]) return "";
            return styleObj[singleClass];
        })
        .filter(Boolean)
        .join(" ");
};

const getStyle = (str) => getEncodedStyleClassWithoutEl(str, styles)

class SingleSelectView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCustomHtml: false,
            customHtml: null,
            currPos: {},
            enableCTAs: false,
            dropdownPos: {},
            validationClasses: " valid"
        };
        this.isDropdownDisplayed = false;
    }

    handleClickOutside = () => {
        const { delayClickOutside, hide, onClickOutside } = this.props;

        if (onClickOutside && typeof onClickOutside === 'function') {
            onClickOutside();
            return;
        }

        //delaying hiding to accomodate for not changing the scroll when other filter is clicked
        delayClickOutside ? setTimeout(hide, delayClickOutside.delay !== null ? delayClickOutside.delay : 100) : hide();
    };

    toggleCustomHtml = (flag, hoverHtml, optionNode) => {
        const self = this;

        if (flag) {
            clearTimeout(this.hideTimeout);

            self.setState({
                showCustomHtml: flag,
                customHtml: typeof (hoverHtml) === "function" ? hoverHtml({ optionNode }) : hoverHtml
            });
        } else {
            this.hideTimeout = setTimeout(function () {
                self.setState({
                    showCustomHtml: flag,
                    customHtml: null
                });
            }, 100);
        }
    };

    componentWillReceiveProps(nextProps) {
        const { show, fixedDropdown, parentNode } = nextProps;
        if (show && fixedDropdown) {
            const _self = this;
            let parentNodeRect = parentNode.getBoundingClientRect();
            let selectNodeRect = _self.selectNode.getBoundingClientRect();
            if (parentNodeRect.bottom < selectNodeRect.bottom) {
                this.props.toggle();
            } else {
                const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                _self.isDropdownDisplayed = true;
                if (_self.props.dropdownNode) {
                    _self.props.dropdownNode.style.position = "fixed";
                    if (_self.props.top) {
                        _self.props.dropdownNode.style.bottom = (windowHeight - selectNodeRect.top) + "px";
                        _self.props.dropdownNode.style.top = "auto";
                    } else {
                        _self.props.dropdownNode.style.top = selectNodeRect.top + selectNodeRect.height + "px";
                    }
                    _self.props.dropdownNode.style.width = selectNodeRect.width + (name === "surveyFields" ? 100 : 0) + "px";
                }
            }
        }

        if (!show) {
            this.toggleCustomHtml(false, this.state.customHtml);
        }
    }

    componentDidMount() {
        const _self = this;
        _self.props.fixedDropdown && document.getElementById(_self.props.parentId).addEventListener("scroll", () => {
            const { show } = _self.props;
            const { parentNode, fixedDropdown } = _self.props;
            if (show && fixedDropdown) {
                let parentNodeRect = parentNode.getBoundingClientRect();
                let selectNodeRect = _self.selectNode.getBoundingClientRect();
                if (parentNodeRect.bottom < selectNodeRect.bottom) {
                    _self.props.toggle();
                } else {
                    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    _self.isDropdownDisplayed = true;
                    if (_self.props.dropdownNode) {
                        _self.props.dropdownNode.style.position = "fixed";
                        if (_self.props.top) {
                            _self.props.dropdownNode.style.bottom = (windowHeight - selectNodeRect.top) + "px";
                            _self.props.dropdownNode.style.top = "auto";
                        } else {
                            _self.props.dropdownNode.style.top = selectNodeRect.top + selectNodeRect.height + "px";
                        }
                        _self.props.dropdownNode.style.width = selectNodeRect.width + "px";
                    }
                }
            }
        });
    }

    componentDidUpdate() {
        // only update if the data has changed
        const isIpad = navigator.userAgent.match(/iPad/i);

        if (this.props.show && !isIpad) {
            this.searchInput && this.searchInput.focus();
        }

        if (this.props.show && this.isDropdownDisplayed && this.props.fixedDropdown) {

            const _self = this;
            let parentNodeRect = _self.props.parentNode.getBoundingClientRect();
            let selectNodeRect = _self.selectNode.getBoundingClientRect();
            if (parentNodeRect.bottom < selectNodeRect.bottom) {
                this.props.toggle();
            } else {
                const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                _self.isDropdownDisplayed = true;
                let topPos;
                if (_self.props.dropdownNode) {
                    _self.props.dropdownNode.style.position = "fixed";
                    if (_self.props.top) {
                        _self.props.dropdownNode.style.bottom = (windowHeight - selectNodeRect.top) + "px";
                        _self.props.dropdownNode.style.top = "auto";
                    } else {
                        _self.props.dropdownNode.style.top = selectNodeRect.top + selectNodeRect.height + "px";
                    }
                    this.props.dropdownNode.style.width = selectNodeRect.width + "px";
                    topPos = +this.props.dropdownNode.style.top.substring(0, this.props.dropdownNode.style.top.indexOf("px"));
                }
                if (window.innerHeight < (topPos + 300)) {
                    this.props.appendElementToScroll(220);
                    if (isIpad) {
                        //_self.props.dropdownNodeRef.scrollIntoView();
                    }
                }
            }
        }
        const { name, resetParam } = this.props;
        if (name == "selInboxFilter") {
            let leftPaneFilterId = sessionStorage.getItem("appliedFilterFromLeftPane");
            let rightPaneFilterId = sessionStorage.getItem("appliedFilterFromRightPane");
            if (rightPaneFilterId) {
                if (rightPaneFilterId != leftPaneFilterId) {
                    resetParam.value = leftPaneFilterId;
                }
            }
        }
    }

    componentWillUnmount() {
        const { fixedDropdown, dropdownNode, parentId } = this.props;
        const parentElm = document.getElementById(parentId);
        fixedDropdown && parentElm && parentElm.removeEventListener("scroll", () => {
            log("event unlistened");
        });
        if (dropdownNode) {
            // dropdownNode.style.position = "absolute";
            // dropdownNode.style.top = "100%";
            // dropdownNode.style.width = "100%";
        }

    }

    callMouseOver = (evt) => {
        const { scrollWidth, clientWidth } = evt.currentTarget;

        this.setState({
            showToolTip: scrollWidth > clientWidth
        });
    };

    renderCustomLabel = (fromInline) => {
        const { selected = {}, customSelectedVal, placeholder, showLeftIcon, isResetAllowed, show, capitalizeSelectedValue, showPhoenixTooltip, overRideDefaulSelectedStyle, canOptionsInvalid, showToneColor, iconMode, selectCustomClass, showTooltipOnHover, tooltipHoverText, fromPageHeader, showImageInSelection = false } = this.props;
        const { showToolTip } = this.state;
        const iconModeCondition = (!iconMode || show);

        if (selected.fromDate && selected.toDate) {
            return (<div className={getStyle("tooltip-inner-wrapper")}>
                <span className="icon tootip-parent">
                    <div className={getStyle("selected-values")}>                        
                        {selected.customLabel || customSelectedVal || selected.label || placeholder || "Select"}
                    </div>
                    {customSelectedVal ? 
                        <div className="tooltip-dark">
                            <div className="inner">
                                <span className="">
                                    {customSelectedVal}
                                </span>
                            </div>
                        </div>
                        : null}
                </span></div>);
        }

        if (!iconModeCondition) {
            return <i className={selectCustomClass} />;
        }

        return (
            <div className={getStyle(`tooltip-inner-wrapper ${showLeftIcon && isResetAllowed && !show ? "width-calc" : ""}`)}>
                <div className={`icon tootip-parent ${showToneColor ? "display-flex" : ""}`}>
                    {showToneColor && !(selected.value == "Any Color") ? <i className="tone-color" style={{ backgroundColor: selected.value}}/> : null}
                    {fromInline ?
                        <span className={getStyle("selected-values-wrapper")}>
                            {/* overide prop for resolving styling issue of uc-round-robin task */}
                            <span className={`${overRideDefaulSelectedStyle ? "overRideDefaulSelectedStyle" : ""} ${getStyle(`selected-values-label ${fromPageHeader ? "inter-head" : ""}`)}`} onMouseOver={
                                (event) => {
                                    return this.callMouseOver(event);
                                }
                            }>
                                {selected.customLabel || customSelectedVal || selected.label || placeholder || "Select"}
                            </span>
                            <i className="icon_phoenix-sort" />
                        </span>
                        : <div className={getStyle(`selected-values ${capitalizeSelectedValue ? "" : "no-text-transform"}`)} onMouseOver={
                            (event) => {
                                return this.callMouseOver(event);
                            }
                        }>
                            <div className={getStyle("label-custom-image")}>
                                {/* If options list can have invalid option item */}
                                {(showImageInSelection && selected?.img) ? (
                                <img
                                    src={selected?.img || ""}
                                    alt="Selected Icon"
                                    className={getStyle("popup-label-icon")}
                                />
                                ) : (
                                <>
                                    {(canOptionsInvalid && !customSelectedVal && selected?.valid === "invalid")
                                    ? "Select"
                                    : (selected?.customLabel || customSelectedVal || selected?.label || placeholder || "Select")}
                                    
                                    {selected?.customImage && <i className={selected.customImage} />}
                                </>
                                )}
                            </div>
                        </div>}
                    <div>
                        {showToolTip ? (
                            showPhoenixTooltip ? 
                                <Tooltip
                                    customContainerClassName="ml-0 no-iconhover"
                                    text={selected.customLabel || customSelectedVal || selected.label || placeholder || "Select"}
                                /> :
                                <div className="tooltip-dark">
                                    <div className="inner">
                                        <span className="">
                                            {selected.customLabel || customSelectedVal || selected.label || placeholder || "Select"}
                                        </span>
                                    </div>
                                </div>
                        ) : null}
                        {showTooltipOnHover ? 
                            <Tooltip
                                customContainerClassName="ml-0 no-iconhover"
                                text={tooltipHoverText}
                            />
                            : null}
                    </div>
                </div>
            </div>
        );
    };

    getselectNode = (domNode) => {
        this.selectNode = domNode;
    };
    getBoxSize = () => {
        let { customSize } = this.props;
        let boxSizeClass = "select-box-";
        switch (customSize) {
            case "x-small":
                boxSizeClass += "x-small";
                break;
            case "small":
                boxSizeClass += "small";
                break;
            case "medium":
                boxSizeClass += "medium";
                break;
            case "large":
                boxSizeClass += "large";
                break;
            case "x-large":
                boxSizeClass += "x-large";
                break;
            case "xx-large":
                boxSizeClass += "xx-large";
                break;
            case "xxx-large":
                boxSizeClass += "xxx-large";
                break;
            default:
                boxSizeClass = "";
        }
        return boxSizeClass;
    };

    renderHeaderForInlineMode = () => {
        const {
            selected,
            customSelectedVal,
            capitalizeSelectedValue,
            customLeftIconClass,
            showLeftIconInlineMode,
            inlineModeTooltip,
            showEllipsis,
            removeBlueText,
            fromPageHeader,
            prefixWithCustomText,
            isLowercaseFirstLetter,
            showCustomIconIninlineMode,
            customClassForInlineModeIcon
        } = this.props;
        return (
            <div className={getStyle(showLeftIconInlineMode ? "show-icon" : "")}>
                {!customSelectedVal ? <div className={getStyle("inline-mode-selected-values")} onMouseOver={(event) => this.callMouseOver(event)}>
                    <span className={getStyle(`${ removeBlueText ? "selected-default-wrapper" : fromPageHeader ? "single-page-header" : "selected-values-wrapper" }`)} >
                        {showLeftIconInlineMode ? (<i className={` mr-5 ${customLeftIconClass}`} />) : null}
                        <span className={getStyle(`selected-values-label ${capitalizeSelectedValue ? "" : "no-text-transform"}`)} onMouseOver={
                            (event) => {
                                return this.callMouseOver(event);
                            }
                        }>{!isEmpty(prefixWithCustomText) ? prefixWithCustomText : ""} {isLowercaseFirstLetter ? lowercaseFirstLetter(selected.label) : selected.label}
                            {showEllipsis && inlineModeTooltip && <Tooltip
                                customContainerClassName="ml-0 no-iconhover"
                                text={selected.label}
                            /> }
                            
                        </span>
                            <i className={showCustomIconIninlineMode ? customClassForInlineModeIcon : "icon_phoenix-sort"} />
                        </span>
                </div> :
                    <div className={getStyle("inline-mode-selected-values")}>
                        {this.renderCustomLabel(true)}
                    </div>}
            </div>
        );
    };

    getCustomHeader = () => {
        const { headerIconClass, headerText, showClose, toggle } = this.props;
        return (
            <h6 className="custom-label-header">
                <i className={`${headerIconClass} icon`}/>
                <span>{headerText}</span>
                {showClose ? <i className="icon icon_phoenix-close" onClick={toggle} /> : null}
            </h6>
        );
    }

    getDefaultHeader = (disablePersonalizeTooltipText, popupLabel) => {
        if (disablePersonalizeTooltipText) {
            return  (
                <Tooltip
                    text={disablePersonalizeTooltipText}
                >
                    <span className={getStyle("popup-label-name")}>{popupLabel}</span> 
                </Tooltip>
            );
        }
        return  <span className={getStyle("popup-label-name")}>{popupLabel}</span>; 
    }
    
    renderHeader = () => {
        const {
            displayLabel,
            show,
            toggle,
            reseetToDefault,
            selected,
            resetParam = {},
            name,
            isResetAllowed,
            showLinkDropdown,
            customSelectViewLabel,
            disableToggleOnLabelWhenOpen,
            resetLabel,
            customClass,
            customDisplayLabel = "",
            filterType,
            supportDefault,
            overideStyle,
            inlineMode,
            customLeftIconClass,
            showLeftIcon,
            hideLabelInDropDownOptions,
            customClickHandler,
            inlineTitlebox,
            showPhoenixTooltip,
            displayLabelCustomClass,
            forceAlignDropIcon,
            disableDropDownToggle,
            customLeftIconJSX,
            isBlueLabel,
            iconMode,
            selectCustomClass,
            showDropdownHeader,
            resetCallback,
            fromPageHeader,
            customHeader,
            showClose,
            disablePersonalizeTooltipText,
            insightsModule = false,
            showCustomIconIninlineMode, 
            customClassForInlineModeIcon,
            isAeroDesign
        } = this.props;

        const inlineModeStyle = inlineMode ? "inline-mode" : fromPageHeader ? "inter-head" : "";
        const inlineTitleStyle = inlineTitlebox ? "inline-title-box" : ""; /*------singleselect in page-header----*/

        let isDefaultSelection;
        if (supportDefault) {
            isDefaultSelection = selected && resetParam && (selected.value === resetParam.value || !selected.value);
        } else {
            isDefaultSelection = selected.value ? (selected.value.length == 0) : !(selected.fromDate && selected.toDate);
            isDefaultSelection = name == "selTimePeriod" || filterType === FILTER_TYPE.TIME_FILTER_V1 || filterType === FILTER_TYPE.TIME_FILTER_V2 ? (selected && selected.value == "all" && resetParam.value == "all") : isDefaultSelection;
        }

        const popupLabel = show ? (customSelectViewLabel || displayLabel || "Select") : (customDisplayLabel || displayLabel || "Select");
        const iconModeCondition = (!iconMode || show);

        const selectedView = (
            <div
                className={`${isAeroDesign ? "ds-button-secondary-inline" : ""} ${customClass} ${isBlueLabel ? "blue-label" : ""} ${getStyle(`${
                    showLeftIcon && isResetAllowed
                        ? "default-filter with-icons"
                        : ""
                } ${
                    isResetAllowed || insightsModule
                        ? "select-box"
                        : `default-filter ${
                              showLeftIcon ? "with-icons" : ""
                          } ${overideStyle}`
                } ${
                    showDropdownHeader ?
                        ""
                        :
                        show
                            ? hideLabelInDropDownOptions
                                ? "dropdown-open hide-head"
                                : "dropdown-open"
                            : ""
                }
                 ${inlineModeStyle} ${inlineTitleStyle} ${!iconModeCondition ? "no-border-style" : ""} ${customHeader ? "custom-header" : ""}`)}`}
                onClick={() => {
                    if (disableDropDownToggle) return;
                    if (customClickHandler) {
                        customClickHandler();
                    } else {
                        if (!customHeader || !showClose || !show) {
                            toggle();
                        }
                        this.searchInput && this.searchInput.focus();
                        show ? (this.isDropdownDisplayed = true) : null;
                    }
                }}
                ref={this.getselectNode.bind(this)}
            >
                {!inlineMode && showLeftIcon && isResetAllowed ? (
                    <i className={customLeftIconClass} />
                ) : null}
                {!inlineMode &&
                    (isResetAllowed || show || insightsModule ? (
                        <label
                            className={getStyle(`${displayLabelCustomClass || ""}${customHeader ? "label-top" : ""}`)}
                        >
                            {customHeader ? this.getCustomHeader() : displayLabel}
                        </label>
                    ) : null)}
                {!inlineMode &&
                    (!isResetAllowed && show ? null : (
                        <div> {this.renderCustomLabel()}</div>
                    ))}
                {inlineMode && this.renderHeaderForInlineMode()}
                {!inlineMode && showLeftIcon && !isResetAllowed ? (
                    customLeftIconJSX ? (
                        customLeftIconJSX
                    ) : (
                        <i className={customLeftIconClass} />
                    )
                ) : null}

                {!inlineMode && !iconMode && (
                    <span
                        className={`icon tootip-parent ${getStyle(`reset-btn ${
                            (!isResetAllowed ||
                                resetParam.value == selected.value) &&
                            !forceAlignDropIcon
                                ? "default-value-label"
                                : ""
                        }`)}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            resetCallback && resetCallback();
                            return isResetAllowed
                                ? reseetToDefault(true)
                                : false;
                        }}
                    >
                        <span
                            className={`${
                                resetParam.value == selected.value ||
                                !isResetAllowed
                                    ? show
                                        ? "icon-cheveron_close"
                                        : "icon_phoenix-cheveron_open"
                                    : "icon_phoenix-close"
                            }`}
                        />
                        {isResetAllowed ? (
                            showPhoenixTooltip ? (
                                <Tooltip
                                    customContainerClassName="ml-0 no-iconhover"
                                    text={
                                        !resetLabel
                                            ? `Clear filter`
                                            : resetLabel
                                    }
                                />
                            ) : (
                                <div className="tooltip-dark">
                                    <div className="inner">
                                        {!resetLabel
                                            ? `Clear filter`
                                            : resetLabel}
                                    </div>
                                </div>
                            )
                        ) : null}
                    </span>
                )}
            </div>
        );
        
        if (isDefaultSelection) {
            if (name != "selInboxFilter") {
                return (
                    <div
                        onClick={() => {
                            if (disableDropDownToggle) return;
    
                            if (customClickHandler) {
                                customClickHandler();
                            } else {
                                if (disableToggleOnLabelWhenOpen && show) {
                                    this.searchInput && this.searchInput.focus();
                                } else {
                                    if (!customHeader || !showClose || !show) {
                                        toggle();
                                    }
                                    this.searchInput && this.searchInput.focus();
                                    show ? this.isDropdownDisplayed = true : null;
                                }
                            }
                        }}
                        className={`${isAeroDesign ? "ds-button-secondary-inline" : ""} ${disableToggleOnLabelWhenOpen && show ? "cursor-default" : ""} ${getStyle(`default-filter ${showLeftIcon ? "with-icons" : ""} ${showDropdownHeader ? "" : (show ? (hideLabelInDropDownOptions ? "dropdown-open hide-head" : "dropdown-open") : "")} ${showLinkDropdown && !show ? "show-link" : ""} ${inlineModeStyle} ${inlineTitleStyle} ${this.props.validationError && this.props.validationError.showError ? "error-class" : ""} ${!iconModeCondition ? "no-border-style" : ""} ${customHeader ? "custom-header" : ""}`)}`}
                        ref={this.getselectNode.bind(this)}
                    >
                        {showLeftIcon ? (<i className={customLeftIconClass} />) : null}
                        { iconModeCondition ? <label className={getStyle(`label-top ${displayLabelCustomClass ? displayLabelCustomClass : ""}`)}>
                            {/*!show && filterType ? "Time Period" : popupLabel*/}
                            {customHeader ? this.getCustomHeader() : this.getDefaultHeader(disablePersonalizeTooltipText, popupLabel)}
                            {
                                inlineMode ? showCustomIconIninlineMode ? <i className={customClassForInlineModeIcon} /> :
                                    <i className="icon_phoenix-sort" />
                                    :
                                    <div>
                                        {this.props.validationError && this.props.validationError.showError && <span className={getStyle("alert-img")}><Tooltip hideOnScroll text={this.props.validationError.errorText} position="left"> <img src={AlertImg} alt="error"/> </Tooltip></span>}
                                        <span className={`icon_phoenix-cheveron_open ${getStyle("reset-btn cheveron_open")}`} />
                                    </div>
                            }
    
                        </label> : <i className={selectCustomClass} />}
                    </div>
                );
            } else {
                return selectedView;
            }
        } else {
            return selectedView;
        }
    
    };

    renderSearchInput = () => {
        const { searchPlaceHolder, search, filterOptions, onSearchCallback = null, searchStrFromParent = null, debounceDelay = 100 } = this.props;
        return (
            <div className={getStyle("form-box")}>
                <SearchFilter
                    placeholder={searchPlaceHolder}
                    onCrossClickAction={typeof onSearchCallback == "function" ? onSearchCallback : filterOptions}
                    onInputValueChange={typeof onSearchCallback == "function" ? onSearchCallback : filterOptions}
                    debounceDelay={debounceDelay}
                    searchStr={searchStrFromParent ? searchStrFromParent : search || ""}
                    autoFocus
                />
            </div>
        );
    };

    renderCtaButtons = () => {
    const {
        ctaButtonsEnabled,
        onClickApplyChanges,
        enableApply,
        onClickClearChanges,
        useCancelSubmitButtons,
        onClickCancel,
        onClickSubmit,
        customCTAJSX
    } = this.props;
    const { enableCTAs } = this.state;
    const clearVisible = !(enableCTAs ? false : enableApply);

    if (!ctaButtonsEnabled && customCTAJSX) {
            return (
                <div className={`clearfix ${getStyle("btn-wrapper")}`}>
                    {customCTAJSX}
                </div>
            );
        }

    if(!useCancelSubmitButtons && !ctaButtonsEnabled){
        return null;
    }

    return (
        <div className={`clearfix ${getStyle("btn-wrapper")}`}>
            <Button
                className="ml-5 mr-15 pull-right"
                onClick={useCancelSubmitButtons ? onClickSubmit : onClickApplyChanges}
                disabled={useCancelSubmitButtons ? enableApply : (enableCTAs ? false : enableApply)}
                theme="primary"
                label={useCancelSubmitButtons ? "Submit" : "Apply"}
            />
            {((ctaButtonsEnabled && clearVisible) || useCancelSubmitButtons) && (
                <Button
                    className="pull-right clear"
                    label={useCancelSubmitButtons ? "Cancel" : "Clear"}
                    onClick={useCancelSubmitButtons ? onClickCancel : onClickClearChanges}
                    theme="link"
                />
            )}
        </div>
    );
};

    renderDropdownHeaderLabel = () => {
        const { customDropdownHeaderLabel } = this.props;
        return (
            <div className="form-box-label">
                <span>{customDropdownHeaderLabel}</span>
            </div>
        );
    }

    renderDropdown = () => {
        const {
            displayLabel,
            options,
            onClickOption,
            name,
            selected,
            enableApply,
            isResultEmpty,
            showSearch,
            supportMultipleList,
            listKeys,
            setScrollViewSingleSelectRef,
            search,
            noSearchResultText,
            noOptionsAvailableText,
            windowing,
            forceOpen,
            hoverTipDisabled,
            overrideDefault,
            onListScroll,
            overRideDefaulSelectedStyle,
            canOptionsInvalid,
            isInfoInPlace,
            longTextEllipsis,
            showTitleOnHover,
            customTooltipIcon,
            isLoading = false,
            onSearchCallback = null, // search and optionList are being handled by parent component
            loaderType = null,
            showCustomDropdownHeaderLabel,
            showImageInSelection,
            isSocial
        } = this.props;

        const eventObj = {
            onMouseEnter: this.toggleCustomHtml.bind(this, true, this.state.customHtml),
            onMouseLeave: this.toggleCustomHtml.bind(this, false, this.state.customHtml)
        };
        let OptionType = undefined;
        const BE = window?.BE || {};
        /* If options list can have invalid option item, using canOptionsInvalid. */
        return ( 
            [
                showCustomDropdownHeaderLabel && this.renderDropdownHeaderLabel(), // BIRD-34189 (Soumya) : Added this prop to render dropdown header label 
                showSearch && this.renderSearchInput(),
                <div key="custom-html-div">
                    {this.state.showCustomHtml && (<span {...eventObj}>{this.state.customHtml}</span>)}
                </div>,
                isLoading ? (
                    <div key="loading-div">
                        {loaderType == "normalLoader" ? <LoaderBox type={"loader-birdeye"} reseller={BE.business.accountType !== 1} /> : 
                            <LoadingShimmer shimmerCount={[{ height: "large-height", width: "full-width" }]} displayCount={3}/>}
                    </div>) :
                    (
                        <ul
                            key="dropdown-row"
                            className={`custom-scroll ${getStyle(`${(name == "selTimePeriod") ? "time-period-dd" : ""}`)}${showImageInSelection ? " show-image-in-selection" : ""}`}
                            id={`ssd-ul-${displayLabel}`}
                            onScroll={onListScroll}
                        >
                        {
                            !supportMultipleList && windowing && <ReactList
                                itemRenderer={(index) => {
                                    let option = options[index];

                                    return (<SingleSelectRow
                                        onClickOption={onClickOption}
                                        option={option}
                                        name={name}
                                        selectedValue={selected.value ? selected.value : selected}
                                        key={index}
                                        toggleCustomHtml={this.toggleCustomHtml}
                                        currPos={this.state.currPos}
                                        currentUl={`ssd-ul-${displayLabel}`}
                                        enableApply={enableApply}
                                        showCustomHtml={this.state.showCustomHtml}
                                        hide={this.props.hide}
                                        overrideDefault={overrideDefault}
                                        overRideDefaulSelectedStyle={overRideDefaulSelectedStyle} // overide prop for resolving styling issue of uc-round-robin task
                                        canOptionsInvalid={canOptionsInvalid}
                                        isInfoInPlace={isInfoInPlace}
                                        showTitleOnHover={showTitleOnHover}
                                        hoverTipDisabled={hoverTipDisabled}
                                        customTooltipIcon={customTooltipIcon}
                                        isSocial={isSocial}
                                    />);
                                }}
                                length={options.length}
                                type='uniform'
                            />
                        }
                        {!supportMultipleList && !windowing && options.map((option, i) => {
                            return (<SingleSelectRow
                                onClickOption={onClickOption}
                                option={option}
                                name={name}
                                selectedValue={selected.value ? selected.value : selected}
                                key={i}
                                toggleCustomHtml={this.toggleCustomHtml}
                                currPos={this.state.currPos}
                                currentUl={`ssd-ul-${displayLabel}`}
                                enableApply={enableApply}
                                showCustomHtml={this.state.showCustomHtml}
                                hide={this.props.hide}
                                hoverTipDisabled={hoverTipDisabled}
                                overrideDefault={overrideDefault}
                                overRideDefaulSelectedStyle={overRideDefaulSelectedStyle} // overide prop for resolving styling issue of uc-round-robin task
                                canOptionsInvalid={canOptionsInvalid}
                                isInfoInPlace={isInfoInPlace}
                                showTitleOnHover={showTitleOnHover}
                                customTooltipIcon={customTooltipIcon}
                                isSocial={isSocial}
                            />);
                        }
                        )}
                        {supportMultipleList && listKeys.map((keyItem, index) => {
                            return (<div className={getStyle("list")} key={"list" + index}>
                                {options.map((option, i) => {
                                    let jsx = (option.type == keyItem.type && <div className={longTextEllipsis ? "custom-list-view" : ""}> {OptionType != option.type ? <h3 className="single-select-group">{keyItem.heading}</h3> : null} {<SingleSelectRow
                                        onClickOption={onClickOption}
                                        option={option}
                                        name={name}
                                        selectedValue={selected.value ? selected.value : selected}
                                        key={i}
                                        toggleCustomHtml={this.toggleCustomHtml}
                                        currPos={this.state.currPos}
                                        currentUl={`ssd-ul-${displayLabel}`}
                                        enableApply={enableApply}
                                        showCustomHtml={this.state.showCustomHtml}
                                        hide={this.props.hide}
                                        supportMultipleList
                                        selectedType={selected.type}
                                        overRideDefaulSelectedStyle={overRideDefaulSelectedStyle} // overide prop for resolving styling issue of uc-round-robin task
                                        canOptionsInvalid={canOptionsInvalid}
                                        isSocial={isSocial}
                                    />}</div>);
                                    if (option.type == keyItem.type) {
                                        OptionType = option.type;
                                    }
                                    return jsx;
                                }
                                )}
                            </div>);
                        })}
                        {!this.props.showLoader && ((!onSearchCallback && isResultEmpty) || (forceOpen && !options.length) || (onSearchCallback && !options.length)) &&
                        <li className={`ms-no-results ${this.props.noHandIcon ? "cursor-default-important" : ""}`}>{showSearch && search ? noSearchResultText || "No matches found" : noOptionsAvailableText || "No matches found"}</li>}
                        {this.props.showLoader && <li className="ms-no-results">{this.props.getDotLoader()}</li>}
                    </ul>),
                this.renderCtaButtons(),
                <span className={getStyle("scroll-to-element")} ref={setScrollViewSingleSelectRef} key="scroll-to-element" />
            ]
        );
    };

    renderSavedFilters = () => {
        const {
            displayLabel,
            selected,
            customSelectedVal,
            customSelectViewLabel,
            customLeftIconClass,
            showLeftIcon,
            noBorderOnDisabled,
            displayLabelCustomClass
        } = this.props;

        return (
            <div data-testid="el-test-single-select" className={`el-single-select ${getStyle(`${showLeftIcon ? "with-icons disabled-wrap" : ""} large-box`)}`}>
                {showLeftIcon ? (<i className={customLeftIconClass} />) : null}
                <div className={getStyle(`select-box disabled-select-box ${noBorderOnDisabled ? "no-border" : ""}`)}>
                    <label className={getStyle(displayLabelCustomClass ? displayLabelCustomClass : "")}>{displayLabel}</label>
                    <div className={getStyle("selected-values")}>{customSelectedVal || customSelectViewLabel || selected.label || displayLabel || "All"}</div>
                    {showLeftIcon ? (<span className={getStyle("reset-btn")}>
                        <span className="icon_phoenix-cheveron_open" />
                    </span>) : <span className={`icon_phoenix-cheveron_open ${getStyle("reset-btn")}`} />}
                </div>
            </div>
        );
    };

    render() {
        let {
            show,
            top,
            align,
            size,
            disabled,
            fixedDropdown,
            className,
            customWidthOpen,
            showLargeDropDown,
            overideStyle,
            inlineMode,
            extendWidth,
            direction = "",
            hideLabelInDropDownOptions,
            customSize,
            largeSelectBox,
            showEllipsis,
            openCenter,
            disableDropDownToggle,
            showDropdownHeader,
            titleTooltipText,
            dropDownHeight,
            customHeader,
            customParentClass,
            position
        } = this.props;

        const { renderDropdown } = this;
        const { dropdownPos, validationClasses } = this.state;
        const topClass = top ? "top" : "bottom";
        const showClass = !show ? "hidden" : "";
        const allignClass = (align === "right") ? " right" : "";
        className += validationClasses;
        const boxSizeClass = this.getBoxSize(customSize);

        if (disabled) {
            return (
                this.renderSavedFilters()
            );
        } else {
            //BIRD-36835 : Added titleTooltipText to show the default tooltip text as the value of titleTooltipText props if passed
            return (
                <div data-testid="el-test-single-select" style={{ width: (show && customWidthOpen) ? customWidthOpen + "px" : "", top: (show && position) ? position.top + "px" : ""}} title={titleTooltipText ? titleTooltipText : ""}
                    className={`el-single-select ${className} target ${show && showLargeDropDown ? "custom-width" : ""} ${inlineMode ? "clearfix-div" : ""} ${getStyle(`dropdown-box ${disableDropDownToggle ? "disable-selection" : ""} ${largeSelectBox ? "large-selectbox" : ""} ${inlineMode ? "" : boxSizeClass} ${extendWidth ? " extendedWidth" : ""} ${size === "large" ? "large-box" : ""} ${topClass === "top" ? "open-top" : ""} ${inlineMode ? "inline-mode-wrapper" : ""} ${showEllipsis ? "show-ellipsis" : ""}`)}`} >
                    {this.renderHeader()}
                    {show ? <div
                        className={`${showDropdownHeader ? `ms-drop dropdown-popup mt-50 ${topClass} ${showClass} ${allignClass} ${customParentClass ? customParentClass : ""}` : `ms-drop dropdown-popup ${topClass} ${showClass} ${allignClass} ${customParentClass ? customParentClass : ""}`} ${getStyle(`filter-dropdown ${dropDownHeight} ${overideStyle} ${inlineMode ? "rounded-edges" : ""} ${inlineMode ? "inline-mode-dropdown" : ""} ${inlineMode ? boxSizeClass : ""} ${direction} ${openCenter ? "open-center" : ""} ${show && hideLabelInDropDownOptions ? "hide-head" : ""} ${customHeader ? "custom-dropdown-popup" : ""}`)}`}  ref={this.props.getDropdownNode}
                        style={fixedDropdown ? { position: "fixed", ...dropdownPos } : {}}
                    >
                        {renderDropdown()}
                        {this.props.scrollActionBoxIntoView && <ScrollIntoView />}
                    </div> : null}
                    {
                        this.props._renderValidationErrors && this.props._renderValidationErrors()
                    }
                </div>
            );
        }
    }
}

SingleSelectView.propTypes = {
    areOptionsGrouped: PropTypes.bool,
    className: PropTypes.string,
    filterOptions: PropTypes.func,
    extendLeft: PropTypes.bool,
    hide: PropTypes.func,
    name: PropTypes.string,
    onClickOption: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    search: PropTypes.string,
    selected: PropTypes.object,
    show: PropTypes.bool,
    isResultEmpty: PropTypes.bool,
    showSearch: PropTypes.bool,
    toggle: PropTypes.func,
    width: PropTypes.number,
    showCustomDateRange: PropTypes.bool,
    onFromDateChanged: PropTypes.func.isRequired,
    onToDateChanged: PropTypes.func.isRequired,
    onClickClearDateRange: PropTypes.func.isRequired,
    onClickApplyDateRange: PropTypes.func.isRequired,
    dateRangeFormat: PropTypes.string,
    _renderValidationErrors: PropTypes.func,
    disabled: PropTypes.bool,
    searchPlaceHolder: PropTypes.string,
    customSelectedVal: PropTypes.string,
    displayLabel: PropTypes.string,
    align: PropTypes.string,
    top: PropTypes.bool,
    enableApply: PropTypes.bool,
    ctaButtonsEnabled: PropTypes.bool,
    isDatePickerOpen: PropTypes.func,
    onClickClearChanges: PropTypes.func,
    onClickApplyChanges: PropTypes.func,
    reseetToDefault: PropTypes.func,
    closeDatePicker: PropTypes.func,
    isDatePickerOpened: PropTypes.bool,
    floatRight: PropTypes.bool,
    size: PropTypes.string,
    parentNode: PropTypes.node,
    dropdownNode: PropTypes.node,
    getDropdownNode: PropTypes.node,
    fixedDropdown: PropTypes.bool,
    isCustomDatesAvailable: PropTypes.bool,
    resetParam: PropTypes.object,
    appendElementToScroll: PropTypes.func,
    parentId: PropTypes.node,
    isResetAllowed: PropTypes.bool,
    customWidthOpen: PropTypes.number,
    showLinkDropdown: PropTypes.bool,
    customSelectViewLabel: PropTypes.string,
    showLargeDropDown: PropTypes.bool,
    disableToggleOnLabelWhenOpen: PropTypes.bool,
    isAssigneeDropDown: PropTypes.bool,
    resetLabel: PropTypes.string,
    customClass: PropTypes.string,
    customDisplayLabel: PropTypes.string,
    overideStyle: PropTypes.string,
    supportMultipleList: PropTypes.bool,
    listKeys: PropTypes.array,
    filterType: PropTypes.string,
    delayClickOutside: PropTypes.object,
    supportDefault: PropTypes.bool,
    setScrollViewSingleSelectRef: PropTypes.func,
    inlineMode: PropTypes.bool,
    showEllipsis: PropTypes.bool,
    direction: PropTypes.string,
    showLeftIcon: PropTypes.bool,
    customLeftIconClass: PropTypes.string,
    showErrorOnWrapper: PropTypes.bool,
    extendWidth: PropTypes.bool,
    noBorderOnDisabled: PropTypes.bool,
    hideLabelInDropDownOptions: PropTypes.bool,
    noSearchResultText: PropTypes.string,
    noOptionsAvailableText: PropTypes.string,
    customClickHandler: PropTypes.func,
    customSize: PropTypes.string,
    inlineTitlebox: PropTypes.bool,
    windowing: PropTypes.bool,
    scrollActionBoxIntoView: PropTypes.bool,
    capitalizeSelectedValue: PropTypes.bool,
    showPhoenixTooltip: PropTypes.bool,
    validationError: PropTypes.object,
    forceOpen: PropTypes.bool,
    forceAlignDropIcon: PropTypes.bool,
    displayLabelCustomClass: PropTypes.string,
    largeSelectBox: PropTypes.bool,
    showLeftIconInlineMode: PropTypes.bool,
    openCenter: PropTypes.bool,
    inlineModeTooltip: PropTypes.bool,
    disableDropDownToggle: PropTypes.bool,
    hoverTipDisabled: PropTypes.bool,
    overrideDefault: PropTypes.bool,
    onListScroll: PropTypes.func,
    removeBlueText: PropTypes.bool,
    overRideDefaulSelectedStyle: PropTypes.bool,
    showLoader: PropTypes.bool,
    getDotLoader: PropTypes.func,
    canOptionsInvalid: PropTypes.bool,
    isInfoInPlace: PropTypes.bool,
    customLeftIconJSX: PropTypes.string,
    showToneColor: PropTypes.bool,
    toneColorValue: PropTypes.string,
    isBlueLabel: PropTypes.bool,
    iconMode: PropTypes.bool,
    selectCustomClass: PropTypes.string,
    showDropdownHeader: PropTypes.bool,
    resetCallback: PropTypes.func,
    showTooltipOnHover: PropTypes.bool,
    tooltipHoverText: PropTypes.string,
    longTextEllipsis: PropTypes.bool,
    fromPageHeader: PropTypes.bool,
    prefixWithCustomText: PropTypes.bool,
    isLowercaseFirstLetter: PropTypes.bool,
    showTitleOnHover: PropTypes.bool,
    titleTooltipText: PropTypes.string,
    customTooltipIcon: PropTypes.string,
    dropDownHeight: PropTypes.string,
    isLoading: PropTypes.bool,
    onSearchCallback: PropTypes.func,
    searchStrFromParent: PropTypes.string,
    loaderType: PropTypes.string,
    showCustomDropdownHeaderLabel: PropTypes.bool,
    customDropdownHeaderLabel: PropTypes.string,
    customHeader: PropTypes.string,
    headerIconClass: PropTypes.string,
    headerText: PropTypes.string,
    showClose: PropTypes.bool,
    disablePersonalizeTooltipText: PropTypes.string,
    insightsModule: PropTypes.bool,
    customParentClass: PropTypes.string,
    debounceDelay: PropTypes.number,
    noHandIcon: PropTypes.bool,
    showCustomIconIninlineMode: PropTypes.bool, 
    customClassForInlineModeIcon: PropTypes.string,
    position: PropTypes.object,
    isSocial: PropTypes.bool,
    useCancelSubmitButtons: PropTypes.bool,
    customCTAJSX: PropTypes.node,
    showImageInSelection: PropTypes.bool,
    onClickOutside: PropTypes.func,
    isAeroDesign: PropTypes.bool
};

SingleSelectView.defaultProps = {
    showSearch: false,
    searchPlaceHolder: "Search",
    showLeftIcon: false,
    showPhoenixTooltip: false,
    showTooltipOnHover: false
};

export default onClickOutside(SingleSelectView);