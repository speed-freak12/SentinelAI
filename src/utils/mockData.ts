import type {
  Incident,
  MetricCard,
  Threat,
  ThreatFeedItem,
} from '@/types';

export const threatScore = 72;

export const metrics: MetricCard[] = [
  {
    id: 'threat-score',
    label: 'Threat Score',
    value: 72,
    unit: '/100',
    delta: 5.2,
    icon: 'ShieldAlert',
    accent: 'red',
    spark: [40, 55, 48, 60, 52, 68, 72],
  },
  {
    id: 'critical',
    label: 'Critical Alerts',
    value: 14,
    delta: -3,
    icon: 'AlertTriangle',
    accent: 'amber',
    spark: [22, 19, 25, 18, 16, 17, 14],
  },
  {
    id: 'files',
    label: 'Files Scanned',
    value: 48217,
    delta: 12.4,
    icon: 'FileSearch',
    accent: 'cyan',
    spark: [12000, 22000, 30000, 38000, 42000, 46000, 48217],
  },
  {
    id: 'users',
    label: 'Active Users',
    value: 1284,
    delta: 2.1,
    icon: 'Users',
    accent: 'blue',
    spark: [900, 1000, 1100, 1150, 1200, 1240, 1284],
  },
  {
    id: 'health',
    label: 'System Health',
    value: 98,
    unit: '%',
    delta: 0.4,
    icon: 'Activity',
    accent: 'emerald',
    spark: [94, 95, 96, 95, 97, 97, 98],
  },
];

export const threatsOverTime = [
  { time: '00:00', threats: 32, blocked: 28, critical: 4 },
  { time: '03:00', threats: 18, blocked: 17, critical: 1 },
  { time: '06:00', threats: 25, blocked: 22, critical: 3 },
  { time: '09:00', threats: 54, blocked: 49, critical: 5 },
  { time: '12:00', threats: 67, blocked: 61, critical: 6 },
  { time: '15:00', threats: 48, blocked: 45, critical: 3 },
  { time: '18:00', threats: 72, blocked: 66, critical: 6 },
  { time: '21:00', threats: 41, blocked: 38, critical: 3 },
];

export const threatDistribution = [
  { name: 'Malware', value: 38, color: '#EF4444' },
  { name: 'Phishing', value: 24, color: '#F59E0B' },
  { name: 'Brute Force', value: 18, color: '#3B82F6' },
  { name: 'DDoS', value: 12, color: '#06B6D4' },
  { name: 'Insider', value: 8, color: '#8B5CF6' },
];

export const securityScoreGauge = [
  { name: 'Score', value: 72, fill: '#3B82F6' },
];

export const recentIncidents = [
  {
    id: 'INC-2041',
    name: 'auth_service.log',
    risk: 'Critical',
    status: 'Active',
    time: '2 min ago',
  },
  {
    id: 'INC-2040',
    name: 'gateway_traffic.csv',
    risk: 'High',
    status: 'Investigating',
    time: '14 min ago',
  },
  {
    id: 'INC-2039',
    name: 'firewall_east.log',
    risk: 'Medium',
    status: 'Mitigated',
    time: '1 hr ago',
  },
  {
    id: 'INC-2038',
    name: 'endpoint_07.json',
    risk: 'Low',
    status: 'Resolved',
    time: '3 hr ago',
  },
  {
    id: 'INC-2037',
    name: 'dns_queries.log',
    risk: 'High',
    status: 'Investigating',
    time: '5 hr ago',
  },
];

export const aiSummary = `Today's posture is elevated. 14 critical alerts were detected across the authentication and perimeter layers, driven by a coordinated brute-force campaign against SSH endpoints. Threat score rose 5.2 points to 72/100. Perimeter defenses blocked 91% of inbound malicious traffic. Recommended immediate action: enforce MFA on exposed SSH services and review the anomaly spike at 18:00 UTC.`;

