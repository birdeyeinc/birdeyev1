import { map, isEmpty } from "lodash";
import { DELIMETER, VALIDATION_ERRORS, FIELD_DATA_TYPES, OPERATORS, FIELD_NAME, CAMPAIGN_TYPE, TRIGGER_TYPE } from "./constants";
import { convertToEpochTime, getFormattedDate, getSelectOptions } from "utils";

export const getTagValuesFromIds = (ids, tags) => {
    log(ids, tags);
    // code
};

const changeQuestionType = (questionType) => {
    switch (questionType) {
        case "radio":
        case "dropdown":
        case "checkbox":
        case "review":
        case "matrixradio":
        case "matrixdropdown":
            return "text_multi";
        case "rating":
        case "nps":
        case "matrixrating":
            return "number";
        case "textarea":
        case "location":
        case "text":
        case "contact":
            return "text";
        case "datetime":
            return "date";
        case "time":
            return "time";
        default:
            return "text";
    }
};

export const getFieldLabelOptions = (fields, filterSurvey, accountSpecialist, secondaryFilterOptions, isAppointmentReminderTrigger, campaignType, isAdvancedFilter) => {
    let filteredFields = fields;
    if (filterSurvey) {
        filteredFields = fields.filter(field => !([FIELD_NAME.SURVEY].includes(field.fieldName)));
    }
    //Hiding Appointment Time filter From APPOINTMENT FORM & Recall
    if ((campaignType === CAMPAIGN_TYPE.APPOINTMENT_FORM) || (campaignType === CAMPAIGN_TYPE.APPOINTMENT_RECALL)) {
        filteredFields = fields.filter(field => !([FIELD_NAME.APPOINTMENT_TIME].includes(field.fieldName)));
    }
    if ((campaignType === CAMPAIGN_TYPE.APPOINTMENT_RECALL)) {
        filteredFields = fields.filter(field => {
            return !([FIELD_NAME.FORM_STATUS].includes(field.fieldName));
        });
    }
    if (secondaryFilterOptions && secondaryFilterOptions.length > 0) {
        return map(secondaryFilterOptions, (listVal, index) => {
            let type = changeQuestionType(listVal.questionType);
            return {
                label: listVal.label,
                value: index + DELIMETER + listVal.label + DELIMETER + type
            };
        });
    } else {
        return map(filteredFields, (field) => {
            let appendedValue = field.id + DELIMETER + field.fieldName + DELIMETER + field.type;
            if (field.customFieldSource && field.customFieldSource !== "CONTACT") {
                appendedValue += DELIMETER + field.customFieldSource;
            } else if (isAdvancedFilter) {
                appendedValue += DELIMETER + field.fieldKey + DELIMETER + field.valueKey;
            }
            const fieldExtraData = field.fieldExtraData || {};
            return {
                label: isAppointmentReminderTrigger ? (field.fieldName === "Specialist" && accountSpecialist) ? accountSpecialist : field.fieldName === "Service" ? "Appointment type" : field.fieldName : field.fieldName,
                value: appendedValue,
                ...(fieldExtraData && !isEmpty(fieldExtraData) ? { fieldExtraData } : {})
            };
        });
    }
};

export const getSeparateFieldTypeAndValue = (conjoinedValue = "", isAdvancedFilter) => {
    const separateValues = conjoinedValue.split(DELIMETER);
    const valueObj = {
        fieldId: separateValues[0],
        fieldValue: conjoinedValue,
        typeValue: separateValues[2]
    };

    if (isAdvancedFilter) {
        return {
            ...valueObj,
            fieldKey: separateValues[3],
            valueKey: separateValues[4]
        };
    }
    return {
        ...valueObj,
        customFieldSource: separateValues[3]
    };
};

export const getFilterConditionObj = (id, type, operand, operator, value, customFieldSource) => {
    const filterConditionObj = {
        type,
        operand,
        operator,
        value: changeValueAsPerType(type, value, operand, operator), // when between / date / currency / 1483478257
        id,
        mode: "view"
    };
    if (customFieldSource) {
        filterConditionObj["customFieldSource"] = customFieldSource;
    }
    return filterConditionObj;
};

