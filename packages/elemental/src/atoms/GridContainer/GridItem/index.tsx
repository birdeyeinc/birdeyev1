import React, { ForwardedRef, forwardRef, useEffect, useState } from "react";
import styles from './GridItem.module.scss';
import useClickOutside from "utils/hooks/useClickOutside.js";
import DragIcon from "./icons/DragIcon";
import { GridItemProps } from "./interface";

const GridItem = (props: GridItemProps) => {
    const {
        style,
        className,
        children,
        gridRef,
        gridResizeBorderColor = '#2652ED',
        layoutConfig,
        customGridItemClassName = '',
        isDefaultEditable = false,
        isResizable = false,
        isDraggable = false,
        ...rest
    } = props;
    const [activeResizeEle, setActiveResizeEle] = useState<HTMLDivElement>();
    const { ref, isComponentVisible, setIsComponentVisible } = useClickOutside(false, gridRef);

    useEffect(() => {
        if (isDefaultEditable && ref?.current) {
            setTimeout(() => {
                ref?.current?.click();
            }, 100);
        }
    }, [ref]);

    useEffect(() => {
        if (!activeResizeEle || isComponentVisible) return;
        activeResizeEle.style.border = `2px dashed rgba(0, 0, 0, 0)`;
        const resizeEle = activeResizeEle?.getElementsByClassName("react-resizable-handle") as HTMLCollectionOf<HTMLSpanElement>;
        const placeHolderEle: HTMLSpanElement = activeResizeEle?.querySelector(".resize-icon-se-placeholder") as HTMLSpanElement;
        if (placeHolderEle) {
            placeHolderEle.style.display = "none";
        }
        if (resizeEle?.length) {
            Array.from(resizeEle).forEach((item: HTMLSpanElement) => {
                item.style.display = "none";
            });
            setActiveResizeEle(undefined);
            setIsComponentVisible(false);
        }
    }, [activeResizeEle, isComponentVisible]);

    const displayResizeHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isResizable || activeResizeEle) return;
        setActiveResizeEle(event.currentTarget);
        setIsComponentVisible(true);
        if (event) {
            event.currentTarget.style.border = `2px dashed ${gridResizeBorderColor}`;
        }
        const resizeEle = event?.currentTarget?.getElementsByClassName("react-resizable-handle") as HTMLCollectionOf<HTMLSpanElement>;
        const placeHolderEle = event?.currentTarget?.querySelector(".resize-icon-se-placeholder") as HTMLSpanElement;
        if (placeHolderEle) {
            placeHolderEle.style.display = "block";
        }
        if (resizeEle?.length) {
            Array.from(resizeEle).forEach((item) => {
                item.style.display = "block";
            });
        }
    };

    return (
        <div
            id={layoutConfig?.i}
            style={{ ...style }}
            className={`el-gridcontainer-grid-item-wrapper ${className} ${styles['grid-item-wrapper']} ${customGridItemClassName}`}
            ref={ref}
            onClick={displayResizeHandler}
            data-grid={layoutConfig}
            {...rest}
        >
            {children}
            {isDraggable ? <DragIcon className={`${styles['grid-item-drag-handle']} el-gridcontainer-item-drag-handle`} /> : null}
        </div>
    );
};


export default forwardRef((props: GridItemProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <GridItem {...props} gridRef={ref} />;
});
