import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import FormInput from "atoms/FormInput";
import Tooltip from "atoms/Tooltip";
import { isEmpty } from "lodash";
import styles from "./FreeMediaImageSelector.module.scss";

function FreeMediaImageSelector({
  imageUrl,
  displayName,
  isSelected = false,
  onChangeHandler,
  photographerURL,
  placeholderSrc,
  limit = 10,
  totalSelected = 0,
  onChangeCheckboxHandler,
  type = "checkbox",
  hideFooter = false,
  checkBoxClickHandler,
  isVideo = false,
  cancelUpload,
  useNormalHtmlImageTag = false,
  showCancelUploadBtn = false,
  showShimmer = true,
  brokenImageSrc,
  // Action menu props (optional — for asset library usage)
  actionBox,
}) {
  const [isUploading, setUploading] = useState(
    useNormalHtmlImageTag ? true : false
  );
  const [isPreviewMediaLoaded, setPreviewMediaLoaded] = useState(
    useNormalHtmlImageTag ? true : false
  );
  const [isImageError, setIsImageError] = useState(false);

  useEffect(() => {
    setUploading(true);
  }, [placeholderSrc]);

  const handlePhotoClick = () => {
    if (!isUploading || !useNormalHtmlImageTag) {
      if (totalSelected >= limit && !isSelected) return;
      onChangeHandler && onChangeHandler(!isSelected);
    }
  };

  const handleImageError = (e) => {
    setIsImageError(true);
    if (brokenImageSrc) e.target.src = brokenImageSrc;
    e.target.classList.add(styles["broken-image"]);
  };

  const getFormInput = () => (
    <div>
      <FormInput
        data-testid="img-selector-checkbox"
        className={styles.checkbox}
        type={type}
        name="isImageSelected"
        checked={isSelected}
        onChange={onChangeCheckboxHandler}
        errorTooltipText={`Can't attach more than ${limit} items`}
        disabled={totalSelected >= limit && !isSelected}
        onClick={checkBoxClickHandler || undefined}
      />
      {totalSelected < 2 && !isEmpty(actionBox) && (
        <div
          className={styles["option-btn"]}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
        </div>
      )}
    </div>
  );

  const getImageAndVideoUploadingState = () => {
    if (!useNormalHtmlImageTag) return null;
    return (
      <div
        className={
          isUploading
            ? showShimmer
              ? `${styles["shimmer-card"]} ${styles["glare-transition"]}`
              : `${styles["loading-wrapper"]} ${styles["loading-display"]}`
            : `${styles["loading-wrapper"]} ${styles["loading-not-display"]}`
        }
      >
        {!showShimmer && <i className="icon_phoenix-loader" />}
        <span
          className={`${styles["lazy-load-image-background"]} lazy-load-image-background ${
            isPreviewMediaLoaded ? "d-none" : "d-block"
          }`}
        >
          {isVideo ? (
            <video
              className={styles["vid-opacity"]}
              src={placeholderSrc}
              onLoadedMetadata={() => setPreviewMediaLoaded(false)}
            />
          ) : (
            <img
              className={styles["vid-opacity"]}
              src={placeholderSrc}
              onLoad={() => setPreviewMediaLoaded(false)}
            />
          )}
        </span>
      </div>
    );
  };

  const getImageAndVideo = () => {
    if (isVideo) {
      return (
        <span
          className={`${styles["lazy-load-image-background"]} lazy-load-image-background ${styles["video-wrapper"]}`}
          style={{ display: isUploading ? "none" : "block" }}
        >
          <i
            className={`${styles["video-play-button"]} icon_phoenix-videoplay`}
          />
          <video src={imageUrl} onLoadedMetadata={() => setUploading(false)} />
        </span>
      );
    }

    if (useNormalHtmlImageTag) {
      return (
        <span
          className={`${styles["lazy-load-image-background"]} lazy-load-image-background`}
          style={{ display: isUploading ? "none" : "block" }}
        >
          <img
            src={imageUrl}
            onLoad={() => setUploading(false)}
            data-testid="img-selector-img"
            onError={handleImageError}
          />
        </span>
      );
    }

    return (
      <LazyLoadImage
        src={imageUrl}
        alt=""
        effect="blur"
        placeholderSrc={placeholderSrc}
        data-testid="img-selector-img"
        onError={handleImageError}
      />
    );
  };

  return (
    <div
      className={`${styles["image-selector-wrapper"]} ${
        isSelected ? styles["selected-image"] : ""
      } ${totalSelected >= limit && !isSelected ? styles["no-drop"] : ""}`}
      style={
        isImageError
          ? { pointerEvents: "none" }
          : { pointerEvents: "all" }
      }
      onClick={handlePhotoClick}
    >
      {getImageAndVideoUploadingState()}
      {getImageAndVideo()}
      {isUploading &&
        showCancelUploadBtn &&
        !imageUrl?.includes("cloudfront.") && (
          <div
            className={`${styles["option-btn"]} icon_phoenix-close`}
            onClick={(event) => {
              event.stopPropagation();
              cancelUpload && cancelUpload();
            }}
          />
        )}
      {(!isUploading || !showCancelUploadBtn) &&
        (totalSelected >= limit && !isSelected ? (
          <Tooltip
            text={`Can't attach more than ${limit} items`}
            position="bottom-left"
            hideOnScroll
            customContainerClassName="alert-tooltip"
            tooltipClass="mt-30"
          >
            {getFormInput()}
          </Tooltip>
        ) : (
          getFormInput()
        ))}
      {!hideFooter && (
        <div className={styles["footer-details"]}>
          <a
            href={photographerURL}
            className={styles["author-name"]}
            target="_blank"
            rel="noreferrer noopener"
          >
            {displayName}
          </a>
          <a
            href={imageUrl}
            className={styles["detail-icon"]}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="icon_phoenix-arrow-up" />
          </a>
        </div>
      )}
    </div>
  );
}

FreeMediaImageSelector.propTypes = {
  imageUrl: PropTypes.string,
  displayName: PropTypes.string,
  isSelected: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  onChangeCheckboxHandler: PropTypes.func,
  photographerURL: PropTypes.string,
  placeholderSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  totalSelected: PropTypes.number,
  limit: PropTypes.number,
  type: PropTypes.string,
  hideFooter: PropTypes.bool,
  checkBoxClickHandler: PropTypes.func,
  isVideo: PropTypes.bool,
  cancelUpload: PropTypes.func,
  useNormalHtmlImageTag: PropTypes.bool,
  showCancelUploadBtn: PropTypes.bool,
  showShimmer: PropTypes.bool,
  brokenImageSrc: PropTypes.string,
  actionBox: PropTypes.object,
};

export default FreeMediaImageSelector;