export const changeValueAsPerType = (type, value, operand, operator) => {
    let finalVal;
    const separateValues = operand.split(DELIMETER);

    if (type === FIELD_DATA_TYPES.CURRENCY.value) {
        if (!isEmpty(value)) {
            if (value[0] !== "USD" && value[0] !== "-USD") {
                value.unshift((value[0][0] === "-" ? "-" : "") + "USD");
            } else if (value.length === 2) {
                if (value[0] === "-USD") {
                    value[1] = "-" + value[1];
                }
            }
        }
        finalVal = updateCurrencyValue(value[1]);
    } else if (type === FIELD_DATA_TYPES.DATE.value) {
        if (value.length > 1) {
            finalVal = [convertToEpochTime(value[0], true), convertToEpochTime(value[1], true)];
        } else {
            finalVal = [convertToEpochTime(value[0], true)];
        }
    } else if (type === FIELD_DATA_TYPES.NUMBER.value && operator !== OPERATORS.IS_BETWEEN.value && separateValues[0] != -99 && value && value.length) {
        finalVal = [+value[0]];
    } else if (type === FIELD_DATA_TYPES.YESNO.value) {
        finalVal = value;
    } else if (type === FIELD_DATA_TYPES.NUMBER_SINGLE.value) {
        finalVal = [+value[0]];
    } else if (type === FIELD_DATA_TYPES.NUMBER.value && operator === OPERATORS.IS_BETWEEN.value) {
        finalVal = [+value[0], +value[1]];
    } else {
        finalVal = value;
    }

    return finalVal;
};

export const isFilterValid = (field, condition, value) => {
    if (field && condition && value) {
        return true;
    } else {
        return false;
    }
};

export const convertToRuleObject = (list) => {
    let convertedRules = [];

    map(list, (condition) => {
        let listObj = {};
        listObj.mode = "view";
        listObj.selectedField = condition.id + DELIMETER + condition.operand + DELIMETER + condition.type;
        if (condition.customFieldSource && condition.customFieldSource !== "CONTACT") {
            listObj.selectedField += DELIMETER + condition.customFieldSource;
        }
        listObj.selectedCondition = condition.operator.toLowerCase().split(" ").join("_");
        listObj.selectedValue = condition.value;
        convertedRules.push(listObj);
    });

    return convertedRules;
};

export const convertToSchObject = (list) => {
    let convertedRules = [];
    const defaultAllowedDays = getDefaultAllowedDays()?.map(item => item.value);

    map(list, (value) => {
        let listObj = {};
        listObj.mode = "view",
            listObj.scheduled = value.scheduled,
            listObj.scheduleBy = value.scheduleBy;
        listObj.sendOrder = value.sendOrder;
        listObj.scheduleAt = value.scheduleAt || "appointment_time";
        listObj.allowedDays = value.allowedDays || defaultAllowedDays;
        listObj.sendTime = value.sendTime;
        convertedRules.push(listObj);
    });

    return convertedRules;
};

export const getTagValues = (data) => {
    return map(data, (x) => +x["value"]);
};
export const getReviewValues = (data) => {
    return map(data, (x) => x["value"]);
};

export const getTextMultiValues = (data) => {
    return map(data, (x) => x["value"]);
};

export const getOperandFromSelectedField = (selectedField) => {
    const separateValues = selectedField.split(DELIMETER);
    return separateValues[1];
};

export const getValidationMessage = (selectedType, columnName) => {
    return selectedType ? VALIDATION_ERRORS[selectedType.toUpperCase()]?.replace("<column name>", columnName) : "";
};

export const isValidValue = (selectedType, value, allowPostiveNumbersOnly) => {
    let isValid = true;
    switch (selectedType) {
        case FIELD_DATA_TYPES.CURRENCY.value: {
            /*eslint-disable*/
            const usdDollarRegex = /^-?(\$|\USD\s{0,1})?(\d+)(\.\d{1,2})?$/;
            const minusZeroRegex = /^-(\$|\USD\s{0,1})?([0]+)(\.[0]{1,2})?$/;
            /*eslint-enable*/

            isValid = usdDollarRegex.test(value) && !minusZeroRegex.test(value);
        }
            break;

        case FIELD_DATA_TYPES.DATE.value: {
            isValid = true;
        }
            break;

        case FIELD_DATA_TYPES.NUMBER.value: {
            /*eslint-disable*/
            const regex = /(^-?|^\+?)[0-9]*$/;
            const minusZeroRegex = /^-(\$|\USD\s{0,1})?([0]+)(\.[0]{1,2})?$/;
            /*eslint-enable*/

            isValid = regex.test(value) && +value >= (allowPostiveNumbersOnly ? 0 : -2147483648) && +value <= 2147483647 && !minusZeroRegex.test(value);
        }
            break;

        case FIELD_DATA_TYPES.YESNO.value: {
            const regexBool = new RegExp("^(true|false|1|0|yes|no|on|off)$");

            isValid = regexBool.test(value);
        }
            break;

        case FIELD_DATA_TYPES.TEXT.value: {
            const regexTxt = /^.{1,512}$/m;

            isValid = regexTxt.test(value);
        }
            break;

        default: {
            isValid = true;
        }
    }

    return isValid;
};

