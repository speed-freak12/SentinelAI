import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  Loader2,
  ScanLine,
  ShieldCheck,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const supported = ['.txt', '.csv', '.json', '.log'];

export function UploadLogs() {
  const toast = useToast();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'analyzing' | 'complete'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!supported.includes(ext)) {
      toast('Unsupported file type. Use txt, csv, json, or log.', 'error');
      return;
    }
    setFile({ name: f.name, size: f.size, type: ext });
    setPhase('uploading');
    setProgress(0);

    // Simulate upload progress
    const upInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(upInterval);
          setPhase('analyzing');
          startAnalysis();
          return 100;
        }
        return p + 8;
      });
    }, 80);
  };

  const startAnalysis = () => {
    setTimeout(() => {
      setPhase('complete');
      toast('Analysis complete · 7 threats detected', 'success');
    }, 2600);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setPhase('idle');
  };

  const analysisSteps = [
    'Parsing log structure…',
    'Correlating IOCs…',
    'Running signature matching…',
    'AI anomaly detection…',
    'Scoring & prioritizing…',
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Upload Logs</h2>
        <p className="mt-1 text-sm text-slate-400">
          Upload log files for AI-powered threat analysis and anomaly detection.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={supported.join(',')}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Drop zone */}
      <AnimatePresence mode="wait">
        {phase === 'idle' ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              dragging
                ? 'border-accent-cyan bg-accent-cyan/5 shadow-glow-cyan'
                : 'border-white/10 bg-white/[0.02] hover:border-accent-blue/40 hover:bg-white/[0.03]'
            }`}
          >
            <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-30" />
            <motion.div
              animate={{ y: dragging ? -6 : 0 }}
              className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 ring-1 ring-accent-cyan/30"
            >
              <UploadCloud className="h-10 w-10 text-accent-cyan" />
              <div className="absolute inset-0 rounded-2xl bg-accent-cyan/20 blur-xl" />
            </motion.div>
            <h3 className="relative text-lg font-semibold text-white">
              {dragging ? 'Drop to upload' : 'Drag & drop your log files'}
            </h3>
            <p className="relative mt-1 text-sm text-slate-400">
              or <span className="font-medium text-accent-cyan">browse files</span> from your computer
            </p>
            <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2">
              {supported.map((s) => (
                <span key={s} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-slate-300">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* File card */}
            <GlassCard hover={false} className="relative">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-white">{file?.name}</p>
                  <p className="text-xs text-slate-500">
                    {file && (file.size / 1024).toFixed(1)} KB · {file?.type} ·{' '}
                    {phase === 'complete' ? 'Analysis complete' : phase === 'analyzing' ? 'Analyzing…' : 'Uploading…'}
                  </p>
                </div>
                {phase === 'complete' ? (
                  <CheckCircle2 className="h-6 w-6 text-accent-emerald" />
                ) : (
                  <button onClick={reset} className="text-slate-500 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Upload progress */}
              {phase === 'uploading' && (
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-slate-400">Uploading…</span>
                    <span className="font-mono text-accent-cyan">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan"
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Analyzing */}
              {phase === 'analyzing' && (
                <div className="mt-4 space-y-2.5">
                  {analysisSteps.map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.4 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Loader2 className="h-4 w-4 animate-spin text-accent-cyan" />
                      <span className="text-slate-300">{step}</span>
                    </motion.div>
                  ))}
                  <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                    <div className="absolute inset-0 animate-scan bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />
                  </div>
                </div>
              )}

              {/* Complete */}
              {phase === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Threats', val: '7', color: 'text-accent-red' },
                      { label: 'Anomalies', val: '23', color: 'text-accent-amber' },
                      { label: 'Clean', val: '1,842', color: 'text-accent-emerald' },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-center">
                        <p className={`font-mono text-xl font-bold ${s.color}`}>{s.val}</p>
                        <p className="text-[10px] text-slate-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-accent-emerald/20 bg-accent-emerald/5 p-3">
                    <ShieldCheck className="h-5 w-5 text-accent-emerald" />
                    <span className="text-sm text-slate-200">
                      Analysis complete. 2 critical threats flagged for investigation.
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" icon={<ScanLine className="h-3.5 w-3.5" />}>View Report</Button>
                    <Button variant="ghost" size="sm" onClick={reset}>Upload Another</Button>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { title: 'Max file size', val: '500 MB', icon: FileText },
          { title: 'Avg analysis time', val: '~8 sec', icon: Loader2 },
          { title: 'Detection engines', val: '6 active', icon: ShieldCheck },
        ].map((c) => (
          <GlassCard key={c.title} delay={0.1} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] ring-1 ring-white/10">
              <c.icon className="h-5 w-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{c.title}</p>
              <p className="font-mono text-sm font-semibold text-white">{c.val}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
