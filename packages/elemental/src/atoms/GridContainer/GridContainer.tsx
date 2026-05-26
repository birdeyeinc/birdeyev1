import React from "react";
import { Responsive as ResponsiveReactGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useResizeDetector } from "react-resize-detector";
import { GridContainerIProps } from "./interface";
import ResizeHandler from "./ResizeHandler";
import "./GridContainer.scss";

export default function GridContainer(props: GridContainerIProps) {
  const {
    gridLayouts,
    children,
    isResizable = false,
    onBreakpointChange,
    onLayoutChange,
    isDraggable = false,
    handleResizeStop,
    handleOnDragStop,
    handleOnResize,
    handleOnDrag,
    customRowHeight,
    customMargin = [20, 20],
    customResizeHandles = ["e", "s", "w", "ne", "se", "sw", "nw"],
    customBreakpoints = {
      lg: 1280,
      md: 686,
      sm: 458,
      xs: 458,
      xxs: 0,
    },
    customCols = {
      lg: 12,
      md: 6,
      sm: 6,
      xs: 6,
      xxs: 6,
    },
  } = props;

  const { width = 0, ref } = useResizeDetector();

  return (
    <ResponsiveReactGridLayout
      className="main__grid__container__wrapper"
      cols={customCols}
      breakpoints={customBreakpoints}
      layouts={gridLayouts}
      isResizable={isResizable}
      margin={customMargin}
      onBreakpointChange={onBreakpointChange}
      width={Math.floor(width)}
      isDraggable={isDraggable}
      rowHeight={customRowHeight}
      draggableHandle={".el-gridcontainer-item-drag-handle"}
      resizeHandles={customResizeHandles}
      resizeHandle={ResizeHandler}
      onLayoutChange={onLayoutChange}
      onResizeStop={handleResizeStop}
      onDragStop={handleOnDragStop}
      onResize={handleOnResize}
      onDrag={handleOnDrag}
      innerRef={ref}
    >
      {children}
    </ResponsiveReactGridLayout>
  );
}
