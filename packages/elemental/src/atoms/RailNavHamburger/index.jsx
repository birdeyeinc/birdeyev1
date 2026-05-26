import React, { Component } from "react";
import styles from "./RailNavHamburger.module.scss";
import PropTypes from "prop-types";

class RailNavHamburger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRailnav: false
        };
    }

    componentDidMount() {
        this.handleClickOutside();
    }

    messageHandler(msg) {
        window.postMessage(msg);
    }

    handleClickOutside() {
        this.messageHandler("rail nav closed");
    }

    render() {
        const { breakpoint = 800 } = this.props;
        const collapsableClass = styles["collapsable-wrapper"];
        return (<div className={`el-railnav-hamburger ${collapsableClass} collapsable-nav`} style={{ marginRight: "10px" }}>
            <style>{`@media screen and (max-width: ${breakpoint}px) { .${collapsableClass} { display: flex; } }`}</style>
            {!this.state.showRailNav ? <i
                className="icon_phoenix-tab-hamburger "
                onClick={() => {
                    this.messageHandler("rail nav clicked");
                }}
            /> : <i
                className="icon_phoenix-setting header-icon"
                onClick={() => {
                    this.messageHandler("rail nav closed");
                }}
            />}
        </div>);
    }
}

RailNavHamburger.propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    breakpoint: PropTypes.number
};

export default RailNavHamburger;
