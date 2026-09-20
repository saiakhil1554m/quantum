import React, { useState } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LayoutDashboard,
  Play,
  Trash2,
  Code2,
  Plus,
  Minus,
  Cpu,
  School,
  LogOut,
  Zap,
  Sparkles,
  Trophy,
  Clock,
  Sliders,
  Menu,
  X,
} from 'lucide-react';
import { CourseDashboardModal } from '../lms/CourseDashboardModal';
import { TranspilerDiffModal } from './TranspilerDiffModal';
import { PromptToCircuitModal } from './PromptToCircuitModal';
import { AlgorithmLabModal } from '../lms/AlgorithmLabModal';
import { NoiseModelType } from '../../types/quantum';

interface Props {
  onOpenDashboard?: () => void;
  onOpenTeacherDashboard?: () => void;
  onToggleCodeEditor?: () => void;
  isCodeEditorOpen?: boolean;
  onToggleTimeTravel?: () => void;
  isTimeTravelOpen?: boolean;
}

export const CircuitToolbar: React.FC<Props> = ({
  onOpenDashboard,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 md:px-6 flex items-center justify-between shrink-0 z-30 relative">
        {/* Left section: Qubit counter & brand */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-slate-100 leading-none">Quantum Studio</h1>
              <p className="text-[10px] text-slate-400 mt-0.5">{gates.length} Gates • {numQubits} Q</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Qubit count modifier with touch-friendly targets */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 px-1 hidden sm:inline font-medium">Qubits:</span>
            <button
              onClick={() => setNumQubits(numQubits - 1)}
              disabled={numQubits <= 1}
              className="w-7 h-7 md:w-6 md:h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 flex items-center justify-center transition-colors active:scale-95 touch-manipulation"
              aria-label="Decrease Qubits"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-xs font-mono font-bold text-cyan-300">{numQubits}</span>
            <button
              onClick={() => setNumQubits(numQubits + 1)}
              disabled={numQubits >= 16}
              className="w-7 h-7 md:w-6 md:h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 flex items-center justify-center transition-colors active:scale-95 touch-manipulation"
              aria-label="Increase Qubits"
              title={numQubits >= 16 ? 'Memory Wall Protection: Capped at 16 qubits' : undefined}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Noise Model Selector (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
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

        {/* Center/Right section: Desktop feature triggers */}
        <div className="hidden md:flex items-center space-x-2.5">
          <button
            onClick={() => setShowPromptToCircuitModal(true)}
            className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/80 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Prompt-to-Circuit</span>
          </button>

          <button
            onClick={() => setShowTranspilerModal(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/80 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transpiler Diff</span>
          </button>

          <button
            onClick={onToggleTimeTravel}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              isTimeTravelOpen
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Time-Travel</span>
          </button>

          <button
            onClick={() => setShowAlgorithmLabModal(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border border-amber-800/80 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Algorithm Lab</span>
          </button>

          <button
            onClick={onToggleCodeEditor}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              isCodeEditorOpen
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Editor</span>
          </button>

          <div className="h-6 w-px bg-slate-800" />

          {onOpenDashboard && (
            <button
              onClick={onOpenDashboard}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Return to Main Unified Dashboard Hub"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dashboard Hub</span>
            </button>
          )}

          {onOpenTeacherDashboard && (
            <button
              onClick={onOpenTeacherDashboard}
              className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Switch to Educator Teaching Platform"
            >
              <School className="w-3.5 h-3.5 text-purple-400" />
              <span>Teaching Platform</span>
            </button>
          )}

          <button
            onClick={clearCircuit}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
            title="Clear all gates"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5 disabled:opacity-50 transition-all active:scale-95"
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

          {user && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile controls & Menu toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={clearCircuit}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 touch-manipulation active:scale-95"
            aria-label="Clear Circuit"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center space-x-1 touch-manipulation active:scale-95"
          >
            {isSimulating ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Run</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700 touch-manipulation active:scale-95"
            aria-label="Open Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-slate-900/98 border-b border-slate-800 p-4 z-40 space-y-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setShowPromptToCircuitModal(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/80 font-semibold flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Prompt-to-Circuit</span>
            </button>

            <button
              onClick={() => {
                setShowTranspilerModal(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 font-semibold flex items-center space-x-2"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Transpiler Diff</span>
            </button>

            <button
              onClick={() => {
                onToggleTimeTravel?.();
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/80 font-semibold flex items-center space-x-2"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Time-Travel Stepper</span>
            </button>

            <button
              onClick={() => {
                setShowAlgorithmLabModal(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-amber-950/50 text-amber-300 border border-amber-800/80 font-semibold flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Algorithm Lab</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400">Noise Profile:</span>
            <select
              value={noiseModel}
              onChange={(e) => setNoiseModel(e.target.value as NoiseModelType)}
              className="bg-slate-950 text-cyan-300 font-mono text-xs px-2 py-1 rounded border border-slate-800"
            >
              <option value="ideal">Ideal Aer</option>
              <option value="fake_manila">IBM Manila (T1/T2)</option>
              <option value="fake_cairo">IBM Cairo (Readout)</option>
            </select>
          </div>

          {user && (
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/60 text-xs font-semibold flex items-center justify-center space-x-2 mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out ({user.name})</span>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <CourseDashboardModal isOpen={showLmsModal} onClose={() => setShowLmsModal(false)} />
      <TranspilerDiffModal isOpen={showTranspilerModal} onClose={() => setShowTranspilerModal(false)} />
      <PromptToCircuitModal isOpen={showPromptToCircuitModal} onClose={() => setShowPromptToCircuitModal(false)} />
      <AlgorithmLabModal isOpen={showAlgorithmLabModal} onClose={() => setShowAlgorithmLabModal(false)} />
    </>
  );
};