export const isValidDateValue = (condition, value) => {
    let isValid = true;
    switch (condition) {
        case OPERATORS.BETWEEN.value:
        case OPERATORS.BEFORE.value:
        case OPERATORS.AFTER.value:
        case OPERATORS.IS_EQUAL_TO.value:
        case OPERATORS.NOT_BETWEEN.value: {
            if (isEmpty(value)) {
                isValid = false;
            }
        }
            break;
        default: {
            isValid = true;
        }
    }

    return isValid;
};

export const getDateCustomVal = (startDt, endDt, areSame) => {
    let customText = "Dates";

    if (startDt && endDt) {
        const formattedStartDt = getFormattedDate(startDt, "UK");
        const formattedEndDt = getFormattedDate(endDt, "UK");
        customText = areSame ? `${formattedStartDt.slice(0, 6) + ", " + formattedStartDt.slice(8, 12)}` : (`${formattedStartDt.slice(0, 6) + ", " + formattedStartDt.slice(8, 12)} to ${formattedEndDt.slice(0, 6) + ", " + formattedEndDt.slice(8, 12)}`);
    } else if (startDt && !endDt) {
        const formattedStartDt = getFormattedDate(startDt, "UK");
        customText = `${formattedStartDt.slice(0, 6) + ", " + formattedStartDt.slice(8, 12)}`;
    }
    return customText;
};

export const getCurrencyValue = (value) => {
    if (value) {
        const parsedValue = value.toString();

        if (!(parsedValue.indexOf("USD") > -1 || parsedValue.indexOf("$") > -1)) {
            if (+parsedValue >= 0) {
                return "$" + parsedValue;
            } else {
                return "-$" + parsedValue.slice(1);
            }
        } else {
            return parsedValue;
        }
    }
    return value;
};

export const getCurrencySign = (values) => {
    if (values.length) {
        if (values[0].indexOf("$") > -1) {
            return values[0].split("$")[0];
        } else if (values[0].indexOf("USD") > -1) {
            return values[0].split("USD")[0];
        }
    }

    return "";
};

export const convertListToSelectOptions = (list, valueParam, valueToString) => {
    return map(list, (item) => {
        const value = valueParam ? item[valueParam] : item.id;
        return ({
            label: item.name,
            value: valueToString ? value.toString() : value,
            type: item.surveyType
        });
    });
};

export const convertListToSelectOptionsDoctor = (list) => {
    return map(list, (item) => {
        return ({
            label: item.specialistName,
            value: `${item.specialistId}`
        });
    });
};

export const convertListToSelectStatusOptions = (obj) => {
    const statusOptions = [];
    Object.keys(obj).forEach((key, index) => {
        statusOptions.push({
            "label": obj[key].label,
            "value": `${obj[key].value}`,
            "id": index
        });
    });
    return statusOptions;
};

export const convertListToSelectOptionsServices = (list) => {
    return map(list, (item) => {
        return ({
            label: item.service,
            value: `${item.serviceId}`
        });
    });
};

export const convertListToSelectOptionsSecondaryFilterChoices = (list) => {
    return map(list, (item) => {
        return ({
            label: item.title,
            value: `${item.sourceId ? item.sourceId : item.id}`
        });
    });
};

export const showSearch = (options) => {
    let searchOptions;
    if (!(options instanceof Array) && !isEmpty(options) && options.Users && options.Teams) {
        searchOptions = [...options.Users, ...options.Teams];
    } else {
        searchOptions = !isEmpty(options) && [...options];
    }
    return searchOptions.length > 10;
};

