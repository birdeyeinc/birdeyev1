import dagre from '@dagrejs/dagre';
import { Position } from '@xyflow/react';

/**
 * Vertical (top-to-bottom) layout. Layered DAG via dagre's Sugiyama implementation,
 * supporting nodes with multiple incoming edges (implicit merge) and parallel branch
 * lanes that reconnect into a shared continuation. Mirrors `layoutHorizontal.js` for
 * consistency, transposed for `rankdir: 'TB'`.
 */

const LAYOUT_CFG = {
  MIN_BASE_WIDTH: 410,
  MIN_BASE_HEIGHT: 85,
  CONDITION_EXTRA_WIDTH: 40,
  NODE_EXTRA_WIDTH: 20,
  CONDITION_BASE_HEIGHT: 58,
  CONDITION_BRANCH_INCREMENT: 22,
  // Min visible clearance during post-process collision resolution
  MIN_HORIZONTAL_GAP: 24,
  MIN_VERTICAL_GAP: 80,
  // Safety multiplier when converting node size -> dagre separation
  SEP_SAFETY_FACTOR: 0.5,
  MAX_COLLISION_RESOLUTION_PASSES: 5,
  VERTICAL_OVERLAP_TOLERANCE: 12,
};

// Cache for layout calculations to minimize re-renders
const layoutCache = new Map();

// Cache key includes in-degree topology so adding/removing a merge edge
// invalidates the entry. Ordered branch ids included so visual lane order
// changes also invalidate. Filter payloads excluded — they don't affect geometry.
function generateCacheKey(nodes, edges) {
  const inDeg = new Map();
  for (const n of nodes) inDeg.set(n.id, 0);
  for (const e of edges) {
    if (e.source && e.target) {
      inDeg.set(e.target, (inDeg.get(e.target) || 0) + 1);
    }
  }
  let multiParentCount = 0;
  for (const v of inDeg.values()) if (v > 1) multiParentCount += 1;

  const nodeShapeParts = nodes
    .map((n) => {
      const branches = Array.isArray(n.data?.branches) ? n.data.branches : [];
      const orderedIds = branches.slice(0, 12).map((b) => b.id).join('>');
      const isAbTestEnable = n.data?.abTestEnable;
      const abTestTemplatesLength = isAbTestEnable
        ? (n.data?.templateDistributions?.length || 0)
        : 0;
      const analyticsLength = isAbTestEnable && n.data?.analytics?.templates?.length
        ? (n.data?.analytics?.templates[0]?.metrics?.length || 0) * abTestTemplatesLength
        : (n.data?.analytics?.length ?? 0);
      const inD = inDeg.get(n.id) || 0;
      const isNewNode = n.data?.__isNew ? 1 : 0;
      const nodeDescriptionLength = n.data?.description?.length || 0;

      return `${n.id}:bc${branches.length}:${orderedIds}:rt:${analyticsLength}:ab:${abTestTemplatesLength}:in${inD}:new${isNewNode}:desc${nodeDescriptionLength}`;
    })
    .sort()
    .join(',');
  const edgeIds = edges.map((e) => `${e.source}-${e.target}`).sort().join(',');
  return `${nodeShapeParts}|${edgeIds}|mp${multiParentCount}`;
}

// Merge layout metadata from a cached layout node onto the live node without
// clobbering deep data structures (e.g. branches.filters).
function mergeLayoutMeta(current, layoutNode) {
  const layoutData = layoutNode.data || {};
  const curData = current.data || {};
  return {
    ...current,
    position: { ...layoutNode.position },
    sourcePosition: layoutNode.sourcePosition || current.sourcePosition,
    targetPosition: layoutNode.targetPosition || current.targetPosition,
    data: {
      ...curData,
      __tp: layoutData.__tp,
      __sp: layoutData.__sp,
      __level: layoutData.__level,
      __subtreeSize: layoutData.__subtreeSize,
    },
  };
}

export function clearLayoutCache() {
  layoutCache.clear();
}

