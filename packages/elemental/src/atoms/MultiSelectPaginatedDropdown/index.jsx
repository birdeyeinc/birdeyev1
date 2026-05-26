import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { debounce, cloneDeep } from "lodash";
import "./multiSelectPaginatedDropdown.scss";
import  FormInput  from "atoms/FormInput";
import LoadingShimmer from "atoms/LoadingShimmer";
import useClickOutside from "hooks/useClickOutside";
import Button from "atoms/Button"
import Tooltip from "atoms/Tooltip"
import useHandleScroll from "hooks/useHandleScroll";

const SearchInput = ({ value, onChange, onResetClick }) => {
    return (<div className="business-search-filter">
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Search"
        />
        {value && <span onClick={onResetClick} className="icons icon_phoenix-reset phoenix-icon-multiselect el-close-icon phoenix-icon"/>}
    </div>
    );
};

const MultiSelectPaginatedDropdownComponent = ({
    isDataFromAPI,
    getDataFromApi,
    checkerString,
    showSearch,
    placeHolderText,
    parentAreOptionsStateDeselected,
    onBlur,
    parentSelectedOptions,
    parentOptions,
    parentTotalCount,
    isPopupView,
    primaryLabelKey,
    secondaryLabelKey,
    savedState,
    onOutsideClick,
    pluralSuffixName,
    defaultState,
    hideSelectAll = false,
    disableDeselectionLogic = false,
    showError = false,
    renderValidationErrors,
    isAllSelectedByDefault = true,
    optionSubtextKey,
    pinDeselectedToTop = false,
}) => {
    const [selectedOptions, setSelectedOptions] = useState(!parentAreOptionsStateDeselected ? parentSelectedOptions : {});
    const [deselectedOptions, setDeselectedOptions ] = useState(parentAreOptionsStateDeselected ? parentSelectedOptions : {});
    const [finalSelectedOptions, setFinalSelectedOptions] = useState(!parentAreOptionsStateDeselected ? parentSelectedOptions : {});
    const [finalDeselectedOptions, setFinalDeselectedOptions ] = useState(parentAreOptionsStateDeselected ? parentSelectedOptions : {});
    const [searchString, setSearchString] = useState("");
    const [options, setOptions] = useState([]);
    const [totalCount, setTotalCount] = useState(parentTotalCount ? parentTotalCount : null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const {scrollableElemRef: loadMoreRef, page, setPage } = useHandleScroll({
        initialPage: 1, 
        hasMore, 
        rootMargin: 350
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAllClicked, setIsAllClicked] = useState(parentAreOptionsStateDeselected);
    const [areOptionsStateDeselected , setAreOptionsStateDeselected ] = useState(parentAreOptionsStateDeselected);
    const [searchState, setSearchState ] =  useState({
        view: false,
        isAllClicked: parentAreOptionsStateDeselected,
        options:[]
    });
    const [isOutsideClicked, setIsOutsideClicked] = useState(false);
    const isInitialMount = useRef(true);
    const { ref, isComponentVisible, setIsComponentVisible } = useClickOutside(isPopupView);

    useEffect(() => {
        if (!isComponentVisible) {
            if (isPopupView) {
                handleApplyClick();
            } else {
                resetToDefaultState(selectedOptions);
            }
        }

    }, [isComponentVisible]);

    useEffect(() => {
        setSelectedOptions(parentAreOptionsStateDeselected ? {} : parentSelectedOptions);
        setFinalSelectedOptions(parentAreOptionsStateDeselected ? {} : parentSelectedOptions);
        setDeselectedOptions(parentAreOptionsStateDeselected ? parentSelectedOptions : {});
        setFinalDeselectedOptions(parentAreOptionsStateDeselected ? parentSelectedOptions : {});
        setAreOptionsStateDeselected(parentAreOptionsStateDeselected);
        setIsAllClicked(parentAreOptionsStateDeselected);
        setSearchState({...searchState, isAllClicked: parentAreOptionsStateDeselected});
    }, [parentAreOptionsStateDeselected, parentSelectedOptions]);

    useEffect(() => {
        if (page > 0 && hasMore && isDataFromAPI && !searchString) {
                setLoading(true);
                getAndSetDataInOptionsFromAPI(page);
            } else if (!isDataFromAPI){
                getAndSetDataInOptionsInNonApiCases(null)
            }
    }, [page]);

    useEffect(() => {
        if (searchState.view) {
            const doesAnyOptionExistInDeselected = searchState.options.some(val => deselectedOptions[val[`${checkerString}`]]);
            setSearchState(prevState => {
                return {
                    ...prevState,
                    isAllClicked: !doesAnyOptionExistInDeselected
                };
            });
        }
        if (Object.keys(deselectedOptions).length > 0) {
            setIsAllClicked(false);
        }
    }, [deselectedOptions, finalDeselectedOptions]);

    useEffect(() => {
        if (searchState.view) {
            const doesAllOptionsExistInOuterSelected = searchState.options.every(val => selectedOptions[val[`${checkerString}`]]);
            setSearchState(prevState => {
                return {
                    ...prevState,
                    isAllClicked: doesAllOptionsExistInOuterSelected
                };
            });
        }
        // else {
        //     if (Object.keys(deselectedOptions).length  === options.length ) {
        //         setIsAllClicked(true);
        //     }
        // }
    },[selectedOptions]);

    useEffect(() => {
        if (areOptionsStateDeselected) {
            const doesAnyOptionsExistInOuterDeselected = searchState.options.some(val => deselectedOptions[val[`${checkerString}`]]);
            setSearchState(prevState => {
                return {
                    ...prevState,
                    isAllClicked: !doesAnyOptionsExistInOuterDeselected
                };
            });
        } else {
            const doesAllOptionsExistInOuterSelected = searchState.options.every(val => selectedOptions[val[`${checkerString}`]]);
            setSearchState(prevState => {
                return {
                    ...prevState,
                    isAllClicked: doesAllOptionsExistInOuterSelected
                };
            });
        }
    },[searchState.options]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            const setSearchAndLoadData = (newPage, newDataCallback) => {
                if (searchString === "") {
                    setPage(newPage);
                    setHasMore(true);
                    setSearchState(prevState => ({
                        ...prevState,
                        view: false,
                        options: []
                    }));
                }
                setLoading(true);
                newDataCallback(searchString);
            };

            if (isDataFromAPI) {
                setSearchAndLoadData(1, debouncedApiCall);
            } else {
                setSearchAndLoadData(null, debouncedNonApiCall);
            }
        }
    }, [searchString]);


    const debouncedApiCall = useRef(
        debounce((q) => getAndSetDataInOptionsFromAPI(1, q), 500)
    ).current;
    const debouncedNonApiCall = useRef(
        debounce((q) => getAndSetDataInOptionsInNonApiCases(q), 500)
    ).current;

    const resetToDefaultState =(values)=>{
        onOutsideClick(values)
        setIsDropdownOpen(false);
        setIsOutsideClicked(true);
        setSearchString("");
        setIsComponentVisible(false);
        scrollTop();

        if (!isPopupView) {
            setSelectedOptions(!parentAreOptionsStateDeselected ? parentSelectedOptions : {});
            setDeselectedOptions(parentAreOptionsStateDeselected ? parentSelectedOptions : {});
            setFinalSelectedOptions(!parentAreOptionsStateDeselected ? parentSelectedOptions : {});
            setFinalDeselectedOptions(parentAreOptionsStateDeselected ? parentSelectedOptions : {});
            setAreOptionsStateDeselected(parentAreOptionsStateDeselected);
            setIsAllClicked(Object.keys(parentSelectedOptions).length === 0);
        }
    } 

    const getAndSetDataInOptionsFromAPI = (page, q) => {
        if (!loading)    {
            setLoading(true);
        }  
        if (q) {
            setSearchState(prevState => {
                return {
                    ...prevState,
                    options:[]
                };
            });
        }
        getDataFromApi(page,q)
            .then((res)=>{
                setLoading(false);
                const data = res.list || [];
                setTotalCount(res.count);
                if (data.length > 0) {
                    if (q) {
                        setSearchState(prevState => {
                            return {
                                ...prevState,
                                options:data
                            };
                        });
                        setOptions([]);
                    } else {
                        setOptions(prevOptions => {
                            const aggregatedOptions = [...prevOptions, ...data];
                            if (aggregatedOptions.length === res.count){
                                setHasMore(false)
                            }
                            return aggregatedOptions;
                        });
                    }
                } else {
                    setSearchState(prevState => {
                        return {
                            ...prevState,
                            options:[]
                        };
                    });
                    setHasMore(false);
                }
            })
            .catch((error) => {
                console.error("Error fetching data from API:", error);
            });
    };

    const getAndSetDataInOptionsInNonApiCases = (q) =>{
        if (!q){
            setOptions(parentOptions);
        } else {
            const searchStr = q.toLowerCase();
            const filteredData=  parentOptions.filter(item => item[primaryLabelKey].toLowerCase().includes(searchStr));
            setSearchState(prevState => {
                return {
                    ...prevState,
                    options:filteredData
                };
            });
            setOptions([]);
        }
        setLoading(false);
    }
    const handleOptionClick = useCallback(
        (business) => {
            const businessID = business[`${checkerString}`];
            if (areOptionsStateDeselected) {
                setDeselectedOptions(prevDeselectedOptions => {
                    if (!prevDeselectedOptions[businessID]) {
                        return {
                            ...prevDeselectedOptions,
                            [businessID] : business
                        };
                    } else {
                        const updatedDeselectedOptions = { ...prevDeselectedOptions };
                        const prevLength = Object.keys(updatedDeselectedOptions).length;
                        delete updatedDeselectedOptions[businessID];
                        const newLength = Object.keys(updatedDeselectedOptions).length;
                        if (!disableDeselectionLogic) {
                            if (prevLength === 1 && newLength === 0 ) {
                                setIsAllClicked(true);
                            }
                        }
                        return updatedDeselectedOptions;
                    }
                });
            } else {
                setSelectedOptions(prevSelectedOptions => {
                    if (!prevSelectedOptions[businessID]) {
                        const updatedSelectedOptions = {
                            ...prevSelectedOptions,
                            [businessID] : business
                        }
                        if (!disableDeselectionLogic) {
                            if (Object.keys(updatedSelectedOptions).length === parentTotalCount) {
                                if (searchState.view){
                                    setSearchState(prevState => {
                                        return {...prevState,isAllClicked : true};
                                    });
                                } else {
                                    setIsAllClicked(true);
                                    setAreOptionsStateDeselected(true)
                                }
                           }
                        }
                        return updatedSelectedOptions;
                    } else {
                        const updatedSelectedOptions = { ...prevSelectedOptions };
                        delete updatedSelectedOptions[businessID];
                        return updatedSelectedOptions;
                    }
                });
            }
        },
        [searchState, selectedOptions, deselectedOptions, areOptionsStateDeselected]
    );
    const handleClearClick = useCallback((triggerOnBlurCb = false) => {
        setSelectedOptions({});
        setDeselectedOptions({});
        setFinalSelectedOptions({});
        if (!disableDeselectionLogic) {
            setAreOptionsStateDeselected(isAllSelectedByDefault);
            setIsAllClicked(isAllSelectedByDefault);
        }
        setSearchState(prevState => {
            return {...prevState, view: false, options: []};
        });
        setSearchString("");
        if (isDataFromAPI){
            setPage(1)
            setOptions([]);
            debouncedApiCall()    
        }  else {
            setPage(0)
        }
        setIsDropdownOpen(false);
        if (triggerOnBlurCb) {
            setIsOutsideClicked(false);
            if(!disableDeselectionLogic) {
                onBlur({} , isAllSelectedByDefault, true, totalCount);
            } else {
                onBlur({} , false, true, totalCount);
            }
        }
    }, []);

    const handleSearchChange = useCallback((event) => {
        const newSearchString = event.target.value;
        setSearchString(newSearchString);
        setSearchState(prevState => {
            return {...prevState, view: true};
        });
        setOptions([])
    }, [searchString]);

    const handlePlaceholderClick = () => {
        setIsDropdownOpen((prevIsDropdownOpen) => !prevIsDropdownOpen);
        setIsOutsideClicked(false);
        setIsComponentVisible(true);
    };

    const handleAllOptionClick = () => {
        if (searchState.view) {
            setSearchState(prevState => {
                const formattedData = prevState.options.reduce((acc,val) => {
                    acc[val[`${checkerString}`]] = val;
                    return acc;
                }, {});
                if (areOptionsStateDeselected) {
                    if (!prevState.isAllClicked) {
                        const newDeselectedOptions = cloneDeep(deselectedOptions);
                        prevState.options.forEach(val => {
                            if (newDeselectedOptions[val[`${checkerString}`]]) {
                                delete newDeselectedOptions[val[`${checkerString}`]];
                            }
                        });
                        setDeselectedOptions(newDeselectedOptions);
                    } else {
                        setDeselectedOptions(prevState => {
                            return {
                                ...prevState,
                                ...formattedData
                            };
                        });
                    }
                } else {
                    if (!prevState.isAllClicked) {
                        setSelectedOptions(prevState => {
                            return {
                                ...prevState,
                                ...formattedData
                            };
                        });
                    } else {
                        const newSelectedOptions = cloneDeep(selectedOptions);
                        prevState.options.forEach(val => {
                            if (newSelectedOptions[val[`${checkerString}`]]) {
                                delete newSelectedOptions[val[`${checkerString}`]];
                            }
                        });
                        setSelectedOptions(newSelectedOptions);
                    }
                }
                return {
                    ...prevState,
                    isAllClicked: !prevState.isAllClicked
                };
            });

        } else {
            setSearchState(prevState => {
                return {
                    ...prevState,
                    isAllClicked: !isAllClicked
                };
            });
            setIsAllClicked((prevState => (!prevState)));
            setAreOptionsStateDeselected(!isAllClicked);
            setSelectedOptions({});
            setDeselectedOptions({});
            setFinalSelectedOptions({});
            setFinalDeselectedOptions({});
        }

    };

    const scrollTop = () =>{
        const scrollElem = document.getElementById(`custom-scroll-msp-${isPopupView}`)
        if (scrollElem) {
            scrollElem.scrollTop = 0; 
        }
    }

    const handleApplyClick = () => {
        const optionsToBePassed = areOptionsStateDeselected ? deselectedOptions : selectedOptions ;
        if (!disableDeselectionLogic && !areOptionsStateDeselected && Object.keys(selectedOptions).length === 0) {
            if (!isAllSelectedByDefault) {
                setAreOptionsStateDeselected(isAllClicked ? true : false);
            } else {
                setAreOptionsStateDeselected(true);
            }
            // setIsAllClicked(true);
            setSearchState(prevState => {
                return {
                    ...prevState,
                    isAllClicked: true
                };
            });
            setFinalSelectedOptions({});
            setFinalDeselectedOptions ({});
        } else {
            setFinalDeselectedOptions (deselectedOptions);
            setFinalSelectedOptions(selectedOptions);
        }
        if (!disableDeselectionLogic) {
            if (!isAllSelectedByDefault) {
                setIsAllClicked(isAllClicked ? true : false);
            } else {
                setIsAllClicked(parentTotalCount === Object.keys (deselectedOptions).length || Object.keys(optionsToBePassed).length === 0)
            }
        }

        if (searchState.view){
            setOptions([]);
        }
        setSearchString("");
        setPage(0);
        setIsDropdownOpen(false);
        // setIsDropdownOpen((prevIsDropdownOpen) => {
        //     return isPopupView ?  !prevIsDropdownOpen :false ;
        // });
        setSearchState(prevState => {
            return {
                ...prevState,
                options: [],
                view:false
            };
        });
        setHasMore(totalCount > options.length);
        setIsOutsideClicked(false);
        scrollTop();
        onBlur(optionsToBePassed, areOptionsStateDeselected,false, totalCount);
    };

    const getOptionElements = (optionArray,checked) => {
        return optionArray.map((option, idx) => {
            const labelText = option[`${primaryLabelKey}`] ? option[`${primaryLabelKey}`] : option[`${secondaryLabelKey}`];
            const subtextContent = optionSubtextKey ? option[optionSubtextKey] : option?.subtextJsx;
            const showToolTip = labelText?.length > 28 ;
            return (<li className="dropdown-option" key={Math.random()+ idx}
                onClick={(e) => {
                    e.stopPropagation();
                    handleOptionClick(option);
                }}>
                <span className="dropdown-select-list">
                    <FormInput
                        type="checkbox"
                        name={"form"}
                        checked={typeof checked === "function" ? checked(option[`${checkerString}`]) : checked}
                    />
                    {showToolTip ? (
                        <Tooltip
                            hideOnScroll
                            text={labelText}
                            display="block"
                            width="100%"
                            position="bottom-left"
                            tooltipClass="fz-15 custom-multiselect-tooltip"
                            customContainerClassName="width-100"
                            
                        >
                           <span className="long-text">
                               <label className="text">{labelText}</label>
                               {subtextContent ? <div className="subtext">{subtextContent}</div> : null}
                           </span>
                        </Tooltip>
                    ) : (
                        <span className="long-text">
                            <label className="text">{labelText}</label>
                            {subtextContent ? <div className="subtext">{subtextContent}</div> : null}
                        </span>
                    )}
                </span>
            </li>
            );
        });
    };
    const memoizedDropdownOptions = useMemo(() => {
        let renderOptionElements = [];
        if (searchState.view) {
            renderOptionElements =  getOptionElements(searchState.options, (businessID) => {
                if (areOptionsStateDeselected) {
                    return !deselectedOptions[businessID] ;
                } else {
                    return selectedOptions[businessID] ;
                }
            });
        } else {
            if (!areOptionsStateDeselected ) {
                const selectedBusinesses = Object.values(finalSelectedOptions);
                const remainingOptions = options.filter(
                    (option) => !finalSelectedOptions[option[`${checkerString}`]]
                );
                const selectedOptionsElements = getOptionElements(selectedBusinesses, (id) => {
                    return Object.keys(selectedOptions).includes(id.toString());
                } );
                const remainingOptionsElements = getOptionElements(remainingOptions, (id) => {
                    return Object.keys(selectedOptions).includes(id.toString());
                });
                renderOptionElements =  [  ...selectedOptionsElements, ...remainingOptionsElements];
            } else {
                const currentOptions = options.filter(
                    (option) => !finalDeselectedOptions[option[`${checkerString}`]]
                );
                const currentList =  getOptionElements(currentOptions, (id) => {
                    return !Object.keys(deselectedOptions).includes(id.toString());
                });
                const deselectedList = getOptionElements(Object.values(finalDeselectedOptions), (id) => {
                    return !Object.keys(deselectedOptions).includes(id.toString());
                });
                // pinDeselectedToTop mirrors the selected-mode pinning so deselected items don't sink to the bottom on reopen.
                renderOptionElements = pinDeselectedToTop
                    ? [...deselectedList, ...currentList]
                    : [...currentList, ...deselectedList];
            }
        }
        return renderOptionElements;
    }, [options, selectedOptions, handleOptionClick, isAllClicked, deselectedOptions, searchState.options, parentAreOptionsStateDeselected]);
    const getContainterLabel = () => {
        let str = "";
        let isSingleLocationSelected = false;
        if (!areOptionsStateDeselected) {
            const selectedLength = isOutsideClicked ? Object.keys(finalSelectedOptions).length : Object.keys(selectedOptions).length;
            isSingleLocationSelected = selectedLength === 1 ;
            if (selectedLength === totalCount && totalCount !==1 ){
                str= "";
            } else {
                str += `${selectedLength > 0 ? (selectedLength === 1 ? 
                    isOutsideClicked ? 
                        (Object.values(finalSelectedOptions)[0][primaryLabelKey] || Object.values(finalSelectedOptions)[0][secondaryLabelKey])  : 
                        (Object.values(selectedOptions)[0][primaryLabelKey] || Object.values(selectedOptions)[0][secondaryLabelKey]) :
                    isOutsideClicked ? Object.keys(finalSelectedOptions).length :  Object.keys(selectedOptions).length) : 
                    ""} `;
            }
          } else {
            let finalCount = totalCount - (isOutsideClicked ? Object.keys(finalDeselectedOptions).length :  Object.keys(deselectedOptions).length);
            if (finalCount === 1 && totalCount !== finalCount ){
                isSingleLocationSelected = true ;
                const deselectedKeys = isOutsideClicked ? Object.keys (finalDeselectedOptions) : Object.keys (deselectedOptions)
                const currentOptions = searchState.view ? searchState.options : options;
                const idx =  currentOptions.findIndex(val => !deselectedKeys.includes(val[checkerString].toString()))
                if (idx > -1) {
                    str += currentOptions[idx][`${primaryLabelKey}`]
                }
            } else {
                str += `${finalCount < totalCount && finalCount > 0 ? finalCount : ""} `;
            }
        }
        let suffixName = isSingleLocationSelected ? "" :  placeHolderText.charAt(0).toUpperCase() + placeHolderText.slice(1);
        suffixName = str.trim() !== "" && !isSingleLocationSelected ? pluralSuffixName : suffixName;

        if (disableDeselectionLogic && !areOptionsStateDeselected) {
            const selectedLength = isOutsideClicked ? Object.keys(finalSelectedOptions).length : Object.keys(selectedOptions).length;
            if (selectedLength === totalCount && totalCount !==1){
                suffixName = `All ${pluralSuffixName}`;
            }
        }

        return {
            isActive : str.trim() !== "" ,
            name: str + suffixName,
            isSingleLocationSelected
        };
    };
    const labelJSX =  (
        getContainterLabel().isSingleLocationSelected ?
            (<Tooltip
                hideOnScroll
                text={getContainterLabel().name}
                display="block"
                position="bottom"
            >
                <label className="filter-label-heading">
                    {getContainterLabel().name}
                </label>
            </Tooltip>)
            :
            (<label className="filter-label-heading">
                {getContainterLabel().name}
            </label>)
    );
    // console.log (parentOptions,"parentOptions");
    // console.log (parentAreOptionsStateDeselected,"parentAreOptionsStateDeselected");
    // console.log (areOptionsStateDeselected,"areOptionsStateDeselected")
    // console.log (selectedOptions,"selectedOptions");
    // console.log (deselectedOptions,"deselectedOptions")
    // console.log (finalSelectedOptions,"finalSelectedOptions");
    // console.log (finalDeselectedOptions,"finalDeselectedOptions");
    // console.log (isAllClicked,"isAllClicked");
    // console.log (options,"Options-->")
    // console.log (searchState,"searchState-->")
    // console.log (loading,"LOADING")
    // console.log (isDropdownOpen,"isDropdownOpen-->")
    // console.log (isComponentVisible,"isComponentVisible-->")
    // console.log (getContainterLabel(),"getContainterLabel")
    return (
        <div ref={ref} className="el-multiselect-filterDropdown">
            <div onClick={savedState || defaultState ? null : handlePlaceholderClick} className={`container-box-1  ${ savedState ? "disable" : getContainterLabel().isActive ? "active_class" : ""} ${showError ? "invalid-error" : ""}`}>
                {labelJSX}
                {getContainterLabel().isActive ?
                    <span onClick={(e) => {
                        e.stopPropagation();
                        handleClearClick(true);
                    }} className="reset-btn">
                        <Tooltip
                            hideOnScroll
                            text="Clear filter"
                            display="block"
                            // width="100%"
                            position="bottom"
                        >
                            {!defaultState &&<i className="icon icon_phoenix-close" />}
                        </Tooltip>
                    </span>
                    :
                    <span className="reset-btn"
                    ><i className="icon icon-cheveron_open" /></span>
                }
            </div>
            <div className={`multi-select-dropdown ${!isPopupView ? "" : "left-open"}`}
                id="multi-select-dropdown"
                style={{ display: isDropdownOpen ? "block" : "none" }}
            >
                <label className="filter-label-heading">
                    {labelJSX}
                </label>
                {showSearch && <div className="form-box">
                    <div className="search-filter">
                        <div className="custom-search-filter">
                            <span className="icons icon_phoenix-new-search-icon el-search-icon" /*styleName="icons" *//>
                            <SearchInput onResetClick={() => setSearchString("")} value={searchString} onChange={handleSearchChange} />
                        </div>
                    </div>
                </div>}

                <ul className="dropdown custom-scroll" ref={loadMoreRef} id={`custom-scroll-msp-${isPopupView}`}>
                    {((searchState.view && !loading && searchState.options.length > 0 ) || (!searchState.view && options.length > 0)) ? <>
                        {memoizedDropdownOptions.length ? <>
                            {!hideSelectAll && <li className="dropdown-option" key="allOption" onClick={(e) => {
                                e.stopPropagation();
                                handleAllOptionClick();
                            }}>
                                <span className="dropdown-select-list">
                                    <FormInput
                                        value={isAllClicked + "all-cb"}
                                        type="checkbox"
                                        name={"form1"}
                                        checked={searchState.view ? searchState.isAllClicked :  isAllClicked}
                                    />
                                    <label className="text">All</label>
                                </span>
                            </li>}
                            {memoizedDropdownOptions}
                        </> : loading ? "": <div className="no-match-found">No matches found</div>}
                    </> : !loading && ((searchState.view && searchState.options.length === 0) || options.length === 0) ? <div
                        className="no-match-found"
                    >No matches found</div> : <div
                        className="loader-shimmer-design"
                    >
                        <LoadingShimmer size="large-height" customClassName="width-100"/>
                    </div>}
                    {loading && <div
                        className="loader-shimmer-design"
                    >
                        <LoadingShimmer size="large-height" customClassName="width-100"/>
                    </div>}
                </ul>
                {!isPopupView && <div
                    className="btn-wrapper"
                >
                    <Button
                        className="ml-5 mr-15 pull-right"
                        onClick={handleApplyClick}
                        // disabled={enableCTAs ? false : enableApply}
                        theme="primary"
                        label="Apply"
                    />

                    {getContainterLabel().isActive &&  <Button theme="link"
                        className="pull-right clear"
                        label="Clear"
                        onClick={()=>handleClearClick(true)}
                    />}
                </div>}
            </div>
            {showError && typeof renderValidationErrors === "function" ? renderValidationErrors() : null}
        </div>
    );
};

