import { addDays, addMonths, addWeeks, addYears, differenceInDays, endOfDay, endOfMonth, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfWeek, startOfYear, subDays, subMonths } from "date-fns";
import { forEach, isEmpty, toLower } from "lodash";
import { capitalizeFirstLetter } from "utils/index";
import { appConst, comparisonTypes, VISUALIZATIONS_SHORT_CODES } from "./constants";
import moment from "moment";
import { gray30, gray300 } from "sass/js/colors";

const { VERTICAL_BAR_CHART, HORIZONTAL_BAR_CHART, LINE_CHART, AREA_CHART } = VISUALIZATIONS_SHORT_CODES;

export const DATE_RANGE = {
    ALL_TIME: "all_time",
    PAST_7_DAYS: "last_7_days",
    LAST_CALENDAR_WEEK: "last_calendar_week",
    YESTERDAY: "yesterday",
    LAST_30_DAYS: "last_30_days",
    THIS_MONTH: "this_calendar_month",
    LAST_60_DAYS: "last_60_days",
    LAST_90_DAYS: "last_90_days",
    LAST_120_DAYS: "last_120_days",
    LAST_3_MONTHS: "last_3_months",
    LAST_6_MONTHS: "last_6_months",
    LAST_9_MONTHS: "last_9_months",
    LAST_CALENDAR_MONTH: "last_calendar_month",
    THIS_YEAR: "this_calendar_year",
    LAST_12_MONTHS: "last_12_months",
    LAST_CALENDAR_YEAR: "last_calendar_year",
    CUSTOM: "custom",
    THIS_WEEK: "this_calendar_week",
    TODAY: "today",
    TOMORROW: "tomorrow",
    NEXT_CALENDAR_WEEK: "next_calendar_week",
    NEXT_CALENDAR_MONTH: "next_calendar_month",
    NEXT_7_DAYS: "next_7_days",
    NEXT_30_DAYS: "next_30_days",
    NEXT_60_DAYS: "next_60_days",
    NEXT_90_DAYS: "next_90_days",
    NEXT_120_DAYS: "next_120_days",
    NEXT_6_MONTHS: "next_6_months",
    NEXT_12_MONTHS: "next_12_months",
    BEFORE_BIRDEYE: `before_${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`,
    AFTER_BIRDEYE: `after_${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`,
};

export const DATE_RANGE_CUSTOM = {
    PREVIOUS_PERIOD: "previous_period",
    PREVIOUS_MONTH: "previous_month",
    TWO_MONTHS_PREVIOUS: "2_months_previous",
    THREE_MONTHS_PREVIOUS: "3_months_previous",
    SIX_MONTHS_PREVIOUS: "6_months_previous",
    PREVIOUS_YEAR: "previous_year",
    BEFORE_BIRDEYE: `before_${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`,
};

export const endOfToday = endOfDay(new Date()),
    startOfToday = startOfDay(new Date()),
    startOfYesterday = startOfDay(addDays(new Date(), -1)),
    endOfYesterday = endOfDay(addDays(new Date(), -1)),
    startOfTomorrow = startOfDay(addDays(new Date(), 1)),
    endOfTomorrow = endOfDay(addDays(new Date(), 1)),
    startOfLast7Days = startOfDay(addDays(new Date(), -6)),
    startOfLast30Days = startOfDay(addDays(new Date(), -29)),
    endOfNext30Days = startOfDay(addDays(new Date(), 29)),
    startOfThisMonth = startOfMonth(new Date()),
    endOfThisMonth = endOfMonth(new Date()),
    startOfPreviousMonth = startOfMonth(addMonths(new Date(), -1)),
    endOfPreviousMonth = endOfMonth(addMonths(new Date(), -1)),
    startOfPreviousYear = startOfYear(addYears(new Date(), -1)),
    endOfPreviousYear = endOfYear(addYears(new Date(), -1)),
    startsOfLast2Months = startOfDay(addDays(new Date(), -59)),
    startsOfLast3Months = startOfDay(addDays(new Date(), -89)),
    startsOfLast4Months = startOfDay(addDays(new Date(), -119)),
    startOfLast6Months = startOfDay(addMonths(new Date(), -6)),
    startOfLastCalendar9Months = startOfMonth(addMonths(new Date(), -9)),
    startOfLastCalendar6Months = startOfMonth(addMonths(new Date(), -6)),
    startOfLastCalendar3Months = startOfMonth(addMonths(new Date(), -3)),
    startOfLast12Months = startOfDay(addMonths(new Date(), -12)),
    endOfNext2Months = startOfDay(addDays(new Date(), 59)),
    endOfNext3Months = startOfDay(addDays(new Date(), 89)),
    endOfNext4Months = startOfDay(addDays(new Date(), 119)),
    endOfNext6Months = startOfDay(addMonths(new Date(), 6)),
    endOfNext12Months = startOfDay(addMonths(new Date(), 12)),
    endOfNext7Days = startOfDay(addDays(new Date(), 6)),
    startOfThisYear = startOfYear(new Date()),
    allTime = new Date(1972, 0, 1),
    startOfPreviousWeek = startOfWeek(addWeeks(new Date(), -1)),
    endOfPreviousWeek = endOfWeek(addWeeks(new Date(), -1)),
    startOfPreviousCalWeek = startOfWeek(addWeeks(new Date(), -2)),
    endOfPreviousCalWeek = endOfWeek(addWeeks(new Date(), -2)),
    startOfNextWeek = startOfWeek(addWeeks(new Date(), 1)),
    endOfNextWeek = endOfWeek(addWeeks(new Date(), 1)),
    startOfNextMonth = startOfMonth(addMonths(new Date(), 1)),
    endOfNextMonth = endOfMonth(addMonths(new Date(), 1)),
    startOfThisWeek = startOfWeek(new Date()),
    endOfThisWeek = endOfWeek(new Date()),
    startOfBirdeyeContract = startOfDay(new Date(window?.BE?.business?.salesForceInfo?.contractStartDate || window?.BE?.business?.creationDt)),
    endOfBeforeBirdeyeContract = endOfDay(addDays(new Date(window?.BE?.business?.salesForceInfo?.contractStartDate || window?.BE?.business?.creationDt), -1));

