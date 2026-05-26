/** Bidirectional map: URL path ↔ Appointments L2 key */

export interface AppointmentsRoute {
  path: string;
  l2Key: string;
}

export const APPOINTMENTS_ROUTES: AppointmentsRoute[] = [
  // Human actions
  { path: "/appointments/calendar",                  l2Key: "Human actions/Calendar"        },
  { path: "/appointments/waitlist",                  l2Key: "Human actions/Waitlist"         },
  { path: "/appointments/provider",                  l2Key: "Human actions/Provider"         },
  // Agents
  { path: "/appointments/agents/scheduling",         l2Key: "Agents/Scheduling agent"        },
  { path: "/appointments/agents/cancellation",       l2Key: "Agents/Cancellation agent"      },
  { path: "/appointments/agents/rescheduling",       l2Key: "Agents/Rescheduling agent"      },
  { path: "/appointments/agents/reminder",           l2Key: "Agents/Reminder agent"          },
  { path: "/appointments/agents/waitlist-agent",     l2Key: "Agents/Waitlist agent"          },
  // Outcomes
  { path: "/appointments/outcomes/appointments",     l2Key: "Outcomes/Appointments"          },
  { path: "/appointments/outcomes/no-show-rate",     l2Key: "Outcomes/Book no-show rate"     },
  { path: "/appointments/outcomes/fill-rate",        l2Key: "Outcomes/Scheduled fill rate"   },
  { path: "/appointments/outcomes/all-reports",      l2Key: "Outcomes/All reports"           },
  // Resource
  { path: "/appointments/resource/knowledge-base",   l2Key: "Resource/Knowledge base"        },
  { path: "/appointments/resource/intake-forms",     l2Key: "Resource/Intake forms"          },
  // Settings
  { path: "/appointments/settings/phone-number",     l2Key: "Settings/Phone number"          },
  { path: "/appointments/settings/widgets",          l2Key: "Settings/Widgets"               },
];

export const APPOINTMENTS_DEFAULT_PATH = "/appointments/calendar";

export function l2KeyToAppointmentsPath(l2Key: string): string {
  return APPOINTMENTS_ROUTES.find((r) => r.l2Key === l2Key)?.path ?? APPOINTMENTS_DEFAULT_PATH;
}

export function pathnameToAppointmentsL2Key(pathname: string): string | undefined {
  return APPOINTMENTS_ROUTES.find(
    (r) => pathname === r.path || pathname.startsWith(r.path + "/"),
  )?.l2Key;
}
