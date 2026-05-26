import React from "react";
import PropTypes from "prop-types";
import styles from "./Chip.module.scss";

const Chip = ({
  variant = "tonal", // default variant
  colorType = "grey", // default color
  size,
  avatar: Avatar,
  label: Label = "",
  rightIcon: Icon,
  leftIcon: LeftIcon,
  onIconClick,
  clickable = false,
  onClick,
  disabled = false,
  customParentStyleClass = "",
  minWidth
}) => {
    const isClickable = clickable && onClick;
  const handleChipClick = (e) => {
    if (disabled) return;
    if (isClickable) {
      onClick(e);
    }
  };

  const handleIconClick = (e) => {
    e.stopPropagation(); // Prevent triggering the chip's onClick
    if (onIconClick) {
      onIconClick();
    }
  };

  const iconInteractiveClass = !!onIconClick ? styles.interactive : '';
  const isChipHoverable = !!onIconClick && Icon ? true : isClickable ;
  const labelContent = typeof Label === "string" ? Label : <Label />;
  
  return (
    <span data-testid="el-test-chip-on-click"
      className={`ds-font-inter el-chip ${styles.chip} ${styles[variant]} ${styles[colorType]} ${size && styles[`chip--${size}`]}
      ${ disabled ? `el-chip-disabled ${styles.disabled}` : ""} 
      ${isClickable ? styles.clickable : ""}
      ${isChipHoverable ? styles.hoverableChip : ""}
      ${customParentStyleClass}`}
      onClick={handleChipClick}
      style={minWidth ? { minWidth } : undefined}
    >
      {Avatar && (
        <span className={`el-chip-avatar ${styles.avatar} ${styles[`avatar--${size}`]}`}>
          <Avatar />
        </span>
      )}
      {LeftIcon && (
        <span
          className={`el-chip-icon-left ${styles.icon} ${styles[`icon--${size}`]} ${styles.left}`}
          aria-label="Left Icon"
        >
          <LeftIcon />
        </span>
      )}
      {variant === "outlinedIconFilled"
          ? <span className={styles.label}>{labelContent}</span>
          : labelContent
        }
      {Icon && (
        <span
          className={`el-chip-icon-right ${styles.icon} ${styles[`icon--${size}`]} ${iconInteractiveClass}`}
          data-testid="el-test-chip-right-icon-on-click"
          onClick={handleIconClick}
          aria-label="Action"
        >
          <Icon />
        </span>
      )}
    </span>
  );
};

Chip.propTypes = {
  variant: PropTypes.oneOf(["outlined", "filled","tonal","token", "outlinedIconFilled"]),
  colorType: PropTypes.oneOf(["red","grey","green","yellow","purple","blue"]),
  size: PropTypes.oneOf(["small"]),
  avatar: PropTypes.elementType,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]).isRequired,
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
  onIconClick: PropTypes.func,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  customParentStyleClass: PropTypes.string,
  minWidth: PropTypes.string
};

export default Chip;