export const checkIfCompareFilterIsApplied = (data) => {
    const { actualAndCompareWith = {}, apiData, isDefaultComparisonFilterApplied = false, parserConfig } = data;
    const { disableCompareChart } = parserConfig || {};
    if (disableCompareChart) {
        return false;
    }
    const { actual = {}, compareWith = {}, comparisonType = "" } = actualAndCompareWith || {};
    const isCompareApplied = (!isEmpty(actual) && !isEmpty(compareWith) && comparisonType) || Object.keys(apiData?.summary?.compare || {})?.length > 0 || Object.keys(apiData?.dataPoints?.[0]?.compare || {})?.length > 0;
    return isCompareApplied && !isDefaultComparisonFilterApplied;
};

export const calculateDateRange = (values, notRanges = true, enableFutureDates = false) => {
    const { actual, compareWith = {} } = values || {};
    const { days, months, startDate, endDate, lastMonth, lastYear, week, isFuture, key } = actual || values || {};
    const dateRange = {};

    if (compareWith && Object.keys(compareWith).length && notRanges) {
        const { startDate, endDate, key } = compareWith;
        if (startDate || endDate) {
            dateRange.startDate = startDate ? new Date(startDate) : new Date(1972, 0, 1);
            dateRange.endDate = new Date(endDate);
            dateRange.key = key || DATE_RANGE.CUSTOM;
            return dateRange;
        }
    }
    if (isFuture && enableFutureDates) {
        if (days == "0") {
            // Today
            dateRange.startDate = startOfDay(new Date());
            dateRange.endDate = endOfToday;
            dateRange.key = DATE_RANGE.TODAY;
        } else if (days == "1") {
            // tomorrow
            dateRange.startDate = startOfTomorrow;
            dateRange.endDate = endOfTomorrow;
            dateRange.key = DATE_RANGE.TOMORROW;
        } else if (days) {
            // Next 7 days || Next 30 days || Next 2 months || Next 3 months || Next 4 months
            dateRange.startDate = startOfToday;
            dateRange.endDate = startOfDay(addDays(new Date(), Number(days) - 1));
            dateRange.key = days == "1" ? DATE_RANGE.TOMORROW : days == "7" ? DATE_RANGE.NEXT_7_DAYS : days == "30" ? DATE_RANGE.NEXT_30_DAYS : days == "60" ? DATE_RANGE.NEXT_60_DAYS : days == "90" ? DATE_RANGE.NEXT_90_DAYS : days == "120" ? DATE_RANGE.NEXT_120_DAYS : "";
        } else if (months == "1") {
            // Next calendar month
            dateRange.startDate = startOfNextMonth;
            dateRange.endDate = endOfNextMonth;
            dateRange.key = DATE_RANGE.NEXT_CALENDAR_MONTH;
        } else if (months) {
            // Next 6 months || Next 12 months
            dateRange.startDate = startOfToday;
            dateRange.endDate = startOfDay(addMonths(new Date(), Number(months)));
            dateRange.key = months == "12" ? DATE_RANGE.NEXT_12_MONTHS : DATE_RANGE.NEXT_6_MONTHS;
        } else if (week) {
            dateRange.startDate = startOfNextWeek;
            dateRange.endDate = endOfNextWeek;
            dateRange.key = DATE_RANGE.NEXT_CALENDAR_WEEK;
        } else if (startDate || endDate) {
            // custom
            dateRange.startDate = new Date(startDate);
            dateRange.endDate = new Date(endDate);
            dateRange.key = key || DATE_RANGE.CUSTOM;
        }
        return dateRange;
    }

    if (days == "-1") {
        // Yesterday
        dateRange.startDate = startOfYesterday;
        dateRange.endDate = endOfYesterday;
        dateRange.key = DATE_RANGE.YESTERDAY;
    } else if (days == "0") {
        // Today
        dateRange.startDate = startOfDay(new Date());
        dateRange.endDate = endOfToday;
        dateRange.key = DATE_RANGE.TODAY;
    } else if (days) {
        // Past 7 days || Past 30 days || Past 2 months || Past 3 months || Past 4 months
        dateRange.startDate = startOfDay(addDays(new Date(), -(days - 1)));
        dateRange.endDate = endOfToday;
        dateRange.key = days == "7" ? DATE_RANGE.PAST_7_DAYS : days == "30" ? DATE_RANGE.LAST_30_DAYS : days == "60" ? DATE_RANGE.LAST_60_DAYS : days == "90" ? DATE_RANGE.LAST_90_DAYS : days == "120" ? DATE_RANGE.LAST_120_DAYS : "";
    } else if (months == "-1") {
        // This month
        dateRange.startDate = startOfThisMonth;
        dateRange.endDate = endOfToday;
        dateRange.key = DATE_RANGE.THIS_MONTH;
    } else if (months == "-12") {
        // This year
        dateRange.startDate = startOfThisYear;
        dateRange.endDate = endOfToday;
        dateRange.key = DATE_RANGE.THIS_YEAR;
    } else if (months) {
        // Past 6 months || Past 12 months
        const isContactNPSReport = window.location.href.endsWith("analytics-dash/reports/contacts/contacts-nps/overview");
        const isCustomDateRangeMonths = isContactNPSReport && (months == "3" || months == "6" || months == "9") ? true : false;
        dateRange.startDate = isCustomDateRangeMonths ? startOfMonth(addMonths(new Date(), -months)) : startOfDay(addMonths(new Date(), -months));
        dateRange.endDate = endOfToday;
        dateRange.key = months == "12" ? DATE_RANGE.LAST_12_MONTHS : months == "9" ? DATE_RANGE.LAST_9_MONTHS : months == "3" ? DATE_RANGE.LAST_3_MONTHS : DATE_RANGE.LAST_6_MONTHS;
    } else if (startDate || endDate) {
        // custom
        dateRange.startDate = new Date(startDate);
        dateRange.endDate = new Date(endDate);
        dateRange.key = key || DATE_RANGE.CUSTOM;
    } else if (lastMonth) {
        // last calendar month
        dateRange.startDate = startOfPreviousMonth;
        dateRange.endDate = endOfPreviousMonth;
        dateRange.key = DATE_RANGE.LAST_CALENDAR_MONTH;
    } else if (lastYear) {
        // last calendar year
        dateRange.startDate = startOfPreviousYear;
        dateRange.endDate = endOfPreviousYear;
        dateRange.key = DATE_RANGE.LAST_CALENDAR_YEAR;
    } else if (week == 0) {
        // this week(week=0)
        dateRange.startDate = startOfThisWeek;
        dateRange.endDate = endOfThisWeek;
        dateRange.key = DATE_RANGE.THIS_WEEK;
    } else if (week) {
        // last week(week=-1) || next week(week=1 only for scheduler when enableFutureDates)
        dateRange.startDate = week == "-1" ? startOfPreviousWeek : week == "1" && enableFutureDates ? startOfNextWeek : allTime;
        dateRange.endDate = week == "-1" ? endOfPreviousWeek : week == "1" && enableFutureDates ? endOfNextWeek : endOfToday;
        dateRange.key = week == "-1" ? DATE_RANGE.LAST_CALENDAR_WEEK : week == "1" && enableFutureDates ? DATE_RANGE.NEXT_CALENDAR_WEEK : DATE_RANGE.ALL_TIME;
    } else {
        // all time
        dateRange.startDate = allTime;
        dateRange.endDate = endOfToday;
        dateRange.key = DATE_RANGE.ALL_TIME;
    }

    if (compareWith && Object.keys(compareWith).length && notRanges) {
        const { previous, months: monthsB } = compareWith;
        let previousDays =
            days != undefined ? days : dateRange.key === DATE_RANGE.PAST_7_DAYS ? 7 : dateRange.key === DATE_RANGE.LAST_30_DAYS ? 30 : dateRange.key === DATE_RANGE.LAST_60_DAYS ? 60 : dateRange.key === DATE_RANGE.LAST_90_DAYS ? 90 : dateRange.key === DATE_RANGE.LAST_120_DAYS ? 120 : "";
        const compareMonths = monthsB ? monthsB : months; // After change in second TimePeriodFilter comparison
        let daysInNegative;
        if (compareMonths) {
            // to get number of days for month(s)
            daysInNegative = differenceInDays(dateRange.startDate, dateRange.endDate);
            previousDays = Math.abs(daysInNegative) + 1;
        } else if (startDate || endDate) {
            daysInNegative = differenceInDays(new Date(startDate), new Date(endDate));
            previousDays = Math.abs(daysInNegative) + 1;
        } else if (lastMonth) {
            daysInNegative = differenceInDays(startOfPreviousMonth, endOfPreviousMonth);
            previousDays = Math.abs(daysInNegative) + 1;
        } else if (lastYear) {
            daysInNegative = differenceInDays(startOfPreviousYear, endOfPreviousYear);
            previousDays = Math.abs(daysInNegative) + 1;
        } else if (week == "0") {
            daysInNegative = differenceInDays(startOfPreviousWeek, endOfPreviousWeek);
            previousDays = Math.abs(daysInNegative) + 1;
        } else if (week == "-1") {
            daysInNegative = differenceInDays(startOfPreviousCalWeek, endOfPreviousCalWeek);
            previousDays = Math.abs(daysInNegative) + 1;
        } else if (days == "-1" || days == "0") {
            // Added for Yesterday comparison in default dashboards (BIRD-121597)
            daysInNegative = differenceInDays(dateRange.startDate, dateRange.endDate);
            previousDays = Math.abs(daysInNegative) + 1;
        }

        if (previous) {
            dateRange.startDate = subDays(dateRange.startDate, previousDays);
            dateRange.endDate = subDays(dateRange.endDate, previousDays);
            dateRange.key = DATE_RANGE_CUSTOM.PREVIOUS_PERIOD;
        } else if (months == "-1") {
            dateRange.startDate = startOfMonth(addMonths(new Date(), -monthsB));
            dateRange.endDate = endOfMonth(addMonths(new Date(), -monthsB));
            dateRange.key =
                monthsB == "1" ? DATE_RANGE_CUSTOM.PREVIOUS_MONTH : monthsB == "2" ? DATE_RANGE_CUSTOM.TWO_MONTHS_PREVIOUS : monthsB == "3" ? DATE_RANGE_CUSTOM.THREE_MONTHS_PREVIOUS : monthsB == "6" ? DATE_RANGE_CUSTOM.SIX_MONTHS_PREVIOUS : monthsB == "12" ? DATE_RANGE_CUSTOM.PREVIOUS_YEAR : "";
        } else if (compareMonths) {
            dateRange.startDate = subMonths(dateRange.startDate, compareMonths);
            dateRange.endDate = subMonths(dateRange.endDate, compareMonths);
            dateRange.key =
                compareMonths == "1"
                    ? DATE_RANGE_CUSTOM.PREVIOUS_MONTH
                    : compareMonths == "2"
                    ? DATE_RANGE_CUSTOM.TWO_MONTHS_PREVIOUS
                    : compareMonths == "3"
                    ? DATE_RANGE_CUSTOM.THREE_MONTHS_PREVIOUS
                    : compareMonths == "6"
                    ? DATE_RANGE_CUSTOM.SIX_MONTHS_PREVIOUS
                    : compareMonths == "12"
                    ? DATE_RANGE_CUSTOM.PREVIOUS_YEAR
                    : "";
        }
    }
    if (isFuture && !enableFutureDates) {
        // when moving from a module with future dates enabled to a module with future dates disabled
        dateRange.startDate = allTime;
        dateRange.endDate = endOfToday;
        dateRange.key = DATE_RANGE.ALL_TIME;
        return dateRange;
    }
    return dateRange;
};

