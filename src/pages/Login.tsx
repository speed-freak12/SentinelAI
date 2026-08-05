import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  User,
  AlertCircle,
  MailCheck,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { ParticleField } from '@/components/ParticleField';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

type Mode = 'signin' | 'signup' | 'forgot' | 'verify';
type Provider = 'email' | 'google';

interface LoginProps {
  onAuthed: () => void;
  pendingEmail?: string | null;
}

export function Login({ onAuthed, pendingEmail }: LoginProps) {
  const [mode, setMode] = useState<Mode>('signin');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [signedUpEmail, setSignedUpEmail] = useState<string | null>(pendingEmail ?? null);

  const resetState = () => {
    setError(null);
    setInfo(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    resetState();
    setLoading('email');
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(null);
    if (err) {
      setError(err.message);
      return;
    }
    if (!data.user?.email_confirmed_at) {
      setSignedUpEmail(email);
      setMode('verify');
      return;
    }
    onAuthed();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    resetState();
    setLoading('email');
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || undefined } },
    });
    setLoading(null);
    if (err) {
      setError(err.message);
      return;
    }
    setSignedUpEmail(email);
    setMode('verify');
  };

  const handleGoogle = async () => {
    resetState();
    setLoading('google');
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (err) {
      setLoading(null);
      setError(err.message);
    }
    // On success the browser redirects away; loading state clears on return.
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    resetState();
    setLoading('email');
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(null);
    if (err) {
      setError(err.message);
      return;
    }
    setInfo('Password reset link sent. Check your inbox.');
  };

  const handleResend = async () => {
    if (!signedUpEmail) return;
    resetState();
    setLoading('email');
    const { error: err } = await supabase.auth.resend({
      type: 'signup',
      email: signedUpEmail,
    });
    setLoading(null);
    if (err) {
      setError(err.message);
      return;
    }
    setInfo('Verification email sent. Check your inbox.');
  };

  const switchMode = (m: Mode) => {
    resetState();
    setMode(m);
  };

  const titles: Record<Mode, { heading: string; sub: string }> = {
    signin: { heading: 'Welcome back', sub: 'Sign in to your command center' },
    signup: { heading: 'Create account', sub: 'Deploy your AI cyber command center' },
    forgot: { heading: 'Reset password', sub: 'Enter your email to receive a reset link' },
    verify: { heading: 'Verify your email', sub: 'Confirm your email to access the platform' },
  };

  const submitLabel: Record<Mode, string> = {
    signin: 'Access Command Center',
    signup: 'Create Account',
    forgot: 'Send Reset Link',
    verify: '',
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
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-xl font-semibold text-white">{titles[mode].heading}</h2>
                <p className="mt-1 text-sm text-slate-400">{titles[mode].sub}</p>

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-xl border border-accent-red/30 bg-accent-red/10 px-3.5 py-2.5"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-red" />
                      <span className="text-sm text-accent-red">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Info banner */}
                <AnimatePresence>
                  {info && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-xl border border-accent-emerald/30 bg-accent-emerald/10 px-3.5 py-2.5"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-emerald" />
                      <span className="text-sm text-accent-emerald">{info}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {mode === 'verify' ? (
                  <div className="mt-6 space-y-4">
                    <div className="flex flex-col items-center rounded-2xl border border-accent-cyan/20 bg-accent-cyan/5 py-6 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                        className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-cyan/15 ring-1 ring-accent-cyan/30"
                      >
                        <MailCheck className="h-7 w-7 text-accent-cyan" />
                      </motion.div>
                      <p className="text-sm text-slate-200">
                        We sent a verification link to
                      </p>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-white">{signedUpEmail}</p>
                      <p className="mt-3 max-w-xs text-xs text-slate-400">
                        Click the link in your email to confirm your account, then sign in to access the platform.
                      </p>
                    </div>
                    <Button
                      onClick={handleResend}
                      size="lg"
                      className="w-full"
                      variant="ghost"
                      disabled={loading !== null}
                      icon={loading === 'email' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                    >
                      Resend verification email
                    </Button>
                    <button
                      onClick={() => switchMode('signin')}
                      className="w-full text-center text-sm font-medium text-accent-cyan hover:text-accent-blue"
                    >
                      Back to sign in
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={mode === 'signin' ? handleSignIn : mode === 'signup' ? handleSignUp : handleForgot}
                    className="mt-6 space-y-4"
                  >
                    {/* Full name (signup only) */}
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <label className="mb-1.5 block text-xs font-medium text-slate-400">Full Name</label>
                        <div className="group relative flex items-center rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors focus-within:border-accent-cyan/50">
                          <User className="ml-3.5 h-4 w-4 text-slate-500 group-focus-within:text-accent-cyan" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                            placeholder="Alex Kovac"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
                      <div className="group relative flex items-center rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors focus-within:border-accent-cyan/50">
                        <Mail className="ml-3.5 h-4 w-4 text-slate-500 group-focus-within:text-accent-cyan" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    {/* Password (not shown in forgot mode) */}
                    {mode !== 'forgot' && (
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
                        <div className="group relative flex items-center rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors focus-within:border-accent-cyan/50">
                          <Lock className="ml-3.5 h-4 w-4 text-slate-500 group-focus-within:text-accent-cyan" />
                          <input
                            type={showPwd ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                    )}

                    {/* Remember + forgot (signin only) */}
                    {mode === 'signin' && (
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
                        <button
                          type="button"
                          onClick={() => switchMode('forgot')}
                          className="text-sm font-medium text-accent-cyan hover:text-accent-blue"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={loading !== null}
                      icon={
                        loading === 'email' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )
                      }
                    >
                      {loading === 'email'
                        ? mode === 'signin'
                          ? 'Authenticating…'
                          : mode === 'signup'
                            ? 'Creating account…'
                            : 'Sending…'
                        : submitLabel[mode]}
                    </Button>
                  </form>
                )}

                {/* Divider + Google (not in forgot/verify) */}
                {mode !== 'forgot' && mode !== 'verify' && (
                  <>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/[0.06]" />
                      <span className="text-[11px] uppercase tracking-wider text-slate-500">or continue with</span>
                      <div className="h-px flex-1 bg-white/[0.06]" />
                    </div>

                    <button
                      onClick={handleGoogle}
                      disabled={loading !== null}
                      className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.02] py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.06] disabled:opacity-50"
                    >
                      {loading === 'google' ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                      ) : (
                        <GoogleIcon />
                      )}
                      Continue with Google
                    </button>

                    {/* Mode switch */}
                    <p className="mt-6 text-center text-sm text-slate-400">
                      {mode === 'signin' ? (
                        <>
                          Don&apos;t have an account?{' '}
                          <button
                            onClick={() => switchMode('signup')}
                            className="font-semibold text-accent-cyan hover:text-accent-blue"
                          >
                            Sign up
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{' '}
                          <button
                            onClick={() => switchMode('signin')}
                            className="font-semibold text-accent-cyan hover:text-accent-blue"
                          >
                            Sign in
                          </button>
                        </>
                      )}
                    </p>
                  </>
                )}

                {mode === 'forgot' && (
                  <p className="mt-6 text-center text-sm text-slate-400">
                    Remember your password?{' '}
                    <button
                      onClick={() => switchMode('signin')}
                      className="font-semibold text-accent-cyan hover:text-accent-blue"
                    >
                      Back to sign in
                    </button>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

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
