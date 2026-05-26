import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Steppers.module.scss";
import { STEPPER_STATUS_CONSTANTS } from "./Steppers.constants";
import Button from "atoms/Button";
import { cloneDeep, isEmpty } from "lodash";
import { getEncodedStyleClass } from "utils";
import ActionBox from "atoms/ActionBox";
import VerticalWizardNav from "./VerticalWizardNav";

const getStyle = (str) => getEncodedStyleClass(str, styles);

const Steppers = (props) => {
    const { steps = [], reset, initialStep, showUpperSteps = true, customClassName, resetTimeStamp, isFileUploadApiComplete, 
        isFileUpload, bulkImportData, isSocial, isSchedulePostApiComplete, socialBtnName = "", 
        isCustomFilterProcessing = false,isCustomTokenProcessing = false, isUploadLocation, addActionCTAs = false, actionCTAsDetails = {},
        retainStepStatus = false, variant = "horizontal" } = props;
    const prevReset = usePrevious(reset);
    const prevResetStamp = usePrevious(resetTimeStamp);
    
    const getInitialStepsState = () => {
        if (initialStep) {
            let arr = [];
            for (let i = 0;i < steps.length;i++) {
                arr.push({status: retainStepStatus && steps[i].status ? steps[i].status : null});
            }
            arr[initialStep].status = STEPPER_STATUS_CONSTANTS.ACTIVE;
            return arr;
        } else if (isCustomFilterProcessing) {
            return [
                { status: STEPPER_STATUS_CONSTANTS.COMPLETED },
                { status: STEPPER_STATUS_CONSTANTS.COMPLETED }
            ];
        }else if (isCustomTokenProcessing) {
            return [
                { status: STEPPER_STATUS_CONSTANTS.COMPLETED },
                { status: STEPPER_STATUS_CONSTANTS.COMPLETED }
            ];
        }
        return [{
            status: STEPPER_STATUS_CONSTANTS.ACTIVE
        }];
    };
    
    const [stepsState, setStepsState] = useState(getInitialStepsState());

    const resetSteps = () => {
        setStepsState(getInitialStepsState());
    };

    useEffect(() => {
        if (isFileUpload) {
            const stepsStateClone = cloneDeep(stepsState);
            if (isFileUploadApiComplete) {
                stepsStateClone[activeIndex].status = STEPPER_STATUS_CONSTANTS.COMPLETED;
            } else {
                stepsStateClone[activeIndex].status = STEPPER_STATUS_CONSTANTS.ACTIVE;
            }
            setStepsState(stepsStateClone);
        }
    }, [isFileUploadApiComplete]);

    useEffect(() => {
        if (isUploadLocation) {
            const stepsStateClone = cloneDeep(stepsState);
            if (!isEmpty(bulkImportData) && activeIndex === 0) {
                stepsStateClone[activeIndex].status = STEPPER_STATUS_CONSTANTS.COMPLETED;
                if (stepsStateClone.length < steps.length) {
                    const defaultStep = getInitialStepsState()[0];
                    stepsStateClone.push(defaultStep);
                }   
            }
            setStepsState(stepsStateClone);
        }
    }, [bulkImportData]);

    useEffect(() => {
        if (isSocial) {
            const stepsStateClone = cloneDeep(stepsState);
            if (isSchedulePostApiComplete) {
                stepsStateClone[activeIndex].status = STEPPER_STATUS_CONSTANTS.COMPLETED;
            } else {
                stepsStateClone[activeIndex].status = STEPPER_STATUS_CONSTANTS.ACTIVE;
            }
            setStepsState(stepsStateClone);
        }
    }, [isSchedulePostApiComplete]);

    useEffect(() => {
        setStepsState(getInitialStepsState());
    },[initialStep]);

    function usePrevious(value) {
        const ref = useRef();
        
        useEffect(() => {
            ref.current = value;
        });
        
        return ref.current;
    }

    useEffect(() => {
        if (reset && reset !== prevReset) {
            resetSteps();
        }
    }, [reset]);

    useEffect(() => {
        if (resetTimeStamp && resetTimeStamp != prevResetStamp) {
            const stepsStateClone = cloneDeep(stepsState);

            stepsStateClone[activeIndex].status = null;
            stepsStateClone[activeIndex - 1].status = STEPPER_STATUS_CONSTANTS.ACTIVE;
    
            setStepsState(stepsStateClone);
        }
    }, [resetTimeStamp]);

    const getActiveStepContent = () => {
        const activeStep = steps[activeIndex];

        return activeStep.content && activeStep.content();
    };
    
    const getActiveStepSecondaryContent = () => {
        const activeStep = steps[activeIndex];

        return activeStep.secondaryContent && activeStep.secondaryContent();
    };

    const getDownloadTemplateContent = () => {
        const activeStep = steps[activeIndex];

        return activeStep.downloadTemplateContent && activeStep.downloadTemplateContent();
    };

    const getActiveStepCTAHtml = () => {
        const activeStep = steps[activeIndex];

        if (activeStep) {
            const { next, prev, cancel } = activeStep.cta || {};
            if (isFileUpload && next && activeStep.stepHeading == "Browse") {
                next.isDisabled = true;
                if (bulkImportData && bulkImportData.multipleFilesData && bulkImportData.multipleFilesData.length) {
                    next.isDisabled = false;
                }
            }
            return (
                <div className={`${getStyle("step-cta-wrap")} btnWrapper mt-20 ${getStyle(activeStep.className)}`}>
                    {cancel && getCancelCTAButton(cancel)}
                    {prev && getPrevCTAButton(prev)}
                    {next && getNextCTAButton(next)}
                </div>
            );
        }
    };

    const onClickNext = () => {
        const stepsStateClone = cloneDeep(stepsState);
        const activeStep = steps[activeIndex];
        const { next } = activeStep.cta || {};
        const { importClicked } = next || {};

        if (stepsStateClone[activeIndex + 1]) {
            stepsStateClone[activeIndex + 1].status = STEPPER_STATUS_CONSTANTS.ACTIVE;
        } else if (stepsStateClone.length < steps.length) {
            const defaultStep = getInitialStepsState()[0];
            stepsStateClone.push(defaultStep);
        }
        
        if (stepsStateClone && stepsStateClone[activeIndex] && !(isSocial && importClicked)) {
            stepsStateClone[activeIndex].status = STEPPER_STATUS_CONSTANTS.COMPLETED;
        }

        setStepsState(stepsStateClone);
    };

    const onClickPrev = () => {
        const stepsStateClone = cloneDeep(stepsState);

        stepsStateClone[activeIndex].status = null;
        stepsStateClone[activeIndex - 1].status = STEPPER_STATUS_CONSTANTS.ACTIVE;

        setStepsState(stepsStateClone);
    };

    const getNextCTAButton = (data = {}) => {
        const { label, onClick, isDisabled, tooltip } = data;

        return (
            <div className="inline-block">
                <Button
                    type="primary"
                    label={label || "Next"}
                    onClick={onClick ? onClick.bind(this, { callback: onClickNext }) : onClickNext}
                    disabled={isDisabled}
                    tooltip={tooltip}
                    className={`${getStyle(`${addActionCTAs ? "border-right" : ""}`)}`}
                />
                {addActionCTAs && <div style={{"vertical-align": "bottom"}} className={`inline-block ${getStyle(`${isDisabled ? "disabled" : ""}`)}`}><ActionBox
                    {...actionCTAsDetails}
                /></div>}
            </div>
        );
    };

    const getPrevCTAButton = (data = {}) => {
        const { label, onClick } = data;

        return (
            <Button
                type="link"
                label={label || "Back"}
                steppersBack
                onClick={onClick ? onClick.bind(this, { callback: onClickPrev }) : onClickPrev}
                className={socialBtnName == "Schedule and Submit" ? "schedule-submit-class" : ""}
            />
        );
    };

    const getCancelCTAButton = (data = {}) => {
        const { label, onClick } = data;

        return (
            <Button
                type="link"
                label={label || "Cancel"}
                onClick={onClick}
                className="pullLeft ml-0"
            />
        );
    };

    let activeIndex = steps.length - 1;

    if (variant === "vertical") {
        return showUpperSteps ? (
            <VerticalWizardNav
                steps={steps}
                stepsState={stepsState}
                customClassName={customClassName}
            />
        ) : null;
    }

    return (
        <React.Fragment>
            <ul data-testid="el-test-steppers" className={`el-steppers ${getStyle(`${showUpperSteps ? "steps-wrap" : ""} ${isUploadLocation ? "upload-steps-wrap" : ""} ${customClassName ? customClassName : ""}`)}`}>
                {
                    steps && steps.length && steps.map(function (step, index) {
                        const { stepHeading } = step;
                        const currStepState = stepsState[index]; 
    
                        if (currStepState && currStepState.status === STEPPER_STATUS_CONSTANTS.ACTIVE) {
                            activeIndex = index;
                        }

                        if (showUpperSteps) {
                            return (
                                <li className={getStyle(currStepState && (currStepState.status === STEPPER_STATUS_CONSTANTS.ACTIVE ? "active" : currStepState.status === STEPPER_STATUS_CONSTANTS.COMPLETED ? "completed" : ""))} key={`${stepHeading || index}-${index}`}>
                                    {stepHeading}
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })
                }
            </ul>
            {
                getActiveStepContent()
            }
            {getDownloadTemplateContent()}
                
            {getActiveStepCTAHtml()}
            {getActiveStepSecondaryContent()}
        </React.Fragment>
       
    );
};

Steppers.defaultProps = {
    showUpperSteps: true,
    retainStepStatus: false,
    variant: "horizontal",
    aiMarkerAlt: "AI step"
};

Steppers.propTypes = {
    steps: PropTypes.array,
    reset: PropTypes.bool,
    initialStep: PropTypes.number,
    showUpperSteps: PropTypes.bool,
    customClassName: PropTypes.string, 
    resetTimeStamp: PropTypes.number,
    isFileUpload: PropTypes.bool,
    isFileUploadApiComplete: PropTypes.bool,
    bulkImportData: PropTypes.object,
    isSocial: PropTypes.bool,
    isSchedulePostApiComplete: PropTypes.bool,
    socialBtnName: PropTypes.string,
    isCustomFilterProcessing: PropTypes.bool,
    sCustomTokenProcessing: PropTypes.bool,
    isUploadLocation: PropTypes.bool,
    addActionCTAs: PropTypes.bool,
    isCustomTokenProcessing: PropTypes.bool,
    actionCTAsDetails: PropTypes.object,
    retainStepStatus: PropTypes.bool,
    variant: PropTypes.oneOf(["horizontal", "vertical"])
};

export default Steppers;
