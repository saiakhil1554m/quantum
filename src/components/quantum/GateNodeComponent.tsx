import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GateType } from '../../types/quantum';
import { useQuantumStore } from '../../store/useQuantumStore';
import { X, Settings } from 'lucide-react';
import { GATE_DEFINITIONS } from './GatePalette';

export interface GateNodeData {
  gateId: string;
  type: GateType;
  targets: number[];
  controls?: number[];
  position: number;
}

export const GateNodeComponent: React.FC<NodeProps> = ({ id, data }) => {
  const nodeData = data as unknown as GateNodeData;
  const { removeGate, numQubits, updateGate } = useQuantumStore();

  const gateDef = GATE_DEFINITIONS.find((g) => g.type === nodeData.type);
  const colorClass = gateDef?.color || 'bg-cyan-500/20 border-cyan-400 text-cyan-200';

  const isMultiQubit = nodeData.type === GateType.CNOT || nodeData.type === GateType.CZ || nodeData.type === GateType.SWAP;

  return (
    <div className="relative group">
      {/* Handles for flow wiring */}
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-cyan-400 !border-slate-900" />
      
      <div
        className={`w-12 h-12 rounded-xl border-2 ${colorClass} backdrop-blur-md flex flex-col items-center justify-center shadow-lg transition-all transform group-hover:scale-110`}
      >
        <span className="font-mono font-extrabold text-sm tracking-wide">{gateDef?.label || nodeData.type}</span>
        
        {/* Subscript indicator for controls/targets */}
        {isMultiQubit && (
          <span className="text-[9px] font-mono opacity-80 mt-[-2px]">
            {nodeData.controls && nodeData.controls.length > 0 ? `c:${nodeData.controls[0]}` : ''}
          </span>
        )}
      </div>

      {/* Delete node hover badge */}
      <button
        onClick={() => removeGate(nodeData.gateId)}
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        title="Remove Gate"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Controls editor dropdown for multi-qubit gates */}
      {isMultiQubit && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          <span>Control: </span>
          <select
            value={nodeData.controls ? nodeData.controls[0] : 0}
            onChange={(e) => updateGate(nodeData.gateId, { controls: [parseInt(e.target.value, 10)] })}
            className="bg-slate-950 text-cyan-300 border border-slate-800 rounded px-1"
          >
            {Array.from({ length: numQubits }, (_, i) => i)
              .filter((q) => q !== nodeData.targets[0])
              .map((q) => (
                <option key={q} value={q}>
                  q[{q}]
                </option>
              ))}
          </select>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-cyan-400 !border-slate-900" />
    </div>
  );
};
