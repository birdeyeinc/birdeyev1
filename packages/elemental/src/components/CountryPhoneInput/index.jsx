import React, {createRef} from "react";
import PropTypes from "prop-types";
import SingleSelect from "atoms/SingleSelect";
import FormInput from "atoms/FormInput";
import Tooltip from "atoms/Tooltip";
import styles from "./CountryPhoneInput.module.scss";
import { isValidPhoneNumber } from "utils/phone.utils";
import { getEncodedStyleClass } from "utils/index";

class CountryPhoneInput extends React.Component {
    static displayName = "CountryPhoneInput";
    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            setErrorClasses: null
        };
        this.inputRef = createRef();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.phoneInputProps?.phoneInputValue !== this.props.phoneInputProps?.phoneInputValue) {
            this.validateFormVal();
        }
    }

    isValidPhone = (countryCode, number) => {
        if (!number || !countryCode) return true;
        let isValidPhone = true;
        let newNumbr = number;
        try {
            if (countryCode == "UK") {
                if (!(number.startsWith("(+44") || number.startsWith("+44"))) {
                    newNumbr = "+44 " + newNumbr;
                }
            }
            isValidPhone = isValidPhoneNumber(newNumbr, countryCode);
        } catch (e) {
            isValidPhone = false;
        }
        return isValidPhone;
    };

    toggleInputFocus = (value, inputVal, e) => {
        const { setErrorClasses } = this.state;
        const isInvalid = (setErrorClasses && setErrorClasses.includes("invalid-error")) ? true : false;
        if (!isInvalid) {
            if (value) {
                this.setState({
                    isFocused: value,
                    isOnChange: false
                });
            } else {
                this.setState({
                    isOnBlur: false,
                    isFocused: false,
                    isOnChange: false
                });
            }
        } else if (isInvalid && !value) {
            this.setState({
                isOnBlur: true
            });
        }
        if (!value && this.props.onBlur) {
            this.props.onBlur(inputVal, e);
        }
    }

    validateFormVal=() => {
        if (this.inputRef && this.inputRef.current) {
            this.inputRef.current.handleInputBlur();
        }
    }

    setErrorInParent = (value, name, val) => {
        const { ShowParentError } = this.props;
        this.setState({
            setErrorClasses: value
        });

        if (ShowParentError) {
            ShowParentError(value, name, val);
        }
    }

    onCountryChange = (event) => {
        const { countryProps } = this.props;
        const { onCountryChangeCallback } = countryProps;
        const { setErrorClasses } = this.state;
        const isInvalid = this.singleSelectRef && this.singleSelectRef.state.validationClasses.includes("invalid-error") ? true : false;
        const isValid = setErrorClasses && setErrorClasses.includes("invalid-error") ? false : true; 
        onCountryChangeCallback(event);
        if (isInvalid && isValid) {
            this.setState({
                isOnChange: true
            });
        } else if (!isInvalid && !isValid) {
            this.setState({
                isOnChange: true
            });
        } else {
            this.setState({
                isOnChange: false
            });
        }
    }

    getSingleSelectRef = (node) => {
        this.singleSelectRef = node;
    }

    render() {
        const { 
            countryProps,
            phoneInputProps,
            tooltipProps,
            _fieldValidator,
            _attachToFormWrapper,
            _detachFromFormWrapper,
            _renderValidationErrors,
            _onChange,
            validateOnMount,
            tooltip,
            customClassName
        } = this.props;

        const { 
            isCountryDisabled, 
            countryInputName, 
            countryLabel, 
            displayCountryLabel, 
            countryInputPlaceholder, 
            isCountryRequired, 
            countryOptions,
            selectedCountryCode, 
            countryCustomVal
        } = countryProps;
    
        const {
            phoneInputName,
            phoneInputLabel,
            phoneInputChangeCallback,
            phoneInputPlaceholder,
            phoneInputValue,
            phoneInputErrorObj,
            isPhoneRequired,
            isBlockedPhoneValidation,
            disableInput,
            validationTrigger,
            tickAll,
            autoFocus,
            showGreenTick = true
        } = phoneInputProps;

        const extraProps = {
            _fieldValidator,
            _attachToFormWrapper,
            _detachFromFormWrapper,
            _renderValidationErrors,
            _onChange
        };

        const { toggleInputFocus, setErrorInParent, onCountryChange } = this;
        const { isFocused, setErrorClasses, isOnBlur, isOnChange } = this.state;
        const showNumer = countryOptions?.length > 0;
        return (
            <div data-testid="el-test-contryphone-input" className={`el-countryphone-input country-phone-wrap ${isFocused ? "focus" : ""} ${setErrorClasses ? setErrorClasses : ""} ${customClassName ? customClassName : ""} ${getEncodedStyleClass(`${disableInput ? "country-phone-wrap disable" : "country-phone-wrap"} ${showNumer ? "" : "show-icon"}`,styles)}`}>  
                { showNumer ? 
                    <SingleSelect
                        ref={this.getSingleSelectRef}
                        name={countryInputName}
                        disabled={isCountryDisabled}
                        options={countryOptions}
                        label={countryLabel}
                        onChange={onCountryChange}
                        selected={selectedCountryCode}
                        placeholder={countryInputPlaceholder}
                        displayLabel={displayCountryLabel}
                        required={isCountryRequired}
                        showLeftIcon
                        customLeftIconClass={"icon_phoenix-phone-fill"}
                        className="mb-0 ms-drop-215 pos-stat"
                        customSelectedVal={countryCustomVal}
                        customSelectViewLabel={countryCustomVal}
                        {...extraProps}
                        validations={{
                            isValidPhone: value => {
                                if (!isPhoneRequired) return true;
                                return value && value.length ? this.isValidPhone(selectedCountryCode, phoneInputValue) : true;
                            }
                        }}
                        validationTrigger = "onChange"
                        setErrorInParent={setErrorInParent}
                        showErrorOnWrapper
                        errorMessages={phoneInputErrorObj}
                        isOnChange={isOnChange}
                        noBorderOnDisabled
                        tooltip={tooltip}
                    /> : <i className="icon_phoenix-phone-fill" />
                }
                <FormInput
                    ref={this.inputRef}
                    name={phoneInputName}
                    value={phoneInputValue}
                    type="text"
                    label={phoneInputLabel}
                    placeholder={phoneInputPlaceholder}
                    onChange={phoneInputChangeCallback}
                    required={isPhoneRequired}
                    onFocus={() => toggleInputFocus(true)}
                    onBlur={(val, e) => toggleInputFocus(false, val, e)}
                    validations={{
                        isValidPhone: value => {
                            return value && value.length ? this.isValidPhone(selectedCountryCode, value) : true;
                        },
                        isBlockedPhoneValidation: isBlockedPhoneValidation ? isBlockedPhoneValidation : () => true
                    }}
                    errorMessages={phoneInputErrorObj}
                    showErrorOnWrapper
                    showGreenTick={showGreenTick}
                    setErrorInParent={setErrorInParent}
                    disabled={disableInput}
                    validationTrigger={validationTrigger}
                    tickAll={tickAll}
                    {...extraProps}
                    isOnBlur={isOnBlur}
                    validateOnMount={validateOnMount}
                    tooltip={tooltip}
                    autoComplete={"no-fill"}
                    autoFocus={autoFocus}
                />
    
                {tooltipProps && <Tooltip
                    customContainerClassName={"ml-0"}
                    text={""}
                    position={"right"}
                    hideOnScroll
                    {...tooltipProps}
                >
                    <input type="hidden"/>
                </Tooltip>
                }
                {setErrorClasses && setErrorClasses.includes("showTick") && phoneInputValue ? <i className="icon_phoenix-check" /> : "" }
            </div>
        );
    }   
}

