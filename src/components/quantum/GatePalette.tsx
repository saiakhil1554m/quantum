import React from 'react';
import { GateType } from '../../types/quantum';
import { useQuantumStore } from '../../store/useQuantumStore';
import { Sparkles, Play, Trash2, Cpu, HelpCircle, Layers } from 'lucide-react';

interface GateDefinition {
  type: GateType;
  label: string;
  name: string;
  category: 'single' | 'multi' | 'parametric' | 'measure';
  color: string;
  description: string;
}

export const GATE_DEFINITIONS: GateDefinition[] = [
  { type: GateType.H, label: 'H', name: 'Hadamard', category: 'single', color: 'bg-cyan-500/20 border-cyan-400 text-cyan-200', description: 'Puts qubit into equal superposition |+>' },
  { type: GateType.X, label: 'X', name: 'Pauli-X (NOT)', category: 'single', color: 'bg-emerald-500/20 border-emerald-400 text-emerald-200', description: 'Flips qubit state |0> <-> |1>' },
  { type: GateType.Y, label: 'Y', name: 'Pauli-Y', category: 'single', color: 'bg-emerald-500/20 border-emerald-400 text-emerald-200', description: 'Bit and phase flip gate' },
  { type: GateType.Z, label: 'Z', name: 'Pauli-Z', category: 'single', color: 'bg-emerald-500/20 border-emerald-400 text-emerald-200', description: 'Phase flip gate |1> -> -|1>' },
  { type: GateType.S, label: 'S', name: 'S Gate (Phase)', category: 'single', color: 'bg-purple-500/20 border-purple-400 text-purple-200', description: '90-degree phase rotation (pi/2)' },
  { type: GateType.T, label: 'T', name: 'T Gate (pi/8)', category: 'single', color: 'bg-purple-500/20 border-purple-400 text-purple-200', description: '45-degree phase rotation (pi/4)' },
  { type: GateType.RX, label: 'Rx', name: 'Rotation X', category: 'parametric', color: 'bg-amber-500/20 border-amber-400 text-amber-200', description: 'Rotation around X-axis by angle theta' },
  { type: GateType.RY, label: 'Ry', name: 'Rotation Y', category: 'parametric', color: 'bg-amber-500/20 border-amber-400 text-amber-200', description: 'Rotation around Y-axis by angle theta' },
  { type: GateType.RZ, label: 'Rz', name: 'Rotation Z', category: 'parametric', color: 'bg-amber-500/20 border-amber-400 text-amber-200', description: 'Rotation around Z-axis by angle phi' },
  { type: GateType.CNOT, label: 'CX', name: 'CNOT', category: 'multi', color: 'bg-blue-500/20 border-blue-400 text-blue-200', description: 'Controlled-NOT (Entangles 2 qubits)' },
  { type: GateType.CZ, label: 'CZ', name: 'Controlled-Z', category: 'multi', color: 'bg-blue-500/20 border-blue-400 text-blue-200', description: 'Controlled Phase Flip gate' },
  { type: GateType.SWAP, label: 'SWAP', name: 'SWAP', category: 'multi', color: 'bg-indigo-500/20 border-indigo-400 text-indigo-200', description: 'Swaps states of two qubits' },
  { type: GateType.MEASURE, label: 'M', name: 'Measurement', category: 'measure', color: 'bg-rose-500/20 border-rose-400 text-rose-200', description: 'Measures quantum state into classical bit' },
];

export const GatePalette: React.FC = () => {
  const { loadPreset, activePreset, clearCircuit } = useQuantumStore();

  const handleDragStart = (event: React.DragEvent, gateType: GateType) => {
    event.dataTransfer.setData('application/quantum-gate', gateType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 p-4 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
        <Cpu className="w-5 h-5 text-cyan-400" />
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Gate Toolbox</h2>
      </div>

      <div className="text-xs text-slate-400 mb-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>Drag any quantum gate onto the circuit wire grid to add it to your algorithm.</span>
      </div>

      {/* Preset Algorithms */}
      <div className="mb-6">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Preset Circuits</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {['Bell State', 'GHZ State', 'Quantum Teleportation'].map((preset) => (
            <button
              key={preset}
              onClick={() => loadPreset(preset)}
              className={`text-left text-xs px-3 py-2 rounded-lg border transition-all flex items-center justify-between ${
                activePreset === preset
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-medium'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <span>{preset}</span>
              {activePreset === preset && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Gate Categories */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Single Qubit Gates</h3>
          <div className="grid grid-cols-3 gap-2">
            {GATE_DEFINITIONS.filter((g) => g.category === 'single').map((gate) => (
              <div
                key={gate.type}
                draggable
                onDragStart={(e) => handleDragStart(e, gate.type)}
                className={`cursor-grab active:cursor-grabbing p-2.5 rounded-lg border ${gate.color} flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10`}
                title={gate.description}
              >
                <span className="font-mono font-bold text-base">{gate.label}</span>
                <span className="text-[10px] opacity-80 font-medium mt-0.5">{gate.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Parametric Gates</h3>
          <div className="grid grid-cols-3 gap-2">
            {GATE_DEFINITIONS.filter((g) => g.category === 'parametric').map((gate) => (
              <div
                key={gate.type}
                draggable
                onDragStart={(e) => handleDragStart(e, gate.type)}
                className={`cursor-grab active:cursor-grabbing p-2.5 rounded-lg border ${gate.color} flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10`}
                title={gate.description}
              >
                <span className="font-mono font-bold text-base">{gate.label}</span>
                <span className="text-[10px] opacity-80 font-medium mt-0.5">{gate.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Multi Qubit & Measurement</h3>
          <div className="grid grid-cols-2 gap-2">
            {GATE_DEFINITIONS.filter((g) => g.category === 'multi' || g.category === 'measure').map((gate) => (
              <div
                key={gate.type}
                draggable
                onDragStart={(e) => handleDragStart(e, gate.type)}
                className={`cursor-grab active:cursor-grabbing p-2.5 rounded-lg border ${gate.color} flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg`}
                title={gate.description}
              >
                <span className="font-mono font-bold text-base">{gate.label}</span>
                <span className="text-[10px] opacity-80 font-medium mt-0.5">{gate.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
