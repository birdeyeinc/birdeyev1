import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Button from "atoms/Button";
import AiContentLoader from "./AiContentLoader";
import AiContentActions from "./AiContentActions";
import AiContentItem from "./AiContentItem";
import styles from "./AiContentDrawer.module.scss";

const AiContentDrawer = ({
  // Drawer state
  isOpen = false,
  onClose,
  title = "AI Generated Content",

  // Content items
  items = [],
  selectedIndex = 0,
  onSelectItem,

  // Loading state
  isLoading = false,
  loadingText = "Generating...",
  loaderImage,

  // Actions
  onRegenerate,
  onInsert,
  regenerateCount = 0,
  maxRegenerateCount = 5,
  isInsertDisabled = false,
  insertButtonLabel = "Insert",

  // Regenerate button customization
  regenerateIcon,
  regenerateLabel = "Regenerate",

  // Customization
  customInputRender,
  showInsertButton = true,
  showThumbsUpDown = true,
  showRegenerateSection = true,

  // Thumbs feedback
  onThumbsUp,
  onThumbsDown,
  thumbsUpTooltip = "Helpful",
  thumbsDownTooltip = "Not so helpful",

  // Drawer mode
  withSideDrawer = true,
  drawerWidth = 480,
  removeBodyOverflowHidden = false,

  // Additional content
  children,

  // Refs
  contentListRef,
}) => {
  const internalContentRef = useRef(null);
  const listRef = contentListRef || internalContentRef;

  // Handle body overflow
  useEffect(() => {
    if (isOpen && !removeBodyOverflowHidden) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "initial";
    };
  }, [isOpen, removeBodyOverflowHidden]);

  // Auto-scroll to latest item when new content is added
  useEffect(() => {
    if (listRef.current && items.length > 0) {
      const lastChild = listRef.current.lastElementChild;
      lastChild?.scrollIntoView({ behavior: "smooth" });
    }
  }, [items.length]);

  const renderHeader = () => (
    <div className={styles["drawer-header"]}>
      <div className={styles["header-left"]}>
        <span className={styles["back-btn"]} onClick={onClose}>
          <i className="icon_phoenix-arrow-left" />
        </span>
        <h3 className={styles["title"]}>{title}</h3>
      </div>
      <div className={styles["header-right"]}>
        {showInsertButton && (
          <Button
            type="primary"
            label={insertButtonLabel}
            disabled={isInsertDisabled}
            onClick={onInsert}
          />
        )}
      </div>
    </div>
  );

  const renderContentList = () => {
    return (
      <div className={styles["content-list"]} ref={listRef} id="ai-content-list">
        {items.map((item, index) => (
          <AiContentItem
            key={item.id}
            id={item.id}
            content={item.description}
            isSelected={selectedIndex === item.id}
            onSelect={onSelectItem}
            index={index}
            disabled={isLoading}
          />
        ))}
        {isLoading && <AiContentLoader text={loadingText} loaderImage={loaderImage} />}
      </div>
    );
  };

  const drawerContent = (
    <div className={styles["ai-content-drawer-wrapper"]}>
      {renderHeader()}

      <div className={styles["drawer-body"]}>
        {customInputRender && (
          <div className={styles["custom-input-section"]}>
            {customInputRender()}
          </div>
        )}
        {renderContentList()}
        {children}
      </div>

      {showRegenerateSection && (
        <AiContentActions
          onRegenerate={onRegenerate}
          isLoading={isLoading}
          remainingCount={maxRegenerateCount - regenerateCount}
          totalCount={maxRegenerateCount}
          showThumbsUpDown={showThumbsUpDown && !isLoading}
          regenerateIcon={regenerateIcon}
          regenerateLabel={regenerateLabel}
          onThumbsUp={onThumbsUp}
          onThumbsDown={onThumbsDown}
          thumbsUpTooltip={thumbsUpTooltip}
          thumbsDownTooltip={thumbsDownTooltip}
        />
      )}
    </div>
  );

  if (withSideDrawer) {
    return (
      <div className={`${styles["ai-drawer-overlay"]} ${isOpen ? styles["open"] : ""}`}>
        <div className={styles["drawer-panel"]}>
          {drawerContent}
        </div>
      </div>
    );
  }

  // Custom overlay mode (non-SideDrawer)
  return (
    <div className={`${styles["ai-drawer-overlay"]} ${isOpen ? styles["open"] : ""}`}>
      <div
        className={styles["drawer-panel"]}
        // style={{ width: drawerWidth }}
      >
        {drawerContent}
      </div>
    </div>
  );
};

AiContentDrawer.propTypes = {
  // Drawer state
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,

  // Content items - array of { id, description, original?, rephrased? }
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      description: PropTypes.string,
      original: PropTypes.string,
      rephrased: PropTypes.bool,
    })
  ),
  selectedIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectItem: PropTypes.func,

  // Loading state
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  loaderImage: PropTypes.string,

  // Actions
  onRegenerate: PropTypes.func,
  onInsert: PropTypes.func,
  regenerateCount: PropTypes.number,
  maxRegenerateCount: PropTypes.number,
  isInsertDisabled: PropTypes.bool,
  insertButtonLabel: PropTypes.string,

  // Regenerate customization
  regenerateIcon: PropTypes.string,
  regenerateLabel: PropTypes.string,

  // Customization
  customInputRender: PropTypes.func,
  showInsertButton: PropTypes.bool,
  showThumbsUpDown: PropTypes.bool,
  showRegenerateSection: PropTypes.bool,

  // Thumbs feedback
  onThumbsUp: PropTypes.func,
  onThumbsDown: PropTypes.func,
  thumbsUpTooltip: PropTypes.string,
  thumbsDownTooltip: PropTypes.string,

  // Drawer mode
  withSideDrawer: PropTypes.bool,
  drawerWidth: PropTypes.number,
  removeBodyOverflowHidden: PropTypes.bool,

  // Additional content
  children: PropTypes.node,

  // Refs
  contentListRef: PropTypes.object,
};

export default AiContentDrawer;
