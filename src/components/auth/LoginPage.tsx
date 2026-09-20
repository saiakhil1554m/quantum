import React, { useState } from 'react';
import { useAuthStore, UserRole } from '../../store/useAuthStore';
import { Atom, GraduationCap, School, ShieldCheck, ArrowRight, Sparkles, User, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveEmail = email || (role === 'teacher' ? 'prof.feynman@quantum.edu' : 'student.alex@quantum.edu');
    login(effectiveEmail, role, name);
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    if (demoRole === 'student') {
      login('alex.student@quantum.edu', 'student', 'Alex Chen (Student)');
    } else {
      login('feynman.prof@quantum.edu', 'teacher', 'Prof. Richard Feynman (Educator)');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Quantum Grid Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Platform Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 mb-2">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Atom className="w-8 h-8 animate-spin-slow" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-100">QuantumMind AI Platform</h1>
          <p className="text-xs text-slate-400">Interactive Quantum Computing & AI Learning Platform</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              role === 'student'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              role === 'teacher'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <School className="w-4 h-4 text-purple-400" />
            <span>Teacher Portal</span>
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'teacher' ? 'Dr. Sarah Connor' : 'Alex Chen'}
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg pl-9 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {role === 'teacher' ? 'Educator Email' : 'Student Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'teacher' ? 'prof.feynman@quantum.edu' : 'student.alex@quantum.edu'}
                className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg pl-9 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg pl-9 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] ${
              role === 'student'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20'
            }`}
          >
            <span>{isRegister ? `Register as ${role === 'teacher' ? 'Teacher' : 'Student'}` : `Sign In to ${role === 'teacher' ? 'Educator Dashboard' : 'Student Platform'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-slate-500 tracking-wider">Quick Demo Access</span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* Quick Demo Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('student')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-cyan-300">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Demo Student</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Access Circuit Builder & Tutor</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('teacher')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-left transition-all group"
          >
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-purple-300">
              <School className="w-3.5 h-3.5" />
              <span>Demo Educator</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Access Class Analytics & Grading</p>
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-cyan-300 underline font-medium transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
};
