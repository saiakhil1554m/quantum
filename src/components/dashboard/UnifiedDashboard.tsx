import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Cpu,
  GraduationCap,
  School,
  Sparkles,
  Trophy,
  Bot,
  Layers,
  Code2,
  Users,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Activity,
  Sliders,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface Props {
  onOpenLearningPlatform: () => void;
  onOpenTeachingPlatform: () => void;
}

export const UnifiedDashboard: React.FC<Props> = ({
  onOpenLearningPlatform,
  onOpenTeachingPlatform,
}) => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Header */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold text-slate-100 leading-none">
              QuantumMind AI Hub
            </h1>
            <p className="text-[11px] text-cyan-400 mt-0.5 font-medium">
              Unified Quantum Learning & Educator Teaching Platform
            </p>
          </div>
        </div>

        {/* User Info & Sign Out */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-200">{user?.name}</span>
            <span className="text-[10px] font-mono text-slate-400 capitalize">
              Role: <span className={user?.role === 'teacher' ? 'text-purple-400 font-semibold' : 'text-cyan-400 font-semibold'}>{user?.role}</span> • {user?.xp || 350} XP
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all text-xs flex items-center space-x-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Dashboard Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8 z-10">
        {/* Welcome Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart India Hackathon SIH26140 AI Platform</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Welcome, {user?.name || 'Quantum Explorer'}!
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Select your platform below to start building quantum circuits, exploring multi-state statevectors, getting real-time Socratic AI tutoring, or managing educator assignments and test suites.
            </p>
          </div>
        </div>

        {/* Dual Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Card 1: Student Learning Platform */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-cyan-500/10 group relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-bold font-mono">
                  Student Portal
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  Quantum Learning Platform
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Interactive Drag-and-Drop Circuit Canvas, OpenQASM 3.0 & Qiskit Code Editor, Time-Travel Stepper, 3D Q-Sphere, and Socratic AI Tutor.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>React Flow Circuit Canvas</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Time-Travel State Stepper</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>3D Q-Sphere & Bloch View</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Socratic RAG AI Tutor</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Gamified Algorithm Lab</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Multi-SDK Code Syncer</span>
                </div>
              </div>
            </div>

            {/* Launch CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-800/80">
              <button
                onClick={onOpenLearningPlatform}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Launch Learning Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Educator Teaching Platform */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-purple-500/10 group relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <School className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-bold font-mono">
                  Educator Portal
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  Educator Teaching Platform
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Class Roster Management, Algorithmic Unitary Equivalence Tester, Auto-Grader, Custom Document Knowledge Ingestion for RAG Tutor.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Student Roster & XP Tracker</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Unitary Verifier U†U = I</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Fidelity & CNOT Grader</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>RAG Knowledge Base Trainer</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Custom Assignment Builder</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Class Performance Analytics</span>
                </div>
              </div>
            </div>

            {/* Launch CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-800/80">
              <button
                onClick={onOpenTeachingPlatform}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Launch Teaching Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* System Capabilities Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <Cpu className="w-5 h-5 text-cyan-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">16-Qubit Aer Engine</h4>
            <p className="text-[10px] text-slate-400">Zero-latency statevector sim</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <Bot className="w-5 h-5 text-purple-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">Socratic RAG Tutor</h4>
            <p className="text-[10px] text-slate-400">Context-injected guidance</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <Activity className="w-5 h-5 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">IBM Manila & Cairo Noise</h4>
            <p className="text-[10px] text-slate-400">Realistic noise models</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <Trophy className="w-5 h-5 text-emerald-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">BB84 & Grover Labs</h4>
            <p className="text-[10px] text-slate-400">Interactive quantum games</p>
          </div>
        </div>
      </main>
    </div>
  );
};
