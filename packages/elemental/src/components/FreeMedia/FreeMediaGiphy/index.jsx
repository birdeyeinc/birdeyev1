import React from "react";
import PropTypes from "prop-types";
import NoData from "components/NoData";
import FreeMediaGrid from "components/FreeMedia/FreeMediaGrid";
import FreeMediaShimmer from "components/FreeMedia/FreeMediaShimmer";
import styles from "./FreeMediaGiphy.module.scss";

const FreeMediaGiphy = ({
    // Data
    gifs,
    isLoading,
    isLoadingMore,
    hasMore,
    noResults,
    freeMediaSelected,
    freeMediaSource,
    // Callbacks
    loadMore,
    handleMultipleSelectChange,
    // Config
    maxFilesAllowed,
    noResultImage,
}) => {
    return (
        <div>
            <div className={styles["photos-provide-wrapper"]}>
                {" "}Powered by{" "}
                <a href="https://www.giphy.com/" target="_blank" rel="noreferrer noopener">
                    Giphy
                </a>
            </div>

            {isLoading && !isLoadingMore ? (
                <FreeMediaShimmer initialLoading />
            ) : noResults ? (
                <div className={styles["giphy-no-data"]}>
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
                </div>
            ) : (
                <FreeMediaGrid
                    media={gifs}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    freeMediaSelected={freeMediaSelected}
                    freeMediaSource={freeMediaSource}
                    handleMultipleSelectChange={handleMultipleSelectChange}
                    limit={maxFilesAllowed}
                    getImageUrl={(item) => item.images.fixed_height.url}
                    getDisplayName={(item) => item.username}
                    getPlaceholderSrc={(item) => item.images.preview_gif.url}
                    getPhotographerURL={(item) => "https://giphy.com/" + item.username + "/"}
                />
            )}
        </div>
    );
};

FreeMediaGiphy.propTypes = {
    gifs: PropTypes.array,
    isLoading: PropTypes.bool,
    isLoadingMore: PropTypes.bool,
    hasMore: PropTypes.bool,
    noResults: PropTypes.bool,
    freeMediaSelected: PropTypes.array,
    freeMediaSource: PropTypes.string,
    loadMore: PropTypes.func,
    handleMultipleSelectChange: PropTypes.func,
    maxFilesAllowed: PropTypes.number,
    noResultImage: PropTypes.string,
};

export default FreeMediaGiphy;
