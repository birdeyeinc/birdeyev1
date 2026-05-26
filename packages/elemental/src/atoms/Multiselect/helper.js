import { each, sortBy, lowerCase, trim, map, filter } from "lodash";
import { intlListFormat } from "utils";

export const prepareOptionsToRender = (props) => {
  const {
    options,
    sortSelected,
    enableSelectNone,
    selected = [],
    emptyPlaceholder,
    customPlaceHolderSelectionText,
    label,
    isHierarchyFilter,
    isSelectNoneSelectAll,
    isHierarchyNodeEnabled,
    andSeperator,
    orSeperator,
    selectedAliasPlaceholder,
    noDefaultSelection,
    hidePlaceholder,
    hideGroupCheckbox,
    showConcisePlaceholder,
    canOptionsInvalid,
    labelWithIcon,
    removeLabelTextTransform,
    name,
    placeholderWithSelectionLimit,
    selectionLimit,
  } = props;
  let { selectAll } = props;
  const areOptionsGrouped = !Array.isArray(options);
  let updatedOptions = [];
  let visibleOptionsCount = 0;
  let selectedOptions = [];
  let totalOptionsCount = 0;
  if (
    !selected.length &&
    trim(lowerCase(emptyPlaceholder)) != "none" &&
    !noDefaultSelection
  ) {
    selectAll = true;
  } else {
    selectAll = false;
  }
  if (areOptionsGrouped) {
    updatedOptions = {};
    let groupIndex = 0;
    let selectedVal = {};

    for (const value of selected) {
      selectedVal[value] = true;
    }
    each(options, (groupOptions = [], groupName) => {
      const showGroupCheckbox = hideGroupCheckbox
        ? false
        : Boolean(groupOptions.length);
      let optGroupOptionSelectedCount = 0;

      let updatedGroupOptions = groupOptions.map((option, optionIndex) => {
        const isOptionSelected = selectedVal[option.value];
        const checked = selectAll || isOptionSelected;
        ++visibleOptionsCount;
        ++totalOptionsCount;
        if (checked) {
          optGroupOptionSelectedCount++;
          selectedOptions.push(option);
        }

        return {
          ...option,
          checked,
          optGroup: groupName,
          key: groupIndex + "-" + optionIndex,
        };
      });

      const allOptGrpOptionsSelected =
        groupOptions.length === optGroupOptionSelectedCount;
      sortSelected &&
        (updatedGroupOptions = sortBy(updatedGroupOptions, [
          (opt) => !opt.checked && opt.value != -1,
          "key",
        ]));
      updatedOptions[groupName] = {
        options: updatedGroupOptions,
        hide: false,
        showGroupCheckbox,
        allSelected: allOptGrpOptionsSelected,
      };
      groupIndex++;
    });
  } else {
    options.forEach((option, i) => {
      let isOptionSelected = selected?.filter(
        (value) => option?.value == value
      );
      let checked = !selected?.length
        ? selectAll
        : options.length == selected?.length || isOptionSelected.length > 0;

      // If list contains invalid options
      if (canOptionsInvalid) {
        if (option.valid && option.valid === "invalid") {
          checked = false;
        }
      }

      let key = i;
      updatedOptions.push({ ...option, checked, key });
      ++visibleOptionsCount;
      ++totalOptionsCount;
      if (checked) {
        selectedOptions.push(option);
      }
    });

    sortSelected &&
      (updatedOptions = sortBy(updatedOptions, [
        (opt) => !opt.checked && opt.value != -1,
        "key",
      ]));

    const noneSelected =
      updatedOptions.length > 0 && updatedOptions.every((opt) => !opt.checked);
    trim(lowerCase(emptyPlaceholder)) != "none" &&
      !noDefaultSelection &&
      enableSelectNone &&
      noneSelected &&
      (updatedOptions = updatedOptions.map((option) => {
        return {
          value: option.value,
          label: option.label,
          key: option.key,
          checked: true,
        };
      }));
  }

  let placeholder =
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
        placeholderWithSelectionLimit,
        selectionLimit,
      });

  return {
    options: updatedOptions,
    selectedOptions,
    areOptionsGrouped,
    visibleOptionsCount,
    placeholder,
    totalOptionsCount,
    isHierarchyFilter,
    isSelectNoneSelectAll,
    isHierarchyNodeEnabled,
  };
};

