import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import API from "@/services/authService";
import { Button } from "@/components/Button";

interface Props {
  onBack: () => void;
}

export default function ForgotPassword({
  onBack,
}: Props) {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleForgot = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      const { data } = await API.post(
        "/forgot-password",
        {
          email,
        }
      );

      setLoading(false);

      setMessage(data.message);

    } catch (err: any) {

      setLoading(false);

      setError(
        err.response?.data?.message ||
          "Unable to send reset email."
      );

    }
  };

  return (
    <motion.form
      onSubmit={handleForgot}
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-5"
    >
      <h2 className="text-2xl font-bold text-white">
        Forgot Password
      </h2>

      <p className="text-sm text-slate-400">
        Enter your registered email.
      </p>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <span className="text-sm text-red-300">
            {error}
          </span>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-3">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <span className="text-sm text-green-300">
            {message}
          </span>
        </div>
      )}

      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
        <Mail className="h-5 w-5 text-slate-400" />

        <input
          type="email"
          placeholder="Enter email"
          className="w-full bg-transparent px-3 py-4 text-white outline-none"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
        icon={
          loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null
        }
      >
        {loading
          ? "Sending..."
          : "Send Reset Link"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={onBack}
        icon={<ArrowLeft className="h-4 w-4" />}
      >
        Back to Login
      </Button>
    </motion.form>
  );
}