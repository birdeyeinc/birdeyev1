import React from "react";
import PropTypes from "prop-types";
import SingleSelect from "atoms/SingleSelect";
import styles from './TimePicker.module.scss';

const Timepicker = (props) => {

    const { changeTime, timeObject, timezoneLabel } = props;

    const hourOptions = [...Array(13).keys()].slice(1).map((i) => {
        return {
            label: `${i < 10 ? "0" : ""}${i}`,
            value: `${i < 10 ? "0" : ""}${i}`
        };
    });

    const minutesOptions = [...Array(60).keys()].map((i) => {
        return {
            label: `${i < 10 ? "0" : ""}${i}`,
            value: `${i < 10 ? "0" : ""}${i}`
        };
    });

    return (
        <div data-testid="el-test-time-picker" className={`el-timepicker ${styles["calander-select-wrapper"]}`}>
            <SingleSelect
                options={hourOptions}
                customSize="x-small"
                customClass={`mr-10 ${styles["separator-box"]}`}
                className={styles["dropdown-box"]}
                customParentClass={styles['filter-dropdown']}
                hideLabelInDropDownOptions
                selected={timeObject.hours}
                onChange={(e) => {
                    changeTime(e, "hours");
                }}
            />
            <SingleSelect
                options={minutesOptions}
                customSize="x-small"
                customClass="mr-10"
                className={styles["dropdown-box"]}
                customParentClass={styles['filter-dropdown']}
                selected={timeObject.minutes}
                onChange={(e) => {
                    changeTime(e, "minutes");
                }}
                hideLabelInDropDownOptions
            />
            <SingleSelect
                options={[{
                    label: `AM ${timezoneLabel ? `(${timezoneLabel})` : ""}`,
                    value: "am"
                }, {
                    label: `PM ${timezoneLabel ? `(${timezoneLabel})` : ""}`,
                    value: "pm"
                }]}
                selected={timeObject.meridiem}
                className={styles["dropdown-box"]}
                customParentClass={styles['filter-dropdown']}
                onChange={(e) => {
                    changeTime(e, "meridiem");
                }}
                customSize="x-small"
                hideLabelInDropDownOptions
            />
        </div>
    );
};

Timepicker.propTypes = {
    changeTime: PropTypes.func,
    timeObject: PropTypes.obj,
    timezoneLabel: PropTypes.string
};

export default Timepicker;