import React, { useRef } from "react";
import { BlocksResultProps } from '@grapesjs/react';
import style from "./block-manager.module.scss";
import BlockItem from "./block-item";


export type CustomBlockManagerProps = Pick<BlocksResultProps, 'mapCategoryBlocks' | 'dragStart' | 'dragStop' | "blocks">;

export default function BlockManager({ dragStart, dragStop, blocks }: CustomBlockManagerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className={`block-manager content-manager-section ${style?.["content-manager-section"]}`}>
            <div className={`content-manage-wrap display-flex display-flex-center ${style?.["content-manage-wrap"]}`} ref={containerRef}>
                {blocks?.map((item) => (
                    <BlockItem item={item} dragStart={dragStart} dragStop={dragStop} key={item?.id} />
                ))}
            </div>
        </div>
    );
}
