import React from "react";
import styles from "./FilePreview.module.scss"
import PropTypes from "prop-types";
import { forEach, find } from "lodash";
import ImageViewModal from "components/ImageViewModal";
import { getEncodedStyleClass } from "utils/index";
import loaderGif from 'assets/images/loader.gif';
class FilePreview extends React.Component {

    constructor(props) {
        super(props);
        this.imageScroller = React.createRef();
        this.state = {
            showLeftSliderArrow: false,
            showRightSliderArrow: false,
            showMediaPreviewModal: false,
            initialSlide: 1
        };
        this.mediaItemsArray = [];
    }

    getImageAsset(imageFiles) {
        const self = this;
        const { showLoadingState = false } = this.props;
        return imageFiles.map(function (asset, index) {
            const isUploading = showLoadingState && asset.isUploading ? true : false;
            let dynamicClass = "image-upload";
            if (isUploading) {
                dynamicClass = dynamicClass + " loading";
            }
            let assetSource = asset.preview;
            if (asset.exifDataExists) {
                //Setting source through modified image dataURL.
                assetSource = asset.data;
            }
            return (<div
                key={index}
                //className="uploadedImage"
                className={getEncodedStyleClass(dynamicClass, styles)}
                title={asset.name}
            >
                <figure draggable="false" onClick={() => self.clickAction.call(self, asset.id)}>
                    <img draggable="false" src={assetSource} alt="" />
                    {!isUploading ? <span
                        className={styles["remove-img"]}
                        onClick={(e) => {
                            e.stopPropagation();
                            self.props.removeImagePreview(index);
                        }}
                    >
                        <i className="icon_phoenix-close-circle" />
                    </span> : <div className={styles["loader"]} style={{background: `url(${loaderGif}) no-repeat center transparent`}}/>}
                </figure>
            </div>);
        });
    }

    getVideoAsset(videoFiles) {
        const self = this;
        const { showLoadingState = false } = this.props;

        return videoFiles.map(function (asset, index) {
            const isUploading = showLoadingState && asset.isUploading ? true : false;
            let dynamicClass = "image-upload";
            if (isUploading) {
                dynamicClass = dynamicClass + " loading";
            }

            return (<div
                key={index}
                className={`uploadedVideo ${getEncodedStyleClass(dynamicClass, styles)}`}
            >
                <figure draggable="false" onClick={() => self.clickAction.call(self, asset.id)}>
                    <video draggable="false" src={asset.data} />
                    {!isUploading ?
                        <span
                            className={styles["remove-img"]}
                            onClick={(e) => {
                                e.stopPropagation();
                                self.props.removeVideoPreview(index);
                            }}
                        >
                            <i className="icon_phoenix-close-circle" />
                        </span> : <div className={styles["loader"]} style={{background: `url(${loaderGif}) no-repeat center transparent`}}/>}
                </figure>
            </div>);
        });
    }

    getFileType(asset) {
        let assetType = "";
        if (asset == "text/csv") {
            assetType = "csvFiles";
        } else if (asset == "application/pdf") {
            assetType = "pdfFiles";
        } else if (asset && asset.indexOf("word") != -1) {
            assetType = "wordFiles";
        } else if (asset && asset.indexOf("application/vnd") != -1) {
            assetType = "xlsFiles";
        } else if (asset && asset.indexOf("image") != -1) {
            assetType = "imageFiles";
        } else if (asset && asset.indexOf("video") != -1) {
            assetType = "videoFiles";
        } else {
            assetType = "otherFiles";
        }
        return assetType;
    }

    getOtherAssetIcon(assetType) {
        const { inboxFooterPreview } = this.props;
        let assetIcon = "icon_phoenix-copy-note phoenix-icon";
        switch (assetType) {
            case "pdfFiles": {
                if (inboxFooterPreview) {
                    assetIcon = "icon_phoenix-pdf-upload";
                } else {
                    assetIcon = "icon_phoenix-pdf";
                }
            }
                break;
            case "xlsFiles": {
                assetIcon = "icon_phoenix-excel";
            }
                break;
        }
        return assetIcon;
    }
    extractMediaName = (name = "") => {
        let fileExt = "";
        if (name) {
            name = name.split("?")[0];
            name = name.split(".");
            fileExt = name[name.length - 1];
            name = name.slice(0, name.length - 1);
            name = name.join(".");
        }
        return { fileName: name, fileExt };
    };