export const getMonthDateYear = (start, end, subStr) => {
    const startDay = new Date(start);
    const endDay = new Date(end);
    let startDate = startDay.getDate();
    let endDate = endDay.getDate();
    const startMonth = startDay.toLocaleString("default", { month: "short" }),
        startYear = startDay.getFullYear(),
        endMonth = endDay.toLocaleString("default", { month: "short" }),
        endYear = endDay.getFullYear();
    // showing year (i.e.'23) if start and end year are different + "short" of year.
    if (startYear < new Date().getFullYear() || !subStr) {
        startDate = startDate + (subStr ? " '" + startYear.toString().substring(2) : ", " + startYear);
        endDate = endDate + (subStr ? " '" + endYear.toString().substring(2) : ", " + endYear);
    }
    // if start and end year are same, return start date only.
    if (startMonth + startDate === endMonth + endDate) {
        return startMonth + " " + startDate;
    } else {
        return startMonth + " " + startDate + " - " + endMonth + " " + endDate;
    }
};

export const getOriginalDates = (dateRange) => {
    const { startDate, endDate } = calculateDateRange(dateRange);
    return getMonthDateYear(startDate, endDate, false);
};

export const getLocNameById = function (locId) {
    const bizList = window?.BE?.business.comparableBizList;
    let locName = "";
    forEach(bizList, (item) => {
        if (item["businessId"] == locId) {
            locName = item["businessAlias"] ? item["businessAlias"] : item["businessName"];
            return false;
        }
    });
    return locName;
};

