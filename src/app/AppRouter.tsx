import { Dashboard } from "./components/Dashboard";
import { ListingsReportView } from "./components/listings/ListingsReportView";
import { SharedByMe } from "./components/SharedByMe";
import { InboxView } from "./components/InboxView";
import { ComponentShowcase } from "./components/ComponentShowcase";
import { ReviewsView } from "./components/ReviewsView";
import { SocialView } from "./components/SocialView";
import { AppShellContentPlaceholder } from "./components/layout/AppShellContentPlaceholder";
import {
  birdAiShellShowsMainPlaceholder,
} from "./components/layout/birdAiShellRoutes";
import {
  ContactsView,
  type ContactsAppBridge,
} from "./components/ContactsView";
import { ContactsBulkImportWorkspace } from "./components/contacts/ContactsBulkImportWorkspace";
import type { ContactsBulkImportStep } from "./components/contacts/bulkImportTypes";
import { ScheduledDeliveriesView } from "./components/ScheduledDeliveriesView";
import { ScheduleBuilderView } from "./components/ScheduleBuilderView";
import { ReferralsView, referralsL2KeyToSection } from "./components/ReferralsView";
import { PaymentsView, paymentsL2KeyToStatusFilter } from "./components/PaymentsView";
import { AppointmentsView } from "./components/AppointmentsView";
import { AppointmentWidgetsView } from "./components/AppointmentWidgetsView";
import { WaitlistView } from "./components/WaitlistView";
import {
  appointmentsL2PlaceholderProductLabel,
  appointmentsL2ShowsCalendarCanvas,
  appointmentsL2ShowsWidgetsCanvas,
  appointmentsL2ShowsKnowledgeBase,
  appointmentsL2ShowsPhoneNumbers,
  appointmentsL2ShowsIntakeForms,
  APPOINTMENTS_L2_WAITLIST_KEY,
  APPOINTMENTS_L2_WAITLIST_COPY_KEY,
  APPOINTMENTS_L2_PROVIDER_KEY,
  APPOINTMENTS_L2_WAITLIST_AGENT_KEY,
} from "./components/appointmentsL2Nav";
import { IntakeFormsView } from "./components/IntakeFormsView";
import { KnowledgeBaseView } from "./components/KnowledgeBaseView";
import { PhoneNumbersView } from "./components/PhoneNumbersView";
import { KNOWLEDGE_BASE_L2_KEY } from "./components/knowledgeBaseMockData";
import { InboxVoiceSettingsView } from "./components/InboxVoiceSettingsView";
import { INBOX_VOICE_SETTINGS_L2_KEY } from "./components/inboxVoiceMockData";
import { SurveysView } from "./components/SurveysView";
import { TicketingView } from "./components/TicketingView";
import { ListingsView } from "./components/ListingsView";
import { CampaignsView } from "./components/CampaignsView";
import { CompetitorsView } from "./components/CompetitorsView";
import { type DraftReport } from "./components/draftStore";
import { ConversationStream } from "./components/ConversationStream";
import { AgentActivityView } from "./components/AgentActivityView";
import { AgentConfigView } from "./components/AgentConfigView";
import { AgentsBuilderView } from "./components/AgentsBuilderView";
import { WaitlistAgentView } from "./components/WaitlistAgentView";
import { WaitlistAgentContainer } from "./components/WaitlistAgentContainer";
import { SettingsView } from "./components/SettingsView";
import { SettingsBusinessTableView } from "./components/settings/SettingsBusinessTableView";
import { SettingsBusinessDetailView } from "./components/settings/SettingsBusinessDetailView";
import { SettingsItemDetailView } from "./components/settings/SettingsItemDetailView";
import type { SettingsBusinessRow } from "./components/settings/settingsBusinessTableData";
import { JourneysChannelsView } from "./components/JourneysChannelsView";
import BusinessOverviewDashboard from "./components/BusinessOverviewDashboard";
import { APP_MAIN_CONTENT_SHELL_CLASS } from "./components/layout/appShellClasses";
import type { AppView } from "./App";

type SettingsCanvasState = "list" | "business-table" | "business-detail" | "item-detail";
type SettingsTabId = "business-info" | "reviews";

