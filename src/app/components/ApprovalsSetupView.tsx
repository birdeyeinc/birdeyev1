import { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, MoreVertical, ChevronDown, X, Info,
  Check, Pencil, SlidersHorizontal, AlertTriangle
} from 'lucide-react';
import { createColumnHelper } from "@tanstack/react-table";
import { AppDataTable } from "@/app/components/ui/AppDataTable";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  MAIN_VIEW_HEADER_BAND_CLASS,
  MAIN_VIEW_PRIMARY_HEADING_CLASS,
} from './layout/mainViewTitleClasses';
import { buildApprovalWorkflowRows } from "./social/socialTableFixtures";

// ─── Coverage helper ────────────────────────────────────────────────────────────
function hasAllLocationsApprover(step: { approvers: { locationType: string }[] }) {
  return step.approvers.some(a => a.locationType === 'all');
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Approver {
  id: string;
  name: string;
  initials: string;
  color: string;
  locationType: 'all' | 'partial';
  locations: string[];
}

interface Step {
  id: number;
  name: string;
  approvers: Approver[];
  requireMode: 'any' | 'all';
}

interface Workflow {
  id: string;
  name: string;
  status: 'Enabled' | 'Disabled';
  lastUpdated: string;
  updatedBy: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const WORKFLOWS: Workflow[] = buildApprovalWorkflowRows(31, 24);

const ALL_APPROVERS: Approver[] = [
  { id: 'u1', name: 'Aaron Blake',    initials: 'AB', color: 'var(--blue-100)', locationType: 'partial', locations: ['Boston, MA','Culver City, CA','Corvallis, OR','Fremont, CA','Kansas City, MO','Manchester, LA','Springfield, IL','Tampa, FL','Tucson, AZ','Austin, TX'] },
  { id: 'u2', name: 'Brian Carter',   initials: 'BC', color: '#e67e22', locationType: 'partial', locations: ['Boston, MA','Culver City, CA'] },
  { id: 'u3', name: 'Daniel Foster',  initials: 'DF', color: '#27ae60', locationType: 'all',     locations: [] },
  { id: 'u4', name: 'Michael Turner', initials: 'MT', color: '#8e44ad', locationType: 'partial', locations: ['Boston, MA','Culver City, CA','Corvallis, OR','Fremont, CA','Kansas City, MO'] },
  { id: 'u5', name: 'Steven Walker',  initials: 'SW', color: '#c0392b', locationType: 'partial', locations: ['Boston, MA','Culver City, CA','Corvallis, OR','Fremont, CA','Kansas City, MO','Manchester, LA','Springfield, IL','Tampa, FL','Tucson, AZ','Austin, TX'] },
  { id: 'u6', name: 'William Smith',  initials: 'WS', color: '#5b7fff', locationType: 'all',     locations: [] },
  { id: 'u7', name: 'John Doe',       initials: 'JD', color: '#e67e22', locationType: 'partial', locations: ['Atlanta, GA','Denver, CO'] },
];

const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    name: 'Step 1',
    approvers: [
      ALL_APPROVERS.find(a => a.id === 'u6')!,
      ALL_APPROVERS.find(a => a.id === 'u7')!,
    ],
    requireMode: 'any',
  },
];

// ─── Avatar ─────────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 24 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size, backgroundColor: color, borderRadius: '50%', flexShrink: 0, fontSize: size * 0.38, fontWeight: 500, color: 'var(--gray-0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      className="font-medium "
    >
      {initials}
    </div>
  );
}

// ─── Location count label ────────────────────────────────────────────────────────

function LocationLabel({ approver }: { approver: Approver }) {
  if (approver.locationType === 'all') {
    return <span className="text-[12px] text-blue-100 dark:text-blue-80 ">All locations</span>;
  }
  return <span className="text-[12px] text-gray-300 dark:text-gray-90 ">{approver.locations.length} location{approver.locations.length !== 1 ? 's' : ''}</span>;
}

// ─── Approver Chip (inline in the input box) ────────────────────────────────────

