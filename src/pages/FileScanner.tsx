import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch,
  UploadCloud,
  Shield,
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  Loader2,
  Bug,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { cn } from '@/utils/cn';

type ScanState = 'idle' | 'scanning' | 'complete';

type BackendScan = {
  _id: string;
  filename: string;
  fileType?: string;
  fileSize?: number;
  result: 'Clean' | 'Suspicious' | 'Malicious';
  threatScore?: number;
  createdAt?: string;
};

type ScanFile = {
  name: string;
  size: string;
  status: 'clean' | 'malicious' | 'suspicious';
};

const API_URL = import.meta.env.VITE_API_URL;

export function FileScanner() {
  const toast = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<ScanState>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanFile[]>([]);

  const runScan = () => {
    if (state === 'scanning') return;

    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setState('scanning');
    setProgress(10);
    setResults([]);

    try {
      if (!API_URL) {
        throw new Error('VITE_API_URL is not configured');
      }

      const formData = new FormData();
      formData.append('file', file);

      setProgress(30);

      const response = await fetch(`${API_URL}/api/files/scan`, {
        method: 'POST',
        body: formData,
      });

      setProgress(70);

      const data = await response.json();

      if (!response.ok || !data.success || !data.scan) {
        throw new Error(data.message || 'File scan failed');
      }

      setProgress(100);

      const scan: BackendScan = data.scan;

      const formattedResult: ScanFile = {
        name: scan.filename,
        size: formatFileSize(scan.fileSize),
        status: mapResult(scan.result),
      };

      setResults([formattedResult]);
      setState('complete');

      if (scan.result === 'Malicious') {
        toast(
          'Scan complete · Malicious file detected',
          'warning'
        );
      } else if (scan.result === 'Suspicious') {
        toast(
          'Scan complete · Suspicious file detected',
          'warning'
        );
      } else {
        toast(
          'Scan complete · File is clean',
          'success'
        );
      }
    } catch (error) {
      console.error('File Upload/Scan Error:', error);

      setState('idle');
      setProgress(0);

      toast(
        error instanceof Error
          ? error.message
          : 'Unable to scan the file',
        'error'
      );
    } finally {
      // Allow selecting the same file again.
      event.target.value = '';
    }
  };

  const statusConfig = {
    clean: {
      icon: ShieldCheck,
      color: 'text-accent-emerald',
      bg: 'bg-accent-emerald/10',
      ring: 'ring-accent-emerald/30',
      label: 'Clean',
    },

    malicious: {
      icon: Bug,
      color: 'text-accent-red',
      bg: 'bg-accent-red/10',
      ring: 'ring-accent-red/30',
      label: 'Malicious',
    },

    suspicious: {
      icon: ShieldAlert,
      color: 'text-accent-amber',
      bg: 'bg-accent-amber/10',
      ring: 'ring-accent-amber/30',
      label: 'Suspicious',
    },
  };

  const cleanCount = results.filter(
    (file) => file.status === 'clean'
  ).length;

  const suspiciousCount = results.filter(
    (file) => file.status === 'suspicious'
  ).length;

  const maliciousCount = results.filter(
    (file) => file.status === 'malicious'
  ).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">
          File Scanner
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Deep-scan files with AI-powered malware detection
        </p>
      </div>

      {/* Scan hero */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-blue/10 blur-3xl" />

        <div className="relative flex flex-col items-center py-6 text-center">
          <motion.div
            animate={
              state === 'scanning'
                ? { rotate: 360 }
                : {}
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 ring-1 ring-accent-cyan/30"
          >
            <FileSearch className="h-10 w-10 text-accent-cyan" />

            {state === 'scanning' && (
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-cyan animate-spin" />
            )}
          </motion.div>

          <h3 className="text-lg font-semibold text-white">
            {state === 'idle' && 'Ready to scan'}
            {state === 'scanning' && 'Scanning file…'}
            {state === 'complete' && 'Scan complete'}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {state === 'idle' &&
              'Choose a file from your computer to scan'}

            {state === 'scanning' &&
              `Uploading and analyzing ${progress}%`}

            {state === 'complete' &&
              `${results.length} file${results.length === 1 ? '' : 's'
              } scanned`}
          </p>

          {state === 'scanning' && (
            <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan"
                animate={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Real file picker */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelected}
          />

          <Button
            onClick={runScan}
            disabled={state === 'scanning'}
            size="lg"
            className="mt-5"
            icon={
              state === 'scanning' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )
            }
          >
            {state === 'idle' && 'Choose File'}
            {state === 'scanning' && 'Scanning…'}
            {state === 'complete' && 'Scan Another File'}
          </Button>
        </div>
      </GlassCard>

      {/* Results */}
      <AnimatePresence>
        {state === 'complete' && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Clean',
                  val: cleanCount,
                  color: 'text-accent-emerald',
                },
                {
                  label: 'Suspicious',
                  val: suspiciousCount,
                  color: 'text-accent-amber',
                },
                {
                  label: 'Malicious',
                  val: maliciousCount,
                  color: 'text-accent-red',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="glass-card p-4 text-center"
                >
                  <p
                    className={cn(
                      'font-mono text-2xl font-bold',
                      s.color
                    )}
                  >
                    {s.val}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {results.map((file, i) => {
              const config = statusConfig[file.status];
              const Icon = config.icon;

              return (
                <motion.div
                  key={`${file.name}-${i}`}
                  initial={{
                    opacity: 0,
                    x: -12,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: i * 0.1,
                  }}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3"
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg ring-1',
                      config.bg,
                      config.ring
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        config.color
                      )}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {file.name}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      {file.size}
                    </p>
                  </div>

                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                      config.bg,
                      config.color
                    )}
                  >
                    {config.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Engines */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          'YARA Rules',
          'ML Heuristics',
          'Signature DB',
          'Sandbox',
          'Hash Lookup',
          'Behavior AI',
        ].map((engine, i) => (
          <motion.div
            key={engine}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: i * 0.05,
            }}
            className="glass-card flex items-center gap-2 p-3"
          >
            <Shield className="h-4 w-4 text-accent-cyan" />

            <span className="text-xs text-slate-300">
              {engine}
            </span>

            <FileCheck2 className="ml-auto h-3.5 w-3.5 text-accent-emerald" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function mapResult(
  result: BackendScan['result']
): ScanFile['status'] {
  switch (result) {
    case 'Malicious':
      return 'malicious';

    case 'Suspicious':
      return 'suspicious';

    case 'Clean':
    default:
      return 'clean';
  }
}

function formatFileSize(size?: number): string {
  if (!size || size <= 0) {
    return 'Unknown size';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(0)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}