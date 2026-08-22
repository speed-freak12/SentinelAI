import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";

import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { cn, severityBg } from "@/utils/cn";
import threatAPI from "@/services/threatService";

import type { PageId, Severity } from "@/types";

interface IncidentDetailsProps {
  onNavigate: (page: PageId) => void;
  threatId: string | null;
}

interface Threat {
  _id: string;
  title: string;
  type: string;
  severity: Severity;
  status:
  | "Detected"
  | "Investigating"
  | "Resolved";
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

interface ThreatResponse {
  success: boolean;
  threat: Threat;
}

export function IncidentDetails({
  onNavigate,
  threatId,
}: IncidentDetailsProps) {
  const [threat, setThreat] =
    useState<Threat | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadIncident = async () => {
      if (!threatId) {
        if (mounted) {
          setThreat(null);
          setError(
            "No threat was selected."
          );
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data } =
          await threatAPI.get<ThreatResponse>(
            `/${threatId}`
          );

        if (
          !data?.success ||
          !data.threat
        ) {
          throw new Error(
            "Threat could not be found."
          );
        }

        if (!mounted) {
          return;
        }

        setThreat(data.threat);
      } catch (err) {
        console.error(
          "Incident Details Error:",
          err
        );

        if (!mounted) {
          return;
        }

        setThreat(null);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load incident."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadIncident();

    return () => {
      mounted = false;
    };
  }, [threatId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading incident details…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="md"
          icon={
            <ArrowLeft className="h-4 w-4" />
          }
          onClick={() =>
            onNavigate("threats")
          }
        >
          Back to Threats
        </Button>

        <GlassCard hover={false}>
          <div className="py-10 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-accent-red" />

            <p className="mt-3 text-sm font-semibold text-accent-red">
              Unable to load incident
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {error}
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!threat) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="md"
          icon={
            <ArrowLeft className="h-4 w-4" />
          }
          onClick={() =>
            onNavigate("threats")
          }
        >
          Back to Threats
        </Button>

        <GlassCard hover={false}>
          <div className="py-10 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 text-slate-500" />

            <p className="mt-3 text-sm font-semibold text-white">
              No incident found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              The selected threat could not be
              found.
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  const severityScore: Record<
    Severity,
    number
  > = {
    Low: 25,
    Medium: 50,
    High: 75,
    Critical: 100,
  };

  const riskScore =
    severityScore[threat.severity] ?? 0;

  const createdDate = new Date(
    threat.createdAt
  );

  const updatedDate = threat.updatedAt
    ? new Date(threat.updatedAt)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              onNavigate("threats")
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                {threat.title}
              </h2>

              <Badge
                label={threat.status}
                kind="status"
              />
            </div>

            <p className="mt-1 font-mono text-xs text-slate-500">
              {threat._id} ·{" "}
              {createdDate.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="md"
            onClick={() =>
              window.print()
            }
          >
            Export
          </Button>

          <Button
            size="md"
            icon={
              <ShieldCheck className="h-4 w-4" />
            }
            onClick={() =>
              onNavigate("threats")
            }
          >
            Back to Analysis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard
          className="flex flex-col items-center justify-center"
          delay={0.05}
        >
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg
              className="h-full w-full -rotate-90"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="10"
              />

              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={
                  threat.severity ===
                    "Critical"
                    ? "#EF4444"
                    : threat.severity ===
                      "High"
                      ? "#F59E0B"
                      : "#3B82F6"
                }
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={
                  2 * Math.PI * 52
                }
                initial={{
                  strokeDashoffset:
                    2 *
                    Math.PI *
                    52,
                }}
                animate={{
                  strokeDashoffset:
                    2 *
                    Math.PI *
                    52 *
                    (1 -
                      riskScore /
                      100),
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                }}
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-4xl font-bold text-white">
                {riskScore}
              </span>

              <span className="text-[10px] uppercase tracking-wider text-slate-500">
                Risk Score
              </span>
            </div>
          </div>

          <span
            className={cn(
              "mt-2 rounded-full border px-3 py-0.5 text-xs font-semibold",
              severityBg(
                threat.severity
              )
            )}
          >
            {threat.severity} Risk
          </span>
        </GlassCard>

        <GlassCard
          className="lg:col-span-2"
          delay={0.1}
        >
          <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-white">
            <Activity className="h-4 w-4 text-accent-cyan" />
            Incident Description
          </h3>

          <p className="text-sm leading-relaxed text-slate-300">
            {threat.description ||
              "No description was provided for this threat."}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <ShieldAlert className="h-4 w-4 text-accent-red" />

              <p className="mt-2 text-sm font-semibold text-white">
                {threat.severity}
              </p>

              <p className="text-[10px] text-slate-500">
                Severity
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <FileText className="h-4 w-4 text-accent-blue" />

              <p className="mt-2 text-sm font-semibold text-white">
                {threat.type}
              </p>

              <p className="text-[10px] text-slate-500">
                Threat Type
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <Clock className="h-4 w-4 text-accent-purple" />

              <p className="mt-2 text-sm font-semibold text-white">
                {createdDate.toLocaleDateString()}
              </p>

              <p className="text-[10px] text-slate-500">
                Detected
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <ShieldCheck className="h-4 w-4 text-accent-emerald" />

              <p className="mt-2 text-sm font-semibold text-white">
                {threat.status}
              </p>

              <p className="text-[10px] text-slate-500">
                Status
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard delay={0.15}>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <ShieldAlert className="h-4 w-4 text-accent-red" />
            Threat Information
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
              <span className="text-xs text-slate-500">
                Threat ID
              </span>

              <span className="max-w-[220px] truncate font-mono text-xs text-accent-cyan">
                {threat._id}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
              <span className="text-xs text-slate-500">
                Type
              </span>

              <span className="text-sm text-slate-200">
                {threat.type}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
              <span className="text-xs text-slate-500">
                Severity
              </span>

              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  severityBg(
                    threat.severity
                  )
                )}
              >
                {threat.severity}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
              <span className="text-xs text-slate-500">
                Status
              </span>

              <Badge
                label={threat.status}
                kind="status"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <Clock className="h-4 w-4 text-accent-purple" />
            Timeline
          </h3>

          <div className="relative space-y-5 pl-8">
            <div className="absolute bottom-1 left-3 top-1 w-px bg-gradient-to-b from-accent-cyan to-accent-purple" />

            <motion.div
              initial={{
                opacity: 0,
                x: -12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="relative"
            >
              <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-bg-card ring-2 ring-accent-cyan/40">
                <Activity className="h-3 w-3 text-accent-cyan" />
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-semibold text-accent-cyan">
                  {createdDate.toLocaleTimeString()}
                </span>

                <p className="text-sm text-slate-300">
                  Threat detected
                </p>

                <p className="text-xs text-slate-500">
                  SentinelAI created this threat
                  record.
                </p>
              </div>
            </motion.div>

            {updatedDate &&
              updatedDate.getTime() !==
              createdDate.getTime() && (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: -12,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.12,
                  }}
                  className="relative"
                >
                  <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-bg-card ring-2 ring-accent-purple/40">
                    <ShieldCheck className="h-3 w-3 text-accent-purple" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs font-semibold text-accent-purple">
                      {updatedDate.toLocaleTimeString()}
                    </span>

                    <p className="text-sm text-slate-300">
                      Threat record updated
                    </p>

                    <p className="text-xs text-slate-500">
                      The threat status or details
                      were modified.
                    </p>
                  </div>
                </motion.div>
              )}
          </div>
        </GlassCard>
      </div>

      <GlassCard delay={0.25}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Current Incident Status
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              This status comes directly from
              the threat record.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              label={threat.status}
              kind="status"
            />

            <Button
              variant="ghost"
              size="md"
              onClick={() =>
                onNavigate("threats")
              }
            >
              Back to Threat Analysis
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}