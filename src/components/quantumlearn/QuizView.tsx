import React, { useState } from 'react';
import { ChevronLeft, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

export const QuizView: React.FC<Props> = ({ onBack, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>('C');

  return (
    <div className="flex-1 bg-[#0b0d19] text-slate-100 p-4 space-y-4 overflow-y-auto pb-20 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Lesson Quiz</span>
        </button>

        <button onClick={onBack} className="text-slate-400 hover:text-slate-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-[#1a1e36] rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full w-[40%]" />
        </div>
        <div className="text-[10px] text-right font-mono text-slate-400">2/5</div>
      </div>

      {/* Question Card */}
      <div className="p-4 rounded-2xl bg-[#121526] border border-[#1e2238] space-y-3 shadow-lg">
        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
          Question 2
        </span>
        <h2 className="text-xs font-bold text-slate-100 leading-relaxed">
          What is the result of measuring a qubit in the state 1/√2 (|0⟩ + |1⟩) in the computational basis?
        </h2>
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-2.5">
        {[
          { key: 'A', text: 'Always 0' },
          { key: 'B', text: 'Always 1' },
          { key: 'C', text: '0 or 1 with equal probability' },
          { key: 'D', text: 'It cannot be measured' },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSelectedOption(opt.key as any)}
            className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center space-x-3 transition-all active:scale-[0.99] ${
              selectedOption === opt.key
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-600/10'
                : 'bg-[#121526] hover:bg-[#181c33] border-[#1e2238] text-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                selectedOption === opt.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#1a1e36] text-slate-400'
              }`}
            >
              {opt.key}
            </div>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>

      {/* Feedback Card */}
      {selectedOption === 'C' && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 space-y-1.5 shadow-lg animate-in fade-in-50">
          <div className="flex items-center space-x-2 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Correct!</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            A qubit in an equal superposition has a 50% chance of being measured as 0 and a 50% chance of being measured as 1.
          </p>
        </div>
      )}

      {/* Next Question Button */}
      <button
        onClick={onNext}
        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] touch-manipulation pt-2"
      >
        <span>Next Question</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
