import React, { useState } from 'react';
import {
  ListTodo,
  Search,
  AlertTriangle,
  Clock,
  ChevronRight,
  Copy,
  Flame,
  Laptop,
  Cpu,
  HelpCircle,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { UnifiedTicket, ProblemType } from '../../types';

// 3-Tier Difficulty Rank Classification:
// 1. Hard / Critical → Highest Priority (Critical system/SCADA/network failure) 🔴
// 2. Medium / High → Second Priority (VPN sync, Software glitch, Email/access) 🟠
// 3. Easy / Low → Third Priority (Password reset, Routine request, General query) 🟢
export const getTicketDifficultyTier = (t: UnifiedTicket): {
  tier: 1 | 2 | 3;
  label: string;
  badgeClass: string;
  dotColor: string;
} => {
  const p = t.priority;
  const score = t.priorityScore || 50;

  if (p === 'critical' || score >= 90) {
    return {
      tier: 1,
      label: 'Hard / Critical',
      badgeClass: 'bg-rose-50 text-rose-800 border border-rose-200 font-bold',
      dotColor: '🔴',
    };
  }

  if (p === 'high' || p === 'medium' || (score >= 50 && score < 90)) {
    return {
      tier: 2,
      label: 'Medium / High',
      badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold',
      dotColor: '🟠',
    };
  }

  return {
    tier: 3,
    label: 'Easy / Low',
    badgeClass: 'bg-[#DDE6ED] text-[#27374D] border border-[#9DB2BF]/60 font-medium',
    dotColor: '🟢',
  };
};

export const ItTicketQueue: React.FC = () => {
  const { tickets, navigateTo } = useHelpdesk();

  const [search, setSearch] = useState('');
  const [problemTypeFilter, setProblemTypeFilter] = useState<'all' | 'software' | 'hardware'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('open');
  const [activeFilterPill, setActiveFilterPill] = useState<'all' | 'hardware' | 'software' | 'sla_risk' | 'ping_pong' | 'critical'>('all');

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.employee.name.toLowerCase().includes(search.toLowerCase()) ||
      t.service.toLowerCase().includes(search.toLowerCase()) ||
      (t.deviceDetails && t.deviceDetails.toLowerCase().includes(search.toLowerCase())) ||
      (t.softwareDetails && t.softwareDetails.toLowerCase().includes(search.toLowerCase()));

    const matchesProblemType =
      problemTypeFilter === 'all' || (t.problemType || 'software') === problemTypeFilter;

    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'open'
        ? t.status !== 'resolved' && t.status !== 'closed'
        : t.status === statusFilter;

    let matchesPill = true;
    if (activeFilterPill === 'hardware') {
      matchesPill = (t.problemType || 'software') === 'hardware';
    } else if (activeFilterPill === 'software') {
      matchesPill = (t.problemType || 'software') === 'software';
    } else if (activeFilterPill === 'sla_risk') {
      matchesPill = t.status !== 'resolved' && t.status !== 'closed' && t.slaRemainingMinutes < 15;
    } else if (activeFilterPill === 'ping_pong') {
      matchesPill = t.isAmbiguous || t.reassignmentHistory.length >= 2;
    } else if (activeFilterPill === 'critical') {
      matchesPill = t.priority === 'critical' || t.priority === 'high';
    }

    return matchesSearch && matchesProblemType && matchesPriority && matchesCategory && matchesStatus && matchesPill;
  });

  // SORTING LOGIC: Automatically sort tickets by 3-Tier Difficulty Order:
  // 1. Hard / Critical ALWAYS first
  // 2. Medium / High second
  // 3. Easy / Low third
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const tierA = getTicketDifficultyTier(a).tier;
    const tierB = getTicketDifficultyTier(b).tier;

    if (tierA !== tierB) {
      return tierA - tierB; // Tier 1 first, Tier 2 second, Tier 3 third
    }

    // Secondary sort: Priority score descending
    return (b.priorityScore || 50) - (a.priorityScore || 50);
  });

  const hardwareCount = tickets.filter(t => (t.problemType || 'software') === 'hardware' && t.status !== 'resolved' && t.status !== 'closed').length;
  const softwareCount = tickets.filter(t => (t.problemType || 'software') === 'software' && t.status !== 'resolved' && t.status !== 'closed').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans text-[#27374D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#27374D] tracking-tight">
            IT Service Desk Queue
          </h1>
          <p className="text-xs text-[#526D82] mt-0.5">
            Auto-sorted by Difficulty Triage: Hard (Critical) → Medium (High) → Easy (Low)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-[#526D82] bg-white border border-[#9DB2BF] px-3 py-1.5 rounded-lg shadow-xs">
            {sortedTickets.length} tickets sorted
          </span>
        </div>
      </div>

      {/* Filter Action Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#9DB2BF] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#526D82]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ticket ID, title, employee, hardware tag, or software..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF] text-xs sm:text-sm text-[#27374D] placeholder-[#526D82]/60 focus:outline-none focus:bg-white focus:border-[#27374D]"
            />
          </div>

          {/* Category Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={problemTypeFilter}
              onChange={e => setProblemTypeFilter(e.target.value as any)}
              className="p-2 text-xs rounded-lg bg-[#DDE6ED]/50 border border-[#9DB2BF] text-[#27374D] font-medium focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
            </select>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="p-2 text-xs rounded-lg bg-[#DDE6ED]/50 border border-[#9DB2BF] text-[#27374D] font-medium focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical (Hard)</option>
              <option value="high">High (Medium)</option>
              <option value="medium">Medium</option>
              <option value="low">Low (Easy)</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="p-2 text-xs rounded-lg bg-[#DDE6ED]/50 border border-[#9DB2BF] text-[#27374D] font-medium focus:outline-none"
            >
              <option value="open">Active Open</option>
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#DDE6ED]">
          <button
            onClick={() => setActiveFilterPill('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeFilterPill === 'all'
                ? 'bg-[#27374D] text-white'
                : 'bg-[#DDE6ED]/60 text-[#27374D] hover:bg-[#9DB2BF]/40'
            }`}
          >
            All Auto-Sorted
          </button>
          <button
            onClick={() => setActiveFilterPill('software')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeFilterPill === 'software'
                ? 'bg-[#526D82] text-white'
                : 'bg-[#DDE6ED]/60 text-[#27374D] hover:bg-[#9DB2BF]/40'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Software ({softwareCount})</span>
          </button>
          <button
            onClick={() => setActiveFilterPill('hardware')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeFilterPill === 'hardware'
                ? 'bg-[#526D82] text-white'
                : 'bg-[#DDE6ED]/60 text-[#27374D] hover:bg-[#9DB2BF]/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Hardware ({hardwareCount})</span>
          </button>
          <button
            onClick={() => setActiveFilterPill('sla_risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeFilterPill === 'sla_risk'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>SLA &lt;15m</span>
          </button>
          <button
            onClick={() => setActiveFilterPill('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeFilterPill === 'critical'
                ? 'bg-rose-700 text-white'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hard / Critical</span>
          </button>
        </div>
      </div>

      {/* Ticket Cards Grid (Auto-Sorted) */}
      <div className="space-y-3">
        {sortedTickets.length === 0 ? (
          <div className="p-12 bg-white rounded-xl border border-[#9DB2BF] text-center space-y-3 shadow-xs">
            <ListTodo className="w-8 h-8 text-[#526D82] mx-auto opacity-60" />
            <p className="text-sm font-bold text-[#27374D]">No tickets match the selected filters</p>
            <p className="text-xs text-[#526D82]">Try resetting your filter parameters or search terms.</p>
          </div>
        ) : (
          sortedTickets.map(ticket => {
            const diffTier = getTicketDifficultyTier(ticket);
            return (
              <div
                key={ticket.id}
                onClick={() => navigateTo('it-ticket-detail', ticket.id)}
                className="p-4 sm:p-5 rounded-xl bg-white border border-[#9DB2BF] hover:border-[#27374D] shadow-xs transition-all cursor-pointer group space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#DDE6ED] text-[#27374D]">
                      {ticket.id}
                    </span>

                    {/* 3-Tier Priority Badge */}
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${diffTier.badgeClass}`}>
                      {diffTier.dotColor} {diffTier.label}
                    </span>

                    <span className="text-[10px] font-mono text-[#526D82] uppercase bg-[#DDE6ED]/60 px-2 py-0.5 rounded border border-[#9DB2BF]/40">
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#526D82]">
                    SLA Remaining: <strong className="text-[#27374D] font-bold">{ticket.slaRemainingMinutes} min</strong>
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#27374D] group-hover:text-[#526D82] transition-colors leading-snug">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-[#526D82] mt-1 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#DDE6ED] text-xs text-[#526D82]">
                  <div className="flex items-center gap-3">
                    <span>Reported by: <strong className="text-[#27374D]">{ticket.employee.name}</strong></span>
                    <span>Queue: <strong className="text-[#27374D]">{ticket.assignedTeam}</strong></span>
                  </div>
                  <span className="font-mono text-[11px] text-[#526D82]">
                    Match Confidence: <strong className="text-[#27374D]">{ticket.aiConfidence}%</strong>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
