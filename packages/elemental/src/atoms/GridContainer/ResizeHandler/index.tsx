import React from "react";
import styles from './ResizeHandler.module.scss';
import ResizeIcon from "./icons/ResizeIcon";
import ResizeBoxIcon from "./icons/ResizeBoxIcon";

export default function ResizeHandler(resizeHandleAxis: string,
    ref?: React.LegacyRef<HTMLSpanElement>) {
    return (
        <span
            className={`${styles['resizable-handler']} react-resizable-handle ${styles[`resize-handle-axis-${resizeHandleAxis}`]}`}
            ref={ref}
        >
            {resizeHandleAxis === "se" ? (
                <span className={`${styles['resize-icon-se-placeholder-container']} resize-icon-se-placeholder`}>
                    <ResizeIcon />
                </span>
            ) : null}
            <ResizeBoxIcon />
        </span>
    );
}
