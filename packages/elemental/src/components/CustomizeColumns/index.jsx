import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import SearchFilter from "atoms/SearchFilter";
import Button from "atoms/Button";
import FormInput from "atoms/FormInput";
import styles from "./CustomizeColumns.module.scss";

const CustomizeColumns = ({
  columns = [],
  onChange,
  onSave,
  onBack,
  title = "Customize Columns",
  showDragHandle = true,
  className = "",
  width,
  height,
  gap,
  showTitle = true,
  showSearch = false,
  searchPlaceholder = "Search",
  subtitle = ""
}) => {
  const [orderedColumns, setOrderedColumns] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const buildColumnsSignature = (cols = []) => {
    if (!Array.isArray(cols) || cols?.length === 0) return "[]";
    const canonical = cols
      .slice()
      .sort((a, b) => {
        const oa = Number(a?.order ?? 0);
        const ob = Number(b?.order ?? 0);
        if (oa !== ob) return oa - ob;
        const an = (a?.name ?? "").toString();
        const bn = (b?.name ?? "").toString();
        return an.localeCompare(bn);
      })
      .map((c) => ({
        name: c?.name ?? "",
        order: Number(c?.order ?? 0),
        visible: Boolean(c?.visible),
        isDefault: Boolean(c?.isDefault),
      }));
    return JSON.stringify(canonical);
  };

  const [persistedColumns, setPersistedColumns] = useState(() => buildColumnsSignature(columns));
  const [hasInteracted, setHasInteracted] = useState(false);
  const initialVisibilityRef = useRef(
    (() => {
      const visibilityMap = {};
      (columns || []).forEach((col) => {
        // Store initial visibility but also respect isDefault as always true
        visibilityMap[col?.name] = Boolean(col?.visible) || Boolean(col?.isDefault);
      });
      return visibilityMap;
    })()
  );

  useEffect(() => {
    const sorted = [...(columns || [])].sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0));
    setOrderedColumns(sorted);
  }, [columns?.length]);

  const handleCheckboxChange = (index) => {
    const column = orderedColumns?.[index];
    if (!column) return;
    if (Boolean(column?.isDefault)) {
      return;
    }
    
    const updatedColumns = [...orderedColumns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      visible: !updatedColumns[index].visible,
    };
  setOrderedColumns(updatedColumns);
  setHasInteracted(true);

    if (onChange) {
      onChange(updatedColumns);
    }
  };

  const handleDragStart = (e, index) => {
    // Prevent dragging the first item (order === 1)
    const col = orderedColumns?.[index];
    if (!col) {
      e.preventDefault();
      return;
    }
    if (Number(col?.order ?? 0) === 1) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    // Prevent dropping on the first item (order === 1) or invalid indexes
    if (draggedIndex === null || draggedIndex === index) return;
    const targetCol = orderedColumns?.[index];
    if (!targetCol || Number(targetCol?.order ?? 0) === 1) return;
    const updatedColumns = [...(orderedColumns || [])];
    const draggedItem = updatedColumns?.[draggedIndex];
    if (!draggedItem) return;
    updatedColumns.splice(draggedIndex, 1);
    updatedColumns.splice(index, 0, draggedItem);

    // Update order property
    const reorderedColumns = updatedColumns?.map((col, idx) => ({
      ...col,
      order: idx + 1,
    }));

  setOrderedColumns(reorderedColumns);
  setDraggedIndex(index);
  setHasInteracted(true);
  };

  const handleDragEnd = () => {
  setDraggedIndex(null);
    if (onChange) {
      onChange(orderedColumns);
    }
  };

  const formatColumnName = (name) => {
    // Convert camelCase to Title Case with spaces
    const str = (name ?? "").toString();
    return str
      ?.replace(/([A-Z])/g, " $1")
      ?.replace(/^./, (s) => s?.toUpperCase())
      ?.trim();
  };

  // Filter columns based on search query
  const filteredColumns = orderedColumns?.filter((column) => {
    if (!searchQuery) return true;
    const formattedName = formatColumnName(column?.name)?.toLowerCase();
    return formattedName?.includes(searchQuery?.toLowerCase());
  });

  const containerStyle = {
    ...(width && { width }),
    ...(height && { height }),
  };

  const listStyle = {
    ...(gap && { gap }),
  };

  const parsedHeight = (() => {
    if (!height) return null;
    const n = typeof height === "number" ? height : parseInt(String(height).replace("px", ""), 10);
    return Number.isNaN(n) ? null : n;
  })();

  if (parsedHeight && parsedHeight > 748) {
    listStyle.maxHeight = `${Math.max(parsedHeight - 120, 300)}px`;
    listStyle.overflowY = "auto";
  }


  const renderColumnItem = (column) => {
    if (!column) return null;
    const originalIndex = orderedColumns.findIndex((col) => col?.name === column?.name);
    if (originalIndex < 0) return null;
    const isFirstItem = Number(column?.order ?? 0) === 1;
    const isDraggable = showDragHandle && !isFirstItem;
    const isCheckboxDisabled = Boolean(column.isDefault);
    const checkboxChecked = Boolean(column.isDefault) ? true : Boolean(column.visible);

    return (
      <div
        key={`${column?.name ?? originalIndex}-${originalIndex}`}
        className={cx(styles["customize-columns__item"], {
          [styles["customize-columns__item--dragging"]]: draggedIndex === originalIndex,
          [styles["customize-columns__item--non-draggable"]]: isFirstItem,
        })}
        draggable={isDraggable}
        onDragStart={(e) => handleDragStart(e, originalIndex)}
        onDragOver={(e) => handleDragOver(e, originalIndex)}
        onDragEnd={handleDragEnd}
      >
        <div className={styles["customize-columns__item-content"]}>
          <FormInput
            id={`column-${column?.name ?? originalIndex}`}
            name={`column-${column?.name ?? originalIndex}`}
            type="checkbox"
            checked={checkboxChecked}
            onChange={() => handleCheckboxChange(originalIndex)}
            disabled={isCheckboxDisabled}
          />
          <label htmlFor={`column-${column.name}`} className={styles["customize-columns__label"]}>
            {formatColumnName(column.name)}
          </label>
        </div>
        {showDragHandle && !isFirstItem && (
          <div className={styles["customize-columns__drag-handle"]}>
            <i className="icon_phoenix-drag" />
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
      const parentSnapshot = buildColumnsSignature(columns);
      const localSnapshot = buildColumnsSignature(orderedColumns);
      if (parentSnapshot === localSnapshot) {
        setPersistedColumns(parentSnapshot);
      }
  }, [columns]);

  const hasUnsavedChanges = (() => {
    return hasInteracted || buildColumnsSignature(orderedColumns) !== persistedColumns;
  })();

  return (
    <div className={cx(styles["customize-columns"], className)} style={containerStyle}>
      {showTitle && title && (
        <div className={styles["customize-columns__header"]}>
            <i
              role="button"
              className={`icon_phoenix-arrow-left ${styles["customize-columns__back-icon"]}`}
              onClick={(e) => onBack && onBack(e)}
            />
            <div className={styles["customize-columns__title"]}>{title}</div>
            <Button
            label="Save"
            theme="primary"
            onClick={() => {
              setHasInteracted(false);
              setPersistedColumns(buildColumnsSignature(orderedColumns));
              if (onSave) onSave(orderedColumns);
            }}
            className={styles["customize-columns__save-button"]}
            disabled={!hasUnsavedChanges}
            />
        </div>
      )}
      {showSearch && (
        <div className={styles["customize-columns__search"]}>
          {subtitle && <div className={styles["customize-columns__search-title"]}>{subtitle}</div>}
          <SearchFilter
            placeholder={searchPlaceholder}
            searchStr={searchQuery}
            onInputValueChange={(value) => setSearchQuery(value)}
            onCrossClickAction={() => setSearchQuery("")}
            hideGlassIcon={false}
          />
        </div>
      )}
      <div className={styles["customize-columns__list"]} style={listStyle}>
        {filteredColumns?.length === 0 && searchQuery ? (
          <div className={styles["customize-columns__no-matches"]}>No matches found</div>
        ) : (
          filteredColumns?.map(renderColumnItem)
        )}
      </div>
    </div>
  );
};

CustomizeColumns.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      visible: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  onBack: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  showDragHandle: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showTitle: PropTypes.bool,
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  subtitle: PropTypes.string,
};

CustomizeColumns.defaultProps = {
  onChange: null,
  onSave: null,
  onBack: null,
  className: "",
  style: {},
  title: "",
  showDragHandle: true,
  width: "602px",
  height: "38px",
  gap: "10px",
  showTitle: true,
  showSearch: false,
  searchPlaceholder: "Search columns...",
  subtitle: "",
};

export default CustomizeColumns;
