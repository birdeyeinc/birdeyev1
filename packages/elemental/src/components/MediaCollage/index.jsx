/* eslint-disable react/no-multi-comp */
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import Image from "./Image";
import styles from "./MediaCollage.module.scss";
import brokenImage from "assets/images/brokenImage.svg";
import Slider from "atoms/Slick";
import ImageMediaWithPlaceholder from "./ImageMediaWithPlaceholder";
import ImageLoadLazily from "./ImageLoadingLazily";
import AutoOptimizationImageGIF from "assets/images/autoOptimizationAnimation.gif";
import { getEncodedStyleClass } from "utils/index";

const MediaCollage = (props) => {
    // Note: Parent of this component should have width and height css property.
    const {
        attachments,
        className = "",
        direction = "horizontal",
        threshold = 3,
        withOuterBorders,
        channel,
        showThumbnailOnSingleVideo,
        isSocialPreview = false,
        playVideoIcon,
        postingSites,
        setSlider,
        isDrawer,
        disableVideo = false,
        thumbnailWithPlayBtn = false,
        enableDnDWithSingleImage,
        isMultipleVideos,
        isInboxAttachments,
        fullLoadMedia,
        videoFullScreenMode = false,
        loadLazily = false,
        customVideoCarouselClass = "",
        showSliderForVideoThumbnail = null,
        isFeedLayout = false,
        showCombinedLoaderForMultipleImages = false,
        isAutoOptimizationInRemaining = false,
        feedLayoutResolutions = null,
        isMediaLibCollage = false, 
        totalCount = 0
    } = props;

    let { socialChannelCardWidth, postThumbnailData } = props;
    const [currentVideoIndex, setVideoIndex] = useState(null);
    const videoRef = useRef([]);
    const [newCurrentSlide, setNewCurrentSlide] = useState(1);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);
    const [glareTransitionDone, setGlareTransitionDone] = useState({});
    //hardcoded dimensions in this object will change to css classes once logic is approved
     const dimnesionsForFeedLayoutCollage = feedLayoutResolutions ? feedLayoutResolutions : {height: "130px", width:"130px"};

    useEffect(() => {
        const handleOutsideClick = (event) => {
            videoRef?.current?.forEach(currentVideoRf => {
                if (currentVideoRf && !currentVideoRf.contains(event.target) && !event.target.classList.contains("video-play-button")) {
                    currentVideoRf.pause();
                    setVideoIndex(null);
                }
            });
        };

        const handleScroll = () => {
            videoRef?.current?.forEach(currentVideoRf => {
                if (currentVideoRf && !isElementInViewport(currentVideoRf)) {
                    currentVideoRf.pause();
                    setVideoIndex(null);
                }
            });
        };

        document.addEventListener("click", handleOutsideClick);
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [currentVideoIndex]);

    const isElementInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const handleVideoClick = (event, index) => {
        event.stopPropagation();
        if (disableVideo) return;

        if (!videoRef?.current[index]?.paused) {
            videoRef?.current[index]?.pause();
            setVideoIndex(null);
        } else {
            if (videoFullScreenMode) {
                setSlider({
                    show: true,
                    startingPosition: index
                });
            } else {
                videoRef?.current[index]?.play();
                setVideoIndex(index);
            }
        }
    };

    const onPreventMediaDragDropHandler = (event) => {
        if (enableDnDWithSingleImage) return;
        event.preventDefault();
    };

    const handleImageClick = (index) => {
        if (!isDrawer) return;
        setSlider({
            show: true,
            startingPosition: index
        });
    };

    const renderBrokenImage = () => {
        return (
            <img draggable="false" src={brokenImage} effect="blur"
                className={styles["media-image"]}
            />
        );
    };

    const renderVideoElement = (url, thumbnail, type, index) => {
        return (
            <video
                draggable="false"
                src={url}
                controls= {isMediaLibCollage ? false : !videoRef?.current[index]?.paused && playVideoIcon ? true : false}
                poster={
                    (playVideoIcon && postingSites && (postingSites.includes("facebook") || postingSites.includes("youtube") || postingSites.includes("instagram")) && postThumbnailData?.[0])
                        ? postThumbnailData[0]
                        : thumbnail
                }
                className={styles["media-video"]}
                onClick={(event) => handleVideoClick(event, index)}
                onKeyDown={(event) => handleVideoClick(event, index)}
                ref={el => videoRef.current[index] = el}
            >
                <source type={type} src={url} />
            </video>
        );
    };

    // Renders only Media item (image or video)
    const renderMedia = (object) => {
        const { type, url, index, thumbnail = null, isMediaContain = false, item = {} } = object;

        const { isAutoOptimizationInProgress = false } = item;

        if (type === "image") {
            if (fullLoadMedia) {
                return (
                    <div onClick={() => handleImageClick(index)} id={type + index} className={`${glareTransitionDone[index] ? "" : styles["glare-transition"]} ${isAutoOptimizationInProgress ? styles["relative-optimization-overlay"] : ""}`} style={{ width: "100%", height: "100%" }}>
                        <Image
                            src={url}
                            customClassName={`${styles["media-image-comp"]} ${isMediaContain ? styles["media-contain"] : ""} ${styles["no-opacity"]}`}
                            onError={({ currentTarget }) => {
                                currentTarget.classList.add("isBrokenImage");
                                currentTarget.parentElement.classList.add("el-remove-click-listner", styles["remove-click-listner"]);
                                currentTarget.onError = null;
                                currentTarget.src = brokenImage;
                                currentTarget.classList.remove(styles["no-opacity"]);
                                document.getElementById(type + index).classList.remove(styles["glare-transition"]);
                            }}
                            onLoad={({ currentTarget }) => {
                                currentTarget.classList.remove(styles["no-opacity"]);
                                document.getElementById(type + index).classList.remove(styles["glare-transition"]);
                                setGlareTransitionDone(prev => {
                                    return {
                                        ...prev,
                                        [index]: true
                                    };
                                });
                            }}
                        />

                        {glareTransitionDone[index] && isAutoOptimizationInProgress && <div className={`el-optimization-progress-wrapper ${styles["optimization-progress-wrapper"]}`}>
                            <div className={styles["image-optimization-progress"]}>
                                <img src={AutoOptimizationImageGIF} alt="auto optimizing" />
                                <small>Auto-optimizing your media</small>
                            </div>
                        </div>}
                    </div>
                );
            }
            // Load images according to view port
            if (loadLazily) {
                return (<ImageLoadLazily key={index} onClick={() => handleImageClick(index)} draggable="false" src={url} effect="blur"
                    className={`${styles["media-image"]} ${isMediaContain ? styles["media-contain"] : ""}`}
                    setLoadedImagesCount={setLoadedImagesCount}
                    onError={({ currentTarget }) => {
                        currentTarget.classList.add("isBrokenImage");
                        currentTarget.parentElement.classList.add("el-remove-click-listner", styles["remove-click-listner"]);
                        currentTarget.onError = null;
                        currentTarget.src = brokenImage;
                    }} />);
            }
            return (
                isInboxAttachments ?
                    <ImageMediaWithPlaceholder url={url} isMediaContain={isMediaContain} handleImageClick={handleImageClick} index={index} />
                    :
                    <img onClick={() => handleImageClick(index)} draggable="false" src={url} effect="blur"
                        className={`${styles["media-image"]} ${isMediaContain ? styles["media-contain"] : ""}`}
                        onError={({ currentTarget }) => {
                            currentTarget.classList.add("isBrokenImage");
                            currentTarget.parentElement.classList.add("el-remove-click-listner", styles["el-remove-click-listner", styles["remove-click-listner"]]);
                            currentTarget.onError = null;
                            currentTarget.src = brokenImage;
                        }}
                    />
            );
        }

        if (type === "video") {
            postThumbnailData === false ? postThumbnailData = [] : postThumbnailData;
            return (

                showThumbnailOnSingleVideo && !isEmpty(postThumbnailData) && !isEmpty(postThumbnailData[0]) ? <div className={"custom-thumbimg-wrapper "}
                    onClick={(event) => {
                        event.stopPropagation();
                        handleVideoClick(event, index);
                    }}
                    onKeyDown={(event) => handleVideoClick(event, index)}
                    tabIndex="0"
                    role="button"
                    aria-label="Play/Pause Video">{postThumbnailData[0] && <span className="play-button icon_phoenix-videoplay" />}{!postThumbnailData[0] ?
                        <div className="loading-wrapper" key={Math.random()}>
                            <i className="icon_phoenix-loader" />
                        </div> : <img src={postThumbnailData[0]} />} </div> :

                    <div className={`pos-rel el-video-wrap ${styles["video-wrap"]}`}>
                        {(videoRef?.current[index]?.paused || isMediaLibCollage) && playVideoIcon && (
                            <div
                                className={`icon_phoenix-videoplay el-video-play-button ${styles["video-play-button"]}`}
                                onClick={(event) => handleVideoClick(event, index)}
                            />
                        )}
                        {thumbnailWithPlayBtn && !isEmpty(postThumbnailData) && !isEmpty(postThumbnailData[0]) ?
                            (
                                <div className="event-cards-wrapper" onClick={showSliderForVideoThumbnail ? () => handleImageClick(index) : null}>
                                    <img
                                        src={typeof postThumbnailData === "string" ? postThumbnailData : postThumbnailData?.[(index || 0)]}
                                        className="thumbnail-media-wrapper"
                                        draggable="false"
                                        alt=""
                                        onError={({ currentTarget }) => {
                                            currentTarget.classList.add("isBrokenImage");
                                            currentTarget.parentElement.classList.add("el-remove-click-listner", styles["remove-click-listner"]);
                                            currentTarget.onError = null;
                                            currentTarget.src = brokenImage;
                                        }} />
                                    <span className="play-button icon_phoenix-videoplay" />
                                </div>
                            )
                            :
                            (props.isCalendarPost ? (
                                <div className="event-cards-wrapper" onClick={showSliderForVideoThumbnail ? () => handleImageClick(index) : null}>
                                    <span className="play-button icon_phoenix-videoplay play-button-overlay" />
                                    {renderVideoElement(url, thumbnail, type, index)}
                                </div>
                            ) :
                                renderVideoElement(url, thumbnail, type, index)
                            )
                        }
                    </div>
            );
        }

        if (type === "embed") {
            return (
                <div className="event-cards-wrapper" onClick={() => handleImageClick(index)}>
                    <img
                        src={url}
                        className="thumbnail-media-wrapper"
                        draggable="false"
                        alt=""
                        onError={({ currentTarget }) => {
                            currentTarget.classList.add("isBrokenImage");
                            if (currentTarget.parentElement?.classList.contains("event-cards-wrapper")) {
                                currentTarget.parentElement?.querySelector("span")?.classList.remove("play-button");
                                currentTarget.parentElement.classList.add("el-remove-click-listner", styles["remove-click-listner"]);
                            }
                            currentTarget.onError = null;
                            currentTarget.src = brokenImage;
                        }}
                    />
                    <span className="play-button icon_phoenix-videoplay" />
                </div>
            );
        }
    };

    // Collage: 1x1
    const singleMediaCollage = (mediaList, direction) => {
        const item = mediaList[0];
        if (isEmpty(item)) {
            return renderBrokenImage();
        }
        const { type, completeURL: url, aspectRatio } = item;
        let ht;
        let isMediaContain = false;
        let reduceWidthClass;

        if (isSocialPreview) {
            if (channel === "twitter") {
                // remove left/right spacing in case of twitter
                socialChannelCardWidth = socialChannelCardWidth - 86;
            }

            if (type?.includes("image")) {

                if (aspectRatio < 0.5625) {
                    isMediaContain = true;
                    ht = socialChannelCardWidth / (0.5625);
                } else {
                    ht = socialChannelCardWidth / aspectRatio;
                }

                // if (channel === "facebook") {
                //     if (aspectRatio < 1.45) {
                //         isMediaContain = true;
                //         ht = socialChannelCardWidth / (1.35);
                //     }
                // }

                if (channel === "linkedin") {
                    if (aspectRatio < 0.77) {
                        isMediaContain = true;
                        ht = socialChannelCardWidth / (0.77);
                    }
                }

                if (channel === "twitter") {
                    if (aspectRatio < 0.5625) {
                        isMediaContain = false;
                        reduceWidthClass = "width-85";
                    }
                }
                if (channel === "apple_connect") {
                    // dont need height for apple showcase
                    ht = "inherit";
                }
            } else if (type?.includes("video")) {
                if (aspectRatio < 1) {
                    isMediaContain = true;
                    ht = socialChannelCardWidth;
                } else {
                    ht = socialChannelCardWidth / aspectRatio;
                }
            }
        }
        if (isSocialPreview) {
            return (
                <div style={{ height: isFeedLayout ? setAssetDimensionsInFeedLayout("height") : ht || "inherit", width: setAssetDimensionsInFeedLayout("width") }}
                    className={`${styles["media-collage"]} ${styles[direction === "horizontal" ? "media-collage-horizontal" : "media-collage-vertical"]}`}>
                    <div className={`${styles["width-100"]} ${styles["height-100"]} ${withOuterBorders ? styles["single-img-layout"] : ""} ${getEncodedStyleClass(reduceWidthClass || "", styles)}`} onMouseDown={(event) => onPreventMediaDragDropHandler(event)}>
                        {renderMedia({ type, url, isMediaContain, item })}</div>
                </div>
            );
        }
        return (
            <div
                className={`${styles["media-collage"]} ${styles[direction === "horizontal" ? "media-collage-horizontal" : "media-collage-vertical"]}`}>
                <div className={`${styles["width-100"]} ${styles["height-100"]} ${withOuterBorders ? styles["single-img-layout"] : ""}`} onMouseDown={(event) => onPreventMediaDragDropHandler(event)}>
                    {renderMedia({ type, url, index: 0, item })}</div>
            </div>
        );

    };

    // Collage: 2x2 (Horizontal & vertical)
    // Direction -> Horizontal: 
    // 1st column covers 50% width and 100% height and contains 1 media item.
    // 2nd column covers 50% width and 100% height and contains 1 media item.
    // Direction -> Vertical: 
    // 1st row covers 100% width and 50% height and contains 1 media item.
    // 2nd row covers 100% width and 50% height and contains 1 media item.
    const doubleMediaCollage = (mediaList, direction = "horizontal") => {
        const firstImageHorizontal = channel && channel === "facebook" ? mediaList[0] && mediaList[0].imageType == "horizontal" : "";
        const secondImageHorizontal = channel && channel === "facebook" ? mediaList[1] && mediaList[1].imageType == "horizontal" : "";
        let fbHt, twitterHt, linkedinHt, height;

        if (isSocialPreview) {
            fbHt = socialChannelCardWidth / 2;
            twitterHt = socialChannelCardWidth / (1.5);
            linkedinHt = socialChannelCardWidth / 1.33;

            if (channel === "facebook") {
                height = fbHt;
            } else if (channel === "twitter") {
                height = twitterHt;
            } else if (channel === "linkedin") {
                height = linkedinHt;
            }
        }
        if (isSocialPreview) {
            return (
                <div
                    style={{ height: isFeedLayout ? setAssetDimensionsInFeedLayout("height") : height || "inherit", width: setAssetDimensionsInFeedLayout("width") }}
                    className={`${styles["media-collage"]} ${direction === "horizontal" ?
                        firstImageHorizontal && secondImageHorizontal ? styles["media-collage-vertical"] + " " + styles["vertical-two-images"] : styles["media-collage-horizontal"] : styles["media-collage-vertical"]}`}>
                    {
                        mediaList.map((media, index) => {
                            if (!isEmpty(media)) {
                                const { type, completeURL: url } = media;
                                return (
                                    <div
                                        key={`media_${index}`}
                                        className={getEncodedStyleClass(direction === "horizontal" ?
                                            withOuterBorders ? firstImageHorizontal && secondImageHorizontal ? "width-100 height-50" : "two-img-layout" : "width-50 height-100" :
                                            "width-100 height-50", styles)}
                                    >
                                        {renderMedia({ type, url, index, item: media })}
                                    </div>
                                );
                            } else return renderBrokenImage();
                        })
                    }
                </div>
            );
        }

        return (<div
            className={`${styles["media-collage"]} ${styles[direction === "horizontal" ?
                "media-collage-horizontal" :
                "media-collage-vertical"]}
        `}
        >
            {
                mediaList.map((media, index) => {
                    if (!isEmpty(media)) {
                        const { type, completeURL: url } = media;
                        return (
                            <div
                                key={`media_${index}`}
                                className={getEncodedStyleClass(direction === "horizontal" ? withOuterBorders ? "width-50 height-100 two-img-layout" :
                                    "width-50 height-100" :
                                    "width-100 height-50", styles)}
                            >
                                {renderMedia({ type, url, index, item: media })}
                            </div>
                        );
                    } else return renderBrokenImage();
                })
            }
        </div>);
    };

    // Collage: 3x3 (Horizontal & vertical)
    // Direction -> Horizontal: 
    // 1st column covers 50% width and 100% height and contain 1 media item.
    // 2nd column covers 50% width and 100% height and has 2 media items.
    // Direction -> Vertical:
    // 1st row covers 100% width and 50% height and contain 1 media item.
    // 2nd row covers 100% width and 50% height and contains 2 media items.
    const tripleMediaCollage = (mediaList, direction = "horizontal", difference = 3, spiltRightColCount = 2) => {
         const firstImageHorizontal = channel && (channel === "facebook" || channel === "linkedin") ? mediaList[0] && mediaList[0].imageType == "horizontal" : null;
        const firstImageSquare = mediaList[0] && mediaList[0].imageType == "square";
        const firstItem = [...mediaList].splice(0, 1);
        const nextTwoItems = [...mediaList].splice(1, spiltRightColCount);
        const remainingItems = mediaList.length - difference;
        let fbHt, twitterHt, linkedinHt, height;
        if (isSocialPreview) {
            fbHt = socialChannelCardWidth / 1;
            twitterHt = socialChannelCardWidth / (1.5);
            linkedinHt = socialChannelCardWidth / (1.33);

            if (channel === "facebook") {
                height = fbHt;
            } else if (channel === "twitter") {
                height = twitterHt;
            } else if (channel === "linkedin") {
                height = linkedinHt;
            }
        }

        let classNameTopRow = "", classNameBottomRow = "";
        if (channel === "facebook") {
            classNameTopRow = "width-65";
            classNameBottomRow = "width-35";
            if (firstImageHorizontal) {
                classNameTopRow = "width-100 height-65";
                classNameBottomRow = "width-100 height-35";
            }
        }
        if (channel === "linkedin") {
             classNameTopRow = "width-52";
            classNameBottomRow = "width-48";
            if (firstImageHorizontal) {
                classNameTopRow = "width-100 height-60";
                classNameBottomRow = "width-100 height-40";
            }else if (firstImageSquare) {
                classNameTopRow = "width-67";
                classNameBottomRow = "width-33";
            }
        }
        if (channel === "twitter") {
            classNameTopRow = "width-50";
            classNameBottomRow = "width-50";
        }
        if (isSocialPreview) {
            return (
                <div
                    style={{ height: isFeedLayout ? setAssetDimensionsInFeedLayout("height") : height || "inherit", width: isFeedLayout && setAssetDimensionsInFeedLayout("width") }}
                    className={`${styles["media-collage"]} ${getEncodedStyleClass(direction === "horizontal" ?
                        firstImageHorizontal ? "media-collage-vertical triple-image-border" : "media-collage-horizontal" :
                        "media-collage-vertical", styles)}
                    `}
                >
                    {
                        firstItem.map((media, index) => {
                            if (!isEmpty(media)) {
                                const { type, completeURL: url } = media;
                                return (
                                    <div
                                        key={`firstItem_${index}`}
                                        className={getEncodedStyleClass(direction === "horizontal" ?
                                            withOuterBorders ? classNameTopRow : "width-50 height-100" :
                                            "width-100 height-50", styles)}
                                    >
                                        {renderMedia({ type, url, index, item: media })}
                                    </div>
                                );
                            } else return renderBrokenImage();
                        })
                    }
                    {
                        <div
                            className={`${getEncodedStyleClass(direction === "horizontal" ?
                                withOuterBorders ? firstImageHorizontal ? `${classNameBottomRow} flex-row ${nextTwoItems.length == 3 ? "four-image-bottom-layout" : ""}` : classNameBottomRow : "width-50 height-100 flex-col" :
                                "width-100 height-50 flex-row", styles)}`}
                        >
                            {
                                nextTwoItems.map((media, index) => {
                                    if (!isEmpty(media)) {
                                        const { type, completeURL: url } = media;
                                        return (
                                            <div
                                                key={`nextTwoItems_${index}`}
                                                className={getEncodedStyleClass(direction === "horizontal" ?
                                                    firstImageHorizontal ? "width-50 height-100" : `width-100 ${spiltRightColCount == 3 ? "height-33" : "height-50"}  pos-rel` :
                                                    "width-50 height-100 pos-rel", styles)}
                                            >
                                                {renderMedia({ type, url, index: index + 1, item: media })}
                                                {index === (nextTwoItems.length - 1) && remainingItems > 0 && (
                                                    <div className={styles["plus-item-div"]}>
                                                        +{remainingItems}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else return renderBrokenImage();
                                })
                            }
                        </div>
                    }
                </div>
            );
        }
        return (
            <div
                className={`${styles["media-collage"]} ${styles[direction === "horizontal" ?
                    "media-collage-horizontal" :
                    "media-collage-vertical"]}
            `}
            >
                {
                    firstItem && firstItem.map((media, index) => {
                        if (!isEmpty(media)) {
                            const { type, completeURL: url } = media;
                            return (
                                <div
                                    key={`firstItem_${index}`}
                                    className={getEncodedStyleClass(direction === "horizontal" ?
                                        withOuterBorders ? "width-65" : "width-50 height-100" :
                                        "width-100 height-50", styles)}
                                >
                                    {renderMedia({ type, url, index, item: media })}
                                </div>
                            );
                        } else return renderBrokenImage();
                    })
                }
                {
                    <div
                        className={getEncodedStyleClass(direction === "horizontal" ?
                            withOuterBorders ? "width-35" : "width-50 height-100 flex-col" :
                            "width-100 height-50 flex-row", styles)}>
                        {
                            nextTwoItems.map((media, index) => {
                                if (!isEmpty(media)) {
                                    const { type, completeURL: url } = media;
                                    return (
                                        <div
                                            key={`nextTwoItems_${index}`}
                                            className={getEncodedStyleClass(direction === "horizontal" ?
                                                "width-100 height-50 pos-rel" :
                                                "width-50 height-100 pos-rel", styles)}
                                        >
                                            {renderMedia({ type, url, index: index + 1, item: media })}
                                            {index === (nextTwoItems.length - 1) && remainingItems > 0 && (
                                                <div onClick={() => handleImageClick(index + 1)} className={styles["plus-item-div"]}>
                                                    +{remainingItems}
                                                </div>
                                            )}
                                        </div>
                                    );
                                } else return renderBrokenImage();
                            })
                        }
                    </div>
                }
            </div>
        );
    };

    // Collage: 4x4
    // 1st row covers 100% width and 50% height and contain 2 media items.
    // 2nd row covers 100% width and 50% height and contains 2 media items.
    const quadMediaCollage = (mediaList) => {
        const firstTwoItems = [...mediaList].splice(0, 2);
        const nextTwoItems = [...mediaList].splice(2, 2);
        const remainingItems = mediaList.length - 4;
        const remainingMediaCount = totalCount - 4;
        let fbHt, twitterHt, linkedinHt, height;

        if (isSocialPreview) {
            fbHt = socialChannelCardWidth / 1;
            twitterHt = socialChannelCardWidth / (1.5);
            linkedinHt = socialChannelCardWidth / (1.33);

            if (channel === "facebook") {
                height = fbHt;
            } else if (channel === "twitter") {
                height = twitterHt;
            } else if (channel === "linkedin") {
                height = linkedinHt;
            }

            return (
                <div style={{ height: isFeedLayout ? setAssetDimensionsInFeedLayout("height") : height || "inherit", width: isFeedLayout && setAssetDimensionsInFeedLayout("width") }} className={`${styles["media-collage"]} ${styles["media-collage-vertical"]}`}>
                    {
                        <div className={`${styles["width-100"]} ${styles["height-50"]} ${styles["flex-row"]} ${withOuterBorders ? styles["quad-row-one"] : ""}`}>
                            {
                                firstTwoItems.map((media, index) => {
                                    if (!isEmpty(media)) {
                                        const { type, completeURL: url } = media;
                                        return (
                                            <div
                                                key={`nextTwoItems_${index}`}
                                                className={`${styles["width-50"]} ${styles["height-100"]}`}
                                            >
                                                {renderMedia({ type, url, index, item: media })}
                                            </div>
                                        );
                                    } else return renderBrokenImage();
                                })
                            }
                        </div>
                    }
                    {
                        <div className={`${styles["width-100"]} ${styles["height-50"]} ${styles["flex-row"]} ${withOuterBorders ? styles["quad-row-two"] : ""}`}>
                            {
                                nextTwoItems.map((media, index) => {
                                    if (!isEmpty(media)) {
                                        const { type, completeURL: url } = media;
                                        return (
                                            <div
                                                key={`nextTwoItems_${index}`}
                                                className={`${styles["width-50"]} ${styles["height-100"]} ${styles["pos-rel"]}`}
                                            >
                                                {renderMedia({ type, url, index: index + 2, item: media })}
                                                {index === (nextTwoItems.length - 1) && remainingItems > 0 && (
                                                    <div onClick={() => handleImageClick(index + 2)} className={styles["plus-item-div"]}>
                                                        +{isMediaLibCollage ? remainingMediaCount : remainingItems}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else return renderBrokenImage();
                                })
                            }
                        </div>
                    }
                </div>
            );
        }

        return (
            <div className={`${styles["media-collage"]} ${styles["media-collage-vertical"]}`}>
                {
                    <div className={`${styles["width-100"]} ${styles["height-50"]} ${styles["flex-row"]} ${withOuterBorders ? styles["quad-row-one"] : ""}`}>
                        {
                            firstTwoItems.map((media, index) => {
                                if (!isEmpty(media)) {
                                    const { type, completeURL: url } = media;
                                    return (
                                        <div
                                            key={`nextTwoItems_${index}`}
                                            className={`${styles["width-50"]} ${styles["height-100"]}`}
                                        >
                                            {renderMedia({ type, url, index, item: media })}
                                        </div>
                                    );
                                } else return renderBrokenImage();
                            })
                        }
                    </div>
                }
                {
                    <div className={`${styles["width-100"]} ${styles["height-50"]} ${styles["flex-row"]} ${withOuterBorders ? styles["quad-row-two"] : ""}`}>
                        {
                            nextTwoItems.map((media, index) => {
                                if (!isEmpty(media)) {
                                    const { type, completeURL: url } = media;
                                    return (
                                        <div
                                            key={`nextTwoItems_${index}`}
                                            className={`${styles["width-50"]} ${styles["height-100"]} ${styles["pos-rel"]}`}
                                        >
                                            {renderMedia({ type, url, index: index + 2, item: media })}
                                            {index === (nextTwoItems.length - 1) && remainingItems > 0 && (
                                                <div onClick={() => handleImageClick(index + 2)} className={styles["plus-item-div"]}>
                                                    +{remainingItems}
                                                </div>
                                            )}
                                        </div>
                                    );
                                } else return renderBrokenImage();
                            })
                        }
                    </div>
                }
            </div>
        );
    };

    const facebookMediaCollage = (mediaList, direction) => {
        const length = mediaList.length;
        let previewDirection;
        let firstRow;
        let secondRow;
        let remaining = 0;

        if (length > 4) {
            previewDirection = "veritical";
            firstRow = [...mediaList].splice(0, 2);
            secondRow = [...mediaList].splice(2, 3);
            remaining = mediaList.length - 5;
        } else if (length == 4) {
            if (((mediaList[0] && mediaList[0].imageType == "square") || (mediaList[4] && mediaList[4].imageType == "horizontal")) && channel === "facebook") {
                return quadMediaCollage(mediaList);
            }
            return tripleMediaCollage(mediaList, direction, length, 3);
        }

        let fbHt, linkedinHt, height;
        if (isSocialPreview) {
            fbHt = socialChannelCardWidth / (1.33);
            linkedinHt = socialChannelCardWidth / (1.33);

            if (channel === "facebook") {
                height = fbHt;
            } else if (channel === "linkedin") {
                height = linkedinHt;
            }
        }

        return (
            <div style={{ height: isFeedLayout ? setAssetDimensionsInFeedLayout("height") : height || "inherit", width: isFeedLayout && setAssetDimensionsInFeedLayout("width") }} className={`${styles["media-collage"]} ${previewDirection ? styles["media-collage-vertical"] : ""}`}>
                {
                    <div className={`${styles["width-100"]} ${styles["height-60"]} ${styles["flex-row"]} ${withOuterBorders ? styles["quad-row-one"] : ""}`}>
                        {
                            firstRow && firstRow.map((media, index) => {
                                if (!isEmpty(media)) {
                                    const { type, completeURL: url } = media;
                                    return (
                                        <div
                                            key={`firstRow_${index}`}
                                            className={`${styles["width-50"]} ${styles["height-100"]}`}
                                        >
                                            {renderMedia({ type, url, index, item: media })}
                                        </div>
                                    );
                                } else return renderBrokenImage();
                            })
                        }
                    </div>
                }
                {
                    <div className={`${styles["width-100"]} ${styles["height-40"]} ${styles["flex-row"]} ${withOuterBorders ? styles["quad-row-two"] + " " + styles["five-image-border"] : ""}`}>
                        {
                            secondRow && secondRow.map((media, index) => {
                                if (!isEmpty(media)) {
                                    const { type, completeURL: url } = media;
                                    return (
                                        <div
                                            key={`secondRow_${index}`}
                                            className={`${styles["width-50"]} ${styles["height-100"]} ${styles["pos-rel"]}`}
                                        >
                                            {renderMedia({ type, url, index: index + 2, item: media })}
                                            {index === (secondRow.length - 1) && remaining > 0 && (
                                                <div
                                                    onClick={() => handleImageClick(index + 2)}
                                                    className={styles["plus-item-div"]}
                                                >
                                                    +{remaining} {isAutoOptimizationInRemaining && (
                                                        <div className={styles["auto-optimization-progress"]}>
                                                            <img src={AutoOptimizationImageGIF} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                } else return renderBrokenImage();
                            })
                        }
                    </div>
                }
            </div>
        );
    };

    const multiMediaCollage = (mediaList, direction = "horizontal", threshold) => {
        if (isSocialPreview) {
            if (channel && (channel === "facebook" || channel === "linkedin")) {
                return facebookMediaCollage(mediaList, direction);
            }

            if (channel && channel === "twitter") {
                if (mediaList.length > 4) {
                    mediaList = mediaList.slice(0, 4);
                }
                return quadMediaCollage(mediaList, direction);
            }
        }

        if (threshold === 3) {
            return tripleMediaCollage(mediaList, direction);
        }

        if (threshold >= 4) {
            return quadMediaCollage(mediaList, direction);
        }
    };

    const createCollage = (mediaList) => {
        const size = mediaList.length;
        console.log({ size });
        if (!isEmpty(mediaList) && (channel === "google" || channel === "apple_connect")) {
            let imgArr = [];
            imgArr.push(mediaList[0]);
            return singleMediaCollage(imgArr);
        }
        switch (size) {
            case 1: return singleMediaCollage(mediaList);
            case 2: return doubleMediaCollage(mediaList, direction);
            case 3: return tripleMediaCollage(mediaList, direction);
            case 4: return multiMediaCollage(mediaList, direction, threshold);
            default: return multiMediaCollage(mediaList, direction, threshold);
        }

    };

    const getAttachedFile = (attachments) => {
        let res = attachments.map((item) => {
            return item.completeURL;
        });
        return res;
    };

    const getAttachedFileTypes = (attachments) => {
        let res = attachments.map((item) => {
            return item?.type;
        });
        return res;
    };

    const getAspectRatioSpecificHeight = (aspectRatio) => {
        const height = socialChannelCardWidth / aspectRatio;
        return height;
    };

    const createCarouselForVideos = () => {
        const firstImageAspectRatio = attachments[0].aspectRatio;
        const height = getAspectRatioSpecificHeight(firstImageAspectRatio);

        return (
            <div className={`video-carousel ${getEncodedStyleClass(customVideoCarouselClass, styles)} ${styles['video-car']}`} style={{ height }}>
                <Slider
                    extraProps={{ arrows: true }}
                    showAttachedFiles
                    attachedFiles={getAttachedFile(attachments)}
                    attachedFileTypes={getAttachedFileTypes(attachments)}
                    newCurrentSlide={newCurrentSlide}
                    updateCurrentSlide={setNewCurrentSlide}
                    showSlideInfo
                    //  classNameTop={attachments.length > 1 ? "insta-slider-mt16" : ""}
                    // postThumbnailData={postThumbnailData}
                    firstImageAspectRatio={attachments[0].aspectRatio}
                    socialChannelCardWidth={600}
                    handleAttachmentOnClick={handleImageClick}
                    customAttachmentOnClick={attachments.length > 1}
                />
            </div>
        );
    };

    const setAssetDimensionsInFeedLayout = (dimension) => {
        if (dimension == "height" && isFeedLayout) {
            return dimnesionsForFeedLayoutCollage.height;
        } else if (dimension == "width" && isFeedLayout) {
            return dimnesionsForFeedLayoutCollage.width;
        }
    };

    const feedLayoutDimensions = { height: setAssetDimensionsInFeedLayout("height"), width: setAssetDimensionsInFeedLayout("width") };

    return (
        <div onClick={(e) => {
            // Fix image opening issue on engage main feed
            e.stopPropagation();
        }} data-testid="el-test-media-collage" className={`el-media-collage ${styles["media-collage-wrapper"]} ${isFeedLayout ? styles["collapse-view"] : ""} ${className}`} style={feedLayoutDimensions}>
            {isFeedLayout && showCombinedLoaderForMultipleImages && loadedImagesCount !== attachments?.length && loadedImagesCount < 5 && attachments?.[0]?.type === "image" &&
                <div
                    style={feedLayoutDimensions}
                    className={`${styles["combined-loader-transition"]} ${styles["glare-transition-imagecollage"]}`}
                />}
            {isMultipleVideos ? createCarouselForVideos() : createCollage(attachments || [])}
        </div>
    );
};

MediaCollage.propTypes = {
    attachments: PropTypes.array, // list of media items
    className: PropTypes.string, // Custom class for custom styling
    direction: PropTypes.string, // Media Alignment Direction i.e, row (Horizontal -> left to right) or column (Vertical -> top to bottom)
    threshold: PropTypes.number, // threshold (min value: 3) -> it represents total no of media items to render, above it just place a banner with text "+1" or "+2" above the last media item in collage.
    withOuterBorders: PropTypes.bool,
    channel: PropTypes.string,
    showThumbnailOnSingleVideo: PropTypes.bool,
    postThumbnailData: PropTypes.string | PropTypes.array,
    socialChannelCardWidth: PropTypes.number,
    isSocialPreview: PropTypes.bool,
    playVideoIcon: PropTypes.bool,
    postingSites: PropTypes.array,
    isDrawer: PropTypes.bool,
    setSlider: PropTypes.func,
    disableVideo: PropTypes.bool,
    thumbnailWithPlayBtn: PropTypes.bool,
    enableDnDWithSingleImage: PropTypes.bool,
    isInboxAttachments: PropTypes.bool,
    isMultipleVideos: PropTypes.bool,
    fullLoadMedia: PropTypes.bool,
    loadLazily: PropTypes.bool,
    videoFullScreenMode: PropTypes.bool,
    customVideoCarouselClass: PropTypes.string,
    showSliderForVideoThumbnail: PropTypes.bool,
    isCalendarPost: PropTypes.bool,
    isFeedLayout: PropTypes.bool, //used to determine the dimnesions of collage in a feed view
    showCombinedLoaderForMultipleImages: PropTypes.bool, // works only when "isFeedLayout" flag is true
    isAutoOptimizationInRemaining: PropTypes.bool,
    feedLayoutResolutions: PropTypes.object,
    isMediaLibCollage: PropTypes.bool, // used to determine if the component is used as a media collage
    totalCount: PropTypes.number // total count of media items in the folder
};

MediaCollage.defaultProps = {
    withOuterBorders: false
};

export default MediaCollage;