import React, { Fragment } from "react"
import PropTypes from "prop-types";

const WeekAndMonthViewLoader = (props) => {
    const { rowCount, label, customWeekAndMonthViewLoader } = props;

    const generateRowList = () => {
        let row = [];
        for (let i = 0; i < rowCount; i++) {
            row.push(i);
        }
        return row;
    };

    const getNestedSkeleton = () => {
        if (customWeekAndMonthViewLoader) return <Fragment>{customWeekAndMonthViewLoader}</Fragment>;
        return (<Fragment><div className="upper-box glare-transition" />
            <div className="middle-box glare-transition" />
            {label === "week" ? <div className="lower-box glare-transition" /> : ""}</Fragment>)
    }

    const postSkeleton = (index) => {
        return (
            <div id="shimmer-div" key={index} className={`rbc-calendar-shimmer ${label === "week" ? "" : "month-shimmer"}`}>
                {getNestedSkeleton()}
            </div>
        );
    }

    return (
        <div className="rbc-week-month-loader">
            {generateRowList().map(postSkeleton)}
        </div>
    );
}

WeekAndMonthViewLoader.propTypes = {
    rowCount: PropTypes.number,
    label: PropTypes.string,
    customWeekAndMonthViewLoader: PropTypes.node
}

export default WeekAndMonthViewLoader;