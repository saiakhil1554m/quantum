import React from 'react';
import {
  Home,
  MessageSquarePlus,
  Ticket,
  BookOpen,
  User,
  LayoutDashboard,
  ListTodo,
  Flame,
  Layers,
  Users,
  Settings,
  BarChart3,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

export const MobileBottomNav: React.FC = () => {
  const { currentRole, currentView, navigateTo } = useHelpdesk();

  if (currentRole === 'employee') {
    return (
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg transition-colors"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'home'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className={`w-5 h-5 mb-0.5 ${currentView === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigateTo('get-help')}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-semibold transition-all -translate-y-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 shadow-md cursor-pointer"
          >
            <MessageSquarePlus className="w-5 h-5 mb-0.5" />
            <span>AI Help</span>
          </button>

          <button
            onClick={() => navigateTo('my-tickets')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'my-tickets' || currentView === 'ticket-detail'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Ticket className={`w-5 h-5 mb-0.5 ${currentView === 'my-tickets' || currentView === 'ticket-detail' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>Tickets</span>
          </button>

          <button
            onClick={() => navigateTo('kb')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'kb'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className={`w-5 h-5 mb-0.5 ${currentView === 'kb' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>Guides</span>
          </button>

          <button
            onClick={() => navigateTo('profile')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'profile'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className={`w-5 h-5 mb-0.5 ${currentView === 'profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>Profile</span>
          </button>
        </div>
      </nav>
    );
  }

  if (currentRole === 'manager') {
    return (
      <nav
        aria-label="Manager Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg transition-colors"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => navigateTo('manager')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'manager'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 mb-0.5 ${currentView === 'manager' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => navigateTo('manager')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'manager-approvals'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className={`w-5 h-5 mb-0.5 ${currentView === 'manager-approvals' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>Team</span>
          </button>

          <button
            onClick={() => navigateTo('analytics')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'analytics'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className={`w-5 h-5 mb-0.5 ${currentView === 'analytics' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>Analytics</span>
          </button>
        </div>
      </nav>
    );
  }

  if (currentRole === 'admin') {
    return (
      <nav
        aria-label="Admin Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg transition-colors"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => navigateTo('admin')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 mb-0.5 ${currentView === 'admin' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>System</span>
          </button>

          <button
            onClick={() => navigateTo('admin')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'admin-integrations'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings className={`w-5 h-5 mb-0.5 ${currentView === 'admin-integrations' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>Connectors</span>
          </button>

          <button
            onClick={() => navigateTo('analytics')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
              currentView === 'analytics'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className={`w-5 h-5 mb-0.5 ${currentView === 'analytics' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>SLA Telemetry</span>
          </button>
        </div>
      </nav>
    );
  }

  // IT Staff Mobile Navigation
  return (
    <nav
      aria-label="IT Staff Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg transition-colors"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => navigateTo('it-dashboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
            currentView === 'it-dashboard'
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-0.5 ${currentView === 'it-dashboard' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => navigateTo('it-queue')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
            currentView === 'it-queue' || currentView === 'it-ticket-detail'
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ListTodo className={`w-5 h-5 mb-0.5 ${currentView === 'it-queue' || currentView === 'it-ticket-detail' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span>Queue</span>
        </button>

        <button
          onClick={() => navigateTo('incident-pulse')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
            currentView === 'incident-pulse'
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Flame className={`w-5 h-5 mb-0.5 ${currentView === 'incident-pulse' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span>Pulse</span>
        </button>

        <button
          onClick={() => navigateTo('master-incidents')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[48px] text-[11px] font-medium transition-all cursor-pointer ${
            currentView === 'master-incidents'
              ? 'text-purple-600 dark:text-purple-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className={`w-5 h-5 mb-0.5 ${currentView === 'master-incidents' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span>Major</span>
        </button>
      </div>
    </nav>
  );
};
