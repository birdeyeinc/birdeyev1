import moment from "moment";
import momentTimezone from "moment-timezone";

export const convertDateToMomentDt = (inputDate, noFormat, enableBusinessTimeZone) => {
    if (noFormat) {
        if (enableBusinessTimeZone) {
            const currentTimeZone = window?.BE?.business?.timeZone || window?.BE?.business?.timezoneId || "America/Los_Angeles";
            return inputDate ? moment(inputDate) : momentTimezone.tz(currentTimeZone);
        } else {
            return inputDate ? moment(inputDate) : moment();
        }
    }
    return inputDate ? moment(inputDate, "MM/DD/YYYY") : moment().format("MM/DD/YYYY");
};
export const formatDateTimeStamp = function (strTimestamp, isShortMonth, isMonthOnly, addComma, dateMonth) {
    let mNames = new Array("January", "February", "March",
        "April", "May", "June", "July", "August", "September",
        "October", "November", "December");
    let d = new Date(strTimestamp);
    let currDate = d.getDate();
    let currMonth = d.getMonth();
    let currYear = d.getFullYear();
    let str = isShortMonth ? `${mNames[currMonth].substr(0, 3)}${!isMonthOnly ? ` ${currDate}` : ""} ${currYear}` : `${mNames[currMonth]} ${currDate} ${currYear}`;
    if (addComma) {
        str = str.slice(0, str.length - 5) + "," + str.slice(str.length - 5);
    }

    if (dateMonth) {
        // E.g. 26 May, 13 Jun
        str = `${currDate} ${mNames[currMonth].substr(0, 3)}`;
    }
    return str;
};
export const getFormattedDate = (date, format) => {
    let formattedDate;
    if (format === 'UK') {
        formattedDate = moment(date).format("MMM DD, YYYY");
    }
    return formattedDate;
};