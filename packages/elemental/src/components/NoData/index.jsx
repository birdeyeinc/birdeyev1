import React from "react";
import PropTypes from "prop-types";
import styles from "./NoData.module.scss";
import noDataImage from "assets/images/no-results.svg";
import Archive from "assets/images/Archive.png";
import { getEncodedStyleClass } from "utils/index";
import NoDataSimple from "./simple";

const NoData = (props) => {
    const {
        imageUrl,
        title,
        subtitle,
        ctaHTML,
        customStyleName,
        customCTAClassName,
        isSmall,
        customClassName,
        pageHeading,
        customImageHtml,
        searchTitle,
        isApple,
        containerHeight, // Prop introduced as ENT Reporting uses dynamic grid layout height
        containerWidth, // Prop introduced as ENT Reporting uses dynamic grid layout width
        isArchive,
        variant = "default"
    } = props;

    if (variant === "simple") {
        return (<NoDataSimple {...props} />);
    } else {
        const styleObj = {};
        if (containerHeight) {
            styleObj["minHeight"] = containerHeight > 200 ? containerHeight : 200;
            styleObj["maxHeight"] = containerHeight > 200 ? containerHeight : 200;
        }
        if (containerWidth) {
            styleObj["maxWidth"] = containerWidth > 500 ? containerWidth : 300;
        }
        return (
            <React.Fragment>
                {pageHeading ? <div data-testid="el-test-no-data-page-heading" className={styles["page-heading"]}>{pageHeading}</div> : null}
                <div data-testid="el-test-no-data" className={`el-no-data ${styles["no-data-box"]} ${getEncodedStyleClass(customStyleName, styles)} ${isSmall ? styles["small-box"] : ""} ${customClassName || ''}`} style={styleObj}>
                    {isArchive ? (<figure>
                        <img src={Archive} />
                    </figure>) : (!customImageHtml ?
                        (imageUrl && !isApple && <figure>
                            <img src={imageUrl || noDataImage} />
                        </figure>)
                        : (<div>{customImageHtml}</div>)
                    )
                    }
                    {searchTitle ? searchTitle : title ? <h1>{title}</h1> : ""}
                    {
                        subtitle ? (
                            <p className={`${styles["subtitle"]} ${containerHeight <= 200 ? styles["overide-subtitle-style"] : ""} ${ctaHTML ? "" : "mb-0"}`} style={{ width: containerWidth }}>
                                {subtitle}
                            </p>
                        ) : ""
                    }
                    {ctaHTML ? <div className={customCTAClassName ? customCTAClassName : ""}>{ctaHTML}</div> : ""}
                </div>
            </React.Fragment>
        );
    };
}

NoData.propTypes = {
    imageUrl: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    ctaHTML: PropTypes.node,
    customStyleName: PropTypes.string,
    customCTAClassName: PropTypes.string,
    isSmall: PropTypes.bool,
    customClassName: PropTypes.string,
    pageHeading: PropTypes.string,
    customImageHtml: PropTypes.node,
    searchTitle: PropTypes.node,
    isApple: PropTypes.bool,
    containerHeight: PropTypes.number,
    containerWidth: PropTypes.number,
    isArchive: PropTypes.bool,
    variant: PropTypes.oneOf(["default", "simple"])
};

export default NoData;