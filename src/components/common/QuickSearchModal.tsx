import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Ticket,
  BookOpen,
  Flame,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const { tickets, knowledgeArticles, clusters, currentRole, navigateTo, switchRole } = useHelpdesk();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTickets = tickets.filter(
    t =>
      t.id.toLowerCase().includes(query.toLowerCase()) ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.employee.name.toLowerCase().includes(query.toLowerCase()) ||
      t.service.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredArticles = knowledgeArticles.filter(
    a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.content.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 3);

  const filteredClusters = clusters.filter(
    c =>
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.affectedService.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 2);

  const quickActions = [
    {
      title: 'Report New IT Issue (AI Intake)',
      role: 'employee',
      view: 'get-help',
      icon: <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: 'View My Support Tickets',
      role: 'employee',
      view: 'my-tickets',
      icon: <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Smart IT Triage Queue',
      role: 'it_staff',
      view: 'it-queue',
      icon: <Ticket className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: 'Incident Pulse Outage Radar',
      role: 'it_staff',
      view: 'incident-pulse',
      icon: <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
    },
    {
      title: 'Browse Resolution Knowledge Playbooks',
      role: currentRole,
      view: currentRole === 'employee' ? 'kb' : 'it-kb',
      icon: <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    },
  ];

  const handleSelect = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3 bg-slate-50/70 dark:bg-slate-800/80">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tickets, knowledge guides, outages, or type a command..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              ESC
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Quick Actions (Show when no query or query matches) */}
          {(!query || query.length < 2) && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                Quick Shortcuts & Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {quickActions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      handleSelect(() => {
                        if (act.role !== currentRole) switchRole(act.role as 'employee' | 'it_staff');
                        navigateTo(act.view);
                      })
                    }
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-left transition-colors group text-xs text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shrink-0">
                      {act.icon}
                    </div>
                    <span className="truncate">{act.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ticket Results */}
          {filteredTickets.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 flex items-center justify-between">
                <span>Tickets ({filteredTickets.length})</span>
                <Ticket className="w-3.5 h-3.5" />
              </span>
              <div className="space-y-1">
                {filteredTickets.map(t => (
                  <button
                    key={t.id}
                    onClick={() =>
                      handleSelect(() => {
                        if (currentRole === 'employee') {
                          navigateTo('ticket-detail', t.id);
                        } else {
                          navigateTo('it-ticket-detail', t.id);
                        }
                      })
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-transparent hover:border-blue-200 dark:hover:border-slate-700 text-left transition-colors group cursor-pointer"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                          {t.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {t.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {t.employee.name} • {t.service} • SLA: {t.slaRemainingMinutes}m
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          t.status === 'resolved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Articles */}
          {filteredArticles.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 flex items-center justify-between">
                <span>Knowledge & Playbooks ({filteredArticles.length})</span>
                <BookOpen className="w-3.5 h-3.5" />
              </span>
              <div className="space-y-1">
                {filteredArticles.map(a => (
                  <button
                    key={a.id}
                    onClick={() =>
                      handleSelect(() => {
                        navigateTo(currentRole === 'employee' ? 'kb' : 'it-kb');
                      })
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/60 dark:hover:bg-slate-800 border border-transparent hover:border-amber-200 dark:hover:border-slate-700 text-left transition-colors group cursor-pointer"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          {a.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {a.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{a.content}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Incidents */}
          {filteredClusters.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 flex items-center justify-between">
                <span>Outage Clusters ({filteredClusters.length})</span>
                <Flame className="w-3.5 h-3.5" />
              </span>
              <div className="space-y-1">
                {filteredClusters.map(c => (
                  <button
                    key={c.id}
                    onClick={() =>
                      handleSelect(() => {
                        if (currentRole !== 'it_staff') switchRole('it_staff');
                        navigateTo('incident-pulse', undefined, undefined, c.id);
                      })
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/60 dark:hover:bg-slate-800 border border-transparent hover:border-rose-200 dark:hover:border-slate-700 text-left transition-colors group cursor-pointer"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-rose-800 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                          {c.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {c.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{c.summary}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results state */}
          {query.length > 1 &&
            filteredTickets.length === 0 &&
            filteredArticles.length === 0 &&
            filteredClusters.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No results found for "{query}"</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Try searching for VPN, SAP, Password, or Ticket ID like TKT-1001.
                </p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-mono text-[10px] text-slate-700 dark:text-slate-200">Enter</kbd> to select
            </span>
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-mono text-[10px] text-slate-700 dark:text-slate-200">ESC</kbd> to exit
            </span>
          </div>
          <span className="text-blue-700 dark:text-blue-400 font-medium">GRIDMIND Search Engine</span>
        </div>
      </div>
    </div>
  );
};
