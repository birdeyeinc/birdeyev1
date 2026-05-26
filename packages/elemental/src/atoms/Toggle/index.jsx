import React, {Component} from "react";
import PropTypes from "prop-types";
import styles from "./Toggle.module.scss";
import Tooltip from "atoms/Tooltip";

class Toggle extends Component {
    static displayName = "Toggle";

    constructor(props) {
        super(props);

        const defaultState = {
            validationErrors : [],
            validationClasses  : ""
        };
        const initialState = this.mapPropsToState(props, true);
        this.state = Object.assign(defaultState, initialState);
    }

    UNSAFE_componentWillMount() {
        this.props._attachToFormWrapper && this.props._attachToFormWrapper(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState(this.mapPropsToState(nextProps, false));
    }

    componentWillUnmount() {
        this.props._detachFromFormWrapper && this.props._detachFromFormWrapper(this);
    }

    mapPropsToState(nextProps, initialCase) {
        const stateChanges = {};

        if (initialCase || this.props.checked !== nextProps.checked) {
            stateChanges.checked = nextProps.checked || false;
        }

        if (initialCase || this.props.value !== nextProps.value) {
            stateChanges.value = nextProps.value || "";
        }

        if (this.props.checked && this.props.name === "enableBirdAI") {
            stateChanges.checked = nextProps.checked;
        }

        return stateChanges;
    }

    handleOnChange = (e) => {
        e.preventDefault();
        const {checked} = this.state;
        const {name} = this.props;

        this.setState({
            checked : !checked
        }, () => {
            if (this.props.validationTrigger === "onChange" && this.props._fieldValidator) {
                this.props._fieldValidator(this);
            }
            let event = {
                target: {
                    checked: !checked,
                    value: !checked, // TODO : value shouldn't be same as checked
                    name
                }
            };
            this.props._onChange && this.props._onChange(this, event);
            // Done to avoid calling _onChange method of Form.js if wrapped in form
            this.props.onChange && this.props.onChange(this, event);
        });
    };

    renderToggleView = () => {

        const { checked, validationClasses } = this.state;
        let { className, _renderValidationErrors, disabled, graphToggle, offLabel, offIcon, onLabel, onIcon, roundedToggle } = this.props;

        className += validationClasses;
        
        let htmlJSX = (
            <section className={`${className} ${styles['toggle-wrapper']} ${graphToggle ? styles["graph-toogle"] : ""}  ${roundedToggle ? styles["rounded-toggle"] : ""}`}>
                <label onClick={disabled ? null : (e) => this.handleOnChange(e)} className={`${styles.switch} ${disabled ? styles["disabled-off"] : ""} `}>
                    <input className={`${styles['switch-input']} ${disabled ? styles["disabled-switch-input"] : ""}`} type="checkbox" checked={checked} value="" />
                    <span className={styles["switch-label"]} data-on="On" data-off="Off" /> 
                    <span className={styles["slider"]}>
                        {graphToggle ? (
                            <React.Fragment>
                                <span className={styles["chart-wrap"]}>
                                    <Tooltip
                                        hideOnScroll
                                        text={
                                            <span>
                                                {offLabel || "Chart"}
                                            </span>
                                        }
                                    >
                                        <i className={offIcon || "icon_phoenix-icon-graph"} />
                                    </Tooltip>
                                </span>
                                <span className={styles["table-wrap"]}>
                                    <Tooltip
                                        hideOnScroll
                                        text={
                                            <span>
                                                {onLabel || "Table"}
                                            </span>
                                        }
                                    >
                                        <i className={onIcon || "icon_phoenix-formatting-list"} />
                                    </Tooltip>
                                </span>
                            </React.Fragment>
                        )
                            : null
                        }
                    </span>
                </label>

                {
                    _renderValidationErrors && _renderValidationErrors(this)
                }
            </section>
        );

        return htmlJSX;  
    }

    render() {
        const { disabled, tooltipData }  = this.props;
        
        return (
            <React.Fragment>
                { disabled && tooltipData ? ( 
                    <Tooltip {...tooltipData}>
                        <React.Fragment>{this.renderToggleView()}</React.Fragment>
                    </Tooltip>
                ) : 
                    <React.Fragment>{this.renderToggleView()}</React.Fragment>
                }
            </React.Fragment>  
        );
    }
}

Toggle.propTypes = {
    checked: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className : PropTypes.string,
    validationTrigger : PropTypes.string,
    _attachToFormWrapper : PropTypes.func,
    _detachFromFormWrapper : PropTypes.func,
    _fieldValidator : PropTypes.func,
    _renderValidationErrors : PropTypes.func,
    _onChange : PropTypes.func,
    yesno: PropTypes.bool,
    disabled: PropTypes.bool,
    tooltipData: PropTypes.object,
    graphToggle: PropTypes.bool,
    offLabel: PropTypes.string,
    offIcon: PropTypes.string,
    onLabel: PropTypes.string,
    onIcon: PropTypes.string,
    roundedToggle : PropTypes.bool
};

export default Toggle;
