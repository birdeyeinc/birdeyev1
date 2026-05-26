import React from "react";
import PropTypes from "prop-types";
import "./Button_global.scss";
import style from  "./Button.module.scss";
import cx from "classnames";

function FileChooser(props) {
    const styleNames = cx({[style[props.theme]]: true}, style["file-chooser"]);
    
    return (
        <label style={{ width: props.width }} className={styleNames}>
            {props.label}
            <input {...props} type="file" className={style.hidden} />
        </label>
    );
}

FileChooser.defaultProps = {
    theme:"primary"
};

FileChooser.propTypes = {
    theme: PropTypes.string,
    label: PropTypes.string,
    width: PropTypes.number
};

export default FileChooser;

