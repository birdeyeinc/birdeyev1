/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import styles from './MediaCollage.module.scss';

const ImageLoadingLazily = (props) => {
    const { src, alt, setLoadedImagesCount = null } = props;
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef();

    const renderShimmerCard = () => {
        return (<div className={`${styles["shimmer-box"]} ${styles["glare-transition"]}`} />);
    };

    const handleImageLoad = () => {
        setIsLoaded(true); // Set image as loaded
        if (setLoadedImagesCount) {
            setLoadedImagesCount(previousCount => previousCount + 1);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setImageSrc(src);
                    if(imgRef.current) observer.unobserve(imgRef.current);
                }
            });
        });

        if(imgRef.current) observer.observe(imgRef.current);

        // Cleanup observer
        return () => {
            if(imgRef.current) observer.unobserve(imgRef.current);
        };
    }, [src]);

    return <>
        {(!isLoaded) && renderShimmerCard()}
        <img className="el-lazy-load-image" {...props} ref={imgRef} src={imageSrc} alt={alt} onLoad={handleImageLoad} />

    </>;
};

export default ImageLoadingLazily;