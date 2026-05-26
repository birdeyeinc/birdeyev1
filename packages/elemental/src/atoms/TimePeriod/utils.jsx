import React from "react";
import { startOfDay, addDays, endOfDay, addMonths, startOfMonth, endOfMonth, startOfYear, format, differenceInDays, subDays, subMonths, addYears, endOfYear, startOfWeek, endOfWeek, addWeeks, isFuture, startOfQuarter, endOfQuarter, addQuarters } from "date-fns";

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
    LAST_CALENDAR_QUARTER: "last_calendar_quarter",
    THIS_YEAR: "this_calendar_year",
    LAST_12_MONTHS: "last_12_months",
    LAST_24_MONTHS: "last_24_months",
    LAST_CALENDAR_YEAR: "last_calendar_year",
    CUSTOM: "custom",
    THIS_WEEK: "this_calendar_week",
    THIS_QUARTER: "this_calendar_quarter",
    TODAY: "today",
    TOMORROW: "tomorrow",
    NEXT_CALENDAR_WEEK: "next_calendar_week",
    NEXT_CALENDAR_MONTH : "next_calendar_month",
    NEXT_7_DAYS: "next_7_days",
    NEXT_30_DAYS: "next_30_days",                           
    NEXT_60_DAYS: "next_60_days",
    NEXT_90_DAYS: "next_90_days",
    NEXT_120_DAYS: "next_120_days",
    NEXT_6_MONTHS: "next_6_months",
    NEXT_12_MONTHS: "next_12_months",
    BEFORE_BIRDEYE: `before_${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`,
    AFTER_BIRDEYE: `after_${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`
};

export const DATE_RANGE_CUSTOM = {
    PREVIOUS_PERIOD: "previous_period",
    PREVIOUS_MONTH: "previous_month",
    TWO_MONTHS_PREVIOUS: "2_months_previous",
    THREE_MONTHS_PREVIOUS: "3_months_previous",
    SIX_MONTHS_PREVIOUS: "6_months_previous",
    PREVIOUS_YEAR: "previous_year",
    BEFORE_BIRDEYE: `before_${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`
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
    startOfThisQuarter = startOfQuarter(new Date()),
    endOfThisQuarter = endOfQuarter(new Date()),
    startOfPreviousMonth = startOfMonth(addMonths(new Date(), -1)),
    endOfPreviousMonth = endOfMonth(addMonths(new Date(), -1)),
    startOfPreviousQuarter = startOfQuarter(addQuarters(new Date(), -1)),
    endOfPreviousQuarter = endOfQuarter(addQuarters(new Date(), -1)),
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
    startOfLast24Months = startOfDay(addMonths(new Date(), -24)),
    endOfNext2Months = startOfDay(addDays(new Date(), 59)),
    endOfNext3Months = startOfDay(addDays(new Date(), 89)),
    endOfNext4Months = startOfDay(addDays(new Date(), 119)),
    endOfNext6Months = startOfDay(addMonths(new Date(), 6)),
    endOfNext12Months = startOfDay(addMonths(new Date(), 12)),
    endOfNext7Days = startOfDay(addDays(new Date(), 6)),
    startOfThisYear = startOfYear(new Date()),
    allTime = new Date(2000, 0, 1),
    minDate = new Date(2000, 0, 1),
    startOfPreviousWeek = startOfWeek(addWeeks(new Date(), -1), {weekStartsOn: 1}),
    endOfPreviousWeek = endOfWeek(addWeeks(new Date(), -1), {weekStartsOn: 1}),
    startOfPreviousCalWeek = startOfWeek(addWeeks(new Date(), -2), {weekStartsOn: 1}),
    endOfPreviousCalWeek = endOfWeek(addWeeks(new Date(), -2), {weekStartsOn: 1}),
    startOfNextWeek = startOfWeek(addWeeks(new Date(), 1), {weekStartsOn: 1}),
    endOfNextWeek = endOfWeek(addWeeks(new Date(), 1), {weekStartsOn: 1}),
    startOfNextMonth = startOfMonth(addMonths(new Date(), 1)),
    endOfNextMonth = endOfMonth(addMonths(new Date(), 1)),
    startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 }),
    startOfBirdeyeContract = startOfDay(new Date(window?.BE?.business?.salesForceInfo?.contractStartDate || window?.BE?.business?.creationDt)),
    endOfBeforeBirdeyeContract = endOfDay(addDays(new Date(window?.BE?.business?.salesForceInfo?.contractStartDate || window?.BE?.business?.creationDt), -1));

