import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Copilot from "../index";
import styles from "../styles/copilotPortal.module.scss";

const CopilotPortal = ({ shouldShowPortal, ...copilotProps }) => {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    // Check if target already exists
    const existingTarget = document.getElementById("copilot-portal-target");
    if (existingTarget) {
      setTarget(existingTarget);
    }

    const observer = new MutationObserver(() => {
      const el = document.getElementById("copilot-portal-target");
      if (el && !target) {
        setTarget(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [target]);

  return (
    target &&
    ReactDOM.createPortal(
      <div
        className={`${styles.copilotPortalWrapper} copilot-portal-wrapper`}
        style={{ 
          display: shouldShowPortal ? "block" : "none",
          // Alternative: Use visibility instead of display
          // visibility: shouldShowPortal ? "visible" : "hidden"
        }}
      >
        <div className={styles.copilotContainer}>
          <Copilot {...copilotProps} shouldShowPortal={shouldShowPortal} />
        </div>
      </div>,
      target
    )
  );
};

export default CopilotPortal;