export const threats: Threat[] = [
  {
    id: 'THR-9001',
    type: 'Brute Force',
    severity: 'Critical',
    confidence: 98,
    sourceIp: '185.220.101.47',
    timestamp: '2026-08-04 21:14:22',
    status: 'Active',
  },
  {
    id: 'THR-9000',
    type: 'SQL Injection',
    severity: 'High',
    confidence: 91,
    sourceIp: '45.137.21.9',
    timestamp: '2026-08-04 20:58:10',
    status: 'Investigating',
  },
  {
    id: 'THR-8999',
    type: 'Malware C2',
    severity: 'Critical',
    confidence: 95,
    sourceIp: '194.165.16.78',
    timestamp: '2026-08-04 20:31:55',
    status: 'Active',
  },
  {
    id: 'THR-8998',
    type: 'Phishing',
    severity: 'Medium',
    confidence: 76,
    sourceIp: '82.118.21.230',
    timestamp: '2026-08-04 19:47:02',
    status: 'Mitigated',
  },
  {
    id: 'THR-8997',
    type: 'Port Scan',
    severity: 'Low',
    confidence: 64,
    sourceIp: '104.244.72.115',
    timestamp: '2026-08-04 19:12:33',
    status: 'Resolved',
  },
  {
    id: 'THR-8996',
    type: 'DDoS',
    severity: 'High',
    confidence: 88,
    sourceIp: '51.158.144.21',
    timestamp: '2026-08-04 18:50:18',
    status: 'Mitigated',
  },
  {
    id: 'THR-8995',
    type: 'XSS Attempt',
    severity: 'Medium',
    confidence: 71,
    sourceIp: '176.10.99.200',
    timestamp: '2026-08-04 18:22:40',
    status: 'Investigating',
  },
  {
    id: 'THR-8994',
    type: 'Credential Stuffing',
    severity: 'High',
    confidence: 84,
    sourceIp: '23.129.64.211',
    timestamp: '2026-08-04 17:55:09',
    status: 'Active',
  },
  {
    id: 'THR-8993',
    type: 'Ransomware',
    severity: 'Critical',
    confidence: 97,
    sourceIp: '91.219.236.166',
    timestamp: '2026-08-04 17:10:51',
    status: 'Investigating',
  },
  {
    id: 'THR-8992',
    type: 'Privilege Escalation',
    severity: 'High',
    confidence: 81,
    sourceIp: '192.42.116.16',
    timestamp: '2026-08-04 16:34:27',
    status: 'Mitigated',
  },
  {
    id: 'THR-8991',
    type: 'DNS Tunneling',
    severity: 'Medium',
    confidence: 73,
    sourceIp: '185.244.25.214',
    timestamp: '2026-08-04 15:58:13',
    status: 'Resolved',
  },
  {
    id: 'THR-8990',
    type: 'Insider Data Access',
    severity: 'Low',
    confidence: 58,
    sourceIp: '10.0.12.44',
    timestamp: '2026-08-04 15:21:08',
    status: 'Investigating',
  },
];

export const incident: Incident = {
  id: 'INC-2041',
  title: 'Coordinated SSH Brute Force Campaign',
  riskScore: 92,
  riskLevel: 'Critical',
  status: 'Active',
  time: '2026-08-04 21:14 UTC',
  system: 'auth-service-prod-01',
  affectedSystems: [
    'auth-service-prod-01',
    'bastion-jump-host',
    'ldap-primary',
    'k8s-worker-09',
  ],
  description:
    'A distributed brute-force campaign targeted the production SSH service between 18:00 and 21:14 UTC. Over 14,000 failed authentication attempts originated from 312 unique source IPs, with 4 successful logins observed on the bastion host. Lateral movement attempts toward LDAP primary were detected and blocked.',
  timeline: [
    { time: '18:02', event: 'Initial probe — 230 failed SSH attempts from 185.220.101.47', icon: 'radar' },
    { time: '18:48', event: 'Credential stuffing phase — 4,100 attempts across 312 IPs', icon: 'key' },
    { time: '19:30', event: 'First successful login on bastion-jump-host', icon: 'alert' },
    { time: '20:10', event: 'Lateral movement attempt to ldap-primary blocked', icon: 'shield' },
    { time: '20:31', event: 'Malware C2 beacon detected from compromised host', icon: 'bug' },
    { time: '21:14', event: 'Containment enforced — affected host isolated', icon: 'lock' },
  ],
  indicators: [
    '185.220.101.47 (Tor exit node)',
    '4,182 failed sshd auth events in /var/log/auth.log',
    'C2 beacon to 194.165.16.78 every 60s',
    'New cron entry: /tmp/.update-cache',
    'Anomalous outbound DNS tunneling to *.data-exfil.io',
  ],
  recommendations: [
    'Enforce MFA on all SSH endpoints immediately',
    'Rotate credentials for bastion-jump-host and ldap-primary',
    'Block 185.220.101.0/24 at the perimeter firewall',
    'Deploy EDR agent on k8s-worker-09 and run full scan',
    'Review and revoke suspicious SSH keys in authorized_keys',
  ],
  mitre: [
    { tactic: 'Initial Access', technique: 'Valid Accounts', id: 'T1078' },
    { tactic: 'Credential Access', technique: 'Brute Force', id: 'T1110' },
    { tactic: 'Lateral Movement', technique: 'Remote Services', id: 'T1021' },
    { tactic: 'Command and Control', technique: 'Application Layer Protocol', id: 'T1071' },
  ],
};

