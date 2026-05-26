import React, { useState, useEffect, Fragment} from "react";
import { forEach, map, filter, isEmpty } from "lodash";
import PropTypes from "prop-types";
import SearchFilter from "atoms/SearchFilter";
import FormInput from "atoms/FormInput";
import Tooltip from "atoms/Tooltip";
import { List, AutoSizer, ListRowProps, Index } from "react-virtualized";
import verifyImage from "assets/images/icon_verify.svg";
import style from "./ListWithCheckboxStyle.module.scss"
import InfiniteScroll from "react-infinite-scroller";
import LoaderBox from "atoms/LoaderBox";
import FieldDrivenSearch from "components/FieldDrivenSearch";

interface Props {
    list: any;
    checkedBoxData: any;
    checkBoxCallback: (obj: any, e: any, selectedFrom: string, [], selectedChannel?: string) => void;
    searchPlaceholder?: string,
    noDataScreen?: any,
    disableSelectAllBtn?: boolean,
    invalidOptionData?: (item: any) => any,
    disableSearchBox?: boolean,
    getAdditionalSelectAllText?: () => string,
    showCheckboxBeforeText?: boolean,
    selectAllLocation?: (obj: any) => void,
    customClass?: string,
    freezeOptions?: boolean,
    singleSelectMode?: boolean,
    showVerifiedIcon?: boolean,
    selectAllBtnText?: string,
    selectedChannel?: string,
    enableSelectAllNumber?: number,
    channelIconWithSelectAllJSX?: () => JSX.Element,
    showDeleteIcon?: boolean;
    openDeleteConfirmationModal?: (item: any, channel: string) => void;
    isReverseSelection?: boolean;
    reverseSelectedData?: any;
    virtualizationProps?: {
        isEnabled?: boolean;
        rowHeight?: (index: number) => number;
        className?: string;
        overscanRowCount?: number;
        listHeight?: number;
    };
    preventCheckBoxPropagation?: boolean;
    addBrowserTooltipToLabel?: boolean;
    fromWelcomeMessages?: boolean;
    infiniteScrollProps?: {
        isPaginated?: boolean,
        hasMore?: boolean;
        loadMore?: (page: number) => void;
        loader?: any;
        useWindow?: boolean;
        initialLoad?: boolean;
        threshold?: number;
        containerHeight?: string;
        handleSearch?: Function
    };
    searchDebounceDelay?: number;
    showLoader?: boolean;
    fieldDrivenSearchOptions?: {
        enabled?: boolean;
        fieldOptions?: any[];
        selectedSearchType?: string;
        searchFilterProps?: object;
    };
    showSelectedCount?: boolean;
    showInvalidOptionOnRight?: boolean;
    showCheckboxForInvalidOptions?: boolean;
    isLoadingAllPages?: boolean;
}

const BE = (window as any)?.BE || {};

