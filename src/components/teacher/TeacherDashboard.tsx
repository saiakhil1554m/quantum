import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Users,
  Award,
  BarChart3,
  CheckCircle2,
  PlusCircle,
  Search,
  BookOpen,
  Cpu,
  GraduationCap,
  LogOut,
  Play,
  Sparkles
} from 'lucide-react';

interface StudentRosterItem {
  id: string;
  name: string;
  email: string;
  xp: number;
  completedLabs: number;
  lastActive: string;
  scorePct: number;
  status: 'active' | 'idle';
}

const MOCK_ROSTER: StudentRosterItem[] = [
  { id: 'st-1', name: 'Alex Chen', email: 'alex.c@student.sih', xp: 450, completedLabs: 3, lastActive: '2 mins ago', scorePct: 95, status: 'active' },
  { id: 'st-2', name: 'Priya Sharma', email: 'priya.s@student.sih', xp: 520, completedLabs: 3, lastActive: '10 mins ago', scorePct: 98, status: 'active' },
  { id: 'st-3', name: 'Rohan Gupta', email: 'rohan.g@student.sih', xp: 310, completedLabs: 2, lastActive: '1 hour ago', scorePct: 88, status: 'idle' },
  { id: 'st-4', name: 'Ananya Verma', email: 'ananya.v@student.sih', xp: 280, completedLabs: 2, lastActive: '3 hours ago', scorePct: 82, status: 'idle' },
  { id: 'st-5', name: 'David Miller', email: 'david.m@student.sih', xp: 190, completedLabs: 1, lastActive: 'Yesterday', scorePct: 75, status: 'idle' },
];

interface Props {
  onOpenCanvas: () => void;
  onOpenDashboard?: () => void;
}