export const getPlaceHolderText = (metaOptions) => {
  let {
    selectedCount,
    totalOptionsCount,
    options,
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
    name = "",
    labelExactMatch,
    placeholderWithSelectionLimit,
    selectionLimit,
  } = metaOptions;
  let placeholder = "";
  let checkedOptions = [];
  if (
    showConcisePlaceholder &&
    selectedCount &&
    selectedCount !== totalOptionsCount
  ) {
    if (selectedCount === 1 && areOptionsGrouped) {
      for (let option in options) {
        for (let i = 0; i < options[option].options.length; i++) {
          if (options[option].options[i].checked) {
            return options[option].options[i].label;
          }
        }
      }
    }
    return `${selectedCount} selected`;
  }
  if (placeholderWithSelectionLimit) {
    return `${selectedCount}/${selectionLimit} ${placeholderWithSelectionLimit}${selectedCount > 1 ? "s" : ""
      } selected`;
  }
  if (selectedCount === 0 || selectedCount === totalOptionsCount) {
    if (labelExactMatch) {
      if (selectedCount > 0) {
        placeholder = `${selectedCount} ${labelExactMatch}`;
      } else {
        placeholder = `Select ${labelExactMatch}`;
      }
    } else {
      placeholder = label;
    }
  } else {
    options = options //|| this.state.options; //commented since 'this' is not useful for helper functions.
    // with opt group
    if (name == "messageType" || name == "convertedContactType" || name === "selSubscriptionStatus" || name === "contactType" || name === "communicationPreferences") {
      placeholder = `${selectedCount} ${label.toLowerCase()}${selectedCount > 1 ? "s" : ""
        }`;
    } else if (areOptionsGrouped) {
      each(options, (optGroup, optGroupName) => {
        let checkedOptGrpOptionsPlaceholder = "";

        const optGroupCheckedOptions = optGroup.options
          .filter((option) => option.checked)
          .map((option) => option.label);

        const optGroupSelectedCount = optGroupCheckedOptions.length;

        // if some opt group option is selected
        if (optGroupSelectedCount > 0) {
          //const totalOptGroupOptions = optGroup.options.length;

          if (optGroupSelectedCount <= 3) {
            checkedOptGrpOptionsPlaceholder = optGroupCheckedOptions.join(", ");
          } else {
            checkedOptGrpOptionsPlaceholder =
              optGroupSelectedCount + "selected";
          }
          placeholder += `[${optGroupName} : ${checkedOptGrpOptionsPlaceholder}], `;
        }
      });

      // trimming the last ", "
      if (placeholder.indexOf("], ") > -1) {
        placeholder = placeholder.slice(0, -2);
      }
    } else {
      // without opt group
      if (selectedCount <= 1) {
        checkedOptions = checkedOptions.concat(
          options
            .filter((option) => option.checked)
            .map((option) => option.label)
        );
        // placeholder = checkedOptions.join(", ");
        if (labelWithIcon) {
          checkedOptions = [checkedOptions[0][1]];
        }
        if (andSeperator) {
          placeholder = intlListFormat(checkedOptions, "and");
        } else if (orSeperator) {
          placeholder = checkedOptions.join(" or ");
        } else {
          placeholder = checkedOptions.join(", ");
        }
      } else if (customPlaceHolderSelectionText) {
        let defaultTextStart = " out of ";
        let defaultTextEnd = " options included for this question";

        // 100 out of 500 options included for this  question
        placeholder =
          selectedCount + defaultTextStart + totalOptionsCount + defaultTextEnd;
      } else {
        if (andSeperator) {
          let mappedItems = map(
            filter(options, (item) => item.checked),
            (fItem) => fItem.label
          );
          placeholder = intlListFormat(mappedItems, "and");
        } else if (orSeperator) {
          let mappedItems = map(
            filter(options, (item) => item.checked),
            (fItem) => fItem.label
          );
          placeholder = mappedItems.join(" or ");
        } else {
          let text = selectedAliasPlaceholder
            ? selectedAliasPlaceholder
            : hidePlaceholder
              ? " "
              : label;
          let finalText = text;
          if (text && text.trim().slice(-1) !== "s" && !hidePlaceholder) {
            finalText = text.trim() + "s";
          }
          switch (text.trim()) {
            case "City":
              finalText = "Cities";
              break;

            case "Tags":
              finalText = "Tags";
              break;

            case "Assisted by":
              finalText = "employees";
              break;
              
            case "Created by":
                finalText = "users";
                break;

            case "Assigned to":
              finalText = "assignees";
              break;

            case "Last Incoming Message":
              finalText = "message sources";
              break;

            case "Actions":
              finalText = "actions";
              break;

            case "Status":
              finalText = "statuses";
              break;

            case "Sites":
              finalText = "sites";
              break;

            case "Ratings":
              finalText = "ratings";
              break;

            case "Review sites":
              finalText = "review sites";
              break;

            case "Permissions":
              finalText = "permissions";
              break;

            case "Contact's location":
              finalText = "contact's location";
              break;

            case "LISTING_CATEGORIES":
            case "SERIES_SELECTOR":
              finalText = "selected";
              break;
            case "Category":
              finalText = "Categories";
              break;

            case "Branch":
              finalText = "Branches";
              break;

            default:
              break;
          }
          if (!removeLabelTextTransform) {
            placeholder = selectedCount + " " + finalText.toLowerCase();
          } else {
            placeholder = selectedCount + " " + finalText;
          }
        }
      }
    }
  }
  return placeholder;
};

export const getBoxSize = (customSize) => {
  let boxSizeClass = "select-box-";
  switch (customSize) {
    case "small":
      boxSizeClass += "small";
      break;
    case "medium":
      boxSizeClass += "medium";
      break;
    case "large":
      boxSizeClass += "large";
      break;
    case "x-large":
      boxSizeClass += "x-large";
      break;
    case "xx-large":
      boxSizeClass += "xx-large";
      break;
    case "xxx-large":
      boxSizeClass += "xxx-large";
      break;
    default:
      boxSizeClass = "";
  }
  return boxSizeClass;
};

/** maintain the same order in in selection */
export const getMaintainedOrderInSelection = (
  selectedOptions,
  originalOptions
) => {
  let orderedSelectedOptions = [];
  let selectedOptionsValue = selectedOptions.map((option) => option.value);
  each(originalOptions, (option) => {
    if (selectedOptionsValue.indexOf(option.value) !== -1) {
      orderedSelectedOptions.push(option);
    }
  });
  return orderedSelectedOptions;
};
