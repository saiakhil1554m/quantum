import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Flame,
  AlertOctagon,
  BookOpen,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeTone?: 'default' | 'danger' | 'warning';
}

interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export const ItSidebar: React.FC = () => {
  const { currentView, navigateTo, tickets, clusters } = useHelpdesk();

  const openTickets = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;
  const activeClusters = clusters.filter(c => c.status === 'active' || c.status === 'investigating').length;

  const navigationGroups: NavGroup[] = [
    {
      groupLabel: 'Service Operations',
      items: [
        { id: 'it-dashboard', label: 'Command Center', icon: LayoutDashboard },
        { id: 'it-queue', label: 'Ticket Queue', icon: Inbox, badge: openTickets, badgeTone: 'default' },
      ],
    },
    {
      groupLabel: 'Incident Response',
      items: [
        { id: 'incident-pulse', label: 'Incident Pulse', icon: Flame, badge: activeClusters, badgeTone: 'danger' },
        { id: 'master-incidents', label: 'Major Incidents', icon: AlertOctagon },
      ],
    },
    {
      groupLabel: 'Intelligence',
      items: [
        { id: 'it-kb', label: 'IT Runbooks', icon: BookOpen },
        { id: 'it-analytics', label: 'SLA Telemetry', icon: BarChart3 },
      ],
    },
  ];

  return (
    <aside className="w-[290px] flex-none bg-[#27374D] text-white flex flex-col justify-between hidden md:flex sticky top-[68px] h-[calc(100vh-68px)] shrink-0 shadow-md border-r border-[#526D82]/30 select-none z-20 overflow-y-auto" style={{ left: 0 }}>
      <div className="p-3 space-y-4">
        {/* Header Title */}
        <div className="h-11 px-4 flex items-center justify-between border-b border-[#526D82]/40 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center shrink-0 text-[#9DB2BF]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider text-[#DDE6ED] uppercase truncate">
              IT Support Queue
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        {navigationGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {group.groupLabel && (
              <p className="px-4 py-1 text-[10px] font-mono font-bold text-[#9DB2BF] uppercase tracking-wider">
                {group.groupLabel}
              </p>
            )}
            <nav className="space-y-1">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`w-full h-11 px-4 flex items-center rounded-lg text-xs font-semibold transition-colors cursor-pointer group ${
                      isActive
                        ? 'bg-[#526D82] text-white'
                        : 'bg-transparent text-[#9DB2BF] hover:bg-[#526D82]/30 hover:text-white'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-white' : 'text-[#9DB2BF] group-hover:text-white'
                        }`}
                      />
                    </div>
                    <span className="ml-3.5 text-left truncate flex-1 leading-none">{item.label}</span>

                    {/* Compact Subtle Badges */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`ml-auto shrink-0 px-2 py-0.5 text-[10px] font-mono rounded font-bold leading-none ${
                          item.badgeTone === 'danger'
                            ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
                            : isActive
                            ? 'bg-[#27374D] text-white'
                            : 'bg-[#526D82]/60 text-[#DDE6ED]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Status */}
      <div className="p-3 border-t border-[#526D82]/40 bg-[#1e2b3c]/60 text-[11px] text-[#9DB2BF]">
        <div className="h-6 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px]">IT OPS ONLINE</span>
          </div>
          <span className="text-[9px] font-mono opacity-70">SLA 100%</span>
        </div>
      </div>
    </aside>
  );
};
