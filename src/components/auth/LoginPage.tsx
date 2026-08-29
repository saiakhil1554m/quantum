import React, { useState } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Headphones,
  ChevronRight,
  Sun,
  Moon,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  onLoginSuccess?: (role: UserRole) => void;
  accessDeniedMessage?: string | null;
  onClearAccessDenied?: () => void;
}

export type LoginState = 'role_selection' | 'employee_login' | 'it_support_login';

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  accessDeniedMessage,
  onClearAccessDenied,
}) => {
  const { login, loading, authError, clearError } = useAuth();
  const { theme, setTheme } = useTheme();

  // 3-State Flow: 'role_selection' | 'employee_login' | 'it_support_login'
  const [loginState, setLoginState] = useState<LoginState>('role_selection');

  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [formValidationError, setFormValidationError] = useState<string | null>(null);

  const handleSelectRole = (role: 'employee' | 'it_support') => {
    setFormValidationError(null);
    if (authError) clearError();
    if (onClearAccessDenied) onClearAccessDenied();

    if (role === 'employee') {
      setLoginState('employee_login');
      setEmployeeId('EMP001');
      setPassword('Employee@123');
    } else {
      setLoginState('it_support_login');
      setEmployeeId('IT001');
      setPassword('ITSupport@123');
    }
  };

  const handleBackToRoleSelection = () => {
    setLoginState('role_selection');
    setFormValidationError(null);
    if (authError) clearError();
    if (onClearAccessDenied) onClearAccessDenied();
  };

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeId(e.target.value);
    if (formValidationError) setFormValidationError(null);
    if (authError) clearError();
    if (onClearAccessDenied) onClearAccessDenied();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (formValidationError) setFormValidationError(null);
    if (authError) clearError();
    if (onClearAccessDenied) onClearAccessDenied();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationError(null);
    if (onClearAccessDenied) onClearAccessDenied();

    const cleanEmpId = employeeId.trim();
    if (!cleanEmpId) {
      setFormValidationError('Please enter your Employee ID.');
      return;
    }

    if (!password) {
      setFormValidationError('Please enter your password.');
      return;
    }

    const selectedRole: UserRole = loginState === 'it_support_login' ? 'it_support' : 'employee';

    try {
      const authenticatedUser = await login(cleanEmpId, password, selectedRole);
      if (onLoginSuccess) {
        onLoginSuccess(authenticatedUser.role);
      }
    } catch {
      // Error handled by AuthContext
    }
  };

  const currentError = formValidationError || authError || accessDeniedMessage;

  return (
    <div className="min-h-screen bg-[#DDE6ED] text-[#27374D] flex flex-col justify-between selection:bg-[#9DB2BF]/40 font-sans transition-colors duration-150">
      {/* Minimal Header */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-[#9DB2BF]/40 shadow-xs">
            <img src="/assets/ai-robot.jpg" alt="POWERGRID" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-wider text-[#27374D] uppercase">
                POWERGRID
              </span>
              <span className="text-[10px] font-mono font-semibold text-[#526D82] uppercase">
                / IT HELP-DESK
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-[#526D82] hover:text-[#27374D] hover:bg-[#9DB2BF]/20 rounded-lg transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <span className="text-xs font-mono text-[#526D82] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Zero-Trust Protected
          </span>
        </div>
      </header>

      {/* Main Centered Card Container */}
      <main className="w-full max-w-md mx-auto px-4 py-6 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-2xl border border-[#9DB2BF]/80 shadow-md p-6 sm:p-8 space-y-6">
          
          {/* ───────────────────────────────────────────────────────────── */}
          {/* STATE 1: INITIAL ROLE SELECTION LANDING PAGE */}
          {/* ───────────────────────────────────────────────────────────── */}
          {loginState === 'role_selection' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Section */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm mx-auto ring-2 ring-[#526D82]/20 border border-[#9DB2BF]/40">
                  <img src="/assets/ai-robot.jpg" alt="Smart IT Helpdesk" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#27374D] tracking-tight">
                  Welcome to Smart IT Helpdesk
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#526D82]">
                  Please select your role to continue
                </p>
              </div>

              {/* Error Banner */}
              {currentError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{currentError}</span>
                </div>
              )}

              {/* Role Selection Options (Exactly Two) */}
              <div className="space-y-3">
                {/* Option 1: Employee */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('employee')}
                  className="w-full p-4 rounded-xl bg-white hover:bg-[#DDE6ED]/50 border border-[#9DB2BF] hover:border-[#27374D] transition-all cursor-pointer shadow-xs group flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#DDE6ED] text-[#27374D] group-hover:bg-[#27374D] group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-[#9DB2BF]/50">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#27374D]">Employee</h3>
                      <p className="text-xs text-[#526D82]">Login as an employee</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#526D82] group-hover:text-[#27374D] transition-colors shrink-0" />
                </button>

                {/* Option 2: IT Support */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('it_support')}
                  className="w-full p-4 rounded-xl bg-white hover:bg-[#DDE6ED]/50 border border-[#9DB2BF] hover:border-[#27374D] transition-all cursor-pointer shadow-xs group flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#DDE6ED] text-[#27374D] group-hover:bg-[#27374D] group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-[#9DB2BF]/50">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#27374D]">IT Support</h3>
                      <p className="text-xs text-[#526D82]">Login as IT support staff</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#526D82] group-hover:text-[#27374D] transition-colors shrink-0" />
                </button>
              </div>

              {/* Section Footer: Centered Shield + Statement + Dividers */}
              <div className="pt-2">
                <div className="flex items-center gap-3 w-full my-3">
                  <div className="h-px bg-[#9DB2BF]/40 flex-1" />
                  <Shield className="w-4 h-4 text-[#526D82] shrink-0" />
                  <div className="h-px bg-[#9DB2BF]/40 flex-1" />
                </div>
                <p className="text-[11px] font-medium text-[#526D82] text-center">
                  Secure. Reliable. Always here to help.
                </p>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STATE 2 & 3: ROLE-SPECIFIC LOGIN FORM */}
          {/* ───────────────────────────────────────────────────────────── */}
          {loginState !== 'role_selection' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Back to Role Selection Button */}
              <button
                type="button"
                onClick={handleBackToRoleSelection}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526D82] hover:text-[#27374D] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Role Selection</span>
              </button>

              {/* Form Title */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#27374D] text-white uppercase">
                    {loginState === 'employee_login' ? '👤 EMPLOYEE' : '🧑‍💻 IT SUPPORT'}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-[#27374D]">
                  {loginState === 'employee_login' ? 'Employee Login' : 'IT Support Login'}
                </h1>
                <p className="text-xs text-[#526D82]">
                  {loginState === 'employee_login'
                    ? 'Enter your Employee ID and password to access employee services.'
                    : 'Enter your IT Support Employee ID to access technical queues.'}
                </p>
              </div>

              {/* Error Banner */}
              {currentError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{currentError}</span>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee ID Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#27374D]">
                    {loginState === 'employee_login' ? 'Employee ID' : 'IT Support Employee ID'}
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={handleEmployeeIdChange}
                    placeholder={loginState === 'employee_login' ? 'Enter your Employee ID' : 'Enter your IT Support Employee ID'}
                    className="w-full p-3 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF] text-xs sm:text-sm text-[#27374D] font-mono focus:border-[#27374D] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#27374D]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-[#526D82] hover:text-[#27374D] font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                      className="w-full p-3 pr-10 rounded-lg bg-[#DDE6ED]/40 border border-[#9DB2BF] text-xs sm:text-sm text-[#27374D] focus:border-[#27374D] focus:bg-white focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#526D82] hover:text-[#27374D] p-1 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#526D82]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-[#9DB2BF] text-[#27374D] focus:ring-[#27374D]"
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>{loginState === 'employee_login' ? 'Login as Employee' : 'Login as IT Support'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 text-center text-xs text-[#526D82] flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#9DB2BF]/40">
        <p>POWERGRID Corporation of India Limited</p>
        <p className="font-mono text-[11px] text-[#526D82]">
          Smart IT Helpdesk • GRIDMIND v2.4
        </p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#27374D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#9DB2BF] shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#27374D] text-white flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#27374D]">Reset Password</h3>
                <p className="text-xs text-[#526D82]">POWERGRID Self-Service Password Reset</p>
              </div>
            </div>

            <p className="text-xs text-[#526D82] leading-relaxed">
              To reset your Active Directory domain or SAP password, please visit the official POWERGRID Self-Service Password Portal at <strong>https://sspr.powergrid.in</strong> or contact the Helpdesk Desk at <strong>Ext 4444</strong>.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-lg bg-[#27374D] text-white text-xs font-semibold hover:bg-[#1e2b3c] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
