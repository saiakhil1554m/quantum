import React, { useState, useEffect } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { optimizeCircuit } from '../../services/quantumApi';
import { CircuitOptimizationResponse } from '../../types/quantum';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Layers,
  X,
  Cpu,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TranspilerDiffModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { getCircuitPayload, applyOptimizedCircuit, generateQasm } = useQuantumStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CircuitOptimizationResponse | null>(null);

  useEffect(() => {
    if (isOpen) {
      const runOpt = async () => {
        setLoading(true);
        const payload = getCircuitPayload();
        const res = await optimizeCircuit(payload);
        setResult(res);
        setLoading(false);
      };
      runOpt();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rawQasm = generateQasm();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Automated Quantum Circuit Transpiler & Optimizer
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hardware-Efficient Peephole Optimization & Redundancy Cancellation
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

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-mono">Transpiling quantum gates & computing AST optimization diff...</p>
          </div>
        ) : result ? (
          <div className="flex-1 overflow-y-auto py-4 space-y-5 min-h-0">
            {/* KPI Reduction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Gate Count Reduction</span>
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-slate-100 font-mono">
                    {result.originalGateCount}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {result.optimizedGateCount}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold ml-2">
                    (-{result.gateCountReduction} Gates)
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Circuit Depth</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-slate-100 font-mono">
                    {result.originalDepth}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                    {result.optimizedDepth}
                  </span>
                  <span className="text-xs text-cyan-400 font-bold ml-2">
                    ({result.depthReductionPct}% Less Depth)
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Optimization Rules</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-extrabold text-amber-300 font-mono">
                    {result.optimizationsApplied.length}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">Rules Applied</span>
                </div>
              </div>
            </div>

            {/* List of Applied Optimizations */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Peephole Optimization Log
              </h4>
              {result.optimizationsApplied.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Your circuit is already fully optimized! No redundant self-inverse or identity pairs detected.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {result.optimizationsApplied.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start space-x-3 text-xs"
                    >
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[11px] shrink-0">
                        {opt.rule}
                      </span>
                      <p className="text-slate-300 mt-0.5">{opt.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side-by-Side QASM Diff Comparison */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Side-by-Side OpenQASM Code Diff
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-rose-400 font-bold uppercase mb-1.5">
                    Before: Raw Circuit ({result.originalGateCount} gates)
                  </div>
                  <pre className="text-slate-400 overflow-x-auto max-h-40 text-[11px] leading-relaxed">
                    {rawQasm}
                  </pre>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-900/40">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1.5">
                    After: Transpiled Circuit ({result.optimizedGateCount} gates)
                  </div>
                  <pre className="text-cyan-300 overflow-x-auto max-h-40 text-[11px] leading-relaxed">
                    {result.qasm}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Transpiler ensures circuit unitary equivalence: U_opt = U_raw.
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Close
            </button>

            {result && result.gateCountReduction > 0 && (
              <button
                onClick={() => {
                  applyOptimizedCircuit(result.optimizedCircuit);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Apply Optimization to Canvas</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
