import React, { useEffect } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  Clock,
  Radio,
} from 'lucide-react';

export const TimeTravelDebugger: React.FC = () => {
  const {
    executionResult,
    activeStepTime,
    setActiveStepTime,
    isPlayingTimeTravel,
    setIsPlayingTimeTravel,
    stepForward,
    stepBackward,
  } = useQuantumStore();

  const stepStates = executionResult?.stepStatevectors || [];
  const totalSteps = stepStates.length;

  // Auto-play stepper interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingTimeTravel && totalSteps > 0) {
      interval = setInterval(() => {
        const cur = activeStepTime ?? 0;
        if (cur >= totalSteps - 1) {
          setIsPlayingTimeTravel(false);
        } else {
          setActiveStepTime(cur + 1);
        }
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingTimeTravel, activeStepTime, totalSteps, setActiveStepTime, setIsPlayingTimeTravel]);

  if (totalSteps === 0) return null;

  const currentStepData =
    activeStepTime !== null
      ? stepStates.find((s) => s.step === activeStepTime)
      : stepStates[totalSteps - 1];

  const currentStepIdx = activeStepTime !== null ? activeStepTime : totalSteps - 1;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-2.5 flex items-center justify-between z-20 shrink-0">
      {/* Left: Indicator & Description */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-100">Quantum Time-Travel Debugger</span>
              {activeStepTime !== null ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span>Time-Slice t = {currentStepIdx}</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <Radio className="w-2.5 h-2.5" />
                  <span>Final State (Live)</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-md">
              {currentStepData?.description || 'Scrub through gate timeline to inspect state evolution'}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Timeline Scrubber Slider */}
      <div className="flex-1 max-w-md mx-6 flex items-center space-x-3">
        <span className="text-[10px] font-mono text-slate-500">t=0 (Init)</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIdx}
          onChange={(e) => {
            setIsPlayingTimeTravel(false);
            setActiveStepTime(parseInt(e.target.value, 10));
          }}
          className="flex-1 accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
        <span className="text-[10px] font-mono text-slate-500">t={totalSteps - 1} (End)</span>
      </div>

      {/* Right: Debugger Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={stepBackward}
          disabled={currentStepIdx <= 0}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 border border-slate-700 transition-colors"
          title="Step Backward (Prev Gate)"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            if (currentStepIdx >= totalSteps - 1 && !isPlayingTimeTravel) {
              setActiveStepTime(0);
            }
            setIsPlayingTimeTravel(!isPlayingTimeTravel);
          }}
          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all"
        >
          {isPlayingTimeTravel ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Step-Play</span>
            </>
          )}
        </button>

        <button
          onClick={stepForward}
          disabled={currentStepIdx >= totalSteps - 1}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 border border-slate-700 transition-colors"
          title="Step Forward (Next Gate)"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {activeStepTime !== null && (
          <button
            onClick={() => {
              setIsPlayingTimeTravel(false);
              setActiveStepTime(null);
            }}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 flex items-center space-x-1 ml-2 transition-colors"
            title="Reset to Full/Final Circuit Execution"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>Reset Live</span>
          </button>
        )}
      </div>
    </div>
  );
};
