import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import SearchFilter from "atoms/SearchFilter";
import PropTypes from "prop-types";
import { getImageURL } from "utils";
import NoDataSimple from "components/NoData/simple";
import noResult from "assets/images/multi-select-no-data.svg";
import { Select, SelectContext, SelectItem } from "atoms/Select";
import Chip from "atoms/Chip";
import Avatar from "atoms/Avatar";
import style from "./pillSelectionDropdown.module.scss";
import Popover from "atoms/Popover";
import Tooltip from "atoms/Tooltip";
import MultiLevelDropdownSelector from "components/MultiLevelDropdownSelector";
import Button from "atoms/Button";
import { List, AutoSizer, InfiniteLoader, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import LoadingShimmer from "atoms/LoadingShimmer";

const defaultNoDataOptions = {
  noDataTitle: "No data found",
  noDataSubTitle: "Try searching different",
};

const getSrc = (url, BE) =>
  getImageURL({
    businessImageCdnBase: BE?.env?.businessImageCdnBase,
    businessNumber: BE?.business?.businessNumber,
    url,
  });

const AVATAR_CUSTOM_STYLE = { color: "white", background: "#6665dd" };

const CustomLabel = ({ name, count }) => {
  return (
    <>
      <p className={style["pill-elipse"]}>
        {name}
      </p>
      {!!count || count == 0 ? (
        <span style={{ color: "#8F8F8F" }}>&nbsp;{`(${count})`}</span>
      ) : null}</>
  );
};

const CustomChip = ({ count, label, logoUrl, value, tooltipText, hideAvatarForSelected, isDisabled, chipItemSize }) => {
  const { handleRemove } = useContext(SelectContext);
  return (
    <Tooltip
      text={tooltipText || `No locations mapped`}
      hideOnScroll
      disabledTooltip={count != 0 && !isDisabled}
      tooltipClass="tooltip-white-insights"
    >
      <Chip
        avatar={!hideAvatarForSelected && (() => (
          <Avatar
            alt={label}
            src={logoUrl}
            size="extra-small"
            styleObj={AVATAR_CUSTOM_STYLE}
          />
        ))}
        label={() => <CustomLabel name={label} count={count} />}
        colorType={count == 0 ? "red" : "grey"}
        rightIcon={() => (
          <i
            className="icon_phoenix-enclose"
            onClick={(e) => handleRemove(e, value)}
            style={{ cursor: "pointer" }}
          />
        )}
        disabled={isDisabled}
        size={chipItemSize}
      />
    </Tooltip>
  );
};

const defaultRenderValue = ({
  selectedValues,
  labelKey,
  itemSubTitleKey,
  logoKey,
  primaryIdKey,
  placeHolderText,
  zeroMapTooltipText,
  BE,
  hideAvatarForSelected,
  isMinSelectionReached,
  minSelectionCountTooltipText,
  maxSelectedVisibleChips,
  showMaxSelectedChips,
  chipItemSize
}) => {

  if (selectedValues.length == 0)
    return <span className={style.placeholder}>{placeHolderText}</span>;

  const visible = selectedValues?.slice(0, maxSelectedVisibleChips);
  const hiddenCount = selectedValues?.length - visible?.length;

  return (
    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
      {showMaxSelectedChips && maxSelectedVisibleChips > 0 ? (
        <>
          {visible.map((item) => (
            <CustomChip
              label={item?.[labelKey]}
              count={item?.[itemSubTitleKey]}
              logoUrl={getSrc(item?.[logoKey], BE)}
              key={item?.[primaryIdKey]}
              value={item}
              tooltipText={zeroMapTooltipText || minSelectionCountTooltipText}
              hideAvatarForSelected={hideAvatarForSelected}
              isDisabled={isMinSelectionReached}
              chipItemSize={chipItemSize}
            />
          ))}
          {hiddenCount > 0 && (
            <Chip
              label={`+${hiddenCount} more`}
              colorType="grey"
              disabled
              size={chipItemSize}
            />
          )}
        </>
        ) : (selectedValues.map((item) => {
        return (
          <CustomChip
            label={item[labelKey]}
            count={item[itemSubTitleKey]}
            logoUrl={getSrc(item[logoKey], BE)}
            key={item[primaryIdKey]}
            value={item}
            tooltipText={zeroMapTooltipText || minSelectionCountTooltipText}
            hideAvatarForSelected={hideAvatarForSelected}
            isDisabled={isMinSelectionReached}
            chipItemSize={chipItemSize}
          />
        );
      }))}
    </div>
  );
};

const DefaultPillSelectItem = ({
  isDisabled,
  isSelected,
  id,
  label,
  src,
  subTitle,
  subTitlelabel,
  value,
  detailPopupOtions,
  isSingleSelection,
  disabledTooltipText,
  hideAvatarForItem,
  isInvalid,
  invalidActionHandler,
  invalidActionButtonText = "Reconnect",
  invalidSupportText,
  optionId,
  showOptionId,
  showIconKey
}) => {
  const [openLocation, setOpenLocation] = useState(false);
  const [list, setList] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const max = 5;
  const { fetchDetails = null } = detailPopupOtions || {};
  const filteredList = list.slice(0, showAll ? list.length : max);
  const remainingItemCount = list.length - filteredList.length;

  const onMouseClick = async (e) => {
    e.stopPropagation();

    try {
      if (!!fetchDetails) {
        const list = await fetchDetails();
        setList(list);
        setOpenLocation(true);
      } else {
        setOpenLocation(true);
      }
    } catch (error) {
      setList([]);
      setOpenLocation(false);
    }
  };
  const isPopUpVisible = !!(openLocation && list.length);

  const getScrollParent = () =>
    document.getElementById("elemental-ui-pill-menu");

  return (
    <SelectItem
      key={id}
      value={value}
      selectItemClass={`${style["pill-item"]} ${style["pill-selected"]}`}
      disabled={isDisabled || isInvalid}
    >
      <div className={`${style["pill-info"]}`}>
        {!hideAvatarForItem && <Avatar
          alt={label}
          src={src}
          size="medium"
          styleObj={AVATAR_CUSTOM_STYLE}
        />}
        <div className={`${style["title-container"]}`}>
          <h4 className={`${style["title"]}`}>{label}</h4>
          {showOptionId && optionId ? (
            <span className={`${style["title"]}`}>
              {optionId}
            </span>
          ) : null}
          {isInvalid && invalidSupportText ? (
            <span className={`${style["invalid-title"]}`}>
              <span>{showIconKey ?  <i className={showIconKey} /> : ""}</span> {invalidSupportText}
            </span>
          ) : null}
          {subTitle !== null && subTitle !== undefined ? (
            <Popover
              onMouseClick={onMouseClick}
              showOnClick={isPopUpVisible}
              enableClick
              toggleShownMenu={(e) => {
                setOpenLocation((p) => !p);
                // e.stopPropagation();
              }}
              custom={
                <span className={style.subtitle}>{`${subTitle} ${typeof subTitlelabel === "string"
                    ? subTitlelabel
                    : subTitlelabel({ label, subTitle, value })
                  }`}</span>
              }
              className="dots-class no-hover align-middle"
              size="medium"
              float="right"
              inTable
              fixed
              showBtnIcon
              customClick
              customTopPosition={-28}
              customLeftPosition={-63}
              customScollParent={getScrollParent}
            >
              <ul
                className={`${isPopUpVisible ? style.show : style.hide} ${style.popupcontainer
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                {filteredList.map((item) => (
                  <li className={`${style.popupitem}`} key={item}>
                    {item}
                  </li>
                ))}
                {!showAll && remainingItemCount > 0 ? (
                  <li className={`${style.popupitembutton}`}>
                    {" "}
                    <span onClick={() => setShowAll(true)}>
                      {remainingItemCount} more {subTitlelabel}
                    </span>
                  </li>
                ) : null}
              </ul>
            </Popover>
          ) : null}
        </div>
      </div>
      {!isSingleSelection ? (
        isInvalid ? (
          <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                invalidActionHandler && invalidActionHandler(value);
              }}
              theme="link"
              label={invalidActionButtonText}
              className="mr-5 reconnect-btn"
          />
        ) : (
          <Tooltip
            text={disabledTooltipText}
            hideOnScroll
            disabledTooltip={!isDisabled || !disabledTooltipText}
            tooltipClass="tooltip-white-insights"
          >
            <section className={`${style["checkbox-wrapper"]}`}>
              <input
                className={`${style["form-input"]}`}
                type="checkbox"
                name={label}
                checked={isSelected}
                disabled={isDisabled}
                readOnly
                id={id}
              />
              <span className={style["box"]}>
                <span className={!isSelected ? "" : style["tick"]}></span>
              </span>
            </section>
          </Tooltip>
        )
      ) : isSelected ? (
        <i className="icon icon_phoenix-check"></i>
      ) : null}
    </SelectItem>
  );
};

const PillSelectionDropdown = ({
  onCloseDropdown,
  items,
  initialSelectedItems = [],
  primaryIdKey,
  labelKey,
  logoKey,
  placeHolderText = "",
  BE,
  minSelectionConfig,
  maxSelectionConfig, 
  isSingleSelection = false,
  itemSubTitleKey,
  itemSubTitleLabel = "",
  titleOptions,
  noDataOptions = defaultNoDataOptions,
  detailPopupOtions,
  renderValue,
  filterKeyValue,
  selectItemComponent: PillSelectItem = DefaultPillSelectItem,
  showSearchBar = true,
  searchInputPlaceHolder,
  zeroMapTooltipText,
  showMultiLevelDropdownSelector = false,
  multiLevelDropdownSelectorProps = {},
  onSelectionChange,
  hideAvatarForSelected,
  hideAvatarForItem,
  onOpenDropdown,
  sortSelectedOnOpen = true,
  errorObj,
  showSelectAll= false,
  invalidActionHandler,
  invalidActionButtonText = "Reconnect",
  invalidSupportTextKey,
  showOptionId,
  optionIdKey,
  maxSelectedVisibleChips = 0,
  showMaxSelectedChips = false,
  isInfinite = false,
  infiniteScrollProps,
  isAPISearch = false,
  handleAPISearch,
  itemHeight = 52,
  forceListHeight = true,
  chipItemSize = "small"
}) => {
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const selectAllCheckboxRef = useRef(null);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectAllIndeterminate, setSelectAllIndeterminate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { maxSelectionCount, maxSelectionCountTooltipText } = maxSelectionConfig || {};
  const { minSelectionCount, minSelectionCountTooltipText } = minSelectionConfig || {};

  const listRef = useRef(null);

  const cache = useMemo(() => new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: itemHeight, // default row height
  }), []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedItems(initialSelectedItems);
    }
  }, [initialSelectedItems, isOpen])

  const {
    dropDownTitle,
    dropDownTitleTooltip,
    icon = "icon icon_phoenix-header-question",
  } = titleOptions || {};

  const { noDataTitle, noDataSubTitle } = noDataOptions;

  useEffect(() => {
    cache.clearAll();
    listRef?.current?.recomputeRowHeights();
  }, [items, filteredItems]);

  useEffect(() => {
    if (isAPISearch) {
      setFilteredItems((prevState) => {
        const mergedItems = items?.map((item) => {
          const index = prevState.findIndex(
            (prevItem) => prevItem[primaryIdKey] === item[primaryIdKey]
          );
          return index !== -1 ? prevState[index] : item;
        });
        return sortSelectedList(mergedItems);
      });
    } else {
      setFilteredItems(
        items?.filter((item) =>
          item?.[labelKey]?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      );
    }
  }, [searchQuery, labelKey, items, isAPISearch]);

  const selecteditemsSet = new Set(
    Array.isArray(selectedItems)
      ? selectedItems.map((item) => item[primaryIdKey])
      : selectedItems
        ? [selectedItems[primaryIdKey]]
        : []
  );

  const filteredSelectableItems = filteredItems.filter(it => !it?.isDisabled && !it?.isInvalid);

  const updateSelectAllVisual = (nextSelectedItems, nextFilteredItems = filteredItems) => {
    const selectable = nextFilteredItems?.filter(it => !it?.isDisabled && !it?.isInvalid);
    const total = selectable?.length;
    if (total === 0) {
      setSelectAllChecked(false);
      setSelectAllIndeterminate(false);
      if (selectAllCheckboxRef?.current) {
        selectAllCheckboxRef.current.indeterminate = false;
      }
      return;
    }
    const selectedIds = new Set(nextSelectedItems?.map(it => it[primaryIdKey]));
    const selectedCount = selectable?.reduce(
      (acc, it) => acc + (selectedIds?.has(it[primaryIdKey]) ? 1 : 0),
      0
    );
    if (selectedCount === 0) {
      setSelectAllChecked(false);
      setSelectAllIndeterminate(false);
      if (selectAllCheckboxRef?.current) selectAllCheckboxRef.current.indeterminate = false;
    } else if (selectedCount === total) {
      setSelectAllChecked(true);
      setSelectAllIndeterminate(false);
      if (selectAllCheckboxRef?.current) selectAllCheckboxRef.current.indeterminate = false;
    } else {
      setSelectAllChecked(false);
      setSelectAllIndeterminate(true);
      if (selectAllCheckboxRef?.current) selectAllCheckboxRef.current.indeterminate = true;
    }
  };

  useEffect(() => {
    if (showSelectAll) {
      updateSelectAllVisual(selectedItems, filteredItems);
    }
  }, [selectedItems, filteredItems]);

  let isMaxSelectionReached = (selecteditemsSet.size >= maxSelectionCount);
  let isMinSelectionReached = (selecteditemsSet.size <= minSelectionCount);

  const convertSelectedValues = (selectedItems) => {
    let value = [];
    if (selectedItems) {
      value = Array.isArray(selectedItems)
        ? selectedItems.map((item) => item[primaryIdKey])
        : [selectedItems[primaryIdKey]];
    }
    return { [filterKeyValue]: value };
  };

  const onChange = (event, value, isOpen, childValue, checked) => {
    setSelectedItems(value);
    if (showSelectAll) {
      updateSelectAllVisual(value);
    }
    onSelectionChange && onSelectionChange({event, value, isOpen, currentValue:childValue, checked});
    if (!isOpen || isSingleSelection)
      onCloseDropdown(convertSelectedValues(value));
  };

  const handleToggleSelectAll = () => {
    if (selectAllChecked || selectAllIndeterminate) {
      const filteredIdSet = new Set(filteredSelectableItems.map(it => it[primaryIdKey]));
      const remaining = selectedItems.filter(it => !filteredIdSet.has(it[primaryIdKey]));
      setSelectedItems(remaining);
      updateSelectAllVisual(remaining);
      onSelectionChange && onSelectionChange({
        event: null,
        value: remaining,
        isOpen: true,
        currentValue: null,
        selectAll: true,
        action: "remove-filtered"
      });
    } else {
      const toAdd = [];
      const already = new Set(selectedItems.map(it => it[primaryIdKey]));
      const remainingCapacity = maxSelectionCount !== undefined
        ? Math.max(0, maxSelectionCount - selectedItems.length)
        : Infinity;
      for (const it of filteredSelectableItems) {
        if (!already.has(it[primaryIdKey])) {
          if (toAdd.length < remainingCapacity) toAdd.push(it);
          else break;
        }
      }
      const updated = [...selectedItems, ...toAdd];
      setSelectedItems(updated);
      updateSelectAllVisual(updated);
      onSelectionChange && onSelectionChange({
        event: null,
        value: updated,
        isOpen: true,
        currentValue: null,
        selectAll: true,
        action: "add-filtered",
        addedCount: toAdd.length
      });
    }
  };

  const sortSelectedList = (itemsList) => {
    return [
      ...itemsList.sort((a, b) => {
        if (
          selecteditemsSet.has(a[primaryIdKey]) &&
          !selecteditemsSet.has(b[primaryIdKey])
        ) {
          return -1;
        } else if (
          !selecteditemsSet.has(a[primaryIdKey]) &&
          selecteditemsSet.has(b[primaryIdKey])
        ) {
          return 1;
        } else {
          return 0;
        }
      }),
    ];
  };

  const onOpen = () => {
    sortSelectedOnOpen && setFilteredItems((prevItems) => {
      return sortSelectedList(prevItems);
    });
    setIsOpen(true);
    {onOpenDropdown && onOpenDropdown(selectedItems)}
  };

  const onClose = () => {
    setIsOpen(false);
    onCloseDropdown(convertSelectedValues(selectedItems));
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (isAPISearch && handleAPISearch) {
      handleAPISearch(value, convertSelectedValues(selectedItems));
    }
  };

  const renderDefaultSelectedValues = (selectedValues) => {
    return defaultRenderValue({
      selectedValues: Array.isArray(selectedValues)
        ? selectedValues
        : selectedValues
          ? [selectedValues]
          : [],
      labelKey,
      itemSubTitleKey,
      logoKey,
      primaryIdKey,
      placeHolderText,
      zeroMapTooltipText,
      BE,
      hideAvatarForSelected,
      hideAvatarForItem,
      isMinSelectionReached,
      minSelectionCountTooltipText,
      maxSelectedVisibleChips,
      showMaxSelectedChips,
      chipItemSize
    });
  };

  const renderListItem = ({ index, key, style: rowStyle, parent }) => {
    const { loader, hasMore } = infiniteScrollProps || {}
    const item = filteredItems[index];
    if (hasMore && !item && isInfinite && loader) {
      return <div key={key} style={rowStyle}>{loader}</div>
    }
    const isInvalid = !!item?.isInvalid;
    let isSelected = selecteditemsSet.has(item[primaryIdKey]);
    if (isInvalid) isSelected = false;
    let isDisabled = isInvalid ||
      (!isSelected && isMaxSelectionReached) ||
      (isSelected && isMinSelectionReached) ||
      item?.isDisabled;

    let disableTooltipText = item?.disableTooltipText || dropDownTitleTooltip;
    if (!isInvalid) {
      if (isSelected && isMinSelectionReached && minSelectionCountTooltipText) {
        disableTooltipText = minSelectionCountTooltipText;
      } else if (!isSelected && isMaxSelectionReached && maxSelectionCountTooltipText) {
        disableTooltipText = maxSelectionCountTooltipText;
      }
    }

    return (
      <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
        >
          {({ registerChild }) => (
            <div key={key} style={rowStyle} className={rowStyle.row} ref={registerChild}>
              <PillSelectItem
                key={item[primaryIdKey]}
                isDisabled={isDisabled}
                isSelected={isSelected}
                id={item[primaryIdKey]}
                label={item[labelKey]}
                subTitle={item[itemSubTitleKey]}
                subTitlelabel={itemSubTitleLabel}
                src={getSrc(item[logoKey], BE)}
                value={item}
                isSingleSelection={isSingleSelection}
                detailPopupOtions={detailPopupOtions}
                disabledTooltipText={disableTooltipText}
                hideAvatarForSelected={hideAvatarForSelected}
                hideAvatarForItem={hideAvatarForItem}
                isInvalid={isInvalid}
                invalidActionHandler={invalidActionHandler}
                invalidActionButtonText={invalidActionButtonText}
                invalidSupportText={item?.[invalidSupportTextKey]}
                optionId={item?.[optionIdKey]}
                showOptionId={showOptionId}
                showIconKey={item?.showIconKey}
              />
            </div>
          )}
      </CellMeasurer>
    )
  }

  const renderList = () => {
  const { hasMore = true, loadMore, minimumBatchSize = 10, isLoading = false } = infiniteScrollProps || {}
    let listHeight = 270;
    if (showMultiLevelDropdownSelector) {
      listHeight = 250;
    }
    if (isLoading) {
      return <LoadingShimmer customWrapperClassName={style["loading-shimmer-wrapper"]} customClassName={style["loading-shimmer"]} shimmerCount={6} displayCount={1} />
    }
    if (isInfinite) {
      return (
        <InfiniteLoader
          isRowLoaded={({ index }) => !!filteredItems[index]}
          loadMoreRows={() => {
            // more data only when hasMore is true from parent
            if (!hasMore || isLoading) return Promise.resolve();
            // expecting parent to handle page change and data fetch in
            return new Promise((res) => {
              loadMore && loadMore(convertSelectedValues(selectedItems));
              setTimeout(res, 500);
            });
          }}
          rowCount={hasMore ? filteredItems.length + 1 : filteredItems.length}
          minimumBatchSize={minimumBatchSize}
          threshold={5}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                  <List
                      className={`${style["list-container"]} ${style["custom-scroll"]}`}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      height={listHeight}
                      width={width}
                      rowCount={hasMore ? filteredItems.length + 1 : filteredItems.length}
                      rowHeight={cache.rowHeight}
                      rowRenderer={renderListItem}
                      overscanRowCount={10}
                      style={{ outline: "none", willChange: "auto" }}
                  />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      );
    }
    const isScrollEnabledSelectAll = showSelectAll && showSearchBar && (showMultiLevelDropdownSelector ? filteredItems?.length > 5 : filteredItems?.length > 6);
    return (
      <div className={`${showSelectAll ? `${style["pillselect-selectall-container"]} ${style["custom-scroll"]}` : ""} ${isScrollEnabledSelectAll ? style["fixed-height-scroll-selectAll"] : ""}`}>
        {!isSingleSelection && showSelectAll && filteredItems.length > 0 && (
          <ul className={`${style["list-container"]} ${style["selectall-checkbox"]}`} style={{ marginBottom: "4px" }}>
            <li
              className={style["pill-item"]}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSelectAll();
              }}
            >
              <div className={style["pill-info"]}>
                <div className={style["title-container"]}>
                  <h4 className={style["title"]}>Select All</h4>
                </div>
              </div>
              <section className={style["checkbox-wrapper"]}>
                <input
                  className={style["form-input"]}
                  type="checkbox"
                  name="__select_all__"
                  ref={selectAllCheckboxRef}
                  checked={selectAllChecked}
                  readOnly
                />
                <span className={`${style["box"]} ${!selectAllChecked && selectedItems.length > 0 ? style["partial-tick-box"] : ""}`}>
                  <span className={selectAllChecked ? style["tick"] : `${!selectAllChecked && selectedItems.length > 0 ? style["partial-tick"] : ""}`}></span>
                </span>
              </section>
            </li>
          </ul>
        )}
        <AutoSizer disableHeight={forceListHeight}>
          {({ width, height }) => (
              <List
                  ref={listRef}
                  className={`${style["list-container"]} ${style["custom-scroll"]}`}
                  height={forceListHeight ? listHeight : height}
                  width={width}
                  rowCount={filteredItems.length}
                  rowHeight={cache.rowHeight}
                  rowRenderer={renderListItem}
                  overscanRowCount={10}
                  style={{ outline: "none", willChange: "auto" }}
              />
          )}
        </AutoSizer>
      </div>
    );
  }
  return (
    <div className={style.pillcontainer}>
      {dropDownTitle ? (
        <div className={style.titlecontainer}>
          <h4 className={style.dropdowntitle}>{dropDownTitle}</h4>
          {dropDownTitleTooltip ? (
            <span>
              <Tooltip
                hideOnScroll
                text={dropDownTitleTooltip}
                position="right"
                tooltipClass="tooltip-white-insights"
              >
                <i className={icon} />
              </Tooltip>
            </span>
          ) : null}
        </div>
      ) : null}
      <Select
        idKey={primaryIdKey}
        multiple={!isSingleSelection}
        value={selectedItems}
        onChange={onChange}
        onClose={onClose}
        renderValue={renderValue ? renderValue : renderDefaultSelectedValues}
        MenuElement="div"
        classes={{ menu: style.menucontainer }}
        onOpen={onOpen}
        errorObj={errorObj}
      >
        <div
          className={`${style["pillselect-menu"]} ${forceListHeight ? style["force-height"] : ""} ${showMultiLevelDropdownSelector || showSearchBar ? style["search-filter-height"] : ""}`}
          id="elemental-ui-pill-menu"
        >
          {showSearchBar ? (
            <div className={style.search}>
              <SearchFilter
                placeholder={searchInputPlaceHolder}
                onCrossClickAction={() => {
                  handleSearchChange("");
                }}
                onInputValueChange={(value) => handleSearchChange(value)}
                searchStr={searchQuery}
                autoComplete={"off"}
              />
            </div>
          ) : null}

          {showMultiLevelDropdownSelector ? (
            <div className={style["header"]}>
              <span className={style["header-text"]}>{multiLevelDropdownSelectorProps?.popupCTAtext || ""}</span>
              <MultiLevelDropdownSelector
                {...(multiLevelDropdownSelectorProps ? multiLevelDropdownSelectorProps : {})}
              />
            </div>
          ) : null}

          {filteredItems.length ? renderList() : (
            <div className={style.nodatacontainer}>
              <NoDataSimple
                customClassName="nodata"
                imageUrl={noResult}
                title={noDataTitle}
                subtitle={noDataSubTitle}
              />
            </div>
          )}
        </div>
      </Select>
    </div>
  );
};

PillSelectionDropdown.propTypes = {
  /**  It is an Array of list of object */
  items: PropTypes.array.isRequired,

  /** It's used for already selected items  */
  initialSelectedItems: PropTypes.array,

  /** This key is used for id key which is used to identify object  */
  primaryIdKey: PropTypes.string.isRequired,

  /** This key is used for label which is used to show label in Chip and Item also */
  labelKey: PropTypes.string.isRequired,

  /** This key is used to find imageUrl from item object */
  logoKey: PropTypes.string.isRequired,

  /** Whenever dropdown will close then this method will trigger.
   Also as per previous behaviour, it will also trigger whenever we are deleting any chips while our dropdown is closed  */
  onCloseDropdown: PropTypes.func,

  /** This is used for PlaceHolder of Select */
  placeHolderText: PropTypes.string.isRequired,

  BE: PropTypes.object,

  /** once selectionCount is excced `maxselectionCount` then non selected items will be disable and `maxSelectionCountTooltipText` show in tooltip */
  maxSelectionConfig: PropTypes.objectOf({
    maxSelectionCount: PropTypes.number,
    maxSelectionCountTooltipText: PropTypes.string,
  }),

  /** once selectionCount is less than `minselectionCount` then selected items will be disable and `minSelectionCountTooltipText` show in tooltip */
  minSelectionConfig: PropTypes.objectOf({
    minSelectionCount: PropTypes.number,
    minSelectionCountTooltipText: PropTypes.string,
  }),

  /** Its for single select */
  isSingleSelection: PropTypes.bool,

  /** key for subTitle like locationCount */
  itemSubTitleKey: PropTypes.string,

  /** label for subTitle label (30 locations) here locations is label */
  itemSubTitleLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  /** we can give title, tooltipText and icon */
  titleOptions: PropTypes.objectOf(
    PropTypes.shape({
      dropDownTitle: PropTypes.string,
      dropDownTitleTooltip: PropTypes.string,
      icon: PropTypes.string,
    })
  ),

  /** we can give {noDataTitle, noDataSubTitle}, both are string */
  noDataOptions: PropTypes.object,

  /** it has {fetchDetails} key */
  detailPopupOtions: PropTypes.object,

  /** it is used for passing customizable value component */
  renderValue: PropTypes.func,

  /** It is used for pass customizable Item component */
  selectItemComponent: PropTypes.elementType,

  /** It is used to show and hide searchbar */
  showSearchBar: PropTypes.bool,

  /** It is used for SearchInputBox's placeholder */
  searchInputPlaceHolder: PropTypes.string,

  /** If count is zero and you want to show some tooltip on that */
  zeroMapTooltipText: PropTypes.string,

  /** It is used to render MultiLevelDropdownSelector component in the pill selection dropdown component */
  showMultiLevelDropdownSelector: PropTypes.bool,

  /** It is used to pass the props as required to the MultiLevelDropdownSelector component */
  multiLevelDropdownSelectorProps: PropTypes.object,

  /** it is used to get callback whenever options selection changes  */
  onSelectionChange: PropTypes.func,

  /** It is used to show and hide avtaar for selected values/chip */
  hideAvatarForSelected: PropTypes.bool,

  /** It is used to show and hide avtaar for dropdown item */
  hideAvatarForItem: PropTypes.bool,

  /** its is used to sort the dropdown option i.e. selected will move to top */
  sortSelectedOnOpen: PropTypes.bool,

  /** it is used to get callback whenever dropdown panel opens */
  onOpenDropdown: PropTypes.func,

  /** errorObj for showing error */
  errorObj: PropTypes.shape({
    show: PropTypes.bool,
    messgae: PropTypes.string,
    className: PropTypes.string,
  }),

  /** Select all checkbox -> not applicable when we max and min limit */
  showSelectAll: PropTypes.bool,

  /** This is for limiting the visual chip if there are alot of selection */
  showMaxSelectedChips: PropTypes.bool,

  /** This is for the number of limit for the above  -> showMaxSelectedChips*/
  maxSelectedVisibleChips: PropTypes.number,

  /** Action Callback if any action on invalid option */
  invalidActionHandler: PropTypes.func,

  /** Text for invalid option as a button */
  invalidActionButtonText: PropTypes.string,

  /** This key is used for invalid option(button as an option) text */
  invalidSupportTextKey: PropTypes.string,

  /**  flag to see id as a sublabel in dropdown option*/
  showOptionId: PropTypes.bool,

  /** This key is used get id as a sublabel in dropdown option */
  optionIdKey: PropTypes.string,
  
  /** To enable infinite scroll */
  isInfinite: PropTypes.bool,

  /** Props related to infinite scroll */
  infiniteScrollProps: PropTypes.shape({
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    loader: PropTypes.node,
    minimumBatchSize: PropTypes.number,
  }),
  
  /** To enable API search */
  isAPISearch: PropTypes.bool,

  /** API search handler */
  handleAPISearch: PropTypes.func,

  /** This key is used for filterKeyValue in onCloseDropdown and onSelectionChange */
  filterKeyValue: PropTypes.string,

  /** Height of each item, needed for react-virtualized */
  itemHeight: PropTypes.number,
  chipItemSize: PropTypes.oneOf(["small"])
};
export default PillSelectionDropdown;
