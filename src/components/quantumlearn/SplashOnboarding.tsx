import React from 'react';
import { Atom, ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
  onGoToLogin?: () => void;
}

export const SplashOnboarding: React.FC<Props> = ({ onStart, onGoToLogin }) => {
  const handleGetStarted = () => {
    if (onGoToLogin) {
      onGoToLogin();
    } else {
      onStart();
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0b0d19] text-slate-100 flex flex-col items-center justify-between p-6 relative overflow-hidden font-sans">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Logo */}
      <div className="w-full flex items-center justify-between pt-2 z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-[#0b0d19] rounded-[10px] flex items-center justify-center text-purple-400">
              <Atom className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-100">QuantumLearn</span>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#14172b] border border-[#232742] flex items-center justify-center text-xs font-bold text-indigo-300">
          J
        </div>
      </div>

      {/* Center 3D Glowing Quantum Orb Visual */}
      <div className="my-auto py-8 flex flex-col items-center text-center relative z-10 space-y-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer glowing orbital rings */}
          <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping opacity-25" />
          <div className="absolute inset-2 rounded-full border border-purple-500/40 animate-pulse" />
          <div className="absolute inset-6 rounded-full border border-cyan-500/30 rotate-45 animate-spin-slow" />

          {/* Core sphere with rich gradient glow */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-1 shadow-[0_0_60px_rgba(99,102,241,0.6)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0d0f22] flex items-center justify-center relative overflow-hidden">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/40 via-purple-500/40 to-transparent blur-md animate-pulse" />
              <Atom className="w-24 h-24 text-indigo-300 relative z-10 opacity-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </div>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="space-y-2 max-w-xs">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">QuantumLearn</h1>
          <p className="text-xs text-indigo-300/90 font-medium">Explore. Build. Simulate. Understand.</p>
          <p className="text-xs text-slate-400 pt-3 leading-relaxed">
            Your journey to quantum computing starts here. Master qubits, superposition & circuits.
          </p>
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="w-full max-w-xs space-y-4 text-center z-10 pb-4">
        <button
          onClick={handleGetStarted}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleGetStarted}
          className="text-xs text-slate-400 hover:text-indigo-300 transition-colors font-medium underline underline-offset-4"
        >
          I already have an account
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center space-x-1.5 pt-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <span className="w-2 h-2 rounded-full bg-[#1e233d]" />
          <span className="w-2 h-2 rounded-full bg-[#1e233d]" />
        </div>
      </div>
    </div>
  );
};

