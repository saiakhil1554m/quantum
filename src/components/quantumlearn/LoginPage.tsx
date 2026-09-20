import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Atom, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';

interface Props {
  onLoginSuccess: () => void;
  onBackToSplash?: () => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess, onBackToSplash }) => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const nameFromEmail = email.split('@')[0] || 'Jaswanth';
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      
      login(email, 'student', formattedName);
      setIsSubmitting(false);
      onLoginSuccess();
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      login('jaswanth@quantumlearn.ai', 'student', 'Jaswanth');
      setIsSubmitting(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen w-screen bg-[#0b0d19] text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-2 z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-[#0b0d19] rounded-[10px] flex items-center justify-center text-purple-400">
              <Atom className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-100">QuantumLearn</span>
        </div>

        {onBackToSplash && (
          <button
            onClick={onBackToSplash}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Login Card Form */}
      <div className="w-full max-w-sm mx-auto my-auto py-6 space-y-6 z-10">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to continue your quantum learning journey</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-300">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@quantum.edu"
                className="w-full bg-[#121526] text-slate-100 placeholder-slate-500 text-xs pl-10 pr-4 py-3 rounded-2xl border border-[#1e2238] focus:outline-none focus:border-indigo-500 transition-all font-sans"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-semibold text-slate-300">Password</label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[10px] text-indigo-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121526] text-slate-100 placeholder-slate-500 text-xs pl-10 pr-10 py-3 rounded-2xl border border-[#1e2238] focus:outline-none focus:border-indigo-500 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1e2238]" />
          </div>
          <span className="relative px-3 bg-[#0b0d19] text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Or quick access
          </span>
        </div>

        {/* Quick Demo Button */}
        <button
          onClick={handleQuickDemoLogin}
          className="w-full py-3 px-4 rounded-2xl bg-[#121526] hover:bg-[#181c33] border border-[#1e2238] text-slate-300 font-semibold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Instant Demo Student Login</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center text-[10px] text-slate-500 z-10 pb-2">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Encrypted Session • Quantum Sandbox v2.5</span>
        </div>
      </div>
    </div>
  );
};
