import React from "react";
import PropTypes from "prop-types";

const Image = (props) => {
    const { src, customClassName, onError = null, onLoad = null } = props;

    return (
        <img src={src} className={customClassName} onError={onError} onLoad={onLoad} />
    );
};

Image.propTypes = {
    src: PropTypes.string,
    customClassName: PropTypes.string,
    onError: PropTypes.func,
    onLoad: PropTypes.func

};

export default Image;