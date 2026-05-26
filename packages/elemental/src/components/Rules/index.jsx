/* eslint-disable react/no-multi-comp */
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Rules.module.scss";
import SingleSelect from "atoms/SingleSelect";
import FormInput from "atoms/FormInput";
import Button from "atoms/Button";
import Form from "components/Form";
import MultiSelect from "atoms/Multiselect";
import { OPERATORS, VALIDATION_ERRORS, FIELD_DATA_TYPES, FIELD_NAME, DELIMETER, CUSTOMER_TYPE, WEEK_DAYS } from "./constants";
import {
    getFieldLabelOptions,
    getSeparateFieldTypeAndValue,
    getFilterConditionObj,
    getTagValues,
    isValidDateValue,
    getDateCustomVal,
    getTextMultiValues,
    convertListToSelectOptions,
    showSearch,
    convertListToSelectOptionsDoctor,
    convertListToSelectOptionsServices,
    // getViewSchModeStr,
    convertListToSelectStatusOptions,
    getFields,
    convertListToSelectOptionsSecondaryFilterChoices,
    getFilterOptions,
    getDefaultAllowedDays,
    getCustomTimeOptions,
    getReviewValues,
    getDripTime,
    getReviewSource,
    getStatusType
} from "./helper";
import { getSelectOptions, convertFromEpochTime, convertToEpochTime } from "utils";
import { CAMPAIGN_TYPE, TRIGGER_TYPE } from "./constants";
import ValueDropdown from "./ValueDropdown";

