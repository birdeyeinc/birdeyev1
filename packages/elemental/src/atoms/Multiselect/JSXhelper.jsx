import React from "react";
import FormInput from "atoms/FormInput";
import SearchFilter from "atoms/SearchFilter";
import Button from "atoms/Button";
import ReactList from "react-list";
import { toLower, isArray, each, isEqual } from "lodash";
import Tooltip from "atoms/Tooltip";
import { getBoxSize } from "./helper.js";
import Popover from "atoms/Popover";
import warningIcon from "assets/images/warning.svg";
import LoadingShimmer from "atoms/LoadingShimmer";

/* eslint-disable react/no-multi-comp */
window.count = 0;
const renderHeading = (type) => {
  window.count++;
  switch (type) {
    case "T":
      return <h4>TEAMS:</h4>;
    case "U":
      return <h4>USERS:</h4>;
    case "C":
      return <h4>CONTACT</h4>;
    case "R":
      return <h4>REVIEW</h4>;
    case "S":
      return <h4>SURVEY</h4>;
    case "I":
      return <h4>INBOX</h4>;
    case "RF":
      return <h4>REFERRAL</h4>;
    case "P":
      return <h4>PAYMENT</h4>;
    case "A":
      return <h4>APPOINTMENT</h4>;
    case "TM":
      return <h4>Team member</h4>;
    default:
      return null;
  }
};

const renderCheckboxInput = (self, option, freezeOptions, shouldDisable, onOptionSelect) => {
  return(
  <FormInput
    onChange={(e) => {
      if (!window.othersSelected) {
        self.onClickOptions(e, option, option.key);
        if (onOptionSelect && typeof onOptionSelect === 'function') {
          onOptionSelect(option, self.state.selectedOptions);
        }
      }
    }}
    value={option.value}
    disabled={shouldDisable || freezeOptions || option?.isDisabled}
    type="checkbox"
    name={"selectItem" + option.key}
    checked={option.checked || false}
  />
)};

