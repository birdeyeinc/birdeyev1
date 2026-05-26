import React from "react";
import { isSameDay } from "date-fns";
import { 
    endOfToday,
    endOfTomorrow,
    startOfToday,
    startOfYesterday, 
    endOfYesterday,
    startOfLast7Days, 
    startOfLast30Days, 
    startOfThisMonth, 
    startOfPreviousMonth,
    endOfPreviousMonth,
    startsOfLast2Months,
    startsOfLast3Months, 
    startOfLast6Months, 
    startOfLast12Months, 
    startOfThisYear, 
    startOfPreviousYear,
    endOfPreviousYear,
    getMonthDateYear,
    allTime,
    DATE_RANGE,
    getCustomStaticRanges,
    startOfPreviousWeek,
    endOfPreviousWeek,
    startOfThisWeek,
    endOfThisWeek,
    startsOfLast4Months,
    startOfTomorrow,
    endOfNext12Months,
    endOfNext6Months,
    endOfNext4Months,
    endOfNext3Months,
    endOfNext2Months,
    endOfNext30Days,
    endOfNext7Days,
    endOfNextMonth,
    startOfNextMonth,
    endOfNextWeek,
    startOfNextWeek,
    endOfThisMonth,
    startOfLastCalendar9Months,
    startOfLastCalendar6Months,
    startOfLastCalendar3Months,
    startOfBirdeyeContract,
    startOfPreviousQuarter,
    endOfPreviousQuarter,
    startOfThisQuarter,
    endOfThisQuarter,
    startOfLast24Months
} from "./utils";
import { capitalizeAllLetters } from "utils";
  
const staticRangeHandler = {
    range: {},
    isSelected (range) {
        const definedRange = this.range();
        return (
            isSameDay(range.startDate, definedRange.startDate) &&
            isSameDay(range.endDate, definedRange.endDate)
        );
    }
};
  
export function createStaticRanges(ranges) {
    return ranges.map(range => ({ ...staticRangeHandler, ...range }));
}

