import React, { useState } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { synthesizeCircuitFromPrompt } from '../../services/quantumApi';
import { CircuitSynthesisResponse } from '../../types/quantum';
import {
  Sparkles,
  Bot,
  Send,
  Cpu,
  ArrowRight,
  Code2,
  CheckCircle,
  X,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PROMPTS = [
  'Create a 3-qubit GHZ state with measurement on all qubits',
  'Build canonical Bell State (|00⟩ + |11⟩)/√2',
  'Synthesize Quantum Teleportation circuit transmitting qubit from Alice to Bob',
  "Construct Grover's Search algorithm amplifying marked state |11⟩",
  'Build Deutsch-Jozsa algorithm with balanced oracle',
];

export const PromptToCircuitModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { loadSynthesizedCircuit } = useQuantumStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CircuitSynthesisResponse | null>(null);

  if (!isOpen) return null;

  const handleSynthesize = async (queryText?: string) => {
    const textToRun = queryText || prompt;
    if (!textToRun.trim() || loading) return;

    setLoading(true);
    setResult(null);
    const res = await synthesizeCircuitFromPrompt(textToRun);
    setResult(res);
    setLoading(false);
  };

  const handleApplyToCanvas = () => {
    if (!result) return;
    loadSynthesizedCircuit(result.circuit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Natural Language Circuit Synthesis ("Prompt-to-Circuit")
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                AI translates high-level quantum prompts into OpenQASM & drag-and-drop circuit gates
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

        <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Algorithm Synthesis Prompts
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p);
                    handleSynthesize(p);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-purple-950/60 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-700/60 text-xs text-left transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSynthesize()}
              placeholder="e.g. Build 3-qubit GHZ state with measurement gates..."
              className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500 font-sans"
            />
            <button
              onClick={() => handleSynthesize()}
              disabled={loading || !prompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-40 flex items-center space-x-1.5 transition-all shadow-md shadow-purple-600/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize</span>
                </>
              )}
            </button>
          </div>

          {/* Synthesized Output Result */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Synthesized: {result.detectedAlgorithm}</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-400">
                    {result.circuit.numQubits} Qubits • {result.circuit.gates.length} Gates
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{result.explanation}</p>
              </div>

              {/* QASM Preview */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Generated OpenQASM Representation
                </span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto max-h-40 leading-relaxed">
                  {result.qasm}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Direct AST translation into visual canvas nodes.
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            {result && (
              <button
                onClick={handleApplyToCanvas}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <span>Load Directly onto Canvas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
