import { useState, useEffect } from "react";

export interface WaitlistSmsData {
  status: "queued" | "slot_opened" | "booked";
  patientName: string;
  patientInitials: string;
  appointmentType: string;
  provider: string;
  location: string;
  queuePosition?: number;
  slotDatetime?: string;
}

export interface WaitlistChatMessage {
  id: string;
  sender: "agent" | "customer";
  text?: string;
  time: string;
  type?: "waitlist-sms";
  waitlistSms?: WaitlistSmsData;
  senderName?: string;
}

/** Message IDs that should render a date separator BEFORE them. */
export const WAITLIST_DATE_BREAKS: Record<string, string> = {
  m4: "Fri, May 14",
};

/* ─── Full timeline for Sarah Mitchell (waitlist-sarah) ─── */
export const SARAH_MITCHELL_CONVERSATION: WaitlistChatMessage[] = [
  {
    id: "m1",
    sender: "agent",
    type: "waitlist-sms",
    time: "11:43 AM",
    senderName: "Waitlist agent",
    waitlistSms: {
      status: "queued",
      patientName: "Sarah Mitchell",
      patientInitials: "SM",
      appointmentType: "Cleaning",
      provider: "Dr. Karen Lee",
      location: "San Francisco, CA",
      queuePosition: 1,
    },
  },
  {
    id: "m2",
    sender: "customer",
    text: "Thanks! How long is the wait usually?",
    time: "12:04 PM",
  },
  {
    id: "m3",
    sender: "agent",
    text: "Average wait is 5–7 days at this location. We'll notify you as soon as a slot opens.",
    time: "12:06 PM",
    senderName: "Waitlist agent",
  },
  {
    id: "m4",
    sender: "agent",
    type: "waitlist-sms",
    time: "09:15 AM",
    senderName: "Waitlist agent",
    waitlistSms: {
      status: "slot_opened",
      patientName: "Sarah Mitchell",
      patientInitials: "SM",
      appointmentType: "Cleaning",
      provider: "Dr. Karen Lee",
      location: "San Francisco, CA",
      slotDatetime: "May 14, 2026 · 10:00 AM",
    },
  },
  {
    id: "m5",
    sender: "customer",
    text: "That works! Please confirm me.",
    time: "09:22 AM",
  },
  {
    id: "m6",
    sender: "agent",
    type: "waitlist-sms",
    time: "09:23 AM",
    senderName: "Waitlist agent",
    waitlistSms: {
      status: "booked",
      patientName: "Sarah Mitchell",
      patientInitials: "SM",
      appointmentType: "Cleaning",
      provider: "Dr. Karen Lee",
      location: "San Francisco, CA",
      slotDatetime: "May 14, 2026 · 10:00 AM",
    },
  },
];

/* ─── Build a starter conversation for any patient ─── */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function buildPatientConversation(
  patientId: string,
  patientName: string,
  appointmentType: string,
  provider: string,
  location: string,
  queuePosition: number,
): WaitlistChatMessage[] {
  return [
    {
      id: `${patientId}-m1`,
      sender: "agent",
      type: "waitlist-sms",
      time: "11:43 AM",
      senderName: "Waitlist agent",
      waitlistSms: {
        status: "queued",
        patientName,
        patientInitials: initials(patientName),
        appointmentType,
        provider,
        location,
        queuePosition,
      },
    },
  ];
}

/* ─── Reactive shared store ─────────────────────────────────────────────
   Both PatientConversationSheet (WaitlistView) and InboxView read/write
   the same message array per conversation ID. Changes propagate to all
   mounted subscribers via the listener registry.
──────────────────────────────────────────────────────────────────────── */

const _store = new Map<string, WaitlistChatMessage[]>([
  ["waitlist-sarah", [...SARAH_MITCHELL_CONVERSATION]],
]);

const _listeners = new Map<string, Set<() => void>>();

function _notify(id: string) {
  _listeners.get(id)?.forEach((cb) => cb());
}

export function getConversation(id: string): WaitlistChatMessage[] {
  return _store.get(id) ?? [];
}

export function appendMessage(id: string, msg: WaitlistChatMessage): void {
  const prev = _store.get(id) ?? [];
  _store.set(id, [...prev, msg]);
  _notify(id);
}

export function ensureConversation(
  id: string,
  seed: WaitlistChatMessage[],
): void {
  if (!_store.has(id)) {
    _store.set(id, [...seed]);
  }
}

/** React hook — subscribes a component to a conversation. */
export function useWaitlistConversation(id: string) {
  const [messages, setMessages] = useState<WaitlistChatMessage[]>(
    () => _store.get(id) ?? [],
  );

  useEffect(() => {
    // Sync in case store was populated after first render
    setMessages(_store.get(id) ?? []);

    if (!_listeners.has(id)) _listeners.set(id, new Set());
    const cb = () => setMessages([...(_store.get(id) ?? [])]);
    _listeners.get(id)!.add(cb);
    return () => {
      _listeners.get(id)?.delete(cb);
    };
  }, [id]);

  function addMessage(msg: WaitlistChatMessage) {
    appendMessage(id, msg);
  }

  return { messages, addMessage };
}