function ApproverChip({ approver, onRemove }: { approver: Approver; onRemove: () => void }) {
  return (
    <div className="inline-flex items-center gap-[6px] h-[28px] pl-[4px] pr-[6px] rounded-[4px] border border-new-selected-color dark:border-gray-600 bg-white dark:bg-gray-700 shrink-0">
      <Avatar initials={approver.initials} color={approver.color} size={20} />
      <span className="text-[13px] text-gray-900 dark:text-gray-2000 whitespace-nowrap">{approver.name}</span>
      <button className="text-gray-80 dark:text-gray-90 hover:text-gray-300 dark:hover:text-gray-90 flex items-center" onClick={e => { e.stopPropagation(); }}>
        <Info size={14} />
      </button>
      <button className="text-gray-80 dark:text-gray-90 hover:text-gray-300 dark:hover:text-gray-90 flex items-center" onClick={e => { e.stopPropagation(); onRemove(); }}>
        <X size={13} />
      </button>
    </div>
  );
}

// ─── Location Popover ──────────────────────────────────────────────────────────

function LocationPopover({ locations }: { locations: string[] }) {
  return (
    <div className="absolute left-full top-0 ml-[4px] z-30 bg-white dark:bg-gray-700 border border-new-selected-color dark:border-gray-600 rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] w-[200px] py-[8px]">
      <div className="px-[16px] pb-[6px]">
        <span className="font-medium text-[12px] text-gray-100 dark:text-gray-90 uppercase tracking-[0.5px]">Locations</span>
      </div>
      {locations.slice(0, 6).map(loc => (
        <div key={loc} className="px-[16px] py-[5px] text-[13px] text-gray-900 dark:text-gray-2000 hover:bg-blue-10 dark:hover:bg-gray-700 cursor-default">{loc}</div>
      ))}
    </div>
  );
}

// ─── Approver Dropdown ─────────────────────────────────────────────────────────

