import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { ToastProvider } from '@/components/Toast';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { UploadLogs } from '@/pages/UploadLogs';
import { ThreatAnalysis } from '@/pages/ThreatAnalysis';
import { IncidentDetails } from '@/pages/IncidentDetails';
import { AIAssistant } from '@/pages/AIAssistant';
import { FileScanner } from '@/pages/FileScanner';
import { ThreatIntelligence } from '@/pages/ThreatIntelligence';
import { Reports } from '@/pages/Reports';
import { Settings } from '@/pages/Settings';
import type { PageId } from '@/types';

const titles: Record<PageId, string> = {
  dashboard: 'Dashboard',
  threats: 'Threat Analysis',
  incident: 'Incident Details',
  logs: 'Log Analyzer',
  assistant: 'AI Assistant',
  scanner: 'File Scanner',
  intelligence: 'Threat Intelligence',
  reports: 'Reports',
  settings: 'Settings',
};

function AppInner() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState<PageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  const render = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={setPage} />;
      case 'threats':
        return <ThreatAnalysis onNavigate={setPage} />;
      case 'incident':
        return <IncidentDetails onNavigate={setPage} />;
      case 'logs':
        return <UploadLogs />;
      case 'assistant':
        return <AIAssistant />;
      case 'scanner':
        return <FileScanner />;
      case 'intelligence':
        return <ThreatIntelligence />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar
        active={page}
        onNavigate={(p) => {
          setPage(p);
          setSidebarOpen(false);
        }}
        onLogout={() => setAuthed(false)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar title={titles[page]} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-grid-pattern bg-[size:48px_48px] p-4 lg:p-6">
          <div className="pointer-events-none fixed left-1/2 top-32 h-64 w-[600px] -translate-x-1/2 rounded-full bg-accent-blue/[0.06] blur-[120px]" />
          <div className="relative">
            <AnimatePresence mode="wait">
              <PageTransition key={page}>{render()}</PageTransition>
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
