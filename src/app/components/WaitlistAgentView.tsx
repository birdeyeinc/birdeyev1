import { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import "./WaitlistAgentBuilder.css";

/* ─── Material Symbol icon helper ─── */
function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: size, width: size, height: size, lineHeight: 1, overflow: "hidden", display: "block" }}
    >
      {name}
    </span>
  );
}

/* ═══════════════════════════════════════════
   LHS Drawer
   ═══════════════════════════════════════════ */
const TRIGGER_ITEMS = [
  { id: "schedule",     label: "Schedule-based",       description: "Runs on a recurring schedule" },
  { id: "cancellation", label: "Appointment cancelled", description: "Triggers on appointment cancellation" },
  { id: "manual",       label: "Manual trigger",        description: "Triggered manually by staff" },
];

const TASK_ITEMS = [
  { id: "fetch_slots",   label: "Fetch available slots",        description: "Get open slots from scheduling system" },
  { id: "match_patient", label: "Match patient to slot",         description: "Match waitlist patient based on preferences" },
  { id: "notify",        label: "Send notification",            description: "Notify patient via SMS or email" },
  { id: "update_status", label: "Update waitlist status",        description: "Mark patient as slot offered" },
];

const CONTROL_ITEMS = [
  { id: "branch", label: "Branch",   description: "Split flow based on conditions" },
  { id: "delay",  label: "Delay",    description: "Pause execution for a set duration" },
  { id: "loop",   label: "Loop",     description: "Iterate over a collection" },
];

function DraggableCard({ item, type }: { item: { id: string; label: string; description: string }; type: string }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/reactflow-type",        type);
    e.dataTransfer.setData("application/reactflow-label",       item.label);
    e.dataTransfer.setData("application/reactflow-description", item.description);
    e.dataTransfer.effectAllowed = "move";
  };
  const iconName = type === "trigger" ? "schedule" : type === "task" ? "task_alt" : "account_tree";
  return (
    <div className="lhs-drawer__card" draggable onDragStart={handleDragStart} style={{ cursor: "grab" }}>
      <span className="lhs-drawer__card-icon"><Icon name={iconName} /></span>
      <span className="lhs-drawer__card-label">{item.label}</span>
    </div>
  );
}