export const getReviewFilterCase = (fieldFilters) => {
    let isFbSelected = false;
    let isFbAlone = true;
    let reviewSourceIsAdded = false;

    for (let i = 0; i < fieldFilters.length; i++) {
        if (fieldFilters[i].selectedField.split(DELIMETER)[1] === FIELD_NAME.REVIEW_SOURCE && fieldFilters[i].selectedCondition === OPERATORS.IS_ANY_OF.value) {
            reviewSourceIsAdded = true;
            if (fieldFilters[i].selectedValue.includes("110")) {
                isFbSelected = true;
                if (fieldFilters[i].selectedValue.length > 1) {
                    isFbAlone = false;
                }
            } else if (isFbAlone && fieldFilters[i].selectedValue.length) {
                isFbAlone = false;
            }
        }
    }
    return reviewSourceIsAdded ? isFbSelected ? (isFbAlone ? 2 : 1) : 0 : 1;

};

export const filterSelectedReviewRatings = (fieldFilters, reviewFilterCase) => {
    return fieldFilters.map(field => {
        if (field.selectedField.split(DELIMETER)[1] === FIELD_NAME.REVIEW_RATING) {
            field.selectedValue = filterReviews(field.selectedValue, reviewFilterCase);
        }
        return field;
    });
};

export const getFields = (fieldType, isSecondaryFilter, showBlankOptionsOnly, extraOperatorForAutomation) => {
    switch (fieldType) {
        case "TEXT":
            {
                let operators = [
                    OPERATORS.BLANK,
                    OPERATORS.NOT_BLANK,
                    OPERATORS.EQUALS_TO,
                    OPERATORS.NOT_EQUALS_TO,
                    OPERATORS.IN,
                    OPERATORS.NOT_IN,
                    OPERATORS.STARTS_WITH
                ];
                if (extraOperatorForAutomation) {
                    operators = [
                        OPERATORS.BLANK,
                        OPERATORS.NOT_BLANK,
                        OPERATORS.EQUALS_TO,
                        OPERATORS.NOT_EQUALS_TO,
                        OPERATORS.CONTAINS,
                        OPERATORS.IN,
                        OPERATORS.NOT_IN,
                        OPERATORS.STARTS_WITH,
                        OPERATORS.CONTAINS_ANY_OF,
                        OPERATORS.DOES_NOT_CONTAINS_ANY_OF,
                        OPERATORS.DOES_NOT_CONTAINS,
                        OPERATORS.STARTS_WITH_ANY_OF,
                        OPERATORS.ENDS_WITH_ANY_OF,
                        OPERATORS.DOES_NOT_STARTS_WITH
                    ];
                }
                return {
                    type: FIELD_DATA_TYPES.TEXT.value,
                    operators
                };
            }
        case "NUMBER":
            {
                let operators = [
                    OPERATORS.BLANK,
                    OPERATORS.NOT_BLANK,
                    OPERATORS.EQUALS_TO,
                    OPERATORS.NOT_EQUALS_TO,
                    OPERATORS.GREATER_THAN,
                    OPERATORS.LESS_THAN,
                    OPERATORS.GREATER_THAN_EQUAL_TO,
                    OPERATORS.LESS_THAN_EQUAL_TO
                ];
                if (isSecondaryFilter) {
                    operators.push(OPERATORS.IS_BETWEEN);
                    if (showBlankOptionsOnly) {
                        operators = [
                            OPERATORS.BLANK,
                            OPERATORS.NOT_BLANK
                        ];
                    }
                }
                return {
                    type: FIELD_DATA_TYPES.NUMBER.value,
                    operators
                };
            }
        case "CURRENCY":
            {
                return {
                    type: FIELD_DATA_TYPES.CURRENCY.value,
                    operators: [
                        OPERATORS.BLANK,
                        OPERATORS.NOT_BLANK,
                        OPERATORS.EQUALS_TO,
                        OPERATORS.NOT_EQUALS_TO,
                        OPERATORS.GREATER_THAN,
                        OPERATORS.LESS_THAN,
                        OPERATORS.GREATER_THAN_EQUAL_TO,
                        OPERATORS.LESS_THAN_EQUAL_TO
                    ]
                };
            }
        case "DATE":
            {
                let operators = [
                    OPERATORS.BLANK,
                    OPERATORS.NOT_BLANK,
                    OPERATORS.BETWEEN,
                    OPERATORS.BEFORE,
                    OPERATORS.AFTER
                ];
                if (extraOperatorForAutomation) {
                    operators.push(OPERATORS.IS_EQUAL_TO);
                    operators.push(OPERATORS.NOT_BETWEEN);
                }
                return {
                    type: FIELD_DATA_TYPES.DATE.value,
                    operators
                };
            }
        case "YESNO":
            {
                return {
                    type: FIELD_DATA_TYPES.YESNO.value,
                    operators: [
                        OPERATORS.BLANK,
                        OPERATORS.NOT_BLANK,
                        OPERATORS.EQUALS_TO,
                        OPERATORS.NOT_EQUALS_TO
                    ]
                };
            }
        case "TAGS":
            {
                return {
                    type: FIELD_DATA_TYPES.TAG.value,
                    operators: [
                        OPERATORS.BLANK,
                        OPERATORS.NOT_BLANK,
                        OPERATORS.IN,
                        OPERATORS.NOT_IN
                    ]
                };
            }
        case "TEXT_MULTI":
            {
                return {
                    type: FIELD_DATA_TYPES.TEXT_MULTI.value,
                    operators: [
                        OPERATORS.IS_ANY_OF,
                        OPERATORS.IS_NONE_OF
                    ]
                };
            }
        case "NUMBER_SINGLE":
            {
                return {
                    type: FIELD_DATA_TYPES.NUMBER_SINGLE.value,
                    operators: [
                        OPERATORS.EQUALS_TO,
                        OPERATORS.NOT_EQUALS_TO,
                        OPERATORS.GREATER_THAN,
                        OPERATORS.LESS_THAN,
                        OPERATORS.GREATER_THAN_EQUAL_TO,
                        OPERATORS.LESS_THAN_EQUAL_TO
                    ]
                };
            }
        case "TIME":
            {
                return {
                    type: FIELD_DATA_TYPES.TIME.value,
                    operators: [
                        OPERATORS.BEFORE,
                        OPERATORS.AFTER,
                        OPERATORS.BETWEEN
                    ]
                };
            }

        case "LIST_TEXT":
            {
                return {
                    type: FIELD_DATA_TYPES.LIST_TEXT.value,
                    operators: [
                        OPERATORS.IN,
                        OPERATORS.NOT_IN
                    ]
                };
            }

        case "REVIEW":
            {
                return {
                    type: FIELD_DATA_TYPES.REVIEW.value,
                    operators: [
                        OPERATORS.IN_ANY_OF,
                        OPERATORS.IN_NONE_OF
                    ]
                };
            }
        default:
            return {};
    }
};

