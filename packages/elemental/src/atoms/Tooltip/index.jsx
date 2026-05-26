import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import style from "./tooltip.module.scss";
import "./tooltip_global.scss"
import { isTabletDevice } from "utils";

const getStyle = classname => style[classname] || "";

class Tooltip extends Component {
    constructor(props) {
        super(props);
        this.tooltipClass = cx(style["tooltip"], {
            [style["tooltip__white"]]: this.props.theme == "white",
            [style["tooltip__red"]]: this.props.theme == "red"
        });
        this.state = {
        };
    }

    onMouseOver = () => {
        let { tooltipMargin, delta, deltaRight = 0, deltaLeft = 0, parentContainerRef, avoidParentContainerOverlap, dynamicTooltipHeight, tooltipHeight } = this.props;
        const rect = this.tooltip.getBoundingClientRect();
        let top, left;
        switch (this.props.position) {
            case "right": {
                top = rect.top - (-rect.height + this.tooltipText.scrollHeight) / 2;
                left = rect.right + tooltipMargin + deltaRight;
                break;
            }
            case "left": {
                top = rect.top - (-rect.height + this.tooltipText.scrollHeight) / 2;
                left = rect.left - this.tooltipText.scrollWidth - tooltipMargin + 10 + deltaLeft; //10 is added as no tip is there in new tooltip
                break;
            }
            case "top": {
                top = rect.top - tooltipMargin - (dynamicTooltipHeight ? tooltipHeight : this.tooltipText.scrollHeight);
                left = rect.left + (rect.width - this.tooltipText.scrollWidth) / 2;
                break;
            }
            case "bottom": {
                top = rect.bottom + tooltipMargin;
                left = rect.left + (rect.width - this.tooltipText.scrollWidth) / 2;
                break;
            }
            case "top-right": {
                top = rect.top - tooltipMargin - this.tooltipText.scrollHeight;
                left = rect.left - this.tooltipText.scrollWidth - tooltipMargin + delta;
                break;
            }
            case "bottom-right": {
                top = rect.bottom + tooltipMargin;
                left = rect.right - this.tooltipText.scrollWidth;
                break;
            }
            case "bottom-left": {
                top = rect.bottom + 10;
                left = rect.left - tooltipMargin; 
                break;
            }
            case "bottom-left-pre": {
                top = rect.bottom;
                left = rect.left - tooltipMargin; 
                break;
            }
            default: {
                top = rect.bottom + tooltipMargin;
                left = rect.left + (rect.width - this.tooltipText.scrollWidth) / 2;
                break;
            }
        }

        // Adjust tooltip to avoid overlapping with the parent container
        if (avoidParentContainerOverlap && parentContainerRef?.current) { 
            const parentRect = parentContainerRef.current.getBoundingClientRect();
            if (left < parentRect.left) {
                left = parentRect.left;
            } else if (left + this.tooltipText.scrollWidth > parentRect.right) {
                left = parentRect.right - this.tooltipText.scrollWidth;
            }
            if (top < parentRect.top) {
                top = parentRect.top;
            } else if (top + this.tooltipText.scrollHeight > parentRect.bottom) {
                top = parentRect.bottom - this.tooltipText.scrollHeight;
            }
        }

        this.setState({ left, top, hideTooltip: false });
    };

    handleScroll() {
        this.setState({
            hideTooltip: true
        });
    }

    getScrollParentElement = () => {
        const { getScrollParent } = this.props;
        return getScrollParent ? getScrollParent() : window;
    }

    componentWillUnmount() {
        this.getScrollParentElement().removeEventListener("scroll", this.handleScroll);
    }

    componentDidMount() {
        const { explicitTrigger, doNotTriggerMouseOverOnMount } = this.props;
        !doNotTriggerMouseOverOnMount && !explicitTrigger && this.onMouseOver();
        this.getScrollParentElement().addEventListener("scroll", this.handleScroll.bind(this));
    }

    mouseLeave = () => {
        const { onMouseLeave } = this.props;
        onMouseLeave && onMouseLeave();
    }

