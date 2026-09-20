import React, { useState, useMemo } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { Grid3X3, Layers } from 'lucide-react';

export const DensityMatrixView: React.FC = () => {
  const { numQubits, getActiveStatevector } = useQuantumStore();
  const [matrixMode, setMatrixMode] = useState<'real' | 'imag' | 'magnitude'>('real');
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
    real: number;
    imag: number;
    magnitude: number;
  } | null>(null);

  const sv = getActiveStatevector();

  // Compute density matrix rho = |psi><psi|
  // rho_ij = c_i * c_j^* = (a_i + i b_i)(a_j - i b_j) = (a_i a_j + b_i b_j) + i(b_i a_j - a_i b_j)
  const matrix = useMemo(() => {
    if (!sv || sv.length === 0) return [];
    const dim = sv.length;
    const mat = [];

    for (let i = 0; i < dim; i++) {
      const row = [];
      const ai = sv[i].real;
      const bi = sv[i].imag;

      for (let j = 0; j < dim; j++) {
        const aj = sv[j].real;
        const bj = sv[j].imag;

        const real = ai * aj + bi * bj;
        const imag = bi * aj - ai * bj;
        const magnitude = Math.sqrt(real * real + imag * imag);

        row.push({
          row: i,
          col: j,
          real: Number(real.toFixed(4)),
          imag: Number(imag.toFixed(4)),
          magnitude: Number(magnitude.toFixed(4)),
        });
      }
      mat.push(row);
    }
    return mat;
  }, [sv]);

  if (!matrix.length) {
    return (
      <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-slate-500 bg-slate-900/80 rounded-xl border border-slate-800 p-4 text-center">
        <Layers className="w-8 h-8 text-slate-700 mb-2" />
        <p className="text-xs font-semibold text-slate-400">Density Matrix Unavailable</p>
        <p className="text-[10px] text-slate-500 mt-1">Run simulation to inspect density operator ρ = |ψ⟩⟨ψ|.</p>
      </div>
    );
  }

  const dim = matrix.length;
  // If > 8 qubits (dim > 16), show top 8x8 slice to prevent DOM overload
  const displayDim = Math.min(dim, 8);

  const getColor = (cell: { real: number; imag: number; magnitude: number }) => {
    let val = 0;
    if (matrixMode === 'real') val = cell.real;
    else if (matrixMode === 'imag') val = cell.imag;
    else val = cell.magnitude;

    if (matrixMode === 'magnitude') {
      // 0 to 1 -> Slate to Cyan
      const intensity = Math.min(1, Math.max(0, val));
      if (intensity < 0.01) return 'bg-slate-950 text-slate-600';
      if (intensity < 0.25) return 'bg-cyan-950/80 text-cyan-300';
      if (intensity < 0.6) return 'bg-cyan-800/80 text-cyan-100';
      return 'bg-cyan-500 text-white font-bold';
    }

    // Signed values (-1 to +1)
    if (val > 0.05) {
      if (val > 0.5) return 'bg-emerald-600 text-white font-bold';
      return 'bg-emerald-950 text-emerald-300';
    } else if (val < -0.05) {
      if (val < -0.5) return 'bg-rose-600 text-white font-bold';
      return 'bg-rose-950 text-rose-300';
    }
    return 'bg-slate-950/90 text-slate-600';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <Grid3X3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Density Matrix ρ = |ψ⟩⟨ψ|
          </h3>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
          <button
            onClick={() => setMatrixMode('real')}
            className={`px-2 py-0.5 rounded transition-colors ${
              matrixMode === 'real' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Re(ρ)
          </button>
          <button
            onClick={() => setMatrixMode('imag')}
            className={`px-2 py-0.5 rounded transition-colors ${
              matrixMode === 'imag' ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Im(ρ)
          </button>
          <button
            onClick={() => setMatrixMode('magnitude')}
            className={`px-2 py-0.5 rounded transition-colors ${
              matrixMode === 'magnitude' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            |ρ|
          </button>
        </div>
      </div>

      {/* Matrix Grid Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-1 min-h-0">
        <div
          className="grid gap-1 font-mono text-[10px]"
          style={{
            gridTemplateColumns: `repeat(${displayDim}, minmax(36px, 1fr))`,
          }}
        >
          {matrix.slice(0, displayDim).map((row, rIdx) =>
            row.slice(0, displayDim).map((cell, cIdx) => {
              const displayVal =
                matrixMode === 'real'
                  ? cell.real
                  : matrixMode === 'imag'
                  ? cell.imag
                  : cell.magnitude;

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`h-9 w-full flex flex-col items-center justify-center rounded border border-slate-800/80 cursor-pointer transition-all hover:scale-105 hover:z-10 shadow-sm ${getColor(
                    cell
                  )}`}
                  title={`|${rIdx.toString(2).padStart(numQubits, '0')}⟩⟨${cIdx
                    .toString(2)
                    .padStart(numQubits, '0')}| = ${cell.real} + ${cell.imag}i`}
                >
                  <span>{displayVal === 0 ? '0' : displayVal.toFixed(2)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cell Detail Footer */}
      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-300 shrink-0 mt-2">
        {hoveredCell ? (
          <>
            <span className="text-cyan-300">
              ⟨{hoveredCell.row.toString(2).padStart(numQubits, '0')}|ρ|
              {hoveredCell.col.toString(2).padStart(numQubits, '0')}⟩
            </span>
            <span>
              Real: <strong className="text-emerald-400">{hoveredCell.real}</strong>
            </span>
            <span>
              Imag: <strong className="text-purple-400">{hoveredCell.imag}i</strong>
            </span>
            <span>
              |ρ|: <strong className="text-amber-400">{hoveredCell.magnitude}</strong>
            </span>
          </>
        ) : (
          <span className="text-slate-500 text-[10px]">
            Hover over any cell (ρ_ij) to inspect exact complex amplitudes and Dirac projection.
          </span>
        )}
      </div>
    </div>
  );
};
