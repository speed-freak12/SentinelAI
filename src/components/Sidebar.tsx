import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldAlert,
  ScrollText,
  Bot,
  FileSearch,
  Radar,
  FileBarChart,
  Settings,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { PageId } from '@/types';

interface SidebarProps {
  active: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}

const nav: { id: PageId; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'threats', label: 'Threat Analysis', icon: ShieldAlert, badge: 14 },
  { id: 'logs', label: 'Log Analyzer', icon: ScrollText },
  { id: 'assistant', label: 'AI Assistant', icon: Bot },
  { id: 'scanner', label: 'File Scanner', icon: FileSearch },
  { id: 'intelligence', label: 'Threat Intelligence', icon: Radar },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ active, onNavigate, onLogout, open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : undefined }}
        className={cn(
          'fixed lg:static z-40 flex h-full w-72 flex-col border-r border-white/[0.06] bg-[#070B1F]/95 backdrop-blur-xl transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan shadow-glow">
              <ShieldCheck className="h-6 w-6 text-white" />
              <div className="absolute inset-0 rounded-xl bg-accent-cyan/30 blur-md -z-10" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Sentinel</h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent-cyan">AI Command</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="cyber-divider mx-4" />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Operations
          </p>
          <ul className="space-y-1">
            {nav.map((item) => {
              const isActive = active === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-accent-blue/15 to-accent-cyan/5 text-white'
                        : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-accent-cyan to-accent-blue"
                      />
                    )}
                    <Icon
                      className={cn(
                        'h-5 w-5 shrink-0 transition-colors',
                        isActive ? 'text-accent-cyan' : 'text-slate-500 group-hover:text-accent-cyan'
                      )}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-red/20 px-1.5 text-[10px] font-bold text-accent-red ring-1 ring-accent-red/30">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Status + logout */}
        <div className="px-4 pb-5">
          <div className="glass-card mb-3 flex items-center gap-3 p-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-emerald opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-emerald" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">All Systems Operational</p>
              <p className="text-[10px] text-slate-500">Last sync 12s ago</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-accent-red/10 hover:text-accent-red"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}
