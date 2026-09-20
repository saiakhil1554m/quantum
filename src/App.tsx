import React, { useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { SplashOnboarding } from './components/quantumlearn/SplashOnboarding';
import { MobileDashboard } from './components/quantumlearn/MobileDashboard';
import { LearnModules } from './components/quantumlearn/LearnModules';
import { LessonView } from './components/quantumlearn/LessonView';
import { QuantumPlayground } from './components/quantumlearn/QuantumPlayground';
import { SimulationResults } from './components/quantumlearn/SimulationResults';
import { QuizView } from './components/quantumlearn/QuizView';
import { AiTutorView } from './components/quantumlearn/AiTutorView';
import { QuantumLearnBottomNav } from './components/quantumlearn/QuantumLearnBottomNav';

import { CircuitToolbar } from './components/quantum/CircuitToolbar';
import { GatePalette } from './components/quantum/GatePalette';
import { CircuitCanvas } from './components/quantum/CircuitCanvas';
import { CodeEditorPanel } from './components/quantum/CodeEditorPanel';
import { TimeTravelDebugger } from './components/quantum/TimeTravelDebugger';
import { VisualizationPanel } from './components/visualization/VisualizationPanel';
import { AiTutorPanel } from './components/tutor/AiTutorPanel';

type MobileScreen = 'splash' | 'home' | 'learn' | 'lesson' | 'playground' | 'results' | 'quiz' | 'tutor';

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>('splash');
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [isTimeTravelOpen, setIsTimeTravelOpen] = useState(true);

  // 1. Unauthenticated or Splash Screen -> Render Onboarding Splash
  if (!isAuthenticated || currentScreen === 'splash') {
    return (
      <SplashOnboarding
        onStart={() => setCurrentScreen('home')}
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0b0d19] text-slate-100 overflow-hidden font-sans relative flex flex-col">
      {/* Desktop View Layout (md:flex) */}
      <div className="hidden md:flex flex-col h-full w-full">
        <CircuitToolbar
          onToggleCodeEditor={() => setIsCodeEditorOpen((prev) => !prev)}
          isCodeEditorOpen={isCodeEditorOpen}
          onToggleTimeTravel={() => setIsTimeTravelOpen((prev) => !prev)}
          isTimeTravelOpen={isTimeTravelOpen}
        />

        {isTimeTravelOpen && <TimeTravelDebugger />}

        <div className="flex-1 flex min-h-0 relative">
          <GatePalette />
          <CircuitCanvas />
          <CodeEditorPanel
            isOpen={isCodeEditorOpen}
            onClose={() => setIsCodeEditorOpen(false)}
          />
        </div>

        <VisualizationPanel />
        <AiTutorPanel />
      </div>

      {/* Mobile View Layout (< md) matching QuantumLearn Image Screens */}
      <div className="flex md:hidden flex-1 flex-col h-full w-full overflow-hidden relative">
        {currentScreen === 'home' && (
          <MobileDashboard onNavigate={(screen) => setCurrentScreen(screen as MobileScreen)} />
        )}

        {currentScreen === 'learn' && (
          <LearnModules onSelectLesson={() => setCurrentScreen('lesson')} />
        )}

        {currentScreen === 'lesson' && (
          <LessonView
            onBack={() => setCurrentScreen('learn')}
            onNext={() => setCurrentScreen('quiz')}
          />
        )}

        {currentScreen === 'playground' && (
          <QuantumPlayground onRunSimulation={() => setCurrentScreen('results')} />
        )}

        {currentScreen === 'results' && (
          <SimulationResults
            onBack={() => setCurrentScreen('playground')}
            onRunAgain={() => setCurrentScreen('playground')}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizView
            onBack={() => setCurrentScreen('learn')}
            onNext={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'tutor' && (
          <AiTutorView onBack={() => setCurrentScreen('home')} />
        )}

        {/* Mobile Bottom Navigation Bar (Shown on main mobile tabs) */}
        {['home', 'learn', 'playground', 'tutor'].includes(currentScreen) && (
          <QuantumLearnBottomNav
            activeTab={currentScreen as any}
            onTabChange={(tab) => setCurrentScreen(tab as MobileScreen)}
          />
        )}
      </div>
    </div>
  );
}

