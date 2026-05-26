import { LegacyRef, ReactNode } from "react";

export interface GridItemProps {
    layoutConfig: {
        i: string;
        x: number;
        y: number;
        w: number;
        h: number;
        minW?: number;
        minH?: number;
        maxW?: number;
        maxH?: number;
        static?: boolean;
    };
    children: ReactNode;
    customGridItemClassName?: string;
    gridRef?: LegacyRef<HTMLDivElement>;
    style?: any;
    className?: string;
    gridResizeBorderColor?: string;
    isDefaultEditable?: boolean;
    isResizable?: boolean;
    isDraggable?: boolean;
}