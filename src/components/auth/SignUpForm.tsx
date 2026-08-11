import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import API from "@/services/authService";
import { Button } from "@/components/Button";
import GoogleButton from "./GoogleButton";

interface Props {
  onOTPSent: (email: string) => void;
  onSignin: () => void;
}

export default function SignUpForm({
  onOTPSent,
  onSignin,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const { data } = await API.post("/signup", {
        fullName,
        email,
        password,
      });

      if (data.success) {
        onOTPSent(email);
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSignup}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <h2 className="text-2xl font-bold text-white">
        Create Account
      </h2>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <span className="text-sm text-red-300">
            {error}
          </span>
        </div>
      )}

      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
        <User className="h-5 w-5 text-slate-400" />

        <input
          type="text"
          placeholder="Full Name"
          className="w-full bg-transparent px-3 py-4 text-white outline-none"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
        />
      </div>

      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
        <Mail className="h-5 w-5 text-slate-400" />

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-transparent px-3 py-4 text-white outline-none"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
      </div>

      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
        <Lock className="h-5 w-5 text-slate-400" />

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Password"
          className="w-full bg-transparent px-3 py-4 text-white outline-none"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-slate-400" />
          ) : (
            <Eye className="h-5 w-5 text-slate-400" />
          )}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
        icon={
          loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )
        }
      >
        {loading
          ? "Creating..."
          : "Create Account"}
      </Button>

      <div className="my-5 flex items-center">
        <div className="h-px flex-1 bg-white/10" />

        <span className="px-3 text-xs uppercase tracking-[0.2em] text-slate-500">
          OR
        </span>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      <GoogleButton
        onSuccess={() => {
          window.location.reload();
        }}
      />

      <div className="pt-4 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSignin}
          className="font-semibold text-accent-cyan hover:text-accent-blue transition"
        >
          Sign In
        </button>
      </div>
    </motion.form>
  );
}