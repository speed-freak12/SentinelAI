import { cn } from '@/utils/cn';
import { severityBg, statusBg } from '@/utils/cn';

export function Badge({ label, kind }: { label: string; kind: 'severity' | 'status' }) {
  const cls = kind === 'severity' ? severityBg(label) : statusBg(label);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
        cls
      )}
    >
      {label}
    </span>
  );
}