const ListWithCheckBox: React.FC<Props> = ({ 
    list = [], 
    checkedBoxData = {}, 
    checkBoxCallback, 
    searchPlaceholder = "", 
    noDataScreen, 
    disableSelectAllBtn = false, 
    invalidOptionData, 
    disableSearchBox = false, 
    getAdditionalSelectAllText,
    showCheckboxBeforeText = false,
    // onLocationSelectionChnage
    // selectAllLocation,
    customClass,
    freezeOptions,
    singleSelectMode = false,
    showVerifiedIcon = false,
    selectAllBtnText = "",
    selectedChannel = "",
    enableSelectAllNumber = 1,
    channelIconWithSelectAllJSX,
    showDeleteIcon,
    openDeleteConfirmationModal,
    isReverseSelection = false,
    reverseSelectedData = [],
    virtualizationProps = {},
    preventCheckBoxPropagation = false,
    addBrowserTooltipToLabel = false,
    fromWelcomeMessages = false,
    infiniteScrollProps = {},
    searchDebounceDelay = 0,
    showLoader = false,
    fieldDrivenSearchOptions = {},
    showSelectedCount = false,
    showInvalidOptionOnRight = false,
    showCheckboxForInvalidOptions = false,
    isLoadingAllPages = false,
}) => {
    const [search, setSearch] = useState<string>("");
    const [filteredList, setFilterdList] = useState<any>(list || []);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState<boolean>(false);
    const [invalidOptionCount, setInvalidOptionCount] = useState<number>(0);
    const [selectedCount, setSelectedCount] = useState<number>(0);

    useEffect(() => {
        if (search && !infiniteScrollProps?.isPaginated) {
            const filterdData = filter(list, (item: any) => item?.label?.toLowerCase()?.includes(search?.toLowerCase()) || item?.locationName?.toLowerCase()?.includes(search?.toLowerCase()));
            setFilterdList(filterdData);
            setInvalidOptionCount(filter(filterdData, (item: any) => item.valid === "invalid" || item?.hasWelcomeMessage).length);
        } else {
            setFilterdList(list);
        }
    }, [list]);

    useEffect(() => {
        if (!infiniteScrollProps?.isPaginated) {
            const filterdData = filter(list, (item: any) => item?.label?.toLowerCase()?.includes(search?.toLowerCase()) || item?.locationName?.toLowerCase()?.includes(search?.toLowerCase()));
            setFilterdList(filterdData);
            setInvalidOptionCount(filter(filterdData, (item: any) => item.valid === "invalid" || item?.hasWelcomeMessage).length);
        }
    }, [search]);

    useEffect(() => {
        let noOfCommonOptions = 0;
        forEach(filteredList, (item: any) => {
            noOfCommonOptions += checkedBoxData?.[item.value] === true ? 1 : 0;
            if (isReverseSelection && !isEmpty(reverseSelectedData)) {
                noOfCommonOptions += !reverseSelectedData.includes(item?.value) ? 1 : 0;
            }
        });
        const isSelected = noOfCommonOptions === (filteredList?.length - invalidOptionCount) && (filteredList.length !== (invalidOptionCount)) && filteredList?.length > 0;

        // const isSelected = Object.values(checkedBoxData)?.length === filteredList.length;
        setIsSelectAllChecked(isSelected);
        // Count all selected items across entire dataset
        const totalSelected = Object.values(checkedBoxData).filter(val => val === true).length;
        setSelectedCount(totalSelected);

    }, [checkedBoxData, filteredList, invalidOptionCount, reverseSelectedData]);

    const updateSearchValue = (query: string, field: string = "") => {
        setSearch(query);
        if (infiniteScrollProps?.handleSearch) {
            infiniteScrollProps.handleSearch(query, field);
        }
    }

    const searchPaginatedPages = (args: { field: string, search: string }) => {
        const { field = "", search: query = "" } = args || {};
        updateSearchValue(query, field);
    };

    const onClickOfSelectAll = (e) => {
        let selectableItems = [];
        if (fromWelcomeMessages) {
            // Filter out disabled items (hasWelcomeMessage) when selecting all
            selectableItems = filter(filteredList, (item: any) => !item?.hasWelcomeMessage && item?.valid !== "invalid");
        }
        checkBoxCallback({}, e, (isSelectAllChecked || (isReverseSelection && !isEmpty(reverseSelectedData) ? !isSelectAllChecked : !isSelectAllChecked && !isEmpty(checkedBoxData))) ? "REMOVE_ALL" : "SELECTED_ALL", fromWelcomeMessages ? selectableItems : filteredList, selectedChannel);
        setIsSelectAllChecked(e?.target?.checked || isSelectAllChecked);
        // selectAllLocation(filteredList);
    };

    const renderCheckBoxes = (item) => {
        let isSelected = !(checkedBoxData[item.value] === undefined);
        const isDisabled = item?.hasWelcomeMessage || (item?.valid === "invalid");
        const isInvalidOption = item?.valid === "invalid";

        // Don't render checkbox for invalid options unless explicitly enabled
        if (isInvalidOption && !showCheckboxForInvalidOptions) {
            return null;
        }

        if (isReverseSelection && !isEmpty(reverseSelectedData)) {
            if (reverseSelectedData.includes(item?.value)) {
                isSelected = false;
            } else {
                isSelected = true;
            }
        }
        
        if (singleSelectMode) {
            const radioInput = (
                <Fragment>
                    <input
                        onChange={(e: any) => {
                            if (!isDisabled) {
                                checkBoxCallback(item, e, "DEFAULT", [], selectedChannel);
                            }
                        }}
                        onClick={(e)=>{if(preventCheckBoxPropagation) e?.stopPropagation()}}
                        value={item?.value}
                        type="radio"
                        name={"singleSelect"}
                        checked={isSelected}
                        disabled={isDisabled}
                    />
                    {isSelected && <span className={`icon icon_phoenix-checkmark ml-10 black-tick-mark`} />}
                </Fragment>
            );

            return item?.hasWelcomeMessage ? (
                <Tooltip position="right" text="Welcome messages already exist for this page. To update them, edit the existing message instead of creating a new one">
                    <div style={{ display: 'inline-block' }}>
                        {radioInput}
                    </div>
                </Tooltip>
            ) : radioInput;
        } else {
            const checkboxInput = (
                <FormInput
                    type="checkbox"
                    name="checkboxes"
                    checked={isSelected}
                    onClick={(e: any)=>{if(preventCheckBoxPropagation) e?.stopPropagation()}}
                    onChange={(e: any) => {
                        if (!isDisabled) {
                            checkBoxCallback(item, e, "DEFAULT", [], selectedChannel);
                        }
                    }}
                    disabled={isDisabled || freezeOptions}
                />
            );

            return item?.hasWelcomeMessage ? (
                <Tooltip position="right" text="Welcome messages already exist for this page. To update them, edit the existing message instead of creating a new one">
                    <div style={{ display: 'inline-block' }}>
                        {checkboxInput}
                    </div>
                </Tooltip>
            ) : checkboxInput;
        }
    };

    const renderInvalidOptionButton = (item) => {
        const isInvalidOption = item?.valid === "invalid" && invalidOptionData;
        if (!isInvalidOption) return null;
        return invalidOptionData(item)?.button;
    };

    const renderSelectAllCheckBox = () => {
        return (
            <FormInput
                type="checkbox"
                name="checkbox"
                onClick={(e)=>{if(preventCheckBoxPropagation) e?.stopPropagation()}}
                checked={isSelectAllChecked || (isReverseSelection && !isEmpty(reverseSelectedData) ? !isSelectAllChecked : !isSelectAllChecked && !isEmpty(checkedBoxData))}
                onChange={onClickOfSelectAll}
                disabled={invalidOptionCount === filteredList.length || freezeOptions}
                selectAll={isReverseSelection && !isEmpty(reverseSelectedData) ? !isSelectAllChecked : !isSelectAllChecked && !isEmpty(checkedBoxData)}
            />
        );
    };

    const getSelectedCountMessage = () => {
        if (!showSelectedCount) return null;
        
        // Show shimmer loader when loading all pages in paginated mode (check this BEFORE selectedCount)
        if (infiniteScrollProps?.isPaginated && isLoadingAllPages) {
            return (
                <span className={style["selected-count-shimmer"]}/>
            );
        }
        
        if (selectedCount === 0) return null;
        
        const selectedType = getAdditionalSelectAllText ? getAdditionalSelectAllText() : "item";
        const selectionType = selectedCount > 1 ? `${selectedType}s` : selectedType;
        const message = `${selectedCount} ${selectionType} selected`;
        
        return <span className={style["selected-count-text"]}>{message}</span>;
    };

    const getSingleListItem = (item: any, index: number) => {
        const isInvalidOption = item?.valid === "invalid" && invalidOptionData;
        const shouldShowCheckboxOnLeft = showCheckboxBeforeText;
        const shouldShowInvalidButtonOnRight = isInvalidOption && showInvalidOptionOnRight;
        
        // Apply justify-content (space-between) when:
        // 1. Checkboxes are on the right (!shouldShowCheckboxOnLeft), OR
        // 2. Invalid button needs to be pushed to the right (shouldShowInvalidButtonOnRight)
        const needsSpaceBetween = !shouldShowCheckboxOnLeft || shouldShowInvalidButtonOnRight;

        // Determine if this item is selected in single-select mode
        let isItemSelected = singleSelectMode && !(checkedBoxData[item?.value] === undefined);
        if (isItemSelected && isReverseSelection && !isEmpty(reverseSelectedData)) {
            isItemSelected = !reverseSelectedData.includes(item?.value);
        }
        
        return (    
            <div 
                className={`${style["list-content-wrapper"]} ${needsSpaceBetween ? style["justify-content"] : ""} ${isItemSelected ? "radio-selected" : ""}`} 
                key={"list-content-wrapper" + index} 
                onClick={(e) => {
                    if (!freezeOptions && item?.valid !== "invalid" && !item?.hasWelcomeMessage) checkBoxCallback(item, { target: { checked: checkedBoxData[item?.value] === undefined } }, "DEFAULT", [], selectedChannel);
                }}
            >
                <div className={`${style["checkbox-content-group"]}`}>
                    {(shouldShowCheckboxOnLeft && !singleSelectMode) && renderCheckBoxes(item)}
                    {(shouldShowCheckboxOnLeft && !shouldShowInvalidButtonOnRight) && renderInvalidOptionButton(item)}
                    <div className={`${style["list-content"]} ${!(item.subLabel || (item.valid === "invalid")) ? style["without-sublabel"] : ""}`}>
                    {
                        (item.imageURL || item.fallbackImage || item.childImage) && 
                        <div style={{ position: "relative" }} className={style["list-image-wrapper"]}>
                            {
                                item.imageURL && (
                                    <img src={item.imageURL} alt="" onError={({ currentTarget }) => {
                                        currentTarget.style.display = "none";
                                        const fallbackEl = document.querySelector<HTMLElement>(`.fallbackImage${index}`);
                                        if (fallbackEl) fallbackEl.style.display = "block";
                                    }}/>
                                )
                            }

                            {item.fallbackImage && (
                                <span style={{ display: `${item.imageURL ? "none" : ""}`, width: "100%", height: "100%" }} className={`fallbackImage${index}`}>{item.fallbackImage}</span>
                            )}

                            {
                                item.childImage && (
                                    <div className={`${style["child-image"]} ${item.type == "twitter" ? style["twitter-image-wrapper"] : ""}`}>
                                        {item.childImage}
                                    </div>
                                )
                            }
                        </div>
                    }
                    <div className={style["list-text-wrapper"]}>
                        {item.label && 
                            <span 
                                className={`${style["header-text"]} ${item.valid === "invalid" ? style["invalid"] : ""}`}
                                {...(addBrowserTooltipToLabel ? { title: item.label } : {})} 
                            >
                                {item.label}
                            </span>
                        }
                        {
                            (item.subLabel || (item.valid === "invalid")) && (
                                <div>
                                    {item.subLabel && <span className={style["header-subtext"]}>{item.subLabel}</span>}
                                    {item.valid === "invalid" && invalidOptionData && <Fragment>{invalidOptionData(item)?.text}</Fragment>}
                                </div>
                            )
                        }
                    </div>
                    {showVerifiedIcon && item?.isVerified && <img src={verifyImage} className="verify-image" alt="verify-image" />}
                </div>
                </div>
                <div className={showDeleteIcon ? "display-flex display-flex-center" : ""}>
                    {showDeleteIcon && (
                        <i
                            className="icon_phoenix-delete"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openDeleteConfirmationModal && openDeleteConfirmationModal(item, selectedChannel);
                            }}
                        />
                    )}
                    {(!shouldShowCheckboxOnLeft && !shouldShowInvalidButtonOnRight) && renderInvalidOptionButton(item)}
                    {(!shouldShowCheckboxOnLeft || singleSelectMode) && renderCheckBoxes(item)}
                    {shouldShowInvalidButtonOnRight && renderInvalidOptionButton(item)}
                </div>
            </div>
        );
    }

    const getSelectAllJSX = () => {
        return (<div 
            className={`${style["select-all-header"]} ${!showCheckboxBeforeText ? style["justify-content"] : ""}`} 
            onClick={() => {
                if (fromWelcomeMessages) {
                    (filteredList.every(el => el?.hasWelcomeMessage || el.valid == "invalid")) ? undefined : onClickOfSelectAll({ target: { checked: !isSelectAllChecked } });
                } else {
                    onClickOfSelectAll({ target: { checked: !isSelectAllChecked } });
                }
            }}>
            {showCheckboxBeforeText && renderSelectAllCheckBox()}
            <div className={`${style["select-all-content-wrapper"]} ${channelIconWithSelectAllJSX && channelIconWithSelectAllJSX() ? "display-flex display-flex-center" : ""}`}>
                <div className={channelIconWithSelectAllJSX && channelIconWithSelectAllJSX() ? "display-flex display-flex-center" : ""}>
                    {channelIconWithSelectAllJSX && channelIconWithSelectAllJSX()}
                    <span className={`${style["select-all-text"]} ${showCheckboxBeforeText ? style["leftMargin"] : ""}`}>{selectAllBtnText ? <strong>{selectAllBtnText}</strong> : `Select all ${getAdditionalSelectAllText ? getAdditionalSelectAllText() + "s" : ""}`}</span>
                </div>
                {getSelectedCountMessage()}
            </div>
            {!showCheckboxBeforeText && renderSelectAllCheckBox()}
        </div>);
    }

    // Row renderer for virtualized list
    const rowRenderer = ({ index, key, style: rowStyle }: ListRowProps) => {
        // Check if this is the "Select All" row
        const isSelectAllRow = index === 0 && !disableSelectAllBtn && filteredList.length > enableSelectAllNumber;

        if (isSelectAllRow) {
            return (
                <div key={key} style={rowStyle}>
                    {getSelectAllJSX()}
                </div>
            );
        }

        // Adjust index for actual data items (subtract 1 if Select All row exists)
        const actualIndex = !disableSelectAllBtn && filteredList.length > enableSelectAllNumber ? index - 1 : index;
        const item = filteredList[actualIndex];

        if (!item) return null;

        return (
            <div key={key} style={rowStyle}>
                {getSingleListItem(item, actualIndex)}
            </div>
        );
    };

    const isDlcBanner = document?.getElementsByClassName("dlc-info")?.length > 0;

    // Calculate total rows (data + select all if enabled)
    const showSelectAll = !disableSelectAllBtn && filteredList.length > enableSelectAllNumber;
    const totalRows = filteredList.length + (showSelectAll ? 1 : 0);
    const listHeight = virtualizationProps?.listHeight || Math.min(totalRows * 60, 180);

    const getListItems = () => {
        if (virtualizationProps?.isEnabled) {
            return (
                <div className={`custom-scroll ${style["scroll-list-wrapper"]} ${isDlcBanner ? "scroll-list-wrapper-new" : ""}`} style={virtualizationProps?.isEnabled ? { height: listHeight, width: "100%" } : {}}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                height={height - 1} // Removed 1 pixel to avoid additional scrollbar in cases where parent height is floating point pixel (eg, 378.93px)
                                width={width - 1} // Removed 1 pixel to avoid additional scrollbar in cases where parent width is floating point pixel (eg, 235.80px)
                                rowCount={totalRows}
                                rowHeight={({ index }: Index) => {
                                    if (virtualizationProps?.rowHeight) {
                                        return virtualizationProps.rowHeight(index);
                                    }

                                    const actualIndex = !disableSelectAllBtn && filteredList.length > enableSelectAllNumber ? index - 1 : index;
                                    // Return different heights based on content
                                    const isSelectAllRow = index === 0 && showSelectAll;
                                    if (isSelectAllRow) return 40;

                                    const item = filteredList[actualIndex];
                                    if (item?.subLabel) return 80; // Taller for items with subtitle
                                    if (item?.imageURL) return 60; // Medium for items with images
                                    return 40; // Default height
                                }}
                                rowRenderer={rowRenderer}
                                overscanRowCount={virtualizationProps?.overscanRowCount || 10}
                                className={virtualizationProps?.className || ""}
                            />
                        )}
                    </AutoSizer>
                </div>
            )
        }

        const selectAllHeader = showSelectAll ? getSelectAllJSX() : null;

        const listItems = map(filteredList, (item: any, index: number) => {
            return getSingleListItem(item, index);
        });

        if (!isEmpty(infiniteScrollProps)) {
            const {
                hasMore = false,
                loadMore = () => {},
                loader,
                useWindow = false,
                initialLoad = false,
                threshold = 250,
                containerHeight = "170px",
                ...otherProps
            } = infiniteScrollProps;

            return (
                <div style={{ height: containerHeight }} className={`custom-scroll ${style["scroll-list-wrapper"]} ${isDlcBanner ? "scroll-list-wrapper-new" : ""}`}>
                    <InfiniteScroll 
                        pageStart={0}
                        hasMore={hasMore}
                        loadMore={loadMore}
                        loader={loader}
                        useWindow={useWindow}
                        initialLoad={initialLoad}
                        threshold={threshold}
                        getScrollParent={() => document.querySelector(`.${style["scroll-list-wrapper"]}`)}
                        {...otherProps}
                    >
                        <div className="scroll-items-under-infinite-scroller">
                            {selectAllHeader}
                            {listItems}
                        </div>
                    </InfiniteScroll>
                </div>
            );
        }

        return (
            <div className={`custom-scroll ${style["scroll-list-wrapper"]} ${isDlcBanner ? "scroll-list-wrapper-new" : ""}`}>
                {selectAllHeader}
                {listItems}
            </div>
        );
    }

    const renderSearchBox = () => {
        if (disableSearchBox) {
            return null;
        }

        if (fieldDrivenSearchOptions?.enabled) {
            return (<FieldDrivenSearch 
                fieldOptions={fieldDrivenSearchOptions?.fieldOptions || []} 
                selectedField={fieldDrivenSearchOptions?.selectedSearchType}
                onChange={searchPaginatedPages}
                searchStr={search}
                searchFilterProps={{
                    placeholder: searchPlaceholder,
                    debounceDelay: searchDebounceDelay || 0,
                    onCrossClickAction: () => updateSearchValue("", ""),
                    ...(fieldDrivenSearchOptions?.searchFilterProps || {})
                }}
            />);
        }
        
        return (<SearchFilter
            placeholder={searchPlaceholder}
            onCrossClickAction={() => updateSearchValue("")}
            onInputValueChange={(value: string) => updateSearchValue(value)}
            debounceDelay={searchDebounceDelay || 0}
            customClass={""}
            searchStr={search}
            renderSearchIconOnLeft
            disableResetIcon
        />);
    }

    return (
        <div className = {`el-listwithcheckbox ${style['list-checkbox-wrapper']} ${customClass ? customClass : ""}`}>
            {renderSearchBox()}
            {showLoader ?
                <LoaderBox type="loader" reseller={BE.business?.accountType !== 1} />
                : (
                    <div className={`${style["list-head-wrapper"]} list-head-wrapper`}>
                        {
                            isEmpty(filteredList || []) ? (
                                <div>{noDataScreen}</div>
                            ) : (
                                <div className={style["list-view-wrapper"]}>
                                    {getListItems()}
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
};

ListWithCheckBox.propTypes = {
    list: PropTypes.array, 
    checkedBoxData: PropTypes.object, 
    checkBoxCallback: PropTypes.func.isRequired, 
    searchPlaceholder: PropTypes.string, 
    noDataScreen: PropTypes.object, 
    disableSelectAllBtn: PropTypes.bool, 
    invalidOptionData: PropTypes.func, 
    disableSearchBox: PropTypes.bool, 
    getAdditionalSelectAllText: PropTypes.func,
    showCheckboxBeforeText: PropTypes.bool,
    customClass: PropTypes.string,
    selectAllLocation: PropTypes.func,
    freezeOptions: PropTypes.bool,
    singleSelectMode : PropTypes.bool,
    showVerifiedIcon : PropTypes.bool,
    selectAllBtnText : PropTypes.string,
    selectedChannel : PropTypes.string,
    enableSelectAllNumber : PropTypes.number,
    channelIconWithSelectAllJSX: PropTypes.any,
    showDeleteIcon: PropTypes.bool,
    openDeleteConfirmationModal: PropTypes.func,
    isReverseSelection: PropTypes.bool,
    reverseSelectedData: PropTypes.any,
    infiniteScrollProps: PropTypes.object,
    showLoader: PropTypes.bool,
    fieldDrivenSearchOptions: PropTypes.object,
    showSelectedCount: PropTypes.bool,
    showInvalidOptionOnRight: PropTypes.bool,
    showCheckboxForInvalidOptions: PropTypes.bool,
    isLoadingAllPages: PropTypes.bool
};

export default ListWithCheckBox;