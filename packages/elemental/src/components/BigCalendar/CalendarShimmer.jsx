import React from "react";
import PropTypes from "prop-types";
import styles from "./CalendarShimmer.module.scss";

const CalendarShimmer = ({ rowCount, label}) => {

    const generateRowList = () => {
        let row = [];
        for (let i = 0; i < rowCount; i++) {
            row.push(i);
        }
        return row;
    };
    
    return (
        <div>
            {
                generateRowList().map((index) => {
                    return (
                        <div id="shimmer-div" key={index} className={`${styles.shimmerWrapper} ${ label === "week" ? "" : styles.monthShimmer}`}>
                            <div className={`${styles.upperBox} ${styles.glareTransition}`} />
                            <div className={`${styles.middleBox} ${styles.glareTransition}`} />
                            {label === "week" ? <div className={`${styles.lowerBox} ${styles.glareTransition}`} /> : ""}
                        </div>
                    );
                })
            }
        </div>
    );
};

CalendarShimmer.propTypes = {
    rowCount: PropTypes.number,
    label: PropTypes.string
};

export default CalendarShimmer;