    getOtherFileAsset() {
        const self = this;
        let htmlStr = [];
        const { showLoadingState = false, inboxFooterPreview } = this.props;
        for (let i = 0; i < arguments.length; i++) {
            if (arguments[i].length) {
                htmlStr.push(arguments[i].map(function (asset, index) {
                    let assetType = self.getFileType(asset.type);

                    const isUploading = showLoadingState && asset.isUploading ? true : false;
                    let dynamicClass = "image-upload";
                    if (isUploading) {
                        dynamicClass = dynamicClass + " loading";
                    }
                    let assetIcon = self.getOtherAssetIcon(assetType);
                    let { fileName = "", fileExt = "" } = self.extractMediaName(asset.name);
                    return (<div
                        key={index}
                        //className="uploadedOther"
                        className={getEncodedStyleClass(dynamicClass, styles)}>
                        <figure draggable="false" className={styles["pdf-wrap"]}>
                            {inboxFooterPreview ? <>
                                <i className={assetIcon} />
                                <span className={`${styles["file-name"]} cursor-default`} title={asset.name}>{fileName}</span>.{fileExt}
                            </> :
                                <>
                                    <span className={`${styles["file-name"]} cursor-default`} title={asset.name}>{asset.name}</span>
                                    <i className={assetIcon} />
                                </>
                            }

                            {!isUploading ?
                                <span
                                    className={styles["remove-img"]}
                                    onClick={() => self.props.removeOtherFilePreview(index, assetType)}>
                                    <i className="icon_phoenix-close-circle" />
                                </span> : <div className={styles["loader"]} style={{background: `url(${loaderGif}) no-repeat center transparent`}}/>}
                        </figure>
                    </div>
                    );
                }));
            }
        }
        return htmlStr;
    }

    getPreviewStrForSavedFile(savedFile) {
        let self = this;
        let fileType = self.getFileType(savedFile.type);
        return (
            <div
                //className="uploadedImage"
                // styleName="uploadedAsset"
                className={styles["image-upload"]}
            >
                <figure draggable="false" >
                    <img draggable="false" className={fileType === "imageFiles" ? "" : styles["hidden"]} src={savedFile.url} alt="" />
                    <span className={styles["remove-img"]} onClick={(e) => self.props.removeFilePreviewHandler(e, savedFile.id)}>
                        <i className="icon-reset" />
                    </span>
                </figure>
                <video draggable="false" className={fileType === "videoFiles" ? "" : styles["hidden"]} src={savedFile.url} />
                <span className={styles[fileType != "imageFiles" && fileType != "videoFiles" ? "file-name" : "hidden"]}>{savedFile.name}</span>
                <span
                    className={`icon-file ${fileType != "imageFiles" && fileType != "videoFiles" ? "" : styles["hidden"]}`}
                />
                {/* <span
                    styleName="top-right"
                    onClick={(e) => self.props.removeFilePreviewHandler(e,savedFile.id)}
                    className="icon-reset"
                /> */}
            </div>
        );
    }

    getPreviewStrSupportForSavedFile(savedFile) {
        let self = this;
        let fileType = self.getFileType(savedFile.type);
        let assetIcon = self.getOtherAssetIcon(fileType);

        return (
            <div
                className={`${styles["image-upload"]}`}
            >
                <figure draggable="false" >
                    <img draggable="false" className={fileType === "imageFiles" ? "" : styles["hidden"]} src={savedFile.url} alt="" />
                    <span className={styles["remove-img"]} onClick={(e) => self.props.removeFilePreviewHandler(e, savedFile.id)}>
                        <i className="icon_phoenix-close-circle" />
                    </span>
                    <video draggable="false" className={fileType === "videoFiles" ? "" : styles["hidden"]} src={savedFile.url} />
                    <span className={styles[fileType != "imageFiles" && fileType != "videoFiles" ? "file-name" : "hidden"]}>{savedFile.name}</span>
                    <span
                        className={`image-icon-file ${fileType != "imageFiles" && fileType != "videoFiles" ? "" : styles["hidden"]}`}
                    >
                        <i className={assetIcon} />
                    </span>
                </figure>
            </div>
        );
    }

