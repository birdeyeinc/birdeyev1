import React from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import styles from "./FileUploader.module.scss";
import { each, isEqual } from "lodash";
import { hasScriptTagsInImage, removeExifData, isSVGContentAvailable, convertLegacyAcceptProp } from "./helper";

class SelectFiles extends React.Component {

    constructor(props) {
        super(props);
        this.videoRegex = /video\/*/;
        this.imageRegex = /image\/*/;
        this.maxWidth = props.maxWidth;
        this.maxHeight = props.maxHeight;
        this.minWidth = props.minWidth;
        this.minHeight = props.minHeight;
        this.exactWidth = props.exactWidth;
        this.exactHeight = props.exactHeight;
        this.imageSizeLimit = props.imageSizeLimit;
        this.videoSizeLimit = props.videoSizeLimit;
        this.errorCallback = props.errorCallback;
        this.multipleFiles = props.multipleFiles;
        this.acceptFileTypes = props.acceptFileTypes;
        this.dropzoneAcceptedFileTypes = convertLegacyAcceptProp(props.acceptFileTypes);
        this.maxSize = props.maxSize;
        this.minSize = props.minSize;
        this.maxFilesAllowed = props.maxFilesAllowed;
        this.customselect = props.customselect;
        this.customSelectElement = props.customSelectElement;
        this.showMessageInKB = props.showMessageInKB;
        this.pdfSizeLimit = props.pdfSizeLimit;
        this.errorMessage = props.errorMessage || {};
        this.equalHeightWidthImage = props.equalHeightWidthImage;
        this.imageSizeError = props.imageSizeError;
        this.videoSizeError = props.videoSizeError;
        this.appleMediaSizeLimit = props.appleMediaSizeLimit;
        this.isAppleMessageSrc = props.isAppleMessageSrc;
        this.showCustomErrorMessage = props.showCustomErrorMessage;
        this.setTotalMediaSelected = props.setTotalMediaSelected;
    }

    componentWillReceiveProps(newProps) {
        if (!isEqual(newProps.customSelectElement, this.props.customSelectElement)) {
            this.customSelectElement = newProps.customSelectElement;
        } else if (newProps.maxFilesAllowed !== this.props.maxFilesAllowed) {
            this.maxFilesAllowed = newProps.maxFilesAllowed;
        }
        if ((newProps.maxWidth != this.props.maxWidth) || (newProps.minWidth != this.props.minWidth)) {
            this.maxWidth = newProps.maxWidth;
            this.maxHeight = newProps.maxHeight;
            this.minWidth = newProps.minWidth;
            this.minHeight = newProps.minHeight;
        }
        if ((newProps.maxHeight != this.props.maxHeight) || (newProps.minHeight != this.props.minHeight)) {
            this.maxHeight = newProps.maxHeight;
            this.minHeight = newProps.minHeight;
        }
        if (newProps.maxFilesAllowed != this.maxFilesAllowed) {
            this.maxFilesAllowed = newProps.maxFilesAllowed;
        }
        if (!isEqual(newProps.imageSizeLimit, this.props.imageSizeLimit) || !isEqual(newProps.videoSizeLimit, this.props.videoSizeLimit)) {
            this.imageSizeLimit = newProps.imageSizeLimit;
            this.videoSizeLimit = newProps.videoSizeLimit;
        }
        if (newProps.acceptFileTypes != this.props.acceptFileTypes) {
            this.acceptFileTypes = newProps.acceptFileTypes;
            this.dropzoneAcceptedFileTypes = convertLegacyAcceptProp(newProps.acceptFileTypes);
        }
        if (!isEqual(newProps.imageSizeError, this.props.imageSizeError)) {
            this.imageSizeError = newProps.imageSizeError;
        }
        if (!isEqual(newProps.videoSizeError, this.props.videoSizeError)) {
            this.videoSizeError = newProps.videoSizeError;
        }
    }

    getDropZoneChildren() {
        if (this.customselect && this.customSelectElement) {
            if (typeof this.customSelectElement === "function") { return this.customSelectElement(); }
            return (this.customSelectElement);
        } else {
            return (<div>
                <p className={styles["dragDropText"]}>
                    Choose an image or video to upload
                </p>
                <button className={styles["uploadBtn"]}>Upload</button>
            </div>);
        }
    }

