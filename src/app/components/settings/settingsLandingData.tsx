import type { ReactElement } from "react";
import {
  Globe as GlobeL, Instagram,
  Music2, Webhook, LayoutGrid, Wrench as WrenchL,
  // Mono (single-colour) equivalents for each Phosphor duotone icon
  Building2, ClipboardCheck, QrCode as QrCodeL,
  Image as ImageL, HelpCircle, Link2, FileText as FileTextL,
  ShoppingBag as ShoppingBagL, Truck as TruckL, Utensils, Scale, Building,
  Fingerprint as FingerprintL, Star as StarL, Share2,
  ListChecks as ListChecksL, CheckSquare as CheckSquareL,
  BarChart3, TrendingUp, Tag as TagL,
  Bot, Phone, CircleDollarSign,
  CalendarDays, Mail,
  ShieldOff, GitFork as GitForkL, LifeBuoy, Package as PackageL, LayoutDashboard,
} from "lucide-react";
import {
  Buildings, ClipboardText, QrCode,
  Image, Question, LinkSimple, FileText,
  ShoppingBag, Truck, Scales, Package,
  Fingerprint,
  Star, ShareNetwork,
  ListChecks, CheckSquare, ChartBar, TrendUp, Tag,
  Robot, PhoneCall, CurrencyDollar,
  CalendarBlank, Envelope,
  ShieldSlash, GitFork, Lifebuoy, AppWindow,
  Globe, GridFour, WebhooksLogo, ForkKnife,
} from "@phosphor-icons/react";
import type { SettingsStatusMeta } from "./settingsStatusConfig";
import { FacebookIcon, LinkedInIcon, WhatsAppIcon, YouTubeIcon } from "@/app/components/PlatformIcons";
import { YelpLogo } from "@/app/components/reviewPlatformLogos";

const SZ = 24;
const SW = 1.6;

/** Duotone Phosphor icon with section-specific color. */
function id(Icon: React.ElementType, color: string): () => ReactElement {
  return () => <Icon size={SZ} weight="duotone" color={color} className="shrink-0" />;
}

/** Plain Lucide icon with explicit color class (used where Phosphor equivalent missing). */
function ic(Icon: React.ElementType, className: string): () => ReactElement {
  return () => <Icon size={SZ} strokeWidth={SW} absoluteStrokeWidth className={`${className} shrink-0`} />;
}

