import React from "react";
import PropTypes from "prop-types";
import Tooltip from "atoms/Tooltip";
import styles from "./AiContentDrawer.module.scss";

const AiContentActions = ({
  onRegenerate,
  isLoading,
  remainingCount,
  totalCount,
  showThumbsUpDown = true,
  regenerateIcon,
  regenerateLabel = "Regenerate",
  onThumbsUp,
  onThumbsDown,
  thumbsUpTooltip = "Helpful",
  thumbsDownTooltip = "Not so helpful",
}) => {
  const isDisabled = isLoading || remainingCount <= 0;

  return (
    <div className={styles["drawer-footer"]}>
      <div className={styles["regenerate-section"]}>
        <button
          className={`${styles["regenerate-btn"]} ${isDisabled ? styles["disabled"] : ""}`}
          onClick={onRegenerate}
          disabled={isDisabled}
        >
          {regenerateIcon ? (
            <img
              src={regenerateIcon}
              alt="Regenerate"
              className={styles["regenerate-icon"]}
            />
          ) : (
            <i className="icon_phoenix-refresh" />
          )}
          <span>{regenerateLabel}</span>
        </button>
        {totalCount > 0 && (
          <span className={styles["remaining-count"]}>
            {remainingCount} of {totalCount} remaining
          </span>
        )}
      </div>

      {showThumbsUpDown && (
        <div className={styles["thumbs-section"]}>
          <Tooltip text={thumbsUpTooltip} position="top" hideOnScroll>
            <span className={styles["thumb-btn"]} onClick={onThumbsUp}>
              <i className="icon_phoenix-facebook-like" />
            </span>
          </Tooltip>
          <Tooltip text={thumbsDownTooltip} position="top" hideOnScroll>
            <span className={styles["thumb-btn"]} onClick={onThumbsDown}>
              <i className="icon_phoenix-dislike" />
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

AiContentActions.propTypes = {
  onRegenerate: PropTypes.func,
  isLoading: PropTypes.bool,
  remainingCount: PropTypes.number,
  totalCount: PropTypes.number,
  showThumbsUpDown: PropTypes.bool,
  regenerateIcon: PropTypes.string,
  regenerateLabel: PropTypes.string,
  onThumbsUp: PropTypes.func,
  onThumbsDown: PropTypes.func,
  thumbsUpTooltip: PropTypes.string,
  thumbsDownTooltip: PropTypes.string,
};

export default AiContentActions;