function LHSPanel() {
  const [tab, setTab]               = useState<"manual" | "ai">("manual");
  const [search, setSearch]         = useState("");
  const [triggersOpen, setTriggers] = useState(true);
  const [tasksOpen, setTasks]       = useState(true);
  const [controlsOpen, setControls] = useState(false);

  const q = search.toLowerCase();
  const filteredTriggers  = TRIGGER_ITEMS.filter(i => i.label.toLowerCase().includes(q));
  const filteredTasks     = TASK_ITEMS.filter(i => i.label.toLowerCase().includes(q));
  const filteredControls  = CONTROL_ITEMS.filter(i => i.label.toLowerCase().includes(q));

  return (
    <div className="wab__lhs">
      <div className="lhs-drawer">
        {/* Tabs */}
        <div className="lhs-drawer__tabs">
          {(["manual", "ai"] as const).map(t => (
            <button key={t} type="button" className={`lhs-drawer__tab ${tab === t ? "lhs-drawer__tab--active" : ""}`} onClick={() => setTab(t)}>
              <div className="lhs-drawer__tab-label">
                {t === "ai" && <Icon name="auto_awesome" size={16} />}
                {t === "manual" ? "Create manually" : "Create with AI"}
              </div>
              <span className="lhs-drawer__tab-underline" />
            </button>
          ))}
        </div>

        {tab === "manual" && (
          <div className="lhs-drawer__body">
            {/* Search */}
            <div className="lhs-drawer__search">
              <span className="lhs-drawer__search-icon"><Icon name="search" /></span>
              <input className="lhs-drawer__search-input" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Accordion sections */}
            <div className="lhs-drawer__sections">
              {/* Triggers */}
              <div>
                <button type="button" className="lhs-drawer__section-header" onClick={() => setTriggers(v => !v)}>
                  <span className="lhs-drawer__section-title">Triggers</span>
                  <span className={`lhs-drawer__section-icon material-symbols-outlined ${triggersOpen ? "lhs-drawer__section-icon--open" : ""}`}>expand_more</span>
                </button>
                {triggersOpen && <div className="lhs-drawer__cards">{filteredTriggers.map(i => <DraggableCard key={i.id} item={i} type="trigger" />)}</div>}
              </div>

              {/* Tasks */}
              <div>
                <button type="button" className="lhs-drawer__section-header" onClick={() => setTasks(v => !v)}>
                  <span className="lhs-drawer__section-title">Tasks</span>
                  <span className={`lhs-drawer__section-icon material-symbols-outlined ${tasksOpen ? "lhs-drawer__section-icon--open" : ""}`}>expand_more</span>
                </button>
                {tasksOpen && <div className="lhs-drawer__cards">{filteredTasks.map(i => <DraggableCard key={i.id} item={i} type="task" />)}</div>}
              </div>

              {/* Controls */}
              <div>
                <button type="button" className="lhs-drawer__section-header" onClick={() => setControls(v => !v)}>
                  <span className="lhs-drawer__section-title">Controls</span>
                  <span className={`lhs-drawer__section-icon material-symbols-outlined ${controlsOpen ? "lhs-drawer__section-icon--open" : ""}`}>expand_more</span>
                </button>
                {controlsOpen && <div className="lhs-drawer__cards">{filteredControls.map(i => <DraggableCard key={i.id} item={i} type="task" />)}</div>}
              </div>
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" }}>
            <p style={{ fontSize: 14, color: "#555", textAlign: "center", lineHeight: "20px" }}>Describe your agent and AI will build the workflow for you.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Graph Controls (zoom toolbar)
   ═══════════════════════════════════════════ */
const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200];

function GraphControls({ zoom, onZoomSelect, onFitView, orientation, onOrientationChange }: {
  zoom: number;
  onZoomSelect: (z: number) => void;
  onFitView: () => void;
  orientation: "vertical" | "horizontal";
  onOrientationChange: (o: "vertical" | "horizontal") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ display: "flex", gap: 8, padding: 8, background: "#fff", border: "1px solid #e5e9f0", borderRadius: 8 }}>
      {/* Orientation */}
      <div style={{ display: "flex", gap: 4, background: "#fff", border: "1px solid #e5e9f0", borderRadius: 4, padding: 4, height: 36, alignItems: "center" }}>
        {(["vertical", "horizontal"] as const).map(o => (
          <button key={o} type="button"
            onClick={() => onOrientationChange(o)}
            style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: orientation === o ? "#e5e9f0" : "transparent", border: "none", borderRadius: 4, cursor: "pointer", color: "#555" }}
          >
            <Icon name={o === "vertical" ? "arrow_downward" : "arrow_forward"} size={18} />
          </button>
        ))}
      </div>

      {/* Zoom dropdown */}
      <div ref={ref} style={{ position: "relative" }}>
        <button type="button" onClick={() => setOpen(v => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 8px 0 12px", background: "#fff", border: "1px solid #e5e9f0", borderRadius: 4, cursor: "pointer", fontSize: 14, color: "#555", whiteSpace: "nowrap" }}
        >
          <span style={{ minWidth: 36, textAlign: "left" }}>{Math.round(zoom)}%</span>
          <Icon name="expand_more" size={18} />
        </button>
        {open && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, background: "#fff", border: "1px solid #e5e9f0", borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 100, minWidth: "100%", padding: 4 }}>
            {ZOOM_PRESETS.map(p => (
              <button key={p} type="button" onClick={() => { onZoomSelect(p / 100); setOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 12px", background: Math.round(zoom) === p ? "#e5e9f0" : "transparent", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: Math.round(zoom) === p ? 500 : 400, color: "#333" }}
              >{p}%</button>
            ))}
            <div style={{ height: 1, background: "#e5e9f0", margin: "4px 0" }} />
            <button type="button" onClick={() => { onFitView(); setOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 12px", background: "transparent", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, color: "#333" }}
            >Fit view</button>
          </div>
        )}
      </div>

      {/* Run */}
      <button type="button"
        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", border: "1px solid #e5e9f0", borderRadius: 4, cursor: "pointer", color: "#555" }}
      >
        <Icon name="play_arrow" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Custom ReactFlow node types
   ═══════════════════════════════════════════ */
interface NodeData {
  label: string;
  subtitle?: string;
  description?: string;
  nodeType: "trigger" | "task";
  stepNumber?: number;
  enabled: boolean;
  selected?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

function CanvasNodeComponent({ data }: { data: NodeData }) {
  const iconName = data.nodeType === "trigger" ? "schedule" : "task_alt";
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      <div
        className={`canvas-node${data.selected ? " canvas-node--selected" : ""}`}
        onClick={data.onClick}
        style={{ cursor: "pointer" }}
      >
        <div className="cnh">
          <div className="cnh__left">
            <div className={`cnh__icon-circle cnh__icon-circle--${data.nodeType}`}>
              <Icon name={iconName} size={16} />
            </div>
            <span className="cnh__label">{data.nodeType === "trigger" ? "Trigger" : "Task"}</span>
          </div>
          <div className="cnh__right">
            <button
              type="button"
              className={`cnh__toggle ${data.enabled ? "" : "cnh__toggle--off"}`}
              onClick={e => { e.stopPropagation(); data.onToggle?.(); }}
            >
              <span className="cnh__toggle-thumb" />
            </button>
            <button type="button" className="cnh__more-btn" onClick={e => { e.stopPropagation(); data.onDelete?.(); }}>
              <Icon name="delete" size={18} />
            </button>
          </div>
        </div>
        <div className="cnb">
          {data.stepNumber != null && (
            <ol className="cnb__step" start={data.stepNumber}><li>{data.label}</li></ol>
          )}
          {data.description && <p className="cnb__description">{data.description}</p>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
    </>
  );
}

function StartNodeComponent({ data }: { data: { title: string; subtitle: string } }) {
  return (
    <>
      <div className="start-node">
        <div className="start-node__icon"><Icon name="auto_awesome" size={24} /></div>
        <div className="start-node__content">
          <span className="start-node__title">{data.title}</span>
          <span className="start-node__subtitle">{data.subtitle}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
    </>
  );
}

function EndNodeComponent() {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      <div className="end-node">End</div>
    </>
  );
}

const NODE_TYPES: NodeTypes = {
  start:  StartNodeComponent as any,
  canvas: CanvasNodeComponent as any,
  end:    EndNodeComponent as any,
};

/* ═══════════════════════════════════════════
   RHS editing panel
   ═══════════════════════════════════════════ */
interface EditableNode { id: string; label: string; description: string; nodeType: "trigger" | "task"; }

function RHSPanel({ node, onClose, onSave }: {
  node: EditableNode;
  onClose: () => void;
  onSave: (id: string, label: string, description: string) => void;
}) {
  const [label, setLabel]   = useState(node.label);
  const [desc,  setDesc]    = useState(node.description);

  return (
    <div className="wab__rhs">
      <div className="rhs-drawer">
        <div className="rhs-drawer__header">
          <span className="rhs-drawer__header-title">{node.nodeType === "trigger" ? "Trigger" : "Task"}</span>
          <button type="button" className="rhs-drawer__close-btn" onClick={onClose}><Icon name="close" /></button>
        </div>
        <div className="rhs-drawer__body">
          <div className="rhs-drawer__field">
            <label className="rhs-drawer__label">Name</label>
            <input className="rhs-drawer__input" value={label} onChange={e => setLabel(e.target.value)} />
          </div>
          <div className="rhs-drawer__field">
            <label className="rhs-drawer__label">Description</label>
            <textarea className="rhs-drawer__textarea" value={desc} onChange={e => setDesc(e.target.value)} rows={5} />
          </div>
        </div>
        <div className="rhs-drawer__footer">
          <button type="button" className="rhs-drawer__save-btn" onClick={() => { onSave(node.id, label, desc); onClose(); }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Initial workflow nodes
   ═══════════════════════════════════════════ */
let _nodeIdCounter = 10;
function nextId() { return `n${++_nodeIdCounter}`; }

const INITIAL_NODES: Node[] = [
  { id: "start", type: "start",  position: { x: 0, y: 0  }, data: { title: "Waitlist Agent", subtitle: "All locations" } },
  { id: "n1",    type: "canvas", position: { x: 0, y: 120 }, data: { nodeType: "trigger", stepNumber: 1, label: "Schedule-based trigger — every hour", description: "Agent runs on a recurring hourly schedule to check for newly available appointment slots", enabled: true } },
  { id: "n2",    type: "canvas", position: { x: 0, y: 280 }, data: { nodeType: "task",    stepNumber: 2, label: "Fetch available appointment slots",   description: "Retrieve all open or newly cancelled appointment slots from the scheduling system",  enabled: true } },
  { id: "n3",    type: "canvas", position: { x: 0, y: 440 }, data: { nodeType: "task",    stepNumber: 3, label: "Match waitlist patients to available slots", description: "Compare each available slot against waitlist patients using slot preference and provider",  enabled: true } },
  { id: "n4",    type: "canvas", position: { x: 0, y: 600 }, data: { nodeType: "task",    stepNumber: 4, label: "Offer slot to matching patient",      description: "Send a slot offer notification via SMS or email with appointment details",           enabled: true } },
  { id: "n5",    type: "canvas", position: { x: 0, y: 760 }, data: { nodeType: "task",    stepNumber: 5, label: "Update patient status on waitlist",   description: "Mark the patient's waitlist status as Slot offered and record the timestamp",        enabled: true } },
  { id: "end",   type: "end",    position: { x: 0, y: 920 }, data: {} },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e-start-n1", source: "start", target: "n1", style: { stroke: "#ccd5e4", strokeDasharray: "4 4", strokeWidth: 1 } },
  { id: "e-n1-n2",    source: "n1",    target: "n2", style: { stroke: "#ccd5e4", strokeDasharray: "4 4", strokeWidth: 1 } },
  { id: "e-n2-n3",    source: "n2",    target: "n3", style: { stroke: "#ccd5e4", strokeDasharray: "4 4", strokeWidth: 1 } },
  { id: "e-n3-n4",    source: "n3",    target: "n4", style: { stroke: "#ccd5e4", strokeDasharray: "4 4", strokeWidth: 1 } },
  { id: "e-n4-n5",    source: "n4",    target: "n5", style: { stroke: "#ccd5e4", strokeDasharray: "4 4", strokeWidth: 1 } },
  { id: "e-n5-end",   source: "n5",    target: "end", style: { stroke: "#ccd5e4", strokeDasharray: "4 4", strokeWidth: 1 } },
];

/* ═══════════════════════════════════════════
   Inner canvas (needs ReactFlow context)
   ═══════════════════════════════════════════ */
function CanvasInner({
  nodes, edges,
  onNodesChange, onEdgesChange,
  selectedId, setSelectedId,
  onDrop, onToggle, onDelete,
}: {
  nodes: Node[]; edges: Edge[];
  onNodesChange: OnNodesChange; onEdgesChange: OnEdgesChange;
  selectedId: string | null; setSelectedId: (id: string | null) => void;
  onDrop: (type: string, label: string, description: string, x: number, y: number) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { zoomTo, fitView, getViewport } = useReactFlow();
  const [zoom, setZoom]         = useState(100);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");

  // Inject callbacks into node data
  const enrichedNodes = nodes.map(n => {
    if (n.type !== "canvas") return n;
    return {
      ...n,
      data: {
        ...n.data,
        selected: n.id === selectedId,
        onClick:  () => setSelectedId(n.id),
        onToggle: () => onToggle(n.id),
        onDelete: () => onDelete(n.id),
      },
    };
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type  = e.dataTransfer.getData("application/reactflow-type");
    const label = e.dataTransfer.getData("application/reactflow-label");
    const desc  = e.dataTransfer.getData("application/reactflow-description");
    if (!type) return;
    onDrop(type, label, desc, e.clientX, e.clientY);
  }, [onDrop]);

  return (
    <div className="wab__canvas" onDragOver={handleDragOver} onDrop={handleDrop}>
      {/* Toolbar */}
      <div className="flow-canvas__toolbar-anchor">
        <GraphControls
          zoom={zoom}
          onZoomSelect={z => zoomTo(z, { duration: 200 })}
          onFitView={() => fitView({ padding: 0.3, duration: 200 })}
          orientation={orientation}
          onOrientationChange={setOrientation}
        />
      </div>

      <ReactFlow
        nodes={enrichedNodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onViewportChange={({ zoom: z }) => setZoom(Math.round(z * 100))}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnScroll
        zoomOnScroll
        style={{ background: "#f4f6f7" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#d4d9e8" />
      </ReactFlow>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main export
   ═══════════════════════════════════════════ */
export function WaitlistAgentView({ onBack }: { onBack: () => void }) {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    changes => setNodes(prev => applyNodeChanges(changes, prev)), []);
  const onEdgesChange: OnEdgesChange = useCallback(
    changes => setEdges(prev => applyEdgeChanges(changes, prev)), []);

  const handleToggle = useCallback((id: string) => {
    setNodes(prev => prev.map(n =>
      n.id === id ? { ...n, data: { ...n.data, enabled: !n.data.enabled } } : n));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNodes(prev => {
      const filtered = prev.filter(n => n.id !== id);
      // Renumber task/trigger nodes
      let step = 1;
      return filtered.map(n => n.type === "canvas" ? { ...n, data: { ...n.data, stepNumber: step++ } } : n);
    });
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleDrop = useCallback((type: string, label: string, description: string) => {
    const id = nextId();
    const taskNodes = nodes.filter(n => n.type === "canvas");
    const lastTaskNode = taskNodes[taskNodes.length - 1];
    const newY = lastTaskNode ? (lastTaskNode.position.y + 160) : 120;

    const newNode: Node = {
      id,
      type: "canvas",
      position: { x: 0, y: newY },
      data: {
        nodeType: type === "trigger" ? "trigger" : "task",
        stepNumber: taskNodes.length + 1,
        label,
        description,
        enabled: true,
      },
    };

    // Move end node down
    setNodes(prev => {
      const withoutEnd = prev.filter(n => n.id !== "end");
      const endNode = prev.find(n => n.id === "end");
      const updated = [...withoutEnd, newNode];
      if (endNode) updated.push({ ...endNode, position: { x: 0, y: newY + 160 } });
      return updated;
    });

    // Connect new node: detach last→end, add last→new, add new→end
    setEdges(prev => {
      const endEdge = prev.find(e => e.target === "end");
      const prevSource = endEdge?.source ?? (lastTaskNode?.id ?? "start");
      const filtered = prev.filter(e => e.target !== "end");
      const edgeStyle = { stroke: "#ccd5e4", strokeDasharray: "4 4" as const, strokeWidth: 1 };
      return [
        ...filtered,
        { id: `e-${prevSource}-${id}`, source: prevSource, target: id, style: edgeStyle },
        { id: `e-${id}-end`,           source: id,         target: "end", style: edgeStyle },
      ];
    });
  }, [nodes]);

  const handleSaveEdit = useCallback((id: string, label: string, description: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, label, description } } : n));
    toast("Changes saved.", { icon: <span style={{ color: "#22c55e", fontSize: 16 }}>✓</span> });
  }, []);

  const selectedNode = nodes.find(n => n.id === selectedId && n.type === "canvas");

  return (
    <div className="wab">
      {/* Header */}
      <div className="wab__header">
        <div className="wab__header-left">
          <button type="button" className="wab__back-btn" onClick={onBack}><Icon name="arrow_back" /></button>
          <span className="wab__title">Waitlist Agent</span>
        </div>
        <div className="wab__header-right">
          <button type="button" className="wab__icon-btn" title="Share"><Icon name="backup" /></button>
          <Button type="button" onClick={() => toast.success("Agent published successfully")}>Publish</Button>
        </div>
      </div>

      {/* Body */}
      <div className="wab__body">
        <LHSPanel />

        <ReactFlowProvider>
          <CanvasInner
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onDrop={handleDrop}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </ReactFlowProvider>

        {selectedNode && (
          <RHSPanel
            node={{
              id:          selectedNode.id,
              label:       String(selectedNode.data.label ?? ""),
              description: String(selectedNode.data.description ?? ""),
              nodeType:    selectedNode.data.nodeType as "trigger" | "task",
            }}
            onClose={() => setSelectedId(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
}
