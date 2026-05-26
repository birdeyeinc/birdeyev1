import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./FreeMediaShimmer.module.scss";

const FreeMediaShimmer = ({ initialLoading = true, perPageLimit = 22 }) => {
  const getShimmer = (count) =>
    Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className={`${styles["shimmer-card"]} ${styles["glare-transition"]}`}
      />
    ));

    return (
    <Fragment>
      {initialLoading ? (
        <div
          className={`${styles["shimmer-container"]} ${styles["custom-scroll"]}`}
        >
          {getShimmer(perPageLimit)}
        </div>
      ) : (
        <Fragment>
          {getShimmer(10)}
        </Fragment>
      )}
    </Fragment>
  );
};

FreeMediaShimmer.propTypes = {
  initialLoading: PropTypes.bool,
  perPageLimit: PropTypes.number,
};

export default FreeMediaShimmer;
