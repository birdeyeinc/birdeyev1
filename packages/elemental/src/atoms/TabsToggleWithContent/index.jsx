import React from "react";
import PropTypes from "prop-types";
import Styles from "./TabsToggleWithContent.module.scss";
import { isNumber } from "lodash";
import { getEncodedStyleClass } from "utils/index";

const getStyle = (str) => getEncodedStyleClass(str, Styles);

class TabsToggleWithContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: props.activeIndex || 0
        };
    }

    componentWillReceiveProps(newProps) {
        if (isNumber(newProps.activeIndex) && (newProps.activeIndex != this.props.activeIndex)) {
            this.setState({
                active: newProps.activeIndex
            });
        }
    }

    toggleTabs = (active, id) => {
        const { tabData } = this.props;
        const { setActive } = this;

        tabData[this.state.active].confirmCallback ? tabData[this.state.active].confirmCallback({
            callback: setActive.bind(null, active, id)
        }) : setActive(active, id);
    };

    setActive = (active, id) => {
        const { toggleCallback } = this.props;
        
        if (toggleCallback) toggleCallback(id, active);
        
        this.setState({
            active
        });
    };

    getActiveTabContent = () => {
        const { tabData } = this.props;
        const { active } = this.state;

        return tabData[active] && tabData[active].content;
    };

    render() {
        const { toggleTabs, getActiveTabContent } = this;
        const { tabData, phoenixLayout } = this.props;
        const { active } = this.state;

        return (<div data-testid="el-test-tabs-toggle-w-content" className="el-tabs-toggle-w-content">
            <div className={getStyle(phoenixLayout ? "new-tab-wrapper" : "")}>
                {
                    tabData && tabData.length > 1 && tabData.map(function (tab, index) {
                        return (<span 
                            className={getStyle("tab " + (active === index ? "active-tab" : "inactive-tab"))}
                            key={index}
                            onClick={toggleTabs.bind(null, index, tab.id)}
                        >
                            {tab.icon ? <i className={`${tab.icon}`} /> : null}
                            <span>{tab.title}</span>
                        </span>);
                    })
                }
                {
                    getActiveTabContent()
                }
            </div>
        </div>);
    }
}

TabsToggleWithContent.propTypes = {
    activeIndex: PropTypes.number,
    tabData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
            icon: PropTypes.string,
            content: PropTypes.node,
            confirmCallback: PropTypes.func
        })
    ).isRequired,
    toggleCallback: PropTypes.func,
    phoenixLayout: PropTypes.bool
};

export default TabsToggleWithContent;