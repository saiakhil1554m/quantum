import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Layers,
  Send,
  Activity,
  CheckCheck,
  Laptop,
  Cpu,
  HelpCircle,
  Wrench,
  Monitor,
  HardDrive,
  Edit3,
  X,
  Search,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { useAuth } from '../../context/AuthContext';
import { ProblemType } from '../../types';

export const ItTicketDetail: React.FC = () => {
  const {
    selectedTicketId,
    tickets,
    updateTicketStatus,
    updateTicketProblemType,
    assignTicket,
    addInternalNote,
    applyResolution,
    linkTicketToMaster,
    masterIncidents,
    navigateTo,
  } = useHelpdesk();

  const { currentUser } = useAuth();

  const ticket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const [noteInput, setNoteInput] = useState('');
  const [resolutionInput, setResolutionInput] = useState(
    ticket?.suggestedResolution?.steps?.join('\n') || ticket?.suggestedResolution?.text || ''
  );

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showProblemTypeModal, setShowProblemTypeModal] = useState(false);
  const [newProblemType, setNewProblemType] = useState<string>(ticket?.problemType || 'software');
  const [reclassifyReason, setReclassifyReason] = useState('');

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignTeam, setReassignTeam] = useState('Network Support');
  const [reassignReason, setReassignReason] = useState('');

  const [showLinkMasterModal, setShowLinkMasterModal] = useState(false);
  const [selectedMasterToLink, setSelectedMasterToLink] = useState(masterIncidents[0]?.id || '');
  const [masterSearchQuery, setMasterSearchQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (ticket?.suggestedResolution) {
      setResolutionInput(
        ticket.suggestedResolution.steps?.join('\n') || ticket.suggestedResolution.text || ''
      );
    } else {
      setResolutionInput(ticket?.resolutionNotes || '');
    }
  }, [ticket?.id]);

  if (!ticket) {
    return (
      <div className="p-8 text-center text-[#526D82]">
        <p>Ticket not found</p>
        <button
          onClick={() => navigateTo('it-queue')}
          className="mt-4 px-4 py-2 rounded-lg bg-[#27374D] text-white font-semibold text-xs shadow-xs"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  const isHw = (ticket.problemType || 'software') === 'hardware';
  const isInvestigating = ticket.status === 'in_progress';
  const isLinkedToMaster = !!ticket.masterIncidentId;

  // 1. ACTION 1: Change Problem Type Handler
  const handleSaveProblemType = (e: React.FormEvent) => {
    e.preventDefault();
    const mappedType: ProblemType =
      newProblemType === 'hardware' ? 'hardware' : 'software';

    updateTicketProblemType(ticket.id, mappedType, reclassifyReason || `Problem type updated to ${newProblemType}`);
    setShowProblemTypeModal(false);
    setReclassifyReason('');
    showToast(`Problem type updated to ${newProblemType.replace('_', ' ').toUpperCase()}`);
  };

  // 2. ACTION 2: Reassign Team Handler
  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignTeam) return;

    assignTicket(ticket.id, reassignTeam, undefined, reassignReason || 'Queue reassigned by IT Support');
    setShowReassignModal(false);
    setReassignReason('');
    showToast(`Ticket reassigned to ${reassignTeam}.`);
  };

  // 3. ACTION 3: Link to Master Incident Handler
  const handleLinkToMasterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMasterToLink) return;

    if (ticket.masterIncidentId === selectedMasterToLink) {
      showToast(`Ticket is already linked to ${selectedMasterToLink}.`);
      setShowLinkMasterModal(false);
      return;
    }

    linkTicketToMaster(ticket.id, selectedMasterToLink);
    setShowLinkMasterModal(false);
    showToast(`Ticket ${ticket.id} linked to Master Incident ${selectedMasterToLink}.`);
  };

  // 4. ACTION 4: Start Investigation Handler
  const handleStartInvestigation = () => {
    if (isInvestigating) return;

    updateTicketStatus(
      ticket.id,
      'in_progress',
      `Investigation started by ${currentUser?.name || 'IT Support'} (${currentUser?.employeeId || 'IT001'})`
    );
    showToast(`Investigation started by ${currentUser?.name || 'IT Support'}.`);
  };

  const handleApplyResolution = () => {
    if (!resolutionInput.trim()) return;
    applyResolution(ticket.id, resolutionInput.trim());
    showToast(`Resolution applied and ticket ${ticket.id} marked as Resolved.`);
  };

  const filteredMasterIncidents = masterIncidents.filter(m =>
    m.id.toLowerCase().includes(masterSearchQuery.toLowerCase()) ||
    m.title.toLowerCase().includes(masterSearchQuery.toLowerCase()) ||
    m.summary.toLowerCase().includes(masterSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-20 font-sans text-[#27374D]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#27374D] text-white shadow-xl border border-[#9DB2BF] flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('it-queue')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#526D82] hover:text-[#27374D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#526D82]" />
          <span>Back to Smart Queue</span>
        </button>

        {/* 4 Top Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Button 1: Change Problem Type */}
          <button
            onClick={() => {
              setNewProblemType(ticket.problemType || 'software');
              setShowProblemTypeModal(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#9DB2BF] hover:border-[#27374D] text-[#27374D] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#526D82]" />
            <span>Change Problem Type</span>
          </button>

          {/* Button 2: Reassign Team */}
          <button
            onClick={() => {
              setReassignTeam(ticket.assignedTeam || 'Network Support');
              setShowReassignModal(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#9DB2BF] hover:border-[#27374D] text-[#27374D] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#526D82]" />
            <span>Reassign Team</span>
          </button>

          {/* Button 3: Link to Master Incident */}
          <button
            onClick={() => setShowLinkMasterModal(true)}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#9DB2BF] hover:border-[#27374D] text-[#27374D] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#526D82]" />
            <span>{isLinkedToMaster ? `Linked (${ticket.masterIncidentId})` : 'Link to Master Incident'}</span>
          </button>

          {/* Button 4: Start Investigation */}
          {ticket.status !== 'resolved' && (
            <button
              onClick={handleStartInvestigation}
              disabled={isInvestigating}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 ${
                isInvestigating
                  ? 'bg-emerald-700 text-white cursor-not-allowed opacity-90'
                  : 'bg-[#27374D] hover:bg-[#1e2b3c] text-white cursor-pointer'
              }`}
            >
              {isInvestigating ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Investigation in Progress</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 text-[#9DB2BF]" />
                  <span>Start Investigation</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Details & Right AI Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Main Ticket Dossier */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#DDE6ED] text-[#27374D]">
                    {ticket.id}
                  </span>

                  {/* Problem Type Badge */}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded bg-[#DDE6ED] border border-[#9DB2BF] text-[#27374D]">
                    {isHw ? <Cpu className="w-3.5 h-3.5 text-[#526D82]" /> : <Laptop className="w-3.5 h-3.5 text-[#526D82]" />}
                    <span>{isHw ? 'Hardware Issue' : 'Software Issue'}</span>
                  </span>

                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                      ticket.priority === 'critical'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : ticket.priority === 'high'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-[#DDE6ED] text-[#27374D]'
                    }`}
                  >
                    {ticket.priority} Priority ({ticket.priorityScore}/100)
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#27374D] text-white capitalize">
                    {ticket.status.replace('_', ' ')}
                  </span>

                  {isLinkedToMaster && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#DDE6ED] text-[#27374D] border border-[#9DB2BF]">
                      Linked: {ticket.masterIncidentId}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-[#27374D] tracking-tight">{ticket.title}</h1>
              </div>

              {/* SLA Countdown pill */}
              <div className="p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF] text-right shrink-0">
                <div className="text-[11px] text-[#526D82] font-semibold">Unified SLA Target</div>
                <div
                  className={`text-base font-bold font-mono ${
                    ticket.status === 'resolved'
                      ? 'text-emerald-700'
                      : ticket.slaRemainingMinutes < 15
                      ? 'text-rose-700'
                      : 'text-[#27374D]'
                  }`}
                >
                  {ticket.status === 'resolved' ? 'Met' : `${ticket.slaRemainingMinutes}m left`}
                </div>
              </div>
            </div>

            {/* Investigator Badge if Active */}
            {isInvestigating && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Active Investigator: <strong>{currentUser?.name || 'Rahul Kumar'}</strong> (Started investigation session)</span>
              </div>
            )}

            {/* Description */}
            <div className="p-4 rounded-lg bg-[#DDE6ED]/30 border border-[#9DB2BF] space-y-1">
              <span className="text-[11px] font-bold text-[#526D82] uppercase tracking-wider">
                Employee Report
              </span>
              <p className="text-xs sm:text-sm text-[#27374D] leading-relaxed">
                {ticket.description}
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-[#526D82] border-t border-[#9DB2BF]/40 mt-2">
                <span>
                  Requester: <strong className="text-[#27374D] font-bold">{ticket.employee.name}</strong> (
                  {ticket.employee.department})
                </span>
                <span>•</span>
                <span>
                  Location: <strong className="text-[#27374D] font-bold">{ticket.employee.location}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
              Activity & Timeline History
            </h2>

            <div className="space-y-3">
              {ticket.timeline.map((ev, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#27374D]">{ev.title}</span>
                    <span className="font-mono text-[10px] text-[#526D82]">{ev.timestamp}</span>
                  </div>
                  <p className="text-[#526D82]">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SLA & Resolution Plan Execution */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#27374D] uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#526D82]" />
              <span>Resolution Plan & Action Execution</span>
            </h2>

            <div className="space-y-3">
              <textarea
                rows={4}
                value={resolutionInput}
                onChange={e => setResolutionInput(e.target.value)}
                placeholder="Enter resolution notes or SOP steps executed..."
                className="w-full p-3 rounded-lg bg-[#DDE6ED]/30 border border-[#9DB2BF] text-xs text-[#27374D] focus:border-[#27374D] focus:bg-white focus:outline-none transition-all placeholder:text-[#526D82]/60"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleApplyResolution}
                  className="px-4 py-2 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Apply & Resolve Ticket</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Sentinel Workbench */}
        <div className="space-y-5">
          <div className="p-5 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#DDE6ED]">
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#9DB2BF]">
                <img src="/assets/ai-robot.jpg" alt="AI Sentinel" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#27374D]">AI Triage Breakdown</h3>
                <span className="text-[10px] font-mono text-[#526D82]">Google Gemini AI Evaluation</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Category</span>
                  <p className="font-bold text-[#27374D] mt-0.5 capitalize">{ticket.category.replace('_', ' ')}</p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-white text-[#27374D] border border-[#9DB2BF]/60">
                  {ticket.aiConfidence || ticket.routingConfidence || 92}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]">
                  <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Difficulty</span>
                  <div className="mt-0.5">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                      ticket.aiDifficulty === 'HARD' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      ticket.aiDifficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {ticket.aiDifficulty || (ticket.priority === 'critical' ? 'HARD' : ticket.priority === 'high' ? 'MEDIUM' : 'EASY')}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]">
                  <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Priority</span>
                  <p className="font-bold text-[#27374D] mt-0.5 capitalize">{ticket.priority}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF]">
                <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Assigned Team</span>
                <p className="font-bold text-[#27374D] mt-0.5">{ticket.assignedTeam}</p>
              </div>

              {ticket.aiSummary && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono text-slate-700 uppercase font-bold">AI Technical Summary</span>
                  <p className="text-[11px] text-[#27374D] leading-relaxed font-medium">{ticket.aiSummary}</p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF] space-y-1">
                <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Technical Reasoning</span>
                <p className="text-[11px] text-[#526D82] leading-relaxed">{ticket.aiReasoning}</p>
              </div>

              {ticket.suggestedResolution && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold">Suggested Resolution</span>
                  <p className="text-[11px] text-emerald-950 leading-relaxed font-medium">
                    {typeof ticket.suggestedResolution === 'string' ? ticket.suggestedResolution : ticket.suggestedResolution.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: CHANGE PROBLEM TYPE MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showProblemTypeModal && (
        <div className="fixed inset-0 z-50 bg-[#27374D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#9DB2BF] shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DDE6ED] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#27374D]" />
                <h3 className="text-sm font-bold text-[#27374D]">Change Problem Type</h3>
              </div>
              <button
                onClick={() => setShowProblemTypeModal(false)}
                className="text-[#526D82] hover:text-[#27374D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProblemType} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#526D82]">Select Problem Classification</label>
                <div className="space-y-2">
                  {[
                    { id: 'software', label: 'Software Issue', icon: Laptop },
                    { id: 'hardware', label: 'Hardware Issue', icon: Cpu },
                    { id: 'network', label: 'Network / VPN', icon: Activity },
                    { id: 'access', label: 'Access / Identity', icon: UserCheck },
                    { id: 'other', label: 'Other / General Inquiry', icon: HelpCircle },
                  ].map(opt => {
                    const Icon = opt.icon;
                    const isSelected = newProblemType === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setNewProblemType(opt.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#27374D] text-white border-[#27374D]'
                            : 'bg-white text-[#27374D] border-[#9DB2BF] hover:bg-[#DDE6ED]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{opt.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#526D82]">Reason for Reclassification (Optional)</label>
                <textarea
                  rows={2}
                  value={reclassifyReason}
                  onChange={e => setReclassifyReason(e.target.value)}
                  placeholder="e.g. Telemetry confirms SFP physical transceiver failure rather than software VPN drop..."
                  className="w-full p-2.5 text-xs bg-[#DDE6ED]/40 border border-[#9DB2BF] rounded-lg text-[#27374D] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DDE6ED]">
                <button
                  type="button"
                  onClick={() => setShowProblemTypeModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#DDE6ED] text-[#27374D] text-xs font-semibold hover:bg-[#9DB2BF]/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: REASSIGN TEAM MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 bg-[#27374D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#9DB2BF] shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DDE6ED] pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#27374D]" />
                <h3 className="text-sm font-bold text-[#27374D]">Reassign IT Support Team</h3>
              </div>
              <button
                onClick={() => setShowReassignModal(false)}
                className="text-[#526D82] hover:text-[#27374D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReassignSubmit} className="space-y-4">
              <div className="p-2.5 rounded-lg bg-[#DDE6ED]/50 border border-[#9DB2BF] text-xs">
                <span className="text-[#526D82] font-semibold">Currently Assigned Queue: </span>
                <strong className="text-[#27374D]">{ticket.assignedTeam}</strong>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#526D82]">Select Target Engineering Team</label>
                <div className="space-y-2">
                  {[
                    'Network Support',
                    'Hardware & Infrastructure Ops',
                    'SAP Core Team',
                    'Access & Identity Ops',
                    'Security Operations (SOC)',
                  ].map(team => (
                    <div
                      key={team}
                      onClick={() => setReassignTeam(team)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        reassignTeam === team
                          ? 'bg-[#27374D] text-white border-[#27374D]'
                          : 'bg-white text-[#27374D] border-[#9DB2BF] hover:bg-[#DDE6ED]/40'
                      }`}
                    >
                      <span className="text-xs font-bold">{team}</span>
                      {reassignTeam === team && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#526D82]">Reassignment Reason</label>
                <textarea
                  rows={2}
                  value={reassignReason}
                  onChange={e => setReassignReason(e.target.value)}
                  placeholder="e.g. Routed to Network Engineering for gateway SSL handshake audit..."
                  className="w-full p-2.5 text-xs bg-[#DDE6ED]/40 border border-[#9DB2BF] rounded-lg text-[#27374D] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DDE6ED]">
                <button
                  type="button"
                  onClick={() => setShowReassignModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#DDE6ED] text-[#27374D] text-xs font-semibold hover:bg-[#9DB2BF]/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold cursor-pointer"
                >
                  Reassign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: LINK TO MASTER INCIDENT MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showLinkMasterModal && (
        <div className="fixed inset-0 z-50 bg-[#27374D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#9DB2BF] shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DDE6ED] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#27374D]" />
                <h3 className="text-sm font-bold text-[#27374D]">Link to Master Incident</h3>
              </div>
              <button
                onClick={() => setShowLinkMasterModal(false)}
                className="text-[#526D82] hover:text-[#27374D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLinkToMasterSubmit} className="space-y-4">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#526D82]" />
                <input
                  type="text"
                  value={masterSearchQuery}
                  onChange={e => setMasterSearchQuery(e.target.value)}
                  placeholder="Filter master incidents..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#DDE6ED]/40 border border-[#9DB2BF] rounded-lg text-[#27374D] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {filteredMasterIncidents.map(m => {
                  const isSelected = selectedMasterToLink === m.id;
                  const isAlreadyLinked = ticket.masterIncidentId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMasterToLink(m.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#27374D] text-white border-[#27374D]'
                          : 'bg-white text-[#27374D] border-[#9DB2BF] hover:bg-[#DDE6ED]/40'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-[#27374D]'}`}>
                            {m.id}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            m.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className={`text-xs font-semibold ${isSelected ? 'text-[#DDE6ED]' : 'text-[#27374D]'}`}>
                          {m.title}
                        </p>
                        <p className={`text-[10px] ${isSelected ? 'text-[#9DB2BF]' : 'text-[#526D82]'}`}>
                          {m.linkedTicketIds.length} Linked Tickets
                        </p>
                      </div>

                      {isAlreadyLinked && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Linked
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DDE6ED]">
                <button
                  type="button"
                  onClick={() => setShowLinkMasterModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#DDE6ED] text-[#27374D] text-xs font-semibold hover:bg-[#9DB2BF]/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold cursor-pointer"
                >
                  Link Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