export const getComparisonLabels = (reportsData) => {
    const { actualAndCompareWith = {}, isLightweightPage } = reportsData;
    const { apiData } = reportsData;
    if (isLightweightPage) return;
    if (Object.keys(actualAndCompareWith)?.length) {
        const { comparisonType } = actualAndCompareWith;
        const comparisonLabels = {};
        if (comparisonType === comparisonTypes.TIME_PERIOD) {
            const { actual = {}, compareWith = {} } = actualAndCompareWith;
            const { key: actualKey = "" } = actual;
            const { key: compareWithKey = "" } = compareWith;
            comparisonLabels.actual = !isEmpty(actual) && !isEmpty(actualKey) && actualKey != DATE_RANGE.CUSTOM ? capitalizeFirstLetter(actualKey?.replaceAll("_", " ")) : getOriginalDates(actual);
            comparisonLabels.compareWith = !isEmpty(compareWith) && !isEmpty(compareWithKey) && compareWithKey != DATE_RANGE.CUSTOM ? capitalizeFirstLetter(compareWithKey?.replaceAll("_", " ")) : getOriginalDates(actualAndCompareWith);
        } else if (comparisonType === comparisonTypes.LOCATION) {
            comparisonLabels.actual = getLocNameById(window.BE.business, actualAndCompareWith?.actual?.[0]);
            comparisonLabels.compareWith = getLocNameById(window.BE.business, actualAndCompareWith?.compareWith?.[0]);
        } else if (comparisonType === comparisonTypes.REVIEW) {
            comparisonLabels.actual = "Actual Review";
            comparisonLabels.compareWith = "Compare Review";
        } else if (comparisonType === comparisonTypes.SURVEY) {
            comparisonLabels.actual = apiData?.summary?.actual?.surveyName;
            comparisonLabels.compareWith = apiData?.summary?.compare?.surveyName;
        }
        return comparisonLabels;
    } else {
        return "";
    }
};

export const getTimePeriodLabelForChart = (actualAndCompareWith) => {
    const startPeriod = calculateDateRange(actualAndCompareWith, false);
    const endPeriod = calculateDateRange(actualAndCompareWith, true);
    const startPeriodLabel = getMonthDateYear(startPeriod.startDate, startPeriod.endDate, false);
    const endPeriodLabel = getMonthDateYear(endPeriod.startDate, endPeriod.endDate, false);
    return [startPeriodLabel, endPeriodLabel];
};

export const getCurrentDaysOfQuarter = () => {
    const d = new Date();
    const qEnd = new Date(d);
    qEnd.setMonth(qEnd.getMonth() + 3 - (qEnd.getMonth() % 3), 0);
    return Math.floor(31 * 3 - (qEnd - d) / 8.64e7);
};

export function isSameWeek(currDate, endDate) {
    return moment(currDate).isSame(endDate, "week");
}

export function isSameMonth(currDate, endDate) {
    return moment(currDate).isSame(endDate, "month");
}

export function isSameQuarter(currDate, endDate) {
    return moment(currDate).isSame(endDate, "quarter");
}

export function isSameYear(currDate, endDate) {
    return moment(currDate).isSame(endDate, "year");
}

export const getProjectedData = (currentValue, groupByType, endDate) => {
    const dateObj = new Date(new Date().setHours(0, 0, 0, 0));
    const endDateObj = new Date(endDate);
    let projected = currentValue;

    if (endDateObj.getFullYear() < dateObj.getFullYear()) {
        return 0;
    }

    switch (groupByType) {
        case "week":
            if (isSameWeek(dateObj, endDateObj)) {
                projected = (7 * currentValue) / dateObj.getDay();
            } else {
                projected = 0;
            }
            break;
        case "month":
            if (dateObj.getMonth() <= endDateObj.getMonth() && isSameMonth(dateObj, endDateObj)) {
                projected = (31 * currentValue) / dateObj.getDate();
            } else {
                projected = 0;
            }
            break;
        case "quarter":
            if (dateObj.getMonth() <= endDateObj.getMonth() && isSameMonth(dateObj, endDateObj)) {
                projected = (31 * 3 * currentValue) / getCurrentDaysOfQuarter();
            } else {
                if (dateObj.getMonth() - endDateObj.getMonth() <= 2 && isSameQuarter(dateObj, endDateObj)) {
                    projected = (31 * 3 * currentValue) / getCurrentDaysOfQuarter();
                } else {
                    projected = 0;
                }
            }
            break;
        case "year":
            if (isSameYear(dateObj, endDateObj)) {
                projected = (366 * currentValue) / (dateObj.getMonth() * 31 + dateObj.getDate());
            } else {
                projected = 0;
            }
            break;
        case "day":
            projected = currentValue;
            break;
        default:
            projected = currentValue;
            break;
    }

    return Math.ceil(projected);
};

export function getFormattedLabel(item) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let extraLabel = "";

    if (item?.lastDataAvailableOn) {
        let custLabel = item?.label;
        const stDate = new Date(item?.startDate);
        const lastData = new Date(item?.lastDataAvailableOn);
        const stMonth = stDate?.getMonth();
        const stYear = stDate?.getFullYear();
        const lastMonth = lastData?.getMonth();
        const lastYear = lastData?.getFullYear();
        if (lastYear == stYear) {
            if (stMonth == lastMonth) {
                if (stDate?.getDate() == lastData?.getDate()) {
                    custLabel = `${monthNames[stMonth]} ${stDate?.getDate()}`;
                } else {
                    custLabel = `${monthNames[stMonth]} ${stDate?.getDate()} - ${lastData?.getDate()}`;
                }
            } else {
                custLabel = `${monthNames[stMonth]} ${stDate?.getDate()} - ${monthNames?.[lastMonth]} ${lastData?.getDate()}`;
            }
        } else {
            custLabel = `${monthNames[stMonth]} ${stDate?.getDate()}, ${stDate?.getFullYear()}  - ${monthNames?.[lastMonth]} ${lastData?.getDate()}, ${lastData?.getFullYear()}`;
        }

        extraLabel = `${custLabel}**params**`;
    }
    return extraLabel;
}

