import { motion } from 'framer-motion';
import {
  FileBarChart,
  Download,
  Calendar,
  FileText,
  ShieldAlert,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
} from 'recharts';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { cn, severityBg } from '@/utils/cn';
import dashboardAPI from '@/services/dashboardService';

export function Reports() {
  const toast = useToast();

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);

  const [reportData, setReportData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoadingData(true);

        const { data } = await dashboardAPI.get('/');

        if (data.success) {
          setReportData(data);
        }
      } catch (error) {
        console.error('Failed to load report data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadReportData();
  }, []);

  const generate = () => {
    setGenerating(true);
    setGenerated(false);

    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast('Report generated successfully', 'success');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Reports</h2>
          <p className="mt-1 text-sm text-slate-400">
            Generate and export security reports
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="md"
            icon={<Calendar className="h-4 w-4" />}
          >
            Aug 4, 2026
          </Button>

          <Button
            size="md"
            icon={<FileBarChart className="h-4 w-4" />}
            onClick={generate}
          >
            {generating ? 'Generating…' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Report types */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            title: 'Incident Summary',
            desc: 'All incidents',
            icon: ShieldAlert,
            color: 'from-accent-red to-accent-amber',
          },
          {
            title: 'Threat Analysis',
            desc: 'Threat trends',
            icon: FileBarChart,
            color: 'from-accent-blue to-accent-cyan',
          },
          {
            title: 'Compliance',
            desc: 'SOC 2 / ISO',
            icon: CheckCircle2,
            color: 'from-accent-emerald to-accent-cyan',
          },
          {
            title: 'Executive',
            desc: 'C-suite brief',
            icon: FileText,
            color: 'from-accent-purple to-accent-blue',
          },
        ].map((r, i) => (
          <motion.button
            key={r.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="glass-card glass-card-hover p-4 text-left"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${r.color}`}
            >
              <r.icon className="h-5 w-5 text-white" />
            </div>

            <p className="text-sm font-semibold text-white">{r.title}</p>
            <p className="text-xs text-slate-500">{r.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* PDF Preview */}
      <GlassCard hover={false} className="overflow-hidden p-0">
        {generating ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent-cyan border-r-accent-blue" />
            </div>

            <p className="mt-4 text-sm text-slate-400">
              Compiling report data…
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0B1224] p-8"
          >
            {/* PDF doc header */}
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
                    August 4, 2026 · Incident Summary
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 hover:text-white">
                  <Printer className="h-4 w-4" />
                </button>

                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 hover:text-white">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Summary stats */}
            <div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: 'Total Incidents',
                  val: reportData?.stats?.totalThreats ?? 0,
                  color: 'text-white',
                },
                {
                  label: 'Critical',
                  val: reportData?.stats?.criticalThreats ?? 0,
                  color: 'text-accent-red',
                },
                {
                  label: 'Resolved',
                  val: reportData?.stats?.resolvedThreats ?? 0,
                  color: 'text-accent-emerald',
                },
                {
                  label: 'Avg Response',
                  val: '4.2m',
                  color: 'text-accent-cyan',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
                >
                  <p
                    className={`font-mono text-2xl font-bold ${s.color}`}
                  >
                    {s.val}
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Threat Activity */}
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-4">
                <p className="mb-2 text-xs font-semibold text-slate-300">
                  Threat Activity (24h)
                </p>

                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={reportData?.threatsOverTime || []}
                      margin={{
                        top: 5,
                        right: 5,
                        bottom: 0,
                        left: -25,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="rpt-grad"
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
                          fill: '#64748B',
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fill: '#64748B',
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: 'rgba(15,23,42,0.95)',
                          border:
                            '1px solid rgba(59,130,246,0.25)',
                          borderRadius: 12,
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="threats"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="url(#rpt-grad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Threat Categories */}
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-4">
                <p className="mb-2 text-xs font-semibold text-slate-300">
                  Threat Categories
                </p>

                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData?.threatDistribution || []}
                        dataKey="count"
                        nameKey="_id"
                        innerRadius={35}
                        outerRadius={60}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {(reportData?.threatDistribution || []).map(
                          (e: any) => (
                            <Cell
                              key={e._id}
                              fill={
                                e._id === 'Critical'
                                  ? '#EF4444'
                                  : e._id === 'High'
                                    ? '#F59E0B'
                                    : e._id === 'Medium'
                                      ? '#3B82F6'
                                      : '#10B981'
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          background: 'rgba(15,23,42,0.95)',
                          border:
                            '1px solid rgba(59,130,246,0.25)',
                          borderRadius: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Incident table */}
            <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.05]">
              <p className="bg-white/[0.02] px-4 py-2 text-xs font-semibold text-slate-300">
                Incident Summary
              </p>

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.05] text-left text-slate-500">
                    <th className="px-4 py-2 font-medium">ID</th>
                    <th className="px-4 py-2 font-medium">File</th>
                    <th className="px-4 py-2 font-medium">Risk</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {(reportData?.recentThreats || []).map(
                    (threat: any) => (
                      <tr
                        key={threat._id}
                        className="border-b border-white/[0.03] last:border-0"
                      >
                        <td className="px-4 py-2 font-mono text-accent-cyan">
                          {threat._id.slice(-6)}
                        </td>

                        <td className="px-4 py-2 text-slate-300">
                          {threat.title}
                        </td>

                        <td className="px-4 py-2">
                          <span
                            className={cn(
                              'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                              severityBg(threat.severity)
                            )}
                          >
                            {threat.severity}
                          </span>
                        </td>

                        <td className="px-4 py-2 text-slate-400">
                          {threat.status}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Recommendations */}
            <div className="mt-5 rounded-xl border border-accent-emerald/15 bg-accent-emerald/[0.04] p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-accent-emerald">
                <CheckCircle2 className="h-4 w-4" />
                Recommendations
              </p>

              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>
                  1. Enforce MFA across all SSH endpoints immediately.
                </li>
                <li>
                  2. Patch OpenSSH against CVE-2026-9921 (actively exploited).
                </li>
                <li>
                  3. Rotate credentials for bastion-jump-host and ldap-primary.
                </li>
                <li>
                  4. Deploy EDR agent on k8s-worker-09 and run full scan.
                </li>
              </ul>
            </div>

            <p className="mt-6 text-center text-[10px] text-slate-600">
              Sentinel AI Cyber Command · Confidential · Generated
              2026-08-04 21:30 UTC
            </p>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}