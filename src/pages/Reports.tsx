import { motion } from "framer-motion";
import {
  FileBarChart,
  Download,
  Calendar,
  FileText,
  ShieldAlert,
  CheckCircle2,
  Printer,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { cn, severityBg } from "@/utils/cn";
import dashboardAPI from "@/services/dashboardService";

interface Threat {
  _id: string;
  title: string;
  type: string;
  severity:
  | "Low"
  | "Medium"
  | "High"
  | "Critical";
  status:
  | "Detected"
  | "Investigating"
  | "Resolved";
  description?: string;
  createdAt: string;
}

interface ThreatDistribution {
  _id: string;
  count: number;
}

interface ThreatOverTime {
  _id: string;
  threats: number;
  blocked: number;
  critical: number;
}

interface DashboardResponse {
  success: boolean;
  stats: {
    totalUsers: number;
    totalThreats: number;
    totalScans: number;
    totalReports: number;
    criticalThreats: number;
    resolvedThreats: number;
  };
  recentThreats: Threat[];
  threatDistribution: ThreatDistribution[];
  threatsOverTime: ThreatOverTime[];
}

type ReportType =
  | "Incident Summary"
  | "Threat Analysis"
  | "Compliance"
  | "Executive";

export function Reports() {
  const toast = useToast();

  const [reportType, setReportType] =
    useState<ReportType>(
      "Incident Summary"
    );

  const [generating, setGenerating] =
    useState(false);

  const [reportData, setReportData] =
    useState<DashboardResponse | null>(
      null
    );

  const [loadingData, setLoadingData] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadReportData = async () => {
    try {
      setLoadingData(true);
      setError("");

      const { data } =
        await dashboardAPI.get<
          DashboardResponse
        >("/");

      if (!data?.success) {
        throw new Error(
          "Unable to load report data."
        );
      }

      setReportData(data);
    } catch (err) {
      console.error(
        "Failed to load report data:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load report data."
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const reportDate = useMemo(
    () =>
      new Date().toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ),
    []
  );

  const generate = async () => {
    if (!reportData) {
      toast(
        "Report data is not available yet.",
        "error"
      );
      return;
    }

    setGenerating(true);

    try {
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 800)
      );

      toast(
        `${reportType} generated successfully`,
        "success"
      );
    } catch (err) {
      console.error(
        "Report generation error:",
        err
      );

      toast(
        "Unable to generate report",
        "error"
      );
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) {
      return;
    }

    const report = {
      reportType,
      generatedAt:
        new Date().toISOString(),
      stats: reportData.stats,
      recentThreats:
        reportData.recentThreats,
      threatDistribution:
        reportData.threatDistribution,
      threatsOverTime:
        reportData.threatsOverTime,
    };

    const blob = new Blob(
      [
        JSON.stringify(
          report,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download = `sentinel-${reportType
      .toLowerCase()
      .replace(/\s+/g, "-")}-report.json`;

    document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    toast(
      "Report downloaded successfully",
      "success"
    );
  };

  const printReport = () => {
    window.print();
  };

  const stats = reportData?.stats;

  const reportTypes: {
    title: ReportType;
    desc: string;
    icon: typeof ShieldAlert;
    color: string;
  }[] = [
      {
        title: "Incident Summary",
        desc: "All incidents",
        icon: ShieldAlert,
        color:
          "from-accent-red to-accent-amber",
      },
      {
        title: "Threat Analysis",
        desc: "Threat trends",
        icon: FileBarChart,
        color:
          "from-accent-blue to-accent-cyan",
      },
      {
        title: "Compliance",
        desc: "SOC 2 / ISO",
        icon: CheckCircle2,
        color:
          "from-accent-emerald to-accent-cyan",
      },
      {
        title: "Executive",
        desc: "C-suite brief",
        icon: FileText,
        color:
          "from-accent-purple to-accent-blue",
      },
    ];

  if (loadingData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-accent-cyan" />
          Loading report data…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Reports
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Generate and export security reports.
          </p>
        </div>

        <GlassCard hover={false}>
          <div className="flex flex-col items-center py-12 text-center">
            <ShieldAlert className="h-10 w-10 text-accent-red" />

            <p className="mt-3 text-sm font-semibold text-white">
              Unable to load report data
            </p>

            <p className="mt-1 max-w-md text-xs text-slate-500">
              {error}
            </p>

            <button
              onClick={
                loadReportData
              }
              className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Reports
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Generate and export security reports.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="md"
            icon={
              <Calendar className="h-4 w-4" />
            }
          >
            {reportDate}
          </Button>

          <Button
            size="md"
            icon={
              generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileBarChart className="h-4 w-4" />
              )
            }
            onClick={generate}
            disabled={generating}
          >
            {generating
              ? "Generating…"
              : "Generate Report"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {reportTypes.map(
          (report, index) => (
            <motion.button
              key={report.title}
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
              whileHover={{
                y: -4,
              }}
              onClick={() =>
                setReportType(
                  report.title
                )
              }
              className={cn(
                "glass-card glass-card-hover p-4 text-left",
                reportType ===
                report.title &&
                "ring-1 ring-accent-cyan/40"
              )}
            >
              <div
                className={cn(
                  "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
                  report.color
                )}
              >
                <report.icon className="h-5 w-5 text-white" />
              </div>

              <p className="text-sm font-semibold text-white">
                {report.title}
              </p>

              <p className="text-xs text-slate-500">
                {report.desc}
              </p>
            </motion.button>
          )
        )}
      </div>

      <GlassCard
        hover={false}
        className="overflow-hidden p-0"
      >
        {generating ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />

              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-accent-blue border-t-accent-cyan" />
            </div>

            <p className="mt-4 text-sm text-slate-400">
              Compiling report data…
            </p>
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="bg-[#0B1224] p-8"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan">
                  <ShieldAlert className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    Sentinel Security Report
                  </h3>

                  <p className="text-xs text-slate-500">
                    {reportDate} ·{" "}
                    {reportType}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={
                    printReport
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 hover:text-white"
                >
                  <Printer className="h-4 w-4" />
                </button>

                <button
                  onClick={
                    downloadReport
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label:
                    "Total Incidents",
                  val:
                    stats?.totalThreats ??
                    0,
                  color:
                    "text-white",
                },
                {
                  label: "Critical",
                  val:
                    stats?.criticalThreats ??
                    0,
                  color:
                    "text-accent-red",
                },
                {
                  label: "Resolved",
                  val:
                    stats?.resolvedThreats ??
                    0,
                  color:
                    "text-accent-emerald",
                },
                {
                  label: "Total Scans",
                  val:
                    stats?.totalScans ??
                    0,
                  color:
                    "text-accent-cyan",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
                >
                  <p
                    className={cn(
                      "font-mono text-2xl font-bold",
                      stat.color
                    )}
                  >
                    {stat.val.toLocaleString()}
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-4">
                <p className="mb-2 text-xs font-semibold text-slate-300">
                  Threat Activity
                </p>

                <div className="h-40">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={
                        reportData?.threatsOverTime ||
                        []
                      }
                      margin={{
                        top: 5,
                        right: 5,
                        bottom: 0,
                        left: -25,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="report-threat-gradient"
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
                        stroke="rgba(255,255,255,0.04)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="_id"
                        tick={{
                          fill: "#64748B",
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fill: "#64748B",
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background:
                            "rgba(15,23,42,0.95)",
                          border:
                            "1px solid rgba(59,130,246,0.25)",
                          borderRadius: 12,
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="threats"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="url(#report-threat-gradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-4">
                <p className="mb-2 text-xs font-semibold text-slate-300">
                  Threat Categories
                </p>

                <div className="h-40">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          reportData?.threatDistribution ||
                          []
                        }
                        dataKey="count"
                        nameKey="_id"
                        innerRadius={35}
                        outerRadius={60}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {(
                          reportData?.threatDistribution ||
                          []
                        ).map(
                          (entry) => (
                            <Cell
                              key={
                                entry._id
                              }
                              fill={
                                entry._id ===
                                  "Critical"
                                  ? "#EF4444"
                                  : entry._id ===
                                    "High"
                                    ? "#F59E0B"
                                    : entry._id ===
                                      "Medium"
                                      ? "#3B82F6"
                                      : "#10B981"
                              }
                            />
                          )
                        )}
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
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.05]">
              <p className="bg-white/[0.02] px-4 py-2 text-xs font-semibold text-slate-300">
                Recent Incidents
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.05] text-left text-slate-500">
                      <th className="px-4 py-2 font-medium">
                        ID
                      </th>

                      <th className="px-4 py-2 font-medium">
                        Threat
                      </th>

                      <th className="px-4 py-2 font-medium">
                        Type
                      </th>

                      <th className="px-4 py-2 font-medium">
                        Risk
                      </th>

                      <th className="px-4 py-2 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {(
                      reportData?.recentThreats ||
                      []
                    ).map(
                      (threat) => (
                        <tr
                          key={
                            threat._id
                          }
                          className="border-b border-white/[0.03] last:border-0"
                        >
                          <td className="px-4 py-2 font-mono text-accent-cyan">
                            {threat._id.slice(
                              -6
                            )}
                          </td>

                          <td className="px-4 py-2 text-slate-300">
                            {threat.title}
                          </td>

                          <td className="px-4 py-2 text-slate-400">
                            {threat.type}
                          </td>

                          <td className="px-4 py-2">
                            <span
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
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

                          <td className="px-4 py-2 text-slate-400">
                            {
                              threat.status
                            }
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {(
                  reportData?.recentThreats ||
                  []
                ).length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No recent incidents.
                    </div>
                  )}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-accent-emerald/15 bg-accent-emerald/[0.04] p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-accent-emerald">
                <CheckCircle2 className="h-4 w-4" />
                Report Summary
              </p>

              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>
                  Total threats:
                  {" "}
                  {stats?.totalThreats ??
                    0}
                </li>

                <li>
                  Critical threats:
                  {" "}
                  {stats?.criticalThreats ??
                    0}
                </li>

                <li>
                  Resolved threats:
                  {" "}
                  {stats?.resolvedThreats ??
                    0}
                </li>

                <li>
                  Total files scanned:
                  {" "}
                  {stats?.totalScans ??
                    0}
                </li>

                <li>
                  Total reports:
                  {" "}
                  {stats?.totalReports ??
                    0}
                </li>
              </ul>
            </div>

            <p className="mt-6 text-center text-[10px] text-slate-600">
              Sentinel AI Cyber Command ·
              Confidential · Generated{" "}
              {new Date().toLocaleString()}
            </p>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}