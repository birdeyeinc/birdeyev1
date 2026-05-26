import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import InfiniteScroll from "react-infinite-scroller";
import FreeMediaImageSelector from "components/FreeMedia/FreeMediaImageSelector";
import FreeMediaShimmer from "components/FreeMedia/FreeMediaShimmer";
import { appConst } from "utils/appConst";
import styles from "./FreeMediaGrid.module.scss";

const FreeMediaGrid = ({
  media = [],
  freeMediaSelected = [],
  hasMore = false,
  loadMore,
  freeMediaSource,
  isFreeMediaLoading = false,
  handleMultipleSelectChange,
  // Image URL resolvers — caller provides these
  getImageUrl,
  getDisplayName,
  getPlaceholderSrc,
  getPhotographerURL,
  // Optional overrides
  enableSeeMore = false,
  handleClickSeeMore,
  showFileName = false,
  hideFooter = false,
  limit,
  // Extra features passthrough
  showInLightBox = false,
  handleLightBoxCb,
  handleClickCheckboxHandler,
  useNormalHtmlImageTag = false,
  cancelUpload,
  showCancelUploadBtn = false,
  triggerRef,
  dataLoading = false,
  brokenImageSrc,
  // Action menu props (optional — for asset library usage)
  getActionBoxConfig,
  handleAssetOptionClick,
  customFunOnClickOutSide,
  customFunOnClickActionBox,
  getFolderListData,
  assetLibData,
  triggerContentLibOperationWithActionType,
}) => {
  
  const effectiveLimit = limit || appConst.MAX_FREE_MEDIA_UPLOAD;

  const handleOnChangeHandler = (photo, isSelected, index) => {
    if (showInLightBox) {
      handleLightBoxCb && handleLightBoxCb(index);
    } else if (handleClickCheckboxHandler) {
      handleClickCheckboxHandler(photo, null, isSelected);
    } else {
      handleMultipleSelectChange && handleMultipleSelectChange(photo, isSelected);
    }
  };

  const handleOnChangeCheckboxHandler = (photo, checked) => {
    if (showInLightBox) return;
    if (handleClickCheckboxHandler) {
      handleClickCheckboxHandler(photo, { target: { checked } });
    } else {
      handleMultipleSelectChange && handleMultipleSelectChange(photo, checked);
    }
  };

  // Build action box configuration for a given photo (asset library feature)
  const getActionBoxConfiguration = (photo) => {
    if (getActionBoxConfig && typeof getActionBoxConfig === "function") {
      const isVideo = photo?.type?.includes("video") || photo?.type?.includes("VIDEO");
      const config = getActionBoxConfig(isVideo);
      if (config) {
        const folderSubMenu = [];
        const params = new URLSearchParams(window.location.search);
        const folderName = params.get("folderName");
        const foldersSource = Array.isArray(assetLibData?.folderList)
          ? assetLibData?.folderList
          : assetLibData?.folderList?.folders;

        if (Array.isArray(foldersSource)) {
          foldersSource.forEach((folder) => {
            if ((folder.name || folder.folderName) !== folderName) {
              folderSubMenu.push({
                label: folder.name || folder.folderName,
                value: folder.id,
                enable: true,
              });
            }
          });
        }

        if (folderSubMenu.length === 0) {
          folderSubMenu.push({
            label: "No folders available",
            value: "no-folders",
            enable: false,
          });
        }

        const updatedOptions = config.actionConfig.categories[0].options.map((option) => {
          if (option.value === "moveToFolder") {
            return { ...option, subMenu: folderSubMenu };
          }
          return option;
        });

        return {
          ...config,
          actionConfig: {
            ...config.actionConfig,
            categories: [
              {
                ...config.actionConfig.categories[0],
                options: updatedOptions,
              },
            ],
          },
          actionClickCb: (clickedItem) => config.actionClickCb(clickedItem, photo),
        };
      }
    }
    return undefined;
  };

  const imageRender = () => (
    <div className={styles["grid-container"]}>
      {media &&
        media.map((photo, index) => (
          <div className={styles["grid-item"]} key={photo.id}>
            <FreeMediaImageSelector
              imageUrl={getImageUrl ? getImageUrl(photo, index) : ""}
              displayName={getDisplayName ? getDisplayName(photo) : ""}
              placeholderSrc={getPlaceholderSrc ? getPlaceholderSrc(photo) : undefined}
              photographerURL={getPhotographerURL ? getPhotographerURL(photo) : ""}
              onChangeCheckboxHandler={(e) =>
                handleOnChangeCheckboxHandler(photo, e?.target?.checked)
              }
              onChangeHandler={(isSelected) =>
                handleOnChangeHandler(photo, isSelected, index)
              }
              checkBoxClickHandler={
                handleClickCheckboxHandler && showInLightBox
                  ? (e) =>
                      handleClickCheckboxHandler(
                        photo,
                        e,
                        null,
                        "checkboxClicked"
                      )
                  : undefined
              }
              isSelected={
                !!(
                  freeMediaSelected &&
                  freeMediaSelected.find((img) => img.id === photo.id)
                )
              }
              totalSelected={freeMediaSelected?.length || 0}
              limit={effectiveLimit}
              isVideo={
                photo?.type?.includes("video") ||
                photo?.type?.includes("VIDEO")
              }
              hideFooter={hideFooter}
              actionBox={getActionBoxConfiguration(photo)}
              useNormalHtmlImageTag={useNormalHtmlImageTag}
              cancelUpload={cancelUpload ? () => cancelUpload(photo) : undefined}
              showCancelUploadBtn={showCancelUploadBtn}
              showShimmer={photo.showShimmer}
              brokenImageSrc={brokenImageSrc}
              assetOptionClickHandler={handleAssetOptionClick ? () => handleAssetOptionClick(photo) : undefined}
              customFunOnClickOutSide={customFunOnClickOutSide}
              customFunOnClickActionBox={customFunOnClickActionBox}
              getFolderListData={getFolderListData}
              triggerContentLibOperationWithActionType={triggerContentLibOperationWithActionType}
              assetId={photo.id}
              asseetName={photo.name}
            />
            {showFileName && (
              <div className={styles["photo-name"]}>{photo.name}</div>
            )}
          </div>
        ))}
      {((hasMore && !isFreeMediaLoading) ||
        (triggerRef && dataLoading)) && (
        <FreeMediaShimmer initialLoading={false} />
      )}
      {triggerRef && !dataLoading && (
        <div
          ref={triggerRef}
          className={classnames(styles["trigger"], {
            [styles["visible"]]: dataLoading,
          })}
        />
      )}
    </div>
  );

  return (
    <div
      className={classnames(styles["media-scroll-wrapper"], {
        [styles["giphy-media"]]: freeMediaSource === "Giphy",
      })}
    >
      {enableSeeMore ? (
        <div>
          {imageRender()}
          <span
            className={styles["load-more-images"]}
            onClick={() => {
              loadMore && loadMore();
              handleClickSeeMore && handleClickSeeMore();
            }}
          >
            {hasMore && !isFreeMediaLoading ? "See more" : null}
          </span>
        </div>
      ) : (
        <InfiniteScroll
          pageStart={1}
          loadMore={loadMore}
          hasMore={hasMore}
          useWindow={false}
        >
          {imageRender()}
        </InfiniteScroll>
      )}
    </div>
  );
};

