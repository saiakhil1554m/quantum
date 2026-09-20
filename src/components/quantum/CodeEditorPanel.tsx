import React, { useState, useEffect } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import {
  Code2,
  Copy,
  Check,
  Download,
  RefreshCw,
  X,
  FileCode,
  Terminal,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeEditorPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    generateQasm,
    generateQiskitPython,
    generateCirqPython,
    generatePennyLanePython,
    importFromQasm,
    gates,
    numQubits,
  } = useQuantumStore();

  const [activeLang, setActiveLang] = useState<'qasm' | 'qiskit' | 'cirq' | 'pennylane'>('qasm');
  const [editableCode, setEditableCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Sync editor content whenever gates or numQubits change
  useEffect(() => {
    if (activeLang === 'qasm') {
      setEditableCode(generateQasm());
    } else if (activeLang === 'qiskit') {
      setEditableCode(generateQiskitPython());
    } else if (activeLang === 'cirq') {
      setEditableCode(generateCirqPython());
    } else if (activeLang === 'pennylane') {
      setEditableCode(generatePennyLanePython());
    }
  }, [gates, numQubits, activeLang, generateQasm, generateQiskitPython, generateCirqPython, generatePennyLanePython]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeLang === 'qasm' ? 'qasm' : 'py';
    const filename =
      activeLang === 'qasm'
        ? 'circuit.qasm'
        : activeLang === 'qiskit'
        ? 'qiskit_circuit.py'
        : activeLang === 'cirq'
        ? 'cirq_circuit.py'
        : 'pennylane_circuit.py';

    const blob = new Blob([editableCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSyncToCanvas = () => {
    if (activeLang !== 'qasm') {
      setSyncStatus('Switch to OpenQASM 3.0 to sync code back to visual canvas.');
      setTimeout(() => setSyncStatus(null), 3000);
      return;
    }

    const success = importFromQasm(editableCode);
    if (success) {
      setSyncStatus('✓ Synchronized OpenQASM AST with Drag & Drop Canvas!');
      setTimeout(() => setSyncStatus(null), 3000);
    } else {
      setSyncStatus('✗ Parse error: Verify OpenQASM syntax (e.g., h q[0]; cx q[0], q[1];)');
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  return (
    <div className="w-full md:w-[480px] lg:w-[520px] h-full bg-slate-900 border-l border-slate-800 flex flex-col z-30 shrink-0 shadow-2xl font-sans relative">
      {/* Header */}
      <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Multi-SDK Synchronized Code Editor
          </h3>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Language Switcher & Actions Bar */}
      <div className="p-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-1 shrink-0 overflow-x-auto">
        <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
          <button
            onClick={() => setActiveLang('qasm')}
            className={`px-2 py-1 rounded transition-colors flex items-center space-x-1 ${
              activeLang === 'qasm'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>OpenQASM 3.0</span>
          </button>
          <button
            onClick={() => setActiveLang('qiskit')}
            className={`px-2 py-1 rounded transition-colors flex items-center space-x-1 ${
              activeLang === 'qiskit'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Qiskit</span>
          </button>
          <button
            onClick={() => setActiveLang('cirq')}
            className={`px-2 py-1 rounded transition-colors flex items-center space-x-1 ${
              activeLang === 'cirq'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Cirq</span>
          </button>
          <button
            onClick={() => setActiveLang('pennylane')}
            className={`px-2 py-1 rounded transition-colors flex items-center space-x-1 ${
              activeLang === 'pennylane'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>PennyLane</span>
          </button>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Download Script"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Textarea with line numbers */}
      <div className="flex-1 relative flex min-h-0 bg-slate-950 font-mono text-xs">
        <textarea
          value={editableCode}
          onChange={(e) => setEditableCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-cyan-300 focus:outline-none resize-none leading-relaxed selection:bg-purple-900/60 font-mono text-[11px]"
          placeholder="// Type or edit OpenQASM 3.0 code..."
        />
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div
          className={`px-4 py-1.5 text-[11px] font-mono border-t ${
            syncStatus.startsWith('✓')
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : syncStatus.startsWith('✗')
              ? 'bg-rose-950/80 text-rose-300 border-rose-800'
              : 'bg-amber-950/80 text-amber-300 border-amber-800'
          }`}
        >
          {syncStatus}
        </div>
      )}

      {/* Footer Sync Button */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
        <span className="text-[10px] text-slate-500 font-mono">
          {activeLang === 'qasm' ? 'Edit code & click Sync' : 'Read-only Python script'}
        </span>

        {activeLang === 'qasm' && (
          <button
            onClick={handleSyncToCanvas}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync to Canvas</span>
          </button>
        )}
      </div>
    </div>
  );
};
