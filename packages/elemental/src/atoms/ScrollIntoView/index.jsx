import React, { Component } from "react";
import { msieversion } from "utils";
import PropTypes from "prop-types";

class ScrollIntoView extends Component {

    constructor(props) {
        super(props);
        this.isIEBrowser = msieversion();
    }

    componentDidMount() {
        setTimeout(this.scrollIntoView, this.props.timeout);
    }

    scrollIntoView = () => {
        const { isIEBrowser, scrollAnchorRef } = this;
        const { block } = this.props;
        if (scrollAnchorRef && !isIEBrowser) {
            scrollAnchorRef.scrollIntoView({
                behavior: "smooth",
                block
            });
        }
    }

    render() {
        return (
            <a ref = {(ref) => this.scrollAnchorRef = ref} />
        );
    }
}

ScrollIntoView.defaultProps = {
    block: "end",
    timeout: 10
};

ScrollIntoView.propTypes = {
    block: PropTypes.string,
    timeout: PropTypes.number
};

export default ScrollIntoView;