FreeMediaGrid.propTypes = {
  media: PropTypes.array,
  freeMediaSelected: PropTypes.array,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  freeMediaSource: PropTypes.string,
  isFreeMediaLoading: PropTypes.bool,
  handleMultipleSelectChange: PropTypes.func,
  getImageUrl: PropTypes.func,
  getDisplayName: PropTypes.func,
  getPlaceholderSrc: PropTypes.func,
  getPhotographerURL: PropTypes.func,
  enableSeeMore: PropTypes.bool,
  handleClickSeeMore: PropTypes.func,
  showFileName: PropTypes.bool,
  hideFooter: PropTypes.bool,
  limit: PropTypes.number,
  showInLightBox: PropTypes.bool,
  handleLightBoxCb: PropTypes.func,
  handleClickCheckboxHandler: PropTypes.func,
  useNormalHtmlImageTag: PropTypes.bool,
  cancelUpload: PropTypes.func,
  showCancelUploadBtn: PropTypes.bool,
  triggerRef: PropTypes.object,
  dataLoading: PropTypes.bool,
  brokenImageSrc: PropTypes.string,
  // Action menu props (optional — for asset library usage)
  getActionBoxConfig: PropTypes.func,
  handleAssetOptionClick: PropTypes.func,
  customFunOnClickOutSide: PropTypes.func,
  customFunOnClickActionBox: PropTypes.func,
  getFolderListData: PropTypes.func,
  assetLibData: PropTypes.object,
  triggerContentLibOperationWithActionType: PropTypes.func,
};

export default FreeMediaGrid;