export const getDecimaledValue = (val) => {
    if (val === undefined || val === null || val === "") {
        return "";
    } else {
        val = Number(val);
    }
    if (val === 0 || val === 5) {
        return val.toFixed(0);
    } else if (window?.BE?.business?.avgRating === "2") {
        return val.toFixed(2);
    } else {
        return typeof val === "number" ? val?.toFixed(1) : val;
    }
};

export const checkForNullValue = (value) => {
    return value || value == 0 || value == 0.0;
};

export const getRotationDataPointsCount = (isReportOverTime) => {
    return window?.location?.pathname?.indexOf("er-independent-pdf-page") > -1 && isReportOverTime ? 20 : 13;
};

export const getSproutedLabel = (_, reportConfig) => {
    const { apiData, actualAndCompareWith, isLightweightPage } = reportConfig || {};
    const displayBy = apiData?.groupByType;
    const isCompareByDate = actualAndCompareWith?.comparisonType == "daterange";
    const isCompare = actualAndCompareWith?.comparisonType ? true : false;

    _.value = _.value?.toString()?.replaceAll(",", "");
    // Added for Call traffic by time chart in Call AI Insinghts Location drill page
    // to handle the case of data for hourly based
    if (displayBy == "hour") {
        let val;
        if (isCompare && isCompareByDate && _.value.indexOf(`title="`) > 0) {
            const val1 = _.value.split(`title="`)[1].split(`">`)[0];
            const vs = val1?.split(" vs ");
            val = vs[0]?.split(" ");
        } else {
            val = _.value.split(" ");
        }
        const val1 = val?.[0] || "";
        const val2 = val?.[1] || "";
        return `${val1}${_.isFirst || (_.pos + 8) % 12 === 0 ? `****${val2}` : ""}`;
    }
    if (displayBy == "week") {
        //weekly
        if (isCompare && isCompareByDate && isLightweightPage) {
            const val = _.value?.split(`title="`)[1]?.split(`">`)[0];
            const vs = val?.split(" vs ");
            const vs1 = vs?.[0];
            const vs2 = vs?.[1];

            const com1 = vs1?.split(" - ")?.[0];
            const com2 = vs1?.split(" - ")?.[1];

            const fMonth1 = com1?.split(" ")?.[0];
            const fd1 = com1?.split(" ")?.[1];

            const fMonth2 = com2?.split(" ")?.[0];
            const fd2 = com2?.split(" ")?.[1];
            const fYear2 = com2?.split(" ")?.[2];

            const com3 = vs2?.split(" - ")?.[0];
            const com4 = vs2?.split(" - ")?.[1];

            const sMonth1 = com3?.split(" ")?.[0];
            const sd1 = com3?.split(" ")?.[1];

            const sMonth2 = com4?.split(" ")?.[0];
            const sd2 = com4?.split(" ")?.[1];
            const sYear2 = com4?.split(" ")?.[2];

            const str = `${vs2 ? `${sMonth1 + " " + sd1} - ${(sMonth1 !== sMonth2 ? sMonth2 + " " : "") + sd2 + (_.isFirst || (sMonth1 == "Jan" && (sd1 == "1" || sd1 == "01")) ? " " + sYear2 : "")}` : ""} 
            ${vs2 ? " vs****" : ""} ${fMonth1 + " " + fd1} - ${(fMonth1 !== fMonth2 ? fMonth2 + " " : "") + fd2 + (_.isFirst || (fMonth1 == "Jan" && (fd1 == "1" || fd1 == "01")) ? " " + fYear2 : "")}`;

            return str;
        }
        let val;
        if ((isCompare && isCompareByDate && _.value.indexOf(`title="`) > 0) || _.value.indexOf(`title="`) > 0) {
            const val1 = _.value?.split(`title="`)[1]?.split(`">`)[0];
            const vs = val1?.split(" vs ");
            val = vs?.[0]?.split(" - ");
        } else {
            val = _.value?.split(" - ");
        }
        const fMonth = val[0]?.split(" ")?.[0];
        const fDate = val[0]?.split(" ")?.[1];
        const sMonth = val[1]?.split(" ")?.[0];
        const sDate = val[1]?.split(" ")?.[1];
        const sYear = val[1]?.split(" ")?.[2];
        const str = `${fDate} - ${sDate}****${_.isFirst || parseInt(fDate) < 8 || parseInt(sDate) > 29 || parseInt(fDate) > 28 || parseInt(sDate) < 7 ? `${parseInt(fDate) > parseInt(sDate) ? fMonth : sMonth}` : ""}****${
            _.isFirst || (parseInt(fDate) < 7 && fMonth == "Jan") ? `${sYear?.split("'")?.[1] ? "20" + sYear?.split("'")?.[1] : sYear}` : ""
        }`;
        return str;
    } else if (displayBy == "day") {
        //daily
        if (isCompare && isCompareByDate && isLightweightPage) {
            const val = _.value?.split(`title="`)[1].split(`">`)?.[0];
            const vs = val?.split(" vs ");
            const vs1 = vs[0]?.split(" ");
            const vs2 = vs[1]?.split(" ");

            const str = `${
                vs2
                    ? `${vs2?.[0] + " " + vs2?.[1] + (_.isFirst || vs2?.[1] == 1 ? " " + vs2?.[2] : "")} 
                ${vs2 ? ` vs****` : ""}`
                    : ""
            } ${vs1?.[0] + " " + vs1?.[1] + (_.isFirst || vs1?.[1] == 1 ? " " + vs1?.[2] : "")}`;
            return str;
        }
        let val;
        if ((isCompare && isCompareByDate && _.value.indexOf(`title="`) > 0) || _.value.indexOf(`title="`) > 0) {
            const val1 = _.value?.split(`title="`)[1].split(`">`)?.[0];
            const vs = val1?.split(" vs ");
            val = vs[0]?.split(" ");
        } else {
            val = _.value?.split(" ");
        }
        const str = `${val?.[1]}****${val?.[1] == 1 || val?.[1] == "01" || _.isFirst ? `${val?.[0]}` : ""}****${val?.[1] == 1 || val?.[1] == "01" || _.isFirst ? `${val?.[2].split("'")?.[1] ? "20" + val?.[2].split("'")?.[1] : val?.[2]}` : ""}`;
        return str;
    } else if (displayBy == "month") {
        //monthly
        if (isCompare && isCompareByDate && isLightweightPage) {
            const val = _.value.split(`title="`)[1].split(`">`)[0];
            const vs = val?.split(" vs ");
            const vs1 = vs[0]?.split(" ");
            const vs2 = vs[1]?.split(" ");

            const str = `${
                vs2
                    ? `${vs2?.[0] + (_.isFirst || (vs1?.[0] == "Dec" && vs2?.[0] == "Jan") ? " " + vs2?.[1] : "")} 
                ${vs2 ? ` vs****` : ""}`
                    : ""
            } ${vs1?.[0] + (_.isFirst || (vs1?.[0] == "Dec" && vs2?.[0] == "Jan") ? " " + vs1?.[1] : "")}`;
            return str;
        }
        let val;
        if ((isCompare && isCompareByDate && _.value.indexOf(`title="`) > 0) || _.value.indexOf(`title="`) > 0) {
            const val1 = _.value.split(`title="`)[1].split(`">`)[0];
            const vs = val1?.split(" vs ");
            val = vs[0]?.split(" ");
        } else {
            val = _.value.split(" ");
        }
        const str = `${val?.[0]}****${_.isFirst || val?.[0] == "Jan" ? `${val?.[1]?.split("'")?.[1] ? "20" + val?.[1]?.split("'")?.[1] : val?.[1]}` : ""}`;
        return str;
    } else if (displayBy == "quarter") {
        //quarter
        if (isCompare && isCompareByDate && isLightweightPage) {
            const val = _.value.split(`title="`)[1].split(`">`)[0];
            const vs = val?.split(" vs ");
            const vs1 = vs[0]?.split(" ");
            const vs2 = vs[1]?.split(" ");

            const str = `${
                vs2
                    ? `${vs2?.[0] + (_.isFirst || (vs1?.[0] == "Q4" && vs2?.[0] == "Q1") ? " " + vs2?.[1] : "")} 
                ${vs2 ? ` vs****` : ""}`
                    : ""
            } ${vs1?.[0] + (_.isFirst || (vs1?.[0] == "Q4" && vs2?.[0] == "Q1") ? " " + vs1?.[1] : "")}`;
            return str;
        }
        let val;
        if ((isCompare && isCompareByDate && _.value.indexOf(`title="`) > 0) || _.value.indexOf(`title="`) > 0) {
            const val1 = _.value.split(`title="`)[1].split(`">`)?.[0];
            const vs = val1?.split(" vs ");
            val = vs[0]?.split(" ");
        } else {
            val = _.value?.split(" ");
        }
        const str = `${val?.[0]}****${_.isFirst || val?.[0] == "Q1" ? `${val?.[1]}` : ""}`;
        return str;
    } else if (displayBy == "year") {
        //year
        if (isCompare && isCompareByDate && isLightweightPage) {
            const val = _.value.split(`title="`)[1].split(`">`)?.[0];
            const vs = val?.split(" vs ");

            const str = `${vs?.[1] ? `${vs?.[1]}` : ""} ${vs?.[1] ? ` vs****` : ""} ${vs?.[0]}`;
            return str;
        }
        let val;
        if ((isCompare && isCompareByDate && _.value?.indexOf(`title="`) > 0) || _.value.indexOf(`title="`) > 0) {
            const val1 = _.value?.split(`title="`)[1].split(`">`)?.[0];
            const vs = val1?.split(" vs ");
            val = vs?.[0];
        } else {
            val = _.value;
        }
        const str = `${val}`;
        return str;
    }
};

