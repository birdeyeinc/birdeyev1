import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { WaitlistAgentView } from "./WaitlistAgentView";
import "./WaitlistAgentBuilder.css";

/* ─── Icon helper (reuses Material Symbols loaded in index.html) ─── */
function Icon({ name, size = 20, style = {} }: { name: string; size?: number; style?: React.CSSProperties }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: size, width: size, height: size, lineHeight: 1, overflow: "hidden", ...style }}
    >
      {name}
    </span>
  );
}

/* ─── Star icon (filled, blue) ─── */
function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#3b62f6" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

/* ─── Empty state illustration — matches Figma node 742:100908 ─── */
function EmptyIllustration() {
  return (
    /* Outer rounded container — light blue-grey bg */
    <div style={{
      width: 218, height: 194, borderRadius: 16,
      background: "#dde3ef",
      padding: "25px 17px 0",
      position: "relative", flexShrink: 0,
    }}>
      {/* White card wrapper */}
      <div style={{
        background: "var(--gray-0)", borderRadius: 8,
        padding: 12, display: "flex", flexDirection: "column", gap: 12,
        width: 184,
      }}>
        {/* Top inner card */}
        <div style={{
          background: "#ebeff6", border: "1px solid #8d9dca",
          borderRadius: 4, padding: 8,
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {/* Text lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: 24, height: 6, borderRadius: 100, background: "#8d9dca" }} />
            <div style={{ width: 135, height: 5, borderRadius: 100, background: "rgba(141,157,202,0.3)" }} />
            <div style={{ width: 55, height: 5, borderRadius: 100, background: "rgba(141,157,202,0.3)" }} />
          </div>
          {/* Stars */}
          <div style={{ display: "flex", gap: 4 }}>
            <StarIcon /><StarIcon /><StarIcon /><StarIcon />
          </div>
        </div>

        {/* Bottom inner card */}
        <div style={{
          background: "#ebeff6", border: "1px solid #8d9dca",
          borderRadius: 4, padding: 8,
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ width: 24, height: 6, borderRadius: 100, background: "#8d9dca" }} />
          <div style={{ width: 135, height: 5, borderRadius: 100, background: "rgba(141,157,202,0.3)" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Agent type ─── */
interface WaitlistAgent {
  id: number;
  name: string;
  status: "Running" | "Paused" | "Draft";
  created: string;
  locations: string[];
}

const SEEDED_AGENTS: WaitlistAgent[] = [
  { id: 1, name: "SF Slot-Fill Agent",  status: "Running", created: "Apr 28, 2026", locations: ["San Francisco, CA"] },
  { id: 2, name: "Chicago Auto-Fill",   status: "Running", created: "May 1, 2026",  locations: ["Chicago, IL"] },
  { id: 3, name: "Multi-site Agent",    status: "Paused",  created: "May 3, 2026",  locations: ["San Francisco, CA", "Boston, MA", "Atlanta, GA"] },
  { id: 4, name: "Houston Draft",       status: "Draft",   created: "May 7, 2026",  locations: ["Houston, TX"] },
];

const ALL_LOCATIONS = Array.from(new Set(SEEDED_AGENTS.flatMap(a => a.locations)));

function formatLocations(locations: string[]): string {
  if (locations.length === 1) return locations[0];
  const abbrev = (l: string) => l.split(",")[0].replace(/\s+/g, "").slice(0, 3);
  if (locations.length === 2) return locations.map(abbrev).join(" · ");
  return `${abbrev(locations[0])} · ${abbrev(locations[1])} · +${locations.length - 2}`;
}

/* ─── List / empty state view ─── */
function WaitlistAgentListView({ onCreateAgent }: { onCreateAgent: () => void }) {
  const [tab, setTab] = useState<"agents" | "library">("agents");
  const [agents] = useState<WaitlistAgent[]>(SEEDED_AGENTS);
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "12px 4px",
    marginRight: 24,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "20px",
    letterSpacing: "-0.28px",
    color: active ? "#212121" : "#555",
    background: "none",
    border: "none",
    borderBottom: active ? "2px solid #1976d2" : "2px solid transparent",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  });

  const statusColor: Record<string, string> = {
    Running: "#1aab6d",
    Paused: "#ed6c02",
    Draft: "#9e9e9e",
  };

  const visibleAgents = locationFilter === "All locations"
    ? agents
    : agents.filter(a => a.locations.includes(locationFilter));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--gray-0)", fontFamily: "'Inter', sans-serif", color: "var(--gray-900)", overflow: "hidden" }}>

      <MainCanvasViewHeader
        title="Waitlist Agent"
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ width: 28, height: 28, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: "var(--gray-300)" }}>
              <Icon name="search" />
            </button>
            <Button type="button" onClick={onCreateAgent}>Create agent</Button>
            {/* Location filter */}
            <div style={{ position: "relative" }}>
              <button
                style={{ display: "flex", alignItems: "center", gap: 6, height: 36, padding: "0 10px", background: "var(--gray-0)", border: "1px solid #e5e9f0", borderRadius: 4, cursor: "pointer", fontSize: 13, color: "var(--gray-300)", whiteSpace: "nowrap" }}
                onClick={() => setLocationDropdownOpen(v => !v)}
              >
                {locationFilter}
                <Icon name="expand_more" size={16} />
              </button>
              {locationDropdownOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "var(--gray-0)", border: "1px solid #e5e9f0", borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 100, minWidth: 200, padding: 4 }}>
                  {["All locations", ...ALL_LOCATIONS].map(loc => (
                    <button key={loc} type="button"
                      onClick={() => { setLocationFilter(loc); setLocationDropdownOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 12px", background: locationFilter === loc ? "#e5e9f0" : "transparent", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, color: "var(--gray-500)" }}
                    >{loc}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* Tabs */}
      <div style={{ paddingLeft: 24, flexShrink: 0, display: "flex" }}>
        <button style={tabStyle(tab === "agents")} onClick={() => setTab("agents")}>Agents</button>
        <button style={tabStyle(tab === "library")} onClick={() => setTab("library")}>Library</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {tab === "agents" && visibleAgents.length === 0 && agents.length === 0 && (
          /* Empty state */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
            <EmptyIllustration />
            <span style={{ fontSize: 16, fontWeight: 400, color: "var(--gray-900)", lineHeight: "24px", letterSpacing: "-0.32px" }}>
              Create your first waitlist agent
            </span>
            <span style={{ fontSize: 14, fontWeight: 400, color: "var(--gray-300)", lineHeight: "20px", letterSpacing: "-0.28px", textAlign: "center", maxWidth: 480 }}>
              Start by creating your first waitlist agent — helps with auto-filling available slots,
              notifying patients, and managing your waitlist automatically.
            </span>
            <Button type="button" onClick={onCreateAgent}>Create agent</Button>
          </div>
        )}

        {tab === "agents" && (visibleAgents.length > 0 || agents.length > 0) && (
          <div style={{ padding: "20px 24px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter', sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e9f0" }}>
                  {["Name", "Locations", "Status", "Created", ""].map((h) => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 500, color: "var(--gray-300)", letterSpacing: "-0.24px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleAgents.map((a) => (
                  <tr key={a.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontSize: 14, color: "var(--gray-900)", letterSpacing: "-0.28px" }}>{a.name}</td>
                    <td style={{ padding: "12px", fontSize: 13, color: "var(--gray-300)", letterSpacing: "-0.26px" }}>{formatLocations(a.locations)}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontSize: 12, color: statusColor[a.status] || "#555", background: `${statusColor[a.status]}18`, borderRadius: 4, padding: "2px 8px" }}>{a.status}</span>
                    </td>
                    <td style={{ padding: "12px", fontSize: 14, color: "var(--gray-300)", letterSpacing: "-0.28px" }}>{a.created}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <button style={{ border: "none", background: "none", cursor: "pointer", color: "var(--gray-300)", display: "flex", alignItems: "center" }}>
                        <Icon name="more_vert" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "library" && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray-90)", fontSize: 14 }}>
            Template library coming soon
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Container: manages list ↔ builder navigation ─── */
export function WaitlistAgentContainer({
  onBack,
  onBuilderOpen,
  onBuilderClose,
}: {
  onBack: () => void;
  onBuilderOpen?: () => void;
  onBuilderClose?: () => void;
}) {
  const [view, setView] = useState<"list" | "builder">("list");

  function openBuilder() {
    setView("builder");
    onBuilderOpen?.();
  }

  function closeBuilder() {
    setView("list");
    onBuilderClose?.();
  }

  if (view === "builder") {
    return <WaitlistAgentView onBack={closeBuilder} />;
  }

  return <WaitlistAgentListView onCreateAgent={openBuilder} />;
}
