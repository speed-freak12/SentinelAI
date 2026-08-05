import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import { ParticleField } from "@/components/ParticleField";

import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import VerifyOTP from "@/components/auth/VerifyOTP";
import ForgotPassword from "@/components/auth/ForgotPassword";

type Mode =
  | "signin"
  | "signup"
  | "verify"
  | "forgot";

interface LoginProps {
  onAuthed: () => void;
}

export function Login({
  onAuthed,
}: LoginProps) {
  const [mode, setMode] =
    useState<Mode>("signin");

  const [email, setEmail] =
    useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-base px-4">

      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-40" />

      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[120px]" />

      <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/15 blur-[120px]" />

      <ParticleField count={50} />

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative z-10 w-full max-w-md"
      >

        <div className="mb-8 flex flex-col items-center">

          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-accent-cyan shadow-glow-cyan">

            <ShieldCheck className="h-9 w-9 text-white" />

          </div>

          <h1 className="text-3xl font-bold text-white">
            Sentinel
          </h1>

          <p className="mt-1 text-sm uppercase tracking-[0.3em] text-accent-cyan">
            AI Cyber Command
          </p>

        </div>

        <div className="glass-card p-8">

          <AnimatePresence mode="wait">

            {mode === "signin" && (
              <SignInForm
                onSignup={() =>
                  setMode("signup")
                }
                onForgot={() =>
                  setMode("forgot")
                }
                onSuccess={onAuthed}
              />
            )}

            {mode === "signup" && (
              <SignUpForm
                onOTPSent={(mail) => {
                  setEmail(mail);
                  setMode("verify");
                }}
              />
            )}

            {mode === "verify" && (
              <VerifyOTP
                email={email}
                onVerified={() =>
                  setMode("signin")
                }
              />
            )}

            {mode === "forgot" && (
              <ForgotPassword
                onBack={() =>
                  setMode("signin")
                }
              />
            )}

          </AnimatePresence>

        </div>

      </motion.div>

    </div>
  );
}