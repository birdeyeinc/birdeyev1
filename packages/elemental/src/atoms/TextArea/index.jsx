import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./TextArea.module.scss";
import 'sass/global.scss'
import autosize from "autosize";
import AlertImg from "assets/images/error.svg";
import Tooltip from "atoms/Tooltip";
import { getEncodedStyleClass } from "utils/index";

class TextArea extends Component {
    static displayName = "TextArea";

    constructor(props) {
        super(props);

        const { name } = props;

        const defaultState = {
            validationClasses: "valid",
            validationErrors: []
        };

        // props checks
        if (!name) {
            throw new Error("Name attribute is a required prop");
        }

        const intialState = this.mapPropsToState(props, true);
        this.state = Object.assign(defaultState, intialState);
        this.textareaRef = null;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.mapPropsToState(nextProps));
    }

    componentWillMount() {
        this.props._attachToFormWrapper && this.props._attachToFormWrapper(this);
    }

    componentDidMount() {
        if (this.props.autoSize) {
            autosize(this.textareaRef);
        }

        if (this.props.setTextAreaRef) {
            this.props.setTextAreaRef(this.textareaRef);
        }
    }
    componentWillUnmount() {
        this.props._detachFromFormWrapper && this.props._detachFromFormWrapper(this);
    }

    mapPropsToState(nextProps, initialCase) {
        const stateChanges = {};

        if (initialCase || this.props.value !== nextProps.value) {
            stateChanges.value = nextProps.value;
            stateChanges.islabelClass = stateChanges.value;
        }

        return stateChanges;
    }

    handleInputChange = (e) => {
        const { validationTrigger } = this.props;
        const inputTarget = e.target;
        let inputValue = inputTarget.value;

        let stateChanges = {};

        stateChanges["value"] = inputValue;

        if (inputValue) {
            this.setState({ islabelClass: true });
        } else {
            this.setState({ islabelClass: false });
        }

        this.setState(stateChanges, () => {
            // field validator needs to be called after the state has been updated with the current input value or checked status
            if (validationTrigger === "onChange") {
                // call field validator method in the form wrapper component
                this.props._fieldValidator && this.props._fieldValidator(this);
            }
            this.props._onChange && this.props._onChange(this);
        });

        this.props.onChange && this.props.onChange(e, inputValue);
    };

    handleInputBlur = (e) => {
        const inputValue = e.target.value;
        const { validationTrigger } = this.props;

        if (validationTrigger === "onBlur") {
            // call field validator method in the form wrapper component
            this.props._fieldValidator && this.props._fieldValidator(this);
        }

        this.props.onBlur && this.props.onBlur(inputValue);
    };

    onClick = (event) => {
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    };

    onFocus = () => {
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    };

    onKeyUp = (event) => {
        if (this.props.onKeyUp) {
            this.props.onKeyUp(event);
        }
    };

    onKeyDown = (event) => {
        if (this.props.onKeyDown) {
            this.props.onKeyDown(event);
        }
    };

    focusTextArea = () => {
        this.textareaRef.focus();
    };

    renderValidationErrors = (validationError) => {
        const { align, position } = this.props;

        if (validationError && validationError.length) {
            if (this.props.showErrorOutside) {
                return <ul className={styles["validation-errors"]}><li> {validationError}</li></ul>;
            } else {
                return <div className={styles["error-tooltips"]}><Tooltip hideOnScroll text={validationError} align={align} position={position}> <img src={AlertImg} alt="error" /> </Tooltip></div>;
            }
        }
    }

    render() {
        const { value, validationClasses, islabelClass } = this.state;

        /*eslint-disable */
        let {
            className,
            validations,
            errorMessages,
            onChange,
            _onChange,
            validationTrigger,
            _detachFromFormWrapper,
            _attachToFormWrapper,
            _fieldValidator,
            validationError,
            maxLength,
            disabled,
            rows = 1,
            label,
            autoFocus,
            showCharCount,
            partialyEditable,
            allowEnter,
            stateless,
            nonEditableTxt,
            allowMaxHgt,
            showErrorOutside,
            _renderValidationErrors,
            noFloatingLabel,
            noTextareaHeight,
            noLabel,
            errorClass,
            noBorder,
            inboxInternalNote,
            ...defaultInputProps


        } = this.props;
        /*eslint-enable */
        if (errorClass)
            className += ` ${errorClass}`;

        return (
            <section className={`el-textarea ${styles['form-input-wrapper']} ${islabelClass || (partialyEditable && nonEditableTxt) ? styles['textarea-filled'] : ''} ${className}`}>
                {
                    showCharCount && maxLength ? <span className={`${styles['char-count']} ${noLabel ? styles["top-count"] : ''}`}>{(value ? value.length : 0) + ("/" + maxLength)}</span> : null
                }
                {this.props.label && noFloatingLabel ? <label className={`el-textarea-label-outside ${styles['label-outside']}`}>{this.props.label}</label> : null}
                <div className={`${styles['pos-rel']} ${noLabel ? styles['no-label'] : ''} ${noBorder ? styles['no-border'] : ''} ${inboxInternalNote ? styles['inbox-internal-note'] : ''}`}>
                    <textarea
                        {...defaultInputProps}
                        ref={(node) => this.textareaRef = node}
                        rows={rows}
                        value={stateless ? null : value}
                        className={`custom-scroll ${getEncodedStyleClass(validationClasses, styles)} ${allowMaxHgt ? styles['max-hgt'] : ''} ${partialyEditable ? styles['partial-textarea'] : ''} ${this.props.label && noFloatingLabel ? styles['with-no-labels'] : ''} ${noTextareaHeight ? styles['no-height'] : ''}`}
                        maxLength={maxLength}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputBlur}
                        disabled={disabled}
                        onKeyDown={allowEnter ? this.onKeyDown : (e) => {
                            if (e.keyCode === 13 && !e.shiftKey) {
                                e.preventDefault();
                                return false;
                            }
                        }}
                        onKeyUp={this.onKeyUp}
                        onClick={this.onClick}
                        onFocus={this.onFocus}
                        autoFocus={autoFocus}

                    />
                    {this.props.label && !noFloatingLabel ? <label>{this.props.label}</label> : null}
                    {(partialyEditable && nonEditableTxt) && <p className={`${styles[`non-editable`]}`} onClick={this.focusTextArea}>{nonEditableTxt}</p>}
                    {/* This validation is called when textarea is called  directly without enclosed in Form component */}
                    {
                        this.renderValidationErrors(validationError)
                    }
                    {/* This validation is called when textarea is called inside phoenix Form component */}
                    {
                        _renderValidationErrors && _renderValidationErrors(this)
                    }
                </div>
            </section>
        );

    } // ending render

}

