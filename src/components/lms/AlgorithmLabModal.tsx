import React, { useState } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { useAuthStore } from '../../store/useAuthStore';
import { gradeAlgorithmFidelity } from '../../services/quantumApi';
import { FidelityGradeResponse } from '../../types/quantum';
import {
  Trophy,
  ShieldAlert,
  Search,
  Share2,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  X,
  Play,
  Award,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmLabModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { getCircuitPayload, loadPreset } = useQuantumStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'bb84' | 'teleport' | 'grover' | 'bell' | 'deutsch' | 'superposition'>('bb84');
  const [eveIntercepting, setEveIntercepting] = useState(false);
  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<FidelityGradeResponse | null>(null);

  if (!isOpen) return null;

  const handleGradeCurrentCircuit = async (challengeId: string) => {
    setGrading(true);
    setGradeResult(null);
    const circuit = getCircuitPayload();
    const res = await gradeAlgorithmFidelity(circuit, challengeId);
    setGradeResult(res);
    setGrading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <span>Gamified Quantum Algorithm Lab</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                  Auto-Grader Enabled
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive sandboxes: Superposition, Bell States, Teleportation, Deutsch-Jozsa, Grover Search & BB84 QKD Eve Interception
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex items-center space-x-2 py-3 border-b border-slate-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('bb84');
              setGradeResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'bb84'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>BB84 QKD (Eve Mode)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('grover');
              setGradeResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'grover'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Grover's Search</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('teleport');
              setGradeResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'teleport'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Teleportation Protocol</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bell');
              setGradeResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'bell'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bell States (|Φ+⟩)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('deutsch');
              setGradeResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'deutsch'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Deutsch-Jozsa</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('superposition');
              setGradeResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'superposition'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Superposition (|+⟩)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 min-h-0">
          {/* TAB 1: BB84 QKD WITH EVE INTERCEPTION */}
          {activeTab === 'bb84' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Interactive BB84 Protocol & Eavesdropper Detection</span>
                  </h3>

                  {/* Toggle Eve Eavesdropper */}
                  <button
                    onClick={() => setEveIntercepting(!eveIntercepting)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 border transition-all ${
                      eveIntercepting
                        ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {eveIntercepting ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>{eveIntercepting ? 'Eve Eavesdropping: ACTIVE' : 'Eve: OFF (Secure)'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  In BB84, Alice transmits photon qubits prepared in rectilinear (+: |0⟩, |1⟩) or diagonal (×: |+⟩, |-⟩)
                  bases. By the <strong>No-Cloning Theorem</strong> and quantum state collapse, an eavesdropper ("Eve")
                  cannot measure the qubit without irreversibly disturbing the superposition state and introducing detectable
                  bit errors.
                </p>

                {/* Simulation Transmission Visualizer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-cyan-400 font-bold mb-1">Alice's Transmission</div>
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div>Bits: <strong className="text-cyan-300">1 0 1 1 0</strong></div>
                      <div>Bases: <strong className="text-purple-400">+ × + × +</strong></div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border transition-all ${eveIntercepting ? 'bg-rose-950/50 border-rose-600' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="text-[10px] font-bold mb-1 flex items-center space-x-1">
                      <span className={eveIntercepting ? 'text-rose-400' : 'text-slate-500'}>
                        Quantum Channel {eveIntercepting ? '(INTERCEPTED)' : '(SECURE)'}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      {eveIntercepting ? (
                        <>
                          <div className="text-rose-300 font-bold animate-pulse">Eve intercepted in random basis!</div>
                          <div className="text-[10px] text-rose-400">State collapsed irreversibly.</div>
                        </>
                      ) : (
                        <div className="text-slate-400 text-[10px]">Unperturbed superposition states passing through channel.</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-emerald-400 font-bold mb-1">Bob's Sifted Key</div>
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div>
                        QBER Error Rate:{' '}
                        <strong className={eveIntercepting ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}>
                          {eveIntercepting ? '26.8% (Eavesdropper Detected!)' : '0.0% (Secure Channel)'}
                        </strong>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {eveIntercepting ? 'Protocol Aborted! Secret key discarded.' : 'Shared Secret Key Verified.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GROVER'S SEARCH */}
          {activeTab === 'grover' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Grover's Quantum Search Algorithm</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Grover's algorithm searches an unsorted database of N = 2^n elements in O(√N) queries instead of
                classical O(N). It alternates between an <strong>Oracle</strong> (which marks the target state with a -1 phase)
                and the <strong>Grover Diffusion Operator</strong> (which inverts all amplitudes about their mean, amplifying
                the target state probability).
              </p>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="text-cyan-400 font-bold text-[11px]">Grover Step Pipeline:</div>
                <div className="text-slate-300">1. Initialize equal superposition: H on all qubits.</div>
                <div className="text-slate-300">2. Apply Phase Oracle: CZ gate flips phase of target |11⟩.</div>
                <div className="text-slate-300">3. Apply Diffusion Operator: H, Z, CZ, H inverts about mean.</div>
                <div className="text-emerald-400 font-bold">Outcome: Probability of |11⟩ amplified to 100%!</div>
              </div>
            </div>
          )}

          {/* TAB 3: TELEPORTATION */}
          {activeTab === 'teleport' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-purple-400" />
                <span>Quantum Teleportation Protocol</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transmits an unknown quantum state |ψ⟩ from Alice (q[0]) to Bob (q[2]) without sending the physical
                particle. Uses a shared entangled Bell pair (q[1], q[2]), Bell basis measurement by Alice, and classical
                feed-forward correction gates (X and Z) by Bob.
              </p>
            </div>
          )}

          {/* TAB 4: BELL STATES */}
          {activeTab === 'bell' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Bell State (|Φ+⟩ = (|00⟩ + |11⟩)/√2)</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Construct the fundamental maximum entangled 2-qubit state using a Hadamard gate on q[0] followed by a
                CNOT gate with control q[0] and target q[1].
              </p>
            </div>
          )}

          {/* TAB 5: DEUTSCH-JOZSA */}
          {activeTab === 'deutsch' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Deutsch-Jozsa Algorithm (Constant vs. Balanced Oracle)</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Determines whether an unknown black-box Boolean function f(x) is constant (same output for all inputs)
                or balanced (output 0 for half and 1 for half) in a <strong>single quantum query</strong>, achieving exponential speedup
                over classical determinism. Uses an ancillary qubit in |-⟩ for phase kickback.
              </p>
            </div>
          )}

          {/* TAB 6: SUPERPOSITION & INTERFERENCE */}
          {activeTab === 'superposition' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Quantum Superposition & Phase Interference</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Explore single-qubit Hadamard superposition (|+⟩ = (|0⟩+|1⟩)/√2) and apply continuous phase rotations Rz(φ)
                to observe constructive and destructive quantum interference on the Bloch sphere and probability histogram.
              </p>
            </div>
          )}

          {/* Auto-Grader Assessment Panel */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Quantum State Fidelity Auto-Grader</h4>
                  <p className="text-[10px] text-slate-400">
                    Calculates F = |⟨ψ_target | ψ_student⟩|² from your active canvas circuit
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleGradeCurrentCircuit(activeTab)}
                disabled={grading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center space-x-1.5 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {grading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Grade Active Circuit</span>
                  </>
                )}
              </button>
            </div>

            {/* Grade Result Card */}
            {gradeResult && (
              <div
                className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
                  gradeResult.passed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                {gradeResult.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      Fidelity Score: {(gradeResult.fidelity * 100).toFixed(1)}%
                    </span>
                    {gradeResult.passed && (
                      <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-mono text-[10px] font-bold">
                        +{gradeResult.xpAwarded} XP Awarded!
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200">{gradeResult.feedback}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Target: {gradeResult.targetStateDescription}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Current User XP: <strong className="text-amber-400 font-mono">{user?.xp || 350} XP</strong>
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (activeTab === 'bell') loadPreset('Bell State');
                else if (activeTab === 'teleport') loadPreset('Quantum Teleportation');
                else if (activeTab === 'grover') loadPreset("Grover's Search");
                else if (activeTab === 'deutsch') loadPreset('Deutsch-Jozsa');
                else if (activeTab === 'superposition') loadPreset('Superposition & Interference');
                else if (activeTab === 'bb84') loadPreset('Superposition & Interference');
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-600/20"
            >
              <span>Load Template onto Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
