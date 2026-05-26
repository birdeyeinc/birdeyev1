import React, { Component } from "react";
import PropTypes from "prop-types";
import { isFunction, isString, isArray, isObject, each, isEmpty, flatten, trim, filter } from "lodash";
import { getValidationClasses, getValidationErrors, runValidator } from "utils/validate";
import styles from "./Form.module.scss";
import Tooltip from "atoms/Tooltip";
import AlertImg from "assets/images/error.svg";
import { hasScriptTag } from "utils";

class Form extends Component {
    constructor(props) {
        super(props);

        this.inputs = [];
        // whether form is valid or not
        // initially evaluated by running validate inputs on componentDidMount
        this.isValid = true;
        this.failedValidations = {}; // failed validations for different input components
        this.customFormComponents = [
            "FormInput",
            "RadioGroup",
            "Select",
            "SingleSelect",
            "SingleSelectPaginated",
            "MultiSelect",
            "CheckboxGroup",
            "Toggle",
            "TextArea",
            "CountryPhoneInput"
        ];

        const defaultState = {
            validationErrors: {}, // failed validation errors messages
            customValidationErrors: [], // runs only on submit
            validationClasses: " valid"
        };
        this.state = Object.assign(defaultState);
    }

    handleFormSubmit = (e) => {
        const { onSubmit } = this.props;
        e.preventDefault();
        e.stopPropagation(); // to prevent nested form from triggering parent form submit handler
        const model = this.getModel();

        this.validateInputs().then(isFormValid => {
            const validationErrors = this.getCumulativeValidationErrors();

            if (isFunction(onSubmit)) {
                onSubmit(model, isFormValid, validationErrors);
            }
        });
    };

    getModel() {
        const formModel = {};
        const { includeUncheckedInputs } = this.props;

        this.inputs.reduce((formModel, component) => {
            let {
                props: {
                    name: fieldNameAttribute,
                    type: inputFieldType,
                    disabled
                },
                state: {
                    checked, // for checkbox, toggle
                    value,
                    selected,
                    options: updatedOptions // for multiselect
                },
                constructor: {
                    displayName
                }
            } = component;

            // if the field doesn't have the name attribute or is disabled
            // then do nothing
            if (!fieldNameAttribute || disabled) {
                return formModel;
            }

            if (!inputFieldType) {
                inputFieldType = displayName;
            }

            // For input type -
            switch (inputFieldType) {
                case "text":
                case "textarea":
                case "number":
                case "email":
                case "password":
                case "Select":
                    value = trim(value);
                    // For input type "text"
                    formModel[fieldNameAttribute] = value;
                    break;
                case "Toggle":
                case "checkbox": {
                    const existingValue = formModel[fieldNameAttribute];

                    // assigning default values
                    if (isEmpty(value)) {
                        value = checked ? "1" : "0";
                    }

                    value = trim(value);

                    // only if the checkbox is checked add or update any value in the model
                    if (checked || (!checked && includeUncheckedInputs)) {
                        if (existingValue) {
                            if (isArray(existingValue)) {
                                existingValue.push(value);
                            } else {
                                formModel[fieldNameAttribute] = [existingValue, value];
                            }
                        } else {
                            formModel[fieldNameAttribute] = value;
                        }
                    }

                    break;
                }

                case "RadioGroup":
                    if (selected) {
                        formModel[fieldNameAttribute] = selected;
                    }
                    break;

                case "SingleSelect":
                    formModel[fieldNameAttribute] = selected && selected["value"];
                    break;
                case "SingleSelectPaginated":
                    formModel[fieldNameAttribute] = selected && selected["value"];
                    break;

                case "MultiSelect": {
                    const selectedOptions = component.getSelectedOptions(component.state.updatedOptions);
                    formModel[fieldNameAttribute] = selectedOptions;
                    break;
                }
            }

            return formModel;
        }, formModel);

        return formModel;
    }

