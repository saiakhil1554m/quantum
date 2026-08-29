import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Flame,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    currentRole,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
  } = useHelpdesk();

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(
    n => n.targetRole === 'all' || n.targetRole === currentRole
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'incident':
        return <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-xl animate-in slide-in-from-right duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Notifications & Alerts</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentRole === 'employee' ? 'Employee Inbox' : 'IT Operations Radar'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 font-medium px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Mark all read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No new notifications</p>
            </div>
          ) : (
            filteredNotifs.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.ticketId) {
                    if (currentRole === 'employee') {
                      navigateTo('ticket-detail', notif.ticketId);
                    } else {
                      navigateTo('it-ticket-detail', notif.ticketId);
                    }
                    onClose();
                  } else if (notif.type === 'incident') {
                    if (currentRole === 'it_staff') {
                      navigateTo('incident-pulse');
                    }
                    onClose();
                  }
                }}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  notif.read
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 text-slate-900 dark:text-slate-100 shadow-xs'
                } hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs font-semibold truncate ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.ticketId && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono font-medium text-blue-700 dark:text-blue-400 hover:underline">
                        <span>View {notif.ticketId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 mt-1"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
