import { map} from "lodash";
import { Const } from "./constants";

const getValidationRegex = function (data) {
    const { validCheckType, name, minimum, maximum } = data;

    switch (validCheckType) {
        case Const.EMPTY:
            return {
                regex: /.+/gm,
                msg: name + " field is required."
            };

        case Const.MIN_MAX:
            return {
                regex: new RegExp(`^[\\S\\s]{${minimum},${maximum}}$`, "g"),
                msg: name + " should be in between " + minimum + " and " + maximum + " characters."
            };

        case Const.EMPTY_OR_VALID_URL:
            return {
                //eslint-disable-next-line
                regex: /^(|(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,})?(\/.*)?)$/gm,
                msg: "The URL format you have entered is incorrect"
            };

        case Const.EMPTY_OR_VALID_URL_OR_TELEPHONE:
            return {
                //eslint-disable-next-line
                regex: /^(|tel:.*|(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)$/gm,
                msg: "The URL format you have entered is incorrect"
            };
        //update regex for fix  BIRDEYE-81793
        case Const.VALID_URL:
            return {
                //eslint-disable-next-line
                regex: /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,9}(:[0-9]{1,5})?(\/.*)?$/gm,
                msg: "The URL format you have entered is incorrect"
            };

        case Const.VALID_URL_OR_TOKEN:
            return {
                //eslint-disable-next-line
                regex: /\[.*?\]|(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,9}(:[0-9]{1,5})?(\/.*)?/g,
                msg: "The URL format you have entered is incorrect"
            };

        case Const.VALID_ANALYTICS:
            return {
                regex: /^ua-\d{4,9}-\d{1,4}$/i,
                msg: "Please enter a valid Tracking ID"
            };
    }
};

const getMinMaxValues = function (data) {
    const {
        type,
        min,
        max
    } = data;

    let minimum, maximum;

    switch (type) {
        case Const.HEADING:
        case Const.SUBJECT:
            minimum = min !== undefined ? min : 2;
            maximum = max !== undefined ? max : 130;

            break;

        case Const.MESSAGE:
            minimum = min !== undefined ? min : 5;
            maximum = max !== undefined ? max : 2030;

            break;
    }

    return {
        minimum,
        maximum
    };
};


export const getValidations = function (data) {
    const {
        validChecks,
        type,
        name,
        min,
        max
    } = data;

    let validations = {};

    map(validChecks, function (validCheckType) {
        const { minimum, maximum } = getMinMaxValues({
            type,
            min,
            max
        });

        validations[validCheckType] = getValidationRegex({ validCheckType, name, minimum, maximum });
    });

    return validations;
};