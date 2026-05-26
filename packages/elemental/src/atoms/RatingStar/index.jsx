import React from "react";
import PropTypes from "prop-types";
import styles from "./RatingStar.module.scss";
import { getEncodedStyleClass } from "utils/index";

function RatingStar(props) {
    
    const { rating, backgroundObject, starCssON, starCssOFF, ratingClass, extClass, isDashboard, binaryStarMode } = props;
    
    let filledStar = rating | 0;
    let widthHalfStar = (rating - filledStar) * 10;
    let rateClass = ratingClass ? ratingClass : "";
    let extraClass = extClass ? extClass : "";
    
    // Calculate total stars to display
    const totalStars = binaryStarMode ? 1 : 5;

    return (
        <div className={`el-rating-star ${getEncodedStyleClass("rating-box " + rateClass + extraClass, styles)}`} style={backgroundObject} >
            <span className={`${isDashboard ? "bew-avgstars" : ""} ${styles['bew-avgstars']}`}>
                {[...Array(totalStars)].map((d, i) => {
                    return (
                        <div key={i} className={`${isDashboard ? "be-c-stars" : ""} ${styles['be-c-star']}`}>
                            {!binaryStarMode && (
                                <span>
                                    <i className={styles["be-star-off"]} style={starCssOFF}>&#9733;</i>
                                </span>
                            )}
                            <span style={(i == filledStar && widthHalfStar > 0) ? {width: widthHalfStar + "px"} : {}}>
                                {i < filledStar ? (
                                    <i className={styles["be-star-on" ]}style={starCssON}>&#9733;</i>
                                ) : ((i == filledStar && widthHalfStar > 0) ? (
                                    <i className="be-star-on" style={starCssON}>&#9733;</i>
                                ) : (
                                    binaryStarMode ? (
                                        <i className={styles["be-star-off"]} style={starCssOFF}>&#9733;</i>
                                    ) : (
                                        <span className={styles["be-star-off"]}  style={starCssOFF}>&#9733; </span>
                                    )
                                )
                                )}
                            </span>
                        </div>
                    );
                })}
                
            </span>   
        </div> 
    );
}

RatingStar.propTypes = {
    rating: PropTypes.number,
    backgroundObject: PropTypes.object,
    starCssON: PropTypes.object,
    starCssOFF: PropTypes.object,
    ratingClass: PropTypes.string,
    extClass: PropTypes.string,
    isDashboard: PropTypes.bool,
    binaryStarMode: PropTypes.bool
};

export default RatingStar;