    fileRejected(rejectedFiles = []) {
        const { isImageUploadRestricted = true } = this.props;
        if (this.showCustomErrorMessage) {
            rejectedFiles?.forEach(_ => {
                isImageUploadRestricted && this.errorCallback(this.errorMessage.error || "All attachments could not be uploaded successfully because they exceed 25MB or the file type is not supported.");
            });
        } else {
            isImageUploadRestricted && this.errorCallback(this.errorMessage.error || "All attachments could not be uploaded successfully because they exceed 25MB or the file type is not supported.");
        }
    }

    imageDimensionsRejected(maxWidth, maxHeight, minWidth, minHeight) {
        const errMsg = this.exactWidth && this.exactHeight ? `Uploaded image should be of exact dimensions of ${maxWidth} * ${maxHeight} pixels.` :
            (maxWidth && maxHeight && minWidth && minHeight) ? `Uploaded image should be between ${minWidth} * ${minHeight} and ${maxWidth} * ${maxHeight} pixels.` :
                maxWidth && maxHeight ? `Uploaded image exceeds the maximum allowed dimension of ${maxWidth} * ${maxHeight} pixels.` : minHeight && minWidth ?
                    `Please upload an image of dimensions: ${minWidth} x ${minHeight} px` : "";
        this.errorCallback(this.errorMessage.minMaxError || errMsg);
    }

    isImageEqualHeightWidth() {
        this.errorCallback(this.errorMessage.equalHeightWidthError || "Only square images allowed");
    }
    generatePreviewForFiles(files) {
        if (files && files.length) {
            return files.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
        } else {
            return files;
        }
    }

    updateAssets(files) {
        let acceptedFiles = files;
        if (!acceptedFiles || acceptedFiles.length === 0 || acceptedFiles?.some((file) => !file)) {
            const errorMessage = "No valid files received for processing. Please try again.";
            // const error = new Error(errorMessage);
            // sendRingCentralAndNewRelicAlert(
            //     error,
            //     "createpost uploadFiles",
            //     "SOCIAL_UPLOAD_ERROR",
            //     "updateAssets"
            // );
            this.errorCallback(errorMessage);
            return;
        } else {
            acceptedFiles = this.generatePreviewForFiles(files);
        }
        if ((this.minWidth && this.minHeight) || (this.maxWidth && this.maxHeight) || (this.exactWidth && this.exactHeight)) {
            this.onDrop(acceptedFiles);
        } else {
            this.updateAssetFn(acceptedFiles);
        }
    }

    onDropCallback = (acceptedFiles, rejectedFiles) => {
        if (this.showCustomErrorMessage) {
            const totalMediaCount = (acceptedFiles?.length || 0) + (rejectedFiles?.length || 0);
            this.setTotalMediaSelected(totalMediaCount);
        }
    }

    maxFilesAllowedCheck = (acceptedFiles) => {
        const { maxFilesAllowed, multipleFiles } = this;

        if (multipleFiles && maxFilesAllowed > -1 && acceptedFiles && acceptedFiles.length > maxFilesAllowed) {
            return false;
        }

        return true;
    }

    isValidDimensions = (file) => {
        let self = this;
        const { maxHeight, maxWidth, minWidth, minHeight } = self;
        const { videoDurationLimit, videoResolutionLimit } = self.props;
        return new Promise((resolve, reject) => {
            if (file.type.startsWith("video")) {
                const video = document.createElement("video");
                const videoUrl = URL.createObjectURL(file);
                video.src = videoUrl;
                video.preload = "metadata";

                video.onloadedmetadata = () => {
                    const videoDuration = video.duration;
                    const videoResolution = video.videoHeight;

                    if (videoDuration > videoDurationLimit) {
                        reject(`Duration of video exceeds recommended duration of ${videoDurationLimit} seconds.`);
                    } else if (videoResolution < videoResolutionLimit) {
                        reject(`Required resolution is ${videoResolutionLimit}p or higher.`);
                    } else {
                        resolve();
                    }

                    URL.revokeObjectURL(videoUrl);
                };

                video.onerror = () => {
                    URL.revokeObjectURL(videoUrl);
                    resolve();
                };
            } else {
                const i = new Image();
                const imageURL = URL.createObjectURL(file);
                i.src = imageURL;

                i.onload = function () {
                    if (maxWidth && maxHeight && minWidth && minHeight && (i.width > maxWidth || i.height > maxHeight || i.width < minWidth || i.height < minHeight)) {
                        URL.revokeObjectURL(imageURL);
                        reject(self.errorMessage.minMaxError);
                    } else {
                        URL.revokeObjectURL(imageURL);
                        resolve();
                    }
                };

                i.onerror = function () {
                    URL.revokeObjectURL(imageURL);
                    resolve();
                };
            }
        });
    };