export interface AppRouterProps {
  currentView: AppView;
  handleViewChange: (view: AppView, slug?: string) => void;

  // Inbox
  inboxL2Active: string;

  // Social
  socialL2Active: string;
  handleSocialL2Change: (key: string) => void;

  // Contacts
  contactsApp: ContactsAppBridge;
  contactsBulkImportActive: boolean;
  contactsBulkImportStep: ContactsBulkImportStep;
  setContactsBulkImportStep: (step: ContactsBulkImportStep) => void;
  handleContactsBulkCancel: () => void;
  handleContactsBulkFinish: () => void;

  // Listings / journeys
  journeysL2ActiveKey: string;

  // Referrals
  referralsL2Active: string;

  // Payments
  paymentsL2Active: string;

  // Appointments
  appointmentsL2Active: string;
  setAppointmentsL2Active: (key: string) => void;
  waitlistAgentBuilderOpen: boolean;
  setWaitlistAgentBuilderOpen: (open: boolean) => void;
  locationPathname: string;

  // Settings
  settingsCanvasState: SettingsCanvasState;
  setSettingsCanvasState: (state: SettingsCanvasState) => void;
  settingsScrollTarget: string | null;
  setSettingsScrollTarget: (target: string | null) => void;
  settingsL2Active: string;
  setSettingsL2Active: (key: string) => void;
  settingsActiveTab: SettingsTabId;
  setSettingsActiveTab: (tab: SettingsTabId) => void;
  selectedBusinessRow: SettingsBusinessRow | null;
  setSelectedBusinessRow: (row: SettingsBusinessRow | null) => void;
  selectedSettingsItem: { sectionKey: string; sectionLabel: string; itemKey: string; itemLabel: string } | null;
  handleSettingsItemClick: (sectionKey: string, itemKey: string) => void;

  // Dashboard / AI panel
  aiPanelOpen: boolean;
  handleAiPanelChange: (open: boolean) => void;
  editingDraft: DraftReport | null;
  handleEditDraft: (draft: DraftReport) => void;
  handleViewReport: (reportName: string) => void;
}

