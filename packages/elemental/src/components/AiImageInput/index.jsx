import React, { useState } from "react";
import PropTypes from "prop-types";
import FormInput from "atoms/FormInput";
import styles from "./AiImageInput.module.scss";

const ORIENTATION_OPTIONS = ["square", "landscape", "portrait"];

const AiImageInput = ({
  // Input state (controlled or uncontrolled)
  value,
  onChange,
  defaultValue = "",

  // Submit handler
  onSubmit,

  // Orientation state (controlled or uncontrolled)
  orientation,
  onOrientationChange,
  defaultOrientation = "square",
  orientationOptions = ORIENTATION_OPTIONS,
  showOrientationOptions = true,

  // Loading state
  isLoading = false,
  isDisabled = false,
  loadingItemCount = 4,

  // Placeholder
  placeholder = "Tell BirdAI what you want to create",

  // Generated images
  images = [],
  selectedImage,
  onImageSelect,

  // Customization
  renderImageItem,
  gridColumns = 2,
  submitIcon,
  submitLabel,

  // Section header
  showSectionHeader = true,
  aiPhraseText = "AI",


  // Callbacks
  onUnmount,
}) => {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOrientation, setInternalOrientation] = useState(defaultOrientation);
  // Use controlled or uncontrolled values
  const inputValue = value !== undefined ? value : internalValue;
  const currentOrientation = orientation !== undefined ? orientation : internalOrientation;

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleOrientationChange = (opt) => {
    if (orientation === undefined) {
      setInternalOrientation(opt);
    }
    onOrientationChange?.(opt);
  };

  const handleSubmit = () => {
    if (isDisabled || isLoading || !inputValue.trim()) {
      return;
    }
    onSubmit?.(inputValue, currentOrientation);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading && !isDisabled) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      onUnmount?.();
    };
  }, []);

  const getGridClassName = () => {
    switch (gridColumns) {
      case 1:
        return styles["single-column"];
      case 3:
        return styles["three-columns"];
      default:
        return "";
    }
  };

  const renderInput = () => (
    <div className={styles["input-section"]}>
      <div className={styles["input-wrapper"]}>
        <input
          type="text"
          className={styles["text-input"]}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          autoFocus
        />
        <button
          className={styles["submit-btn"]}
          onClick={handleSubmit}
          disabled={isDisabled || isLoading || !inputValue.trim()}
        >
          {submitIcon ? (
            <img src={submitIcon} alt="Submit" />
          ) : submitLabel ? (
            <span>{submitLabel}</span>
          ) : (
            <i className="icon_phoenix-bell" />
          )}
        </button>
      </div>

      {showOrientationOptions && (
        <div className={styles["orientation-options"]}>
          <span className={styles["orientation-label-text"]}>Select orientation:</span>
          {orientationOptions.map((opt) => (
            <label key={opt} className={styles["orientation-option"]}>
              <FormInput
                name="ai-image-orientation"
                type="radio"
                value={opt}
                checked={currentOrientation === opt}
                onChange={() => handleOrientationChange(opt)}
                disabled={isDisabled || isLoading}
              />
              <span className={styles["option-label"]}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const renderImages = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className={styles["images-section"]}>
          {showSectionHeader && (
            <div className={styles["section-header"]}>
              <i className={`icon_phoenix-ai-icon ${styles["ai-icon"]}`} />
              <span>Generating images using {aiPhraseText}...</span>
            </div>
          )}
          <div className={styles["loading-grid"]}>
            {Array.from({ length: loadingItemCount }).map((_, index) => (
              <div key={index} className={styles["loading-item"]} />
            ))}
          </div>
        </div>
      );
    }

    // Show generated images
    return (
      <div className={styles["images-section"]}>
        <div className={`${styles["image-grid"]} ${getGridClassName()}`}>
          {images.map((imageUrl, index) => {
            const isSelected = selectedImage === imageUrl;

            if (renderImageItem) {
              return renderImageItem(imageUrl, index, isSelected, () => onImageSelect?.(imageUrl));
            }

            return (
              <div
                key={index}
                className={`${styles["image-item"]} ${isSelected ? styles["selected"] : ""}`}
                onClick={() => onImageSelect?.(imageUrl)}
              >
                <img src={imageUrl} alt={`Generated ${index + 1}`} />
                {isSelected && <i className={`icon_phoenix-check ${styles["check-icon"]}`} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <div className={styles["ai-image-input-wrapper"]}>
      {renderInput()}
      {renderImages()}
    </div>
  );
};

AiImageInput.propTypes = {
  // Input state
  value: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,

  // Submit handler
  onSubmit: PropTypes.func,

  // Orientation
  orientation: PropTypes.oneOf(ORIENTATION_OPTIONS),
  onOrientationChange: PropTypes.func,
  defaultOrientation: PropTypes.oneOf(ORIENTATION_OPTIONS),
  orientationOptions: PropTypes.arrayOf(PropTypes.string),
  showOrientationOptions: PropTypes.bool,

  // Loading
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  loadingItemCount: PropTypes.number,

  // Placeholder
  placeholder: PropTypes.string,

  // Images
  images: PropTypes.arrayOf(PropTypes.string),
  selectedImage: PropTypes.string,
  onImageSelect: PropTypes.func,

  // Customization
  renderImageItem: PropTypes.func,
  gridColumns: PropTypes.oneOf([1, 2, 3]),
  submitIcon: PropTypes.string,
  submitLabel: PropTypes.string,

  // Section header
  showSectionHeader: PropTypes.bool,
  aiPhraseText: PropTypes.string,


  // Callbacks
  onUnmount: PropTypes.func,
};

export default AiImageInput;