    checkCustomImageDimensions = (files) => {
        const acceptedFiles = [];
        const acceptedFilesPromises = files?.map((file) => {
            return this.isValidDimensions(file)
                .then(() => acceptedFiles.push(file))
                .catch(error => {
                    this.errorCallback(error);
                });
        });

        Promise.allSettled(acceptedFilesPromises).then(() => this.updateAssetFn(acceptedFiles));
    }

    onDrop = (files) => {
        //this func checks the validation of image dimesions on upload
        let self = this;
        const { maxHeight, maxWidth, exactHeight, exactWidth, minWidth, minHeight, maxFilesAllowed, equalHeightWidthImage } = self;
        const { isImageUploadRestricted = true } = self.props;

        if (!self.maxFilesAllowedCheck(files)) {
            this.errorCallback(self.errorMessage.maxFileAllowedError || `Maximum files allowed: ${maxFilesAllowed}`);
            return;
        }

        if (self.showCustomErrorMessage && files?.length > 1) {
            self.checkCustomImageDimensions(files);
            return;
        }
        const acceptedFiles = this.generatePreviewForFiles(files);

        const file = acceptedFiles.find(f => f);
        if (file.type.startsWith("video")) {
            self.updateAssetFn(acceptedFiles);
            return;
        }
        const i = new Image();

        i.onload = () => {
            let reader = new FileReader();
            reader.readAsDataURL(file);

            if (!isImageUploadRestricted) {
                self.updateAssetFn(acceptedFiles);
                return;
            }

            if (exactHeight && exactWidth) {
                if (i.width == exactWidth && i.height == exactHeight) {
                    self.updateAssetFn(acceptedFiles);
                } else {
                    self.imageDimensionsRejected(exactWidth, exactHeight);
                }
            } else {
                if (maxWidth && maxHeight && minWidth && minHeight && (i.width > maxWidth || i.height > maxHeight || i.width < minWidth && i.height < minHeight)) {
                    self.imageDimensionsRejected(maxWidth, maxHeight, minWidth, minHeight);
                } else if (maxWidth && maxHeight && (i.width > maxWidth || i.height > maxHeight)) {
                    self.imageDimensionsRejected(maxWidth, maxHeight);
                } else if (minWidth && minHeight && (i.width < minWidth || i.height < minHeight)) {
                    self.imageDimensionsRejected(null, null, minWidth, minHeight);
                } else if (equalHeightWidthImage && i.height !== i.width) {
                    self.isImageEqualHeightWidth();
                } else {
                    self.updateAssetFn(acceptedFiles);
                }
            }
        };

        i.src = file.preview;
    }

    getMimetype = (signature, isXlsx, type) => {
        switch (signature) {
            case "89504E47":
                return "image/png";
            case "47494638":
                return "image/gif";
            case "25504446":
                return "application/pdf";
            case "D0CF11E0":
                return "application/vnd.ms-excel";
            case "FFD8FFDB":
            case "FFD8FFE0":
            case "FFD8FFE1":
            case "FFD8FFE2":
                return "image/jpeg";
            case "52494646": {
                if (type.indexOf("avi") > -1) return "video/avi";
                return "image/jpeg";
            }
            case "504B34": {
                if (isXlsx) return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                return "application/file";
            }
            case "504B0304":
                return "application/zip";
            case "00014":
                return "video/mov";
            case "00020":
                if (type.indexOf("3gpp") > -1) return "video/3gpp";
                return "video/mp4";
            case "001BA":
                return "video/mpeg";
            case "1A45DFA3":
                return "video/webm";
            default:
                return undefined;
        }
    }

