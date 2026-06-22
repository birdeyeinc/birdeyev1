import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { Toaster } from "sonner";
import { MonitorNotificationsProvider } from "./context/MonitorNotificationsContext";
import { BirdAILoginPage } from "./components/auth/BirdAILoginPage";
import { AppEntryWithSplash } from "./components/layout/AppEntryWithSplash";
import { MobileWebAppGate } from "./components/layout/MobileWebAppGate";
import { useMobileWebGateActive } from "./hooks/useMobileWebGateActive";
import { AppShell } from "./AppShell";
import { VerticalProvider } from "./verticalContext";
import {
  LOGIN_TAB_TITLES,
  LOGIN_TAB_TITLE_COUNT,
} from "./appViewTitle";
import { viewToDefaultPath } from "./appRoutes";

const AUTH_STORAGE_KEY = "birdai_demo_authenticated";
const LOGIN_TAB_TITLE_INDEX_KEY = "auth:login_tab_title_index";

function parseStoredLoginTabIndex(raw: string | null): number {
  if (raw === null) return 0;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return 0;
  return ((n % LOGIN_TAB_TITLE_COUNT) + LOGIN_TAB_TITLE_COUNT) % LOGIN_TAB_TITLE_COUNT;
}

function readDemoAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export type AppView =
  | "business-overview"
  | "dashboard"
  | "shared-by-me"
  | "inbox"
  | "storybook"
  | "reviews"
  | "social"
  | "searchai"
  | "contacts"
  | "scheduled-deliveries"
  | "agents-monitor"
  | "agents-analyze-performance"
  | "agents-builder"
  | "waitlist-agent"
  | "agent-detail"
  | "agents-onboarding"
  | "schedule-builder"
  | "birdai-reports"
  | "birdai-journeys"
  | "listings"
  | "surveys"
  | "ticketing"
  | "intake"
  | "front-desk"
  | "prescription"
  | "insurance"
  | "resources"
  | "campaigns"
  | "insights"
  | "competitors"
  | "referrals"
  | "payments"
  | "appointments"
  | "conversation-stream"
  | "agent-activity"
  | "agent-config"
  | "aeo-product-listing-1"
  | "aeo-search-ai"
  | "listings-report"
  | "settings";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => readDemoAuthenticated());
  const { gateActive } = useMobileWebGateActive();
  const navigate = useNavigate();

  const signIn = useCallback(() => {
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      sessionStorage.setItem("nav:l1", JSON.stringify("reviews"));
    } catch { /* ignore */ }
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, "false");
      const cur = parseStoredLoginTabIndex(sessionStorage.getItem(LOGIN_TAB_TITLE_INDEX_KEY));
      sessionStorage.setItem(LOGIN_TAB_TITLE_INDEX_KEY, String((cur + 1) % LOGIN_TAB_TITLE_COUNT));
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith("nav:"))
        .forEach((k) => sessionStorage.removeItem(k));
    } catch { /* ignore */ }

    const idx = parseStoredLoginTabIndex(sessionStorage.getItem(LOGIN_TAB_TITLE_INDEX_KEY));
    document.title = LOGIN_TAB_TITLES[idx];
    setIsAuthenticated(false);
  }, []);

  if (gateActive) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <MobileWebAppGate />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <BirdAILoginPage onAuthenticated={signIn} />
      </>
    );
  }

  return (
    <VerticalProvider>
      <MonitorNotificationsProvider
        onNavigateToMonitor={() => navigate(viewToDefaultPath("agents-monitor"))}
      >
        <AppEntryWithSplash>
          <Toaster position="top-center" richColors />
          <AppShell onSignOut={signOut} />
        </AppEntryWithSplash>
      </MonitorNotificationsProvider>
    </VerticalProvider>
  );
}