export function AppRouter({
  currentView,
  handleViewChange,
  inboxL2Active,
  socialL2Active,
  handleSocialL2Change,
  contactsApp,
  contactsBulkImportActive,
  contactsBulkImportStep,
  setContactsBulkImportStep,
  handleContactsBulkCancel,
  handleContactsBulkFinish,
  journeysL2ActiveKey,
  referralsL2Active,
  paymentsL2Active,
  appointmentsL2Active,
  setAppointmentsL2Active,
  waitlistAgentBuilderOpen,
  setWaitlistAgentBuilderOpen,
  locationPathname,
  settingsCanvasState,
  setSettingsCanvasState,
  settingsScrollTarget,
  setSettingsScrollTarget,
  settingsL2Active,
  setSettingsL2Active,
  settingsActiveTab,
  setSettingsActiveTab,
  selectedBusinessRow,
  setSelectedBusinessRow,
  selectedSettingsItem,
  handleSettingsItemClick,
  aiPanelOpen,
  handleAiPanelChange,
  editingDraft,
  handleEditDraft,
  handleViewReport,
}: AppRouterProps) {
  return (
    <div
      className={
        contactsBulkImportActive && currentView === "contacts"
          ? `${APP_MAIN_CONTENT_SHELL_CLASS} min-h-0 min-w-0 flex-1`
          : `${APP_MAIN_CONTENT_SHELL_CLASS} min-h-0 min-w-[60%]`
      }
    >
      {currentView === "business-overview" ? (
        <BusinessOverviewDashboard />
      ) : currentView === "shared-by-me" ? (
        <SharedByMe onEditDraft={handleEditDraft} onViewReport={handleViewReport} />
      ) : currentView === "inbox" ? (
        inboxL2Active === KNOWLEDGE_BASE_L2_KEY ? (
          <KnowledgeBaseView />
        ) : inboxL2Active === INBOX_VOICE_SETTINGS_L2_KEY ? (
          <InboxVoiceSettingsView />
        ) : (
          <InboxView activeL2Key={inboxL2Active} />
        )
      ) : currentView === "storybook" ? (
        <ComponentShowcase />
      ) : currentView === "reviews" ? (
        <ReviewsView />
      ) : currentView === "social" ? (
        <SocialView activeItem={socialL2Active} onActiveItemChange={handleSocialL2Change} />
      ) : currentView === "searchai" ? (
        <AppShellContentPlaceholder view="searchai" />
      ) : currentView === "birdai-journeys" && journeysL2ActiveKey === "Settings/channels" ? (
        <JourneysChannelsView />
      ) : birdAiShellShowsMainPlaceholder(currentView) ? (
        <AppShellContentPlaceholder view={currentView} />
      ) : currentView === "contacts" && contactsBulkImportActive ? (
        <ContactsBulkImportWorkspace
          step={contactsBulkImportStep}
          onStepChange={setContactsBulkImportStep}
          onCancel={handleContactsBulkCancel}
          onFinish={handleContactsBulkFinish}
        />
      ) : currentView === "contacts" ? (
        <ContactsView app={contactsApp} />
      ) : currentView === "scheduled-deliveries" ? (
        <ScheduledDeliveriesView onCreateSchedule={() => handleViewChange("schedule-builder")} />
      ) : currentView === "schedule-builder" ? (
        <ScheduleBuilderView onBack={() => handleViewChange("agent-detail", "scheduled-reports")} />
      ) : currentView === "listings" ? (
        <ListingsView l2ActiveItem={journeysL2ActiveKey} />
      ) : currentView === "surveys" ? (
        <AppShellContentPlaceholder view="surveys" productLabel="Surveys" />
      ) : currentView === "ticketing" ? (
        <AppShellContentPlaceholder view="ticketing" productLabel="Ticketing" />
      ) : currentView === "intake" ? (
        <AppShellContentPlaceholder view="intake" productLabel="Intake" />
      ) : currentView === "front-desk" ? (
        <AppShellContentPlaceholder view="front-desk" productLabel="Front Desk" />
      ) : currentView === "prescription" ? (
        <AppShellContentPlaceholder view="prescription" productLabel="Prescription" />
      ) : currentView === "insurance" ? (
        <AppShellContentPlaceholder view="insurance" productLabel="Insurance" />
      ) : currentView === "resources" ? (
        <AppShellContentPlaceholder view="resources" productLabel="Resources" />
      ) : currentView === "campaigns" ? (
        <CampaignsView />
      ) : currentView === "insights" ? (
        <AppShellContentPlaceholder view="insights" />
      ) : currentView === "competitors" ? (
        <CompetitorsView />
      ) : currentView === "referrals" ? (
        <ReferralsView activeSection={referralsL2KeyToSection(referralsL2Active)} />
      ) : currentView === "payments" ? (
        <PaymentsView statusFilter={paymentsL2KeyToStatusFilter(paymentsL2Active)} />
      ) : currentView === "appointments" ? (
        appointmentsL2ShowsCalendarCanvas(appointmentsL2Active) ? (
          <AppointmentsView />
        ) : appointmentsL2Active === APPOINTMENTS_L2_WAITLIST_AGENT_KEY ? (
          <WaitlistAgentContainer
            onBack={() => setAppointmentsL2Active(APPOINTMENTS_L2_WAITLIST_KEY)}
            onBuilderOpen={() => setWaitlistAgentBuilderOpen(true)}
            onBuilderClose={() => setWaitlistAgentBuilderOpen(false)}
          />
        ) : (
          appointmentsL2Active === APPOINTMENTS_L2_PROVIDER_KEY ||
          appointmentsL2Active === APPOINTMENTS_L2_WAITLIST_COPY_KEY ||
          appointmentsL2Active === APPOINTMENTS_L2_WAITLIST_KEY
        ) ? (
          <WaitlistView
            key="appointments-waitlist-provider"
            title={appointmentsL2Active === APPOINTMENTS_L2_PROVIDER_KEY ? "Providers" : "Waitlist"}
            description={
              appointmentsL2Active === APPOINTMENTS_L2_PROVIDER_KEY
                ? "Manage providers and their availability for upcoming appointments."
                : "Track patients waiting for an appointment and schedule them as slots open up."
            }
            ctaLabel={appointmentsL2Active === APPOINTMENTS_L2_PROVIDER_KEY ? "Add provider" : "Add patients"}
            firstColumnLabel={appointmentsL2Active === APPOINTMENTS_L2_PROVIDER_KEY ? "Provider" : "Patient"}
            providerColumnLabel={appointmentsL2Active === APPOINTMENTS_L2_PROVIDER_KEY ? "Speciality" : "Provider"}
            providerMode={appointmentsL2Active === APPOINTMENTS_L2_PROVIDER_KEY}
          />
        ) : appointmentsL2ShowsWidgetsCanvas(appointmentsL2Active) ? (
          <AppointmentWidgetsView />
        ) : appointmentsL2ShowsKnowledgeBase(appointmentsL2Active) ? (
          <KnowledgeBaseView />
        ) : appointmentsL2ShowsPhoneNumbers(appointmentsL2Active) ? (
          <PhoneNumbersView />
        ) : appointmentsL2ShowsIntakeForms(appointmentsL2Active) ? (
          <IntakeFormsView />
        ) : (
          <AppShellContentPlaceholder
            view="appointments"
            productLabel={appointmentsL2PlaceholderProductLabel(appointmentsL2Active)}
          />
        )
      ) : currentView === "aeo-product-listing-1" ? (
        <AppShellContentPlaceholder view="aeo-product-listing-1" productLabel="Listings" />
      ) : currentView === "aeo-search-ai" ? (
        <AppShellContentPlaceholder view="aeo-search-ai" productLabel="Search AI" />
      ) : currentView === "conversation-stream" ? (
        <ConversationStream />
      ) : currentView === "agents-builder" ? (
        <AgentsBuilderView onBack={() => handleViewChange("agents-monitor")} />
      ) : currentView === "waitlist-agent" ? (
        <WaitlistAgentView onBack={() => handleViewChange("agents-monitor")} />
      ) : currentView === "agent-activity" ? (
        <AgentActivityView onConfigure={() => handleViewChange("agent-config")} />
      ) : currentView === "agent-config" ? (
        <AgentConfigView />
      ) : currentView === "settings" ? (
        settingsCanvasState === "list" ? (
          <SettingsView
            scrollTarget={settingsScrollTarget}
            onScrollTargetConsumed={() => setSettingsScrollTarget(null)}
            activeSection={settingsL2Active}
            onActiveSectionChange={setSettingsL2Active}
            onItemClick={handleSettingsItemClick}
          />
        ) : settingsCanvasState === "business-table" ? (
          <SettingsBusinessTableView
            onNavigateHome={() => setSettingsCanvasState("list")}
            activeTab={settingsActiveTab}
            onTabChange={setSettingsActiveTab}
            onRowClick={(row) => {
              setSelectedBusinessRow(row);
              setSettingsCanvasState("business-detail");
            }}
          />
        ) : selectedBusinessRow ? (
          <SettingsBusinessDetailView
            row={selectedBusinessRow}
            onNavigateHome={() => setSettingsCanvasState("list")}
            onNavigateTable={() => setSettingsCanvasState("business-table")}
            activeTab={settingsActiveTab}
            onTabChange={setSettingsActiveTab}
          />
        ) : settingsCanvasState === "item-detail" && selectedSettingsItem ? (
          <SettingsItemDetailView
            sectionLabel={selectedSettingsItem.sectionLabel}
            itemLabel={selectedSettingsItem.itemLabel}
          />
        ) : (
          <SettingsBusinessTableView
            onNavigateHome={() => setSettingsCanvasState("list")}
            activeTab={settingsActiveTab}
            onTabChange={setSettingsActiveTab}
            onRowClick={(row) => {
              setSelectedBusinessRow(row);
              setSettingsCanvasState("business-detail");
            }}
          />
        )
      ) : currentView === "listings-report" ? (
        <ListingsReportView />
      ) : (
        <Dashboard
          aiPanelOpen={aiPanelOpen}
          onAiPanelChange={handleAiPanelChange}
          editingDraft={editingDraft}
        />
      )}
    </div>
  );
}
