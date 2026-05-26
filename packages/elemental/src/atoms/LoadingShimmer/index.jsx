import React from "react";
import styles from "./LoadingShimmer.module.scss";
import PropTypes from "prop-types";
import { getEncodedStyleClass } from "utils";

function LoadingShimmer(props) {
    const { customClassName, customWrapperClassName = "", size: shimmerSize, shimmerCount, displayCount = 0 } = props;

    const dynamicShimmer = () => {
        const rows = [];
        const isArrayConfig = Array.isArray(shimmerCount);
        const len = isArrayConfig ? shimmerCount.length : shimmerCount;

        for (let i = 0; i < len; i++) {
            const { size = "", height = "", width = "" } = isArrayConfig ? shimmerCount[i] : { size: shimmerSize };
            const JSX = (<div key={i} className={`${customClassName} ${getEncodedStyleClass(`loading-shimmer ${size} ${height} ${width}`, styles)}`} />);

            rows.push(JSX);
        }

        return Array.from({ length: displayCount }, (_, index) => index).map(i => <div key={i} className={`${customWrapperClassName} ${styles["shimmer-wrapper"]}`}>{rows}</div>)
    };

    const encodedShimmerClassList = getEncodedStyleClass(`loading-shimmer ${shimmerSize ? shimmerSize : ""}`, styles)

    return (
        <div className="el-loading-shimmer">
            {shimmerCount ? dynamicShimmer() :
                <div>
                    <div className={`${customClassName} ${encodedShimmerClassList}`} />
                    <div className={`${customClassName} ${encodedShimmerClassList}`} />
                    <div className={`${customClassName} ${encodedShimmerClassList}`} />
                    <div className={`${customClassName} ${encodedShimmerClassList}`} />
                </div>
            }
        </div>
    );
}

LoadingShimmer.propTypes = {
    size: PropTypes.string,
    displayCount: PropTypes.number,
    customClassName: PropTypes.string,
    customWrapperClassName: PropTypes.string,
    shimmerCount: PropTypes.oneOfType([PropTypes.number, PropTypes.array])
};

export default LoadingShimmer;