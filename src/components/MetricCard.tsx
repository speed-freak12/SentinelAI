import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/utils/cn';
import {
  Activity,
  AlertTriangle,
  FileSearch,
  ShieldAlert,
  Users,
  ArrowDownRight,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import type { MetricCard } from '@/types';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

const iconMap: Record<string, LucideIcon> = {
  ShieldAlert,
  AlertTriangle,
  FileSearch,
  Users,
  Activity,
};

const accentMap: Record<string, { text: string; ring: string; stroke: string; glow: string }> = {
  blue: { text: 'text-accent-blue', ring: 'ring-accent-blue/20', stroke: '#3B82F6', glow: 'shadow-glow' },
  cyan: { text: 'text-accent-cyan', ring: 'ring-accent-cyan/20', stroke: '#06B6D4', glow: 'shadow-glow-cyan' },
  purple: { text: 'text-accent-purple', ring: 'ring-accent-purple/20', stroke: '#8B5CF6', glow: 'shadow-glow-purple' },
  red: { text: 'text-accent-red', ring: 'ring-accent-red/20', stroke: '#EF4444', glow: 'shadow-glow-red' },
  amber: { text: 'text-accent-amber', ring: 'ring-accent-amber/20', stroke: '#F59E0B', glow: 'shadow-glow' },
  emerald: { text: 'text-accent-emerald', ring: 'ring-accent-emerald/20', stroke: '#10B981', glow: 'shadow-glow-cyan' },
};

export function MetricCardItem({ card, index }: { card: MetricCard; index: number }) {
  const count = useCountUp(card.value);
  const Icon = iconMap[card.icon] ?? Activity;
  const accent = accentMap[card.accent];
  const positive = card.delta >= 0;
  // For critical alerts, a negative delta is good
  const goodDelta = card.id === 'critical' ? !positive : positive;
  const sparkData = card.spark.map((v, i) => ({ i, v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className={cn(
        'glass-card glass-card-hover group relative overflow-hidden p-5 shadow-card',
        'hover:shadow-glow transition-shadow'
      )}
    >
      <div className={cn('absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl opacity-20', accent.text)} style={{ backgroundColor: 'currentColor' }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{card.label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={cn('font-mono text-3xl font-bold tracking-tight', accent.text)}>
              {Math.round(count).toLocaleString()}
            </span>
            {card.unit && <span className="text-sm text-slate-500">{card.unit}</span>}
          </div>
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03] ring-1', accent.ring)}>
          <Icon className={cn('h-5 w-5', accent.text)} />
        </div>
      </div>

      <div className="relative mt-3 flex items-center justify-between">
        <div className={cn('flex items-center gap-1 text-xs font-semibold', goodDelta ? 'text-accent-emerald' : 'text-accent-red')}>
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(card.delta)}%
          <span className="ml-1 font-normal text-slate-500">vs last 24h</span>
        </div>
        <div className="h-8 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
              <defs>
                <linearGradient id={`spark-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent.stroke} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={accent.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={accent.stroke} strokeWidth={1.5} fill={`url(#spark-${card.id})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
