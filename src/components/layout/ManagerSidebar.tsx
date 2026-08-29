import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export const ManagerSidebar: React.FC = () => {
  const { currentView, navigateTo, approvals } = useHelpdesk();

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  const navigationGroups: NavGroup[] = [
    {
      groupLabel: 'Leadership',
      items: [
        { id: 'manager', label: 'Team Overview', icon: LayoutDashboard },
        { id: 'manager-approvals', label: 'Pending Approvals', icon: CheckCircle2, badge: pendingApprovalsCount },
      ],
    },
    {
      groupLabel: 'Performance',
      items: [
        { id: 'analytics', label: 'Department SLA', icon: TrendingUp },
      ],
    },
  ];

  return (
    <aside className="w-52 bg-white/50 dark:bg-slate-900/40 border-r border-slate-200/60 dark:border-slate-800/60 px-3 py-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-3.25rem)] shrink-0 transition-colors">
      <div className="space-y-5">
        {navigationGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {group.groupLabel && (
              <p className="px-2 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {group.groupLabel}
              </p>
            )}
            <nav className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer group ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-mono rounded font-medium ${
                          isActive
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
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

      {/* Status */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 px-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Regional Head</span>
        </div>
      </div>
    </aside>
  );
};
