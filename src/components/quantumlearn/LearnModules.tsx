import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Menu, Search, Layers, Cpu } from 'lucide-react';

interface Props {
  onSelectLesson: () => void;
}

export const LearnModules: React.FC<Props> = ({ onSelectLesson }) => {
  const [filter, setFilter] = useState<'all' | 'progress' | 'completed'>('all');

  const modules = [
    {
      id: 'm1',
      title: 'Quantum Computing Introduction',
      desc: 'What is quantum computing and why it matters.',
      lessons: '6 lessons • 30 min',
      completed: true,
      icon: BookOpen,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    },
    {
      id: 'm2',
      title: 'Qubits and Measurement',
      desc: 'Understand qubits, states and measurement.',
      lessons: '6 lessons • 35 min',
      completed: false,
      icon: Layers,
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
    },
    {
      id: 'm3',
      title: 'Superposition',
      desc: 'Explore superposition and the Hadamard gate.',
      lessons: '6 lessons • 15 min',
      completed: false,
      icon: Cpu,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    },
    {
      id: 'm4',
      title: 'Basic Quantum Gates',
      desc: 'Learn X, Y, Z, S, T, RX, RY, RZ, CNOT and more.',
      lessons: '8 lessons • 20 min',
      completed: false,
      icon: Layers,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    },
    {
      id: 'm5',
      title: 'Entanglement and Bell State',
      desc: 'Entangle multiple qubits and test Bell states.',
      lessons: '6 lessons • 25 min',
      completed: false,
      icon: BookOpen,
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    },
  ];

  return (
    <div className="flex-1 bg-[#0b0d19] text-slate-100 p-4 space-y-4 overflow-y-auto pb-20 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Learn</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured lessons to build your quantum computing skills
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-xl bg-[#14172b] border border-[#232742] text-slate-300">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 p-1 bg-[#121526] rounded-xl border border-[#1e2238] text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('progress')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'progress'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Module List Cards */}
      <div className="space-y-3">
        {modules.map((m) => {
          const IconComp = m.icon;
          return (
            <div
              key={m.id}
              onClick={onSelectLesson}
              className="p-4 rounded-2xl bg-[#121526] hover:bg-[#181c33] border border-[#1e2238] transition-all cursor-pointer flex items-center justify-between space-x-3 active:scale-[0.99] group"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${m.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {m.title}
                    </h3>
                    {m.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{m.desc}</p>
                  <span className="inline-block text-[10px] font-mono text-indigo-400 pt-0.5">
                    {m.lessons}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