const Rules = (props) => {
    const {
        mode,
        field,
        condition,
        value,
        index,
        deleteRuleFromQuery,
        fields,
        addRuleCallBack,
        modeChangeCallback,
        tags,
        showNumber,
        updateFieldFiltersList,
        arrayChangedAfterDelete,
        showTop,
        openCallback,
        editModeConditionCallback,
        editModeConditionScheduleCallback,
        filterOptions,
        availableAssignees,
        extraValueSources,
        surveyData,
        notSendSurveyHit,
        filterReviewRatingsCase,
        filterReviewRatings,
        selectedTrigger,
        availableDoctors,
        availableServices,
        campaignType,
        isAppointment,
        addNewScheduleCallBack,
        deleteScheduleFromQuery,
        schedule,
        scheduleBy,
        sendOrder,
        scheduleAt,
        allowedDays,
        sendTime,
        accountSpecialist,
        id,
        secondaryFilterOptions,
        isSecondaryFilter,
        setShowCustomFilterList,
        hideTagsFromFieldFilters,
        alignRightOnOpenFiledFilter,
        fromFilterPopup,
        allowPostiveNumbersOnly,
        isAppointmentReminderTrigger,
        fromTriggerSection,
        isAppointmentTimeAvailable,
        appointmentCustomFields,
        extraOperatorForAutomation,
        hideReviewFromFieldFilters,
        isWroteAReviewMultiple,
        confirmRuntimeModal,
        reEvalAtRuntime,
        getConfirmationRuntimeSessionFlag,
        businessData = {}
    } = props;

    const fieldArray = filterOptions ? getFilterOptions(selectedTrigger, filterOptions, appointmentCustomFields) : fields;
    let filterSurvey = false;
    if (selectedTrigger === TRIGGER_TYPE.SURVEY_COMPLETED.value) {
        filterSurvey = !(!!surveyData.length || (extraValueSources && extraValueSources[4] && !!extraValueSources[4].length));
    }
    let fieldOptions = !isAppointment && getFieldLabelOptions(fieldArray.filter(option => !option.hidden && !option.deleted && !(hideTagsFromFieldFilters && option.fieldName == "Tags") && !(hideReviewFromFieldFilters && option.fieldName === "Wrote a review")), filterSurvey, accountSpecialist, secondaryFilterOptions, (isAppointmentReminderTrigger || selectedTrigger === TRIGGER_TYPE.APPOINTMENT_BOOKED.value), campaignType);
    const tagOptions = filterOptions ? [] : getSelectOptions(tags, { labelKey: "name", valueKey: "id", labelPrefix: "" }, "", true);
    const reviewSources = getReviewSource(window.BE?.business || businessData);
    const { fieldId, typeValue } = field ? getSeparateFieldTypeAndValue(field) : { typeValue: "" };
    const surveyDataFiltered = surveyData ? convertListToSelectOptions(surveyData, "surveyId", true) : [];
    const doctorsDataFiltered = availableDoctors ? convertListToSelectOptionsDoctor(availableDoctors, "doctorsName", true) : [];
    const appointmentStatusFiltered = convertListToSelectStatusOptions(getStatusType(campaignType !== CAMPAIGN_TYPE.APPOINTMENT_RECALL));
    const servicesDataFiltered = availableServices ? convertListToSelectOptionsServices(availableServices, "servicesName", true) : [];
    const sourceTypeFilteredChoices = selectedTrigger === TRIGGER_TYPE.APPOINTMENT_BOOKED.value || selectedTrigger === TRIGGER_TYPE.APPOINTMENT_CANCELED.value || selectedTrigger === TRIGGER_TYPE.APPOINTMENT_COMPLETED.value || selectedTrigger === TRIGGER_TYPE.APPOINTMENT_MISSED.value || selectedTrigger == TRIGGER_TYPE.BEFORE_APPOINTMENT_DATE.value ? extraValueSources[5] : [];
    const customerTypeFilteredChoices = convertListToSelectStatusOptions(CUSTOMER_TYPE);
    const formStatusFilteredChoices = isAppointmentReminderTrigger ? extraValueSources[6] : [];
    const weekDayFilteredChoices = convertListToSelectStatusOptions(WEEK_DAYS);
    const fieldName = field ? field.split(DELIMETER)[1] : "";
    const [conditionObj, setConditionObj] = useState({
        currentMode: mode,
        selectedField: field,
        selectedCondition: condition,
        selectedValue: value,
        operatorOptions: field ? (typeValue ? getFields(fieldName === FIELD_DATA_TYPES.TAG.label ? FIELD_DATA_TYPES.TAG.label.toUpperCase()
            : fieldName === FIELD_DATA_TYPES.REVIEW.label ? "REVIEW" : typeValue.toUpperCase(), isSecondaryFilter, isSecondaryFilter && secondaryFilterOptions[fieldId].questionType === "matrixrating", extraOperatorForAutomation).operators : []) : [],
        selectedType: typeValue || "",
        selectedId: fieldId || "",
        customFieldSource: field ? getSeparateFieldTypeAndValue(field).customFieldSource : ""
    });
    const [scheduleInfo, setScheduleInfo] = useState({
        selectedSchedule: schedule,
        selectedScheduleBy: scheduleBy,
        selectedSendOrder: sendOrder,
        selectedScheduleAt: scheduleAt,
        selectedAllowedDays: allowedDays,
        selectedSendTime: sendTime,
        selectedScheduleCurrentMode: mode,
        selectedScheduleId: 0
    });

    const [schCount, setSchCount] = useState(0);
    const [scheduleErr, setScheduleErr] = useState({
        show: false,
        showStr: " "
    });
    const [timeErr, setTimeErr] = useState({
        show: false,
        showStr: " "
    });

    const [wroteReviewErr, setWroteReviewErr] = useState({
        show: false,
        showStr: " "
    });
    useEffect(() => {
        setConditionObj({ ...conditionObj, selectedValue: value });
    }, [value]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [invalidDate, setInvalidDate] = useState(false);
    const [invalidTagInput, setInvalidTagInput] = useState(false);
    const [valueCounter, setValueCounter] = useState(0);
    const [showAddBtn, setShowAddBtn] = useState(isAppointment ? id === "" ? true : false : field === "" ? true : false);
    const [secondaryFilterChoicesFilteredData, setSecondaryFilterChoicesFilteredData] = useState(isSecondaryFilter && fieldId ? convertListToSelectOptionsSecondaryFilterChoices(secondaryFilterOptions[fieldId].questionChoices) : []);

    let formReference = useRef(null);
    let count = 0;

    useEffect(() => {
        if (arrayChangedAfterDelete) {
            const { fieldId, typeValue } = field ? getSeparateFieldTypeAndValue(field) : { typeValue: "" };
            const fieldName = field ? field.split(DELIMETER)[1] : "";
            setConditionObj({
                currentMode: mode,
                selectedField: field,
                selectedCondition: condition,
                selectedValue: value,
                operatorOptions: field ? (typeValue ? getFields(fieldName === FIELD_DATA_TYPES.TAG.label ? FIELD_DATA_TYPES.TAG.label.toUpperCase()
                    : fieldName === FIELD_DATA_TYPES.REVIEW.label ? "REVIEW" : typeValue.toUpperCase(), isSecondaryFilter, isSecondaryFilter && secondaryFilterOptions[fieldId].questionType === "matrixrating", extraOperatorForAutomation).operators : []) : [],
                selectedType: typeValue || "",
                selectedId: fieldId || ""
            });

            setValueCounter(valueCounter + 1);
        }

    }, [field]);

    // Handle invalid wrote a review state
    useEffect(() => {
        if (hideReviewFromFieldFilters && fieldName === "Wrote a review") {
            handleInvalidReviewField();
        }
    }, [hideReviewFromFieldFilters]);

    useEffect(() => {
        if (isWroteAReviewMultiple && fieldName === "Wrote a review") {
            setWroteReviewErr({
                show: true,
                showStr: "You cannot choose wrote a review filter more than once."
            });
        } else setWroteReviewErr({
            show: false,
            showStr: ""
        });
    }, [isWroteAReviewMultiple, mode, value, condition, fieldName, conditionObj]);

    useEffect(() => {
        setScheduleInfo({ ...scheduleInfo, selectedSchedule: schedule });
    }, [schedule]);

    useEffect(() => {
        if (arrayChangedAfterDelete) {
            const scheduleFieldId = scheduleBy === "hours" ? "1" : "2";
            setScheduleInfo({
                selectedSchedule: schedule,
                selectedScheduleBy: scheduleBy,
                selectedSendOrder: sendOrder,
                selectedScheduleAt: scheduleAt,
                selectedAllowedDays: allowedDays,
                selectedSendTime: sendTime,
                selectedScheduleCurrentMode: mode,
                selectedScheduleId: scheduleFieldId
            });
            setSchCount(schCount + 1);
        }
    }, [scheduleBy, schedule, sendOrder, scheduleAt, allowedDays, sendTime]);

    const {
        selectedId,
        selectedType,
        selectedField,
        selectedCondition,
        selectedValue,
        operatorOptions,
        customFieldSource
    } = conditionObj;

    const {
        selectedSchedule,
        selectedScheduleBy,
        selectedSendOrder,
        selectedScheduleAt,
        selectedAllowedDays,
        selectedSendTime,
        selectedScheduleId
    } = scheduleInfo;

    const [customDateVal, setCustomDateVal] = useState(selectedType === FIELD_DATA_TYPES.DATE.value ? getDateCustomVal(selectedValue[0] ? convertFromEpochTime(selectedValue[0], "MMM DD, YYYY") : null, selectedValue[1] ? convertFromEpochTime(selectedValue[1], "MMM DD, YYYY") : null) : "Dates");

   const addRule = async () => {
        try {
            if(getConfirmationRuntimeSessionFlag){
                const confirmationRuntimeSessionFlag = getConfirmationRuntimeSessionFlag();
                if (reEvalAtRuntime && !confirmationRuntimeSessionFlag) {
                    await confirmRuntimeModal();
                }
            }
            if (timeErr.show || wroteReviewErr.show) {
                return;
            }
            setShowAddBtn(false);
            let condObj = getFilterConditionObj(selectedId, selectedType, selectedField, selectedCondition, selectedValue, customFieldSource);
            setConditionObj({
                ...conditionObj,
                selectedValue: condObj["value"],
                currentMode: "view"
            });
    
            if (fromTriggerSection) {
                if (fieldName === FIELD_NAME.ASSIGNEE) {
                    const selectedAssignees = { T: [], U: [] };
                    const allAssignees = [...availableAssignees.teams, ...availableAssignees.users];
                    for (let selected of selectedValue) {
                        const assignee = allAssignees.find(assignee => assignee.value === selected);
                        selectedAssignees[assignee.type].push(assignee.value);
                    }
                    condObj = { ...condObj, value: selectedAssignees };
                }
                if (fieldName === FIELD_NAME.SPECIALIST) {
                    const selectedDoctor = [];
                    const allDoctors = [...doctorsDataFiltered];
                    for (let selected of selectedValue) {
                        const doctor = allDoctors.find(doctor => doctor.value === selected);
                        selectedDoctor.push(doctor.value);
                    }
                    condObj = { ...condObj, value: selectedDoctor };
                }
        
                if (fieldName === FIELD_NAME.APPOINTMENT_STATUS) {
                    const selectedStatus = [];
                    const allStatus = [...appointmentStatusFiltered];
                    for (let selected of selectedValue) {
                        const status = allStatus.find(status => status.value === selected);
                        selectedStatus.push(status.value);
                    }
                    condObj = { ...condObj, value: selectedStatus };
                }
    
                if (fieldName === FIELD_NAME.APPOINTMENT_TYPE) {
                    const selectedService = [];
                    const allServices = [...servicesDataFiltered];
                    for (let selected of selectedValue) {
                        const service = allServices.find(service => service.value === selected);
                        selectedService.push(service.value);
                    }
                    condObj = { ...condObj, value: selectedService };
                }
    
                if (fieldName === FIELD_NAME.SOURCE) {
                    const selectedSource = [];
                    const allSources = [...sourceTypeFilteredChoices];
                    for (let selected of selectedValue) {
                        const source = allSources.find(source => source.value === selected);
                        selectedSource.push(source.value);
                    }
                    condObj = { ...condObj, value: selectedSource };
                }
    
                if (fieldName === FIELD_NAME.CUSTOMER_TYPE) {
                    const selectedCustomer = [];
                    const allCustomers = [...customerTypeFilteredChoices];
                    for (let selected of selectedValue) {
                        const customer = allCustomers.find(customer => customer.value === selected);
                        selectedCustomer.push(customer.value);
                    }
                    condObj = { ...condObj, value: selectedCustomer };
                }
    
                if (fieldName === FIELD_NAME.FORM_STATUS) {
                    const selectedFormStatus = [];
                    const allFormStatus = [...formStatusFilteredChoices];
                    for (let selected of selectedValue) {
                        const formStatus = allFormStatus.find(formStatus => formStatus.value === selected);
                        selectedFormStatus.push(formStatus.value);
                    }
                    condObj = { ...condObj, value: selectedFormStatus };
                }
            }
    
            if (selectedType === FIELD_DATA_TYPES.TEXT_MULTI.value && isSecondaryFilter) {
                const selectedChoices = [];
                const allChoices = [...secondaryFilterChoicesFilteredData];
                for (let selected of selectedValue) {
                    const choice = allChoices.find(choice => choice.value === selected);
                    selectedChoices.push(choice.value);
                }
                condObj = { ...condObj, value: selectedChoices };
            }
    
            addRuleCallBack(condObj, index);
            editModeConditionCallback && editModeConditionCallback({
                currentMode: "add",
                index
            });
            setShowCustomFilterList(false);
        } catch {
            console.log("Cancelled the add rule");
        }

    };

    const addSchedule = () => {
        setShowAddBtn(false);
        if (selectedSchedule == "" || selectedSchedule == null || selectedSchedule == 0) {
            setScheduleErr({
                ...scheduleErr, show: true, showStr: "Please enter a value greater than 0."
            });
            return;
        }

        setScheduleErr({
            ...scheduleErr, show: false
        });

        let schObj = {
            "scheduleId": selectedScheduleId,
            "scheduled": selectedSchedule,
            "scheduleBy": selectedScheduleBy,
            "scheduleAt": selectedScheduleAt,
            "allowedDays": selectedAllowedDays,
            "sendTime": selectedSendTime,
            "sendOrder": selectedSendOrder,
            "mode": "view"
        };

        setScheduleInfo({
            ...scheduleInfo,
            selectedSchedule: schObj["scheduled"],
            selectedScheduleCurrentMode: "view",
            selectedScheduleBy: schObj["scheduleBy"],
            selectedScheduleAt: schObj["scheduleAt"],
            selectedAllowedDays: schObj["allowedDays"],
            selectedSendTime: schObj["sendTime"],
            selectedSendOrder: schObj["sendOrder"]
        });
        addNewScheduleCallBack(schObj, index);
        editModeConditionScheduleCallback && editModeConditionScheduleCallback({
            currentMode: "add",
            index
        });
    };

    const updateOperatorOptions = (field) => {
        setShowAddBtn(true);
        const conjoinedValue = field.value;
        const { fieldId, fieldValue, typeValue, customFieldSource } = conjoinedValue ? getSeparateFieldTypeAndValue(conjoinedValue) : { fieldId: "", fieldValue: "", typeValue: "" };
        if (typeValue === FIELD_DATA_TYPES.TEXT_MULTI.value && isSecondaryFilter) {
            let choices = convertListToSelectOptionsSecondaryFilterChoices(secondaryFilterOptions[fieldId].questionChoices);
            setSecondaryFilterChoicesFilteredData(choices);
        }
        const newCondObj = {
            ...conditionObj,
            selectedType: typeValue,
            selectedId: fieldId,
            selectedCondition: "",
            selectedValue: [],
            selectedField: fieldValue,
            customFieldSource,
            operatorOptions: typeValue ? getFields(field.label === FIELD_DATA_TYPES.TAG.label ? FIELD_DATA_TYPES.TAG.label.toUpperCase()
                : field.label === FIELD_DATA_TYPES.REVIEW.label ? "REVIEW" : typeValue.toUpperCase(), isSecondaryFilter, isSecondaryFilter && secondaryFilterOptions[fieldId].questionType === "matrixrating", extraOperatorForAutomation).operators : []
        };
        setConditionObj(newCondObj);
        //update the fieldfilters object with whole object
        updateFieldFiltersList(newCondObj, index);
        setValueCounter(valueCounter + 1);
        editModeConditionCallback && editModeConditionCallback({
            currentMode: "edit",
            index
        });
        let selectedValue = (newCondObj && newCondObj.selectedField && newCondObj.selectedField.split(DELIMETER)[0]);
        if ((isAppointmentTimeAvailable && isAppointmentTimeAvailable == true) && (selectedValue && selectedValue == "16")) {
            setTimeErr({
                ...timeErr, show: true, showStr: "You cannot choose appointment time filter more than once."
            });
            return;
        }
        setTimeErr({
            ...timeErr, show: false
        });
    };

    const handleTagsChange = (data) => {
        setShowAddBtn(true);
        setConditionObj({
            ...conditionObj,
            selectedValue: getTagValues(data)
        });
        setValueCounter(valueCounter + 1);
        editModeConditionCallback && editModeConditionCallback({
            currentMode: "edit",
            index
        });
    };
    const handleReviewSourceChange = (data) => {
        setShowAddBtn(true);
        setConditionObj({
            ...conditionObj,
            selectedValue: getReviewValues(data)
        });
        setValueCounter(valueCounter + 1);
        editModeConditionCallback && editModeConditionCallback({
            currentMode: "edit",
            index
        });
    };

    const handleInvalidReviewField = () => {
        setShowAddBtn(true);
        const initialState = {
            currentMode: "edit",
            selectedField: "",
            selectedCondition: "",
            selectedValue: [],
            operatorOptions: [],
            selectedId: "",
            selectedType: "",
            customFieldSource: ""
        };
        setConditionObj(initialState);
        editModeConditionCallback && editModeConditionCallback({
            currentMode: "edit",
            index
        });
    };

    const handleTextMultiChange = (data) => {
        setShowAddBtn(true);
        setConditionObj({
            ...conditionObj,
            selectedValue: getTextMultiValues(data)
        });
        setValueCounter(valueCounter + 1);
        filterReviewRatings(fieldName);
        editModeConditionCallback && editModeConditionCallback({
            currentMode: "edit",
            index
        });
    };

    const handleSingleNumberChange = (data) => {
        setShowAddBtn(true);
        setConditionObj({
            ...conditionObj,
            selectedValue: [(data.value)]
        });
        setValueCounter(valueCounter + 1);
        editModeConditionCallback && editModeConditionCallback({
            currentMode: "edit",
            index
        });
    };

    const updateTagInput = (data, tags) => {
        setShowAddBtn(true);
        log(data);
        setInvalidTagInput(false);
        setConditionObj({
            ...conditionObj,
            selectedValue: tags
        });
        editModeConditionCallback && editModeConditionCallback({
            currentMode: "edit",
            index
        });
    };

    const handleDatePickerChange = (startDt, endDt, areSame, isRange) => {
        setShowAddBtn(true);
        if (isRange) {
            const customText = getDateCustomVal(startDt, endDt, areSame, false);
            setConditionObj({
                ...conditionObj,
                selectedValue: [convertToEpochTime(startDt, true), convertToEpochTime(endDt, true)]
            });
            setCustomDateVal(customText);
            setValueCounter(valueCounter + 1);
        } else {
            setConditionObj({
                ...conditionObj,
                selectedValue: [convertToEpochTime(startDt, true)]
            });
            const customText = getDateCustomVal(startDt, endDt, areSame, false);
            setCustomDateVal(customText);
            setValueCounter(valueCounter + 1);
        }
        editModeConditionCallback && editModeConditionCallback({
            currentMode: "edit",
            index
        });
    };
    const updateChosenTime = (data) => {
        if (data && data.startTime && data.startTime.value) {
            setConditionObj({
                ...conditionObj,
                selectedValue: [data.startTime.value, conditionObj.selectedValue[1]]
            });
        }
        if (data && data.endTime && data.endTime.value) {
            setConditionObj({
                ...conditionObj,
                selectedValue: [conditionObj.selectedValue[0], data.endTime.value]
            });
        }

        if (data && data.beforeAfterTime && data.beforeAfterTime.value) {
            setConditionObj({
                ...conditionObj,
                selectedValue: [data.beforeAfterTime.value]
            });
        }
    };
    const getValueJsx = () => {
        return (<ValueDropdown
            selectedType={conditionObj.selectedType}
            selectedField={selectedField}
            splittedVal={selectedField.split(DELIMETER)[1]}
            selectedValue={conditionObj.selectedValue}
            tagOptions={tagOptions}
            reviewSources={reviewSources}
            handleTagsChange={handleTagsChange}
            handleReviewSourceChange={handleReviewSourceChange}
            showSearch={showSearch}
            openCallback={openCallback}
            alignRightOnOpenFiledFilter={alignRightOnOpenFiledFilter}
            fromFilterPopup={fromFilterPopup}
            showTop={showTop}
            selectedCondition={conditionObj.selectedCondition}
            customDateVal={customDateVal}
            setShowDatePicker={setShowDatePicker}
            showDatePicker={showDatePicker}
            handleDatePickerChange={handleDatePickerChange}
            invalidDate={invalidDate}
            updateChosenTime={updateChosenTime}
            modeChangeCallback={modeChangeCallback}
            editModeConditionCallback={editModeConditionCallback}
            index={index}
            getDripTime={getDripTime}
            extraValueSources={extraValueSources}
            handleTextMultiChange={handleTextMultiChange}
            fromTriggerSection={fromTriggerSection}
            fieldName={fieldName}
            filterReviewRatingsCase={filterReviewRatingsCase}
            notSendSurveyHit={notSendSurveyHit}
            surveyDataFiltered={surveyDataFiltered}
            availableAssignees={availableAssignees}
            doctorsDataFiltered={doctorsDataFiltered}
            appointmentStatusFiltered={appointmentStatusFiltered}
            servicesDataFiltered={servicesDataFiltered}
            sourceTypeFilteredChoices={sourceTypeFilteredChoices}
            customerTypeFilteredChoices={customerTypeFilteredChoices}
            formStatusFilteredChoices={formStatusFilteredChoices}
            weekDayFilteredChoices={weekDayFilteredChoices}
            secondaryFilterChoicesFilteredData={secondaryFilterChoicesFilteredData}
            isSecondaryFilter={isSecondaryFilter}
            handleSingleNumberChange={handleSingleNumberChange}
            allowPostiveNumbersOnly={allowPostiveNumbersOnly}
            valueCounter={valueCounter}
            updateTagInput={updateTagInput}
            invalidTagInput={invalidTagInput}
            setConditionObj={setConditionObj}
            setShowAddBtn={setShowAddBtn}
            conditionObj={conditionObj}
            setInvalidDate={setInvalidDate}
        />);
    };

    const getEditModeJsx = () => {
        return (
            <div data-testid="el-test-rules" className={`el-rules ${styles['condition-wrap']} rule-wrap`}>
                {showNumber && <span className="badges badge-light mr-10">{index + 1}</span>}

                <Form
                    id="fieldFilterRule"
                    maxErrorsToShow={5}
                    includeUncheckedInputs
                    errorsInline
                    showErrorsAtFormlevel={false}
                    ref={formReference}
                    className={`el-field-wrap ${styles["field-wrap"]}`}
                >
                    <div className="question-section-wrap display-flex display-flex-center">
                        <div className={`${isSecondaryFilter && "question-singleselect"} ${(timeErr.show || wroteReviewErr.show) ? styles["appointment-time-error"] : ""}`}>
                            <SingleSelect
                                name="field"
                                options={fieldOptions}
                                placeholder={"Select field"}
                                displayLabel={"Select field"}
                                required
                                onChange={updateOperatorOptions}
                                //className="w-240 mr-10 mb-0"
                                className={(timeErr.show || wroteReviewErr.show) ? `${styles["show-error"]} w-240 mr-10 mb-0` : "w-240 mr-10 mb-0"}
                                resetParam={{ value: "" }}
                                selected={selectedField}
                                isResetAllowed
                                showSearch={showSearch(fieldOptions)}
                                searchPlaceHolder={"Search"}
                                errorMessages={{
                                    required: VALIDATION_ERRORS.EMPTY_FIELD
                                }}
                                validationTrigger="onChange"
                                showErrorOnWrapper
                                setErrorInParent={() => { }}
                                capitalizeSelectedValue={false}
                                top={showTop ? true : false}
                                openCallback={openCallback}
                                showPhoenixTooltip
                                tooltip={{
                                    size: "small"
                                }}
                            //hideLabelInDropDownOptions
                            />
                            {timeErr.show ?
                                <React.Fragment>
                                    <i className="icon_phoenix-warning-fill" />
                                    <div className={styles["error-msge"]}>{timeErr.showStr}</div>
                                </React.Fragment>
                                : null
                            }
                            {wroteReviewErr.show ?
                                <React.Fragment>
                                    <i className="icon_phoenix-warning-fill" />
                                    <div className={styles["error-msge"]}>{wroteReviewErr.showStr}</div>
                                </React.Fragment>
                                : null
                            }
                        </div>
                        <SingleSelect
                            name="condition"
                            options={operatorOptions}
                            placeholder={"Condition"}
                            displayLabel={"Condition"}
                            required
                            onChange={(condition) => {
                                setShowAddBtn(true);
                                setConditionObj({
                                    ...conditionObj,
                                    selectedCondition: condition.value,
                                    selectedValue: []
                                });
                                setShowDatePicker(false);
                                setCustomDateVal("Dates");
                                setValueCounter(valueCounter + 1);
                                modeChangeCallback(condition, false);
                                editModeConditionCallback && editModeConditionCallback({
                                    currentMode: "edit",
                                    index
                                });
                            }}
                            className={`min-width190 ${(selectedCondition === OPERATORS.BLANK.value || selectedCondition === OPERATORS.NOT_BLANK.value) && showAddBtn === false ? null : "mr-10"} mb-0`}
                            resetParam={{ value: "" }}
                            selected={selectedCondition}
                            isResetAllowed
                            errorMessages={{
                                required: VALIDATION_ERRORS.EMPTY_CONDITION
                            }}
                            validationTrigger="onChange"
                            showErrorOnWrapper
                            setErrorInParent={() => { }}
                            capitalizeSelectedValue={false}
                            top={showTop ? true : false}
                            openCallback={openCallback}
                            showPhoenixTooltip
                        />
                    </div>
                    {selectedCondition === OPERATORS.BLANK.value || selectedCondition === OPERATORS.NOT_BLANK.value ? null : <div className={showAddBtn && "mr-10"} >
                        {getValueJsx()}
                    </div>}
                </Form>
                {showAddBtn && <Button
                    label="Add"
                    type="button"
                    className="addRuleButton"
                    onClick={() => {
                        setInvalidTagInput(false);
                        formReference.current.validateInputs();
                        if (!Object.keys(formReference.current.failedValidations).length) {
                            if (selectedType === FIELD_DATA_TYPES.DATE.value) {
                                if (isValidDateValue(selectedCondition, selectedValue)) {
                                    setInvalidDate(false);
                                    addRule();
                                } else {
                                    //show error
                                    setInvalidDate(true);
                                }
                            } else if ((selectedCondition === OPERATORS.IN.value || selectedCondition === OPERATORS.NOT_IN.value
                                || selectedCondition === OPERATORS.CONTAINS_ANY_OF.value || selectedCondition === OPERATORS.DOES_NOT_CONTAINS_ANY_OF.value
                                || selectedCondition === OPERATORS.STARTS_WITH_ANY_OF.value || selectedCondition === OPERATORS.ENDS_WITH_ANY_OF.value) && selectedValue.length === 0) {
                                setInvalidTagInput(true);
                            } else {
                                addRule();
                            }
                        }
                    }}
                    role="button"
                />}
                {(field === "" && (alignRightOnOpenFiledFilter || fromFilterPopup)) ? null : <i onClick={async (event) => {
                   try {
                        if(getConfirmationRuntimeSessionFlag){
                            const confirmationRuntimeSessionFlag = getConfirmationRuntimeSessionFlag();
                            if (reEvalAtRuntime && !confirmationRuntimeSessionFlag) {
                                await confirmRuntimeModal();
                            }
                        }
                        event.stopPropagation();
                        deleteRuleFromQuery(index);
                        editModeConditionCallback && editModeConditionCallback({
                            currentMode: "delete",
                            index
                        });
                    } catch {
                        console.log("Cancelled the deleting rule");
                    }
                }} className={`icon icon-reset ${styles["cross-btn"]}`} />}
            </div>
        );
    };

    const getEditModeForNewTrigger = () => {

        const isAppointmentRecall = campaignType === CAMPAIGN_TYPE.APPOINTMENT_RECALL;

        let scheduledByOptions = [{ label: "hours", value: "hours", id: "1" }, { label: "days", value: "days", id: "2" }, { label: "weeks", value: "weeks", id: "3" }];

        if (isAppointmentRecall) {
            scheduledByOptions = [{ label: "hours", value: "hours", id: "4" }, { label: "days", value: "days", id: "1" }, { label: "months", value: "months", id: "2" },
            { label: "weeks", value: "weeks", id: "3" }];
        }

        const sendOrderOptions = [{ label: "before due date", value: "before", id: "1" }, { label: "after due date", value: "after", id: "2" }];
        const scheduleAtOptions = [{ label: "the appointment time", value: "appointment_time", id: "1" }, { label: "a specific time", value: "custom_time", id: "2" }];

        const updateOngoingDelayVal = (event) => {
            const value = event.target ? event.target.value : event.value;
            const finlVal = value ? isNaN(value) ? value : Math.abs(value) : null;
            const isInvalidVal = finlVal === null ? false : ((isNaN(finlVal) ? true : !Number.isInteger(finlVal) ? true : false));
            setScheduleInfo((prevState) => {
                return { ...scheduleInfo, selectedSchedule: isInvalidVal ? prevState.selectedSchedule : finlVal };
            });

            setSchCount((prevState) => {
                return prevState + 1;
            });
        };

        const updateDelayType = (e) => {
            const { value } = e;
            setShowAddBtn(true);
            setScheduleInfo({
                ...scheduleInfo,
                selectedScheduleBy: value,
                selectedScheduleId: e.id,
                ...value === "hours" ? {
                    selectedScheduleAt: null,
                    selectedAllowedDays: null,
                    selectedSendTime: null
                } : {
                    selectedScheduleAt: scheduleInfo.selectedScheduleAt || "appointment_time",
                    selectedAllowedDays: scheduleInfo.selectedAllowedDays || getDefaultAllowedDays()?.map(item => item.value),
                    selectedSendTime: scheduleInfo.selectedSendTime || null
                }
            });
            editModeConditionScheduleCallback && editModeConditionScheduleCallback({
                currentMode: "edit",
                index
            });
        };

        const updateCustomTimeOrDay = (e) => {
            const { value } = e;
            setShowAddBtn(true);
            setScheduleInfo({
                ...scheduleInfo,
                selectedScheduleAt: value,
                selectedScheduleId: e.id,
                selectedSendTime: value === "custom_time" ? "06:00 AM" : null
            });
            editModeConditionScheduleCallback && editModeConditionScheduleCallback({
                currentMode: "edit",
                index
            });
        };

        const updateCustomTimeOption = (e) => {
            const { value } = e;
            setShowAddBtn(true);
            setScheduleInfo({
                ...scheduleInfo,
                selectedSendTime: value,
                selectedScheduleId: e.id
            });
            editModeConditionScheduleCallback && editModeConditionScheduleCallback({
                currentMode: "edit",
                index
            });
        };

        const updateDefaultAllowedDays = (data) => {
            setShowAddBtn(true);
            setScheduleInfo({
                ...scheduleInfo,
                selectedAllowedDays: data?.length ? getTextMultiValues(data) : getTextMultiValues(getDefaultAllowedDays())
            });
            editModeConditionCallback && editModeConditionCallback({
                currentMode: "edit",
                index
            });
        };

        const updateDelayText = (e) => {
            const { value } = e;
            setShowAddBtn(true);
            setScheduleInfo({ ...scheduleInfo, selectedSendOrder: value, selectedScheduleId: e.id });
            editModeConditionScheduleCallback && editModeConditionScheduleCallback({
                currentMode: "edit",
                index
            });
        };

        const getSelectedAllowedDays = () => {
            const allowedDaysSelectedVal = scheduleInfo.selectedAllowedDays?.map(day => day.substring(0, 3));
            return allowedDaysSelectedVal?.join(", ");
        };

        return (
            <React.Fragment>
                <div data-testid="el-test-rules" className={`el-rules ${styles["custom-datetrigger-wrap"]} display-flex display-flex-center mr-5 mb-20 ${styles["delay-wrap"]}`}>
                    <span className={`mr-10 display-flex display-flex-center ${styles["delay-dropdown"]}`}>
                        {showNumber && <span className="badges badge-light mr-10">{index + 1}</span>}
                        <span className={`mr-20 ${styles["txt"]}`}>{isAppointmentRecall ? "Send recall notifications" : "Send reminder"} </span>
                        <FormInput
                            type={"text"}
                            id={"delayTxt"}
                            name={"delayTxt"}
                            autoComplete={"off"}
                            placeholder={`ex: 1`}
                            value={scheduleInfo.selectedSchedule}
                            onChange={(event) => {
                                setShowAddBtn(true);
                                updateOngoingDelayVal(event);
                            }}
                            trimOnBlur
                            required
                            onBlur={() => { }}
                            className={scheduleErr.show ? styles["show-error"] : ""}
                            autoFocus={"true"}
                            maxLength={4}
                            key={schCount + "_key"}
                            errorMessages={{
                                required: VALIDATION_ERRORS.EMPTY_FIELD
                            }}
                            showErrorOnWrapper
                        />
                    </span>
                    <span className="mr-10 display-flex display-flex-center inline-selectbox">
                        <SingleSelect
                            name="delayType"
                            options={scheduledByOptions}
                            onChange={updateDelayType}
                            placeholder={""}
                            showSearch={false}
                            selected={scheduleInfo.selectedScheduleBy}
                            hideLabelInDropDownOptions
                            inlineMode
                            customSize="small"
                            required
                            showErrorOnWrapper
                            errorMessages={{
                                required: VALIDATION_ERRORS.EMPTY_FIELD
                            }}
                        />
                        {scheduleErr.show ?
                            <div className={styles["error-msge"]}>{scheduleErr.showStr}</div> : null
                        }
                    </span>
                    <span className={`mr-20 ${styles['txt']}`}>
                        {isAppointmentRecall ? <span className="mr-20 display-flex display-flex-center inline-selectbox">
                            <SingleSelect
                                name="delayText"
                                options={sendOrderOptions}
                                onChange={updateDelayText}
                                placeholder={""}
                                showSearch={false}
                                selected={scheduleInfo.selectedSendOrder}
                                hideLabelInDropDownOptions
                                inlineMode
                                customSize="small"
                                required
                                showErrorOnWrapper
                                errorMessages={{
                                    required: VALIDATION_ERRORS.EMPTY_FIELD
                                }}
                            />
                            {scheduleErr.show ?
                                <div className={styles["error-msge"]}>{scheduleErr.showStr}</div> : null
                            }
                        </span> :
                            scheduleInfo.selectedScheduleBy !== "hours" ? "before, at" : "before the appointment"}
                    </span>
                    {scheduleInfo.selectedScheduleBy !== "hours" && <span className="mr-10 display-flex display-flex-center inline-selectbox">
                        {isAppointmentRecall && <span>at</span>}
                        <SingleSelect
                            name="customTimeOrDay"
                            options={scheduleAtOptions}
                            onChange={updateCustomTimeOrDay}
                            placeholder={""}
                            showSearch={false}
                            selected={scheduleInfo.selectedScheduleAt}
                            hideLabelInDropDownOptions
                            inlineMode
                            customSize="large"
                            required
                            showErrorOnWrapper
                            errorMessages={{
                                required: VALIDATION_ERRORS.EMPTY_FIELD
                            }}
                        />
                    </span>}
                    {scheduleInfo.selectedScheduleAt === "custom_time" ?
                        <span className="display-flex display-flex-center">
                            <span className={`mr-20 ${styles['txt']}`}>of</span>
                            <span className="mr-10 display-flex display-flex-center inline-selectbox">
                                <SingleSelect
                                    name="customTime"
                                    options={getCustomTimeOptions()}
                                    onChange={updateCustomTimeOption}
                                    placeholder={""}
                                    showSearch={false}
                                    selected={scheduleInfo.selectedSendTime}
                                    hideLabelInDropDownOptions
                                    inlineMode
                                    customSize="small"
                                    required
                                    showErrorOnWrapper
                                    errorMessages={{
                                        required: VALIDATION_ERRORS.EMPTY_FIELD
                                    }}
                                />
                            </span>
                        </span> : null}
                    {scheduleInfo.selectedScheduleBy !== "hours" ?
                        <span className="display-flex display-flex-center">
                            <span className={`mr-20 ${styles['txt']}`}>on the nearest</span>
                            <span className="mr-10 display-flex display-flex-center inline-selectbox">
                                <MultiSelect
                                    extendLeft
                                    placeholder={""}
                                    label={"Allowed days"}
                                    name="allowedDays"
                                    selected={scheduleInfo.selectedAllowedDays}
                                    options={getDefaultAllowedDays()}
                                    onBlur={updateDefaultAllowedDays}
                                    required
                                    showSearch={false}
                                    errorMessages={{
                                        required: VALIDATION_ERRORS.EMPTY_VALUE
                                    }}
                                    validationTrigger="onChange"
                                    tooltip={{
                                        align: "right",
                                        position: "left"
                                    }}
                                    customSize="small"
                                    customClassName={`mb-0`}
                                    showSelecteAll={false}
                                    customSelectedVal={scheduleInfo.selectedAllowedDays?.length ? getSelectedAllowedDays() : ""}
                                    hideLabelInDropDownOptions
                                    ctaButtonsEnabled
                                    showTooltipOutside
                                    inlineMode
                                />
                            </span>
                        </span> : null}

                    {showAddBtn && <Button
                        label="Add"
                        type="button"
                        className="addRuleButton"
                        onClick={addSchedule}
                        role="button"
                    />}
                    <i className={`icon icon-reset ${styles["cross-btn"]}`} onClick={(event) => {
                        event.stopPropagation();
                        deleteScheduleFromQuery(index);
                        editModeConditionScheduleCallback && editModeConditionScheduleCallback({
                            currentMode: "delete",
                            index
                        });
                    }} />
                </div>
            </React.Fragment>
        );
    };

    return (
        isAppointment ? getEditModeForNewTrigger() : getEditModeJsx()
    );
};

Rules.propTypes = {
    fieldMode: PropTypes.string,
    field: PropTypes.string,
    condition: PropTypes.string,
    value: PropTypes.string,
    index: PropTypes.number,
    deleteRuleFromQuery: PropTypes.func,
    addRuleCallBack: PropTypes.func,
    modeChangeCallback: PropTypes.func,
    showNumber: PropTypes.bool,
    showTop: PropTypes.bool,
    openCallback: PropTypes.func,
    editModeConditionCallback: PropTypes.func,
    editModeConditionScheduleCallback: PropTypes.func,
    availableAssignees: PropTypes.object,
    surveyData: PropTypes.array,
    notSendSurveyHit: PropTypes.bool,
    filterReviewRatingsCase: PropTypes.bool,
    filterReviewRatings: PropTypes.func,
    selectedTrigger: PropTypes.string,
    campaignType: PropTypes.string,
    isAppointment: PropTypes.bool,
    availableServices: PropTypes.array,
    availableDoctors: PropTypes.array,
    appointmentCustomFields: PropTypes.array,
    addSchedulesCallback: PropTypes.func,
    secondaryFilterOptions: PropTypes.array,
    alignRightOnOpenFiledFilter: PropTypes.bool,
    fromFilterPopup: PropTypes.bool,
    isSecondaryFilter: PropTypes.bool,
    allowPostiveNumbersOnly: PropTypes.bool,
    isAppointmentReminderTrigger: PropTypes.bool,
    fromTriggerSection: PropTypes.bool,
    extraOperatorForAutomation: PropTypes.bool, // flag to add new extra operators in custom fields in automation only
    isWroteAReviewMultiple: PropTypes.bool,
    confirmRuntimeModal: PropTypes.func,
    reEvalAtRuntime: PropTypes.bool,
    getConfirmationRuntimeSessionFlag: PropTypes.func,
    businessData: PropTypes.object,
};

export default Rules;