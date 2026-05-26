import React from "react";
import PropTypes from "prop-types";
import SingleSelect from "atoms/SingleSelect";
import NoData from "components/NoData";
import FreeMediaGrid from "components/FreeMedia/FreeMediaGrid";
import FreeMediaShimmer from "components/FreeMedia/FreeMediaShimmer";
import { ColorList } from "utils/colorList";
import styles from "./FreeMediaPixabay.module.scss";

const FreeMediaPixabay = ({
    // Data
    photos,
    isLoading,
    isLoadingMore,
    hasMore,
    noResults,
    freeMediaSelected,
    freeMediaSource,
    // Callbacks
    loadMore,
    handleMultipleSelectChange,
    onOrientationChange,
    onColorChange,
    onOrderChange,
    // Filter state
    searchQuery,
    selectedOrientation,
    selectedColor,
    selectedOrder,
    // Config
    maxFilesAllowed,
    noResultImage,
}) => {
    const orientationOptions = [
        { value: "All orientations", label: "All orientation" },
        { value: "Horizontal", label: "Horizontal" },
        { value: "Vertical", label: "Vertical" },
    ];

    const colorOptions = ColorList();

    const orderOptions = [
        { value: "Popular", label: "Popular" },
        { value: "Latest", label: "Latest" },
    ];
    return (
        <div>
            <div className={`${styles["filter-wrapper"]} ${searchQuery ? styles["filter-box"] : ""}`}>
                <div className={styles["photos-provide-wrapper"]}>
                    {" "}Photos provided by{" "}
                    <a href="https://www.pixabay.com/" target="_blank" rel="noreferrer noopener">
                        Pixabay
                    </a>
                </div>

                {searchQuery && (
                    <div className={styles["filter-box-wrapper"]}>
                        <SingleSelect
                            options={orientationOptions}
                            selected={selectedOrientation}
                            onChange={onOrientationChange}
                            hideLabelInDropDownOptions
                            customSize="small"
                            extendWidth
                        />
                        <SingleSelect
                            options={orderOptions}
                            selected={selectedOrder}
                            onChange={onOrderChange}
                            hideLabelInDropDownOptions
                            customClass="ml-10"
                            customSize="small"
                            extendWidth
                        />
                        <SingleSelect
                            options={colorOptions}
                            selected={selectedColor}
                            onChange={onColorChange}
                            listKeys={[
                                { type: undefined, heading: "" },
                                { type: "TONE", heading: "Tone" },
                            ]}
                            supportMultipleList
                            hideLabelInDropDownOptions
                            customClass={`ml-10 ${styles["color-picker-wrapper"]}`}
                            customSize="small"
                            extendWidth
                            showToneColor
                            toneColorValue={selectedColor}
                        />
                    </div>
                )}
            </div>

            {isLoading && !isLoadingMore ? (
                <FreeMediaShimmer initialLoading />
            ) : noResults ? (
                <NoData
                    imageUrl={noResultImage}
                    title={
                        <span>
                            No images matches your search!
                            <br />
                            Search for a different keyword
                        </span>
                    }
                />
            ) : (
                <FreeMediaGrid
                    media={photos}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    freeMediaSelected={freeMediaSelected}
                    freeMediaSource={freeMediaSource}
                    handleMultipleSelectChange={handleMultipleSelectChange}
                    limit={maxFilesAllowed}
                    getImageUrl={(item) => item.largeImageURL}
                    getDisplayName={(item) => item.user}
                    getPlaceholderSrc={(item) => item.previewURL}
                    getPhotographerURL={(item) =>
                        "https://pixabay.com/users/" + item.user + "-" + item.user_id + "/"
                    }
                />
            )}
        </div>
    );
};

FreeMediaPixabay.propTypes = {
    photos: PropTypes.array,
    isLoading: PropTypes.bool,
    isLoadingMore: PropTypes.bool,
    hasMore: PropTypes.bool,
    noResults: PropTypes.bool,
    freeMediaSelected: PropTypes.array,
    freeMediaSource: PropTypes.string,
    loadMore: PropTypes.func,
    handleMultipleSelectChange: PropTypes.func,
    onOrientationChange: PropTypes.func,
    onColorChange: PropTypes.func,
    onOrderChange: PropTypes.func,
    searchQuery: PropTypes.string,
    selectedOrientation: PropTypes.string,
    selectedColor: PropTypes.string,
    selectedOrder: PropTypes.string,
    maxFilesAllowed: PropTypes.number,
    noResultImage: PropTypes.string,
};

export default FreeMediaPixabay;
