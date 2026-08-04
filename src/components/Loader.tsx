export function Loader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent-cyan border-r-accent-blue" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-accent-blue/20 blur-sm" />
      </div>
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );
}

export function ShimmerRow() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="relative h-16 overflow-hidden rounded-xl bg-white/[0.02]">
          <div className="absolute inset-0 -translate-x-full animate-shimmer shimmer-bg" />
        </div>
      ))}
    </div>
  );
}
