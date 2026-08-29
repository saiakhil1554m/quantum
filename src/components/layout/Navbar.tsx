import React, { useState, useEffect } from 'react';
import {
  Shield,
  Bell,
  ChevronDown,
  Search,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { useAuth } from '../../context/AuthContext';
import { QuickSearchModal } from '../common/QuickSearchModal';
import { GuidanceModal } from '../common/GuidanceModal';
import { ThemeToggle } from '../common/ThemeToggle';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
}) => {
  const {
    unreadNotificationCount,
    navigateTo,
  } = useHelpdesk();

  const { currentUser, logout, loginAsDemoRole } = useAuth();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSwitchDemoRole = async (role: UserRole) => {
    setUserDropdownOpen(false);
    await loginAsDemoRole(role);
  };

  const getRoleDisplayName = (role?: UserRole) => {
    switch (role) {
      case 'employee':
        return 'Employee';
      case 'it_support':
      case 'it_staff':
        return 'IT Support';
      case 'manager':
        return 'Manager';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  const getPortalHomeRoute = (role?: UserRole) => {
    switch (role) {
      case 'employee':
        return 'home';
      case 'it_support':
      case 'it_staff':
        return 'it-dashboard';
      case 'manager':
        return 'manager';
      case 'admin':
        return 'admin';
      default:
        return 'home';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#27374D] text-white border-b border-[#526D82]/40 shadow-xs h-[68px]">
        <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6">
            {/* Brand Logo & Subtle Wordmark */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigateTo(getPortalHomeRoute(currentUser?.role))}
                className="flex items-center gap-2 text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden shadow-sm transition-opacity group-hover:opacity-90 ring-1 ring-[#9DB2BF]/30">
                  <img src="/assets/ai-robot.jpg" alt="GRIDMIND" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs tracking-wider text-white uppercase">
                    POWERGRID
                  </span>
                  <span className="text-[10px] text-[#9DB2BF] font-mono">
                    / IT HELP-DESK
                  </span>
                </div>
              </button>
            </div>

            {/* Middle Quick Search Bar Trigger (Minimal inline style) */}
            <div className="flex-1 max-w-sm hidden md:block">
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-750 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="font-normal">Search tickets, KB articles, outages...</span>
                </div>
                <kbd className="hidden lg:inline-flex items-center font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-700/80 border border-slate-200/80 dark:border-slate-600 text-slate-400 dark:text-slate-300">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Mobile Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="md:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle Button */}
              {/* 3-Option Theme Switcher (Light / Dark / System) */}
              <ThemeToggle />

              {/* Guide Button */}
              <button
                onClick={() => setGuideModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-normal text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="User Guide"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Guide</span>
              </button>
              {/* Notification Bell Icon */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-white hover:bg-[#526D82]/40 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#9DB2BF]" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#27374D]" />
                )}
              </button>

              <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

              {/* Persona Switcher & Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name || 'User'}
                    className="w-6 h-6 rounded-md object-cover border border-slate-200/80 dark:border-slate-700"
                  />
                  <div className="hidden lg:block text-left pr-0.5">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-tight">
                      {currentUser?.name}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in">
                    {/* Active User Card */}
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentUser?.avatar}
                          alt={currentUser?.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {currentUser?.name}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                            {currentUser?.employeeId} • {getRoleDisplayName(currentUser?.role)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sign Out */}
                    <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      </header>

      {/* Quick Search Command Palette Modal */}
      <QuickSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Guidance Modal */}
      <GuidanceModal isOpen={guideModalOpen} onClose={() => setGuideModalOpen(false)} />
    </>
  );
};
