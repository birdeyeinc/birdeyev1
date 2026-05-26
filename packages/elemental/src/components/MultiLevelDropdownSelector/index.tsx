import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from "react";
import { map, isEmpty, each } from "lodash";
import PropTypes from "prop-types";
import ListWithCheckBox from "components/ListWithCheckBox";
import NoDataSimple from "components/NoData/simple";
import noDataImage from "assets/images/noDataImage.svg";
import style from "./MultiLevelDropdownSelector.module.scss"
import Button from "atoms/Button";
import SearchFilter from "atoms/SearchFilter";
import FilterOptionsList from "./FilterOptionsList"

interface Props {
    title?: string;
    navOptions: Array<any>;
    selectedNavItem: any,
    navOptionClickHandler: any,
    navMultiSelectOptions: Array<any>;
    selectedNavMultiSelectItem: Object,
    navMultiSelectClickHandler: any,
    closeOnOutsideClick?: Boolean,
    setShowPopoverLocFilters?: any
    isUncontrolledComponent?: Boolean;
    defaultLeftNavSelectedOption?: any;
    getRightNavOptions?: Function;
    leftNavOnChangeCallback?: Function;
    rightNavOnChangeCallback?: Function;
    getPopoverHeaderTitle?: Function;
    isSyncWithGlobalFilters?: Boolean;
    locHierarchyFilterChangeTempUniqueId?: string;
    locHierarchyFilterData?: any;
    getCurrentLeftAndRightSelectedOptionsInParent?: any;
    updateParentDropdownState?:Function;
    showPrimaryCta?: Boolean;
    primaryCtaLabel?: string;
    primaryCtaClickCb?: Function;
    showSecondaryCta?: Boolean;
    secondaryCtaLabel?: string;
    secondaryCtaClickCb?: Function;
    isHeightAutoAdjust?: Boolean;
    dropdownType?:string;
    secondaryCtaAppliedCount?: number;
    restrictClosingPopover?: Boolean;
    secondNavFilterOptions?: any,
    secondNavFilterSelectetValue?:any,
    secondNavFilterClickHandler?: any,
    showThirdNav?: boolean,
    thidNavFilterOptions?: any,
    thidNavFilterSelectetValue?: any,
    thidNavFilterClickHandler?: any,
    isContactSegement?: boolean,
    preventCheckBoxPropagation?: boolean,
    virtualizationProps?: any,
    paginationConfig?: any, // Interface can be seen in ListWithCheckbox component
    enableGlobalSearch?: boolean,
    allNavFilterOptionsMap?: Record<string, any[]>
}

