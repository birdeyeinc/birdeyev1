import React, { useState } from "react";
import brokenImage from "assets/images/brokenImage.svg";
import styles from "./MediaCollage.module.scss";
import PropTypes from "prop-types";

function ImageMediaWithPlaceholder(props) {
    const {
        url,
        isMediaContain,
        handleImageClick,
        index
    } = props;
    const [showShimmer, setShimmer] = useState(true);

    const handleImageLoad = () => {
        setShimmer(false);
    };

    const handleImageError = (currentTarget) => {
        setShimmer(false);
        currentTarget.classList.add("isBrokenImage");
        currentTarget.parentElement.classList.add("remove-click-listner");
        currentTarget.onError = null;
        currentTarget.src = brokenImage;
    };

    return (
        <>
            {showShimmer && <div className={styles["glare-transition-imagecollage"]} />}
            <img
                onClick={() => handleImageClick(index)}
                draggable="false"
                src={url}
                effect="blur"
                className={`el-image-media-placeholder ${showShimmer ? "hide" : "display-block"} ${styles["media-image"]} ${isMediaContain ? styles["media-contain"] : ""}`}
                onError={({ currentTarget }) => {
                    handleImageError(currentTarget);
                }}
                onLoad={handleImageLoad}
            />
        </>
    );
}

ImageMediaWithPlaceholder.propTypes = {
    url: PropTypes.string,
    isMediaContain: PropTypes.bool,
    handleImageClick: PropTypes.func,
    index: PropTypes.number
};

export default ImageMediaWithPlaceholder;