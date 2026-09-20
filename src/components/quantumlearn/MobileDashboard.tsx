import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Atom,
  BookOpen,
  CheckSquare,
  Trophy,
  Clock,
  Play,
  ChevronRight,
  Sparkles,
  Cpu,
  Bot,
  Layers
} from 'lucide-react';

interface Props {
  onNavigate: (tab: 'home' | 'learn' | 'playground' | 'tutor' | 'lesson' | 'quiz') => void;
}

export const MobileDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const name = user?.name || 'Jaswanth';

  return (
    <div className="flex-1 bg-[#0b0d19] text-slate-100 p-4 space-y-5 overflow-y-auto pb-20 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md shadow-purple-500/20">
            <div className="w-full h-full bg-[#0b0d19] rounded-[10px] flex items-center justify-center text-purple-400">
              <Atom className="w-4 h-4" />
            </div>
          </div>
          <span className="text-base font-extrabold text-slate-100">QuantumLearn</span>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#181c33] border border-[#252b4d] flex items-center justify-center text-xs font-bold text-indigo-300">
          {name.charAt(0)}
        </div>
      </div>

      {/* Greeting Banner */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-100">Hi, {name} 👋</h2>
        <p className="text-xs text-slate-400">Ready to explore the quantum world today?</p>
      </div>

      {/* Continue Learning Highlight Banner */}
      <div className="p-4 rounded-2xl bg-[#121526] border border-[#1e2238] shadow-lg relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Continue Learning</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('lesson')}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-transform shrink-0"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
            <div>
              <h3 className="text-xs font-bold text-slate-100 leading-snug">
                Superposition and the Hadamard Gate
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Module 3 • Lesson 1</p>
            </div>
          </div>

          <button onClick={() => onNavigate('lesson')} className="text-slate-400 hover:text-slate-200">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Progress</span>
            <span className="text-indigo-400 font-bold">60%</span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1e36] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[60%]" />
          </div>
        </div>
      </div>

      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-3 rounded-2xl bg-[#121526] border border-[#1e2238] text-center space-y-1">
          <BookOpen className="w-4 h-4 text-cyan-400 mx-auto" />
          <div className="text-sm font-bold text-slate-100">12</div>
          <div className="text-[9px] text-slate-400">Lessons</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#121526] border border-[#1e2238] text-center space-y-1">
          <CheckSquare className="w-4 h-4 text-emerald-400 mx-auto" />
          <div className="text-sm font-bold text-slate-100">3</div>
          <div className="text-[9px] text-slate-400">Quizzes</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#121526] border border-[#1e2238] text-center space-y-1">
          <Trophy className="w-4 h-4 text-amber-400 mx-auto" />
          <div className="text-sm font-bold text-slate-100">2</div>
          <div className="text-[9px] text-slate-400">Challenges</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#121526] border border-[#1e2238] text-center space-y-1">
          <Clock className="w-4 h-4 text-indigo-400 mx-auto" />
          <div className="text-sm font-bold text-slate-100">8.4 h</div>
          <div className="text-[9px] text-slate-400">Learned</div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200">Quick Actions</h3>
          <button onClick={() => onNavigate('learn')} className="text-[10px] text-indigo-400 font-semibold hover:underline">
            See All &gt;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate('learn')}
            className="p-3.5 rounded-2xl bg-[#121526] hover:bg-[#181c33] border border-[#1e2238] text-left transition-all flex items-center space-x-3 active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Learn Concepts</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Interactive modules</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('playground')}
            className="p-3.5 rounded-2xl bg-[#121526] hover:bg-[#181c33] border border-[#1e2238] text-left transition-all flex items-center space-x-3 active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Open Playground</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Circuit Studio</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('tutor')}
            className="p-3.5 rounded-2xl bg-[#121526] hover:bg-[#181c33] border border-[#1e2238] text-left transition-all flex items-center space-x-3 active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Ask AI Tutor</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Socratic help</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="p-3.5 rounded-2xl bg-[#121526] hover:bg-[#181c33] border border-[#1e2238] text-left transition-all flex items-center space-x-3 active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Take Quiz</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Test knowledge</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
