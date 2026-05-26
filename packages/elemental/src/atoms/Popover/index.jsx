import PropTypes from "prop-types";
import styles from "./popover.module.scss";
import React, { Component } from "react";
import Button from "atoms/Button";
import onClickOutside from "react-onclickoutside";


class Popover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showAfterClick: false
        };
    }

    onMouseEnter() {
        if (this.props.fixed && !this.props.phoenixPos) {
            const rect = this.popOverRef.getBoundingClientRect();
            let top = rect.bottom, left;

            switch (this.props.float) {
                case "right": {
                    left = rect.left;
                    break;
                }
                case "left": {
                    left = rect.right;
                    break;
                }
                default: {
                    left = rect.right;
                    break;
                }
            }

            this.setState({
                left, top, show: true
            });
        }
    }

    getPopOverRef = (ref) => {
        this.popOverRef = ref;
    };

    onMouseLeave() {
        this.setState({
            show: false
        });
    }

    handleScroll() {
        this.setState({
            show: false,
            showAfterClick: false
        });
    }

    componentWillUnmount() {
        const { customScollParent } = this.props;
        const scrollParent = typeof customScollParent === "function" ? customScollParent() : customScollParent; 
        const scrollableCont = scrollParent ? scrollParent : window;

        scrollableCont.removeEventListener("scroll", this.handleScroll.bind(this));
    }

    componentDidMount() {
        const { customScollParent } = this.props;
        const scrollParent = typeof customScollParent === "function" ? customScollParent() : customScollParent; 
        const scrollableCont = scrollParent ? scrollParent : window;

        scrollableCont.addEventListener("scroll", this.handleScroll.bind(this));
    }

    getPopUpHeight(liCount) {
        let popupHeight;
        if (liCount >  5 ) {
            popupHeight = 240;
        } else if (liCount ==  5 ) {
            popupHeight = 210;
        } else if (liCount == 4) {
            popupHeight = 180;
        } else if (liCount == 3) {
            popupHeight = 120;
        } else if (liCount == 2) {
            popupHeight = 95;
        }
        return popupHeight;
    }

    onMouseClickFn = (event) => {
        // Calculate the position of the clicked column relative to the viewport
        const clickedColumn = event.target;
        const columnRect = clickedColumn.getBoundingClientRect();
        const columnTop = columnRect.top;
        const columnBottom = columnRect.bottom;

        const rect = this.popOverRef.getBoundingClientRect();
        if (this.props.fixed && !this.props.phoenixPos) {
            let top = rect.bottom, left;

            switch (this.props.float) {
                case "right": {
                    left = rect.left;
                    break;
                }
                case "left": {
                    left = rect.right;
                    break;
                }
                default: {
                    left = rect.right;
                    break;
                }
            }

            if (this.props.calculatePopoverPosition) {
                //available space above and below the clicked column
                const spaceBelow = window.innerHeight - columnBottom;
                const liCount = parseInt(clickedColumn.getAttribute("liCount") || clickedColumn.getAttribute("data-liCount"));
                // height of the popup
                let popupHeight = this.getPopUpHeight(liCount);
                if (spaceBelow > popupHeight) {
                    // There is enough space below, position the popup below the clicked column
                    top = columnBottom;
                } else {
                    // Position the popup above the clicked column
                    top = columnTop - popupHeight;
                }
            }

            this.setState({
                left, top, showAfterClick: true
            });
        } else if (this.props.fixed && this.props.phoenixPos) {
            let top = rect.top, left;
            switch (this.props.float) {
                case "right": {
                    left = rect.right;
                    break;
                }
                case "left": {
                    left = rect.left;
                    break;
                }
                default: {
                    left = rect.left;
                    break;
                }
            }

            this.setState({
                left, top, showAfterClick: true
            });
        }
        this.props.onMouseClick(event);
    };

    handleClickOutside = (event) => {
        const { onClickOutside } = this.props;
        onClickOutside && onClickOutside(event, this.state.showAfterClick);
        this.setState({
            showAfterClick: false
        });
    };

    getSize = () => {
        let { size } = this.props;
        let sizeClass = "popover-";
        switch (size) {
            case "small":
                sizeClass += "small";
                break;
            case "medium":
                sizeClass += "medium";
                break;
            case "large":
                sizeClass += "large";
                break;
            case "m-large":
                sizeClass += "medium-large";
                break;
            case "x-large":
                sizeClass += "xlarge";
                break;
            case "xx-large":
                sizeClass += "xxlarge";
                break;
            default:
                sizeClass = "";
        }
        return sizeClass;
    };

    render() {
        const { top, left, show, showAfterClick } = this.state;
        const { custom, fixed, customWidth, showOnClick, enableClick, customHTML, showBtnIcon, toggleShownMenu, inTable, actionLabel = "Actions", size, customClick, customTopPosition, customLeftPosition, phoenixPos, includeBoxShadow, disabledAction, tooltipText, onClickStatus, customId, hideOnScroll, noHover, removeTransformPosition } = this.props;
        const { onMouseEnter, getPopOverRef, onMouseLeave, onMouseClickFn } = this;
        const sizeClass = this.getSize(size);
        if (enableClick) {
            return (
                <span className={`el-popover-main-wrap ss ${removeTransformPosition ? styles["remove-transform-position"] : ""} ${styles.popover} ${styles[this.props.float] || styles.left} ${fixed ? " " + styles.fixed : ""} ${styles[sizeClass]} ${includeBoxShadow ? " " + styles["popover-shadow"] : ""} ${noHover ? styles["no-hover"] : ""} ${this.props.className}`} ref={getPopOverRef}>
                    {(showOnClick && !showBtnIcon) && <div className={`${styles['cover-it']}`} onClick={toggleShownMenu} />}

                    {custom ? <span className="inline-block" onClick={customClick ? (event) => onMouseClickFn.call(this, event) : () => { }}>{custom}</span> : showBtnIcon ? <Button
                        className={"action-Btn"}
                        label={<span onClick={onClickStatus ? (event) => onMouseClickFn.call(this, event) : () => {}} style={{ cursor: onClickStatus ? "pointer" : "default" }} id={customId}>{actionLabel} {!onClickStatus && <i className={`icon-cheveron_open ${disabledAction ? "disabled-icon" : ""}`} id={customId} />}
                        </span>}
                        type={"secondary"}
                        onClick={!disabledAction ? (event) => onMouseClickFn.call(this, event) : null}
                        disabled={disabledAction}
                        tooltip={tooltipText ? tooltipText : null}
                        id={customId}
                    />
                        : <i className={`${this.props.icon || "icon-download icon"} ${styles['dots-icon']}`} id="user-profile-icon"
                        style={this.props.style} onClick={(event) => onMouseClickFn.call(this, event)} onBlur={this.onBlur} />}

                    {
                        (fixed && showOnClick && showAfterClick && !phoenixPos) ? <style jsx="true">{`
                        .${styles.fixed} > ul {
                            top: ${top - 39 - (customTopPosition || 0)}px !important;
                            left: calc(${left - 63 - (customLeftPosition || 0)}px - ${!this.props.float || this.props.float === "left" ? ((customWidth ? customWidth : 179) + "px") : "0px"}) !important;
                        }
                    `}</style> : (fixed && showOnClick && showAfterClick && phoenixPos) ? <style jsx="true">{`
                    .${styles.fixed} > ul {
                        top: ${top}px !important;
                        left: ${left}px !important;
                    }
                `}</style> : ""
                    }

                    {
                        inTable ? (showOnClick && showAfterClick) && this.props.children : showOnClick && this.props.children
                    }

                </span>
            );
        } else {
            return (
                <span
                    ref={getPopOverRef}
                    onMouseEnter={onMouseEnter.bind(this)}
                    onMouseLeave={onMouseLeave.bind(this)}
                    className= {`el-popover-main-wrap ${styles.popover} ${
                        styles[this.props.float] || styles.left
                      } ${fixed ? " " + styles.fixed : ""} ${styles[sizeClass]} ${
                        includeBoxShadow ? " " + styles["popover-shadow"] : ""
                      } ${this.props.className}`}
                    // className={this.props.className}
                >
                    {customHTML ? <div dangerouslySetInnerHTML={{ __html: customHTML }} /> : null}
                    {
                        custom ? custom : !customHTML ?
                            <i className={`${this.props.icon || "icon-download icon"} ${styles['dots-icon']}`}
                                style={this.props.style} onMouseOver={this.props.onMouseOver || null} /> : null
                    }
                    {
                        fixed && show && !phoenixPos && <style jsx="true">{`
                        .${styles.fixed} > ul {
                            top: ${top}px !important;
                            left: calc(${left}px - ${!this.props.float || this.props.float === "left" ? ((customWidth ? customWidth : 179) + "px") : "0px"}) !important;
                        }
                    `}</style>
                    }
                    {hideOnScroll ? show && this.props.children : this.props.children}
                </span>
            );
        }
    }
}

