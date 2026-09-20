import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, MessageSquare, ChevronLeft, Brain, Plus, CheckCircle, BookOpen, X } from 'lucide-react';
import { askAiTutor, TutorChatResponse, ingestCustomDocument, getStoredCustomDocs, RagDocItem } from '../../services/tutorApi';
import { useQuantumStore } from '../../store/useQuantumStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
}

interface Props {
  onBack: () => void;
}

export const AiTutorView: React.FC<Props> = ({ onBack }) => {
  const { getCircuitPayload, executionResult } = useQuantumStore();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTrainer, setShowTrainer] = useState(false);
  
  // Training form state
  const [trainTitle, setTrainTitle] = useState('');
  const [trainContent, setTrainContent] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [trainSuccess, setTrainSuccess] = useState('');
  const [customDocs, setCustomDocs] = useState<RagDocItem[]>([]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: "Hello! I'm your Socratic AI Quantum Tutor. Ask me any question about superposition, Hadamard gates, or train me with your custom lecture notes!",
    },
  ]);

  useEffect(() => {
    setCustomDocs(getStoredCustomDocs());
  }, []);

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || query;
    if (!promptText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setLoading(true);

    const circuit = getCircuitPayload();
    const result: TutorChatResponse = await askAiTutor(promptText, circuit, executionResult);

    const tutorMsg: ChatMessage = {
      id: `tut-${Date.now()}`,
      sender: 'tutor',
      text: result.response,
    };

    setMessages((prev) => [...prev, tutorMsg]);
    setLoading(false);
  };

  const handleTrainModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainTitle.trim() || !trainContent.trim() || isTraining) return;

    setIsTraining(true);
    setTrainSuccess('');

    await ingestCustomDocument(trainTitle, trainContent);
    const updatedDocs = getStoredCustomDocs();
    setCustomDocs(updatedDocs);

    setIsTraining(false);
    setTrainSuccess(`Successfully trained AI Model on "${trainTitle}"!`);
    
    // Add dynamic feedback in chat
    setMessages((prev) => [
      ...prev,
      {
        id: `trained-${Date.now()}`,
        sender: 'tutor',
        text: `🎓 I've ingested your new lecture notes on "${trainTitle}"! Ask me questions about it now!`,
      },
    ]);

    setTrainTitle('');
    setTrainContent('');

    setTimeout(() => {
      setTrainSuccess('');
      setShowTrainer(false);
    }, 1800);
  };

  return (
    <div className="flex-1 bg-[#0b0d19] text-slate-100 flex flex-col h-full overflow-hidden font-sans pb-16">
      {/* Top Header */}
      <div className="px-4 py-3 bg-[#0d0f22] border-b border-[#1e2238] flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>AI Tutor</span>
        </button>

        <button
          onClick={() => setShowTrainer(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-semibold shadow-md shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Train AI Model</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* 3D AI Robot Avatar Hero */}
        <div className="text-center py-3 space-y-2">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 blur-xl opacity-60 animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-purple-600/40 relative z-10">
              <div className="w-full h-full bg-[#0d1024] rounded-[14px] flex items-center justify-center text-purple-300">
                <Bot className="w-9 h-9" />
              </div>
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-100">Ask your quantum questions</h2>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Get clear explanations, hints, and custom RAG trained responses.
          </p>

          {/* Quick train badge if custom docs exist */}
          {customDocs.length > 0 && (
            <div className="pt-1 flex items-center justify-center space-x-1.5 text-[10px] text-purple-300">
              <BookOpen className="w-3 h-3 text-purple-400" />
              <span>{customDocs.length} Custom Trained Topic{customDocs.length > 1 ? 's' : ''} Active</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 1 && (
          <div className="space-y-2 pt-1">
            {[
              'Why does the Hadamard gate create superposition?',
              'Explain my current circuit',
              'What is entanglement?',
              ...(customDocs.length > 0
                ? [`Tell me about ${customDocs[0].title}`]
                : ['Help me with this quiz question']),
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(preset)}
                className="w-full p-3 rounded-2xl bg-[#121526] hover:bg-[#181c33] border border-[#1e2238] text-left text-xs text-slate-300 hover:text-indigo-300 flex items-center space-x-2.5 transition-all active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{preset}</span>
              </button>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                  : 'bg-[#121526] border border-[#1e2238] text-slate-200 rounded-bl-none whitespace-pre-wrap'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 bg-[#121526] p-3 rounded-2xl border border-[#1e2238] w-48 text-xs">
            <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-[11px]">Socratic AI thinking...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#0d0f22] border-t border-[#1e2238] flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 bg-[#121526] text-slate-100 placeholder-slate-500 text-xs px-4 py-3 rounded-full border border-[#1e2238] focus:outline-none focus:border-indigo-500 font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !query.trim()}
          className="p-3 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Train AI Model Modal */}
      {showTrainer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d0f22] border border-[#1e2238] rounded-3xl p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2238] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Train AI Tutor Model</h3>
                  <p className="text-[10px] text-slate-400">Add custom lecture notes or Q&A pairs to RAG memory</p>
                </div>
              </div>
              <button
                onClick={() => setShowTrainer(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {trainSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-400 text-xs">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{trainSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleTrainModel} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Topic / Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={trainTitle}
                    onChange={(e) => setTrainTitle(e.target.value)}
                    placeholder="e.g. Shor's Algorithm Notes"
                    className="w-full bg-[#121526] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-[#1e2238] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Knowledge Content / Explanation
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={trainContent}
                    onChange={(e) => setTrainContent(e.target.value)}
                    placeholder="Paste lecture content, formulas, or Q&A pairs to teach the AI Tutor..."
                    className="w-full bg-[#121526] text-slate-100 text-xs p-3 rounded-xl border border-[#1e2238] focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowTrainer(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTraining || !trainTitle.trim() || !trainContent.trim()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 flex items-center space-x-1.5"
                  >
                    {isTraining ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Training...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Train Model</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* List of custom trained topics */}
            {customDocs.length > 0 && (
              <div className="pt-2 border-t border-[#1e2238]">
                <h4 className="text-[11px] font-bold text-slate-300 mb-2 flex items-center space-x-1">
                  <BookOpen className="w-3 h-3 text-purple-400" />
                  <span>Currently Trained Custom Topics ({customDocs.length})</span>
                </h4>
                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                  {customDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2 bg-[#121526] border border-[#1e2238] rounded-xl text-[11px] flex items-center justify-between"
                    >
                      <span className="font-semibold text-purple-300 truncate max-w-[200px]">
                        {doc.title}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

