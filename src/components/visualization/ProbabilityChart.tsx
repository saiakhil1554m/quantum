import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useQuantumStore } from '../../store/useQuantumStore';
import { BarChart3, Activity } from 'lucide-react';

export const ProbabilityChart: React.FC = () => {
  const { executionResult, isSimulating, getActiveProbabilities } = useQuantumStore();

  if (isSimulating) {
    return (
      <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-slate-400 bg-slate-900/80 rounded-xl border border-slate-800 p-4">
        <div className="w-7 h-7 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs font-mono">Running Qiskit Aer simulation...</p>
      </div>
    );
  }

  const probs = getActiveProbabilities();

  if (!executionResult || !executionResult.success || Object.keys(probs).length === 0) {
    return (
      <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-slate-500 bg-slate-900/80 rounded-xl border border-slate-800 p-4 text-center">
        <BarChart3 className="w-8 h-8 text-slate-700 mb-2" />
        <p className="text-xs font-semibold text-slate-400">No Simulation Results</p>
        <p className="text-[10px] text-slate-500 max-w-xs mt-1">
          Drag gates onto the grid wire canvas to auto-run quantum simulation.
        </p>
      </div>
    );
  }

  const data = Object.entries(probs).map(([state, prob]) => {
    const count = executionResult.counts[state] || Math.round(prob * 1024);
    return {
      state: `|${state}⟩`,
      probability: Number((prob * 100).toFixed(2)),
      rawProb: prob,
      shots: count,
    };
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Probability Distribution
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/80">
          Shots: 1024
        </span>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="state"
              stroke="#94a3b8"
              tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#06b6d4' }}
            />
            <YAxis
              stroke="#94a3b8"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 9, fill: '#64748b' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataItem = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg shadow-xl text-xs font-mono">
                      <p className="font-bold text-cyan-300">{dataItem.state}</p>
                      <p className="text-slate-200 text-[11px] mt-0.5">
                        Probability: <span className="font-bold text-emerald-400">{dataItem.probability}%</span>
                      </p>
                      <p className="text-slate-400 text-[10px]">Frequency: {dataItem.shots} counts</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.probability > 40 ? '#06b6d4' : '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
