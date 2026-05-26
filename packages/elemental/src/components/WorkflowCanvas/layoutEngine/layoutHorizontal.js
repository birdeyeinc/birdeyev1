import dagre from '@dagrejs/dagre';
import { Position } from '@xyflow/react';

/**
 * Layout tuning constants. Centralized so adjustments are simple & consistent.
 * NOTE: For horizontal (LR) dagre: ranksep -> horizontal gap between layers, nodesep -> vertical gap within a rank.
 */
const LAYOUT_CFG = {
  MIN_BASE_WIDTH: 380,
  MIN_BASE_HEIGHT: 200,
  CONDITION_EXTRA_WIDTH: 40,
  NODE_EXTRA_WIDTH: 20,
  CONDITION_BASE_HEIGHT: 85,
  CONDITION_BRANCH_INCREMENT: 22,
  // Minimum visual clearance between node bounding boxes after all transformations
  MIN_VERTICAL_GAP: 10,
  MIN_HORIZONTAL_GAP: 10,
  // Safety multiplier when converting node size -> dagre separation (absorbs elbows, handles etc.)
  SEP_SAFETY_FACTOR: 0.5,
  MAX_COLLISION_RESOLUTION_PASSES: 5,
  HORIZONTAL_OVERLAP_TOLERANCE: 12, // px of horizontal intersection to consider real overlap
};

/** Cached size estimation so we reuse identical logic across passes */
function defaultNodeSizeForLayout(n, branchType) {
  const baseWidth = Math.max(LAYOUT_CFG.MIN_BASE_WIDTH, n.width || n.measured?.width || 0);
  const baseHeight = Math.max(LAYOUT_CFG.MIN_BASE_HEIGHT, n.height || n.measured?.height || 0);
  const isCondition = n.type === branchType;
  const branches = Array.isArray(n?.data?.branches)
    ? n.data.branches
    : [];
  const analyticsLength = n.data?.analytics?.length ?? 0;
  const isAbTestEnable = n.data?.abTestEnable;
  const abTestTemplatesLength = isAbTestEnable ? n.data?.templateDistributions.length : 0;
  if (isCondition) {
    const estHeight = Math.max(
      baseHeight,
      LAYOUT_CFG.CONDITION_BASE_HEIGHT + Math.max(0, branches.length - 1) * LAYOUT_CFG.CONDITION_BRANCH_INCREMENT
    );
    return {
      width: baseWidth + LAYOUT_CFG.CONDITION_EXTRA_WIDTH,
      height: estHeight,
    };
  }
  if (analyticsLength || abTestTemplatesLength) {
     return { width: baseWidth + LAYOUT_CFG.NODE_EXTRA_WIDTH, height: LAYOUT_CFG.CONDITION_BASE_HEIGHT + analyticsLength * 35 + abTestTemplatesLength * 50 };
  }
  return { width: baseWidth + LAYOUT_CFG.NODE_EXTRA_WIDTH, height: baseHeight };
}

/**
 * Post-process pass to resolve residual vertical collisions after dagre layout & custom branch stacking.
 * We treat the directed graph as forest-like and only push a node's descendant subtree (non-merging) to avoid
 * cascading shifts into shared merge targets. This keeps changes localized and predictable.
 */