    // noinspection JSAnnotator
    getSavedFilePrev(savedFileArr) {
        let self = this;
        const renderSavedFilePreview = self.props.renderSavedFilePreview;
        return savedFileArr && savedFileArr.map(function (savedFile, index) {
            return (<div key={index} className={styles["saved-preview"]}>
                {renderSavedFilePreview ? self.getPreviewStrSupportForSavedFile(savedFile) : this.getPreviewStrForSavedFile(savedFile)}
            </div>);
        });
    }

    getPreviewJSX = (asset) => {
        const fileType = this.getFileType(asset.type);
        switch (fileType) {
            case "videoFiles":
                return <video draggable="false" src={asset.data} />;
            case "imageFiles":
                return <img draggable="false" src={asset.preview} alt="" />;
            default:
                return;
        }
    }

    getMediaSequenceAssets = (mediaSequence) => {
        const self = this;
        const { showLoadingState = false } = this.props;
        return mediaSequence.map(function (asset, index) {
            const isUploading = showLoadingState && asset.isUploading ? true : false;
            let dynamicClass = "image-upload";
            if (isUploading) {
                dynamicClass = dynamicClass + " loading";
            }
            return (<div
                key={index}
                className={getEncodedStyleClass(dynamicClass, styles)}
            >
                <figure draggable="false" >
                    {self.getPreviewJSX(asset)}
                    {!isUploading ? <span
                        className={styles["remove-img"]}
                        onClick={() => self.props.removeMediaSequencePreview(index)}
                    >
                        <i className="icon_phoenix-close-circle" />
                    </span> : <div className={styles["loader"]} style={{background: `url(${loaderGif}) no-repeat center transparent`}}/>}
                </figure>
            </div>);
        });
    }