export const drawOptionRow = function (
  config,
  option,
  index,
  Styles,
  supportMultipleList,
  isDisabled,
  showTooltipOutside,
  showPhoenixTooltip,
  canOptionsInvalid,
  freezeOptions = false,
  isExternalSourceWithTemplates,
  onOptionSelect
) {
  const self = this;

  let classList = option.showHierarchy ? Styles["hierarchy-label"] : "";
  /* If options list can have invalid option item */
  if (canOptionsInvalid && option.valid && option.valid === "invalid") {
    classList += " " + Styles["option-fade"];
  }

  if (option.customHideCheckbox) {
    return;
  }

  let jsx = option.groupTitle ? (
    config.groupTitleCallback()
  ) : (
    <span className={`${classList} ${option?.customJSX ? "el-multiselect-description" : ""}`}>
      <label
        onClick={
          option.showHierarchy
            ? () => {
                self.props.openCrmModal();
                this.toggleDropdown();
                // e.stopPropagation();
                window.othersSelected = true;
              }
            : undefined
        }
        className={`${
          isDisabled && !option.checked
            ? self.props.disabledCheckboxTooltip
              ? ""
              : "opacity-disabled cursor-disable"
            : Styles[
                (option.type &&
                  supportMultipleList &&
                  option.type != window.type) ||
                (index == 0 && option.type)
                  ? "group-head"
                  : ""
              ]
        } ${option.isLevel ? Styles["default-cursor"] : ""}`}
      >
        {option.showHierarchy ? (
          <i className="icon_phoenix-add-circle" />
        ) : option.isLevel ? (
          ""
        ) : option?.disableOption ? (
          <FormInput
            value={option?.value}
            disabled
            type="checkbox"
            name={"selectItem" + option?.key}
            checked={option?.selected || false}
          />
        ) : isDisabled &&
          !option.checked &&
          self.props.disabledCheckboxTooltip ? (
          <Tooltip
            text={self.props.disabledCheckboxTooltip}
            position="bottom-left"
            hideOnScroll
          >
            {renderCheckboxInput(self, option, freezeOptions, true, onOptionSelect)}
          </Tooltip>
        ) : (
          renderCheckboxInput(self, option, freezeOptions, false, onOptionSelect)
        )}
        <div
          className={`${Styles["tooltip-wrapper"]} ${
            isDisabled && !option.checked && self.props.disabledCheckboxTooltip
              ? "opacity-disabled"
              : ""
          }`}
        >
          {getToolTip({
            htmlJSX: (
              <span
                className={`custom-creatorname-box ${
                  option.customIcon ? "custom-phoenix-icon-align" : ""
                } ${Styles["text"]} ${Styles[option.isLevel ? "level" : ""]}`}
                onMouseOver={(event) =>
                  self.callMouseOver(event, index, option.label)
                }
              >
                {option?.disableOption ? ( //tooltip in options label
                  <Tooltip
                    text={
                      <>
                        <span>{option?.disableTooltip}</span>
                      </>
                    }
                    customContainerClassName="location-disabled-tooltip"
                    size="medium"
                    position={"bottom-left"}
                  >
                    {option.label}
                  </Tooltip>
                ) : (
                  <>
                    {option.label}
                    {option?.customJSX ? option.customJSX : null} 
                      {isExternalSourceWithTemplates && option.hasEmojis && 
                        <Tooltip
                          text={"Yelp doesn't support emojis. We'll automatically remove them before posting, but ensure your message still reads well without them."}
                          position={"right"}
                          setRelativePositions={false}
                        >
                          <span className={`${Styles["custom-exclamation-icon"]}`}>
                            !
                          </span>
                        </Tooltip>
                      }
                    </>
                )}
                {option.subLabel && (
                  <span className="custom-nametxt-box">{option.subLabel}</span>
                )}
                {option.useDefaultTitleTooltip ? (
                  <span
                    className="multi-select-tooltip-title"
                    title={option.tooltipText}
                  >
                    {option.subLabel} <i className="icon-question" />
                  </span>
                ) : option.showTooltip ? (
                  <Tooltip
                    text={option.tooltipText}
                    hideOnScroll
                    position="bottom"
                    size="medium"
                    tooltipClass={"multi-select-tooltip"}
                    customContainerClassName={"option-tooltip-parent"}
                  >
                    <i className="icon-question" />
                  </Tooltip>
                ) : null}
                {option.showHierarchy &&
                this.props.saveIntegrationList.length > 0
                  ? `(${this.props.saveIntegrationList.length})`
                  : null}
                {option.customIcon ? <i className={option.customIcon} /> : null}
              </span>
            ),
            tooltipText: self.state[`tt-${index}`] ? option.label : null,
            showTooltipOutside,
            showPhoenixTooltip,
          })}
        </div>
        {(option.type && supportMultipleList && option.type != window.type) ||
        (index == 0 && option.type)
          ? renderHeading(option.type)
          : null}
      </label>
    </span>
  );
  window.type = option.type;
  return jsx;
};

export const getToolTip = function (config) {
  const { htmlJSX, tooltipText, showTooltipOutside, showPhoenixTooltip } =
    config;
  return (
    <div className="icon tootip-parent">
      {htmlJSX}
      {tooltipText && !showTooltipOutside ? (
        showPhoenixTooltip ? (
          <Tooltip
            customContainerClassName="ml-0 no-iconhover"
            text={tooltipText}
            tooltipClass="inner"
          />
        ) : (
          <div className="tooltip-dark">
            <div className="inner">{tooltipText}</div>
          </div>
        )
      ) : null}
    </div>
  );
};

export const getOptionRow = function (config, showSelecteAll, freezeOptions) {
  const {
    checked,
    onChange,
    elem,
    onChangeParams = [],
    hideCheckbox = false,
    disableSelectAllOption = false,
  } = config;
  if (!showSelecteAll) return null;
  if (disableSelectAllOption) {
    return (
      <li>
        <label>
          <FormInput
            onChange={() => {}}
            value="all"
            type="checkbox"
            name={"selectAll"}
            checked={false}
            disabled
          />
          {!hideCheckbox && <span className="icon-checkbox" />}
          {elem}
        </label>
      </li>
    );
  } else {
    return (
      <li>
        <label>
          <FormInput
            onChange={(e) => onChange(e, ...onChangeParams)}
            value="all"
            type="checkbox"
            name={"selectAll"}
            checked={checked}
            disabled={freezeOptions}
          />
          {!hideCheckbox && <span className="icon-checkbox" />}
          {elem}
        </label>
      </li>
    );
  }
};