export const extractSpanContent = (htmlString) => {
    const match = htmlString.match(/<span[^>]*>(.*?)<\/span>/);
    if (match && match?.[1]?.includes(" vs ")) {
        const newContent = match[1].split(" vs ").reverse().join(" vs ");
        return `<span title=${newContent}>${newContent}</span>`;
    }
    return htmlString;
};

export const getTimeLabelFormatter = (data, groupByType) => {
    let label;
    switch (groupByType) {
        case appConst.DAY:
            label = data.value;
            break;
        case appConst.WEEK:
            label = data.value;
            break;
        case appConst.MONTH: {
            label = data.value;
            break;
        }
        case appConst.QUARTER:
            label = data.value;
            break;
        case appConst.YEAR:
            label = data.value;
            break;
        default:
            label = data.value;
    }
    return label;
};

export function calculatePercentageChange(actulValue, compareValue) {
    if (actulValue === 0 && compareValue === 0) {
        return 0;
    }
    if (actulValue !== 0 && compareValue === 0) {
        return actulValue > 0 ? 100 : -100;
    }
    if (actulValue === 0 && compareValue !== 0) {
        return compareValue > 0 ? -100 : 100;
    }
    const percentageChange = ((actulValue - compareValue) / Math.abs(compareValue)) * 100;
    return percentageChange;
}

const getMax = (params) => {
    if (params) {
        if (params.max === 0 || params.max === 0.0) {
            return 100;
        } else if (params.max) {
            return params.max;
        } else {
            return null;
        }
    } else {
        return null;
    }
};

const getDualAxisDimensions = (topGraphHeight, bottomGraphHeight, spacing) => {
    return [
        {
            height: bottomGraphHeight + "%",
            top: topGraphHeight + spacing + "%",
            width: bottomGraphHeight + "%",
        },
        {
            height: topGraphHeight + "%",
            left: bottomGraphHeight + spacing + "%",
            width: topGraphHeight + "%",
        },
    ];
};

export const yAxisCountOptions = (params) => {
    const extraParams = {};
    // extraParams is added for hide and show the yaxis label , horizontal grid lines and their colour
    // https://birdeye.atlassian.net/browse/BIRD-64659
    const { gridLineWidth, gridLineColor, visible, labels } = params;
    if (visible == true || visible == false) {
        extraParams["visible"] = visible;
    }
    if (gridLineWidth >= 0) {
        extraParams["gridLineWidth"] = gridLineWidth;
    }
    if (gridLineColor) {
        extraParams["gridLineColor"] = gridLineColor;
    } else {
        extraParams["gridLineColor"] = gray30;
    }
    if (labels) {
        extraParams["labels"] = labels;
    }
    return [
        {
            // Primary yAxis
            min: params?.min || 0,
            max: getMax(params),
            title: {
                text: params && params.text ? params.text : "",
                x: -15,
                // Y axis title truncation fix
                y: -2,
                margin: 5,
                style: {
                    color: gray300,
                    fontSize: "12px",
                },
                useHTML: params?.useHTML || false,
            },
            tickAmount: params?.tickAmount,
            allowDecimals: false,
            labels: {
                style: {
                    color: gray300,
                    fontSize: "12px",
                },
                formatter() {
                    return this.value ? this.value.toLocaleString("en") : this.value;
                },
            },
            ...extraParams,
        },
    ];
};

