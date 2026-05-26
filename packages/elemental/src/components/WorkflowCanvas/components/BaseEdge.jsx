import React from 'react';
import { EdgeLabelRenderer } from "components/WorkflowCanvas";
import addBtn from "../images/add-btn.svg";
import blueBtn from "../images/blue-btn.svg";

const BaseEdge = (props) => {
    const { pathData, pathStyle, invisiblePathDropConfig, edgeLabelConfig } = props;
    const { isDraggingNode = false, strokeWidth = 0, handleDragOver, handleDragLeave, handleDrop } = invisiblePathDropConfig || {};
    const { customJSX = null, isLoading = false, addButtonStyle } = edgeLabelConfig || {};
    return (
        <>
            <g>
                {/* Visible edge path */}
                <path
                    className="react-flow__edge-path"
                    d={pathData}
                    style={{ ...pathStyle, pointerEvents: 'none' }}
                />
                {/* Invisible wider path to make dragging easier */}
                <g style={{ pointerEvents: isDraggingNode ? 'auto' : 'none' }}>
                    <path
                        d={pathData}
                        style={{
                            strokeWidth,
                            stroke: 'transparent',
                            fill: 'none',
                            pointerEvents: isDraggingNode ? 'auto' : 'none',
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    />
                </g>
            </g>
            <EdgeLabelRenderer>
                {customJSX}
                {isLoading ? null :
                    <span className="add-button" style={addButtonStyle}>
                        {isDraggingNode ?
                            <img src={blueBtn} />
                            : <img src={addBtn} />}
                    </span>
                }
            </EdgeLabelRenderer>
        </>
    );
};

export default BaseEdge;