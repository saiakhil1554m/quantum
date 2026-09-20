import React, { useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './components/auth/LoginPage';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { CircuitToolbar } from './components/quantum/CircuitToolbar';
import { GatePalette } from './components/quantum/GatePalette';
import { CircuitCanvas } from './components/quantum/CircuitCanvas';
import { CodeEditorPanel } from './components/quantum/CodeEditorPanel';
import { TimeTravelDebugger } from './components/quantum/TimeTravelDebugger';
import { VisualizationPanel } from './components/visualization/VisualizationPanel';
import { AiTutorPanel } from './components/tutor/AiTutorPanel';

export default function App() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTeacherView, setActiveTeacherView] = useState<'dashboard' | 'canvas'>('dashboard');
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [isTimeTravelOpen, setIsTimeTravelOpen] = useState(true);

  // 1. If not logged in, show Login / Register page
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // 2. If logged in as Teacher/Educator and currently viewing Teacher Dashboard
  if (user.role === 'teacher' && activeTeacherView === 'dashboard') {
    return <TeacherDashboard onOpenCanvas={() => setActiveTeacherView('canvas')} />;
  }

  // 3. Render Quantum Circuit Workspace (for Students, or Teachers in Canvas view)
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      {/* Top Navigation & Controls Toolbar */}
      <CircuitToolbar
        onOpenTeacherDashboard={
          user.role === 'teacher' ? () => setActiveTeacherView('dashboard') : undefined
        }
        onToggleCodeEditor={() => setIsCodeEditorOpen((prev) => !prev)}
        isCodeEditorOpen={isCodeEditorOpen}
        onToggleTimeTravel={() => setIsTimeTravelOpen((prev) => !prev)}
        isTimeTravelOpen={isTimeTravelOpen}
      />

      {/* Quantum Time-Travel Debugger (Gate-by-Gate State Stepper Bar) */}
      {isTimeTravelOpen && <TimeTravelDebugger />}

      {/* Main Drag & Drop Workspace with Bi-directional Code Editor Dock */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex-1 flex min-h-0 relative">
          {/* Left Gate Palette Sidebar */}
          <GatePalette />

          {/* Center Quantum Circuit Canvas (React Flow) */}
          <CircuitCanvas />

          {/* Right Synchronized Code Editor Panel (OpenQASM 3.0 & Qiskit) */}
          <CodeEditorPanel
            isOpen={isCodeEditorOpen}
            onClose={() => setIsCodeEditorOpen(false)}
          />
        </div>

        {/* Bottom Multi-Qubit Visualization Suite (Q-Sphere, Bloch, Density Matrix, Histogram) */}
        <VisualizationPanel />
      </div>

      {/* Floating RAG Socratic AI Tutor Drawer */}
      <AiTutorPanel />
    </div>
  );
}