    updateAssetFn(acceptedFiles) {
        const { maxFilesAllowed } = this;
        const { onAssetUploadCallback } = this.props;
        /* var options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
          } */

        /*  console.log('originalFile instanceof Blob', acceptedFiles[0] instanceof Blob); // true
   console.log(`originalFile size ${acceptedFiles[0].size / 1024 / 1024} MB`);
        const compressedFile = await imageCompression(acceptedFiles[0], options);
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); */ // smaller than maxSizeMB
        const
            videoFiles = [],
            imageFiles = [],
            pdfFiles = [],
            csvFiles = [],
            xlsFiles = [],
            wordFiles = [],
            otherFiles = [],
            self = this;

        let
            reader,
            contentReader,
            count = 0,
            rejectImageCount = 0,
            rejectVideoCount = 0,
            rejectPdfCount = 0,
            totalSize = 0,
            videoDuration = 0,
            videoResolution = 320,
            formData = new FormData();
        // let uploads = [];

        if (!self.maxFilesAllowedCheck(acceptedFiles)) {
            this.errorCallback(self.errorMessage.maxFileAllowedError || `Maximum files allowed: ${maxFilesAllowed}`);
            return;
        }

        const { isVideoUploadRestricted = true, isImageUploadRestricted = true, videoDurationLimit, videoResolutionLimit } = this.props;
        const checkForAppleMedia = (file) => {
            const fileExt = file.name.split(".")[1];
            const fileType = file.type;
            if (self.acceptFileTypes.indexOf(`,.${fileExt}`) || self.acceptFileTypes.indexOf(fileType)) {
                return file.size <= self.appleMediaSizeLimit;
            }
            return false;
        };

        acceptedFiles.map(function (file, i) {
            const
                image = file.type.startsWith("image"),
                video = file.type.startsWith("video"),
                pdf = file.type.startsWith("application/pdf"),
                checkForXls = file.name.lastIndexOf(".xls") == (file.name.length - 4),
                checkForXlsx = file.name.lastIndexOf(".xlsx") == (file.name.length - 5),
                svg = file.type.startsWith("image/svg+xml");
            if (
                (image && (file.size >= self.minSize && file.size <= self.imageSizeLimit || !isImageUploadRestricted)) ||
                (video && (file.size <= self.videoSizeLimit || !isVideoUploadRestricted)) ||
                pdf && file.size <= self.pdfSizeLimit ||
                file.type.startsWith("text/csv") ||
                file.type.startsWith("text/plain") ||
                (file.type.indexOf("word") != -1 && file.type.startsWith("application")) ||
                (file.type.startsWith("application/vnd") || (checkForXls) || (checkForXlsx)) ||
                (self.isAppleMessageSrc && checkForAppleMedia(file)) ||
                file.type.startsWith("text/vcard") ||
                file.type.startsWith("text/x-vcard")
            ) {
                formData.append("file", file);
                contentReader = new FileReader();

                contentReader.onloadend = function (evt) {

                    if (evt.target.readyState === FileReader.DONE) {
                        const uint = new Uint8Array(evt.target.result);
                        let bytes = [];
                        each(uint, (byte) => {
                            bytes.push(byte.toString(16));
                        });
                        const hex = bytes.join("").toUpperCase();
                        file.contentType = self.getMimetype(hex, checkForXlsx, file.type);

                        // if (file.type != file.contentType) {
                        //     self.errorCallback(`content-type mismatch for ${file.name}, only image/* files are allowed.`);
                        // } else {
                        reader = new FileReader();

                        // Processing for image files -
                        // 1. For SVG types --> Checking for existence fo script tags & if found --> throwing error
                        // 2. For all Other Image types --> Removing exif info from the file if it exists & rendering them in PREVIEWFILES.js through asset.data
                        if (image) {
                            reader.onload = function (e) {
                                const imageContent = e.target.result;

                                //BIRD-75801: Stored XSS via SVG File upload
                                if (isSVGContentAvailable(imageContent) != svg) {
                                    self.errorCallback("Files containing svg content doesn't match svg extension.");
                                    return;
                                }

                                if (svg) {
                                    const containsScriptTags = hasScriptTagsInImage(imageContent, file.type);
                                    if (containsScriptTags) {
                                        self.errorCallback("Files containing script tags are not allowed");
                                        return;
                                    } else {
                                        file.data = imageContent;
                                        imageFiles.push(file);
                                        count++;
                                        totalSize += file.size;
                                        if (acceptedFiles.length === count) {
                                            self.props.updateAssets(videoFiles, imageFiles, pdfFiles, csvFiles, otherFiles, xlsFiles, wordFiles, totalSize, formData);
                                        }
                                    }
                                } else {
                                    removeExifData(imageContent, file.type)
                                        .then((newImageContent) => {
                                            file.data = newImageContent;

                                            if (newImageContent !== imageContent) {
                                                file.exifDataExists = true;
                                            }

                                            imageFiles.push(file);
                                            count++;
                                            totalSize += file.size;
                                            if (acceptedFiles.length === count) {
                                                self.props.updateAssets(videoFiles, imageFiles, pdfFiles, csvFiles, otherFiles, xlsFiles, wordFiles, totalSize, formData);
                                            }
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                            };
                            if (svg) {
                                reader.readAsText(file);
                            } else {
                                reader.readAsDataURL(file);
                            }
                        } else {
                            reader.onload = function (e) {

                                file.data = e.target.result;
                                //modFiles.push(file);
                                if (self.videoRegex.test(file.type)) {
                                    videoFiles.push(file);
                                } else if (self.imageRegex.test(file.type)) {
                                    imageFiles.push(file);
                                } else if (file.type.startsWith("application/pdf")) {
                                    pdfFiles.push(file);
                                } else if (file.type.startsWith("text/csv")) {
                                    csvFiles.push(file);
                                } else if (file.type.indexOf("word") != -1 && file.type.startsWith("application")) {
                                    wordFiles.push(file);
                                } else if (file.type.startsWith("application/vnd") || (checkForXls) || (checkForXlsx)) {
                                    xlsFiles.push(file);
                                } else {
                                    otherFiles.push(file);
                                }
                                count++;
                                totalSize += file.size;
                                if (self.videoRegex.test(file.type) && videoDurationLimit) {
                                    const video = document.createElement("video");

                                    video.preload = "metadata";
                                    video.onloadedmetadata = function () {
                                        window.URL.revokeObjectURL(video.src);
                                        videoDuration = video.duration;
                                        videoResolution = video.videoHeight;
                                        if (self.showCustomErrorMessage) {
                                            if (acceptedFiles.length === count) {
                                                self.props.updateAssets(videoFiles, imageFiles, pdfFiles, csvFiles, otherFiles, xlsFiles, wordFiles, totalSize, formData);
                                            }
                                        } else {
                                            if (acceptedFiles.length === count && videoDuration <= videoDurationLimit) {
                                                if (videoResolution >= videoResolutionLimit) {
                                                    self.props.updateAssets(videoFiles, imageFiles, pdfFiles, csvFiles, otherFiles, xlsFiles, wordFiles, totalSize, formData);
                                                } else {
                                                    self.errorCallback(`Required resolution is ${videoResolutionLimit}p or higher.`);
                                                    videoFiles.splice(0, videoFiles.length);
                                                    self.props.updateAssets([], imageFiles, pdfFiles, csvFiles, otherFiles, xlsFiles, wordFiles, totalSize, formData);
                                                }
                                            } else {
                                                self.errorCallback(`Duration of video exceeds recommended duration of ${videoDurationLimit} seconds.`);
                                                videoFiles.splice(0, videoFiles.length);
                                                self.props.updateAssets([], imageFiles, pdfFiles, csvFiles, otherFiles, xlsFiles, wordFiles, totalSize, formData);
                                            }
                                        }
                                    };

                                    video.src = URL.createObjectURL(acceptedFiles[i]);
                                } else {
                                    if (acceptedFiles.length === count) {
                                        self.props.updateAssets(videoFiles, imageFiles, pdfFiles, csvFiles, otherFiles, xlsFiles, wordFiles, totalSize, formData);
                                    }
                                }
                            };
                            reader.readAsDataURL(file);
                        }

                        // }
                    }

                };

                const blob = file.slice(0, 4);
                contentReader.readAsArrayBuffer(blob);

            } else {
                count++;
                if (image) {
                    rejectImageCount++;
                } else if (video) {
                    rejectVideoCount++;
                } else if (pdf) {
                    rejectPdfCount++;
                }
            }

            if (rejectImageCount > 0) {
                const imageLimit = self.showMessageInKB ? ((self.imageSizeLimit / 1024) + "Kb") : ((self.imageSizeLimit / 1024000) + "MB");
                self.errorCallback(self.errorMessage.sizeError || self.imageSizeError || (rejectImageCount + " image file" + (rejectImageCount > 1 ? "s" : "") + " exceed the limit of " + imageLimit));
            }
            if (rejectVideoCount > 0) {
                self.errorCallback(self.errorMessage.albumVideoSizeError || self.errorMessage.sizeError || self.videoSizeError || (rejectVideoCount + " video file" + (rejectVideoCount > 1 ? "s" : "") + " exceeds the limit of " + (self.videoSizeLimit / 1024000) + "MB"));
            }
            if (rejectPdfCount > 0) {
                self.errorCallback(self.errorMessage.sizeError || (rejectPdfCount + " pdf file" + (rejectPdfCount > 1 ? "s" : "") + " exceed the limit of " + (self.pdfSizeLimit / 1024000) + "MB"));
            }

            if (self.showCustomErrorMessage && (rejectImageCount > 0 || rejectVideoCount > 0 || rejectPdfCount > 0)) {
                rejectImageCount = 0;
                rejectVideoCount = 0;
                rejectPdfCount = 0;
            }
        });
        onAssetUploadCallback && onAssetUploadCallback();
    }

    render() {
        const self = this;
        return (
            <Dropzone
                ref={self.props.dropzoneRef}
                accept={self.dropzoneAcceptedFileTypes}
                onDropAccepted={self.updateAssets.bind(self)}
                onDropRejected={self.fileRejected.bind(self)}
                onDrop={self.onDropCallback.bind(self)}
                multiple={self.multipleFiles}
                maxSize={self.maxSize}
                noClick={self.props.disableClick}
            >
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: `${styles["fileUploadCore"]} ${self.props.bodyClass} secure-attachmentEmoji` })}>
                        {self.getDropZoneChildren()}
                        <input {...getInputProps({ id: "upload", name: "uploadAssets[]" })} />
                    </div>
                )}
                {/* {self.getDropZoneChildren.bind(this)} */}
            </Dropzone>
        );
    }
}

