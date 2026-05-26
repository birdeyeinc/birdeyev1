import React from "react";
import PropTypes from "prop-types";
import style from './LoaderBox.module.scss';
import LoaderBirdeye from "assets/images/loader-birdeye.gif";
import LoaderReseller from "assets/images/loader-reseller.gif";
import Loader from "assets/images/loader.gif";
import { getEncodedStyleClass } from "utils/index";
import AnimationLoader from "./AnimationLoader";

const LoaderBox = (props) => {
    const { type, reseller, message, loaderBoxClass, className, customSizeClass, animationLoaderProps } = props;
    let imgUrl, text, loaderClass = "";
    imgUrl = reseller ? LoaderReseller : LoaderBirdeye;
    text = <p>{message === undefined ? "Loading" : message}</p>;

    loaderClass = loaderBoxClass || "";

    // customSizeClass prop
    let customSize = "";
    if (typeof customSizeClass === 'string' && customSizeClass.trim()) {
        const key = customSizeClass.trim();
        customSize = style[key] || "";
    }

    switch (type) {
        case "loader-birdeye":
            loaderClass = getEncodedStyleClass(loaderClass, style) + ` ${style['loader-birdeye']}`;
            break;
        case "loader":
            imgUrl = Loader;
            text = "";
            break;
        case "animation-loader":
            return (
                <div className={`el-loaderbox ${className} ${style['loader-box']} ${style['animation-loader-wrapper']}`}>
                    <AnimationLoader {...animationLoaderProps} />
                </div>
            );
        default:
            break;
    }

    return (
        <div className={`el-loaderbox ${className} ${style['loader-box']} ${loaderClass} ${customSize}`}>
            <img src={imgUrl} />
            {text}
        </div>
    );
};

LoaderBox.propTypes = {
    type: PropTypes.oneOf(['loader', 'loader-birdeye', 'animation-loader']),
    reseller: PropTypes.bool.isRequired,
    message: PropTypes.string,
    loaderBoxClass: PropTypes.string,
    className: PropTypes.string,
    customSizeClass: PropTypes.string,
    animationLoaderProps: PropTypes.shape({
        animationData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        title: PropTypes.string,
        message: PropTypes.string,
        className: PropTypes.string,
        events: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired
        })),
        activeIndex: PropTypes.number,
        showInlineLoader: PropTypes.bool
    })
};

export default LoaderBox;
