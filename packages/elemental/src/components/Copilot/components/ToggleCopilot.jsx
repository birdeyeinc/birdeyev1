import React from "react";
import styles from "../styles/toggleCopilot.module.scss";

const ToggleCopilot = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
    >
      <div className={styles.iconContainer}>Toggle Copilot</div>
    </button>
  );
};

export default ToggleCopilot;
