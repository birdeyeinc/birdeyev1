import { useCallback, useRef, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { layoutVerticalTree } from './layoutEngine/layoutVertical';
import { layoutHorizontalTree } from './layoutEngine/layoutHorizontal';

// ============================================
// Layout Comparison Utility
// ============================================

const almostEq = (a, b, eps = 0.5) => Math.abs(a - b) < eps;

/**
 * Compare two nodes' layout-relevant properties.
 */
const sameLayout = (a, b) => {
  if (!almostEq(a.position?.x ?? 0, b.position?.x ?? 0)) return false;
  if (!almostEq(a.position?.y ?? 0, b.position?.y ?? 0)) return false;
  if (a.sourcePosition !== b.sourcePosition) return false;
  if (a.targetPosition !== b.targetPosition) return false;
  if (a.data?.__sp !== b.data?.__sp) return false;
  if (a.data?.__tp !== b.data?.__tp) return false;
  return true;
};

// ============================================
// Main Hook
// ============================================

export function useFlowLayout(options) {
  const {
    nodes,
    edges,
    layoutMode,
    setNodes,
    layoutConfig,
    fitViewConfig = {},
    newNodeCenterConfig = {},
    initialNonClickableNodeCenterConfig = {},
    nodeInternalsUpdateConfig = {},
    initialViewportConfig = {},
    invokeFitView = false,
    onFitViewComplete,
    onLayoutComplete,
    selectedNodeId,
  } = options;

  const rf = useReactFlow();
  const didInitialFit = useRef(false);
  const centeredRef = useRef(new Set());
  const isVertical = layoutMode === 'vertical';
  const initialViewportDone = useRef(false);
  const invokeFitViewRef = useRef(invokeFitView);
  invokeFitViewRef.current = invokeFitView;

  // Resolve fit view padding
  const getFitViewPadding = useCallback(() => {
    const { padding } = fitViewConfig;
    if (typeof padding === 'function') {
      return padding(layoutMode);
    }
    if (typeof padding === 'number') {
      return padding;
    }
    return isVertical ? 0.4 : 0;
  }, [fitViewConfig, layoutMode, isVertical]);

  // Memoized fit view function
  const fitViewFn = useCallback(() => {
    try {
      rf.fitView({
        duration: fitViewConfig.duration ?? 400,
        padding: getFitViewPadding(),
        maxZoom: fitViewConfig.maxZoom ?? 1,
        minZoom: fitViewConfig.minZoom,
      });
    } catch {
      // Silently ignore fitView errors
    }
  }, [rf, fitViewConfig, getFitViewPadding]);

  // Center viewport on first N nodes at 100% zoom (used on initial workflow load)
  const setInitialViewport = useCallback(() => {
    const currentNodes = rf.getNodes?.() || [];
    if (!currentNodes.length) return;

    const sorted = [...currentNodes].sort((a, b) =>
      isVertical
        ? (a.position?.y ?? 0) - (b.position?.y ?? 0)
        : (a.position?.x ?? 0) - (b.position?.x ?? 0)
    );

    const nodeCount = initialViewportConfig.nodeCount ?? 3;
    const targetNodes = sorted.slice(0, Math.min(nodeCount, sorted.length));

    const avgX = targetNodes.reduce((sum, n) => sum + (n.position?.x ?? 0) + ((n.width ?? 0) / 2), 0) / targetNodes.length;
    const avgY = targetNodes.reduce((sum, n) => sum + (n.position?.y ?? 0) + ((n.height ?? 0) / 2), 0) / targetNodes.length;
    const shiftX = initialViewportConfig.horizontalOffset ?? 200;
    const shiftY = initialViewportConfig.verticalOffset ?? 0;

    try {
      rf.setCenter(avgX + shiftX, avgY + shiftY, {
        duration: initialViewportConfig.duration ?? 400,
        zoom: initialViewportConfig.zoom ?? 1,
      });
    } catch {}
  }, [rf, isVertical, initialViewportConfig]);

  // Memoized layout function
  const measureAndLayout = useCallback(
    async (nodesIn, edgesIn) => {
      // Get measured sizes from ReactFlow
      const measured = rf.getNodes?.() || [];
      const sizeMap = new Map(
        measured.map((m) => [m.id, { width: m.width, height: m.height }])
      );

      // Apply measured sizes to nodes
      const nodesWithSizes = nodesIn.map((n) => {
        const s = sizeMap.get(n.id);
        return s ? { ...n, width: s.width, height: s.height } : n;
      });

      const res = isVertical
        ? layoutVerticalTree(nodesWithSizes, edgesIn)
        : layoutHorizontalTree(nodesWithSizes, edgesIn);

      const resMap = new Map(res.nodes.map((nn) => [nn.id, nn]));

      // Check if any changes are needed
      let anyChanged = false;
      for (const n of nodesIn) {
        const next = resMap.get(n.id);
        if (!next) continue;
        if (!sameLayout(n, next)) {
          anyChanged = true;
          break;
        }
      }

      // Update nodes if changed
      if (anyChanged && setNodes) {
        setNodes((prev) =>
          prev.map((n) => {
            const next = resMap.get(n.id);
            if (!next || sameLayout(n, next)) return n;
            return {
              ...n,
              position: next.position,
              sourcePosition: next.sourcePosition,
              targetPosition: next.targetPosition,
              data: { ...n.data, ...next.data },
            };
          })
        );

        onLayoutComplete?.(res.nodes, res.edges);
      }

      return anyChanged;
    },
    [
      rf,
      setNodes,
      isVertical,
      layoutConfig,
      onLayoutComplete,
    ]
  );

  // Auto-layout on graph change
  useEffect(() => {
    if (!nodes.length) return;

    const run = async () => {
      const changedNow = await measureAndLayout(nodes, edges);
      
      if (changedNow && !didInitialFit.current && !invokeFitViewRef.current) {
        requestAnimationFrame(() => {
          if (initialViewportConfig?.enabled) {
            if (!initialViewportDone.current) {
              setInitialViewport();
              initialViewportDone.current = true;
            }
            // If already done, skip — don't override with fitView
          } else {
            try { fitViewFn(); } catch {}
          }
        });
      }

      // One-frame-later re-measure pass
      if (!didInitialFit.current) {
        requestAnimationFrame(async () => {
          const changedLater = await measureAndLayout(nodes, edges);
          if (changedLater && !didInitialFit.current && !invokeFitViewRef.current) {
            requestAnimationFrame(() => {
              if (initialViewportConfig?.enabled) {
                if (!initialViewportDone.current) {
                  setInitialViewport();
                  initialViewportDone.current = true;
                }
                // If already done, skip — don't override with fitView
              } else {
                try { fitViewFn(); } catch {}
              }
              didInitialFit.current = true;
            });
          } else if (!didInitialFit.current) {
            // No layout changes detected — still need initial viewport if enabled
            if (initialViewportConfig?.enabled && !initialViewportDone.current) {
              requestAnimationFrame(() => {
                setInitialViewport();
                initialViewportDone.current = true;
              });
            }
            didInitialFit.current = true;
          }
        });
      }
    };

    run();
  }, [nodes, edges.length, measureAndLayout, fitViewFn]);

  // Handle external invokeFitView trigger
  useEffect(() => {
    if (!invokeFitView) return;

    requestAnimationFrame(() => {
      measureAndLayout(nodes, edges).finally(() => {
        requestAnimationFrame(() => {
          if (initialViewportConfig?.enabled && !initialViewportDone.current) {
            setInitialViewport();
            initialViewportDone.current = true;
            didInitialFit.current = true;
          } else {
            try {
              fitViewFn();
            } catch {}
          }
          onFitViewComplete?.();
        });
      });
    });
  }, [invokeFitView, nodes, edges, measureAndLayout, fitViewFn, onFitViewComplete, initialViewportConfig, setInitialViewport]);

  // Update node internals when layout mode changes
  useEffect(() => {
    if (!nodeInternalsUpdateConfig.enabled) return;

    const nodeTypes = nodeInternalsUpdateConfig.nodeTypes || [];
    const ids = nodes
      .filter((n) => nodeTypes.includes(n.type))
      .map((n) => n.id);

    if (!ids.length) return;

    requestAnimationFrame(() => {
      ids.forEach((id) => {
        try {
          rf.updateNodeInternals?.(id);
        } catch {}
      });
    });
  }, [layoutMode, nodes.length, rf, nodeInternalsUpdateConfig]);

  // Auto-center start non-clickable nodes
  useEffect(() => {
    const current = initialNonClickableNodeCenterConfig.nonClickableNodeData;
    if (!current?.data?.triggerType && initialNonClickableNodeCenterConfig.enabled) {
      const horizontalOffset = initialNonClickableNodeCenterConfig.horizontalOffset ?? 200;
      const verticalOffset = initialNonClickableNodeCenterConfig.verticalOffset ?? 70;
      try {
        rf.setCenter(
          current.position.x + horizontalOffset,
          current.position.y + verticalOffset,
          {
            duration: initialNonClickableNodeCenterConfig.duration ?? 400,
            zoom: initialNonClickableNodeCenterConfig.zoom ?? 1,
          }
        );
      } catch {}
    }
  }, [initialNonClickableNodeCenterConfig]);

  // Auto-center newly added nodes
  useEffect(() => {
    if (!nodes.length) return;
    if (!newNodeCenterConfig.enabled) return;

    const centered = centeredRef.current;
    const skipTypes = newNodeCenterConfig.skipNodeTypes || [];
    const isNewNodeFn = newNodeCenterConfig.isNewNode || 
      ((n) => n.data?.__isNew && !n.data?.fromAI);

    const newNode = nodes.find(
      (n) =>
        isNewNodeFn(n) &&
        !centered.has(n.id) &&
        !skipTypes.includes(n.type)
    );

    if (!newNode) return;

    requestAnimationFrame(() => {
      const current = rf.getNode?.(newNode.id) || newNode;
      const horizontalOffset = newNodeCenterConfig.horizontalOffset ?? 400;
      const verticalOffset = newNodeCenterConfig.verticalOffset ?? (selectedNodeId ? 70 : 100);

      try {
        rf.setCenter(
          current.position.x + horizontalOffset,
          current.position.y + verticalOffset,
          {
            duration: newNodeCenterConfig.duration ?? 400,
            zoom: newNodeCenterConfig.zoom ?? 1,
          }
        );
      } catch {}

      centered.add(newNode.id);
    });
  }, [nodes, rf, selectedNodeId, newNodeCenterConfig]);

  // Trigger manual fit view
  const triggerFitView = useCallback(() => {
    requestAnimationFrame(() => {
      fitViewFn();
    });
  }, [fitViewFn]);

  return {
    triggerFitView
  };
}

// ============================================
// Additional Hooks
// ============================================

/**
 * Hook to handle node click with optional centering behavior.
 */

export function useNodeClick(options = {}) {
  const {
    horizontalOffset = 200,
    verticalOffset: defaultVerticalOffset = 100,
    centerDuration = 400,
    centerZoom = 1,
    skipNodeTypes = [],
    shouldSkipClick,
    selectedNodeId,
    onNodeClick,
  } = options;

  const rf = useReactFlow();

  const handleNodeClick = useCallback(
    (event, node) => {
      // Skip if already selected
      if (selectedNodeId === node.id) return;

      // Skip based on node type
      if (skipNodeTypes.includes(node.type)) return;

      // Skip based on custom condition
      if (shouldSkipClick?.(node)) return;

      // Call custom handler
      onNodeClick?.(event, node);

      // Calculate vertical offset
      const verticalOffset = selectedNodeId ? 70 : defaultVerticalOffset;

      // Center on node after next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const current = rf.getNode?.(node.id) || node;
          try {
            rf.setCenter(
              current.position.x + horizontalOffset,
              current.position.y + verticalOffset,
              { duration: centerDuration, zoom: centerZoom }
            );
          } catch {}
        });
      });
    },
    [
      rf,
      selectedNodeId,
      horizontalOffset,
      defaultVerticalOffset,
      centerDuration,
      centerZoom,
      skipNodeTypes,
      shouldSkipClick,
      onNodeClick,
    ]
  );

  return handleNodeClick;
}
