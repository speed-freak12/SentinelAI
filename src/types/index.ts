export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type ThreatStatus = 'Active' | 'Mitigated' | 'Investigating' | 'Resolved';

export interface Threat {
  id: string;
  type: string;
  severity: Severity;
  confidence: number;
  sourceIp: string;
  timestamp: string;
  status: ThreatStatus;
}

export interface Incident {
  id: string;
  title: string;
  riskScore: number;
  riskLevel: Severity;
  status: ThreatStatus;
  time: string;
  system: string;
  affectedSystems: string[];
  timeline: { time: string; event: string; icon: string }[];
  indicators: string[];
  recommendations: string[];
  mitre: { tactic: string; technique: string; id: string }[];
  description: string;
}

export interface ThreatFeedItem {
  id: string;
  name: string;
  cve: string;
  severity: Severity;
  exploitAvailable: boolean;
  date: string;
  description: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: number;
  unit?: string;
  delta: number;
  icon: string;
  accent: 'blue' | 'cyan' | 'purple' | 'red' | 'emerald' | 'amber';
  spark: number[];
}

export type PageId =
  | 'dashboard'
  | 'threats'
  | 'incident'
  | 'logs'
  | 'assistant'
  | 'scanner'
  | 'intelligence'
  | 'reports'
  | 'settings';
