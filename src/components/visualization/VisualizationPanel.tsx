import React, { useState } from 'react';
import { ProbabilityChart } from './ProbabilityChart';
import { StateVectorView } from './StateVectorView';
import { BlochSphereView } from './BlochSphereView';
import { QSphereView } from './QSphereView';
import { DensityMatrixView } from './DensityMatrixView';
import { EntanglementGraphView } from './EntanglementGraphView';
import { useQuantumStore } from '../../store/useQuantumStore';
import {
  BarChart3,
  Layers,
  Globe,
  Globe2,
  Grid3X3,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Activity,
  Share2,
} from 'lucide-react';

export const VisualizationPanel: React.FC = () => {
  const [viewMode, setViewMode] = useState<'split' | 'tabbed'>('split');
  const [activeTab, setActiveTab] = useState<'histogram' | 'statevector' | 'bloch' | 'qsphere' | 'density' | 'entanglement'>('qsphere');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { executionResult, isSimulating, activeStepTime, noiseModel } = useQuantumStore();

  return (
    <div
      className={`bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 flex flex-col transition-all duration-300 shadow-2xl z-30 ${
        isCollapsed ? 'h-10' : 'h-[360px]'
      }`}
    >
      {/* Top Header Bar */}
      <div className="h-10 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
              Quantum Multi-State Visualizer
            </h2>
          </div>

          {/* Status Indicator Pill */}
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800 text-[10px] font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isSimulating
                  ? 'bg-amber-400 animate-ping'
                  : executionResult?.success
                  ? 'bg-emerald-400'
                  : 'bg-cyan-400'
              }`}
            />
            <span className="text-slate-300">
              {isSimulating
                ? 'Simulating...'
                : executionResult?.success
                ? `Done in ${executionResult.executionTimeMs}ms`
                : 'Ready'}
            </span>
          </div>

          {/* Noise indicator badge if active */}
          {noiseModel !== 'ideal' && (
            <span className="text-[10px] font-mono text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>Noise: {noiseModel === 'fake_manila' ? 'IBM Manila (T1/T2)' : 'IBM Cairo (Readout)'}</span>
            </span>
          )}

          {/* Time travel active badge */}
          {activeStepTime !== null && (
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              Scrubbing Time t={activeStepTime}
            </span>
          )}

          <div className="h-4 w-px bg-slate-800" />

          {/* View Mode Switches: Split Grid vs Tabs */}
          <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setViewMode('split');
                setIsCollapsed(false);
              }}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all ${
                viewMode === 'split' && !isCollapsed
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3 h-3 text-cyan-400" />
              <span>Multi-View Grid</span>
            </button>

            <button
              onClick={() => {
                setViewMode('tabbed');
                setIsCollapsed(false);
              }}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all ${
                viewMode === 'tabbed' && !isCollapsed
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3 text-purple-400" />
              <span>Focused View</span>
            </button>
          </div>
        </div>

        {/* Tab selector buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setActiveTab('qsphere');
              setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTab === 'qsphere'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <span>3D Q-Sphere</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('entanglement');
              setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTab === 'entanglement'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Entanglement</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('density');
              setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTab === 'density'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Density Matrix (ρ)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bloch');
              setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTab === 'bloch'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Bloch Sphere</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('histogram');
              setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTab === 'histogram'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Probabilities</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('statevector');
              setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTab === 'statevector'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Statevector</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Collapse / Expand Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand Analytics Dashboard' : 'Collapse Analytics Dashboard'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Panel Body */}
      {!isCollapsed && (
        <div className="flex-1 p-3 min-h-0 overflow-hidden">
          {viewMode === 'split' ? (
            /* Multi-column Grid: Q-Sphere, Probabilities, Density Matrix */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full">
              <div className="h-full min-h-0">
                <QSphereView />
              </div>
              <div className="h-full min-h-0">
                <ProbabilityChart />
              </div>
              <div className="h-full min-h-0">
                <DensityMatrixView />
              </div>
            </div>
          ) : (
            /* Focused Single View */
            <div className="h-full">
              {activeTab === 'qsphere' && <QSphereView />}
              {activeTab === 'entanglement' && <EntanglementGraphView />}
              {activeTab === 'density' && <DensityMatrixView />}
              {activeTab === 'bloch' && <BlochSphereView />}
              {activeTab === 'histogram' && <ProbabilityChart />}
              {activeTab === 'statevector' && <StateVectorView />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
