import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { ToastProvider } from "@/components/Toast";

import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { UploadLogs } from "@/pages/UploadLogs";
import { ThreatAnalysis } from "@/pages/ThreatAnalysis";
import { IncidentDetails } from "@/pages/IncidentDetails";
import { AIAssistant } from "@/pages/AIAssistant";
import { FileScanner } from "@/pages/FileScanner";
import { ThreatIntelligence } from "@/pages/ThreatIntelligence";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";

import { useAuth } from "@/context/AuthContext";

import type { PageId } from "@/types";

const titles: Record<PageId, string> = {
  dashboard: "Dashboard",
  threats: "Threat Analysis",
  incident: "Incident Details",
  logs: "Log Analyzer",
  assistant: "AI Assistant",
  scanner: "File Scanner",
  intelligence: "Threat Intelligence",
  reports: "Reports",
  settings: "Settings",
};

function AppInner() {
  const { user, logout } = useAuth();

  const [page, setPage] =
    useState<PageId>("dashboard");

  const [selectedThreatId, setSelectedThreatId] =
    useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /*
   * When the user logs in, always return
   * to the dashboard.
   */
  const handleAuthenticated = () => {
    setSelectedThreatId(null);
    setPage("dashboard");
  };

  /*
   * Central navigation handler.
   */
  const handleNavigate = (nextPage: PageId) => {
    setPage(nextPage);
    setSidebarOpen(false);

    /*
     * If the user leaves Incident Details,
     * don't accidentally keep showing an old
     * selected threat later.
     */
    if (nextPage !== "incident") {
      setSelectedThreatId(null);
    }
  };

  /*
   * Called by ThreatAnalysis when the user
   * clicks a specific threat.
   */
  const handleSelectThreat = (
    threatId: string
  ) => {
    setSelectedThreatId(threatId);
    setPage("incident");
    setSidebarOpen(false);
  };

  /*
   * Authentication gate.
   */
  if (!user) {
    return (
      <Login
        onAuthed={handleAuthenticated}
      />
    );
  }

  /*
   * Render the active page.
   */
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={handleNavigate}
          />
        );

      case "threats":
        return (
          <ThreatAnalysis
            onNavigate={handleNavigate}
            onSelectThreat={handleSelectThreat}
          />
        );

      case "incident":
        return (
          <IncidentDetails
            onNavigate={handleNavigate}
            threatId={selectedThreatId}
          />
        );

      case "logs":
        return <UploadLogs />;

      case "assistant":
        return <AIAssistant />;

      case "scanner":
        return <FileScanner />;

      case "intelligence":
        return <ThreatIntelligence />;

      case "reports":
        return <Reports />;

      case "settings":
        return <Settings />;

      default:
        return (
          <Dashboard
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Sidebar */}
      <Sidebar
        active={page}
        onNavigate={handleNavigate}
        onLogout={logout}
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* Main application */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          title={titles[page]}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
          user={user}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-grid-pattern bg-[size:48px_48px] p-4 lg:p-6">
          {/* Background glow */}
          <div className="pointer-events-none fixed left-1/2 top-32 h-64 w-[600px] -translate-x-1/2 rounded-full bg-accent-blue/[0.06] blur-[120px]" />

          <div className="relative">
            <AnimatePresence
              mode="wait"
            >
              <PageTransition
                key={page}
              >
                {renderPage()}
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}