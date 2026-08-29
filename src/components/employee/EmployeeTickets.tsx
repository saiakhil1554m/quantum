import React, { useState } from 'react';
import {
  Search,
  ChevronRight,
  PlusCircle,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

/**
 * EmployeeTickets — Enterprise Ticket Tracking Table & Pipeline
 * Color palette: #27374D, #526D82, #9DB2BF, #DDE6ED
 */
export const EmployeeTickets: React.FC = () => {
  const { tickets, currentUser, navigateTo } = useHelpdesk();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const userTickets = tickets.filter(t => t.employee.id === currentUser.id);

  const filteredTickets = userTickets.filter(ticket => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? ticket.status !== 'resolved' && ticket.status !== 'closed'
        : ticket.status === 'resolved' || ticket.status === 'closed';

    return matchesSearch && matchesStatus;
  });

  const activeCount = userTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;
  const resolvedCount = userTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#9DB2BF]/60 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#27374D]">My Support Tickets</h1>
          <p className="text-xs text-[#526D82] mt-0.5">
            Monitor real-time progress, assigned teams, and SLA countdowns.
          </p>
        </div>

        <button
          onClick={() => navigateTo('get-help')}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-semibold text-[#526D82] uppercase">All Submitted</span>
          <p className="text-xl font-bold text-[#27374D] font-mono mt-1">{userTickets.length}</p>
        </div>
        <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-semibold text-[#526D82] uppercase">Active Processing</span>
          <p className="text-xl font-bold text-[#27374D] font-mono mt-1">{activeCount}</p>
        </div>
        <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-semibold text-[#526D82] uppercase">Successfully Resolved</span>
          <p className="text-xl font-bold text-emerald-700 font-mono mt-1">{resolvedCount}</p>
        </div>
        <div className="bg-white border border-[#9DB2BF]/60 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-semibold text-[#526D82] uppercase">SLA Window</span>
          <p className="text-xl font-bold text-[#27374D] font-mono mt-1">2 Hours</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-[#9DB2BF]/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#526D82] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets by ID, title, or keyword..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#DDE6ED]/40 border border-[#9DB2BF] rounded-lg text-xs text-[#27374D] placeholder-[#526D82]/60 focus:outline-none focus:border-[#27374D]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#DDE6ED]/60 p-1 rounded-lg border border-[#9DB2BF]/40 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-[#27374D] text-white shadow-xs' : 'text-[#526D82] hover:text-[#27374D]'
            }`}
          >
            All ({userTickets.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
              statusFilter === 'active' ? 'bg-[#27374D] text-white shadow-xs' : 'text-[#526D82] hover:text-[#27374D]'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
              statusFilter === 'resolved' ? 'bg-[#27374D] text-white shadow-xs' : 'text-[#526D82] hover:text-[#27374D]'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-[#9DB2BF]/60 rounded-xl overflow-hidden shadow-xs">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <TicketIcon className="w-8 h-8 text-[#9DB2BF] mx-auto" />
            <p className="text-xs font-bold text-[#27374D]">No tickets found</p>
            <p className="text-xs text-[#526D82]">No support tickets match your search parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#DDE6ED]/60 text-[#526D82] font-mono text-[10px] uppercase border-b border-[#DDE6ED]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Issue Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Assigned Team</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE6ED]">
                {filteredTickets.map(ticket => {
                  const isResolved = ticket.status === 'resolved' || ticket.status === 'closed';

                  return (
                    <tr key={ticket.id} className="pg-table-row">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#27374D]">
                        {ticket.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#27374D]">{ticket.title}</p>
                        <p className="text-[11px] text-[#526D82] line-clamp-1">{ticket.description}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#526D82] capitalize">
                        {ticket.problemType || 'Software'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#27374D]">
                        {ticket.assignedTeam || 'IT Support'}
                      </td>
                      <td className="py-3.5 px-4">
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#27374D] bg-[#9DB2BF]/20 border border-[#9DB2BF]/60 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-[#526D82]" />
                            {ticket.status.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigateTo('ticket-detail', ticket.id)}
                          className="p-1 text-[#27374D] hover:text-[#526D82] transition-colors cursor-pointer"
                          title="Open ticket details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
