import { LegacyRef, ReactNode } from "react";
import ReactGridLayout from "react-grid-layout";

interface GridLayoutTypes {
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
}

export interface GridContainerIProps {
  gridLayouts: {
    lg?: Array<GridLayoutTypes>;
    md?: Array<GridLayoutTypes>;
    sm?: Array<GridLayoutTypes>;
    xs?: Array<GridLayoutTypes>;
    xxs?: Array<GridLayoutTypes>;
  };
  onLayoutChange: (
    currentLayout: ReactGridLayout.Layout[],
    allLayouts: ReactGridLayout.Layouts
  ) => void;
  children: ReactNode;
  isResizable?: boolean;
  onBreakpointChange?: (newBreakpoint: string, newCols: number) => void;
  isDraggable?: boolean;
  handleResizeStop?: ReactGridLayout.ItemCallback | undefined;
  handleOnDragStop?: ReactGridLayout.ItemCallback | undefined;
  handleOnResize?: ReactGridLayout.ItemCallback | undefined;
  handleOnDrag?: ReactGridLayout.ItemCallback | undefined;
  updatedRowHeight?: number;
  customMargin?: [number, number];
  customRowHeight?: number;
  customResizeHandles?: any[];
  customResizeHandleTemplate?: ReactNode;
  customBreakpoints?: {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    xxs?: number;
  };
  customCols?: {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    xxs?: number;
  };
}