const MultiLevelDropdownSelector: React.FC<Props> = ({
    title,
    navOptions,
    selectedNavItem,
    navOptionClickHandler,
    navMultiSelectOptions,
    selectedNavMultiSelectItem,
    navMultiSelectClickHandler,
    closeOnOutsideClick,
    setShowPopoverLocFilters,
    isUncontrolledComponent = false,
    defaultLeftNavSelectedOption = {},
    getRightNavOptions,
    leftNavOnChangeCallback,
    rightNavOnChangeCallback,
    getPopoverHeaderTitle,
    isSyncWithGlobalFilters = false,
    locHierarchyFilterChangeTempUniqueId,
    locHierarchyFilterData,
    getCurrentLeftAndRightSelectedOptionsInParent,
    updateParentDropdownState,
    showPrimaryCta = false, 
    primaryCtaLabel,
    primaryCtaClickCb,
    showSecondaryCta = false,
    secondaryCtaLabel,
    secondaryCtaClickCb,
    isHeightAutoAdjust = false,
    secondaryCtaAppliedCount = 0,
    restrictClosingPopover = false,
    dropdownType="default",
    secondNavFilterOptions=[],
    secondNavFilterSelectetValue={},
    secondNavFilterClickHandler,
    showThirdNav,
    thidNavFilterOptions=[],
    thidNavFilterSelectetValue={},
    thidNavFilterClickHandler,
    isContactSegement = false,
    preventCheckBoxPropagation = false,
    virtualizationProps = {},
    paginationConfig = {},
    enableGlobalSearch = false,
    allNavFilterOptionsMap = {}
}) => {

    const [showDropdown, setShowDropdown] = useState<any>(false);
    const [navOptionsList] = useState<any>(navOptions || []);
    const [selectedNavOption, setSelectedNavOption] = useState<any>(selectedNavItem ? selectedNavItem : !isEmpty(navOptionsList) ? navOptionsList[0] : null);
    const [uncontrolledSelLeftNavOption, setUncontrolledSelLeftNavOption] = useState<any>(defaultLeftNavSelectedOption);
    const [uncontrolledSelRightNavOptions, setUncontrolledSelRightNavOptions] = useState<any>({});
    const [allRightNavOptions, setAllRightNavOptions] = useState<any>([]);
    const [reverseSelectedItems, setReverseSelectedItems] = useState({});
    const [isReverseSelection, setIsReverseSelection] = useState(isUncontrolledComponent ? true : false);
    const [isLeftNavOptionChanged, setIsLeftNavOptionChanged] = useState(false);
    const [autoAdjustedHeight, setAutoAdjustedHeight] = useState(0);
    const [globalSearchQuery, setGlobalSearchQuery] = useState("");

    const dropdownPopoverRef = useRef<HTMLDivElement | null>(null);

    // Global search is only active when enabled AND navOptions are present (multi-level)
    const isGlobalSearchActive = enableGlobalSearch && navOptions?.length > 0;

    // Global search: compute match counts per nav tab and filtered options for current tab
    const navSearchCounts = useMemo(() => {
        if (!isGlobalSearchActive || !globalSearchQuery.trim()) return {};
        const q = globalSearchQuery.toLowerCase();
        const counts: Record<string, number> = {};
        navOptions.forEach((nav: any) => {
            const key = nav.aliasNameFilter || nav.value;
            const options = allNavFilterOptionsMap[key] || [];
            counts[nav.value] = options.filter((item: any) =>
                (item.label || "").toLowerCase().includes(q)
            ).length;
        });
        return counts;
    }, [isGlobalSearchActive, globalSearchQuery, navOptions, allNavFilterOptionsMap]);

    const globalFilteredSecondNavOptions = useMemo(() => {
        if (!isGlobalSearchActive || !globalSearchQuery.trim()) return secondNavFilterOptions;
        const q = globalSearchQuery.toLowerCase();
        return (secondNavFilterOptions || []).filter((item: any) =>
            (item.label || "").toLowerCase().includes(q)
        );
    }, [isGlobalSearchActive, globalSearchQuery, secondNavFilterOptions]);

useEffect(() => {
        if (!isUncontrolledComponent) {
            setSelectedNavOption(selectedNavItem || null);
        }
    }, [selectedNavItem]);

    useEffect(() => {
        if (isUncontrolledComponent) {
            const newAllRightNavOptions = getRightNavOptions ? getRightNavOptions(uncontrolledSelLeftNavOption) : [];

            if (isSyncWithGlobalFilters && !isLeftNavOptionChanged) {
                updateRightNavOptionsOnGlobalFilterChange();
            } else {
                let obj = {
                    selOptions: newAllRightNavOptions,
                    allOptions: newAllRightNavOptions,
                    subKey: "value",
                    isLeftNavOptionChanged,
                    isDefaultSelectionForLoc: uncontrolledSelLeftNavOption?.value === 1 ? true : false
                };

                prepareAndSetRightNavOptions(obj)
            }
        }
    }, [uncontrolledSelLeftNavOption?.id]);
    
    useEffect(() => {
        if (isUncontrolledComponent && isSyncWithGlobalFilters) {
            updateLeftNavOptionOnGlobalFilterChange(true);
        }
    }, [locHierarchyFilterChangeTempUniqueId])


    useEffect(() => {
        const clickoutside = (event) => {
            if (dropdownPopoverRef.current && !dropdownPopoverRef.current.contains(event.target) && !restrictClosingPopover) {
                setShowDropdown(false);
                updateParentDropdownState && updateParentDropdownState(false)
                setShowPopoverLocFilters && setShowPopoverLocFilters(false);
                isGlobalSearchActive && setGlobalSearchQuery("");
            }
        };
        closeOnOutsideClick && document.addEventListener("click", clickoutside, true);
        return () => {
            closeOnOutsideClick && document.removeEventListener("click", clickoutside, true);
        };
    }, [dropdownPopoverRef, restrictClosingPopover]);

    useLayoutEffect(() => {
        if (isHeightAutoAdjust && showDropdown) {
            const popoverContent = dropdownPopoverRef.current?.querySelector<HTMLDivElement>(`.${style["popover-content"]}`);

            if (popoverContent) {
                const dimensions = popoverContent.getBoundingClientRect();
                const availableHeight = window.innerHeight - dimensions.top;

                popoverContent.style.maxHeight = `${availableHeight}px`;

                if (showSecondaryCta || showPrimaryCta) {
                    const listWrapper = dropdownPopoverRef.current?.querySelector<HTMLDivElement>(".list-head-wrapper");
                    listWrapper && (listWrapper.style.maxHeight = `${Math.min(availableHeight - 150, 375)}px`);
                    setAutoAdjustedHeight(Math.min(availableHeight - 150, 375));
                }
            }
        }
    }, [isHeightAutoAdjust, showDropdown]);

    const showHidePopover = () => {
        const nextState = !showDropdown;
        setShowDropdown(nextState);
        updateParentDropdownState && updateParentDropdownState(nextState);
        setShowPopoverLocFilters && setShowPopoverLocFilters(nextState);
        if (!nextState && isGlobalSearchActive) {
            setGlobalSearchQuery("");
        }
    };

    const setNavOption = (item) => {
        setSelectedNavOption(item);
        navOptionClickHandler(item);
    };

    const getNoDataScreen = () => {
        let title = `No ${selectedNavOption?.aliasName?.toLowerCase() || "data"} found`;

        if (isUncontrolledComponent) {
            title = `No ${uncontrolledSelLeftNavOption?.aliasName?.toLowerCase() || "data"} found`
        }
        return (
            <NoDataSimple
                imageUrl={noDataImage}
                title={title}
                customClassName={style["nodata"]}
            />
        );
    };

    const handleLeftNavOptionChange = (selectedOption: any) => {

        let finalOption = {
            ...selectedOption,
            id: selectedOption.value
        }

        setUncontrolledSelLeftNavOption(finalOption);
        if (isSyncWithGlobalFilters) {
            setIsReverseSelection(selectedOption?.value === 1 ? true : false);
        } else {
            setIsReverseSelection(true);
        }

        setReverseSelectedItems({});
        setIsLeftNavOptionChanged(true);

        let obj = {
            selectedHierarchy: finalOption,
            isReverseSelected: selectedOption?.value === 1 ? true : false,
            reverseSelectedOptions: {},
            selectedOptions: {}
        }

        leftNavOnChangeCallback && leftNavOnChangeCallback(obj);

    }

    const handleRightNavOptionChange = (option: any, event: any, type: any, optionList: any) => {

        let finalOptions = { ...uncontrolledSelRightNavOptions };
        let isReverseSelectedCopy = true;
        let finalReverseSelectedOptions: any = {};

        if (type === "SELECTED_ALL" || type === "REMOVE_ALL") {
            if (type === "SELECTED_ALL") {
                each(optionList, (item) => {
                    finalOptions[item?.value] = true;
                })
                finalReverseSelectedOptions = {};

                if (isSyncWithGlobalFilters) {
                    isReverseSelectedCopy = uncontrolledSelLeftNavOption?.value === 1 ? true : false;
                } else {
                    isReverseSelectedCopy = true;
                }

                setIsReverseSelection(isReverseSelectedCopy);
                setReverseSelectedItems(finalReverseSelectedOptions);
                setUncontrolledSelRightNavOptions(finalOptions);
            } else {
                finalOptions = {};
                finalReverseSelectedOptions = {};
                isReverseSelectedCopy = false;

                setIsReverseSelection(isReverseSelectedCopy);
                setReverseSelectedItems(finalReverseSelectedOptions);
                setUncontrolledSelRightNavOptions(finalOptions);
            }
        } else {
            isReverseSelectedCopy = false;

            if (isReverseSelection) {
                isReverseSelectedCopy = true;
            }

            if (event?.target?.checked) {
                if (isReverseSelection) {
                    finalReverseSelectedOptions = { ...reverseSelectedItems };

                    delete finalReverseSelectedOptions[option?.value];

                    setReverseSelectedItems(finalReverseSelectedOptions);

                    if (isEmpty(finalReverseSelectedOptions)) {
                        const newAllRightNavOptions = getRightNavOptions ? getRightNavOptions(uncontrolledSelLeftNavOption) : [];

                        let newSelRightNavOptions: any = {};

                        each(newAllRightNavOptions, (item) => {
                            newSelRightNavOptions[item?.value] = true;
                        });

                        setUncontrolledSelRightNavOptions(newSelRightNavOptions);
                    }
                } else {
                    finalOptions = {
                        ...finalOptions,
                        [option?.value]: true
                    };

                    setUncontrolledSelRightNavOptions(finalOptions);
                }
            } else {
                delete finalOptions[option?.value];

                setUncontrolledSelRightNavOptions(finalOptions);

                if (isReverseSelection) {
                    finalReverseSelectedOptions = { ...reverseSelectedItems };

                    finalReverseSelectedOptions = {
                        ...finalReverseSelectedOptions,
                        [option?.value]: true
                    }

                    setReverseSelectedItems(finalReverseSelectedOptions);
                }
            }
        }

        let obj = {
            isReverseSelected: isReverseSelectedCopy,
            reverseSelectedOptions: finalReverseSelectedOptions,
            selectedOptions: finalOptions,
            selectedHierarchy: uncontrolledSelLeftNavOption
        }

        rightNavOnChangeCallback && rightNavOnChangeCallback(obj);
    }

    const prepareAndSetRightNavOptions = (obj: any) => {
        const { selOptions = [], allOptions = [], subKey = "", isExcludedBizIds = false, isLeftNavOptionChanged = true, isDefaultSelectionForLoc = false } = obj;

        let newSelRightNavOptions: any = {};
        let finalObj: any = {};

        if (!isLeftNavOptionChanged) {
            let newObj = updateLeftNavOptionOnGlobalFilterChange(false);

            finalObj = {
                ...newObj
            }
        }

        each(selOptions, (item) => {
            const key = subKey ? item[subKey] : item;
            newSelRightNavOptions[key] = true;
        });

        if (isExcludedBizIds) {
            finalObj = {
                ...finalObj,
                isReverseSelected: true,
                reverseSelectedOptions: newSelRightNavOptions,
                selectedRightNavOptions: {}
            }

            setIsReverseSelection(true);
            setReverseSelectedItems(newSelRightNavOptions);
            setUncontrolledSelRightNavOptions({});
        } else {
            finalObj = {
                ...finalObj,
                isReverseSelected: isDefaultSelectionForLoc ? isDefaultSelectionForLoc : false,
                reverseSelectedOptions: {},
                selectedRightNavOptions: Object.keys(newSelRightNavOptions)?.length === allOptions?.length ? {} : newSelRightNavOptions
            }

            setIsReverseSelection(isDefaultSelectionForLoc ? isDefaultSelectionForLoc : false);
            setReverseSelectedItems({});
            setUncontrolledSelRightNavOptions(newSelRightNavOptions);
        }

        setAllRightNavOptions(allOptions);

        if (!isLeftNavOptionChanged) {
            getCurrentLeftAndRightSelectedOptionsInParent && getCurrentLeftAndRightSelectedOptionsInParent(finalObj);
        }
    }

    const getParamsForPopoverHeaderTitleFunc = () => {
        return {
            isReverseSelection,
            reverseSelectedItems,
            selRightNavOptions: uncontrolledSelRightNavOptions,
            selLeftNavOption: uncontrolledSelLeftNavOption,
            allRightNavOptions
        };
    }

    const updateLeftNavOptionOnGlobalFilterChange = (updateState = true) => {
        const { customLevelData = [] } = locHierarchyFilterData;

        if (customLevelData?.length > 0) {
            const currentSelectedHierarchy = customLevelData[0];
            const newLeftNavSelectedOption = navOptions?.find(item => Number(item?.value) === currentSelectedHierarchy?.levelId);

            if (updateState) {
                setIsLeftNavOptionChanged(false);
                setUncontrolledSelLeftNavOption(newLeftNavSelectedOption);
            } else {
                return {
                    selectedLeftNavOption: newLeftNavSelectedOption
                }
            }
        } else {
            if (updateState) {
                setIsLeftNavOptionChanged(false);
                setUncontrolledSelLeftNavOption(defaultLeftNavSelectedOption);
            } else {
                return {
                    selectedLeftNavOption: defaultLeftNavSelectedOption
                }
            }
        }
    }

    const updateRightNavOptionsOnGlobalFilterChange = () => {
        const { businessIds = [], excludedBizIds = [], customLevelData = [] } = locHierarchyFilterData;

        const newAllRightNavOptions = getRightNavOptions ? getRightNavOptions(uncontrolledSelLeftNavOption) : [];

        if (businessIds?.length > 0) {
            let obj = {
                selOptions: businessIds,
                allOptions: newAllRightNavOptions,
                isLeftNavOptionChanged: false
            };

            prepareAndSetRightNavOptions(obj);
        } else if (excludedBizIds?.length > 0) {
            let obj = {
                selOptions: excludedBizIds,
                allOptions: newAllRightNavOptions,
                isExcludedBizIds: true,
                isLeftNavOptionChanged: false
            };

            prepareAndSetRightNavOptions(obj);
        } else if (customLevelData?.length > 0) {
            const currentSelectedHierarchy = customLevelData[0];

            let obj = {
                selOptions: currentSelectedHierarchy?.levelNames,
                allOptions: newAllRightNavOptions,
                isLeftNavOptionChanged: false
            };

            prepareAndSetRightNavOptions(obj);
        } else {
            let obj = {
                selOptions: newAllRightNavOptions,
                allOptions: newAllRightNavOptions,
                subKey: "value",
                isLeftNavOptionChanged: false,
                isDefaultSelectionForLoc: uncontrolledSelLeftNavOption?.value === 1 ? true : false
            };

            prepareAndSetRightNavOptions(obj)
        }
    }

    const getPopupFooterButtons = () => {
        const buttons = [];
        if (showSecondaryCta) {
            buttons.push(<Button className={style["filter-btn"]} theme="link" onClick={secondaryCtaClickCb ? () => {
                secondaryCtaClickCb();
                setShowDropdown(false);
            } : () => {}}> {secondaryCtaLabel} {secondaryCtaAppliedCount ? <span className={`badges ${style["show-applied-count"]}`}>{secondaryCtaAppliedCount}</span> : null }</Button>)
        }
        if (showPrimaryCta) {
            buttons.push(<Button label={primaryCtaLabel} onClick={primaryCtaClickCb ? (event) => {
                primaryCtaClickCb((!isUncontrolledComponent ? selectedNavMultiSelectItem : uncontrolledSelRightNavOptions), event);
                setShowDropdown(false);
            } : () => {}} />)
        }
        return <div className={style["popover-buttons"]}>{buttons}</div>;
    }

    return (
        <div className={style["multilevel-dropdown"]} ref={dropdownPopoverRef}>
            <div className={style["popover-parent"]}>
                {
                    dropdownType === "default" ? 
                        <div className={style["popover-header"]} onClick={showHidePopover}>
                            <p data-testid="el-test-popover-header-title" className={style["popover-header-title"]}>{!isUncontrolledComponent ? (title || "") : (getPopoverHeaderTitle ? getPopoverHeaderTitle(getParamsForPopoverHeaderTitleFunc()) : "")}</p>
                            <i className="icon_phoenix-cheveron_open" />
                        </div> 
                     :
                    <div className={style["popover-header"]} style={{width:"272px", padding:"8px 6px", backgroundColor:"#E5E9F0", borderRadius:"4px", display:"flex",justifyContent:"space-between"}} onClick={showHidePopover}>
                     <p>{title}</p>
                    <i className="icon_phoenix-cheveron_open" />
            </div>

                }
                {showDropdown && !isEmpty(navOptionsList) && !isEmpty(!isUncontrolledComponent ? selectedNavOption : uncontrolledSelLeftNavOption) && (
                    <div className={`${style["popover-content"]} ${(showPrimaryCta || showSecondaryCta) ? style["popover-content-with-btns"] : ""} ${isHeightAutoAdjust ? style["popover-content-cstm-height"] : ""} ${isGlobalSearchActive ? style["popover-content-with-global-search"] : ""}`}>
                        {isGlobalSearchActive && (
                            <div className={style["global-search-bar"]}>
                                <SearchFilter
                                    placeholder="Search..."
                                    onCrossClickAction={() => setGlobalSearchQuery("")}
                                    onInputValueChange={(value: string) => setGlobalSearchQuery(value)}
                                    debounceDelay={200}
                                    customClass=""
                                    searchStr={globalSearchQuery}
                                    renderSearchIconOnLeft
                                />
                            </div>
                        )}
                        {(() => {
                        const columns = (
                        <>
                        <div className={style["popover-nav"]}>
                                {
                                    map(navOptionsList, (item: any, i: number) => {
                                        let isItemSelected = selectedNavOption && selectedNavOption.value == item.value;

                                        if (isUncontrolledComponent) {
                                            isItemSelected = uncontrolledSelLeftNavOption && uncontrolledSelLeftNavOption.value == item.value;
                                        }

                                        const hasSearchQuery = isGlobalSearchActive && globalSearchQuery.trim();
                                        const matchCount = hasSearchQuery ? (navSearchCounts[item.value] ?? 0) : undefined;

                                        return (
                                            <p
                                                key={i + item.value}
                                                className={`${style["popover-nav-item"]} ${isItemSelected ? style["active"] : ""}`}
                                                onClick={!isUncontrolledComponent ? () => setNavOption(item) : () => handleLeftNavOptionChange(item)}
                                            >
                                                {item.name}
                                                {matchCount !== undefined && (
                                                    <span className={style["nav-search-count"]}>{matchCount}</span>
                                                )}
                                                <i className="icon_phoenix-cheveron_open" />
                                            </p>
                                        );
                                    })
                                }
                        </div>
                        <div className={isContactSegement ? style["popover-nav"] : style["popover-nav-content"]}>
                            {
                            dropdownType === "default" ? 
                                 <ListWithCheckBox
                                    list={!isUncontrolledComponent ? navMultiSelectOptions : allRightNavOptions}
                                    checkedBoxData={!isUncontrolledComponent ? selectedNavMultiSelectItem : uncontrolledSelRightNavOptions}
                                    checkBoxCallback={!isUncontrolledComponent ? navMultiSelectClickHandler : handleRightNavOptionChange}
                                    searchPlaceholder={`Search ${!isUncontrolledComponent ? (selectedNavOption?.aliasName?.toLowerCase() || "") : (uncontrolledSelLeftNavOption?.aliasName?.toLowerCase() || "")}`}
                                    noDataScreen={getNoDataScreen()}
                                    showCheckboxBeforeText
                                    isReverseSelection={isReverseSelection}
                                    reverseSelectedData={reverseSelectedItems ? Object.keys(reverseSelectedItems) : []}
                                    disableSearchBox={isGlobalSearchActive || (!isUncontrolledComponent ? false : allRightNavOptions?.length <= 10)}
                                    virtualizationProps={{
                                        ...(autoAdjustedHeight && ({ listHeight: autoAdjustedHeight })),
                                        ...virtualizationProps
                                    }}
                                    preventCheckBoxPropagation = {preventCheckBoxPropagation}
                                    infiniteScrollProps={paginationConfig}
                                /> 
                            :
                            <FilterOptionsList
                                listOptions={isGlobalSearchActive ? globalFilteredSecondNavOptions : secondNavFilterOptions}
                                selectedValue={secondNavFilterSelectetValue.label}
                                handleFilterWithMoreOptions={secondNavFilterClickHandler}
                                noDataScreen={getNoDataScreen()}
                                hideSearch={isGlobalSearchActive}
                            />
                            }
                        </div>
                        {
                            showThirdNav && (
                            <div className={style["popover-nav-content"]}>
                              <FilterOptionsList
                                listOptions={thidNavFilterOptions}
                                selectedValue={thidNavFilterSelectetValue.label}
                                handleFilterWithMoreOptions={thidNavFilterClickHandler}
                                noDataScreen={getNoDataScreen()}
                              />
                            </div>)
                        }
                        </>
                        );
                        return isGlobalSearchActive ? (
                            <div className={style["popover-columns-wrapper"]}>{columns}</div>
                        ) : columns;
                        })()}
                        {(showSecondaryCta || showPrimaryCta) ? getPopupFooterButtons() : null}
                    </div>
                )}
            </div>
        </div>
    );
};

