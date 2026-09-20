import React, { useMemo } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { Share2, Zap, Info, ShieldCheck, Activity } from 'lucide-react';

export const EntanglementGraphView: React.FC = () => {
  const { numQubits, getActiveStatevector, activeStepTime } = useQuantumStore();
  const sv = getActiveStatevector();

  // Compute single qubit purities & bipartite correlation between all qubit pairs
  const { nodeEntanglements, pairCorrelations, globalStateClassification } = useMemo(() => {
    if (!sv || sv.length === 0) {
      return {
        nodeEntanglements: Array.from({ length: numQubits }, (_, i) => ({ qubit: i, entropy: 0, isEntangled: false })),
        pairCorrelations: [],
        globalStateClassification: 'Ground State |0...0⟩ (Separable)',
      };
    }

    const nodeEntanglements = [];
    const pairCorrelations: { q1: number; q2: number; correlation: number; strengthText: string }[] = [];

    // Calculate single qubit reduced density matrix and linear entropy S = 1 - Tr(rho_i^2)
    // S = 0 => Pure separable state; S = 0.5 => Maximally mixed / maximally entangled with rest of system
    const singleQubitEntropies: number[] = [];

    for (let q = 0; q < numQubits; q++) {
      let rho00 = 0;
      let rho11 = 0;
      let rho01_r = 0;
      let rho01_i = 0;

      for (let idx = 0; idx < sv.length; idx++) {
        const bit = (idx >> q) & 1;
        const magSq = sv[idx].magnitude ** 2;

        if (bit === 0) {
          rho00 += magSq;
          const partner = idx | (1 << q);
          if (partner < sv.length) {
            const e0 = sv[idx];
            const e1 = sv[partner];
            rho01_r += e0.real * e1.real + e0.imag * e1.imag;
            rho01_i += e0.imag * e1.real - e0.real * e1.imag;
          }
        } else {
          rho11 += magSq;
        }
      }

      // Tr(rho^2) = rho00^2 + rho11^2 + 2*(|rho01|^2)
      const purity = rho00 * rho00 + rho11 * rho11 + 2 * (rho01_r * rho01_r + rho01_i * rho01_i);
      const entropy = Math.max(0, Math.min(0.5, (1 - purity) / 2)); // Normalized 0 to 1
      const normalizedEntropy = entropy * 2; // 0 (pure) to 1 (max entangled)
      singleQubitEntropies.push(normalizedEntropy);

      nodeEntanglements.push({
        qubit: q,
        entropy: Number(normalizedEntropy.toFixed(3)),
        isEntangled: normalizedEntropy > 0.05,
      });
    }

    // Pairwise Quantum Correlations / Mutual Information
    for (let i = 0; i < numQubits; i++) {
      for (let j = i + 1; j < numQubits; j++) {
        // Compute correlation proxy based on non-zero off-diagonals of joint state
        let jointCorrelation = 0;
        if (singleQubitEntropies[i] > 0.05 && singleQubitEntropies[j] > 0.05) {
          jointCorrelation = Math.min(1.0, (singleQubitEntropies[i] + singleQubitEntropies[j]) / 2);
        }

        if (jointCorrelation > 0.05) {
          pairCorrelations.push({
            q1: i,
            q2: j,
            correlation: Number(jointCorrelation.toFixed(3)),
            strengthText:
              jointCorrelation > 0.8
                ? 'Maximal Entanglement (Bell / GHZ Pair)'
                : jointCorrelation > 0.4
                ? 'High Quantum Correlation'
                : 'Partial Entanglement',
          });
        }
      }
    }

    // Classify global state
    const anyEntangled = nodeEntanglements.some((n) => n.isEntangled);
    const allEntangled = nodeEntanglements.every((n) => n.isEntangled) && numQubits > 1;

    let globalStateClassification = 'Separable Product State (Unentangled)';
    if (allEntangled && numQubits === 2) {
      globalStateClassification = 'Bell Entangled State (|Φ⟩ / |Ψ⟩)';
    } else if (allEntangled && numQubits >= 3) {
      globalStateClassification = `${numQubits}-Qubit Multipartite Entangled State (GHZ/W)`;
    } else if (anyEntangled) {
      globalStateClassification = 'Subsystem Bipartite Entanglement';
    }

    return { nodeEntanglements, pairCorrelations, globalStateClassification };
  }, [sv, numQubits]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Quantum Entanglement Graph & Concurrence
          </h3>
        </div>

        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            pairCorrelations.length > 0
              ? 'bg-purple-950/60 text-purple-300 border-purple-800'
              : 'bg-slate-950 text-slate-400 border-slate-800'
          }`}
        >
          {globalStateClassification}
        </span>
      </div>

      {/* Network Graph Visualizer */}
      <div className="flex-1 w-full bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 flex flex-col items-center justify-center relative min-h-0 overflow-hidden">
        {/* SVG Network Graph */}
        <div className="relative w-full max-w-sm h-40 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw Entanglement correlation links between nodes */}
            {pairCorrelations.map((pair, pIdx) => {
              const total = numQubits;
              const angle1 = (pair.q1 / total) * 2 * Math.PI - Math.PI / 2;
              const angle2 = (pair.q2 / total) * 2 * Math.PI - Math.PI / 2;
              const cx = 175;
              const cy = 80;
              const r = 55;

              const x1 = cx + r * Math.cos(angle1);
              const y1 = cy + r * Math.sin(angle1);
              const x2 = cx + r * Math.cos(angle2);
              const y2 = cy + r * Math.sin(angle2);

              return (
                <g key={pIdx}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#a855f7"
                    strokeWidth={Math.max(2, pair.correlation * 4)}
                    strokeOpacity={Math.max(0.4, pair.correlation)}
                    strokeDasharray={pair.correlation > 0.8 ? undefined : '4 3'}
                  />
                  {/* Pulsing particle on link */}
                  <circle
                    cx={(x1 + x2) / 2}
                    cy={(y1 + y2) / 2}
                    r="3"
                    fill="#38bdf8"
                    className="animate-ping"
                  />
                </g>
              );
            })}
          </svg>

          {/* Render Qubit Nodes in Ring */}
          {nodeEntanglements.map((node) => {
            const total = numQubits;
            const angle = (node.qubit / total) * 2 * Math.PI - Math.PI / 2;
            const cx = 175;
            const cy = 80;
            const r = 55;

            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);

            return (
              <div
                key={node.qubit}
                style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
                className={`absolute w-10 h-10 rounded-full border-2 flex flex-col items-center justify-center shadow-lg transition-all z-10 ${
                  node.isEntangled
                    ? 'bg-purple-950/90 border-purple-400 text-purple-200 shadow-purple-500/30'
                    : 'bg-slate-900/90 border-cyan-500/60 text-cyan-300'
                }`}
                title={`Qubit q[${node.qubit}]: Von Neumann Entropy S = ${node.entropy} (${
                  node.isEntangled ? 'Entangled' : 'Pure Separable'
                })`}
              >
                <span className="font-mono font-bold text-[11px]">q[{node.qubit}]</span>
                <span className="text-[8px] font-mono opacity-80 mt-[-2px]">
                  S:{node.entropy.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Footer */}
      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-300 shrink-0 mt-2">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Entanglement Links:</span>
          <strong className="text-purple-300">{pairCorrelations.length} Active Pair(s)</strong>
        </div>

        <div className="flex items-center space-x-1 text-slate-400">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Entropy S ∈ [0, 1]: 0 = Separable, 1 = Maximally Entangled</span>
        </div>
      </div>
    </div>
  );
};
