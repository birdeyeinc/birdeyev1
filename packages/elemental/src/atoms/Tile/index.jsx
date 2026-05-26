import React, { Component } from "react";
import PropTypes from "prop-types";
import Styles from "./Tile.module.scss";
import Button from "atoms/Button";
import Tooltip from "atoms/Tooltip";

class Tile extends Component {
    handleDownload = (downloadUrl) => {
        window.open(downloadUrl, "_blank");
    };

    getTileContent = (item) => {
        const { errorMessage, showTotalPages, displayTilesTogether, imageCdnLink } = this.props;

        return item && (
            <div className={`${Styles["tile-content"]} ${item.total !== 1 ? "" : Styles["custom-single-tile-content"]}`}>
                <Tooltip
                    text={item.integrationSourceDisplayName}
                    position="bottom"
                >
                    <img src={`${imageCdnLink}${item.integrationSource.toLowerCase()}.png`} />
                </Tooltip>
                <div className={Styles["tile-content-label"]}>
                    <div>
                        {item.total !== 1 && <span className={Styles["larger-text"]}>{item.broken}</span>}
                        {showTotalPages && item.total > 1 &&
                            <span className={Styles["smaller-text"]}>/{item.total}</span>
                        }
                    </div>
                    <p>{displayTilesTogether ? item.errorMessage : errorMessage}</p>
                </div>
            </div>
        );
    };

    render() {
        const {
            payload,
            displayTilesTogether,
            hideButton = false,
            buttonText,
            onButtonClick,
            downloadUrl
        } = this.props;

        return (
            <div className={`${Styles["tile-wrap"]} ${displayTilesTogether ? Styles["extra-tiles"] : ""}`}>
                <div>
                    {displayTilesTogether ? (
                        <div>
                            {payload.map((item, index) => (
                                <div key={index}>
                                    {this.getTileContent(item)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        this.getTileContent(payload)
                    )}
                </div>
                <div className={Styles["custom-tile-download-wrap"]}>
                    {downloadUrl && (
                        <Tooltip
                            text="Download list of disconnected locations to review"
                            customContainerClassName="custom-tile-tooltip-wrap"
                        >
                            <i
                                className="icons icon_phoenix-pdf_download"
                                onClick={() => this.handleDownload(downloadUrl)}
                            />
                        </Tooltip>
                    )}
                    {!hideButton && (
                        <Button onClick={onButtonClick}>
                            {displayTilesTogether ? "Schedule call" : buttonText}
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}

Tile.propTypes = {
    payload: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired,
    displayTilesTogether: PropTypes.bool,
    hideButton: PropTypes.bool,
    buttonText: PropTypes.string,
    errorMessage: PropTypes.string,
    showTotalPages: PropTypes.bool,
    onButtonClick: PropTypes.func,
    downloadUrl: PropTypes.string,
    imageCdnLink: PropTypes.string
};

export default Tile;