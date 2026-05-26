export const PHONE_NUMBERS_L2_KEY = "Settings/Phone number";

export type PhoneNumberType   = "Local" | "Toll-free";
export type PhoneNumberStatus = "active" | "provisioning" | "failed" | "inactive" | "released";

export interface PhoneNumberRow {
  id: string;
  number: string;
  phonumId: string;
  assignedAgent: string | null;
  provider: string;
  type: PhoneNumberType;
  status: PhoneNumberStatus;
  purchasedOn: string;
}

export const PHONE_NUMBER_AGENTS = [
  "Frontdesk agent",
  "Scheduling agent",
  "Reminder agent",
  "Outreach agent",
  "Insurance verification agent",
  "Rx Management agent",
];

export const PHONE_NUMBER_ROWS: PhoneNumberRow[] = [
  { id:  "1", number: "+1 (210) 425-0208", phonumId: "phnum_29944", assignedAgent: "Frontdesk agent",              provider: "Twilio",    type: "Local",     status: "active",       purchasedOn: "Apr 07, 2026" },
  { id:  "2", number: "+1 (210) 425-0211", phonumId: "phnum_29945", assignedAgent: "Scheduling agent",             provider: "Twilio",    type: "Local",     status: "active",       purchasedOn: "Apr 07, 2026" },
  { id:  "3", number: "+1 (888) 425-1122", phonumId: "phnum_29946", assignedAgent: "Reminder agent",               provider: "Twilio",    type: "Toll-free", status: "active",       purchasedOn: "Mar 15, 2026" },
  { id:  "4", number: "+1 (415) 555-0190", phonumId: "phnum_29947", assignedAgent: "Outreach agent",               provider: "Vonage",    type: "Local",     status: "active",       purchasedOn: "Mar 01, 2026" },
  { id:  "5", number: "+1 (800) 555-0100", phonumId: "phnum_29948", assignedAgent: "Insurance verification agent", provider: "Twilio",    type: "Toll-free", status: "active",       purchasedOn: "Feb 20, 2026" },
  { id:  "6", number: "+1 (650) 555-0173", phonumId: "phnum_29949", assignedAgent: null,                           provider: "Bandwidth", type: "Local",     status: "provisioning", purchasedOn: "Apr 08, 2026" },
  { id:  "7", number: "+1 (512) 867-5309", phonumId: "phnum_29950", assignedAgent: null,                           provider: "Twilio",    type: "Local",     status: "provisioning", purchasedOn: "Apr 08, 2026" },
  { id:  "8", number: "+1 (888) 999-0001", phonumId: "phnum_29951", assignedAgent: null,                           provider: "Vonage",    type: "Toll-free", status: "failed",        purchasedOn: "Mar 28, 2026" },
  { id:  "9", number: "+1 (737) 202-4000", phonumId: "phnum_29952", assignedAgent: "Scheduling agent",             provider: "Bandwidth", type: "Local",     status: "inactive",     purchasedOn: "Dec 20, 2025" },
  { id: "10", number: "+1 (800) 444-1200", phonumId: "phnum_29953", assignedAgent: null,                           provider: "Twilio",    type: "Toll-free", status: "released",     purchasedOn: "Dec 05, 2025" },
];
