import React from "react";
import PropTypes from "prop-types";
import Button from "atoms/Button";
import Tooltip from "atoms/Tooltip";
import styles from "./ToggleableContent.module.scss";
import { getEncodedStyleClass } from "utils/index";

class ToggleableContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accordionCollapsed: props.menu.accordionCollapsed !== undefined ? props.menu.accordionCollapsed : (props.menuIndex === 0 ? false : true)
        };
    }

    componentWillReceiveProps(nextProps) {
        const { menu } = nextProps;
        const { accordionCollapsed } = menu;

        //Currently only supporting opening of toggleable component
        if (accordionCollapsed !== undefined) {
            this.setState({
                accordionCollapsed
            });
        }
    }

    hideShowContent(evt) {
        const { menuClickedCallback, menu, singleSection } = this.props;
        const { accordionCollapsed } = this.state;

        if (singleSection) {
            return;
        }

        evt.stopPropagation();
        menuClickedCallback && menuClickedCallback(accordionCollapsed, menu.title.text, menu.title.id);
        menu.title.action && menu.title.action();
        this.setState((prevState) => ({ accordionCollapsed: !prevState.accordionCollapsed }));
    }

    getSubTitle = () => {
        const { menu: { subTitle, learnMore } } = this.props;
        const { accordionCollapsed } = this.state;
        if (!subTitle || accordionCollapsed) return null;

        return (<p className="modal-txt" onClick={(evt) => {
            evt.stopPropagation();
        }}>{subTitle} {learnMore ? <a href={learnMore} target="_blank" rel="noopener noreferrer">Learn more</a> : null}</p>);
    }

    render() {
        const self = this;
        const { accordionCollapsed } = this.state;
        const { menu, customMenuStyles, customTitleStyles, customTitleContainerStyles, singleSection, customMenuClass, customAccordian } = self.props;
        const { ctaBtn, customMenuExpandClass, customMenuCollapseClass } = menu;
        const wrapperClassname = getEncodedStyleClass(`menu ${singleSection ? "singleSection" : ""} ${customAccordian ? "customAccordian" : ""}`, styles);
        return (
            <div data-test-id="el-test-toggleable-content" style={customMenuStyles} className={`el-toggleable-content ${wrapperClassname} ${accordionCollapsed ? (customMenuCollapseClass || "") : (customMenuExpandClass || "")} ${customMenuClass || ""}`}>
                {menu && menu.title && menu.title.text !== "" ? 
                    (
                        <div data-testid="el-test-tc-title-container" className={styles["title-container"]} onClick={self.hideShowContent.bind(self)} style={customTitleContainerStyles}>
                            <div>
                                <span className={styles["title"]} style={customTitleStyles}>{menu.title.text}</span>
                                {!singleSection && (
                                    <i  className={`${styles["toggleIcon"]} ${self.state.accordionCollapsed ? "icon icon_phoenix-cheveron_open down" : "icon icon_phoenix-cheveron_close up"}`} />
                                )}
                                {menu.title.infoTooltip && (
                                    <Tooltip
                                        hideOnScroll
                                        theme={`${menu.title.infoTooltip.type === "white" ? "white" : ""}`}
                                        text={menu.title.infoTooltip.tooltipHtml}
                                        size={menu.title.infoTooltip.size || "medium"}
                                        customContainerClassName="ml-10"
                                    >
                                        <i className={`icon_phoenix-header-question ${styles["icon-text-tooltip"]}`} />
                                    </Tooltip>
                                )}
                                {
                                    !self.state.accordionCollapsed && ctaBtn && ctaBtn.length && ctaBtn.map((btn, i) => {
                                        return (<Button type={btn.type} label={btn.text} key={i} onClick={(evt) => {
                                            btn.onClickAction && btn.onClickAction(evt);
                                            evt.stopPropagation();
                                        }} className="preview-btn ml-30" />);
                                    })
                                }
                            </div>
                        </div>
                    ) : null
                }
                <div data-testid="el-test-tc-content" className={`${styles["no-pointer"]} ${self.state.accordionCollapsed ? "hidden" : ""}`}>
                    {this.getSubTitle()}
                    <div onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        {menu.content}
                    </div>
                </div>
            </div>
        );
    }
}

ToggleableContent.propTypes = {
    menu: PropTypes.object,
    accordionCollapsed: PropTypes.bool,
    menuIndex: PropTypes.number,
    menuClickedCallback: PropTypes.func,
    customMenuStyles: PropTypes.object,
    customTitleStyles: PropTypes.object,
    customTitleContainerStyles: PropTypes.object,
    singleSection: PropTypes.bool,
    customMenuClass: PropTypes.string,
    customAccordian: PropTypes.bool

};

export default ToggleableContent;