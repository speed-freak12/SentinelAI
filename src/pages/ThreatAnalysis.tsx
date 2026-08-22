import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { cn, severityBg } from "@/utils/cn";

import type { PageId, Severity } from "@/types";

interface ThreatAnalysisProps {
  onNavigate: (page: PageId) => void;
  onSelectThreat?: (threatId: string) => void;
}

interface RealThreat {
  _id: string;
  title: string;
  type: string;
  severity: Severity;
  status: string;
  description?: string;
  createdAt: string;
}

const severities: (Severity | "All")[] = [
  "All",
  "Critical",
  "High",
  "Medium",
  "Low",
];

const API_URL =
  import.meta.env.VITE_API_URL;

export function ThreatAnalysis({
  onNavigate,
  onSelectThreat,
}: ThreatAnalysisProps) {
  const [query, setQuery] =
    useState("");

  const [filter, setFilter] =
    useState<Severity | "All">(
      "All"
    );

  const [threats, setThreats] =
    useState<RealThreat[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadThreats = async () => {
    if (!API_URL) {
      setError(
        "VITE_API_URL is not configured."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_URL}/api/threats`
        );

      let data:
        | {
          success?: boolean;
          threats?: RealThreat[];
          message?: string;
        }
        | null = null;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          "Invalid response from threat server."
        );
      }

      if (
        !response.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.message ||
          "Unable to load threats."
        );
      }

      setThreats(
        data.threats || []
      );
    } catch (err) {
      console.error(
        "Threat Analysis Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load threats."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreats();
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery =
      query.toLowerCase().trim();

    return threats.filter(
      (threat) => {
        const matchFilter =
          filter === "All" ||
          threat.severity ===
          filter;

        if (!normalizedQuery) {
          return matchFilter;
        }

        const matchQuery =
          threat.title
            .toLowerCase()
            .includes(
              normalizedQuery
            ) ||
          threat.type
            .toLowerCase()
            .includes(
              normalizedQuery
            ) ||
          threat._id
            .toLowerCase()
            .includes(
              normalizedQuery
            ) ||
          threat.status
            .toLowerCase()
            .includes(
              normalizedQuery
            );

        return (
          matchFilter &&
          matchQuery
        );
      }
    );
  }, [
    threats,
    query,
    filter,
  ]);

  const counts = useMemo(() => {
    const values: Record<
      Severity,
      number
    > = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    threats.forEach(
      (threat) => {
        values[
          threat.severity
        ] += 1;
      }
    );

    return values;
  }, [threats]);

  const openThreat = (
    threatId: string
  ) => {
    if (onSelectThreat) {
      onSelectThreat(
        threatId
      );
    }

    onNavigate("incident");
  };

  const formatDate = (
    value: string
  ) => {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-accent-cyan" />
          Loading threats…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Threat Analysis
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Real threats detected by
            SentinelAI.
          </p>
        </div>

        <GlassCard hover={false}>
          <div className="flex flex-col items-center py-12 text-center">
            <ShieldAlert className="h-10 w-10 text-accent-red" />

            <h3 className="mt-3 text-sm font-semibold text-white">
              Unable to load threats
            </h3>

            <p className="mt-1 max-w-md text-xs text-slate-500">
              {error}
            </p>

            <button
              onClick={
                loadThreats
              }
              className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(
          [
            "Critical",
            "High",
            "Medium",
            "Low",
          ] as Severity[]
        ).map(
          (severity, index) => (
            <motion.div
              key={severity}
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay:
                  index * 0.06,
              }}
              className="glass-card p-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                    severityBg(
                      severity
                    )
                  )}
                >
                  {severity}
                </span>

                <ShieldAlert
                  className={cn(
                    "h-4 w-4",
                    severityBg(
                      severity
                    ).split(" ")[1]
                  )}
                />
              </div>

              <p className="mt-2 font-mono text-2xl font-bold text-white">
                {counts[
                  severity
                ]}
              </p>

              <p className="text-[11px] text-slate-500">
                threats detected
              </p>
            </motion.div>
          )
        )}
      </div>

      <GlassCard
        hover={false}
        className="flex flex-col gap-3 lg:flex-row lg:items-center"
      >
        <div className="relative flex flex-1 items-center rounded-xl border border-white/[0.08] bg-white/[0.02] px-3">
          <Search className="h-4 w-4 text-slate-500" />

          <input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Search by threat type, ID, status…"
            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />

          {severities.map(
            (severity) => (
              <button
                key={severity}
                onClick={() =>
                  setFilter(
                    severity
                  )
                }
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                  filter ===
                    severity
                    ? "bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-glow"
                    : "border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white"
                )}
              >
                {severity}
              </button>
            )
          )}
        </div>
      </GlassCard>

      <GlassCard
        hover={false}
        delay={0.1}
        className="overflow-hidden p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium">
                  Threat ID
                </th>

                <th className="px-5 py-3 font-medium">
                  Type
                </th>

                <th className="px-5 py-3 font-medium">
                  Severity
                </th>

                <th className="px-5 py-3 font-medium">
                  Title
                </th>

                <th className="hidden px-5 py-3 font-medium lg:table-cell">
                  Timestamp
                </th>

                <th className="px-5 py-3 font-medium">
                  Status
                </th>

                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {filtered.map(
                  (threat, index) => (
                    <motion.tr
                      key={
                        threat._id
                      }
                      layout
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        delay:
                          index *
                          0.03,
                      }}
                      onClick={() =>
                        openThreat(
                          threat._id
                        )
                      }
                      className="cursor-pointer border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs text-accent-cyan">
                        {threat._id}
                      </td>

                      <td className="px-5 py-3.5 font-medium text-white">
                        {threat.type}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                            severityBg(
                              threat.severity
                            )
                          )}
                        >
                          {
                            threat.severity
                          }
                        </span>
                      </td>

                      <td className="max-w-[280px] px-5 py-3.5">
                        <p className="truncate text-sm text-slate-200">
                          {
                            threat.title
                          }
                        </p>

                        {threat.description && (
                          <p className="mt-0.5 truncate text-[11px] text-slate-500">
                            {
                              threat.description
                            }
                          </p>
                        )}
                      </td>

                      <td className="hidden px-5 py-3.5 font-mono text-xs text-slate-500 lg:table-cell">
                        {formatDate(
                          threat.createdAt
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <Badge
                          label={
                            threat.status
                          }
                          kind="status"
                        />
                      </td>

                      <td className="px-5 py-3.5">
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </td>
                    </motion.tr>
                  )
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {filtered.length ===
            0 && (
              <div className="py-12 text-center">
                <ShieldAlert className="mx-auto h-8 w-8 text-slate-600" />

                <p className="mt-3 text-sm text-slate-500">
                  {threats.length ===
                    0
                    ? "No threats have been detected yet."
                    : "No threats match your filters."}
                </p>
              </div>
            )}
        </div>
      </GlassCard>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing{" "}
          {filtered.length} of{" "}
          {threats.length}{" "}
          threats
        </span>

        <Button
          variant="ghost"
          size="sm"
          icon={
            <Download className="h-3.5 w-3.5" />
          }
          onClick={() => {
            const blob =
              new Blob(
                [
                  JSON.stringify(
                    filtered,
                    null,
                    2
                  ),
                ],
                {
                  type: "application/json",
                }
              );

            const url =
              URL.createObjectURL(
                blob
              );

            const anchor =
              document.createElement(
                "a"
              );

            anchor.href = url;
            anchor.download =
              "sentinel-threats.json";
            anchor.click();

            URL.revokeObjectURL(
              url
            );
          }}
        >
          Export
        </Button>
      </div>
    </div>
  );
}