import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Send,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

export const MasterIncidentsView: React.FC = () => {
  const {
    masterIncidents,
    tickets,
    resolveMasterIncident,
    selectedMasterIncidentId,
    navigateTo,
  } = useHelpdesk();

  const [activeMasterId, setActiveMasterId] = useState<string>(
    selectedMasterIncidentId || masterIncidents[0]?.id || 'MASTER-001'
  );

  const [resolutionInput, setResolutionInput] = useState('');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const master = masterIncidents.find(m => m.id === activeMasterId) || masterIncidents[0];
  const linkedTickets = tickets.filter(t => master?.linkedTicketIds.includes(t.id));

  const handleResolveMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!master || !resolutionInput.trim()) return;
    resolveMasterIncident(master.id, resolutionInput.trim());
    setResolutionInput('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastText('');
    }, 2500);
  };

  if (!master) {
    return (
      <div className="p-8 text-center text-[#526D82]">
        <p>No master incidents declared.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto font-sans text-[#27374D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#DDE6ED] border border-[#9DB2BF] text-[#27374D] text-xs font-semibold mb-1">
            <Layers className="w-3.5 h-3.5 text-[#526D82]" />
            <span>Outage Orchestration Core</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#27374D] tracking-tight">
            Master Incident Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#526D82] mt-0.5">
            Unified resolution propagation, root cause tracking, and employee broadcasts
          </p>
        </div>
      </div>

      {/* Master Incident Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {masterIncidents.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMasterId(m.id)}
            className={`px-3.5 py-2 rounded-lg border text-xs font-semibold shrink-0 transition-colors flex items-center gap-2 cursor-pointer ${
              m.id === activeMasterId
                ? 'bg-[#27374D] text-white border-[#27374D] shadow-xs'
                : 'bg-white text-[#27374D] border-[#9DB2BF] hover:bg-[#DDE6ED]/50'
            }`}
          >
            <span className="font-mono font-bold">{m.id}</span>
            <span>{m.title}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                m.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {m.status.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* Master Incident Details Card */}
      <div className="bg-white border border-[#9DB2BF] rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE6ED] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#27374D] bg-[#DDE6ED] px-2 py-0.5 rounded">
                {master.id}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                master.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {master.status}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#27374D] mt-1.5">{master.title}</h2>
          </div>

          <div className="text-xs text-[#526D82] font-mono">
            Linked Tickets: <strong className="text-[#27374D]">{linkedTickets.length}</strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#526D82] leading-relaxed">
          {master.summary}
        </p>

        {/* Linked Ticket Items */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
            Linked Child Tickets ({linkedTickets.length})
          </h3>
          <div className="space-y-2">
            {linkedTickets.map(t => (
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

        {/* Broadcast Form */}
        <div className="p-4 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF] space-y-3">
          <h3 className="text-xs font-bold text-[#27374D] uppercase tracking-wider flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-[#526D82]" />
            <span>Broadcast Status Update to Affected Employees</span>
          </h3>

          {broadcastSent ? (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Status broadcast successfully dispatched to all {linkedTickets.length} affected users via SMS / Teams / Email.</span>
            </div>
          ) : (
            <form onSubmit={handleSendBroadcast} className="flex gap-2">
              <input
                type="text"
                value={broadcastText}
                onChange={e => setBroadcastText(e.target.value)}
                placeholder="e.g. Engineers have identified gateway failure. Recovery estimated in 30 mins..."
                className="flex-1 p-2.5 rounded-lg bg-white border border-[#9DB2BF] text-xs text-[#27374D] placeholder-[#526D82]/60 focus:outline-none focus:border-[#27374D]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Send Broadcast
              </button>
            </form>
          )}
        </div>

        {/* Master Resolution Form */}
        {master.status !== 'resolved' && (
          <div className="p-4 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF] space-y-3">
            <h3 className="text-xs font-bold text-[#27374D] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#526D82]" />
              <span>Propagate Resolution Across All {linkedTickets.length} Linked Tickets</span>
            </h3>

            <form onSubmit={handleResolveMaster} className="space-y-3">
              <textarea
                rows={3}
                value={resolutionInput}
                onChange={e => setResolutionInput(e.target.value)}
                placeholder="Describe root cause and resolution details (e.g. Replaced faulty fiber transceiver module on Router R-04)..."
                className="w-full p-3 rounded-lg bg-white border border-[#9DB2BF] text-xs text-[#27374D] placeholder-[#526D82]/60 focus:outline-none focus:border-[#27374D]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Resolve Master & Propagate All Child Tickets
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
