import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MailCheck,
  Loader2,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import API from "@/services/authService";
import { Button } from "@/components/Button";

interface Props {
  email: string;
  onVerified: () => void;
}

export default function VerifyOTP({
  email,
  onVerified,
}: Props) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    value: string,
    index: number
  ) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newOtp = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);

    const next = Math.min(pasted.length, 5);
    inputs.current[next]?.focus();
  };

  const verifyOTP = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      const { data } = await API.post(
        "/auth/verify-otp",
        {
          email,
          otp: otp.join(""),
        }
      );

      setMessage(data.message);

      setTimeout(() => {
        onVerified();
      }, 1500);

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
          "Invalid OTP."
      );

    } finally {

      setLoading(false);

    }
  };

  const resendOTP = async () => {
    try {

      setLoading(true);

      const { data } = await API.post(
        "/auth/resend-otp",
        {
          email,
        }
      );

      setMessage(data.message);

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
          "Unable to resend OTP."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <motion.form
      onSubmit={verifyOTP}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-cyan/10">
          <MailCheck className="h-8 w-8 text-accent-cyan" />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Verify Email
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Enter the OTP sent to
        </p>

        <p className="mt-1 font-semibold text-white break-all">
          {email}
        </p>

      </div>

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

      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            whileFocus={{
              scale: 1.08,
            }}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            value={digit}
            maxLength={1}
            onPaste={handlePaste}
            onKeyDown={(e) =>
              handleKeyDown(e, index)
            }
            onChange={(e) =>
              handleChange(
                e.target.value,
                index
              )
            }
            className="h-14 w-14 rounded-xl border border-white/10 bg-white/5 text-center text-2xl font-bold text-white outline-none transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
          />
        ))}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={
          loading ||
          otp.join("").length !== 6
        }
        icon={
          loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )
        }
      >
        {loading
          ? "Verifying..."
          : "Verify OTP"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={resendOTP}
        disabled={loading}
        icon={
          <RotateCcw className="h-4 w-4" />
        }
      >
        Resend OTP
      </Button>
    </motion.form>
  );
}