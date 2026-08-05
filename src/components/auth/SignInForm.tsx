import { useState } from "react";
import { motion } from "framer-motion";
import {
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
import { useAuth } from "@/context/AuthContext";

interface Props {
  onSignup: () => void;
  onForgot: () => void;
  onSuccess: () => void;
}

export default function SignInForm({
  onSignup,
  onForgot,
  onSuccess,
}: Props) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const { data } = await API.post(
        "/login",
        {
          email,
          password,
        }
      );

      login(data.user, data.token);

      setLoading(false);

      onSuccess();
    } catch (err: any) {
      setLoading(false);

      setError(
        err.response?.data?.message ||
          "Login failed."
      );
    }
  };

  return (
    <motion.form
      onSubmit={handleLogin}
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-white">
        Welcome Back
      </h2>

      <p className="text-sm text-slate-400">
        Sign in to Sentinel AI
      </p>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <span className="text-sm text-red-300">
            {error}
          </span>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Email
        </label>

        <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
          <Mail className="h-5 w-5 text-slate-400" />

          <input
            type="email"
            placeholder="you@example.com"
            className="w-full bg-transparent px-3 py-4 text-white outline-none"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Password
        </label>

        <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
          <Lock className="h-5 w-5 text-slate-400" />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="********"
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
      </div>

      <button
        type="button"
        onClick={onForgot}
        className="text-sm text-accent-cyan"
      >
        Forgot Password?
      </button>

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
          ? "Signing In..."
          : "Sign In"}
      </Button>

      <div className="text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSignup}
          className="font-semibold text-accent-cyan"
        >
          Sign Up
        </button>
      </div>
    </motion.form>
  );
}