function resolveVerticalCollisions(
  nodes,
  edges,
  sizeMap,
  minGap
) {
  if (!nodes.length) return;
  // Build adjacency & in-degree for subtree collection (stop at merge nodes)
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
      const outs = outEdges.get(cur) || [];
      for (const t of outs) {
        if ((inDeg.get(t) || 0) <= 1) stack.push(t); // don't propagate through merges
      }
    }
    return visited;
  };

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Utility to fetch bbox quickly
  const getBBox = (n) => {
    const sz = sizeMap.get(n.id);
    return {
      x: n.position.x,
      y: n.position.y,
      w: sz.width,
      h: sz.height,
    };
  };

  const passes = LAYOUT_CFG.MAX_COLLISION_RESOLUTION_PASSES;
  for (let pass = 0; pass < passes; pass++) {
    let shifted = false;
    // Sort each pass because y positions mutate
    const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y);
    for (let i = 0; i < sorted.length; i++) {
      const a = sorted[i];
      const bbA = getBBox(a);
      const aBottom = bbA.y + bbA.h;
      for (let j = i + 1; j < sorted.length; j++) {
        const b = sorted[j];
        const bbB = getBBox(b);
        if (bbB.y >= aBottom + minGap) break; // Already sufficiently below
        // Check vertical overlap
        const verticallyOverlapping = bbB.y < aBottom && (bbB.y + bbB.h) > bbA.y;
        if (!verticallyOverlapping) continue;
        // Check meaningful horizontal overlap (to avoid unrelated columns)
        const xOverlap = Math.min(bbA.x + bbA.w, bbB.x + bbB.w) - Math.max(bbA.x, bbB.x);
        if (xOverlap < LAYOUT_CFG.HORIZONTAL_OVERLAP_TOLERANCE) continue;
        const desiredTop = aBottom + minGap;
        const dy = desiredTop - bbB.y;
        if (dy <= 0) continue;
        const subtree = collectSubtree(b.id);
        for (const id of subtree) {
          const n = nodeMap.get(id);
          n.position = { ...n.position, y: n.position.y + dy };
        }
        shifted = true;
      }
    }
    if (!shifted) break; // early exit
  }
}

