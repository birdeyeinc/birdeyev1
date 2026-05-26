import React from "react";
import PropTypes from "prop-types";
import Modal from "atoms/Modal";
import FreeMediaSourcePanel from "components/FreeMedia/FreeMediaSourcePanel";
import FreeMediaPexels from "components/FreeMedia/FreeMediaPexels";
import FreeMediaGiphy from "components/FreeMedia/FreeMediaGiphy";
import FreeMediaPixabay from "components/FreeMedia/FreeMediaPixabay";
import styles from "./FreeMediaLibraryModal.module.scss";

const FreeMediaLibraryModal = ({
    // ── Modal control ──
    isOpen = false,
    onClose,
    modalClassName,

    // ── Header (render prop — consumer provides PageHeader) ──
    renderHeader,

    // ── Source panel ──
    sources = [],
    activeSource = "Pexels",
    onSourceChange,
    hideLeftNav = false,

    // ── Pexels props ──
    pexelsProps,
    // ── Giphy props ──
    giphyProps,
    // ── Pixabay props ──
    pixabayProps,

    // ── Common media props ──
    freeMediaSelected = [],
    handleMultipleSelectChange,
    maxFilesAllowed,
    noResultImage,

    // ── Footer ──
    renderFooter,

    // ── Selection count display ──
    selectedCount = 0,
    showSelectedCount = false,
}) => {
    // Determine which source content to render
    const renderSourceContent = () => {
        switch (activeSource) {
        case "Pexels":
            return pexelsProps ? (
                <FreeMediaPexels
                    {...pexelsProps}
                    freeMediaSelected={freeMediaSelected}
                    freeMediaSource={activeSource}
                    handleMultipleSelectChange={handleMultipleSelectChange}
                    maxFilesAllowed={maxFilesAllowed}
                    noResultImage={noResultImage}
                />
            ) : null;

        case "Giphy":
            return giphyProps ? (
                <FreeMediaGiphy
                    {...giphyProps}
                    freeMediaSelected={freeMediaSelected}
                    freeMediaSource={activeSource}
                    handleMultipleSelectChange={handleMultipleSelectChange}
                    maxFilesAllowed={maxFilesAllowed}
                    noResultImage={noResultImage}
                />
            ) : null;

        case "Pixabay":
            return pixabayProps ? (
                <FreeMediaPixabay
                    {...pixabayProps}
                    freeMediaSelected={freeMediaSelected}
                    freeMediaSource={activeSource}
                    handleMultipleSelectChange={handleMultipleSelectChange}
                    maxFilesAllowed={maxFilesAllowed}
                    noResultImage={noResultImage}
                />
            ) : null;
        default:
            return null;
        }
    };

    return (
        <Modal
            dialogOptions={{
                isOpen,
                onCloseModal: onClose,
                showCloseIcon: true,
                shouldCloseOnOverlayClick: false,
                dialogStyles: {
                    content: {
                        height: "calc(100vh - 100px)",
                        margin: "0 auto 35px auto",
                        overflow: "auto",
                        maxWidth: "1920px",
                        padding: "0",
                    },
                },
            }}
            className={modalClassName}
            smallCloseIcon
        >
            <div className={`free-media-library-container ${styles["free-media-library-wrapper"]}`}>
                {/* ── Header slot ── */}
                {typeof renderHeader === "function" && (
                    <div className={styles["header-wrapper"]}>
                        {renderHeader()}
                    </div>
                )}

                {/* ── Selected count badge ── */}
                {showSelectedCount && selectedCount > 0 && (
                    <div className={`pt-0 ${styles["header-wrapper"]}`}>
                        <div className={styles["selected-items"]}>
                            {selectedCount} selected
                        </div>
                    </div>
                )}

                {/* ── Body: source panel + content + optional filter sidebar ── */}
                <div className={styles["free-media-body-wrapper"]}>
                    <div className={styles["free-media-library"]}>
                        {!hideLeftNav && (
                            <FreeMediaSourcePanel
                                sources={sources}
                                activeSource={activeSource}
                                onSourceChange={onSourceChange}
                            />
                        )}

                        <div
                            className={[
                                styles["right-container"],
                                !hideLeftNav ? styles["withleftbar"] : styles["withoutleftbar"],
                                freeMediaSelected.length > 0 ? styles["has-selection"] : "",
                                // showFilterSidebar ? styles["with-filter-sidebar"] : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            <div>{renderSourceContent()}</div>
                        </div>
                    </div>
                </div>

                {/* ── Footer slot ── */}
                {typeof renderFooter === "function" && renderFooter()}
            </div>
        </Modal>
    );
};

FreeMediaLibraryModal.propTypes = {
    // Modal
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    modalClassName: PropTypes.string,

    // Header
    renderHeader: PropTypes.func,

    // Source panel
    sources: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string,
        })
    ),
    activeSource: PropTypes.string,
    onSourceChange: PropTypes.func,
    hideLeftNav: PropTypes.bool,

    // Source-specific props
    pexelsProps: PropTypes.object,
    giphyProps: PropTypes.object,
    pixabayProps: PropTypes.object,

    // Common media props
    freeMediaSelected: PropTypes.array,
    handleMultipleSelectChange: PropTypes.func,
    maxFilesAllowed: PropTypes.number,
    noResultImage: PropTypes.string,

    // Footer
    renderFooter: PropTypes.func,

    // Selection
    selectedCount: PropTypes.number,
    showSelectedCount: PropTypes.bool,
};

export default FreeMediaLibraryModal;
