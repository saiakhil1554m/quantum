import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  BackgroundVariant,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useQuantumStore } from '../../store/useQuantumStore';
import { GateNodeComponent } from './GateNodeComponent';
import { QubitWireNodeComponent } from './QubitWireNodeComponent';
import { GateType } from '../../types/quantum';

const nodeTypes: NodeTypes = {
  gateNode: GateNodeComponent,
  qubitWireNode: QubitWireNodeComponent,
};

const STEP_WIDTH = 100;
const QUBIT_ROW_HEIGHT = 75;
const START_X = 140;
const START_Y = 50;

export const CircuitCanvas: React.FC = () => {
  const { numQubits, numSteps, gates, qubits, addGate } = useQuantumStore();

  // Dynamically compute React Flow nodes and edges based on circuit state
  const { nodes, edges } = useMemo(() => {
    const computedNodes: Node[] = [];
    const computedEdges: Edge[] = [];

    // 1. Render Qubit Row Header Nodes
    qubits.forEach((q, idx) => {
      computedNodes.push({
        id: `qubit-header-${q.id}`,
        type: 'qubitWireNode',
        position: { x: 20, y: START_Y + idx * QUBIT_ROW_HEIGHT },
        data: { qubitIndex: q.id, label: q.label },
        draggable: false,
      });
    });

    // 2. Render Placed Gate Nodes
    gates.forEach((gate) => {
      const mainTargetQubit = gate.targets[0];
      const posX = START_X + gate.position * STEP_WIDTH;
      const posY = START_Y + mainTargetQubit * QUBIT_ROW_HEIGHT;

      computedNodes.push({
        id: gate.id,
        type: 'gateNode',
        position: { x: posX, y: posY },
        data: {
          gateId: gate.id,
          type: gate.type,
          targets: gate.targets,
          controls: gate.controls,
          position: gate.position,
        },
      });

      // Horizontal Qubit Wire Edge connecting from header / previous gate
      computedEdges.push({
        id: `edge-wire-${gate.id}`,
        source: `qubit-header-${mainTargetQubit}`,
        target: gate.id,
        style: { stroke: '#06b6d4', strokeWidth: 2 },
        animated: true,
      });

      // Vertical Control line for multi-qubit gates (CNOT, CZ)
      if (gate.controls && gate.controls.length > 0) {
        const controlQubit = gate.controls[0];
        computedEdges.push({
          id: `edge-control-${gate.id}`,
          source: `qubit-header-${controlQubit}`,
          target: gate.id,
          style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4' },
        });
      }
    });

    return { nodes: computedNodes, edges: computedEdges };
  }, [qubits, gates]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const gateType = event.dataTransfer.getData('application/quantum-gate') as GateType;
      if (!gateType) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const dropX = event.clientX - bounds.left;
      const dropY = event.clientY - bounds.top;

      // Calculate target qubit row index and step column index
      const targetQubit = Math.max(
        0,
        Math.min(numQubits - 1, Math.floor((dropY - START_Y + QUBIT_ROW_HEIGHT / 2) / QUBIT_ROW_HEIGHT))
      );

      const stepPos = Math.max(
        0,
        Math.min(numSteps - 1, Math.floor((dropX - START_X + STEP_WIDTH / 2) / STEP_WIDTH))
      );

      // Default control for multi-qubit gates
      const defaultControl = targetQubit === 0 ? 1 : 0;

      addGate({
        type: gateType,
        targets: [targetQubit],
        controls: gateType === GateType.CNOT || gateType === GateType.CZ ? [defaultControl] : [],
        position: stepPos,
      });
    },
    [numQubits, numSteps, addGate]
  );

  return (
    <div className="flex-1 h-full bg-slate-950 relative overflow-hidden" onDragOver={onDragOver} onDrop={onDrop}>
      {/* Background wire grid lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {qubits.map((q, idx) => {
          const y = START_Y + idx * QUBIT_ROW_HEIGHT + 24;
          return (
            <line
              key={q.id}
              x1={20}
              y1={y}
              x2={START_X + numSteps * STEP_WIDTH}
              y2={y}
              stroke="#1e293b"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          );
        })}
      </svg>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#334155" />
        <Controls className="!bg-slate-900 !border-slate-800 !fill-slate-300" />
      </ReactFlow>
    </div>
  );
};