MultiSelectPaginatedDropdownComponent.propTypes = {
    isDataFromAPI: PropTypes.bool,
    showSearch: PropTypes.bool,
    placeHolderText: PropTypes.string,
    checkerString:PropTypes.string.isRequired,
    parentSelectedOptions:PropTypes.object,
    onBlur:PropTypes.func.isRequired,
    parentOptions: PropTypes.any,
    parentAreOptionsStateDeselected:PropTypes.bool.isRequired,
    parentTotalCount: PropTypes.number,
    isPopupView: PropTypes.bool,
    primaryLabelKey:PropTypes.string,
    secondaryLabelKey: PropTypes.string,
    optionSubtextKey: PropTypes.string,
    savedState: PropTypes.bool,
    pluralSuffixName: PropTypes.string.isRequired,
    defaultState: PropTypes.bool,
    hideSelectAll: PropTypes.bool,
    disableDeselectionLogic: PropTypes.bool,
    showError: PropTypes.bool,
    renderValidationErrors: PropTypes.func,
    isAllSelectedByDefault: PropTypes.bool,
    pinDeselectedToTop: PropTypes.bool,
};
SearchInput.propTypes = {
    value: PropTypes.string,
    onChange:PropTypes.func.isRequired,
    onResetClick:PropTypes.func.isRequired
};

MultiSelectPaginatedDropdownComponent.defaultProps = {
    isDataFromAPI : true,
    showSearch:true,
    placeHolderText:"Locations",
    isPopupView: false,
    primaryLabelKey:"",
    secondaryLabelKey: "",
    optionSubtextKey: "subtextJsx",
    savedState: false,
    defaultState: false,
    hideSelectAll: false,
    disableDeselectionLogic: false,
    showError: false,
    isAllSelectedByDefault: true,
    pinDeselectedToTop: false,
};

const MultiSelectPaginatedDropdown = MultiSelectPaginatedDropdownComponent

export default MultiSelectPaginatedDropdown;

