import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import PropTypes from "prop-types";
import Button from "atoms/Button";
import { actualStaticRanges, comparisonStaticRanges } from "./Ranges";
import { getMonthDateYear, startOfLast12Months, endOfToday, startOfToday, calculateDateRange, getTimePeriodFilterPayload, DATE_RANGE, minDate as utilMinDate } from "./utils";
import { capitalizeFirstLetter, capitalizeAllLetters } from "utils";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import style from "./TimePeriod.module.scss";
import { gray90 } from "sass/js/colors";
import useClickOutside from "utils/hooks/useClickOutside";

let isSameRangeSelection = {};
const TimePeriod = ({
    selectedDateRange = {},
    onChangeSelectedDateRange,
    comparison,
    hideRangeForComparison,
    isBlueLabel,
    doNotShowLabels,
    disable,
    hideCalendarIcon,
    enableFutureDates,
    initLabel,
    initSelected,
    isScheduler,
    pastDates,
    isInsightsModule,
    hideAllTime,
    isLocalFilter,
    minDate,
    hideStaticRangeKeys,
    alignPopUpLeft,
    isReseller,
    alignPopUpRight = false,
    hideClearIcon,
    isSocialENTReports,
    isYelpListingsReports,
    isReviewsENTReports,
    isRentDotCom,
    isInline = false,
    "data-testid": dataTestId,
    inheritParentDimensions = false,
    dateDisplayFormat = "MM/dd/yyyy",
    onApply,
    onClear,
    onDateChange,
    applyLabel = "Set range",
    clearLabel = "Cancel",
}) => {
    let defaultState = selectedDateRange != "undefined" && Object.keys(selectedDateRange).length ? calculateDateRange(selectedDateRange, true, enableFutureDates?.enabled) : { startDate: startOfLast12Months, endDate: endOfToday, key: "past_12_months" };
    const { ref, isComponentVisible, setIsComponentVisible } = useClickOutside(false);
    const [dateRange, setDateRange] = useState(defaultState);
    const [focusedRange, setFocusedRange] = useState([0, 1]);
    const { startDate, endDate, key } = dateRange;
    const isDropdownVisible = isInline || isComponentVisible;
    let defaultTimePeriod = isSocialENTReports || isInsightsModule || (isReviewsENTReports && isReseller) ? { days: 90, groupByDays: 1 } : { months: 12, groupByDays: 0 };
    if (isYelpListingsReports) {
        defaultTimePeriod = { days: 30, groupByDays: 1, key: "last_30_days" };
    }
    const isContactNPSReport = window.location.href.endsWith("analytics-dash/reports/contacts/contacts-nps/overview");
    let isClearIconVisible = isSocialENTReports || isInsightsModule || (isReviewsENTReports && isReseller) ? selectedDateRange?.days != "90" : selectedDateRange?.months != "12";
    isClearIconVisible = isYelpListingsReports ? selectedDateRange?.days != "30" : isClearIconVisible;
    if (initSelected) {
        isClearIconVisible = initSelected?.months ? selectedDateRange?.months != initSelected?.months : initSelected?.days ? initSelected?.days != selectedDateRange?.days : selectedDateRange !== "all";
        if (selectedDateRange.days === 0) {
            isClearIconVisible = false;
        }
        if (isInsightsModule) {
            if (selectedDateRange?.days == "90" && selectedDateRange.groupByDays == "1") {
                isClearIconVisible = false;
            } else {
                isClearIconVisible = true;
            }
        }
    }

    if (hideClearIcon) {
        isClearIconVisible = false;
    }

    const handleSelect = (ranges) => {
        setFocusedRange([0, 0]);
        let newRange;
        if (Object.keys(ranges)[0] === ranges[key].key && (ranges[key].startDate == isSameRangeSelection.startDate || ranges[key].startDate != isSameRangeSelection.startDate) && ranges[key].endDate != isSameRangeSelection.endDate) {
            ranges[key].key = "custom";
            newRange = ranges[key];
        } else {
            isSameRangeSelection.startDate = ranges[key].startDate;
            isSameRangeSelection.endDate = ranges[key].endDate;
            newRange = ranges[key];
        }
        setDateRange(newRange);
        if (onDateChange) {
            onDateChange(getTimePeriodFilterPayload(newRange, enableFutureDates?.enabled, dateDisplayFormat));
        }
    };

    useEffect(() => {
        setDateRange(calculateDateRange(selectedDateRange, true, enableFutureDates?.enabled));
    }, [selectedDateRange]);

    useEffect(() => {
        if (!isDropdownVisible) {
            onClickCancel();
        } else {
            const inputs = ref.current?.querySelectorAll(".rdrDateDisplayItem input");
            const placeholderText = dateDisplayFormat.replace(/d/g, "D").replace(/y/g, "Y");
            inputs?.forEach((input) => {
                input.placeholder = placeholderText;
            });

        }
    }, [isDropdownVisible]);

    const onClickCancel = () => {
        setDateRange(defaultState);
        if (onClear) {
            onClear();
            return;
        }
        setIsComponentVisible(false);
    };

    const onClickApply = () => {
        const payload = getTimePeriodFilterPayload(dateRange, enableFutureDates?.enabled, dateDisplayFormat);
        if (onApply) {
            onApply(payload);
        } else {
            onChangeSelectedDateRange(payload);
            setIsComponentVisible(false);
        }
    };

    const onClickReset = () => {
        setDateRange({ startDate: startOfToday, endDate: endOfToday, key: DATE_RANGE.TODAY });
        setFocusedRange([0, 1]);
    };

    const getLabel = () => {
        let label =
            key == DATE_RANGE.CUSTOM || doNotShowLabels
                ? getMonthDateYear(startDate, endDate, false)
                : key?.includes(`${window?.BE?.business?.resellerInfo?.name?.toLowerCase() || window?.BE?.business?.brandInfo?.name?.toLowerCase() || "birdeye"}`)
                ? capitalizeAllLetters(key?.replaceAll("_", " "))
                : capitalizeFirstLetter(key?.replaceAll("_", " "));
        if (isInsightsModule && key === "all_time") {
            return label;
        }
        return key === "all_time" && initLabel ? initLabel : label;
    };

    const getStaticRanges = () => {
        let actualStaticRange = actualStaticRanges(hideRangeForComparison, dateRange, isScheduler, pastDates, hideAllTime, isContactNPSReport, isLocalFilter, hideStaticRangeKeys);
        let staticRanges = comparison && Object.keys(selectedDateRange).length ? comparisonStaticRanges(selectedDateRange, dateRange) : actualStaticRange;
        return staticRanges;
    };

    const getMaxDate = (actualRange) => {
        const { actual = {} } = actualRange || {};
        const { endDate } = calculateDateRange(actual);
        return endDate;
    };

    const getFocusedRange = () => {
        switch (dateRange.key) {
            case "all_time":
                return [0, 1];
            default:
                return focusedRange;
        }
    };

    const handleRangeFocus = (data) => {
        setFocusedRange(data);
    };

    return (
        <>
            {!isInline && (
                <div className={`${style["range-selector"]} ${isBlueLabel ? "date-range-blue" : ""} ${disable ? "disable-timeperiod" : ""} pos-rel mb-10`} onClick={() => setIsComponentVisible(true)} data-testid={`el-test-${dataTestId}-selector`}>
                    <span>
                        {" "}
                        {!hideCalendarIcon ? <i className="icon-calendar mr-10" /> : null} <p>{getLabel()}</p>
                    </span>
                    {!comparison && isClearIconVisible && !disable ? (
                        <span
                            className="icon tootip-parent"
                            styleName="reset-btn"
                            onClick={(e) => {
                                onChangeSelectedDateRange(initSelected ? initSelected : defaultTimePeriod);
                                e.stopPropagation();
                            }}
                            data-testid={`el-test-${dataTestId}-clear-icon`}
                        >
                            <span className="icon_phoenix-close" />
                            <div className="tooltip-dark">
                                <div className="inner">Clear filter</div>
                            </div>
                        </span>
                    ) : (
                        <i className="icon-cheveron_open" />
                    )}
                </div>
            )}
            {isDropdownVisible && (
                <div
                    ref={ref}
                    id="date-range-picker"
                    className={`custom-datepickerbox ${comparison ? "comparison-width" : ""} ${inheritParentDimensions ? style["inherit-parent-dimensions"] : ""} ${isRentDotCom || alignPopUpLeft ? "rentDotCom-datepicker" : ""} ${key} ${style["date-range-picker"]} ${
                        key == DATE_RANGE.CUSTOM ? style["custom-date-range"] : ""
                    } ${alignPopUpRight ? style["datepicker-alignRight"] : ""} ${isInline ? style["inline-picker"] : ""}`}
                    data-testid={`el-test-${dataTestId}-date-picker`}
                >
                    <DateRangePicker
                        onChange={handleSelect}
                        showSelectionPreview
                        showMonthAndYearPickers={false}
                        showDateDisplay
                        months={2}
                        ranges={[dateRange]}
                        staticRanges={getStaticRanges()}
                        inputRanges={[]}
                        color={gray90}
                        direction="horizontal"
                        maxDate={enableFutureDates ? undefined : comparison ? getMaxDate(selectedDateRange) : new Date()}
                        minDate={typeof pastDates === "boolean" && !pastDates ? new Date() : minDate}
                        fixedHeight
                        focusedRange={getFocusedRange()}
                        retainEndDateOnFirstSelection
                        onRangeFocusChange={handleRangeFocus}
                        editableDateInputs
                        dateDisplayFormat={dateDisplayFormat}
                        monthDisplayFormat="MMMM yyyy"
                        weekdayDisplayFormat="EEEEEE"
                    />
                    <div className={`${style["rdr-buttons-position"]}`}>
                        <div className={style["rdr-buttons-left"]}>
                            <Button onClick={onClickReset} theme="link" label="Reset" data-testid={`el-test-${dataTestId}-reset`} />
                        </div>
                        <div className={style["rdr-buttons-right"]}>
                            <Button onClick={onClickCancel} theme="link" label={clearLabel} className="mr-5" data-testid={`el-test-${dataTestId}-cancel`} />
                            <Button onClick={() => onClickApply()} label={applyLabel} data-testid={`el-test-${dataTestId}-apply`} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

TimePeriod.defaultProps = {
    comparison: false,
    hideRangeForComparison: false,
    doNotShowLabels: false,
    isBlueLabel: false,
    disable: false,
    minDate: utilMinDate,
    hideStaticRangeKeys: [],
    hideClearIcon: false,
    isSocialENTReports: false,
    isYelpListingsReports: false,
    isReviewsENTReports: false,
    isRentDotCom: false,
    isInline: false,
    inheritParentDimensions: false,
    dateDisplayFormat: "MM/dd/yyyy",
    "data-testid": "time-period",
};

TimePeriod.propTypes = {
    selectedDateRange: PropTypes.object,
    onChangeSelectedDateRange: PropTypes.func.isRequired,
    comparison: PropTypes.bool,
    hideRangeForComparison: PropTypes.bool,
    doNotShowLabels: PropTypes.bool,
    isBlueLabel: PropTypes.bool,
    disable: PropTypes.bool,
    hideCalendarIcon: PropTypes.bool,
    enableFutureDates: PropTypes.bool,
    initLabel: PropTypes.string,
    initSelected: PropTypes.object,
    isScheduler: PropTypes.bool,
    pastDates: PropTypes.bool,
    isInsightsModule: PropTypes.bool,
    hideAllTime: PropTypes.bool,
    isLocalFilter: PropTypes.bool,
    minDate: PropTypes.string,
    hideStaticRangeKeys: PropTypes.array,
    alignPopUpLeft: PropTypes.bool,
    isReseller: PropTypes.bool,
    alignPopUpRight: PropTypes.bool,
    hideClearIcon: PropTypes.bool,
    isSocialENTReports: PropTypes.bool,
    isYelpListingsReports: PropTypes.bool,
    isReviewsENTReports: PropTypes.bool,
    isRentDotCom: PropTypes.bool,
    isInline: PropTypes.bool,
    inheritParentDimensions: PropTypes.bool,
    dateDisplayFormat: PropTypes.string,
    "data-testid": PropTypes.string,
    onApply: PropTypes.func,
    onClear: PropTypes.func,
    onDateChange: PropTypes.func,
    applyLabel: PropTypes.string,
    clearLabel: PropTypes.string,
};

export default TimePeriod;
