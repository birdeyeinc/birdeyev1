import { PhoneNumberUtil } from "google-libphonenumber";
const phoneUtil = PhoneNumberUtil.getInstance();

export const checkPhoneRegEx = (phone) => {
    return /^(?=.*[0-9])[- +()0-9]+$/.test(phone);
};

/**
 * Validates a phone number against a list of country codes and determines its validity.
 *
 * @param {string} phoneNumber - The phone number to validate.
 * @param {string|string[]} countryCodeList - A single country code or an array of country codes to validate against.
 * @returns {Object} An object containing the validation result:
 *   - {boolean} isValid - Indicates if the phone number is valid for any of the provided country codes.
 *   - {string} countryCode - The country code for which the phone number is valid (if any).
 *   - {Object} parsedInput - The parsed phone number object (if parsing was successful).
 *   - {string} originalCountryCode - The original country code from the input list that was used for validation.
 *
 * @throws {Error} Logs an error if phone number validation fails due to an exception.
 */
export const isValidPhoneNumberForCountry = (phoneNumber, countryCodeList ) => {
    let isValid = false, countryCode = null, parsedInput = null, originalCountryCode = null;
    try {
        if (phoneNumber && checkPhoneRegEx(phoneNumber)) {
            if (!Array.isArray(countryCodeList)) {
                countryCodeList = [countryCodeList];
            }

            for (let index = 0; index < countryCodeList.length; index++) {
                let convCountryCode = countryCodeList[index];
                originalCountryCode = countryCodeList[index];
                if (convCountryCode == "UK") {
                    convCountryCode = "GB";
                }

                parsedInput = phoneUtil.parseAndKeepRawInput(phoneNumber, convCountryCode);
                const regionCode = convCountryCode === "GB" ? (phoneUtil.getRegionCodeForNumber(parsedInput) || convCountryCode) : convCountryCode;
                if (phoneUtil.isValidNumberForRegion(parsedInput, regionCode)) {
                    isValid = true;
                    countryCode = convCountryCode;
                    break;
                }
            }
        }
    } catch (e) {
        log("Error validating phone", e);
    }

    return { isValid, countryCode, parsedInput, originalCountryCode  };
};

/**
 * Validates if the given phone number is valid for the specified list of country codes.
 *
 * @param {string} phoneNumber - The phone number to validate.
 * @param {string[]} [countryCodeList=["US"]] - An optional array of country codes to validate against. Defaults to ["US"].
 * @returns {boolean} - Returns true if the phone number is valid for the specified country codes, otherwise false.
 */
export const isValidPhoneNumber = (phoneNumber, countryCodeList = ["US"]) => {
    return isValidPhoneNumberForCountry(phoneNumber, countryCodeList).isValid;
};