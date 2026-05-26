import React, { useMemo, useState, useRef, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowLeft, AtSign, Bot, CalendarDays, CalendarPlus, CheckCircle2, ChevronDown, Clock, Eye, History, Image as ImageIcon, MessageSquare, MoreVertical, Paperclip, Pencil, Phone, Send, SlidersHorizontal, User } from "lucide-react";
import { Button, buttonVariants } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";
import { Badge } from "@/app/components/ui/badge";
import { AppDataTable } from "@/app/components/ui/AppDataTable";
import { AppDataTableColumnSettingsTrigger } from "@/app/components/ui/AppDataTableColumnSettingsTrigger";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { FilterPane, FilterPaneTriggerButton } from "@/app/components/FilterPane";
import type { FilterItem } from "@/app/components/FilterPanel.v1";
import { filterValue, cloneFilterItems } from "@/app/data/filterUtils";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/app/components/ui/sheet";
import {
  FLOATING_SHEET_FRAME_CONTENT_CLASS,
  FloatingSheetFrame,
} from "@/app/components/layout/FloatingSheetFrame";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Separator } from "@/app/components/ui/separator";
import { Calendar } from "@/app/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Switch } from "@/app/components/ui/switch";
import { KpiValue } from "@/app/components/KpiValue";
import { APP_DATA_TABLE_PRIMARY_ROW_LABEL_CLASS } from "@/app/components/ui/appDataTableCellClasses";
import { WaitlistSmsCard } from "@/app/components/inbox/WaitlistSmsCard";
import {
  SARAH_MITCHELL_CONVERSATION,
  WAITLIST_DATE_BREAKS,
  buildPatientConversation,
  ensureConversation,
  useWaitlistConversation,
  type WaitlistChatMessage,
} from "@/app/components/waitlistConversationMockData";

