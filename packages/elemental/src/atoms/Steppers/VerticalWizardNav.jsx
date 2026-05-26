import React from "react";
import PropTypes from "prop-types";
import Tooltip from "atoms/Tooltip";
import styles from "./Steppers.module.scss";
import { STEPPER_STATUS_CONSTANTS } from "./Steppers.constants";

const DEFAULT_TRUNCATION_THRESHOLD = 24;
const DEFAULT_TRUNCATED_LENGTH = 25;

const getStepLabel = (step = {}) => step.stepHeading || step.name || "";

const getVerticalStepLabel = (label = "") => {
    if (label.length < DEFAULT_TRUNCATION_THRESHOLD) {
        return <span className={styles["wizard-side-nav-text"]}>{label}</span>;
    }

    return (
        <Tooltip text={label}>
            <span className={styles["wizard-side-nav-text"]}>
                {label.substring(0, DEFAULT_TRUNCATED_LENGTH)}...
            </span>
        </Tooltip>
    );
};

const getVerticalStepState = (step = {}, stepState) => ({
    isSelected: typeof step.selected === "boolean"
        ? step.selected
        : stepState?.status === STEPPER_STATUS_CONSTANTS.ACTIVE,
    isCompleted: typeof step.isCompleted === "boolean"
        ? step.isCompleted
        : stepState?.status === STEPPER_STATUS_CONSTANTS.COMPLETED || step.status === STEPPER_STATUS_CONSTANTS.COMPLETED,
    isMandatory: !!step.isMandatory
});

const VerticalWizardNav = ({
    steps,
    stepsState,
    customClassName
}) => {
    return (
        <ul data-testid="el-test-steppers" className={`el-steppers ${styles["wizard-side-nav"]} ${customClassName || ""}`}>
            {steps.map((step, index) => {
                const label = getStepLabel(step);
                const { isSelected, isCompleted, isMandatory } = getVerticalStepState(step, stepsState[index]);
                const itemClassName = [
                    styles["wizard-side-nav-item"],
                    isMandatory ? styles["wizard-side-nav-item-disabled"] : ""
                ].filter(Boolean).join(" ");
                const buttonClassName = [
                    styles["wizard-side-nav-button"],
                    isSelected ? styles["wizard-side-nav-button-selected"] : ""
                ].filter(Boolean).join(" ");

                return (
                    <li className={itemClassName} key={`${label || index}-${index}`}>
                        <button
                            type="button"
                            className={buttonClassName}
                            onClick={step.onClick}
                            disabled={isMandatory}
                        >
                            {step.icon ? (
                                <span className={styles["wizard-side-nav-icon-box"]}>{step.icon}</span>
                            ) : null}
                            {getVerticalStepLabel(label)}
                            {step.aiMarker && !isCompleted ? (
                                <span className={styles["wizard-side-nav-ai-marker"]}>
                                    <i className={`icon icon_phoenix-ai-chat ${styles["wizard-side-nav-ai-marker-icon"]}`} />
                                </span>
                            ) : null}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

VerticalWizardNav.propTypes = {
    steps: PropTypes.array.isRequired,
    stepsState: PropTypes.array,
    customClassName: PropTypes.string
};

VerticalWizardNav.defaultProps = {
    stepsState: [],
    customClassName: ""
};

export default VerticalWizardNav;
