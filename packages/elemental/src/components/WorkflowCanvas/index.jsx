import React, { useCallback, useMemo, memo } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    Panel,
    SelectionMode,
    Handle,
    EdgeLabelRenderer,
    getBezierPath,
    Position
} from '@xyflow/react';
import { useFlowLayout, useNodeClick } from './useFlowLayout';
import '@xyflow/react/dist/style.css';
import workflowStyle from "./WorkflowCanvas.module.scss";

// ============================================
// Default Styles
// ============================================

const defaultStyle = {
    width: '100%',
    height: '100%',
    background: '#F4F6F7',
};

// ============================================
// Default ReactFlow Props
// ============================================

const defaultReactFlowProps = {
    selectionMode: SelectionMode.Partial,
    nodesDraggable: false,
    nodesConnectable: false,
    deleteKeyCode: null,
    minZoom: 0.1,
    maxZoom: 2,
    panOnScroll: true,
    zoomOnScroll: false,
};

// ============================================
// Inner Component (must be inside ReactFlowProvider)
// ============================================

const FlowInner = memo(function FlowInner(props) {
    const {
        nodes,
        edges,
        layoutMode = "vertical",
        setNodes,
        layoutConfig,
        actionPanel,
        showActionPanel = false,
        panels = [],
        reactFlowProps = {},
        nodeClickConfig = {},
        selectedNodeId,
        fitViewConfig = {},
        invokeFitView = false,
        onFitViewComplete,
        newNodeCenterConfig = {},
        initialNonClickableNodeCenterConfig = {},
        nodeInternalsUpdateConfig = {},
        initialViewportConfig = {},
        style = {},
        className,
        getWrapperClassName,
        children,
    } = props;

    // Get computed wrapper class name
    const wrapperClassName = useMemo(() => {
        const base = className || '';
        const dynamic = getWrapperClassName?.({ isVertical: layoutMode === 'vertical' }) || '';
        return `${base ?? workflowStyle?.['flow-canvas-wrap']} ${dynamic}`.trim();
    }, [className, getWrapperClassName, layoutMode]);

    // Use the flow layout hook
    useFlowLayout({
        nodes,
        edges,
        layoutMode,
        setNodes,
        layoutConfig,
        fitViewConfig,
        newNodeCenterConfig: {
            ...newNodeCenterConfig,
            enabled: newNodeCenterConfig.enabled ?? true,
        },
        initialNonClickableNodeCenterConfig: {
            ...initialNonClickableNodeCenterConfig,
            enabled: initialNonClickableNodeCenterConfig.enabled ?? true,
        },
        nodeInternalsUpdateConfig,
        initialViewportConfig,
        invokeFitView,
        onFitViewComplete,
        selectedNodeId,
    });

    // Handle node click with centering
    const handleNodeClick = useNodeClick({
        ...nodeClickConfig,
        selectedNodeId,
    });

    // Memoize the combined click handler
    const onNodeClick = useCallback(
        (event, node) => {
            // Check custom skip conditions
            const { skipNodeTypes = [], shouldSkipClick } = nodeClickConfig;

            if (selectedNodeId === node.id) return;
            if (skipNodeTypes.includes(node.type)) return;
            if (shouldSkipClick?.(node)) return;

            // Call the provided onNodeClick handler
            const result = nodeClickConfig.onNodeClick?.(event, node);

            // If handler returns false, skip default centering
            if (result === false) return;

            // Default centering behavior
            handleNodeClick(event, node);
        },
        [handleNodeClick, nodeClickConfig, selectedNodeId]
    );

    // Merge ReactFlow props
    const mergedReactFlowProps = useMemo(
        () => ({
            ...defaultReactFlowProps,
            ...reactFlowProps,
            proOptions: reactFlowProps.proOptions ?? { hideAttribution: true },
        }),
        [reactFlowProps]
    );

    // Merge styles
    const mergedStyle = useMemo(
        () => ({ ...defaultStyle, ...style }),
        [style]
    );

    return (
        <div className={wrapperClassName}>
            {showActionPanel && actionPanel}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeClick={onNodeClick}
                style={mergedStyle}
                {...mergedReactFlowProps}
            />
            {panels.map((panel, index) => (
                panel.visible !== false && (
                    <Panel
                        key={`panel-${index}-${panel.position}`}
                        position={panel.position}
                        className={panel.className}
                    >
                        {panel.content}
                    </Panel>
                )
            ))}
            {children}
        </div>
    );
});

/**
 * Generic Flow Canvas component that wraps ReactFlow with automatic layout,
 * centering, and extensible panel support.
 * 
 * @example
 * ```tsx
 * <FlowCanvas
 *   nodes={nodes}
 *   edges={edges}
 *   layoutMode="horizontal"
 *   setNodes={setNodes}
 *   actionPanel={<MyActionPanel />}
 *   panels={[
 *     { position: 'top-right', content: <MyFilter /> }
 *   ]}
 *   reactFlowProps={{
 *     nodeTypes: myNodeTypes,
 *     edgeTypes: myEdgeTypes,
 *   }}
 * />
 * ```
 */
export const FlowCanvas = memo(function FlowCanvas(
    props
) {
    const { children, ...restProps } = props;

    return (
        <ReactFlowProvider>
            <FlowInner {...restProps}>{children}</FlowInner>
        </ReactFlowProvider>
    );
});

export default FlowCanvas;

export { Handle, EdgeLabelRenderer, Position, getBezierPath };
