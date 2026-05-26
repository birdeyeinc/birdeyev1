import React from "react";
import styles from "./editor-shimmer.module.scss";

const CanvasShimmer = () => {
    const shimmerArray = Array.from({ length: 3 }, (_, index) => index);
    const buttonArray = Array.from({ length: 2 }, (_, index) => index);
    
    return (
    <div className={`canvas-shimmer grapes-shimmer-wrapper ${styles?.["grapes-shimmer-wrapper"]}`}>
        <div className={`template-header glare-transition mb-30 ${styles?.["template-header"]} ${styles?.["glare-transition"]} `}></div>
        <div className={`template-img glare-transition mb-50 ${styles?.["template-img"]} ${styles?.["glare-transition"]} `}></div>
        <div className="mb-35">
            {shimmerArray.map((_, id) => (
                <div key={id} className={`template-wrap glare-transition mb-12 ${styles?.["template-wrap"]} ${styles?.["glare-transition"]} `}></div>
            ))}
        </div>
        <div className="display-flex">
            {buttonArray.map((_, id) => (
                <div className={`template-button glare-transition mr-15 ${styles?.["template-button"]} ${styles?.["glare-transition"]}`}></div>
            ))}
        </div>
    </div>
    );
}
export default CanvasShimmer;