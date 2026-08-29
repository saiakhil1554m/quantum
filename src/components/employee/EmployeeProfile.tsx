import React, { useState } from 'react';
import {
  User,
  Mail,
  Laptop,
  ShieldCheck,
  MapPin,
  Clock,
  SunMoon,
  Palette,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { DesignCustomizerModal } from '../common/DesignCustomizerModal';

export const EmployeeProfile: React.FC = () => {
  const { currentUser, users, switchUser, tickets } = useHelpdesk();
  const [designModalOpen, setDesignModalOpen] = useState(false);

  const userTickets = tickets.filter(t => t.employee.id === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-semibold mb-1">
          <User className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
          <span>Employee Directory</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Employee Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Verified Active Directory and Enterprise Resource Mapping
        </p>
      </div>

      {/* Main Info Card */}
      <div className="p-6 sm:p-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
          />
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
              <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-400 mt-0.5">
              {currentUser.designation}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentUser.department} • Employee ID: <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{currentUser.id}</span>
            </p>
          </div>
        </div>

        {/* Appearance & Theme Preference Settings */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <SunMoon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Interface Theme & Styling</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Configure color mode, brand palette, and UI density.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle variant="segmented" />
            <button
              onClick={() => setDesignModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* Contact & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-0.5">
              <Mail className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>Corporate Email</span>
            </div>
            <p className="font-mono text-slate-900 dark:text-slate-100 font-medium">{currentUser.email}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-0.5">
              <MapPin className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>Assigned Office Location</span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 font-medium">{currentUser.location}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-0.5">
              <Laptop className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>Assigned IT Hardware</span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 font-medium">Dell Latitude 5530 (Asset #PG-LT-8841)</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-0.5">
              <Clock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>Ticket History</span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 font-medium">{userTickets.length} Unified Tickets Logged</p>
          </div>
        </div>

        {/* Quick Switch Persona for Testing */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            Switch Employee Persona (Demo Mode)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {users
              .filter(u => u.role === 'employee')
              .map(u => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                    currentUser.id === u.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-semibold'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-md object-cover border border-slate-200 dark:border-slate-700" />
                  <div className="truncate">
                    <p className="text-xs truncate font-medium">{u.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{u.department}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Design Customizer Modal */}
      <DesignCustomizerModal isOpen={designModalOpen} onClose={() => setDesignModalOpen(false)} />
    </div>
  );
};
