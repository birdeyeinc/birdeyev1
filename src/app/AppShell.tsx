import {
  IconStrip, L2NavPanel, ReviewsL2NavPanel, SocialL2NavPanel,
  ContactsL2NavPanel, ListingsL2NavPanel, TicketingL2NavPanel,
  CampaignsL2NavPanel, SurveysL2NavPanel, CompetitorsL2NavPanel,
  AppointmentsL2NavPanel, InboxL2NavPanel, MynaConversationsL2NavPanel,
  ReferralsL2NavPanel,
  REFERRALS_L2_DEFAULT_ACTIVE_KEY,
  PaymentsL2NavPanel,
  PAYMENTS_L2_DEFAULT_ACTIVE_KEY,
  APPOINTMENTS_L2_CALENDAR_KEY,
  AeoProductListing1L2NavPanel,
  AeoSearchAiL2NavPanel,
} from "./components/Sidebar";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { usePersistedState } from "./hooks/usePersistedState";
import {
  pathnameToView,
  pathnameToL2Key,
  routeToPath,
  viewToDefaultPath,
} from "./appRoutes";
import { toast } from "sonner";
import { TopBar } from "./components/TopBar";
import { AppShellL2Placeholder } from "./components/layout/AppShellL2Placeholder";
import {
  birdAiShellShowsL2Placeholder,
} from "./components/layout/birdAiShellRoutes";
import {
  CONTACTS_L2_KEY_ALL,
  type ContactsAppBridge,
  type ContactsSheetMode,
} from "./components/ContactsView";
import type { ContactsBulkImportStep } from "./components/contacts/bulkImportTypes";
import { SEARCH_AI_L2_DEFAULT_ACTIVE } from "./components/searchai/searchAIL2Keys";
import { type DraftReport } from "./components/draftStore";
import {
  APP_SHELL_BELOW_TOPBAR_CARD_CLASS,
  APP_SHELL_GUTTER_SURFACE_CLASS,
} from "./components/layout/appShellClasses";
import { ResizableRightChatPanel } from "./components/layout/ResizableRightChatPanel";
import { MynaChatPanel } from "./components/MynaChatPanel";
import {
  getAppViewTitle,
} from "./appViewTitle";
import { l2KeyFromConversation } from "./myna/mynaL2NavKeys";
import { useMynaConversations } from "./myna/useMynaConversations";
import { ShortcutsModal } from "./shortcuts/ShortcutsModal";
import { useShortcuts } from "./shortcuts/useShortcuts";
import { SettingsL2NavPanel } from "./components/SettingsL2NavPanel";
import { SETTINGS_SECTIONS } from "./components/settings/settingsLandingData";
import type { SettingsBusinessRow } from "./components/settings/settingsBusinessTableData";
import {
  appointmentsL2ShowsCalendarCanvas,
  APPOINTMENTS_L2_WAITLIST_AGENT_KEY,
} from "./components/appointmentsL2Nav";
import { AppRouter } from "./AppRouter";
import type { AppView } from "./App";

type SettingsCanvasState = "list" | "business-table" | "business-detail" | "item-detail";
type SettingsTabId = "business-info" | "reviews";

interface AppShellProps {
  onSignOut: () => void;
}

