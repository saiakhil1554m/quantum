import React, { useState } from 'react';
import {
  Flame,
  Layers,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

export const IncidentPulseView: React.FC = () => {
  const {
    clusters,
    tickets,
    createMasterIncidentFromCluster,
    demoSimulateIncidentSpike,
    navigateTo,
    selectedClusterId,
  } = useHelpdesk();

  const [activeTabClusterId, setActiveTabClusterId] = useState<string>(
    selectedClusterId || clusters[0]?.id || 'CLUSTER-NET-01'
  );

  const selectedCluster = clusters.find(c => c.id === activeTabClusterId) || clusters[0];
  const clusterTickets = tickets.filter(t => selectedCluster?.ticketIds.includes(t.id));

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto font-sans text-[#27374D]">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#DDE6ED] border border-[#9DB2BF] text-[#27374D] text-xs font-semibold mb-1">
            <Flame className="w-3.5 h-3.5 text-rose-700" />
            <span>Autonomous Correlation Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#27374D] tracking-tight">Incident Pulse Radar</h1>
          <p className="text-xs sm:text-sm text-[#526D82] mt-0.5">
            Real-time clustering of incoming tickets across time windows, services, and substations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={demoSimulateIncidentSpike}
            className="px-3.5 py-2 rounded-lg bg-[#526D82] hover:bg-[#27374D] text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#9DB2BF]" />
            <span>Simulate Incoming Surge</span>
          </button>
        </div>
      </div>

      {/* Real-Time Pulse Cluster Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clusters.map(cluster => {
          const isSelected = cluster.id === activeTabClusterId;
          return (
            <div
              key={cluster.id}
              onClick={() => setActiveTabClusterId(cluster.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-white border-[#27374D] ring-2 ring-[#27374D]/20'
                  : 'bg-white border-[#9DB2BF] hover:border-[#526D82]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#DDE6ED] text-[#27374D]">
                    {cluster.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      cluster.status === 'active'
                        ? 'bg-rose-700 text-white'
                        : 'bg-[#DDE6ED] text-[#27374D] border border-[#9DB2BF]'
                    }`}
                  >
                    {cluster.status === 'active' ? 'Active Spike' : 'Master Created'}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-[#526D82]">
                  {cluster.confidence}% Confidence
                </span>
              </div>

              <h2 className="text-base font-bold text-[#27374D] mb-1">{cluster.title}</h2>
              <p className="text-xs text-[#526D82] line-clamp-2 leading-relaxed">
                {cluster.summary}
              </p>

              <div className="mt-3.5 pt-3 border-t border-[#DDE6ED] flex items-center justify-between text-xs text-[#526D82]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-[#526D82]" /> {cluster.ticketIds.length} Tickets
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#526D82]" /> {cluster.primaryLocation}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#526D82]">{cluster.windowMinutes}m Window</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Cluster Card */}
      {selectedCluster && (
        <div className="bg-white border border-[#9DB2BF] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE6ED] pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#526D82] uppercase tracking-wider">
                Selected Incident Cluster Detail
              </span>
              <h2 className="text-lg font-bold text-[#27374D] mt-0.5">{selectedCluster.title}</h2>
            </div>

            <button
              onClick={() => createMasterIncidentFromCluster(selectedCluster.id)}
              className="px-4 py-2 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Layers className="w-3.5 h-3.5 text-[#9DB2BF]" />
              <span>Create Master Incident</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]/60">
              <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Suspected Root Cause</span>
              <p className="font-bold text-[#27374D] mt-1">{selectedCluster.suspectedRootCause || 'Under Investigation'}</p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]/60">
              <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Primary Location</span>
              <p className="font-bold text-[#27374D] mt-1">{selectedCluster.primaryLocation}</p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]/60">
              <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Clustered Tickets</span>
              <p className="font-bold text-[#27374D] mt-1 font-mono">{selectedCluster.ticketIds.length} Total Tickets</p>
            </div>
          </div>

          {/* Clustered Tickets List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
              Correlated Tickets ({clusterTickets.length})
            </h3>

            <div className="space-y-2">
              {clusterTickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => navigateTo('it-ticket-detail', t.id)}
                  className="p-3.5 rounded-lg bg-white border border-[#9DB2BF] hover:border-[#27374D] flex items-center justify-between gap-3 cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#DDE6ED] text-[#27374D]">
                      {t.id}
                    </span>
                    <span className="text-xs font-bold text-[#27374D] truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-[#526D82]">
                    <span>{t.employee.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#526D82]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
