import React, { useState } from 'react';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Bot,
  BookOpen,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface EmployeeSidebarProps {
  onOpenNotifications?: () => void;
}

export const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ onOpenNotifications }) => {
  const { currentView, navigateTo, tickets, currentUser, unreadNotificationCount } = useHelpdesk();
  const [collapsed, setCollapsed] = useState(false);

  const activeTicketsCount = tickets.filter(
    t => t.employee.id === currentUser.id && t.status !== 'closed' && t.status !== 'resolved'
  ).length;

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-tickets', label: 'My Tickets', icon: Ticket, badge: activeTicketsCount },
    { id: 'get-help', label: 'Create Ticket', icon: PlusCircle },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    navigateTo(id);
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-16 flex-none' : 'w-[290px] flex-none'
      } bg-[#27374D] text-white flex flex-col justify-between hidden md:flex sticky top-[68px] h-[calc(100vh-68px)] shrink-0 transition-all duration-200 shadow-md border-r border-[#526D82]/30 select-none z-20 overflow-y-auto`}
      style={{ left: 0 }}
    >
      <div className="p-3 space-y-3">
        {/* Sidebar Header & Toggle — Strict 290px Grid Alignment */}
        <div className="h-11 px-4 flex items-center justify-between border-b border-[#526D82]/40 pb-2">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center shrink-0 text-[#9DB2BF]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-wider text-[#DDE6ED] uppercase truncate">
                Navigation
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(prev => !prev)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#526D82]/40 text-[#9DB2BF] hover:text-white transition-colors cursor-pointer ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Items — Strict Grid Alignment */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'home' && currentView === 'home') ||
              (item.id === 'my-tickets' && currentView === 'ticket-detail') ||
              (item.id === 'profile' && currentView === 'profile');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full h-11 px-4 flex items-center rounded-lg text-xs font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-[#526D82] text-white font-semibold'
                    : 'text-[#DDE6ED]/80 hover:bg-[#526D82]/30 hover:text-white'
                }`}
              >
                {/* Icon Container: Fixed 20px width & centered */}
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-[#9DB2BF] group-hover:text-white'
                    }`}
                  />
                </div>

                {/* Label: Fixed left margin */}
                {!collapsed && (
                  <span className="ml-3.5 text-left truncate flex-1 leading-none">
                    {item.label}
                  </span>
                )}

                {/* Notification Badge: Aligned strictly to the far right */}
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto shrink-0 px-2 py-0.5 text-[10px] font-mono rounded font-bold leading-none ${
                      isActive ? 'bg-[#27374D] text-white' : 'bg-[#526D82]/60 text-[#DDE6ED]'
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

      {/* Footer Status */}
      <div className="p-3 border-t border-[#526D82]/40 bg-[#1e2b3c]/60 text-[11px] text-[#9DB2BF]">
        {!collapsed ? (
          <div className="h-6 px-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px]">SYSTEM ONLINE</span>
            </div>
            <span className="text-[9px] font-mono opacity-70">v2.4</span>
          </div>
        ) : (
          <div className="h-6 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Online" />
          </div>
        )}
      </div>
    </aside>
  );
};
