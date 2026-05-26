import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import SingleSelect from "atoms/SingleSelect";
import FormInput from "atoms/FormInput";
import Button from "atoms/Button";
import MultiSelect from "atoms/Multiselect";
import TagsInput from "components/TagsInput";
import DatePicker from "components/DatePicker";
import Tooltip from "atoms/Tooltip";
import { OPERATORS, VALIDATION_ERRORS, FIELD_DATA_TYPES, FIELD_NAME } from "./constants.js";
import { getValidationMessage, isValidValue, getOperandFromSelectedField, getCurrencyValue, getCurrencySign } from "./helper.js";
import { convertFromEpochTime } from "utils";
import AlertImg from "assets/images/error.svg";

const ValueDropdown = (props) => {
    const {
        selectedType,
        selectedField,
        splittedVal,
        selectedValue,
        tagOptions,
        reviewSources,
        handleTagsChange,
        handleReviewSourceChange,
        showSearch,
        openCallback,
        alignRightOnOpenFiledFilter,
        fromFilterPopup,
        showTop,
        selectedCondition,
        customDateVal,
        setShowDatePicker,
        showDatePicker,
        handleDatePickerChange,
        invalidDate,
        updateChosenTime,
        modeChangeCallback,
        editModeConditionCallback,
        index,
        getDripTime,
        extraValueSources,
        handleTextMultiChange,
        fromTriggerSection,
        fieldName,
        filterReviewRatingsCase,
        notSendSurveyHit,
        surveyDataFiltered,
        availableAssignees,
        doctorsDataFiltered,
        appointmentStatusFiltered,
        servicesDataFiltered,
        sourceTypeFilteredChoices,
        customerTypeFilteredChoices,
        formStatusFilteredChoices,
        weekDayFilteredChoices,
        secondaryFilterChoicesFilteredData,
        isSecondaryFilter,
        handleSingleNumberChange,
        allowPostiveNumbersOnly,
        valueCounter,
        updateTagInput,
        invalidTagInput,
        setConditionObj,
        setShowAddBtn,
        conditionObj,
        setInvalidDate,
        dropdownFieldOptions,
        handleSingleSelectChange,
        isAdvancedFilter,
        betweenSeparator = "-",
        isToolConfig
    } = props;

    let count = 0;
    const isSelectCustomField = [FIELD_DATA_TYPES.DROPDOWN_SINGLE.value, FIELD_DATA_TYPES.DROPDOWN_MULTI.value].includes(selectedType);
    const showSingleSelect = isSelectCustomField && [OPERATORS.IS.value, OPERATORS.IS_NOT.value].includes(selectedCondition);
    const showMultiSelect = (isSelectCustomField && [OPERATORS.IS_ANY_OF.value, OPERATORS.IS_NONE_OF.value].includes(selectedCondition)) || (isToolConfig && fieldName == "Message type") || (isToolConfig && fieldName == "Location")
    
    if (selectedType === FIELD_DATA_TYPES.TAG.value && splittedVal === FIELD_DATA_TYPES.TAG.label) {
        return (
            <MultiSelect
                extendLeft
                placeholder={"Tags"}
                label={"Tags"}
                emptyPlaceholder={"Tags"}
                selectedAliasPlaceholder={"tag"}
                name="tagsValue"
                showSelectAllDisplayLabel
                selected={selectedValue}
                options={tagOptions}
                onBlur={handleTagsChange}
                required
                errorMessages={{
                    required: VALIDATION_ERRORS.EMPTY_VALUE
                }}
                sortSelected
                showSearch={showSearch(tagOptions)}
                validationTrigger="onChange"
                noDefaultSelection
                openCallback={openCallback}
                tooltip={{
                    align: "right",
                    position: "left"
                }}
                customSize="large"
                customClassName={`${(alignRightOnOpenFiledFilter || fromFilterPopup) && "w-185"} mb-0`}
                isResetAllowed
                top={showTop ? true : false}
                supportCustomAddEventHandler
                displayName="MultiSelect" //This is sent as MultiSelect name is wrapped with OnClickOutside
                showPhoenixTooltip
                showTooltipOutside
            />
        );
    } else if (selectedType === FIELD_DATA_TYPES.REVIEW.value && splittedVal === FIELD_DATA_TYPES.REVIEW.label) {
        return (
            <MultiSelect
                extendLeft
                placeholder={"Review Source"}
                label={"Review Source"}
                emptyPlaceholder={"Review Source"}
                selectedAliasPlaceholder={"review source"}
                name="reviewSource"
                className="mb-0"
                showSelectAllDisplayLabel
                selected={selectedValue}
                options={reviewSources}
                onBlur={handleReviewSourceChange}
                required
                errorMessages={{
                    required: VALIDATION_ERRORS.EMPTY_VALUE
                }}
                sortSelected
                showSearch={showSearch(reviewSources)}
                validationTrigger="onChange"
                noDefaultSelection
                openCallback={openCallback}
                tooltip={{
                    align: "right",
                    position: "left"
                }}
                customSize="large"
                customClassName={`${(alignRightOnOpenFiledFilter || fromFilterPopup) && "w-185"} mb-0`}
                isResetAllowed
                top={showTop ? true : false}
                supportCustomAddEventHandler
                displayName="MultiSelect" //This is sent as MultiSelect name is wrapped with OnClickOutside
                showPhoenixTooltip
                showTooltipOutside
            />
        );
    } else if (selectedType === FIELD_DATA_TYPES.DATE.value) {
        /** based on selected condtion is between/after etc */
        return (
            <div className={`pos-rel ${invalidDate ? "invalid-dates" : ""} ${(alignRightOnOpenFiledFilter || fromFilterPopup)  && "datepicker-wrapper"}`}>
                <Button
                    type="secondary"
                    label={customDateVal}
                    onClick={() => {
                        setShowDatePicker(true);
                    }}
                    className={`${(alignRightOnOpenFiledFilter || fromFilterPopup)  ? "w-185 mb-0" : "w-240 mb-0"} select-button`}
                    icon="icon-cheveron_open"
                    customIcon
                />
                {invalidDate &&
                    <div className="error-tooltips">
                        <Tooltip
                            hideOnScroll
                            text={VALIDATION_ERRORS["EMPTY_VALUE"]}
                        >
                            <img src={AlertImg} alt="error" />
                        </Tooltip>
                    </div>
                }
                {showDatePicker ?
                    ((selectedCondition === OPERATORS.BETWEEN.value || selectedCondition === OPERATORS.NOT_BETWEEN.value) ?
                        <DatePicker
                            range
                            //enableFutureDates
                            showPicker
                            cancelCalendarPopup={() => {
                                setShowDatePicker(false);
                            }}
                            key={count += 1}
                            sendDateTime={(startDt, endDt, areSame) => {
                                handleDatePickerChange(startDt, endDt, areSame, true);
                                setInvalidDate(false);
                                setShowDatePicker(false);
                            }}
                            startDt={selectedValue[0] ? convertFromEpochTime(selectedValue[0], "MMM DD, YYYY") : moment()}
                            endDt={selectedValue[1] ? convertFromEpochTime(selectedValue[1], "MMM DD, YYYY") : moment()}
                            dynamicClass="condition-datepicker"
                            //maxDate={moment()}
                            firstTimeFlag
                            explicitMinDt={new Date(1900, 0, 1)}
                            explicitMaxDt={new Date(2100, 0, 1)}
                            openCallback={openCallback}
                        />
                        :
                        <DatePicker
                            range={false}
                            //enableFutureDates
                            showPicker
                            cancelCalendarPopup={() => {
                                setShowDatePicker(false);
                            }}
                            key={count += 1}
                            sendDateTime={(selectedDate) => {
                                handleDatePickerChange(selectedDate);
                                setInvalidDate(false);
                                setShowDatePicker(false);
                            }}
                            startDt={selectedValue[0] ? convertFromEpochTime(selectedValue[0], "MMM DD, YYYY") : moment()}
                            dynamicClass="profile-datepicker"
                            //maxDate={moment()}
                            firstTimeFlag
                            explicitMinDt={new Date(1900, 0, 1)}
                            explicitMaxDt={new Date(2100, 0, 1)}
                            openCallback={openCallback}
                        />
                    ) : null}
            </div>

        );
    } else if (selectedType === FIELD_DATA_TYPES.TIME.value) {
        /** based on selected condtion is between/after etc */
        return (
            <div className="display-flex display-flex-center">
                {
                    ((selectedCondition === OPERATORS.BEFORE.value) || (selectedCondition === OPERATORS.AFTER.value) ?
                        <SingleSelect
                            name="time"
                            options={getDripTime({selectedCondition})}
                            placeholder={""}
                            displayLabel={"Choose time"}
                            required
                            onChange={(beforeAfterTime) => {
                                updateChosenTime({beforeAfterTime});
                                setShowAddBtn(true);
                                modeChangeCallback(event, false);
                                editModeConditionCallback && editModeConditionCallback({
                                    currentMode: "edit",
                                    index
                                });
                            }}
                            className="w-160 mr-10 mb-0 no-text-transform custom-timedropdown"
                            resetParam={{ value: "" }}
                            selected={selectedValue[0]}
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
                            customSize="small"
                        />
                        
                        :
                        <><SingleSelect
                            name="time"
                            options={getDripTime()}
                            placeholder={""}
                            displayLabel={"Choose time"}
                            required
                            onChange={(startTime) => {
                                updateChosenTime({startTime});
                                setShowAddBtn(true);
                                modeChangeCallback(event, false);
                                editModeConditionCallback && editModeConditionCallback({
                                    currentMode: "edit",
                                    index
                                });
                            }}
                            className="w-160 mr-10 mb-0 no-text-transform custom-timedropdown"
                            resetParam={{ value: "" }}
                            selected={selectedValue[0]}
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
                            customSize="small"
                        />
                        <SingleSelect
                            name="time"
                            options={getDripTime({selectedCondition})}
                            placeholder={""}
                            displayLabel={"Choose time"}
                            required
                            secondvalue = {selectedValue[1]}
                            onChange={(endTime) => {
                                updateChosenTime({endTime});
                                setShowAddBtn(true);
                                modeChangeCallback(event, false);
                                editModeConditionCallback && editModeConditionCallback({
                                    currentMode: "edit",
                                    index
                                });
                            }}
                            className="w-160 mr-10 mb-0 no-text-transform custom-timedropdown"
                            resetParam={{ value: "" }}
                            selected={selectedValue[1]}
                            validations={{
                                isValid: value => {
                                    let startTime = moment(value, "HH:mm a");
                                    let endTime = moment(selectedValue[0], "HH:mm a");
                                    if (selectedValue[0] && value == selectedValue[0] ||   (startTime.isBefore(endTime))) {
                                        return false;
                                    } else {
                                        return true ;
                                    }
                                }
                            }}
                            errorMessages={{
                                required: VALIDATION_ERRORS.EMPTY_FIELD,
                                isValid: "Please select a valid time range."
                            }}
                            validationTrigger="onChange"
                            showErrorOnWrapper
                            setErrorInParent={() => { }}
                            capitalizeSelectedValue={false}
                            top={showTop ? true : false}
                            openCallback={openCallback}
                            showPhoenixTooltip
                            customSize="small"
                        />
                        </>
                    ) }
            </div>

        );
    } else if (selectedType === FIELD_DATA_TYPES.TEXT_MULTI.value || showMultiSelect) {
        let multiselectOptions, multiLabel, multiName, selectedAliasPlaceholder;
        let selectedValues = JSON.parse(JSON.stringify(selectedValue));

        if (fromTriggerSection) {
            if (fieldName === FIELD_NAME.REVIEW_SOURCE) {
                multiselectOptions = extraValueSources[0];
                multiLabel = "Choose review sources";
                multiName = "reviewSourceMulti";
                selectedAliasPlaceholder = FIELD_NAME.REVIEW_SOURCE.toLowerCase();

            } else if (fieldName === FIELD_NAME.REVIEW_RATING) {
                let reviewOptions = [...extraValueSources[1]];
                if (filterReviewRatingsCase === 0) {
                    reviewOptions = reviewOptions.filter(option => !(["Recommended", "Not Recommended"].includes(option.label)));
                } else if (filterReviewRatingsCase === 2) {
                    reviewOptions = reviewOptions.filter(option => (["Recommended", "Not Recommended"].includes(option.label)));
                }
                multiselectOptions = reviewOptions;
                multiLabel = "Choose review rating";
                multiName = "reviewRatingMulti";
                selectedAliasPlaceholder = FIELD_NAME.REVIEW_RATING.toLowerCase();

            } else if (fieldName === FIELD_NAME.REFERRED_THROUGH) {
                multiselectOptions = extraValueSources[3];
                multiLabel = "Choose referred through";
                multiName = "referredThroughMulti";
                selectedAliasPlaceholder = FIELD_NAME.REFERRED_THROUGH.toLowerCase();

            } else if (fieldName === FIELD_NAME.SURVEY) {
                multiselectOptions = notSendSurveyHit ? extraValueSources[4] : surveyDataFiltered;
                multiLabel = "Choose survey";
                multiName = "surveyMulti";
                selectedAliasPlaceholder = FIELD_NAME.SURVEY.toLowerCase();

            } else if (fieldName === FIELD_NAME.ASSIGNEE) {
                multiselectOptions = {
                    Users: availableAssignees.users,
                    Teams: availableAssignees.teams
                };
                multiLabel = "Choose team or user";
                multiName = "teamMulti";
                selectedAliasPlaceholder = "team or user";
                if (!(selectedValue instanceof Array)) {
                    selectedValues = [...selectedValue.T, ...selectedValue.U];
                    setConditionObj({ ...conditionObj, selectedValue: selectedValues });
                }
            } else if (fieldName === FIELD_NAME.SPECIALIST) {
                multiselectOptions = doctorsDataFiltered;
                multiLabel = "Choose doctor";
                multiName = "doctorMulti";
                selectedAliasPlaceholder = FIELD_NAME.SPECIALIST.toLowerCase();
            } else if (fieldName === FIELD_NAME.APPOINTMENT_STATUS) {
                multiselectOptions = appointmentStatusFiltered;
                multiLabel = "Choose status";
                multiName = "statusMulti";
                selectedAliasPlaceholder = FIELD_NAME.APPOINTMENT_STATUS.toLowerCase();
            } else if (fieldName === FIELD_NAME.APPOINTMENT_TYPE) {
                multiselectOptions = servicesDataFiltered;
                multiLabel = "Choose services";
                multiName = "serviceMulti";
                selectedAliasPlaceholder = FIELD_NAME.APPOINTMENT_TYPE.toLowerCase();
            } else if (fieldName === FIELD_NAME.SOURCE) {
                multiselectOptions = sourceTypeFilteredChoices;
                multiLabel = "Choose source";
                multiName = "sourceMulti";
                selectedAliasPlaceholder = FIELD_NAME.SOURCE.toLowerCase();
            } else if (fieldName === FIELD_NAME.CUSTOMER_TYPE) {
                multiselectOptions = customerTypeFilteredChoices;
                multiLabel = "Choose customer";
                multiName = "customerMulti";
                selectedAliasPlaceholder = FIELD_NAME.CUSTOMER_TYPE.toLowerCase();
            }  else if (fieldName === FIELD_NAME.FORM_STATUS) {
                multiselectOptions = formStatusFilteredChoices;
                multiLabel = "Choose form status";
                multiName = "formStatusMulti";
                selectedAliasPlaceholder = FIELD_NAME.FORM_STATUS.toLowerCase();
            } else if (fieldName === FIELD_NAME.DAY_OF_THE_WEEK) {
                multiselectOptions = weekDayFilteredChoices;
                multiLabel = "Choose week day";
                multiName = "weekDayMulti";
                selectedAliasPlaceholder = FIELD_NAME.DAY_OF_THE_WEEK.toLowerCase();
            }
        }

        if (isSecondaryFilter) {
            multiselectOptions = secondaryFilterChoicesFilteredData;
            multiLabel = "Choose options";
            multiName = "secondaryFilterChoices";
            selectedAliasPlaceholder = FIELD_NAME.SECONDARY_FILTER.toLowerCase();
        }

        if (isAdvancedFilter) {
            multiselectOptions = dropdownFieldOptions;
            multiLabel = isToolConfig ? fieldName : "Select option";
            multiName = (isToolConfig && fieldName == "Message type") ? "messageType" : (isToolConfig && fieldName == "Location") ? "location" : "multi_select_custom_field";
            selectedAliasPlaceholder = (isToolConfig && (fieldName === "Message type" || fieldName === "Location")) ? (fieldName === "Location" ? "locations" : fieldName.toLowerCase()) : "selected";
        }
         const allSelectedPlaceholderText = (() => {
            if (isToolConfig && fieldName === "Message type") return "All message types";
            if (isToolConfig && fieldName === "Location") return "All locations";
            return "All selected";
        })();
        const getFieldClass = () => {
            if (!isToolConfig) return "";

            if (fieldName === "Message type") {
            // multiselectOptions is an object grouped by platform
                const allOptions = Object.values(multiselectOptions || {})
                    .flat()
                    .map((opt) => opt.value);

                const isAllSelected = selectedValues?.length === allOptions?.length;
                return isAllSelected ? "all-selected" : "partial-selected";
            }

            if (fieldName === "Location") {
            // multiselectOptions is a flat array
                const allOptions = (multiselectOptions || []).map((opt) => opt.value);

                const isAllSelected = selectedValues?.length === allOptions?.length;
                return isAllSelected ? "all-selected" : "partial-selected";
            }

            return "";
        };
        const allSelected = getFieldClass() === "all-selected";

        return (<div styleName="team-select-box" className={`${(fromTriggerSection && fieldName === FIELD_NAME.SURVEY) ? "survey-team-selectbox" : ""}`}>
            <MultiSelect
                extendLeft
                label={multiLabel}
                selectedAliasPlaceholder={selectedAliasPlaceholder}
                name={multiName}
                showSelectAllDisplayLabel
                selected={selectedValues}
                options={multiselectOptions}
                onBlur={handleTextMultiChange}
                required
                errorMessages={{
                    required: VALIDATION_ERRORS.EMPTY_VALUE
                }}
                sortSelected
                showSearch={showSearch(multiselectOptions)}
                validationTrigger="onChange"
                noDefaultSelection
                openCallback={openCallback}
                tooltip={{
                    align: "right",
                    position: "left"
                }}
                customSize="large"
                customClassName={`${allSelected ? "all-selected" : ""} ${isAdvancedFilter ? "mb-0 common-custom-width customize-width-multiselect" : (alignRightOnOpenFiledFilter || fromFilterPopup) ? "w-185 mb-0" : "mb-0 team-block"}`}
                isResetAllowed
                top={showTop ? true : false}
                supportCustomAddEventHandler
                displayName="MultiSelect" //This is sent as MultiSelect name is wrapped with OnClickOutside
                showPhoenixTooltip
                showTooltipOutside
                showConcisePlaceholder={!isAdvancedFilter}
                extendWidth={isAdvancedFilter} 
                hidePlaceholder={isAdvancedFilter}
                hideGroupCheckbox={fieldName == "Message type" ? false : true}
                customSelectAllPlaceholder={allSelectedPlaceholderText}
            />
        </div>);
    } else if (selectedType === FIELD_DATA_TYPES.NUMBER_SINGLE.value || showSingleSelect) {
        let options = extraValueSources[2],
            onChangeHandler = handleSingleNumberChange,
            displayLabel = "Select Overall score",
            name = "NPSscore";

        if (
            selectedType === FIELD_DATA_TYPES.DROPDOWN_SINGLE.value ||
            selectedType === FIELD_DATA_TYPES.DROPDOWN_MULTI.value
        ) {
            options = dropdownFieldOptions;
            onChangeHandler = handleSingleSelectChange;
            displayLabel = isToolConfig ? "Select" : "Select option";
            name = "single_select_custom_field";
        }

        return (<SingleSelect
            name={name}
            options={options}
            placeholder={displayLabel}
            displayLabel={displayLabel}
            required
            onChange={onChangeHandler}
            className={`mr-10 mb-0 no-text-transform ${isAdvancedFilter ? "common-custom-width customize-width-singleselect" : "w-240"}`}
            resetParam={{ value: "" }}
            selected={selectedValue[0]}
            isResetAllowed
            showSearch={showSearch(options)}
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
            extendWidth={isAdvancedFilter}
        //hideLabelInDropDownOptions
        />);
        
    } else if (selectedType === FIELD_DATA_TYPES.NUMBER.value) {
        if (selectedCondition === OPERATORS.IS_BETWEEN.value) {
            return (
                <div className="display-flex display-flex-center range-input-field">
                    <FormInput
                        type={"text"}
                        id={"rule-value"}
                        name={"value"}
                        autoComplete={"off"}
                        placeholder={`Value`}
                        value={selectedValue[0]}
                        onChange={(event) => {
                            const value = event.target ? event.target.value : event.value;
                            setConditionObj({
                                ...conditionObj,
                                selectedValue: [(isValidValue(selectedType, value, allowPostiveNumbersOnly) && value !== "") ? +value : value, selectedValue[1]]
                            });
                            setShowAddBtn(true);
                            modeChangeCallback(event, false);
                            editModeConditionCallback && editModeConditionCallback({
                                currentMode: "edit",
                                index
                            });

                        }}
                        onBlur={() => { }}
                        className={`inline-block ${isAdvancedFilter ? "range-input-box" : "w-240"}`}
                        validations={{
                            required: (value) => {
                                if (!value && value != 0) {
                                    return false;
                                }

                                return true;
                            },
                            format: (value) => {
                                return isValidValue(selectedType, value, allowPostiveNumbersOnly);
                            }
                        }}
                        errorMessages={{
                            required: VALIDATION_ERRORS.EMPTY_VALUE,
                            format: getValidationMessage(selectedType, getOperandFromSelectedField(selectedField))
                        }}
                        trimOnBlur
                        validationTrigger="onChange"
                        key={valueCounter}
                    />
                    <span className="differentiator-wrap">{betweenSeparator}</span>
                    <FormInput
                        type={"text"}
                        id={"rule-value"}
                        name={"value"}
                        autoComplete={"off"}
                        placeholder={`Value`}
                        value={selectedValue[1]}
                        onBlur={() => { }}
                        className={`inline-block ${isAdvancedFilter ? "mr-10 range-input-box" : "w-240"}`}
                        onChange={(event) => {
                            const value = event.target ? event.target.value : event.value;

                            setConditionObj({
                                ...conditionObj,
                                selectedValue: [selectedValue[0],(isValidValue(selectedType, value, allowPostiveNumbersOnly) && value !== "") ? +value : value]
                            });
                            setShowAddBtn(true);
                            modeChangeCallback(event, false);
                            editModeConditionCallback && editModeConditionCallback({
                                currentMode: "edit",
                                index
                            });

                        }}
                        validations={{
                            required: (value) => {
                                if (!value && value != 0) {
                                    return false;
                                }

                                return true;
                            },
                            format: (value) => {
                                return isValidValue(selectedType, value, allowPostiveNumbersOnly);
                            }
                        }}
                        errorMessages={{
                            required: VALIDATION_ERRORS.EMPTY_VALUE,
                            format: getValidationMessage(selectedType, getOperandFromSelectedField(selectedField))
                        }}
                        trimOnBlur
                        validationTrigger="onChange"
                        key={valueCounter}
                    />
                </div>
            );
        }
    }

    switch (selectedCondition) {
        case OPERATORS.BLANK.value:
        case OPERATORS.NOT_BLANK.value: {
            return null;
        }
        case OPERATORS.IN.value:
        case OPERATORS.NOT_IN.value:
        case OPERATORS.CONTAINS_ANY_OF.value:
        case OPERATORS.DOES_NOT_CONTAINS_ANY_OF.value:
        case OPERATORS.STARTS_WITH_ANY_OF.value:
        case OPERATORS.ENDS_WITH_ANY_OF.value: {
            return (
                <div className={`${(alignRightOnOpenFiledFilter || fromFilterPopup)  ? "w-185" : "w-240"}`}>
                    <TagsInput
                        name="containsInput"
                        placeholder={"Value"}
                        onTagsUpdate={updateTagInput}
                        defaultValue={selectedValue}
                        customError={invalidTagInput}
                        customErrorMessage={"Please enter a value"}
                        errorMsg={"Please enter a value"}
                        supportTextTags
                        showLabel={false}
                        noHeight
                        onlyBreakOnEnterAndTab
                        allowBlank={false}
                        forceUpdateCounter={valueCounter}
                    />
                </div>
            );
        }
        default: {
            return (
                <FormInput
                    type={"text"}
                    id={"rule-value"}
                    name={"value"}
                    autoComplete={"off"}
                    placeholder={isAdvancedFilter ? "Enter value" : `Value`}
                    value={selectedType === FIELD_DATA_TYPES.CURRENCY.value ? selectedValue.length > 1 ? getCurrencyValue(getCurrencySign(selectedValue) + selectedValue[1]) : selectedValue[0] : selectedValue[0] || ""}
                    onChange={(event) => {
                        const value = event.target ? event.target.value : event.value;

                        setConditionObj({
                            ...conditionObj,
                            selectedValue: [selectedType === FIELD_DATA_TYPES.NUMBER.value ? (isValidValue(selectedType, value, allowPostiveNumbersOnly) && value !== "") ? +value : value : selectedType === FIELD_DATA_TYPES.YESNO.value ? value.toLowerCase().trim() : value]
                        });
                        setShowAddBtn(true);
                        modeChangeCallback(event, false);
                        editModeConditionCallback && editModeConditionCallback({
                            currentMode: "edit",
                            index
                        });

                    }}
                    onBlur={() => { }}
                    className={`inline-block ${isAdvancedFilter ? "common-custom-width customize-width-value-input" : "w-185"}`}
                    validations={{
                        required: (value) => {
                            if (!value && value != 0) {
                                return false;
                            }

                            return true;
                        },
                        format: (value) => {
                            return isValidValue(selectedType, value, allowPostiveNumbersOnly);
                        }
                    }}
                    errorMessages={{
                        required: VALIDATION_ERRORS.EMPTY_VALUE,
                        format: getValidationMessage(selectedType, getOperandFromSelectedField(selectedField))
                    }}
                    trimOnBlur
                    validationTrigger="onChange"
                    key={valueCounter}
                />
            );
        }
    }
};

