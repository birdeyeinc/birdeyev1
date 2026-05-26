import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import LoadingShimmer from "atoms/LoadingShimmer";
import PropTypes from "prop-types";
import style from "./SingleSelectPaginated.module.scss";
import { getEncodedStyleClass } from "utils/index";

const getStyle = str => getEncodedStyleClass(str, style);

const SingleSelectPaginated = ({
    fetchData,
    itemKey,
    itemLabel,
    selectedItem,
    onChange,
    defaultPage,
    label = "Select",
    searchPlaceholder = "Search",
    callApiOnMount,
    excludedKeysFromList = {},
    showOptionsReadOnly = false,
    triggerWithCustomJSX = false,
    customJSX,
    hideSearchBox = false,
    calculateDDPositionDynamically = false,
    customDropdownListClassName,
    toggleDropdownCallback,
    uniqueId,
    hidePrefixIcon,
    name,
    validations,
    errorMessages,
    validationTrigger,
    required,
    _attachToFormWrapper,
    _detachFromFormWrapper,
    _fieldValidator,
    _renderValidationErrors,
    _onChange,
    stopIfNoItems = false,
    usePageAsIndex = false,
    secondaryLabelKey = "",
    matchDropdownWidthWithCustomJSX = false,
    hideSelectedWhileSearching = false,
    customDropdownPosition = "",    
    searchNoDataMessage = "",
    noDataMessage = "",
    disabled,
    customOptionJSX = null
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalSelectedItem, setInternalSelectedItem] = useState(null);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchStr, setSearchStr] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [validationClasses, setValidationClasses] = useState(" valid");
    const [validationErrors, setValidationErrors] = useState([]);
    const [showErrorOutsideState, setShowErrorOutsideState] = useState(undefined);
  
    /**
     * @author Soumyabrata Majumder
     * @description State to manage the position of the dropdown list container element.
     * The state is an object that can hold the following properties : top and left,
     * to control the dropdown's placement on the screen.
     */
    const [dropdownPosition, setDropdownPosition] = useState({}); 
    
    const pageSize = defaultPage || 25;

    const observer = useRef();
    const dropdownRef = useRef();
    const firstPageCache = useRef(null);

    /**
     * @author Soumyabrata Majumder
     * @description
     * dropdownListContainerRef: Ref for the dropdown list container element, used for dynamic positioning of the dropdown list.
     * customJSXRef: Ref for the custom JSX element, used to calculate dropdown position relative to the custom JSX rendered.
     */
    const dropdownListContainerRef = useRef();
    const customJSXRef = useRef();

    const effectiveSelectedItem = selectedItem ?? internalSelectedItem;

    const validationRef = useRef({
        state: {
            selected: effectiveSelectedItem,
            validationClasses,
            validationErrors,
            showErrorOutside: showErrorOutsideState,
        },
        props: {
            validations,
            errorMessages,
            required,
            name,
            validationTrigger,
            disabled,
        },
        setState: () => {},
        constructor: { displayName: SingleSelectPaginated.displayName }
    });

    const getSelectedItemForValidation = (item) => {
        if (!item) return undefined;
        const value = item?.[itemKey];
        const labelText = item?.[itemLabel];
        return { value, label: labelText };
    };

    const applyValidationUpdates = (updates) => {
        if (!updates) return;
        
        if (Object.prototype.hasOwnProperty.call(updates, "validationClasses")) {
            setValidationClasses(updates.validationClasses);
        }
        if (Object.prototype.hasOwnProperty.call(updates, "validationErrors")) {
            setValidationErrors(updates.validationErrors);
        }
        if (Object.prototype.hasOwnProperty.call(updates, "showErrorOutside")) {
            setShowErrorOutsideState(updates.showErrorOutside);
        }
    };

    const validationAdapter = validationRef.current;
    validationAdapter.state = {
        selected: getSelectedItemForValidation(effectiveSelectedItem),
        validationClasses,
        validationErrors,
        showErrorOutside: showErrorOutsideState,
    };
    validationAdapter.props = {
        validations,
        errorMessages,
        required,
        name,
        validationTrigger,
        disabled,
    };
    validationAdapter.setState = applyValidationUpdates;
    validationAdapter.constructor = { displayName: SingleSelectPaginated.displayName };

    useEffect(() => {
        if (_attachToFormWrapper) {
            _attachToFormWrapper(validationRef.current);
        }
        return () => {
            _detachFromFormWrapper && _detachFromFormWrapper(validationRef.current);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(prev => {
            const opening = !prev;
            if (opening) {
                setSearchStr("");
                setInputValue("");
                setPage(0);
                setHasMore(true);
            }
            return opening;
        });

        /**
         * @author Soumyabrata Majumder
         * @description Calls the optional `toggleDropdownCallback` function with the component's unique ID
        */
        toggleDropdownCallback && toggleDropdownCallback(uniqueId);
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        setHasMore(true);
        setItems([]);
        debouncedSearch(val);
    };

    const debouncedSearch = useCallback(
        debounce((val) => {
            setSearchStr(val);
            setPage(0);
        }, 700),
        []
    );

    const handleSelect = (item) => {
        /**
         * @author Soumyabrata Majumder
         * @description Prevent selection if the dropdown is in read-only mode (showOptionsReadOnly should be passed as true, default value is false).
         */
        if (showOptionsReadOnly) {
            return;
        }
        if (!selectedItem) setInternalSelectedItem(item);
        validationRef.current.state = {
            ...validationRef.current.state,
            selected: getSelectedItemForValidation(item)
        };
        if (validationTrigger === "onChange" && _fieldValidator) {
            _fieldValidator(validationRef.current);
        }
        _onChange && _onChange(validationRef.current);
        onChange?.(item);
        setIsOpen(false);
    };

    const loadItems = async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        if (page === 0 && inputValue === "" && firstPageCache.current) {
            const cachedData = firstPageCache.current;
            setItems(cachedData.items);
            setHasMore(cachedData.hasMore);
            setLoading(false);
            return;
        }
        try {
            // If using page as index, startIndex is simply the page number
            // Otherwise, calculate startIndex based on page and pageSize
            const startIndex = usePageAsIndex ? page : page * pageSize;
            const response = await fetchData({ searchStr: inputValue, startIndex, pageSize });
            const newItems = response?.data || [];
            const total = response?.totalCount || 0;
            const newHasMore = startIndex + newItems.length < total;

            // If no items returned and it's not the first page, we've reached the end
            if (newItems.length === 0 && page > 0 && !inputValue && stopIfNoItems) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            if (page === 0) {
                setItems(newItems);
                if (searchStr === "") {
                    firstPageCache.current = {
                        items: newItems,
                        hasMore: newHasMore
                    };
                }
            } else {
                setItems(prev => [...prev, ...newItems]);
            }

            setHasMore(newHasMore);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen || callApiOnMount) {
            loadItems();
        }
    }, [isOpen, page, searchStr, callApiOnMount]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                /**
                  * @author Soumyabrata Majumder
                  * @description Calls the optional `toggleDropdownCallback` function
                  */
                toggleDropdownCallback && toggleDropdownCallback(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /**
     * @author Soumyabrata Majumder
     * @description
     * Dynamically calculates and sets the dropdown position when:
     * - The dropdown is triggered with the custom JSX only (`triggerWithCustomJSX` is true)
     * - Dynamic dropdown positioning is enabled (`calculateDDPositionDynamically` is true)
     *
     * The logic determines available space above and below the custom JSX element rendered:
     *   - If enough space above, positions dropdown above the custom JSX element
     *   - If enough space below, positions dropdown below the custom JSX element
     *   - Otherwise, chooses the side with more space
     *
     * Updates dropdown position state accordingly when dropdown is open, items change, or loading state changes.
     */
    useEffect(() => {
        if (triggerWithCustomJSX && calculateDDPositionDynamically) {
            if (customJSXRef.current && dropdownListContainerRef.current && isOpen) {
                const chevronRect = customJSXRef.current.getBoundingClientRect();
                const dropdownHeight = dropdownListContainerRef.current.offsetHeight;
                const viewportHeight = window?.innerHeight;
                
                const spaceAbove = chevronRect.top;
                const spaceBelow = viewportHeight - chevronRect.bottom;
                let top;

                if (spaceAbove >= dropdownHeight) {
                    top = chevronRect.bottom - dropdownHeight;
                } else if (spaceBelow >= dropdownHeight) {
                    top = chevronRect.top;
                } else if (spaceAbove > spaceBelow) {
                    top = Math.max(0, chevronRect.bottom - dropdownHeight);
                } else {
                    top = chevronRect.top;
                }
                let styleObj = {};
                if (customDropdownPosition === "bottom") {
                    top = chevronRect.top;
                }
                if(customDropdownPosition == "left") {
                    styleObj = {
                        right: window.innerWidth - chevronRect.right,
                        bottom: "auto",
                        top,
                        left: "auto",
                    }
                } else {
                    styleObj = {
                        top,
                        left: chevronRect.left,
                    }
                }
                
                if (matchDropdownWidthWithCustomJSX) {
                    styleObj.width = chevronRect.width;
                }
                setDropdownPosition({ ...styleObj });
            }
        }
    }, [isOpen, items, loading]);

    /**
     * @author Soumyabrata Majumder
     * @description
     * Adds a scroll event listener to the window when:
     * - The dropdown is triggered with custom JSX only (`triggerWithCustomJSX` is true)
     * - Dynamic dropdown positioning is enabled (`calculateDDPositionDynamically` is true)
     *
     * On scroll, if the event target is outside the dropdown, the dropdown closes and
     * the optional `toggleDropdownCallback` function is called.
     * The event listener is cleaned up on component unmount.
     */
    useEffect(() => {
        const handleScroll = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                toggleDropdownCallback && toggleDropdownCallback(null);
            }
        };
    
        if (triggerWithCustomJSX && calculateDDPositionDynamically) {
            window?.addEventListener("scroll", handleScroll, true);
        }
        return () => window?.removeEventListener("scroll", handleScroll, true);
    }, []);

    const lastItemRef = useCallback(
        node => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prev => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const resetState = () => {
        setInputValue("");
        setSearchStr("");
        setPage(0);
        setItems([]);
        setHasMore(true);
    };

    const selectedId = effectiveSelectedItem?.[itemKey];
    const filteredItems = items.filter(item => item[itemKey] !== selectedId);
    let itemsToRender = selectedId ? [effectiveSelectedItem, ...filteredItems] : filteredItems;
    if (inputValue && hideSelectedWhileSearching) {
        itemsToRender = filteredItems;
    }
    const getShimmerCount = () => {
        const blocks = [
            {
                height: "large-height",
                width: "full-width"
            },
            {
                height: "large-height",
                width: "full-width"
            },
            {
                height: "large-height",
                width: "full-width"
            },
            {
                height: "large-height",
                width: "full-width"
            },
            {
                height: "large-height",
                width: "full-width"
            },
            {
                height: "large-height",
                width: "full-width"
            },
            {
                height: "large-height",
                width: "full-width"
            }
        ];

        return page === 0 ? blocks : blocks.slice(-3);
    };

    /**
     * @author Soumyabrata Majumder
     * @description
     * Returns the class names for the dropdown list container.
     * Handles dynamic positioning and applies specific classes when the dropdown is ready to be rendered.
     */
    
    const getDropdownListContainerClassNames = () => {
        const { top, left } = dropdownPosition;
        const isDropdownListReady = top !== undefined && left !== undefined;

        let classNames = "dropdown-list-container"; //default class name

        if (customDropdownListClassName) {
            classNames += ` ${customDropdownListClassName}`;
        }

        if (triggerWithCustomJSX && calculateDDPositionDynamically) {
            classNames += ` dropdown-position-fixed`;

            if (isDropdownListReady) {
                classNames += ` dropdown-list-rendered`;
            } else {
                classNames += ` dropdown-list-not-rendered`;
            }
        }

        return classNames;
    }

    /**
     * 
     * @returns {string} - Returns the placeholder text for the dropdown trigger.
     * @description
     * - If an item is selected, it returns the label of the selected item or the secondary label if the itemLabel is not present.
     * - If no item is selected, it returns the label prop, truncating it to 35 characters if necessary.
     * - If the selected item label or the label prop exceeds 35 characters, it appends "..." to indicate truncation.
     * - This function is used to display a concise representation of the selected item in the dropdown trigger.
     * @returns {string} - The placeholder text for the dropdown trigger.
     * @author Papu Kumar <papu.kumar@birdeye.com>
     */
    const getPlaceHolderText = () => {
        if (effectiveSelectedItem?.[itemLabel] || effectiveSelectedItem?.[secondaryLabelKey]) {
            const selectedItemLabel = effectiveSelectedItem[itemLabel] || effectiveSelectedItem[secondaryLabelKey];
            return selectedItemLabel.length > 35 ? `${selectedItemLabel.slice(0, 35)}...` : selectedItemLabel;
        }
        return label.length > 35 ? `${label.slice(0, 35)}...` : label;
    }

    /**
     * @description
     * Returns the JSX for the label of each item in the dropdown list.
     * If the item has a label defined by `itemLabel` or `secondaryLabelKey`, it returns a span with the label text.
     * If neither is present, it returns an empty span.
     * This function is used to render the label for each item in the dropdown list.
     * @param {Object} item - The item object containing the label.
     * @returns {JSX.Element} - The JSX for the item label.
     * @author Papu Kumar <papu.kumar@birdeye.com>
     */
    const getListItemLabel = (item) => {
        if (item?.[itemLabel] || item?.[secondaryLabelKey]) {
            const itemLabelText = item[itemLabel] || item[secondaryLabelKey];
            return (typeof customOptionJSX === "function" ? customOptionJSX(item)  :<span title={itemLabelText}>{itemLabelText}</span>);
        }
        return <span />;
    }

    const getNoDataJSX = () => {
        if (itemsToRender.length === 0 && !loading && !hasMore) {
            if (inputValue) {
                return (
                    <div className={style["no-results"]}>
                        {searchNoDataMessage || "No results found"}
                    </div>
                );
            } else {
                return (
                    <div className={style["no-results"]}>
                        {noDataMessage || "No results found"}
                    </div>
                );
            }
        }
        return null;
    };

    // (Soumya): Extracted dropdown list rendering logic into a separate function for reuse
    const renderDropdownListJSX = () => {
        const { top, left, width, right, bottom } = dropdownPosition;
        const styles = triggerWithCustomJSX && calculateDDPositionDynamically ? { left, top, width, right, bottom } : {};

        /**
         * @author Soumyabrata Majumder
         * @description Added support for:
         * - `style`: applies dynamic styles for dropdown positioning and visibility only if triggerWithCustomJSX and calculateDDPositionDynamically is true, otherwise no additional style would be applied.
         * - `ref`: attaches the dropdownListContainerRef for calculating the height of the dropdown list once rendered.
         */
        return (
            <div
                className={`${getStyle(getDropdownListContainerClassNames())} el-dropdown-list-container`}
                style={{...styles}}
                ref={dropdownListContainerRef}
            >
                <div className={`${style["dropdown-header"]} el-dropdown-header`}>
                    <div className={style["dropdown-label"]}>
                        {label}
                    </div>
                    {
                        /**
                         * @author Soumyabrata Majumder
                         * @description Added support for:
                         * - `hideSearchBox`: allows to hide the search input box in the dropdown list if passed as true, default value is false
                         */
                    }
                    {!hideSearchBox ? <div className={`${style["search-container"]} el-search-container`}>
                        <i className={`${getStyle('search-icon')} icon_phoenix-new-search`} />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleSearchChange}
                            placeholder={searchPlaceholder || "Search"}
                            className={getStyle("search-input")} 
                        />
                        {!!inputValue.length && <i className={`${getStyle('clear-icon')} icon_phoenix-enclose`} onClick={resetState} />}
                    </div> : null}
                </div>
                <div className={`${style["items-container"]} el-items-container`}>
                    {itemsToRender.filter(item => !excludedKeysFromList?.[item[itemKey]])?.map((item, idx) => (
                        <div
                            key={item[itemKey]}
                            ref={idx === itemsToRender.length - 2 ? lastItemRef : null}
                            onClick={() => handleSelect(item)}
                            className={`${getStyle(`item ${showOptionsReadOnly ? "cursor-disable" : ""} ${item[itemKey] === selectedId ? "item-selected" : "item-unselected"}`)} el-item-box ${item[itemKey] === selectedId ? "el-select-item-box" : ""}`}
                        >
                            {getListItemLabel(item)}
                            {
                                /**
                                 * @author Soumyabrata Majumder
                                 * @description Added support for:
                                 * - `showOptionsReadOnly`: allows to hide the checkmark icon on the right side of each option in the dropdown list if passed as true, default value is false
                                 */
                            }
                            {!showOptionsReadOnly ? item[itemKey] === selectedId && <a className='icon_phoenix-checkmark' /> : null}
                        </div>
                    ))}
                    {loading && (
                        <LoadingShimmer
                            displayCount={1}
                            shimmerCount={getShimmerCount()}
                        />
                    )}
                </div>
                {getNoDataJSX()}
            </div>
        );
    };

    /**
     * @author Soumyabrata Majumder
     * @description
     * - If `triggerWithCustomJSX` is false (default behaviour), renders the standard JSX with label and icons. (Existing functionality which had been implemented previously)
     * - If `triggerWithCustomJSX` is true, renders only the custom JSX; clicking the custom JSX opens the dropdown list.
     */

    return (
        <div className={`${style["dropdown-container"]} ${validationClasses}`} ref={dropdownRef}>
            {!triggerWithCustomJSX ? (
                isOpen ? renderDropdownListJSX()
                    :
                    <div
                        onClick={toggleDropdown}
                        className={`${getStyle(!hidePrefixIcon ? "trigger" : "trigger-no-icon")} ${disabled ? getStyle("disabled") : ""}`}

                    >
                        {!hidePrefixIcon && <i className={`${getStyle('trigger-icon-left')} icon_phoenix-pin-location`} />}
                        <span className={style["trigger-label"]}>
                            {getPlaceHolderText()}
                        </span>
                        <i className={`${getStyle('trigger-icon-right')} icon_phoenix-cheveron_open`} />
                    </div>
            ) : 
                <React.Fragment>
                    <div
                        onClick={toggleDropdown}
                        className={style["trigger-with-custom-jsx-only"]}
                        ref={customJSXRef}
                    >
                        {customJSX && customJSX()}
                    </div>
                    {isOpen ? renderDropdownListJSX() : null}
                </React.Fragment>}
            {_renderValidationErrors && _renderValidationErrors(validationRef.current)}
        </div>
    );
};

