import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";
import Chip from "atoms/Chip";
import Button from "atoms/Button";
import styles from "./ChipGroup.module.scss";

const ChipGroup = ({
  chips = [],
  showAddButton = false,
  addButtonTheme = "primary",
  addButtonLabel = "Add",
  addButtonIcon: AddButtonIcon,
  onAdd,
  addContent: AddContent,
  disabled = false,
  gap = 5,
  customContainerClass = "",
  customAddButtonClass = "",
  supportInfiniteScroll = false,
  hasMore = false,
  loadMore,
  useWindow = false,
  pageStart = 0,
  loaderComponent,
  infiniteScrollHeight = "200px",
  infiniteScrollWidth = "100%"
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAdd = useCallback((e) => {
    e.preventDefault();
    if (disabled) return;
    if (AddContent) setIsAddOpen(true);
    onAdd?.();
  }, [disabled, AddContent, onAdd]);

  const containerCls = useMemo(
    () =>
      [styles.chipGroup, disabled && styles.disabled, customContainerClass]
        .filter(Boolean)
        .join(" "),
    [disabled, customContainerClass]
  );

  const addBtnCls = useMemo(
    () =>
      [
        "ds-font-inter",
        styles.addButton,
        disabled && styles.disabled,
        customAddButtonClass,
      ]
        .filter(Boolean)
        .join(" "),
    [disabled, customAddButtonClass]
  );

  const gapStyle = useMemo(() => ({ gap: `${gap}px` }), [gap]);

  if (!Array.isArray(chips)) return null;

  const renderAddContent = () => {
    try {
      if (typeof AddContent === "function") {
        return <AddContent/>;
      }
      return AddContent;
    } catch {
      return null;
    }
  };

  const renderedChips = chips.map((chip, index) => {
    if (!chip || !chip.label) return null;
    const { id, disabled: chipDisabled, ...chipProps } = chip;
    return (
      <Chip
        key={id ?? index}
        {...chipProps}
        disabled={chipDisabled ?? disabled}
      />
    );
  });

  return (
    <div className={containerCls} style={gapStyle}>
      {chips?.length && supportInfiniteScroll ? (
        <div className={styles.infiniteScrollWrapper} style={{ height: infiniteScrollHeight, width: infiniteScrollWidth }}>
          <InfiniteScroll
            pageStart={pageStart}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={loaderComponent}
            useWindow={useWindow}
          >
            <div className={styles.chipList} style={gapStyle}>
              {renderedChips}
            </div>
          </InfiniteScroll>
        </div>
      ) : (
        <div className={styles.chipList} style={gapStyle}>
          {renderedChips}
        </div>
      )}

      {showAddButton && (
        <Button
          theme={addButtonTheme}
          className={addBtnCls}
          onClick={handleAdd}
          disabled={disabled}
          label={addButtonLabel || undefined}
          customIcon={
            AddButtonIcon ? (
                <AddButtonIcon />
            ) : null
          }
        />
      )}

      {isAddOpen && AddContent && (
        <div className={styles.addContentWrapper}>
          {renderAddContent()}
        </div>
      )}
    </div>
  );
};

ChipGroup.propTypes = {
  /** Array of chip configuration objects */
  chips: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      variant: PropTypes.oneOf(["outlined", "filled", "tonal", "outlinedIconFilled"]),
      colorType: PropTypes.oneOf(["red", "grey", "green", "yellow", "purple", "blue"]),
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
    })
  ).isRequired,
  /** Whether to show the Add CTA button */
  showAddButton: PropTypes.bool,
  /** Label text for the Add button */
  addButtonLabel: PropTypes.string,
  /** Icon component rendered inside the Add button */
  addButtonIcon: PropTypes.elementType,
  /** Callback when Add button is clicked */
  onAdd: PropTypes.func,
  /** JSX element or component rendered when Add is clicked. If a component, receives { onClose } prop. */
  addContent: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  /** Disables all chips and the Add button */
  disabled: PropTypes.bool,
  /** Gap (in px) between chips */
  gap: PropTypes.number,
  /** Custom class for the outer container */
  customContainerClass: PropTypes.string,
  /** Custom class for the Add button */
  customAddButtonClass: PropTypes.string,
  /** Enable infinite scroll for the chip list */
  supportInfiniteScroll: PropTypes.bool,
  /** Whether more items are available to load */
  hasMore: PropTypes.bool,
  /** Callback to load next page of chips */
  loadMore: PropTypes.func,
  /** Use window scroll instead of container scroll */
  useWindow: PropTypes.bool,
  /** Initial page number for infinite scroll */
  pageStart: PropTypes.number,
  /** Custom loader component for infinite scroll */
  loaderComponent: PropTypes.node,
  infiniteScrollHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  infiniteScrollWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ChipGroup;