TextArea.propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.node,
    onBlur: PropTypes.func,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    validationTrigger: PropTypes.oneOf(["onBlur", "onSubmit", "onChange"]),
    required: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.string,
    errorMessages: PropTypes.object,
    validations: PropTypes.object,
    // props dynamically added by form wrapper component
    _fieldValidator: PropTypes.func,
    _attachToFormWrapper: PropTypes.func,
    _detachFromFormWrapper: PropTypes.func,
    validationError: PropTypes.string,
    showErrorOutside: PropTypes.bool,
    _onChange: PropTypes.func,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    setTextAreaRef: PropTypes.func,
    onFocus: PropTypes.func,
    autoSize: PropTypes.bool,
    partialyEditable: PropTypes.bool,
    allowEnter: PropTypes.bool,
    stateless: PropTypes.bool,
    nonEditableTxt: PropTypes.string,
    allowMaxHgt: PropTypes.bool,
    _renderValidationErrors: PropTypes.func,
    noFloatingLabel: PropTypes.bool,
    showCountTop: PropTypes.bool,
    noTextareaHeight: PropTypes.bool,
    noLabel: PropTypes.bool,
    // showCountTop: PropTypes.bool
    align: PropTypes.string,
    position: PropTypes.string,
    noBorder: PropTypes.bool,
    inboxInternalNote: PropTypes.bool
};

TextArea.defaultProps = {
    validationTrigger: "onSubmit",
    type: "text",
    autoSize: true,
    noFloatingLabel: false
};

export default TextArea
