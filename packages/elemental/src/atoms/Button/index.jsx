import React from "react";
import "./Button_global.scss";
import style from  "./Button.module.scss";
import cx from "classnames";
import FileButton from "./FileButton";
import PropTypes from "prop-types";
import Tooltip from "atoms/Tooltip";
import { createRippleEffect } from "utils";

let validThemes = [
  "primary",
  "secondary",
  "link",
  "super",
  "danger",
  "danger-primary",
  "noBorder",
  "errorlink",
  "secondary-link"
];
// let validSizes = ["small", "default", "l", "xl"];    "not using this styling on UI-web too"

function Button(props) {
  let {
    className,
    onClick,
    label,
    children,
    disabled,
    type,
    expanded,
    width,
    theme,
    size,
    tooltip,
    icon,
    showCount,
    customIcon,
    id,
    noHover,
    iconClick,
    smallIcon,
    errorTooltipText,
    hideTextTablet,
    errorClassName,
    steppersBack,
    bold,
    endIcon,
    isAeroDesign,
    "data-testid": dataTestId,
  } = props;

  if (validThemes.indexOf(type) != -1) {
    //console.warn("Use theme attribute to specify styling; Valid themes are " + validThemes);
    theme = type;
    type = null;
  }

  // if (size && validSizes.indexOf(size) == -1) {
  //   size = "default";
  // }        "not using this styling on UI-web too"

  const bDisplayCount = showCount >= 0;

  const finalClassName = cx({
    [style["react-button"]]: true,
    [style.expanded]: expanded,
    [style.disabled]: disabled,
    "el-button-disabled": disabled,
    ['el-button-'+theme]: true,
    [style[theme]]: true,
    [style[size]]: true
  });

  if (type == "file") {
    return <FileButton {...props} />;
  }

  const btnn = (
    <button
      style={{ width }}
      type={type}
      onClick={(e) => {
        !disabled && createRippleEffect(e, onClick);
      }}
      className={`${isAeroDesign ? "ds-button-secondary" : ""} myRipple ${finalClassName} ${className} ${
        errorTooltipText ? style["error-border"] : ""
      } ${icon ? style["with-icon"] : ""} ${
        smallIcon ? style["small-icon"] : ""
      } ${bDisplayCount ? style["show-bubble"] : ""} ${
        noHover ? style["no-hover"] : ""
      } ${hideTextTablet ? style["hide-text"] : ""} ${
        bold ? style[bold] : ""
      } ${steppersBack ? "steppersBackBtn" : ""}`}
      disabled={disabled}
      id={id}
      data-testid={dataTestId || "el-test-button"}
    >
      {customIcon
        ? customIcon
        : icon && (
            <i
              onClick={(e) => {
                icon && iconClick && iconClick(e);
              }}
              className={`${style['button-icon']} ${theme == "link" ? style["link-icon"] : ""} ${icon} ${label || children ? "" : "mr-0"}`}
            />
          )}
      <span>{label || children}</span>
      {endIcon || null}
      {bDisplayCount ? (
        <span className={`badges ${style.bubble}`}>
          {showCount}
        </span>
      ) : (
        ""
      )}
      {errorTooltipText && (
        <Tooltip
          text={errorTooltipText}
          position={"bottom"}
          hideOnScroll
          customContainerClassName={errorClassName ? errorClassName : ""}
        >
          <span>
            <i className={`icon icon_phoenix-warning-fill ${icon ? style["error-with-icon"] : style['error-icon']}`} />
          </span>
        </Tooltip>
      )}
    </button>
  );

  return tooltip && (tooltip.text || tooltip.linkText) ? (
    <Tooltip
      text={tooltip.linkText ? null : tooltip.text}
      position={tooltip.position || "bottom"}
      hideOnScroll
      customContainerClassName={tooltip.customContainerClassName || ""}
      mouseOver={tooltip.mouseOver || false}
      customHTML={tooltip.customToolTipHTML}
      delta={tooltip.delta}
      getScrollParent={tooltip.getScrollParent ? tooltip.getScrollParent : null}
      disableOnTablets={tooltip.disableOnTablets}
      align={tooltip.align || ""}
      linkText={tooltip.linkText}
      size={tooltip?.size || null}
      onClick={tooltip.onClick}
    >
      {btnn}
    </Tooltip>
  ) : (
    btnn
  );
}

Button.defaultProps = {
  theme: "primary",
};

Button.propTypes = {
  type: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  label: PropTypes.string,
  expanded: PropTypes.bool,
  width: PropTypes.number,
  theme: PropTypes.oneOf(validThemes),
  // size: PropTypes.oneOf(validSizes),        "not using this styling on UI-web too"
  className: PropTypes.string,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  smallIcon: PropTypes.string,
  customIcon: PropTypes.node,
  showCount: PropTypes.number,
  id: PropTypes.string,
  noHover: PropTypes.bool,
  iconClick: PropTypes.func,
  errorTooltipText: PropTypes.string,
  hideTextTablet: PropTypes.bool,
  errorClassName: PropTypes.string,
  steppersBack: PropTypes.bool,
  bold: PropTypes.string,
  endIcon: PropTypes.node,
  isAeroDesign: PropTypes.bool,
  dataTestId: PropTypes.string,
};

export default Button;
