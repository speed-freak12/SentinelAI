import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Menu, ChevronDown, Circle, Sun, Moon, Command } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface NavbarProps {
  title: string;
  onMenuClick: () => void;
}

export function Navbar({ title, onMenuClick }: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifications = [
    { msg: 'Critical: SSH brute force on auth-service', time: '2m', severity: 'red' },
    { msg: 'New CVE-2026-9921 detected in feed', time: '8m', severity: 'amber' },
    { msg: 'Scan complete: 48,217 files analyzed', time: '23m', severity: 'cyan' },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#050816]/80 px-4 backdrop-blur-xl lg:px-6">
      <button onClick={onMenuClick} className="text-slate-400 hover:text-white lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-white lg:text-lg">{title}</h2>
        <span className="hidden items-center gap-1.5 rounded-full border border-accent-emerald/30 bg-accent-emerald/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent-emerald sm:flex">
          <Circle className="h-1.5 w-1.5 fill-current" /> Live
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2 lg:gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            placeholder="Search threats, IPs, CVEs…"
            className="w-40 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none lg:w-56"
          />
          <span className="flex items-center gap-0.5 rounded border border-white/10 px-1.5 text-[10px] text-slate-500">
            <Command className="h-3 w-3" />K
          </span>
        </div>

        <button className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white sm:flex">
          <Sun className="h-4 w-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-red text-[9px] font-bold text-white ring-2 ring-[#050816]">
              3
            </span>
          </button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute right-0 top-12 z-20 w-80 glass-card p-2 shadow-card"
                >
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Notifications
                  </p>
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
                    >
                      <span
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          n.severity === 'red' && 'bg-accent-red',
                          n.severity === 'amber' && 'bg-accent-amber',
                          n.severity === 'cyan' && 'bg-accent-cyan'
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-slate-200">{n.msg}</p>
                        <p className="text-[11px] text-slate-500">{n.time} ago</p>
                      </div>
                    </div>
                  ))}
                  <button className="mt-1 w-full rounded-lg py-2 text-center text-xs font-medium text-accent-cyan hover:bg-white/[0.03]">
                    View all
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-1.5 pl-1.5 pr-3 hover:bg-white/[0.04]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue text-xs font-bold text-white">
            AK
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold leading-tight text-white">Alex Kovac</p>
            <p className="text-[10px] leading-tight text-slate-500">SecOps Lead</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
        </button>
      </div>
    </header>
  );
}
