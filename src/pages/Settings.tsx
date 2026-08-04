import { motion } from 'framer-motion';
import {
  User,
  Key,
  Bell,
  Palette,
  Shield,
  Check,
  Copy,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Fingerprint,
  Smartphone,
  Mail,
} from 'lucide-react';
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { cn } from '@/utils/cn';

type Tab = 'profile' | 'api' | 'notifications' | 'theme' | 'security';

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        on ? 'bg-gradient-to-r from-accent-blue to-accent-cyan' : 'bg-white/10'
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow', on ? 'left-[22px]' : 'left-0.5')}
      />
    </button>
  );
}

export function Settings() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('profile');
  const [showKey, setShowKey] = useState(false);
  const [notif, setNotif] = useState({ critical: true, weekly: true, cve: true, digest: false });
  const [theme, setTheme] = useState('dark');

  const apiKey = 'sk-sent-live-9f2a4c8e1b7d3f6a5e9c2b8d4f1a7e3c';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="mt-1 text-sm text-slate-400">Manage your account and platform preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
              tab === t.id
                ? 'bg-gradient-to-r from-accent-blue/15 to-accent-cyan/5 text-white ring-1 ring-accent-cyan/30'
                : 'border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white'
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {tab === 'profile' && (
          <GlassCard hover={false}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue text-2xl font-bold text-white shadow-glow-purple">
                  AK
                </div>
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-bg-card ring-1 ring-white/10">
                  <Fingerprint className="h-3.5 w-3.5 text-accent-cyan" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Alex Kovac</h3>
                <p className="text-sm text-slate-400">SecOps Lead · Sentinel</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-accent-emerald/30 bg-accent-emerald/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent-emerald">Admin</span>
                  <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent-cyan">Pro Plan</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: 'Full Name', value: 'Alex Kovac' },
                { label: 'Email', value: 'alex.kovac@sentinel.io' },
                { label: 'Role', value: 'SecOps Lead' },
                { label: 'Organization', value: 'Sentinel Defense' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">{f.label}</label>
                  <input
                    defaultValue={f.value}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white focus:border-accent-cyan/40 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <Button onClick={() => toast('Profile updated successfully', 'success')} icon={<Check className="h-4 w-4" />}>Save Changes</Button>
            </div>
          </GlassCard>
        )}

        {tab === 'api' && (
          <GlassCard hover={false}>
            <h3 className="text-base font-semibold text-white">API Keys</h3>
            <p className="text-xs text-slate-500">Manage keys for programmatic access</p>

            <div className="mt-5 space-y-3">
              {[
                { name: 'Production', created: 'Jul 12, 2026', last: '2m ago' },
                { name: 'SIEM Integration', created: 'Jun 30, 2026', last: '1h ago' },
              ].map((k) => (
                <div key={k.name} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{k.name}</p>
                      <p className="text-[11px] text-slate-500">Created {k.created} · Last used {k.last}</p>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-accent-emerald/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent-emerald">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" /> Active
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-bg-deep px-3 py-2">
                    <Key className="h-3.5 w-3.5 text-slate-500" />
                    <code className="flex-1 truncate font-mono text-xs text-slate-300">
                      {showKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                    </code>
                    <button onClick={() => setShowKey((s) => !s)} className="text-slate-500 hover:text-white">
                      {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => { navigator.clipboard?.writeText(apiKey); toast('API key copied', 'success'); }}
                      className="text-slate-500 hover:text-white"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-4" icon={<Key className="h-4 w-4" />} onClick={() => toast('New API key generated', 'info')}>
              Generate New Key
            </Button>
          </GlassCard>
        )}

        {tab === 'notifications' && (
          <GlassCard hover={false}>
            <h3 className="text-base font-semibold text-white">Notifications</h3>
            <p className="text-xs text-slate-500">Choose what alerts you receive</p>
            <div className="mt-5 space-y-1">
              {[
                { key: 'critical', label: 'Critical Threat Alerts', desc: 'Immediate notifications for critical threats', icon: Shield },
                { key: 'cve', label: 'New CVE Alerts', desc: 'Notifications for new high-severity CVEs', icon: Mail },
                { key: 'weekly', label: 'Weekly Summary', desc: 'Weekly digest of security posture', icon: Mail },
                { key: 'digest', label: 'Daily Digest', desc: 'Daily summary email at 8:00 AM', icon: Smartphone },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between border-b border-white/[0.04] py-3.5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03] ring-1 ring-white/10">
                      <n.icon className="h-4 w-4 text-accent-cyan" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{n.label}</p>
                      <p className="text-xs text-slate-500">{n.desc}</p>
                    </div>
                  </div>
                  <Toggle
                    on={notif[n.key as keyof typeof notif]}
                    onClick={() => setNotif((s) => ({ ...s, [n.key]: !s[n.key as keyof typeof s] }))}
                  />
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {tab === 'theme' && (
          <GlassCard hover={false}>
            <h3 className="text-base font-semibold text-white">Theme</h3>
            <p className="text-xs text-slate-500">Customize your interface appearance</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {[
                { id: 'dark', label: 'Dark', icon: Moon, active: true },
                { id: 'light', label: 'Light', icon: Sun, active: false },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); toast('Theme preference saved', 'success'); }}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-xl border p-6 transition-all',
                    theme === t.id
                      ? 'border-accent-cyan/40 bg-accent-cyan/5 shadow-glow-cyan'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                  )}
                >
                  <t.icon className={cn('h-8 w-8', theme === t.id ? 'text-accent-cyan' : 'text-slate-400')} />
                  <span className="text-sm font-medium text-white">{t.label}</span>
                  {theme === t.id && <Check className="h-4 w-4 text-accent-cyan" />}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <p className="mb-3 text-xs font-medium text-slate-400">Accent Color</p>
              <div className="flex gap-3">
                {['#3B82F6', '#06B6D4', '#8B5CF6', '#10B981', '#EF4444'].map((c, i) => (
                  <button
                    key={c}
                    onClick={() => toast('Accent color updated', 'success')}
                    className={cn('h-9 w-9 rounded-xl ring-2 transition-all', i === 0 ? 'ring-white/40' : 'ring-transparent hover:ring-white/20')}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {tab === 'security' && (
          <GlassCard hover={false}>
            <h3 className="text-base font-semibold text-white">Security</h3>
            <p className="text-xs text-slate-500">Account security and authentication</p>
            <div className="mt-5 space-y-1">
              {[
                { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', on: true, icon: Fingerprint },
                { label: 'Login Alerts', desc: 'Get notified of new sign-ins', on: true, icon: Smartphone },
                { label: 'Session Timeout', desc: 'Auto-logout after 30 min inactivity', on: false, icon: Shield },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center justify-between border-b border-white/[0.04] py-3.5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03] ring-1 ring-white/10">
                      <s.icon className="h-4 w-4 text-accent-purple" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{s.label}</p>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                  <Toggle on={s.on} onClick={() => toast(`${s.label} toggled`, 'info')} />
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-accent-red/15 bg-accent-red/[0.04] p-4">
              <p className="text-sm font-semibold text-accent-red">Danger Zone</p>
              <p className="mt-1 text-xs text-slate-400">Permanently delete your account and all associated data.</p>
              <Button variant="danger" size="sm" className="mt-3">Delete Account</Button>
            </div>
          </GlassCard>
        )}
      </motion.div>
    </div>
  );
}
