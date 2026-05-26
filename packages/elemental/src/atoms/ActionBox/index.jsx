import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import Tooltip from "atoms/Tooltip";
import Toggle from "atoms/Toggle";
import onClickOutside from "react-onclickoutside";
import TabHeader from "atoms/TabHeader";
import { isEqual, isEmpty } from "lodash";
import { getEncodedStyleClass, msieversion } from "utils";

const getDataTestIdFromOption = (option, optKey, parentUlTestid) => {
  const explicitTestId = option?.["data-testid"];

  if (explicitTestId) {
    return explicitTestId;
  }

  const optionIdentifier = option?.id || option?.tagId;

  if (optionIdentifier) {
    return `${parentUlTestid}-${optionIdentifier}`;
  }

  if (typeof option?.label === "string" && option.label.trim() !== "") {
    return `${parentUlTestid}-${option.label.trim().replace(/\s+/g, "-").toLowerCase()}`;
  }

  return `${parentUlTestid}-${optKey}`;
};

class ActionBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActionListDisplayed: props.openOnPgLoad || false,
      popOverDirection: props.popOverDirection,
      portalRect: null,
    };
    this.actionsAvailable = false;
    this.isIEBrowser = msieversion();
    this._portalRafId = null;
  }

  componentWillUnmount() {
    this.detachPortalListeners();
  }

  attachPortalListeners = () => {
    window.addEventListener("scroll", this.handlePortalReposition, true);
    window.addEventListener("resize", this.handlePortalReposition);
  };

  detachPortalListeners = () => {
    window.removeEventListener("scroll", this.handlePortalReposition, true);
    window.removeEventListener("resize", this.handlePortalReposition);
    if (this._portalRafId) {
      cancelAnimationFrame(this._portalRafId);
      this._portalRafId = null;
    }
  };

  handlePortalReposition = () => {
    if (this._portalRafId) return;
    this._portalRafId = requestAnimationFrame(() => {
      this._portalRafId = null;
      this.updatePortalRect();
      this.computePortalDirection();
    });
  };

  updatePortalRect = () => {
    if (!this.actionBoxRef) return;
    const r = this.actionBoxRef.getBoundingClientRect();
    this.setState({
      portalRect: {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      },
    });
  };

  // Viewport-aware flip for the fixed-positioning path. Runs only when
  // `usePortal` is on. Picks a direction class that keeps the popover inside
  // the viewport, falling back to the consumer's `popOverDirection` prop when
  // there's enough room.
  computePortalDirection = () => {
    if (!this.props.usePortal || !this.actionBoxRef) return;
    const popEl = this.actionBoxRef.querySelector(`.${styles["popover"]}`);
    if (!popEl) return;
    const anchor = this.actionBoxRef.getBoundingClientRect();
    const ph = popEl.offsetHeight;
    const pw = popEl.offsetWidth;
    const vpH = window.innerHeight;
    const vpW = window.innerWidth;
    const base = this.props.popOverDirection || "";

    // Vertical flip: not enough space below and more room above.
    const spaceBelow = vpH - anchor.bottom;
    const spaceAbove = anchor.top;
    const flipV = spaceBelow < ph && spaceAbove > spaceBelow;

    // Horizontal alignment: default + `.left`/`.top-left` align right edge of
    // popover to anchor (extends left); `.right`/`.top-right`/`.bottom-right`
    // align left edge to anchor (extends right).
    const baseHorizontal = base.includes("right")
      ? "right"
      : base.includes("left") || base === ""
      ? "left"
      : null;

    let horizontal = baseHorizontal;
    if (horizontal === "left") {
      // right-aligned => predicted left edge = anchor.right - pw
      if (anchor.right - pw < 0) horizontal = "right";
    } else if (horizontal === "right") {
      if (anchor.left + pw > vpW) horizontal = "left";
    }

    let direction;
    if (flipV) {
      direction = horizontal ? `top-${horizontal}` : "top";
    } else if (base.startsWith("bottom-")) {
      direction = horizontal === "right" ? "bottom-right" : base;
    } else {
      direction = horizontal || base;
    }

    if (direction !== this.state.popOverDirection) {
      this.setState({ popOverDirection: direction });
    }
  };

  UNSAFE_componentWillMount() {
    const {
      actionConfig: { categories },
    } = this.props;
    for (let i = 0; i < categories.length; i++) {
      if (this.checkifActionCategoryEnable(categories[i])) {
        this.actionsAvailable = true;
        return;
      }
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      actionConfig: { categories },
      popOverDirection,
    } = newProps;
    if (!isEqual(categories, this.props.actionConfig.categories)) {
      for (let i = 0; i < categories.length; i++) {
        if (this.checkifActionCategoryEnable(categories[i])) {
          this.actionsAvailable = true;
          return;
        }
      }
    }
    if (this.props.appointmentPopOverDirection) {
      this.setState({ popOverDirection });
    }
  }

  toggleActionsList = (isActionListDisplayed) => {
    this.setState(
      {
        isActionListDisplayed,
      },
      () => {
        let { popOverDirection } = this.state;
        let {
          openBasedOnWindowHeight,
          scrollActionBoxIntoView,
          toggleQuickSend,
          scrollActionBoxBehaviour,
          containerRef,
          usePortal,
        } = this.props;
        const { actionBoxRef, scrollAnchorRef, isIEBrowser } = this;
        toggleQuickSend && toggleQuickSend(isActionListDisplayed);
        if (usePortal) {
          if (isActionListDisplayed) {
            this.updatePortalRect();
            this.attachPortalListeners();
            // Defer direction calc until popover mounts.
            requestAnimationFrame(() => this.computePortalDirection());
          } else {
            this.detachPortalListeners();
            this.setState({
              portalRect: null,
              popOverDirection: this.props.popOverDirection,
            });
          }
        }
        // Skip the legacy container-aware flip for usePortal consumers: the
        // fixed-positioning path owns its own viewport-aware flip via
        // computePortalDirection.
        if (isActionListDisplayed && openBasedOnWindowHeight && !usePortal) {
          try {
            let actionBoxRefBoundingRect = actionBoxRef.getBoundingClientRect();
            let actionBoxY =
              actionBoxRefBoundingRect.y || actionBoxRefBoundingRect.top;
            let listHeight = actionBoxRef.querySelector(
              `.${styles["popover"]}`
            ).clientHeight;

            // Container-aware logic
            let containerRect = null;
            if (containerRef && containerRef.current) {
              containerRect = containerRef.current.getBoundingClientRect();
            }
            let availableHeight;
            if (containerRect) {
              // Calculate available space from button to bottom of container
              availableHeight = containerRect.bottom - actionBoxY;
            } else {
              // Fallback to window
              availableHeight = window.innerHeight - actionBoxY;
            }

            if (availableHeight < listHeight) {
              popOverDirection = this.props.popOverDirection
                ? `top-${this.props.popOverDirection}`
                : "top";
            } else {
              popOverDirection = this.props.popOverDirection;
            }
            this.setState({ popOverDirection });
          } catch (e) {
            // log(e);
          }
        }
        if (scrollAnchorRef && scrollActionBoxIntoView) {
          !isIEBrowser &&
            scrollAnchorRef.scrollIntoView({
              behavior: "smooth",
              block: scrollActionBoxBehaviour || "end",
            });
        }
      }
    );

    const { customFunOnClickActionBox = false } = this.props;
    if (customFunOnClickActionBox && isActionListDisplayed) {
      customFunOnClickActionBox(isActionListDisplayed);
    }
  };

  checkifActionCategoryEnable = (category) => {
    let ifCategoryEnabled = false;
    if (!isEmpty(category.options)) {
      category.options.forEach((option) => {
        if (option.enable) {
          ifCategoryEnabled = true;
        }
      });
    }
    return ifCategoryEnabled;
  };

  handleClickOutside = (e) => {
    const isInsideClick = this.actionBoxRef?.contains(e.target);
    if (this.state.isActionListDisplayed && !isInsideClick) {
      this.toggleActionsList(false);

      const { customFunOnClickOutSide = null } = this.props;
      customFunOnClickOutSide && customFunOnClickOutSide();
    }
  };

  callMouseOver = (evt, index) => {
    const { scrollWidth, clientWidth } = evt.currentTarget;

    if (scrollWidth > clientWidth) {
      this.setState({
        [`tt-${index}`]: scrollWidth > clientWidth,
      });
    }
  };

  renderActionsList = (renderScrollAnchor) => {
    const {
      actionConfig,
      actionClickCb,
      tabOnTopData,
      headerOnTop,
      popOverSize = "",
      from,
      selectedVal,
      hideTT,
      selectedChild,
    } = this.props;
    const { isActionListDisplayed, popOverDirection = "" } = this.state;
    const { getLabelWithTooltip } = this;
    const mainBoxTestId = this.props["data-testid"] || "el-test-actionbox-list-container";
    const htmlJSX = (
      <ul
        data-testid={mainBoxTestId}
        className={`${
          !isActionListDisplayed ? "hide" : ""
        } el-actionbox-list-container paymentcard-list ${styles["popover"]} ${
          styles[popOverSize]
        } ${styles[popOverDirection]} ${from ? styles["header"] : ""}`}
      >
        {tabOnTopData && tabOnTopData.enable && (
          <TabHeader
            content={tabOnTopData.tabs}
            clickTab={(val, e) => {
              e.stopPropagation();
              tabOnTopData.clickCallback(val);
            }}
            activeTab={tabOnTopData.activeTab}
            customClass={tabOnTopData.customClass}
            noSeperator
          />
        )}
        {headerOnTop && (
          <div className={`${styles["popover-head"]}`}>{headerOnTop}</div>
        )}
        {actionConfig.categories.map((category, categoryIndex) => {
          const ifCategoryEnabled = this.checkifActionCategoryEnable(category);
          const parentUlTestid = category?.["data-testid"] || `${mainBoxTestId}-group-${(typeof category.title === "string" && category?.title) ? category?.title?.toLowerCase() : categoryIndex}`;
          let categoryJSX = ifCategoryEnabled ? (
            <li
              key={categoryIndex} className={`el-actionbox-popover-listing ${styles["popover-listing"]}`}
            >
              {category.title ? <h4>{category.title}</h4> : null}
              <ul data-testid={parentUlTestid}>
                {category.options.map((option, optKey) => {
                  const {
                    callBack,
                    label,
                    tooltip,
                    showToggle,
                    toggleValue,
                    enable,
                    showBold,
                    fullRowNotClickable = false,
                    icon,
                    withSeparator,
                    className,
                    disabled,
                    tooltipOnLabel,
                    iconInsideTooltip,
                    value,
                    img,
                    disablePropagationToParent = false
                  } = option;
                  const selectionVal = option.selectionVal || value;
                  return enable ? (
                    <React.Fragment key={optKey}>
                      <li
                        key={optKey}
                        onClick={(e) => {
                          if (!disabled) {
                            if(disablePropagationToParent){
                              e.stopPropagation();
                            } else {
                              if (fullRowNotClickable) {
                              e.stopPropagation();
                              if (!showToggle) {
                                this.toggleActionsList(!isActionListDisplayed);
                              }
                            } else {
                                if ((option?.subTypes && option?.subTypes?.length > 0) && (selectedVal && selectedVal !== selectionVal)) {
                                    e.stopPropagation();
                                    actionClickCb(option);
                                    this.toggleActionsList(true);
                                } else if((option?.subTypes && option?.subTypes?.length > 0) && (selectedVal && selectedVal === selectionVal)){
                                    e.stopPropagation();
                                    this.toggleActionsList(true);
                                } 
                                else { 
                                    actionClickCb(option); 
                                }
                            }
                            }
                            
                          }
                        }}
                        className={`ellipses${
                          fullRowNotClickable ? "cursor-default" : ""
                        } ${className} ${
                          withSeparator ? styles["with-separator"] : ""
                        } ${disabled ? styles["disabled-option"] : ""}
                        ${option?.subtext != null ? styles["subtext-option"] : ""}`}
                        onMouseOver={(event) =>
                          this.callMouseOver(event, optKey)
                        }
                        data-testid={getDataTestIdFromOption(option, optKey, parentUlTestid)}
                        id={option.tagId ? option.tagId : ""}
                      >
                        {icon && !iconInsideTooltip && <i className={icon} />}
                        {img && !iconInsideTooltip && <img src={img} />}
                        {tooltipOnLabel &&
                          tooltipOnLabel.isVisible &&
                          getLabelWithTooltip(option)}
                        {(tooltipOnLabel ? !tooltipOnLabel.isVisible : true) &&
                          (showBold ? (
                            <strong>
                              <span>
                                {label}
                                {selectedVal && selectedVal == selectionVal && (
                                  <span className="pull-right">
                                    <i className=" icon_phoenix-checkmark" />
                                  </span>
                                )}
                              </span>
                            </strong>
                          ) : (
                            <span className={`${option?.subtext != null ? styles["sub-text-wrapper"] : ""}`}>
                              {label}
                              {option?.subtext != null && <div className={`${styles["sub-text"]}`}>{option?.subtext}</div>}
                              {selectedVal && selectedVal == selectionVal && (
                                <span className="pull-right">
                                  {option?.subTypes && option.subTypes.length > 0 ? 
                                  "" : <i className=" icon_phoenix-checkmark" />}
                                </span>
                              )}
                              {option?.subTypes && option.subTypes.length > 0 && 
                                <span className="pull-right">
                                  <i className="  icon_phoenix-cheveron_open" />
                                </span>}
                            </span>
                          ))}

                        {tooltip && tooltip.isVisible && (
                          <span className={styles["tooltip-wrapper"]}>
                            <Tooltip
                              tooltipClass="inner"
                              size={tooltip.size}
                              text={tooltip.tooltipText}
                            >
                              <i className={tooltip.iconClass} />
                            </Tooltip>
                          </span>
                        )}
                        {showToggle && (
                          <Toggle
                            name="isOpen"
                            checked={toggleValue}
                            _onChange={callBack}
                            className="ml-15"
                          />
                        )}
                        {/* Tooltip when ellipsis is shown */}
                        {this.state[`tt-${optKey}`] && !hideTT && (
                          <span className="no-icon-tooltip">
                            <Tooltip
                              tooltipClass="inner"
                              //size={tooltip.size}
                              text={label}
                              position="left"
                            >
                              <i className="" />
                            </Tooltip>
                          </span>
                        )}
                      </li>
                      {selectedVal === option.selectionVal &&
                        option?.subTypes &&
                        option?.subTypes.length > 0 && (
                          <ul className={styles["options-children-list"]}>
                            {option?.subTypes.map((sub, subIndex) => (
                              <li
                                key={`sub-${subIndex}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  actionClickCb(option.selectionVal,sub);
                                }}
                                className={`ellipses${
                                  fullRowNotClickable ? "cursor-default" : ""
                                } ${className} ${
                                  withSeparator ? styles["with-separator"] : ""
                                }`}
                                onMouseOver={(event) =>
                                  this.callMouseOver(event, sub)
                                }
                                id={sub}
                              >
                                <span>
                                  {sub}
                                  {selectedChild &&
                                    selectedChild == sub && (
                                      <span className="pull-right">
                                        <i className=" icon_phoenix-checkmark" />
                                      </span>
                                    )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                    </React.Fragment>
                  ) : null;
                })}
              </ul>
            </li>
          ) : null;
          return categoryJSX;
        })}
        {renderScrollAnchor && (
          <a ref={(ref) => (this.scrollAnchorRef = ref)} />
        )}
      </ul>
    );
    return htmlJSX;
  };

  getLabelWithTooltip = (option) => {
    const { label, tooltipOnLabel, showBold, icon, iconInsideTooltip } = option;

    return (
      <div className={`${option?.subtext != null ? styles["sub-text-wrapper"] : ""}`}>
      <Tooltip
        tooltipClass="inner"
        text={tooltipOnLabel.tooltipText}
        position={tooltipOnLabel.position ? tooltipOnLabel.position : "bottom"}
        customContainerClassName={`display-block ${tooltipOnLabel.customContainerClassName}`}
      >
        {icon && iconInsideTooltip && <i className={icon} />}
        {showBold ? (
          <strong>
            <span>{label}</span>
            {option?.subtext != null && <div className={`${styles["sub-text"]}`}>{option?.subtext}</div>}
          </strong>
        ) : (<>
          <span>{label}</span>
          {option?.subtext != null && <div className={`${styles["sub-text"]}`}>{option?.subtext}</div>}
          </>
        )}
      </Tooltip>
      </div>
    );
  };


  // In-tree fixed-positioning path. Keeps the popover as a DOM descendant of
  // the anchor (and therefore of the row), so `:hover` state, `mouseenter` /
  // `mouseleave` on ancestors, and any consumer CSS keyed off `tr:hover`
  // continue to fire while the cursor is on the popover. Avoids overflow
  // clipping from ancestor scroll containers because `position: fixed`
  // resolves to the viewport (assumes no ancestor has transform / filter /
  // will-change / contain — handled at the TableGrid scss level by not using
  // `transform` on `.row-action-wrapper`).
  renderPortaledActionList = () => {
    const { portalRect } = this.state;
    if (!portalRect) return null;
    const wrapperStyle = {
      position: "fixed",
      top: portalRect.top,
      left: portalRect.left,
      width: portalRect.width,
      height: portalRect.height,
      pointerEvents: "none",
      zIndex: 1000,
    };

    // Inline style neutralizes anchor visuals so the wrapper stays invisible
    // and doesn't intercept hover/click on the underlying trigger.
    // const scopeStyle = {
    //   pointerEvents: "none",
    //   position: "relative",
    //   width: "100%",
    //   height: "100%",
    //   margin: 0,
    //   border: 0,
    //   padding: 0,
    //   background: "transparent",
    //   float: "none",
    //   cursor: "default",
    //   boxShadow: "none",
    // };
    return (
      <div
        className="el-actionbox-portal-wrapper"
        style={wrapperStyle}
      >
        <div style={{}}>
          <div
            style={{ pointerEvents: "auto" }}
            data-testid="el-test-actionbox-portal"
          >
            {this.renderActionsList()}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { isActionListDisplayed } = this.state;
    const {
      ActionLabel,
      disabled,
      customSelectionJsx,
      customClass,
      customClassName = "",
      removeWrapperStyling,
      actionBoxOpenCustomClass = "",
      isBlueActionBox,
      openBasedOnWindowHeight,
      scrollActionBoxIntoView,
      customHeaderClassName = "",
      noLabel = false,
      overrideDefault,
      customDropdownIcon = "icon-cheveron_open",
      isAeroDesign,
      usePortal,
    } = this.props;
    const bAlwaysRenderActionList =
      scrollActionBoxIntoView || openBasedOnWindowHeight;
    const portalActive = usePortal && isActionListDisplayed;

    if (this.actionsAvailable) {
      return (
        <div
          className={`action-wrap ${isAeroDesign ? "ds-button-secondary" : ""} ${
            disabled ? `${styles["cursor-disable"]} cursor-disable` : ""
          } ${customClassName} ${
            isActionListDisplayed ? actionBoxOpenCustomClass : ""
          } ${customHeaderClassName} ${
            getEncodedStyleClass(customClass, styles) || ""
          } ${
            isActionListDisplayed
              ? styles["action-box"] + " " + styles["action-open"]
              : styles["action-box"]
          } ${isBlueActionBox ? styles["blue-action-box"] : ""} ${
            removeWrapperStyling ? styles["remove-wrap-style"] : ""
          }`}
          ref={(ref) => (this.actionBoxRef = ref)}
          onClick={(e) => {
            if (overrideDefault) {
              e.preventDefault();
              e.stopPropagation();
            }
            return disabled
              ? null
              : this.toggleActionsList.call(this, !isActionListDisplayed);
          }}
        >
          <span
            className={`el-actionbox-popover-container ${styles["popover-container"]} ${styles["popover-text"]}`}
          >
            {customSelectionJsx ? (
              customSelectionJsx
            ) : (
              <div className="paymentcard-wrapper el-actionbox-label-container">
                {noLabel ? "" : ActionLabel ? ActionLabel : "Actions"}{" "}
                <i className={customDropdownIcon} />
              </div>
            )}
            {!portalActive && !bAlwaysRenderActionList &&
              isActionListDisplayed &&
              this.renderActionsList()}
            {!portalActive && bAlwaysRenderActionList &&
              this.renderActionsList(bAlwaysRenderActionList)}
            {portalActive && this.renderPortaledActionList()}
          </span>
        </div>
      );
    } else {
      return null;
    }
  }
}

ActionBox.propTypes = {
  actionConfig: PropTypes.object,
  actionClickCb: PropTypes.func,
  ActionLabel: PropTypes.string,
  disabled: PropTypes.bool,
  customSelectionJsx: PropTypes.node,
  customClass: PropTypes.string,
  tabOnTopData: PropTypes.object,
  openOnPgLoad: PropTypes.bool,
  customClassName: PropTypes.string,
  removeWrapperStyling: PropTypes.bool,
  popOverSize: PropTypes.string, // medium
  popOverDirection: PropTypes.string, // right
  actionBoxOpenCustomClass: PropTypes.string, // right
  headerOnTop: PropTypes.node,
  isBlueActionBox: PropTypes.bool,
  openBasedOnWindowHeight: PropTypes.bool,
  scrollActionBoxIntoView: PropTypes.bool,
  customHeaderClassName: PropTypes.string,
  from: PropTypes.string,
  toggleQuickSend: PropTypes.func,
  selectedVal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noLabel: PropTypes.bool,
  appointmentPopOverDirection: PropTypes.bool,
  hideTT: PropTypes.bool,
  scrollActionBoxBehaviour: PropTypes.string,
  overrideDefault: PropTypes.bool,
  customFunOnClickOutSide: PropTypes.func,
  customFunOnClickActionBox: PropTypes.func,
  customDropdownIcon: PropTypes.string,
  selectedChild: PropTypes.string,
  isAeroDesign: PropTypes.bool,
  /**
   * Ref to the scrollable container (e.g., table body) for container-aware popover positioning
   */
  containerRef: PropTypes.object,
  /**
   * When true, render the popover in-tree inside a `position: fixed` wrapper
   * positioned from the trigger's rect. The popover escapes ancestor
   * `overflow: auto/hidden` clipping (e.g. table scroll containers) but stays
   * a DOM descendant of the trigger, so ancestor `:hover`, `mouseenter` /
   * `mouseleave`, and consumer `tr:hover` rules keep working while the cursor
   * is on the popover.
   *
   * Requires no ancestor of the trigger to create a containing block via
   * `transform`, `filter`, `will-change`, `contain`, or `perspective`.
   */
  usePortal: PropTypes.bool,
  /**
   * Optional test ID for the action box container.
   */
  "data-testid": PropTypes.string,
};

export default onClickOutside(ActionBox);