    /**
     *
     * @param updateState {Boolean} - Tells whether we need to show the errors [ this.state.validationErrors ] or not
     */
    validateInputs(obj = {}) {
        let fieldValidationErrors = {}; // cumulative validation errors
        let fieldFailedValidations = {}; // cumulative failed validations
        let customValidationErrors = [];

        const {
            validations: customValidations,
            errorMessages,
            validateAllInputs
        } = this.props;

        const { validateDisabled = false } = obj;

        this.inputs.forEach(inputComponent => {
            const {
                props: {
                    validationTrigger,
                    disabled,
                    name: fieldNameAttribute
                }
            } = inputComponent;

            let validationErrors, failedValidations;

            // 1. if validateAllInputs is false inputs then we only validate the input's whose
            // validationTrigger is "onSubmit"
            // 2. if the input field is disabled then also do nothing
            if ((!validateAllInputs && validationTrigger !== "onSubmit") || (disabled && !validateDisabled)) {
                return false;
            }

            ({ validationErrors, failedValidations } = this.fieldValidator(inputComponent, false, validateDisabled));
            // else show the errors globally i.e at form level
            if (failedValidations && failedValidations.length) {
                fieldValidationErrors[fieldNameAttribute] = validationErrors;
                fieldFailedValidations[fieldNameAttribute] = failedValidations;
            }
        });

        if (customValidations && !isEmpty(customValidations)) {
            customValidationErrors = this.runCustomValidator(customValidations, errorMessages);
        }

        this.setState({
            validationErrors: fieldValidationErrors,
            customValidationErrors
        });

        this.failedValidations = fieldFailedValidations;

        return this.checkIfFormIsValid();
    }

    fieldValidator = (inputComponent, isCallerInputField = true, validateDisabled) => {
        let {
            state: {
                value,
                selected,
                checked,
                options: updatedOptions // for multiselect
            },
            props: {
                validations,
                errorMessages,
                required: isRequired,
                type: formFieldType,
                disabled,
                name: fieldNameAttribute
            },
            constructor: {
                displayName
            }
        } = inputComponent;

        const { errorsInline } = this.props; // this here is form component

        // if the field is disabled, don't validate the field
        if (disabled && !validateDisabled) {
            return;
        }
        // radio group validation
        // checkbox group validation
        if (/^RadioGroup|CheckboxGroup/.test(displayName)) {
            value = selected;
            formFieldType = displayName;
        } else if (displayName === "Select") {
            formFieldType = displayName;
        } else if (displayName === "SingleSelect") {
            value = selected && selected["value"];
            formFieldType = displayName;
        } else if (displayName === "SingleSelectPaginated") {
            value = selected && selected["value"];
            formFieldType = displayName;
        } else if (formFieldType === "checkbox") {
            value = checked;
        } else if (displayName === "Toggle") {
            value = checked;
            formFieldType = displayName;
        } else if (displayName === "MultiSelect") {
            value = inputComponent.getSelectedOptions(inputComponent.state.updatedOptions);
            formFieldType = displayName;
        } else if (displayName === "TextArea" || (displayName === "FormInput" && formFieldType === "text")) {
            //Adding a top level check for existence of scriptTags
            validations = {
                script: (value) => {
                    if (value) {
                        return !hasScriptTag(value);
                    } else {
                        return true;
                    }
                },
                ...validations
            };
            //Error Message corresponding to script Tag error
            errorMessages = {
                ...errorMessages,
                "script": "Please enter a valid input w/o script tags"
            };
        }

        const failedValidations = runValidator(validations, value, isRequired, formFieldType);
        const fieldValidationErrors = getValidationErrors(failedValidations, errorMessages);
        const validationClasses = getValidationClasses(failedValidations);

        // only when errorsInline prop is true then update individual component state to reflect validation errors and classes
        if (errorsInline) {
            inputComponent.setState({
                validationErrors: fieldValidationErrors,
                validationClasses,
                showErrorOutside: this.props.showErrorOutside
            });
        } else {
            inputComponent.setState({
                validationClasses
            });

            // setting errors at form level when the error is triggered by the input field
            if (isCallerInputField) {
                this.setState((prevState) => {
                    // add the error at the global form level as well
                    const validationErrors = prevState.validationErrors;
                    validationErrors[fieldNameAttribute] = fieldValidationErrors;

                    return {
                        validationErrors
                    };
                });
            }
        }

        if (isCallerInputField) {
            this.failedValidations[fieldNameAttribute] = failedValidations;
            this.checkIfFormIsValid();
        }

        return {
            validationErrors: fieldValidationErrors,
            validationClasses,
            failedValidations
        };
    };

    onFieldChange = (inputComponent) => {
        if (!inputComponent) {
            throw new Error("inputComponent reference is not passed when calling _onChange");
        }
        const model = this.getModel();
        const { name } = inputComponent.props;
        const inputFieldValue = model[name];

        this.props.onChange && this.props.onChange(name, inputFieldValue, this.getModel(), this.isValid);
    };

