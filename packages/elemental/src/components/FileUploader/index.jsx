import React from "react";
import styles from "./FileUploader.module.scss";
import SelectFiles from "./SelectFiles";
import FilePreview from "components/FilePreview";
import PropTypes from "prop-types";
import { unionBy, sumBy, isEqual, filter } from "lodash";

class FileUploader extends React.Component {

    constructor(props) {
        super(props);
        this.imageSizeLimit = +props.imageSizeLimit || 4194304;
        this.videoSizeLimit = +props.videoSizeLimit || 15728640;
        this.maxWidth = props.maxWidth;
        this.maxHeight = props.maxHeight;
        this.minWidth = props.minWidth;
        this.minHeight = props.minHeight;
        this.exactWidth = props.exactWidth;
        this.exactHeight = props.exactHeight;
        this.preview = props.preview;
        this.bodyClass = props.bodyClass;
        this.errorCallback = props.onError;
        this.multipleFiles = props.multipleFiles;
        this.maxSize = props.maxSize;
        this.minSize = props.minSize;
        this.maxFilesAllowed = props.maxFilesAllowed;
        this.acceptFileTypes = props.acceptFileTypes || "image/*,video/mp4,.mov,.pdf,.xls,.xlsx,.csv,.xlsm";
        this.customselect = props.customselect;
        this.customSelectElement = props.customSelectElement;
        this.maxBatchSize = props.maxBatchSize || false;
        this.showMessageInKB = props.showMessageInKB || false;
        this.pdfSizeLimit = props.pdfSizeLimit || 5120000;
        this.errorMessage = props.errorMessage || {};
        this.equalHeightWidthImage = props.equalHeightWidthImage;
        this.showCustomErrorMessage = props.showCustomErrorMessage || false;
        this.setTotalMediaSelected = props.setTotalMediaSelected;
        this.state = {
            videoFiles: [],
            imageFiles: [],
            otherFiles: [],
            pdfFiles: [],
            csvFiles: [],
            xlsFiles: [],
            wordFiles: [],
            savedFileArr: props.savedFileArr
        };
    }

    componentWillReceiveProps(props) {
        if (props.resetComponent) {
            this.setState({
                videoFiles: [],
                imageFiles: [],
                otherFiles: [],
                pdfFiles: [],
                csvFiles: [],
                xlsFiles: [],
                wordFiles: []
            });
        }

        // Enabling user to maintain and update state explicitly
        if (props.updateStateAssets && props.updatedAssets) {
            this.setState({
                videoFiles: props.updatedAssets.videoFiles,
                imageFiles: props.updatedAssets.imageFiles,
                otherFiles: props.updatedAssets.otherFiles,
                pdfFiles: props.updatedAssets.pdfFiles,
                csvFiles: props.updatedAssets.csvFiles,
                xlsFiles: props.updatedAssets.xlsFiles,
                wordFiles: props.updatedAssets.wordFiles
            });
            if (props.updateCustomElement) {
                this.customSelectElement = props.customSelectElement;
            }
        } else if (!isEqual(props.customSelectElement, this.props.customSelectElement)) {
            this.customSelectElement = props.customSelectElement;
        } else if (props.maxFilesAllowed !== this.props.maxFilesAllowed) {
            this.maxFilesAllowed = props.maxFilesAllowed;
        }

        this.setState({
            savedFileArr: props.savedFileArr
        });
    }

    getTotalFilesSize() {
        const { videoFiles, imageFiles, otherFiles, pdfFiles, xlsFiles, wordFiles, csvFiles } = this.state;
        const files = unionBy(videoFiles, imageFiles, otherFiles, pdfFiles, xlsFiles, wordFiles, csvFiles, "name");
        return sumBy(files, (file) => {
            return file.size;
        }) || 0;
    }