/* Scrollable select content — native scrollbar, no chevron scroll buttons */
function ScrollableSelectContent({
  children,
  maxHeightPx = 204,
}: {
  children: React.ReactNode;
  maxHeightPx?: number;
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={4}
        className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 w-[var(--radix-select-trigger-width)]"
      >
        <SelectPrimitive.Viewport
          className="p-1 overflow-y-auto"
          style={{ maxHeight: maxHeightPx }}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  MAIN_VIEW_HEADER_BAND_CLASS,
  MAIN_VIEW_HEADER_ACTIONS_CLUSTER_CLASS,
  MAIN_VIEW_PRIMARY_HEADING_CLASS,
} from "@/app/components/layout/mainViewTitleClasses";

/* ─── Types ─── */
type WaitlistStatus = "pending" | "agent_called" | "slot_offered" | "accepted" | "declined";
type AppointmentType = "cleaning" | "new_patient" | "root_canal";
type SlotPreference = "morning" | "afternoon" | "anytime" | "evening";

interface WaitlistPatient {
  id: string;
  patient: string;
  contact: string;
  location: string;
  provider: string;
  type: AppointmentType;
  slotPreference: SlotPreference;
  wait: string;
  status: WaitlistStatus;
  /** "Waitlist agent" for auto-offers, or staff name for manual offers */
  slotOfferedBy?: string;
  /** Actual offered/booked datetime — set when OfferSlotDrawer confirms */
  slotDatetime?: string;
}

/* ─── Config maps ─── */
const STATUS_CONFIG: Record<WaitlistStatus, { label: string; className: string }> = {
  pending:      { label: "Pending",      className: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  agent_called: { label: "Agent called", className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  slot_offered: { label: "Slot offered", className: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
  accepted:     { label: "Accepted",     className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  declined:     { label: "Declined",     className: "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400" },
};

const TYPE_CONFIG: Record<AppointmentType, { label: string; className: string }> = {
  cleaning:     { label: "Cleaning",           className: "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400" },
  new_patient:  { label: "New patient",         className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  root_canal:   { label: "Root canal cleaning", className: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
};

const SLOT_CONFIG: Record<SlotPreference, { label: string; className: string }> = {
  morning:   { label: "Morning",   className: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400" },
  afternoon: { label: "Afternoon", className: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  anytime:   { label: "Anytime",   className: "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400" },
  evening:   { label: "Evening",   className: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400" },
};

/* ─── Filter definitions ─── */
const WAITLIST_FILTER_ITEMS: FilterItem[] = [
  {
    id: "waitlist_status",
    label: "Status",
    options: ["All statuses", "Pending", "Agent called", "Slot offered", "Accepted", "Declined"],
  },
  {
    id: "waitlist_provider",
    label: "Provider",
    options: ["All providers", "Dr. Karen Lee", "Dr. Alan Patel", "Dr. Nina Brooks", "Dr. Marcus Webb"],
  },
  {
    id: "waitlist_slot",
    label: "Slot Preference",
    options: ["All preferences", "Morning", "Afternoon", "Evening", "Anytime"],
  },
  {
    id: "waitlist_location",
    label: "Location",
    options: [
      "All locations",
      "San Francisco, CA", "Chicago, IL", "Houston, TX", "Seattle, WA",
      "Phoenix, AZ", "Portland, OR", "Miami, FL", "Boston, MA",
      "Atlanta, GA", "Las Vegas, NV", "Dallas, TX", "Denver, CO",
    ],
  },
];

/* ─── Mock data ─── */
const WAITLIST: WaitlistPatient[] = [
  { id: "w1",  patient: "Sarah Mitchell",    contact: "(415) 203-8821", location: "San Francisco, CA", provider: "Dr. Karen Lee",   type: "cleaning",    slotPreference: "morning",   wait: "Apr 28, 2026", status: "pending" },
  { id: "w2",  patient: "James Thornton",    contact: "(312) 554-0192", location: "Chicago, IL",       provider: "Dr. Alan Patel",  type: "new_patient", slotPreference: "anytime",   wait: "Apr 25, 2026", status: "agent_called" },
  { id: "w3",  patient: "Emily Rodriguez",   contact: "(713) 847-3310", location: "Houston, TX",       provider: "Dr. Nina Brooks", type: "root_canal",  slotPreference: "afternoon", wait: "Apr 22, 2026", status: "slot_offered", slotOfferedBy: "Waitlist agent", slotDatetime: "May 12, 2026 · 11:00 AM" },
  { id: "w4",  patient: "David Kim",         contact: "(206) 991-4452", location: "Seattle, WA",       provider: "Dr. Karen Lee",   type: "cleaning",    slotPreference: "morning",   wait: "Apr 30, 2026", status: "pending" },
  { id: "w5",  patient: "Olivia Bennett",    contact: "(602) 318-7723", location: "Phoenix, AZ",       provider: "Dr. Marcus Webb", type: "new_patient", slotPreference: "evening",   wait: "Apr 20, 2026", status: "agent_called" },
  { id: "w6",  patient: "Michael Torres",    contact: "(503) 672-9934", location: "Portland, OR",      provider: "Dr. Alan Patel",  type: "cleaning",    slotPreference: "anytime",   wait: "May 1, 2026",  status: "pending" },
  { id: "w7",  patient: "Ava Nguyen",        contact: "(305) 214-6678", location: "Miami, FL",         provider: "Dr. Nina Brooks", type: "root_canal",  slotPreference: "morning",   wait: "Apr 18, 2026", status: "accepted",     slotOfferedBy: "Sarah Chen",    slotDatetime: "May 10, 2026 · 9:00 AM" },
  { id: "w8",  patient: "Liam Walker",       contact: "(617) 443-5520", location: "Boston, MA",        provider: "Dr. Marcus Webb", type: "new_patient", slotPreference: "afternoon", wait: "Apr 27, 2026", status: "pending" },
  { id: "w9",  patient: "Sophia Patel",      contact: "(404) 788-1123", location: "Atlanta, GA",       provider: "Dr. Karen Lee",   type: "cleaning",    slotPreference: "morning",   wait: "May 2, 2026",  status: "pending" },
  { id: "w10", patient: "Noah Anderson",     contact: "(702) 931-2245", location: "Las Vegas, NV",     provider: "Dr. Alan Patel",  type: "root_canal",  slotPreference: "anytime",   wait: "Apr 24, 2026", status: "agent_called" },
  { id: "w11", patient: "Isabella Martin",   contact: "(214) 560-8834", location: "Dallas, TX",        provider: "Dr. Nina Brooks", type: "new_patient", slotPreference: "evening",   wait: "Apr 19, 2026", status: "declined",     slotOfferedBy: "Waitlist agent", slotDatetime: "May 8, 2026 · 5:30 PM" },
  { id: "w12", patient: "Ethan Johnson",     contact: "(720) 345-6612", location: "Denver, CO",        provider: "Dr. Marcus Webb", type: "cleaning",    slotPreference: "afternoon", wait: "May 3, 2026",  status: "pending" },
  { id: "w13", patient: "Chloe Harris",      contact: "(619) 882-3341", location: "San Diego, CA",     provider: "Dr. Karen Lee",   type: "new_patient", slotPreference: "morning",   wait: "Apr 17, 2026", status: "pending" },
  { id: "w14", patient: "Mason Clark",       contact: "(612) 774-9920", location: "Minneapolis, MN",   provider: "Dr. Alan Patel",  type: "cleaning",    slotPreference: "afternoon", wait: "Apr 21, 2026", status: "accepted",     slotOfferedBy: "Waitlist agent", slotDatetime: "May 15, 2026 · 1:00 PM" },
  { id: "w15", patient: "Amelia Scott",      contact: "(816) 345-6671", location: "Kansas City, MO",   provider: "Dr. Nina Brooks", type: "root_canal",  slotPreference: "anytime",   wait: "May 4, 2026",  status: "pending" },
  { id: "w16", patient: "Lucas Green",       contact: "(901) 223-8812", location: "Memphis, TN",       provider: "Dr. Marcus Webb", type: "cleaning",    slotPreference: "evening",   wait: "Apr 23, 2026", status: "agent_called" },
  { id: "w17", patient: "Harper Lewis",      contact: "(602) 441-7703", location: "Scottsdale, AZ",    provider: "Dr. Karen Lee",   type: "new_patient", slotPreference: "morning",   wait: "Apr 16, 2026", status: "pending" },
  { id: "w18", patient: "Benjamin Hall",     contact: "(503) 889-5540", location: "Eugene, OR",        provider: "Dr. Alan Patel",  type: "root_canal",  slotPreference: "afternoon", wait: "May 5, 2026",  status: "slot_offered", slotOfferedBy: "Waitlist agent" },
  { id: "w19", patient: "Mia Young",         contact: "(615) 332-4490", location: "Nashville, TN",     provider: "Dr. Nina Brooks", type: "cleaning",    slotPreference: "anytime",   wait: "Apr 26, 2026", status: "pending" },
  { id: "w20", patient: "Elijah Adams",      contact: "(702) 661-2238", location: "Henderson, NV",     provider: "Dr. Marcus Webb", type: "new_patient", slotPreference: "morning",   wait: "Apr 15, 2026", status: "agent_called" },
  { id: "w21", patient: "Charlotte Baker",   contact: "(347) 554-8801", location: "Brooklyn, NY",      provider: "Dr. Karen Lee",   type: "cleaning",    slotPreference: "evening",   wait: "May 6, 2026",  status: "pending" },
  { id: "w22", patient: "Henry Carter",      contact: "(206) 778-3322", location: "Tacoma, WA",        provider: "Dr. Alan Patel",  type: "root_canal",  slotPreference: "morning",   wait: "Apr 29, 2026", status: "slot_offered", slotOfferedBy: "John Reynolds" },
  { id: "w23", patient: "Ella Mitchell",     contact: "(415) 990-6614", location: "Oakland, CA",       provider: "Dr. Nina Brooks", type: "new_patient", slotPreference: "afternoon", wait: "Apr 14, 2026", status: "pending" },
  { id: "w24", patient: "Alexander Perez",   contact: "(312) 667-4453", location: "Naperville, IL",    provider: "Dr. Marcus Webb", type: "cleaning",    slotPreference: "anytime",   wait: "May 7, 2026",  status: "agent_called" },
  { id: "w25", patient: "Scarlett Roberts",  contact: "(713) 223-9981", location: "Austin, TX",        provider: "Dr. Karen Lee",   type: "root_canal",  slotPreference: "morning",   wait: "Apr 13, 2026", status: "pending" },
  { id: "w26", patient: "Jack Turner",       contact: "(480) 334-7762", location: "Tempe, AZ",         provider: "Dr. Alan Patel",  type: "new_patient", slotPreference: "evening",   wait: "May 8, 2026",  status: "slot_offered", slotOfferedBy: "Waitlist agent" },
  { id: "w27", patient: "Penelope White",    contact: "(617) 882-5503", location: "Cambridge, MA",     provider: "Dr. Nina Brooks", type: "cleaning",    slotPreference: "afternoon", wait: "Apr 12, 2026", status: "pending" },
  { id: "w28", patient: "Sebastian Hill",    contact: "(404) 556-3317", location: "Savannah, GA",      provider: "Dr. Marcus Webb", type: "root_canal",  slotPreference: "morning",   wait: "May 9, 2026",  status: "agent_called" },
  { id: "w29", patient: "Layla Moore",       contact: "(720) 881-6640", location: "Aurora, CO",        provider: "Dr. Karen Lee",   type: "new_patient", slotPreference: "anytime",   wait: "Apr 11, 2026", status: "pending" },
  { id: "w30", patient: "Owen Jackson",      contact: "(214) 443-2275", location: "Fort Worth, TX",    provider: "Dr. Alan Patel",  type: "cleaning",    slotPreference: "morning",   wait: "May 10, 2026", status: "slot_offered", slotOfferedBy: "Waitlist agent" },
];

/* ─── Status sort order ─── */
const STATUS_SORT_ORDER: Record<WaitlistStatus, number> = {
  pending: 0,
  agent_called: 1,
  slot_offered: 2,
  accepted: 3,
  declined: 4,
};

/* ─── Column helper ─── */
const col = createColumnHelper<WaitlistPatient>();

const COLUMNS = [
  col.accessor("patient", {
    id: "patient",
    header: "Patient",
    meta: { settingsLabel: "Patient" },
    size: 200,
    minSize: 160,
    enableSorting: true,
    cell: (info) => {
      const name = info.getValue();
      const id   = info.row.original.id;
      // Patients: pravatar 1–30 only, so no overlap with provider pool
      const num  = ((parseInt(id.replace(/\D/g, "") || "1", 10) - 1) % 30) + 1;
      const parts = name.trim().split(/\s+/);
      const initials = parts.length === 1
        ? parts[0].slice(0, 2).toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return (
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={`https://i.pravatar.cc/40?img=${num}`} alt={name} />
            <AvatarFallback className="bg-primary/15 text-[10px] font-medium text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className={`truncate ${APP_DATA_TABLE_PRIMARY_ROW_LABEL_CLASS}`}>{name}</span>
        </div>
      );
    },
  }),
  col.accessor("type", {
    id: "type",
    header: "Type",
    meta: { settingsLabel: "Type" },
    size: 140,
    minSize: 120,
    enableSorting: true,
    sortingFn: (a, b) => TYPE_CONFIG[a.original.type].label.localeCompare(TYPE_CONFIG[b.original.type].label),
    cell: (info) => {
      const cfg = TYPE_CONFIG[info.getValue()];
      return <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>;
    },
  }),
  col.accessor("location", {
    id: "location",
    header: "Location",
    meta: { settingsLabel: "Location" },
    size: 160,
    minSize: 140,
    enableSorting: true,
    cell: (info) => (
      <span className="truncate text-foreground">{info.getValue()}</span>
    ),
  }),
  col.accessor("contact", {
    id: "contact",
    header: "Contact",
    meta: { settingsLabel: "Contact" },
    size: 148,
    minSize: 132,
    enableSorting: true,
    cell: (info) => (
      <span className="truncate text-[13px] text-foreground">{info.getValue()}</span>
    ),
  }),
  col.accessor("provider", {
    id: "provider",
    header: "Provider",
    meta: { settingsLabel: "Provider" },
    size: 148,
    minSize: 130,
    enableSorting: true,
    cell: (info) => (
      <span className="truncate text-foreground">{info.getValue()}</span>
    ),
  }),
  col.display({
    id: "slot",
    header: "Slot",
    meta: { settingsLabel: "Slot" },
    size: 180,
    minSize: 160,
    enableSorting: true,
    sortingFn: (a, b) => {
      const va = a.original.status !== "pending" && a.original.slotDatetime ? a.original.slotDatetime : SLOT_CONFIG[a.original.slotPreference].label;
      const vb = b.original.status !== "pending" && b.original.slotDatetime ? b.original.slotDatetime : SLOT_CONFIG[b.original.slotPreference].label;
      return va.localeCompare(vb);
    },
    cell: (info) => {
      const p = info.row.original;
      if (p.status !== "pending" && p.slotDatetime) {
        return <span className="truncate text-foreground text-[12px]">{p.slotDatetime}</span>;
      }
      return <span className="truncate text-muted-foreground">{SLOT_CONFIG[p.slotPreference].label} (pref)</span>;
    },
  }),
  col.display({
    id: "daysWaiting",
    header: "Days waiting",
    meta: { settingsLabel: "Days waiting" },
    size: 100,
    minSize: 88,
    enableSorting: true,
    sortingFn: (a, b) => {
      const daysA = Math.floor((Date.now() - Date.parse(a.original.wait)) / 86_400_000);
      const daysB = Math.floor((Date.now() - Date.parse(b.original.wait)) / 86_400_000);
      return daysA - daysB;
    },
    cell: (info) => {
      const days = Math.floor((Date.now() - Date.parse(info.row.original.wait)) / 86_400_000);
      const cls = days < 7
        ? "text-emerald-600 dark:text-emerald-400"
        : days <= 30
          ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400 font-medium";
      return <span className={cls}>{days}d</span>;
    },
  }),
  col.accessor("wait", {
    id: "wait",
    header: "Wait since",
    meta: { settingsLabel: "Wait since" },
    size: 120,
    minSize: 104,
    enableSorting: true,
    sortingFn: (a, b) => new Date(a.original.wait).getTime() - new Date(b.original.wait).getTime(),
    cell: (info) => (
      <span className="truncate text-foreground">{info.getValue()}</span>
    ),
  }),
];

const STATUS_COLUMN = col.accessor("status", {
  id: "status",
  header: "Status",
  meta: { settingsLabel: "Status" },
  size: 128,
  minSize: 112,
  enableResizing: false,
  sortingFn: (a, b) => STATUS_SORT_ORDER[a.original.status] - STATUS_SORT_ORDER[b.original.status],
  cell: (info) => {
    const cfg = STATUS_CONFIG[info.getValue()];
    return (
      <Badge variant="outline" className={cfg.className}>
        {cfg.label}
      </Badge>
    );
  },
});

/* ─── Add Patient Drawer ─── */
function formatToday(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AddPatientDrawer({
  open,
  onClose,
  onAdd,
  onSaveEdit,
  editPatient,
}: {
  open: boolean;
  onClose: () => void;
  onAdd?: (patient: WaitlistPatient) => void;
  onSaveEdit?: (patient: WaitlistPatient) => void;
  editPatient?: WaitlistPatient;
}) {
  const isEdit = editPatient != null;

  const [name, setName]         = useState(editPatient?.patient ?? "");
  const [phone, setPhone]       = useState(editPatient?.contact ?? "");
  const [location, setLocation] = useState(editPatient?.location === "—" ? "" : (editPatient?.location ?? ""));
  const [provider, setProvider] = useState(editPatient?.provider === "—" ? "" : (editPatient?.provider ?? ""));
  const [slot, setSlot]         = useState<SlotPreference | "">(editPatient?.slotPreference ?? "");

  function reset() {
    setName(""); setPhone(""); setLocation(""); setProvider(""); setSlot("");
  }

  function handleSave() {
    if (!name.trim()) return;
    if (isEdit && editPatient) {
      onSaveEdit?.({
        ...editPatient,
        patient: name.trim(),
        contact: phone.trim(),
        location: location.trim() || "—",
        provider: provider || "—",
        slotPreference: (slot as SlotPreference) || editPatient.slotPreference,
      });
    } else {
      onAdd?.({
        id: `w-${Date.now()}`,
        patient: name.trim(),
        contact: phone.trim(),
        location: location.trim() || "—",
        provider: provider || "—",
        type: "new_patient",
        slotPreference: (slot as SlotPreference) || "anytime",
        wait: formatToday(),
        status: "pending",
      });
    }
    if (!isEdit) reset();
    onClose();
  }

  function handleClose() {
    if (!isEdit) reset();
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" inset="floating" floatingSize="md" className={FLOATING_SHEET_FRAME_CONTENT_CLASS}>
        <FloatingSheetFrame
          title={isEdit ? "Edit patient" : "Add patient"}
          description={isEdit ? "Update the patient's waitlist details." : "Fill in the details to add a patient to the waitlist."}
          primaryAction={{ label: isEdit ? "Save changes" : "Add to waitlist", onClick: handleSave, disabled: !name.trim() }}
          secondaryAction={{ label: "Cancel", onClick: handleClose }}
          secondaryUsesSheetClose
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="ap-name" className="text-[12px] text-gray-900">Patient name</Label>
              <Input
                id="ap-name"
                placeholder="e.g. Sarah Mitchell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 rounded px-3 !text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="ap-phone" className="text-[12px] text-gray-900">Phone number</Label>
              <Input
                id="ap-phone"
                type="tel"
                placeholder="e.g. (415) 203-8821"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 rounded px-3 !text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="ap-location" className="text-[12px] text-gray-900">Location</Label>
              <Input
                id="ap-location"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-9 rounded px-3 !text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-[12px] text-gray-900">Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="h-9 rounded px-3 !text-sm">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Karen Lee">Dr. Karen Lee</SelectItem>
                  <SelectItem value="Dr. Alan Patel">Dr. Alan Patel</SelectItem>
                  <SelectItem value="Dr. Nina Brooks">Dr. Nina Brooks</SelectItem>
                  <SelectItem value="Dr. Marcus Webb">Dr. Marcus Webb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-[12px] text-gray-900">Slot preference</Label>
              <Select value={slot} onValueChange={setSlot}>
                <SelectTrigger className="h-9 rounded px-3 !text-sm">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FloatingSheetFrame>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Patient Quick View Drawer ─── */
function patientInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* Provider photos — randomuser.me professional portraits, gender-aware.
   Completely separate pool from patient pravatar images. */
const PROVIDER_PHOTO_MAP: Record<string, string> = {
  "Dr. Karen Lee":         "https://randomuser.me/api/portraits/women/44.jpg",
  "Dr. Alan Patel":        "https://randomuser.me/api/portraits/men/46.jpg",
  "Dr. Nina Brooks":       "https://randomuser.me/api/portraits/women/65.jpg",
  "Dr. Marcus Webb":       "https://randomuser.me/api/portraits/men/32.jpg",
  "Dr. Sarah Chen":        "https://randomuser.me/api/portraits/women/30.jpg",
  "Dr. Priya Nair":        "https://randomuser.me/api/portraits/women/55.jpg",
  "Dr. Thomas Chen":       "https://randomuser.me/api/portraits/men/51.jpg",
  "Amara Diallo, NP":      "https://randomuser.me/api/portraits/women/48.jpg",
  "Dr. Robert Kim":        "https://randomuser.me/api/portraits/men/62.jpg",
  "Dr. Fatima Al-Hassan":  "https://randomuser.me/api/portraits/women/68.jpg",
  "Dr. David Morales":     "https://randomuser.me/api/portraits/men/78.jpg",
  "Dr. Lisa Kowalski":     "https://randomuser.me/api/portraits/women/22.jpg",
  "Dr. Raj Sharma":        "https://randomuser.me/api/portraits/men/81.jpg",
  "Dr. Nina Johansson":    "https://randomuser.me/api/portraits/women/36.jpg",
  "Dr. Keisha Washington": "https://randomuser.me/api/portraits/women/72.jpg",
  "Dr. Carmen Herrera":    "https://randomuser.me/api/portraits/women/60.jpg",
  "Dr. Samuel Osei":       "https://randomuser.me/api/portraits/men/88.jpg",
  "Dr. Aisha Bangura":     "https://randomuser.me/api/portraits/women/84.jpg",
  "Dr. Wei Zhang":         "https://randomuser.me/api/portraits/men/75.jpg",
  "Dr. Ingrid Larsson":    "https://randomuser.me/api/portraits/women/91.jpg",
};

function providerPhotoUrl(name: string, size: 40 | 80 = 40): string {
  const url = PROVIDER_PHOTO_MAP[name];
  if (url) return url.replace("/portraits/", `/portraits/`);
  // fallback: derive from name hash, never overlapping pravatar
  const idx = (name.charCodeAt(0) + name.length) % 30 + 40;
  const gender = ["Lee","Brooks","Chen","Nair","Kowalski","Washington","Herrera","Bangura","Larsson","Johansson"]
    .some(s => name.includes(s)) ? "women" : "men";
  return `https://randomuser.me/api/portraits/${gender}/${idx}.jpg`;
}

function PatientDetailDrawer({
  open,
  patient,
  onClose,
  onEdit,
  onOfferSlot,
  onMessage,
}: {
  open: boolean;
  patient: WaitlistPatient | null;
  onClose: () => void;
  onEdit: (p: WaitlistPatient) => void;
  onOfferSlot: (p: WaitlistPatient) => void;
  onMessage?: (p: WaitlistPatient) => void;
}) {
  if (!patient) return null;
  const statusCfg = STATUS_CONFIG[patient.status];

  // Intake form status — derived from patient id for mock consistency
  const intakeStatuses = ["completed", "pending", "not_sent"] as const;
  type IntakeStatus = typeof intakeStatuses[number];
  const intakeStatus: IntakeStatus = (["w1","w8","w9","w12","w15","w19","w21","w25","w27"].includes(patient.id))
    ? "completed"
    : (["w2","w5","w10","w16","w24"].includes(patient.id))
      ? "pending"
      : "not_sent";

  const INTAKE_CFG: Record<IntakeStatus, { label: string; cls: string }> = {
    completed: { label: "Completed",  cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    pending:   { label: "Sent · pending", cls: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
    not_sent:  { label: "Not sent",    cls: "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400" },
  };

  const avatarNum = ((parseInt(patient.id.replace(/\D/g, "") || "1", 10) - 1) % 30) + 1;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" inset="floating" floatingSize="md" className={FLOATING_SHEET_FRAME_CONTENT_CLASS}>
        <div className="flex h-full flex-col overflow-hidden">

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto">

            {/* ── Cover band ── */}
            <div className="relative">
              {/* Gradient cover — soft blue/teal → cream, no decoration */}
              <div
                className="h-[120px] w-full"
                style={{
                  background: "linear-gradient(135deg, hsl(200 60% 88%) 0%, hsl(180 40% 92%) 40%, hsl(80 30% 94%) 100%)",
                }}
              />
              {/* Close button — top right */}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex size-6 items-center justify-center rounded-md text-foreground/50 hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* ── Avatar + identity row — Mobbin-style ── */}
            <div className="flex items-end justify-between px-5 pb-4">
              {/* Avatar overlapping the cover */}
              <div className="-mt-9">
                <Avatar className="size-[72px] border-4 border-background shadow-sm">
                  <AvatarImage src={`https://i.pravatar.cc/80?img=${avatarNum}`} alt={patient.patient} />
                  <AvatarFallback className="bg-primary/15 text-[15px] font-medium text-primary">
                    {patientInitials(patient.patient)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Actions — right side, same row */}
              <div className="flex items-center gap-2 pb-1">
                <Button type="button" size="icon" variant="outline" className="size-9 rounded-md" aria-label="Message"
                  onClick={() => { onClose(); onMessage?.(patient!); }}>
                  <MessageSquare className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
                </Button>
                <Button type="button" size="icon" variant="outline" className="size-9 rounded-md" aria-label="Call">
                  <Phone className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
                </Button>
                <Button type="button" size="icon" variant="outline" className="size-9 rounded-md" aria-label="More">
                  <MoreVertical className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
                </Button>
              </div>
            </div>

            {/* Name + subtitle */}
            <div className="flex flex-col gap-0.5 px-5 pb-4">
              <p className="text-[17px] font-semibold text-foreground">{patient.patient}</p>
              <p className="text-[13px] text-muted-foreground">
                {patient.location} · {TYPE_CONFIG[patient.type].label}
              </p>
            </div>

            <div className="flex flex-col gap-6 px-5 pb-6">

            {/* Details */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {/* Status — full width (has badge + sub-line) */}
              <div className="col-span-2 flex flex-col gap-1">
                <dt className="text-[12px] text-muted-foreground">Status</dt>
                <dd className="flex flex-col gap-1">
                  <Badge variant="outline" className={statusCfg.className}>
                    {statusCfg.label}
                  </Badge>
                  {patient.status === "slot_offered" && patient.slotOfferedBy && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      {patient.slotOfferedBy === "Waitlist agent" ? (
                        <Bot size={12} className="text-primary shrink-0" />
                      ) : (
                        <User size={12} className="text-muted-foreground shrink-0" />
                      )}
                      Offered by{" "}
                      <span className={patient.slotOfferedBy === "Waitlist agent" ? "text-primary font-medium" : "text-foreground font-medium"}>
                        {patient.slotOfferedBy}
                      </span>
                    </span>
                  )}
                </dd>
              </div>
              {/* 2-column pairs */}
              <div className="flex flex-col gap-0.5">
                <dt className="text-[12px] text-muted-foreground">Location</dt>
                <dd className="text-[13px] text-foreground">{patient.location}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-[12px] text-muted-foreground">Provider</dt>
                <dd className="text-[13px] text-foreground">{patient.provider}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-[12px] text-muted-foreground">Type</dt>
                <dd className="text-[13px] text-foreground">{TYPE_CONFIG[patient.type].label}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-[12px] text-muted-foreground">Slot preference</dt>
                <dd className="text-[13px] text-foreground">{SLOT_CONFIG[patient.slotPreference].label}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-[12px] text-muted-foreground">Wait since</dt>
                <dd className="text-[13px] text-foreground">{patient.wait}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-[12px] text-muted-foreground">Contact</dt>
                <dd className="text-[13px] text-foreground">{patient.contact || "—"}</dd>
              </div>
            </dl>

            {/* Intake form — action card */}
            <div className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
              intakeStatus === "completed"
                ? "bg-emerald-50 dark:bg-emerald-950/30"
                : intakeStatus === "pending"
                  ? "bg-blue-50 dark:bg-blue-950/30"
                  : "bg-muted/60"
            }`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] text-muted-foreground">Intake form</span>
                <span className={`text-[13px] font-medium ${
                  intakeStatus === "completed" ? "text-emerald-700 dark:text-emerald-400"
                  : intakeStatus === "pending"  ? "text-blue-700 dark:text-blue-400"
                  : "text-foreground"
                }`}>
                  {INTAKE_CFG[intakeStatus].label}
                </span>
              </div>
              {intakeStatus !== "completed" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-[12px]"
                  onClick={() => toast(
                    intakeStatus === "not_sent"
                      ? `Intake form sent to ${patient.patient}.`
                      : `Reminder sent to ${patient.patient}.`,
                    { icon: <CheckCircle2 size={16} className="text-green-500" /> }
                  )}
                >
                  {intakeStatus === "not_sent" ? "Send" : "Remind"}
                </Button>
              )}
            </div>
            </div>{/* end px-5 pb-6 */}
          </div>{/* end scrollable body */}

          {/* ── Sticky footer ── */}
          <div className="shrink-0 border-t border-border px-5 py-4">
            <div className="flex w-full gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => { onClose(); onEdit(patient); }}>
                Edit patient
              </Button>
              <Button type="button" className="flex-1" onClick={() => { onClose(); onOfferSlot(patient); }}>
                Offer slot
              </Button>
            </div>
          </div>

        </div>{/* end flex h-full */}
      </SheetContent>
    </Sheet>
  );
}

/* ─── Offer Slot Drawer ─── */
function OfferSlotDrawer({
  open,
  patient,
  onClose,
  onConfirm,
}: {
  open: boolean;
  patient: WaitlistPatient | null;
  onClose: () => void;
  onConfirm: (patientId: string) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [time, setTime]       = useState("");
  const [provider, setProvider] = useState(patient?.provider && patient.provider !== "—" ? patient.provider : "");
  const [calOpen, setCalOpen] = useState(false);

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  function handleConfirm() {
    if (!patient) return;
    onConfirm(patient.id);
    setSelectedDate(undefined); setTime(""); setProvider("");
    onClose();
  }

  const ALL_TIMES = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM",
    "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM",
  ];

  const TIME_OPTIONS = (() => {
    const pref = patient?.slotPreference;
    if (pref === "morning")   return ALL_TIMES.filter((t) => t.includes("AM"));
    if (pref === "afternoon") return ALL_TIMES.filter((t) => t.includes("PM") && parseInt(t) < 5);
    if (pref === "evening")   return ALL_TIMES.filter((t) => t.includes("PM") && parseInt(t) >= 5);
    return ALL_TIMES; // anytime
  })();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" inset="floating" floatingSize="md" className={FLOATING_SHEET_FRAME_CONTENT_CLASS}>
        <FloatingSheetFrame
          title="Offer slot"
          description={patient ? `Offer an appointment slot to ${patient.patient}.` : "Offer an appointment slot."}
          primaryAction={{ label: "Send offer", onClick: handleConfirm, disabled: !selectedDate || !time }}
          secondaryAction={{ label: "Cancel", onClick: onClose }}
          secondaryUsesSheetClose
        >
          <div className="flex flex-col gap-3">
            {/* Date — popover calendar */}
            <div className="flex flex-col gap-1">
              <Label className="text-[12px] text-gray-900">Date</Label>
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "border-input bg-input-background dark:bg-input/30 flex h-9 w-full items-center justify-between gap-2 rounded border px-3 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <span>{formattedDate || "Pick a date"}</span>
                    <ChevronDown className="size-4 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => { setSelectedDate(d); setCalOpen(false); }}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time — select */}
            <div className="flex flex-col gap-1">
              <Label className="text-[12px] text-gray-900">Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-9 rounded px-3 !text-sm">
                  <SelectValue placeholder="Pick a time" />
                </SelectTrigger>
                <ScrollableSelectContent maxHeightPx={204}>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </ScrollableSelectContent>
              </Select>
            </div>

            {/* Provider */}
            <div className="flex flex-col gap-1">
              <Label className="text-[12px] text-gray-900">Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="h-9 rounded px-3 !text-sm">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Karen Lee">Dr. Karen Lee</SelectItem>
                  <SelectItem value="Dr. Alan Patel">Dr. Alan Patel</SelectItem>
                  <SelectItem value="Dr. Nina Brooks">Dr. Nina Brooks</SelectItem>
                  <SelectItem value="Dr. Marcus Webb">Dr. Marcus Webb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Slot preference (read-only) */}
            <div className="flex flex-col gap-1">
              <Label className="text-[12px] text-gray-900">Slot preference</Label>
              <Input
                value={patient ? SLOT_CONFIG[patient.slotPreference].label : ""}
                readOnly
                className="h-9 cursor-default rounded px-3 text-[14px] text-muted-foreground"
              />
            </div>
          </div>
        </FloatingSheetFrame>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Sub-view types ─── */
type WaitlistSubView = "list";

/* ─── Location summary type ─── */
interface LocationSummary {
  name: string;
  patientCount: number;
  avgWaitDays: number;
  providers: string[];
}

const AGENT_OPTIONS = ["No agent assigned", "SF Slot-Fill Agent", "Chicago Auto-Fill", "Multi-site Agent", "Houston Draft"];

/* ─── LocationConfigSheet ─── */
function LocationConfigSheet({ summary, open, onClose }: { summary: LocationSummary | null; open: boolean; onClose: () => void }) {
  const [enabled, setEnabled]           = useState(true);
  const [sms, setSms]                   = useState(true);
  const [aiCall, setAiCall]             = useState(true);
  const [email, setEmail]               = useState(false);
  const [confirmHours, setConfirmHours] = useState(2);
  const [assignedAgent, setAssignedAgent] = useState(AGENT_OPTIONS[0]);

  if (!summary) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" inset="floating" floatingSize="md" className={FLOATING_SHEET_FRAME_CONTENT_CLASS}>
        <FloatingSheetFrame
          title={summary.name}
          description={`${summary.patientCount} patients · Avg ${summary.avgWaitDays} days wait`}
          primaryAction={{
            label: "Save changes",
            onClick: () => {
              toast("Location settings saved.", { icon: <CheckCircle2 size={16} className="text-green-500" /> });
              onClose();
            },
          }}
          secondaryAction={{ label: "Cancel", onClick: onClose }}
          secondaryUsesSheetClose
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-[13px] text-foreground">Waitlist enabled</Label>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <Label className="text-[12px] text-muted-foreground">Assigned agent</Label>
              <Select value={assignedAgent} onValueChange={setAssignedAgent}>
                <SelectTrigger className="h-9 rounded px-3 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGENT_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Label className="text-[12px] text-muted-foreground">Outreach</Label>
              {([["SMS", sms, setSms], ["AI phone call", aiCall, setAiCall], ["Email", email, setEmail]] as const).map(([label, val, setter]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-[13px] text-foreground">{label}</span>
                  <Switch checked={val as boolean} onCheckedChange={setter as (v: boolean) => void} />
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <Label className="text-[12px] text-muted-foreground">Confirmation window</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={72}
                  value={confirmHours}
                  onChange={e => setConfirmHours(Number(e.target.value))}
                  className="h-9 w-20 rounded px-3 text-sm"
                />
                <span className="text-[13px] text-muted-foreground">hours for patient to respond</span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <Label className="text-[12px] text-muted-foreground">Assigned providers</Label>
              <p className="text-[13px] text-foreground">{summary.providers.join(" · ")}</p>
            </div>
          </div>
        </FloatingSheetFrame>
      </SheetContent>
    </Sheet>
  );
}

/* ─── WaitlistLocationsView ─── */
function WaitlistLocationsView({ summaries, patients }: { summaries: LocationSummary[]; patients: WaitlistPatient[] }) {
  const [configTarget, setConfigTarget] = useState<LocationSummary | null>(null);

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className="grid auto-rows-auto gap-4 p-6"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
      >
        {summaries.map(s => (
          <div key={s.name} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[14px] font-medium text-foreground leading-snug">{s.name}</span>
              {s.avgWaitDays > 14 && (
                <span className="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">⚠ High wait</span>
              )}
            </div>
            <div className="flex flex-col gap-0.5 text-[13px] text-muted-foreground">
              <span>{s.patientCount} patient{s.patientCount !== 1 ? "s" : ""} waiting</span>
              <span>Avg {s.avgWaitDays} days</span>
              <span>{s.providers.length} provider{s.providers.length !== 1 ? "s" : ""}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-auto w-full justify-between"
              onClick={() => setConfigTarget(s)}
            >
              Configure
              <Settings2 size={13} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            </Button>
          </div>
        ))}
      </div>
      <LocationConfigSheet
        summary={configTarget}
        open={configTarget != null}
        onClose={() => setConfigTarget(null)}
      />
    </div>
  );
}

/* ─── PatientConversationSheet ─── */
function PatientConversationSheet({
  open,
  patient,
  localQueue,
  onClose,
}: {
  open: boolean;
  patient: WaitlistPatient | null;
  localQueue?: number;
  onClose: () => void;
}) {
  const convId = patient ? `waitlist-${patient.id}` : "waitlist-none";

  // Seed per-patient conversation on first open
  useEffect(() => {
    if (!patient) return;
    const parts = patient.patient.trim().split(/\s+/);
    const inits = parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    ensureConversation(
      convId,
      buildPatientConversation(
        patient.id,
        patient.patient,
        TYPE_CONFIG[patient.type].label,
        patient.provider,
        patient.location,
        localQueue ?? 1,
      ),
    );
  }, [convId, patient, localQueue]);

  const { messages, addMessage } = useWaitlistConversation(convId);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!patient) return null;

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    addMessage({
      id: `live-${Date.now()}`,
      sender: "agent",
      text,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      senderName: "You",
    });
    setDraft("");
    toast("Message sent via SMS.", { icon: <CheckCircle2 size={16} className="text-green-500" /> });
  }

  const subtitle = [
    patient.location,
    TYPE_CONFIG[patient.type].label,
    localQueue != null ? `Local #${localQueue}` : undefined,
  ].filter(Boolean).join(" · ");

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" inset="floating" floatingSize="lg" className={FLOATING_SHEET_FRAME_CONTENT_CLASS}>
        <FloatingSheetFrame
          title={patient.patient}
          description={subtitle}
          footer={
            <div className="w-full">
              <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/40">
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message…"
                  rows={1}
                  className="w-full resize-none bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[
                      { icon: Paperclip,        title: "Attach" },
                      { icon: ImageIcon,         title: "Image" },
                      { icon: AtSign,            title: "Mention" },
                    ].map(({ icon: Icon, title }) => (
                      <Button key={title} type="button" variant="ghost" size="icon"
                        className="rounded-lg hover:bg-muted" title={title}>
                        <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth />
                      </Button>
                    ))}
                    <div className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />
                    <Button type="button" variant="ghost" size="icon"
                      className="rounded-lg hover:bg-muted" title="Options">
                      <SlidersHorizontal className="size-3.5 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth />
                    </Button>
                  </div>
                  <button
                    type="button"
                    aria-label="Send"
                    onClick={handleSend}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-white transition-colors ${
                      draft.trim()
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-primary/50 cursor-not-allowed"
                    }`}
                  >
                    <Send className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
                  </button>
                </div>
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              const dateSep = WAITLIST_DATE_BREAKS[msg.id] ?? null;
              return (
                <div key={msg.id}>
                  {dateSep && (
                    <div className="my-2 flex items-center justify-center">
                      <span className="relative z-10 bg-background px-3 text-[11px] text-muted-foreground">
                        {dateSep}
                      </span>
                    </div>
                  )}
                  {msg.type === "waitlist-sms" && msg.waitlistSms ? (
                    <div className="flex justify-end">
                      <div className="flex flex-col items-end gap-1">
                        <WaitlistSmsCard data={msg.waitlistSms} />
                        <span className="text-[11px] text-muted-foreground px-1">
                          {msg.senderName} · {msg.time} ✓
                        </span>
                      </div>
                    </div>
                  ) : msg.sender === "customer" ? (
                    <div className="flex justify-start">
                      <div className="flex flex-col items-start gap-1">
                        <div className="max-w-[280px] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-[13px] text-foreground">
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-muted-foreground px-1">{patient.patient} · {msg.time}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="flex flex-col items-end gap-1">
                        <div className="max-w-[280px] rounded-2xl rounded-br-md bg-primary/10 px-4 py-2.5 text-[13px] text-foreground">
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-muted-foreground px-1">
                          {msg.senderName ?? "Waitlist agent"} · {msg.time} ✓
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </FloatingSheetFrame>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Provider mode data ─── */
// Uses WaitlistPatient shape: patient = provider name, id = unique row key
const PROVIDER_RECORDS: WaitlistPatient[] = [
  { id: "pr1",  patient: "Dr. Karen Lee",       contact: "(415) 555-0101", location: "Main Clinic",      provider: "General Dentistry",   type: "cleaning",    slotPreference: "full_day" as any,  wait: "Jan 15, 2022", status: "pending" },
  { id: "pr2",  patient: "Dr. Alan Patel",       contact: "(312) 555-0102", location: "Downtown Office",  provider: "Orthodontics",        type: "new_patient", slotPreference: "morning",          wait: "Mar 10, 2021", status: "pending" },
  { id: "pr3",  patient: "Dr. Nina Brooks",      contact: "(713) 555-0103", location: "South Campus",     provider: "Periodontics",        type: "root_canal",  slotPreference: "afternoon",        wait: "Jun 5, 2020",  status: "pending" },
  { id: "pr4",  patient: "Dr. Marcus Webb",      contact: "(206) 555-0104", location: "North Branch",     provider: "Endodontics",         type: "cleaning",    slotPreference: "afternoon",        wait: "Aug 22, 2021", status: "pending" },
  { id: "pr5",  patient: "Dr. Sarah Chen",       contact: "(602) 555-0105", location: "Main Clinic",      provider: "Oral Surgery",        type: "new_patient", slotPreference: "morning",          wait: "Feb 17, 2019", status: "slot_offered", slotOfferedBy: "Waitlist agent" },
  { id: "pr6",  patient: "Dr. Priya Nair",       contact: "(503) 555-0106", location: "Downtown Office",  provider: "OB/GYN",              type: "new_patient", slotPreference: "full_day" as any,  wait: "Apr 3, 2020",  status: "pending" },
  { id: "pr7",  patient: "Dr. Thomas Chen",      contact: "(404) 555-0107", location: "North Branch",     provider: "Family Medicine",     type: "cleaning",    slotPreference: "full_day" as any,  wait: "Nov 11, 2021", status: "pending" },
  { id: "pr8",  patient: "Amara Diallo, NP",     contact: "(305) 555-0108", location: "Telehealth Hub",   provider: "Family Medicine",     type: "new_patient", slotPreference: "morning",          wait: "Sep 30, 2022", status: "pending" },
  { id: "pr9",  patient: "Dr. Robert Kim",       contact: "(617) 555-0109", location: "South Campus",     provider: "Dermatology",         type: "cleaning",    slotPreference: "morning",          wait: "May 18, 2021", status: "agent_called" },
  { id: "pr10", patient: "Dr. Fatima Al-Hassan", contact: "(720) 555-0110", location: "Main Clinic",      provider: "Psychiatry",          type: "new_patient", slotPreference: "afternoon",        wait: "Jul 7, 2020",  status: "pending" },
  { id: "pr11", patient: "Dr. David Morales",    contact: "(214) 555-0111", location: "Downtown Office",  provider: "Gastroenterology",    type: "root_canal",  slotPreference: "afternoon",        wait: "Dec 1, 2021",  status: "pending" },
  { id: "pr12", patient: "Dr. Lisa Kowalski",    contact: "(503) 555-0112", location: "Main Clinic",      provider: "Internal Medicine",   type: "cleaning",    slotPreference: "morning",          wait: "Mar 25, 2019", status: "slot_offered", slotOfferedBy: "Sarah Chen" },
  { id: "pr13", patient: "Dr. Raj Sharma",       contact: "(615) 555-0113", location: "South Campus",     provider: "Cardiology",          type: "new_patient", slotPreference: "full_day" as any,  wait: "Oct 14, 2020", status: "pending" },
  { id: "pr14", patient: "Dr. Nina Johansson",   contact: "(702) 555-0114", location: "North Branch",     provider: "Pediatrics",          type: "cleaning",    slotPreference: "morning",          wait: "Jun 28, 2021", status: "pending" },
  { id: "pr15", patient: "Dr. Keisha Washington",contact: "(214) 555-0115", location: "South Campus",     provider: "Orthopedic Surgery",  type: "root_canal",  slotPreference: "afternoon",        wait: "Feb 9, 2022",  status: "agent_called" },
  { id: "pr16", patient: "Dr. Carmen Herrera",   contact: "(404) 555-0116", location: "Downtown Office",  provider: "Family Medicine",     type: "new_patient", slotPreference: "full_day" as any,  wait: "Aug 5, 2020",  status: "pending" },
  { id: "pr17", patient: "Dr. Samuel Osei",      contact: "(617) 555-0117", location: "Main Clinic",      provider: "Geriatrics",          type: "cleaning",    slotPreference: "full_day" as any,  wait: "Apr 19, 2021", status: "pending" },
  { id: "pr18", patient: "Dr. Aisha Bangura",    contact: "(720) 555-0118", location: "Downtown Office",  provider: "OB/GYN",              type: "new_patient", slotPreference: "morning",          wait: "Jan 30, 2022", status: "pending" },
  { id: "pr19", patient: "Dr. Wei Zhang",        contact: "(503) 555-0119", location: "North Branch",     provider: "Endocrinology",       type: "cleaning",    slotPreference: "afternoon",        wait: "Jul 22, 2021", status: "slot_offered", slotOfferedBy: "Waitlist agent" },
  { id: "pr20", patient: "Dr. Ingrid Larsson",   contact: "(214) 555-0120", location: "South Campus",     provider: "Neurology",           type: "new_patient", slotPreference: "afternoon",        wait: "Mar 3, 2020",  status: "pending" },
];

/* ─── Provider specialty lookup (extended) ─── */
const PROVIDER_SPECIALTY: Record<string, string> = {
  "Dr. Karen Lee":        "General Dentistry",
  "Dr. Alan Patel":       "Orthodontics",
  "Dr. Nina Brooks":      "Periodontics",
  "Dr. Marcus Webb":      "Endodontics",
  "Dr. Sarah Chen":       "Oral Surgery",
  "Dr. Priya Nair":       "OB/GYN",
  "Dr. Thomas Chen":      "Family Medicine",
  "Amara Diallo, NP":     "Family Medicine",
  "Dr. Robert Kim":       "Dermatology",
  "Dr. Fatima Al-Hassan": "Psychiatry",
  "Dr. David Morales":    "Gastroenterology",
  "Dr. Lisa Kowalski":    "Internal Medicine",
  "Dr. Raj Sharma":       "Cardiology",
  "Dr. Nina Johansson":   "Pediatrics",
  "Dr. Keisha Washington":"Orthopedic Surgery",
  "Dr. Carmen Herrera":   "Family Medicine",
  "Dr. Samuel Osei":      "Geriatrics",
  "Dr. Aisha Bangura":    "OB/GYN",
  "Dr. Wei Zhang":        "Endocrinology",
  "Dr. Ingrid Larsson":   "Neurology",
};

type BookingRule = "auto_book" | "offer_and_confirm" | "transfer_to_staff";
interface ProviderApptType { name: string; durationMinutes: number; newPatients: boolean; bookingRule: BookingRule; }
interface ProviderDetail {
  specialty:   string;
  npi:         string;
  locations:   string[];
  apptTypes:   ProviderApptType[];
  ehrSync:     boolean;
  lastSyncedAt?: string;
  status:      "active" | "inactive" | "temporarily_disabled";
  statusNote:  string | null;
}

const BOOKING_LABEL: Record<BookingRule, string> = { auto_book: "Auto-book", offer_and_confirm: "Confirm", transfer_to_staff: "Transfer" };
const BOOKING_CLASS: Record<BookingRule, string> = {
  auto_book:         "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  offer_and_confirm: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  transfer_to_staff: "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400",
};

const PROVIDER_DETAILS: Record<string, ProviderDetail> = {
  "Dr. Karen Lee": {
    specialty: "General Dentistry", npi: "1234567890",
    locations: ["Main Clinic", "North Branch", "Telehealth Hub"],
    apptTypes: [
      { name: "New Patient Consult",        durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",            durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Annual Physical",            durationMinutes: 45, newPatients: true,  bookingRule: "auto_book" },
      { name: "Telehealth Visit",           durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Chronic Disease Management", durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
    ],
    ehrSync: true, lastSyncedAt: "2 min ago", status: "active", statusNote: null,
  },
  "Dr. Alan Patel": {
    specialty: "Orthodontics", npi: "2345678901",
    locations: ["Main Clinic", "Downtown Office"],
    apptTypes: [
      { name: "New Patient Consult",  durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",      durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Telehealth Visit",     durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Procedure Consult",    durationMinutes: 45, newPatients: false, bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, lastSyncedAt: "14 min ago", status: "active", statusNote: null,
  },
  "Dr. Nina Brooks": {
    specialty: "Periodontics", npi: "3456789012",
    locations: ["South Campus", "Main Clinic"],
    apptTypes: [
      { name: "New Patient Consult",  durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",      durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Telehealth Visit",     durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Procedure Consult",    durationMinutes: 45, newPatients: false, bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, lastSyncedAt: "1 hr ago", status: "active", statusNote: null,
  },
  "Dr. Marcus Webb": {
    specialty: "Endodontics", npi: "4567890123",
    locations: ["Downtown Office", "North Branch"],
    apptTypes: [
      { name: "New Patient Consult",   durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",       durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Root Canal Consult",    durationMinutes: 45, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Post-treatment Review", durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Telehealth Visit",      durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
    ],
    ehrSync: true, lastSyncedAt: "3 hr ago", status: "active", statusNote: null,
  },
  "Dr. Sarah Chen": {
    specialty: "Oral Surgery", npi: "5678901234",
    locations: ["Main Clinic", "South Campus"],
    apptTypes: [
      { name: "New Patient Consult",  durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",      durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Extraction Consult",   durationMinutes: 45, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Surgical Follow-up",   durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Telehealth Visit",     durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
    ],
    ehrSync: true, lastSyncedAt: "6 hr ago", status: "active", statusNote: null,
  },
  "Dr. Priya Nair": {
    specialty: "Obstetrics & Gynecology", npi: "6789012345",
    locations: ["Downtown Office", "Main Clinic", "Telehealth Hub"],
    apptTypes: [
      { name: "New Patient Consult",durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Prenatal Visit",     durationMinutes: 30, newPatients: true,  bookingRule: "auto_book" },
      { name: "Follow-up Visit",    durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Annual Wellness",    durationMinutes: 45, newPatients: true,  bookingRule: "auto_book" },
      { name: "Telehealth Visit",   durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
    ],
    ehrSync: true, lastSyncedAt: "12 hr ago", status: "active", statusNote: null,
  },
  "Dr. Thomas Chen": {
    specialty: "Family Medicine", npi: "7890123456",
    locations: ["North Branch", "Downtown Office"],
    apptTypes: [
      { name: "Follow-up Visit",           durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Annual Physical",           durationMinutes: 45, newPatients: true,  bookingRule: "auto_book" },
      { name: "Telehealth Visit",          durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Sports Physical",           durationMinutes: 20, newPatients: true,  bookingRule: "auto_book" },
      { name: "Chronic Disease Management",durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
    ],
    ehrSync: true, lastSyncedAt: "1 day ago", status: "active", statusNote: null,
  },
  "Amara Diallo, NP": {
    specialty: "Family Medicine", npi: "8901234567",
    locations: ["North Branch", "Telehealth Hub"],
    apptTypes: [
      { name: "Follow-up Visit", durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Telehealth Visit",durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Immunization",    durationMinutes: 15, newPatients: true,  bookingRule: "auto_book" },
      { name: "Urgent Care",     durationMinutes: 15, newPatients: true,  bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, lastSyncedAt: "2 days ago", status: "active", statusNote: null,
  },
  "Dr. Robert Kim": {
    specialty: "Dermatology", npi: "9012345678",
    locations: ["Downtown Office", "South Campus"],
    apptTypes: [
      { name: "New Patient Consult",    durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",        durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Full Skin Check",        durationMinutes: 30, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Biopsy Consult",         durationMinutes: 45, newPatients: false, bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, lastSyncedAt: "2 min ago", status: "active", statusNote: null,
  },
  "Dr. Fatima Al-Hassan": {
    specialty: "Psychiatry", npi: "0123456789",
    locations: ["Main Clinic", "Telehealth Hub"],
    apptTypes: [
      { name: "Initial Psychiatric Evaluation",durationMinutes: 60, newPatients: true,  bookingRule: "transfer_to_staff" },
      { name: "Medication Management",         durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Mental Health Check-in",        durationMinutes: 30, newPatients: false, bookingRule: "transfer_to_staff" },
      { name: "Telehealth Visit",              durationMinutes: 30, newPatients: false, bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, lastSyncedAt: "45 min ago", status: "active", statusNote: null,
  },
  "Dr. David Morales": {
    specialty: "Gastroenterology", npi: "1122334455",
    locations: ["South Campus", "Downtown Office"],
    apptTypes: [
      { name: "New Patient Consult",  durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",      durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Colonoscopy Consult",  durationMinutes: 45, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Telehealth Visit",     durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Procedure Consult",    durationMinutes: 45, newPatients: false, bookingRule: "transfer_to_staff" },
    ],
    ehrSync: true, lastSyncedAt: "5 hr ago", status: "active", statusNote: null,
  },
  "Dr. Lisa Kowalski": {
    specialty: "Internal Medicine", npi: "2233445566",
    locations: ["Main Clinic"],
    apptTypes: [
      { name: "Follow-up Visit",           durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Telehealth Visit",          durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Chronic Disease Management",durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
    ],
    ehrSync: false, status: "inactive", statusNote: "No longer accepting patients at this location",
  },
  "Dr. Raj Sharma": {
    specialty: "Cardiology", npi: "3344556677",
    locations: ["Main Clinic", "Downtown Office", "Telehealth Hub"],
    apptTypes: [
      { name: "New Patient Consult",  durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",      durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Telehealth Visit",     durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Echocardiogram Review",durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
    ],
    ehrSync: true, lastSyncedAt: "30 min ago", status: "active", statusNote: null,
  },
  "Dr. Nina Johansson": {
    specialty: "Pediatrics", npi: "4455667788",
    locations: ["North Branch"],
    apptTypes: [
      { name: "Well-Child Visit",durationMinutes: 30, newPatients: true,  bookingRule: "auto_book" },
      { name: "Immunization",    durationMinutes: 15, newPatients: true,  bookingRule: "auto_book" },
      { name: "Follow-up Visit", durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Sports Physical", durationMinutes: 20, newPatients: true,  bookingRule: "auto_book" },
    ],
    ehrSync: true, lastSyncedAt: "N/A", status: "temporarily_disabled", statusNote: "On leave through May 31, 2026",
  },
  "Dr. Keisha Washington": {
    specialty: "Orthopedic Surgery", npi: "5566778899",
    locations: ["South Campus", "Main Clinic"],
    apptTypes: [
      { name: "New Patient Consult",    durationMinutes: 60, newPatients: true,  bookingRule: "transfer_to_staff" },
      { name: "Follow-up Visit",        durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Pre-operative Consult",  durationMinutes: 45, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Post-operative Follow-up",durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Joint Injection",        durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
    ],
    ehrSync: true, lastSyncedAt: "4 hr ago", status: "active", statusNote: null,
  },
  "Dr. Carmen Herrera": {
    specialty: "Family Medicine", npi: "6677889900",
    locations: ["Downtown Office", "Telehealth Hub"],
    apptTypes: [
      { name: "New Patient Consult",       durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",           durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Annual Physical",           durationMinutes: 45, newPatients: true,  bookingRule: "auto_book" },
      { name: "Telehealth Visit",          durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Chronic Disease Management",durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
    ],
    ehrSync: true, lastSyncedAt: "8 hr ago", status: "active", statusNote: null,
  },
  "Dr. Samuel Osei": {
    specialty: "Geriatrics", npi: "7788990011",
    locations: ["Main Clinic", "South Campus", "Telehealth Hub"],
    apptTypes: [
      { name: "New Patient Consult",       durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",           durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Telehealth Visit",          durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Chronic Disease Management",durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Annual Physical",           durationMinutes: 45, newPatients: true,  bookingRule: "offer_and_confirm" },
    ],
    ehrSync: true, lastSyncedAt: "20 min ago", status: "active", statusNote: null,
  },
  "Dr. Aisha Bangura": {
    specialty: "Obstetrics & Gynecology", npi: "8899001122",
    locations: ["Main Clinic", "Telehealth Hub"],
    apptTypes: [
      { name: "New Patient Consult",durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Prenatal Visit",     durationMinutes: 30, newPatients: true,  bookingRule: "auto_book" },
      { name: "Follow-up Visit",    durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Annual Wellness",    durationMinutes: 45, newPatients: true,  bookingRule: "auto_book" },
      { name: "Telehealth Visit",   durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
    ],
    ehrSync: true, lastSyncedAt: "3 hr ago", status: "active", statusNote: null,
  },
  "Dr. Wei Zhang": {
    specialty: "Endocrinology", npi: "9900112233",
    locations: ["North Branch", "Downtown Office"],
    apptTypes: [
      { name: "New Patient Consult",       durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",           durationMinutes: 20, newPatients: false, bookingRule: "auto_book" },
      { name: "Telehealth Visit",          durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Chronic Disease Management",durationMinutes: 30, newPatients: false, bookingRule: "auto_book" },
      { name: "Procedure Consult",         durationMinutes: 45, newPatients: false, bookingRule: "offer_and_confirm" },
    ],
    ehrSync: true, lastSyncedAt: "7 hr ago", status: "active", statusNote: null,
  },
  "Dr. Ingrid Larsson": {
    specialty: "Neurology", npi: "0011223344",
    locations: ["Main Clinic", "South Campus"],
    apptTypes: [
      { name: "New Patient Consult",       durationMinutes: 60, newPatients: true,  bookingRule: "offer_and_confirm" },
      { name: "Follow-up Visit",           durationMinutes: 20, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Telehealth Visit",          durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
      { name: "Procedure Consult",         durationMinutes: 45, newPatients: false, bookingRule: "transfer_to_staff" },
      { name: "Chronic Disease Management",durationMinutes: 30, newPatients: false, bookingRule: "offer_and_confirm" },
    ],
    ehrSync: true, lastSyncedAt: "55 min ago", status: "active", statusNote: null,
  },
};

function ProviderDetailQuickView({ providerName, onClose }: { providerName: string; onClose: () => void }) {
  const details = PROVIDER_DETAILS[providerName];
  if (!details) return null;

  const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    active:               { label: "Active",   cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    inactive:             { label: "Inactive", cls: "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400" },
    temporarily_disabled: { label: "Disabled", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  };

  const avgDuration = details.apptTypes.length
    ? Math.round(details.apptTypes.reduce((s, a) => s + a.durationMinutes, 0) / details.apptTypes.length)
    : 0;
  const newPtPct = details.apptTypes.length
    ? Math.round((details.apptTypes.filter(a => a.newPatients).length / details.apptTypes.length) * 100)
    : 0;

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right" inset="floating" floatingSize="md" className={FLOATING_SHEET_FRAME_CONTENT_CLASS}>
        <div className="flex h-full flex-col overflow-hidden">

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto">

            {/* ── Gradient cover ── */}
            <div className="relative">
              <div
                className="h-[120px] w-full"
                style={{
                  background: "linear-gradient(135deg, hsl(200 60% 88%) 0%, hsl(180 40% 92%) 40%, hsl(80 30% 94%) 100%)",
                }}
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex size-6 items-center justify-center rounded-md text-foreground/50 hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* ── Avatar + identity row ── */}
            <div className="flex items-end justify-between px-5 pb-3">
              <div className="-mt-9">
                <Avatar className="size-[72px] border-4 border-background shadow-sm">
                  <AvatarImage src={providerPhotoUrl(providerName, 80)} alt={providerName} />
                  <AvatarFallback className="bg-primary/10 text-[15px] text-primary">
                    {patientInitials(providerName.replace(/^Dr\.\s*/, ""))}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Status badge — right side */}
              <div className="flex items-center gap-2 pb-1">
                <Badge variant="outline" className={STATUS_CFG[details.status].cls}>
                  {STATUS_CFG[details.status].label}
                </Badge>
                {!details.ehrSync && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                    EHR sync off
                  </Badge>
                )}
              </div>
            </div>

            {/* Name + specialty */}
            <div className="flex flex-col gap-0.5 px-5 pb-4">
              <p className="text-[17px] font-semibold text-foreground">{providerName}</p>
              <p className="text-[13px] text-muted-foreground">{details.specialty}</p>
            </div>

            {/* ── Three numbers ── */}
            <div className="grid grid-cols-3 border-y border-border py-4">
              {[
                { value: String(details.apptTypes.length), label: "Appt types" },
                { value: `${avgDuration} min`,             label: "Avg duration" },
                { value: `${newPtPct}%`,                   label: "New patients" },
              ].map((m, i) => (
                <div key={m.label} className={`flex flex-col items-center gap-0.5 ${i > 0 ? "border-l border-border" : ""}`}>
                  <span className="text-[22px] font-semibold tabular-nums text-foreground">{m.value}</span>
                  <span className="text-[11px] text-muted-foreground">{m.label}</span>
                </div>
              ))}
            </div>

            {/* ── Meta: NPI + locations ── */}
            <div className="grid grid-cols-2 gap-x-6 px-5 py-4 text-[13px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground">NPI</span>
                <span className="font-mono text-[12px] text-foreground">{details.npi}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground">
                  {details.locations.length === 1 ? "Location" : "Locations"}
                </span>
                <span className="text-foreground">{details.locations.join(" · ")}</span>
              </div>
              {details.statusNote && (
                <div className="col-span-2 mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                  {details.statusNote}
                </div>
              )}
            </div>

            <Separator />

            {/* ── Appointment types ── */}
            <div className="px-5 pt-4 pb-6">
              <p className="mb-3 text-[12px] text-muted-foreground">
                Appointment types ({details.apptTypes.length})
              </p>
              <div className="flex flex-col">
                {details.apptTypes.map((apt, i) => (
                  <div
                    key={apt.name}
                    className={`flex items-center gap-2 py-1.5 ${
                      i < details.apptTypes.length - 1 ? "border-b border-border/40" : ""
                    }`}
                  >
                    <span className="flex-1 truncate text-[13px] text-foreground">{apt.name}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{apt.durationMinutes}m</span>
                    <Badge variant="outline" className={`shrink-0 text-[11px] ${BOOKING_CLASS[apt.bookingRule]}`}>
                      {BOOKING_LABEL[apt.bookingRule]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end scrollable */}

          {/* ── Sticky footer ── */}
          <div className="shrink-0 border-t border-border px-5 py-4">
            <Button type="button" className="w-full">Schedule appointment</Button>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}

export function WaitlistView({
  title = "Waitlist",
  description = "Track patients waiting for an appointment and schedule them as slots open up.",
  ctaLabel = "Add patients",
  firstColumnLabel = "Patient",
  providerColumnLabel = "Provider",
  providerMode = false,
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
  firstColumnLabel?: string;
  providerColumnLabel?: string;
  providerMode?: boolean;
} = {}) {
  const [subView, setSubView] = useState<WaitlistSubView>("list");
  const [columnSheetOpen, setColumnSheetOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [syncingProviders, setSyncingProviders] = useState<Set<string>>(new Set());
  const [syncedAt, setSyncedAt] = useState<Record<string, string>>({});
  const [systemSyncing, setSystemSyncing] = useState(false);
  const [systemLastSync, setSystemLastSync] = useState("6 hr ago");
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<WaitlistPatient | null>(null);
  const [offerSlotPatient, setOfferSlotPatient] = useState<WaitlistPatient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<WaitlistPatient | null>(null);
  const [messagePatient, setMessagePatient] = useState<WaitlistPatient | null>(null);
  const [patients, setPatients] = useState<WaitlistPatient[]>(WAITLIST);
  const [appliedFilters, setAppliedFilters] = useState<FilterItem[]>(() =>
    cloneFilterItems(WAITLIST_FILTER_ITEMS),
  );

  function handleAddPatient(patient: WaitlistPatient) {
    setPatients((prev) => [patient, ...prev]);
  }

  function handleConfirmOfferSlot(patientId: string) {
    setPatients((prev) =>
      prev.map((p) => p.id === patientId
        ? { ...p, status: "slot_offered" as WaitlistStatus, slotOfferedBy: "Abhishek Gautam" }
        : p,
      ),
    );
    const name = patients.find((p) => p.id === patientId)?.patient ?? "Patient";
    toast(`Slot offered to ${name}.`, {
      icon: <CheckCircle2 size={16} className="text-green-500" />,
    });
  }

  function handleSaveEdit(updated: WaitlistPatient) {
    setPatients((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    setEditPatient(null);
    toast("Changes saved.", {
      icon: <CheckCircle2 size={16} className="text-green-500" />,
    });
  }

  // Per-location queue: pending patients sorted by wait date within each location
  const locationQueueMap = useMemo(() => {
    const byLoc = new Map<string, WaitlistPatient[]>();
    patients.filter(p => p.status === "pending").forEach(p => {
      if (!byLoc.has(p.location)) byLoc.set(p.location, []);
      byLoc.get(p.location)!.push(p);
    });
    const result = new Map<string, number>();
    byLoc.forEach(pts => {
      pts.sort((a, b) => new Date(a.wait).getTime() - new Date(b.wait).getTime());
      pts.forEach((p, i) => result.set(p.id, i + 1));
    });
    return result;
  }, [patients]);

  // Global join-order position (for dimmed display on non-pending rows)
  const positionMap = useMemo(() => {
    const sorted = [...patients].sort((a, b) => new Date(a.wait).getTime() - new Date(b.wait).getTime());
    return new Map(sorted.map((p, i) => [p.id, i + 1]));
  }, [patients]);

  // Legacy global queueMap kept for OfferSlotDrawer sort-order compat
  const queueMap = useMemo(() => {
    const pending = [...patients]
      .filter(p => p.status === "pending")
      .sort((a, b) => new Date(a.wait).getTime() - new Date(b.wait).getTime());
    return new Map(pending.map((p, i) => [p.id, i + 1]));
  }, [patients]);

  function handleMarkAccepted(patientId: string) {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, status: "accepted" as WaitlistStatus } : p));
    const name = patients.find(p => p.id === patientId)?.patient ?? "Patient";
    toast(`${name} marked as accepted.`, { icon: <CheckCircle2 size={16} className="text-emerald-500" /> });
  }

  function handleMarkDeclined(patientId: string) {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, status: "declined" as WaitlistStatus } : p));
    const name = patients.find(p => p.id === patientId)?.patient ?? "Patient";
    toast(`${name} marked as declined.`, { icon: <CheckCircle2 size={16} className="text-slate-400" /> });
  }

  const columns = useMemo(() => {
    // ─── Provider mode: completely different column set ───────────────
    if (providerMode) return [
      col.display({
        id: "name", header: "Provider", size: 200, minSize: 160,
        enableSorting: true,
        sortingFn: (a, b) => a.original.patient.localeCompare(b.original.patient),
        cell: (info) => {
          const p = info.row.original;
          return (
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="size-7 shrink-0">
                <AvatarImage src={providerPhotoUrl(p.patient, 40)} alt={p.patient} />
                <AvatarFallback className="bg-primary/15 text-[10px] font-medium text-primary">
                  {patientInitials(p.patient.replace(/^Dr\.\s*/, ""))}
                </AvatarFallback>
              </Avatar>
              <span className={`truncate ${APP_DATA_TABLE_PRIMARY_ROW_LABEL_CLASS}`}>{p.patient}</span>
            </div>
          );
        },
      }),
      col.display({
        id: "specialty", header: "Specialty", size: 160, minSize: 140,
        enableSorting: true, enableHiding: true,
        sortingFn: (a, b) => (PROVIDER_SPECIALTY[a.original.patient] ?? "").localeCompare(PROVIDER_SPECIALTY[b.original.patient] ?? ""),
        cell: (info) => <span className="truncate text-foreground">{PROVIDER_SPECIALTY[info.row.original.patient] ?? "—"}</span>,
      }),
      col.display({
        id: "locations", header: "Location(s)", size: 160, minSize: 140,
        enableSorting: true, enableHiding: true,
        sortingFn: (a, b) => {
          const la = PROVIDER_DETAILS[a.original.patient]?.locations?.length ?? 0;
          const lb = PROVIDER_DETAILS[b.original.patient]?.locations?.length ?? 0;
          return la - lb;
        },
        cell: (info) => {
          const locs = PROVIDER_DETAILS[info.row.original.patient]?.locations ?? [];
          return <span className="truncate text-foreground">{locs.length === 1 ? locs[0] : locs.length > 1 ? `${locs.length} locations` : "—"}</span>;
        },
      }),
      col.display({
        id: "apptTypes", header: "Appt types", size: 128, minSize: 112,
        enableSorting: true, enableHiding: true,
        sortingFn: (a, b) => (PROVIDER_DETAILS[a.original.patient]?.apptTypes?.length ?? 0) - (PROVIDER_DETAILS[b.original.patient]?.apptTypes?.length ?? 0),
        cell: (info) => {
          const count = PROVIDER_DETAILS[info.row.original.patient]?.apptTypes?.length ?? 0;
          return <span className="text-foreground">{count > 0 ? `${count} types` : "—"}</span>;
        },
      }),
      col.display({
        id: "providerStatus", header: "Status", size: 128, minSize: 112, enableResizing: false,
        enableSorting: true, enableHiding: true,
        sortingFn: (a, b) => {
          const order: Record<string, number> = { active: 0, temporarily_disabled: 1, inactive: 2 };
          const sa = PROVIDER_DETAILS[a.original.patient]?.status ?? "inactive";
          const sb = PROVIDER_DETAILS[b.original.patient]?.status ?? "inactive";
          return (order[sa] ?? 3) - (order[sb] ?? 3);
        },
        cell: (info) => {
          const d = PROVIDER_DETAILS[info.row.original.patient];
          if (!d) return <span className="text-muted-foreground">—</span>;
          const cls: Record<string, string> = {
            active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
            inactive: "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400",
            temporarily_disabled: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
          };
          const lbl: Record<string, string> = { active: "Active", inactive: "Inactive", temporarily_disabled: "Disabled" };
          return <Badge variant="outline" className={cls[d.status]}>{lbl[d.status]}</Badge>;
        },
      }),
      col.display({
        id: "providerActions", header: "", size: 80, minSize: 72, maxSize: 96,
        enableSorting: false, enableResizing: false, enableHiding: false,
        cell: (info) => (
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center justify-end pr-2 opacity-0 group-hover/table-row:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={(e) => { e.stopPropagation(); setSelectedPatient(info.row.original); }}
                    aria-label="Quick view"
                  >
                    <Eye className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quick view</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ),
      }),
    ] as Parameters<typeof AppDataTable>[0]["columns"];

    // ─── Waitlist mode: original patient columns ──────────────────────
    return [
    ...COLUMNS.map(c => {
      if (c.id === "patient") return { ...c, header: firstColumnLabel };
      if (c.id === "provider" && providerColumnLabel !== "Provider") {
        return {
          ...c,
          header: providerColumnLabel,
          cell: (info: { getValue: () => string }) => (
            <span className="truncate text-foreground">
              {PROVIDER_SPECIALTY[info.getValue()] ?? info.getValue()}
            </span>
          ),
        };
      }
      return c;
    }),
    col.display({
      id: "line",
      header: "Queue",
      meta: { settingsLabel: "Queue" },
      size: 72,
      minSize: 64,
      enableResizing: true,
      enableSorting: true,
      sortingFn: (a, b) => {
        const qa = locationQueueMap.get(a.original.id) ?? positionMap.get(a.original.id) ?? Infinity;
        const qb = locationQueueMap.get(b.original.id) ?? positionMap.get(b.original.id) ?? Infinity;
        return qa - qb;
      },
      cell: (info) => {
        const localQ = locationQueueMap.get(info.row.original.id);
        if (localQ != null) {
          return <span className="font-medium text-foreground">{localQ}</span>;
        }
        const orig = positionMap.get(info.row.original.id);
        return <span className="text-muted-foreground">{orig ?? "—"}</span>;
      },
    }),
    STATUS_COLUMN,
    col.display({
      id: "actions",
      header: "",
      size: 192,
      minSize: 180,
      maxSize: 208,
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
      cell: (info) => (
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center justify-end gap-1 pr-2 opacity-0 group-hover/table-row:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Quick view"
                  onClick={(e) => { e.stopPropagation(); setSelectedPatient(info.row.original); }}
                >
                  <Eye className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quick view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Message patient"
                  onClick={(e) => { e.stopPropagation(); setMessagePatient(info.row.original); }}
                >
                  <MessageSquare className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Message</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Offer slot"
                  onClick={(e) => { e.stopPropagation(); setOfferSlotPatient(info.row.original); }}
                >
                  <CalendarPlus className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Offer slot</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="More options"
                    >
                      <MoreVertical className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>More</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  className="cursor-pointer text-[13px]"
                  onSelect={() => setEditPatient(info.row.original)}
                >
                  Edit patient
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-[13px]"
                  onSelect={() => handleMarkAccepted(info.row.original.id)}
                >
                  Mark as accepted
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-[13px]"
                  onSelect={() => handleMarkDeclined(info.row.original.id)}
                >
                  Mark as declined
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-[13px]"
                  onSelect={() => {
                    const id = info.row.original.id;
                    setPatients((prev) => prev.filter((p) => p.id !== id));
                    toast("Patient removed.", {
                      icon: <CheckCircle2 size={16} className="text-green-500" />,
                    });
                  }}
                >
                  Remove from list
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      ),
    }),
  ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerMode, firstColumnLabel, providerColumnLabel, locationQueueMap, positionMap, syncingProviders, syncedAt, setSelectedPatient, setMessagePatient, setEditPatient, setPatients, setOfferSlotPatient, handleMarkAccepted, handleMarkDeclined]) as Parameters<typeof AppDataTable>[0]["columns"];

  const filteredData = useMemo(() => {
    const status   = filterValue(appliedFilters, "waitlist_status");
    const provider = filterValue(appliedFilters, "waitlist_provider");
    const slot     = filterValue(appliedFilters, "waitlist_slot");
    const location = filterValue(appliedFilters, "waitlist_location");

    return patients.filter((p) => {
      if (status   && status   !== "All statuses"   && STATUS_CONFIG[p.status].label   !== status)   return false;
      if (provider && provider !== "All providers"  && p.provider                       !== provider) return false;
      if (slot     && slot     !== "All preferences"&& SLOT_CONFIG[p.slotPreference].label !== slot) return false;
      if (location && location !== "All locations"  && p.location                       !== location) return false;
      return true;
    });
  }, [appliedFilters, patients]);

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <MainCanvasViewHeader
          title={title}
          description={description}
          actions={
            <div className="flex items-center gap-2">
              {/* System-level EHR sync indicator — provider mode only */}
              {providerMode && (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          if (systemSyncing) return;
                          setSystemSyncing(true);
                          setTimeout(() => {
                            const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                            setSystemLastSync(`Just now (${now})`);
                            setSystemSyncing(false);
                            toast("EHR sync complete.", { icon: <CheckCircle2 size={16} className="text-green-500" /> });
                          }, 2000);
                        }}
                        className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] transition-colors hover:bg-muted/60"
                        aria-label={`EHR sync status: last synced ${systemLastSync}. Click to sync now.`}
                      >
                        <span className={`size-2 shrink-0 rounded-full ${systemSyncing ? "animate-pulse bg-blue-500" : "bg-emerald-500"}`} />
                        <span className={systemSyncing ? "text-blue-600 dark:text-blue-400" : "text-emerald-700 dark:text-emerald-400"}>
                          {systemSyncing ? "Syncing…" : "EHR synced"}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="flex flex-col gap-1">
                      <span className="text-[12px] font-medium">
                        {systemSyncing ? "Syncing all providers…" : `Last sync: ${systemLastSync}`}
                      </span>
                      {!systemSyncing && (
                        <span className="text-[11px] text-muted-foreground">Click to sync all providers now</span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <AppDataTableColumnSettingsTrigger
                sheetTitle={providerMode ? "Provider columns" : "Waitlist columns"}
                onClick={() => setColumnSheetOpen(true)}
              />
              {!providerMode && (
                <Button type="button" onClick={() => setAddPatientOpen(true)}>{ctaLabel}</Button>
              )}
              {!providerMode && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({ variant: "outline", size: "icon" })}
                    aria-label="More options"
                  >
                    <MoreVertical className="size-4" aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem className="cursor-pointer text-[13px]">
                      Delete patients
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!providerMode && (
                <FilterPaneTriggerButton open={filterOpen} onOpenChange={setFilterOpen} />
              )}
            </div>
          }
        />

        <div className="min-h-0 flex-1 flex flex-col">
          <AppDataTable<WaitlistPatient>
            scrollableBody
            tableId={providerMode ? "providers.mode.v2" : "waitlist.directory.v5"}
            persist
            data={providerMode ? PROVIDER_RECORDS : filteredData}
            columns={columns}
            initialSorting={providerMode ? [{ id: "providerStatus", desc: false }] : [{ id: "status", desc: false }, { id: "line", desc: false }]}
            getRowId={(row) => row.id}
            onRowClick={(row) => setSelectedPatient(row)}
            columnSheetTitle={providerMode ? "Provider columns" : "Waitlist columns"}
            className="min-w-0"
            rowDensity="medium"
            hideColumnsButton
            columnSheetOpen={columnSheetOpen}
            onColumnSheetOpenChange={setColumnSheetOpen}
          />
        </div>
      </div>

      {/* Filter panel */}
      {!providerMode && (
        <FilterPane
          initialFilters={appliedFilters}
          open={filterOpen}
          onOpenChange={setFilterOpen}
          onFiltersChange={setAppliedFilters}
          motion="static"
          dock="right"
          storageKey="birdeye_waitlist_filters"
        />
      )}

      <AddPatientDrawer
        open={addPatientOpen}
        onClose={() => setAddPatientOpen(false)}
        onAdd={handleAddPatient}
      />
      <AddPatientDrawer
        key={editPatient?.id ?? "__edit__"}
        open={editPatient != null}
        onClose={() => setEditPatient(null)}
        onSaveEdit={handleSaveEdit}
        editPatient={editPatient ?? undefined}
      />
      {providerMode && selectedPatient ? (
        <ProviderDetailQuickView
          key={selectedPatient.id}
          providerName={selectedPatient.patient}
          onClose={() => setSelectedPatient(null)}
        />
      ) : (
        <PatientDetailDrawer
          open={selectedPatient != null}
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onEdit={(p) => { setSelectedPatient(null); setEditPatient(p); }}
          onOfferSlot={(p) => { setSelectedPatient(null); setOfferSlotPatient(p); }}
          onMessage={(p) => { setSelectedPatient(null); setMessagePatient(p); }}
        />
      )}
      <OfferSlotDrawer
        key={offerSlotPatient?.id ?? "__offer__"}
        open={offerSlotPatient != null}
        patient={offerSlotPatient}
        onClose={() => setOfferSlotPatient(null)}
        onConfirm={handleConfirmOfferSlot}
      />
      <PatientConversationSheet
        key={messagePatient?.id ?? "__msg__"}
        open={messagePatient != null}
        patient={messagePatient}
        localQueue={messagePatient ? locationQueueMap.get(messagePatient.id) : undefined}
        onClose={() => setMessagePatient(null)}
      />
    </div>
  );
}
