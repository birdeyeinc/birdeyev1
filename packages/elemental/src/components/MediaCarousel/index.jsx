import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Styles from "./Carousel.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Broken from "assets/images/brokenImage.svg";
import Loader from "atoms/LoadingShimmer";
import playButton from "assets/images/video.svg";
import Gallery from "components/MediaGallery";
import { getEncodedStyleClass } from "utils/index";


const getStyle = (str)=> getEncodedStyleClass(str, Styles)

const Carousel = (props) => {
    const { images, broken, isPDFLitePage, hideCaptionAndName, helpPanel, handlePendoTracker, isProfile, isSetupProfileCarousel, showDownload = true, isSocial = false, downloadImageFromUrl } = props;
    const imageScroller = useRef(null);
    const [left, setLeft] = useState(false);
    const [right, setRight] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [initialSlide, setInitialSlide] = useState(1);

    const leftScroll = () => {
        imageScroller.current.scrollBy(-200, 0);
    };

    const rightScroll = () => {
        imageScroller.current.scrollBy(200, 0);
    };

    const checkIsYoutubeVideo = (videoUrl) => {
        return videoUrl && videoUrl.indexOf("www.youtube.com") > -1;
    };

    const clickAction = (i, caption) => {
        setShowModal(true);
        setInitialSlide(i);
        setCurrentSlide(i);
        if (props.helpPanel) {
            handlePendoTracker("Video visit", caption);
        }
    };

    const closeGallery = () => {
        setShowModal(false);
        setInitialSlide(1);
    };

    const getYouTubeEmbedVideoLink = (videoUrl) => {
        if (videoUrl && videoUrl.indexOf("watch?v=") > -1) {
            videoUrl = videoUrl.replace("watch?v=", "embed/");
        }
        return videoUrl;
    };

    const customSize = {
        height: `${props.itemHeight + "px"}`,
        width: `${props.itemWidth + "px"}`
    };

    const customSizeWraper = {
        height: `${(props.itemHeight + 2) + "px"}`,
        maxWidth: `${(props.itemWidth + 2) + "px"}`
    };

    useEffect(() => {
        if (imageScroller && imageScroller.current) {
            if (
                imageScroller.current.offsetWidth < imageScroller.current.scrollWidth
            ) {
                setRight(true);
            } else {
                setRight(false);
            }
        }
    }, [imageScroller, imageScroller.current, imageScroller.current && imageScroller.current.scrollWidth, props.collapsed]);

    if (imageScroller && imageScroller.current) {
        imageScroller.current.addEventListener("scroll", () => {
            if (imageScroller.current.scrollLeft === 0) {
                setLeft(false);
            } else {
                setLeft(true);
            }
            if (
                imageScroller.current.scrollLeft + imageScroller.current.offsetWidth <
                imageScroller.current.scrollWidth
            ) {
                setRight(true);
            } else {
                setRight(false);
            }
        });
    }

    return (
        <div data-testid="el-test-media-carousel" className={`el-media-caraousel ${getStyle(`cover ${isSetupProfileCarousel ? "setup-profile-carousel" : ""}`)}`}>
            {!isPDFLitePage && left && (
                <div data-testid="el-test-mc-left" className={getStyle("left")} onClick={leftScroll}>
                    <div className={getStyle("carousel-prev")} />
                </div>
            )}
            <div ref={imageScroller} className={getStyle("scroll-images")}>
                {images.map((image, i) => {
                    if (image.type === "PHOTO") {
                        return (
                            <div onClick={() => clickAction(i + 1)} key={i} className={getStyle("child")} style={customSizeWraper}>
                                {
                                    props.isPDFLitePage ? (
                                        <img alt={"Image"}
                                            onError={(e) => {
                                                {
                                                    e.target.src = broken;
                                                    e.target.classList.add(Styles["broken-image"], isProfile ? Styles["broken-image-profile"] : null);
                                                    e.target.style.pading = `${(props.itemHeight - 24) / 2}px ${(props.itemWidth - 24) / 2}px !important`;
                                                }
                                            }}
                                            height={props.itemHeight}
                                            className={Styles["carousel-img"]}
                                            src={image.thumbnailUrl ? image.thumbnailUrl : image.url}
                                            width={props.itemWidth} />
                                    ) : (
                                        <LazyLoadImage
                                            placeholder={
                                                <Loader
                                                    displayCount={1}
                                                    shimmerCount={[
                                                        {
                                                            size: "full-width",
                                                            height: "carousel-height",
                                                            width: "full-width"
                                                        }
                                                    ]}
                                                />
                                            }
                                            alt={"Image"}
                                            onError={(e) => {
                                                {
                                                    e.target.src = broken;
                                                    e.target.classList.add(Styles["broken-image"], isProfile ? Styles["broken-image-profile"] : null, isSocial ? Styles["broken-image-social"] : null);
                                                    e.target.style.pading = `${(props.itemHeight - 24) / 2}px ${(props.itemWidth - 24) / 2}px !important`;
                                                }
                                            }}
                                            height={props.itemHeight}
                                            className={Styles["carousel-img"]}
                                            src={image.thumbnailUrl ? image.thumbnailUrl : image.url}
                                            width={props.itemWidth}
                                        />)
                                }
                                {image.caption !== "" && (
                                    <div className={getStyle("carousel-caption")} style={{maxWidth: `${props.itemWidth}px`}}>{image.caption}</div>
                                )}
                            </div>
                        );
                    } else if (image.type === "VIDEO") {
                        if (helpPanel ? !checkIsYoutubeVideo(image.url) : checkIsYoutubeVideo(image.url)) {
                            return (
                                <div
                                    onClick={() => clickAction(i + 1, image.caption)}
                                    key={i}
                                    className={getStyle("child")}
                                    style={customSizeWraper}
                                >
                                    <iframe
                                        src={getYouTubeEmbedVideoLink(image.url)}
                                        frameBorder="0"
                                        allowFullScreen
                                        onClick={(e) => e.preventDefault()}
                                    />
                                    {image.caption !== "" && (
                                        <div className={getStyle("carousel-caption")}  style={{maxWidth: `${props.itemWidth}px`}}>{image.caption}</div>
                                    )}
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    onClick={() => clickAction(i + 1, image.caption)}
                                    key={i}
                                    className={getStyle("child overlay-play-button")}
                                    style={customSizeWraper}
                                >
                                    {helpPanel ? <video className={getStyle("carousel-video help-panel")} preload="metadata" poster={image.poster}>
                                        <source type="video/mp4" src={image.url} />
                                    </video> : <video className={getStyle("carousel-video")} style={customSize} preload="metadata">
                                        <source type="video/mp4" src={image.url + "#t=0.5"} />
                                    </video>}
                                    <div className={getStyle("overlay-play-button__overlay")}>
                                        {/* <images width="40px" height="40px" src={playButton} /> */}
                                        <div className={`${getStyle("overlay-play-button__play")} reviews-videos`}>
                                            <img src={playButton} />
                                        </div>
                                    </div>
                                    {image.caption !== "" && (
                                        <div className={getStyle("carousel-caption")} style={{maxWidth: `${props.itemWidth}px`}}>{image.caption}</div>
                                    )}
                                </div>
                            );
                        }
                    } else {
                        return (
                            <div onClick={() => clickAction(i + 1)} key={i} className={getStyle("child" )}style={customSizeWraper}>
                                <img
                                    className={getStyle(`broken-image ${isProfile ? "broken-image-profile" : null} carousel-img`)}
                                    style={{pading: `${(props.itemHeight - 24) / 2}px ${(props.itemWidth - 24) / 2}px !important`}}
                                    alt={"Other"}
                                    height={"24px"}
                                    src={broken}
                                    width={"24px"}
                                />
                                {image.caption !== "" && (
                                    <div className={getStyle("carousel-caption")} style={{maxWidth: `${props.itemWidth}px`}}>{image.caption}</div>
                                )}
                            </div>
                        );
                    }
                })}
            </div>
            {!isPDFLitePage && right && (
                <div data-testid="el-test-mc-right" className={getStyle("right")} onClick={rightScroll}>
                    <div className={getStyle("carousel-next")} />
                </div>
            )}

            {showModal && (
                <Gallery
                    closeModal={closeGallery}
                    extraProps={{ lazyLoad: true, arrows: true, infinite: false}}
                    showAttachedFiles
                    attachedFiles={images}
                    newCurrentSlide={currentSlide}
                    updateCurrentSlide={setCurrentSlide}
                    showSlideInfo
                    showFileName // remove it through the props
                    showDownload={showDownload}
                    showOnTop
                    hideCaptionAndName={hideCaptionAndName}
                    initialSlide={initialSlide}
                    downloadImageFromUrl = {downloadImageFromUrl}
                />
            )}
        </div>
    );
};

Carousel.propTypes = {
    images: PropTypes.array,
    broken: PropTypes.string,
    isPDFLitePage: PropTypes.bool,
    collapsed: PropTypes.bool,
    itemHeight: PropTypes.number,
    itemWidth: PropTypes.number,
    isProfile: PropTypes.bool,
    hideCaptionAndName: PropTypes.bool,
    helpPanel: PropTypes.bool,
    handlePendoTracker: PropTypes.func,
    showDownload: PropTypes.bool,
    isSocial: PropTypes.bool,
    isSetupProfileCarousel: PropTypes.bool,
    downloadImageFromUrl: PropTypes.func
};

Carousel.defaultProps = {
    broken: Broken,
    isPDFLitePage: false,
    itemHeight: 120,
    itemWidth: 180
};

export default Carousel;