    updateAssets(videoFiles, imageFiles, pdfFiles, csvFiles, otherFiles, xlsFiles, wordFiles, totalSize, formData) {
        let self = this,
            videoFileArr = this.state.videoFiles,
            imageFileArr = this.state.imageFiles,
            otherFileArr = this.state.otherFiles,
            pdfFileArr = this.state.pdfFiles,
            xlsFileArr = this.state.xlsFiles,
            wordFileArr = this.state.wordFiles,
            csvFileArr = this.state.csvFiles;

        const totalFileSize = this.getTotalFilesSize() + totalSize;
        const { isImageUploadRestricted = true } = this.props;

        if (this.props.maxBatchSize && (totalFileSize > this.props.maxBatchSize)) {
            self.errorCallback(`All attachments could not be uploaded successfully because they exceed ${Math.ceil(this.props.maxBatchSize / (1024 * 1024))}MB or the file type is not supported.`);
            return;
        }

        if (this.props.doNotUploadImageAndVideoTogether) {
            const { flag, message } = this.props.doNotUploadImageAndVideoTogether(imageFiles, videoFiles);
            if (flag && isImageUploadRestricted && message) {
                self.errorCallback(message);
                return;
            }

            const hasImages = filter(imageFiles || [], file => file.type.includes("image"));
            const hasvideos = filter(videoFiles || [], file => file.type.includes("video"));

            // Images and videos drag n drop together
            if (hasImages.length > 0 && hasvideos.length > 0) {
                return;
            }

            if (hasvideos.length > 1) {
                return;
            }
        }

        this.setState(() => {
            return {
                videoFiles: unionBy(videoFileArr, videoFiles, "name"),
                imageFiles: unionBy(imageFileArr, imageFiles, "name"),
                otherFiles: unionBy(otherFileArr, otherFiles, "name"),
                pdfFiles: unionBy(pdfFileArr, pdfFiles, "name"),
                csvFiles: unionBy(csvFileArr, csvFiles, "name"),
                xlsFiles: unionBy(xlsFileArr, xlsFiles, "name"),
                wordFiles: unionBy(wordFileArr, wordFiles, "name")
            };
        }, () => {
            this.props.onChange({
                videoFiles: self.state.videoFiles,
                imageFiles: self.state.imageFiles,
                pdfFiles: self.state.pdfFiles,
                csvFiles: self.state.csvFiles,
                xlsFiles: self.state.xlsFiles,
                wordFiles: self.state.wordFiles,
                otherFiles: self.state.otherFiles,
                formData
            });
            if (this.props.resetComponentOnFileUpload) {
                this.setState({
                    videoFiles: [],
                    imageFiles: [],
                    otherFiles: [],
                    pdfFiles: [],
                    csvFiles: [],
                    xlsFiles: [],
                    wordFiles: []
                });
            }
        });
    }

    removeImagePreview(index) {
        const self = this;
        this.setState((prevState) => {
            prevState.imageFiles.splice(index, 1);
            self.props.onChange({
                videoFiles: prevState.videoFiles,
                imageFiles: prevState.imageFiles,
                pdfFiles: prevState.pdfFiles,
                csvFiles: prevState.csvFiles,
                xlsFiles: prevState.xlsFiles,
                wordFiles: prevState.wordFiles,
                otherFiles: prevState.otherFiles
            }, "imageFiles");
            return {
                imageFiles: prevState.imageFiles
            };
        });
    }

    removeVideoPreview(index) {
        const self = this;
        this.setState((prevState) => {
            prevState.videoFiles.splice(index, 1);
            self.props.onChange({
                videoFiles: prevState.videoFiles,
                imageFiles: prevState.imageFiles,
                pdfFiles: prevState.pdfFiles,
                csvFiles: prevState.csvFiles,
                xlsFiles: prevState.xlsFiles,
                wordFiles: prevState.wordFiles,
                otherFiles: prevState.otherFiles
            }, "videoFiles");
            return {
                videoFiles: prevState.videoFiles
            };
        });
    }

    removeOtherFilePreview(index, assetType) {
        const self = this;
        this.setState((prevState) => {
            prevState[assetType].splice(index, 1);
            self.props.onChange({
                videoFiles: prevState.videoFiles,
                imageFiles: prevState.imageFiles,
                pdfFiles: prevState.pdfFiles,
                csvFiles: prevState.csvFiles,
                xlsFiles: prevState.xlsFiles,
                wordFiles: prevState.wordFiles,
                otherFiles: prevState.otherFiles
            }, assetType);
            return {
                otherFileArr: prevState.otherFiles,
                pdfFileArr: prevState.pdfFiles,
                csvFileArr: prevState.csvFiles,
                xlsFileArr: prevState.xlsFiles,
                wordFileArr: prevState.wordFiles
            };
        });
    }

