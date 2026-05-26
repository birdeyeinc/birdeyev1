import React, { Component } from "react";
import PropTypes from "prop-types";
import onClickOutside from "react-onclickoutside";
import Styles from "./index.module.scss";
import {
  prepareOptionsToRender,
  getPlaceHolderText,
  getBoxSize,
  getMaintainedOrderInSelection,
} from "./helper.js";
import {
  getDropdown,
  getDisabledView,
  getFilterView,
  getFilterDefaultView,
} from "./JSXhelper.jsx";
import {
  isEqual,
  toLower,
  lowerCase,
  trim,
  each,
  cloneDeep,
  remove,
} from "lodash";
import ScrollIntoView from "atoms/ScrollIntoView";
import { getEncodedStyleClass } from "utils/index";

let searchNodeRef = null;
class Multiselect extends Component {
  static displayName = "MultiSelect";

  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      searchValue: "",
      updatedOptions: [],
      visibleOptionsCount: 0,
      selectedOptions: [],
      placeholder: "",
      totalOptionsCount: 0,
      validationClasses: " valid",
      isSelectAllWasClicked: false,
      excludeBizIds: [],
      excludeBizOptions: []
    };
    this.isDropdownDisplayed = false;
    this.selectNode = null;
    this.dropdownNodeRef = null;
  }

  componentWillMount() {
    this.props._attachToFormWrapper && this.props._attachToFormWrapper(this);
    const filterOptions = prepareOptionsToRender(this.props);
    this.setState((prevState) => {
      return {
        ...prevState,
        updatedOptions: filterOptions.options,
        visibleOptionsCount: filterOptions.visibleOptionsCount,
        selectedOptions: filterOptions.selectedOptions,
        areOptionsGrouped: filterOptions.areOptionsGrouped,
        placeholder: filterOptions.placeholder,
        totalOptionsCount: filterOptions.totalOptionsCount,
      };
    });
  }

  componentDidMount() {
    const _self = this;
    _self.props.fixedDropdown &&
      document
        .getElementById(_self.props.parentId)
        .addEventListener("scroll", () => {
          const { showDropdown } = _self.state;
          const { parentNode, fixedDropdown, name } = _self.props;
          if (showDropdown && fixedDropdown) {
            let parentNodeRect = parentNode.getBoundingClientRect();
            let selectNodeRect = _self.selectNode.getBoundingClientRect();
            if (parentNodeRect.bottom < selectNodeRect.bottom) {
              _self.toggleDropdown();
            } else {
              _self.isDropdownDisplayed = false;
              _self.dropdownNodeRef.style.position = "fixed";
              _self.dropdownNodeRef.style.top =
                selectNodeRect.top + selectNodeRect.height + "px";
              _self.dropdownNodeRef.style.width =
                name === "surveyFields" ? "auto" : `${selectNodeRect.width}px`; //selectNodeRect.width + (name === "surveyFields" ? 100 : 0) + "px";
            }
          }
        });
  }

  componentWillUnmount() {
    this.props._detachFromFormWrapper &&
      this.props._detachFromFormWrapper(this);
    const parentElm = document.getElementById(this.props.parentId);
    this.props.fixedDropdown &&
      parentElm &&
      parentElm.removeEventListener("scroll", () => {
        console.log("event unlistened");
      });
  }

  componentDidUpdate() {
    const { showDropdown } = this.state;
    const { appendElementToScroll } = this.props;
    const isIpad = navigator.userAgent.match(/iPad/i);

    if (showDropdown && searchNodeRef && !isIpad) {
      searchNodeRef.children[0].children[0].focus();
    }
    if (showDropdown && this.isDropdownDisplayed && this.props.fixedDropdown) {
      this.isDropdownDisplayed = false;
      let selectNodeRect = this.selectNode.getBoundingClientRect();
      const { name } = this.props;
      this.dropdownNodeRef.style.position = "fixed";
      this.dropdownNodeRef.style.top =
        selectNodeRect.top + selectNodeRect.height + "px";
      this.dropdownNodeRef.style.width =
        name === "surveyFields" ? "auto" : `${selectNodeRect.width}px`; //selectNodeRect.width + (name === "surveyFields" ? 100 : 0) + "px";
      let topPos = +this.dropdownNodeRef.style.top.substring(
        0,
        this.dropdownNodeRef.style.top.indexOf("px")
      );
      if (window.innerHeight < topPos + 300) {
        appendElementToScroll(220);
        if (isIpad) {
          this.dropdownNodeRef.scrollIntoView();
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const filterOptions = prepareOptionsToRender(nextProps);
    const { showDropdown } = this.state;
    const { parentNode, fixedDropdown, name } = this.props;

    if (showDropdown && fixedDropdown) {
      let parentNodeRect = parentNode.getBoundingClientRect();
      let selectNodeRect = this.selectNode.getBoundingClientRect();
      if (parentNodeRect.bottom < selectNodeRect.bottom) {
        this.toggleDropdown();
      } else {
        this.isDropdownDisplayed = false;
        this.dropdownNodeRef.style.position = "fixed";
        this.dropdownNodeRef.style.top =
          selectNodeRect.top + selectNodeRect.height + "px";
        this.dropdownNodeRef.style.width =
          name === "surveyFields" ? "auto" : `${selectNodeRect.width}px`; //selectNodeRect.width + (name === "surveyFields" ? 100 : 0) + "px";
      }
    } else {
      this.setState((prevState) => {
        return {
          ...prevState,
          updatedOptions: filterOptions.options,
          visibleOptionsCount: filterOptions.visibleOptionsCount,
          selectedOptions: filterOptions.selectedOptions,
          areOptionsGrouped: filterOptions.areOptionsGrouped,
          placeholder: filterOptions.placeholder,
          totalOptionsCount: filterOptions.totalOptionsCount,
        };
      });
    }
  }
  toggleDropdown = (addButtonClass) => {
    const { showDropdown, selectedOptions, updatedOptions, excludeBizIds, excludeBizOptions } = this.state;

    const {
      ctaButtonsEnabled,
      selected,
      emptyPlaceholder,
      fixedDropdown,
      appendElementToScroll,
      andSeperator,
      orSeperator,
      openCallback,
      closeCallback,
      selectedAliasPlaceholder,
      noDefaultSelection,
      showConcisePlaceholder,
      labelWithIcon,
      multipleSearch,
      searchStr,
      triggerBlurOnAllDiselect = false,
    } = this.props;

    if (
      !selectedOptions.length &&
      !selected.length &&
      triggerBlurOnAllDiselect
    ) {
      let selectedOptionsValue = updatedOptions.map((option) => option.value);
      this.props.onBlur?.(selectedOptions, selectedOptionsValue, excludeBizIds, excludeBizOptions);
    }
    if (!showDropdown && ctaButtonsEnabled) {
      this.resetToInitialState();
    } else if (
      showDropdown &&
      !ctaButtonsEnabled &&
      !isEqual(selected, selectedOptions)
    ) {
      const {
        updatedOptions,
        selectedOptions,
        totalOptionsCount,
        areOptionsGrouped,
      } = this.state;
      if (
        !selectedOptions.length &&
        trim(lowerCase(emptyPlaceholder)) != "none" &&
        !noDefaultSelection
      ) {
        this.resetToDefault({ target: {} });
      } else {
        const {
          customPlaceHolderSelectionText,
          label,
          hidePlaceholder,
          removeLabelTextTransform,
          name,
        } = this.props;
        const placeholder =
          !selectedOptions.length &&
            trim(lowerCase(emptyPlaceholder)) === "none" &&
            !noDefaultSelection
            ? emptyPlaceholder
            : getPlaceHolderText({
              selectedCount: selectedOptions.length,
              totalOptionsCount,
              options: updatedOptions,
              areOptionsGrouped,
              customPlaceHolderSelectionText,
              label,
              andSeperator,
              orSeperator,
              selectedAliasPlaceholder,
              hidePlaceholder,
              showConcisePlaceholder,
              labelWithIcon,
              removeLabelTextTransform,
              name,
            });
        this.setState({ placeholder });
        let selectedOptionsValue = selectedOptions.map(
          (option) => option.value
        );
        this.props.onBlur?.(selectedOptions, selectedOptionsValue, excludeBizIds, excludeBizOptions);
        if (addButtonClass && document.getElementsByClassName(addButtonClass)) {
          document.getElementsByClassName(addButtonClass)[0] &&
            document.getElementsByClassName(addButtonClass)[0].click();
        }
      }
    } else if (showDropdown && ctaButtonsEnabled) {
      this.resetToInitialState();
    }

    if (!showDropdown && fixedDropdown) {
      // parentNode.scrollTop -= 2; // BIRDEYE-63617 - Mukul
      this.isDropdownDisplayed = true;
    }
    if (showDropdown && fixedDropdown) {
      appendElementToScroll(0);
    }
    if (multipleSearch) {
      this.setState(
        {
          showDropdown: !showDropdown,
          searchValue: searchStr,
        },
        () => {
          if (
            this.state.showDropdown &&
            this.scrollableDropdownRef &&
            openCallback
          ) {
            //Went for timeout to wait for seeing scroll within the container
            setTimeout(
              openCallback.bind(null, this.scrollableDropdownRef),
              100
            );
          } else if (!this.state.showDropdown && closeCallback) {
            closeCallback();
          }
        }
      );
    } else {
      this.setState(
        {
          showDropdown: !showDropdown,
          searchValue: "",
        },
        () => {
          if (
            this.state.showDropdown &&
            this.scrollableDropdownRef &&
            openCallback
          ) {
            //Went for timeout to wait for seeing scroll within the container
            setTimeout(
              openCallback.bind(null, this.scrollableDropdownRef),
              100
            );
          } else if (!this.state.showDropdown && closeCallback) {
            closeCallback();
          }
        }
      );
    }

    window.forceSet = null;
  };

  resetToInitialState = () => {
    const filterOptions = prepareOptionsToRender(this.props);
    this.setState({
      updatedOptions: filterOptions.options,
      visibleOptionsCount: filterOptions.visibleOptionsCount,
      selectedOptions: filterOptions.selectedOptions,
      areOptionsGrouped: filterOptions.areOptionsGrouped,
      placeholder: filterOptions.placeholder,
      totalOptionsCount: filterOptions.totalOptionsCount,
    });
  };

  handleClickOutside = (event) => {
    const { hide } = this;
    const { delayClickOutside, supportCustomAddEventHandler } = this.props;
    let addButtonClass = "";
    const clsName = event && event.target && event.target.className;
    /** BIRDEYE-82255 , when scroll into view and multi select is open in Rule.js, add button is not clicked*/
    if (
      clsName &&
      typeof clsName.indexof === "function" &&
      clsName.indexOf("addRuleButton") !== -1 &&
      supportCustomAddEventHandler &&
      this.state.showDropdown
    ) {
      addButtonClass = clsName;
    }
    /** END BIRDEYE-82255 */

    //delaying hiding to accomodate for not changing the scroll when other filter is clicked
    delayClickOutside
      ? setTimeout(
        hide.bind(null, addButtonClass),
        delayClickOutside.delay !== null ? delayClickOutside.delay : 100
      )
      : hide(addButtonClass);
  };

  hide = (addButtonClass) => {
    if (this.state.showDropdown) {
      this.toggleDropdown(addButtonClass);
      this.filterOptions("");
    }
  };

  filterOptions = (searchValue) => {
    const { updatedOptions, areOptionsGrouped } = this.state;
    const { hideGroupCheckbox, levelSearch } = this.props;
    let visibleOptionsCount = 0;
    const isBusinessLocationFilter =
      this.props?.name === "selBusiness" || false;
    if (areOptionsGrouped) {
      Object.keys(updatedOptions).forEach((optGroup) => {
        let visibleOption = false;
        updatedOptions[optGroup].options.forEach((option) => {
          if (
            toLower(option.label).indexOf(toLower(searchValue)) == -1 &&
            toLower(option.value).indexOf(toLower(searchValue)) == -1
          ) {
            option.hide = true;
          } else {
            option.hide = false;
            visibleOption = true;
            ++visibleOptionsCount;
          }
        });
        if (!hideGroupCheckbox)
          updatedOptions[optGroup].showGroupCheckbox = visibleOption;
      });
    } else {
      updatedOptions.forEach((option) => {
        const optionValue =
          isBusinessLocationFilter && option.businessKey
            ? option.businessKey
            : option.value;
        if (
          toLower(option.label).indexOf(toLower(searchValue)) == -1 &&
          toLower(optionValue).indexOf(toLower(searchValue)) == -1
        ) {
          option.hide = true;
        } else {
          option.hide = false;
          ++visibleOptionsCount;
        }
      });
    }
    if (levelSearch) {
      remove(updatedOptions, function (currentObject) {
        return currentObject.isLevel;
      });
      let temp = updatedOptions.reduce((acc, curr) => {
        const { category } = curr;
        if (category in acc) {
          acc[category].push(curr);
        } else {
          category ? (acc[category] = [curr]) : null;
        }
        return acc;
      }, {});
      let templates = [];
      Object.keys(temp).forEach((k) => {
        const isVisible = temp[k].some(function (option) {
          return !option.hide;
        });
        isVisible ? temp[k].unshift({ label: k, isLevel: true }) : null;
        templates = [...templates, ...temp[k]];
      });
      this.setState({
        updatedOptions: templates,
        searchValue,
        visibleOptionsCount,
      });
    } else {
      this.setState({
        updatedOptions,
        searchValue,
        visibleOptionsCount,
      });
    }
  };

  onClickOptions = (event, option) => {
    const { updatedOptions, selectedOptions, areOptionsGrouped,
      isSelectAllWasClicked, excludeBizIds, excludeBizOptions
     } = this.state;
    const {
      validationTrigger,
      _fieldValidator,
      andSeperator,
      orSeperator,
      selectedAliasPlaceholder,
      hidePlaceholder,
      showConcisePlaceholder,
      placeholderWithSelectionLimit,
      selectionLimit,
      onOptionClickCb,
      isReverseSelectedAllowed = false
    } = this.props;
    const isChecked = event.target.checked;
    onOptionClickCb && onOptionClickCb(isChecked, option);
    if (areOptionsGrouped) {
      let selectedOptionsLength = 0;
      updatedOptions[option.optGroup].options.forEach((opt) => {
        if (opt.value === option.value) {
          opt.checked = isChecked;
        }
        selectedOptionsLength = opt.checked
          ? ++selectedOptionsLength
          : selectedOptionsLength;
      });
      updatedOptions[option.optGroup].allSelected =
        selectedOptionsLength ===
        updatedOptions[option.optGroup].options.length;
    } else {
      updatedOptions.forEach((updatedOption) => {
        if (updatedOption.value === option.value) {
          updatedOption.checked = isChecked;
        }
      });
    }

    if (isChecked) {
      selectedOptions.push(option);

      // check user has selected all options by manually click
      if (isReverseSelectedAllowed) {
        const selectableOption = updatedOptions.filter((opt) => !opt?.hide && !opt?.isDisabled);
        const isAllSelectedManually = selectedOptions.length === selectableOption.length;
        if (isAllSelectedManually) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    excludeBizIds: [],
                    excludeBizOptions: []
                };
            });
        }
      }
    } else {
      selectedOptions.forEach((opt, i) => {
        if (opt.value === option.value) {
          selectedOptions.splice(i, 1);
        }
      });

      // uncheck will go to oldExcludeBizIds if allSelected was clicked before
      if (isReverseSelectedAllowed && isSelectAllWasClicked) {
        const oldExcludeBizIds = [...excludeBizIds];
        const oldExcludeBizOptions = [excludeBizOptions];
        oldExcludeBizIds.push(option.value);
        oldExcludeBizOptions.push(option);

        this.setState((prevState) => {
            return {
                ...prevState,
                excludeBizIds: oldExcludeBizIds,
                excludeBizOptions: oldExcludeBizOptions
            };
        });
      }
    }
    const {
      customPlaceHolderSelectionText,
      label,
      emptyPlaceholder,
      noDefaultSelection,
      options,
      labelWithIcon,
      removeLabelTextTransform,
      name,
    } = this.props;
    let orderedSelectedOptions = [];
    /** maintain the same order of selection as in original options */
    if (!areOptionsGrouped) {
      orderedSelectedOptions = getMaintainedOrderInSelection(
        cloneDeep(selectedOptions),
        options
      );
    } else {
      orderedSelectedOptions = selectedOptions;
    }
    const placeholder =
      !selectedOptions.length &&
        trim(lowerCase(emptyPlaceholder)) === "none" &&
        !noDefaultSelection
        ? emptyPlaceholder
        : getPlaceHolderText({
          selectedCount: selectedOptions.length,
          totalOptionsCount: updatedOptions.length,
          options: updatedOptions,
          areOptionsGrouped,
          customPlaceHolderSelectionText,
          label,
          andSeperator,
          orSeperator,
          selectedAliasPlaceholder,
          hidePlaceholder,
          showConcisePlaceholder,
          labelWithIcon,
          removeLabelTextTransform,
          name,
          placeholderWithSelectionLimit,
          selectionLimit,
        });

    this.setState(
      (prevState) => {
        return {
          ...prevState,
          updatedOptions,
          selectedOptions: orderedSelectedOptions,
          placeholder,
        };
      },
      () => {
        if (validationTrigger === "onChange" && _fieldValidator) {
          _fieldValidator(this);
        }

        //window.forceSet = true;
      }
    );
  };

  selectAllClicked = (event, callback) => {
    let { updatedOptions, selectedOptions, areOptionsGrouped } = this.state;
    const isSelectAllChecked = event.target.checked;
    const {
      andSeperator,
      orSeperator,
      selectedAliasPlaceholder,
      _fieldValidator,
      validationTrigger,
      hidePlaceholder,
      resetValue,
      labelExactMatch,
    } = this.props;

    if (areOptionsGrouped) {
      Object.keys(updatedOptions).forEach((optGroup) => {
        updatedOptions[optGroup].allSelected = isSelectAllChecked;
        updatedOptions[optGroup].options.forEach((option) => {
          if (!option.hide) {
            option.checked = isSelectAllChecked;
            if (
              isSelectAllChecked &&
              !selectedOptions.filter(
                (selectedOption) => selectedOption.value == option.value
              ).length
            ) {
              selectedOptions.push(option);
            } else if (!isSelectAllChecked) {
              for (let i = 0; i < selectedOptions.length; i++) {
                let selectedOption = selectedOptions[i];
                if (selectedOption.value == option.value) {
                  selectedOptions.splice(i, 1);
                  i--;
                }
              }
            }
          }
        });
      });
    } else if (resetValue) {
      const selectedLocation = resetValue || [];
      selectedOptions = updatedOptions
        .filter((option) => selectedLocation.includes(option.value))
        .map((option) => {
          return {
            label: option.label,
            value: option.value,
          };
        });
      updatedOptions = updatedOptions.map((option) => ({
        ...option,
        checked: selectedOptions.some((selObj) => selObj.value == option.value),
      }));
    } else {
      updatedOptions.forEach((option) => {
        if (!option.hide && !option?.isDisabled) {
          option.checked = isSelectAllChecked && !option?.unCheckOnSelectAll;
          if (
            isSelectAllChecked &&
            !selectedOptions.filter(
              (selectedOption) => selectedOption.value == option.value
            ).length
          ) {
            selectedOptions.push(option);
          } else if (!isSelectAllChecked) {
            for (let i = 0; i < selectedOptions.length; i++) {
              let selectedOption = selectedOptions[i];
              if (selectedOption.value == option.value) {
                selectedOptions.splice(i, 1);
                i--;
              }
            }
          }
        }
      });
      /** maintain the same order of selection as in original options */
      selectedOptions = getMaintainedOrderInSelection(
        cloneDeep(selectedOptions),
        this.props.options
      );
    }
    const {
      customPlaceHolderSelectionText,
      label,
      emptyPlaceholder,
      noDefaultSelection,
      showConcisePlaceholder,
      labelWithIcon,
      removeLabelTextTransform,
      name,
      isReverseSelectedAllowed= false
    } = this.props;
    const placeholder =
      !selectedOptions.length &&
        trim(lowerCase(emptyPlaceholder)) === "none" &&
        !noDefaultSelection
        ? emptyPlaceholder
        : getPlaceHolderText({
          selectedCount: selectedOptions.length,
          totalOptionsCount: updatedOptions.length,
          options: updatedOptions,
          areOptionsGrouped,
          customPlaceHolderSelectionText,
          label,
          andSeperator,
          orSeperator,
          selectedAliasPlaceholder,
          hidePlaceholder,
          showConcisePlaceholder,
          labelWithIcon,
          removeLabelTextTransform,
          name,
          labelExactMatch,
        });

    this.setState(
      (prevState) => {
        return {
          ...prevState,
          updatedOptions,
          selectedOptions,
          placeholder,
          // if select all is clicked, then exclude all the options from excludeBizIds and excludeBizOptions
          ...(isReverseSelectedAllowed && {
            isSelectAllWasClicked: isSelectAllChecked,
            excludeBizIds: isSelectAllChecked ? [] : prevState.excludeBizIds,
            excludeBizOptions: isSelectAllChecked ? [] : prevState.excludeBizOptions
          })
          
        };
      },
      () => {
        callback && typeof callback === "function" && callback();
        if (validationTrigger === "onChange" && _fieldValidator) {
          _fieldValidator(this);
        }
        //window.forceSet = true;
      }
    );
  };

  onClickOptionsGroup = (event, groupName, groupOption) => {
    const { updatedOptions, selectedOptions } = this.state;
    const {
      andSeperator,
      orSeperator,
      selectedAliasPlaceholder,
      hidePlaceholder,
      showConcisePlaceholder,
      labelWithIcon,
    } = this.props;
    const isChecked = event.target.checked;
    groupOption.allSelected = isChecked;
    groupOption.options.forEach((option) => {
      option.checked = isChecked;
      if (isChecked) {
        selectedOptions.push(option);
      } else {
        selectedOptions.forEach((opt, i) => {
          if (opt.value === option.value) {
            selectedOptions.splice(i, 1);
          }
        });
      }
    });
    updatedOptions[groupName] = groupOption;
    const {
      customPlaceHolderSelectionText,
      label,
      removeLabelTextTransform,
      name,
    } = this.props;
    const placeholder = getPlaceHolderText({
      selectedCount: selectedOptions.length,
      totalOptionsCount: updatedOptions.length,
      options: updatedOptions,
      areOptionsGrouped: true,
      customPlaceHolderSelectionText,
      label,
      andSeperator,
      orSeperator,
      selectedAliasPlaceholder,
      hidePlaceholder,
      showConcisePlaceholder,
      labelWithIcon,
      removeLabelTextTransform,
      name,
    });
    this.setState((prevState) => {
      return {
        ...prevState,
        updatedOptions,
        selectedOptions,
        placeholder,
      };
    });
  };

  resetToDefault = (event) => {
    event && event.stopPropagation && event.stopPropagation();
    const {
      andSeperator,
      orSeperator,
      selectedAliasPlaceholder,
      noDefaultSelection,
      hidePlaceholder,
      showConcisePlaceholder,
    } = this.props;
    event.target.checked = noDefaultSelection ? false : true;

    this.selectAllClicked(event, () => {
      const {
        customPlaceHolderSelectionText,
        label,
        onBlur,
        removeLabelTextTransform,
        name,
      } = this.props;
      const {
        updatedOptions,
        selectedOptions,
        totalOptionsCount,
        areOptionsGrouped,
        excludeBizIds, 
        excludeBizOptions
      } = this.state;
      const placeholder = getPlaceHolderText({
        selectedCount: selectedOptions.length,
        totalOptionsCount,
        options: updatedOptions,
        areOptionsGrouped,
        customPlaceHolderSelectionText,
        label,
        andSeperator,
        orSeperator,
        selectedAliasPlaceholder,
        hidePlaceholder,
        showConcisePlaceholder,
        removeLabelTextTransform,
        name,
      });
      this.setState({ placeholder });
      let selectedOptionsValue = selectedOptions.map((option) => option.value);
      onBlur(selectedOptions, selectedOptionsValue, excludeBizIds, excludeBizOptions);
    });
  };

  applyChanges = () => {
    const {
      updatedOptions,
      selectedOptions,
      totalOptionsCount,
      areOptionsGrouped,
      excludeBizIds, 
      excludeBizOptions
    } = this.state;
    const {
      customPlaceHolderSelectionText,
      label,
      emptyPlaceholder,
      andSeperator,
      orSeperator,
      selectedAliasPlaceholder,
      noDefaultSelection,
      hidePlaceholder,
      showConcisePlaceholder,
      labelWithIcon,
      removeLabelTextTransform,
      name,
    } = this.props;

    this.toggleDropdown();

    const placeholder =
      !selectedOptions.length &&
        trim(lowerCase(emptyPlaceholder)) === "none" &&
        !noDefaultSelection
        ? emptyPlaceholder
        : getPlaceHolderText({
          selectedCount: selectedOptions.length,
          totalOptionsCount,
          options: updatedOptions,
          areOptionsGrouped,
          customPlaceHolderSelectionText,
          label,
          andSeperator,
          orSeperator,
          selectedAliasPlaceholder,
          hidePlaceholder,
          showConcisePlaceholder,
          labelWithIcon,
          removeLabelTextTransform,
          name,
        });
    this.setState({ placeholder });
    let selectedOptionsValue = selectedOptions.map((option) => option.value);
    this.props.onBlur?.(selectedOptions, selectedOptionsValue, excludeBizIds, excludeBizOptions);
  };

  callMouseOver = (evt, index, label = "") => {
    window.aaa = evt;
    const { scrollWidth, clientWidth } = evt.currentTarget;
    const rect = evt.currentTarget.getBoundingClientRect();
    const top = rect.top - 10;
    const left = rect.left - 350 / 2 - 25;

    this.setState({
      [`tt-${index}`]: scrollWidth > clientWidth,
      hoverIndex: index,
      hoverLeft: left,
      hoverTop: top,
      hoverLabel: label,
    });
  };

  getSearchNodeRef = (domNode) => {
    searchNodeRef = domNode;
  };

  getselectNode = (domNode) => {
    this.selectNode = domNode;
  };

  getdropdownNode = (domNode) => {
    this.dropdownNodeRef = domNode;
  };

  setScrollViewMultiSelectRef = (domNode) => {
    this.scrollableDropdownRef = domNode;
  };

  callMouseOverSaved = (evt) => {
    const { scrollWidth, clientWidth } = evt.currentTarget;

    this.setState({
      savedTooltip: scrollWidth > clientWidth,
    });
  };

  getSelectedOptions = (options = []) => {
    const {
      enableSelectNone = false,
      emptyPlaceholder,
      noDefaultSelection,
    } = this.props;
    const noneSelected =
      options.length > 0 && options.every((opt) => !opt.checked);
    const areOptionsGrouped = this.state.areOptionsGrouped;
    let selectedOptions = [];

    if (areOptionsGrouped) {
      each(options, (optGroup) => {
        selectedOptions = selectedOptions.concat(
          optGroup.options.filter((option) => option.checked)
        );
      });
    } else {
      selectedOptions =
        enableSelectNone && noneSelected
          ? trim(lowerCase(emptyPlaceholder)) != "none" && !noDefaultSelection
            ? options.map((option) => {
              return {
                value: option.value,
                label: option.label,
                checked: true,
              };
            })
            : options.filter((option) => option.checked)
          : options.filter((option) => option.checked);
    }

    return selectedOptions.map((option) => ({
      value: option.value,
      label: option.label,
      optGroup: option.optGroup,
      checked: option.checked,
    }));
  };

  render() {
    let {
      label,
      showSearch,
      searchPlaceHolder,
      ctaButtonsEnabled,
      size,
      disabled,
      key,
      fixedDropdown,
      _renderValidationErrors,
      hasTooltip,
      supportMultipleList = false,
      listKeys = [],
      showSelecteAll = true,
      selectionLimit,
      allSelectedPlaceholder,
      extendWidth,
      customInfoJsx,
      customSize,
      hideLabelInDropDownOptions,
      inlineMode,
      customClassName,
      hidePlaceholder,
      top,
      showTooltipOutside = false,
      removeNoSelectedClass = false,
      id,
      showPhoenixTooltip,
      allSelectedCustomPlaceholder,
      disabledText,
      disabledTextClass,
      canOptionsInvalid,
      fullWidth,
      toggleDivId = null,
      scrollIntoView,
      freezeOptions = false,
      ctaButtonCustomText = null,
      ctaButtonDisabled = false,
      onOptionSelect = ()=>{},
      hideSelectAllOption,
      ellipsis,
      customWidthClass,
      customClearTip,
      disableSelectAllOption,
      isLoading,
      openDropDownOnHover,
      iconMode,
      footerOptionJsx,
      showCustomIconIninlineMode,
      customClassForInlineModeIcon,
      isExternalSourceWithTemplates,
      isResetAllowed,
      isDisabledOptionAllowed = false
    } = this.props;

    
    const {
      showDropdown,
      searchValue,
      updatedOptions,
      visibleOptionsCount,
      selectedOptions,
      areOptionsGrouped,
      placeholder,
      savedTooltip,
      validationClasses,
    } = this.state;
    const { toggleDropdown, onClickOptionsGroup } = this;
    _renderValidationErrors =
      _renderValidationErrors && _renderValidationErrors.bind(this);
    const boxSizeClass = getBoxSize(customSize);
    const topClass = top ? "top" : "bottom";
    let allSelected = true,
      renderAbleOptions = [];

    if (areOptionsGrouped) {
      Object.keys(updatedOptions).forEach((optGroup) => {
        updatedOptions[optGroup].options.forEach((option) => {
          if (!option.checked) {
            allSelected = false;
          }
        });
      });
    } else {
      renderAbleOptions = updatedOptions.filter((option) => !option.hide);
      const unCheckedOption = updatedOptions.filter(option => option.unCheckOnSelectAll);
      if (unCheckedOption.length) {
        let checkedFilterOptions = updatedOptions.filter(option => !option?.unCheckOnSelectAll);
        if (isDisabledOptionAllowed) {
          checkedFilterOptions = updatedOptions.filter(option => !option?.unCheckOnSelectAll && !option?.isDisabled);
        }
        allSelected = !checkedFilterOptions.filter(option => !option.checked).length;
      } else {
        let checkedFilterOptions = renderAbleOptions;
        if (isDisabledOptionAllowed) {
          checkedFilterOptions = renderAbleOptions.filter(option => !option?.isDisabled);
        }
        allSelected = !checkedFilterOptions.filter(option => !option.checked).length;
      }
    }
    const isFilterDefault =
      allSelected ||
      (trim(lowerCase(placeholder)) != "none" && !selectedOptions.length);
    const isDisabled = selectedOptions.length == selectionLimit;
    const iconOnlyMode = !inlineMode && iconMode;

    if (!disabled) {
      return (
          <div
            id={id}
            className={`${validationClasses} ${customClassName ? customClassName : ""
              } ${getEncodedStyleClass(
                `dropdown-box ${hasTooltip ? " dropdown-tooltip" : ""} ${extendWidth ? " extendedWidth" : ""
                } multi-select-box ${inlineMode ? "inline-mode" : boxSizeClass} ${hideLabelInDropDownOptions ? "no-head-dropdowns" : ""
                } ${size === "large" ? "large-box" : ""} ${!isFilterDefault && showDropdown ? "height-large" : ""
                } ${topClass === "top" ? "open-top" : ""} ${ellipsis ? "ellipsis" : ""
                } ${iconOnlyMode
                  ? showDropdown
                    ? "icon-mode-open-dropdown"
                    : "icon-mode"
                  : ""
                }`,
                Styles
              )}`}
            key={key}
          >
            <div
              id={toggleDivId}
              onClick={
                !openDropDownOnHover ? toggleDropdown.bind(this, event) : undefined
              }
              onMouseEnter={
                !showDropdown && openDropDownOnHover
                  ? toggleDropdown.bind(this, event)
                  : undefined
              }
            >
              {iconOnlyMode && !showDropdown && (
                <i
                  className={`icon_phoenix-template1 ${Styles["template-icon"]}`}
                />
              )}
              {isFilterDefault
                ? getFilterDefaultView.call(this, {
                  Styles,
                  allSelected,
                  iconOnlyMode,
                  showCustomIconIninlineMode,
                  customClassForInlineModeIcon,
                  isResetAllowed
                })
                : getFilterView.call(this, {
                  Styles,
                  showPhoenixTooltip,
                  iconOnlyMode,
                })}
            </div>
            {showDropdown &&
              getDropdown.call(this, {
                Styles,
                fixedDropdown,
                showSearch,
                searchPlaceHolder,
                showSelecteAll,
                allSelectedPlaceholder,
                searchValue,
                visibleOptionsCount,
                allSelected,
                areOptionsGrouped,
                isDisabled,
                onClickOptionsGroup,
                updatedOptions,
                renderAbleOptions,
                ctaButtonsEnabled,
                isFilterDefault,
                selectionLimit,
                supportMultipleList,
                listKeys,
                extendWidth,
                customInfoJsx,
                hidePlaceholder,
                showTooltipOutside,
                removeNoSelectedClass,
                showPhoenixTooltip,
                canOptionsInvalid,
                fullWidth,
                freezeOptions,
                ctaButtonCustomText,
                ctaButtonDisabled,
                onOptionSelect,
                hideSelectAllOption,
                customWidthClass,
                customClearTip,
                disableSelectAllOption,
                isLoading,
                footerOptionJsx,
                isExternalSourceWithTemplates,
              })}
            {showDropdown && scrollIntoView && <ScrollIntoView />}
            {_renderValidationErrors && _renderValidationErrors()}
          </div>
      );
    } else {
      return getDisabledView.call(this, {
        Styles,
        isFilterDefault,
        label,
        placeholder,
        savedTooltip,
        allSelectedCustomPlaceholder,
        disabledText,
        disabledTextClass,
      });
    }
  }
}
const MultiSelectWithOnclickWrapper = onClickOutside(Multiselect);