export function AppShell({ onSignOut }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const pathnameRef = useRef(location.pathname);
  useEffect(() => { pathnameRef.current = location.pathname; }, [location.pathname]);

  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<DraftReport | null>(null);

  const currentView: AppView = pathnameToView(location.pathname);
  const setCurrentView = useCallback((view: AppView) => {
    navigate(viewToDefaultPath(view), { replace: true });
  }, [navigate]);

  function l2ForView(view: AppView, fallback: string): string {
    return currentView === view ? (pathnameToL2Key(location.pathname) ?? fallback) : fallback;
  }

  const navTo = useCallback((path: string) => {
    if (pathnameRef.current !== path) navigate(path, { replace: true });
  }, [navigate]);

  // Per-module L2 active keys
  const appointmentsL2Active = l2ForView("appointments", APPOINTMENTS_L2_CALENDAR_KEY);
  const setAppointmentsL2Active = useCallback((key: string) => {
    navTo(routeToPath("appointments", key));
  }, [navTo]);

  const [inboxL2Active, setInboxL2ActiveState] = useState<string>(() =>
    pathnameToView(location.pathname) === "inbox"
      ? (pathnameToL2Key(location.pathname) ?? "Human actions/All")
      : "Human actions/All"
  );
  const setInboxL2Active = useCallback((key: string) => {
    setInboxL2ActiveState(key);
    navTo(routeToPath("inbox", key));
  }, [navTo]);

  const referralsL2Active = l2ForView("referrals", REFERRALS_L2_DEFAULT_ACTIVE_KEY);
  const setReferralsL2Active = useCallback((key: string) => {
    navTo(routeToPath("referrals", key));
  }, [navTo]);

  const paymentsL2Active = l2ForView("payments", PAYMENTS_L2_DEFAULT_ACTIVE_KEY);
  const setPaymentsL2Active = useCallback((key: string) => {
    navTo(routeToPath("payments", key));
  }, [navTo]);

  const contactsL2Active = l2ForView("contacts", CONTACTS_L2_KEY_ALL);
  const setContactsL2Active = useCallback((key: string) => {
    navTo(routeToPath("contacts", key));
  }, [navTo]);

  const socialL2Active = l2ForView("social", "Publish/Calendar");
  const setSocialL2Active = useCallback((key: string) => {
    navTo(routeToPath("social", key));
  }, [navTo]);

  const settingsL2Active = l2ForView("settings", "Business info");
  const setSettingsL2Active = useCallback((key: string) => {
    navTo(routeToPath("settings", key));
  }, [navTo]);

  const journeysL2ActiveKey = l2ForView("birdai-journeys", "Agents/workflow");
  const setJourneysL2ActiveKey = useCallback((key: string) => {
    navTo(routeToPath("birdai-journeys", key));
  }, [navTo]);

  const [waitlistAgentBuilderOpen, setWaitlistAgentBuilderOpen] = useState(false);
  const [settingsScrollTarget, setSettingsScrollTarget] = useState<string | null>(null);
  const [settingsCanvasState, setSettingsCanvasState] = useState<SettingsCanvasState>("list");
  const [settingsActiveTab, setSettingsActiveTab] = useState<SettingsTabId>("business-info");
  const [selectedBusinessRow, setSelectedBusinessRow] = useState<SettingsBusinessRow | null>(null);
  const [selectedSettingsItem, setSelectedSettingsItem] = useState<{
    sectionKey: string;
    sectionLabel: string;
    itemKey: string;
    itemLabel: string;
  } | null>(null);

  const handleSettingsSectionClick = useCallback((label: string) => {
    setSettingsL2Active(label);
    setSettingsScrollTarget(label);
  }, []);

  const handleSettingsItemClick = useCallback((sectionKey: string, itemKey: string) => {
    const section = SETTINGS_SECTIONS.find((s) => s.key === sectionKey);
    const item = section?.items.find((it) => it.key === itemKey);
    if (!section || !item) return;
    if (sectionKey === "business-info" && itemKey === "business") {
      setSettingsCanvasState("business-table");
      setSettingsActiveTab("business-info");
      return;
    }
    setSelectedSettingsItem({
      sectionKey,
      sectionLabel: section.label,
      itemKey,
      itemLabel: item.label,
    });
    setSettingsCanvasState("item-detail");
  }, []);

  const [contactsSheetMode, setContactsSheetMode] = useState<ContactsSheetMode>("none");
  const [contactsDetailId, setContactsDetailId] = useState<number | null>(null);
  const [contactsQuickViewId, setContactsQuickViewId] = useState<number | null>(null);
  const [contactsBulkImportActive, setContactsBulkImportActive] = useState(false);
  const [contactsBulkImportStep, setContactsBulkImportStep] =
    useState<ContactsBulkImportStep>("upload");

  const handleContactsChooseBulkImport = useCallback(() => {
    setContactsBulkImportStep("upload");
    setContactsBulkImportActive(true);
  }, []);

  const handleContactsBulkCancel = useCallback(() => {
    setContactsBulkImportActive(false);
  }, []);

  const handleContactsBulkFinish = useCallback(() => {
    setContactsBulkImportActive(false);
    setContactsBulkImportStep("upload");
  }, []);

  useEffect(() => {
    if (currentView !== "contacts") {
      setContactsBulkImportActive(false);
      setContactsBulkImportStep("upload");
    }
  }, [currentView]);

  const handleContactsL2Change = useCallback((key: string) => {
    setContactsL2Active(key);
    setContactsDetailId(null);
    setContactsSheetMode("none");
    setContactsQuickViewId(null);
  }, []);

  const handleContactsAddContact = useCallback(() => {
    setContactsSheetMode("addContact");
    setContactsQuickViewId(null);
  }, []);

  const handleSendReferralRequest = useCallback(() => {
    toast.message("Send a referral request (prototype)");
  }, []);

  const handleRequestPayment = useCallback(() => {
    toast.message("Request a payment (prototype)");
  }, []);

  const contactsApp = useMemo<ContactsAppBridge>(
    () => ({
      l2ActiveItem: contactsL2Active,
      onL2ActiveItemChange: handleContactsL2Change,
      sheetMode: contactsSheetMode,
      onSheetModeChange: setContactsSheetMode,
      detailContactId: contactsDetailId,
      onDetailContactIdChange: setContactsDetailId,
      quickViewContactId: contactsQuickViewId,
      onQuickViewContactIdChange: setContactsQuickViewId,
      onChooseBulkImport: handleContactsChooseBulkImport,
    }),
    [
      contactsL2Active,
      handleContactsL2Change,
      contactsSheetMode,
      contactsDetailId,
      contactsQuickViewId,
      handleContactsChooseBulkImport,
    ],
  );

  useEffect(() => {
    if (currentView !== "contacts") {
      setContactsSheetMode("none");
      setContactsDetailId(null);
      setContactsQuickViewId(null);
    }
  }, [currentView]);

  const [searchAIL2Active, setSearchAIL2Active] = usePersistedState("nav:l2:searchai", SEARCH_AI_L2_DEFAULT_ACTIVE);
  const handleSearchAIL2Change = useCallback((key: string) => {
    setSearchAIL2Active(key);
  }, []);

  useEffect(() => {
    if (currentView !== "searchai") {
      setSearchAIL2Active(SEARCH_AI_L2_DEFAULT_ACTIVE);
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView !== "settings") {
      setSettingsCanvasState("list");
      setSettingsActiveTab("business-info");
      setSelectedBusinessRow(null);
      setSelectedSettingsItem(null);
    }
  }, [currentView]);

  const topBarTitle = useMemo(() => {
    if (currentView !== "settings") return undefined;
    if (settingsCanvasState === "business-table") return "Business";
    if (settingsCanvasState === "business-detail" && selectedBusinessRow) return selectedBusinessRow.businessName;
    if (settingsCanvasState === "item-detail" && selectedSettingsItem) return selectedSettingsItem.itemLabel;
    return "Settings";
  }, [currentView, settingsCanvasState, selectedBusinessRow, selectedSettingsItem]);

  const handleSocialL2Change = useCallback((key: string) => {
    setSocialL2Active(key);
  }, [setSocialL2Active]);

  const handleViewChange = useCallback((view: AppView, slug?: string) => {
    if (view !== currentView) {
      setMynaChatExpanded(false);
    }
    if (view === "settings" && currentView === "settings") {
      setSettingsCanvasState("list");
      setSettingsActiveTab("business-info");
      setSelectedBusinessRow(null);
      setSelectedSettingsItem(null);
      setSettingsScrollTarget(null);
    }
    if (slug?.startsWith("l2:")) {
      navTo(routeToPath(view, slug.slice(3)));
      return;
    }
    navTo(viewToDefaultPath(view));
  }, [currentView, navTo]);

  const handleEditDraft = (draft: DraftReport) => {
    setEditingDraft(draft);
    setMynaChatExpanded(false);
    navigate(viewToDefaultPath("dashboard"));
    setAiPanelOpen(true);
  };

  const handleViewReport = (_reportName: string) => {
    setEditingDraft(null);
    setMynaChatExpanded(false);
    setCurrentView("dashboard");
    setAiPanelOpen(true);
  };

  const handleAiPanelChange = (open: boolean) => {
    setAiPanelOpen(open);
    if (!open) setEditingDraft(null);
  };

  const [mynaChatOpen, setMynaChatOpen] = useState(false);
  const [mynaChatExpanded, setMynaChatExpanded] = useState(false);
  const [mynaComposerFocusNonce, setMynaComposerFocusNonce] = useState(0);

  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    appendUserAndAssistant,
    createEmptyConversation,
  } = useMynaConversations(getAppViewTitle(currentView));

  useEffect(() => {
    if (aiPanelOpen) setMynaChatExpanded(false);
  }, [aiPanelOpen]);

  useEffect(() => {
    if (!mynaChatOpen) setMynaChatExpanded(false);
  }, [mynaChatOpen]);

  useEffect(() => {
    document.title = `${getAppViewTitle(currentView)} – Birdeye`;
  }, [currentView]);

  const mynaWorkspaceExpanded = mynaChatOpen && mynaChatExpanded && !aiPanelOpen;

  const activeL2NavKey = useMemo(() => {
    if (!activeConversation) return "";
    return l2KeyFromConversation(activeConversation);
  }, [activeConversation]);

  const { shortcutsModalOpen, setShortcutsModalOpen } = useShortcuts({
    currentView,
    onNavigate: handleViewChange,
    mynaChatOpen,
    onMynaChatOpenChange: setMynaChatOpen,
    aiPanelOpen,
  });

  const startNewMynaChat = useCallback(() => {
    setMynaChatOpen(true);
    createEmptyConversation();
    setMynaComposerFocusNonce((n) => n + 1);
  }, [createEmptyConversation]);

  const mynaChatPanelEl = (
    <MynaChatPanel
      messages={activeConversation?.messages ?? []}
      onSend={appendUserAndAssistant}
      onClose={() => setMynaChatOpen(false)}
      expanded={mynaChatExpanded}
      onToggleExpand={() => setMynaChatExpanded((e) => !e)}
      conversations={conversations}
      activeConversationId={activeConversationId}
      onSelectConversation={setActiveConversationId}
      onOpenNewChat={startNewMynaChat}
      composerFocusNonce={mynaComposerFocusNonce}
    />
  );

  const chatLayoutRef = useRef<HTMLDivElement>(null);
  const [chatLayoutWidth, setChatLayoutWidth] = useState(0);

  useLayoutEffect(() => {
    const el = chatLayoutRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setChatLayoutWidth(el.clientWidth);
    });
    ro.observe(el);
    setChatLayoutWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const hasOwnL2Panel = (v: AppView) =>
    v === "business-overview" ||
    v === "shared-by-me" ||
    v === "inbox" ||
    v === "storybook" ||
    v === "reviews" ||
    v === "social" ||
    v === "searchai" ||
    v === "contacts" ||
    v === "scheduled-deliveries" ||
    v === "agents-monitor" ||
    v === "agents-analyze-performance" ||
    v === "agents-builder" ||
    v === "waitlist-agent" ||
    v === "agent-detail" ||
    v === "agents-onboarding" ||
    v === "birdai-reports" ||
    v === "birdai-journeys" ||
    v === "agent-activity" ||
    v === "agent-config" ||
    v === "listings" ||
    v === "surveys" ||
    v === "ticketing" ||
    v === "campaigns" ||
    v === "insights" ||
    v === "competitors" ||
    v === "referrals" ||
    v === "payments" ||
    v === "appointments" ||
    v === "aeo-product-listing-1" ||
    v === "aeo-search-ai" ||
    v === "settings";

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <ShortcutsModal
        open={shortcutsModalOpen}
        onOpenChange={setShortcutsModalOpen}
        currentView={currentView}
      />

      <IconStrip
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenKeyboardShortcuts={() => setShortcutsModalOpen(true)}
        onSignOut={onSignOut}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          currentView={currentView}
          onViewChange={handleViewChange}
          mynaChatOpen={mynaChatOpen}
          onToggleMynaChat={() => setMynaChatOpen((o) => !o)}
          titleOverride={topBarTitle}
        />

        <div
          className={
            contactsBulkImportActive && currentView === "contacts"
              ? `flex-1 flex min-h-0 overflow-hidden pl-0 pr-0 pb-0 ${APP_SHELL_GUTTER_SURFACE_CLASS}`
              : `flex-1 flex min-h-0 overflow-hidden pr-[10px] pb-[10px] pl-0 ${APP_SHELL_GUTTER_SURFACE_CLASS}`
          }
        >
          <div className={APP_SHELL_BELOW_TOPBAR_CARD_CLASS}>

            {/* Myna fullscreen: conversation L2 replaces product L2 */}
            {mynaWorkspaceExpanded && (
              <MynaConversationsL2NavPanel
                conversations={conversations}
                activeItem={activeL2NavKey}
                onSelectConversation={setActiveConversationId}
                onCreateNewChat={startNewMynaChat}
              />
            )}

            {!aiPanelOpen && !mynaWorkspaceExpanded && !hasOwnL2Panel(currentView) && (
              <L2NavPanel currentView={currentView} onViewChange={handleViewChange} />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "reviews" && (
              <ReviewsL2NavPanel />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "social" && socialL2Active !== "Create post" && (
              <SocialL2NavPanel activeItem={socialL2Active} onActiveItemChange={handleSocialL2Change} />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "searchai" && (
              <AppShellL2Placeholder />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "contacts" && !contactsBulkImportActive && (
              <ContactsL2NavPanel
                activeItem={contactsL2Active}
                onActiveItemChange={handleContactsL2Change}
                onAddContact={handleContactsAddContact}
              />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "listings" && (
              <ListingsL2NavPanel
                activeItem={journeysL2ActiveKey}
                onActiveItemChange={(key) => handleViewChange("listings", `l2:${key}`)}
              />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "surveys" && (
              <AppShellL2Placeholder caption="Surveys is not hosted in this shell — secondary nav is a preview only." />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "ticketing" && (
              <AppShellL2Placeholder caption="Ticketing is not hosted in this shell — secondary nav is a preview only." />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "campaigns" && (
              <CampaignsL2NavPanel />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "insights" && (
              <AppShellL2Placeholder caption="Insights is not hosted in this shell — secondary nav is a preview only." />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "competitors" && (
              <CompetitorsL2NavPanel />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "referrals" && (
              <ReferralsL2NavPanel
                activeItem={referralsL2Active}
                onActiveItemChange={setReferralsL2Active}
                onSendReferralRequest={handleSendReferralRequest}
              />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "payments" && (
              <PaymentsL2NavPanel
                activeItem={paymentsL2Active}
                onActiveItemChange={setPaymentsL2Active}
                onRequestPayment={handleRequestPayment}
              />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "appointments" &&
              !(appointmentsL2Active === APPOINTMENTS_L2_WAITLIST_AGENT_KEY && waitlistAgentBuilderOpen) &&
              !location.pathname.startsWith("/appointments/settings/widgets/") &&
              !location.pathname.endsWith("/edit") && (
              <AppointmentsL2NavPanel
                activeItem={appointmentsL2Active}
                onActiveItemChange={(key) => {
                  if (key === "Resources/Phone numbers") {
                    handleViewChange("birdai-journeys", "l2:Settings/channels");
                    return;
                  }
                  setAppointmentsL2Active(key);
                }}
              />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "settings" && settingsCanvasState === "list" && (
              <SettingsL2NavPanel
                activeSection={settingsL2Active}
                onSectionClick={handleSettingsSectionClick}
              />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "aeo-product-listing-1" && (
              <AeoProductListing1L2NavPanel />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "aeo-search-ai" && (
              <AeoSearchAiL2NavPanel />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && currentView === "inbox" && (
              <InboxL2NavPanel
                activeItem={inboxL2Active}
                onActiveItemChange={setInboxL2Active}
              />
            )}
            {!aiPanelOpen && !mynaWorkspaceExpanded && birdAiShellShowsL2Placeholder(currentView) && (
              <AppShellL2Placeholder caption="BirdAI is not hosted in this shell — secondary nav is a preview only." />
            )}

            {/* Main content + optional Myna chat */}
            <div
              ref={chatLayoutRef}
              className="flex min-h-0 min-w-0 flex-1 overflow-hidden"
            >
              {!mynaWorkspaceExpanded ? (
                <AppRouter
                  currentView={currentView}
                  handleViewChange={handleViewChange}
                  inboxL2Active={inboxL2Active}
                  socialL2Active={socialL2Active}
                  handleSocialL2Change={handleSocialL2Change}
                  contactsApp={contactsApp}
                  contactsBulkImportActive={contactsBulkImportActive}
                  contactsBulkImportStep={contactsBulkImportStep}
                  setContactsBulkImportStep={setContactsBulkImportStep}
                  handleContactsBulkCancel={handleContactsBulkCancel}
                  handleContactsBulkFinish={handleContactsBulkFinish}
                  journeysL2ActiveKey={journeysL2ActiveKey}
                  referralsL2Active={referralsL2Active}
                  paymentsL2Active={paymentsL2Active}
                  appointmentsL2Active={appointmentsL2Active}
                  setAppointmentsL2Active={setAppointmentsL2Active}
                  waitlistAgentBuilderOpen={waitlistAgentBuilderOpen}
                  setWaitlistAgentBuilderOpen={setWaitlistAgentBuilderOpen}
                  locationPathname={location.pathname}
                  settingsCanvasState={settingsCanvasState}
                  setSettingsCanvasState={setSettingsCanvasState}
                  settingsScrollTarget={settingsScrollTarget}
                  setSettingsScrollTarget={setSettingsScrollTarget}
                  settingsL2Active={settingsL2Active}
                  setSettingsL2Active={setSettingsL2Active}
                  settingsActiveTab={settingsActiveTab}
                  setSettingsActiveTab={setSettingsActiveTab}
                  selectedBusinessRow={selectedBusinessRow}
                  setSelectedBusinessRow={setSelectedBusinessRow}
                  selectedSettingsItem={selectedSettingsItem}
                  handleSettingsItemClick={handleSettingsItemClick}
                  aiPanelOpen={aiPanelOpen}
                  handleAiPanelChange={handleAiPanelChange}
                  editingDraft={editingDraft}
                  handleEditDraft={handleEditDraft}
                  handleViewReport={handleViewReport}
                />
              ) : null}
              <ResizableRightChatPanel
                open={mynaChatOpen}
                workspaceExpanded={mynaWorkspaceExpanded}
                layoutRowWidth={chatLayoutWidth}
              >
                {mynaChatPanelEl}
              </ResizableRightChatPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
