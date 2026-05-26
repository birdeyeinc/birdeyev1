import React, { useRef, useEffect } from "react";
import style from "./block-item.module.scss";

interface BlockItemProps {
    item: any;
    dragStart: (item: any, event: DragEvent) => void;
    dragStop: (isDropped: boolean) => void;
}

export default function BlockItem({ item, dragStart, dragStop }: BlockItemProps) {
    const blockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const block = blockRef.current;
        if (!block) return;

        function handleDragStart() {
            block?.classList?.add("dragging");
        }

        function handleDragEnd() {
            block?.classList?.remove("dragging");
        }

        block?.addEventListener("dragstart", handleDragStart);
        block?.addEventListener("dragend", handleDragEnd);

        return () => {
            block?.removeEventListener("dragstart", handleDragStart);
            block?.removeEventListener("dragend", handleDragEnd);
        };
    }, []);

    return (
        <div
            ref={blockRef}
            className={`block-item content-block ${style?.["content-block"]}`}
            draggable
            onDragStart={ev => dragStart(item, ev.nativeEvent)}
            onDragEnd={() => dragStop(false)}
        >
            <i className="block-handle icon_phoenix-dots-lining" />
            <div className={`block-icon content-icon ${style?.["content-icon"]}`}>
                <i className={item?.getMedia()} />
            </div>
            <span className="block-label">{item?.getLabel()}</span>
        </div>
    );
}