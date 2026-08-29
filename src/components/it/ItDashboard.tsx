import React from 'react';
import {
  Layers,
  Flame,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Activity,
  ChevronRight,
  Sparkles,
  Server,
  CheckCircle2,
  Cpu,
  Database,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

export const ItDashboard: React.FC = () => {
  const { tickets, clusters, masterIncidents, navigateTo, createMasterIncidentFromCluster } =
    useHelpdesk();

  const openTickets = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved');
  const criticalTickets = openTickets.filter(t => t.priority === 'critical' || t.priority === 'high');
  const atRiskTickets = openTickets.filter(t => t.slaRemainingMinutes < 30 || t.slaStatus === 'at_risk');
  const activeCluster = clusters.find(c => c.status === 'active');
  const activeMasters = masterIncidents.filter(m => m.status !== 'resolved');

  // Category counts
  const categoryStats = {
    network: tickets.filter(t => t.category === 'network').length,
    sap: tickets.filter(t => t.category === 'sap').length,
    access: tickets.filter(t => t.category === 'access').length,
    hardware: tickets.filter(t => t.category === 'hardware').length,
    email: tickets.filter(t => t.category === 'email').length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans text-[#27374D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#27374D] tracking-tight">
            IT Service Desk Command Center
          </h1>
          <p className="text-xs text-[#526D82] mt-0.5">
            Unified live telemetry across GLPI, SAP SolMan, and Active Directory.
          </p>
        </div>

        <button
          onClick={() => navigateTo('it-queue')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white font-semibold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <span>Open Ticket Queue</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#9DB2BF]" />
        </button>
      </div>

      {/* Incident Pulse Alert Card (Replaced Pink with Approved Palette Card) */}
      {activeCluster && (
        <div className="p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#DDE6ED] text-[#27374D] border border-[#9DB2BF]/60 shrink-0 mt-0.5">
              <Flame className="w-5 h-5 text-rose-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-700 text-white">
                  P1 / Incident Pulse Spike
                </span>
                <span className="text-xs font-mono font-bold text-[#526D82]">
                  {activeCluster.confidence}% Confidence Match
                </span>
              </div>
              <h2 className="text-sm font-bold text-[#27374D]">
                {activeCluster.title}
              </h2>
              <p className="text-xs text-[#526D82] leading-relaxed max-w-2xl">
                {activeCluster.ticketIds?.length || 0} tickets clustered across {(activeCluster.affectedLocations && activeCluster.affectedLocations.length > 0 ? activeCluster.affectedLocations : [activeCluster.primaryLocation || 'Northern HQ']).join(', ')}. Root cause: <strong className="text-[#27374D] font-semibold">{activeCluster.suspectedRootCause || 'Under investigation'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            <button
              onClick={() => createMasterIncidentFromCluster(activeCluster.id)}
              className="w-full lg:w-auto px-3.5 py-2 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#9DB2BF]" />
              <span>Create Master Incident</span>
            </button>
            <button
              onClick={() => navigateTo('incident-pulse', undefined, undefined, activeCluster.id)}
              className="w-full lg:w-auto px-3.5 py-2 rounded-lg bg-transparent hover:bg-[#DDE6ED]/50 border border-[#526D82] text-[#27374D] text-xs font-semibold transition-colors text-center cursor-pointer"
            >
              Investigate
            </button>
          </div>
        </div>
      )}

      {/* KPI Metrics: 4 Clean Minimal Palette Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Backlog */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#526D82]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Queue</span>
            <Activity className="w-4 h-4 text-[#526D82]" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">{openTickets.length}</p>
          <p className="text-[11px] text-[#526D82]">Backlog items</p>
        </div>

        {/* High & Critical Priority */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#526D82]">
            <span className="text-[11px] font-bold uppercase tracking-wider">High / Critical</span>
            <ShieldAlert className="w-4 h-4 text-rose-700" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">{criticalTickets.length}</p>
          <p className="text-[11px] text-[#526D82]">Priority triage items</p>
        </div>

        {/* SLA At-Risk */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#526D82]">
            <span className="text-[11px] font-bold uppercase tracking-wider">SLA Risk (&lt;30m)</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">{atRiskTickets.length}</p>
          <p className="text-[11px] text-[#526D82]">Near SLA breach</p>
        </div>

        {/* AI Self-Service Deflection */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#526D82]">
            <span className="text-[11px] font-bold uppercase tracking-wider">AI Deflection</span>
            <Sparkles className="w-4 h-4 text-[#526D82]" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">87.4%</p>
          <p className="text-[11px] text-[#526D82]">Self-service resolved</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Priority Triage Queue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
              Priority Triage Queue
            </h2>
            <button
              onClick={() => navigateTo('it-queue')}
              className="text-xs font-semibold text-[#526D82] hover:text-[#27374D] flex items-center gap-1 cursor-pointer"
            >
              <span>View full queue ({tickets.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {openTickets.slice(0, 4).map(ticket => (
              <div
                key={ticket.id}
                onClick={() => navigateTo('it-ticket-detail', ticket.id)}
                className="p-4 rounded-xl bg-white border border-[#9DB2BF] hover:border-[#27374D] shadow-xs transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#DDE6ED] text-[#27374D]">
                      {ticket.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        ticket.priority === 'critical'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : ticket.priority === 'high'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-[#DDE6ED] text-[#27374D]'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    {ticket.isAmbiguous && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                        Ping-Pong Risk
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#27374D] group-hover:text-[#526D82] transition-colors truncate">
                    {ticket.title}
                  </h3>
                  <p className="text-[11px] text-[#526D82]">
                    {ticket.employee.name} • Route: <strong className="text-[#27374D] font-semibold">{ticket.assignedTeam}</strong>
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-0.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DDE6ED] text-xs">
                  <span className="text-[11px] text-[#526D82] font-mono">
                    {ticket.aiConfidence}% match
                  </span>
                  <span className="text-[11px] font-semibold text-[#27374D] font-mono">
                    {ticket.slaRemainingMinutes}m SLA left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Category Distribution & Integration Telemetry */}
        <div className="space-y-6">
          {/* Category Breakdown */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
              Category Distribution
            </h2>

            <div className="p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#526D82] font-semibold">Network & VPN</span>
                  <span className="font-mono text-[#27374D] font-bold">{categoryStats.network}</span>
                </div>
                <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#27374D] h-full rounded-full"
                    style={{ width: `${(categoryStats.network / tickets.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#526D82] font-semibold">SAP / ERP</span>
                  <span className="font-mono text-[#27374D] font-bold">{categoryStats.sap}</span>
                </div>
                <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#526D82] h-full rounded-full"
                    style={{ width: `${(categoryStats.sap / tickets.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#526D82] font-semibold">Access & Identity</span>
                  <span className="font-mono text-[#27374D] font-bold">{categoryStats.access}</span>
                </div>
                <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#27374D] h-full rounded-full opacity-80"
                    style={{ width: `${(categoryStats.access / tickets.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#526D82] font-semibold">Hardware</span>
                  <span className="font-mono text-[#27374D] font-bold">{categoryStats.hardware}</span>
                </div>
                <div className="w-full bg-[#DDE6ED] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#526D82] h-full rounded-full opacity-80"
                    style={{ width: `${(categoryStats.hardware / tickets.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Connected Enterprise Systems Status */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
              Integration Telemetry
            </h2>

            <div className="p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#526D82]" />
                  <span className="font-bold text-[#27374D]">GLPI Core API</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#526D82]" />
                  <span className="font-bold text-[#27374D]">SAP SolMan Gateway</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 99.98% SLA
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#526D82]" />
                  <span className="font-bold text-[#27374D]">Active Directory Kerberos</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
