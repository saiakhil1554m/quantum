import React, { useEffect, useState } from 'react';
import { CourseModuleData, fetchCourseModules } from '../../services/lmsApi';
import { useQuantumStore } from '../../store/useQuantumStore';
import { GraduationCap, Award, PlayCircle, CheckCircle2, Star, Sparkles, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDashboardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [modules, setModules] = useState<CourseModuleData[]>([]);
  const { setNumQubits, clearCircuit, addGate } = useQuantumStore();
  const [completedIds, setCompletedIds] = useState<string[]>(['mod-1-superposition']);

  useEffect(() => {
    if (isOpen) {
      fetchCourseModules().then((data) => setModules(data));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const loadModuleToCanvas = (mod: CourseModuleData) => {
    const initCirc = mod.initialCircuit;
    setNumQubits(initCirc.numQubits);
    clearCircuit();
    initCirc.gates.forEach((g) => addGate(g));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Quantum Learning Academy</h2>
              <p className="text-xs text-slate-400 mt-0.5">Interactive Socratic Quantum Algorithm Curriculum (SIH26140)</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Student XP Badge */}
            <div className="bg-amber-950/60 border border-amber-800/80 text-amber-300 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-xs font-bold font-mono">
              <Star className="w-4 h-4 fill-current text-amber-400" />
              <span>350 XP</span>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 text-sm font-bold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {modules.map((mod, idx) => {
            const isCompleted = completedIds.includes(mod.id);
            return (
              <div
                key={mod.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-950/80 border-emerald-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold font-mono text-cyan-400">Step {idx + 1}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          mod.level === 'Beginner'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : mod.level === 'Intermediate'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {mod.level}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-100">{mod.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>
                    <p className="text-[11px] font-mono text-cyan-300/90 pt-1">
                      Target Goal: {mod.targetStateDescription}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>+{mod.xpReward} XP</span>
                    </span>

                    <button
                      onClick={() => loadModuleToCanvas(mod)}
                      className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all hover:scale-105"
                    >
                      <PlayCircle className="w-4 h-4 text-cyan-400" />
                      <span>Load into Canvas</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
