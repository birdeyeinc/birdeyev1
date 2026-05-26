import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./InfoComponent.module.scss";
import Tooltip from "atoms/Tooltip";
import { getEncodedStyleClass } from "utils/index";

const InfoComponent = (props) => {
    const { infoHTML,
        closeInfo,
        showCrossIcon,
        infoType,
        iconClassName = '',
        customClassName = '',
        noBackground,
        customBannerClassName = '',
        imageSvg,
        showPhoenixTooltip,
        infoText,
        htmlId,
        hyperLinkText,
        onHyperLinkClick } = props;

    const [showTooltipOnEllipsis, setShowTooltipOnEllipsis] = useState(false);

    useEffect(() => {
        htmlId && document.getElementById(htmlId).addEventListener("mouseover", handleMouseOver);
    }, []);

    const handleMouseOver = (event) => {
        const { scrollWidth, clientWidth } = event.target;
        // this.setState({ showPhoenixTooltip: scrollWidth > clientWidth });
        setShowTooltipOnEllipsis(scrollWidth > clientWidth);
    };

    const getinfoType = () => {
        let iconClass = "icon_phoenix-";
        let bannerClass = "banner-";
        switch (infoType) {
            case "success":
                iconClass += "success-banner";
                bannerClass += "success";
                break;
            case "warning":
                iconClass += "caution-banner";
                bannerClass += "warning";
                break;
            case "light-warning":
                iconClass += "caution-banner";
                bannerClass += "light-warning";
                break;
            case "error":
                iconClass += "error-banner";
                bannerClass += "error";
                break;
            case "blueInfo":
                iconClass += "info-banner";
                bannerClass += "blue";
                break;
            case "lightBlueInfo":
                iconClass += "info-banner";
                bannerClass += "light-blue";
                break;
            case "lightBlueInfoBanner":
                iconClass += "info";
                bannerClass += "light-blue";
                break;
            case "lightPinkInfo":
                iconClass += "info-banner";
                bannerClass += "light-pink";
                break;
            case "loaderInfo":
                iconClass += "loader";
                bannerClass += "blue";
                break;
            case "downloadInfo":
                //iconClassName += "download-icon";
                bannerClass += "blue";
                break;
            case "gsrRating":
                iconClass += "google-brand";
                bannerClass += "gsrRating";
                break;
            case "appointmentScheduled":
                iconClass += "success-fill";
                bannerClass += "appointmentScheduled";
                break;
            case "lightPinkInfoFailed":
                iconClass += "failed-border";
                bannerClass += "light-pink";
                break;
            case "lightPinkError": // Added new case to display error in QR codes
                iconClass += "error-banner";
                bannerClass += "light-pink";
                break;
            case "lightPinkWarning": // Added new case to display error in QR codes
                iconClass += "caution-banner";
                bannerClass += "light-pink";
                break;
            case "warning-pink":
                iconClass += "caution-banner";
                bannerClass += "warning-pink";
                break;
            case "viewApprove":
                iconClass += "important-fill";
                bannerClass += "appointmentScheduled";
                break;
            case "albumRejected":
                iconClass += "important-fill";
                bannerClass += "light-pink";
                break;
            case "dlcWarning":
                iconClass += "important-fill";
                bannerClass += "warning";
                break;
            case "redWarning":
            case "dlcNonRegistered":
                iconClass += "failed-border";
                bannerClass += "light-registered";
                break;
            case "dlcPending":
                iconClass += "warning-fill";
                bannerClass += "light-pending";
                break;
            case "blueBgInfo":
                iconClass += "info-banner";
                bannerClass += "light-blue-bg";
                break;
            case "splitBgInfo":
                iconClass += "warning-fill";
                bannerClass += "light-registered";
                break;
            case "paymentDue":
                iconClass += "failed-border";
                bannerClass += "light-registered";
                break;
            case "aiInfo":
                iconClass += "ai-icon";
                bannerClass += "light-purple";
                break;
            case "CompetitorInfo":
                iconClass += "info";
                bannerClass += "blue-bg";
                break;
            case "notify":
                iconClass += "bulb";
                bannerClass += "light-blue";
                break;
            default:
                iconClass += "important-fill";
                bannerClass = "";
                break;
        }
        return [iconClass, bannerClass];
    };

    const [iconClass, bannerClass] = getinfoType(infoType);

    return infoHTML ? (
        <div className={`el-infocomponent ${styles['banner-info']} ${styles[bannerClass]} ${showCrossIcon ? styles["with-cross"] : ""} ${noBackground ? styles["no-bg"] : ""} ${showPhoenixTooltip ? styles["ellipsis"] : ""} ${getEncodedStyleClass(customBannerClassName, styles)} ${customClassName}`}>
            {imageSvg ? <img src={imageSvg} /> : <i className={`${iconClass} ${iconClassName}`} />}
            {showPhoenixTooltip && showTooltipOnEllipsis ? <Tooltip text={infoText}
                hideOnScroll
                position="bottom"
                size="medium"
                tooltipClass={"multi-select-tooltip"}
                customContainerClassName={styles["option-tooltip-parent"]}
                theme={infoType == "lightPinkWarning" ? "red" : null}
            >
                <p className={styles["banner-text"]}>
                    {infoHTML}
                </p>
            </Tooltip> :
                <div className={styles["rightContent"]}>
                    <p className={styles["banner-text"] + ' option-tooltip-parent'}>
                        {infoHTML}
                    </p>
                    {hyperLinkText && (
                        <span className={styles["rightContent-link"]}>
                            <a onClick={onHyperLinkClick}>{hyperLinkText} </a>
                        </span>
                    )}
                </div>

            }
            {showCrossIcon ? <i data-testid="el-test-info-close" className="icon_phoenix-reset" onClick={closeInfo} /> : null}
        </div>
    ) : null;
};

InfoComponent.propTypes = {
    closeInfo: PropTypes.func,
    infoHTML: PropTypes.object,
    showCrossIcon: PropTypes.bool,
    infoType: PropTypes.oneOf(['success', 'warning', 'error', 'blueInfo', 'lightBlueInfo', 'lightPinkInfo', 'loaderInfo', 'downloadInfo', 'gsrRating', 'appointmentScheduled', 'lightPinkInfoFailed', 'lightPinkError', 'lightPinkWarning', 'warning-pink', 'viewApprove', 'albumRejected', 'dlcWarning', 'redWarning', 'dlcNonRegistered', 'dlcPending', 'blueBgInfo', 'splitBgInfo', 'paymentDue', 'aiInfo', 'CompetitorInfo', 'notify']),
    iconClassName: PropTypes.string,
    customClassName: PropTypes.string,
    noBackground: PropTypes.bool,
    customBannerClassName: PropTypes.string,
    infoText: PropTypes.string,
    showPhoenixTooltip: PropTypes.bool,
    hyperLinkText: PropTypes.string,
    onHyperLinkClick: PropTypes.func

};
export default InfoComponent;