    componentDidMount() {
        const self = this;

        self.updateMediaArray();
        self.checkCarouselScroll();

        if (self.imageScroller && self.imageScroller.current) {
            self.imageScroller.current.addEventListener("scroll", () => {
                if (self.imageScroller.current.scrollLeft === 0) {
                    self.setState({
                        showLeftSliderArrow: false
                    });
                } else {
                    self.setState({
                        showLeftSliderArrow: true
                    });
                }

                if (
                    self.imageScroller.current.scrollLeft +
                    self.imageScroller.current.offsetWidth <
                    self.imageScroller.current.scrollWidth
                ) {
                    self.setState({
                        showRightSliderArrow: true
                    });
                } else {
                    self.setState({
                        showRightSliderArrow: false
                    });
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        const self = this;
        const { pdfFiles = [], imageFiles = [], videoFiles = [], otherFiles = [], csvFiles = [], xlsFiles = [], wordFiles = [], savedFileArr = [] } = self.props;
        if ((prevProps.pdfFiles && (pdfFiles.length != prevProps.pdfFiles.length)) ||
            (prevProps.imageFiles && (imageFiles.length != prevProps.imageFiles.length)) ||
            (prevProps.videoFiles && (videoFiles.length != prevProps.videoFiles.length)) ||
            (prevProps.otherFiles && (otherFiles.length != prevProps.otherFiles.length)) ||
            (prevProps.csvFiles && (csvFiles.length != prevProps.csvFiles.length)) ||
            (prevProps.xlsFiles && (xlsFiles.length != prevProps.xlsFiles.length)) ||
            (prevProps.wordFiles && (wordFiles.length != prevProps.wordFiles.length)) ||
            (prevProps.savedFileArr && (savedFileArr.length != prevProps.savedFileArr.length))) {
            self.checkCarouselScroll();
            self.updateMediaArray();
        }
    }

    updateMediaArray = () => {
        const self = this;
        const imageFiles = self.props.imageFiles || [];
        const videoFiles = self.props.videoFiles || [];
        self.mediaItemsArray = [];
        if (videoFiles.length == 0 && imageFiles.length == 0) {
            self.mediaItemsArray = [];
        }
        forEach([...imageFiles, ...videoFiles], (item, idx) => {
            let type = item.type || item.contentType;
            type = type.indexOf("image") > -1 ? "IMAGE" : "VIDEO";
            self.mediaItemsArray.push({ idx, id: item.id, url: type == "IMAGE" ? item.preview : item.data });
        });
    }

    checkCarouselScroll = () => {
        const self = this;
        if (self.imageScroller && self.imageScroller.current) {
            if (self.imageScroller.current.scrollLeft === 0) {
                self.setState({ showLeftSliderArrow: false });
            } else {
                self.setState({
                    showLeftSliderArrow: true
                });
            }

            if (
                self.imageScroller.current.offsetWidth <
                self.imageScroller.current.scrollWidth
            ) {
                self.setState({
                    showRightSliderArrow: true
                });
            } else {
                self.setState({
                    showRightSliderArrow: false
                });
            }
        }
    };

    leftScroll = () => {
        this.imageScroller.current.scrollBy(-200, 0);
    };

    rightScroll = () => {
        this.imageScroller.current.scrollBy(200, 0);
    };

    clickAction = (id) => {
        let media = find(this.mediaItemsArray, (item) => item.id == id);
        this.setState({ initialSlide: media.idx, showMediaPreviewModal: true });
    };

    closeGallery = () => {
        this.setState({ showMediaPreviewModal: false, initialSlide: 1 });
    };

    render() {
        const self = this;
        const imageFiles = self.props.imageFiles || [];
        const videoFiles = self.props.videoFiles || [];
        const otherFiles = self.props.otherFiles || [];
        const pdfFiles = self.props.pdfFiles || [];
        const csvFiles = self.props.csvFiles || [];
        const xlsFiles = self.props.xlsFiles || [];
        const wordFiles = self.props.wordFiles || [];
        const mediaSequence = self.props.mediaSequence || [];
        const savedFileArr = self.props.savedFileArr || [];

        if (videoFiles.length == 0 && imageFiles.length == 0 && otherFiles.length == 0 && pdfFiles.length == 0 && csvFiles.length == 0 && xlsFiles.length == 0 && wordFiles.length == 0 && (self.props.savedFileArr && self.props.savedFileArr.length == 0)) {
            return null;
        }

        const {
            showLeftSliderArrow,
            showRightSliderArrow,
            showMediaPreviewModal,
            initialSlide
        } = self.state;

        return (
            <div className={`el-filepreview pos-rel ${styles["assetsContainer"]} ${this.props.inboxFooterPreview ? styles["inbox-footer-preview"] : ""}`} onClick={(e) => {
                e.stopPropagation();
            }}>
                {showLeftSliderArrow && (
                    <div className={styles["left"]} onClick={this.leftScroll.bind(self)}>
                        <div className={styles["carousel-prev"]} />
                    </div>
                )}
                <div className={`custom-scroll ${styles["preview-wrap"]}`} draggable="false" ref={this.imageScroller}>
                    {self.getSavedFilePrev(savedFileArr)}
                    {self.getImageAsset(imageFiles)}
                    {self.getVideoAsset(videoFiles)}
                    {self.getOtherFileAsset(otherFiles, pdfFiles, csvFiles, xlsFiles, wordFiles)}
                    {mediaSequence && mediaSequence.length > 0 && self.getMediaSequenceAssets(mediaSequence)}
                </div>
                {showRightSliderArrow && (
                    <div className={styles["right"]} onClick={this.rightScroll.bind(self)}>
                        <div className={styles["carousel-next"]} />
                    </div>
                )}

                {showMediaPreviewModal && <ImageViewModal
                    key={showMediaPreviewModal}
                    showModal={showMediaPreviewModal}
                    closeModal={() => {
                        self.closeGallery();
                    }}
                    startingPosition={initialSlide}
                    images={self.mediaItemsArray.map((item) => item.url)}
                    showDownload={false}
                    style={{ zIndex: "1000" }}
                    infinite={false}
                />}

            </div>
        );
    }
}

FilePreview.propTypes = {
    removeImagePreview: PropTypes.func,
    removeVideoPreview: PropTypes.func,
    removeOtherFilePreview: PropTypes.func,
    removeFilePreviewHandler: PropTypes.func,
    savedFileArr: PropTypes.array,
    showLoadingState: PropTypes.bool,
    inboxFooterPreview: PropTypes.bool,
    removeMediaSequencePreview: PropTypes.func,
    pdfFiles: PropTypes.array,
    videoFiles: PropTypes.array,
    imageFiles: PropTypes.array,
    otherFiles: PropTypes.array,
    csvFiles: PropTypes.array,
    xlsFiles: PropTypes.array,
    wordFiles: PropTypes.array,
    mediaSequence: PropTypes.array
};

export default FilePreview;