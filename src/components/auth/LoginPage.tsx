import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Atom, ShieldCheck, ArrowRight, Sparkles, User, Lock, Mail, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

export interface ValidAccount {
  email: string;
  password: string;
  name: string;
  role: 'student';
}

export const VALID_ACCOUNTS: ValidAccount[] = [
  {
    email: 'alex.chen@quantum.edu',
    password: 'QuantumPass123!',
    name: 'Alex Chen',
    role: 'student',
  },
  {
    email: 'priya.sharma@quantum.edu',
    password: 'PriyaPass2026!',
    name: 'Priya Sharma',
    role: 'student',
  },
  {
    email: 'richard.feynman@quantum.edu',
    password: 'FeynmanPhysics123!',
    name: 'Prof. Richard Feynman',
    role: 'student',
  },
  {
    email: 'admin@quantum.edu',
    password: 'AdminQuantum2026!',
    name: 'Quantum Administrator',
    role: 'student',
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('alex.chen@quantum.edu');
  const [password, setPassword] = useState('QuantumPass123!');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (isRegister) {
      if (!name.trim() || !cleanEmail || !cleanPassword) {
        setErrorMessage('Please fill out all registration fields.');
        return;
      }
      login(cleanEmail, 'student', name);
      return;
    }

    // Check valid user accounts database
    const matchingAccount = VALID_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPassword
    );

    if (matchingAccount) {
      login(matchingAccount.email, matchingAccount.role, matchingAccount.name);
    } else {
      setErrorMessage(
        'Invalid email or password. Please select one of the valid demo credentials below.'
      );
    }
  };

  const handleFillAccount = (acc: ValidAccount) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-y-auto font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-5 my-8">
        {/* Platform Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 mb-1">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Atom className="w-8 h-8 animate-spin-slow" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-100">QuantumMind Platform</h1>
          <p className="text-xs text-slate-400">Interactive Quantum Computing & AI Studio</p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-start space-x-2 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

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
                  placeholder="Alex Chen"
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg pl-9 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              User Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.chen@quantum.edu"
                className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg pl-9 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
                required
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
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20"
          >
            <span>{isRegister ? 'Register & Launch Platform' : 'Sign In to Quantum Studio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Valid Registered Users Quick Fill Section */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-300">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>Valid Accounts (Click to Fill):</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {VALID_ACCOUNTS.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleFillAccount(acc)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  email === acc.email
                    ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-300 font-medium'
                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{acc.name}</span>
                  {email === acc.email && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                </div>
                <div className="font-mono text-slate-400 text-[9px] truncate mt-0.5">{acc.email}</div>
                <div className="font-mono text-cyan-400/80 text-[9px] mt-0.5">Pass: {acc.password}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage(null);
            }}
            className="text-xs text-slate-400 hover:text-cyan-300 underline font-medium transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
};