export const getFilterOptions = (trigger, filterOptions, optionsViaAPI) => {
    if (trigger == TRIGGER_TYPE.BEFORE_APPOINTMENT_DATE.value || trigger == TRIGGER_TYPE.APPOINTMENT_BOOKED.value || trigger == TRIGGER_TYPE.APPOINTMENT_CANCELED.value || trigger == TRIGGER_TYPE.APPOINTMENT_COMPLETED.value || trigger == TRIGGER_TYPE.APPOINTMENT_MISSED.value) {
        return filterOptions.concat(optionsViaAPI);
    }
    return filterOptions;
};

export const getDefaultAllowedDays = () => {
    return [{
        value: "Sunday",
        label: "Sunday"
    }, {
        value: "Monday",
        label: "Monday"
    }, {
        value: "Tuesday",
        label: "Tuesday"
    }, {
        value: "Wednesday",
        label: "Wednesday"
    }, {
        value: "Thursday",
        label: "Thursday"
    }, {
        value: "Friday",
        label: "Friday"
    }, {
        value: "Saturday",
        label: "Saturday"
    }];
};

export const getCustomTimeOptions = (startTime, endTime) => {
    const st = startTime || 6;
    const et = endTime || 20;
    const timeOptions = [];
    for (let i = st; i <= et; i++) {
        let hrsVal = (`0${i % 12}`).slice(-2);
        hrsVal = hrsVal === "00" ? "12" : hrsVal;
        for (let min = 0; min < 60; min += 30) {
            if (!(i === et && min === 30)) {
                const ampm = i < 12 ? "AM" : "PM";
                const minVal = (`0${min}`).slice(-2);
                const label = `${hrsVal}:${minVal} ${ampm}`;
                timeOptions.push({ label, value: label });
            }
        }
    }
    return timeOptions;
};
export const filterReviews = (reviews, filterReviewCase) => {
    switch (filterReviewCase) {
        case 0: //FB not selected
            return reviews.filter(val => !(["recommended", "non_recommended"].includes(val)));
        case 1: //All selected
            return reviews;
        case 2: //Only FB selected
            return reviews.filter(val => (["recommended", "non_recommended"].includes(val)));
    }
}
export const updateCurrencyValue = (value, forViewStr) => {
    if (value !== undefined) {
        const parsedValue = value.toString();

        if (parsedValue.indexOf("$") > -1) {
            const splittedValues = parsedValue.split("$");
            const numberVal = splittedValues[1];

            return forViewStr ? ((splittedValues[0] + "$") + numberVal) : [splittedValues[0] + "USD", (numberVal.trim()).toString()];
        } else if (parsedValue.indexOf("USD") > -1) {
            const splittedValues = parsedValue.split("USD");
            const numberVal = splittedValues[1];

            return forViewStr ? ((splittedValues[0] + "$") + numberVal) : [splittedValues[0] + "USD", (numberVal.trim()).toString()];
        } else {
            const prepend = +parsedValue >= 0 ? "" : "-";

            return forViewStr ? ((prepend + "$") + (prepend ? parsedValue.slice(1) : parsedValue)) : [prepend + "USD", ((prepend ? parsedValue.slice(1) : parsedValue)).toString().trim()];
        }
    }

    return value;
};
export const getDripTime = (e) => {
    const interval = 30; //minutes interval
    //const times = []; // time array
    let tt = 0; // start time
    e && e.selectedCondition == "before" ? tt = 30 : 0; // AppoIntment Time Filter (Show time from 12:30 AM)
    const ap = ["AM", "PM"]; // AM-PM
    const timeToShow = [];
    let et = (e && e.selectedCondition == "after") ? et = 1410 : 24 * 60; // end time // AppoIntment Time Filter (Show time till 11:00 PM)

    //loop to increment the time and push results in array
    for (let i = 0; tt < et; i++) {
        const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
        let mm = (tt % 60); // getting minutes of the hour in 0-55 format
        const finalAmPm = ap[Math.floor(hh / 12)];

        const hrVal = ("0" + (hh % 12)).slice(-2);
        let minutVal = ("0" + mm).slice(-2);

        // Adding End Time to 11:55 in case of Appointmant Time Between Condition
        if ((e && e.selectedCondition == "between" && hrVal == "11" && finalAmPm === "PM" && minutVal == "30") || (e && e.selectedCondition == "before" && hrVal == "11" && finalAmPm === "PM" && minutVal == "30")) {
            minutVal = "55";
        }
        const label = (hrVal === "00" ? "12" : hrVal) + ":" + minutVal + " " + finalAmPm;  // pushing data in array in [00:00 - 12:00 AM/PM format]
        //remove DND time from dropdown to show from 8AM till 7:30 PM
        if ((hh > 7 && finalAmPm === "AM") || (hh <= 19 && finalAmPm === "PM")) {
            timeToShow.push({
                label,
                value: label
            });
        } else {
            timeToShow.push({
                label,
                value: label
            });
        }
        tt = tt + interval;
    }

    return timeToShow;
};
export const getReviewSource = (business) => {
    let reviewSiteList = getSelectOptions(business.reviewSites, {
        labelKey: "name",
        valueKey: "id"
    });
    return reviewSiteList;
};
export const getStatusType = (isReminder) => {
    const STATUS_TYPE = {
        CONFIRMED: {
            label: "Confirmed",
            value: "confirmed"
        },
        BOOKED: {
            label: "Booked",
            value: "booked"
        },
        CANCELED: {
            label: "Canceled",
            value: "canceled"
        },
        NOSHOW: {
            label: "No-show",
            value: "noshow"
        },
        COMPLETED: {
            label: "Completed",
            value: "completed"
        }
    };

    if (isReminder) {
        return {
            CONFIRMED: {
                label: "Confirmed",
                value: "confirmed"
            },
            BOOKED: {
                label: "Booked",
                value: "booked"
            }
        };
    }

    return STATUS_TYPE;
};