Popover.propTypes = {
    custom: PropTypes.element,
    children: PropTypes.element,
    className: PropTypes.string,
    float: PropTypes.string,
    actionLabel: PropTypes.string,
    icon: PropTypes.string,
    style: PropTypes.object,
    onMouseClick: PropTypes.func,
    toggleShownMenu: PropTypes.func,
    showOnClick: PropTypes.bool,
    enableClick: PropTypes.bool,
    showBtnIcon: PropTypes.bool,
    fixed: PropTypes.bool,
    customWidth: PropTypes.number,
    onMouseOver: PropTypes.func,
    customHTML: PropTypes.node,
    inTable: PropTypes.bool,
    size: PropTypes.string,
    customClick: PropTypes.bool,
    customTopPosition: PropTypes.number,
    customScollParent: PropTypes.any,
    phoenixPos: PropTypes.bool,
    includeBoxShadow: PropTypes.bool,
    disabledAction: PropTypes.bool,
    tooltipText: PropTypes.string,
    onClickStatus: PropTypes.bool,
    customLeftPosition: PropTypes.number,
    calculatePopoverPosition: PropTypes.bool,
    customId: PropTypes.string,
    onClickOutside: PropTypes.func,
    hideOnScroll: PropTypes.bool,
    noHover: PropTypes.bool,
    removeTransformPosition: PropTypes.bool
};

Popover.defaultProps = {
    float: "left",
    phoenixPos: false,
    disabledAction: false,
    onClickStatus: false,
    noHover: false
};
export default onClickOutside(Popover);