function ib(Icon: React.ElementType, chipClass: string, iconClass = "text-white"): () => ReactElement {
  return () => (
    <span className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full ${chipClass}`}>
      <Icon size={14} strokeWidth={SW} absoluteStrokeWidth className={iconClass} />
    </span>
  );
}

function brandIcon(node: ReactElement): () => ReactElement {
  return () => (
    <span className="inline-flex size-6 shrink-0 items-center justify-center">
      {node}
    </span>
  );
}

/** Single-colour Lucide icon in the product's icon-primary token. */
function iMono(Icon: React.ElementType): () => ReactElement {
  return () => <Icon size={SZ} strokeWidth={SW} absoluteStrokeWidth className="text-icon-primary shrink-0" />;
}

/** Keyed mono-icon lookup — used by `applyIconStyle` to swap duotone → mono. */
const MONO_ICONS: Record<string, () => ReactElement> = {
  "business":                 iMono(Building2),
  "setup-status":             iMono(ClipboardCheck),
  "qr-codes":                 iMono(QrCodeL),
  "media-library":            iMono(ImageL),
  "faqs":                     iMono(HelpCircle),
  "links":                    iMono(Link2),
  "files":                    iMono(FileTextL),
  "gmc":                      iMono(ShoppingBagL),
  "ms365":                    iMono(LayoutGrid),
  "toast":                    iMono(Utensils),
  "olo":                      iMono(TruckL),
  "servicetitan":             iMono(WrenchL),
  "appfolio":                 iMono(Building),
  "neos":                     iMono(Scale),
  "all-apps":                 iMono(LayoutGrid),
  "api":                      iMono(Webhook),
  "brand-identity":           iMono(FingerprintL),
  "review-response-agent":    iMono(StarL),
  "review-generation-agent":  iMono(StarL),
  "social-engagement-agent":  iMono(Share2),
  "response-templates":       iMono(FileTextL),
  "auto-reply-rules":         iMono(ListChecksL),
  "auto-share-rules":         iMono(Share2),
  "ratings-display":          iMono(StarL),
  "approval":                 iMono(CheckSquareL),
  "categories-keywords":      iMono(TagL),
  "birdeye-score":            iMono(TrendingUp),
  "manage-competitors":       iMono(BarChart3),
  "chatbot-ai":               iMono(Bot),
  "receptionist":             iMono(Phone),
  "set-up-payments":          iMono(CircleDollarSign),
  "widget":                   iMono(CalendarDays),
  "notifications-alerts":     iMono(Mail),
  "blocked-keywords":         iMono(ShieldOff),
  "groups":                   iMono(GitForkL),
  "support":                  iMono(LifeBuoy),
  "timezone":                 iMono(GlobeL),
  "products":                 iMono(PackageL),
  "dashboard-appearance":     iMono(LayoutDashboard),
};

/**
 * Returns sections with icons swapped to single-colour Lucide variants when
 * `style === "mono"`. Brand icons (Google, Facebook, Yelp, etc.) are unchanged.
 */
export function applyIconStyle(
  sections: SettingsSection[],
  style: "multicolor" | "mono",
): SettingsSection[] {
  if (style === "multicolor") return sections;
  return sections.map((s) => ({
    ...s,
    items: s.items.map((it) => ({
      ...it,
      icon: MONO_ICONS[it.key] ?? it.icon,
    })),
  }));
}

// ─── Section accent colours ───────────────────────────────────────────────────
const C_BLUE    = "#2552ED"; // Primary blue — used across all sections
const C_VIOLET  = "#7C3AED"; // AI agents only

export interface SettingsItem {
  key: string;
  label: string;
  description: string;
  icon: () => ReactElement;
  status?: SettingsStatusMeta;
  badge?: "new";
  agentStatus?: "live" | "inactive";
}

export interface SettingsSection {
  key: string;
  label: string;
  description: string;
  accentColor: string;
  learnMore?: boolean;
  banner?: { message: string; linkLabel?: string };
  items: SettingsItem[];
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    key: "business-info",
    label: "Business info",
    description: "Add all your business locations and unlock the power of Birdeye.",
    accentColor: C_BLUE,
    learnMore: true,
    items: [
      { key: "business",      label: "Business",      description: "Manage business locations, hours, services, and contact details across every channel.",     icon: id(Buildings,    C_BLUE) },
      { key: "setup-status",  label: "Setup status",  description: "Track your onboarding progress and finish remaining setup steps in one place.",              icon: id(ClipboardText, C_BLUE) },
      { key: "qr-codes",      label: "QR codes",      description: "Generate branded QR codes that link customers to review and booking pages.",                 icon: id(QrCode,        C_BLUE) },
    ],
  },
  {
    key: "knowledge",
    label: "Knowledge",
    description: "One place to manage your AI ground truth across files, docs, images, and videos.",
    accentColor: C_BLUE,
    items: [
      { key: "media-library", label: "Media library", description: "Centralize images, videos, and brand assets that AI agents can reference.",                  icon: id(Image,       C_BLUE) },
      { key: "faqs",          label: "FAQs",          description: "Curate frequently asked questions so AI replies stay on-brand and accurate.",                icon: id(Question,    C_BLUE) },
      { key: "links",         label: "Links",         description: "Save canonical URLs your team and AI agents share most often.",                              icon: id(LinkSimple,  C_BLUE) },
      { key: "files",         label: "Files",         description: "Upload PDFs, docs, and policies that ground AI responses in your truth.",                    icon: id(FileText,    C_BLUE) },
    ],
  },
  {
    key: "integrations",
    label: "Integrations",
    description: "Connect your social media pages to help promote brand content.",
    accentColor: C_BLUE,
    learnMore: true,
    banner: {
      message: "Delegate the management of Apple Business Connect to Birdeye for faster business listing updates, reporting, and more.",
      linkLabel: "Learn more",
    },
    items: [
      { key: "google",       label: "Google",                description: "Connect Google Business profiles to sync reviews, posts, and Q&A.",                   icon: ic(GlobeL, "text-[#4285F4]"),       status: { type: "disconnected", label: "7 pages disconnected" } },
      { key: "facebook",     label: "Facebook",              description: "Link Facebook pages to publish updates and capture reviews.",                          icon: brandIcon(<FacebookIcon />),        status: { type: "disconnected", label: "3 pages disconnected" } },
      { key: "yelp",         label: "Yelp",                  description: "Sync Yelp listings to monitor and respond to reviews in one inbox.",                   icon: brandIcon(<YelpLogo size={24} />),  status: { type: "partial",       label: "2 of 171 connected" } },
      { key: "instagram",    label: "Instagram",             description: "Connect Instagram to schedule posts and reply to comments.",                           icon: ib(Instagram, "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45]"),        status: { type: "disconnected", label: "2 pages disconnected" } },
      { key: "whatsapp",     label: "WhatsApp",              description: "Route WhatsApp inquiries into the unified inbox for faster responses.",                icon: brandIcon(<WhatsAppIcon />),        status: { type: "not_connected", label: "Not connected" } },
      { key: "linkedin",     label: "LinkedIn",              description: "Publish company updates and engage prospects from one workspace.",                     icon: brandIcon(<LinkedInIcon />),        status: { type: "disconnected", label: "1 page disconnected" } },
      { key: "youtube",      label: "YouTube",               description: "Sync YouTube channels to manage comments alongside other reviews.",                    icon: brandIcon(<YouTubeIcon />),         status: { type: "disconnected", label: "1 page disconnected" } },
      { key: "tiktok",       label: "TikTok",                description: "Connect TikTok to schedule clips and pull engagement data.",                           icon: ib(Music2, "bg-[#111111]"),         status: { type: "disconnected", label: "1 page disconnected" } },
      { key: "gmc",          label: "Google Merchant Center",description: "Sync product listings so reviews and shopping data stay in step.",                    icon: id(ShoppingBag, C_BLUE),            status: { type: "connected",    label: "Connected" } },
      { key: "ms365",        label: "Microsoft Office 365",  description: "Connect calendars and email to keep customer comms synced.",                          icon: id(GridFour,    C_BLUE),            status: { type: "partial",      label: "Partially connected" } },
      { key: "toast",        label: "TOAST",                 description: "Pull restaurant orders and guest data from TOAST POS.",                               icon: id(ForkKnife,   C_BLUE),            status: { type: "needs_attention", label: "Needs attention" } },
      { key: "olo",          label: "Olo",                   description: "Sync ordering and delivery data from Olo to drive review requests.",                  icon: id(Truck,       C_BLUE),            status: { type: "partial",      label: "Partially connected" } },
      { key: "servicetitan", label: "ServiceTitan",          description: "Trigger review requests from ServiceTitan jobs the moment they close.",               icon: id(WrenchL,     C_BLUE),            status: { type: "partial",      label: "Partially connected" } },
      { key: "appfolio",     label: "AppFolio",              description: "Sync resident and property data from AppFolio to power outreach.",                    icon: id(Buildings,   C_BLUE),            status: { type: "partial",      label: "Partially connected" } },
      { key: "neos",         label: "NEOS",                  description: "Connect NEOS case management to message clients at the right moments.",               icon: id(Scales,      C_BLUE),            status: { type: "partial",      label: "Partially connected" } },
      { key: "all-apps",     label: "All apps",              description: "Browse the full integration catalog and connect new tools in minutes.",               icon: id(GridFour,    C_BLUE) },
      { key: "api",          label: "API",                   description: "Build custom workflows with REST endpoints and webhooks.",                             icon: id(WebhooksLogo, C_BLUE) },
    ],
  },
  {
    key: "birdai",
    label: "BirdAI",
    description: "Optimize everyday tasks and boost your productivity with BirdAI.",
    accentColor: C_BLUE,
    learnMore: true,
    items: [
      { key: "brand-identity", label: "Brand Identity", description: "Define tone, voice, and brand rules so every AI reply sounds like you.", icon: id(Fingerprint, C_BLUE) },
    ],
  },
  {
    key: "ai-agents",
    label: "AI agents",
    description: "Leverage AI agents to automate customer interactions and streamline business operations.",
    accentColor: C_VIOLET,
    items: [
      { key: "review-response-agent",    label: "Review response agent",    description: "Auto-reply to reviews using your brand voice and approval rules.",                             icon: id(Star,         C_VIOLET), agentStatus: "live" },
      { key: "review-generation-agent",  label: "Review generation agent",  description: "Send automated review requests with AI optimization to generate more reviews.",               icon: id(Star,         C_VIOLET) },
      { key: "social-engagement-agent",  label: "Social engagement agent",  description: "Engage followers with timely AI-drafted replies on every connected channel.",                icon: id(ShareNetwork, C_VIOLET) },
    ],
  },
  {
    key: "reviews",
    label: "Reviews",
    description: "Manage and cross-promote reviews on your social sites.",
    accentColor: C_BLUE,
    learnMore: true,
    items: [
      { key: "response-templates", label: "Response templates", description: "Save reusable replies and let AI personalize each response.",                        icon: id(FileText,     C_BLUE) },
      { key: "auto-reply-rules",   label: "Auto-reply rules",   description: "Set rules that decide when AI replies and when humans step in.",                    icon: id(ListChecks,   C_BLUE) },
      { key: "auto-share-rules",   label: "Auto-share rules",   description: "Automatically cross-post your best reviews to social channels.",                   icon: id(ShareNetwork, C_BLUE) },
      { key: "ratings-display",    label: "Ratings display",    description: "Choose how star ratings and totals appear on your website widgets.",                icon: id(Star,         C_BLUE) },
      { key: "approval",           label: "Approval",           description: "Configure who reviews AI replies before they go live.",                             icon: id(CheckSquare,  C_BLUE) },
    ],
  },
  {
    key: "insights",
    label: "Insights",
    description: "Reveal meaningful and actionable insights via customers' feedback.",
    accentColor: C_BLUE,
    learnMore: true,
    items: [
      { key: "categories-keywords", label: "Categories and keywords", description: "Tag review themes so trends and pain points surface automatically.",          icon: id(Tag,      C_BLUE) },
      { key: "birdeye-score",       label: "Birdeye Score",           description: "Customize how your composite reputation score is calculated.",               icon: id(TrendUp,  C_BLUE) },
    ],
  },
  {
    key: "competitors",
    label: "Competitors",
    description: "Evaluate your competitors' strengths and weaknesses to reinforce your market strategy.",
    accentColor: C_BLUE,
    learnMore: true,
    items: [
      { key: "manage-competitors", label: "Manage competitors", description: "Add and remove the competitors you want to benchmark against.", icon: id(ChartBar, C_BLUE) },
    ],
  },
  {
    key: "inbox",
    label: "Inbox",
    description: "Convert inquiries over text, social, email, chatbot AI and voicemail into one unified inbox.",
    accentColor: C_BLUE,
    learnMore: true,
    items: [
      { key: "chatbot-ai",   label: "Chatbot AI",   description: "Train the chatbot's tone, knowledge, and escalation rules.",               icon: id(Robot,     C_BLUE) },
      { key: "receptionist", label: "Receptionist", description: "Set up the AI voice receptionist that answers calls 24/7.",                icon: id(PhoneCall, C_BLUE) },
    ],
  },
  {
    key: "payments",
    label: "Payments",
    description: "Get paid faster, improve customer satisfaction and track funds via Birdeye Payments.",
    accentColor: C_BLUE,
    learnMore: true,
    items: [
      { key: "set-up-payments", label: "Set up payments", description: "Connect a processor and start collecting payments via text and email.", icon: id(CurrencyDollar, C_BLUE) },
    ],
  },
  {
    key: "appointments",
    label: "Appointments",
    description: "Make it easy for customers to book appointments on your website.",
    accentColor: C_BLUE,
    learnMore: true,
    items: [
      { key: "widget",               label: "Set up your widget",      description: "Embed a booking widget on your site and tailor the customer experience.",   icon: id(CalendarBlank, C_BLUE) },
      { key: "notifications-alerts", label: "Notifications and Alerts", description: "Choose when staff and customers get reminders and confirmations.",         icon: id(Envelope,      C_BLUE) },
    ],
  },
  {
    key: "account",
    label: "Account",
    description: "Manage your account including users, employees, support and more!",
    accentColor: C_BLUE,
    learnMore: true,
    items: [
      { key: "blocked-keywords",    label: "Blocked keywords",     description: "Block specific terms from triggering AI replies or auto-shares.",               icon: id(ShieldSlash,  C_BLUE) },
      { key: "groups",              label: "Groups",               description: "Organize locations and teams to control who sees what.",                       icon: id(GitFork,      C_BLUE) },
      { key: "support",             label: "Support",              description: "Reach the Birdeye support team or browse help articles.",                      icon: id(Lifebuoy,     C_BLUE) },
      { key: "timezone",            label: "Timezone",             description: "Set the default timezone used across reports and schedules.",                  icon: id(Globe,        C_BLUE) },
      { key: "products",            label: "Products",             description: "Enable or disable Birdeye products for this workspace.",                       icon: id(Package,      C_BLUE) },
      { key: "dashboard-appearance",label: "Dashboard appearance", description: "Tune theme, density, and default views for your dashboard.",                  icon: id(AppWindow,    C_BLUE) },
    ],
  },
];

export const SETTINGS_SECTION_LABELS = SETTINGS_SECTIONS.map((s) => s.label);
