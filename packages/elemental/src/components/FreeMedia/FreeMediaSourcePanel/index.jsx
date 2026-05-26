import React from "react";
import PropTypes from "prop-types";
import styles from "./FreeMediaSourcePanel.module.scss";

/**
 * @param {Array} sources - Array of { key, label, icon } objects.
 * @param {string} activeSource - Currently active source key.
 * @param {function} onSourceChange - Called with the source key when clicked.
 */
const FreeMediaSourcePanel = ({ sources = [], activeSource, onSourceChange }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className={styles["source-panel"]}>
      <ul>
        {sources.map((source) => (
          <li
            key={source.key}
            className={activeSource === source.key ? styles["active"] : ""}
            onClick={() => onSourceChange && onSourceChange(source.key)}
          >
            {source.icon && (
              <img src={source.icon} className={styles["icon"]} alt={source.label} />
            )}
            <p>{source.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

FreeMediaSourcePanel.propTypes = {
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ),
  activeSource: PropTypes.string,
  onSourceChange: PropTypes.func,
};

export default FreeMediaSourcePanel;
