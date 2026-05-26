import PropTypes from "prop-types";
import { map, toLower } from "lodash";
import styles from "./TabHeader.module.scss";
import React, { Fragment, useMemo, useState } from "react";
import { toCapitalize } from "utils";
import Tooltip from "atoms/Tooltip";
import ActionBox from "atoms/ActionBox";
import OverflowList from "atoms/OverflowList";

function TabHeader(props) {
  const {
    content,
    clickTab,
    customClass,
    activeTab,
    noSeperator,
    gsrEnabled,
    gsrUrl,
    disableNoActiveTabs,
    disableTabList,
    showTooltipOnTab = false,
    chooseAlbum,
    capitalize,
    showCount,
    isImagesOnTab = false,
    showMore = false,
    isAeroDesign = true,
    overflowRenderer: overflowRendererOverride,
  } = props;

  const [updatedContent, setUpdatedContent] = useState(window?.sessionStorage?.getItem("L4TabContent") ? JSON.parse(window?.sessionStorage?.getItem("L4TabContent")) : content);

  const getActiveStepClass = (obj) => {
    if (obj.value == activeTab) {
      return styles["activeClass"];
    }
  };

  const getClassInCaseOfShowMore = () => {
    if (showMore) {
      return styles["no-wrap-show-more"];
    }
  }

  const getMoreOptions = (options) => {
    const actionOptions = options.map((item) => {
      return {
        value: item?.value,
        label: item?.label,
        enable: true,
        callBack: () => {}
      };
    });

    return {
      categories: [
        {
          title: "",
          options: actionOptions
        }
      ]
    };
  };

  const defaultOverflowRenderer = (items) => {
    return (
      <ActionBox
        actionConfig={getMoreOptions(items)}
        actionClickCb={(selectedItem) => clickTab(selectedItem?.value)}
        ActionLabel="More"
        popOverSize="medium"
        customClassName={`${styles["more-options"]}`}
      />
    );
  };

  // Caller-supplied overflow renderer takes precedence; falls back to the built-in ActionBox.
  const overflowRenderer = (items) =>
    overflowRendererOverride
      ? overflowRendererOverride(items, clickTab)
      : defaultOverflowRenderer(items);

  const itemRenderer = (obj, index) => {
    return (
      <React.Fragment key={index}>
        {renderTabsJSX(obj)}
      </React.Fragment>
    );
  };

  const renderTabsJSX = (obj) => {
    return (
      <li
        key={`${obj.label}_${obj.value}`}
        onClick={(e) => {
          clickTab(obj.value, e);
        }}
        className={`
                    ${disableNoActiveTabs &&
            disableTabList.find((item) => item === obj.value)
            ? "pointer-events-none"
            : ""} ${getActiveStepClass(obj)} ${getClassInCaseOfShowMore()}
                      `
        }
      >
        {!isImagesOnTab ? (
          <a>
            <span className={styles["custom-tab-inner-text"]}>
              {showTooltipOnTab && obj.tabError ? (
                <Tooltip
                  position="bottom-left"
                  text={`${obj.tabErrorCount} item${
                    obj.tabErrorCount > 1 ? "s" : ""
                    } needs to be review`}
                >
                  <span className="tab-label">
                    {obj.iconName && <i className={obj.iconName} />}
                    <span>{obj.label}</span>
                  </span>
                </Tooltip>
              ) : (
                <span className="tab-label" {...(obj?.onClick ? { onClick: obj.onClick } : {})}>
                  {obj.iconName && <i className={obj.iconName} />}
                  <span>
                    {capitalize
                      ? toCapitalize(
                        toLower(obj.label.replaceAll("_", " "))
                      )
                      : obj.label}{" "}
                    {obj?.tabIcon && <i className={obj.tabIcon} />}
                    {showCount && obj.mediaCount > 0
                      ? `(${obj.mediaCount})`
                      : ""}
                  </span>
                </span>
              )}
              {
                <span
                  className={`${obj.countClass} ${styles[obj?.countStyle] || ''} ${obj.value == activeTab ? styles[obj?.activeCountStyle] || '' : ''}`}
                >
                  {obj.count}
                </span>
              }
              {obj.displayInfoIcon ? (
                <i className="icon_phoenix-info-fill" />
              ) : null}
              {obj.displayErrorIcon && (
                obj.errorIconTooltip ? (
                  <Tooltip
                    position="bottom-left"
                    text={obj.errorIconTooltip}
                    display="inline-block"
                  >
                    <span className={styles["tab-error-icon"]}>
                      <i className={obj.errorIconClassName || "icon_phoenix-important-fill"} />
                    </span>
                  </Tooltip>
                ) : (
                  <span className={styles["tab-error-icon"]}>
                    <i className={obj.errorIconClassName || "icon_phoenix-important-fill"} />
                  </span>
                )
              )}
            </span>
            {obj.subLabel && obj.subLabel}
          </a>
        ) : (
          <Fragment>{obj?.img}</Fragment>
        )}
      </li>
    )
  }

  const handleContentOnVisibleItemsRender = (visibleItems = []) => {
    const selectedIdx = updatedContent.findIndex(item => item.value === activeTab);
    if (selectedIdx === -1) return;
    const minVisibleItems = visibleItems.length;
    const lastVisibleIdx = minVisibleItems - 1;

    if (selectedIdx <= lastVisibleIdx) return;

    const newContent = [...updatedContent];
    const temp = newContent[lastVisibleIdx];
    //Adding the selected item from the more dropdown list to the last visible item
    newContent[lastVisibleIdx] = newContent[selectedIdx];
    //Removing the selected item from the list
    newContent.splice(selectedIdx, 1);
    //Adding the pre-existing last visible item to the end of the list
    newContent.push(temp);
    window?.sessionStorage?.setItem("L4TabContent", JSON.stringify(newContent));
    setUpdatedContent(newContent);
  };

  const renderTabsInCaseOfShowMore = useMemo(() => {
    return (
      <OverflowList
        collapseFrom="end"
        minVisibleItems={1}
        items={updatedContent}
        itemRenderer={itemRenderer}
        overflowRenderer={overflowRenderer}
        className={`${styles["tabs-ul"]} ${noSeperator ? styles["no-seperator"] : ""}`}
        tagName="ul"
        onVisibleItemsRender={handleContentOnVisibleItemsRender}
      />
    );
  }, [updatedContent, noSeperator, activeTab]);

  return (
    <div className={`el-tabheader ${customClass || ""} ${isAeroDesign ? styles["l4-menu-tab"] : ""}`}>
      {showMore ? renderTabsInCaseOfShowMore :
        <ul className={`${styles["tabs-ul"]} ${noSeperator ? styles["no-seperator"] : ""}`}>
          {content && map(content, (obj) => renderTabsJSX(obj))}
          {gsrEnabled && !window.BE.user.emailId.includes("birdeye.com") && (
            <p className={styles["gsr-banner"]}>
              <i className={`${styles["icon-style"]} icon_phoenix-insights-v2`} />
              Google Seller Ratings is active for your Google Ads.{" "}
              <a
                style={{ color: "#2652ED" }}
                href={gsrUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Take me there
              </a>
            </p>
          )}
          {chooseAlbum && (
            <p className={styles["choose-album"]} onClick={() => chooseAlbum()}>
              <i className="icon_phoenix-folder" /> Choose albums
            </p>
          )}
        </ul>}
    </div>
  );
}

TabHeader.defaultProps = {
  disableNoActiveTabs: false,
  isAeroDesign: true,
};
TabHeader.propTypes = {
  content: PropTypes.object,
  clickTab: PropTypes.func,
  activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noSeperator: PropTypes.string,
  customClass: PropTypes.string,
  gsrEnabled: PropTypes.bool,
  gsrUrl: PropTypes.string,
  chooseAlbum: PropTypes.func,
  capitalize: PropTypes.bool,
  showCount: PropTypes.bool,
  showTooltipOnTab: PropTypes.bool,
  disableNoActiveTabs: PropTypes.bool,
  disableTabList: PropTypes.array,
  isImagesOnTab: PropTypes.bool,
  showMore: false,
  isAeroDesign: PropTypes.bool,
  overflowRenderer: PropTypes.func
};

export default TabHeader;
