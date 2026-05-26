import validate from "validate.js";
import { isEmpty, each, isFunction, isUndefined, kebabCase, isString, trim } from "lodash";
import cx from "classnames";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();
export function validatePhoneUS(phoneNumber) {
    return (
        phoneNumber.length > 9 &&
    phoneNumber.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)
    );
}

export function validatePostalCode(postalcode) {
    return postalcode.match(
        /(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXYabceghjklmnpstvxy]{1}\d{1}[A-Za-z]{1} ?\d{1}[A-Za-z]{1}\d{1})$/
    );
}

export function phoneAUTollFree(value) {
    return /^(\+61){0,1}\s?(1800|1801|1900|1901|1902|1906|1300){1}\s?[0-9]{0,3}\s?[0-9]{0,3}$/.test(
        value
    );
}

validate.validators.eitherOfPresent = function(value, options, key, attributes, globalOptions) {
    let msg;
    // log(key);
    if (isEmpty(attributes[options.fieldName]) && isEmpty(value)) {
        msg = options.message || `^Please enter either ${key} or ${options.fieldName}`;
    }

    if (!isEmpty(value) && options.otherValidators) {
        const arr = validate.single(value, options.otherValidators, globalOptions);
        msg = arr && arr.length ? `^${arr[0]}` : msg;
    }

    return msg;
};

validate.validators.countrySpecificPhone = function(value, options, key, attributes, globalOptions) {
    let msg = null;
    let errMsg = null;
    // log(options, key, attributes);
    switch (globalOptions.countryCode) {
        case "US":
        case "CA":
            errMsg = validate.single(value, { phoneUS: true });
            break;
        case "UK":
            errMsg = validate.single(value, { phoneUK: true });
            break;
        case "AU":
            errMsg = validate.single(value, { checkWithGoogleLib: { countryCode: "AU" } });
            break;
        case "NL":
            errMsg = validate.single(value, { phoneNL: true });
            break;
        case "NZ":
            errMsg = validate.single(value, { phoneNZ: true });
            if (errMsg) {
                errMsg = validate.single(value, { mobileNZ: true });
            }
            break;
        case "DE":
            errMsg = validate.single(value, { phoneDE: true });
            break;
        default:
    }

    if (errMsg && errMsg.length) {
        msg = errMsg[0];
    }

    return msg;
};

validate.validators.phoneUK = function(phoneNumber) {
    let value = phoneNumber.replace(/\(|\)|\s+|-/g,"");
    let msg = null;
    const isValid = value.length > 9 &&
        value.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/);
    if (!isValid) {
        msg = "^Please specify a valid UK phone number";
    }
    return msg;
};

validate.validators.phoneUS = function(phoneNumber) {
    let value = phoneNumber.replace(/\s+/g, "");
    let msg = null;
    const isValid = value.length > 9 &&
        value.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
    if (!isValid) {
        msg = "^Please specify a valid US phone number";
    }
    return msg;
};

validate.validators.phoneAU = function(value) {
    let msg = null;
    const isValid = /^\({0,1}((0|\+61)( )?(2|4|3|7|8)){0,1}\){0,1}(\s|-){0,1}[0-9]{2}(\s|-){0,1}[0-9]{2}(\s|-){0,1}[0-9]{1}(\s|-){0,1}[0-9]{3}$/.test(value);
    if (!isValid) {
        msg = "^Please specify a valid AU phone number";
    }
    return msg;
};

validate.validators.phoneDE = function(value) {
    let msg = null;
    const isValid = /^([+][0-9]{1,3}[ .-])?([(]{1}[0-9]{1,6}[)])?([0-9 .-/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/.test(value);
    if (!isValid) {
        msg = "^Please specify a valid DE phone number";
    }
    return msg;
};

validate.validators.phoneNL = function(value) {
    let msg = null;
    const isValid = /^(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{12}$)/.test(value);
    if (!isValid) {
        msg = "^Please specify a valid NL phone number";
    }
    return msg;
};

/**
 * matches NZ phone number formats
 * 
 * +64 7 123 1234
 * or
 * 07-123-1234
 * or
 * 071231234
 * 
 * spaces/hyphens optional
 *
 */
validate.validators.phoneNZ = function(value) {
    let msg = null;
    const isValid = value.length > 9 && /^(0|(\+64(\s|-)?)){1}\d{1}(\s|-)?\d{3}(\s|-)?\d{4}$/.test(value);
    if (!isValid) {
        msg = "^Please specify a valid NZ phone number";
    }
    return msg;
};

/**
 * matches NZ mobile number formats
 *  
 * 021 123 1234
 * or
 * 027 123 1234
 * or
 * 022-123-1234
 * or
 * +64 21 123 1234
 *
 * spaces/hyphens optional
 * 
 */
validate.validators.mobileNZ = function(value) {
    let msg = null;
    const isValid = value.length > 9 && /^(0|(\+64(\s|-)?)){1}(21|22|27){1}(\s|-)?\d{3}(\s|-)?\d{4}$/.test(value);
    if (!isValid) {
        msg = "^Please specify a valid NZ phone number";
    }
    return msg;
};

validate.validators.phoneAUTollFree = function(value) {
    let msg = null;
    const isValid = /^(\+61){0,1}\s?(1800|1801|1900|1901|1902|1906|1300){1}\s?[0-9]{0,3}\s?[0-9]{0,3}$/.test(value);
    if (!isValid) {
        msg = "^Please specify a valid AU phone number";
    }
    return msg;
};

validate.validators.checkWithGoogleLib = function (phone, options) {
    let msg = null;
    let isValid = false;
    const { countryCode } = options;
    if (phone.length > 1 && (phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone, countryCode)))) {
        isValid = true;
    }

    if (!isValid) {
        msg = "^Please specify a valid " + countryCode + " phone number";
    }
    return msg;
};

