export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(n: number): string {
  if (n >= 1000) return n.toLocaleString('en-US');
  return String(n);
}

const severityColors: Record<string, string> = {
  Critical: '#EF4444',
  High: '#F59E0B',
  Medium: '#3B82F6',
  Low: '#10B981',
};

export function severityColor(s: string): string {
  return severityColors[s] ?? '#94A3B8';
}

const statusColors: Record<string, string> = {
  Active: '#EF4444',
  Mitigated: '#10B981',
  Investigating: '#F59E0B',
  Resolved: '#3B82F6',
};

export function statusColor(s: string): string {
  return statusColors[s] ?? '#94A3B8';
}

export function severityBg(s: string): string {
  const map: Record<string, string> = {
    Critical: 'bg-accent-red/10 text-accent-red border-accent-red/30',
    High: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
    Medium: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
    Low: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30',
  };
  return map[s] ?? 'bg-white/5 text-slate-400 border-white/10';
}

export function statusBg(s: string): string {
  const map: Record<string, string> = {
    Active: 'bg-accent-red/10 text-accent-red border-accent-red/30',
    Mitigated: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30',
    Investigating: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
    Resolved: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
  };
  return map[s] ?? 'bg-white/5 text-slate-400 border-white/10';
}