export const getDropdown = function (config) {
  const {
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
    renderAbleOptions = [],
    ctaButtonsEnabled,
    ctaButtonDisabled,
    onOptionSelect,
    isFilterDefault,
    supportMultipleList,
    customInfoJsx,
    showTooltipOutside,
    showPhoenixTooltip,
    canOptionsInvalid = false,
    fullWidth,
    freezeOptions = false,
    ctaButtonCustomText = null,
    hideSelectAllOption = false,
    customWidthClass,
    disableSelectAllOption,
    isLoading,
    footerOptionJsx,
    isExternalSourceWithTemplates
  } = config;
  const self = this;

  const {
    inlineMode,
    customSize,
    position,
    filterLabelTooltipInfo,
    top,
    multipleSearch,
    getSearchKeywords,
    keywordText,
  } = this.props;
  window.type = window.type || undefined;
  const boxSizeClass = getBoxSize(customSize);
  const positionStyle = position === "right" && "selectbox-right";
  const hasLabelTooltip =
    filterLabelTooltipInfo &&
    filterLabelTooltipInfo.showTooltip &&
    filterLabelTooltipInfo.tooltipJsx;

  const { hoverIndex, hoverLabel, hoverLeft, hoverTop } = self.state;
  const toShowHoverTooltip = self.state[`tt-${hoverIndex}`];

  // If options list can have invalid option item, Find invalid options
  let isInvalidOptionsExists = false;
  each(updatedOptions, (option) => {
    if (option.valid && option.valid === "invalid") {
      isInvalidOptionsExists = true;
    }
  });

  if (isLoading) {
    return (
      <div
        className={`${
          Styles["filter-dropdown"]
        } dropdown-popup ${customWidthClass} ${
          hasLabelTooltip ? Styles["tooltip-filter-dropdown"] : ""
        } ${Styles[positionStyle]} ${inlineMode ? Styles[boxSizeClass] : ""} ${
          top ? "top" : ""
        } ${canOptionsInvalid ? "min-width-fill" : ""}`}
        style={
          fixedDropdown
            ? { position: "fixed" }
            : fullWidth
            ? { width: "auto" }
            : {}
        }
        ref={self.getdropdownNode.bind(self)}
      >
        <LoadingShimmer
          shimmerCount={[{ height: "large-height", width: "full-width" }]}
          displayCount={3}
        />
        <span
          className={Styles["scroll-to-element"]}
          ref={self.setScrollViewMultiSelectRef}
        />
      </div>
    );
  }

  return (
    <div
      className={`${
        Styles["filter-dropdown"]
      } dropdown-popup ${customWidthClass} ${
        hasLabelTooltip ? Styles["tooltip-filter-dropdown"] : ""
      } ${Styles[positionStyle]} ${inlineMode ? Styles[boxSizeClass] : ""} ${
        top ? "top" : ""
      } ${canOptionsInvalid ? "min-width-fill" : ""}`}
      style={
        fixedDropdown
          ? { position: "fixed" }
          : fullWidth
          ? { width: "auto" }
          : {}
      }
      ref={self.getdropdownNode.bind(self)}
    >
      <div>
        {showSearch ? (
          <div
            className={Styles["form-box"]}
            ref={self.getSearchNodeRef.bind(self)}
          >
            <SearchFilter
              placeholder={searchPlaceHolder}
              onCrossClickAction={self.filterOptions.bind(self)}
              onInputValueChange={self.filterOptions.bind(self)}
              debounceDelay={100}
              searchStr={searchValue}
              autoFocus
              multipleSearch={multipleSearch}
              getSearchKeywords={getSearchKeywords}
            />
          </div>
        ) : null}
        {customInfoJsx ? customInfoJsx : null}
        <ul className="custom-scroll">
          {/* If options list can have invalid option item */}
          {visibleOptionsCount ? (
            (canOptionsInvalid && isInvalidOptionsExists) ||
            hideSelectAllOption ? null : (
              getOptionRow(
                {
                  onChange: self.selectAllClicked.bind(self),
                  checked: allSelected,
                  value: "all",
                  name: "selectAll",
                  elem: (
                    <span className={Styles["text"]}>
                      {allSelectedPlaceholder
                        ? allSelectedPlaceholder
                        : "Select all"}
                    </span>
                  ),
                  disableSelectAllOption,
                },
                showSelecteAll,
                freezeOptions
              )
            )
          ) : (
            <li className="ms-no-results">
              {multipleSearch ? `${keywordText}` : `No matches found`}
            </li>
          )}
          {areOptionsGrouped ? (
            Object.keys(updatedOptions).map((optionsGroup, i) => {
              let optionGroup = updatedOptions[optionsGroup];
              const optionGroupType =
                isArray(optionGroup && optionGroup.options) &&
                optionGroup.options.length &&
                optionGroup.options[0].type;
              return (
                <div key={i} className={Styles["sub-list"]}>
                  {optionGroup.showGroupCheckbox
                    ? getOptionRow(
                        {
                          onChange: onClickOptionsGroup.bind(self),
                          onChangeParams: [optionsGroup, optionGroup, i],
                          checked: optionGroup.allSelected || false,
                          value: optionsGroup,
                          name: "selectItem" + optionGroup.key,
                          elem: (
                            <div className={Styles["tooltip-wrapper"]}>
                              {getToolTip({
                                htmlJSX: (
                                  <span
                                    className={Styles["text"]}
                                    onMouseOver={(event) =>
                                      self.callMouseOver(event, i)
                                    }
                                  >
                                    {optionsGroup}
                                  </span>
                                ),
                                tooltipText: self.state[`tt-${i}`]
                                  ? optionsGroup
                                  : null,
                                showPhoenixTooltip,
                              })}
                            </div>
                          ),
                        },
                        true,
                        freezeOptions
                      )
                    : null}
                  {optionGroup.hide
                    ? null
                    : optionGroup.options.map((option, key) => {
                        let visibleOption = !option.hide;
                        if (visibleOption) {
                          return (
                            <li key={key}>
                              {drawOptionRow.call(
                                self,
                                {
                                  groupTitleCallback: getOptionRow.bind(
                                    self,
                                    {
                                      onChange: onClickOptionsGroup.bind(self),
                                      onChangeParams: [
                                        optionsGroup,
                                        optionGroup,
                                        i,
                                      ],
                                      checked: optionGroup.allSelected || false,
                                      value: optionsGroup,
                                      name: "selectItem" + optionGroup.key,
                                      elem: renderHeading(optionGroupType),
                                    },
                                    true
                                  ),
                                },
                                option,
                                key,
                                Styles,
                                showPhoenixTooltip,
                                null,
                                null,
                                null,
                                null,
                                freezeOptions,
                                isExternalSourceWithTemplates,
                                onOptionSelect
                              )}
                            </li>
                          );
                        }
                        return null;
                      })}
                </div>
              );
            })
          ) : (
            <div
              className={`${
                showTooltipOutside && toShowHoverTooltip
                  ? "icon tootip-parent"
                  : ""
              } ${
                canOptionsInvalid && isInvalidOptionsExists
                  ? Styles["hide-transform"]
                  : ""
              }`}
            >
              {canOptionsInvalid ? (
                renderAbleOptions.map((option, key) => {
                  let visibleOption = option ? !option.hide : false;

                  const isInvalidOption =
                    canOptionsInvalid &&
                    option.valid &&
                    option.valid === "invalid";
                  let listTooltipWrapperStyle = "";
                  if (isInvalidOption) {
                    listTooltipWrapperStyle += Styles["tooltip-invalid-style"];
                  }

                  return (
                    <li
                      key={key}
                      className={`${
                        option.isLevel ? Styles["disableHover"] : ""
                      }`}
                      style={{
                        display: !visibleOption
                          ? "none"
                          : isInvalidOption
                          ? "flex"
                          : "auto",
                        alignItems: isInvalidOption ? "center" : "none",
                      }}
                    >
                      {drawOptionRow.call(
                        self,
                        null,
                        option,
                        key,
                        Styles,
                        supportMultipleList,
                        isDisabled,
                        showTooltipOutside,
                        showPhoenixTooltip,
                        canOptionsInvalid,
                        freezeOptions,
                        isExternalSourceWithTemplates,
                        onOptionSelect
                      )}
                      {isInvalidOption &&
                        (option.linkText || option.tooltipText) && (
                          <div className={listTooltipWrapperStyle}>
                            <Tooltip
                              tooltipText={
                                option.linkText ? null : option.tooltipText
                              }
                              linkText={option.linkText}
                              position="bottom"
                            >
                              <img src={warningIcon} />
                            </Tooltip>
                          </div>
                        )}
                    </li>
                  );
                })
              ) : (
                <ReactList
                  itemRenderer={(index, key) => {
                    let option = renderAbleOptions[index];
                    let visibleOption = option ? !option.hide : false;

                    const isInvalidOption =
                      canOptionsInvalid &&
                      option.valid &&
                      option.valid === "invalid";
                    let listTooltipWrapperStyle = "";
                    if (isInvalidOption) {
                      listTooltipWrapperStyle +=
                        Styles["tooltip-invalid-style"];
                    }

                    if (visibleOption) {
                      return (
                        <li
                          key={key}
                          className={`${
                            option.isLevel ? Styles["disableHover"] : ""
                          }`}
                          style={{
                            display: isInvalidOption ? "flex" : "auto",
                            alignItems: isInvalidOption ? "center" : "none",
                          }}
                        >
                          {drawOptionRow.call(
                            self,
                            null,
                            option,
                            index,
                            Styles,
                            supportMultipleList,
                            isDisabled,
                            showTooltipOutside,
                            showPhoenixTooltip,
                            canOptionsInvalid,
                            freezeOptions,
                            isExternalSourceWithTemplates,
                            onOptionSelect
                          )}
                          {isInvalidOption &&
                            (option.linkText || option.tooltipText) && (
                              <div className={listTooltipWrapperStyle}>
                                <Tooltip
                                  tooltipText={
                                    option.linkText ? null : option.tooltipText
                                  }
                                  linkText={option.linkText}
                                  position="bottom"
                                >
                                  <img src={warningIcon} />
                                </Tooltip>
                              </div>
                            )}
                        </li>
                      );
                    }
                    return null;
                  }}
                  length={renderAbleOptions.length}
                  type="uniform"
                />
              )}
              {showTooltipOutside && toShowHoverTooltip && (
                <div
                  className="tooltip-dark"
                  style={{
                    position: "fixed",
                    top: hoverTop + "px",
                    left: hoverLeft + "px",
                    width: "270px",
                  }}
                >
                  <div className="inner" style={{ whiteSpace: "pre-wrap" }}>
                    {hoverLabel}
                  </div>
                </div>
              )}
            </div>
          )}
        </ul>
      </div>
      {ctaButtonsEnabled ? (
        <div className={Styles["btn-wrapper"] + " clearfix"}>
          <Button
            disabled={ctaButtonDisabled || false}
            className="pull-right mr-15 ml-5"
            label={ctaButtonCustomText || "Apply"}
            type="primary"
            onClick={self.applyChanges.bind(self)}
          />
          {!isFilterDefault ? (
            <Button
              className="pull-right"
              disabled={isFilterDefault}
              label="Clear"
              type="link"
              onClick={() => {
                self.resetToDefault.call(self, { target: {} });
                self.setState({ showDropdown: false });
              }}
            />
          ) : null}
        </div>
      ) : null}
      {footerOptionJsx ? footerOptionJsx : null}
      <span
        className={Styles["scroll-to-element"]}
        ref={self.setScrollViewMultiSelectRef}
      />
    </div>
  );
};

