import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Send,
  Sparkles,
  Star,
  Activity,
  Cpu,
  AlertTriangle,
  User,
  ShieldCheck,
  Check,
  MessageSquare,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { HelpTooltip } from '../common/HelpTooltip';

export const EmployeeTicketDetail: React.FC = () => {
  const {
    selectedTicketId,
    tickets,
    navigateTo,
    rateResolution,
    addInternalNote,
  } = useHelpdesk();

  const [commentText, setCommentText] = useState('');
  const [starRating, setStarRating] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const ticket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  if (!ticket) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Ticket not found</p>
        <button
          onClick={() => navigateTo('my-tickets')}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-700 text-white font-medium text-xs shadow-xs"
        >
          Return to My Tickets
        </button>
      </div>
    );
  }

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addInternalNote(ticket.id, commentText.trim());
    setCommentText('');
  };

  const handleRating = (stars: number) => {
    setStarRating(stars);
    rateResolution(ticket.id, stars);
    setFeedbackSubmitted(true);
  };

  // 5-step lifecycle stages
  const stages = [
    { title: 'Submitted', done: true, time: ticket.createdAt },
    { title: 'AI Diagnosed', done: true, time: 'Instant' },
    { title: 'Assigned', done: !!ticket.assignee || ticket.status !== 'new', time: ticket.assignedTeam },
    { title: 'In Progress', done: ticket.status === 'in_progress' || ticket.status === 'resolved' || ticket.status === 'closed' },
    { title: 'Resolved', done: ticket.status === 'resolved' || ticket.status === 'closed' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Back Navigation */}
      <button
        onClick={() => navigateTo('my-tickets')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Tickets</span>
      </button>

      {/* Main Ticket Journey Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        {/* Ticket Header & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {ticket.id}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                  ticket.status === 'in_progress'
                    ? 'bg-blue-100/90 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                    : ticket.status === 'new'
                    ? 'bg-purple-100/90 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                    : ticket.status === 'resolved'
                    ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {ticket.status.replace('_', ' ')}
              </span>
              <span
                className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                  ticket.priority === 'critical'
                    ? 'bg-rose-100/90 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                    : ticket.priority === 'high'
                    ? 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {ticket.priority} Priority
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {ticket.title}
            </h1>
          </div>

          {/* Unified SLA Counter Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-right shrink-0">
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Target Resolution SLA</span>
            </div>
            <div className="font-mono font-bold text-base text-slate-900 dark:text-white">
              {ticket.status === 'resolved' ? (
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center justify-end gap-1 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> SLA Met (Resolved)
                </span>
              ) : ticket.slaRemainingMinutes > 0 ? (
                <span
                  className={
                    ticket.slaRemainingMinutes < 15 ? 'text-rose-700 dark:text-rose-400 font-bold' : 'text-slate-800 dark:text-slate-200'
                  }
                >
                  {ticket.slaRemainingMinutes} min remaining
                </span>
              ) : (
                <span className="text-rose-700 dark:text-rose-400">Breached</span>
              )}
            </div>
          </div>
        </div>

        {/* Visual Lifecycle Stepper */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Ticket Progress Milestones
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  stage.done
                    ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold">Step {idx + 1}</span>
                  {stage.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600" />
                  )}
                </div>
                <span className="text-xs font-semibold">{stage.title}</span>
                {stage.time && <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{stage.time}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Issue Description */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Your Original Request
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
            {ticket.description}
          </p>
        </div>

        {/* AI Triage & Plain-English Context */}
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>AI Analysis & Action Plan</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Diagnostic Confidence: <strong className="text-blue-800 dark:text-blue-300 font-semibold">{ticket.aiConfidence}%</strong>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {ticket.aiReasoning}
          </p>
          <div className="pt-1 flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-blue-200 dark:border-blue-800 font-medium">
              Assigned Team: <strong className="text-blue-800 dark:text-blue-300">{ticket.assignedTeam}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-blue-200 dark:border-blue-800 font-medium">
              Lead Engineer: <strong className="text-slate-900 dark:text-slate-100">{ticket.assignee ? ticket.assignee.name : 'Auto-Assigning...'}</strong>
            </span>
          </div>
        </div>

        {/* Resolution Notes & Rating (If Resolved) */}
        {ticket.status === 'resolved' && (
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Resolution Applied by IT Support</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 bg-white dark:bg-slate-800/90 p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 leading-relaxed">
              {ticket.resolutionNotes || ticket.suggestedResolution || 'Standard operating recovery applied. System telemetry verified.'}
            </p>

            {/* Satisfaction Rating */}
            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                How satisfied are you with this resolution?
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(stars => (
                  <button
                    key={stars}
                    onClick={() => handleRating(stars)}
                    className="p-1 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        (starRating || ticket.userSatisfactionRating || 0) >= stars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            {feedbackSubmitted && (
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium text-right">
                Thank you! Your feedback helps us improve IT support.
              </p>
            )}
          </div>
        )}

        {/* Notes & Activity Log */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Activity & Communication</span>
          </h2>

          <div className="space-y-2">
            {ticket.internalNotes && ticket.internalNotes.length > 0 ? (
              ticket.internalNotes.map(note => (
                <div
                  key={note.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{note.author.name} ({note.author.role === 'employee' ? 'You' : 'IT Engineer'})</span>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px]">{note.timestamp}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{note.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                No extra messages yet. The assigned engineer will post updates as work progresses.
              </p>
            )}
          </div>

          {/* Quick Message Input */}
          <form onSubmit={handleSendComment} className="flex gap-2 pt-2">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Send a quick note or additional details to the assigned engineer..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Note</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