SelectFiles.propTypes = {
    imageSizeLimit: PropTypes.number,
    videoSizeLimit: PropTypes.number,
    errorCallback: PropTypes.func,
    bodyClass: PropTypes.string,
    multipleFiles: PropTypes.bool,
    acceptFileTypes: PropTypes.object,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    maxHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    minHeight: PropTypes.number,
    minWidth: PropTypes.number,
    customselect: PropTypes.bool,
    customSelectElement: PropTypes.element,
    exactHeight: PropTypes.number,
    exactWidth: PropTypes.number,
    showMessageInKB: PropTypes.bool,
    pdfSizeLimit: PropTypes.number,
    errorMessage: PropTypes.object,
    maxFilesAllowed: PropTypes.number,
    equalHeightWidthImage: PropTypes.bool,
    dropzoneRef: PropTypes.string,
    disableClick: PropTypes.bool,
    imageSizeError: PropTypes.string,
    videoSizeError: PropTypes.string,
    videoDurationLimit: PropTypes.number,
    videoResolutionLimit: PropTypes.number,
    isVideoUploadRestricted: PropTypes.bool,
    isImageUploadRestricted: PropTypes.bool,
    appleMediaSizeLimit: PropTypes.number,
    isAppleMessageSrc: PropTypes.bool,
    showCustomErrorMessage: PropTypes.bool,
    setTotalMediaSelected: PropTypes.func,
    onAssetUploadCallback: PropTypes.func
};

SelectFiles.defaultProps = {
    minSize: 0
};

export default SelectFiles;

