import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HelpdeskProvider, useHelpdesk } from './context/HelpdeskContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { EmployeeSidebar } from './components/layout/EmployeeSidebar';
import { ItSidebar } from './components/layout/ItSidebar';
import { ManagerSidebar } from './components/layout/ManagerSidebar';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { FloatingChatbot } from './components/common/FloatingChatbot';
import { ShieldAlert, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { UserRole } from './types';

// Employee Views
import { EmployeeHome } from './components/employee/EmployeeHome';
import { AiIntakeFlow } from './components/employee/AiIntakeFlow';
import { EmployeeTickets } from './components/employee/EmployeeTickets';
import { EmployeeTicketDetail } from './components/employee/EmployeeTicketDetail';
import { EmployeeKnowledgeBase } from './components/employee/EmployeeKnowledgeBase';
import { EmployeeProfile } from './components/employee/EmployeeProfile';
import { AiAssistantPage } from './components/employee/AiAssistantPage';

// IT Staff Views
import { ItDashboard } from './components/it/ItDashboard';
import { ItTicketQueue } from './components/it/ItTicketQueue';
import { ItTicketDetail } from './components/it/ItTicketDetail';
import { IncidentPulseView } from './components/it/IncidentPulseView';
import { MasterIncidentsView } from './components/it/MasterIncidentsView';
import { ItKnowledgeBase } from './components/it/ItKnowledgeBase';
import { ItAnalyticsView } from './components/it/ItAnalyticsView';

// Manager & Admin Views
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { currentUser, isAuthenticated, loading, logout, hasRole } = useAuth();
  const { currentView, navigateTo } = useHelpdesk();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [intakeInitialPrompt, setIntakeInitialPrompt] = useState('');
  const [intakePresetId, setIntakePresetId] = useState<string | undefined>();
  const [accessDeniedNotice, setAccessDeniedNotice] = useState<string | null>(null);

  // Sync browser path with state and listen to popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser address bar path
  const updateRoute = (path: string, viewName?: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path);
    if (viewName) {
      navigateTo(viewName);
    }
  };

  // Route enforcement & Access Control Check
  useEffect(() => {
    if (loading) return;

    // Unauthenticated state
    if (!isAuthenticated) {
      if (currentPath !== '/login') {
        updateRoute('/login');
      }
      return;
    }

    // Authenticated state
    const role = currentUser?.role;

    // If currently on /login or root /, redirect to authorized role portal
    if (currentPath === '/login' || currentPath === '/' || currentPath === '') {
      if (role === 'employee') {
        updateRoute('/employee', 'home');
      } else if (role === 'it_support' || role === 'it_staff') {
        updateRoute('/it', 'it-dashboard');
      } else if (role === 'manager') {
        updateRoute('/manager', 'manager');
      } else if (role === 'admin') {
        updateRoute('/admin', 'admin');
      }
      return;
    }

    // Cross-Role Access Protection
    if (role === 'employee') {
      if (
        currentPath.startsWith('/it') ||
        currentPath.startsWith('/manager') ||
        currentPath.startsWith('/admin')
      ) {
        setAccessDeniedNotice(
          `Access Denied: You do not have permission to access the IT Support, Management, or Admin portals with your Employee credentials.`
        );
        updateRoute('/employee', 'home');
      }
    } else if (role === 'it_support' || role === 'it_staff') {
      if (currentPath.startsWith('/manager') || currentPath.startsWith('/admin')) {
        setAccessDeniedNotice(
          `Access Denied: Unauthorized access to Management or System Administration.`
        );
        updateRoute('/it', 'it-dashboard');
      }
    } else if (role === 'manager') {
      if (currentPath.startsWith('/admin')) {
        setAccessDeniedNotice(
          `Access Denied: Root System Administration requires CISO / Admin credentials.`
        );
        updateRoute('/manager', 'manager');
      }
    }
  }, [isAuthenticated, loading, currentUser?.role, currentPath]);

  // Handle start intake
  const handleStartIntake = (prompt: string, presetId?: string) => {
    setIntakeInitialPrompt(prompt);
    setIntakePresetId(presetId);
    updateRoute('/employee/help', 'get-help');
  };

  // Handle Login success
  const handleLoginSuccess = (role: UserRole) => {
    setAccessDeniedNotice(null);
    if (role === 'employee') {
      updateRoute('/employee', 'home');
    } else if (role === 'it_support' || role === 'it_staff') {
      updateRoute('/it', 'it-dashboard');
    } else if (role === 'manager') {
      updateRoute('/manager', 'manager');
    } else if (role === 'admin') {
      updateRoute('/admin', 'admin');
    }
  };

  // If loading session
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">Verifying GRIDMIND enterprise session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Render Portal Views based on role and currentView
  const renderCurrentView = () => {
    const role = currentUser?.role;

    if (role === 'employee') {
      switch (currentView) {
        case 'home':
          return <EmployeeHome onStartIntakeWithPrompt={handleStartIntake} />;
        case 'get-help':
          return (
            <AiIntakeFlow
              initialPrompt={intakeInitialPrompt}
              presetId={intakePresetId}
            />
          );
        case 'my-tickets':
          return <EmployeeTickets />;
        case 'ticket-detail':
          return <EmployeeTicketDetail />;
        case 'ai-assistant':
          return <AiAssistantPage />;
        case 'kb':
          return <EmployeeKnowledgeBase />;
        case 'profile':
          return <EmployeeProfile />;
        default:
          return <EmployeeHome onStartIntakeWithPrompt={handleStartIntake} />;
      }
    } else if (role === 'it_support' || role === 'it_staff') {
      switch (currentView) {
        case 'it-dashboard':
          return <ItDashboard />;
        case 'it-queue':
          return <ItTicketQueue />;
        case 'it-ticket-detail':
          return <ItTicketDetail />;
        case 'incident-pulse':
          return <IncidentPulseView />;
        case 'master-incidents':
          return <MasterIncidentsView />;
        case 'it-kb':
          return <ItKnowledgeBase />;
        case 'it-analytics':
          return <ItAnalyticsView />;
        default:
          return <ItDashboard />;
      }
    } else if (role === 'manager') {
      return <ManagerDashboard />;
    } else if (role === 'admin') {
      return <AdminDashboard />;
    }

    return <EmployeeHome onStartIntakeWithPrompt={handleStartIntake} />;
  };

  // Render appropriate sidebar
  const renderSidebar = () => {
    const role = currentUser?.role;
    if (role === 'employee') return <EmployeeSidebar onOpenNotifications={() => setShowNotifications(true)} />;
    if (role === 'it_support' || role === 'it_staff') return <ItSidebar />;
    if (role === 'manager') return <ManagerSidebar />;
    if (role === 'admin') return <AdminSidebar />;
    return <EmployeeSidebar onOpenNotifications={() => setShowNotifications(true)} />;
  };

  return (
    <div className="min-h-screen bg-[#DDE6ED] text-[#27374D] flex flex-col font-sans transition-colors duration-150">
      {/* Enterprise Navigation Header */}
      <Navbar
        onOpenNotifications={() => setShowNotifications(true)}
      />

      {/* Access Denied Warning Toast / Banner */}
      {accessDeniedNotice && (
        <div className="bg-rose-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-200" />
            <span className="font-semibold">{accessDeniedNotice}</span>
          </div>
          <button
            onClick={() => setAccessDeniedNotice(null)}
            className="p-1 hover:bg-rose-700 rounded transition-colors text-white cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Workspace Layout Shell — Sidebar anchored at left: 0 */}
      <div className="flex-1 flex w-full min-h-[calc(100vh-68px)]">
        {/* Role-Specific Desktop Sidebar */}
        {renderSidebar()}

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Responsive One-Handed Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Slide-over Notification Drawer */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Floating AI Chatbot (visible to all authenticated users) */}
      <FloatingChatbot />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HelpdeskProvider>
          <MainAppContent />
        </HelpdeskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