export const yAxisCountOptionsBoth = (params) => {
    const graphDimensions = getDualAxisDimensions(35, 55, 10);
    return [
        {
            // Primary yAxis
            min: 0,
            opposite: false,
            offset: 1,
            top: params?.chartStyle == VERTICAL_BAR_CHART || ((params?.chartStyle == LINE_CHART || params?.chartStyle == AREA_CHART) && !params?.inverted) ? graphDimensions[0]?.top : undefined,
            height: params?.chartStyle == VERTICAL_BAR_CHART || ((params?.chartStyle == LINE_CHART || params?.chartStyle == AREA_CHART) && !params?.inverted) ? graphDimensions[0]?.height : undefined,
            width: params?.chartStyle == HORIZONTAL_BAR_CHART || ((params?.chartStyle == LINE_CHART || params?.chartStyle == AREA_CHART) && params?.inverted) ? graphDimensions[0]?.width : undefined,
            tickInterval: params && params.tickInterval ? params.tickInterval : null,
            max: getMax(params),
            title: {
                enabled: params && params.title && params.title.enabledY != undefined ? params.title.enabledY : true,
                text: params && params.textY ? params.textY : "",
                x: -15,
                margin: 5,
                style: {
                    color: params && params.color ? params.color : gray300,
                    fontSize: "12px",
                },
            },
            tickAmount: params?.tickAmount,
            labels: {
                style: {
                    color: params && params.color ? params.color : gray300,
                    fontSize: "12px",
                },
            },
            allowDecimals: false,
            gridLineColor: gray30,
            alignTicks: false,
            gridLineWidth: params && (params.gridLineWidth || params.gridLineWidth == 0) ? params.gridLineWidth : 1,
        },
        {
            // Secondary yAxis
            alignTicks: false,
            opposite: false,
            height: params?.chartStyle == VERTICAL_BAR_CHART || ((params?.chartStyle == LINE_CHART || params?.chartStyle == AREA_CHART) && !params?.inverted) ? graphDimensions[1]?.height : undefined,
            width: params?.chartStyle == HORIZONTAL_BAR_CHART || ((params?.chartStyle == LINE_CHART || params?.chartStyle == AREA_CHART) && params?.inverted) ? graphDimensions[1]?.width : undefined,
            left: params?.chartStyle == HORIZONTAL_BAR_CHART || ((params?.chartStyle == LINE_CHART || params?.chartStyle == AREA_CHART) && params?.inverted) ? graphDimensions[1]?.left : undefined,
            offset: 1,
            min: params && (params.oppositeYmin || params.oppositeYmin == 0) ? params.oppositeYmin : -100,
            max: params && params.oppositeYmax ? params.oppositeYmax : 100,
            tickInterval: params && params.oppositetickInterval ? params.oppositetickInterval : null,
            title: {
                enabled: params && params.title && params.title.enabledY1 != undefined ? params.title.enabledY1 : true,
                text: params && params.textY1 ? params.textY1 : "",
                x: 15,
                margin: 5,
                style: {
                    color: params && params.color ? params.color : gray300,
                    fontSize: "12px",
                },
            },
            tickAmount: params?.tickAmount,
            labels: {
                style: {
                    color: params && params.color ? params.color : gray300,
                    fontSize: "12px",
                },
            },
            // opposite: true,
            gridLineColor: gray30,
            allowDecimals: false,
            gridLineWidth: params && (params.gridLineWidthYOpposite || params.gridLineWidthYOpposite == 0) ? params.gridLineWidthYOpposite : 1,
        },
    ];
};

