import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import SingleSelectView from "./SingleSelectView";
import { isArray, some } from "lodash";
import styles from "./SingleSelectView.module.scss"
import "react-datepicker/dist/react-datepicker.css";

let dropdownNode = null;
class SingleSelect extends Component {
    static displayName = "SingleSelect";
    constructor(props) {
        super(props);

        const defaultState = {
            validationErrors: [],
            validationClasses: " valid"
        };
        const initialState = this.getInitialState(props, true, defaultState);

        this.state = Object.assign(defaultState, initialState);
    }

    //Changed the name of this function for better symantics
    getInitialState(nextProps, initialState, stateObj) {
        const selectedProps = nextProps.selected;
        let { selected: selectedOption, show } = stateObj;
        const areOptionsGrouped = !isArray(nextProps.options);

        if (initialState || this.props.selected !== selectedProps) {
            if (!areOptionsGrouped) {
                selectedOption = nextProps.options.find(
                    (option) => option.value == selectedProps
                );
                if (selectedProps && selectedProps.fromDate && selectedProps.toDate) {
                    selectedOption = selectedProps;
                }
            } else {
                for (const key in nextProps.options) {
                    selectedOption = nextProps.options[key].find(
                        (option) => option.value == selectedProps
                    );
                    if (selectedOption) {
                        break;
                    }
                }
            }
        }
        const hasPreselectedOption = selectedOption && selectedOption.value !== undefined;
        const shouldEnableSubmitOnPreselect = nextProps.useCancelSubmitButtons && hasPreselectedOption;
        return {
            areOptionsGrouped,
            selected: selectedOption || {},
            options: nextProps.options,
            initialSelected: selectedOption || {},
            highlightOnly: shouldEnableSubmitOnPreselect ? false : true,
            show: nextProps.forceOpen || show
        };
    }

    componentWillMount() {
        this.props._attachToFormWrapper && this.props._attachToFormWrapper(this);
    }