export function layoutHorizontalTree(
  nodes,
  edges,
  options = {}
) {
  const {
      nodeSizeEstimator,
      branchType = "branchcondition"
    } = options;
  // Defensive copies to avoid mutating inputs
  const inNodes = Array.isArray(nodes) ? nodes : [];
  const inEdges = Array.isArray(edges) ? edges : [];

  const g = new dagre.graphlib.Graph();
  // Pre-scan nodes to derive dynamic separation distances based on real (or estimated) sizes.
  let maxWidth = 0;
  let maxHeight = 0;
  const sizeMap = new Map();
  const estimateNodeSizeForLayout = nodeSizeEstimator || defaultNodeSizeForLayout;
  for (const n of inNodes) {
    const sz = estimateNodeSizeForLayout(n, branchType);
    sizeMap.set(n.id, sz);
    maxWidth = Math.max(maxWidth, sz.width);
    maxHeight = Math.max(maxHeight, sz.height);
  }
  // Compute adaptive separations: ensure we never shrink below legacy defaults to avoid overly tight historical graphs.
  const nodesep = Math.max(84, Math.ceil(maxHeight * LAYOUT_CFG.SEP_SAFETY_FACTOR + LAYOUT_CFG.MIN_VERTICAL_GAP)); // vertical in LR
  const ranksep = Math.max(136, Math.ceil(maxWidth * LAYOUT_CFG.SEP_SAFETY_FACTOR + LAYOUT_CFG.MIN_HORIZONTAL_GAP)); // horizontal in LR

  g.setGraph({
    rankdir: 'LR',
    nodesep,
    ranksep,
    edgesep: 32, // slightly larger to reduce elbow crowding
    marginx: 32,
    marginy: 32,
    ranker: 'tight-tree',
  });
  g.setDefaultEdgeLabel(() => ({}));

  // sizeMap already populated. (If nodes array was empty sizeMap is empty.)

  // Add nodes and edges to dagre graph
  for (const n of inNodes) {
    const { width, height } = sizeMap.get(n.id) || estimateNodeSizeForLayout(n);
    g.setNode(n.id, { width, height });
  }
  for (const e of inEdges) {
    // Dagre doesn't care about handles, only connectivity
    if (e.source && e.target) g.setEdge(String(e.source), String(e.target));
  }

  // Compute layout
  dagre.layout(g);

  // Identify min top-left to normalize to origin
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  const dagrePos = new Map();
  for (const n of inNodes) {
    const dagNode = g.node(n.id);
    if (!dagNode) continue;
    const width = dagNode.width ?? 0;
    const height = dagNode.height ?? 0;
    const x = (dagNode.x ?? 0) - width / 2;
    const y = (dagNode.y ?? 0) - height / 2;
    dagrePos.set(n.id, { x, y, width, height });
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
  }
  if (!isFinite(minX)) minX = 0;
  if (!isFinite(minY)) minY = 0;

  // Align all nodes to start near 0,0 and set handle orientations for horizontal flow
  const normalizedNodes = inNodes.map((n) => {
    const p = dagrePos.get(n.id);
    const pos = p ? { x: p.x - Math.min(0, minX) + 10, y: p.y - Math.min(0, minY) + 10 } : n.position;
    // For a horizontal layout, targets on the Left, sources on the Right
    const nextData = {
      ...n.data,
      __tp: Position.Left,
      __sp: Position.Right,
    };
    return {
      ...n,
      position: pos,
      data: nextData,
    };
  });

  // -----------------------------
  // Post-process: Stack condition branches
  // Goal: keep first branch aligned with condition's Y; push later branches' subtrees downward with spacing
  // -----------------------------
  if (normalizedNodes.length && inEdges.length) {
    const nodeById = new Map(normalizedNodes.map((n) => [n.id, n]));
    const outEdges = new Map();
    const inDeg = new Map();
    // Build adjacency and in-degree
    for (const n of normalizedNodes) inDeg.set(n.id, 0);
    for (const e of inEdges) {
      if (!e.source || !e.target) continue;
      if (!outEdges.has(e.source)) outEdges.set(e.source, []);
      outEdges.get(e.source).push(e);
      inDeg.set(e.target, (inDeg.get(e.target) || 0) + 1);
    }

    // Helper to collect a branch subtree starting at targetId; stop at merge nodes (in-degree > 1)
    const collectSubtree = (targetId) => {
      const visited = new Set();
      const stack = [targetId];
      while (stack.length) {
        const cur = stack.pop();
        if (visited.has(cur)) continue;
        visited.add(cur);
        const outs = outEdges.get(cur) || [];
        for (const oe of outs) {
          const tid = oe.target;
          // Include next only if it doesn't merge from multiple parents (keeps shared nodes stable)
          if ((inDeg.get(tid) || 0) <= 1) stack.push(tid);
        }
      }
      return visited;
    };

    // Track cumulative Y offsets to avoid conflicts if multiple conditions adjust nearby trees
    const yOffset = new Map();
    const getY = (id) => {
      const n = nodeById.get(id);
      return (n.position.y || 0) + (yOffset.get(id) || 0);
    };
    const applyDelta = (ids, dy) => {
      if (!dy) return;
      for (const id of ids) yOffset.set(id, (yOffset.get(id) || 0) + dy);
    };

    // Iterate all condition nodes
    const isCondition = (n) => n?.type === branchType;
    const conditions = normalizedNodes.filter(isCondition);

    // To handle nested conditions, we need to process them from innermost to outermost.
    // This requires a topological sort of the conditions based on their nesting dependency.
    // A condition A depends on B if B is in a subtree of one of A's branches.
    const conditionMap = new Map(conditions.map((n) => [n.id, n]));
    const conditionIds = new Set(conditions.map((n) => n.id));

    // Build dependency graph: dependent -> list of dependencies
    const conditionDeps = new Map();
    // Build reverse graph: dependency -> list of dependents
    const conditionDependents = new Map();

    for (const cond of conditions) {
      const branches = Array.isArray(cond?.data?.branches)
        ? cond.data.branches
        : [];
      if (!branches.length) continue;

      const branchIndex = new Map(branches.map((b, i) => [b.id, i]));
      const outs = (outEdges.get(cond.id) || [])
        .map((e) => ({ e, idx: branchIndex.get(e.sourceHandle) }))
        .filter((x) => typeof x.idx === 'number');

      for (const { e } of outs) {
        const targetId = e.target;
        if (!targetId || !nodeById.has(targetId)) continue;
        const subtree = collectSubtree(targetId);
        for (const nodeId of subtree) {
          if (nodeId !== cond.id && conditionIds.has(nodeId)) {
            // cond depends on nodeId (the nested condition)
            if (!conditionDeps.has(cond.id)) conditionDeps.set(cond.id, []);
            conditionDeps.get(cond.id).push(nodeId);
            if (!conditionDependents.has(nodeId)) conditionDependents.set(nodeId, []);
            conditionDependents.get(nodeId).push(cond.id);
          }
        }
      }
    }

    // Kahn's algorithm for topological sort
    const sortedConditions = [];
    const inDegree = new Map();
    for (const cond of conditions) {
      inDegree.set(cond.id, conditionDeps.get(cond.id)?.length || 0);
    }

    const queue = conditions.filter((c) => inDegree.get(c.id) === 0);

    while (queue.length > 0) {
      const cond = queue.shift();
      sortedConditions.push(cond);

      const dependents = conditionDependents.get(cond.id) || [];
      for (const dependentId of dependents) {
        const currentInDegree = inDegree.get(dependentId) - 1;
        inDegree.set(dependentId, currentInDegree);
        if (currentInDegree === 0) {
          queue.push(conditionMap.get(dependentId));
        }
      }
    }

    // Handle cycles: if not all conditions are sorted, add remaining ones.
    // This makes the layout logic robust to cyclic dependencies in the graph.
    if (sortedConditions.length < conditions.length) {
      const sortedIds = new Set(sortedConditions.map((c) => c.id));
      for (const cond of conditions) {
        if (!sortedIds.has(cond.id)) {
          sortedConditions.push(cond);
        }
      }
    }

    // Gap between stacked branch subtrees
    const V_GAP = 32; // px

    for (const cond of sortedConditions) {
      const condY = getY(cond.id);
      const branches = Array.isArray(cond?.data?.branches)
        ? cond.data.branches
        : [];
      if (!branches.length) continue;

      const branchIndex = new Map(branches.map((b, i) => [b.id, i]));
      // Collect outgoing edges mapped to branch order; ignore ones without a sourceHandle match
      const outs = (outEdges.get(cond.id) || [])
        .map((e) => ({ e, idx: branchIndex.get(e.sourceHandle) }))
        .filter((x) => typeof x.idx === 'number')
        .sort((a, b) => a.idx - b.idx);

      if (!outs.length) continue;

      let currentBottom = condY;

      // Align first branch target to condition Y
      const first = outs[0];
      const firstTargetId = first.e.target;
      if (nodeById.has(firstTargetId)) {
        const subtree0 = collectSubtree(firstTargetId);
        // Compute target's current Y and shift subtree to align target with condY
        const tY = getY(firstTargetId);
        const dy0 = condY - tY;
        applyDelta(subtree0, dy0);
        // Update currentBottom based on subtree bounds
        let minY = Infinity, maxY = -Infinity;
        for (const id of subtree0) {
          const y = getY(id);
          minY = Math.min(minY, y);
          const sz = dagrePos.get(id);
          const h = (sz?.height ?? 48);
          maxY = Math.max(maxY, y + h);
        }
        if (isFinite(maxY)) currentBottom = Math.max(currentBottom, maxY);
      }

      // Stack remaining branches below
      for (let i = 1; i < outs.length; i++) {
        const tId = outs[i].e.target;
        if (!nodeById.has(tId)) continue;
        const sub = collectSubtree(tId);
        // Compute current bounds of this subtree
        let minY = Infinity, maxY = -Infinity;
        for (const id of sub) {
          const y = getY(id);
          const sz = dagrePos.get(id);
          const h = (sz?.height ?? 48);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y + h);
        }
        if (!isFinite(minY) || !isFinite(maxY)) continue;
        // Desired top for this subtree is just below currentBottom
        const desiredTop = currentBottom + V_GAP;
        const dy = desiredTop - minY;
        applyDelta(sub, dy);
        currentBottom = desiredTop + (maxY - minY);
      }
    }

    // Apply computed y-offsets
    if (yOffset.size) {
      for (let i = 0; i < normalizedNodes.length; i++) {
        const n = normalizedNodes[i];
        const dy = yOffset.get(n.id) || 0;
        if (dy) {
          normalizedNodes[i] = {
            ...n,
            position: { ...n.position, y: (n.position.y || 0) + dy },
          };
        }
      }
    }
  }

  // Final collision resolution (in case stacking introduced new overlaps) using adaptive min gap.
  try {
    resolveVerticalCollisions(normalizedNodes, inEdges, sizeMap, LAYOUT_CFG.MIN_VERTICAL_GAP);
  } catch (err) {
    // Fail-safe: layout should never completely fail because of collision logic.
    // eslint-disable-next-line no-console
    console.warn('[layoutWithDagre] collision resolution skipped due to error', err);
  }

  // Edges are unchanged; returning them for convenience
  return { nodes: normalizedNodes, edges: inEdges };
}