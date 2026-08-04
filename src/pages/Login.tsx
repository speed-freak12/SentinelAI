import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { ParticleField } from '@/components/ParticleField';
import { Button } from '@/components/Button';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('alex.kovac@sentinel.io');
  const [password, setPassword] = useState('••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(onLogin, 1400);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-base px-4">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-40" />
      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/15 blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-accent-cyan/10 blur-[100px]" />
      <ParticleField count={50} />

      {/* Scanline */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent animate-scan" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 18 }}
            className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-accent-cyan shadow-glow-cyan"
          >
            <ShieldCheck className="h-9 w-9 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-accent-cyan/40 blur-xl -z-10" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Sentinel
          </h1>
          <p className="mt-1 text-sm font-medium uppercase tracking-[0.3em] text-accent-cyan">
            AI Cyber Command
          </p>
        </div>

        {/* Card */}
        <div className="glass-card relative overflow-hidden p-8 shadow-card">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent-blue/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-accent-purple/10 blur-2xl" />

          <div className="relative">
            <h2 className="text-xl font-semibold text-white">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to your command center
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
                <div className="group relative flex items-center rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors focus-within:border-accent-cyan/50">
                  <Mail className="ml-3.5 h-4 w-4 text-slate-500 group-focus-within:text-accent-cyan" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
                <div className="group relative flex items-center rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors focus-within:border-accent-cyan/50">
                  <Lock className="ml-3.5 h-4 w-4 text-slate-500 group-focus-within:text-accent-cyan" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="px-3.5 text-slate-500 hover:text-white"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember + forgot */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRemember((r) => !r)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                      remember
                        ? 'border-accent-cyan bg-accent-cyan/20'
                        : 'border-white/15 bg-transparent'
                    }`}
                  >
                    {remember && <CheckCircle2 className="h-3 w-3 text-accent-cyan" />}
                  </span>
                  Remember me
                </button>
                <button type="button" className="text-sm font-medium text-accent-cyan hover:text-accent-blue">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                icon={
                  loading ? undefined : <ArrowRight className="h-4 w-4" />
                }
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Authenticating…
                  </span>
                ) : (
                  'Access Command Center'
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[11px] uppercase tracking-wider text-slate-500">Secured by Zero Trust</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" /> SOC 2
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" /> ISO 27001
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" /> FedRAMP
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by AI-driven threat intelligence · v4.2.1
        </p>
      </motion.div>
    </div>
  );
}