export const calculateDateRange = (values, notRanges = true, enableFutureDates = false) => {
    const { actual, compareWith = {} } = values || {};
    const { days, quarter, months, startDate, endDate, lastMonth, lastYear, week, isFuture, key } = actual || values || {};
    let dateRange = {};

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
        if (days == "0") { // Today
            dateRange.startDate = startOfDay(new Date());
            dateRange.endDate = endOfToday;
            dateRange.key = DATE_RANGE.TODAY;
        } else if (days == "1") { // tomorrow
            dateRange.startDate = startOfTomorrow;
            dateRange.endDate = endOfTomorrow;
            dateRange.key = DATE_RANGE.TOMORROW;
        } else if (days) { // Next 7 days || Next 30 days || Next 2 months || Next 3 months || Next 4 months
            dateRange.startDate = startOfToday;
            dateRange.endDate = startOfDay(addDays(new Date(), Number(days) - 1));
            dateRange.key = days == "1" ? DATE_RANGE.TOMORROW : days == "7" ? DATE_RANGE.NEXT_7_DAYS : days == "30" ? DATE_RANGE.NEXT_30_DAYS : days == "60" ? DATE_RANGE.NEXT_60_DAYS : days == "90" ? DATE_RANGE.NEXT_90_DAYS : days == "120" ? DATE_RANGE.NEXT_120_DAYS : "";
        } else if (months == "1") { // Next calendar month
            dateRange.startDate = startOfNextMonth;
            dateRange.endDate = endOfNextMonth;
            dateRange.key = DATE_RANGE.NEXT_CALENDAR_MONTH;
        } else if (months) { // Next 6 months || Next 12 months
            dateRange.startDate = startOfToday;
            dateRange.endDate = startOfDay(addMonths(new Date(), Number(months)));
            dateRange.key = months == "12" ? DATE_RANGE.NEXT_12_MONTHS : DATE_RANGE.NEXT_6_MONTHS;
        } else if (week) {
            dateRange.startDate = startOfNextWeek;
            dateRange.endDate = endOfNextWeek;
            dateRange.key = DATE_RANGE.NEXT_CALENDAR_WEEK;
        } else if (startDate || endDate) { // custom
            dateRange.startDate = new Date(startDate);
            dateRange.endDate = new Date(endDate);
            dateRange.key = key || DATE_RANGE.CUSTOM;
        }
        return dateRange;
    }
    
    if (days == "-1") { // Yesterday
        dateRange.startDate = startOfYesterday;
        dateRange.endDate = endOfYesterday;
        dateRange.key = DATE_RANGE.YESTERDAY;
    } else if (days == "0") { // Today
        dateRange.startDate = startOfDay(new Date());
        dateRange.endDate = endOfToday;
        dateRange.key = DATE_RANGE.TODAY;
    } else if (days) { // Past 7 days || Past 30 days || Past 2 months || Past 3 months || Past 4 months
        dateRange.startDate = startOfDay(addDays(new Date(), -(days - 1)));
        dateRange.endDate = endOfToday;
        dateRange.key = days == "7" ? DATE_RANGE.PAST_7_DAYS : days == "30" ? DATE_RANGE.LAST_30_DAYS : days == "60" ? DATE_RANGE.LAST_60_DAYS : days == "90" ? DATE_RANGE.LAST_90_DAYS : days == "120" ? DATE_RANGE.LAST_120_DAYS : "";
    } else if (months == "-1") { // This month
        dateRange.startDate = startOfThisMonth;
        dateRange.endDate = endOfToday;
        dateRange.key = DATE_RANGE.THIS_MONTH;
    } else if (months == "-12") { // This year
        dateRange.startDate = startOfThisYear;
        dateRange.endDate = endOfToday;
        dateRange.key = DATE_RANGE.THIS_YEAR;
    } else if (months) { // Past 6 months || Past 12 months || Past 24 months
        const isContactNPSReport = window.location.href.endsWith("analytics-dash/reports/contacts/contacts-nps/overview");
        const isCustomDateRangeMonths = (isContactNPSReport && (months == "3" || months == "6" || months == "9")) ? true : false;
        dateRange.startDate = isCustomDateRangeMonths ? startOfMonth(addMonths(new Date(), -months)) : startOfDay(addMonths(new Date(), -months));
        dateRange.endDate = endOfToday;
        dateRange.key = months == "24" ? DATE_RANGE.LAST_24_MONTHS : months == "12" ? DATE_RANGE.LAST_12_MONTHS : months == "9" ? DATE_RANGE.LAST_9_MONTHS : months == "3" ? DATE_RANGE.LAST_3_MONTHS : DATE_RANGE.LAST_6_MONTHS;
    } else if (startDate || endDate) { // custom
        dateRange.startDate = new Date(startDate);
        dateRange.endDate = new Date(endDate);
        dateRange.key = key || DATE_RANGE.CUSTOM;
    } else if (lastMonth) { // last calendar month
        dateRange.startDate = startOfPreviousMonth;
        dateRange.endDate = endOfPreviousMonth;
        dateRange.key = DATE_RANGE.LAST_CALENDAR_MONTH;
    }  else if (lastYear) { // last calendar year
        dateRange.startDate = startOfPreviousYear;
        dateRange.endDate = endOfPreviousYear;
        dateRange.key = DATE_RANGE.LAST_CALENDAR_YEAR;
    } else if (week == 0) { // this week(week=0)
        dateRange.startDate = startOfThisWeek;
        dateRange.endDate = endOfThisWeek;
        dateRange.key = DATE_RANGE.THIS_WEEK;
    } else if (week) { // last week(week=-1) || next week(week=1 only for scheduler when enableFutureDates)
        dateRange.startDate = week == "-1" ? startOfPreviousWeek : (week == "1" && enableFutureDates) ? startOfNextWeek : allTime;
        dateRange.endDate = week == "-1" ? endOfPreviousWeek : (week == "1" && enableFutureDates) ? endOfNextWeek : endOfToday;
        dateRange.key = week == "-1" ? DATE_RANGE.LAST_CALENDAR_WEEK : (week == "1" && enableFutureDates) ? DATE_RANGE.NEXT_CALENDAR_WEEK : DATE_RANGE.ALL_TIME;
    } else if (quarter == 0) { // this calendar quarter
        dateRange.startDate = startOfThisQuarter;
        dateRange.endDate = endOfThisQuarter;
        dateRange.key = DATE_RANGE.THIS_QUARTER;
    } else if (quarter == -1) { // // last quarter(quarter=-1)
        dateRange.startDate = startOfPreviousQuarter;
        dateRange.endDate = endOfPreviousQuarter;
        dateRange.key = DATE_RANGE.LAST_CALENDAR_QUARTER;
    } else { // all time
        dateRange.startDate = allTime;
        dateRange.endDate = endOfToday;
        dateRange.key = DATE_RANGE.ALL_TIME;
    }

    if (compareWith && Object.keys(compareWith).length && notRanges) {
        const { previous, months: monthsB } = compareWith;
        let previousDays = days != undefined ? days : dateRange.key === DATE_RANGE.PAST_7_DAYS ? 7 : dateRange.key === DATE_RANGE.LAST_30_DAYS ? 30 : dateRange.key === DATE_RANGE.LAST_60_DAYS ? 60 : dateRange.key === DATE_RANGE.LAST_90_DAYS ? 90 : dateRange.key === DATE_RANGE.LAST_120_DAYS ? 120 : "";
        let compareMonths = monthsB ? monthsB : months; // After change in second TimePeriodFilter comparison 
        let daysInNegative;
        if (compareMonths) { // to get number of days for month(s)
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
            dateRange.key = monthsB == "1" ? DATE_RANGE_CUSTOM.PREVIOUS_MONTH : monthsB == "2" ? DATE_RANGE_CUSTOM.TWO_MONTHS_PREVIOUS : monthsB == "3" ? DATE_RANGE_CUSTOM.THREE_MONTHS_PREVIOUS : monthsB == "6" ? DATE_RANGE_CUSTOM.SIX_MONTHS_PREVIOUS : monthsB == "12" ? DATE_RANGE_CUSTOM.PREVIOUS_YEAR : "";
        } else if (lastMonth && compareMonths) {
            dateRange.startDate = startOfMonth(subMonths(dateRange.startDate, compareMonths));
            dateRange.endDate = endOfMonth(subMonths(dateRange.endDate, compareMonths));
            dateRange.key = compareMonths == "1" ? DATE_RANGE_CUSTOM.PREVIOUS_MONTH : compareMonths == "2" ? DATE_RANGE_CUSTOM.TWO_MONTHS_PREVIOUS : compareMonths == "3" ? DATE_RANGE_CUSTOM.THREE_MONTHS_PREVIOUS : compareMonths == "6" ? DATE_RANGE_CUSTOM.SIX_MONTHS_PREVIOUS : compareMonths == "12" ? DATE_RANGE_CUSTOM.PREVIOUS_YEAR : "";
        } else if (compareMonths) {
            dateRange.startDate = subMonths(dateRange.startDate, compareMonths);
            dateRange.endDate = subMonths(dateRange.endDate, compareMonths);
            dateRange.key = compareMonths == "1" ? DATE_RANGE_CUSTOM.PREVIOUS_MONTH : compareMonths == "2" ? DATE_RANGE_CUSTOM.TWO_MONTHS_PREVIOUS : compareMonths == "3" ? DATE_RANGE_CUSTOM.THREE_MONTHS_PREVIOUS : compareMonths == "6" ? DATE_RANGE_CUSTOM.SIX_MONTHS_PREVIOUS : compareMonths == "12" ? DATE_RANGE_CUSTOM.PREVIOUS_YEAR : "";
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

export const getTimePeriodFilterPayload = (range, enableFutureDates = false, dateDisplayFormat = "MM/dd/yyyy") => {
    const { startDate, endDate, key } = range;
    let dates = {};
    switch (key) {
        case DATE_RANGE.ALL_TIME:
            dates.timePeriodSelected = "all";
            break;
        case DATE_RANGE.TODAY:
            dates.days = "0";
            break;
        case DATE_RANGE.YESTERDAY:
            dates.days = "-1";
            dates.groupByDays = "1";
            break;
        case DATE_RANGE.PAST_7_DAYS:
            dates.days = "7";
            dates.groupByDays = "1";
            break;
        case DATE_RANGE.THIS_MONTH:
            dates.months = "-1";
            dates.groupByDays = "0"; 
            break;
        case DATE_RANGE.LAST_30_DAYS:
            dates.days = "30";
            dates.groupByDays = "1";
            break;
        case DATE_RANGE.LAST_60_DAYS:
            dates.days = "60";
            dates.groupByDays = "1"; 
            break;
        case DATE_RANGE.LAST_90_DAYS:
            dates.days = "90";
            dates.groupByDays = "1"; 
            break;
        case DATE_RANGE.LAST_120_DAYS:
            dates.days = "120";
            dates.groupByDays = "1"; 
            break;
        case DATE_RANGE.LAST_3_MONTHS:
            dates.months = "3";
            dates.groupByDays = "0"; 
            break;
        case DATE_RANGE.LAST_6_MONTHS:
            dates.months = "6";
            dates.groupByDays = "0"; 
            break;
        case DATE_RANGE.LAST_9_MONTHS:
            dates.months = "9";
            dates.groupByDays = "0"; 
            break;
        case DATE_RANGE.THIS_YEAR:
            dates.months = "-12";
            dates.groupByDays = "0"; 
            break;
        case DATE_RANGE.LAST_12_MONTHS:
            dates.months = "12";
            dates.groupByDays = "0"; 
            break;
        case DATE_RANGE.LAST_24_MONTHS:
            dates.months = "24";
            dates.groupByDays = "0"; 
            break;  
        case DATE_RANGE.LAST_CALENDAR_MONTH:
            dates.lastMonth = true;
            break;
        case DATE_RANGE.LAST_CALENDAR_WEEK:
            dates.week = -1;
            break;
        case DATE_RANGE.LAST_CALENDAR_QUARTER:
            dates.quarter = -1;
            break;
        case DATE_RANGE.LAST_CALENDAR_YEAR:
            dates.lastYear = true;
            break;   
        case DATE_RANGE.AFTER_BIRDEYE:
            dates.startDate =  format(startDate, dateDisplayFormat);
            dates.endDate = format(endDate, dateDisplayFormat);
            dates.groupByDays = "1";
            break;      
        case DATE_RANGE.CUSTOM:
            dates.startDate =  format(startDate, dateDisplayFormat);
            dates.endDate = format(endDate, dateDisplayFormat);
            dates.groupByDays = "1";
            break;  
        case DATE_RANGE_CUSTOM.PREVIOUS_PERIOD:
            dates.previous = true;
            break;
        case DATE_RANGE_CUSTOM.PREVIOUS_MONTH:
            dates.months = "1";
            dates.groupByDays = "0";
            break;
        case DATE_RANGE_CUSTOM.TWO_MONTHS_PREVIOUS:
            dates.months = "2";
            dates.groupByDays = "0";
            break;
        case DATE_RANGE_CUSTOM.THREE_MONTHS_PREVIOUS:
            dates.months = "3";
            dates.groupByDays = "0";
            break;
        case DATE_RANGE_CUSTOM.SIX_MONTHS_PREVIOUS:
            dates.months = "6";
            dates.groupByDays = "0";
            break;
        case DATE_RANGE_CUSTOM.PREVIOUS_YEAR:
            dates.months = "12";
            dates.groupByDays = "0";
            break;
        case DATE_RANGE_CUSTOM.BEFORE_BIRDEYE:
            // dates.startDate =  format(startDate, dateDisplayFormat);
            dates.endDate = format(endDate, dateDisplayFormat);
            dates.beforeBirdeye = true;
            // dates.groupByDays = "1";
            break;    
        case DATE_RANGE.TOMORROW:
            dates.days = "1";
            dates.isFuture = true;
            break;
        case DATE_RANGE.NEXT_CALENDAR_WEEK:
            dates.week = "1";
            break;
        case DATE_RANGE.NEXT_CALENDAR_MONTH:
            dates.months = "1";
            dates.isFuture = true;
            break;
        case DATE_RANGE.NEXT_7_DAYS:
            dates.days = "7";
            dates.isFuture = true;
            break;
        case DATE_RANGE.NEXT_30_DAYS:
            dates.days = "30";
            dates.isFuture = true;
            break;
        case DATE_RANGE.NEXT_60_DAYS:
            dates.days = "60";
            dates.isFuture = true;
            break;
        case DATE_RANGE.NEXT_90_DAYS:
            dates.days = "90";
            dates.isFuture = true;
            break;
        case DATE_RANGE.NEXT_120_DAYS:
            dates.days = "120";
            dates.isFuture = true;
            break;
        case DATE_RANGE.NEXT_6_MONTHS:
            dates.months = "6";
            dates.isFuture = true;
            break;
        case DATE_RANGE.NEXT_12_MONTHS:
            dates.months = "12";
            dates.isFuture = true;
            break;
        case DATE_RANGE.THIS_WEEK:
            dates.week = "0";
            break;
        case DATE_RANGE.THIS_QUARTER:
            dates.quarter = "0";
            break;
        default:
            dates.timePeriodSelected = "all";
            break;    
    }

    dates.key = key;
    if (dates.isFuture || (enableFutureDates && isFuture(new Date(startDate)) && !dates.hasOwnProperty("week"))) {
        dates.isFuture = true;
    }
    return dates;
};

export const getMonthDateYear = (start, end, subStr) => {
    let startDay = new Date(start),
        startDate = startDay.getDate(),
        startMonth = startDay.toLocaleString("default", { month: "short" }),
        startYear = startDay.getFullYear(),
        endDay = new Date(end),
        endDate = endDay.getDate(),
        endMonth = endDay.toLocaleString("default", { month: "short" }),
        endYear = endDay.getFullYear();
    // showing year (i.e.'23) if start and end year are different + "short" of year.
    if ((startYear < new Date().getFullYear()) || !subStr) {
        startDate = startDate + (subStr ? (" '" + startYear.toString().substring(2)) : ", " + startYear);
        endDate = endDate + (subStr ? (" '" +  endYear.toString().substring(2)) : ", " + endYear);
    }
    // if start and end year are same, return start date only.
    if (startMonth + startDate === endMonth + endDate) {
        return startMonth + " " + startDate;
    } else {
        return startMonth + " " + startDate + " - " + endMonth + " " + endDate; 
    }
};

export const getCustomStaticRanges = (values, dateRange = {}) => {
    const { actual } = values || {};
    const { days, months, startDate: startDateA, endDate: endDateA, lastMonth, lastYear } = actual || values;
    const { startDate: customStartDate, endDate: customEndDate, key } = dateRange;
    const isCustom = key == DATE_RANGE.CUSTOM;
    let startDate, endDate, daysInNegative;

    if (startDateA || endDateA) {
        startDate = new Date(startDateA);
        endDate = new Date(endDateA);
    } else {
        let calculatedStartEnd = calculateDateRange(values, false);
        const { startDate: startDateB, endDate: endDateB } = calculatedStartEnd;
        startDate = startDateB;
        endDate = endDateB;
    }
    
    let previousDays = days;
    let previousMonth = 1,
        twoPreviousMonths = 2,
        threePreviousMonths = 3,
        sixPreviousMonths = 6,
        previousYear = 12;

    if (months || startDate || endDate) {
        daysInNegative = differenceInDays(startDate, endDate);
        previousDays = Math.abs(daysInNegative) + 1;
    } else if (lastMonth) {
        daysInNegative = differenceInDays(startDate, endDate);
        previousDays = Math.abs(daysInNegative) + 1;
    } else if (lastYear) {
        daysInNegative = differenceInDays(startDate, endDate);
        previousDays = Math.abs(daysInNegative) + 1;
    }

    const getStartDate = (start, removeMonths) => {
        return (months == "-1" || lastMonth) ? startOfMonth(addMonths(start, -removeMonths)) : subMonths(start, removeMonths);
    };

    const getEndDate = (end, removeMonths) => {
        return (months == "-1" || lastMonth) ? endOfMonth(addMonths(end, -removeMonths)) : subMonths(end, removeMonths);
    };

    return ([
        {
            label: <span className="rangeLabel-prefix">Previous period<span className="rangeLabel-suffix">{getMonthDateYear(subDays(startDate, previousDays), subDays(endDate, previousDays), true)}</span></span>,
            range: () => ({
                startDate: subDays(startDate, previousDays),
                endDate: subDays(endDate, previousDays),
                key: DATE_RANGE_CUSTOM.PREVIOUS_PERIOD
            })
        },
        {
            label: <span className="rangeLabel-prefix">Previous month<span className="rangeLabel-suffix">{getMonthDateYear(getStartDate(startDate, previousMonth), getEndDate(endDate, previousMonth), true)}</span></span>,
            range: () => ({
                startDate: getStartDate(startDate, previousMonth),
                endDate: getEndDate(endDate, previousMonth),
                key: DATE_RANGE_CUSTOM.PREVIOUS_MONTH
            })
        },
        {
            label: <span className="rangeLabel-prefix">2 months previous<span className="rangeLabel-suffix">{getMonthDateYear(getStartDate(startDate, twoPreviousMonths), getEndDate(endDate, twoPreviousMonths), true)}</span></span>,
            range: () => ({
                startDate: getStartDate(startDate, twoPreviousMonths),
                endDate: getEndDate(endDate, twoPreviousMonths),
                key: DATE_RANGE_CUSTOM.TWO_MONTHS_PREVIOUS
            })
        },
        {
            label: <span className="rangeLabel-prefix">3 months previous<span className="rangeLabel-suffix">{getMonthDateYear(getStartDate(startDate, threePreviousMonths), getEndDate(endDate, threePreviousMonths), true)}</span></span>,
            range: () => ({
                startDate: getStartDate(startDate, threePreviousMonths),
                endDate: getEndDate(endDate, threePreviousMonths),
                key: DATE_RANGE_CUSTOM.THREE_MONTHS_PREVIOUS
            })
        },
        {
            label: <span className="rangeLabel-prefix">6 months previous<span className="rangeLabel-suffix">{getMonthDateYear(getStartDate(startDate, sixPreviousMonths), getEndDate(endDate, sixPreviousMonths), true)}</span></span>,
            range: () => ({
                startDate: getStartDate(startDate, sixPreviousMonths),
                endDate: getEndDate(endDate, sixPreviousMonths),
                key: DATE_RANGE_CUSTOM.SIX_MONTHS_PREVIOUS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Previous year<span className="rangeLabel-suffix">{getMonthDateYear(subMonths(startDate, previousYear), subMonths(endDate, previousYear), true)}</span></span>,
            range: () => ({
                startDate: subMonths(startDate, previousYear),
                endDate: subMonths(endDate, previousYear),
                key: DATE_RANGE_CUSTOM.PREVIOUS_YEAR
            })
        },
        {
            label: <span className="rangeLabel-prefix">{`Before ${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`}<span className="rangeLabel-suffix">{getMonthDateYear(allTime, endOfBeforeBirdeyeContract, true)}</span></span>,
            range: () => ({
                startDate: allTime,
                endDate: endOfBeforeBirdeyeContract,
                key: DATE_RANGE_CUSTOM.BEFORE_BIRDEYE
            })
        },
        {
            label: <span className="rangeLabel-prefix">Custom date range{isCustom && <span className="rangeLabel-suffix">{getMonthDateYear(customStartDate, customEndDate, true)}</span>}</span>,
            range: () => ({
                startDate: isCustom ? customStartDate : new Date(),
                endDate: isCustom ? customEndDate : new Date(),
                key: DATE_RANGE.CUSTOM
            })
        }
    ]);
};