import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import useInfiniteScroll from "../../../customHooks/useInfiniteScroll";
import PropTypes from "prop-types";
import { beNodeResource } from "../../../utils/apiHelper";
import { debounce, cloneDeep } from "lodash";
import CSSModules from "react-css-modules";
import styles from "./multiSelectPaginatedDropdown.scss";
// import ReactList from "react-list";
import Button from "components/Phoenix/Button/Button";
import { FormInput } from "components/BirdeyeCore/FormComponents";
import LoadingShimmer from "../LoadingShimmer/LoadingShimmer";
import { FIELD_TYPES } from "constants";
import { getSessionStorage } from "utils";
import Tooltip from "components/Phoenix/Tooltip/Tooltip";
import useClickOutside from "components/Phoenix/CustomHooks/useClickOutside";

const SearchInput = ({ value, onChange, onResetClick }) => {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search"
      />
      {value && (
        <span
          onClick={onResetClick}
          className="icons icon-reset phoenix-icon-multiselect"
        />
      )}
    </div>
  );
};

const MultiSelectPaginatedDropdownComponent = ({
  isDataFromAPI,
  apiEndpoint,
  checkerString,
  showSearch,
  placeHolderText,
  parentAreOptionsStateDeselected,
  onBlur,
  parentSelectedOptions,
  parentTotalCount,
  openFromRight,
  primaryLabelKey,
  secondaryLabelKey,
  savedState,
  module,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(
    !parentAreOptionsStateDeselected ? parentSelectedOptions : {}
  );
  const [deselectedOptions, setDeselectedOptions] = useState(
    parentAreOptionsStateDeselected ? parentSelectedOptions : {}
  );
  const [finalSelectedOptions, setFinalSelectedOptions] = useState(
    !parentAreOptionsStateDeselected ? parentSelectedOptions : {}
  );
  const [finalDeselectedOptions, setFinalDeselectedOptions] = useState(
    parentAreOptionsStateDeselected ? parentSelectedOptions : {}
  );
  const [searchString, setSearchString] = useState("");
  const [options, setOptions] = useState([]);
  const [totalCount, setTotalCount] = useState(
    parentTotalCount ? parentTotalCount : null
  );
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { loadMoreRef, page, setPage } = useInfiniteScroll(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAllClicked, setIsAllClicked] = useState(
    parentAreOptionsStateDeselected
  );
  const [areOptionsStateDeselected, setAreOptionsStateDeselected] = useState(
    parentAreOptionsStateDeselected
  );
  const [searchState, setSearchState] = useState({
    view: false,
    isAllClicked: parentAreOptionsStateDeselected,
    options: [],
  });
  const [isOutsideClicked, setIsOutsideClicked] = useState(false);
  const isInitialMount = useRef(true);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useClickOutside(false);

  useEffect(() => {
    if (!isComponentVisible) {
      if (!openFromRight) {
        handleApplyClick();
      } else {
        const savedSessionStorageFilters = getSessionStorage("filterListArray");
        if (
          savedSessionStorageFilters &&
          Array.isArray(savedSessionStorageFilters) &&
          savedSessionStorageFilters.length > 0
        ) {
          const reqFilter = savedSessionStorageFilters.filter(
            (val) => val.type === FIELD_TYPES.MULTI_SELECT_PAGINATED
          )[0];
          const parentAreOptionsStateDeselectedFromSession =
            reqFilter.isResellerLocationsDeselected;
          const parentSelectedOptionsFromSession = reqFilter.selected;
          setFinalSelectedOptions(
            parentAreOptionsStateDeselectedFromSession
              ? {}
              : parentSelectedOptionsFromSession
          );
          setFinalDeselectedOptions(
            parentAreOptionsStateDeselectedFromSession
              ? parentSelectedOptionsFromSession
              : {}
          );
          setAreOptionsStateDeselected(
            parentAreOptionsStateDeselectedFromSession
          );
          setIsAllClicked(
            Object.keys(parentSelectedOptionsFromSession).length === 0
          );
        }
        setSelectedOptions({});
        setDeselectedOptions({});
        setIsDropdownOpen(false);
        setIsOutsideClicked(true);
        setSearchString("");
        setIsComponentVisible(false);
      }
    }
  }, [isComponentVisible]);

  useEffect(() => {
    setSelectedOptions(
      parentAreOptionsStateDeselected ? {} : parentSelectedOptions
    );
    setFinalSelectedOptions(
      parentAreOptionsStateDeselected ? {} : parentSelectedOptions
    );
    setDeselectedOptions(
      parentAreOptionsStateDeselected ? parentSelectedOptions : {}
    );
    setFinalDeselectedOptions(
      parentAreOptionsStateDeselected ? parentSelectedOptions : {}
    );
    setAreOptionsStateDeselected(parentAreOptionsStateDeselected);
    setIsAllClicked(parentAreOptionsStateDeselected);
    setSearchState({
      ...searchState,
      isAllClicked: parentAreOptionsStateDeselected,
    });
  }, [parentAreOptionsStateDeselected, parentSelectedOptions]);

  useEffect(() => {
    if (page > 0 && hasMore && isDataFromAPI && !searchString) {
      setLoading(true);
      getAndSetDataInOptionsFromAPI(page);
    }
  }, [page]);

  useEffect(() => {
    if (searchState.view) {
      const doesAnyOptionExistInDeselected = searchState.options.some(
        (val) => deselectedOptions[val[`${checkerString}`]]
      );
      setSearchState((prevState) => {
        return {
          ...prevState,
          isAllClicked: !doesAnyOptionExistInDeselected,
        };
      });
    }
    if (Object.keys(deselectedOptions).length > 0) {
      setIsAllClicked(false);
    }
  }, [deselectedOptions, finalDeselectedOptions]);

  useEffect(() => {
    if (searchState.view) {
      const doesAllOptionsExistInOuterSelected = searchState.options.every(
        (val) => selectedOptions[val[`${checkerString}`]]
      );
      setSearchState((prevState) => {
        return {
          ...prevState,
          isAllClicked: doesAllOptionsExistInOuterSelected,
        };
      });
    }
    // else {
    //     if (Object.keys(deselectedOptions).length  === options.length ) {
    //         setIsAllClicked(true);
    //     }
    // }
  }, [selectedOptions, finalSelectedOptions]);

  useEffect(() => {
    if (areOptionsStateDeselected) {
      const doesAnyOptionsExistInOuterDeselected = searchState.options.some(
        (val) => deselectedOptions[val[`${checkerString}`]]
      );
      setSearchState((prevState) => {
        return {
          ...prevState,
          isAllClicked: !doesAnyOptionsExistInOuterDeselected,
        };
      });
    } else {
      const doesAllOptionsExistInOuterSelected = searchState.options.every(
        (val) => selectedOptions[val[`${checkerString}`]]
      );
      setSearchState((prevState) => {
        return {
          ...prevState,
          isAllClicked: doesAllOptionsExistInOuterSelected,
        };
      });
    }
  }, [searchState.options]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (isDataFromAPI) {
      if (searchString === "") {
        setPage(1);
        setHasMore(true);
        setSearchState((prevState) => ({
          ...prevState,
          view: false,
          options: [],
        }));
      }
      setLoading(true);
      searchString.length >= 3 && debouncedApiCall(searchString);
    }
  }, [searchString]);

  const debouncedApiCall = useRef(
    debounce((q) => getAndSetDataInOptionsFromAPI(null, q), 500)
  ).current;
  const getAndSetDataInOptionsFromAPI = (page, q) => {
    if (!loading) setLoading(true);
    let queryString = `page=${page || 1}${module ? `&module=${module}` : ""}`;
    if (q) {
      setSearchState((prevState) => {
        return {
          ...prevState,
          options: [],
        };
      });
      queryString += `&q=${q}`;
    }
    beNodeResource
      .get(apiEndpoint + queryString, {}, {})
      .then((res) => {
        setLoading(false);
        const data = res.data.list;
        setTotalCount(res.data.count);
        if (data.length > 0) {
          if (q) {
            setSearchState((prevState) => {
              return {
                ...prevState,
                options: data,
              };
            });
            setOptions([]);
          } else {
            setOptions((prevOptions) => [...prevOptions, ...data]);
          }
        } else {
          setSearchState((prevState) => {
            return {
              ...prevState,
              options: [],
            };
          });
          // setOptions([]);
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  };

  const handleOptionClick = useCallback(
    (business) => {
      const businessID = business[`${checkerString}`];
      if (areOptionsStateDeselected) {
        setDeselectedOptions((prevDeselectedOptions) => {
          if (!prevDeselectedOptions[businessID]) {
            return {
              ...prevDeselectedOptions,
              [businessID]: business,
            };
          } else {
            const updatedDeselectedOptions = { ...prevDeselectedOptions };
            const prevLength = Object.keys(updatedDeselectedOptions).length;
            delete updatedDeselectedOptions[businessID];
            const newLength = Object.keys(updatedDeselectedOptions).length;
            if (prevLength === 1 && newLength === 0) {
              setIsAllClicked(true);
            }
            return updatedDeselectedOptions;
          }
        });
      } else {
        setSelectedOptions((prevSelectedOptions) => {
          if (!prevSelectedOptions[businessID]) {
            return {
              ...prevSelectedOptions,
              [businessID]: business,
            };
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
    setAreOptionsStateDeselected(true);
    setIsAllClicked(true);
    setSearchState((prevState) => {
      return { ...prevState, view: false, options: [] };
    });
    setSearchString("");
    setOptions([]);
    setPage(0);
    if (triggerOnBlurCb) {
      setIsOutsideClicked(false);
      onBlur({}, true, true, totalCount);
    }
  }, []);

  const handleSearchChange = useCallback(
    (event) => {
      const newSearchString = event.target.value;
      setSearchString(newSearchString);
      setSearchState((prevState) => {
        return { ...prevState, view: true };
      });
    },
    [searchString]
  );

  const handlePlaceholderClick = () => {
    setIsDropdownOpen((prevIsDropdownOpen) => !prevIsDropdownOpen);
    setIsOutsideClicked(false);
    setIsComponentVisible(true);
  };

  const handleAllOptionClick = () => {
    if (searchState.view) {
      setSearchState((prevState) => {
        const formattedData = prevState.options.reduce((acc, val) => {
          acc[val[`${checkerString}`]] = val;
          return acc;
        }, {});
        if (areOptionsStateDeselected) {
          if (!prevState.isAllClicked) {
            const newDeselectedOptions = cloneDeep(deselectedOptions);
            prevState.options.forEach((val) => {
              if (newDeselectedOptions[val[`${checkerString}`]]) {
                delete newDeselectedOptions[val[`${checkerString}`]];
              }
            });
            setDeselectedOptions(newDeselectedOptions);
          } else {
            setDeselectedOptions((prevState) => {
              return {
                ...prevState,
                ...formattedData,
              };
            });
          }
        } else {
          if (!prevState.isAllClicked) {
            setSelectedOptions((prevState) => {
              return {
                ...prevState,
                ...formattedData,
              };
            });
          } else {
            const newSelectedOptions = cloneDeep(selectedOptions);
            prevState.options.forEach((val) => {
              if (newSelectedOptions[val[`${checkerString}`]]) {
                delete newSelectedOptions[val[`${checkerString}`]];
              }
            });
            setSelectedOptions(newSelectedOptions);
          }
        }
        return {
          ...prevState,
          isAllClicked: !prevState.isAllClicked,
        };
      });
    } else {
      setSearchState((prevState) => {
        return {
          ...prevState,
          isAllClicked: !isAllClicked,
        };
      });
      setIsAllClicked((prevState) => !prevState);
      setAreOptionsStateDeselected(!isAllClicked);
      setSelectedOptions({});
      setDeselectedOptions({});
      setFinalSelectedOptions({});
      setFinalDeselectedOptions({});
    }
  };

  const handleApplyClick = () => {
    if (
      !areOptionsStateDeselected &&
      Object.keys(selectedOptions).length === 0
    ) {
      setAreOptionsStateDeselected(true);
      // setIsAllClicked(true);
      setSearchState((prevState) => {
        return {
          ...prevState,
          isAllClicked: true,
        };
      });
      setFinalSelectedOptions({});
      setFinalDeselectedOptions({});
    } else {
      setFinalSelectedOptions(selectedOptions);
      setFinalDeselectedOptions(deselectedOptions);
    }
    setOptions([]);
    setSearchString("");
    setPage(0);
    setIsDropdownOpen((prevIsDropdownOpen) => {
      return !openFromRight ? false : !prevIsDropdownOpen;
    });
    setSearchState((prevState) => {
      return {
        ...prevState,
        options: [],
        view: false,
      };
    });
    setHasMore(true);
    setIsOutsideClicked(false);
    onBlur(
      areOptionsStateDeselected ? deselectedOptions : selectedOptions,
      areOptionsStateDeselected,
      false,
      totalCount
    );
  };

  const getOptionElements = (optionArray, checked) => {
    return optionArray.map((option, idx) => {
      const labelText = option[`${primaryLabelKey}`]
        ? option[`${primaryLabelKey}`]
        : option[`${secondaryLabelKey}`];
      const showToolTip = labelText?.length > 28;
      return (
        <li
          className="dropdown-option"
          key={option[`${secondaryLabelKey}`] + idx}
          onClick={(e) => {
            e.stopPropagation();
            handleOptionClick(option);
          }}
        >
          <span className="dropdown-select-list">
            <FormInput
              type="checkbox"
              name={"form"}
              checked={
                typeof checked === "function"
                  ? checked(option[`${checkerString}`])
                  : checked
              }
            />
            {showToolTip ? (
              <Tooltip
                hideOnScroll
                text={labelText}
                display="block"
                width="100%"
                position="bottom-left"
                tooltipClass="fz-15 custom-multiselect-tooltip"
              >
                <label className="text">{labelText}</label>
              </Tooltip>
            ) : (
              <label className="text">{labelText}</label>
            )}
          </span>
        </li>
      );
    });
  };
  const memoizedDropdownOptions = useMemo(() => {
    let renderOptionElements = [];
    if (searchState.view) {
      renderOptionElements = getOptionElements(
        searchState.options,
        (businessID) => {
          if (areOptionsStateDeselected) {
            return !deselectedOptions[businessID];
          } else {
            return selectedOptions[businessID];
          }
        }
      );
    } else {
      if (!areOptionsStateDeselected) {
        const selectedBusinesses = Object.values(finalSelectedOptions);
        const remainingOptions = options.filter(
          (option) => !finalSelectedOptions[option[`${checkerString}`]]
        );
        const selectedOptionsElements = getOptionElements(
          selectedBusinesses,
          true
        );
        const remainingOptionsElements = getOptionElements(
          remainingOptions,
          (businessID) => {
            return Object.keys(selectedOptions).includes(businessID.toString());
          }
        );
        renderOptionElements = [
          ...selectedOptionsElements,
          ...remainingOptionsElements,
        ];
      } else {
        const currentOptions = options.filter(
          (option) => !finalDeselectedOptions[option[`${checkerString}`]]
        );
        const currentList = getOptionElements(currentOptions, (businessID) => {
          return !Object.keys(deselectedOptions).includes(
            businessID.toString()
          );
        });
        const deselectedList = getOptionElements(
          Object.values(finalDeselectedOptions),
          false
        );
        renderOptionElements = [...currentList, ...deselectedList];
      }
    }
    return renderOptionElements;

    // return (<ReactList
    //     itemRenderer={(index) => renderOptionElements[index]}
    //     length={renderOptionElements.length}
    //     type="uniform"
    //     threshold={500}
    // />);
  }, [
    options,
    selectedOptions,
    handleOptionClick,
    isAllClicked,
    deselectedOptions,
    searchState.options,
    parentAreOptionsStateDeselected,
  ]);
  const getContainterLabel = () => {
    let str = "";
    let isSingleLocationSelected = false;
    if (!areOptionsStateDeselected) {
      const selectedLength = isOutsideClicked
        ? Object.keys(finalSelectedOptions).length
        : Object.keys(selectedOptions).length;
      isSingleLocationSelected = selectedLength === 1;
      str += `${
        selectedLength > 0
          ? selectedLength === 1
            ? isOutsideClicked
              ? Object.values(finalSelectedOptions)[0][primaryLabelKey]
              : Object.values(selectedOptions)[0][primaryLabelKey]
            : isOutsideClicked
            ? Object.keys(finalSelectedOptions).length
            : Object.keys(selectedOptions).length
          : ""
      } `;
    } else {
      let finalCount =
        totalCount -
        (isOutsideClicked
          ? Object.keys(finalDeselectedOptions).length
          : Object.keys(deselectedOptions).length);
      str += `${finalCount < totalCount && finalCount > 0 ? finalCount : ""} `;
    }
    let suffixName = isSingleLocationSelected
      ? ""
      : placeHolderText.charAt(0).toUpperCase() + placeHolderText.slice(1);
    suffixName += str.trim() !== "" && !isSingleLocationSelected ? "es" : "";
    return {
      isActive: str.trim() !== "",
      name: str + suffixName,
      isSingleLocationSelected,
    };
  };
  const labelJSX = getContainterLabel().isSingleLocationSelected ? (
    <Tooltip
      hideOnScroll
      text={getContainterLabel().name}
      display="block"
      position="bottom"
    >
      <label className={styles["filter-label-heading"]}>
        {getContainterLabel().name}
      </label>
    </Tooltip>
  ) : (
    <label className={styles["filter-label-heading"]}>{getContainterLabel().name}</label>
  );
  return (
    <div ref={ref} className={styles["multiselect-filterDropdown"]}>
      <div
        onClick={savedState ? null : handlePlaceholderClick}
        className={`container-box-1  ${
          savedState
            ? "disable"
            : getContainterLabel().isActive
            ? "active_class"
            : ""
        }`}
      >
        {labelJSX}
        {getContainterLabel().isActive ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleClearClick(true);
            }}
            className={styles["reset-btn"]}
          >
            <Tooltip
              hideOnScroll
              text="Clear filter"
              display="block"
              // width="100%"
              position="bottom"
            >
              <i className="icon icon_phoenix-close" />
            </Tooltip>
          </span>
        ) : (
          <span className={styles["reset-btn"]}>
            <i className="icon icon-cheveron_open" />
          </span>
        )}
      </div>
      <div
        className={`${styles['multi-select-dropdown']} ${openFromRight ? "" : styles["left-open"]}`}
        id="multi-select-dropdown"
        style={{ display: isDropdownOpen ? "block" : "none" }}
      >
        <label className={styles["filter-label-heading"]}>{labelJSX}</label>
        <div className={styles["form-box"]}>
          <div className={styles["search-filter"]}>
            {showSearch && (
              <div>
                <span
                  className="icons icon_phoenix-new-search"
                />
                <SearchInput
                  onResetClick={() => setSearchString("")}
                  value={searchString}
                  onChange={handleSearchChange}
                />
              </div>
            )}
          </div>
        </div>

        <ul className="dropdown custom-scroll">
          {(searchState.view && !loading && searchState.options.length > 0) ||
          !searchState.view ? (
            <>
              {memoizedDropdownOptions.length ? (
                <>
                  <li
                    className="dropdown-option"
                    key="allOption"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAllOptionClick();
                    }}
                  >
                    <span className="dropdown-select-list">
                      <FormInput
                        value={isAllClicked + "all-cb"}
                        type="checkbox"
                        name={"form1"}
                        checked={
                          searchState.view
                            ? searchState.isAllClicked
                            : isAllClicked
                        }
                      />
                      <label className="text">All</label>
                    </span>
                  </li>
                  {memoizedDropdownOptions}
                </>
              ) : (
                <div className={styles["no-match-found"]}>No matches found</div>
              )}
            </>
          ) : !loading &&
            searchState.view &&
            searchState.options.length === 0 ? (
            <div className={styles["no-match-found"]}>No matches found</div>
          ) : (
            <div className={styles["loader-shimmer-design"]}>
              <LoadingShimmer size="large-height" />
            </div>
          )}
          <div ref={loadMoreRef}>
            {loading && (
              <div className={styles["loader-shimmer-design"]}>
                <LoadingShimmer size="large-height" />
              </div>
            )}
          </div>
        </ul>
        {openFromRight && (
          <div className={styles["btn-wrapper"]}>
            <Button
              className="ml-5 mr-15 pull-right"
              onClick={handleApplyClick}
              // disabled={enableCTAs ? false : enableApply}
              theme="primary"
              label="Apply"
            />

            {(Object.keys(selectedOptions).length > 0 ||
              Object.keys(deselectedOptions).length > 0) && (
              <Button
                theme="link"
                className="pull-right clear"
                label="Clear"
                onClick={handleClearClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

MultiSelectPaginatedDropdownComponent.propTypes = {
  isDataFromAPI: PropTypes.bool,
  apiEndpoint: PropTypes.string,
  showSearch: PropTypes.bool,
  placeHolderText: PropTypes.string,
  checkerString: PropTypes.string.isRequired,
  parentSelectedOptions: PropTypes.object,
  onBlur: PropTypes.func.isRequired,
  parentAreOptionsStateDeselected: PropTypes.bool.isRequired,
  parentTotalCount: PropTypes.number,
  openFromRight: PropTypes.bool,
  primaryLabelKey: PropTypes.string,
  secondaryLabelKey: PropTypes.string,
  savedState: PropTypes.bool,
  module: PropTypes.string,
};

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onResetClick: PropTypes.func.isRequired,
};

MultiSelectPaginatedDropdownComponent.defaultProps = {
  isDataFromAPI: true,
  apiEndpoint: "",
  showSearch: true,
  placeHolderText: "Locations",
  openFromRight: true,
  primaryLabelKey: "",
  secondaryLabelKey: "",
  savedState: false,
};

const MultiSelectPaginatedDropdown = CSSModules(
  MultiSelectPaginatedDropdownComponent,
  styles,
  { allowMultiple: true }
);

export default MultiSelectPaginatedDropdown;
