import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Server,
  Fingerprint,
  ShieldCheck,
  Target,
  Gauge,
  Activity,
  AlertTriangle,
  Key,
  Radar,
  Bug,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { useCountUp } from '@/hooks/useCountUp';
import { cn, severityBg } from '@/utils/cn';
import { incident } from '@/utils/mockData';
import type { PageId } from '@/types';

const timelineIcons: Record<string, LucideIcon> = {
  radar: Radar,
  key: Key,
  alert: AlertTriangle,
  shield: ShieldCheck,
  bug: Bug,
  lock: Lock,
};

interface IncidentDetailsProps {
  onNavigate: (page: PageId) => void;
}

export function IncidentDetails({ onNavigate }: IncidentDetailsProps) {
  const score = useCountUp(incident.riskScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('threats')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">{incident.title}</h2>
              <Badge label={incident.status} kind="status" />
            </div>
            <p className="mt-1 font-mono text-xs text-slate-500">
              {incident.id} · {incident.time} · {incident.system}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="md">Export</Button>
          <Button size="md" icon={<ShieldCheck className="h-4 w-4" />}>Contain</Button>
        </div>
      </div>

      {/* Risk score + description */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="flex flex-col items-center justify-center" delay={0.05}>
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#risk-grad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - incident.riskScore / 100) }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="risk-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-4xl font-bold text-gradient-red">{Math.round(score)}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Risk Score</span>
            </div>
          </div>
          <span className={cn('mt-2 rounded-full border px-3 py-0.5 text-xs font-semibold', severityBg(incident.riskLevel))}>
            {incident.riskLevel} Risk
          </span>
        </GlassCard>

        <GlassCard className="lg:col-span-2" delay={0.1}>
          <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-white">
            <Activity className="h-4 w-4 text-accent-cyan" /> Incident Description
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">{incident.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Affected', val: '4 systems', icon: Server },
              { label: 'IOCs', val: '5 indicators', icon: Fingerprint },
              { label: 'MITRE', val: '4 tactics', icon: Target },
              { label: 'Actions', val: '5 actions', icon: ShieldCheck },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <s.icon className="h-4 w-4 text-accent-blue" />
                <p className="mt-2 text-sm font-semibold text-white">{s.val}</p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Timeline */}
      <GlassCard delay={0.15}>
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-white">
          <Clock className="h-4 w-4 text-accent-purple" /> Attack Timeline
        </h3>
        <div className="relative space-y-5 pl-8">
          <div className="absolute left-3 top-1 bottom-1 w-px bg-gradient-to-b from-accent-red via-accent-purple to-accent-emerald" />
          {incident.timeline.map((event, i) => {
            const Icon = timelineIcons[event.icon] ?? Activity;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="relative"
              >
                <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-bg-card ring-2 ring-accent-purple/40">
                  <Icon className="h-3 w-3 text-accent-purple" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-accent-cyan">{event.time}</span>
                  <p className="text-sm text-slate-300">{event.event}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Grid: Affected + Indicators */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard delay={0.2}>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <Server className="h-4 w-4 text-accent-blue" /> Affected Systems
          </h3>
          <div className="space-y-2">
            {incident.affectedSystems.map((sys, i) => (
              <motion.div
                key={sys}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-2.5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-red/10 ring-1 ring-accent-red/30">
                  <AlertTriangle className="h-3.5 w-3.5 text-accent-red" />
                </span>
                <span className="font-mono text-sm text-slate-200">{sys}</span>
                <span className="ml-auto text-xs text-accent-red">Compromised</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.25}>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <Fingerprint className="h-4 w-4 text-accent-amber" /> Indicators of Compromise
          </h3>
          <div className="space-y-2">
            {incident.indicators.map((ind, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-2.5"
              >
                <Fingerprint className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-amber" />
                <span className="font-mono text-xs leading-relaxed text-slate-300">{ind}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* MITRE + Recommendations */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard delay={0.3}>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <Target className="h-4 w-4 text-accent-red" /> MITRE ATT&CK Mapping
          </h3>
          <div className="space-y-2">
            {incident.mitre.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="rounded-xl border border-accent-purple/20 bg-accent-purple/5 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{m.tactic}</span>
                  <span className="rounded-md bg-accent-purple/20 px-2 py-0.5 font-mono text-[10px] font-bold text-accent-purple">
                    {m.id}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{m.technique}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.35}>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <ShieldCheck className="h-4 w-4 text-accent-emerald" /> Recommended Actions
          </h3>
          <div className="space-y-2">
            {incident.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 rounded-xl border border-accent-emerald/15 bg-accent-emerald/[0.04] px-4 py-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent-emerald/15 text-xs font-bold text-accent-emerald">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-200">{rec}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
