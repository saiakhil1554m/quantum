import React, { useState } from 'react';
import { useQuantumStore } from '../../store/useQuantumStore';
import { askAiTutor, TutorChatResponse } from '../../services/tutorApi';
import { Bot, Send, Sparkles, X, BookOpen, MessageSquare, HelpCircle, Database } from 'lucide-react';
import { RagTrainerModal } from './RagTrainerModal';

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  docs?: string[];
  circuitSummary?: string;
}

export const AiTutorPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'msg-welcome',
      sender: 'tutor',
      text: "Hello! I'm your Socratic AI Quantum Tutor. Place gates on your circuit wire canvas, ask me questions about superposition, entanglement, or train me with your own custom lecture notes!",
    },
  ]);

  const { getCircuitPayload, executionResult } = useQuantumStore();

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || query;
    if (!promptText.trim() || loading) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessageItem = {
      id: userMsgId,
      sender: 'user',
      text: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setLoading(true);

    const circuit = getCircuitPayload();
    const result: TutorChatResponse = await askAiTutor(promptText, circuit, executionResult);

    const tutorMsg: ChatMessageItem = {
      id: `tut-${Date.now()}`,
      sender: 'tutor',
      text: result.response,
      docs: result.retrievedDocs,
      circuitSummary: result.circuitSummary,
    };

    setMessages((prev) => [...prev, tutorMsg]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-14 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-xl shadow-purple-500/30 flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span>Ask Socratic AI Tutor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[560px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 leading-none">RAG Quantum AI Tutor</h3>
                <p className="text-[10px] text-purple-400 mt-0.5">Socratic Context-Injected Guidance</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Train RAG Modal Button */}
              <button
                onClick={() => setShowTrainerModal(true)}
                className="px-2 py-1 rounded bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 text-[10px] font-bold flex items-center space-x-1 transition-all"
                title="Upload & Ingest Custom Docs to Train RAG AI"
              >
                <Database className="w-3 h-3 text-purple-400" />
                <span>Train RAG</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-slate-950/60 border-b border-slate-800 flex gap-1.5 overflow-x-auto text-[10px]">
            {[
              'Why 50% |00⟩ & 50% |11⟩?',
              'Explain Hadamard Gate',
              'What is Entanglement?',
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(preset)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-950/60 text-slate-300 hover:text-purple-300 border border-slate-700 hover:border-purple-700/50 whitespace-nowrap transition-all"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none space-y-2'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* RAG Context Badges */}
                  {msg.docs && msg.docs.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1">
                      <div className="flex items-center space-x-1 text-[10px] text-amber-400 font-semibold">
                        <BookOpen className="w-3 h-3" />
                        <span>RAG Knowledge Base Retrieved:</span>
                      </div>
                      {msg.docs.map((d, dIdx) => (
                        <div key={dIdx} className="text-[10px] text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-800 font-mono">
                          {d}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-48">
                <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] font-mono">Synthesizing Socratic answer...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about your quantum circuit..."
              className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !query.trim()}
              className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RAG Knowledge Base Trainer Modal */}
      <RagTrainerModal isOpen={showTrainerModal} onClose={() => setShowTrainerModal(false)} />
    </>
  );
};