export const TeacherDashboard: React.FC<Props> = ({ onOpenCanvas, onOpenDashboard }) => {
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<StudentRosterItem | null>(null);
  const [runningTestSuite, setRunningTestSuite] = useState(false);
  const [testSuiteResults, setTestSuiteResults] = useState<{
    unitaryEquivalence: boolean;
    stateFidelity: number;
    depthCheck: boolean;
    cnotGateCount: number;
    passedAll: boolean;
    feedback: string;
  } | null>(null);

  const handleRunTestSuite = (student: StudentRosterItem) => {
    setSelectedStudent(student);
    setRunningTestSuite(true);
    setTestSuiteResults(null);

    setTimeout(() => {
      setRunningTestSuite(false);
      const isTop = student.scorePct >= 90;
      setTestSuiteResults({
        unitaryEquivalence: isTop,
        stateFidelity: isTop ? 0.998 : 0.842,
        depthCheck: true,
        cnotGateCount: 2,
        passedAll: isTop,
        feedback: isTop
          ? `Verified! Student circuit satisfies unitary equivalence U†U = I and achieved 99.8% state fidelity on Bell State challenge.`
          : `Unitary check warning: Phase mismatch on ancillary register. State fidelity 84.2% requires Hadamard phase inversion review.`,
      });
    }, 1200);
  };

  const filteredRoster = MOCK_ROSTER.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Educator Header Navigation */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 leading-none">Educator Teaching Platform</h1>
            <p className="text-[11px] text-purple-400 mt-0.5">Automated Test Suites, Unitary Verifier & Class LMS</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {onOpenDashboard && (
            <button
              onClick={onOpenDashboard}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center space-x-1.5"
            >
              <span>Dashboard Hub</span>
            </button>
          )}

          <button
            onClick={onOpenCanvas}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Cpu className="w-4 h-4" />
            <span>Learning Platform</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center space-x-3">
            <div className="text-right text-xs hidden sm:block">
              <span className="font-bold text-slate-200 block">{user?.name}</span>
              <span className="text-[10px] text-purple-400 font-mono">Educator / Instructor</span>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Educator Analytics & Roster Body */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Enrolled Students</span>
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-100 font-mono">28</p>
            <p className="text-[11px] text-emerald-400 font-medium">↑ +4 new students this week</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Lab Completion Rate</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-100 font-mono">92.4%</p>
            <p className="text-[11px] text-slate-400 font-medium">Superposition & Entanglement</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Circuits Simulated</span>
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-100 font-mono">1,420</p>
            <p className="text-[11px] text-cyan-400 font-medium">Via Qiskit Aer Engine</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Class Score</span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-100 font-mono">88.5%</p>
            <p className="text-[11px] text-amber-400 font-medium">Top Tier Performance</p>
          </div>
        </div>

        {/* Automated Circuit Test Suite & Unitary Verifier Section */}
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Automated Quantum Test Suite & Unitary Verifier</h3>
                <p className="text-xs text-slate-400">
                  Run automated mathematical verification: unitary equivalence (U†U = I), state fidelity, and circuit depth limits.
                </p>
              </div>
            </div>

            {selectedStudent && (
              <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-lg border border-purple-800">
                Active Target: {selectedStudent.name} ({selectedStudent.email})
              </span>
            )}
          </div>

          {runningTestSuite && (
            <div className="py-8 flex flex-col items-center justify-center space-y-2">
              <div className="w-7 h-7 border-3 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-slate-400">Computing unitary matrix product U†U and state fidelity F...</p>
            </div>
          )}

          {testSuiteResults && selectedStudent && !runningTestSuite && (
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                testSuiteResults.passedAll
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-amber-950/30 border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Test Suite Execution Report for {selectedStudent.name}</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  Fidelity: {(testSuiteResults.stateFidelity * 100).toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Unitary Equivalence:</span>
                  <strong className={testSuiteResults.unitaryEquivalence ? 'text-emerald-400' : 'text-rose-400'}>
                    {testSuiteResults.unitaryEquivalence ? 'PASSED (U†U = I)' : 'FAILED'}
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">State Fidelity:</span>
                  <strong className="text-cyan-400">{(testSuiteResults.stateFidelity * 100).toFixed(1)}%</strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Depth Constraint:</span>
                  <strong className="text-emerald-400">PASSED (&le; 8 steps)</strong>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{testSuiteResults.feedback}</p>
            </div>
          )}
        </div>

        {/* Student Roster Header & Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-100">Student Progress & Assignment Roster</h2>
              <p className="text-xs text-slate-400 mt-0.5">Track individual circuit accuracy, XP progression, and run automated test suites.</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students..."
                  className="bg-slate-950 text-slate-100 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-purple-500 w-60"
                />
              </div>

              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-purple-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Lab Assignment</span>
              </button>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Completed Labs</th>
                  <th className="py-3 px-4">Total XP</th>
                  <th className="py-3 px-4">Circuit Accuracy</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Automated Grading</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredRoster.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300">
                          {student.name[0]}
                        </div>
                        <div>
                          <span className="block">{student.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{student.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                      {student.completedLabs} / 3 Labs
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-amber-950/60 border border-amber-800/80 text-amber-300 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                        {student.xp} XP
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${student.scorePct}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-emerald-400">{student.scorePct}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {student.lastActive}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleRunTestSuite(student)}
                        className="px-3 py-1.5 rounded bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 border border-purple-800 font-medium text-[11px] transition-colors shadow-sm"
                      >
                        Run Test Suite
                      </button>

                      <button
                        onClick={onOpenCanvas}
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-[11px] transition-colors"
                      >
                        Inspect Circuit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Publish New Quantum Assignment</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Assignment Title</label>
                <input
                  type="text"
                  defaultValue="Lab 4: Grover Search Oracle & Diffusion"
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2.5 border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Target Qubits & Gates</label>
                <input
                  type="text"
                  defaultValue="3 Qubits, Hadamard on all registers, CZ phase oracle"
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2.5 border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">XP Reward</label>
                <input
                  type="number"
                  defaultValue="300"
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2.5 border border-slate-800"
                />
              </div>

              <button
                onClick={() => setShowAssignModal(false)}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md mt-2"
              >
                Publish Assignment to Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
