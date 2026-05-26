/**
 * Application route registry — single source of truth for all URL paths.
 *
 * URL scheme:
 *   /[module]                        → L1 view (root or default L2)
 *   /[module]/[section]/[item]       → L2 nav item within a module
 *
 * Conventions:
 *   - Slugs are lowercase-hyphenated
 *   - Sections are omitted when flat (referrals, payments)
 *   - For modules that render a single canvas regardless of L2
 *     (reviews, listings, competitors…) only the L1 path is defined here;
 *     the view component manages internal state.
 */

import type { AppView } from "./App";

// ─── Route shape ─────────────────────────────────────────────────────────────

export interface AppRouteEntry {
  /** Browser URL path */
  path: string;
  /** Which top-level canvas to render */
  view: AppView;
  /**
   * L2 nav key in "Section/Child" format.
   * Absent for routes where the view renders its own internal navigation.
   */
  l2Key?: string;
  /** Human-readable breadcrumb label */
  label: string;
}

// ─── Route table ─────────────────────────────────────────────────────────────

export const APP_ROUTES: AppRouteEntry[] = [

  // ── Overview ───────────────────────────────────────────────────────────────
  { path: "/overview",            view: "business-overview",     label: "Overview" },

  // ── Agents (BirdAI) ────────────────────────────────────────────────────────
  { path: "/agents",              view: "agents-monitor",        label: "Agents – Workflow" },
  { path: "/agents/waitlist",     view: "waitlist-agent",        label: "Agents – Waitlist agent" },
  { path: "/agents/activity",     view: "agent-activity",        label: "Agents – Activity log" },
  { path: "/agents/config",       view: "agent-config",          label: "Agents – Configuration" },
  { path: "/agents/builder",      view: "agents-builder",        label: "Agents – Builder" },
  { path: "/agents/channels",     view: "birdai-journeys", l2Key: "Settings/channels",            label: "Agents – Channels" },
  { path: "/agents/templates",    view: "birdai-journeys", l2Key: "Settings/templates",           label: "Agents – Templates" },
  { path: "/agents/knowledge",    view: "birdai-journeys", l2Key: "Settings/knowledge",           label: "Agents – Knowledge" },
  { path: "/agents/memory",       view: "birdai-journeys", l2Key: "Settings/memory",              label: "Agents – Memory" },
  { path: "/agents/campaign",     view: "birdai-journeys", l2Key: "Agents/campaign",              label: "Agents – Campaign agents" },
  { path: "/agents/comm-restriction", view: "birdai-journeys", l2Key: "Settings/comm-restriction", label: "Agents – Communication restriction" },
  { path: "/agents/manage-tags",  view: "birdai-journeys", l2Key: "Settings/manage-tags",         label: "Agents – Manage tags" },

  // ── Reviews ────────────────────────────────────────────────────────────────
  // ReviewsView manages its own internal L2 state; only the root is registered here.
  { path: "/reviews",             view: "reviews",               label: "Reviews" },

  // ── Listings ───────────────────────────────────────────────────────────────
  { path: "/listings",            view: "aeo-product-listing-1", label: "Listings" },

  // ── Social ─────────────────────────────────────────────────────────────────
  { path: "/social",                             view: "social", l2Key: "Publish/Calendar",            label: "Social – Publish calendar" },
  { path: "/social/publish/drafts",              view: "social", l2Key: "Publish/View drafts",         label: "Social – Drafts" },
  { path: "/social/publish/approve",             view: "social", l2Key: "Publish/Approve posts",       label: "Social – Approve posts" },
  { path: "/social/publish/fix-failed",          view: "social", l2Key: "Publish/Fix failed posts",    label: "Social – Fix failed posts" },
  { path: "/social/publish/fix-rejected",        view: "social", l2Key: "Publish/Fix rejected posts",  label: "Social – Fix rejected posts" },
  { path: "/social/publish/expired",             view: "social", l2Key: "Publish/Expired posts",       label: "Social – Expired posts" },
  { path: "/social/engage/all",                  view: "social", l2Key: "Engage/View all engagements", label: "Social – All engagements" },
  { path: "/social/engage/assigned-to-me",       view: "social", l2Key: "Engage/Assigned to me",       label: "Social – Assigned to me" },
  { path: "/social/engage/approve-replies",      view: "social", l2Key: "Engage/Approve replies",      label: "Social – Approve replies" },
  { path: "/social/engage/fix-rejected",         view: "social", l2Key: "Engage/Fix rejected replies", label: "Social – Fix rejected replies" },
  { path: "/social/engage/spam",                 view: "social", l2Key: "Engage/View spam",            label: "Social – Spam" },
  { path: "/social/reports/all-channels",        view: "social", l2Key: "Reports/All channels",        label: "Social – All channels" },
  { path: "/social/reports/post-performance",    view: "social", l2Key: "Reports/Post performance",    label: "Social – Post performance" },
  { path: "/social/reports/response-trends",     view: "social", l2Key: "Reports/Response trends",     label: "Social – Response trends" },
  { path: "/social/reports/best-time",           view: "social", l2Key: "Reports/Best time to post",   label: "Social – Best time to post" },
  { path: "/social/competitors/benchmarking",    view: "social", l2Key: "Competitors/Benchmarking",    label: "Social – Benchmarking" },
  { path: "/social/competitors/posts",           view: "social", l2Key: "Competitors/Posts",           label: "Social – Competitor posts" },
  { path: "/social/libraries/post-library",      view: "social", l2Key: "Libraries/Post library",      label: "Social – Post library" },
  { path: "/social/libraries/media-library",     view: "social", l2Key: "Libraries/Media library",     label: "Social – Media library" },
  { path: "/social/libraries/reply-templates",   view: "social", l2Key: "Libraries/Reply templates",   label: "Social – Reply templates" },
  { path: "/social/agents/publishing",           view: "social", l2Key: "Agents/Publishing agent",     label: "Social – Publishing agent" },
  { path: "/social/agents/engagement",           view: "social", l2Key: "Agents/Engagement agent",     label: "Social – Engagement agent" },
  { path: "/social/settings/approvals",          view: "social", l2Key: "Settings/Approvals",          label: "Social – Approvals" },
  { path: "/social/settings/link-in-bio",        view: "social", l2Key: "Settings/Link in bio",        label: "Social – Link in bio" },
  { path: "/social/settings/tags",               view: "social", l2Key: "Settings/Tags",               label: "Social – Tags" },

  // ── Referrals ──────────────────────────────────────────────────────────────
  { path: "/referrals",           view: "referrals", l2Key: "flatNav/sent",   label: "Referrals – Sent" },
  { path: "/referrals/sent",      view: "referrals", l2Key: "flatNav/sent",   label: "Referrals – Sent" },
  { path: "/referrals/shared",    view: "referrals", l2Key: "flatNav/shared", label: "Referrals – Shared" },
  { path: "/referrals/leads",     view: "referrals", l2Key: "flatNav/leads",  label: "Referrals – Leads" },

  // ── Campaigns ──────────────────────────────────────────────────────────────
  { path: "/campaigns",           view: "campaigns",             label: "Campaigns" },

  // ── Inbox ──────────────────────────────────────────────────────────────────
  { path: "/inbox",                              view: "inbox", l2Key: "Human actions/All",              label: "Inbox – All" },
  { path: "/inbox/all",                          view: "inbox", l2Key: "Human actions/All",              label: "Inbox – All" },
  { path: "/inbox/assigned-to-me",              view: "inbox", l2Key: "Human actions/Assigned to me",  label: "Inbox – Assigned to me" },
  { path: "/inbox/appointments",                view: "inbox", l2Key: "Human actions/Appointments",    label: "Inbox – Appointments" },
  { path: "/inbox/leads",                        view: "inbox", l2Key: "Human actions/Leads",           label: "Inbox – Leads" },
  { path: "/inbox/messages",                     view: "inbox", l2Key: "Human actions/Messages",        label: "Inbox – Messages" },
  { path: "/inbox/reviews",                      view: "inbox", l2Key: "Human actions/Reviews",         label: "Inbox – Reviews" },
  { path: "/inbox/spam",                         view: "inbox", l2Key: "Human actions/Spam",            label: "Inbox – Spam" },
  { path: "/inbox/surveys",                      view: "inbox", l2Key: "Human actions/Surveys",         label: "Inbox – Surveys" },
  { path: "/inbox/status/follow-up",             view: "inbox", l2Key: "Status/Follow up",              label: "Inbox – Follow up" },
  { path: "/inbox/status/lost",                  view: "inbox", l2Key: "Status/Lost",                   label: "Inbox – Lost" },
  { path: "/inbox/status/missed-call",           view: "inbox", l2Key: "Status/Missed call",            label: "Inbox – Missed call" },
  { path: "/inbox/status/new-lead",              view: "inbox", l2Key: "Status/New lead",               label: "Inbox – New lead" },
  { path: "/inbox/status/new-voicemails",        view: "inbox", l2Key: "Status/New voicemails",         label: "Inbox – New voicemails" },
  { path: "/inbox/status/scheduling-request",    view: "inbox", l2Key: "Status/Scheduling request",     label: "Inbox – Scheduling request" },
  { path: "/inbox/status/service",               view: "inbox", l2Key: "Status/Service",                label: "Inbox – Service" },
  { path: "/inbox/status/unqualified",           view: "inbox", l2Key: "Status/Unqualified",            label: "Inbox – Unqualified" },
  { path: "/inbox/status/won",                   view: "inbox", l2Key: "Status/Won",                    label: "Inbox – Won" },
  { path: "/inbox/filter/missed-calls",          view: "inbox", l2Key: "Saved filter/Missed calls today",     label: "Inbox – Missed calls today" },
  { path: "/inbox/filter/new-patient",           view: "inbox", l2Key: "Saved filter/New patient inquiries",  label: "Inbox – New patient inquiries" },
  { path: "/inbox/agents/lead-generation",       view: "inbox", l2Key: "Agents/Lead generation agents",       label: "Inbox – Lead generation agents" },
  { path: "/inbox/agents/tagging-routing",       view: "inbox", l2Key: "Agents/Tagging & routing agent",      label: "Inbox – Tagging & routing agent" },
  { path: "/inbox/resource/knowledge-base",      view: "inbox", l2Key: "Resources/Knowledge base",            label: "Inbox – Knowledge base" },
  { path: "/inbox/settings/chatbot",             view: "inbox", l2Key: "Settings/Chatbot",                    label: "Inbox – Chatbot" },
  { path: "/inbox/settings/receptionist",        view: "inbox", l2Key: "Settings/Receptionist",               label: "Inbox – Receptionist" },
  { path: "/inbox/settings/voice",               view: "inbox", l2Key: "Settings/Voice",                      label: "Inbox – Voice" },

  // ── Appointments ───────────────────────────────────────────────────────────
  // Human actions
  { path: "/appointments",                                  view: "appointments", l2Key: "Human actions/Calendar",         label: "Appointments – Calendar" },
  { path: "/appointments/calendar",                         view: "appointments", l2Key: "Human actions/Calendar",         label: "Appointments – Calendar" },
  { path: "/appointments/waitlist",                         view: "appointments", l2Key: "Human actions/Waitlist",         label: "Appointments – Waitlist" },
  { path: "/appointments/provider",                         view: "appointments", l2Key: "Human actions/Provider",         label: "Appointments – Provider" },
  // Agents
  { path: "/appointments/agents/scheduling",                view: "appointments", l2Key: "Agents/Scheduling agent",        label: "Appointments – Scheduling agent" },
  { path: "/appointments/agents/cancellation",              view: "appointments", l2Key: "Agents/Cancellation agent",      label: "Appointments – Cancellation agent" },
  { path: "/appointments/agents/rescheduling",              view: "appointments", l2Key: "Agents/Rescheduling agent",      label: "Appointments – Rescheduling agent" },
  { path: "/appointments/agents/reminder",                  view: "appointments", l2Key: "Agents/Reminder agent",          label: "Appointments – Reminder agent" },
  { path: "/appointments/agents/waitlist-agent",            view: "appointments", l2Key: "Agents/Waitlist agent",          label: "Appointments – Waitlist agent" },
  // Outcomes
  { path: "/appointments/outcomes/appointments",            view: "appointments", l2Key: "Outcomes/Appointments",          label: "Appointments – Outcomes" },
  { path: "/appointments/outcomes/no-show-rate",            view: "appointments", l2Key: "Outcomes/Book no-show rate",     label: "Appointments – No-show rate" },
  { path: "/appointments/outcomes/fill-rate",               view: "appointments", l2Key: "Outcomes/Scheduled fill rate",   label: "Appointments – Fill rate" },
  { path: "/appointments/outcomes/all-reports",             view: "appointments", l2Key: "Outcomes/All reports",           label: "Appointments – All reports" },
  // Resource
  { path: "/appointments/resource/knowledge-base",          view: "appointments", l2Key: "Resource/Knowledge base",        label: "Appointments – Knowledge base" },
  { path: "/appointments/resource/intake-forms",            view: "appointments", l2Key: "Resource/Intake forms",          label: "Appointments – Intake forms" },
  // Settings
  { path: "/appointments/settings/phone-number",            view: "appointments", l2Key: "Settings/Phone number",          label: "Appointments – Phone number" },
  { path: "/appointments/settings/widgets",                 view: "appointments", l2Key: "Settings/Widgets",               label: "Appointments – Widgets" },

  // ── Payments ───────────────────────────────────────────────────────────────
  { path: "/payments",            view: "payments", l2Key: "flatNav/all",       label: "Payments – All" },
  { path: "/payments/all",        view: "payments", l2Key: "flatNav/all",       label: "Payments – All" },
  { path: "/payments/received",   view: "payments", l2Key: "flatNav/received",  label: "Payments – Received" },
  { path: "/payments/requested",  view: "payments", l2Key: "flatNav/requested", label: "Payments – Requested" },
  { path: "/payments/not-paid",   view: "payments", l2Key: "flatNav/not-paid",  label: "Payments – Not paid" },
  { path: "/payments/refunded",   view: "payments", l2Key: "flatNav/refunded",  label: "Payments – Refunded" },
  { path: "/payments/cancelled",  view: "payments", l2Key: "flatNav/cancelled", label: "Payments – Cancelled" },

  // ── Contacts ───────────────────────────────────────────────────────────────
  { path: "/contacts",                       view: "contacts", l2Key: "standalone/All contacts",     label: "Contacts – All" },
  { path: "/contacts/all",                   view: "contacts", l2Key: "standalone/All contacts",     label: "Contacts – All" },
  { path: "/contacts/lists",                 view: "contacts", l2Key: "standalone/Lists & segments", label: "Contacts – Lists & segments" },
  { path: "/contacts/settings/custom-fields",view: "contacts", l2Key: "Settings/Custom fields",     label: "Contacts – Custom fields" },
  { path: "/contacts/settings/tags",         view: "contacts", l2Key: "Settings/Tags",              label: "Contacts – Tags" },

  // ── Operations (placeholder L1 views) ──────────────────────────────────────
  { path: "/intake",              view: "intake",       label: "Intake" },
  { path: "/front-desk",          view: "front-desk",   label: "Front desk" },
  { path: "/prescription",        view: "prescription", label: "Prescription" },
  { path: "/insurance",           view: "insurance",    label: "Insurance" },

  // ── Customer Experience ────────────────────────────────────────────────────
  { path: "/surveys",             view: "surveys",      label: "Surveys" },
  { path: "/ticketing",           view: "ticketing",    label: "Ticketing" },
  { path: "/insights",            view: "insights",     label: "Insights" },
  { path: "/competitors",         view: "competitors",  label: "Competitors" },

  // ── Data & Resources ───────────────────────────────────────────────────────
  { path: "/reports",             view: "dashboard",    label: "Reports" },
  { path: "/resources",           view: "resources",    label: "Resources" },

  // ── Settings ───────────────────────────────────────────────────────────────
  { path: "/settings",                              view: "settings", label: "Settings" },
  { path: "/settings/business-info",                view: "settings", l2Key: "Business info",   label: "Settings – Business info" },
  { path: "/settings/knowledge",                    view: "settings", l2Key: "Knowledge",        label: "Settings – Knowledge" },
  { path: "/settings/integrations",                 view: "settings", l2Key: "Integrations",     label: "Settings – Integrations" },
  { path: "/settings/birdai",                       view: "settings", l2Key: "BirdAI",           label: "Settings – BirdAI" },
  { path: "/settings/ai-agents",                    view: "settings", l2Key: "AI agents",        label: "Settings – AI agents" },
  { path: "/settings/reviews",                      view: "settings", l2Key: "Reviews",          label: "Settings – Reviews" },
  { path: "/settings/insights",                     view: "settings", l2Key: "Insights",         label: "Settings – Insights" },
  { path: "/settings/competitors",                  view: "settings", l2Key: "Competitors",      label: "Settings – Competitors" },
  { path: "/settings/inbox",                        view: "settings", l2Key: "Inbox",            label: "Settings – Inbox" },
  { path: "/settings/payments",                     view: "settings", l2Key: "Payments",         label: "Settings – Payments" },
  { path: "/settings/appointments",                 view: "settings", l2Key: "Appointments",     label: "Settings – Appointments" },
  { path: "/settings/account",                      view: "settings", l2Key: "Account",          label: "Settings – Account" },

  // ── Misc / internal ────────────────────────────────────────────────────────
  { path: "/search-ai",              view: "searchai",             label: "Search AI" },
  { path: "/conversation-stream",    view: "conversation-stream",  label: "Conversation stream" },
  { path: "/scheduled-deliveries",   view: "scheduled-deliveries", label: "Scheduled deliveries" },
  { path: "/schedule-builder",       view: "schedule-builder",     label: "Schedule builder" },
  { path: "/listings-report",        view: "listings-report",      label: "Listings report" },
  { path: "/storybook",              view: "storybook",            label: "Storybook" },
];

