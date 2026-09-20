import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface QubitWireNodeData {
  qubitIndex: number;
  label: string;
}

export const QubitWireNodeComponent: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as QubitWireNodeData;

  return (
    <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 shadow-md">
      <span className="font-mono text-xs font-bold text-cyan-400">{nodeData.label}</span>
      <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
        |0⟩
      </span>
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-cyan-400 !border-slate-900" />
    </div>
  );
};
