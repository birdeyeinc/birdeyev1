import React, { useState, useCallback } from 'react';
import { FlowCanvas, Position, getBezierPath } from '../index.jsx';
import ZoomPopover from './ZoomPopover.jsx';
import BaseNode from './BaseNode.jsx';
import BaseEdge from './BaseEdge.jsx';
import style from '../WorkflowCanvas.module.scss';

// ============================================
// Custom Node using BaseNode Component
// ============================================

const CustomBaseNode = ({ data, selected }) => {
    const nodeDataConfig = {
        defaultStateJSX: (
            <>
                <div style={{ fontWeight: 500, fontSize: '14px', color: '#333' }}>
                    {data.label}
                </div>
                {data.description && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {data.description}
                    </div>
                )}
            </>
        ),
        loadingStateJSX: <div>Loading...</div>,
        className: '',
    };

    const sourceHandleData = [
        { id: 'source-bottom', position: data.__sp || Position.Bottom, style: { visibility: 'hidden' } }
    ];

    return (
        <BaseNode
            containerClassname={`custom-base-node ${selected ? 'selected' : ''}`}
            nodeDataConfig={nodeDataConfig}
            sourceHandleData={sourceHandleData}
            targetHandlePosition={data.__tp || Position.Top}
            isLoading={false}
        />
    );
};

// ============================================
// Custom Edge using BaseEdge Component
// ============================================

const CustomBaseEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style: edgeStyle }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const pathStyle = {
        stroke: edgeStyle?.stroke || '#2652ED',
        strokeWidth: edgeStyle?.strokeWidth || 2,
        fill: 'none',
    };

    const edgeLabelConfig = {
        customJSX: (
            <div
                style={{
                    position: 'absolute',
                    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY-35}px)`,
                    pointerEvents: 'all',
                }}
            >
                <span style={{
                    background: '#fff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: '#666',
                    border: '1px solid #e0e0e0',
                }}>
                    connected
                </span>
            </div>
        ),
        isLoading: false,
        addButtonStyle: {
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`
        }
    };

    return (
        <BaseEdge
            pathData={edgePath}
            pathStyle={pathStyle}
            invisiblePathDropConfig={{ isDraggingNode: false, strokeWidth: 20 }}
            edgeLabelConfig={edgeLabelConfig}
        />
    );
};

// ============================================
// Node and Edge Types Configuration
// ============================================

const nodeTypes = {
    baseNode: CustomBaseNode,
};

const edgeTypes = {
    baseEdge: CustomBaseEdge,
};

// ============================================
// Initial Nodes and Edges
// ============================================

const initialNodes = [
    {
        id: 'node-1',
        type: 'baseNode',
        position: { x: 0, y: 0 },
        data: {
            label: 'Start Node',
            description: 'starting...',
        },
    },
    {
        id: 'node-2',
        type: 'baseNode',
        position: { x: 0, y: 150 },
        data: {
            label: 'End Node',
            description: '...ending',
        },
    },
];

const initialEdges = [
    {
        id: 'edge-1-2',
        source: 'node-1',
        target: 'node-2',
        type: 'baseEdge',
        style: { stroke: '#2652ED', strokeWidth: 2 },
    },
];

// ============================================
// Example Component for MDX Documentation
// ============================================

export const WorkflowCanvasExample = ({ layoutMode }) => {
    const [nodes, setNodes] = useState(initialNodes);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [isZoomPopoverOpen, setIsZoomPopoverOpen] = useState(false);

    const handleZoomPopover = useCallback(() => {
        setIsZoomPopoverOpen((prev) => !prev);
    }, []);

    const handleZoomCallback = useCallback(() => {
        setIsZoomPopoverOpen(false);
    }, []);

    const handleNodeClick = useCallback((event, node) => {
        setSelectedNodeId(node.id);
    }, []);

    return (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <FlowCanvas
                nodes={nodes}
                edges={initialEdges}
                setNodes={setNodes}
                layoutMode={layoutMode}
                invokeFitView={true}
                selectedNodeId={selectedNodeId}
                nodeClickConfig={{
                    onNodeClick: handleNodeClick,
                }}
                reactFlowProps={{
                    nodeTypes,
                    edgeTypes,
                }}
                fitViewConfig={{
                    duration: 400,
                    padding: 0.2,
                    maxZoom: 1,
                }}
                panels={[
                    {
                        position: 'top-right',
                        visible: true,
                        content: (
                            <ZoomPopover
                                isOpen={isZoomPopoverOpen}
                                handleZoomPopover={handleZoomPopover}
                                handleZoomCallback={handleZoomCallback}
                                isVertical={true}
                            />
                        ),
                    },
                ]}
                className={style?.['flow-canvas-wrap']}
            />
        </div>
    );
};

export default WorkflowCanvasExample;
