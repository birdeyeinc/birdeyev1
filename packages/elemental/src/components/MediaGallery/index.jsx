import PropTypes from "prop-types";
import React from "react";
import Slider from "react-slick";
import { map } from "lodash";
import SlickStyle from "./MediaGallery.module.scss";
import Broken from "assets/images/brokenImage.svg";
import { getEncodedStyleClass } from "utils";

const getStyle = (str) => getEncodedStyleClass(str, SlickStyle);

const SampleNextArrow = (data) => {
    const { wrapperClassName, onClick, arrowClassName } = data;
    const htmlJSX = (<div className={wrapperClassName} onClick={onClick}>
        <div className={arrowClassName} />
    </div>);
    return htmlJSX;
};

const SamplePrevArrow = (data) => {
    const { wrapperClassName, onClick, arrowClassName } = data;
    const htmlJSX = (<div className={wrapperClassName} onClick={onClick}>
        <div className={arrowClassName} />
    </div>);
    return htmlJSX;
};

// eslint-disable-next-line react/no-multi-comp
class Slick extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slideNo: props.initialSlide || 1,
        };
    }

    /**
     * we are checking that `newCurrentSlide` is controlled or not, if it is controlled by parent then we will not 
     * update the state our own otherwise we are using `initialSlide` and we are updating state our own
     * It's required because if parent is dont want to handle currentSlide state then our Info will not be updated
     */
    isControlled = () => this.props.newCurrentSlide !== undefined;

    /**
     * it will return currentSlide based on our newCurrentSlide is controlled or not
     */
    getCurrentSlide = () => (this.isControlled() ? this.props.newCurrentSlide : this.state.slideNo);
  
    /**
     * it will update internal currentSlide state if its not controlled
     */
    setCurrentSlide = (newValue) => {
      if (!this.isControlled()) {
        this.setState({ slideNo: newValue });
      }
    };

    getContent = () => {
        const { content } = this.props;
        return map(content, (item, index) => {
            return (<div key={index}>{item}</div>);
        });
    };

    checkIfVideo = (item) => {
        return item?.match(/.mp4/g);
    }

    renderAttachedFiles = () => {
        const { checkIfVideo, checkIsYoutubeVideo, getYouTubeEmbedVideoLink } = this;
        const { attachedFiles, broken } = this.props;
        return map(attachedFiles, (item, index) => {
            let mediaTemplate;
            if (item.type === "VIDEO" || checkIfVideo(item.url)) {
                if (checkIsYoutubeVideo(item.url)) {
                    mediaTemplate = (
                        <iframe
                            src={getYouTubeEmbedVideoLink(item.url)}
                            frameBorder="0" 
                            allowFullScreen
                        />
                    );
                } else {
                    mediaTemplate = (
                        <video id={"galery_video" + index} controls>
                            <source type="video/mp4" src={item.url}/>
                        </video>
                    );
                }
            } else if (checkIsYoutubeVideo(item.url)) {
                mediaTemplate = (
                    <iframe
                        src={getYouTubeEmbedVideoLink(item.url)}
                        frameBorder="0" 
                        allowFullScreen
                    />
                );
            } else {
                mediaTemplate = (<img onError={(e) => {
                    {
                        e.target.src = broken;
                        e.target.classList.add(SlickStyle["broken-image"]);
                    }
                }} src={item.url} alt="error" />);
            }
            return (
                <div key={index} className={getStyle("slide")}>
                    {mediaTemplate}
                </div>
            );
        });
    }

    downloadImage = (e) => {
        e.preventDefault();
        const { attachedFiles } = this.props;
        const imageURL = attachedFiles[this.getCurrentSlide() - 1].url;
        this.props.downloadImageFromUrl && this.props.downloadImageFromUrl(imageURL, true);
    }

    showfilename = () => {
        const { attachedFiles, isEngage, showOriginalName } = this.props;
        const imageURL = attachedFiles[this.getCurrentSlide() - 1].url;
        const fileName = imageURL.split("/").pop();
        if (isEngage) {
            return fileName && fileName.split("?")[0];
        }
        return showOriginalName ? fileName.split("_").pop() : fileName;
        
    }

    showCaption = () => {
        const { attachedFiles} = this.props;
        const caption = attachedFiles[this.getCurrentSlide() - 1].caption;
        return caption;
    };

    checkIsYoutubeVideo = (videoUrl) => {
        return videoUrl && videoUrl.indexOf("www.youtube.com") > -1;
    }

    getYouTubeEmbedVideoLink = (videoUrl) => {
        if (videoUrl && videoUrl.indexOf("watch?v=") > -1) {
            videoUrl = videoUrl.replace("watch?v=", "embed/");
        }
        return videoUrl;
    }

    componentDidMount = () => {
         this.close = (e) => {
            if (e.keyCode === 27) {
                this.props.closeModal();
            }
        };
        if (this.props.initialSlide === 1) {    
            setTimeout(() => {
                const currentVideo =  document.querySelectorAll("#galery_video0");
                if (currentVideo.length === 1) {
                    currentVideo[0].play();
                } else if (currentVideo.length === 2) {
                    currentVideo[0].play();
                }
            }, 10);
        }
        this.slider.slickGoTo(this.getCurrentSlide() - 1, true);

        window.addEventListener("keydown", this.close);
    }

    componentWillUnmount = () => {
        window.removeEventListener("keydown", this.close);
    }

    componentDidUpdate(prevProps) {
        if (this.props.initialSlide !== 1 && prevProps.initialSlide !== this.props.initialSlide) {
            this.props.updateCurrentSlide(this.props.initialSlide);
        }
        if (this.isControlled() && prevProps.newCurrentSlide !== this.props.newCurrentSlide) {
            this.slider.slickGoTo(this.getCurrentSlide() - 1, true);
        }
    }
    
    updateSlideAndPause = (i) => {
        this.props.updateCurrentSlide(i);
        this.setCurrentSlide(i);
    }

    render() {
        const { extraProps, content, showAttachedFiles, attachedFiles,
            showSlideInfo, showDownload, showOnTop, closeModal, hideCaptionAndName } = this.props;
        let settings = {
            dots: true,
            arrows: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: <SampleNextArrow wrapperClassName={SlickStyle["right"]} arrowClassName={SlickStyle["carousel-next"]} />,
            prevArrow: <SamplePrevArrow wrapperClassName={SlickStyle["left"]} arrowClassName={SlickStyle["carousel-prev"]} />,
            beforeChange: (o, n) => {
                this.updateSlideAndPause(n+1);
                setTimeout(() => {
                    const currentVideo =  document.querySelectorAll("#galery_video" + n);
                    if (currentVideo.length === 2) {
                        currentVideo[0].play();
                    } else if (currentVideo.length === 3) {
                        currentVideo[1].play();
                    }
                }, 10);
                const currentVideo =  document.querySelectorAll("#galery_video" + o);
                if (currentVideo.length === 2) {
                    currentVideo[0].pause();
                } else if (currentVideo.length === 3) {
                    currentVideo[1].pause();
                }
            },
            ...extraProps
        };

        return (
            <div data-testid="el-test-media-gallery" className={`el-media-gallery ${getStyle("image-gallery")}`}>
                <span data-testid="el-test-mg-close-icon" onClick={closeModal} className={getStyle("close-btn")} />
                {showSlideInfo && (<div className={getStyle(`slick-slider-info ${showOnTop ? "show-on-top" : ""}`)}>
                    {!hideCaptionAndName && <span className={getStyle("file-name-text")}>{this.showfilename()}</span>}
                    <span className={getStyle("counter")} data-testid="el-test-mg-counter">{attachedFiles && attachedFiles.length > 1 && (`(${this.getCurrentSlide()}/${attachedFiles.length})`)}</span>
                </div>)}
                <div className={getStyle("slick-slider-feature")}>
                    <Slider ref={slider => (this.slider = slider)} {...settings}>
                        {showAttachedFiles && attachedFiles && attachedFiles.length && this.renderAttachedFiles()}
                        {content && content.length && this.getContent()}
                    </Slider><br />
                </div>
                {!hideCaptionAndName && <div className={getStyle("file-caption")}><span className={getStyle("file-caption-text")} data-testid="el-test-mg-caption">{this.showCaption()}</span></div>}
                {showDownload && <div className={getStyle("download-image")}>
                    <a onClick={this.downloadImage}
                        data-testid="el-test-mg-download"
                        target="_blank"
                        style={attachedFiles[this.getCurrentSlide() - 1].type === "VIDEO" ? {visibility: "hidden"} : {}}
                        rel="noopener noreferrer"
                        download>Download</a>
                </div>}
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
    broken: Broken,
    hideCaptionAndName: false
};

Slick.propTypes = {
    extraProps: PropTypes.object,
    attachedFiles: PropTypes.array,
    content: PropTypes.node,
    showAttachedFiles: PropTypes.bool,
    newCurrentSlide: PropTypes.number,
    updateCurrentSlide: PropTypes.func,
    showSlideInfo: PropTypes.bool,
    showDownload: PropTypes.bool,
    showOnTop: PropTypes.bool,
    downloadImageURL: PropTypes.string,
    classNameTop: PropTypes.string,
    closeModal: PropTypes.func,
    showFileName: PropTypes.bool,
    isEngage: PropTypes.bool,
    imagesCaption: PropTypes.array,
    initialSlide: PropTypes.number,
    broken: PropTypes.string,
    hideCaptionAndName: PropTypes.bool,
    showOriginalName: PropTypes.bool,
    downloadImageFromUrl: PropTypes.func
};

export default Slick;