function ApproverDropdown({
  available, onAdd, onClose,
}: {
  available: Approver[];
  onAdd: (a: Approver) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<'all' | 'partial'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const filtered = available.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const hoveredApprover = filtered.find(a => a.id === hoveredId);

  return (
    <div ref={ref} className="absolute top-full left-0 mt-[4px] z-20 bg-white dark:bg-gray-700 border border-new-selected-color dark:border-gray-600 rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]" style={{ width: 460 }}>
      {/* Filter header */}
      <div className="flex items-center gap-[4px] px-[16px] pt-[12px] pb-[8px]">
        <span className="text-[13px] text-gray-300 dark:text-gray-90">Filter users</span>
        <button
          className="inline-flex items-center gap-[2px] text-[13px] text-blue-100 dark:text-blue-80"
          onClick={() => setLocationFilter(locationFilter === 'all' ? 'partial' : 'all')}
        >
          {locationFilter === 'all' ? 'All locations' : 'Specific locations'}
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="relative px-[8px] pb-[8px]">
        <Search size={14} className="absolute left-[20px] top-[50%] -translate-y-1/2 text-gray-80 dark:text-gray-90 pointer-events-none" />
        <input
          autoFocus
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-[36px] pl-[34px] pr-[12px] border border-new-selected-color dark:border-gray-600 bg-white dark:bg-gray-700 rounded-[6px] text-[13px] text-gray-900 dark:text-gray-2000 outline-none focus:border-blue-100 dark:focus:border-blue-80 placeholder-gray-80 dark:placeholder:text-gray-90"
        />
      </div>

      {/* User list */}
      <div className="max-h-[240px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-[16px] py-[12px] text-[13px] text-gray-80 dark:text-gray-90">No users found</div>
        ) : (() => {
          const allLoc   = filtered.filter(a => a.locationType === 'all');
          const partial  = filtered.filter(a => a.locationType === 'partial');
          const renderRow = (approver: Approver) => (
            <div
              key={approver.id}
              className="relative flex items-center gap-[10px] px-[12px] py-[8px] cursor-pointer hover:bg-blue-10 dark:hover:bg-gray-700"
              onClick={() => { onAdd(approver); onClose(); }}
              onMouseEnter={() => setHoveredId(approver.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Avatar initials={approver.initials} color={approver.color} size={28} />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[13px] text-gray-900 dark:text-gray-2000">{approver.name}</span>
                <div className="flex items-center gap-[4px]">
                  {approver.locationType === 'all' ? (
                    <span className="text-[12px] text-blue-100 dark:text-blue-80">All locations</span>
                  ) : (
                    <>
                      <span className="text-[12px] text-gray-300 dark:text-gray-90">
                        {approver.locations.length} location{approver.locations.length !== 1 ? 's' : ''}
                      </span>
                      <ChevronDown size={13} className="text-gray-300 dark:text-gray-90" />
                    </>
                  )}
                </div>
              </div>
              {hoveredId === approver.id && approver.locationType === 'partial' && approver.locations.length > 0 && (
                <LocationPopover locations={approver.locations} />
              )}
            </div>
          );
          return (
            <>
              {allLoc.length > 0 && (
                <>
                  {/* Recommended section label — subtle */}
                  <div className="px-[12px] pt-[6px] pb-[2px] flex items-center gap-[4px]">
                    <span className="font-medium text-[11px] text-blue-100 dark:text-blue-80 uppercase tracking-[0.5px]">Recommended</span>
                    <span className="text-[11px] text-gray-80 dark:text-gray-90">· covers all locations</span>
                  </div>
                  {allLoc.map(renderRow)}
                  {partial.length > 0 && <div className="mx-[12px] my-[4px] border-t border-gray-20 dark:border-gray-600" />}
                </>
              )}
              {partial.map(renderRow)}
            </>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Step Card ─────────────────────────────────────────────────────────────────

function StepCard({
  step, stepIndex, onUpdate, onDelete, canDelete,
}: {
  step: Step;
  stepIndex: number;
  onUpdate: (updated: Step) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(step.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipAreaRef = useRef<HTMLDivElement>(null);

  const available = ALL_APPROVERS.filter(a => !step.approvers.find(s => s.id === a.id));
  const approversLeft = ALL_APPROVERS.length - step.approvers.length;
  const covered = hasAllLocationsApprover(step);

  const removeApprover = (id: string) => {
    onUpdate({ ...step, approvers: step.approvers.filter(a => a.id !== id) });
  };

  const addApprover = (a: Approver) => {
    onUpdate({ ...step, approvers: [...step.approvers, a] });
  };

  const finishEditName = () => {
    setEditingName(false);
    onUpdate({ ...step, name: nameValue || `Step ${stepIndex + 1}` });
  };

  return (
    <div className="bg-white dark:bg-gray-700 border border-new-selected-color dark:border-gray-600 rounded-[8px] overflow-visible">
      {/* Step header */}
      <div className="flex items-center gap-[10px] px-[20px] pt-[20px] pb-[12px]">
        {/* Status circle — green when covered, amber when not */}
        <div
          className="w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{ backgroundColor: covered ? '#34a853' : '#f59e0b' }}
        >
          {covered
            ? <Check size={14} color="white" strokeWidth={2.5} />
            : <AlertTriangle size={13} color="white" strokeWidth={2.5} />
          }
        </div>

        {/* Step name + edit */}
        {editingName ? (
          <input
            ref={inputRef}
            autoFocus
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
            onBlur={finishEditName}
            onKeyDown={e => { if (e.key === 'Enter') finishEditName(); }}
            className="font-medium text-[16px] text-gray-900 dark:text-gray-2000 border-b border-blue-100 dark:border-blue-80 outline-none bg-transparent"
            style={{ fontVariationSettings: "'wdth' 100" }}
          />
        ) : (
          <span className="font-medium text-[16px] text-gray-900 dark:text-gray-2000" style={{ fontVariationSettings: "'wdth' 100" }}>
            {step.name}
          </span>
        )}

        <button
          className="text-gray-80 dark:text-gray-90 hover:text-blue-100 dark:hover:text-blue-80"
          onClick={() => { setEditingName(true); setTimeout(() => inputRef.current?.focus(), 0); }}
        >
          <Pencil size={15} />
        </button>

        {canDelete && (
          <button className="ml-auto text-gray-80 dark:text-gray-90 hover:text-red-100" onClick={onDelete}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Require mode row */}
      <div className="px-[20px] pb-[12px] flex items-center gap-[6px]">
        <span className="text-[13px] text-gray-300 dark:text-gray-90">Require approval from</span>
        <button className="inline-flex items-center gap-[2px] text-[13px] text-blue-100 dark:text-blue-80">
          {step.requireMode === 'any' ? 'any' : 'all'}
          <ChevronDown size={14} />
        </button>
        <span className="text-[13px] text-gray-300 dark:text-gray-90">of these approvers</span>
      </div>

      {/* Approvers label + chip input box */}
      <div className="px-[20px] pb-[20px]">
        <div className="mb-[6px]">
          <span className="text-[12px] text-gray-100 dark:text-gray-90">Approvers<span className="text-red-100">*</span></span>
        </div>

        {/* Chip input area */}
        <div className="relative">
          <div
            ref={chipAreaRef}
            className="flex flex-wrap items-center gap-[6px] min-h-[44px] px-[8px] py-[6px] border border-new-selected-color dark:border-gray-600 bg-white dark:bg-gray-700 rounded-[6px] cursor-text focus-within:border-blue-100 dark:focus-within:border-blue-80 transition-colors"
            onClick={() => { if (!showDropdown && available.length > 0) setShowDropdown(true); }}
          >
            {step.approvers.map(a => (
              <ApproverChip key={a.id} approver={a} onRemove={() => removeApprover(a.id)} />
            ))}
            {/* Blinking cursor input */}
            <input
              type="text"
              className="outline-none border-none bg-transparent text-[13px] text-gray-900 dark:text-gray-2000 placeholder-gray-70 dark:placeholder:text-gray-90 min-w-[40px] flex-1"
              placeholder={step.approvers.length === 0 ? 'Aa' : ''}
              onFocus={() => { if (available.length > 0) setShowDropdown(true); }}
              readOnly
            />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <ApproverDropdown
              available={available}
              onAdd={addApprover}
              onClose={() => setShowDropdown(false)}
            />
          )}
        </div>

        {/* Approvers left + subtle coverage hint */}
        <div className="mt-[6px] flex items-center justify-between">
          <span className="text-[12px] text-gray-80 dark:text-gray-90">
            {approversLeft} approver{approversLeft !== 1 ? 's' : ''} left
          </span>
          {!covered && step.approvers.length > 0 && (
            <span className="flex items-center gap-[4px] text-[12px] text-yellow-100">
              <AlertTriangle size={12} />
              Add an all-locations approver to avoid unattended posts
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Workflow Editor ────────────────────────────────────────────────────────────

function WorkflowEditor({ workflow, onBack }: { workflow: Workflow; onBack: () => void }) {
  const [name, setName] = useState(workflow.name);
  const [editingName, setEditingName] = useState(false);
  const [steps, setSteps] = useState<Step[]>(DEFAULT_STEPS);
  const [saved, setSaved] = useState(false);
  const [showCoverageWarning, setShowCoverageWarning] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const allStepsCovered = steps.every(hasAllLocationsApprover);

  const updateStep = (id: number, updated: Step) => {
    setSteps(prev => prev.map(s => s.id === id ? updated : s));
  };

  const deleteStep = (id: number) => {
    setSteps(prev => prev.filter(s => s.id !== id));
  };

  const addStep = () => {
    if (steps.length >= 10) return;
    const newId = Math.max(...steps.map(s => s.id), 0) + 1;
    setSteps(prev => [...prev, { id: newId, name: `Step ${newId}`, approvers: [], requireMode: 'any' }]);
  };

  const handleSave = () => {
    if (!allStepsCovered && !showCoverageWarning) {
      // First click: surface the warning, don't block
      setShowCoverageWarning(true);
      return;
    }
    setSaved(true);
    setShowCoverageWarning(false);
    setTimeout(() => { setSaved(false); onBack(); }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-700 transition-colors duration-300">
      {/* Breadcrumb + header row */}
      <div className="border-b border-comparison-0-star dark:border-gray-600 px-[24px] shrink-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-[6px] pt-[12px] pb-[4px]">
          <button
            onClick={onBack}
            className="text-[13px] text-blue-100 dark:text-blue-80 hover:underline"
          >
            Approvals
          </button>
          <ChevronDown size={13} className="text-gray-80 dark:text-gray-90 -rotate-90" />
          <span className="text-[13px] text-blue-100 dark:text-blue-80">{name}</span>
        </div>

        {/* Title + actions */}
        <div className="flex items-center justify-between py-[10px]">
          <div className="flex items-center gap-[8px]">
            {editingName ? (
              <input
                ref={nameRef}
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingName(false); }}
                className="font-normal text-[22px] text-gray-900 dark:text-gray-2000 border-b-2 border-blue-100 dark:border-blue-80 outline-none bg-transparent"
                style={{ fontVariationSettings: "'wdth' 100" }}
              />
            ) : (
              <h1
                className="font-normal text-[22px] text-gray-900 dark:text-gray-2000 tracking-[-0.44px]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                {name}
              </h1>
            )}
            <button
              className="text-gray-80 dark:text-gray-90 hover:text-blue-100 dark:hover:text-blue-80 mt-[2px]"
              onClick={() => { setEditingName(true); setTimeout(() => nameRef.current?.focus(), 0); }}
            >
              <Pencil size={16} />
            </button>
          </div>

          <div className="flex items-center gap-[8px]">
            {saved && (
              <span className="text-[13px] text-green-100 flex items-center gap-[4px]">
                <Check size={14} /> Saved
              </span>
            )}
            {/* Subtle coverage warning — only shown on first save attempt if gaps exist */}
            {showCoverageWarning && !saved && (
              <span className="text-[12px] text-yellow-100 flex items-center gap-[4px]">
                <AlertTriangle size={13} />
                Some steps may leave posts unattended. Save anyway?
              </span>
            )}
            <button
              onClick={handleSave}
              className="h-[36px] px-[20px] rounded-[4px] bg-blue-100 text-[14px] text-white hover:bg-blue-200 transition-colors"
            >
              {showCoverageWarning ? 'Save anyway' : 'Save'}
            </button>
            <button className="h-[36px] w-[36px] flex items-center justify-center rounded-[4px] border border-new-selected-color dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-20 dark:hover:bg-gray-600">
              <MoreVertical size={16} className="text-gray-300 dark:text-gray-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-[24px] py-[20px] bg-gray-10 dark:bg-gray-800">
        <div className="max-w-[860px] mx-auto flex flex-col gap-[12px]">
          {steps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              stepIndex={i}
              onUpdate={updated => updateStep(step.id, updated)}
              onDelete={() => deleteStep(step.id)}
              canDelete={steps.length > 1}
            />
          ))}

          {/* Add step button */}
          {steps.length < 10 && (
            <button
              onClick={addStep}
              className="flex items-center gap-[10px] w-full px-[20px] py-[14px] border border-dashed border-gray-60 dark:border-gray-600 rounded-[8px] text-blue-100 dark:text-blue-80 hover:border-blue-100 dark:hover:border-blue-80 hover:bg-blue-10 dark:hover:bg-blue-500 transition-colors"
            >
              <div className="w-[22px] h-[22px] rounded-full border-2 border-blue-100 dark:border-blue-80 flex items-center justify-center shrink-0">
                <Plus size={13} strokeWidth={2.5} />
              </div>
              <span className="text-[14px]">Add step</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Workflow List ──────────────────────────────────────────────────────────────

type ApprovalListState = "live" | "loading" | "error" | "empty";
const approvalColumn = createColumnHelper<Workflow>();
const approvalColumns = [
  approvalColumn.accessor("name", {
    id: "name",
    header: "Name",
    meta: { settingsLabel: "Name" },
    size: 300,
    enableSorting: true,
    cell: (info) => <span className="truncate font-medium">{info.getValue()}</span>,
  }),
  approvalColumn.accessor("status", {
    id: "status",
    header: "Status",
    meta: { settingsLabel: "Status" },
    size: 160,
    enableSorting: true,
    cell: (info) => (
      <Badge variant={info.getValue() === "Enabled" ? "success" : "outline"}>
        {info.getValue()}
      </Badge>
    ),
  }),
  approvalColumn.accessor("lastUpdated", {
    id: "lastUpdated",
    header: "Last updated",
    meta: { settingsLabel: "Last updated" },
    size: 180,
    enableSorting: true,
  }),
  approvalColumn.accessor("updatedBy", {
    id: "updatedBy",
    header: "Updated by",
    meta: { settingsLabel: "Updated by" },
    size: 180,
    enableSorting: true,
  }),
  approvalColumn.display({
    id: "actions",
    header: "",
    size: 64,
    cell: () => (
      <Button variant="ghost" size="iconXs" className="text-muted-foreground">
        <MoreVertical size={14} />
      </Button>
    ),
    meta: { stopRowClick: true, settingsLabel: "Actions" },
    enableSorting: false,
    enableResizing: false,
  }),
];

function WorkflowList({ onEdit, onCreate }: { onEdit: (wf: Workflow) => void; onCreate: () => void }) {
  const [workflows] = useState(WORKFLOWS);
  const [search, setSearch] = useState("");
  const [listState, setListState] = useState<ApprovalListState>("live");
  const showStateControls = import.meta.env.DEV;

  const baseRows = listState === "empty" ? [] : workflows;
  const filtered = baseRows.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()));
  const isFilteredEmpty = listState === "live" && baseRows.length > 0 && filtered.length === 0;

  return (
    <div className="flex h-full flex-col bg-background transition-colors duration-300">
      <div className={`${MAIN_VIEW_HEADER_BAND_CLASS} border-b border-border`}>
        <div>
          <h1 className={MAIN_VIEW_PRIMARY_HEADING_CLASS}>{workflows.length} Approvals</h1>
          <p className="text-xs text-muted-foreground">Approval workflow directory</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm sm:w-[220px]"
              placeholder="Search workflows..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Button onClick={onCreate} size="sm">
            Create approval
          </Button>
          {showStateControls ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setListState("live")}>Live</Button>
              <Button variant="outline" size="sm" onClick={() => setListState("loading")}>Loading</Button>
              <Button variant="outline" size="sm" onClick={() => setListState("error")}>Error</Button>
              <Button variant="outline" size="sm" onClick={() => setListState("empty")}>Empty</Button>
            </>
          ) : null}
          <Button variant="outline" size="icon" className="h-9 w-9"><SlidersHorizontal size={16} /></Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 bg-muted/20 py-4">
        {listState === "loading" ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
            Loading approval workflows...
          </div>
        ) : listState === "error" ? (
          <div className="flex h-[260px] flex-col items-center justify-center gap-2">
            <Badge variant="destructive"><AlertTriangle size={12} />Unable to load workflows</Badge>
            <Button size="sm" onClick={() => setListState("live")}>Retry</Button>
          </div>
        ) : isFilteredEmpty ? (
          <div className="flex h-[260px] flex-col items-center justify-center gap-2">
            <p className="text-sm text-foreground">No workflows match your search</p>
            <p className="text-xs text-muted-foreground">Try a different query or reset the filter.</p>
          </div>
        ) : (
          <AppDataTable<Workflow>
            tableId="social.approvals.workflows"
            persist={false}
            rowDensity="default"
            columns={approvalColumns}
            data={filtered}
            onRowClick={onEdit}
            stickyLeadingColumnCount={1}
            emptyState={
              <div className="flex h-[260px] flex-col items-center justify-center gap-2">
                <p className="text-sm text-foreground">No approval workflows yet</p>
                <p className="text-xs text-muted-foreground">Create one to start routing post approvals.</p>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────

export function ApprovalsSetupView() {
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

  const newWorkflow: Workflow = {
    id: 'new',
    name: 'New workflow',
    status: 'Disabled',
    lastUpdated: 'Today',
    updatedBy: 'You',
  };

  if (editingWorkflow) {
    return (
      <WorkflowEditor
        workflow={editingWorkflow}
        onBack={() => setEditingWorkflow(null)}
      />
    );
  }

  return (
    <WorkflowList
      onEdit={setEditingWorkflow}
      onCreate={() => setEditingWorkflow(newWorkflow)}
    />
  );
}