export const getMaxValueForYAxis = (reportConfig, disabledSeries) => {
    const { parserConfig, apiData } = reportConfig || {};
    const { yAxisCustomMax, doubleYaxis, dataFormat, isMultipleKeyValue } = parserConfig || {};
    const isCompare = checkIfCompareFilterIsApplied(reportConfig);

    // Merge disabled series from props and data
    if (reportConfig?.disabledSeries?.length) {
        disabledSeries = Array.from(new Set([...disabledSeries, ...reportConfig.disabledSeries]));
    }

    // Helper to filter enabled series
    const filterSeries = (series) => (disabledSeries?.length ? series.filter((item) => !disabledSeries.includes(item.name)) : series);

    // Helper to get max from array of numbers
    const getMax = (arr) => (arr.length ? Math.max(...arr) : 0);

    let max1 = 0,
        max2 = 0;

    // Double Y axis logic
    if (doubleYaxis && parserConfig?.dataPoints) {
        const seriesDetails = filterSeries(parserConfig?.seriesDetails || []);
        const dataPoints = apiData.dataPoints || [];
        const keys = seriesDetails.map((s) => s.dataKey);

        const maxArr1 = [],
            maxArr2 = [];
        dataPoints.forEach((item) => {
            keys.forEach((key, idx) => {
                const val = item.actual?.[key] || 0;
                if (idx === 0) maxArr1.push(val);
                if (idx === 1) maxArr2.push(val);
            });
        });

        max1 = getMax(maxArr1);
        max2 = getMax(maxArr2);

        if (isCompare) {
            const compareArr1 = [],
                compareArr2 = [];
            dataPoints.forEach((item) => {
                keys.forEach((key, idx) => {
                    const val = item.compare?.[key] || 0;
                    if (idx === 0) compareArr1.push(val);
                    if (idx === 1) compareArr2.push(val);
                });
            });
            max1 = Math.max(max1, getMax(compareArr1));
            max2 = Math.max(max2, getMax(compareArr2));
        }

        return yAxisCustomMax ? yAxisCustomMax(max1, max2, seriesDetails, isCompare) : { max1, max2 };
    }

    // Single Y axis logic with dataFormat switch
    if (parserConfig?.dataPoints) {
        const seriesDetails = filterSeries(parserConfig.seriesDetails || []);
        const dataPoints = apiData.dataPoints || [];
        const keys = seriesDetails.map((s) => s.dataKey);
        const subKeys = seriesDetails.map((s) => s.subDataKey);

        switch (dataFormat) {
            case "arrayWithKeyValue": {
                const maxArr = [];
                dataPoints.forEach((item) => {
                    keys.forEach((key) => {
                        if (isMultipleKeyValue) {
                            if (subKeys?.length) {
                                subKeys.forEach((sKey) => {
                                    maxArr.push(item.actual?.[key]?.[sKey] || 0);
                                });
                            } else {
                                maxArr.push(item.actual?.[key] || 0);
                            }
                        } else {
                            maxArr.push(item.actual?.[key] || 0);
                        }
                    });
                });
                max1 = getMax(maxArr);

                if (isCompare) {
                    const compareArr = [];
                    dataPoints.forEach((item) => {
                        keys.forEach((key) => {
                            if (isMultipleKeyValue) {
                                if (subKeys?.length) {
                                    subKeys.forEach((sKey) => {
                                        compareArr.push(item.actual?.[key]?.[sKey] || 0);
                                    });
                                } else {
                                    compareArr.push(item.actual?.[key] || 0);
                                }
                            } else {
                                compareArr.push(item.actual?.[key] || 0);
                            }
                        });
                    });
                    max1 = Math.max(max1, getMax(compareArr));
                }
                break;
            }
            case "arrayWithGrouped": {
                const maxArr = [];
                dataPoints.forEach((item) => {
                    const grouped = item.actual?.[parserConfig.categoryKey] || {};
                    Object.values(grouped).forEach((val) => {
                        maxArr.push(typeof val === "object" ? val[parserConfig.dataPointsValueKey] || 0 : val || 0);
                    });
                });
                max1 = getMax(maxArr);

                if (isCompare) {
                    const compareArr = [];
                    dataPoints.forEach((item) => {
                        const grouped = item.compare?.[parserConfig.categoryKey] || {};
                        Object.values(grouped).forEach((val) => {
                            compareArr.push(typeof val === "object" ? val[parserConfig.dataPointsValueKey] || 0 : val || 0);
                        });
                    });
                    max1 = Math.max(max1, getMax(compareArr));
                }
                break;
            }
            case "groupedArrayWithKeyValue": {
                const subKey = parserConfig.selectedDisplayValueAs;
                const dataKey = seriesDetails[0]?.dataKey;
                const maxArr = [];
                dataPoints.forEach((item) => {
                    maxArr.push(item.actual?.[dataKey]?.[subKey] || 0);
                });
                max1 = getMax(maxArr);

                if (isCompare) {
                    const compareArr = [];
                    dataPoints.forEach((item) => {
                        compareArr.push(item.compare?.[dataKey]?.[subKey] || 0);
                    });
                    max1 = Math.max(max1, getMax(compareArr));
                }
                break;
            }
            default: {
                // fallback for other formats
                dataPoints.forEach((item) => {
                    keys.forEach((key) => {
                        max1 = Math.max(max1, item.actual?.[key] || 0);
                    });
                });
                if (isCompare) {
                    dataPoints.forEach((item) => {
                        keys.forEach((key) => {
                            max1 = Math.max(max1, item.compare?.[key] || 0);
                        });
                    });
                }
            }
        }

        return yAxisCustomMax ? yAxisCustomMax(max1, null, seriesDetails, isCompare) : { max1, max2: null };
    }

    // Grouped dataFormat logic
    if (parserConfig.dataFormat === "grouped") {
        const dataObj = apiData.dataPoints[0]?.actual?.[parserConfig.categoryKey] || {};
        const categoryList = parserConfig.categoryList || [];
        const maxArr = [];
        categoryList.forEach((key) => {
            const val = parserConfig.selectedDisplayValueAs ? dataObj?.[key]?.[parserConfig.seriesDetails[0].dataKey]?.[parserConfig.selectedDisplayValueAs] : dataObj?.[key]?.total || dataObj?.[key] || 0;
            maxArr.push(val || 0);
        });
        max1 = getMax(maxArr);

        if (isCompare && apiData.dataPoints[0]?.compare) {
            const compareObj = apiData.dataPoints[0]?.compare?.[parserConfig.categoryKey] || {};
            const compareArr = [];
            categoryList.forEach((key) => {
                const val = parserConfig.selectedDisplayValueAs ? compareObj?.[key]?.[parserConfig.seriesDetails[0].dataKey]?.[parserConfig.selectedDisplayValueAs] : compareObj?.[key]?.total || compareObj?.[key] || 0;
                compareArr.push(val || 0);
            });
            console.log("compareArr", compareArr);
            max1 = Math.max(max1, getMax(compareArr));
        }
        console.log("🚀 ~ getMaxValueForYAxis ~ max1:", max1);
        max1 += Math.ceil((max1 / 100) * 10); // Add 10% buffer
        return { max1, max2: null };
    }

    // Fallback
    return { max1: 0, max2: null };
};

export const numberWithCommas = (a) => {
    if (a) {
        return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return a;
};

export const formatNumberToUnits = (number, showLower, fixFloatOperations) => {
    if (number >= 1e3 && number <= 1e15) {
        const units = ["K", "M", "B", "T"];

        // Divide to get Unit style numbers (1e3,1e6,1e9, etc)
        const unit = Math.floor((number.toFixed(0).length - 1) / 3) * 3;
        const num = (number / ("1e" + unit)).toFixed(1).replace(/\.0+$/, "");

        const unitname = units[Math.floor(unit / 3) - 1];
        // return num + unitname;
        return `${num}${showLower ? toLower(unitname) : unitname}`;
    }
    // new param --> fixFloatOperations --> Introduced to fix floating math operations
    // To fix issue like --> 0.1 + 0.2 --> 0.30000000000000004
    if (fixFloatOperations) {
        return numberWithCommas(Math.round(number * 1e12) / 1e12);
    }
    return numberWithCommas(number);
};

export const formatTimeToUnits = (value, showDashForEmptyResponse = false) => {
    if (showDashForEmptyResponse && value === undefined) {
        return "-";
    }
    const units = [
        { label: "d", value: 24 * 60 * 60 },
        { label: "h", value: 60 * 60 },
        { label: "m", value: 60 },
        { label: "s", value: 1 },
    ];

    let seconds = Math.round(value);

    return (
        units
            .reduce((result, { label, value }) => {
                if (result.length < 2 && seconds >= value) {
                    const amount = Math.floor(seconds / value);
                    seconds %= value;
                    result.push(`${amount}${label}`);
                }
                return result;
            }, [])
            .join(" ") || "0s"
    );
};

export const getSentimentClass = (rowData) => {
    const score = (rowData?.sentiment?.score || rowData?.sentiment?.score == 0) || rowData;
    if (score >= 0 && score <= 45) {
        return "negative";
    } else if (score > 45 && score < 75 ) {
        return "neutral";
    } else {
        return "positive";
    }
};