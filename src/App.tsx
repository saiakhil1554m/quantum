import React, { useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './components/auth/LoginPage';
import { UnifiedDashboard } from './components/dashboard/UnifiedDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { CircuitToolbar } from './components/quantum/CircuitToolbar';
import { GatePalette } from './components/quantum/GatePalette';
import { CircuitCanvas } from './components/quantum/CircuitCanvas';
import { CodeEditorPanel } from './components/quantum/CodeEditorPanel';
import { TimeTravelDebugger } from './components/quantum/TimeTravelDebugger';
import { VisualizationPanel } from './components/visualization/VisualizationPanel';
import { AiTutorPanel } from './components/tutor/AiTutorPanel';
import { Cpu, Layers, Activity, Code2 } from 'lucide-react';

export default function App() {
  const { isAuthenticated, user } = useAuthStore();
  const [mainView, setMainView] = useState<'dashboard' | 'learning' | 'teaching'>('dashboard');
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [isTimeTravelOpen, setIsTimeTravelOpen] = useState(true);

  // Mobile active tab view ('circuit' | 'gates' | 'visuals' | 'code')
  const [mobileTab, setMobileTab] = useState<'circuit' | 'gates' | 'visuals' | 'code'>('circuit');

  // 1. First Screen: Always open Login Page if unauthenticated
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // 2. Main Hub: Unified Dashboard presenting Learning & Teaching Platforms
  if (mainView === 'dashboard') {
    return (
      <UnifiedDashboard
        onOpenLearningPlatform={() => setMobileTab('circuit') || setMainView('learning')}
        onOpenTeachingPlatform={() => setMainView('teaching')}
      />
    );
  }

  // 3. Educator Teaching Platform View
  if (mainView === 'teaching') {
    return (
      <TeacherDashboard
        onOpenCanvas={() => setMainView('learning')}
        onOpenDashboard={() => setMainView('dashboard')}
      />
    );
  }

  // 4. Student Quantum Learning Platform View (Circuit Builder, Visualizer, Code Editor, AI Tutor)
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      {/* Top Navigation & Controls Toolbar */}
      <CircuitToolbar
        onOpenDashboard={() => setMainView('dashboard')}
        onOpenTeacherDashboard={() => setMainView('teaching')}
        onToggleCodeEditor={() => {
          setIsCodeEditorOpen((prev) => !prev);
          setMobileTab('code');
        }}
        isCodeEditorOpen={isCodeEditorOpen}
        onToggleTimeTravel={() => setIsTimeTravelOpen((prev) => !prev)}
        isTimeTravelOpen={isTimeTravelOpen}
      />

      {/* Quantum Time-Travel Debugger */}
      {isTimeTravelOpen && <TimeTravelDebugger />}

      {/* Desktop Multi-Panel Layout (md:flex) */}
      <div className="hidden md:flex flex-1 flex-col min-h-0 relative">
        <div className="flex-1 flex min-h-0 relative">
          <GatePalette />
          <CircuitCanvas />
          <CodeEditorPanel
            isOpen={isCodeEditorOpen}
            onClose={() => setIsCodeEditorOpen(false)}
          />
        </div>
        <VisualizationPanel />
      </div>

      {/* Mobile Tabbed Content View (< md) */}
      <div className="flex md:hidden flex-1 flex-col min-h-0 relative pb-14 overflow-hidden">
        {mobileTab === 'circuit' && (
          <div className="flex-1 h-full relative">
            <CircuitCanvas />
          </div>
        )}

        {mobileTab === 'gates' && (
          <div className="flex-1 h-full overflow-y-auto">
            <GatePalette />
          </div>
        )}

        {mobileTab === 'visuals' && (
          <div className="flex-1 h-full overflow-y-auto">
            <VisualizationPanel isMobileView={true} />
          </div>
        )}

        {mobileTab === 'code' && (
          <div className="flex-1 h-full relative">
            <CodeEditorPanel isOpen={true} onClose={() => setMobileTab('circuit')} />
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (< md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg flex items-center justify-around z-40 px-2 shadow-2xl">
        <button
          onClick={() => setMobileTab('circuit')}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-lg transition-all active:scale-95 touch-manipulation ${
            mobileTab === 'circuit' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <span className="text-[10px]">Circuit</span>
        </button>

        <button
          onClick={() => setMobileTab('gates')}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-lg transition-all active:scale-95 touch-manipulation ${
            mobileTab === 'gates' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px]">Gates</span>
        </button>

        <button
          onClick={() => setMobileTab('visuals')}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-lg transition-all active:scale-95 touch-manipulation ${
            mobileTab === 'visuals' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px]">Visuals</span>
        </button>

        <button
          onClick={() => setMobileTab('code')}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-lg transition-all active:scale-95 touch-manipulation ${
            mobileTab === 'code' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-5 h-5" />
          <span className="text-[10px]">Code</span>
        </button>
      </div>

      {/* Floating RAG Socratic AI Tutor Drawer */}
      <AiTutorPanel />
    </div>
  );
}

