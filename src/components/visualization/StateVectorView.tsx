import React from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { Layers, Zap } from 'lucide-react';

export const StateVectorView: React.FC = () => {
  const { executionResult, numQubits } = useQuantumStore();

  if (!executionResult || !executionResult.statevector) {
    return (
      <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-slate-500 bg-slate-900/80 rounded-xl border border-slate-800 p-4 text-center">
        <Layers className="w-8 h-8 text-slate-700 mb-2" />
        <p className="text-xs font-semibold text-slate-400">Statevector Unavailable</p>
        <p className="text-[10px] text-slate-500 max-w-xs mt-1">
          Simulate circuit to inspect full complex amplitudes \psi = \sum c_i |i\rangle.
        </p>
      </div>
    );
  }

  const svElements = executionResult.statevector;

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Statevector Amplitudes |\psi\rangle
          </h3>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/80">
          2^{numQubits} = {svElements.length} States
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0">
        {svElements.map((elem, idx) => {
          const binaryState = formatBinaryState(idx, numQubits);
          const probPct = (elem.magnitude ** 2 * 100).toFixed(1);
          const phaseDeg = ((elem.phase * 180) / Math.PI).toFixed(0);

          return (
            <div
              key={idx}
              className="bg-slate-950/90 p-2 rounded-lg border border-slate-800/80 flex items-center justify-between text-[11px] font-mono hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <span className="font-bold text-cyan-300 w-14">|{binaryState}⟩</span>
                <span className="text-slate-300">
                  {elem.real >= 0 ? `+${elem.real}` : elem.real}
                  {elem.imag >= 0 ? `+${elem.imag}i` : `-${Math.abs(elem.imag)}i`}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-emerald-400 font-bold">{probPct}%</span>
                  <span className="text-[9px] text-slate-500 block">Prob</span>
                </div>
                <div className="text-right w-12">
                  <span className="text-amber-400 font-bold">{phaseDeg}°</span>
                  <span className="text-[9px] text-slate-500 block">Phase</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function formatBinaryState(index: number, qubits: number): string {
  return index.toString(2).padStart(qubits, '0');
}
