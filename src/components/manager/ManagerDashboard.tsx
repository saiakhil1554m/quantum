import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHelpdesk } from '../../context/HelpdeskContext';

export const ManagerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { tickets, clusters } = useHelpdesk();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const totalTickets = tickets.length + 184; // Aggregate simulation
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length + 162;
  const slaCompliance = '96.4%';
  const avgResolutionTime = '14.2m';
  const selfServiceDeflection = '42.8%';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header with User Persona Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5">
        <div className="flex items-center gap-3.5">
          <img
            src={
              currentUser?.avatar ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            }
            alt={currentUser?.name || 'Manager'}
            className="w-12 h-12 rounded-xl object-cover shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {currentUser?.employeeId || 'MGR001'}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                Management Portal
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Good day, {currentUser?.name || 'Vikram Rao'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser?.designation || 'Director of Enterprise IT Services'} •{' '}
              {currentUser?.department || 'IT Operations & Service Delivery'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '7d' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '30d' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '90d' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Quarter
            </button>
          </div>

          <button
            onClick={() => alert('Exporting monthly executive KPI summary PDF...')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Core Executive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Total Tickets</span>
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              <Layers className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{totalTickets}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +12.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {resolvedCount} resolved • {totalTickets - resolvedCount} active
          </p>
        </div>

        {/* Average Resolution Time */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Avg Resolution Time</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{avgResolutionTime}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
              -38.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Target SLA standard: &lt; 30 mins
          </p>
        </div>

        {/* SLA Performance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>SLA Performance</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{slaCompliance}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              +1.8% QoQ
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Tier-1 SLA compliance: 99.1%
          </p>
        </div>

        {/* Self-Service Resolution Deflection */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Self-Service</span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{selfServiceDeflection}</span>
            <span className="inline-flex items-center text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
              +14.5% Deflected
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Automated password/VPN self-remediation
          </p>
        </div>
      </div>

      {/* Main Content: Balanced Two-Column Grid on Desktop / Single-Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Support Team Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Team Workload & Velocity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time load balancing and ticket resolution speed</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">4 Active Teams</span>
          </div>

          <div className="space-y-3">
            {[
              {
                team: 'Network Support (L2/L3)',
                lead: 'Ananya S. (IT001)',
                active: 4,
                resolved: 78,
                sla: '98.2%',
                load: 65,
                color: 'bg-blue-600',
              },
              {
                team: 'SAP & SolMan Basis',
                lead: 'Devendra S. (IT003)',
                active: 3,
                resolved: 54,
                sla: '94.8%',
                load: 50,
                color: 'bg-purple-600',
              },
              {
                team: 'Active Directory & Identity',
                lead: 'Identity Ops Team',
                active: 2,
                resolved: 92,
                sla: '99.1%',
                load: 35,
                color: 'bg-emerald-600',
              },
              {
                team: 'Field Hardware & SCADA',
                lead: 'Field Support',
                active: 5,
                resolved: 38,
                sla: '92.0%',
                load: 80,
                color: 'bg-amber-600',
              },
            ].map(item => (
              <div key={item.team} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-900 dark:text-white font-semibold">{item.team}</strong>
                    <span className="text-slate-500 dark:text-slate-400 ml-2 font-mono text-[11px]">• {item.lead}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>{item.active}</strong> active
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      SLA {item.sla}
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proactive Outage & Incident Summary */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Incident Pulse Overview</h2>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
              {clusters.length} Active Clusters
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated correlation prevented 14 duplicate ticket floods this week.
          </p>

          <div className="space-y-3">
            {clusters.slice(0, 3).map(cluster => (
              <div key={cluster.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cluster.id}</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                    {cluster.severity}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{cluster.title}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/40 dark:border-slate-800">
                  <span>{cluster.affectedUsersCount} affected users</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">{cluster.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="p-3.5 bg-blue-500/10 rounded-xl text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Executive Insight:</strong> AI triaging deflected 42.8% of password and VPN inquiries without manual engineer intervention.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
