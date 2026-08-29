import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  PlusCircle,
  Ticket,
  Bot,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Wrench,
  KeyRound,
  Laptop,
  Globe,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { UnifiedTicket } from '../../types';

interface EmployeeHomeProps {
  onStartIntakeWithPrompt?: (prompt: string, presetId?: string) => void;
}

export const EmployeeHome: React.FC<EmployeeHomeProps> = ({ onStartIntakeWithPrompt }) => {
  const { currentUser, tickets, clusters, navigateTo } = useHelpdesk();
  const [problemInput, setProblemInput] = useState('');

  // Filter tickets for current employee
  const userTickets = tickets.filter(t => t.employee.id === currentUser.id);
  const openCount = userTickets.filter(t => t.status === 'new' || t.status === 'ai_analyzing').length;
  const inProgressCount = userTickets.filter(t => t.status === 'in_progress' || t.status === 'waiting_employee' || t.status === 'escalated').length;
  const resolvedCount = userTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const criticalCount = userTickets.filter(t => t.priority === 'critical' && (t.status !== 'resolved' && t.status !== 'closed')).length;

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemInput.trim()) return;
    if (onStartIntakeWithPrompt) {
      onStartIntakeWithPrompt(problemInput.trim());
    } else {
      navigateTo('get-help');
    }
  };

  const handleActionClick = (action: 'create' | 'track' | 'ai' | 'kb', prompt?: string) => {
    if (action === 'create') {
      if (prompt && onStartIntakeWithPrompt) {
        onStartIntakeWithPrompt(prompt);
      } else {
        navigateTo('get-help');
      }
    } else if (action === 'track') {
      navigateTo('my-tickets');
    } else if (action === 'ai') {
      const fab = document.getElementById('chatbot-fab');
      if (fab) fab.click();
      else navigateTo('get-help');
    } else if (action === 'kb') {
      navigateTo('kb');
    }
  };

  // Helper for priority badges
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold badge-p1">P1 Critical</span>;
      case 'high':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold badge-p2">P2 High</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold badge-p3">P3 Medium</span>;
      case 'low':
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium badge-p4">P4 Low</span>;
    }
  };

  // Helper for status formatting
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved
          </span>
        );
      case 'in_progress':
      case 'escalated':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#27374D] bg-[#9DB2BF]/20 border border-[#9DB2BF]/60 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-[#526D82]" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#526D82] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            Open
          </span>
        );
    }
  };

  const firstName = currentUser?.name?.split(' ')[0] || 'Employee';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* 1. WELCOME SECTION */}
      <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#526D82]/20 shrink-0">
            <img src="/assets/ai-robot.jpg" alt="AI Agent" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#27374D]">Welcome back, {firstName}</h1>
              <span className="text-[10px] font-mono font-semibold bg-[#27374D] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                POWERGRID Enterprise
              </span>
            </div>
            <p className="text-xs text-[#526D82] mt-0.5">
              Employee ID: <span className="font-mono text-[#27374D] font-medium">{currentUser.employeeId || 'PG-78401'}</span> • Department: <span className="font-medium text-[#27374D]">{currentUser.department || 'Operations'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#526D82] bg-[#DDE6ED]/60 border border-[#9DB2BF]/50 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero-Trust Enterprise Protocol Active</span>
          </span>
        </div>
      </div>

      {/* 2. LARGE AI HELP ASSISTANT / SEARCH BAR */}
      <div className="bg-[#27374D] rounded-xl p-6 sm:p-7 text-white shadow-md space-y-4">
        <div className="max-w-2xl space-y-1">
          <span className="text-[11px] font-mono font-semibold text-[#9DB2BF] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#9DB2BF]" />
            AI Service Assistant
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            How can we help you today?
          </h2>
          <p className="text-xs text-[#DDE6ED]/80">
            Search for instant autonomous resolution or describe your issue for smart triage.
          </p>
        </div>

        <form onSubmit={handleSubmitSearch} className="relative max-w-3xl">
          <div className="flex items-center bg-white rounded-lg p-1.5 shadow-sm border border-[#9DB2BF] focus-within:ring-2 focus-within:ring-[#9DB2BF]">
            <div className="flex items-center pl-3 flex-1 min-w-0">
              <Search className="w-4 h-4 text-[#526D82] shrink-0" />
              <input
                type="text"
                value={problemInput}
                onChange={e => setProblemInput(e.target.value)}
                placeholder="Describe your issue (e.g., VPN disconnected, SAP password reset, PRANIT access)..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-[#27374D] placeholder-[#526D82]/60 bg-transparent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!problemInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#27374D] hover:bg-[#1e2b3c] disabled:opacity-40 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0"
            >
              <span>Diagnose</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Quick prompt chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] text-[#9DB2BF]">Common issues:</span>
          {[
            { label: 'VPN Connection', prompt: 'My VPN is not connecting.' },
            { label: 'SAP Login Reset', prompt: 'SAP Fiori login password reset' },
            { label: 'PRANIT Access', prompt: 'PRANIT e-tendering portal DSC error' },
            { label: 'Hardware Support', prompt: 'Workstation screen or charger not working' },
          ].map(chip => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleActionClick('create', chip.prompt)}
              className="text-[11px] px-2.5 py-1 rounded bg-[#526D82]/40 hover:bg-[#526D82]/60 text-[#DDE6ED] transition-colors cursor-pointer border border-[#9DB2BF]/30"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. TICKET STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open */}
        <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#526D82]">
            <span className="text-xs font-semibold uppercase tracking-wider">Open Tickets</span>
            <Ticket className="w-4 h-4 text-[#526D82]" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">{openCount}</p>
          <p className="text-[11px] text-[#526D82]">Awaiting initial triage</p>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#526D82]">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-[#526D82]" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">{inProgressCount}</p>
          <p className="text-[11px] text-[#526D82]">Assigned to tech team</p>
        </div>

        {/* Resolved */}
        <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#526D82]">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#27374D] font-mono">{resolvedCount}</p>
          <p className="text-[11px] text-emerald-700">Completed & closed</p>
        </div>

        {/* Critical */}
        <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#526D82]">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical (P1)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-700 font-mono">{criticalCount}</p>
          <p className="text-[11px] text-rose-600">Requires 1-hr priority SLA</p>
        </div>
      </div>

      {/* 4. QUICK ACTION CARDS */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#526D82] uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Create Ticket */}
          <button
            type="button"
            onClick={() => handleActionClick('create')}
            className="p-4 bg-white border border-[#9DB2BF]/60 hover:border-[#27374D] rounded-xl text-left transition-all cursor-pointer shadow-xs group flex flex-col justify-between space-y-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#27374D] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#27374D]">Create Ticket</h4>
              <p className="text-[11px] text-[#526D82] mt-0.5">Submit technical issue for routing</p>
            </div>
          </button>

          {/* Action 2: Track Ticket */}
          <button
            type="button"
            onClick={() => handleActionClick('track')}
            className="p-4 bg-white border border-[#9DB2BF]/60 hover:border-[#27374D] rounded-xl text-left transition-all cursor-pointer shadow-xs group flex flex-col justify-between space-y-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#526D82] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#27374D]">Track Ticket</h4>
              <p className="text-[11px] text-[#526D82] mt-0.5">View live pipeline & SLA timers</p>
            </div>
          </button>

          {/* Action 3: AI Troubleshooting */}
          <button
            type="button"
            onClick={() => handleActionClick('ai')}
            className="p-4 bg-white border border-[#9DB2BF]/60 hover:border-[#27374D] rounded-xl text-left transition-all cursor-pointer shadow-xs group flex flex-col justify-between space-y-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#27374D] text-[#9DB2BF] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#27374D]">AI Troubleshooting</h4>
              <p className="text-[11px] text-[#526D82] mt-0.5">Instant self-service diagnostics</p>
            </div>
          </button>

          {/* Action 4: Knowledge Base */}
          <button
            type="button"
            onClick={() => handleActionClick('kb')}
            className="p-4 bg-white border border-[#9DB2BF]/60 hover:border-[#27374D] rounded-xl text-left transition-all cursor-pointer shadow-xs group flex flex-col justify-between space-y-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#526D82] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#27374D]">Knowledge Base</h4>
              <p className="text-[11px] text-[#526D82] mt-0.5">Resolved SOPs & root causes</p>
            </div>
          </button>
        </div>
      </div>

      {/* 5. RECENT TICKETS TABLE */}
      <div className="bg-white border border-[#9DB2BF]/60 rounded-xl overflow-hidden shadow-xs space-y-0">
        <div className="p-4 bg-slate-50 border-b border-[#DDE6ED] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#27374D]" />
            <h3 className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
              Recent Support Tickets
            </h3>
          </div>
          <button
            onClick={() => navigateTo('my-tickets')}
            className="text-xs font-semibold text-[#526D82] hover:text-[#27374D] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({userTickets.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {userTickets.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-[#27374D]">No active requests</p>
            <p className="text-xs text-[#526D82]">You currently have no open IT support tickets.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#DDE6ED]/50 text-[#526D82] font-mono text-[10px] uppercase border-b border-[#DDE6ED]">
                <tr>
                  <th className="py-2.5 px-4">Ticket ID</th>
                  <th className="py-2.5 px-4">Issue Description</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE6ED]">
                {userTickets.slice(0, 5).map(ticket => (
                  <tr key={ticket.id} className="pg-table-row">
                    <td className="py-3 px-4 font-mono font-bold text-[#27374D]">
                      {ticket.id}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#27374D] truncate max-w-xs">{ticket.title}</p>
                      <p className="text-[11px] text-[#526D82] line-clamp-1">{ticket.description}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#526D82] capitalize">
                      {ticket.problemType || 'software'}
                    </td>
                    <td className="py-3 px-4">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigateTo('ticket-detail', ticket.id)}
                        className="text-[11px] font-semibold text-[#27374D] hover:text-[#526D82] underline cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. AI-RECOMMENDED SOLUTIONS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#526D82] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#27374D]" />
            AI-Recommended Solutions & SOPs
          </h3>
          <button
            onClick={() => navigateTo('kb')}
            className="text-xs font-semibold text-[#526D82] hover:text-[#27374D] transition-colors cursor-pointer"
          >
            Browse All Playbooks →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Solution 1 */}
          <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#27374D] bg-[#DDE6ED] px-2 py-0.5 rounded">
                SAP Enterprise
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Zero-Wait AI</span>
            </div>
            <h4 className="text-xs font-bold text-[#27374D]">SAP Login & Password Reset</h4>
            <p className="text-[11px] text-[#526D82] leading-relaxed">
              Self-service unlock for SAP Fiori Launchpad and SAP GUI 7.70+ session lockouts.
            </p>
            <button
              onClick={() => handleActionClick('create', 'SAP Fiori login password reset')}
              className="w-full py-1.5 bg-[#DDE6ED] hover:bg-[#9DB2BF]/40 text-[#27374D] text-[11px] font-bold rounded text-center transition-colors cursor-pointer"
            >
              Run SAP Diagnostic
            </button>
          </div>

          {/* Solution 2 */}
          <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#27374D] bg-[#DDE6ED] px-2 py-0.5 rounded">
                e-Tendering
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Zero-Wait AI</span>
            </div>
            <h4 className="text-xs font-bold text-[#27374D]">PRANIT Portal DSC Fix</h4>
            <p className="text-[11px] text-[#526D82] leading-relaxed">
              Configure Edge Internet Explorer Mode for Digital Signature Token signing.
            </p>
            <button
              onClick={() => handleActionClick('create', 'PRANIT e-tendering portal DSC error')}
              className="w-full py-1.5 bg-[#DDE6ED] hover:bg-[#9DB2BF]/40 text-[#27374D] text-[11px] font-bold rounded text-center transition-colors cursor-pointer"
            >
              Run PRANIT Diagnostic
            </button>
          </div>

          {/* Solution 3 */}
          <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#27374D] bg-[#DDE6ED] px-2 py-0.5 rounded">
                Networking
              </span>
              <span className="text-[10px] text-[#526D82] font-semibold">Self-Service</span>
            </div>
            <h4 className="text-xs font-bold text-[#27374D]">VPN Tunnel Re-Sync</h4>
            <p className="text-[11px] text-[#526D82] leading-relaxed">
              Resolve Cisco AnyConnect gateway authentication timeouts after credential changes.
            </p>
            <button
              onClick={() => handleActionClick('create', 'My VPN is not connecting.')}
              className="w-full py-1.5 bg-[#DDE6ED] hover:bg-[#9DB2BF]/40 text-[#27374D] text-[11px] font-bold rounded text-center transition-colors cursor-pointer"
            >
              Run VPN Diagnostic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