    render() {
        const { customContainerClassName = '', size, align, showTriangle, explicitTrigger, onClick, mouseOver, customHTML, disableOnTablets, id, display, linkText, disabledTooltip, setRelativePositions, width, mouseLeave } = this.props;
        const { top = 0, left = 0 } = this.state;
        const hiddenClass = this.props.hideOnScroll && this.state.hideTooltip ? true : false;

        const disabled = disableOnTablets ? (window.innerWidth <= 1200 && isTabletDevice()) : false;

        return (
            <div
                onMouseEnter={this.onMouseOver}
                onMouseOver={mouseOver ? this.onMouseOver : () => { }}
                ref={(ref) => this.tooltip = ref}
                className={`element-ui-tooltip ${customContainerClassName} ${this.tooltipClass || ''} ${explicitTrigger ? getStyle("explicitTrigger") : ""} ${showTriangle ? getStyle("showtriangle") : ""} ${hiddenClass ? getStyle("hiddenClass") : ""} ${getStyle(this.props.position)} ${onClick ? getStyle("hand-cursor") : ""}`}
                onClick={onClick}
                style={{ display, width }}
                onMouseLeave={mouseLeave ? this.mouseLeave : () => { }}
            >
                {this.props.children}
                <span ref={(ref) => this.tooltipText = ref}
                    style={{
                        top: setRelativePositions ? top : null,
                        left : setRelativePositions ? left : null,
                        marginLeft: (showTriangle && this.props.position === "left") ?
                            "10px" :
                            (showTriangle && this.props.position === "right") ? "2px" : "0"
                    }}
                    className={`element-ui-tooltiptext ${style.tooltiptext} ${getStyle(this.props.position)} ${size ? getStyle(size) : ""} ${align ? getStyle(align) : ""} ${disabled || disabledTooltip ? getStyle("disabled") : ""} ${this.props.tooltipClass} ${customHTML ? "tooltip-white" : ""}`}
                    id={id}>
                    {this.props.textPrefix || ""}
                    {this.props.lineBreakBWPrefixAndText ? <br/> : null}
                    {customHTML ? customHTML : this.props.text}
                    {linkText && <p dangerouslySetInnerHTML={{__html: linkText}}/>}
                </span>
            </div>
        );
    }
}

Tooltip.propTypes = {
    text: PropTypes.node.isRequired,
    children: PropTypes.node,
    isBlueJay: PropTypes.bool,
    delta: PropTypes.number,
    theme: PropTypes.string,
    position: PropTypes.oneOf(["right","left","top","bottom","top-right","bottom-right","bottom-left","bottom-left-pre"]),
    tooltipClass: PropTypes.string,
    tooltipMargin: PropTypes.number,
    customContainerClassName: PropTypes.string,
    hideOnScroll: PropTypes.bool,
    size: PropTypes.string,
    align: PropTypes.string,
    showTriangle: PropTypes.bool,
    explicitTrigger: PropTypes.bool,
    onClick: PropTypes.func,
    mouseOver: PropTypes.bool,
    customHTML: PropTypes.object,
    getScrollParent: PropTypes.func,
    disableOnTablets: PropTypes.bool,
    doNotTriggerMouseOverOnMount: PropTypes.bool,
    deltaRight: PropTypes.number,
    id: PropTypes.string,
    deltaLeft: PropTypes.number,
    display: PropTypes.string,
    width:PropTypes.string,
    linkText: PropTypes.string,
    textPrefix: PropTypes.string,
    disabledTooltip: PropTypes.bool,
    setRelativePositions: PropTypes.bool,
    lineBreakBWPrefixAndText: PropTypes.bool,
    onMouseLeave: PropTypes.func,
    mouseLeave: PropTypes.bool,
    parentContainerRef: PropTypes.object,
    avoidParentContainerOverlap: PropTypes.bool,
    dynamicTooltipHeight: PropTypes.bool,
    tooltipHeight: PropTypes.number
};

Tooltip.defaultProps = {
    position: "bottom",
    tooltipMargin: 5,
    setRelativePositions: true,
    mouseLeave: false
};

export default Tooltip;