export const getDisabledView = function (config) {
  const {
    Styles,
    isFilterDefault,
    label,
    placeholder,
    savedTooltip,
    allSelectedCustomPlaceholder,
    disabledText,
    disabledTextClass,
  } = config;
  const self = this;
  let JSX = !isFilterDefault ? (
    <div>
      <div
        className={`${Styles["dropdown-box"]}  ${Styles["multi-select-box"]}`}
      >
        <div
          className={`${Styles["select-box"]} ${Styles["disabled-select-box"]}`}
        >
          <label>{label}</label>
          <div className={Styles["tooltip-wrapper"]}>
            <div className="icon tootip-parent">
              {getToolTip({
                htmlJSX: (
                  <div
                    className={`${Styles["selected-values"]} ${
                      toLower(placeholder).indexOf("of") > 0
                        ? Styles["no-capitalize"]
                        : ""
                    }`}
                    onMouseOver={(event) =>
                      self.callMouseOverSaved.call(self, event)
                    }
                  >
                    {isArray(placeholder) ? placeholder.join(",") : placeholder}
                  </div>
                ),
                tooltipText: savedTooltip
                  ? isArray(placeholder)
                    ? placeholder.map((item, i) => {
                        return (
                          <div key={`${item}_${i}`}>
                            {item}
                            {i < placeholder.length - 1 ? "," : ""}
                          </div>
                        );
                      })
                    : placeholder
                  : null,
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={Styles["large-box"]}>
      <div
        className={`${Styles["select-box"]} ${Styles["disabled-select-box"]} ${
          disabledTextClass || ""
        }`}
      >
        <label>{label}</label>
        <div className={Styles["selected-values"]}>
          {disabledText || allSelectedCustomPlaceholder || "All Selected"}
        </div>
      </div>
    </div>
  );
  return JSX;
};

export const getFilterView = function (config) {
  const self = this;
  const { Styles, iconOnlyMode } = config;
  const {
    size,
    selectedLabel,
    isResetAllowed,
    inlineMode,
    customSelectedVal,
    filterLabelTooltipInfo,
    removeNoSelectedClass = false,
    showPhoenixTooltip,
    selected,
    resetValue,
    showLeftIcon,
    customLeftIconClass,
    customWidthClass,
    customClearTip,
  } = self.props;
  let { showDropdown, placeholder, selectedOptions } = self.state;
  const { getselectNode, resetToDefault } = self;
  const hasLabelTooltip =
    filterLabelTooltipInfo &&
    filterLabelTooltipInfo.showTooltip &&
    filterLabelTooltipInfo.tooltipJsx;
  const removeCapitalizeClass =
    selectedOptions.length === 1 && removeNoSelectedClass;
  if (placeholder.indexOf("experience scores") > -1) {
    placeholder = placeholder.replace("experience scores", "Experience scores");
  }
  const customWidthClassDropDown = showDropdown ? customWidthClass : "";

  return (
    <div
      className={`${
        isResetAllowed ? Styles["select-box"] : Styles["default-filter"]
      } ${showLeftIcon ? Styles["with-icons"] : ""} ${
        showDropdown ? Styles["dropdown-open"] : ""
      } ${showDropdown ? "dropdown-open" : ""} ${
        hasLabelTooltip ? Styles["label-with-tooltip"] : ""
      } ${customWidthClassDropDown}`}
      ref={getselectNode.bind(self)}
    >
      {inlineMode && customSelectedVal ? (
        <span className={Styles["selected-values-wrapper"]}>
          <span className={Styles["selected-values-label"]}>
            {customSelectedVal}
          </span>
          <i className="icon_phoenix-sort" />
        </span>
      ) : (
        <div>
          {selectedLabel ? <label>{selectedLabel}</label> : null}

          {iconOnlyMode && !showDropdown ? null : (
            <div className={Styles["tooltip-inner-wrapper"]}>
              {showLeftIcon ? <i className={customLeftIconClass} /> : null}
              {getToolTip({
                htmlJSX: (
                  <div
                    className={`${Styles["selected-values"]} ${
                      toLower(placeholder).indexOf("of") > 0
                        ? removeCapitalizeClass
                          ? ""
                          : Styles["no-capitalize"]
                        : ""
                    }`}
                  >
                    {isArray(placeholder)
                      ? placeholder.join(", ")
                      : placeholder}
                    {hasLabelTooltip && showDropdown ? (
                      <Popover
                        className="tooltip-popover"
                        customWidth={44}
                        fixed
                        size="large"
                        float="left"
                        custom={<i className="icon_phoenix-question-circle" />}
                        includeBoxShadow
                      >
                        <ul>
                          <li>{filterLabelTooltipInfo.tooltipJsx}</li>
                        </ul>
                      </Popover>
                    ) : null}
                  </div>
                ),
                showPhoenixTooltip,
                tooltipText:
                  !showDropdown &&
                  (isArray(placeholder)
                    ? placeholder.join().length
                    : placeholder.length) > (size == "medium" ? 20 : 32)
                    ? isArray(placeholder)
                      ? placeholder.map((item, i) => {
                          return (
                            <div key={`${item}_${i}`}>
                              {item}
                              {i < placeholder.length - 1 ? "," : ""}
                            </div>
                          );
                        })
                      : placeholder
                    : null,
              })}
            </div>
          )}

          {!iconOnlyMode && isResetAllowed &&(
            <span
              className={Styles["reset-btn"] + " icon tootip-parent"}
              onClick={(event) => resetToDefault(event)}
            >
              {showPhoenixTooltip ? (
                <React.Fragment>
                  <span className="icon_phoenix-close" />
                  <Tooltip
                    customContainerClassName="ml-0 no-iconhover"
                    text="Clear filter"
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {getToolTip({
                    htmlJSX: (
                      <span
                        className={
                          resetValue && isEqual(resetValue, selected)
                            ? "icon-cheveron_open"
                            : "icon_phoenix-close"
                        }
                      />
                    ),
                    tooltipText:
                      resetValue && isEqual(resetValue, selected)
                        ? ""
                        : customClearTip
                        ? customClearTip
                        : "Clear filter",
                  })}
                </React.Fragment>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const getFilterDefaultView = function (config) {
  const self = this;
  const { Styles, allSelected, iconOnlyMode, showCustomIconIninlineMode, customClassForInlineModeIcon, isResetAllowed } = config;
  const {
    size,
    showLeftIcon,
    customLeftIconClass,
    showSelectAllDisplayLabel,
    customSelectedVal,
    inlineMode,
    filterLabelTooltipInfo,
    removeLabelTextTransform,
    customWidthClass,
    iconMode,
    customSelectAllPlaceholder,
    customSelectAllDisplayLabel
  } = self.props;
  const { showDropdown, placeholder } = self.state;
  const { getselectNode, resetToDefault } = self;
  const hasLabelTooltip =
    filterLabelTooltipInfo &&
    filterLabelTooltipInfo.showTooltip &&
    filterLabelTooltipInfo.tooltipJsx;
  const customWidthClassDropDown = showDropdown ? customWidthClass : "";

  return (
    <div
      className={`${Styles["default-filter"]} ${
        showLeftIcon ? Styles["with-icons"] : ""
      } ${showDropdown ? Styles["dropdown-open"] : ""}  ${
        showDropdown ? "dropdown-open" : ""
      } ${
        hasLabelTooltip ? Styles["label-with-tooltip"] : ""
      } ${customWidthClassDropDown}`}
      ref={getselectNode.bind(self)}
    >
      {inlineMode && customSelectedVal ? (
        <span className={Styles["selected-values-wrapper"]}>
          <span className={Styles["selected-values-label"]}>
            {customSelectedVal}
          </span>
          <i className="icon_phoenix-sort" />
        </span>
      ) : iconOnlyMode && !showDropdown ? null : (
        <div>
          {showLeftIcon ? <i className={customLeftIconClass} /> : null}
          {getToolTip({
            htmlJSX: (
              <span>
                <label
                  className={`${Styles["label-top"]} ${
                    removeLabelTextTransform
                      ? Styles["text-transform-none"]
                      : ""
                  }`}
                >
                  {allSelected && showSelectAllDisplayLabel
                    ? customSelectAllPlaceholder || customSelectAllDisplayLabel ||`All selected`
                    : placeholder}
                  {hasLabelTooltip && showDropdown ? (
                    <Popover
                      className="tooltip-popover"
                      customWidth={44}
                      fixed
                      size="large"
                      float="left"
                      custom={<i className="icon_phoenix-question-circle" />}
                      includeBoxShadow
                    >
                      <ul>
                        <li>{filterLabelTooltipInfo.tooltipJsx}</li>
                      </ul>
                    </Popover>
                  ) : null}
                </label>
                {
                  showCustomIconIninlineMode && customClassForInlineModeIcon && allSelected && <i className={customClassForInlineModeIcon} /> 
                }
              </span>
            ),
            tooltipText:
              !showDropdown &&
              placeholder &&
              placeholder.length > (size == "medium" ? 20 : 32)
                ? placeholder
                : null,
          })}
        </div>
      )}
      {!inlineMode && !iconMode && isResetAllowed ? (
        allSelected && showSelectAllDisplayLabel ? (
          <span
            className={Styles["reset-btn"] + " icon tootip-parent"}
            onClick={(event) => resetToDefault(event)}
          >
            {getToolTip({
              htmlJSX: <span className="icon_phoenix-close" />,
            })}
          </span>
        ) : (
         isResetAllowed ? <span className={Styles["reset-btn"] + " icon-cheveron_open"} /> : null
        )
      ) : null}
    </div>
  );
};

/* eslint-enable react/no-multi-comp */
