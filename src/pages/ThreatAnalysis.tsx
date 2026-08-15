import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShieldAlert, ArrowRight, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { cn, severityBg } from '@/utils/cn';
import threatAPI from '@/services/threatService';
import type { PageId, Severity } from '@/types';


interface ThreatAnalysisProps {
  onNavigate: (page: PageId) => void;
}

const severities: (Severity | 'All')[] = ['All', 'Critical', 'High', 'Medium', 'Low'];

export function ThreatAnalysis({ onNavigate }: ThreatAnalysisProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Severity | 'All'>('All');
  interface RealThreat {
  _id: string;
  title: string;
  type: string;
  severity: Severity;
  status: string;
  description?: string;
  createdAt: string;
}

const [threats, setThreats] = useState<RealThreat[]>([]);

  const filtered = useMemo(
    () =>
      threats.filter((t) => {
        const matchFilter = filter === 'All' || t.severity === filter;
        const q = query.toLowerCase();
        const matchQuery =
  !q ||
  t.title.toLowerCase().includes(q) ||
  t.type.toLowerCase().includes(q) ||
  t._id.toLowerCase().includes(q);
        return matchFilter && matchQuery;
      }),
    [query, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    threats.forEach((t) => (c[t.severity] = (c[t.severity] || 0) + 1));
    return c;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(['Critical', 'High', 'Medium', 'Low'] as Severity[]).map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-semibold', severityBg(s))}>
                {s}
              </span>
              <ShieldAlert className={cn('h-4 w-4', severityBg(s).split(' ')[1])} />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-white">{counts[s]}</p>
            <p className="text-[11px] text-slate-500">threats detected</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <GlassCard hover={false} className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex flex-1 items-center rounded-xl border border-white/[0.08] bg-white/[0.02] px-3">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by threat type, IP, or ID…"
            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          {severities.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                filter === s
                  ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-glow'
                  : 'border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard hover={false} delay={0.1} className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium">Threat ID</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Confidence</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">Timestamp</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((t, i) => (
                  <motion.tr
                    key={t._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => onNavigate('incident')}
                    className="cursor-pointer border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-accent-cyan">{t._id}</td>
                    <td className="px-5 py-3.5 font-medium text-white">{t.type}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold', severityBg(t.severity))}>
                        {t.severity}
                      </span>
                    </td>
                    
                   
                    <td className="hidden px-5 py-3.5 font-mono text-xs text-slate-500 lg:table-cell">{t.createdAt}</td>
                    <td className="px-5 py-3.5"><Badge label={t.status} kind="status" /></td>
                    <td className="px-5 py-3.5">
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500">No threats match your filters.</div>
          )}
        </div>
      </GlassCard>

      <div className="flex justify-between text-xs text-slate-500">
        <span>Showing {filtered.length} of {threats.length} threats</span>
        <Button variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />}>Export</Button>
      </div>
    </div>
  );
}