/**
 * To add more validations for Zipcodes per country, we can use following link:
 * https://gist.githubusercontent.com/matthewbednarski/4d15c7f50258b82e2d7e/raw/bbbe9c50acb24c6930e19e3b0a1951b00a1aebfb/postal-codes.json
 * If regex for a country is not available then function will validate based on US regex
 */

validate.validators.isValidZip = (countryCode, zipcode) => {
    let regex = {
        zip: {
            US: /^(\d{5})\)?$/,
            CA: /^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$/,
            UK: /[A-Z]{1,2}[A-Z0-9]{1,2} ?[0-9][A-Z]{2}$/,
            AU: /^(\d{4})\)?$/,
            NZ: /^(\d{4})\)?$/,
            NL: /^(\d{4}\s{0,1}[A-Za-z]{2})$/
        }
    };
    let isValidZip = regex.zip[countryCode] && regex.zip[countryCode].test(zipcode) || regex.zip["US"].test(zipcode);
    return isValidZip;
};

const DEFAULT_ERROR_MESSAGES = {
    "required" : "This is a required field",
    "email" : "Please enter a valid email address"
};

/**
 *
 * @param validations {Object} - Object defining required validations with their names
 * @param currentInputValue {String|Boolean} - Input field value to validate
 * @param isRequired {Boolean} - Whether required type validation is required
 * @param inputType {String} - Type of input - checkbox, radio button, text
 * @returns failedValidations {Array} - Array containing names of failed validations
 */
export function runValidator(validations, currentInputValue, isRequired, inputType) {
    // if current Input value is string then trim it
    if (isString(currentInputValue)) {
        currentInputValue = trim(currentInputValue);
    }

    let failedValidations = [];
    let requiredValidationStatus = true;

    // require validation check
    if (isRequired) {
        switch (inputType) {
            case "text" :
            case "number" :
            case "email" :
            case "password" :
            case "textarea" :
            case "RadioGroup" :
            case "Select" :
            case "Toggle" :
            case "checkbox" :
            case "SingleSelect" :
            case "SingleSelectPaginated" :
                requiredValidationStatus = !currentInputValue;
                break;

            case "CheckboxGroup" :
            case "MultiSelect" :
                requiredValidationStatus = !currentInputValue || !currentInputValue.length;
                break;
        }

        if (requiredValidationStatus) {
            failedValidations.push("required");
            // in case of required validation failed don't check any other validation
            return failedValidations;
        }
    }

    // this is validation check for the validations object we have passed in
    each(validations, (validationFunc, validationType) => {
        if (isFunction(validationFunc)) {
            const currentValidationStatus = validationFunc(currentInputValue);

            if (!currentValidationStatus) {
                failedValidations.push(validationType);
            }
        } else {
            throw new Error(`Validation value should be function for validation Type - ${validationType}`);
        }
    });

    return failedValidations;
}

export function getValidationErrors(failedValidations, errorMessages = {}) {
    const validationErrors = failedValidations.reduce((validationErrors, failedValidation) => {
        let fieldError = errorMessages[failedValidation] || "";

        // if error message was not found in error messages, then check in default messages for different fields
        if (isUndefined(fieldError)) {
            fieldError = DEFAULT_ERROR_MESSAGES[failedValidation];
        }

        if (fieldError) {
            validationErrors.push(fieldError);
        }

        return validationErrors;
    }, []);

    return validationErrors;
}

export function getValidationClasses(failedValidations) {
    const anyFailedValidations = Boolean(failedValidations.length);
    let failedValidationClasses = failedValidations.map(failedValidation => kebabCase(failedValidation)).join(" ");

    const validationClasses = cx({
        " valid" :  !anyFailedValidations,
        " invalid-error" : anyFailedValidations,
        " warning" : (failedValidations[0] && failedValidations[0].indexOf("hasWarning") > -1),
        [" " + failedValidationClasses] : true
    });

    return validationClasses;
}