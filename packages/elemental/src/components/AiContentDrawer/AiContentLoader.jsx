import React from "react";
import PropTypes from "prop-types";
import styles from "./AiContentDrawer.module.scss";

const AiContentLoader = ({ text = "Generating...", loaderImage }) => (
  <div className={styles["loader-wrapper"]}>
    <div className={styles["loader-spinner"]}>
      {loaderImage ? (
        <img src={loaderImage} alt="Loading" />
      ) : (
        <i className="icon_phoenix-loader" />
      )}
    </div>
    {text && <span className={styles["loader-text"]}>{text}</span>}
  </div>
);

AiContentLoader.propTypes = {
  text: PropTypes.string,
  loaderImage: PropTypes.string,
};

export default AiContentLoader;
