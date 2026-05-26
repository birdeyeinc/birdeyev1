import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./FormInput.module.scss";
import isUndefined from "lodash/isUndefined";
import Tooltip from "atoms/Tooltip";
import { capitalizeCase, getEncodedStyleClass } from "utils";

class FormInput extends Component {
  static displayName = "FormInput";

  constructor(props) {
    super(props);

    const { name } = props;

    const defaultState = {
      validationClasses: " valid",
      validationErrors: [],
      showTick: false,
    };

    // props checks
    if (!name) {
      throw new Error("Name attribute is a required prop");
    }

    const intialState = this.mapPropsToState(props, true);
    this.state = Object.assign(defaultState, intialState);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.mapPropsToState(nextProps));
  }

  componentWillMount() {
    const { validateOnMount } = this.props;
    this.props._attachToFormWrapper && this.props._attachToFormWrapper(this);
    if (validateOnMount) {
      this.props._fieldValidator && this.props._fieldValidator(this);
    }
  }

  componentWillUnmount() {
    this.props._detachFromFormWrapper &&
      this.props._detachFromFormWrapper(this);
  }

  componentDidMount() {
    this.props.dynamicWidthCalc && this.updateInputWrapperWidth();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      showErrorOnWrapper,
      setErrorInParent,
      name,
      showGreenTick,
      value,
      tickAll,
      isOnBlur,
      _fieldValidator,
      isValidateOnChange,
    } = this.props;
    const { validationClasses, showTick } = this.state;
    // log(prevProps);
    if (prevProps.value !== value && isValidateOnChange) {
      _fieldValidator && _fieldValidator(this);
    }
    if (
      showErrorOnWrapper &&
      ((!prevState.validationClasses.includes("invalid-error") &&
        validationClasses.includes("invalid-error")) ||
        (!prevState.validationClasses.includes("required") &&
          validationClasses.includes("required")))
    ) {
      setErrorInParent(validationClasses, name, value);
    }
    if (
      showErrorOnWrapper &&
      ((prevState.validationClasses.includes("invalid-error") &&
        !validationClasses.includes("invalid-error")) ||
        (prevState.validationClasses.includes("required") &&
          !validationClasses.includes("required")))
    ) {
      setErrorInParent(validationClasses, name, value);
    }

    if (
      showGreenTick &&
      ((!prevState.validationClasses.includes("invalid-error") &&
        validationClasses.includes("invalid-error")) ||
        (!prevState.validationClasses.includes("required") &&
          validationClasses.includes("required")))
    ) {
      this.setState({
        showTick: false,
      });
    }
    if (
      showGreenTick &&
      prevProps.value &&
      prevProps.value.length > 0 &&
      prevState.validationClasses.includes("invalid-error") &&
      !validationClasses.includes("invalid-error")
    ) {
      this.setState({
        showTick: true,
      });
    }
    if (
      showGreenTick &&
      value &&
      value.length > 0 &&
      !prevState.showTick &&
      !showTick &&
      tickAll &&
      !prevState.validationClasses.includes("invalid-error") &&
      !validationClasses.includes("invalid-error")
    ) {
      this.setState({
        showTick: true,
      });
    }
    if (
      showGreenTick &&
      !value &&
      prevState.showTick &&
      showTick &&
      !tickAll &&
      !prevState.validationClasses.includes("invalid-error") &&
      !validationClasses.includes("invalid-error")
    ) {
      this.setState({
        showTick: false,
      });
    }
    if (
      showErrorOnWrapper &&
      !prevProps.isOnBlur &&
      isOnBlur &&
      !prevState.validationClasses.includes("invalid-error") &&
      !validationClasses.includes("invalid-error")
    ) {
      setErrorInParent(validationClasses, name, value);
    }

    if (this.props.updateDynamicWidth) {
      this.props.dynamicWidthCalc && this.updateInputWrapperWidth();
    }
  }

  mapPropsToState(nextProps, initialCase) {
    const stateChanges = {};

    if (
      initialCase ||
      this.props.value !== nextProps.value ||
      nextProps.forceUpdate
    ) {
      stateChanges.value = nextProps.value;
      stateChanges.islabelClass = stateChanges.value;
    }

    if (initialCase || this.props.checked !== nextProps.checked) {
      stateChanges.checked = nextProps.checked || false;
    }

    // default input type is text
    if (isUndefined(nextProps.type)) {
      stateChanges.type = "text";
    }

    if (initialCase || this.props.type !== nextProps.type) {
      this.isInputTypeCheckbox = nextProps.type
        ? nextProps.type === "checkbox"
        : false;
    }

    return stateChanges;
  }

  handleInputChange = (e) => {
    const {
      validationTrigger,
      type,
      maxLength,
      formatter /*, ignoreEulersNumber*/,
      readOnly,
      maxDecimalLength
    } = this.props;
    const inputTarget = e.target;
    let inputValue = inputTarget.value;
    // if (type == "number" && inputValue.toLowerCase().indexOf("e") > -1 && ignoreEulersNumber) {
    //     inputValue = inputValue.replace("e", "");
    // }
    if (type == "number" && maxLength) {
      // This is added to handle maxDecimal point
      if (maxDecimalLength && inputValue?.includes(".")) {
        const parts = inputValue?.split(".");
        // If the decimal part has more than 2 digits, round it to 2 decimal places
        if (parts?.[1]?.length > maxDecimalLength) {
            const roundedValue = parseFloat(inputValue)?.toFixed(maxDecimalLength);
            inputValue = roundedValue;
        }
      }
      // This is added to handle maxLength, which is ignored in few browsers for input type number
      if (inputValue.length > maxLength) return;
      inputValue = inputValue.substring(0, maxLength);
    }
    if (formatter && typeof formatter === "function") {
      inputValue = formatter(inputValue);
    }
    let isChecked = this.isInputTypeCheckbox ? inputTarget.checked : false;
    const stateChanges = {};
    if (inputValue) {
      this.setState({ islabelClass: true });
    } else {
      this.setState({ islabelClass: false });
    }
    if (!this.isInputTypeCheckbox) {
      stateChanges["value"] = inputValue;
    } else {
      if (!readOnly) {
        stateChanges["checked"] = isChecked;
      }
    }

    this.setState(stateChanges, () => {
      // field validator needs to be called after the state has been updated with the current input value or checked status
      if (validationTrigger === "onChange") {
        // call field validator method in the form wrapper component
        this.props._fieldValidator && this.props._fieldValidator(this);
      }
      this.props._onChange && this.props._onChange(this);
    });

    this.props.onChange && this.props.onChange(e, inputValue);
  };

  handleInputBlur = (e) => {
    let inputValue = e ? e.target.value : "";
    const { validationTrigger, trimOnBlur, type, showGreenTick } = this.props;
    const { validationClasses } = this.state;

    if (validationTrigger === "onBlur") {
      // call field validator method in the form wrapper component
      this.props._fieldValidator && this.props._fieldValidator(this);
    }

    /** in case we need to trim the input text value on blur */
    if (trimOnBlur && type === "text") {
      inputValue = inputValue && inputValue.trim();
    }

    if (
      showGreenTick &&
      inputValue &&
      inputValue.length &&
      !validationClasses.includes("invalid-error")
    ) {
      this.setState({
        showTick: true,
      });
    } else if (
      showGreenTick &&
      !(inputValue && inputValue.length) &&
      !validationClasses.includes("invalid-error")
    ) {
      this.setState({
        showTick: false,
      });
    }

    this.props.onBlur && this.props.onBlur(inputValue, e);
  };

  getWrapperStyleName = () => {
    const { showLeftIcon, noCheckboxHover, type = "text" } = this.props;

    const withIconClass = showLeftIcon ? "with-icons" : "";
    const noCheckboxHoverClass = noCheckboxHover ? "no-hover" : "";

    switch (type) {
      case "checkbox": {
        return `checkbox-wrapper ${noCheckboxHoverClass}`;
      }

      case "radio": {
        return `radio-wrapper`;
      }

      default: {
        return `form-input-wrapper ${withIconClass}`;
      }
    }
  };

  updateInputWrapperWidth = (e) => {
    this.setState({ dynamicWrapperWidth: this.props.dynamicWidthCalc(e) });
  };

  render() {
    const {
      value,
      validationClasses,
      checked,
      islabelClass,
      showTick,
      dynamicWrapperWidth,
    } = this.state;

    /*eslint-disable */
    let {
      className,
      validations,
      errorMessages,
      onChange,
      _onChange,
      validationTrigger,
      _detachFromFormWrapper,
      _attachToFormWrapper,
      _fieldValidator,
      _renderValidationErrors,
      type = "text",
      autoComplete,
      selectAllOnClick,
      keyCheck,
      ellipStyle,
      capitalizeLabel,
      label,
      selectAll,
      tooltip,
      autoFocus,
      showLeftIcon,
      noCheckboxHover,
      customIconClass,
      customIconElement,
      showGreenTick,
      readOnly,
      onChangeCustom,
      labelInside,
      allowClear,
      getInputRef,
      largeText,
      allowOnlyNumber,
      disabled,
      styleConfig,
      dynamicWidthCalc,
      errorTooltipText,
      allowOnlyIntegerNumber,
      onClickHandler,
      customChildHtml,
      showRightIcon,
      showError,
      showErrorMessage,
      fixedText,
      showFixedtext,
      customIconClassName,
      showCustomIcon,
      showArrowDropdownIcon,
      overideDefault,
      isAutoFocus,
      noTickInDisabledState,
      onKeyPress,
      customClass = "",
      ...defaultInputProps
    } = this.props;
    /*eslint-enable */

    const isTypeCheckbox = type === "checkbox";
    const isTypeRadio = type === "radio";
    // className += validationClasses;
    className = 'el-forminput '
      + (showError && !validationClasses.includes("invalid-error")
        ? className + " invalid-error"
        : className + validationClasses);
    const withIconClass = showLeftIcon ? "with-icons" : "";
    const withRightIcon = showRightIcon ? "right-icon" : "";
    const noCheckboxHoverClass = noCheckboxHover ? "no-hover" : "";
    let wrapperStyleName = `${isTypeCheckbox
      ? `checkbox-wrapper ${noCheckboxHoverClass}`
      : `radio-wrapper`
      }`;
    switch (type) {
      case "checkbox":
      case "radio": {
        return (
          <section
            className={`${className} ${getEncodedStyleClass(
              wrapperStyleName,
              styles
            )}`}
          >
            <input
              {...defaultInputProps}
              type={type}
              onChange={
                onChangeCustom && type === "checkbox"
                  ? onChange
                  : this.handleInputChange
              }
              onBlur={this.handleInputBlur}
              checked={checked}
              className={styles["form-input"]}
              readOnly={readOnly}
              disabled={disabled}
            />

            {!overideDefault ? (
              <span className={styles[isTypeCheckbox ? "box" : "circle"]}>
                <span
                  className={getEncodedStyleClass(
                    `${isTypeCheckbox
                      ? noTickInDisabledState
                        ? ""
                        : "tick"
                      : "circle-filled"
                    } ${isTypeCheckbox && selectAll ? "selectAll" : ""}`,
                    styles
                  )}
                />
              </span>
            ) : null}
            {isTypeRadio ? <span className={styles["custom-radio"]} /> : ""}
            {labelInside ? (
              <label htmlFor={name} className={styles["label-inside"]}>
                {capitalizeLabel === "no" ? label : capitalizeCase(label)}
              </label>
            ) : (
              ""
            )}
            {_renderValidationErrors && _renderValidationErrors(this)}
          </section>
        );
      }

      default: {
        return (
          <section
            className={`${className} ${getEncodedStyleClass(
              `form-input-wrapper ${withRightIcon} ${withIconClass} ${errorTooltipText ? "error-border" : ""
              }`,
              styles
            )}`}
          >
            {label ? (
              <label htmlFor={name}>
                <div style={ellipStyle} className="label-outside">
                  {capitalizeLabel === "no" ? label : capitalizeCase(label)}
                  {tooltip && (
                    <Tooltip
                      hideOnScroll
                      theme={`${tooltip.type === "link" ? "white" : ""}`}
                      text={tooltip.text}
                      align={tooltip.align}
                      size={tooltip.size}
                    >
                      <i
                        className={
                          showCustomIcon ? customIconClassName : "icon_phoenix-question-mark"
                        }
                      />
                    </Tooltip>
                  )}
                </div>
              </label>
            ) : null}
            <div
              className={`pos-rel unblur-input filter-name ${customClass} ${getEncodedStyleClass(
                `${styleConfig && styleConfig.xLargeFont ? "x-large-font" : ""
                } ${styleConfig && styleConfig.removeBorder ? "remove-border" : ""
                } ${styleConfig && styleConfig.xLargeHeight
                  ? "x-large-height"
                  : ""
                } ${dynamicWidthCalc ? "dynamic-width" : ""}`,
                styles
              )}`}
              {...(dynamicWidthCalc
                ? {
                  style: {
                    width: dynamicWrapperWidth,
                  },
                }
                : {})}
            >
              {showFixedtext && <div>{fixedText}</div>}
              <input
                {...defaultInputProps}
                type={type}
                value={value}
                onChange={this.handleInputChange}
                onBlur={this.handleInputBlur}
                readOnly={readOnly}
                disabled={disabled}
                autoComplete={autoComplete ? autoComplete : "on"}
                className={`${islabelClass ? "err-placeholder" : ""} ${isAutoFocus ? "autoFocus" : ""
                  } ${getEncodedStyleClass(
                    ` ${islabelClass ? "input-filled" : ""} form-input ${allowClear && value ? "allow-clear" : ""
                    } ${largeText ? "large" : ""}`,
                    styles
                  )}`}
                onClick={(e) => {
                  onClickHandler
                    ? onClickHandler()
                    : selectAllOnClick && type === "text" && e.target.select();
                }}
                onKeyUp={(e) => {
                  dynamicWidthCalc && this.updateInputWrapperWidth(e);
                  keyCheck && keyCheck(e);
                }}
                onKeyPress={
                  allowOnlyNumber || allowOnlyIntegerNumber
                    ? (e) => {
                      if (type == "number") {
                        const inputTarget = e.target;
                        const inputValue = inputTarget.value;
                        const ASCIICode = e.which || e.keyCode;

                        if (allowOnlyIntegerNumber && ASCIICode == 46) {
                          e.stopPropagation();
                          e.preventDefault();
                          return false;
                        }

                        if (
                          ASCIICode == 46 &&
                          inputValue.match(/\./g) &&
                          inputValue.match(/\./g).length == 1
                        ) {
                          e.stopPropagation();
                          e.preventDefault();
                          return false;
                        }

                        if (
                          ASCIICode == 46 ||
                          (ASCIICode >= 48 && ASCIICode <= 57)
                        ) {
                          return true;
                        } else {
                          e.stopPropagation();
                          e.preventDefault();
                          return false;
                        }
                      }
                    }
                    : onKeyPress
                }
                autoFocus={autoFocus}
                ref={getInputRef ? getInputRef : null}
              />
              {showArrowDropdownIcon && (
                <i className="icon icon_phoenix-cheveron_open" />
              )}
              {showLeftIcon || showRightIcon ? (
                customIconElement ? (
                  customIconElement
                ) : (
                  <i className={customIconClass} />
                )
              ) : null}
              {showTick ? <i className="icon_phoenix-check" /> : ""}
              {_renderValidationErrors && _renderValidationErrors(this)}
              {allowClear && value && (
                <span className={styles["reset-input"]}>
                  <i
                    className="icon-reset phoenix-icon"
                    onClick={this.props.onChange.bind(this, null, "", true)}
                  />
                </span>
              )}
              {errorTooltipText && (
                <Tooltip
                  text={errorTooltipText}
                  position={"bottom"}
                  hideOnScroll
                  customContainerClassName={"alert-tooltip"}
                // mouseOver={tooltip.mouseOver || false}
                // customHTML={tooltip.customToolTipHTML}
                // delta={tooltip.delta}
                // getScrollParent={tooltip.getScrollParent ? tooltip.getScrollParent : null}
                // disableOnTablets={tooltip.disableOnTablets}
                // align={tooltip.align || ""}
                >
                  <span>
                    <i className="icon icon_phoenix-warning-fill" />
                  </span>
                </Tooltip>
              )}
            </div>
            {customChildHtml}
          </section>
        );
      }
    }
  } // ending render
}