MultiLevelDropdownSelector.propTypes = {
    title: PropTypes.string,
    navOptions: PropTypes.array.isRequired,
    selectedNavItem: PropTypes.any,
    navOptionClickHandler: PropTypes.func,
    navMultiSelectOptions: PropTypes.array.isRequired,
    selectedNavMultiSelectItem: PropTypes.object.isRequired,
    navMultiSelectClickHandler: PropTypes.func,
    closeOnOutsideClick: PropTypes.bool,
    setShowPopoverLocFilters: PropTypes.func,
    isUncontrolledComponent: PropTypes.bool,
    defaultLeftNavSelectedOption: PropTypes.object,
    getRightNavOptions: PropTypes.func,
    leftNavOnChangeCallback: PropTypes.func,
    rightNavOnChangeCallback: PropTypes.func,
    getPopoverHeaderTitle: PropTypes.func,
    isSyncWithGlobalFilters: PropTypes.bool,
    locHierarchyFilterChangeTempUniqueId: PropTypes.string,
    locHierarchyFilterData: PropTypes.any,
    updateParentDropdownState: PropTypes.func,
    showPrimaryCta: PropTypes.bool,
    primaryCtaLabel: PropTypes.string,
    primaryCtaClickCb: PropTypes.func,
    showSecondaryCta: PropTypes.bool,
    secondaryCtaLabel: PropTypes.string,
    secondaryCtaClickCb: PropTypes.func,
    isHeightAutoAdjust: PropTypes.bool,
    dropdownType: PropTypes.string,
    secondaryCtaAppliedCount: PropTypes.number,
    restrictClosingPopover: PropTypes.bool,
    secondNavFilterOptions: PropTypes.any,
    secondNavFilterSelectetValue:PropTypes.any,
    secondNavFilterClickHandler: PropTypes.func,
    showThirdNav: PropTypes.bool,
    thidNavFilterOptions: PropTypes.any,
    thidNavFilterSelectetValue: PropTypes.any,
    thidNavFilterClickHandler: PropTypes.func,
    isContactSegement: PropTypes.bool,
    virtualizationProps: PropTypes.any,
    paginationConfig: PropTypes.object,
    enableGlobalSearch: PropTypes.bool,
    allNavFilterOptionsMap: PropTypes.any
};

export default MultiLevelDropdownSelector;