// Default size estimator. Nodes carrying `data.branches` are treated as branch
// conditions even if `n.type` differs — preserves prior behavior.
function defaultNodeSizeEstimator(node) {
  const isAgentNode = node.data?.goals && node.data?.outcomes;
  const baseWidth = Math.max(LAYOUT_CFG.MIN_BASE_WIDTH, node.width || node.measured?.width || 0);
  const baseHeight = isAgentNode ? 74 : Math.max(LAYOUT_CFG.MIN_BASE_HEIGHT, node.height || node.measured?.height || 0);
  const branches = Array.isArray(node?.data?.branches) ? node.data.branches : [];
  const isCondition = !!node.data?.branches;
  const isAbTestEnable = node.data?.abTestEnable;
  const abTestTemplatesLength = isAbTestEnable
    ? (node.data?.templateDistributions?.length || 0)
    : 0;
  const analyticsLength = isAbTestEnable && node.data?.analytics?.templates?.length
    ? (node.data?.analytics?.templates[0]?.metrics?.length || 0) * abTestTemplatesLength
    : (node.data?.analytics?.length ?? 0);
  const isNewNode = !!node.data?.__isNew;
  const descriptionLiner = node.data?.description?.length ? Math.round(node.data.description.substring(0, 150).length / 50) : 0;

  if (isCondition) {
    return {
      width: baseWidth + LAYOUT_CFG.CONDITION_EXTRA_WIDTH,
      height: Math.max(
        baseHeight,
        LAYOUT_CFG.CONDITION_BASE_HEIGHT
          + Math.max(0, branches.length - 1) * LAYOUT_CFG.CONDITION_BRANCH_INCREMENT
          + (isNewNode ? 70 : 0) + (descriptionLiner * 16),
      ),
    };
  }
  return {
    width: baseWidth + LAYOUT_CFG.NODE_EXTRA_WIDTH,
    height: baseHeight + analyticsLength * 35 + abTestTemplatesLength * 50 + (isNewNode ? 70 : 0) + (descriptionLiner * 16),
  };
}

/**
 * Post-process pass to resolve residual horizontal collisions WITHIN the same
 * rank after dagre layout. DAG-aware: subtree shifts stop at merge nodes
 * (in-degree > 1) so a lane shift never drags shared continuation nodes.
 */
function resolveHorizontalCollisions(nodes, edges, sizeMap, minGap) {
  if (!nodes.length) return;
  const outEdges = new Map();
  const inDeg = new Map();
  for (const n of nodes) inDeg.set(n.id, 0);
  for (const e of edges) {
    if (!e.source || !e.target) continue;
    if (!outEdges.has(e.source)) outEdges.set(e.source, []);
    outEdges.get(e.source).push(e.target);
    inDeg.set(e.target, (inDeg.get(e.target) || 0) + 1);
  }

  const collectSubtree = (rootId) => {
    const visited = new Set();
    const stack = [rootId];
    while (stack.length) {
      const cur = stack.pop();
      if (visited.has(cur)) continue;
      visited.add(cur);
      for (const t of outEdges.get(cur) || []) {
        if ((inDeg.get(t) || 0) <= 1) stack.push(t);
      }
    }
    return visited;
  };

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const getBBox = (n) => {
    const sz = sizeMap.get(n.id);
    return { x: n.position.x, y: n.position.y, w: sz.width, h: sz.height };
  };

  for (let pass = 0; pass < LAYOUT_CFG.MAX_COLLISION_RESOLUTION_PASSES; pass++) {
    let shifted = false;
    const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x);
    for (let i = 0; i < sorted.length; i++) {
      const a = sorted[i];
      const bbA = getBBox(a);
      const aRight = bbA.x + bbA.w;
      for (let j = i + 1; j < sorted.length; j++) {
        const b = sorted[j];
        const bbB = getBBox(b);
        if (bbB.x >= aRight + minGap) break;
        const horizOverlap = bbB.x < aRight && (bbB.x + bbB.w) > bbA.x;
        if (!horizOverlap) continue;
        const yOverlap = Math.min(bbA.y + bbA.h, bbB.y + bbB.h) - Math.max(bbA.y, bbB.y);
        if (yOverlap < LAYOUT_CFG.VERTICAL_OVERLAP_TOLERANCE) continue;
        const desiredLeft = aRight + minGap;
        const dx = desiredLeft - bbB.x;
        if (dx <= 0) continue;
        const subtree = collectSubtree(b.id);
        for (const id of subtree) {
          const n = nodeMap.get(id);
          if (n) n.position = { ...n.position, x: n.position.x + dx };
        }
        shifted = true;
      }
    }
    if (!shifted) break;
  }
}