    checkIfFormIsValid() {
        return new Promise((resolve) => {
            this.setState(prevState => {
                let failedValidations = this.failedValidations;
                let { customValidationErrors, validationErrors } = prevState;

                validationErrors = Object.values(validationErrors);
                validationErrors = flatten(validationErrors);

                failedValidations = Object.values(failedValidations);
                failedValidations = flatten(failedValidations);    // flattening validation error array's due to multiple fields

                // failed validation and validation errors are two different things
                const totalFailedValidations = failedValidations.concat(customValidationErrors);
                const totalValidationErrors = validationErrors.concat(customValidationErrors);
                const isFormValid = !filter(totalFailedValidations, (item) => {
                    return item && item.indexOf("hasWarning") == -1;
                }).length;

                if (isFormValid) {
                    this.props.onValid && this.props.onValid(this.getModel());
                } else {
                    this.props.onInvalid && this.props.onInvalid(this.getModel(), totalValidationErrors, this.failedValidations);
                }

                resolve(isFormValid);
            });
        });
    }

    runCustomValidator(customValidations, errorMessages) {
        const formModel = this.getModel();
        const failedCustomValidations = [];

        each(customValidations, (validationFunction, validationName) => {
            if (isFunction(validationFunction)) {
                const customValidationResult = validationFunction.call(this, formModel);

                // if custom validation return false
                if (!customValidationResult) {
                    failedCustomValidations.push(validationName);
                }
            } else {
                throw new Error("Custom Validations needs to be a function");
            }
        });

        const customValidationErrors = getValidationErrors(failedCustomValidations, errorMessages);
        return customValidationErrors;
    }

    renderChildren() {
        const { children } = this.updateChildren();
        this.treeDepth = 0; // reset tree depth
        return children;
    }

    treeDepth = 0;

    updateChildren(children) {
        children || (children = this.props.children);
        // if single child then convert it an array so that React.Children.map works properly
        children = Array.isArray(children) ? children : [children];
        let childrenUpdated = false;

        const updatedChildren = React.Children.map(children, childComponent => {
            const isComponentTextNode = isString(childComponent);

            if (isComponentTextNode) {
                return childComponent;
            }

            if (!childComponent) {
                return;
            }

            const componentType = childComponent.type;
            let componentDisplayName = componentType && componentType.displayName;
            const childComponentProps = childComponent.props;
            const nestedChildren = childComponentProps && childComponentProps.children;

            //This is done if any component name is wrapped with OnClickOutside like for MultiSelect OnClickOutside(MultiSelect)
            if (componentDisplayName && componentDisplayName.indexOf("OnClickOutside") > -1) {
                componentDisplayName = childComponent.props.displayName;
            }

            if (this.customFormComponents.indexOf(componentDisplayName) > -1) {
                const extraProps = {
                    _attachToFormWrapper: this.attachToForm,
                    _detachFromFormWrapper: this.detachFromForm,
                    _fieldValidator: this.fieldValidator.bind(this),
                    _renderValidationErrors: this.renderFieldValidationErrors,
                    _onChange: this.onFieldChange
                };

                childrenUpdated = true;
                return React.cloneElement(childComponent, extraProps);
            } else if (nestedChildren && (isArray(nestedChildren) || isObject(nestedChildren))) {
                const { childrenUpdated: nestedChildrenUpdated, children } = this.updateChildren(nestedChildren);

                if (nestedChildrenUpdated) {
                    childrenUpdated = true;
                    return React.cloneElement(childComponent, {
                        children
                    });
                } else {
                    return childComponent;
                }
            } else {
                return childComponent;
            }
        });

        return {
            childrenUpdated,
            children: updatedChildren
        };
    }

    renderFormValidationErrors = (validationErrors) => {
        const cumulativeValidationErrors = validationErrors || this.getCumulativeValidationErrors();

        return (
            cumulativeValidationErrors.length
                ? (<ul className={styles["validation-errors"]}>
                    {cumulativeValidationErrors.map((validationError, index) => (
                        <li key={index.toString()}>
                            {validationError}
                        </li>))}
                </ul>)
                : null
        );
    };

