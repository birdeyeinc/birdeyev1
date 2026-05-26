import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { map } from "lodash";
import './Slick.scss';
import instaPlayImg from "assets/instagram-play.svg";
import brokenImage from "assets/brokenImage.svg";
import { downloadFile, downloadImageFromUrl, getEncodedStyleClass, getValidVideoExtensions } from "utils";
import VideoPlayer from "./Videoplayer";



// eslint-disable-next-line react/no-multi-comp
class Slick extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleLeftArrowClick = (event) => {
        if (event.keyCode === 37) {
            this.slider.slickPrev();
        } else if (event.keyCode === 39) {
            this.slider.slickNext();
        } else if (event.keyCode === 27) {
            this.props.closeModal();
        }
    };

    componentDidMount() {
        document.addEventListener("keydown", this.handleLeftArrowClick);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleLeftArrowClick);
    }

    getContent = () => {
        const { content } = this.props;
        return map(content, (item, index) => {
            return (<div key={index}>{item}</div>);
        });
    };

    handleVideoPause = () => {
        const allPlayers = document.querySelectorAll(".video-media-modal");
        allPlayers.forEach(player => {
            const instance = player;
            if (instance && !instance.paused) {
                instance.pause();
            }
        });
    }
    checkIfVideo = (item, index = null) => {
        const { isInboxAttachment, attachedFileTypes } = this.props;
        if (isInboxAttachment) {
            return item?.match(getValidVideoExtensions({ attachment: true }));
        }

        return item?.match(getValidVideoExtensions({ attachment: false })) || (index !== null ? attachedFileTypes?.[index] === "video" : false);
    }

    renderAttachedFiles = () => {
        const { checkIfVideo, checkIsYoutubeVideo, getYouTubeEmbedVideoLink, checkIsTikTokEmbedVideo } = this;
        const { attachedFiles, postThumbnailData, handleAttachmentOnClick, customAttachmentOnClick, isInboxAttachment } = this.props;
        return map(attachedFiles, (item, index) => {
            let videoTemplate;
            if (checkIfVideo(item, index)) {
                if (postThumbnailData && postThumbnailData.length) {
                    videoTemplate = (<>
                        <span className="play-btn-wrapper">
                            <img src={instaPlayImg} alt="instagram-play" />
                        </span>
                        <img src={postThumbnailData[0]} alt="error" />
                    </>);
                } else {
                    videoTemplate = (
                        customAttachmentOnClick ? (<div className="video-wrapper" onClick={handleAttachmentOnClick.bind(null, index)}><video id={index} controls={false}>
                            <source type="video/mp4" src={item} />
                        </video><span className="play-button icon_phoenix-videoplay" /></div>) : (
                            <div className="video-wrapper">
                                <VideoPlayer id={`video-${index}`} videoSrc={item} isInboxAttachment={isInboxAttachment} autoPlay={this.props.autoPlay} />
                                {/* Below code is replaced with Component in order to remove PIP mode from video */}
                                {/* <video className="video-media-modal" id={index} controls >
                                    <source type="video/mp4" src={item}/>
                                </video> */}
                            </div>
                        )
                    );
                }
            } else if (checkIsYoutubeVideo(item)) {
                videoTemplate = (
                    <iframe
                        src={getYouTubeEmbedVideoLink(item)}
                        frameBorder="0"
                        allowFullScreen
                    />
                );
            } else if (checkIsTikTokEmbedVideo(item)) {
                videoTemplate = <TikTokEmbedVideo url={item} />;
            } else {
                videoTemplate = customAttachmentOnClick ?
                    <img src={item} onClick={handleAttachmentOnClick.bind(null, index)} alt="error" /> :
                    (<img src={item} alt="error" onError={(e) => {
                        { e.target.src = brokenImage; e.target.classList.add("slick-broken-image"); }
                    }} />);
            }
            return (
                <div key={index}>
                    {videoTemplate}
                </div>
            );
        });
    }

    downloadImage = (e) => {
        const { downloadToLocal } = this.props;
        const { checkIfVideo } = this;
        e.preventDefault();
        const { attachedFiles, newCurrentSlide, customDownloadCallback } = this.props;
        const imageURL = attachedFiles[newCurrentSlide - 1];
        if (customDownloadCallback) {
            customDownloadCallback({ imageURL });
            return;
        }
        if (checkIfVideo(imageURL)) {
            downloadImageFromUrl(imageURL);
        } else {
            downloadToLocal ? downloadImageFromUrl(imageURL, true) : downloadFile(imageURL);
        }
    }

    showfilename = () => {
        const { attachedFiles, newCurrentSlide, isEngage } = this.props;
        const imageURL = attachedFiles[newCurrentSlide - 1];
        const fileName = imageURL?.split("/")?.pop();
        if (isEngage) {
            return fileName && fileName?.split("?")[0];
        }
        return fileName;

    }

    showCaption = () => {
        const { imagesCaption, newCurrentSlide } = this.props;
        const caption = imagesCaption[newCurrentSlide - 1];
        return caption;
    };

    checkIsYoutubeVideo = (videoUrl) => {
        return videoUrl && videoUrl.indexOf("www.youtube.com") > -1;
    }
    checkIsTikTokEmbedVideo = (videoUrl) => {
        return videoUrl && videoUrl.indexOf("www.tiktok.com") > -1;
    }

    getYouTubeEmbedVideoLink = (videoUrl) => {
        if (videoUrl && videoUrl.indexOf("watch?v=") > -1) {
            videoUrl = videoUrl.replace("watch?v=", "embed/");
        }
        return videoUrl;
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.initialSlide !== this.props.initialSlide) {
            this.props.updateCurrentSlide(nextProps.initialSlide);
            this.slider.slickGoTo(nextProps.initialSlide - 1);
        }
    }

    render() {
        const { extraProps, content, showAttachedFiles, newCurrentSlide, attachedFiles, updateCurrentSlide, showSlideInfo, showDownload, showOnTop, closeModal, classNameTop, showFileName, imagesCaption, startingPosition, showCustomJSXIndexAfter, customJSX, hideCustomJSX = false, parentStyleClassName = '' } = this.props;

        let settings = {
            dots: true,
            arrows: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: startingPosition,
            nextArrow: <SampleNextArrow updateCurrentSlide={updateCurrentSlide} currentSlide={newCurrentSlide} handleVideoPause={() => this.handleVideoPause()} />,
            prevArrow: <SamplePrevArrow updateCurrentSlide={updateCurrentSlide} currentSlide={newCurrentSlide} handleVideoPause={() => this.handleVideoPause()} />,
            ...extraProps
        };
        return (
            <div data-testid="el-test-slick" className={`el-slick-slider ${parentStyleClassName}`}>
                <span onClick={closeModal} className="close-btn" data-testid='slick-close-btn' />
                <div className="slick-slider-feature-new-1">
                    {showSlideInfo && attachedFiles && attachedFiles.length > 1 && <div className={`slick-slider-info ${showOnTop ? "show-on-top" : ""} ${classNameTop}`}><span>{newCurrentSlide}/{attachedFiles.length}</span></div>}
                    {!hideCustomJSX && newCurrentSlide > showCustomJSXIndexAfter && customJSX ? customJSX : null}
                    <Slider ref={slider => (this.slider = slider)} {...settings}>
                        {showAttachedFiles && attachedFiles && attachedFiles.length && this.renderAttachedFiles()}
                        {content && content.length && this.getContent()}
                    </Slider><br />
                    {showFileName && (
                        <div className="file-name"><span className="file-name-text">{this.showfilename()}</span></div>
                    )}
                    {imagesCaption && imagesCaption.length && (
                        <div className="file-name"><span className="file-name-text">{this.showCaption()}</span></div>
                    )}
                    {showDownload && <div className="download-image">
                        <a onClick={this.downloadImage}
                            data-testid="el-test-slick-download"
                            target="_blank"
                            rel="noopener noreferrer"
                            download>Download</a></div>}
                </div>
            </div>
        );
    }
}