CountryPhoneInput.propTypes = {
    countryProps: PropTypes.shape({
        isCountryDisabled: PropTypes.bool,
        countryInputName: PropTypes.string.isRequired,
        countryLabel: PropTypes.string,
        displayCountryLabel: PropTypes.bool,
        countryInputPlaceholder: PropTypes.string,
        isCountryRequired: PropTypes.bool,
        countryOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
        selectedCountryCode: PropTypes.string,
        countryCustomVal: PropTypes.string,
        onCountryChangeCallback: PropTypes.func.isRequired
    }).isRequired,
    phoneInputProps: PropTypes.shape({
        phoneInputName: PropTypes.string.isRequired,
        phoneInputLabel: PropTypes.string,
        phoneInputChangeCallback: PropTypes.func.isRequired,
        phoneInputPlaceholder: PropTypes.string,
        phoneInputValue: PropTypes.string,
        phoneInputErrorObj: PropTypes.object,
        isPhoneRequired: PropTypes.bool,
        isBlockedPhoneValidation: PropTypes.func,
        disableInput: PropTypes.bool,
        validationTrigger: PropTypes.string,
        tickAll: PropTypes.bool,
        autoFocus: PropTypes.bool,
        showGreenTick: PropTypes.bool
    }).isRequired,
    tooltipProps: PropTypes.object,
    _fieldValidator: PropTypes.func,
    _attachToFormWrapper: PropTypes.func,
    _detachFromFormWrapper: PropTypes.func,
    _renderValidationErrors: PropTypes.func,
    _onChange: PropTypes.func,
    ShowParentError: PropTypes.func,
    onBlur: PropTypes.func,
    validateOnMount: PropTypes.bool,
    tooltip: PropTypes.object,
    customClassName: PropTypes.string
};

export default CountryPhoneInput;
