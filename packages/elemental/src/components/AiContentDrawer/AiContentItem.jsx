import React from "react";
import PropTypes from "prop-types";
import FormInput from "atoms/FormInput";
import styles from "./AiContentDrawer.module.scss";

const AiContentItem = ({
  id,
  content,
  isSelected,
  onSelect,
  index,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onSelect(id, index);
    }
  };

  return (
    <div
      className={`${styles["content-item"]} ${isSelected ? styles["selected"] : ""}`}
      onClick={handleClick}
    >
      <div className={styles["radio-wrapper"]}>
        <FormInput
          name={`ai-content-${id}`}
          type="radio"
          checked={isSelected}
          onChange={() => onSelect(id, index)}
          disabled={disabled}
        />
      </div>
      <div
        className={styles["content-text"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

AiContentItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  content: PropTypes.string,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  index: PropTypes.number,
  disabled: PropTypes.bool,
};

export default AiContentItem;
