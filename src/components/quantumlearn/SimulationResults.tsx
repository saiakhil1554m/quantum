import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, MoreVertical, RefreshCw, Download, Cpu } from 'lucide-react';
import { ProbabilityChart } from '../visualization/ProbabilityChart';

interface Props {
  onBack: () => void;
  onRunAgain: () => void;
}

export const SimulationResults: React.FC<Props> = ({ onBack, onRunAgain }) => {
  const [tab, setTab] = useState<'measurement' | 'statevector' | 'info'>('measurement');

  return (
    <div className="flex-1 bg-[#0b0d19] text-slate-100 p-4 space-y-4 overflow-y-auto pb-24 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Simulation Results</span>
        </button>

        <button className="text-slate-400 hover:text-slate-200">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Green Completed Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 flex items-center space-x-3 shadow-lg">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-100">Simulation completed!</h3>
          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Executed with 1024 shots</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 p-1 bg-[#121526] rounded-xl border border-[#1e2238] text-xs">
        <button
          onClick={() => setTab('measurement')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            tab === 'measurement'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Measurement
        </button>
        <button
          onClick={() => setTab('statevector')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            tab === 'statevector'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Statevector
        </button>
        <button
          onClick={() => setTab('info')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            tab === 'info'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Info
        </button>
      </div>

      {/* Probability Chart Container */}
      <div className="p-4 rounded-2xl bg-[#121526] border border-[#1e2238] space-y-3 shadow-lg">
        <h3 className="text-xs font-bold text-slate-200">Probability Histogram</h3>
        <div className="h-44 w-full">
          <ProbabilityChart />
        </div>
      </div>

      {/* Counts Summary Table */}
      <div className="p-4 rounded-2xl bg-[#121526] border border-[#1e2238] space-y-3 shadow-lg text-xs font-sans">
        <h3 className="text-xs font-bold text-slate-200">Counts Summary</h3>
        <div className="space-y-2 font-mono">
          <div className="flex items-center justify-between py-1 border-b border-[#1e2238] text-slate-400">
            <span>State</span>
            <span>Shots</span>
            <span>Probability</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span className="text-cyan-300 font-bold">00</span>
            <span>512</span>
            <span>50.0%</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span className="text-cyan-300 font-bold">11</span>
            <span>512</span>
            <span>50.0%</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1e2238] space-y-1 text-[11px] text-slate-400">
          <div className="flex justify-between">
            <span>Shots:</span>
            <span className="text-slate-200 font-mono">1024</span>
          </div>
          <div className="flex justify-between">
            <span>Qubits:</span>
            <span className="text-slate-200 font-mono">2</span>
          </div>
          <div className="flex justify-between">
            <span>Circuit Depth:</span>
            <span className="text-slate-200 font-mono">3</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={onRunAgain}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Run Again</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => alert('Circuit counts exported!')}
            className="py-2.5 rounded-full bg-[#14172b] hover:bg-[#1c213d] border border-[#232742] text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onBack}
            className="py-2.5 rounded-full bg-[#14172b] hover:bg-[#1c213d] border border-[#232742] text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>View Circuit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
