import React, { useState } from 'react';
import { ChevronLeft, Bookmark, ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { BlochSphereView } from '../visualization/BlochSphereView';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

export const LessonView: React.FC<Props> = ({ onBack, onNext }) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'example' | 'try'>('explanation');

  return (
    <div className="flex-1 bg-[#0b0d19] text-slate-100 p-4 space-y-4 overflow-y-auto pb-20 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Superposition</span>
        </button>

        <button className="text-slate-400 hover:text-slate-200">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Lesson Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-[#1a1e36] rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full w-[25%]" />
        </div>
        <div className="text-[10px] text-right font-mono text-slate-400">1/6</div>
      </div>

      {/* Lesson Title & Concept Body */}
      <div className="space-y-2">
        <h1 className="text-lg font-bold text-slate-100">The Hadamard Gate</h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Hadamard gate creates an equal superposition of |0⟩ and |1⟩.
        </p>
      </div>

      {/* LaTeX Quantum Math Card */}
      <div className="p-4 rounded-2xl bg-[#121526] border border-[#1e2238] text-center space-y-1 font-mono text-sm shadow-lg">
        <div className="text-indigo-300 font-bold text-base tracking-wide">
          H|0⟩ = <span className="text-cyan-300">1/√2</span> (|0⟩ + |1⟩)
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 p-1 bg-[#121526] rounded-xl border border-[#1e2238] text-xs">
        <button
          onClick={() => setActiveTab('explanation')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'explanation'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Explanation
        </button>
        <button
          onClick={() => setActiveTab('example')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'example'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Example
        </button>
        <button
          onClick={() => setActiveTab('try')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'try'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Try It
        </button>
      </div>

      {/* Key Points */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Key Points</h3>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-start space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
            <span>A qubit can be in a superposition of |0⟩ and |1⟩.</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0 mt-1.5" />
            <span>Measurement gives 0 or 1 probabilistically.</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
            <span>The Hadamard gate creates an equal superposition from |0⟩.</span>
          </div>
        </div>
      </div>

      {/* Bloch Sphere Interactive View Card */}
      <div className="p-4 rounded-2xl bg-[#121526] border border-[#1e2238] space-y-2 shadow-lg">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Bloch Sphere View</span>
          </div>
        </div>

        <div className="h-44 w-full rounded-xl overflow-hidden bg-[#0a0c16]">
          <BlochSphereView />
        </div>

        <p className="text-[10px] font-mono text-slate-400 text-center">
          H|0⟩ lies on the equator of the Bloch sphere.
        </p>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center space-x-3 pt-2">
        <button
          onClick={onBack}
          className="px-4 py-3 rounded-full bg-[#14172b] hover:bg-[#1c213d] border border-[#232742] text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Next Lesson</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