export const threatFeeds: ThreatFeedItem[] = [
  {
    id: 'CVE-2026-9921',
    name: 'OpenSSH Heap Overflow',
    cve: 'CVE-2026-9921',
    severity: 'Critical',
    exploitAvailable: true,
    date: '2026-08-04',
    description: 'Heap-based buffer overflow in OpenSSH sshd allows pre-auth RCE. Actively exploited in the wild.',
    category: 'RCE',
  },
  {
    id: 'CVE-2026-9840',
    name: 'Apache Routed Deserialization',
    cve: 'CVE-2026-9840',
    severity: 'Critical',
    exploitAvailable: true,
    date: '2026-08-03',
    description: 'Deserialization flaw in Apache Routed enables unauthenticated remote code execution.',
    category: 'RCE',
  },
  {
    id: 'CVE-2026-9771',
    name: 'Linux Kernel Pipe Privilege Escalation',
    cve: 'CVE-2026-9771',
    severity: 'High',
    exploitAvailable: false,
    date: '2026-08-02',
    description: 'Use-after-free in pipe buffer handling allows local privilege escalation to root.',
    category: 'Privilege Escalation',
  },
  {
    id: 'CVE-2026-9655',
    name: 'Nginx HTTP/3 Memory Disclosure',
    cve: 'CVE-2026-9655',
    severity: 'High',
    exploitAvailable: true,
    date: '2026-08-02',
    description: 'Malformed QUIC frames leak worker process memory, exposing secrets and tokens.',
    category: 'Info Disclosure',
  },
  {
    id: 'CVE-2026-9512',
    name: 'VMware vCenter SSRF',
    cve: 'CVE-2026-9512',
    severity: 'Critical',
    exploitAvailable: true,
    date: '2026-08-01',
    description: 'Server-side request forgery in vCenter allows unauthenticated internal network access.',
    category: 'SSRF',
  },
  {
    id: 'CVE-2026-9488',
    name: 'Cisco IOS XE Command Injection',
    cve: 'CVE-2026-9488',
    severity: 'High',
    exploitAvailable: false,
    date: '2026-07-31',
    description: 'Authenticated command injection in the web UI allows root-level execution on the appliance.',
    category: 'Command Injection',
  },
];

export const trendingMalware = [
  { name: 'LockBit 4.0', category: 'Ransomware', detections: 1842, trend: 23 },
  { name: 'Cobalt Strike Beacon', category: 'C2 Framework', detections: 1276, trend: 11 },
  { name: 'Emotet Loader', category: 'Banking Trojan', detections: 988, trend: -8 },
  { name: 'Agent Tesla', category: 'Infostealer', detections: 742, trend: 17 },
  { name: 'BlackCat ALPHV', category: 'Ransomware', detections: 631, trend: 9 },
];

export const threatFeedStream = [
  { source: 'US-CERT', msg: 'Advisory AA26-216A: Active exploitation of OpenSSH sshd', time: '4m' },
  { source: 'CrowdStrike', msg: 'New campaign "OVERCAST" targeting financial sector', time: '12m' },
  { source: 'Mandiant', msg: 'APT29 leveraging OAuth token abuse for persistence', time: '27m' },
  { source: 'Microsoft', msg: 'Patch Tuesday: 87 vulnerabilities, 9 critical', time: '1h' },
  { source: 'CISA', msg: 'Known Exploited Vulnerabilities catalog updated (+4)', time: '2h' },
  { source: 'Recorded Future', msg: 'Ransomware group "Akira" leaks 3 new victims', time: '3h' },
];

export const aiSuggestions = [
  'Explain today\u2019s threats',
  'What is brute force?',
  'How can I secure my server?',
  'Summarize incident INC-2041',
  'What MITRE tactics were used today?',
];

export const aiResponses: Record<string, string> = {
  default:
    'I analyzed the current threat landscape. Your environment shows 14 critical alerts, predominantly brute-force and C2 activity. Threat score is 72/100 (elevated). The most significant incident is INC-2041 — a coordinated SSH brute-force campaign. I recommend enforcing MFA on SSH endpoints and isolating k8s-worker-09.',
  brute:
    'Brute force is an attack where an adversary systematically tries many passwords or keys until one works. In today\u2019s data, SSH brute force accounted for 18% of detected threats. Defenses include rate limiting, account lockout, MFA, and moving SSH behind a bastion or VPN. Your perimeter blocked 91% of these attempts today.',
  secure:
    'To harden your server: (1) Enforce key-based SSH with MFA, (2) Disable password auth, (3) Restrict inbound traffic to known IPs, (4) Keep all packages patched — note CVE-2026-9921 is actively exploited, (5) Deploy EDR, (6) Enable centralized logging and alerting on auth failures. I can generate a remediation report if you\u2019d like.',
  incident:
    'INC-2041 is a critical SSH brute-force campaign active since 18:02 UTC. Risk score 92/100. 4 successful logins occurred on the bastion host before containment at 21:14. Affected systems: auth-service, bastion, ldap-primary, k8s-worker-09. MITRE mapping: T1078, T1110, T1021, T1071. Recommended: rotate credentials and isolate compromised hosts.',
  mitre:
    'Today\u2019s activity maps to four MITRE ATT&CK tactics: Initial Access (T1078 Valid Accounts), Credential Access (T1110 Brute Force), Lateral Movement (T1021 Remote Services), and Command and Control (T1071 Application Layer Protocol). The strongest signal is the brute-force credential access pattern peaking at 18:00 UTC.',
};