    render() {
        const self = this;
        return (
            <div data-testid="el-test-file-uploader" className={`el-file-uploader ${styles["el-file-uploader--wrapper"]}`}>
                <SelectFiles
                    updateAssets={self.updateAssets.bind(self)}
                    imageSizeLimit={self.imageSizeLimit}
                    videoSizeLimit={self.videoSizeLimit}
                    errorCallback={self.errorCallback}
                    bodyClass={self.bodyClass}
                    multipleFiles={self.multipleFiles}
                    acceptFileTypes={self.acceptFileTypes}
                    maxSize={self.maxSize}
                    minSize={self.minSize}
                    maxWidth={self.maxWidth}
                    maxHeight={self.maxHeight}
                    minWidth={self.minWidth}
                    minHeight={self.minHeight}
                    exactWidth={self.exactWidth}
                    exactHeight={self.exactHeight}
                    customselect={self.customselect}
                    customSelectElement={self.customSelectElement}
                    showMessageInKB={self.showMessageInKB}
                    pdfSizeLimit={self.pdfSizeLimit}
                    errorMessage={self.errorMessage}
                    maxFilesAllowed={self.maxFilesAllowed}
                    equalHeightWidthImage={self.equalHeightWidthImage}
                    disableClick={self.props.disableClick}
                    dropzoneRef={self.props.dropzoneRef}
                    isVideoUploadRestricted={self.props.isVideoUploadRestricted}
                    isImageUploadRestricted={self.props.isImageUploadRestricted}
                    showCustomErrorMessage={self.showCustomErrorMessage}
                    setTotalMediaSelected={self.setTotalMediaSelected}
                    {...this.props}
                />
                {self.preview == "on" &&
                    <FilePreview
                        videoFiles={self.state.videoFiles}
                        imageFiles={self.state.imageFiles}
                        otherFiles={self.state.otherFiles}
                        pdfFiles={self.state.pdfFiles}
                        csvFiles={self.state.csvFiles}
                        xlsFiles={self.state.xlsFiles}
                        wordFiles={self.state.wordFiles}
                        removeImagePreview={self.removeImagePreview.bind(self)}
                        removeVideoPreview={self.removeVideoPreview.bind(self)}
                        removeOtherFilePreview={self.removeOtherFilePreview.bind(self)}
                        removeFilePreviewHandler={self.props.removeFilePreviewHandler}
                        savedFileArr={self.state.savedFileArr}
                        renderSavedFilePreview={self.props.renderSavedFilePreview}
                    />
                }
            </div>
        );
    }
}

FileUploader.propTypes = {
    imageSizeLimit: PropTypes.string,
    videoSizeLimit: PropTypes.string,
    preview: PropTypes.string,
    onError: PropTypes.func,
    onChange: PropTypes.func,
    bodyClass: PropTypes.string,
    acceptFileTypes: PropTypes.object,
    multipleFiles: PropTypes.bool,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    resetComponent: PropTypes.bool,
    savedFileArr: PropTypes.array,
    removeFilePreviewHandler: PropTypes.func,
    customselect: PropTypes.bool,
    customSelectElement: PropTypes.element,
    updateStateAssets: PropTypes.bool,
    updatedAssets: PropTypes.object,
    maxBatchSize: PropTypes.number,
    exactHeight: PropTypes.number,
    exactWidth: PropTypes.number,
    showMessageInKB: PropTypes.bool,
    pdfSizeLimit: PropTypes.bool,
    errorMessage: PropTypes.object,
    maxFilesAllowed: PropTypes.number,
    equalHeightWidthImage: PropTypes.bool,
    openSelectFileDialogueBox: PropTypes.func,
    disableClick: PropTypes.bool,
    updateCustomElement: PropTypes.bool,
    dropzoneRef: PropTypes.string,
    doNotUploadImageAndVideoTogether: PropTypes.func,
    resetComponentOnFileUpload: PropTypes.bool,
    isVideoUploadRestricted: PropTypes.bool,
    isImageUploadRestricted: PropTypes.bool,
    showCustomErrorMessage: PropTypes.bool,
    setTotalMediaSelected: PropTypes.func
};

export default FileUploader;