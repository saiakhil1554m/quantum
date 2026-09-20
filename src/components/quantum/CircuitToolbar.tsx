import React, { useState } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Play,
  Trash2,
  Code2,
  Plus,
  Minus,
  Cpu,
  GraduationCap,
  Star,
  School,
  LogOut,
  Zap,
  Sparkles,
  Trophy,
  Clock,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { CourseDashboardModal } from '../lms/CourseDashboardModal';
import { TranspilerDiffModal } from './TranspilerDiffModal';
import { PromptToCircuitModal } from './PromptToCircuitModal';
import { AlgorithmLabModal } from '../lms/AlgorithmLabModal';
import { NoiseModelType } from '../../types/quantum';

interface Props {
  onOpenTeacherDashboard?: () => void;
  onToggleCodeEditor?: () => void;
  isCodeEditorOpen?: boolean;
  onToggleTimeTravel?: () => void;
  isTimeTravelOpen?: boolean;
}

export const CircuitToolbar: React.FC<Props> = ({
  onOpenTeacherDashboard,
  onToggleCodeEditor,
  isCodeEditorOpen,
  onToggleTimeTravel,
  isTimeTravelOpen,
}) => {
  const {
    numQubits,
    setNumQubits,
    gates,
    clearCircuit,
    runSimulation,
    isSimulating,
    noiseModel,
    setNoiseModel,
  } = useQuantumStore();

  const { user, logout } = useAuthStore();

  const [showLmsModal, setShowLmsModal] = useState(false);
  const [showTranspilerModal, setShowTranspilerModal] = useState(false);
  const [showPromptToCircuitModal, setShowPromptToCircuitModal] = useState(false);
  const [showAlgorithmLabModal, setShowAlgorithmLabModal] = useState(false);

  return (
    <>
      <div className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-30">
        {/* Left section: Qubit counter, brand and memory wall protection */}
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-slate-100 leading-none">Quantum Studio</h1>
              <p className="text-[10px] text-slate-400 mt-0.5">{gates.length} Gates • {numQubits} Qubits</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* Qubit count modifier with memory wall limiter */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 px-2 font-medium">Qubits:</span>
            <button
              onClick={() => setNumQubits(numQubits - 1)}
              disabled={numQubits <= 1}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 flex items-center justify-center transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-xs font-mono font-bold text-cyan-300">{numQubits}</span>
            <button
              onClick={() => setNumQubits(numQubits + 1)}
              disabled={numQubits >= 16}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 flex items-center justify-center transition-colors"
              title={numQubits >= 16 ? 'Memory Wall Protection: Statevector capped at 16 qubits' : undefined}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Noise Model Selector (Simulated Real-World Noise Profiles) */}
          <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-400">Profile:</span>
            <select
              value={noiseModel}
              onChange={(e) => setNoiseModel(e.target.value as NoiseModelType)}
              className="bg-transparent text-cyan-300 font-mono text-[11px] cursor-pointer focus:outline-none"
            >
              <option value="ideal" className="bg-slate-900 text-slate-200">
                Ideal Simulator (Aer)
              </option>
              <option value="fake_manila" className="bg-slate-900 text-amber-300">
                IBM FakeManila (T1/T2)
              </option>
              <option value="fake_cairo" className="bg-slate-900 text-rose-300">
                IBM FakeCairo (Readout Err)
              </option>
            </select>
          </div>
        </div>

        {/* Center/Right section: High-Impact Feature Triggers */}
        <div className="flex items-center space-x-2.5">
          {/* Prompt-to-Circuit Synthesizer */}
          <button
            onClick={() => setShowPromptToCircuitModal(true)}
            className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/80 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
            title="Generate Circuit from Natural Language Prompt"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Prompt-to-Circuit</span>
          </button>

          {/* Circuit Transpiler / Optimizer */}
          <button
            onClick={() => setShowTranspilerModal(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/80 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
            title="Automated Circuit Optimization & Transpiler Visualizer"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transpiler Diff</span>
          </button>

          {/* Time-Travel Debugger Toggle */}
          <button
            onClick={onToggleTimeTravel}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              isTimeTravelOpen
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Quantum Time-Travel State Stepper"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Time-Travel Stepper</span>
          </button>

          {/* Gamified Algorithm Lab & Auto-Grader */}
          <button
            onClick={() => setShowAlgorithmLabModal(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border border-amber-800/80 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
            title="Open Gamified Algorithm Lab (BB84 Eve Mode, Grover, Teleportation)"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Algorithm Lab</span>
          </button>

          {/* Bi-directional Code Editor Toggle */}
          <button
            onClick={onToggleCodeEditor}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              isCodeEditorOpen
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Bi-directional OpenQASM 3.0 / Python Qiskit Editor"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Editor</span>
          </button>

          <div className="h-6 w-px bg-slate-800" />

          {/* Educator Switch button if teacher */}
          {user?.role === 'teacher' && onOpenTeacherDashboard && (
            <button
              onClick={onOpenTeacherDashboard}
              className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800 text-xs font-semibold flex items-center space-x-1 transition-all"
            >
              <School className="w-3.5 h-3.5 text-purple-400" />
              <span>Teacher LMS</span>
            </button>
          )}

          {/* Clear Circuit */}
          <button
            onClick={clearCircuit}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/50 transition-colors"
            title="Clear all gates from circuit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Run Simulation Button */}
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSimulating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run</span>
              </>
            )}
          </button>

          {/* User Sign Out */}
          {user && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
              title={`Logged in as ${user.name} (${user.role}). Click to Sign Out.`}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <CourseDashboardModal isOpen={showLmsModal} onClose={() => setShowLmsModal(false)} />
      <TranspilerDiffModal isOpen={showTranspilerModal} onClose={() => setShowTranspilerModal(false)} />
      <PromptToCircuitModal isOpen={showPromptToCircuitModal} onClose={() => setShowPromptToCircuitModal(false)} />
      <AlgorithmLabModal isOpen={showAlgorithmLabModal} onClose={() => setShowAlgorithmLabModal(false)} />
    </>
  );
};
