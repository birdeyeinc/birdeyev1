import React from 'react';
import { Handle } from "components/WorkflowCanvas";

const BaseNode = (props) => {
    const { containerRef, containerClassname, onMouseLeaveContainer, isLoading = false, nodeDataConfig = { defaultStateJSX: null, loadingStateJSX: null, customJSX: null, className: "" }, sourceHandleData = [], targetHandlePosition } = props;
    return (
        <div ref={containerRef} className={containerClassname} onMouseLeave={onMouseLeaveContainer}>
            {isLoading ?
                nodeDataConfig.loadingStateJSX :
                <>
                    <div className={nodeDataConfig.className}>
                        {nodeDataConfig.defaultStateJSX}
                    </div>
                    {nodeDataConfig.customJSX}
                </>
            }
            {sourceHandleData.map((handleData, index) => (
                <Handle
                    key={`source-handle-${index}`}
                    type="source"
                    style={{ visibility: "hidden", ...(handleData.style ?? {}) }}
                    id={handleData.id}
                    position={handleData.position}
                />
            ))}
            {targetHandlePosition && <Handle type="target" position={targetHandlePosition} style={{ visibility: "hidden" }} />}
        </div>
    );
};

export default BaseNode;