export function schedulerFutureStaticRanges() {
    let range = createStaticRanges([
        {
            label: <span className="rangeLabel-prefix">Tomorrow</span>,
            range: () => ({
                startDate: startOfTomorrow,
                endDate: endOfTomorrow,
                key: DATE_RANGE.TOMORROW
            })
        },
        {
            label: <span className="rangeLabel-prefix">Next calendar week</span>,
            range: () => ({
                startDate: startOfNextWeek,
                endDate: endOfNextWeek,
                key: DATE_RANGE.NEXT_CALENDAR_WEEK
            })
        },
        {
            label: <span className="rangeLabel-prefix">Next calendar month</span>,
            range: () => ({
                startDate: startOfNextMonth,
                endDate: endOfNextMonth,
                key: DATE_RANGE.NEXT_CALENDAR_MONTH
            })
        },
        {
            label: <span className="rangeLabel-prefix">Next 7 days</span>,
            range: () => ({
                startDate: startOfToday,
                endDate: endOfNext7Days,
                key: DATE_RANGE.NEXT_7_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Next 30 days</span>,
            range: () => ({
                startDate: startOfToday,
                endDate: endOfNext30Days,
                key: DATE_RANGE.NEXT_30_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Next 60 days</span>,
            range: () => ({
                startDate: startOfToday,
                endDate: endOfNext2Months,
                key: DATE_RANGE.NEXT_60_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Next 90 days</span>,
            range: () => ({
                startDate: startOfToday,
                endDate: endOfNext3Months,
                key: DATE_RANGE.NEXT_90_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Next 120 days</span>,
            range: () => ({
                startDate: startOfToday,
                endDate: endOfNext4Months,
                key: DATE_RANGE.NEXT_120_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Next 6 months</span>,
            range: () => ({
                startDate: startOfToday,
                endDate: endOfNext6Months,
                key: DATE_RANGE.NEXT_6_MONTHS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Next 12 months</span>,
            range: () => ({
                startDate: startOfToday,
                endDate: endOfNext12Months,
                key: DATE_RANGE.NEXT_12_MONTHS
            })
        }
    ]);

    return range;
}

export function schedulerPastStaticRanges(hideStaticRangeKeys) {
    const range = [
        {
            label: <span className="rangeLabel-prefix">Yesterday<span className="rangeLabel-suffix">{getMonthDateYear(startOfYesterday, endOfYesterday, true)}</span></span>,
            key: DATE_RANGE.YESTERDAY,
            range: () => ({
                startDate: startOfYesterday,
                endDate: endOfYesterday,
                key: DATE_RANGE.YESTERDAY
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 7 days<span className="rangeLabel-suffix">{getMonthDateYear(startOfLast7Days, endOfToday, true)}</span></span>,
            key: DATE_RANGE.PAST_7_DAYS,
            range: () => ({
                startDate: startOfLast7Days,
                endDate: endOfToday,
                key: DATE_RANGE.PAST_7_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 30 days<span className="rangeLabel-suffix">{getMonthDateYear(startOfLast30Days, endOfToday, true)}</span></span>,
            key: DATE_RANGE.LAST_30_DAYS,
            range: () => ({
                startDate: startOfLast30Days,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_30_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 60 days<span className="rangeLabel-suffix">{getMonthDateYear(startsOfLast2Months, endOfToday, true)}</span></span>,
            key: DATE_RANGE.LAST_60_DAYS,
            range: () => ({
                startDate: startsOfLast2Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_60_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 90 days<span className="rangeLabel-suffix">{getMonthDateYear(startsOfLast3Months, endOfToday, true)}</span></span>,
            key: DATE_RANGE.LAST_90_DAYS,
            range: () => ({
                startDate: startsOfLast3Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_90_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 120 days<span className="rangeLabel-suffix">{getMonthDateYear(startsOfLast4Months, endOfToday, true)}</span></span>,
            key: DATE_RANGE.LAST_120_DAYS,
            range: () => ({
                startDate: startsOfLast4Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_120_DAYS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 6 months<span className="rangeLabel-suffix">{getMonthDateYear(startOfLast6Months, endOfToday, true)}</span></span>,
            key: DATE_RANGE.LAST_6_MONTHS,
            range: () => ({
                startDate: startOfLast6Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_6_MONTHS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 12 months<span className="rangeLabel-suffix">{getMonthDateYear(startOfLast12Months, endOfToday, true)}</span></span>,
            key: DATE_RANGE.LAST_12_MONTHS,
            range: () => ({
                startDate: startOfLast12Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_12_MONTHS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 24 months{/*<span className="rangeLabel-suffix">{getMonthDateYear(startOfLast12Months, endOfToday, true)}</span>*/}</span>,
            key: DATE_RANGE.LAST_24_MONTHS,
            range: () => ({
                startDate: startOfLast24Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_24_MONTHS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last calendar week<span className="rangeLabel-suffix">{getMonthDateYear(startOfPreviousWeek, endOfPreviousWeek, true)}</span></span>,
            key: DATE_RANGE.LAST_CALENDAR_WEEK,
            range: () => ({
                startDate: startOfPreviousWeek,
                endDate: endOfPreviousWeek,
                key: DATE_RANGE.LAST_CALENDAR_WEEK
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last calendar month</span>,
            key: DATE_RANGE.LAST_CALENDAR_MONTH,
            range: () => ({
                startDate: startOfPreviousMonth,
                endDate: endOfPreviousMonth,
                key: DATE_RANGE.LAST_CALENDAR_MONTH
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last calendar quarter</span>,
            key: DATE_RANGE.LAST_CALENDAR_QUARTER,
            range: () => ({
                startDate: startOfPreviousQuarter,
                endDate: endOfPreviousQuarter,
                key: DATE_RANGE.LAST_CALENDAR_QUARTER
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last calendar year</span>,
            key: DATE_RANGE.LAST_CALENDAR_YEAR,
            range: () => ({
                startDate: startOfPreviousYear,
                endDate: endOfPreviousYear,
                key: DATE_RANGE.LAST_CALENDAR_YEAR
            })
        },
        {
            label: <span className="rangeLabel-prefix">This calendar week<span className="rangeLabel-suffix">{getMonthDateYear(startOfThisWeek, endOfThisWeek, true)}</span></span>,
            key: DATE_RANGE.THIS_WEEK,
            range: () => ({
                startDate: startOfThisWeek,
                endDate: endOfThisWeek,
                key: DATE_RANGE.THIS_WEEK
            })
        },
        {
            label: <span className="rangeLabel-prefix">This calendar month<span className="rangeLabel-suffix">{getMonthDateYear(startOfThisMonth, endOfToday, true)}</span></span>,
            key: DATE_RANGE.THIS_MONTH,
            range: () => ({
                startDate: startOfThisMonth,
                endDate: endOfThisMonth,
                key: DATE_RANGE.THIS_MONTH
            })
        },
        {
            label: <span className="rangeLabel-prefix">This calendar quarter<span className="rangeLabel-suffix">{getMonthDateYear(startOfThisMonth, endOfToday, true)}</span></span>,
            key: DATE_RANGE.THIS_QUARTER,
            range: () => ({
                startDate: startOfThisQuarter,
                endDate: endOfThisQuarter,
                key: DATE_RANGE.THIS_QUARTER
            })
        },
        {
            label: <span className="rangeLabel-prefix">This calendar year<span className="rangeLabel-suffix">{getMonthDateYear(startOfThisYear, endOfToday, true)}</span></span>,
            key: DATE_RANGE.THIS_YEAR,
            range: () => ({
                startDate: startOfThisYear,
                endDate: endOfToday,
                key: DATE_RANGE.THIS_YEAR
            })
        },
        {
            label: <span className="rangeLabel-prefix">{capitalizeAllLetters(`After ${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`)}<span className="rangeLabel-suffix">{getMonthDateYear(startOfBirdeyeContract, endOfToday, true)}</span></span>,
            key: DATE_RANGE.AFTER_BIRDEYE,
            range: () => ({
                startDate: startOfBirdeyeContract,
                endDate: endOfToday,
                key: DATE_RANGE.AFTER_BIRDEYE
            })
        }
    ];
    
    const filteredRange = range.filter((item) => !hideStaticRangeKeys.includes(item.key));
    const staticRanges = createStaticRanges(filteredRange);
    return staticRanges;
}

export function customDateRangesForContactNpsReport() {
    let range = createStaticRanges([
        {
            label: <span className="rangeLabel-prefix">Last calendar month</span>,
            range: () => ({
                startDate: startOfPreviousMonth,
                endDate: endOfPreviousMonth,
                key: DATE_RANGE.LAST_CALENDAR_MONTH
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last calendar year</span>,
            range: () => ({
                startDate: startOfPreviousYear,
                endDate: endOfPreviousYear,
                key: DATE_RANGE.LAST_CALENDAR_YEAR
            })
        },
        {
            label: <span className="rangeLabel-prefix">This calendar year<span className="rangeLabel-suffix">{getMonthDateYear(startOfThisYear, endOfToday, true)}</span></span>,
            range: () => ({
                startDate: startOfThisYear,
                endDate: endOfToday,
                key: DATE_RANGE.THIS_YEAR
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 3 months<span className="rangeLabel-suffix">{getMonthDateYear(startOfLastCalendar3Months, endOfToday, true)}</span></span>,
            range: () => ({
                startDate: startOfLastCalendar3Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_3_MONTHS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 6 months<span className="rangeLabel-suffix">{getMonthDateYear(startOfLastCalendar6Months, endOfToday, true)}</span></span>,
            range: () => ({
                startDate: startOfLastCalendar6Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_6_MONTHS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 9 months<span className="rangeLabel-suffix">{getMonthDateYear(startOfLastCalendar9Months, endOfToday, true)}</span></span>,
            range: () => ({
                startDate: startOfLastCalendar9Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_9_MONTHS
            })
        },
        {
            label: <span className="rangeLabel-prefix">Last 12 months{/*<span className="rangeLabel-suffix">{getMonthDateYear(startOfLast12Months, endOfToday, true)}</span>*/}</span>,
            range: () => ({
                startDate: startOfLast12Months,
                endDate: endOfToday,
                key: DATE_RANGE.LAST_12_MONTHS
            })
        },
        {
            label: <span className="rangeLabel-prefix">{capitalizeAllLetters(`After ${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`)}<span className="rangeLabel-suffix">{getMonthDateYear(startOfBirdeyeContract, endOfToday, true)}</span></span>,
            range: () => ({
                startDate: startOfBirdeyeContract,
                endDate: endOfToday,
                key: DATE_RANGE.AFTER_BIRDEYE
            })
        }
    ]);

    return range;
}

export function schedulerCustomRanges(isCustom, customStartDate, customEndDate) {
    let range = createStaticRanges([
        {
            label: <span className="rangeLabel-prefix">Custom{isCustom && <span className="rangeLabel-suffix">{getMonthDateYear(customStartDate, customEndDate, true)}</span>}</span>,
            range: () => ({
                startDate: isCustom ? customStartDate : new Date(),
                endDate: isCustom ? customEndDate : new Date(),
                key: DATE_RANGE.CUSTOM
            })
        }
    ]);

    return range;
}

export function schedulerAllTime() {
    let range = createStaticRanges([
        {
            label: <span className="rangeLabel-prefix">All time</span>,
            range: () => ({
                startDate: allTime,
                endDate: endOfToday,
                key: DATE_RANGE.ALL_TIME
            })
        }
    ]);

    return range;
}

export const actualStaticRanges = (removeFirstThreeElem = false, dateRange = {}, isScheduler, pastDates = true, hideAllTime = false, isContactNPSReport = false, isLocalFilter = false, hideRangeKeys) => {
    const { startDate: customStartDate, endDate: customEndDate, key } = dateRange;
    const isCustom = key == DATE_RANGE.CUSTOM;
    const defaultOptions = [
        {
            label: <span className="rangeLabel-prefix">Today</span>,
            range: () => ({
                startDate: startOfToday,
                endDate: endOfToday,
                key: DATE_RANGE.TODAY
            })
        }
    ];
    if (!hideAllTime) {
        defaultOptions.unshift({
            label: <span className="rangeLabel-prefix">All time</span>,
            range: () => ({
                startDate: allTime,
                endDate: endOfToday,
                key: DATE_RANGE.ALL_TIME
            })
        });
    }
    let range = createStaticRanges(defaultOptions);

    if (pastDates) {
        const schedulePastRanges = schedulerPastStaticRanges(hideRangeKeys);
        range = range.concat(schedulePastRanges);
    }

    if (isScheduler) {
        const scheduleFutureRanges = schedulerFutureStaticRanges();
        range = scheduleFutureRanges.concat(range);
    }

    // range = range.concat(schedulerCustomRanges(isCustom, customStartDate, customEndDate));

    // range = schedulerCustomRanges(isCustom, customStartDate, customEndDate).concat(range);
    if (isContactNPSReport) {
        range = [];
        const scheduleFutureRanges = customDateRangesForContactNpsReport();
        if (!isLocalFilter) {
            scheduleFutureRanges.splice(5, 1);
            scheduleFutureRanges.splice(3, 1);
        }
        range = scheduleFutureRanges.concat(range);
    }
    return removeFirstThreeElem ? (Array.isArray(range) && range.slice(3)) : range;
};

export const comparisonStaticRanges = (compareRange, dateRange) => {
    return createStaticRanges(getCustomStaticRanges(compareRange, dateRange));
};