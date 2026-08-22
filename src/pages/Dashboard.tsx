import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Sparkles,
  FileUp,
  Activity,
  ArrowUpRight,
  Cpu,
} from "lucide-react";
import { useEffect, useState } from "react";

import { MetricCardItem } from "@/components/MetricCard";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { cn, severityBg } from "@/utils/cn";
import dashboardAPI from "@/services/dashboardService";

import type { PageId, MetricCard } from "@/types";

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

interface DashboardStats {
  totalUsers: number;
  totalThreats: number;
  totalScans: number;
  totalReports: number;
  criticalThreats?: number;
  resolvedThreats?: number;
}

interface RecentThreat {
  _id: string;
  title: string;
  type?: string;
  severity: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

interface RecentScan {
  _id: string;
  filename: string;
  fileType?: string;
  fileSize?: number;
  result: string;
  threatScore?: number;
  createdAt?: string;
}

interface ThreatDistributionItem {
  _id: string;
  count: number;
}

interface ThreatTimelineItem {
  _id: string;
  threats: number;
  blocked: number;
  critical: number;
}

interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  recentThreats: RecentThreat[];
  recentScans: RecentScan[];
  threatDistribution: ThreatDistributionItem[];
  threatsOverTime: ThreatTimelineItem[];
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatResult = (result: string): string => {
  if (!result) {
    return "Unknown";
  }

  return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
};

const severityColor = (severity: string): string => {
  switch (severity) {
    case "Critical":
      return "#EF4444";

    case "High":
      return "#F59E0B";

    case "Medium":
      return "#3B82F6";

    case "Low":
      return "#10B981";

    default:
      return "#64748B";
  }
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalThreats: 0,
    totalScans: 0,
    totalReports: 0,
    criticalThreats: 0,
    resolvedThreats: 0,
  });

  const [recentThreats, setRecentThreats] = useState<RecentThreat[]>([]);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [threatDistribution, setThreatDistribution] = useState<
    ThreatDistributionItem[]
  >([]);
  const [liveThreatsOverTime, setLiveThreatsOverTime] = useState<
    ThreatTimelineItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await dashboardAPI.get<DashboardResponse>("/");

        if (!data?.success) {
          throw new Error("Invalid dashboard response");
        }

        if (!mounted) {
          return;
        }

        setStats({
          totalUsers: data.stats?.totalUsers ?? 0,
          totalThreats: data.stats?.totalThreats ?? 0,
          totalScans: data.stats?.totalScans ?? 0,
          totalReports: data.stats?.totalReports ?? 0,
          criticalThreats: data.stats?.criticalThreats ?? 0,
          resolvedThreats: data.stats?.resolvedThreats ?? 0,
        });

        setRecentThreats(
          Array.isArray(data.recentThreats)
            ? data.recentThreats
            : []
        );

        setRecentScans(
          Array.isArray(data.recentScans)
            ? data.recentScans
            : []
        );

        setThreatDistribution(
          Array.isArray(data.threatDistribution)
            ? data.threatDistribution
            : []
        );

        setLiveThreatsOverTime(
          Array.isArray(data.threatsOverTime)
            ? data.threatsOverTime
            : []
        );
      } catch (err) {
        console.error("Dashboard Error:", err);

        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const metricCards: MetricCard[] = [
    {
      id: "users",
      label: "Total Users",
      value: stats.totalUsers,
      delta: 0,
      icon: "Users",
      accent: "blue",
      spark: [1, 2, 3, 4, 5],
    },
    {
      id: "threats",
      label: "Total Threats",
      value: stats.totalThreats,
      delta: 0,
      icon: "ShieldAlert",
      accent: "red",
      spark: [2, 3, 5, 4, 6],
    },
    {
      id: "scans",
      label: "Files Scanned",
      value: stats.totalScans,
      delta: 0,
      icon: "FileSearch",
      accent: "cyan",
      spark: [3, 5, 4, 6, 7],
    },
    {
      id: "reports",
      label: "Reports",
      value: stats.totalReports,
      delta: 0,
      icon: "Activity",
      accent: "emerald",
      spark: [1, 3, 2, 5, 4],
    },
  ];

  const totalDistribution = threatDistribution.reduce(
    (total, item) => total + item.count,
    0
  );

  const latestScan = recentScans[0];

  return (
    <div className="space-y-6">
      {/* Loading */}
      {loading && (
        <div className="glass-card rounded-xl border border-white/[0.06] p-4 text-sm text-slate-400">
          Loading live security data…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="glass-card rounded-xl border border-accent-red/20 bg-accent-red/[0.04] p-4">
          <p className="text-sm font-medium text-accent-red">
            Unable to load dashboard data
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {error}
          </p>

          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric, index) => (
          <MetricCardItem
            key={metric.id}
            card={metric}
            index={index}
          />
        ))}
      </div>

      {/* Threat activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard
          className="lg:col-span-2"
          delay={0.1}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                <Activity className="h-4 w-4 text-accent-cyan" />
                Threats Over Time
              </h3>

              <p className="text-xs text-slate-500">
                Last 24 hours · UTC
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-accent-blue" />
                Threats
              </span>

              <span className="hidden items-center gap-1.5 text-slate-400 sm:flex">
                <span className="h-2 w-2 rounded-full bg-accent-emerald" />
                Resolved
              </span>

              <span className="hidden items-center gap-1.5 text-slate-400 sm:flex">
                <span className="h-2 w-2 rounded-full bg-accent-red" />
                Critical
              </span>
            </div>
          </div>

          <div className="h-64">
            {liveThreatsOverTime.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No threat activity recorded in the last 24 hours.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={liveThreatsOverTime}
                  margin={{
                    top: 8,
                    right: 8,
                    bottom: 0,
                    left: -20,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="g-threats"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#3B82F6"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="100%"
                        stopColor="#3B82F6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="_id"
                    tick={{
                      fill: "#64748B",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fill: "#64748B",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,23,42,0.95)",
                      border:
                        "1px solid rgba(59,130,246,0.25)",
                      borderRadius: 12,
                    }}
                    labelStyle={{
                      color: "#94A3B8",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="threats"
                    name="Threats"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#g-threats)"
                  />

                  <Area
                    type="monotone"
                    dataKey="blocked"
                    name="Resolved"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="none"
                  />

                  <Area
                    type="monotone"
                    dataKey="critical"
                    name="Critical"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Live summary */}
        <GlassCard delay={0.15}>
          <h3 className="mb-1 text-base font-semibold text-white">
            Security Summary
          </h3>

          <p className="text-xs text-slate-500">
            Current database totals
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-xs text-slate-400">
                Critical threats
              </span>

              <span className="font-mono text-lg font-semibold text-accent-red">
                {stats.criticalThreats ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-xs text-slate-400">
                Resolved threats
              </span>

              <span className="font-mono text-lg font-semibold text-accent-emerald">
                {stats.resolvedThreats ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-xs text-slate-400">
                Latest scan
              </span>

              <span className="max-w-[130px] truncate text-right text-xs text-slate-300">
                {latestScan?.filename ?? "No scans yet"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full"
            onClick={() => onNavigate("scanner")}
          >
            Open File Scanner
          </Button>
        </GlassCard>
      </div>

      {/* Distribution + incidents */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Distribution */}
        <GlassCard delay={0.2}>
          <h3 className="mb-1 text-base font-semibold text-white">
            Threat Distribution
          </h3>

          <p className="text-xs text-slate-500">
            By severity
          </p>

          <div className="relative h-44">
            {threatDistribution.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No threats recorded.
              </div>
            ) : (
              <>
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={threatDistribution}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {threatDistribution.map((item) => (
                        <Cell
                          key={item._id}
                          fill={severityColor(item._id)}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background:
                          "rgba(15,23,42,0.95)",
                        border:
                          "1px solid rgba(59,130,246,0.25)",
                        borderRadius: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-2xl font-bold text-white">
                    {totalDistribution}
                  </span>

                  <span className="text-[10px] text-slate-500">
                    Threats
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="mt-3 space-y-1.5">
            {threatDistribution.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-slate-300">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        severityColor(item._id),
                    }}
                  />

                  {item._id}
                </span>

                <span className="font-mono text-slate-400">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent incidents */}
        <GlassCard
          className="lg:col-span-2"
          delay={0.25}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Recent Incidents
              </h3>

              <p className="text-xs text-slate-500">
                Latest real threat records
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              icon={
                <ArrowUpRight className="h-3.5 w-3.5" />
              }
              onClick={() => onNavigate("threats")}
            >
              View all
            </Button>
          </div>

          {recentThreats.length === 0 ? (
            <div className="rounded-xl border border-white/[0.05] p-8 text-center">
              <p className="text-sm text-slate-400">
                No threat incidents have been recorded yet.
              </p>

              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => onNavigate("scanner")}
              >
                Scan a File
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/[0.05]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-2.5 font-medium">
                      Incident
                    </th>

                    <th className="px-4 py-2.5 font-medium">
                      File
                    </th>

                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                      Risk
                    </th>

                    <th className="px-4 py-2.5 font-medium">
                      Status
                    </th>

                    <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentThreats.map((threat, index) => (
                    <motion.tr
                      key={threat._id}
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.3 + index * 0.06,
                      }}
                      onClick={() =>
                        onNavigate("threats")
                      }
                      className="cursor-pointer border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-accent-cyan">
                        {threat._id.slice(-6)}
                      </td>

                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-slate-200">
                          <FileUp className="h-3.5 w-3.5 text-slate-500" />

                          <span className="max-w-[180px] truncate">
                            {threat.title || "Untitled threat"}
                          </span>
                        </span>
                      </td>

                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                            severityBg(
                              threat.severity
                            )
                          )}
                        >
                          {threat.severity}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          label={
                            threat.status || "Unknown"
                          }
                          kind="status"
                        />
                      </td>

                      <td className="hidden px-4 py-3 text-xs text-slate-500 md:table-cell">
                        {threat.createdAt
                          ? new Date(
                            threat.createdAt
                          ).toLocaleString()
                          : "—"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Live scan information */}
      <GlassCard
        delay={0.3}
        className="relative overflow-hidden"
      >
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-purple/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow-purple">
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">
                  Today's Security Overview
                </h3>

                <p className="text-xs text-slate-500">
                  Generated from live SentinelAI data
                </p>
              </div>
            </div>

            <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
              SentinelAI currently has{" "}
              <span className="font-semibold text-white">
                {stats.totalThreats}
              </span>{" "}
              recorded threats and{" "}
              <span className="font-semibold text-white">
                {stats.totalScans}
              </span>{" "}
              scanned files.{" "}
              {stats.criticalThreats
                ? `${stats.criticalThreats} critical threat${stats.criticalThreats === 1
                  ? ""
                  : "s"
                } require${stats.criticalThreats === 1
                  ? "s"
                  : ""
                } attention.`
                : "No critical threats are currently recorded."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-slate-300">
                {stats.totalScans} Files Scanned
              </span>

              <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-slate-300">
                {stats.totalThreats} Threats
              </span>

              <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-slate-300">
                {stats.criticalThreats ?? 0} Critical
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:w-56">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Cpu className="h-3.5 w-3.5" />
                  Data Status
                </span>

                <span className="font-mono font-semibold text-accent-emerald">
                  Live
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="md"
              onClick={() =>
                onNavigate("assistant")
              }
            >
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}