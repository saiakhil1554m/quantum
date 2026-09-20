import React, { useEffect, useState } from 'react';
import { fetchIndexedDocs, ingestCustomDocument, RagDocItem } from '../../services/tutorApi';
import { Database, PlusCircle, BookOpen, CheckCircle2, Sparkles, X, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RagTrainerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [docs, setDocs] = useState<RagDocItem[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadDocs = () => {
    fetchIndexedDocs().then((data) => setDocs(data));
  };

  useEffect(() => {
    if (isOpen) {
      loadDocs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsIngesting(true);
    const success = await ingestCustomDocument(title, content);
    setIsIngesting(false);

    if (success) {
      setSuccessMsg(`Successfully trained RAG model with '${title}'!`);
      setTitle('');
      setContent('');
      loadDocs();
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">RAG AI Tutor Knowledge Base Trainer</h2>
              <p className="text-xs text-slate-400 mt-0.5">Ingest custom quantum notes, LaTeX equations & tutorials into vector DB</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-bold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden">
          {/* Left Form: Ingest New Custom Doc */}
          <form onSubmit={handleIngest} className="space-y-4 flex flex-col h-full">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Quantum Phase Estimation & Shor's Algorithm"
                className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2.5 border border-slate-800 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Content / Notes / LaTeX Text
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste LaTeX equations, Qiskit code explanations, or lecture notes here..."
                className="flex-1 w-full bg-slate-950 text-slate-100 font-mono text-xs rounded-lg p-2.5 border border-slate-800 focus:outline-none focus:border-purple-500 resize-none min-h-[140px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isIngesting || !title.trim() || !content.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2 disabled:opacity-40 transition-all shrink-0"
            >
              {isIngesting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Ingesting Chunks into Vector DB...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Train RAG Vector Store</span>
                </>
              )}
            </button>
          </form>

          {/* Right List: Currently Indexed RAG Documents */}
          <div className="flex flex-col h-full min-h-0 bg-slate-950/60 rounded-xl border border-slate-800 p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Active Indexed Documents ({docs.length})</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-[11px] truncate">{doc.title}</span>
                    {doc.custom ? (
                      <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800 font-mono">
                        User Trained
                      </span>
                    ) : (
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                        Core RAG
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono line-clamp-2">{doc.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
