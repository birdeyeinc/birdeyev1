import React from "react";
import PropTypes from "prop-types";
import SingleSelect from "atoms/SingleSelect";
import NoData from "components/NoData";
import FreeMediaGrid from "components/FreeMedia/FreeMediaGrid";
import FreeMediaShimmer from "components/FreeMedia/FreeMediaShimmer";
import { ColorList } from "utils/colorList";
import styles from "./FreeMediaPexels.module.scss";
import { orientationOptions } from "./constants";

const FreeMediaPexels = ({
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
    // Filter state
    searchQuery,
    selectedOrientation,
    selectedColor,
    // Config
    providerText,
    showOrientations = false,
    showColors = false,
    enableSeeMore = false,
    handleClickSeeMore,
    seeMoreClicked = false,
    perPageLimit = 40,
    maxFilesAllowed,
    noResultImage,
}) => {
    const colorOptions = ColorList();

    return (
        <div>
            <div className={`${styles["filter-wrapper"]} ${searchQuery ? styles["filter-box"] : ""}`}>
                <div className={styles["photos-provide-wrapper"]}>
                    {providerText || "Photos provided by"}{" "}
                    <a href="https://www.pexels.com/" target="_blank" rel="noreferrer noopener">
                        Pexels
                    </a>
                </div>

                {searchQuery && (
                    <div className={styles["filter-box-wrapper"]}>
                        {showOrientations && (
                            <SingleSelect
                                options={orientationOptions}
                                selected={selectedOrientation}
                                onChange={onOrientationChange}
                                hideLabelInDropDownOptions
                                customSize="small"
                                extendWidth
                            />
                        )}
                        {showColors && (
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
                        )}
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
                            No images match your search.
                            <br />
                            Try a different keyword.
                        </span>
                    }
                />
            ) : (
                <div>
                    <FreeMediaGrid
                        media={photos}
                        hasMore={hasMore}
                        loadMore={loadMore}
                        freeMediaSelected={freeMediaSelected}
                        freeMediaSource={freeMediaSource}
                        handleMultipleSelectChange={handleMultipleSelectChange}
                        enableSeeMore={enableSeeMore}
                        handleClickSeeMore={handleClickSeeMore}
                        limit={maxFilesAllowed}
                        getImageUrl={(item) => item.src.large}
                        getDisplayName={(item) => item.photographer}
                        getPlaceholderSrc={(item) => item.src.small}
                        getPhotographerURL={(item) => item.photographer_url}
                    />
                    {seeMoreClicked && isLoadingMore && (
                        <FreeMediaShimmer perPageLimit={perPageLimit} />
                    )}
                </div>
            )}
        </div>
    );
};

FreeMediaPexels.propTypes = {
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
    searchQuery: PropTypes.string,
    selectedOrientation: PropTypes.string,
    selectedColor: PropTypes.string,
    providerText: PropTypes.string,
    showOrientations: PropTypes.bool,
    showColors: PropTypes.bool,
    enableSeeMore: PropTypes.bool,
    handleClickSeeMore: PropTypes.func,
    seeMoreClicked: PropTypes.bool,
    perPageLimit: PropTypes.number,
    maxFilesAllowed: PropTypes.number,
    noResultImage: PropTypes.string,
};

export default FreeMediaPexels;