    getCumulativeValidationErrors() {
        let { validationErrors, customValidationErrors } = this.state;
        const { maxErrorsToShow, errorsInline, externalErrors = [] } = this.props;
        let cumulativeValidationErrors = [];

        if (errorsInline) {
            cumulativeValidationErrors = customValidationErrors.concat(externalErrors);
        } else {
            // show field errors only if the errorsInline prop is false or is undefined
            let allFieldsValidationErrors = Object.values(validationErrors); // validation errors is an object
            allFieldsValidationErrors = flatten(allFieldsValidationErrors);

            cumulativeValidationErrors = allFieldsValidationErrors.concat(customValidationErrors, externalErrors);

            // limit the errors to maxErrorsToShow prop
            if (maxErrorsToShow) {
                cumulativeValidationErrors = cumulativeValidationErrors.slice(0, maxErrorsToShow);
            }
        }

        return cumulativeValidationErrors;
    }

    /**
     * For input fields
     */
    renderFieldValidationErrors(component) {
        component = component || this;
        const { validationErrors, showErrorOutside, validationClasses } = component.state;
        const { showGreenTick = false, validateOnMount = false, showErrorOnWrapper = false, setErrorInParent, name, value, tooltip, errorTooltip, showError, showErrorMessage } = component.props;

        if (showErrorOnWrapper && validationErrors && validationErrors.length && validationClasses && validateOnMount && !component.errorOnMountCalled) {
            setErrorInParent(validationClasses, name, value);
            component.errorOnMountCalled = true;
        }

        return (
            <div>
                {showError && <ul className="validation-errors">
                    <li>{showErrorMessage}</li>
                </ul>}
                {validationErrors && validationErrors.length ?
                    (typeof validationErrors[0] === "string") && validationErrors[0].indexOf("Warning:") > -1 ? (
                        <ul className="validation-warnings">
                            <li>{validationErrors[0].slice(validationErrors[0].indexOf(":") + 1, validationErrors[0].length)}</li>
                        </ul>
                    ) : !showErrorOutside ? (
                        <div className="error-tooltips">
                            <Tooltip
                                hideOnScroll
                                text={validationErrors[0]}
                                align={!isEmpty(tooltip) ? tooltip.align : !isEmpty(errorTooltip) ? errorTooltip.align : "right"}
                                position={!isEmpty(tooltip) ? tooltip.position : !isEmpty(errorTooltip) ? errorTooltip.position : "bottom"}
                                tooltipClass={!isEmpty(tooltip) ? tooltip.tooltipClass : !isEmpty(errorTooltip) ? errorTooltip.tooltipClass : ""}
                            >
                                <img src={AlertImg} alt="error" />
                            </Tooltip>
                        </div>
                    ) :
                        (
                            <ul className="validation-errors">
                                <li> {validationErrors[0]}</li>
                            </ul>
                        ) : (
                        (showGreenTick && validateOnMount) ? (
                            <i className="icon_phoenix-check" />
                        ) : null
                    )}
            </div>
        );
    }

    attachToForm = (component) => {
        const componentAlreadyExists = this.inputs.indexOf(component) > -1;

        if (!componentAlreadyExists) {
            this.inputs.push(component);
        }
    };

    detachFromForm = (component) => {
        const componentPosition = this.inputs.indexOf(component);

        if (componentPosition !== -1) {
            this.inputs.splice(componentPosition, 1);
        }
    };

    render() {
        const { className = "", showErrorsAtFormlevel, name, id } = this.props;

        return (
            <form
                className={`el-form ${className}`}
                onSubmit={this.handleFormSubmit}
                noValidate
                name={name}
                id={id}
            >
                {this.renderChildren()}

                {
                    showErrorsAtFormlevel &&
                    this.renderFormValidationErrors()
                }
            </form>
        );
    }
}

Form.propTypes = {
    onSubmit: PropTypes.func,
    externalErrors: PropTypes.arrayOf(PropTypes.string),
    validations: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    errorMessages: PropTypes.object,
    validateAllInputs: PropTypes.bool,
    errorsInline: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    /**
     * Number of errors to show at form level
     *
     */
    maxErrorsToShow: PropTypes.number,
    onInvalid: PropTypes.func,
    onValid: PropTypes.func,
    onChange: PropTypes.func,
    includeUncheckedInputs: PropTypes.bool,
    showErrorsAtFormlevel: PropTypes.bool,
    showErrorOutside: PropTypes.bool
};

Form.defaultProps = {
    validateAllInputs: true,
    showErrorsAtFormlevel: true
};

export default Form;