class MultiSelectWrapper extends Component {
  static displayName = "MultiSelect";
  render() {
    return (
      <span className={`el-multiselect ${Styles['filter-select-wrapper']}`}>
        <MultiSelectWithOnclickWrapper {...this.props} />
      </span>
    );
  }
}

MultiSelectWrapper.propTypes = {
  selected: PropTypes.array,
  selectAll: PropTypes.bool,
  emptyPlaceholder: PropTypes.string,
  allSelectedPlaceholder: PropTypes.string,
  onBlur: PropTypes.func,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  sortSelected: PropTypes.bool,
  enableSelectNone: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  showSearch: PropTypes.bool,
  searchPlaceHolder: PropTypes.string,
  levelSearch: PropTypes.bool,
  tooltip: PropTypes.object,
  tooltipAction: PropTypes.object,
  customLinks: PropTypes.object,
  customPlaceHolderSelectionText: PropTypes.string,
  ctaButtonsEnabled: PropTypes.bool,
  size: PropTypes.string,
  selectedLabel: PropTypes.string,
  parentNode: PropTypes.node,
  fixedDropdown: PropTypes.bool,
  name: PropTypes.bool,
  isLocationsAvailable: PropTypes.bool,
  key: PropTypes.string,
  appendElementToScroll: PropTypes.func,
  parentId: PropTypes.node,
  isResetAllowed: PropTypes.bool,
  validationTrigger: PropTypes.string,
  _attachToFormWrapper: PropTypes.func,
  _detachFromFormWrapper: PropTypes.func,
  _fieldValidator: PropTypes.func,
  _renderValidationErrors: PropTypes.func,
  hasTooltip: PropTypes.bool,
  showSelecteAll: PropTypes.bool,
  andSeperator: PropTypes.bool,
  orSeperator: PropTypes.bool,
  selectionLimit: PropTypes.number,
  supportMultipleList: PropTypes.bool,
  listKeys: PropTypes.array,
  openCallback: PropTypes.func,
  delayClickOutside: PropTypes.object,
  selectedAliasPlaceholder: PropTypes.string,
  closeCallback: PropTypes.func,
  extendWidth: PropTypes.bool,
  customInfoJsx: PropTypes.node,
  noDefaultSelection: PropTypes.bool,
  showSelectAllDisplayLabel: PropTypes.bool,
  customSelectedVal: PropTypes.string,
  inlineMode: PropTypes.bool,
  customSize: PropTypes.string,
  hideLabelInDropDownOptions: PropTypes.bool,
  position: PropTypes.string,
  filterLabelTooltipInfo: PropTypes.object,
  hidePlaceholder: PropTypes.bool,
  top: PropTypes.bool,
  showTooltipOutside: PropTypes.bool,
  customClassName: PropTypes.string,
  removeNoSelectedClass: PropTypes.bool,
  id: PropTypes.string,
  showPhoenixTooltip:
    PropTypes.bool /*---adding phoenix tooltip when ellipsis is shown and also for cross icon---*/,
  supportCustomAddEventHandler: PropTypes.bool,
  hideGroupCheckbox: PropTypes.bool,
  showConcisePlaceholder: PropTypes.bool,
  allSelectedCustomPlaceholder: PropTypes.string,
  disabledText: PropTypes.string,
  disabledTextClass: PropTypes.string,
  canOptionsInvalid: PropTypes.bool,
  fullWidth: PropTypes.bool,
  multipleSearch: PropTypes.bool,
  searchStr: PropTypes.string,
  getSearchKeywords: PropTypes.func,
  labelWithIcon: PropTypes.bool,
  keywordText: PropTypes.string,
  toggleDivId: PropTypes.string,
  removeLabelTextTransform: PropTypes.bool,
  freezeOptions: PropTypes.bool,
  ctaButtonCustomText: PropTypes.string,
  ctaButtonDisabled: PropTypes.bool,
  onOptionSelect: PropTypes.func,
  scrollIntoView: PropTypes.bool,
  ellipsis: PropTypes.string,
  resetValue: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  labelExactMatch: PropTypes.bool,
  customWidthClass: PropTypes.string,
  customClearTip: PropTypes.string,
  hideSelectAllOption: PropTypes.bool,
  triggerBlurOnAllDiselect: PropTypes.bool,
  disableSelectAllOption: PropTypes.bool,
  openDropDownOnHover: PropTypes.bool,
  isLoading: PropTypes.bool,
  iconMode: PropTypes.bool,
  placeholderWithSelectionLimit: PropTypes.string, // displays placeholder like 1/10 items selected
  disabledCheckboxTooltip: PropTypes.string, // tooltip for disabled checkbox
  customSelectAllPlaceholder: PropTypes.string,
  footerOptionJsx: PropTypes.node,
  onOptionClickCb: PropTypes.func,
  showCustomIconIninlineMode: PropTypes.bool,
  customClassForInlineModeIcon: PropTypes.string,
  customSelectAllDisplayLabel: PropTypes.string,
  isExternalSourceWithTemplates: PropTypes.bool
};

MultiSelectWrapper.defaultProps = {
  showSearch: true,
  searchPlaceHolder: "Search",
  size: "medium",
  fixedDropdown: false,
  isResetAllowed: false,
  noDefaultSelection: false,
  showSelectAllDisplayLabel: false,
  hidePlaceholder: false,
  removeNoSelectedClass: false,
  showPhoenixTooltip: false,
  allSelectedCustomPlaceholder: "All Selected",
  labelWithIcon: false,
  hideSelectAllOption: false,
  triggerBlurOnAllDiselect: false,
  openDropDownOnHover: false,
  isLoading: false,
};

export default MultiSelectWrapper