Slick.defaultProps = {
    showAttachedFiles: false,
    showSlideInfo: false,
    showDownload: false,
    showOnTop: false,
    showFileName: false,
    downloadToLocal: false
};

Slick.propTypes = {
    extraProps: PropTypes.object,
    attachedFiles: PropTypes.object,
    content: PropTypes.node,
    showAttachedFiles: PropTypes.bool,
    newCurrentSlide: PropTypes.number,
    updateCurrentSlide: PropTypes.func,
    showSlideInfo: PropTypes.bool,
    showDownload: PropTypes.bool,
    downloadToLocal: PropTypes.bool,
    showOnTop: PropTypes.bool,
    downloadImageURL: PropTypes.string,
    classNameTop: PropTypes.string,
    closeModal: PropTypes.func,
    showFileName: PropTypes.bool,
    isEngage: PropTypes.bool,
    postThumbnailData: PropTypes.object,
    imagesCaption: PropTypes.array,
    initialSlide: PropTypes.number,
    startingPosition: PropTypes.number,
    customDownloadCallback: PropTypes.func,
    isInboxAttachment: PropTypes.bool,
    handleAttachmentOnClick: PropTypes.func,
    customAttachmentOnClick: PropTypes.bool,
    showCustomJSXIndexAfter: PropTypes.number,
    customJSX: PropTypes.element,
    attachedFileTypes: PropTypes.array,
    autoPlay: PropTypes.bool,
    hideCustomJSX: PropTypes.bool,
    parentStyleClassName: PropTypes.string,
};

export default Slick;

const SampleNextArrow = (data) => {
    const { className, style, onClick, updateCurrentSlide, currentSlide, handleVideoPause } = data;
    updateCurrentSlide(currentSlide + 1);
    handleVideoPause();
    const htmlJSX = (
        <i
            className={`${className} slick-next icon_phoenix-arrow-right`}
            style={{ ...style, display: "block" }}
            data-testid="el-test-slick-next"
            onClick={onClick}
        />
    );
    return htmlJSX;
};

const SamplePrevArrow = (data) => {
    const { className, style, onClick, updateCurrentSlide, currentSlide, handleVideoPause } = data;
    updateCurrentSlide(currentSlide + 1);
    handleVideoPause();
    const htmlJSX = (
        <i
            className={`${className} slick-prev icon_phoenix-arrow-left`}
            style={{ ...style, display: "block" }}
            data-testid="el-test-slick-prev"
            onClick={onClick}
        />
    );
    return htmlJSX;
};
const TikTokEmbedVideo = ({ url }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stopLoading = (event) => {
            if (event?.data?.type === "onPlayerReady") {
                setLoading(false);
            }
        };
        window.addEventListener("message", stopLoading);
        return () => {
            window.removeEventListener("message", stopLoading);
        };
    }, []);

    return (
        <>
            {loading && <div className="shimmer-box-wrapper"><div className="glare-transition shimmer-box" /></div>}
            <iframe style={{ display: loading ? "none" : "block" }} src={url} allowFullScreen />
        </>);
};