export function layoutVerticalTree(nodes, edges, options = {}) {
  const {
    nodeSizeEstimator,
    branchType = 'branchcondition',
    cacheKeyGenerator = generateCacheKey,
  } = options;

  const inNodes = Array.isArray(nodes) ? nodes : [];
  const inEdges = Array.isArray(edges) ? edges : [];

  if (!inNodes.length) {
    return { nodes: [], edges: [] };
  }

  const cacheKey = cacheKeyGenerator(inNodes, inEdges);
  if (layoutCache.has(cacheKey)) {
    const cached = layoutCache.get(cacheKey);
    const cachedMap = new Map(cached.nodes.map((n) => [n.id, n]));
    const merged = inNodes.map((n) => {
      const ln = cachedMap.get(n.id);
      return ln ? mergeLayoutMeta(n, ln) : n;
    });
    return { nodes: merged, edges: inEdges };
  }

  const estimateNodeSize = nodeSizeEstimator || defaultNodeSizeEstimator;
  const sizeMap = new Map();
  let maxWidth = 0;
  let maxHeight = 0;
  for (const n of inNodes) {
    const sz = estimateNodeSize(n);
    sizeMap.set(n.id, sz);
    maxWidth = Math.max(maxWidth, sz.width);
    maxHeight = Math.max(maxHeight, sz.height);
  }

  // For TB rankdir, nodesep = horizontal within rank, ranksep = vertical between ranks.
  const nodesep = Math.max(
    80,
    Math.ceil(maxWidth * LAYOUT_CFG.SEP_SAFETY_FACTOR + LAYOUT_CFG.MIN_HORIZONTAL_GAP),
  );
  const ranksep = Math.max(
    120,
    Math.ceil(maxHeight * LAYOUT_CFG.SEP_SAFETY_FACTOR + LAYOUT_CFG.MIN_VERTICAL_GAP),
  );

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'TB',
    nodesep,
    ranksep,
    edgesep: 32,
    marginx: 32,
    marginy: 32,
    ranker: 'tight-tree',
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const n of inNodes) {
    const { width, height } = sizeMap.get(n.id);
    g.setNode(n.id, { width, height });
  }

  // Add edges in branch-array order for branch-condition sources so dagre's
  // tight-tree ranker tends to place lanes left-to-right matching branches[].
  const nodeMapById = new Map(inNodes.map((n) => [n.id, n]));
  const edgesBySource = new Map();
  for (const e of inEdges) {
    if (!e.source || !e.target) continue;
    if (!edgesBySource.has(e.source)) edgesBySource.set(e.source, []);
    edgesBySource.get(e.source).push(e);
  }
  for (const [src, eList] of edgesBySource.entries()) {
    const srcNode = nodeMapById.get(src);
    let ordered = eList;
    if (srcNode && srcNode.type === branchType) {
      const branches = Array.isArray(srcNode?.data?.branches) ? srcNode.data.branches : [];
      if (branches.length) {
        const branchIndex = new Map(branches.map((b, i) => [b.id, i]));
        const decorated = eList.map((edge, i) => {
          const bId = edge.data?.branchId || edge.sourceHandle;
          const o = typeof bId === 'string' && branchIndex.has(bId)
            ? branchIndex.get(bId)
            : Number.MAX_SAFE_INTEGER;
          return { edge, o, i };
        });
        decorated.sort((a, b) => (a.o === b.o ? a.i - b.i : a.o - b.o));
        ordered = decorated.map((d) => d.edge);
      }
    }
    for (const e of ordered) g.setEdge(String(e.source), String(e.target));
  }

  dagre.layout(g);

  // Extract dagre positions and rank for level metadata.
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  const dagrePos = new Map();
  const rankSet = new Set();
  for (const n of inNodes) {
    const dn = g.node(n.id);
    if (!dn) continue;
    const w = dn.width ?? 0;
    const h = dn.height ?? 0;
    const x = (dn.x ?? 0) - w / 2;
    const y = (dn.y ?? 0) - h / 2;
    const rank = typeof dn.rank === 'number' ? dn.rank : 0;
    dagrePos.set(n.id, { x, y, width: w, height: h, rank });
    rankSet.add(rank);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
  }
  if (!isFinite(minX)) minX = 0;
  if (!isFinite(minY)) minY = 0;
  // dagre's tight-tree ranker can leave gaps between rank integers. Compress
  // to contiguous 0..N so __level is a true depth index.
  const sortedRanks = Array.from(rankSet).sort((a, b) => a - b);
  const rankToLevel = new Map(sortedRanks.map((r, i) => [r, i]));

  // In-degree map (reused for branch-condition alignment + collision)
  const inDeg = new Map();
  for (const n of inNodes) inDeg.set(n.id, 0);
  for (const e of inEdges) {
    if (e.source && e.target) {
      inDeg.set(e.target, (inDeg.get(e.target) || 0) + 1);
    }
  }

  const layoutedNodes = inNodes.map((n) => {
    const p = dagrePos.get(n.id);
    const sz = sizeMap.get(n.id);
    const pos = p
      ? { x: p.x - Math.min(0, minX) + 10, y: p.y - Math.min(0, minY) + 10 }
      : (n.position || { x: 0, y: 0 });
    const level = p ? (rankToLevel.get(p.rank) ?? 0) : 0;
    return {
      ...n,
      position: pos,
      data: {
        ...n.data,
        __tp: Position.Top,
        __sp: Position.Bottom,
        __level: level,
        __subtreeSize: { width: sz.width, height: sz.height },
      },
    };
  });

  // Lane-order pin: dagre's crossing reduction can swap lanes when subtree
  // weights change (e.g. user inserts a node into one branch). Re-pin lanes
  // left-to-right by `branches[]` array index so visual order stays stable.
  try {
    if (layoutedNodes.length && inEdges.length) {
      const nodeById = new Map(layoutedNodes.map((n) => [n.id, n]));
      const outEdgesBySrc = new Map();
      for (const e of inEdges) {
        if (!e.source || !e.target) continue;
        if (!outEdgesBySrc.has(e.source)) outEdgesBySrc.set(e.source, []);
        outEdgesBySrc.get(e.source).push(e);
      }
      const collectLaneSubtree = (rootId) => {
        const visited = new Set();
        const stack = [rootId];
        while (stack.length) {
          const cur = stack.pop();
          if (visited.has(cur)) continue;
          visited.add(cur);
          for (const oe of outEdgesBySrc.get(cur) || []) {
            // Stop at merge nodes — they belong to the shared continuation.
            if ((inDeg.get(oe.target) || 0) <= 1) stack.push(oe.target);
          }
        }
        return visited;
      };
      // Process BCs deepest first so nested BCs' lanes settle before outer BCs.
      const bcNodes = layoutedNodes.filter((n) => n.type === branchType);
      bcNodes.sort((a, b) => (b.data?.__level || 0) - (a.data?.__level || 0));
      const LANE_GAP = 32;
      for (const bc of bcNodes) {
        const branches = Array.isArray(bc.data?.branches) ? bc.data.branches : [];
        if (branches.length < 2) continue;
        const branchIndex = new Map(branches.map((b, i) => [b.id, i]));
        const outs = (outEdgesBySrc.get(bc.id) || [])
          .map((e) => ({ e, idx: branchIndex.get(e.data?.branchId || e.sourceHandle) }))
          .filter((x) => typeof x.idx === 'number');
        if (outs.length < 2) continue;
        outs.sort((a, b) => a.idx - b.idx);

        const lanes = outs.map(({ e }) => {
          const ids = collectLaneSubtree(e.target);
          let laneMinX = Number.POSITIVE_INFINITY;
          let laneMaxX = Number.NEGATIVE_INFINITY;
          for (const id of ids) {
            const n = nodeById.get(id);
            if (!n) continue;
            const sz = sizeMap.get(id);
            laneMinX = Math.min(laneMinX, n.position.x);
            laneMaxX = Math.max(laneMaxX, n.position.x + sz.width);
          }
          if (!isFinite(laneMinX)) {
            laneMinX = bc.position.x;
            laneMaxX = bc.position.x + sizeMap.get(bc.id).width;
          }
          return { ids, minX: laneMinX, maxX: laneMaxX, width: laneMaxX - laneMinX };
        });

        // Center the ordered lanes around the BC's center.
        const totalWidth = lanes.reduce((sum, l) => sum + l.width, 0)
          + LANE_GAP * (lanes.length - 1);
        const bcCenter = bc.position.x + sizeMap.get(bc.id).width / 2;
        let cursor = bcCenter - totalWidth / 2;
        for (const lane of lanes) {
          const dx = cursor - lane.minX;
          if (dx !== 0) {
            for (const id of lane.ids) {
              const n = nodeById.get(id);
              if (n) n.position = { ...n.position, x: n.position.x + dx };
            }
          }
          cursor += lane.width + LANE_GAP;
        }
      }
    }
  } catch (err) {
    console.warn('[layoutVerticalTree] lane-order pin skipped due to error', err);
  }

  // Branch-condition x-alignment: only when in-degree <= 1. A branch condition
  // reached from multiple parents must keep dagre's chosen X to stay between lanes.
  try {
    if (layoutedNodes.length && inEdges.length) {
      const parentMap = new Map();
      for (const e of inEdges) {
        if (e.source && e.target && !parentMap.has(e.target)) {
          parentMap.set(e.target, e.source);
        }
      }
      const nodeById = new Map(layoutedNodes.map((n) => [n.id, n]));
      for (let i = 0; i < layoutedNodes.length; i++) {
        const n = layoutedNodes[i];
        if (n.type !== branchType) continue;
        if ((inDeg.get(n.id) || 0) > 1) continue;
        const parentId = parentMap.get(n.id);
        if (!parentId || !nodeById.has(parentId)) continue;
        const parentNode = nodeById.get(parentId);
        if (parentNode.type === branchType) continue;
        if (parentNode.position.x === n.position.x) continue;
        layoutedNodes[i] = {
          ...n,
          position: { x: parentNode.position.x, y: n.position.y },
        };
        nodeById.set(n.id, layoutedNodes[i]);
      }
    }
  } catch (err) {
    console.warn('[layoutVerticalTree] branch condition alignment skipped due to error', err);
  }

  // Final collision pass — DAG-aware horizontal sweep within ranks.
  try {
    resolveHorizontalCollisions(layoutedNodes, inEdges, sizeMap, LAYOUT_CFG.MIN_HORIZONTAL_GAP);
  } catch (err) {
    console.warn('[layoutVerticalTree] collision resolution skipped due to error', err);
  }

  // Orphan handling: nodes that never received a dagre position go to the right
  // of the laid-out graph.
  const positionedIds = new Set();
  for (const n of inNodes) if (dagrePos.has(n.id)) positionedIds.add(n.id);
  const orphaned = inNodes.filter((n) => !positionedIds.has(n.id));
  if (orphaned.length) {
    let maxRight = 0;
    for (const n of layoutedNodes) {
      if (!positionedIds.has(n.id)) continue;
      const sz = sizeMap.get(n.id);
      maxRight = Math.max(maxRight, n.position.x + sz.width);
    }
    let cursor = (maxRight || 10) + LAYOUT_CFG.MIN_HORIZONTAL_GAP * 2;
    for (const n of orphaned) {
      const sz = sizeMap.get(n.id);
      const idx = layoutedNodes.findIndex((x) => x.id === n.id);
      const positioned = {
        ...n,
        position: { x: cursor, y: 10 },
        data: {
          ...n.data,
          __tp: Position.Top,
          __sp: Position.Bottom,
          __level: 0,
          __subtreeSize: { width: sz.width, height: sz.height },
        },
      };
      if (idx >= 0) layoutedNodes[idx] = positioned;
      else layoutedNodes.push(positioned);
      cursor += sz.width + LAYOUT_CFG.MIN_HORIZONTAL_GAP * 2;
    }
  }

  // Cache only layout meta — never full live data — so future cache hits don't
  // wipe updated node content (e.g. filter edits between layouts).
  const cacheCopy = {
    nodes: layoutedNodes.map((n) => ({
      ...n,
      data: {
        __tp: n.data?.__tp,
        __sp: n.data?.__sp,
        __level: n.data?.__level,
        __subtreeSize: n.data?.__subtreeSize,
      },
    })),
    edges: inEdges,
  };
  layoutCache.set(cacheKey, cacheCopy);
  if (layoutCache.size > 50) {
    const firstKey = layoutCache.keys().next().value;
    layoutCache.delete(firstKey);
  }

  return { nodes: layoutedNodes, edges: inEdges };
}
