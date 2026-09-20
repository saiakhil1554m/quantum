import React from 'react';
import { Home, BookOpen, Cpu, Bot } from 'lucide-react';

interface Props {
  activeTab: 'home' | 'learn' | 'playground' | 'tutor';
  onTabChange: (tab: 'home' | 'learn' | 'playground' | 'tutor') => void;
}

export const QuantumLearnBottomNav: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0c0e1c]/95 border-t border-[#1e2238] backdrop-blur-xl flex items-center justify-around z-50 px-3 shadow-2xl">
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all active:scale-95 touch-manipulation ${
          activeTab === 'home'
            ? 'text-indigo-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => onTabChange('learn')}
        className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all active:scale-95 touch-manipulation ${
          activeTab === 'learn'
            ? 'text-indigo-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BookOpen className={`w-5 h-5 ${activeTab === 'learn' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10px]">Learn</span>
      </button>

      <button
        onClick={() => onTabChange('playground')}
        className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all active:scale-95 touch-manipulation ${
          activeTab === 'playground'
            ? 'text-indigo-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Cpu className={`w-5 h-5 ${activeTab === 'playground' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10px]">Playground</span>
      </button>

      <button
        onClick={() => onTabChange('tutor')}
        className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all active:scale-95 touch-manipulation ${
          activeTab === 'tutor'
            ? 'text-indigo-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Bot className={`w-5 h-5 ${activeTab === 'tutor' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10px]">Progress</span>
      </button>
    </div>
  );
};