SingleSelectPaginated.propTypes = {
    fetchData: PropTypes.func,
    itemKey: PropTypes.string,
    itemLabel: PropTypes.string,
    selectedItem: PropTypes.object,
    onChange: PropTypes.func,
    defaultPage: PropTypes.number,
    label: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    callApiOnMount: PropTypes.bool,
    excludedKeysFromList: PropTypes.object,
    showOptionsReadOnly: PropTypes.bool, //Soumya : Added a prop to display the dropdown options as a non-interactive, read-only list (no selection allowed)
    triggerWithCustomJSX: PropTypes.bool, // Soumya : Added a prop to display custom JSX as the dropdown trigger
    customJSX: PropTypes.func, // Soumya : Added a prop which would render customJSX if triggerWithCustomJSX is true; clicking on the custom JSX opens the dropdown
    hideSearchBox: PropTypes.bool, //Soumya : Added a prop to hide the search box in the dropdown list
    customDropdownListClassName: PropTypes.string, // Soumya : Added a prop to add custom class name for the dropdown list container, allowing additional styling
    toggleDropdownCallback: PropTypes.func, //Soumya : Added a prop which is a callback function triggered when the dropdown is toggled (opened/closed)
    calculateDDPositionDynamically: PropTypes.bool, //Soumya : Added a prop which if true, dynamically calculates and sets the dropdown position based on viewport and the custom JSX element if triggerWithCustomJSX is true.
    uniqueId: PropTypes.string, //Soumya : Added a prop which is a unique identifier for the dropdown instance
    hidePrefixIcon: PropTypes.bool,
    name: PropTypes.string,
    validations: PropTypes.object,
    errorMessages: PropTypes.object,
    validationTrigger: PropTypes.string,
    required: PropTypes.bool,
    _attachToFormWrapper: PropTypes.func,
    _detachFromFormWrapper: PropTypes.func,
    _fieldValidator: PropTypes.func,
    _renderValidationErrors: PropTypes.func,
    _onChange: PropTypes.func,
    stopIfNoItems: PropTypes.bool,
    usePageAsIndex: PropTypes.bool, // If true, uses page number as the start index for API calls instead of page * pageSize
    secondaryLabelKey: PropTypes.string, // Key for the secondary label in the dropdown options
    matchDropdownWidthWithCustomJSX: PropTypes.bool, // If true, matches the dropdown width with the custom JSX width
    hideSelectedWhileSearching: PropTypes.bool, // If true, hides the selected item while searching
    customDropdownPosition: PropTypes.string, // Custom position for the dropdown, e.g., "bottom" to force dropdown below the custom JSX
    searchNoDataMessage: PropTypes.string, // Message to display when no data is available in the search results
    noDataMessage: PropTypes.string, // Message to display when no data is available in the dropdown
    disabled: PropTypes.bool // If true, disables the dropdown interaction
};

export default SingleSelectPaginated;

SingleSelectPaginated.displayName = "SingleSelectPaginated";