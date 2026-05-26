import React from "react";
import { Canvas } from "@grapesjs/react";
import style from "./editor-canvas.module.scss";
import { useComponentSelection } from "../../hooks/use-component-selection";
import CanvasShimmer from "../loaders/editor-shimmer";


interface EditorCanvasProps {
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    errorJSX?: React.ReactNode;
    loadingJSX?: React.ReactNode;
    emptyJSX?: React.ReactNode;
}

export default function EditorCanvas(props: EditorCanvasProps) {
    const { isLoading, isError, isEmpty, errorJSX, loadingJSX, emptyJSX } = props;
    const { isComponentSelected } = useComponentSelection();
    const showRightPanel = isComponentSelected;
    const noEditor = (isLoading || isError) ? "no-editor" : "";

    return (
        <div className={`editor-canvas template-editor-section ${noEditor ? `no-editor ${style?.["no-editor"]}` : ""} ${style?.["template-editor-section"]} ${showRightPanel ? "" : `template-wrap ${style?.["template-wrap"]}`}`}>
            {/* If error, show error state */}
            {isError ? (errorJSX ?? <div>Error loading editor</div>) : null}
            {/* If loading, show loading state */}
            {isLoading ? (loadingJSX ?? <CanvasShimmer />) : null}
            {/* If no data, show NoData component */}
            {isEmpty ? (emptyJSX ?? <div>No data available</div>) : null}
            {/* Editor canvas, this should not be conditionally rendered, only hidden */}
            <Canvas style={{ display: noEditor ? "none" : "" }} />
        </div>
    );
};

