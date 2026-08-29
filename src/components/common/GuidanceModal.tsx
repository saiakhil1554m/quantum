import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  RefreshCw,
  Clock,
  Layers,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface GuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidanceModal: React.FC<GuidanceModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, switchRole, navigateTo } = useHelpdesk();
  const [activeTab, setActiveTab] = useState<'employee' | 'it_staff'>(currentRole);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">GRIDMIND User Guide & Tips</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How to get the most out of your Unified Enterprise IT Helpdesk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 gap-3 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('employee')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'employee'
                ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Employee Mode Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('it_staff')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'it_staff'
                ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>IT Staff & Dispatcher Guide</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {activeTab === 'employee' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-slate-800 dark:text-slate-200 space-y-1">
                <p className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  Instant AI Diagnostic Intake
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Instead of filling out confusing forms with category IDs, simply describe your problem in natural language (e.g. "VPN disconnecting after password change"). Our AI will auto-verify your Active Directory status, detect error codes, suggest self-service fixes, and route immediately to the right queue.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Self-Service Resolution
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Step-by-step interactive actions let you clear caches, reset credentials, or install software without waiting in line.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Real-time SLA Visibility
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Always see estimated turnaround time and real-time engineer assignment updates.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-200 space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  Incident Pulse: Automated Surge Detection
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  When 3 or more tickets arrive within 10 minutes sharing keywords and location patterns, GRIDMIND clusters them into an Incident Pulse cluster, preventing duplicate triaging and enabling 1-click Master Incident creation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Ping-Pong Prevention Guard
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    If a ticket is reassigned more than 2 times, the system locks reassignment and notifies the Dispatch Lead to prevent customer frustration.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    AI Copilot for Engineers
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Draft SOP responses with verified CLI commands, playbook excerpts, and knowledge base lookups instantly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (activeTab !== currentRole) {
                switchRole(activeTab);
              }
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span>Switch to {activeTab === 'employee' ? 'Employee Portal' : 'IT Service Desk'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-xs font-medium cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
