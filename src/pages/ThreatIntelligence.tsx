import { motion } from 'framer-motion';
import {
  Bug,
  Skull,
  TrendingUp,
  TrendingDown,
  Radio,
  ShieldAlert,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/Badge';
import { cn, severityBg } from '@/utils/cn';
import { threatFeeds, trendingMalware, threatFeedStream } from '@/utils/mockData';

export function ThreatIntelligence() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Threat Intelligence</h2>
          <p className="mt-1 text-sm text-slate-400">Real-time CVEs, trending malware, and threat feeds</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-accent-emerald/20 bg-accent-emerald/5 px-3 py-2">
          <Radio className="h-4 w-4 animate-pulse text-accent-emerald" />
          <span className="text-xs font-medium text-accent-emerald">6 feeds active</span>
        </div>
      </div>

      {/* CVE cards */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
          <Bug className="h-4 w-4 text-accent-red" /> Latest CVEs
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {threatFeeds.map((cve, i) => (
            <motion.div
              key={cve.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <GlassCard className="relative overflow-hidden">
                {cve.severity === 'Critical' && (
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent-red/15 blur-2xl" />
                )}
                <div className="relative flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-accent-cyan">{cve.cve}</span>
                    <h4 className="mt-1 text-sm font-semibold text-white">{cve.name}</h4>
                  </div>
                  <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', severityBg(cve.severity))}>
                    {cve.severity}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{cve.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-500">{cve.date}</span>
                    <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-slate-400">{cve.category}</span>
                  </div>
                  {cve.exploitAvailable ? (
                    <span className="flex items-center gap-1 rounded-md bg-accent-red/10 px-2 py-0.5 text-[10px] font-bold text-accent-red ring-1 ring-accent-red/20">
                      <Zap className="h-3 w-3" /> Exploit
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">No exploit</span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending malware + feed */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Trending malware */}
        <GlassCard delay={0.1}>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <Skull className="h-4 w-4 text-accent-purple" /> Trending Malware
          </h3>
          <div className="space-y-2">
            {trendingMalware.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-red/20 ring-1 ring-accent-purple/30">
                  <Skull className="h-4 w-4 text-accent-purple" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{m.name}</p>
                  <p className="text-[11px] text-slate-500">{m.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-white">{m.detections.toLocaleString()}</p>
                  <p className={cn('flex items-center justify-end gap-0.5 text-[10px]', m.trend > 0 ? 'text-accent-red' : 'text-accent-emerald')}>
                    {m.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(m.trend)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Threat feed stream */}
        <GlassCard delay={0.15}>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <Radio className="h-4 w-4 animate-pulse text-accent-cyan" /> Threat Feed
          </h3>
          <div className="relative space-y-3">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-accent-cyan via-accent-blue to-transparent" />
            {threatFeedStream.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="relative pl-9"
              >
                <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-bg-card ring-2 ring-accent-cyan/40">
                  <div className="h-full w-full rounded-full bg-accent-cyan/40" />
                </div>
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-accent-cyan">{f.source}</span>
                    <span className="text-[10px] text-slate-500">{f.time} ago</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">{f.msg}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'CVEs Tracked', val: '184,392', icon: Bug, color: 'text-accent-red' },
          { label: 'Malware Families', val: '2,841', icon: Skull, color: 'text-accent-purple' },
          { label: 'Active IOCs', val: '94,127', icon: ShieldAlert, color: 'text-accent-amber' },
          { label: 'Feed Sources', val: '6', icon: Radio, color: 'text-accent-cyan' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] ring-1 ring-white/10">
                <s.icon className={cn('h-5 w-5', s.color)} />
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-white">{s.val}</p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