FormInput.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  selectAll: PropTypes.bool,
  readOnly: PropTypes.bool,
  nonEditable: PropTypes.bool,
  /**
   * default value - "onBlur"
   * possible values - "onBlur", "onSubmit", "onChange"
   */
  validationTrigger: PropTypes.string,
  required: PropTypes.bool,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  errorMessages: PropTypes.object,
  validations: PropTypes.object,
  autoComplete: PropTypes.bool,
  trimOnBlur: PropTypes.bool,
  selectAllOnClick: PropTypes.bool,
  autoFocus: PropTypes.bool,
  showLeftIcon: PropTypes.bool,
  showRightIcon: PropTypes.bool,
  noCheckboxHover: PropTypes.bool,
  customIconClass: PropTypes.string,
  customIconElement: PropTypes.node,
  showErrorOnWrapper: PropTypes.bool,
  setErrorInParent: PropTypes.func,
  showGreenTick: PropTypes.bool,
  tickAll: PropTypes.bool,
  isOnBlur: PropTypes.bool,
  validateOnMount: PropTypes.bool,
  forceUpdate: PropTypes.bool,

  // props dynamically added by form wrapper component
  _fieldValidator: PropTypes.func,
  _attachToFormWrapper: PropTypes.func,
  _detachFromFormWrapper: PropTypes.func,
  _renderValidationErrors: PropTypes.func,
  _onChange: PropTypes.func,
  onChangeCustom: PropTypes.bool,
  labelInside: PropTypes.bool,
  allowClear: PropTypes.bool,
  getInputRef: PropTypes.func,
  largeText: PropTypes.string, // add new prop for large text in input box
  maxLength: PropTypes.string,
  formatter: PropTypes.func,
  allowOnlyNumber: PropTypes.bool,
  styleConfig: PropTypes.object,
  dynamicWidthCalc: PropTypes.func,
  onClickHandler: PropTypes.func,
  updateDynamicWidth: PropTypes.bool,
  isValidateOnChange: PropTypes.bool,
  allowOnlyIntegerNumber: PropTypes.bool,
  overideDefault: PropTypes.bool,
  showArrowDropdownIcon: PropTypes.bool,
  isAutoFocus: PropTypes.bool,
  noTickInDisabledState: PropTypes.bool,
  custonClass: PropTypes.string,
  keyCheck: PropTypes.func,
  ellipStyle: PropTypes.object,
  capitalizeLabel: PropTypes.oneOf(["no", ""]),
  label: PropTypes.string,
  tooltip: PropTypes.shape({
    type: PropTypes.string,
    text: PropTypes.string,
    align: PropTypes.string,
    size: PropTypes.string,
  }),
  errorTooltipText: PropTypes.string,
  customChildHtml: PropTypes.elementType,
  showError: PropTypes.bool,
  customIconClassName: PropTypes.string,
  onKeyPress: PropTypes.func,
  customClass: PropTypes.string,
  showCustomIcon: PropTypes.bool,
  maxDecimalLength: PropTypes.string,
};

FormInput.defaultProps = {
  validationTrigger: "onSubmit",
  type: "text",
  showLeftIcon: false,
  noCheckboxHover: false,
  showGreenTick: false,
  tickAll: false,
  isOnBlur: false,
  forceUpdate: false,
  onChangeCustom: false,
  isValidateOnChange: false,
  showArrowDropdownIcon: false,
  noTickInDisabledState: false,
};

export default FormInput;