// ─── Default path per L1 view ─────────────────────────────────────────────────

/** First matching path for each view (used when navigating to a module root). */
const VIEW_DEFAULT_PATHS: Partial<Record<AppView, string>> = {};
for (const r of APP_ROUTES) {
  if (!VIEW_DEFAULT_PATHS[r.view]) VIEW_DEFAULT_PATHS[r.view] = r.path;
}

export function viewToDefaultPath(view: AppView): string {
  return VIEW_DEFAULT_PATHS[view] ?? "/reviews";
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────

/**
 * Find the best-matching route for a given pathname.
 * Exact match wins; otherwise longest-prefix match.
 */
export function pathnameToRoute(pathname: string): AppRouteEntry | undefined {
  // Exact match first
  const exact = APP_ROUTES.find((r) => r.path === pathname);
  if (exact) return exact;
  // Longest prefix match (more specific segments win)
  return APP_ROUTES
    .filter((r) => pathname.startsWith(r.path + "/"))
    .sort((a, b) => b.path.length - a.path.length)[0];
}

export function pathnameToView(pathname: string): AppView {
  return pathnameToRoute(pathname)?.view ?? "reviews";
}

export function pathnameToL2Key(pathname: string): string | undefined {
  return pathnameToRoute(pathname)?.l2Key;
}

/** Resolve a view + optional L2 key to a URL path. */
export function routeToPath(view: AppView, l2Key?: string): string {
  if (l2Key) {
    const match = APP_ROUTES.find((r) => r.view === view && r.l2Key === l2Key);
    if (match) return match.path;
  }
  return viewToDefaultPath(view);
}