    componentWillReceiveProps(nextProps) {
        let nextState = this.getInitialState(nextProps, true, this.state);

        //Removed this prop dependency as per BIRDEYE-97955 cause it was creating show/open issues at multiple places.
        //const keepDropDownOpenInRerender = nextProps.keepDropDownOpenInRerender || false;

        this.setState({ ...nextState }, () => {
            if (nextProps.forceHideOptions) {
                this.hide();
            }
        });
        if (this.state.search) {
            this.filterOptions(this.state.search, false, nextProps);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { showErrorOnWrapper, setErrorInParent, name, isOnChange } = this.props;
        const { validationClasses } = this.state;
        if (showErrorOnWrapper && ((!prevState.validationClasses.includes("invalid-error") && validationClasses.includes("invalid-error")) || (!prevState.validationClasses.includes("required") && validationClasses.includes("required")))) {
            setErrorInParent(validationClasses, name);
        }
        if (showErrorOnWrapper && ((prevState.validationClasses.includes("invalid-error") && !validationClasses.includes("invalid-error")) || (prevState.validationClasses.includes("required") && !validationClasses.includes("required")))) {
            setErrorInParent(validationClasses.concat(" showTick"), name);
        }
        if (showErrorOnWrapper && (!prevProps.isOnChange && isOnChange) && (prevState.validationClasses.includes("invalid-error") && validationClasses.includes("invalid-error"))) {
            setErrorInParent(validationClasses, name);
        }
        if (showErrorOnWrapper && (!prevProps.isOnChange && isOnChange) && (!prevState.validationClasses.includes("invalid-error") && !validationClasses.includes("invalid-error"))) {
            setErrorInParent(validationClasses.concat(" showTick"), name);
        }
    }

    componentWillUnmount() {
        this.props._detachFromFormWrapper && this.props._detachFromFormWrapper(this);
    }

    toggle = () => {
        const { openCallback, customOnClick, showLoader, disableToggle, openCallbackDelay } = this.props;

        customOnClick && customOnClick();
        if (this.state.show) {
            this.props.appendElementToScroll && this.props.appendElementToScroll(0);
        }
        if (!this.state.show && this.props.fixedDropdown) {
            // this.props.parentNode.scrollTop -= 2; // BIRDEYE-63617 - Mukul
        }
        this.setState({
            show: disableToggle ? false : !this.state.show,
            selected: this.state.initialSelected
        }, () => {
            if (this.state.show && this.scrollViewSingleSelectRef && openCallback) {
                if (openCallbackDelay === 0) {
                    openCallback(this.scrollViewSingleSelectRef);
                } else {
                    setTimeout(openCallback.bind(null, this.scrollViewSingleSelectRef), openCallbackDelay);
                }
            }
            !showLoader && this.filterOptions("", true);
        });
    };

    hide() {
        if (!this.state.show) {
            return;
        }
        this.setState({
            show: false,
            selected: this.state.initialSelected,
            highlightOnly: true
        }, () => {
            const { onDropdownClose = null } = this.props;
            if (typeof onDropdownClose == "function") onDropdownClose(this.state.show); // Trigger parent callback if any with the new state for show dropdown
        });
        this.props.appendElementToScroll && this.props.appendElementToScroll(0);
    }

    filterOptions = (value, clearSearch, nextProps) => {
        value = clearSearch ? "" : value;
        let isResultEmpty, filteredOptions;
        const options = nextProps ? nextProps.options : this.props.options; 
        const { searchByKeyAndValue, customSearchKeys } = this.props;
        const { areOptionsGrouped } = this.state;

        if (!areOptionsGrouped) {
            filteredOptions = options.filter(
                (option) => {
                    const optionValue = (option.value + "").toLowerCase();
                    if (value && option.skipSearch) {
                        return false;
                    }
                    if (customSearchKeys && customSearchKeys.length) {
                        let match = false;

                        some(customSearchKeys, function (searchKey) {
                            if (option[searchKey] && option[searchKey].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                                match = true;
                                return true;
                            }
                        });

                        return match;
                    } else if (searchByKeyAndValue && (
                        (option.label && option.label.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
                        optionValue.indexOf(value.toLowerCase()) !== -1)
                    ) {
                        return true;
                    } else if (!searchByKeyAndValue && option.label && option.label.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            );
            isResultEmpty = filteredOptions.length == 0;

        } else {
            filteredOptions = {};
            for (const key in options) {
                const gOptions = [...options[key]];
                const filtered = gOptions.filter(
                    (option) => {
                        const optionValue = (option.value + "").toLowerCase();

                        if (customSearchKeys && customSearchKeys.length) {
                            let match = false;

                            some(customSearchKeys, function (searchKey) {
                                if (option[searchKey] && option[searchKey].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                                    match = true;
                                    return true;
                                }
                            });

                            return match;
                        } else if (searchByKeyAndValue && (
                            (option.label && option.label.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
                            optionValue.indexOf(value.toLowerCase()) !== -1)
                        ) {
                            return true;
                        } else if (!searchByKeyAndValue && option.label && option.label.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                );
                if (filtered && filtered.length > 0) {
                    filteredOptions[key] = filtered;
                }
            }
            isResultEmpty = Object.keys(filteredOptions).length == 0;
        }
        this.setState({ search: value, options: filteredOptions, isResultEmpty });
    };

    onClickOption = (option) => {
        const { ctaButtonsEnabled, onChange, validationTrigger, _fieldValidator, getFormattedOption, useCancelSubmitButtons } = this.props;

        const formattedOption = (getFormattedOption && getFormattedOption(option)) || option;

        if (!ctaButtonsEnabled) {
            this.hide();
            this.setState({
                selected: formattedOption,
                highlightOnly: true
            }, () => {
                if (validationTrigger === "onChange" && _fieldValidator) {
                    _fieldValidator(this);
                }
                onChange && onChange(option);
            });
        } else {
            this.setState({
                ...( useCancelSubmitButtons ? { selected: formattedOption } : {}),
                highlightOnly: false
            });
        }
        this.currentSelected = option;
    };

    onClickClearChanges = () => {
        this.setState({
            highlightOnly: true,
            fromDate: null,
            toDate: null
        });
    };

    onClickApplyChanges = () => {
        const { onChange } = this.props;
        onChange && onChange(this.currentSelected);
        this.hide();
    };

    reseetToDefault = (fromReset) => {
        const { onChange, resetParam } = this.props;
        onChange && onChange(resetParam, fromReset);
    };

    getDropdownNode = (domNode) => {
        dropdownNode = domNode;
    };

    setScrollViewSingleSelectRef = (ref) => {
        this.scrollViewSingleSelectRef = ref;
    };

    render() {
        const { validationClasses } = this.state;
        let { _renderValidationErrors, className, customSelectedVal, size = "medium", disabled, fixedDropdown, appendElementToScroll, parentId,
            isResetAllowed, customWidthOpen, showLinkDropdown, customSelectViewLabel, customClass, showLargeDropDown, disableToggleOnLabelWhenOpen,
            resetLabel = "", customDisplayLabel, supportMultipleList = false, listKeys = [], filterType, delayClickOutside, supportDefault, overideStyle, showLeftIcon, customLeftIconClass,
            inlineMode, direction, extendWidth, noBorderOnDisabled, hideLabelInDropDownOptions, noOptionsAvailableText, noSearchResultText, customClickHandler, customSize, inlineTitlebox,
            windowing, capitalizeSelectedValue, showPhoenixTooltip, displayLabelCustomClass, forceOpen, forceAlignDropIcon, largeSelectBox, showEllipsis, validationError, showLeftIconInlineMode,
            openCenter, inlineModeTooltip, disableDropDownToggle, hoverTipDisabled, overrideDefault, onListScroll, removeBlueText, overRideDefaulSelectedStyle, showLoader, getDotLoader, canOptionsInvalid, isInfoInPlace,
            customLeftIconJSX, isBlueLabel, showToneColor, showDropdownHeader, resetCallback, showTooltipOnHover, tooltipHoverText, longTextEllipsis, fromPageHeader = false, prefixWithCustomText = "", isLowercaseFirstLetter = false, showTitleOnHover = false, customTooltipIcon = "", showCustomDropdownHeaderLabel = false, customDropdownHeaderLabel = "", titleTooltipText = "", disablePersonalizeTooltipText, dropDownHeight = "",
            isLoading = false, onSearchCallback, searchStrFromParent = null, loaderType = null, debounceDelay, noHandIcon = false, showCustomIconIninlineMode, customClassForInlineModeIcon, position, isSocial = false,
            showImageInSelection = false , useCancelSubmitButtons = false, ctaButtonsEnabled = false, onClickCancel, onClickSubmit, onClickOutside, isAeroDesign
        } = this.props;
        _renderValidationErrors = _renderValidationErrors && _renderValidationErrors.bind(this);

        return (
            <>
                {/*This component is used to scroll it into view*/}
                <SingleSelectView
                    {...this.state}
                    disablePersonalizeTooltipText={disablePersonalizeTooltipText}
                    extendWidth={extendWidth}
                    showSearch={this.props.showSearch}
                    placeholder={this.props.placeholder}
                    name={this.props.name}
                    className={`${className} ${validationClasses}`}
                    extendLeft={this.props.extendLeft}
                    options={this.state.options}
                    _renderValidationErrors={_renderValidationErrors}
                    selected={this.state.selected}
                    onClickOption={this.onClickOption}
                    filterOptions={this.filterOptions}
                    toggle={this.toggle}
                    hide={this.hide.bind(this)}
                    width={this.props.width}
                    onClickClearChanges={this.onClickClearChanges}
                    onClickApplyChanges={this.onClickApplyChanges}
                    onClickCancel={onClickCancel}
                    onClickSubmit={onClickSubmit}
                    onClickOutside={onClickOutside}
                    disabled={disabled}
                    searchPlaceHolder={this.props.searchPlaceHolder}
                    customSelectedVal={customSelectedVal}
                    align={this.props.align}
                    top={this.props.top}
                    displayLabel={this.props.displayLabel}
                    enableApply={this.state.highlightOnly}
                    reseetToDefault={this.reseetToDefault}
                    ctaButtonsEnabled={ctaButtonsEnabled}
                    insidePopup={this.props.insidePopup}
                    size={size}
                    parentNode={this.props.parentNode}
                    getDropdownNode={this.getDropdownNode.bind(this)}
                    dropdownNode={dropdownNode}
                    fixedDropdown={fixedDropdown}
                    resetParam={this.props.resetParam}
                    appendElementToScroll={appendElementToScroll}
                    floatRight={this.props.floatRight}
                    parentId={parentId}
                    isResetAllowed={isResetAllowed}
                    customWidthOpen={customWidthOpen}
                    showLinkDropdown={showLinkDropdown}
                    customSelectViewLabel={customSelectViewLabel}
                    showLargeDropDown={showLargeDropDown}
                    disableToggleOnLabelWhenOpen={disableToggleOnLabelWhenOpen}
                    resetLabel={resetLabel}
                    customClass={customClass}
                    customDisplayLabel={customDisplayLabel}
                    supportMultipleList={supportMultipleList}
                    listKeys={listKeys}
                    filterType={filterType}
                    delayClickOutside={delayClickOutside}
                    supportDefault={supportDefault}
                    overideStyle={overideStyle}
                    setScrollViewSingleSelectRef={this.setScrollViewSingleSelectRef}
                    inlineMode={inlineMode}
                    direction={direction}
                    showLeftIcon={showLeftIcon}
                    customLeftIconClass={customLeftIconClass}
                    noBorderOnDisabled={noBorderOnDisabled}
                    hideLabelInDropDownOptions={hideLabelInDropDownOptions}
                    noOptionsAvailableText={noOptionsAvailableText}
                    noSearchResultText={noSearchResultText}
                    customClickHandler={customClickHandler}
                    customSize={customSize}
                    inlineTitlebox={inlineTitlebox}
                    windowing={windowing}
                    scrollActionBoxIntoView={this.props.scrollActionBoxIntoView}
                    capitalizeSelectedValue={capitalizeSelectedValue}
                    showPhoenixTooltip={showPhoenixTooltip}
                    displayLabelCustomClass={displayLabelCustomClass}
                    forceOpen={forceOpen}
                    forceAlignDropIcon={forceAlignDropIcon}
                    largeSelectBox={largeSelectBox}
                    showEllipsis={showEllipsis}
                    validationError={validationError}
                    showLeftIconInlineMode={showLeftIconInlineMode}
                    openCenter={openCenter}
                    inlineModeTooltip={inlineModeTooltip}
                    disableDropDownToggle={disableDropDownToggle}
                    hoverTipDisabled={hoverTipDisabled}
                    overrideDefault={overrideDefault}
                    onListScroll={onListScroll}
                    removeBlueText={removeBlueText}
                    overRideDefaulSelectedStyle={overRideDefaulSelectedStyle} // overide prop for resolving styling issue of uc-round-robin task
                    showLoader={showLoader}
                    getDotLoader={getDotLoader}
                    canOptionsInvalid={canOptionsInvalid}
                    isInfoInPlace={isInfoInPlace}
                    customLeftIconJSX={customLeftIconJSX}
                    showToneColor={showToneColor}
                    iconMode={this.props.iconMode}
                    selectCustomClass={this.props.selectCustomClass}
                    isBlueLabel={!this.state.show && isBlueLabel}
                    showDropdownHeader={showDropdownHeader}
                    resetCallback={resetCallback}
                    showTooltipOnHover={showTooltipOnHover}
                    tooltipHoverText={tooltipHoverText}
                    longTextEllipsis={longTextEllipsis}
                    fromPageHeader={fromPageHeader}
                    prefixWithCustomText={prefixWithCustomText}
                    isLowercaseFirstLetter={isLowercaseFirstLetter}
                    showTitleOnHover={showTitleOnHover}
                    showCustomDropdownHeaderLabel={showCustomDropdownHeaderLabel}
                    customDropdownHeaderLabel={customDropdownHeaderLabel}
                    titleTooltipText={titleTooltipText}
                    customTooltipIcon={customTooltipIcon}
                    dropDownHeight={dropDownHeight}
                    isLoading={isLoading}
                    onSearchCallback={onSearchCallback}
                    searchStrFromParent={searchStrFromParent}
                    loaderType={loaderType}
                    customHeader={this.props.customHeader}
                    headerIconClass={this.props.headerIconClass}
                    headerText={this.props.headerText}
                    showClose={this.props.showClose}
                    customParentClass={this.props.customParentClass}
                    insightsModule={this.props.insightsModule}
                    debounceDelay={debounceDelay}
                    noHandIcon={noHandIcon}
                    showCustomIconIninlineMode={showCustomIconIninlineMode}
                    customClassForInlineModeIcon={customClassForInlineModeIcon}
                    position={position}
                    isSocial={isSocial}
                    showImageInSelection={showImageInSelection}
                    useCancelSubmitButtons={useCancelSubmitButtons}
                    customCTAJSX={this.props.customCTAJSX}
                    isAeroDesign={isAeroDesign}
                />
            </>
        );
    }
}

SingleSelect.propTypes = {
    width: PropTypes.number,
    className: PropTypes.string,
    extendLeft: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    showSearch: PropTypes.bool,
    placeholder: PropTypes.string,
    showCustomDateRange: PropTypes.bool,
    dateRangeFormat: PropTypes.string,
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    // validation related props
    validationTrigger: PropTypes.string,
    _attachToFormWrapper: PropTypes.func,
    _detachFromFormWrapper: PropTypes.func,
    _fieldValidator: PropTypes.func,
    _renderValidationErrors: PropTypes.func,
    _onChange: PropTypes.func,
    disabled: PropTypes.bool,
    searchByKeyAndValue: PropTypes.bool,
    searchPlaceHolder: PropTypes.string,
    customSelectedVal: PropTypes.string,
    displayLabel: PropTypes.string,
    align: PropTypes.string,
    forceAlignDropIcon: PropTypes.bool,
    top: PropTypes.bool,
    insidePopup: PropTypes.bool,
    forceHideOptions: PropTypes.bool,
    resetParam: PropTypes.object,
    ctaButtonsEnabled: PropTypes.bool,
    floatRight: PropTypes.bool,
    size: PropTypes.string,
    parentNode: PropTypes.node,
    fixedDropdown: PropTypes.bool,
    appendElementToScroll: PropTypes.func,
    parentId: PropTypes.node,
    isResetAllowed: PropTypes.bool,
    customWidthOpen: PropTypes.number,
    showLinkDropdown: PropTypes.bool,
    customSelectViewLabel: PropTypes.string,
    showLargeDropDown: PropTypes.bool,
    disableToggleOnLabelWhenOpen: PropTypes.string,
    resetLabel: PropTypes.string,
    customClass: PropTypes.string,
    customDisplayLabel: PropTypes.string,
    overideStyle: PropTypes.string,
    supportMultipleList: PropTypes.bool,
    listKeys: PropTypes.array,
    filterType: PropTypes.string,
    openCallback: PropTypes.func,
    delayClickOutside: PropTypes.func,
    supportDefault: PropTypes.bool,
    inlineMode: PropTypes.bool,
    direction: PropTypes.string,
    showLeftIcon: PropTypes.bool,
    customLeftIconClass: PropTypes.string,
    showErrorOnWrapper: PropTypes.bool,
    setErrorInParent: PropTypes.func,
    isOnChange: PropTypes.bool,
    extendWidth: PropTypes.bool,
    noBorderOnDisabled: PropTypes.bool,
    hideLabelInDropDownOptions: PropTypes.bool,
    noSearchResultText: PropTypes.string,
    noOptionsAvailableText: PropTypes.string,
    customClickHandler: PropTypes.func,
    customSize: PropTypes.string,
    inlineTitlebox: PropTypes.bool,
    customSearchKeys: PropTypes.array,
    windowing: PropTypes.bool,
    scrollActionBoxIntoView: PropTypes.bool,
    capitalizeSelectedValue: PropTypes.bool,
    showPhoenixTooltip: PropTypes.bool,
    forceOpen: PropTypes.bool,
    displayLabelCustomClass: PropTypes.string,
    largeSelectBox: PropTypes.bool,
    keepDropDownOpenInRerender: PropTypes.bool,
    showEllipsis: PropTypes.bool,
    validationError: PropTypes.object,
    showLeftIconInlineMode: PropTypes.bool,
    openCenter: PropTypes.bool,
    inlineModeTooltip: PropTypes.bool,
    disableDropDownToggle: PropTypes.bool,
    hoverTipDisabled: PropTypes.bool,
    hoverCallBack: PropTypes.func,
    overrideDefault: PropTypes.bool,
    onListScroll: PropTypes.func,
    customOnClick: PropTypes.func,
    removeBlueText: PropTypes.bool,
    overRideDefaulSelectedStyle: PropTypes.bool,
    showLoader: PropTypes.bool,
    getDotLoader: PropTypes.func,
    canOptionsInvalid: PropTypes.bool,
    isInfoInPlace: PropTypes.bool,
    noOfSkippedSearch: PropTypes.number,
    customLeftIconJSX: PropTypes.string,
    getFormattedOption: PropTypes.func,
    showToneColor: PropTypes.bool,
    iconMode: PropTypes.bool,
    selectCustomClass: PropTypes.string,
    isBlueLabel: PropTypes.bool,
    showDropdownHeader: PropTypes.bool,
    resetCallback: PropTypes.func,
    showTooltipOnHover: PropTypes.bool,
    tooltipHoverText: PropTypes.string,
    fromPageHeader: PropTypes.bool,
    longTextEllipsis: PropTypes.bool,
    prefixWithCustomText: PropTypes.bool,
    isLowercaseFirstLetter: PropTypes.bool,
    showTitleOnHover: PropTypes.bool,
    titleTooltipText: PropTypes.string,
    customTooltipIcon: PropTypes.string,
    dropDownHeight: PropTypes.string,
    isLoading: PropTypes.bool,
    onSearchCallback: PropTypes.func,
    searchStrFromParent: PropTypes.string,
    onDropdownClose: PropTypes.func,
    loaderType: PropTypes.string,
    showCustomDropdownHeaderLabel: PropTypes.bool,
    customDropdownHeaderLabel: PropTypes.string,
    customHeader: PropTypes.string,
    headerIconClass: PropTypes.string,
    headerText: PropTypes.string,
    showClose: PropTypes.bool,
    disableToggle: PropTypes.bool,
    disablePersonalizeTooltipText: PropTypes.string,
    customParentClass: PropTypes.string,
    insightsModule: PropTypes.bool,
    openCallbackDelay: PropTypes.number,
    debounceDelay: PropTypes.number,
    noHandIcon: PropTypes.bool,
    showCustomIconIninlineMode: PropTypes.bool, 
    customClassForInlineModeIcon: PropTypes.string,
    position: PropTypes.object,
    isSocial: PropTypes.bool,
    customCTAJSX: PropTypes.node,
    useCancelSubmitButtons: PropTypes.bool,
    showImageInSelection: PropTypes.bool,
    onClickOutside: PropTypes.func,
    isAeroDesign: PropTypes.bool
};

SingleSelect.defaultProps = {
    options: [],
    showCustomDateRange: false,
    searchByKeyAndValue: false,
    searchPlaceHolder: "Find",
    size: "medium",
    fixedDropdown: false,
    isResetAllowed: false,
    overideStyle: "",
    isOnChange: false,
    capitalizeSelectedValue: true,
    showPhoenixTooltip: false,
    longTextEllipsis: false,
    isLoading: false,
    openCallbackDelay: 100
};

export default SingleSelect;
