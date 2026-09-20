import React from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { GateType } from '../../types/quantum';
import { Settings, Play, Plus, Minus, Cpu, Trash2 } from 'lucide-react';
import { GATE_DEFINITIONS } from '../quantum/GatePalette';

interface Props {
  onRunSimulation: () => void;
}

export const QuantumPlayground: React.FC<Props> = ({ onRunSimulation }) => {
  const { numQubits, setNumQubits, gates, addGate, clearCircuit, runSimulation, isSimulating } =
    useQuantumStore();

  const handleRun = async () => {
    await runSimulation();
    onRunSimulation();
  };

  const handleGateTap = (gateType: GateType) => {
    const nextPos = Math.min(5, gates.length % 6);
    const targetQubit = gates.length % numQubits;
    const defaultControl = targetQubit === 0 ? 1 : 0;

    addGate({
      type: gateType,
      targets: [targetQubit],
      controls: gateType === GateType.CNOT || gateType === GateType.CZ ? [defaultControl] : [],
      position: nextPos,
    });
  };

  return (
    <div className="flex-1 bg-[#0b0d19] text-slate-100 p-4 space-y-4 overflow-y-auto pb-24 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Quantum Playground</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Build, simulate and visualize quantum circuits.
          </p>
        </div>
        <button className="p-2 rounded-xl bg-[#14172b] border border-[#232742] text-slate-300">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Controls Bar: Qubits & Depth */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#121526] border border-[#1e2238]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Qubits</span>
          <div className="flex items-center space-x-2 bg-[#0b0d19] px-2 py-1 rounded-xl border border-[#1e2238]">
            <button
              onClick={() => setNumQubits(Math.max(1, numQubits - 1))}
              className="w-5 h-5 rounded bg-[#181c33] text-slate-300 flex items-center justify-center"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-mono font-bold text-cyan-300 w-4 text-center">{numQubits}</span>
            <button
              onClick={() => setNumQubits(Math.min(8, numQubits + 1))}
              className="w-5 h-5 rounded bg-[#181c33] text-slate-300 flex items-center justify-center"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Depth</span>
          <div className="flex items-center space-x-2 bg-[#0b0d19] px-2 py-1 rounded-xl border border-[#1e2238]">
            <span className="text-xs font-mono font-bold text-indigo-300">6</span>
          </div>
        </div>
      </div>

      {/* Interactive Circuit Wires Canvas Container */}
      <div className="p-4 rounded-2xl bg-[#121526] border border-[#1e2238] space-y-4 shadow-lg min-h-[160px] relative">
        {Array.from({ length: numQubits }).map((_, qIdx) => {
          const qubitGates = gates.filter((g) => g.targets.includes(qIdx) || g.controls?.includes(qIdx));
          return (
            <div key={qIdx} className="flex items-center space-x-3 relative">
              <span className="text-xs font-mono text-cyan-300 font-bold w-12 shrink-0">
                q{qIdx} |0⟩
              </span>

              {/* Horizontal Wire Line */}
              <div className="flex-1 h-0.5 bg-[#232742] relative flex items-center space-x-3 px-2 min-h-[32px]">
                {qubitGates.map((g) => (
                  <div
                    key={g.id}
                    className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400 text-indigo-200 font-mono text-xs font-bold flex items-center justify-center shadow-md shrink-0 z-10"
                  >
                    {g.type}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => handleGateTap(GateType.H)}
            className="text-xs text-indigo-400 font-semibold flex items-center space-x-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Gate</span>
          </button>

          <button
            onClick={clearCircuit}
            className="text-xs text-rose-400 font-semibold flex items-center space-x-1 hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Gate Category Selector Pills */}
      <div className="flex items-center space-x-2 p-1 bg-[#121526] rounded-xl border border-[#1e2238] text-xs">
        <button className="flex-1 py-1.5 rounded-lg font-semibold bg-indigo-600 text-white shadow-md">
          Gates
        </button>
        <button className="flex-1 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-slate-200">
          Examples
        </button>
        <button className="flex-1 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-slate-200">
          Saved
        </button>
      </div>

      {/* Gate Palettes Grid */}
      <div className="space-y-3">
        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Single Qubit Gates</h3>
          <div className="grid grid-cols-4 gap-2">
            {GATE_DEFINITIONS.filter((g) => g.category === 'single' || g.category === 'parametric').slice(0, 8).map((gate) => (
              <button
                key={gate.type}
                onClick={() => handleGateTap(gate.type)}
                className="p-2.5 rounded-xl bg-[#121526] hover:bg-[#1a1e36] border border-[#1e2238] active:scale-95 text-center font-mono font-bold text-sm text-cyan-300 transition-all shadow-sm"
              >
                {gate.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Multi Qubit & Measurement</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleGateTap(GateType.CNOT)}
              className="p-2.5 rounded-xl bg-[#121526] hover:bg-[#1a1e36] border border-[#1e2238] active:scale-95 text-center font-mono font-bold text-sm text-indigo-300 transition-all shadow-sm"
            >
              CNOT
            </button>
            <button
              onClick={() => handleGateTap(GateType.CZ)}
              className="p-2.5 rounded-xl bg-[#121526] hover:bg-[#1a1e36] border border-[#1e2238] active:scale-95 text-center font-mono font-bold text-sm text-indigo-300 transition-all shadow-sm"
            >
              CZ
            </button>
            <button
              onClick={() => handleGateTap(GateType.MEASURE)}
              className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800 active:scale-95 text-center font-mono font-bold text-sm text-rose-300 transition-all shadow-sm"
            >
              M
            </button>
          </div>
        </div>
      </div>

      {/* Run Simulation CTA */}
      <button
        onClick={handleRun}
        disabled={isSimulating}
        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] touch-manipulation"
      >
        {isSimulating ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Simulating Circuit...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Run Simulation</span>
          </>
        )}
      </button>
    </div>
  );
};
