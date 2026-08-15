import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Sparkles,
  FileUp,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  Cpu,
  TrendingUp,
} from 'lucide-react';
import { MetricCardItem } from '@/components/MetricCard';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { cn, severityBg } from '@/utils/cn';
import { useEffect, useState } from "react";
import dashboardAPI from "@/services/dashboardService";
import type { PageId, MetricCard } from "@/types";
import {
  aiSummary,
  recentIncidents,
  securityScoreGauge,
  threatDistribution,
  threatsOverTime,
} from "@/utils/mockData";

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState({
  totalUsers: 0,
  totalThreats: 0,
  totalScans: 0,
  totalReports: 0,
});
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
interface RecentThreat {
  _id: string;
  title: string;
  type: string;
  severity: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const [recentThreats, setRecentThreats] = useState<RecentThreat[]>([]);
const [recentScans, setRecentScans] = useState([]);
interface ThreatDistributionItem {
  _id: string;
  count: number;
}

const [threatDistribution, setLiveThreatDistribution] =
  useState<ThreatDistributionItem[]>([]);
const [liveThreatsOverTime, setLiveThreatsOverTime] = useState([]);
useEffect(() => {
  const fetchDashboard = async () => {
    try {

      const { data } = await dashboardAPI.get("/");

      setStats(data.stats);
      setRecentThreats(data.recentThreats);
      setRecentScans(data.recentScans);
      setLiveThreatDistribution(data.threatDistribution);
      setLiveThreatsOverTime(data.threatsOverTime);
    } catch (err) {
      console.error(err);
    }
  };

  fetchDashboard();
}, []);
  return (

    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((m, i) => (
  <MetricCardItem
    key={m.id}
    card={m}
    index={i}
  />
))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Threats over time */}
        <GlassCard className="lg:col-span-2" delay={0.1}>
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
    </div>
  </div>

  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
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
            border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: 12,
          }}
          labelStyle={{
            color: "#94A3B8",
          }}
        />

        <Area
          type="monotone"
          dataKey="threats"
          stroke="#3B82F6"
          strokeWidth={2}
          fill="url(#g-threats)"
          />
          
        <Area
  type="monotone"
  dataKey="blocked"
  stroke="#10B981"
  strokeWidth={2}
  fill="none"
/>

<Area
  type="monotone"
  dataKey="critical"
  stroke="#EF4444"
  strokeWidth={2}
  fill="none"
/>
        
      </AreaChart>
    </ResponsiveContainer>
  </div>
</GlassCard>
        
      </div>

      {/* Distribution + Incidents + AI summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Distribution */}
        <GlassCard delay={0.15}>
          <h3 className="mb-1 text-base font-semibold text-white">Threat Distribution</h3>
          <p className="text-xs text-slate-500">By attack category</p>
          <div className="relative h-44">
            <ResponsiveContainer width="100%" height="100%">
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
  {threatDistribution.map((e) => (
    <Cell
      key={e._id}
      fill={
        e._id === "Critical"
          ? "#EF4444"
          : e._id === "High"
          ? "#F59E0B"
          : e._id === "Medium"
          ? "#3B82F6"
          : "#10B981"
      }
    />
  ))}
</Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,23,42,0.95)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-2xl font-bold text-white">{threatDistribution.length}</span>
              <span className="text-[10px] text-slate-500">Categories</span>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
  {threatDistribution.map((e) => (
    <div
      key={e._id}
      className="flex items-center justify-between text-xs"
    >
      <span className="flex items-center gap-2 text-slate-300">
        <span
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor:
              e._id === "Critical"
                ? "#EF4444"
                : e._id === "High"
                ? "#F59E0B"
                : e._id === "Medium"
                ? "#3B82F6"
                : "#10B981",
          }}
        />
        {e._id}
      </span>

      <span className="font-mono text-slate-400">
        {e.count}
      </span>
    </div>
  ))}
</div>
        </GlassCard>

        {/* Recent incidents */}
        <GlassCard className="lg:col-span-2" delay={0.2}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Recent Incidents</h3>
              <p className="text-xs text-slate-500">Latest uploads & detections</p>
            </div>
            <Button variant="ghost" size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />} onClick={() => onNavigate('threats')}>
              View all
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/[0.05]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-2.5 font-medium">Incident</th>
                  <th className="px-4 py-2.5 font-medium">File</th>
                  <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Risk</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="hidden px-4 py-2.5 font-medium md:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
  {recentThreats.map((threat, i) => (
    <motion.tr
      key={threat._id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + i * 0.06 }}
      onClick={() => onNavigate("threats")}
      className="cursor-pointer border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.03]"
    >
      <td className="px-4 py-3 font-mono text-xs text-accent-cyan">
        {threat._id.slice(-6)}
      </td>

      <td className="px-4 py-3">
        <span className="flex items-center gap-2 text-slate-200">
          <FileUp className="h-3.5 w-3.5 text-slate-500" />
          {threat.title}
        </span>
      </td>

      <td className="hidden px-4 py-3 sm:table-cell">
        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
            severityBg(threat.severity)
          )}
        >
          {threat.severity}
        </span>
      </td>

      <td className="px-4 py-3">
        <Badge label={threat.status} kind="status" />
      </td>

      <td className="hidden px-4 py-3 text-xs text-slate-500 md:table-cell">
        {new Date(threat.createdAt).toLocaleString()}
      </td>
    </motion.tr>
  ))}
</tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* AI Summary */}
      <GlassCard delay={0.25} className="relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-purple/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow-purple">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Today's Security Overview</h3>
                <p className="text-xs text-slate-500">AI-generated · Updated 2 min ago</p>
              </div>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-300">{aiSummary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['MFA Enforcement', 'SSH Audit', 'C2 Containment'].map((tag) => (
                <span key={tag} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:w-56">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400"><Cpu className="h-3.5 w-3.5" /> AI Confidence</span>
                <span className="font-mono font-semibold text-accent-emerald">94%</span>
              </div>
            </div>
            <Button variant="ghost" size="md" icon={<TrendingUp className="h-4 w-4" />} onClick={() => onNavigate('assistant')}>
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