ValueDropdown.propTypes = {
    selectedType: PropTypes.string,
    selectedField: PropTypes.string,
    splittedVal: PropTypes.string,
    selectedValue: PropTypes.array,
    tagOptions: PropTypes.array,
    reviewSources: PropTypes.array,
    handleTagsChange: PropTypes.func,
    handleReviewSourceChange: PropTypes.func,
    showSearch: PropTypes.func,
    openCallback: PropTypes.func,
    alignRightOnOpenFiledFilter: PropTypes.bool,
    fromFilterPopup: PropTypes.bool,
    showTop: PropTypes.bool,
    selectedCondition: PropTypes.string,
    customDateVal: PropTypes.string,
    setShowDatePicker: PropTypes.func,
    showDatePicker: PropTypes.bool,
    handleDatePickerChange: PropTypes.func,
    invalidDate: PropTypes.bool,
    updateChosenTime: PropTypes.func,
    modeChangeCallback: PropTypes.func,
    editModeConditionCallback: PropTypes.func,
    index: PropTypes.number,
    getDripTime: PropTypes.func,
    extraValueSources: PropTypes.array,
    handleTextMultiChange: PropTypes.func,
    fromTriggerSection: PropTypes.bool,
    fieldName: PropTypes.string,
    filterReviewRatingsCase: PropTypes.number,
    notSendSurveyHit: PropTypes.bool,
    surveyDataFiltered: PropTypes.array,
    availableAssignees: PropTypes.object,
    doctorsDataFiltered: PropTypes.array,
    appointmentStatusFiltered: PropTypes.array,
    servicesDataFiltered: PropTypes.array,
    sourceTypeFilteredChoices: PropTypes.array,
    customerTypeFilteredChoices: PropTypes.array,
    formStatusFilteredChoices: PropTypes.array,
    weekDayFilteredChoices: PropTypes.array,
    secondaryFilterChoicesFilteredData: PropTypes.array,
    isSecondaryFilter: PropTypes.bool,
    handleSingleNumberChange: PropTypes.func,
    allowPostiveNumbersOnly: PropTypes.bool,
    valueCounter: PropTypes.number,
    updateTagInput: PropTypes.func,
    invalidTagInput: PropTypes.bool,
    setConditionObj: PropTypes.func,
    setShowAddBtn: PropTypes.func,
    conditionObj: PropTypes.object,
    setInvalidDate: PropTypes.func,
    dropdownFieldOptions: PropTypes.array,
    handleSingleSelectChange: PropTypes.func,
    isAdvancedFilter: PropTypes.bool,
    betweenSeparator: PropTypes.string,
    isToolConfig: PropTypes.bool,
};

export default ValueDropdown;