import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import formErrorClasses from "./FormError.scss";

const {
    errorWrapDefault,
    errorWrapperClass,
    errorWrap,
    alert,
    alertError,
    errorMsgBox
} = formErrorClasses;
const FormError = (props) => {
    const { errorList, closeFormError, show = false, wrapperClass = "", showIcon = true, showCloseButton = true } = props;

    const formErrorWrapperClasses = cx({
        [errorWrapDefault]: true,
        [errorWrap]: true,
        [alert]: true,
        [alertError]: true,
        [errorWrapperClass]: !wrapperClass,
        [wrapperClass]: !!wrapperClass,
        "hidden": !show
    });

    return (
        <div className={formErrorWrapperClasses}>
            {showCloseButton &&
                (<a className="close error-close-btn" data-dismiss="alert_" href="#" onClick={closeFormError} />)
            }
            {showIcon && (<div className="error-icon" />)}
            <ul className={errorMsgBox}>
                {
                    show && errorList && errorList.length &&
                    errorList.map((errorMsg, i) => {
                        return (<li key={`formError_${i}`}><span>{errorMsg}</span></li>);
                    })
                }
            </ul>
        </div>
    );
};

FormError.propTypes = {
    errorList: PropTypes.array,
    show: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showCloseButton: PropTypes.bool,
    showIcon: PropTypes.bool,
    wrapperClass: PropTypes.string,
    closeFormError: PropTypes.func
};

export default FormError;