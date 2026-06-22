import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  VERTICALS,
  DEFAULT_VERTICAL,
  isValidVertical,
  type VerticalId,
  type Vertical,
} from "@/verticals/index";

const STORAGE_KEY = "birdeye_active_vertical";

function readStoredVertical(): VerticalId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidVertical(stored)) return stored;
  } catch { /* ignore */ }
  return DEFAULT_VERTICAL;
}

interface VerticalContextValue {
  active: Vertical;
  verticals: Vertical[];
  switchVertical: (id: VerticalId) => void;
}

const VerticalContext = createContext<VerticalContextValue | null>(null);

export function VerticalProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeId, setActiveId] = useState<VerticalId>(readStoredVertical);

  const active = VERTICALS.find((v) => v.id === activeId)!;

  const switchVertical = useCallback((id: VerticalId) => {
    if (id === activeId) return;
    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* ignore */ }
    setActiveId(id);

    // Preserve the current feature path when switching verticals.
    // Strip the current vertical slug prefix and replace with the new one.
    const current = location.pathname;
    const withoutSlug = current.replace(/^\/(healthcare|automotive|dental)/, "") || "/";
    navigate(`/${id}${withoutSlug}`, { replace: true });
  }, [activeId, location.pathname, navigate]);

  return (
    <VerticalContext.Provider value={{ active, verticals: VERTICALS, switchVertical }}>
      {children}
    </VerticalContext.Provider>
  );
}

export function useVertical(): VerticalContextValue {
  const ctx = useContext(VerticalContext);
  if (!ctx) throw new Error("useVertical must be used inside VerticalProvider");
  return ctx;
}
