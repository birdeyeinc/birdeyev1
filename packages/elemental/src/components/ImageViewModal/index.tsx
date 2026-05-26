import React, { useState, useEffect, useRef, CSSProperties, ReactNode } from 'react';
import styles from "./ImageViewModal.module.scss";
import Slider from "atoms/Slick";
import map from "lodash/map";

interface ImageViewWithModalProps {
    showModal: boolean;
    closeModal: () => void;
    images?: any[];
    className?: string;
    style?: CSSProperties;
    showDownload?: boolean;
    downloadToLocal?: boolean;
    infinite?: boolean;
    startingPosition?: number;
    imagesCaption?: Array<string | ReactNode>;
    customDownloadCallback?: (imageUrl: string) => void;
    isInboxAttachment?: boolean;
    sliderParentClass?: string;
    showCustomJSXIndexAfter?: number;
    customJSX?: ReactNode;
    attachedFileTypes?: Array<string>;
    autoPlay?: boolean;
    customImageObject?: any[];
}

const ImageViewWithModal: React.FC<ImageViewWithModalProps> = (props) => {
    const imageModalRef = useRef<HTMLDivElement>(null);
    const {
        showModal,
        closeModal,
        images,
        style,
        showDownload,
        downloadToLocal,
        startingPosition = 0,
        infinite = true,
        imagesCaption,
        customDownloadCallback = null,
        isInboxAttachment = false,
        sliderParentClass = "",
        showCustomJSXIndexAfter = 0,
        customJSX = null,
        attachedFileTypes,
        autoPlay,
        customImageObject = null
    } = props;
    const [newCurrentSlide, setNewCurrentSlide] = useState<number>(1);
    const extraProps = {
        lazyLoad: true,
        arrows: true,
        infinite
    };

    useEffect(() => {
        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                e.preventDefault();
            }

            if (e.key === "Escape") {
                e.preventDefault();
                closeModal();
            }
        };
        if (showModal) {
            document.addEventListener("keydown", handleTabKey);
        } else {
            document.removeEventListener("keydown", handleTabKey);
        }

        return () => {
            document.removeEventListener("keydown", handleTabKey);
        };
    }, [showModal]);

    const getImages = (): any => {
        if (!customImageObject) return images;
        return map(customImageObject, item => item?.url);
    };

    const htmlJSX = (
        <div
            ref={imageModalRef}
            data-testid="el-test-image-view-modal"
            className={`el-image-view-modal ${styles["image-view-modal"]} ${sliderParentClass} ${showModal ? `${styles["show"]} el-image-view-modal-show` : ""}`}
            style={style}
        >
            <Slider
                closeModal={closeModal}
                extraProps={extraProps}
                showAttachedFiles
                attachedFiles={getImages()}
                attachedFileTypes={attachedFileTypes || null}
                newCurrentSlide={newCurrentSlide}
                updateCurrentSlide={setNewCurrentSlide}
                showSlideInfo
                showDownload={showDownload}
                downloadToLocal={downloadToLocal}
                showOnTop
                startingPosition={startingPosition}
                imagesCaption={imagesCaption}
                customDownloadCallback={customDownloadCallback}
                isInboxAttachment={isInboxAttachment}
                showCustomJSXIndexAfter={customImageObject ? newCurrentSlide - 1 : showCustomJSXIndexAfter}
                customJSX={customJSX}
                hideCustomJSX={customImageObject ? !customImageObject[newCurrentSlide - 1]?.showCustomJSX : false}
                autoPlay={autoPlay}
            />
        </div>
    );

    return htmlJSX;
};

export default ImageViewWithModal;
