import React, { Component } from "react";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";
import styles from "./ChromePickerInput.module.scss";
import FormInput from "atoms/FormInput";
import Button from "atoms/Button";
import tickMark from "assets/images/common/shape.svg";
import { gray900, yellow90 } from "sass/js/colors";

class ChromePickerInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            colorList: ["#0A7AFF", "#5856D6", "#f44336", "#AF52DE", yellow90, gray900]
        };
    }
    componentWillReceiveProps = (newProps) => {
        const { color } = newProps;
        if (this.state.colorList.indexOf(color) == -1) {
            let newColorList = this.state.colorList;
            newColorList.pop();
            newColorList.push(color);
            this.setState({ colorList: [...newColorList] });
        }
    }

    toggleColorPicker = () => {
        this.setState((prevState) => ({
            show: !prevState.show
        }));
    };

    cancelClicked = () => {
        this.setState((prevState) => ({
            show: !prevState.show
        }));
    };

    render() {
        const { toggleColorPicker } = this;
        const {
            color,
            label,
            onChangeComplete,
            disabled,
            showColorInput = true,
            showActionButtons = false,
            onRequestApply,
            customClassName,
            customWidgetClass,
            showColorList
        } = this.props;
        const { show, colorList } = this.state;
        return (
            <div data-testid="el-test-chromepicker" className={`el-chromepicker ${disabled ? styles["disabled"] : ""}`}>
                {show && (
                    <div className={`${styles["popover"]} ${customClassName}`}>
                        <div className={styles["cover"]} onClick={toggleColorPicker} />
                        <ChromePicker
                            disableAlpha
                            onChangeComplete={onChangeComplete}
                            color={color}
                        />
                        {showActionButtons && (
                            <div className={styles["action-buttons"]}>
                                <Button
                                    label="Cancel"
                                    theme="link"
                                    onClick={this.cancelClicked}
                                />
                                <Button
                                    label="Save"
                                    theme="primary"
                                    className="ml-5"
                                    onClick={() => {
                                        toggleColorPicker();
                                        onRequestApply();
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
                <div className={`${styles["clear"]} ${styles["color-widget-box"]} ${customWidgetClass}`}>
                    {label && <p className={`${styles["sub-heading"]} ${styles["mar-rgi60"]}`}>{label}</p>}
                    <div className={styles["middle-block"]}>
                        {showColorList && (
                            <div>
                                {colorList.map((val) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                onChangeComplete({ "hex": val });
                                                onRequestApply();
                                            }}
                                            style={{ backgroundColor: val }}
                                            className={`${styles["circle"]} ${styles["middle-block"]} ${color == val ? styles["tick-mark"] : ""}`}
                                        >{color == val && <img className={`${val == "#ffffff" || val == "#FFFFFF" || val == "#fff" ? styles["show-black"] : ""}`} src={tickMark} />}</div>
                                    );
                                })}
                            </div>
                        )}
                        <div
                            onClick={toggleColorPicker}
                            style={showColorList ? {} : { backgroundColor: color }}
                            className={`${styles["circle"]} ${styles["middle-block"]}`}
                        />
                        {showColorInput && (
                            <div className={`${styles["input-cont"]} ${styles["middle-block"]}`}>
                                <FormInput
                                    type="text"
                                    name="bannercolor"
                                    value={color}
                                    className={`${styles["bannercolorCls"]} el-bannercolorCls`}
                                    disabled
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>);
    }
}

ChromePickerInput.propTypes = {
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChangeComplete: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    showColorInput: PropTypes.bool,
    customClassName: PropTypes.string,
    customWidgetClass: PropTypes.string,
    showActionButtons: PropTypes.func,
    onRequestCancel: PropTypes.func,
    onRequestApply: PropTypes.func,
    showColorList: PropTypes.bool
};

export default ChromePickerInput;