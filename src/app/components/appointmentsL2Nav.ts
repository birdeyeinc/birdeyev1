import { L2_FLAT_NAV_KEY_PREFIX } from "@/app/components/L2NavLayout";
import { APPOINTMENTS_KB_L2_KEY } from "./knowledgeBaseMockData";
import { PHONE_NUMBERS_L2_KEY } from "./phoneNumbersMockData";

/** L2 key for the calendar surface hosted in the shell (`AppointmentsView`). */
export const APPOINTMENTS_L2_CALENDAR_KEY = "Human actions/Calendar";
export const APPOINTMENTS_L2_WAITLIST_KEY = "Human actions/Waitlist";
export const APPOINTMENTS_L2_WAITLIST_COPY_KEY = "Human actions/Waitlist Copy";
export const APPOINTMENTS_L2_PROVIDER_KEY = "Human actions/Provider";
export const APPOINTMENTS_L2_WAITLIST_AGENT_KEY = "Agents/Waitlist agent";

function titleCaseWords(s: string): string {
  return s
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** `productLabel` for `AppShellContentPlaceholder` when an L2 row has no dedicated canvas yet. */
export function appointmentsL2PlaceholderProductLabel(activeKey: string): string {
  if (activeKey.startsWith(`${L2_FLAT_NAV_KEY_PREFIX}/`)) {
    const raw = activeKey.slice(L2_FLAT_NAV_KEY_PREFIX.length + 1);
    return `Appointments · ${titleCaseWords(raw)}`;
  }
  const i = activeKey.lastIndexOf("/");
  const child = i >= 0 ? activeKey.slice(i + 1) : activeKey;
  return `Appointments · ${child}`;
}

export function appointmentsL2ShowsCalendarCanvas(activeKey: string): boolean {
  return activeKey === APPOINTMENTS_L2_CALENDAR_KEY;
}

/** L2 key for the Widgets list canvas (Settings section after L2 restructure). */
export const APPOINTMENTS_L2_WIDGETS_KEY = "Settings/Widgets";

export function appointmentsL2ShowsWidgetsCanvas(activeKey: string): boolean {
  return activeKey === APPOINTMENTS_L2_WIDGETS_KEY;
}

export function appointmentsL2ShowsKnowledgeBase(activeKey: string): boolean {
  return activeKey === APPOINTMENTS_KB_L2_KEY;
}

export function appointmentsL2ShowsPhoneNumbers(activeKey: string): boolean {
  return activeKey === PHONE_NUMBERS_L2_KEY;
}

export const INTAKE_FORMS_L2_KEY = "Resource/Intake forms";

export function appointmentsL2ShowsIntakeForms(activeKey: string): boolean {
  return activeKey === INTAKE_FORMS_L2_KEY;
}
