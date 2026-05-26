import React, { useState, useRef, useEffect, Fragment, Component } from "react";
import PropTypes from "prop-types";
import { SingleDatePicker, RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import moment from "moment";
import momentTimezone from "moment-timezone";
import { isEmpty } from "lodash";
import onClickOutside from "react-onclickoutside";

import Button from "atoms/Button";
import FormInput from "atoms/FormInput";
import Form from "components/Form";
import styles from "./DatePicker.module.scss";
import Timepicker from "components/TimePicker";

import { convertDateToMomentDt, formatDateTimeStamp, getFormattedDate as formatDate } from "./DatePicker.utils";
import { getEncodedStyleClass } from "utils/index";

const DatePicker = (props) => {
    const {
        dynamicClass = "",
        enableFutureDates,
        disablePastDates,
        style,
        //minDate,
        firstTimeFlag,
        startDt,
        endDt,
        endDateChange = null,
        sendDateTime,
        ctaButtonsEnabled,
        onClickApplyChanges,
        insidePopup,
        dateRangeFormat,
        cancelCalendarPopup,
        startDateChange = null,
        range,
        closeOnClickOutside,
        explicitMinDt,
        explicitMaxDt,
        openCallback,
        showTimePicker,
        validateTime,
        showValidateTimeError,
        ignorePreventDefault,
        applyButtonLabel,
        timezoneLabel,
        showInboxDateFormat,
        showTimezone,
        title,
        setShowScheduleDatePicker,
        showInfo = false,
        infoText,
        showTimePickerAbove = false,
        isRequired,
        showApplyButtons,
        inlineApplyButtonTrigger,
        enableBusinessTimeZone = false,
        validateEndDateInRangePicker = false
    } = props;

    const dynamicClassWithHeritance = dynamicClass ? `el-specificity ${dynamicClass}` : "el-specificity";
    const formReference = useRef(null);

    let counter = 0;
    const formattedStartDate = startDt ? formatDate(startDt, "UK") : null;
    const formattedEndDate = endDt ? formatDate(endDt, "UK") : null;

    const [startDate, setStartDate] = useState(startDt);
    const [endDate, setEndDate] = useState(endDt);
    const [startDateInput, setStartDateInput] = useState(formattedStartDate);
    const [endDateInput, setEndDateInput] = useState(formattedEndDate);
    const [startCalenderClicked, setStartCalenderClicked] = useState(true);
    const [endCalenderClicked, setEndCalenderClicked] = useState(true);
    const [isStartDateErr, setIsStartDateErr] = useState(false);
    const [isEndDateErr, setIsEndDateErr] = useState(false);
    const [showStartCross, setShowStartCross] = useState(true);
    const [showEndCross, setShowEndCross] = useState(true);
    const [firstTimeLoad, setfirstTimeLoad] = useState(true);
    const [dtPickedTimeStamp, setDTPickedTimeStamp] = useState(null);
    //const isIpad = navigator.userAgent.match(/iPad/i);

    const currentTime = showTimePickerAbove ? convertDateToMomentDt(startDate, true, enableBusinessTimeZone).format("HH mm a").split(" ") : convertDateToMomentDt(startDate, true, enableBusinessTimeZone).format("HH mm a").split(" ");
    const currentHour = parseInt(currentTime[0]) > 12 ? parseInt(currentTime[0]) - 12 : parseInt(currentTime[0]) === 0 ? 12 : parseInt(currentTime[0]);

    const currentTimeForEndDate = showTimePickerAbove ? convertDateToMomentDt(endDate, true, enableBusinessTimeZone).format("HH mm a").split(" ") : convertDateToMomentDt(endDate, true, enableBusinessTimeZone).format("HH mm a").split(" ");
    const currentHourForEndDate = parseInt(currentTimeForEndDate[0]) > 12 ? parseInt(currentTimeForEndDate[0]) - 12 : parseInt(currentTimeForEndDate[0]) === 0 ? 12 : parseInt(currentTimeForEndDate[0]);
    const businessTimeZone = window?.BE?.business?.timezone || window?.BE?.business?.timezoneId || "America/Los_Angeles";
    const businessTimeZoneLabel = businessTimeZone.replaceAll("_", " ");
    const nowInTimeZone = enableBusinessTimeZone ? momentTimezone.tz(businessTimeZone)?.toDate() : new Date();
    const singleDatePickerStartDate = startDate ? startDate : nowInTimeZone;

    // Use startDate if defined, otherwise use time-zone-adjusted "now"

    const [timeObject, setTimeObject] = useState({
        // hours: new Date().getHours() >= 12 ? new Date().getHours() - 12 : new Date().getHours() ,
        hours: currentHour,
        minutes: currentTime[1],
        meridiem: currentTime[2]
    });
    const [timeObjectForEndDate, setTimeObjectForEndDate] = useState({
        // hours: new Date().getHours() >= 12 ? new Date().getHours() - 12 : new Date().getHours() ,
        hours: currentHourForEndDate,
        minutes: currentTimeForEndDate[1],
        meridiem: currentTimeForEndDate[2]
    });

    let browserTimezoneName = "";
    if (showTimezone) {
        let timezone = momentTimezone.tz(momentTimezone.tz.guess())._d.toString();
        browserTimezoneName = !isEmpty(timezone) && timezone.split("(")[1].replace(")", "");
    }

    const changeTime = (e, key, type) => {

        const newTimeObject = type == "timepicker" ? timeObject : timeObjectForEndDate;
        if (key) {
            newTimeObject[key] = e.value;
            type == "timepicker" ? setTimeObject({ ...newTimeObject }) : setTimeObjectForEndDate({ ...newTimeObject });
        }

        const { hours, minutes, meridiem } = newTimeObject;
        const newDate = type == "timepicker" ? showTimePickerAbove ? (moment(startDate, showTimePicker ? "MMM DD, YYYY HH:mm:ss" : "MMM DD, YYYY")) : (startDate) : type == "timePickerForEndDate" && moment(endDate, showTimePicker ? "MMM DD, YYYY HH:mm:ss" : "MMM DD, YYYY");
        if (firstTimeLoad) {
            newDate.hours && newDate.hours(meridiem === "am" || parseInt(hours) === 12 ? hours : parseInt(hours) + 12);
            newDate.minutes && newDate.minutes(minutes);
        } else {
            if (showTimePickerAbove) {
                newDate.hours && newDate.hours(meridiem === "am" || parseInt(hours) === 12 ? hours : parseInt(hours) + 12);
                newDate.minutes && newDate.minutes(minutes);
            } else {
                newDate.setHours(meridiem === "am" || parseInt(hours) === 12 ? hours : parseInt(hours) + 12, minutes);
            }
        }
        type == "timepicker" ? setStartDate(newDate) : setEndDate(newDate);
    };

    const defaultMinDate = moment();
    const setScrollingRef = useRef(null);

    useEffect(() => {
        if (startDt) {
            showDatePickerByDefault();
        }
    }, [firstTimeFlag]);

    useEffect(() => {
        if (inlineApplyButtonTrigger && dtPickedTimeStamp) {
            applyBtnValidationCheck();
        }
    }, [startDate, dtPickedTimeStamp]);

    DatePicker.handleClickOutside = () => {
        if (closeOnClickOutside) {
            cancelCalendarPopup && cancelCalendarPopup();
        }
    };

    const showDatePickerByDefault = () => {
        const calStartDiv = document.querySelector("#start-date-input-button");
        //const dialogDiv = document.querySelector(".dialog-date-picker");
        //const isDtPickerOpen = dialogDiv && dialogDiv.getAttribute("class").indexOf("open") > -1 ? true : false;

        if (calStartDiv) {
            setTimeout(function () {
                calStartDiv.click();
            }, 0);
        }
    };

    const startEndDateChange = (startDt, endDt) => {
        counter++;
        setfirstTimeLoad(false);
        const momentEndDt = endDt ? moment(endDt, showTimePicker ? "MMM DD, YYYY HH:mm:ss" : "MMM DD, YYYY") : null;

        if (startDt) {
            if (showTimePicker) {
                const { hours, minutes, meridiem } = timeObject;
                startDt.setHours(meridiem === "am" || parseInt(hours) === 12 ? hours : parseInt(hours) + 12, minutes);
            }

            const momentStDt = moment(startDt, showTimePicker ? "MMM DD, YYYY HH:mm:ss" : "MMM DD, YYYY");
            setStartDate(startDt);
            setStartDateInput(momentStDt);
            inlineApplyButtonTrigger && setDTPickedTimeStamp("dt-picked-" + Date.now());
            const startDtAfterEndDt = !momentStDt.isSameOrBefore(momentEndDt);
            if (endDt === null || startDtAfterEndDt) {
                const endDateVal = endDt ? startDtAfterEndDt ? null : endDt : null;
                setEndDate(endDateVal);
                setEndDateInput(endDateVal);
            } else {
                formReference.current.validateInputs();
            }
        }
        if (endDt) {
            if (momentEndDt.isValid()) {
                if (showTimePickerAbove) {
                    const { hours, minutes, meridiem } = timeObjectForEndDate;
                    endDt.setHours(meridiem === "am" || parseInt(hours) === 12 ? hours : parseInt(hours) + 12, minutes);
                }
                setEndDate(endDt);
                setEndDateInput(momentEndDt);
                if (validateEndDateInRangePicker) {
                    setTimeout(() => {
                        formReference.current && formReference.current.validateInputs();
                    }, 0);
                } else {
                    formReference.current && formReference.current.validateInputs();
                }
                
            }
            //startDt === null && setEndDate(startDt);
        }

        endDateChange && endDateChange(endDt);
    };

    const applyChanges = () => {
        if (ctaButtonsEnabled || insidePopup) {
            onClickApplyChanges(convertDateToMomentDt(startDate, true).format(dateRangeFormat), convertDateToMomentDt(endDate, true).format(dateRangeFormat));
        } else {
            if (!isRequired && startDateInput == null) {
                sendDateTime();
            } else if (startDate) {
                let finalStartDt = convertDateToMomentDt(startDate, true, enableBusinessTimeZone).format(showTimePicker ? "MM/DD/YYYY HH:mm:ss" : "MM/DD/YYYY");
                let finalEndDt = endDate ? convertDateToMomentDt(endDate, true, enableBusinessTimeZone).format(showTimePicker ? "MM/DD/YYYY HH:mm:ss" : "MM/DD/YYYY") : finalStartDt;
                const areSame = (finalStartDt == finalEndDt);

                if (showTimePicker && timeObject && timeObject.meridiem === "am" && parseInt(currentHour) === 12) {
                    const scheduleTime = finalStartDt.split(" ")[1];
                    let splittedTime = scheduleTime.split(":");
                    splittedTime[0] = "00";
                    splittedTime = splittedTime.join(":");
                    finalStartDt = finalStartDt.split(" ")[0] + " " + splittedTime;
                }
                if (showTimePickerAbove && timeObjectForEndDate && timeObjectForEndDate.meridiem === "am" && parseInt(currentHourForEndDate) === 12) {
                    const scheduleTime = finalEndDt.split(" ")[1];
                    let splittedTime = scheduleTime.split(":");
                    splittedTime[0] = "00";
                    splittedTime = splittedTime.join(":");
                    finalEndDt = finalEndDt.split(" ")[0] + " " + splittedTime;
                }
                // debugger;
                sendDateTime(finalStartDt, finalEndDt, areSame);
            }
        }
    };

    const inputOnBlur = (type, value, focusEndDate) => {
        const updatedVal = moment(value);
        const momentStDate = convertDateToMomentDt(startDate, true, enableBusinessTimeZone);
        const momentEndDate = convertDateToMomentDt(endDate, true, enableBusinessTimeZone);
        const formattedMinDt = getFormattedDate(defaultMinDate);
        let isDateAllowed = false;

        if (isValidDate(value)) {
            if (enableFutureDates) {
                //let a  = moment().startOf("day");
                //console.log(a);
                isDateAllowed = updatedVal >= moment().startOf("day") || updatedVal <= moment().startOf("day");
            } else {
                isDateAllowed = updatedVal < moment().endOf("day");
            }
        }

        if (isValidDate(value) && isDateAllowed) {
            if (type == "startDt") {
                const checkStartCond = enableFutureDates ? ((updatedVal.isSameOrAfter(defaultMinDate, "day") || updatedVal.isSame(formattedMinDt, "day") || updatedVal.isSameOrBefore(defaultMinDate, "day"))) : ((updatedVal.isSameOrBefore(defaultMinDate) || updatedVal.isSame(formattedMinDt, "day")));
                if (updatedVal.isValid() && (checkStartCond) && value.length == 12) {
                    if (updatedVal.isAfter(momentEndDate)) {
                        setEndDate(null);
                        setEndDateInput(null);
                    }
                    setStartDateInput(updatedVal);
                    setStartDate(getFormattedDate(updatedVal, true));
                    setStartCalenderClicked(true);
                    if (endDate) {
                        formReference.current.validateInputs();
                    }
                    showDatePickerByDefault();
                    if (focusEndDate === true) {
                        document.getElementById("endDate").focus();
                    }
                } else {
                    //error state
                    setStartDateInput(startDate ? momentStDate : "");
                }
            }
            if (type === "endDt") {
                const checkEndCond = enableFutureDates ? ((momentStDate.isSameOrBefore(updatedVal, "day") && (updatedVal.isSameOrAfter(defaultMinDate, "day") || updatedVal.isSame(formattedMinDt, "day")))) : ((momentStDate.isSameOrBefore(updatedVal) && (updatedVal.isSameOrBefore(defaultMinDate) || updatedVal.isSame(formattedMinDt, "day"))));
                if (updatedVal.isValid() && checkEndCond && value.length == 12) {
                    setEndDateInput(updatedVal);
                    setEndDate(getFormattedDate(updatedVal, true));
                    setEndCalenderClicked(true);
                    formReference.current.validateInputs();
                    showDatePickerByDefault();
                } else {
                    setEndDateInput(endDate ? momentEndDate : "");
                }
            }
        } else {
            /***** If the date is not valid  */
            if (type == "startDt") {
                const sdBlurVal = startDate ? momentStDate : "";
                setStartDateInput(sdBlurVal);
            } else if (type === "endDt") {
                const edBlurVal = endDate ? momentEndDate : "";
                setEndDateInput(edBlurVal);
            }
        }
    };

    const changeStartDtInput = (evt) => {
        const value = evt.target.value;
        const updatedVal = moment(value);

        setStartDateInput(value);
        setIsStartDateErr(true);
        setStartCalenderClicked(false);
        if (isValidDate(value) && value != "" && inlineApplyButtonTrigger) {
            setStartDate(getFormattedDate(value, true));
        }
        startDateChange && (value != "") && (isValidDate(value) && (endDate ? updatedVal <= endDate : 1)) && startDateChange(updatedVal);
    };

    const changeEndDtInput = (evt) => {
        const value = evt.target.value;
        const updatedVal = moment(value);

        setEndDateInput(value);
        setIsEndDateErr(true);
        setEndCalenderClicked(false);

        endDateChange && (value != "") && (isValidDate(value) && (startDate ? updatedVal >= startDate : 1)) && endDateChange(updatedVal);

        // if (isValidDate(value)) {
        //     setEndCalenderClicked(true);
        //     setEndDate(updatedVal);
        // }
    };

    const getFormattedDate = (date, forDtPicker) => {
        if (forDtPicker) {
            return date ? new Date(date) : new Date();
        } else if (date && typeof date != "string" && isValidDate(date)) {
            return date.format("MMM DD, YYYY");
        }
        return date;
    };

    const isValidDate = (dateVal) => {
        // var dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/;

        // return dateReg.test(dateVal);

        return moment(dateVal, "MM/DD/YYYY", true).isValid() || moment(dateVal, "M/D/YYYY", true).isValid() || moment(dateVal, "MMM DD, YYYY", true).isValid();
    };

    const resetStartDt = () => {
        if (startDateInput) {
            setStartDateInput(null);
        }
    };

    const resetEndDt = () => {
        if (endDateInput) {
            setEndDateInput(null);
        }
    };

    const applyBtnValidationCheck = () => {
        if (!isRequired && startDateInput == null) {
            applyChanges();
            return;
        }
        if (startDate) {
            const momentStDt = formatDate(startDate, "UK");

            setStartDateInput(momentStDt);
        }
        if (endDate) {
            const momentEndDt = formatDate(endDate, "UK");
            setEndDateInput(momentEndDt);
        }
        if (!startDate || !endDate) {
            formReference.current.validateInputs();
        }
        if (!Object.keys(formReference.current.failedValidations).length) {
            // Check for 12 am case -> convert to 00 for 24hr format
            const { meridiem = null } = timeObject;
            let updatedStartDate = meridiem === "am" && parseInt(currentHour) === 12 ? moment(startDate).format("MMM DD, YYYY hh:mm:ss") : startDate;
            if (timeObject && timeObject.meridiem === "am" && parseInt(currentHour) === 12) {
                const scheduleTime = updatedStartDate.split(" ")[1];
                let splittedTime = scheduleTime.split(":");
                splittedTime[0] = "00";
                splittedTime = splittedTime.join(":");
                updatedStartDate = updatedStartDate.split(" ")[0] + " " + splittedTime;
            }

            if (showTimePicker && validateTime && !validateTime(updatedStartDate, meridiem, startDate)) {
                showValidateTimeError();
            } else {
                applyChanges();
            }
        }
    };

    const startEndKeyUp = (type, e) => {
        const value = e.target.value;
        if (e.key === "Enter" || e.keyCode === 13) {
            const isStartDt = type === "startDt";
            inputOnBlur(type, value, isStartDt);
        }
    };

    const showTimePickers = () => {
        return (
            <Fragment>
                <Timepicker
                    changeTime={(e, key) => changeTime(e, key, "timepicker")}
                    timeObject={timeObject}
                    timezoneLabel={timezoneLabel}
                />
                <Timepicker
                    changeTime={(e, key) => changeTime(e, key, "timePickerForEndDate")}
                    timeObject={timeObjectForEndDate}
                    timezoneLabel={timezoneLabel}
                />
            </Fragment>
        );
    };

    return (
        <div data-testid="el-test-date-picker" style={style} className={`el-datepicker ${styles["google-datepicker"]} cx-datepicker ${getEncodedStyleClass(dynamicClassWithHeritance, styles)}`} onClick={(e) => {
            !ignorePreventDefault && e.preventDefault();
        }}>
            <div>
                {title && <div className={styles["date-picker-popoup"]}>
                    <p>{title}</p>
                    <i onClick={() => setShowScheduleDatePicker(false)} data-testid="el-test-dp-title-close-icon" className="icon_phoenix-enclose" />
                </div>}
                <Form
                    onSubmit={applyChanges}
                    maxErrorsToShow={2}
                    autoComplete={"off"}
                    showErrorsAtFormlevel={false}
                    errorsInline
                    ref={formReference}
                >
                    <div className={styles["datepicker-head"]} key={counter}>
                        <div className="pos-rel">
                            <FormInput
                                type={"text"}
                                id={"startDate"}
                                name={"startDate"}
                                autocomplete={"on"}
                                value={startDateInput ? (showInboxDateFormat ? formatDateTimeStamp(startDateInput, true, null, true) : getFormattedDate(startDateInput)) : ""}
                                onChange={changeStartDtInput}
                                onBlur={!startCalenderClicked ? (value) => inputOnBlur("startDt", value) : null}
                                className={`${isStartDateErr ? " add-date-error" : ""}`}
                                placeholder={showInboxDateFormat ? "MMM DD, YYYY" : "MMM DD, YYYY"}
                                maxLength="12"
                                trimOnBlur
                                showLeftIcon
                                customIconClass={"icon_phoenix-calendar"}
                                tooltip={{
                                    align: "bottom",
                                    position: "bottom"
                                }}
                                required
                                errorMessages={{
                                    required: `Enter a date and try again`,
                                    validDate: `Enter a valid date and try again`
                                }}
                                //autoFocus={!isIpad}
                                validationTrigger={startDate ? "onChange" : "onBlur"}
                                showErrorOnWrapper
                                setErrorInParent={(validationClasses) => {
                                    const hideCross = validationClasses.indexOf("invalid-error") > -1;
                                    setShowStartCross(!hideCross);
                                }}
                                key={"st_" + (counter + 1)}
                                forceUpdate
                                keyCheck={(e) => startEndKeyUp.bind("startDt", e)}
                                autoComplete={"off"}
                            //showGreenTick
                            />
                            {showStartCross && <i className="icon_phoenix-reset" onClick={resetStartDt} />}
                            {showInfo && <div className={`${styles["date-picker-info"]} date-info`}>
                                <i className="icon_phoenix-info-fill" />
                                <p>{infoText}</p>
                            </div>}
                        </div>
                        {
                            range &&
                            <Fragment><span className={`icon-plus_close ${styles["divider"]}`} />
                                <div className="pos-rel">
                                    <FormInput
                                        type={"text"}
                                        id={"endDate"}
                                        name={"endDate"}
                                        value={endDateInput ? getFormattedDate(endDateInput) : ""}
                                        autocomplete={"on"}
                                        onChange={changeEndDtInput}
                                        onBlur={!endCalenderClicked ? (value) => inputOnBlur("endDt", value) : null}
                                        isBlueJay
                                        className={`${isEndDateErr ? " add-date-error" : ""}`}
                                        placeholder="MMM DD, YYYY"
                                        maxLength="12"
                                        trimOnBlur
                                        showLeftIcon
                                        customIconClass={"icon_phoenix-calendar"}
                                        tooltip={{
                                            align: "bottom",
                                            position: "bottom"
                                        }}
                                        required
                                        errorMessages={{
                                            required: `Enter a date and try again`,
                                            validDate: `Enter a valid date and try again`

                                        }}
                                        validationTrigger={endDate ? "onChange" : "onBlur"}
                                        showErrorOnWrapper
                                        setErrorInParent={(validationClasses) => {
                                            const hideCross = validationClasses.indexOf("invalid-error") > -1;
                                            setShowEndCross(!hideCross);
                                        }}
                                        key={"ed_" + (counter + 1)}
                                        forceUpdate
                                        keyCheck={(e) => startEndKeyUp("endDt", e)}
                                        autoComplete={"off"}
                                    />
                                    {showEndCross && <i className="icon_phoenix-reset" onClick={resetEndDt} />}
                                </div>
                            </Fragment>
                        }
                    </div>
                    {showTimePickerAbove && <div>{showTimePickers()}</div>}
                </Form>
                <div key={counter + 1} ref={setScrollingRef}>
                    {
                        range ? <RangeDatePicker
                            startDate={startDate ? startDate : new Date()}
                            endDate={endDate ? endDate : undefined}
                            onChange={(sd, ed) => startEndDateChange(sd, ed)}
                            dateFormat="MMM DD, YYYY"
                            minDate={explicitMinDt ? explicitMinDt : enableFutureDates ? getFormattedDate(moment(), true) : undefined}
                            maxDate={explicitMaxDt ? explicitMaxDt : enableFutureDates ? undefined : getFormattedDate(null, true)}
                            startDatePlaceholder="Start Date"
                            endDatePlaceholder="End Date"
                            startWeekDay="sunday"
                            monthFormat={"MMMM YYYY"}
                            onFocus={() => {
                                if (setScrollingRef && openCallback) {
                                    openCallback(setScrollingRef.current);
                                }
                            }}
                        //key={Math.random()}
                        //weekDayFormat={"dd dd"}
                        /> :
                            <SingleDatePicker
                                startDate={singleDatePickerStartDate}
                                onChange={(sd) => startEndDateChange(sd)}
                                dateFormat="MMM DD, YYYY"
                                minDate={explicitMinDt ? explicitMinDt :  (typeof disablePastDates !== "undefined" ? disablePastDates : enableFutureDates)  ? getFormattedDate(moment(), true) : undefined}
                                maxDate={explicitMaxDt ? explicitMaxDt : enableFutureDates ? undefined : getFormattedDate(null, true)}
                                startDatePlaceholder="Choose Date"
                                startWeekDay="sunday"
                                monthFormat={"MMMM YYYY"}
                                singleCalendar
                                onFocus={() => {
                                    if (setScrollingRef && openCallback) {
                                        openCallback(setScrollingRef.current);
                                    }
                                }}
                            />
                    }
                    {showTimezone ? (enableBusinessTimeZone ? <label className={styles["horizontalCenter"]}>{businessTimeZoneLabel}</label> : <label className={styles["horizontalCenter"]}>{browserTimezoneName}</label>) : null
                    }
                    {showTimePicker && !showTimePickerAbove ? <Timepicker
                        changeTime={(e, key) => changeTime(e, key, "timepicker")}
                        timeObject={timeObject}
                        timezoneLabel={timezoneLabel}
                    /> : null}
                    {showApplyButtons ? (<div className="btnWrapper">
                        <Button
                            type={"link"}
                            label={"Cancel"}
                            role={"button"}
                            onClick={cancelCalendarPopup}
                        />
                        <Button
                            label={applyButtonLabel || "Apply"}
                            type="button"
                            onClick={applyBtnValidationCheck}
                            role={"button"}
                            className="width-auto"
                        //disabled={isStartDateErr || isEndDateErr || !startDt || !endDt}
                        />
                    </div>) : null}
                </div>
            </div>
        </div>
    );
};

DatePicker.propTypes = {
    title: PropTypes.string,
    setShowScheduleDatePicker: PropTypes.func,
    sendDateTime: PropTypes.func,
    ctaButtonsEnabled: PropTypes.func,
    onClickApplyChanges: PropTypes.func,
    startDateChange: PropTypes.func,
    endDateChange: PropTypes.func,
    name: PropTypes.string,
    showPicker: PropTypes.bool,
    insidePopup: PropTypes.bool,
    explicitMinDt: PropTypes.bool,
    startDt: PropTypes.string,
    endDt: PropTypes.string,
    enableFutureDates: PropTypes.bool,
    disablePastDates: PropTypes.bool,
    dateRangeFormat: PropTypes.string,
    explicitMaxDt: PropTypes.string,
    firstTimeFlag: PropTypes.bool,
    cancelCalendarPopup: PropTypes.func,
    style: PropTypes.object,
    dynamicClass: PropTypes.string,
    range: PropTypes.bool,
    closeOnClickOutside: PropTypes.func,
    openCallback: PropTypes.func,
    showValidateTimeError: PropTypes.func,
    validateTime: PropTypes.func,
    showTimePicker: PropTypes.bool,
    ignorePreventDefault: PropTypes.bool, //Used to avoid e.preventDefault() : It was blocking clickHandling in timepicker singleselect
    applyButtonLabel: PropTypes.string,
    timezoneLabel: PropTypes.string,
    showInboxDateFormat: PropTypes.bool,
    showTimezone: PropTypes.bool,
    datePickerLabel: PropTypes.string,
    showInfo: PropTypes.bool,
    infoText: PropTypes.string,
    showTimePickerAbove: PropTypes.bool,
    isRequired: PropTypes.bool,
    showApplyButtons: PropTypes.bool,
    inlineApplyButtonTrigger: PropTypes.bool,
    enableBusinessTimeZone: PropTypes.bool,
    validateEndDateInRangePicker: PropTypes.bool
};

DatePicker.defaultProps = {
    enableFutureDates: false,
    range: true,
    showTimezone: false,
    showApplyButtons: true,
    inlineApplyButtonTrigger: false
};

const clickOutsideConfig = {
    handleClickOutside: () => DatePicker.handleClickOutside
};

class DatePickerWrapper extends Component {
    render() {
        return <DatePicker {...this.props} />;
    }
}

export default onClickOutside(DatePickerWrapper, clickOutsideConfig);