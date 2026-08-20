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
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { cn } from '@/utils/cn';

type ScanState = 'idle' | 'scanning' | 'complete';

type ScanResult = {
  name: string;
  size: string;
  status: 'clean' | 'malicious' | 'suspicious';
};

const mockFiles: ScanResult[] = [
  { name: 'invoice_2026.pdf', size: '242 KB', status: 'clean' },
  { name: 'update.jar', size: '1.8 MB', status: 'malicious' },
  { name: 'report_q3.xlsx', size: '89 KB', status: 'clean' },
  { name: 'payload.bin', size: '512 KB', status: 'suspicious' },
];

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function FileScanner() {
  const toast = useToast();

  const [state, setState] = useState<ScanState>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[] | null>(null);

  const saveScanResults = async () => {
    try {
      const scans = await Promise.all(
        mockFiles.map(async (file) => {
          const result =
            file.status === 'malicious'
              ? 'Malicious'
              : file.status === 'suspicious'
                ? 'Suspicious'
                : 'Clean';

          const threatScore =
            result === 'Malicious'
              ? 95
              : result === 'Suspicious'
                ? 65
                : 5;

          const fileSize =
            file.size.includes('MB')
              ? parseFloat(file.size) * 1024 * 1024
              : parseFloat(file.size) * 1024;

          const response = await fetch(`${API_BASE_URL}/api/files/scan`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: file.name,
              fileType: getFileType(file.name),
              fileSize: Math.round(fileSize),
              result,
              threatScore,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to save scan for ${file.name}`);
          }

          const data = await response.json();

          if (!data.success) {
            throw new Error(data.message || 'Failed to save scan');
          }

          return file;
        })
      );

      return scans;
    } catch (error) {
      console.error('Save Scan Error:', error);
      throw error;
    }
  };

  const runScan = async () => {
    setState('scanning');
    setProgress(0);
    setResults(null);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }

        return p + 5;
      });
    }, 90);

    try {
      const savedResults = await saveScanResults();

      clearInterval(interval);
      setProgress(100);
      setResults(savedResults);
      setState('complete');

      toast(
        'Scan complete · 1 malicious file detected',
        'warning'
      );
    } catch (error) {
      clearInterval(interval);
      setProgress(0);
      setState('idle');

      toast(
        'Scan failed · Could not save results to server',
        'error'
      );

      console.error('Scan Error:', error);
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

  const cleanCount =
    results?.filter((f) => f.status === 'clean').length || 0;

  const suspiciousCount =
    results?.filter((f) => f.status === 'suspicious').length || 0;

  const maliciousCount =
    results?.filter((f) => f.status === 'malicious').length || 0;

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
            {state === 'scanning' && 'Scanning files…'}
            {state === 'complete' && 'Scan complete'}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {state === 'idle' &&
              'Upload files to begin a deep security scan'}

            {state === 'scanning' &&
              `Analyzing ${progress}% · AI signature matching`}

            {state === 'complete' &&
              '4 files analyzed · 1 threat detected'}
          </p>

          {state === 'scanning' && (
            <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan"
                animate={{ width: `${progress}%` }}
              />
            </div>
          )}

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
            {state === 'idle' && 'Start Scan'}
            {state === 'scanning' && 'Scanning…'}
            {state === 'complete' && 'Scan Again'}
          </Button>
        </div>
      </GlassCard>

      {/* Results */}
      <AnimatePresence>
        {state === 'complete' && results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card p-4 text-center">
                <p className="font-mono text-2xl font-bold text-accent-emerald">
                  {cleanCount}
                </p>

                <p className="text-[11px] text-slate-500">
                  Clean
                </p>
              </div>

              <div className="glass-card p-4 text-center">
                <p className="font-mono text-2xl font-bold text-accent-amber">
                  {suspiciousCount}
                </p>

                <p className="text-[11px] text-slate-500">
                  Suspicious
                </p>
              </div>

              <div className="glass-card p-4 text-center">
                <p className="font-mono text-2xl font-bold text-accent-red">
                  {maliciousCount}
                </p>

                <p className="text-[11px] text-slate-500">
                  Malicious
                </p>
              </div>
            </div>

            {/* Individual results */}
            {results.map((file, i) => {
              const config =
                statusConfig[file.status];

              const Icon = config.icon;

              return (
                <motion.div
                  key={file.name}
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

function getFileType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();

  if (!extension) {
    return 'application/octet-stream';
  }

  const types: Record<string, string> = {
    pdf: 'application/pdf',
    jar: 'application/java-archive',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    bin: 'application/octet-stream',
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
    js: 'text/javascript',
    ts: 'video/mp2t',
    html: 'text/html',
    css: 'text/css',
  };

  return types[extension] || 'application/octet-stream';
}