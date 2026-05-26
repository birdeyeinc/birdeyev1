import React, { Component } from "react";
import TextAreaCounter from "./TextAreaCounter";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import Styles from "./TextAreaCounter.module.scss";

let textAreadIdCount = 0;

class TextAreaCounterWrapper extends Component {
    constructor(props) {
        super(props);
        this.textAreadId = "text-area-" + ++textAreadIdCount;
    }

    getTextAreaId = () => {
        const { id } = this.props;

        return id || this.textAreadId;
    };

    render() {
        const { disabled, bodyClass, showErrorOutside, error, key } = this.props;
        const errObject = error && !isEmpty(error) ? error.filter((x) => {
            return x.id == this.getTextAreaId();
        }) : [];
        const errMsg = !isEmpty(errObject) && (errObject[0]).msg;

        return (
            <div key={key} className={`${Styles["textarea-box"]} ${bodyClass ? bodyClass : ""} ${errMsg ? Styles["invalid-error"] : ""} ${disabled ? Styles["disabled-textarea"] : ""}`}>
                <TextAreaCounter {...this.props} customText={this.props.customText} />
                {errMsg && showErrorOutside && <ul className="validation-errors">
                    <li>
                        {errMsg}
                    </li>
                </ul>}
            </div>
        );
    }
}

TextAreaCounterWrapper.propTypes = {
    error: PropTypes.array,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    bodyClass: PropTypes.string,
    showErrorOutside: PropTypes.bool,
    key: PropTypes.string,
    topCount: PropTypes.bool,
    customText:PropTypes.string
};

export default TextAreaCounterWrapper;
