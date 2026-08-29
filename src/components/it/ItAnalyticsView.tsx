import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

export const ItAnalyticsView: React.FC = () => {
  const { tickets } = useHelpdesk();

  const total = tickets.length;
  const slaMet = tickets.filter(t => t.slaStatus === 'healthy' || t.status === 'resolved').length;
  const slaCompliance = Math.round((slaMet / Math.max(total, 1)) * 100);

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto font-sans text-[#27374D]">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#DDE6ED] border border-[#9DB2BF] text-[#27374D] text-xs font-semibold mb-1">
          <BarChart3 className="w-3.5 h-3.5 text-[#526D82]" />
          <span>Operational Intelligence</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#27374D] tracking-tight">
          SLA Compliance & AI Deflection Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#526D82] mt-0.5">
          Continuous telemetry evaluating AI self-service deflection, MTTR, and Ping-Pong reduction
        </p>
      </div>

      {/* Top 4 Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[#526D82] text-xs font-bold uppercase">
            <span>SLA Compliance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">{slaCompliance}%</p>
          <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +4.2% from previous cycle
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[#526D82] text-xs font-bold uppercase">
            <span>AI Deflection Rate</span>
            <Sparkles className="w-4 h-4 text-[#526D82]" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">87.4%</p>
          <p className="text-xs text-[#526D82]">
            Resolved via guided self-service
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[#526D82] text-xs font-bold uppercase">
            <span>Ping-Pong Reduction</span>
            <RefreshCw className="w-4 h-4 text-[#526D82]" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">73%</p>
          <p className="text-xs text-[#526D82]">
            Fewer reassignment disputes
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[#526D82] text-xs font-bold uppercase">
            <span>Mean Time To Resolve</span>
            <Clock className="w-4 h-4 text-[#526D82]" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">18.4m</p>
          <p className="text-xs text-[#526D82]">
            Down from 84m legacy baseline
          </p>
        </div>
      </div>

      {/* Deep Dive Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Deflection & Self-Service Efficiency */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
            AI Triage & Deflection Breakdown
          </h2>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-[#526D82] mb-1 font-semibold">
                <span>VPN & Remote Access Issues</span>
                <span className="font-mono text-[#27374D] font-bold">92% Deflection</span>
              </div>
              <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                <div className="bg-[#27374D] h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#526D82] mb-1 font-semibold">
                <span>Active Directory & SSO Locks</span>
                <span className="font-mono text-[#27374D] font-bold">88% Deflection</span>
              </div>
              <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                <div className="bg-[#526D82] h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#526D82] mb-1 font-semibold">
                <span>SAP Fiori / Password Resets</span>
                <span className="font-mono text-[#27374D] font-bold">85% Deflection</span>
              </div>
              <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                <div className="bg-[#27374D] opacity-80 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* System SLA Compliance */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
            System Level SLA Telemetry
          </h2>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-[#526D82] mb-1 font-semibold">
                <span>GLPI Helpdesk Integration API</span>
                <span className="font-mono text-[#27374D] font-bold">99.98% Uptime</span>
              </div>
              <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                <div className="bg-[#27374D] h-full rounded-full" style={{ width: '99.98%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#526D82] mb-1 font-semibold">
                <span>SAP SolMan Bridge</span>
                <span className="font-mono text-[#27374D] font-bold">99.95% Uptime</span>
              </div>
              <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                <div className="bg-[#526D82] h-full rounded-full" style={{ width: '99.95%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#526D82] mb-1 font-semibold">
                <span>Active Directory LDAP Sync</span>
                <span className="font-mono text-[#27374D] font-bold">100.0% Uptime</span>
              </div>
              <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                <div className="bg-[#27374D] opacity-80 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
